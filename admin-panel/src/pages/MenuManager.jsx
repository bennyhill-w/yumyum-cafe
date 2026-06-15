import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheck,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiStar,
} from "react-icons/fi";
import { IoFlameSharp } from "react-icons/io5";
import { MdNewReleases } from "react-icons/md";
import {
  getAdminMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  uploadMenuImage,
} from "../services/menuService";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import Spinner from "../components/ui/Spinner";
import StatCard from "../components/ui/StatCard";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "rice-dishes", label: "Rice Dishes" },
  { id: "chicken", label: "Chicken" },
  { id: "bakery", label: "Bakery" },
  { id: "snacks", label: "Snacks" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

// Branch options are loaded dynamically inside the component via API

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "rice-dishes",
  branch_id: "baruwa",
  is_available: true,
  is_popular: false,
  is_new: false,
  image_url: "",
};

// ── ITEM CARD ──
function MenuItemCard({ item, onEdit, onDelete, onToggle, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleImageClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onImageUpload(item.id, file);
      toast.success("Image updated!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${
        item.is_available ? "border-gray-100" : "border-red-100"
      }`}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden group">
        <img
          src={
            item.image_url ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
          }
          alt={item.name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            !item.is_available ? "grayscale opacity-60" : ""
          }`}
          loading="lazy"
        />

        {/* Out of stock overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full font-sans uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {item.is_popular && (
            <span className="inline-flex items-center gap-1 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <IoFlameSharp size={9} /> Popular
            </span>
          )}
          {item.is_new && (
            <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <MdNewReleases size={9} /> New
            </span>
          )}
        </div>

        {/* Upload overlay on hover */}
        <div
          onClick={handleImageClick}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all cursor-pointer flex items-center justify-center"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
            {uploading ? (
              <Spinner size={24} className="text-white" />
            ) : (
              <>
                <FiUpload className="text-white" size={22} />
                <span className="text-white text-xs font-bold font-sans">
                  Change Photo
                </span>
              </>
            )}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm font-sans leading-tight flex-1">
            {item.name}
          </h3>
          <span className="font-bold text-brand-red text-sm font-sans flex-shrink-0">
            {formatCurrency(Number(item.price))}
          </span>
        </div>

        <p className="text-gray-400 text-xs font-sans line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full font-sans capitalize">
            {item.category?.replace("-", " ")}
          </span>
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full font-sans capitalize">
            {item.branch_id}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Available toggle */}
          <button
            onClick={() => onToggle(item.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
              item.is_available
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            {item.is_available ? (
              <>
                <FiEye size={12} /> Available
              </>
            ) : (
              <>
                <FiEyeOff size={12} /> Unavailable
              </>
            )}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-brand-red-light hover:text-brand-red transition-colors"
          >
            <FiEdit2 size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(item)}
            className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── ITEM FORM MODAL ──
function ItemModal({ item, branches = [], onClose, onSave, saving }) {
  const [form, setForm] = useState(
    item
      ? {
          name: item.name || "",
          description: item.description || "",
          price: item.price || "",
          category: item.category || "rice-dishes",
          branch_id: item.branch_id || "baruwa",
          is_available: item.is_available ?? true,
          is_popular: item.is_popular ?? false,
          is_new: item.is_new ?? false,
          image_url: item.image_url || "",
        }
      : { ...EMPTY_FORM },
  );
  const imageFileRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(item?.image_url || "");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleModalImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const res = await uploadMenuImage(file);
      const url = res.data.data.url;
      set("image_url", url);
      setImagePreview(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-white text-gray-900";

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.price || isNaN(form.price)) {
      toast.error("Valid price is required");
      return;
    }
    if (!form.category) {
      toast.error("Category is required");
      return;
    }
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-display font-bold text-gray-900 text-xl">
              {item ? "Edit Menu Item" : "Add New Item"}
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Item Name <span className="text-brand-red">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Jollof Rice & Chicken"
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short description of the dish..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Price (₦) <span className="text-brand-red">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="3500"
                  className={inputCls}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Branch
              </label>
              <select
                value={form.branch_id}
                onChange={(e) => set("branch_id", e.target.value)}
                className={`${inputCls} appearance-none cursor-pointer`}
              >
                {branches
                  .filter((b) => b.id)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Food Image
              </label>

              {(imagePreview || form.image_url) && (
                <div className="mb-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview || form.image_url}
                    alt="Food preview"
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}

              <motion.button
                type="button"
                onClick={() => imageFileRef.current?.click()}
                disabled={imageUploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 bg-brand-red-light text-brand-red font-bold py-3.5 rounded-2xl text-sm font-sans hover:bg-brand-red hover:text-white transition-all mb-3 disabled:opacity-70"
              >
                {imageUploading ? (
                  <>
                    <Spinner size={16} className="text-current" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    Upload from Device / Phone
                  </>
                )}
              </motion.button>

              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                onChange={handleModalImageUpload}
                className="hidden"
              />

              <div className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 font-sans">
                or paste URL
              </div>

              <input
                value={form.image_url}
                onChange={(e) => {
                  set("image_url", e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://example.com/food-image.jpg"
                className={inputCls}
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  key: "is_available",
                  label: "Available",
                  icon: <FiEye size={14} />,
                  activeColor: "bg-green-500",
                },
                {
                  key: "is_popular",
                  label: "Popular",
                  icon: <IoFlameSharp size={14} />,
                  activeColor: "bg-brand-red",
                },
                {
                  key: "is_new",
                  label: "New Item",
                  icon: <MdNewReleases size={14} />,
                  activeColor: "bg-blue-500",
                },
              ].map((toggle) => (
                <button
                  key={toggle.key}
                  type="button"
                  onClick={() => set(toggle.key, !form[toggle.key])}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                    form[toggle.key]
                      ? "border-brand-red bg-brand-red-light"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span
                    className={
                      form[toggle.key] ? "text-brand-red" : "text-gray-400"
                    }
                  >
                    {toggle.icon}
                  </span>
                  <span
                    className={`text-xs font-bold font-sans ${form[toggle.key] ? "text-brand-red" : "text-gray-400"}`}
                  >
                    {toggle.label}
                  </span>
                  {form[toggle.key] && (
                    <FiCheck className="text-brand-red" size={10} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <motion.button
              onClick={handleSubmit}
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans disabled:opacity-70"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <FiCheck size={16} /> {item ? "Save Changes" : "Add Item"}
                </>
              )}
            </motion.button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm font-sans hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── DELETE CONFIRM ──
function DeleteConfirm({ item, onConfirm, onCancel, deleting }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center"
        >
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiTrash2 className="text-red-600" size={24} />
          </div>
          <h3 className="font-display font-bold text-gray-900 text-xl mb-2">
            Delete Item?
          </h3>
          <p className="text-gray-500 text-sm font-sans mb-6">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-900">"{item?.name}"</span>?
            This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-red-700 transition-colors font-sans disabled:opacity-70"
            >
              {deleting ? (
                <Spinner size={16} className="text-white" />
              ) : (
                <>
                  <FiTrash2 size={14} /> Delete
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm font-sans hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── MAIN PAGE ──
export default function MenuManager() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-menu", branchFilter],
    queryFn: () =>
      getAdminMenu({
        ...(branchFilter && { branch_id: branchFilter }),
      }).then((r) => r.data),
  });

  const { mutate: doToggle } = useMutation({
    mutationFn: (id) => toggleAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-menu"]);
      toast.success("Availability updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const { mutate: doUpdate, isPending: updating } = useMutation({
    mutationFn: ({ id, data }) => updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-menu"]);
      toast.success("Item updated!");
      setEditItem(null);
    },
    onError: () => toast.error("Failed to update item"),
  });

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: (data) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-menu"]);
      toast.success("Item added!");
      setShowAddModal(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to add item"),
  });

  const { mutate: doDelete, isPending: deleting } = useMutation({
    mutationFn: (id) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-menu"]);
      toast.success("Item deleted");
      setDeleteItem(null);
    },
    onError: () => toast.error("Failed to delete item"),
  });

  const handleImageUpload = async (id, file) => {
    try {
      const uploadRes = await uploadMenuImage(file);
      const imageUrl = uploadRes.data.data.url;
      await updateMenuItem(id, { image_url: imageUrl });
      await queryClient.invalidateQueries(["admin-menu"]);
      return imageUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  const { data: branchesData } = useQuery({
    queryKey: ["branches"],
    queryFn: () => api.get("/branches").then((r) => r.data),
  });

  const BRANCH_OPTIONS = [
    { id: "", label: "All Branches" },
    ...(branchesData?.data || []).map((b) => ({ id: b.id, label: b.name })),
  ];

  const items = data?.data || [];

  // Deduplicate by name for display — show each unique dish once
  const seen = new Set();
  const uniqueItems = items.filter((item) => {
    const key = item.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filtered = uniqueItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: uniqueItems.length,
    available: uniqueItems.filter((i) => i.is_available).length,
    outOfStock: uniqueItems.filter((i) => !i.is_available).length,
    popular: uniqueItems.filter((i) => i.is_popular).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiStar size={20} />}
          label="Total Items"
          value={stats.total}
          color="red"
          index={0}
        />
        <StatCard
          icon={<FiEye size={20} />}
          label="Available"
          value={stats.available}
          color="green"
          index={1}
        />
        <StatCard
          icon={<FiEyeOff size={20} />}
          label="Out of Stock"
          value={stats.outOfStock}
          sub="Hidden from customers"
          color="gold"
          index={2}
        />
        <StatCard
          icon={<IoFlameSharp size={20} />}
          label="Popular Items"
          value={stats.popular}
          color="blue"
          index={3}
        />
      </div>

      {/* Filters + Add button */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Branch */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer"
          >
            {BRANCH_OPTIONS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold font-sans text-gray-600 hover:bg-brand-red-light hover:text-brand-red transition-colors"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>

          {/* Add button */}
          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-brand-red text-white font-bold px-5 py-2.5 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors shadow-sm ml-auto"
          >
            <FiPlus size={16} /> Add New Item
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            Menu Items ({filtered.length})
          </h2>
          <div className="flex items-center gap-3 text-xs font-sans text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" /> Available
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" /> Out of stock
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size={36} className="text-brand-red" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-14 h-14 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4">
              <FiSearch className="text-brand-red" size={22} />
            </div>
            <p className="font-bold text-gray-900 font-sans mb-1">
              No items found
            </p>
            <p className="text-gray-400 text-sm font-sans mb-6">
              {items.length === 0
                ? "No menu items yet. Add your first item to get started."
                : "Try a different search or filter."}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors"
              >
                <FiPlus size={15} /> Add First Item
              </button>
            )}
          </div>
        ) : (
          <div className="p-5">
            <AnimatePresence>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={setEditItem}
                    onDelete={setDeleteItem}
                    onToggle={doToggle}
                    onImageUpload={handleImageUpload}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editItem && (
        <ItemModal
          item={editItem}
          branches={BRANCH_OPTIONS}
          onClose={() => setEditItem(null)}
          onSave={(data) => doUpdate({ id: editItem.id, data })}
          saving={updating}
        />
      )}

      {/* Add modal */}
      {showAddModal && (
        <ItemModal
          item={null}
          branches={BRANCH_OPTIONS}
          onClose={() => setShowAddModal(false)}
          onSave={(data) => doCreate(data)}
          saving={creating}
        />
      )}

      {/* Delete confirm */}
      {deleteItem && (
        <DeleteConfirm
          item={deleteItem}
          onConfirm={() => doDelete(deleteItem.id)}
          onCancel={() => setDeleteItem(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
