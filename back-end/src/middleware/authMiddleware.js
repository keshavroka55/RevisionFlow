import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }
  next();
};


export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });
  res.json(user);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// authenticateed route to register admin users (only accessible by existing admins)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Force admin role
    const user = await registerUser({ 
      name, 
      email, 
      password, 
      role: "admin" 
    });

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(400).json({ message: err.message || "Admin registration failed" });
  }
};

// controller for Contineu with google login.
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    // Generate JWT token (same as regular login)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    );

    // Set cookie (same as regular login)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: config.NODE_ENV === "production", // set to true in production
    });

    // Smart redirect logic based on whether user is new or existing
    let redirectUrl;
    
    if (user.isNewUser) {
      // NEW USER: Redirect to role selection page
      redirectUrl = `${config.CLIENT_URL}/select-role`;
    } else {
      // EXISTING USER: Redirect directly based on their stored role
      redirectUrl = user.role === 'admin' || user.role === 'chef' 
        ? `${config.CLIENT_URL}/dashboard`
        : `${config.CLIENT_URL}/home`;
    }
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${config.CLIENT_URL}/login?error=auth_failed`);
  }
};

// New endpoint to update user role after Google login
export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    // Validate role
    if (!['food_lover', 'chef'].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // Update user role in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    // Generate new JWT token with updated role
    const newToken = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    );

    // Update cookie with new token
    res.cookie("token", newToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: config.NODE_ENV === "production",
    });

    res.json({
      user: updatedUser,
      message: "Role updated successfully"
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Send email async without waiting (non-blocking)
    requestPasswordReset(email).catch((err) => {
      console.error("Email send failed:", err);
    });

    // Return success immediately
    res.json({ message: "If email exists, reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const result = await resetPassword(token, password);
    res.json(result);
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ message: error.message });
  }
};
