"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  fetchMyOrders,
  updateProfile,
  changePassword,
  fetchWishlist,
  addToCart,
  removeFromWishlist,
} from "@/lib/api";
import { IOrder, IWishlistItem } from "@/types";
import {
  Package,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Download,
  ShoppingBag,
  Trash2,
  Camera,
} from "lucide-react";
import { caseColors, strapColors } from "@/lib/productOptions";
import WatchVisual from "@/components/ui/WatchVisual";

const orderSteps = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);
  const [wishlist, setWishlist] = useState<IWishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setProfileForm({
      name: parsedUser.name || "",
      phone: parsedUser.phone || "",
    });

    fetchMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchWishlist()
      .then((w) => setWishlist(w.items))
      .catch(console.error)
      .finally(() => setWishlistLoading(false));
  }, [router]);

  const resizeImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Couldn't read file"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Couldn't load image"));
        img.onload = () => {
          const size = 200;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas not supported"));
            return;
          }
          // cover-crop to a square
          const scale = Math.max(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      const res = await updateProfile(
        user?.name || "",
        user?.phone || "",
        dataUrl
      );
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      alert("Couldn't update your photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      const updated = await removeFromWishlist(itemId);
      setWishlist(updated.items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = async (item: IWishlistItem) => {
    setMovingId(item._id);
    try {
      await addToCart(item.caseColor, item.strapColor, item.size, 1);
      window.dispatchEvent(new Event("cart:updated"));
      await removeFromWishlist(item._id);
      setWishlist((w) => w.filter((i) => i._id !== item._id));
      router.push("/cart");
    } catch (err) {
      console.error(err);
      alert("Couldn't move this to cart. Please try again.");
    } finally {
      setMovingId(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      setProfileMessage("Name can't be empty.");
      return;
    }
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const res = await updateProfile(profileForm.name.trim(), profileForm.phone.trim());
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileMessage("Details updated successfully.");
    } catch (err) {
      console.error(err);
      setProfileMessage("Couldn't update details. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current || !passwordForm.next) {
      setPasswordMessage({ text: "Fill in both password fields.", ok: false });
      return;
    }
    if (passwordForm.next.length < 6) {
      setPasswordMessage({
        text: "New password must be at least 6 characters.",
        ok: false,
      });
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMessage({ text: "New passwords don't match.", ok: false });
      return;
    }
    setChangingPassword(true);
    setPasswordMessage(null);
    try {
      await changePassword(passwordForm.current, passwordForm.next);
      setPasswordMessage({ text: "Password updated successfully.", ok: true });
      setPasswordForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : null;
      setPasswordMessage({
        text: message || "Couldn't update password. Please try again.",
        ok: false,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const downloadOrderHistory = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const rows = orders
      .map((order) => {
        const itemsSummary = order.items
          .map((item) => `${item.caseColor} · ${item.strapColor} · ${item.size} × ${item.quantity}`)
          .join("<br/>");
        return `
        <tr>
          <td>#${order.orderNumber}</td>
          <td>${formatDate(order.createdAt)}</td>
          <td>${itemsSummary}</td>
          <td>${order.orderStatus}</td>
          <td style="text-align:right">NPR ${order.pricing.total.toLocaleString()}</td>
        </tr>`;
      })
      .join("");

    const grandTotal = orders.reduce((sum, o) => sum + o.pricing.total, 0);

    win.document.write(`
      <html>
        <head>
          <title>GhadiHours — Order History</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            .muted { color: #6b7280; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: left; vertical-align: top; }
            tfoot td { font-weight: bold; border-top: 2px solid #111827; border-bottom: none; }
          </style>
        </head>
        <body>
          <h1>GhadiHours</h1>
          <p class="muted">Order history for ${user?.name} · ${user?.email}</p>
          <p class="muted">Generated ${new Date().toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })}</p>
          <table>
            <thead>
              <tr><th>Order #</th><th>Date</th><th>Items</th><th>Status</th><th style="text-align:right">Total</th></tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr><td colspan="4">Grand total</td><td style="text-align:right">NPR ${grandTotal.toLocaleString()}</td></tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStepIndex = (status: string) => {
    return orderSteps.indexOf(status as (typeof orderSteps)[number]);
  };

  const navItems = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "My Details", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              {/* User info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="relative w-12 h-12 rounded-full flex-shrink-0 group"
                  title="Change photo"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={16} className="text-white" />
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {user?.name}
                  </p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </div>

              {/* Nav items */}
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-500 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {activeTab === item.id && (
                      <ChevronRight size={14} className="ml-auto" />
                    )}
                  </button>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-colors w-full text-left mt-4"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">

            {/* My Orders tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Orders
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                    <Package size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-2">
                      No orders yet
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      When you place an order it will appear here
                    </p>
                    <Link href="/customise">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
                        Shop now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                      >
                        {/* Order header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                              Order number
                            </p>
                            <p className="font-bold text-gray-900">
                              #{order.orderNumber}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        {/* Products */}
                        <div className="flex flex-col gap-3 mb-6">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                <div style={{ transform: "scale(0.29)" }}>
                                  <WatchVisual
                                    size="sm"
                                    caseColor={caseColors.find((c) => c.label === item.caseColor)?.hex}
                                    strapColor={strapColors.find((s) => s.label === item.strapColor)?.hex}
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                  GhadiHours
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                  {item.caseColor} · {item.strapColor} strap ·{" "}
                                  {item.size} · Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          <p className="font-bold text-gray-900 text-sm text-right">
                            Total: NPR {order.pricing.total.toLocaleString()}
                          </p>
                        </div>

                        {/* Progress tracker */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between relative">
                            {/* Line */}
                            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
                            <div
                              className="absolute left-0 top-4 h-0.5 bg-blue-500 z-0 transition-all duration-500"
                              style={{
                                width: `${
                                  (getStepIndex(order.orderStatus) /
                                    (orderSteps.length - 1)) *
                                  100
                                }%`,
                              }}
                            />

                            {orderSteps.map((step, i) => {
                              const stepIdx = getStepIndex(order.orderStatus);
                              const isDone = i < stepIdx;
                              const isActive = i === stepIdx;

                              return (
                                <div
                                  key={step}
                                  className="flex flex-col items-center z-10"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                                      isDone
                                        ? "bg-green-500 border-green-500 text-white"
                                        : isActive
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "bg-white border-gray-200 text-gray-400"
                                    }`}
                                  >
                                    {isDone ? "✓" : i + 1}
                                  </div>
                                  <span
                                    className={`text-xs mt-2 font-medium text-center max-w-[60px] leading-tight ${
                                      isActive
                                        ? "text-blue-500"
                                        : isDone
                                        ? "text-green-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delivery date */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
                          <span className="text-gray-400">
                            Est. delivery:{" "}
                            {formatDate(order.estimatedDeliveryDate)}
                          </span>
                          <span className="text-gray-400">
                            Placed: {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Wishlist
                </h2>

                {wishlistLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                    <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-2">
                      Your wishlist is empty
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Save your watch configuration to find it here
                    </p>
                    <Link href="/customise">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
                        Go back to the store
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                          <div style={{ transform: "scale(0.34)" }}>
                            <WatchVisual
                              size="sm"
                              caseColor={caseColors.find((c) => c.label === item.caseColor)?.hex}
                              strapColor={strapColors.find((s) => s.label === item.strapColor)?.hex}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            GhadiHours
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {item.caseColor} · {item.strapColor} strap · {item.size}
                          </p>
                          <p className="font-bold text-gray-900 text-sm mt-1">
                            NPR {item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={movingId === item._id}
                          className="flex items-center gap-2 h-11 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors"
                        >
                          <ShoppingBag size={16} />
                          {movingId === item._id ? "Moving..." : "Move to Cart"}
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Details
                </h2>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 flex items-center text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="98XXXXXXXX"
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 flex items-center text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Email address
                      </label>
                      <div className="h-12 border border-gray-200 rounded-xl px-4 flex items-center text-gray-400 text-sm bg-gray-50 cursor-not-allowed">
                        {user?.email}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Email can&apos;t be changed since it&apos;s used to sign in.
                      </p>
                    </div>
                    {profileMessage && (
                      <p
                        className={`text-sm font-medium ${
                          profileMessage.includes("success")
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {profileMessage}
                      </p>
                    )}
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      {savingProfile ? "Saving..." : "Update details"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings tab */}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 -mb-2">
                  Settings
                </h2>

                {/* Change password */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-5">Change password</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Current password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) =>
                          setPasswordForm((f) => ({ ...f, current: e.target.value }))
                        }
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        New password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.next}
                        onChange={(e) =>
                          setPasswordForm((f) => ({ ...f, next: e.target.value }))
                        }
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) =>
                          setPasswordForm((f) => ({ ...f, confirm: e.target.value }))
                        }
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {passwordMessage && (
                      <p
                        className={`text-sm font-medium ${
                          passwordMessage.ok ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {passwordMessage.text}
                      </p>
                    )}
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      {changingPassword ? "Updating..." : "Change password"}
                    </button>
                  </div>
                </div>

                {/* Order history download */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">Order history</h3>
                  <p className="text-sm text-gray-400 mb-5">
                    Download a statement of all your orders as a PDF.
                  </p>
                  <button
                    onClick={downloadOrderHistory}
                    disabled={orders.length === 0}
                    className="flex items-center gap-2 h-12 px-5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    <Download size={16} />
                    Download order history
                  </button>
                </div>

                {/* Sign out */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}