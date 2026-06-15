import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiEye,
  FiCheck,
} from "react-icons/fi";
import { getContacts, markRead } from "../services/contactsService";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

function ContactModal({ item, onClose, onMarkRead }) {
  if (!item) return null;
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="font-display font-bold text-gray-900 text-xl">
                Message
              </h2>
              <p className="text-gray-400 text-xs font-sans mt-0.5">
                {format(new Date(item.created_at), "PPp")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <FiX size={16} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              {[
                { label: "From", value: item.name },
                { label: "Email", value: item.email },
                ...(item.phone ? [{ label: "Phone", value: item.phone }] : []),
                { label: "Subject", value: item.subject },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <span className="text-gray-400 text-sm font-sans">
                    {row.label}
                  </span>
                  <span className="font-bold text-gray-900 text-sm font-sans text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans mb-2">
                Message
              </p>
              <p className="text-gray-700 text-sm font-sans leading-relaxed">
                {item.message}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:${item.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
              >
                <FiMail size={15} /> Reply via Email
              </a>
              {!item.is_read && (
                <button
                  onClick={() => onMarkRead(item.id)}
                  className="flex items-center gap-2 bg-green-100 text-green-700 font-bold px-5 py-3 rounded-2xl text-sm hover:bg-green-200 transition-colors font-sans"
                >
                  <FiCheck size={15} /> Mark Read
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Contacts() {
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["contacts", readFilter],
    queryFn: () =>
      getContacts({
        ...(readFilter !== "" && { is_read: readFilter }),
        limit: 100,
      }).then((r) => r.data),
  });

  const { mutate: doMarkRead } = useMutation({
    mutationFn: (id) => markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
      queryClient.invalidateQueries(["contacts-badge"]);
      toast.success("Marked as read");
      setSelected(null);
    },
  });

  const contacts = data?.data || [];
  const filtered = contacts.filter(
    (c) =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()),
  );

  const unread = contacts.filter((c) => !c.is_read).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<FiMail size={20} />}
          label="Total Messages"
          value={contacts.length}
          color="red"
          index={0}
        />
        <StatCard
          icon={<FiMail size={20} />}
          label="Unread"
          value={unread}
          sub="Need response"
          color="gold"
          index={1}
        />
        <StatCard
          icon={<FiCheck size={20} />}
          label="Read"
          value={contacts.length - unread}
          color="green"
          index={2}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none"
          >
            <option value="">All Messages</option>
            <option value="false">Unread Only</option>
            <option value="true">Read Only</option>
          </select>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-red-light text-brand-red rounded-xl text-sm font-bold font-sans hover:bg-brand-red hover:text-white transition-colors"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            Messages ({filtered.length})
          </h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-brand-red" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-14 h-14 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4">
              <FiMail className="text-brand-red" size={24} />
            </div>
            <p className="font-bold text-gray-900 font-sans mb-1">
              No messages
            </p>
            <p className="text-gray-400 text-sm font-sans">
              Messages from customers will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(item)}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!item.is_read ? "bg-brand-red-light/30" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!item.is_read ? "bg-brand-red" : "bg-gray-100"}`}
                >
                  <FiMail
                    className={!item.is_read ? "text-white" : "text-gray-400"}
                    size={16}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={`font-sans text-sm ${!item.is_read ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}
                    >
                      {item.name}
                    </p>
                    <span className="text-gray-400 text-xs font-sans flex-shrink-0">
                      {format(new Date(item.created_at), "MMM dd")}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-sans mb-1 ${!item.is_read ? "text-brand-red font-semibold" : "text-gray-500"}`}
                  >
                    {item.subject}
                  </p>
                  <p className="text-gray-400 text-xs font-sans line-clamp-1">
                    {item.message}
                  </p>
                </div>
                {!item.is_read && (
                  <div className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ContactModal
          item={selected}
          onClose={() => setSelected(null)}
          onMarkRead={(id) => doMarkRead(id)}
        />
      )}
    </div>
  );
}
