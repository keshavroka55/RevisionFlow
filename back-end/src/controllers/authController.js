import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    // set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax",
      secure: false, // true in production
    });

    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
