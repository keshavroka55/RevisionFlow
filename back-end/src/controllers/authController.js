import { registerUser, loginUser, requestPasswordReset, resetPassword } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const user = await registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    const statusCode = err.message.includes("already") ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Registration failed"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const { user, token } = await loginUser({ email, password });

    // Set cookie with secure options
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
      // secure: config.NODE_ENV === "production", 
      // make true during produciton
      // true: the cookies is only send over HTTPs for security.
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          timezone: user.timezone,
        },
        token,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({
      success: false,
      message: err.message || "Login failed"
    });
  }
};


export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data"
    });
  }
};


export const logout = (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    await requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: "If email exists, password reset link has been sent",
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to process password reset"
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword, password } = req.body;
    const passwordToSet = newPassword || password;

    if (!token || !passwordToSet) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required"
      });
    }

    const result = await resetPassword(token, passwordToSet);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error("Reset password error:", err.message);
    const statusCode = err.message.includes("expired") ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to reset password"
    });
  }
};



// Protected route to register admin users (only accessible by existing admins)
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
      role: "ADMIN"
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
      secure: true,
      // secure: config.NODE_ENV === "production", // set to true in production
    });

    // Smart redirect logic based on whether user is new or existing
    let redirectUrl;

    redirectUrl = user.role === 'USER'
      ? `${config.CLIENT_URL}/dashboard`
      : `${config.CLIENT_URL}/adminpage`;


    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${config.CLIENT_URL}/login?error=auth_failed`);
  }
};