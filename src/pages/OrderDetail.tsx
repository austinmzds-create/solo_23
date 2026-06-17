import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../store'
import type { OrderStatus } from '../types'

const statusFlow: OrderStatus[] = ['待制作', '制作中', '待配送', '配送中', '已完成']

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { orders, updateOrderStatus } = useAppState()
  const navigate = useNavigate()
  const order = orders.find(o => o.id === id)

  if (!order) return <p className="text-gray-500">未找到该订单</p>

  const currentStep = statusFlow.indexOf(order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← 返回</button>
        <span className="text-gray-300">|</span>
        <Link to="/orders" className="text-sm text-emerald-600 hover:underline">订单列表</Link>
        <Link to="/orders/stats" className="text-sm text-emerald-600 hover:underline">订单统计</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{order.orderNo}</h2>
            <p className="text-sm text-gray-400 mt-1">{order.customer} · {order.platform}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            order.status === '已完成' ? 'bg-emerald-100 text-emerald-700' :
            order.status === '已取消' ? 'bg-gray-100 text-gray-500' :
            order.status === '配送中' ? 'bg-blue-100 text-blue-700' :
            order.status === '制作中' ? 'bg-purple-100 text-purple-700' :
            'bg-amber-100 text-amber-700'
          }`}>{order.status}</span>
        </div>

        {order.status !== '已取消' && (
          <div className="flex items-center mb-8 overflow-x-auto pb-2">
            {statusFlow.map((step, idx) => (
              <div key={step} className="flex items-center shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx < currentStep ? 'bg-emerald-500 text-white' :
                  idx === currentStep ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500' :
                  'bg-gray-100 text-gray-400'
                }`}>{idx + 1}</div>
                <span className={`text-xs ml-1 mr-3 ${idx <= currentStep ? 'text-emerald-600' : 'text-gray-400'}`}>{step}</span>
                {idx < statusFlow.length - 1 && <div className={`w-8 h-0.5 ${idx < currentStep ? 'bg-emerald-500' : 'bg-gray-200'} mr-3`} />}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">订单金额</p>
            <p className="text-xl font-bold text-gray-800">¥{order.totalAmount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">下单时间</p>
            <p className="text-sm font-medium text-gray-700">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">完成时间</p>
            <p className="text-sm font-medium text-gray-700">{order.completedAt ? new Date(order.completedAt).toLocaleString('zh-CN') : '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">骑手</p>
            <p className="text-sm font-medium text-gray-700">{order.rider || '-'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">饮品明细</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">饮品</th>
                  <th className="text-center px-4 py-2 text-gray-500 font-medium">数量</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">单价</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">小计</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-gray-700">{item.name}</td>
                    <td className="px-4 py-2 text-center text-gray-500">×{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-gray-500">¥{item.price}</td>
                    <td className="px-4 py-2 text-right text-gray-700 font-medium">¥{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order.remark && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-xs text-amber-600 font-medium mb-1">备注</p>
            <p className="text-sm text-amber-800">{order.remark}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">状态变更</h3>
          <div className="flex gap-2 flex-wrap">
            {(['待制作', '制作中', '待配送', '配送中', '已完成', '已取消'] as OrderStatus[]).map(s => (
              <button
                key={s}
                disabled={order.status === s}
                onClick={() => updateOrderStatus(order.id, s)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  order.status === s
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : s === '已完成' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : s === '已取消' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : s === '配送中' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : s === '制作中' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
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
