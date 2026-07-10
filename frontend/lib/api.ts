import axios from "axios";
import {
  IProduct,
  IReview,
  IOrder,
  IAuthResponse,
  ICreateOrderPayload,
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