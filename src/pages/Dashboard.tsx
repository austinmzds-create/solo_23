import { Link } from 'react-router-dom'
import { useAppState } from '../store'

export default function Dashboard() {
  const { inventories, qualities, orders } = useAppState()

  const todayOrders = orders.filter(o => o.createdAt.startsWith(new Date().toISOString().slice(0, 10)))
  const todayQualities = qualities.filter(q => q.createdAt.startsWith(new Date().toISOString().slice(0, 10)))

  const totalRevenue = todayOrders.filter(o => o.status === '已完成').reduce((s, o) => s + o.totalAmount, 0)
  const completedOrders = todayOrders.filter(o => o.status === '已完成').length
  const pendingOrders = todayOrders.filter(o => ['待制作', '制作中', '待配送', '配送中'].includes(o.status)).length
  const qualityPassRate = todayQualities.length > 0
    ? ((todayQualities.filter(q => q.status === '合格').length / todayQualities.length) * 100).toFixed(1)
    : '0.0'
  const expiringSoon = inventories.filter(i => i.status === '即将过期').length
  const lowStock = inventories.filter(i => i.quantity > 0 && i.quantity <= 10).length

  const cards = [
    { label: '今日营收', value: `¥${totalRevenue.toLocaleString()}`, sub: `${completedOrders} 单已完成`, color: 'bg-emerald-500', link: '/orders/stats' },
    { label: '进行中订单', value: pendingOrders, sub: '待处理', color: 'bg-blue-500', link: '/orders' },
    { label: '品控合格率', value: `${qualityPassRate}%`, sub: `${todayQualities.length} 杯品检`, color: 'bg-amber-500', link: '/quality/stats' },
    { label: '库存预警', value: expiringSoon + lowStock, sub: `${expiringSoon} 临期 · ${lowStock} 低量`, color: 'bg-rose-500', link: '/inventory/stats' },
  ]

  const recentOrders = todayOrders.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link key={c.label} to={c.link} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
            <div className={`${c.color} h-1.5`} />
            <div className="p-5">
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{c.value}</p>
              <p className="text-xs text-gray-400 mt-2">{c.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">最新外卖订单</h2>
            <Link to="/orders" className="text-sm text-emerald-600 hover:underline">查看全部 →</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map(o => (
              <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-700">{o.customer} · {o.items.map(i => i.name).join(', ')}</p>
                  <p className="text-xs text-gray-400">{o.orderNo}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  o.status === '已完成' ? 'bg-emerald-100 text-emerald-700' :
                  o.status === '已取消' ? 'bg-gray-100 text-gray-500' :
                  'bg-amber-100 text-amber-700'
                }`}>{o.status}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">库存状态概览</h2>
            <Link to="/inventory" className="text-sm text-emerald-600 hover:underline">查看全部 →</Link>
          </div>
          <div className="space-y-3">
            {inventories.filter(i => i.status === '即将过期' || i.status === '已过期' || (i.quantity > 0 && i.quantity <= 10)).slice(0, 5).map(i => (
              <Link key={i.id} to={`/inventory/${i.id}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-700">{i.name}</p>
                  <p className="text-xs text-gray-400">{i.batchNo} · {i.quantity}{i.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  i.status === '即将过期' ? 'bg-amber-100 text-amber-700' :
                  i.status === '已过期' ? 'bg-rose-100 text-rose-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{i.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">今日品控记录</h2>
          <Link to="/quality" className="text-sm text-emerald-600 hover:underline">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {todayQualities.slice(-6).reverse().map(q => (
            <Link key={q.id} to={`/quality/${q.id}`} className="border border-gray-100 rounded-lg p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-700 text-sm">{q.beverage}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  q.status === '合格' ? 'bg-emerald-100 text-emerald-700' :
                  q.status === '不合格' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{q.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{q.barista} · 综合 {q.overallScore} 分</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
