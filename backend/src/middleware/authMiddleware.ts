import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// extend Express Request to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

// blocks unauthenticated requests
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      req.user = await User.findById(decoded.id).select("-password") as IUser;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token provided" });
  }
};

// blocks requests from non-admin users — always use after `protect`
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
};

// allows guests through but attaches user if token exists
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      req.user = await User.findById(decoded.id).select("-password") as IUser;
    } catch (error) {
      // silent — guest continues
    }
  }
  next();
};