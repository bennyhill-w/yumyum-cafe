import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiTag,
  FiToggleLeft,
  FiToggleRight,
  FiCopy,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import api from "../services/api";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

const EMPTY_FORM = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  min_order: "",
  max_uses: "",
  expires_at: "",
};

function PromoModal({ promo, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    promo
      ? {
          code: promo.code || "",
          description: promo.description || "",
          type: promo.type || "percentage",
          value: promo.value || "",
          min_order: promo.min_order || "",
          max_uses: promo.max_uses || "",
          expires_at: promo.expires_at ? promo.expires_at.split("T")[0] : "",
        }
      : { ...EMPTY_FORM },
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red bg-white text-gray-900";

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
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-display font-bold text-gray-900 text-xl">
              {promo ? "Edit Promo Code" : "Create Promo Code"}
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Promo Code <span className="text-brand-red">*</span>
              </label>
              <input
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="e.g. JOLLOF20"
                className={`${inputCls} font-mono font-bold tracking-widest uppercase`}
                disabled={!!promo}
              />
              <p className="text-gray-400 text-xs font-sans mt-1">
                Customers enter this exactly as shown — use memorable, uppercase
                codes
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Description
              </label>
              <input
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="e.g. 20% off all orders"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Discount Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Value {form.type === "percentage" ? "(%)" : "(₦)"}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => set("value", e.target.value)}
                  placeholder={form.type === "percentage" ? "20" : "1000"}
                  min="0"
                  max={form.type === "percentage" ? "100" : undefined}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Min Order (₦)
                </label>
                <input
                  type="number"
                  value={form.min_order}
                  onChange={(e) => set("min_order", e.target.value)}
                  placeholder="0 = no minimum"
                  min="0"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Max Uses
                </label>
                <input
                  type="number"
                  value={form.max_uses}
                  onChange={(e) => set("max_uses", e.target.value)}
                  placeholder="Leave blank = unlimited"
                  min="1"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => set("expires_at", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={inputCls}
              />
              <p className="text-gray-400 text-xs font-sans mt-1">
                Leave blank for no expiry
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <motion.button
              onClick={() => {
                if (!form.code.trim()) {
                  toast.error("Code is required");
                  return;
                }
                if (!form.value) {
                  toast.error("Value is required");
                  return;
                }
                onSave(form);
              }}
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.97 }}
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
                  <FiCheck size={15} /> {promo ? "Save Changes" : "Create Code"}
                </>
              )}
            </motion.button>
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm font-sans hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PromoCodes() {
  const [showCreate, setShowCreate] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  const [deletePromo, setDeletePromo] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["promo-codes"],
    queryFn: () => api.get("/promo").then((r) => r.data),
  });

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: (payload) => api.post("/promo", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["promo-codes"]);
      toast.success("Promo code created!");
      setShowCreate(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create"),
  });

  const { mutate: doUpdate, isPending: updating } = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/promo/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["promo-codes"]);
      toast.success("Updated!");
      setEditPromo(null);
    },
    onError: () => toast.error("Failed to update"),
  });

  const { mutate: doDelete, isPending: deleting } = useMutation({
    mutationFn: (id) => api.delete(`/promo/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["promo-codes"]);
      toast.success("Deleted");
      setDeletePromo(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const toggleActive = (promo) => {
    doUpdate({ id: promo.id, data: { is_active: !promo.is_active } });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const codes = data?.data || [];
  const activeCodes = codes.filter((c) => c.is_active).length;
  const totalUses = codes.reduce((sum, c) => sum + (c.uses_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiTag size={20} />}
          label="Total Codes"
          value={codes.length}
          color="red"
          index={0}
        />
        <StatCard
          icon={<FiCheck size={20} />}
          label="Active"
          value={activeCodes}
          color="green"
          index={1}
        />
        <StatCard
          icon={<HiOutlineSparkles size={20} />}
          label="Total Uses"
          value={totalUses}
          color="gold"
          index={2}
        />
        <StatCard
          icon={<FiTag size={20} />}
          label="Inactive"
          value={codes.length - activeCodes}
          color="blue"
          index={3}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <p className="text-gray-500 text-sm font-sans">
          Customers enter codes at checkout to receive discounts.
        </p>
        <motion.button
          onClick={() => setShowCreate(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-brand-red text-white font-bold px-5 py-2.5 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors shadow-sm flex-shrink-0"
        >
          <FiPlus size={16} /> Create Code
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            Promo Codes ({codes.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-brand-red" />
          </div>
        ) : codes.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-14 h-14 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4">
              <FiTag className="text-brand-red" size={22} />
            </div>
            <p className="font-bold text-gray-900 font-sans mb-1">
              No promo codes yet
            </p>
            <p className="text-gray-400 text-sm font-sans mb-5">
              Create your first code to start offering discounts
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors"
            >
              <FiPlus size={14} /> Create First Code
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {codes.map((code) => (
              <div key={code.id} className="flex items-center gap-4 px-5 py-4">
                <div
                  className={`px-3 py-1.5 rounded-xl font-mono font-bold text-sm tracking-wider flex-shrink-0 ${code.is_active ? "bg-brand-red-light text-brand-red" : "bg-gray-100 text-gray-400"}`}
                >
                  {code.code}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm font-sans">
                      {code.type === "percentage"
                        ? `${code.value}% off`
                        : `₦${Number(code.value).toLocaleString()} off`}
                    </span>
                    {code.description && (
                      <span className="text-gray-400 text-xs font-sans">
                        — {code.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-gray-400 text-xs font-sans">
                      Used {code.uses_count || 0}
                      {code.max_uses ? `/${code.max_uses}` : ""} times
                    </span>
                    {code.min_order > 0 && (
                      <span className="text-gray-400 text-xs font-sans">
                        Min ₦{Number(code.min_order).toLocaleString()}
                      </span>
                    )}
                    {code.expires_at && (
                      <span
                        className={`text-xs font-sans ${new Date(code.expires_at) < new Date() ? "text-red-500" : "text-gray-400"}`}
                      >
                        Expires{" "}
                        {format(new Date(code.expires_at), "MMM dd, yyyy")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyCode(code.code)}
                    className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-brand-red-light hover:text-brand-red transition-colors"
                    title="Copy code"
                  >
                    <FiCopy size={13} />
                  </button>
                  <button
                    onClick={() => toggleActive(code)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${code.is_active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                    title={code.is_active ? "Deactivate" : "Activate"}
                  >
                    {code.is_active ? (
                      <FiToggleRight size={15} />
                    ) : (
                      <FiToggleLeft size={15} />
                    )}
                  </button>
                  <button
                    onClick={() => setEditPromo(code)}
                    className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-brand-red-light hover:text-brand-red transition-colors"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeletePromo(code)}
                    className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <PromoModal
          promo={null}
          onClose={() => setShowCreate(false)}
          onSave={(data) => doCreate(data)}
          saving={creating}
        />
      )}
      {editPromo && (
        <PromoModal
          promo={editPromo}
          onClose={() => setEditPromo(null)}
          onSave={(data) => doUpdate({ id: editPromo.id, data })}
          saving={updating}
        />
      )}

      {deletePromo && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletePromo(null)}
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
                Delete Code?
              </h3>
              <p className="text-gray-500 text-sm font-sans mb-6">
                Delete promo code{" "}
                <span className="font-bold text-gray-900 font-mono">
                  {deletePromo.code}
                </span>
                ? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => doDelete(deletePromo.id)}
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
                  onClick={() => setDeletePromo(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm font-sans"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
