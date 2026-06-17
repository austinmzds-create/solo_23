import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../store'
import type { InventoryStatus } from '../types'

export default function InventoryDetail() {
  const { id } = useParams<{ id: string }>()
  const { inventories, updateInventoryStatus } = useAppState()
  const navigate = useNavigate()
  const item = inventories.find(i => i.id === id)

  if (!item) return <p className="text-gray-500">未找到该库存记录</p>

  const statusOptions: InventoryStatus[] = ['在库', '即将过期', '已过期', '已用完']

  const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← 返回</button>
        <span className="text-gray-300">|</span>
        <Link to="/inventory" className="text-sm text-emerald-600 hover:underline">库存列表</Link>
        <Link to="/inventory/stats" className="text-sm text-emerald-600 hover:underline">库存统计</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-sm text-gray-400 mt-1">批次号: {item.batchNo}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            item.status === '在库' ? 'bg-emerald-100 text-emerald-700' :
            item.status === '即将过期' ? 'bg-amber-100 text-amber-700' :
            item.status === '已过期' ? 'bg-rose-100 text-rose-700' :
            'bg-gray-100 text-gray-500'
          }`}>{item.status}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DetailItem label="品类" value={item.category} />
          <DetailItem label="数量" value={`${item.quantity} ${item.unit}`} />
          <DetailItem label="供应商" value={item.supplier} />
          <DetailItem label="门店编号" value={item.storeId} />
          <DetailItem label="生产日期" value={item.productionDate} />
          <DetailItem label="到期日期" value={item.expiryDate} />
          <DetailItem label="距到期" value={`${daysUntilExpiry} 天`} highlight={daysUntilExpiry <= 7} />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">状态变更</h3>
          <div className="flex gap-2">
            {statusOptions.map(s => (
              <button
                key={s}
                disabled={item.status === s}
                onClick={() => updateInventoryStatus(item.id, s)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  item.status === s
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : s === '在库' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : s === '即将过期' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : s === '已过期' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-rose-600' : 'text-gray-700'}`}>{value}</p>
    </div>
  )
}
