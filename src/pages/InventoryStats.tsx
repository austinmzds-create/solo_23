import { Link } from 'react-router-dom'
import { useAppState } from '../store'
import { groupByItems } from '../utils/groupBy'

export default function InventoryStats() {
  const { inventories } = useAppState()

  const byCategory = groupByItems(inventories, i => i.category)
  const byStatus = groupByItems(inventories, i => i.status)
  const bySupplier = groupByItems(inventories, i => i.supplier)

  const totalItems = inventories.length
  const totalQuantity = inventories.reduce((s, i) => s + i.quantity, 0)
  const expiringCount = inventories.filter(i => i.status === '即将过期').length
  const expiredCount = inventories.filter(i => i.status === '已过期').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/inventory" className="text-sm text-emerald-600 hover:underline">← 返回列表</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="总批次数" value={totalItems} color="bg-emerald-500" />
        <StatCard label="总库存量" value={totalQuantity} color="bg-blue-500" />
        <StatCard label="即将过期" value={expiringCount} color="bg-amber-500" />
        <StatCard label="已过期" value={expiredCount} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">按品类统计</h3>
          <div className="space-y-3">
            {Object.entries(byCategory).map(([cat, items]) => {
              const total = items.reduce((s, i) => s + i.quantity, 0)
              return (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{items.length} 批次</span>
                    <span className="text-sm font-medium text-gray-700">{total}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">按状态统计</h3>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, items]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  status === '在库' ? 'bg-emerald-100 text-emerald-700' :
                  status === '即将过期' ? 'bg-amber-100 text-amber-700' :
                  status === '已过期' ? 'bg-rose-100 text-rose-700' :
                  'bg-gray-100 text-gray-500'
                }`}>{status}</span>
                <span className="text-sm font-medium text-gray-700">{items.length} 批</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">供应商分布</h3>
        <div className="space-y-3">
          {Object.entries(bySupplier).map(([supplier, items]) => (
            <div key={supplier} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-600">{supplier}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{items.length} 批次</span>
                <Link to="/inventory" className="text-xs text-emerald-600 hover:underline">查看 →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`${color} h-1.5`} />
      <div className="p-5">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
      </div>
    </div>
  )
}
