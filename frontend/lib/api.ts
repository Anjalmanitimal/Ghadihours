import axios from "axios";
import {
  IProduct,
  IReview,
  IOrder,
  IAuthResponse,
  ICreateOrderPayload,
  ICart,
  IAdminStats,
  ICustomer,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Product ──────────────────────────────────────────────────────────────────
export const fetchProduct = async (): Promise<IProduct> => {
  const res = await api.get("/products");
  return res.data.data;
};

// ── Reviews ──────────────────────────────────────────────────────────────────
export const fetchReviews = async (): Promise<IReview[]> => {
  const res = await api.get("/reviews");
  return res.data.data;
};

export const createReview = async (
  rating: number,
  useCase: "Fitness" | "Daily Use" | "Gift",
  text: string
): Promise<IReview> => {
  const res = await api.post("/reviews", { rating, useCase, text });
  return res.data.data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<IAuthResponse> => {
  const res = await api.post("/auth/register", { name, email, password, phone });
  return res.data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const guestLogin = async (
  email: string,
  name?: string
): Promise<IAuthResponse> => {
  const res = await api.post("/auth/guest", { email, name });
  return res.data;
};

export const getMe = async (): Promise<IAuthResponse> => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (
  name: string,
  phone?: string
): Promise<IAuthResponse> => {
  const res = await api.put("/auth/profile", { name, phone });
  return res.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.put("/auth/password", { currentPassword, newPassword });
  return res.data;
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const createOrder = async (
  payload: ICreateOrderPayload
): Promise<IOrder> => {
  const res = await api.post("/orders", payload);
  return res.data.data;
};

export const fetchOrderByNumber = async (
  orderNumber: string
): Promise<IOrder> => {
  const res = await api.get(`/orders/${orderNumber}`);
  return res.data.data;
};

export const fetchMyOrders = async (): Promise<IOrder[]> => {
  const res = await api.get("/orders/my-orders");
  return res.data.data;
};

// ── Cart ─────────────────────────────────────────────────────────────────────
export const fetchCart = async (): Promise<ICart> => {
  const res = await api.get("/cart");
  return res.data.data;
};

export const addToCart = async (
  caseColor: string,
  strapColor: string,
  size: string,
  quantity = 1
): Promise<ICart> => {
  const res = await api.post("/cart", { caseColor, strapColor, size, quantity });
  return res.data.data;
};

export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<ICart> => {
  const res = await api.put(`/cart/${itemId}`, { quantity });
  return res.data.data;
};

export const removeCartItem = async (itemId: string): Promise<ICart> => {
  const res = await api.delete(`/cart/${itemId}`);
  return res.data.data;
};

export const clearCart = async (): Promise<ICart> => {
  const res = await api.delete("/cart");
  return res.data.data;
};

// ── Admin ────────────────────────────────────────────────────────────────────
export const fetchAdminStats = async (): Promise<IAdminStats> => {
  const res = await api.get("/admin/stats");
  return res.data.data;
};

export const fetchAllOrders = async (): Promise<IOrder[]> => {
  const res = await api.get("/admin/orders");
  return res.data.data;
};

export const fetchAllCustomers = async (): Promise<ICustomer[]> => {
  const res = await api.get("/admin/customers");
  return res.data.data;
};

export const updateOrderStatus = async (
  orderNumber: string,
  orderStatus: string
): Promise<IOrder> => {
  const res = await api.put(`/orders/${orderNumber}/status`, { orderStatus });
  return res.data.data;
};

export const fetchAllReviews = async (): Promise<IReview[]> => {
  const res = await api.get("/admin/reviews");
  return res.data.data;
};

export const updateReview = async (
  id: string,
  changes: { status?: string; verifiedPurchase?: boolean }
): Promise<IReview> => {
  const res = await api.put(`/admin/reviews/${id}`, changes);
  return res.data.data;
};