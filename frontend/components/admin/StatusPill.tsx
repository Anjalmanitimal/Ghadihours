const STYLES: Record<string, string> = {
  "Order Placed": "bg-gray-100 text-gray-600",
  Processing: "bg-orange-100 text-orange-600",
  Shipped: "bg-blue-100 text-blue-600",
  Delivered: "bg-green-100 text-green-700",
};

const StatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
      STYLES[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);

export default StatusPill;
