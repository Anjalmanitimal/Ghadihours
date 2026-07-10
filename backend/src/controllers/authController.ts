import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// @desc  Register new user
// @route POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
        token: generateToken(user._id.toString()),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Guest checkout login
// @route POST /api/auth/guest
export const guestLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne({ email, isGuest: true });

    if (!user) {
      user = await User.create({
        name: name || "Guest",
        email,
        password: Math.random().toString(36).slice(-8),
        isGuest: true,
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGuest: true,
        token: generateToken(user._id.toString()),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Get current logged in user
// @route GET /api/auth/me
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Save watch configuration to user profile
// @route PUT /api/auth/save-config
export const saveConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { caseColor, strapColor, size } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { savedConfiguration: { caseColor, strapColor, size } },
      { new: true }
    ).select("-password");

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};