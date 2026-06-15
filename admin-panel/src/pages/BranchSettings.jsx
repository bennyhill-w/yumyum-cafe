import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMapPin, FiPhone, FiClock, FiEdit2,
  FiCheck, FiX, FiToggleLeft, FiToggleRight,
  FiWifi, FiWifiOff
} from 'react-icons/fi'
import { MdStorefront, MdWhatsapp } from 'react-icons/md'
import { getBranches, updateBranch } from '../services/branchService'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

function BranchCard({ branch, onEdit, onToggle, toggling }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
        branch.is_open
          ? 'border-gray-100'
          : 'border-red-100 bg-red-50/30'
      }`}
    >
      {/* Header */}
      <div className={`px-5 py-4 flex items-center justify-between ${
        branch.is_open ? 'bg-brand-red' : 'bg-gray-400'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <MdStorefront className="text-white" size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-none">
              {branch.name}
            </h3>
            <p className="text-white/65 text-xs font-sans mt-0.5">{branch.area}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Open/Closed toggle */}
          <button
            onClick={() => onToggle(branch)}
            disabled={toggling}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full font-sans transition-all disabled:opacity-50"
          >
            {toggling ? (
              <Spinner size={12} className="text-white" />
            ) : branch.is_open ? (
              <><FiWifi size={12} /> Open</>
            ) : (
              <><FiWifiOff size={12} /> Closed</>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-red-light rounded-xl flex items-center justify-center flex-shrink-0">
              <FiMapPin className="text-brand-red" size={14} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-sans uppercase tracking-wider mb-0.5">Address</p>
              <p className="text-gray-900 text-sm font-sans font-semibold leading-relaxed">{branch.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red-light rounded-xl flex items-center justify-center flex-shrink-0">
              <FiPhone className="text-brand-red" size={14} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-sans uppercase tracking-wider mb-0.5">Phone</p>
              <p className="text-gray-900 text-sm font-sans font-semibold">{branch.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <MdWhatsapp className="text-green-600" size={14} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-sans uppercase tracking-wider mb-0.5">WhatsApp</p>
              <p className="text-gray-900 text-sm font-sans font-semibold">{branch.whatsapp}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red-light rounded-xl flex items-center justify-center flex-shrink-0">
              <FiClock className="text-brand-red" size={14} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-sans uppercase tracking-wider mb-0.5">Hours</p>
              <p className="text-gray-900 text-sm font-sans font-semibold">{branch.hours}</p>
            </div>
          </div>
        </div>

        <motion.button
          onClick={() => onEdit(branch)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-brand-red-light text-brand-red font-bold py-3 rounded-xl text-sm font-sans hover:bg-brand-red hover:text-white transition-all"
        >
          <FiEdit2 size={14} /> Edit Branch Info
        </motion.button>
      </div>
    </motion.div>
  )
}

function EditModal({ branch, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    name: branch.name || '',
    address: branch.address || '',
    area: branch.area || '',
    phone: branch.phone || '',
    whatsapp: branch.whatsapp || '',
    hours: branch.hours || '',
    is_open: branch.is_open ?? true,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputCls = 'w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-white text-gray-900'

  const validate = () => {
    if (!form.name.trim()) { toast.error('Branch name required'); return false }
    if (!form.address.trim()) { toast.error('Address required'); return false }
    if (!form.phone.trim()) { toast.error('Phone number required'); return false }
    if (!form.hours.trim()) { toast.error('Opening hours required'); return false }
    return true
  }

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
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="font-display font-bold text-gray-900 text-xl">
                Edit {branch.name} Branch
              </h2>
              <p className="text-gray-400 text-xs font-sans mt-0.5">
                Changes reflect on the website instantly
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: 'Branch Name', key: 'name', placeholder: 'e.g. Baruwa' },
              { label: 'Full Address', key: 'address', placeholder: 'e.g. 67b Aina Obembe Street, Off Oluwaga Road' },
              { label: 'Area', key: 'area', placeholder: 'e.g. Baruwa, Lagos' },
              { label: 'Phone Number', key: 'phone', placeholder: 'e.g. +2348012345678' },
              { label: 'WhatsApp Number', key: 'whatsapp', placeholder: 'e.g. +2348012345678' },
              { label: 'Opening Hours', key: 'hours', placeholder: 'e.g. 8:00 AM – 10:00 PM' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  {field.label}
                </label>
                <input
                  value={form[field.key]}
                  onChange={e => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputCls}
                />
              </div>
            ))}

            {/* Open/Closed toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-900 text-sm font-sans">Branch Status</p>
                <p className="text-gray-400 text-xs font-sans">
                  {form.is_open ? 'Branch is open and visible to customers' : 'Branch is closed — customers will see it as closed'}
                </p>
              </div>
              <button
                onClick={() => set('is_open', !form.is_open)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm font-sans transition-all ${
                  form.is_open
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                {form.is_open
                  ? <><FiToggleRight size={16} /> Open</>
                  : <><FiToggleLeft size={16} /> Closed</>
                }
              </button>
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <motion.button
              onClick={() => validate() && onSave(form)}
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans disabled:opacity-70"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <><FiCheck size={15} /> Save Changes</>
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
  )
}

export default function BranchSettings() {
  const [editBranch, setEditBranch] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-branches'],
    queryFn: () => getBranches().then(r => r.data),
  })

  const { mutate: doUpdate, isPending: saving } = useMutation({
    mutationFn: ({ id, data }) => updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-branches'])
      queryClient.invalidateQueries(['branches'])
      toast.success('Branch updated! Changes are now live on the website.')
      setEditBranch(null)
    },
    onError: () => toast.error('Failed to update branch'),
  })

  const handleToggle = async (branch) => {
    setTogglingId(branch.id)
    try {
      await updateBranch(branch.id, { is_open: !branch.is_open })
      queryClient.invalidateQueries(['admin-branches'])
      queryClient.invalidateQueries(['branches'])
      toast.success(`${branch.name} is now ${!branch.is_open ? 'open' : 'closed'}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setTogglingId(null)
    }
  }

  const branches = data?.data || []
  const openCount = branches.filter(b => b.is_open).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MdStorefront size={20} />} label="Total Branches" value={branches.length} color="red" index={0} />
        <StatCard icon={<FiWifi size={20} />} label="Currently Open" value={openCount} color="green" index={1} />
        <StatCard icon={<FiWifiOff size={20} />} label="Currently Closed" value={branches.length - openCount} color="gold" index={2} />
        <StatCard icon={<FiClock size={20} />} label="Daily Hours" value="8AM–10PM" color="blue" index={3} />
      </div>

      {/* Info banner */}
      <div className="bg-brand-red-light border border-brand-red/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center flex-shrink-0">
          <FiCheck className="text-white" size={16} />
        </div>
        <p className="text-brand-red text-sm font-sans">
          <span className="font-bold">Any changes you make here reflect on the website immediately.</span>{' '}
          Use the Open/Closed toggle to temporarily close a branch for maintenance.
        </p>
      </div>

      {/* Branch grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size={36} className="text-brand-red" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {branches.map(branch => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onEdit={setEditBranch}
              onToggle={handleToggle}
              toggling={togglingId === branch.id}
            />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editBranch && (
        <EditModal
          branch={editBranch}
          onClose={() => setEditBranch(null)}
          onSave={(data) => doUpdate({ id: editBranch.id, data })}
          saving={saving}
        />
      )}
    </div>
  )
}