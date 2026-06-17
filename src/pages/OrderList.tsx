import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../store'
import type { OrderPlatform, OrderStatus } from '../types'

const platforms: OrderPlatform[] = ['美团', '饿了么', '自建小程序']
const statuses: OrderStatus[] = ['待制作', '制作中', '待配送', '配送中', '已完成', '已取消']

export default function OrderList() {
  const { orders, addOrder } = useAppState()
  const [filterPlatform, setFilterPlatform] = useState<OrderPlatform | '全部'>('全部')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | '全部'>('全部')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = orders.filter(o =>
    (filterPlatform === '全部' || o.platform === filterPlatform) &&
    (filterStatus === '全部' || o.status === filterStatus)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value as OrderPlatform | '全部')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="全部">全部平台</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as OrderStatus | '全部')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="全部">全部状态</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Link to="/orders/stats" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">📊 统计</Link>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">+ 新增订单</button>
        </div>
      </div>

      {showAdd && <AddOrderForm onAdd={addOrder} onClose={() => setShowAdd(false)} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">订单号</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">平台</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">顾客</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">饮品</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">金额</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">状态</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.orderNo}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    o.platform === '美团' ? 'bg-yellow-100 text-yellow-700' :
                    o.platform === '饿了么' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{o.platform}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{o.customer}</td>
                <td className="px-4 py-3 text-gray-500">{o.items.map(i => `${i.name}×${i.quantity}`).join(', ')}</td>
                <td className="px-4 py-3 text-right text-gray-700 font-medium">¥{o.totalAmount}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    o.status === '已完成' ? 'bg-emerald-100 text-emerald-700' :
                    o.status === '已取消' ? 'bg-gray-100 text-gray-500' :
                    o.status === '配送中' ? 'bg-blue-100 text-blue-700' :
                    o.status === '制作中' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link to={`/orders/${o.id}`} className="text-emerald-600 hover:underline text-xs">详情</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">暂无数据</p>}
      </div>
    </div>
  )
}

function AddOrderForm({ onAdd, onClose }: { onAdd: (item: Omit<import('../types').DeliveryOrder, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    orderNo: '', platform: '美团' as OrderPlatform, customer: '', items: [{ name: '拿铁', quantity: 1, price: 32 }], totalAmount: 32, status: '待制作' as OrderStatus, createdAt: new Date().toISOString(), completedAt: '', rider: '', remark: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ ...form, totalAmount: form.items.reduce((s, i) => s + i.price * i.quantity, 0) })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-emerald-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-700">新增外卖订单</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <input required placeholder="订单号" value={form.orderNo} onChange={e => setForm({ ...form, orderNo: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value as OrderPlatform })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input required placeholder="顾客" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="骑手" value={form.rider} onChange={e => setForm({ ...form, rider: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="备注" value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">饮品明细</p>
        {form.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2">
            <input placeholder="饮品名" value={item.name} onChange={e => {
              const items = [...form.items]
              items[idx] = { ...items[idx]!, name: e.target.value }
              setForm({ ...form, items })
            }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="数量" value={item.quantity} onChange={e => {
              const items = [...form.items]
              items[idx] = { ...items[idx]!, quantity: Number(e.target.value) }
              setForm({ ...form, items })
            }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="单价" value={item.price} onChange={e => {
              const items = [...form.items]
              items[idx] = { ...items[idx]!, price: Number(e.target.value) }
              setForm({ ...form, items })
            }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <button type="button" onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })} className="text-rose-500 text-sm hover:underline">删除</button>
          </div>
        ))}
        <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { name: '', quantity: 1, price: 0 }] })} className="text-sm text-emerald-600 hover:underline">+ 添加饮品</button>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">确认新增</button>
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">取消</button>
      </div>
    </form>
  )
}
