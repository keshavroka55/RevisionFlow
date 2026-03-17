import * as UserService from "../services/user.service.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await UserService.getMyProfile(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      data: user 
    });
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to fetch profile" 
    });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      data: user 
    });
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to fetch user" 
    });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    // Validate input
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No data to update" 
      });
    }

    const user = await UserService.updateMyProfile(req.user.id, req.body);
    res.status(200).json({ 
      success: true,
      message: "Profile updated successfully",
      data: user 
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(400).json({ 
      success: false,
      message: err.message || "Failed to update profile" 
    });
  }
};

export const updateMyNotificationPreferences = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No notification data to update"
      });
    }

    const { reminderTimeHour, reminderTimeMinute } = req.body;
    if (reminderTimeHour !== undefined && (reminderTimeHour < 0 || reminderTimeHour > 23)) {
      return res.status(400).json({
        success: false,
        message: "reminderTimeHour must be 0-23"
      });
    }
    if (
      reminderTimeMinute !== undefined &&
      reminderTimeMinute !== 0 &&
      reminderTimeMinute !== 30
    ) {
      return res.status(400).json({
        success: false,
        message: "reminderTimeMinute must be 0 or 30"
      });
    }

    const prefs = await UserService.updateMyNotificationPreferences(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: prefs
    });
  } catch (err) {
    console.error("Update notification preferences error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update notification preferences"
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { skip = 0, take = 10 } = req.query;
    const users = await UserService.getAllUsers(
      parseInt(skip), 
      parseInt(take)
    );
    
    res.status(200).json({ 
      success: true,
      data: users 
    });
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to fetch users" 
    });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    res.status(200).json({ 
      success: true,
      message: "User deleted successfully",
      data: user 
    });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(400).json({ 
      success: false,
      message: err.message || "Failed to delete user" 
    });
  }
};