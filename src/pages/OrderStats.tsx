import { Link } from 'react-router-dom'
import { useAppState } from '../store'
import { groupByItems } from '../utils/groupBy'

export default function OrderStats() {
  const { orders } = useAppState()

  const todayOrders = orders.filter(o => o.createdAt.startsWith(new Date().toISOString().slice(0, 10)))
  const completedToday = todayOrders.filter(o => o.status === '已完成')
  const revenueToday = completedToday.reduce((s, o) => s + o.totalAmount, 0)
  const avgOrderValue = completedToday.length > 0 ? (revenueToday / completedToday.length).toFixed(0) : '0'

  const byPlatform = groupByItems(orders, o => o.platform)
  const byStatus = groupByItems(orders, o => o.status)

  const totalRevenue = orders.filter(o => o.status === '已完成').reduce((s, o) => s + o.totalAmount, 0)
  const totalCompleted = orders.filter(o => o.status === '已完成').length
  const totalCancelled = orders.filter(o => o.status === '已取消').length

  const beverageStats: Record<string, { count: number; revenue: number }> = {}
  orders.filter(o => o.status === '已完成').forEach(o => {
    o.items.forEach(item => {
      if (!beverageStats[item.name]) beverageStats[item.name] = { count: 0, revenue: 0 }
      beverageStats[item.name]!.count += item.quantity
      beverageStats[item.name]!.revenue += item.price * item.quantity
    })
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/orders" className="text-sm text-emerald-600 hover:underline">← 返回列表</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="今日营收" value={`¥${revenueToday.toLocaleString()}`} color="bg-emerald-500" />
        <StatCard label="今日订单" value={todayOrders.length} color="bg-blue-500" />
        <StatCard label="客单价" value={`¥${avgOrderValue}`} color="bg-purple-500" />
        <StatCard label="今日完成" value={completedToday.length} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-400 mb-2">累计营收</p>
          <p className="text-2xl font-bold text-gray-800">¥{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-400 mb-2">累计完成</p>
          <p className="text-2xl font-bold text-gray-800">{totalCompleted} 单</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-400 mb-2">取消率</p>
          <p className="text-2xl font-bold text-gray-800">{orders.length > 0 ? ((totalCancelled / orders.length) * 100).toFixed(1) : '0.0'}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">按平台统计</h3>
          <div className="space-y-3">
            {Object.entries(byPlatform).map(([platform, ords]) => {
              const completed = ords!.filter(o => o.status === '已完成')
              const revenue = completed.reduce((s, o) => s + o.totalAmount, 0)
              return (
                <div key={platform} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    platform === '美团' ? 'bg-yellow-100 text-yellow-700' :
                    platform === '饿了么' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{platform}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{ords!.length} 单</span>
                    <span className="text-xs text-emerald-600">{completed.length} 已完成</span>
                    <span className="text-sm font-medium text-gray-700">¥{revenue.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">订单状态分布</h3>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, ords]) => (
              <div key={status} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  status === '已完成' ? 'bg-emerald-100 text-emerald-700' :
                  status === '已取消' ? 'bg-gray-100 text-gray-500' :
                  status === '配送中' ? 'bg-blue-100 text-blue-700' :
                  status === '制作中' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{status}</span>
                <span className="text-sm font-medium text-gray-700">{ords!.length} 单</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">热销饮品排行</h3>
        <div className="space-y-3">
          {Object.entries(beverageStats)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([name, stats]) => (
              <div key={name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-600">{name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{stats.count} 杯</span>
                  <span className="text-sm font-medium text-gray-700">¥{stats.revenue.toLocaleString()}</span>
                  <Link to="/orders" className="text-xs text-emerald-600 hover:underline">查看 →</Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`${color} h-1.5`} />
      <div className="p-5">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  )
}
