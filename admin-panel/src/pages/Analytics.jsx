import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import {
  FiTrendingUp, FiShoppingCart, FiUsers,
  FiDollarSign, FiArrowUp, FiArrowDown
} from 'react-icons/fi'
import { IoFlameSharp } from 'react-icons/io5'
import api from '../services/api'
import { formatCurrency } from '../utils/formatCurrency'
import Spinner from '../components/ui/Spinner'

const PERIODS = [
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
]

const BRANCH_COLORS = {
  baruwa: '#B91C1C',
  ijegun: '#D97706',
  idimu: '#059669',
  abulegba: '#7C3AED',
}

function StatCard({ icon, label, value, sub, growth, color = 'red', index = 0 }) {
  const colors = {
    red: 'bg-brand-red-light text-brand-red',
    gold: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  const isPositive = growth >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold font-sans px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <p className="font-display font-extrabold text-gray-900 text-3xl mb-1">{value}</p>
      <p className="font-bold text-gray-700 text-sm font-sans">{label}</p>
      {sub && <p className="text-gray-400 text-xs font-sans mt-0.5">{sub}</p>}
    </motion.div>
  )
}

function CustomTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-gray-500 text-xs font-sans mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="font-bold text-gray-900 text-sm font-sans">
          {prefix}{typeof entry.value === 'number' && prefix === '₦'
            ? entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('30')

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => api.get(`/analytics?period=${period}`).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  const analytics = data?.data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={36} className="text-brand-red" />
          <p className="text-gray-400 text-sm font-sans">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const { summary, revenueChart, ordersByBranch, topItems, peakHours, ordersByDayOfWeek, paymentBreakdown } = analytics

  // Format revenue chart dates
  const formattedRevenue = revenueChart.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
  }))

  // Branch pie data
  const branchPieData = Object.entries(ordersByBranch).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Peak hours — show readable format
  const peakHoursFormatted = peakHours
    .filter(h => h.count > 0)
    .map(h => ({
      hour: `${h.hour === 0 ? 12 : h.hour > 12 ? h.hour - 12 : h.hour}${h.hour < 12 ? 'AM' : 'PM'}`,
      count: h.count,
    }))

  const PIE_COLORS = ['#B91C1C', '#D97706', '#059669', '#7C3AED']

  return (
    <div className="space-y-6">

      {/* Header + period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-gray-900 text-2xl">Analytics</h1>
          <p className="text-gray-400 text-sm font-sans">Business performance overview</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold font-sans transition-all ${
                period === p.value
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-red hover:text-brand-red'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiDollarSign size={20} />}
          label="Total Revenue"
          value={`₦${Math.round(summary.totalRevenue).toLocaleString()}`}
          sub="Completed orders"
          growth={summary.revenueGrowth}
          color="red"
          index={0}
        />
        <StatCard
          icon={<FiShoppingCart size={20} />}
          label="Total Orders"
          value={summary.totalOrders}
          sub={`${summary.completedOrders} completed`}
          growth={summary.orderGrowth}
          color="gold"
          index={1}
        />
        <StatCard
          icon={<FiTrendingUp size={20} />}
          label="Avg Order Value"
          value={`₦${Math.round(summary.avgOrderValue).toLocaleString()}`}
          sub="Per completed order"
          color="green"
          index={2}
        />
        <StatCard
          icon={<FiUsers size={20} />}
          label="Unique Customers"
          value={summary.uniqueCustomers}
          sub="Logged in customers"
          color="blue"
          index={3}
        />
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="font-display font-bold text-gray-900 text-lg mb-6">
          Revenue Over Time
        </h2>
        {formattedRevenue.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm font-sans">
            No revenue data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={formattedRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#B91C1C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'sans-serif', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'sans-serif', fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="₦" />} />
              <Area type="monotone" dataKey="revenue" stroke="#B91C1C" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#B91C1C' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Two column — top items + branch performance */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <IoFlameSharp className="text-brand-red" size={18} />
            <h2 className="font-display font-bold text-gray-900 text-lg">Most Ordered</h2>
          </div>
          {topItems.length === 0 ? (
            <p className="text-gray-400 text-sm font-sans text-center py-8">No order data yet</p>
          ) : (
            <div className="space-y-3">
              {topItems.slice(0, 6).map((item, i) => {
                const maxCount = topItems[0].count
                const pct = (item.count / maxCount) * 100
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-red-light text-brand-red text-[10px] font-bold flex items-center justify-center font-sans flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-gray-900 text-sm font-semibold font-sans truncate max-w-36">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-brand-red font-bold text-sm font-sans">{item.count}x</span>
                        <span className="text-gray-400 text-xs font-sans ml-1.5">
                          ₦{Math.round(item.revenue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                        className="h-full rounded-full bg-brand-red"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Branch performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="font-display font-bold text-gray-900 text-lg mb-6">
            Orders by Branch
          </h2>
          {branchPieData.length === 0 ? (
            <p className="text-gray-400 text-sm font-sans text-center py-8">No order data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={branchPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {branchPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} orders`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {branchPieData.map((b, i) => (
                  <div key={b.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-gray-600 text-xs font-sans">{b.name}</span>
                    <span className="text-gray-900 font-bold text-xs font-sans ml-auto">{b.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Orders by day of week */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="font-display font-bold text-gray-900 text-lg mb-6">
          Orders by Day of Week
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ordersByDayOfWeek} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'sans-serif', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'sans-serif', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {ordersByDayOfWeek.map((entry, i) => {
                const maxDay = Math.max(...ordersByDayOfWeek.map(d => d.count))
                return (
                  <Cell
                    key={i}
                    fill={entry.count === maxDay ? '#B91C1C' : '#FEE2E2'}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Peak hours + payment breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Peak hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="font-display font-bold text-gray-900 text-lg mb-6">Peak Hours</h2>
          {peakHoursFormatted.length === 0 ? (
            <p className="text-gray-400 text-sm font-sans text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={peakHoursFormatted} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fontFamily: 'sans-serif', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#D97706" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Payment breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="font-display font-bold text-gray-900 text-lg mb-6">Payment Methods</h2>
          <div className="space-y-4">
            {[
              { label: 'Pay on Pickup', key: 'pickup', color: '#B91C1C' },
              { label: 'Online (Paystack)', key: 'online', color: '#059669' },
            ].map(pm => {
              const total = (paymentBreakdown.pickup || 0) + (paymentBreakdown.online || 0)
              const count = paymentBreakdown[pm.key] || 0
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={pm.key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 text-sm font-semibold font-sans">{pm.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm font-sans">{count}</span>
                      <span className="text-gray-400 text-xs font-sans">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full rounded-full"
                      style={{ background: pm.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-xs font-sans mb-1">Total Orders This Period</p>
            <p className="font-display font-bold text-gray-900 text-2xl">
              {(paymentBreakdown.pickup || 0) + (paymentBreakdown.online || 0)}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}