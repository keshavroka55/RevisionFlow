import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./passwordresetemail.service.js";

/**
 * Register a new user
 */
export const registerUser = async ({ name, email, password, role = "USER" }) => {
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  // Validate input
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      emailVerified: false,
      timezone: "UTC", // Default timezone
      notificationPrefs: {
        create: {
          emailRevisionReminders: true,
          emailStreakAlerts: true,
          reminderTimeHour: 9,
          reminderTimeMinute: 0,
          reminderTimezone: "UTC",
        },
      },
    },
  });

  console.log("✓ User registered successfully:", user.email);
  console.log("Registred User:", { id: user.id, name: user.name, email: user.email, role: user.role })

  return user;
};

/**
 * Login user with email and password
 */
export const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  // Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION || "30d" }
  );

  console.log("✓ User login successful:", user.email);
  return { user, token };
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Security: don't reveal if email exists
    return { message: "If email exists, reset link has been sent" };
  }

  // Generate reset token (plain token is sent to user, hashed token is stored)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

  // Keep only one active token per user and send email
  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    await tx.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedResetToken,
        expiresAt,
      },
    });
  });

  await sendPasswordResetEmail(user.email, resetToken);

  console.log("✓ Password reset token created for:", user.email);
  return { message: "If email exists, reset link has been sent" };
};

/**
 * Reset password with valid token
 */
export const resetPassword = async (token, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find valid reset token
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      expiresAt: { gte: new Date() }, // Not expired
      usedAt: null, // Not yet used
    },
  });

  if (!resetToken) throw new Error("Invalid or expired reset token");

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  // Update user password and mark token as used
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  console.log("✓ Password reset successful for user ID:", resetToken.userId);
  return { message: "Password reset successful" };
};





