export const BRANCHES = [
  {
    id: "baruwa",
    name: "Baruwa",
    address: "67b Aina Obembe Street, Off Oluwaga Road, Baruwa",
    area: "Baruwa, Lagos",
    phone: "+234 000 000 0001",
    whatsapp: "+234 000 000 0001",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.6095, lng: 3.2479 },
  },
  {
    id: "ijegun",
    name: "Ijegun",
    address: "136 Isheri Oshun Road, Isolo",
    area: "Ijegun, Lagos",
    phone: "+234 000 000 0002",
    whatsapp: "+234 000 000 0002",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.5344, lng: 3.3156 },
  },
  {
    id: "ipaja",
    name: "Ipaja",
    address: "Ipaja Road Bridge, Ipaja",
    area: "Ipaja, Lagos",
    phone: "+234 000 000 0003",
    whatsapp: "+234 000 000 0003",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.6056, lng: 3.2538 },
  },
  {
    id: "isheri",
    name: "Isheri",
    address: "19 Oluwaloni Street, Isheri Oshun Road",
    area: "Isheri, Lagos",
    phone: "+234 000 000 0004",
    whatsapp: "+234 000 000 0004",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.5281, lng: 3.3189 },
  },
];

export const MENU_CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "rice-dishes", label: "Rice Dishes" },
  { id: "chicken", label: "Chicken" },
  { id: "snacks", label: "Snacks & Pastries" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

export const PAYMENT_METHODS = [
  {
    id: "pickup",
    label: "Pay on Pickup",
    description: "Pay cash or card when you collect your order",
  },
  {
    id: "online",
    label: "Pay Online",
    description: "Pay securely now with Paystack",
  },
];

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
