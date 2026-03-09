import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("REGISTER HIT");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await registerUser({ name, email, password });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    console.log("USER:", user);
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};


export const login = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const { user, token } = await loginUser({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false, // make true during produciton
      // true: the cookies is only send over HTTPs for security.
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ message: err.message || "Login failed" });
  }
};


export const getMe = async (req, res) => {
  res.json(req.user);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
