export const BRANCHES = [
  {
    id: "baruwa",
    name: "Baruwa",
    address: "67B Aina Obembe Street Off Oluwaga Road, Baruwa, Lagos",
    area: "Baruwa, Lagos",
    phone: "0916 566 1589",
    whatsapp: "09165661589",
    hours: "8:00 AM – 9:00 PM",
    coordinates: { lat: 6.5959, lng: 3.2574 },
  },
  {
    id: "ijegun",
    name: "Ijegun",
    address: "136 Isheri Oshun Rd, Isolo Rd, Ijegun, Lagos",
    area: "Ijegun, Lagos",
    phone: "0916 524 6114",
    whatsapp: "09165246114",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.5144, lng: 3.2676 },
  },
  {
    id: "idimu",
    name: "Idimu",
    address: "Adjacent Idimu Central Mosque, Alimosho, Lagos",
    area: "Idimu, Lagos",
    phone: "0703 816 6629",
    whatsapp: "07038166629",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.572, lng: 3.2836 },
  },
  {
    id: "abulegba",
    name: "Abulegba",
    address: "378 Lagos-Abeokuta Expy, Abule Egba, Lagos",
    area: "Abulegba, Lagos",
    phone: "0816 090 7110",
    whatsapp: "08160907110",
    hours: "8:00 AM – 10:00 PM",
    coordinates: { lat: 6.6497, lng: 3.3044 },
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

export const DELIVERY_AREAS = [
  // Near Baruwa branch
  { area: "Baruwa", fee: 300, branch: "baruwa" },
  { area: "Ayobo", fee: 500, branch: "baruwa" },
  { area: "Ipaja", fee: 500, branch: "baruwa" },
  { area: "Akowonjo", fee: 700, branch: "baruwa" },
  { area: "Dopemu", fee: 800, branch: "baruwa" },
  { area: "Meiran", fee: 800, branch: "baruwa" },
  { area: "Abule Egba (near Baruwa)", fee: 800, branch: "baruwa" },

  // Near Ijegun branch
  { area: "Ijegun", fee: 300, branch: "ijegun" },
  { area: "Isolo", fee: 500, branch: "ijegun" },
  { area: "Okota", fee: 700, branch: "ijegun" },
  { area: "Ago Palace Way", fee: 800, branch: "ijegun" },
  { area: "Oshodi", fee: 800, branch: "ijegun" },
  { area: "Mile 2", fee: 1000, branch: "ijegun" },
  { area: "Festac Town", fee: 1000, branch: "ijegun" },
  { area: "Volks", fee: 1000, branch: "ijegun" },

  // Near Idimu branch
  { area: "Idimu", fee: 300, branch: "idimu" },
  { area: "Egbeda", fee: 500, branch: "idimu" },
  { area: "Jakande", fee: 700, branch: "idimu" },
  { area: "Cele", fee: 700, branch: "idimu" },
  { area: "Ejigbo", fee: 800, branch: "idimu" },

  // Near Abulegba branch
  { area: "Abule Egba", fee: 300, branch: "abulegba" },
  { area: "Agege", fee: 500, branch: "abulegba" },
  { area: "Ifako", fee: 700, branch: "abulegba" },
  { area: "Ogba", fee: 800, branch: "abulegba" },
  { area: "Berger", fee: 1000, branch: "abulegba" },
  { area: "Ikeja", fee: 1200, branch: "abulegba" },
  { area: "Ojodu", fee: 1200, branch: "abulegba" },
  { area: "Ojota", fee: 1500, branch: "abulegba" },
  { area: "Ogudu", fee: 1500, branch: "abulegba" },
];

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
