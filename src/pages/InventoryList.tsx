import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../store'
import type { InventoryCategory, InventoryStatus } from '../types'

const categories: InventoryCategory[] = ['咖啡豆', '牛奶', '糖浆', '杯材', '其他']
const statuses: InventoryStatus[] = ['在库', '即将过期', '已过期', '已用完']

export default function InventoryList() {
  const { inventories, addInventory } = useAppState()
  const [filterCat, setFilterCat] = useState<InventoryCategory | '全部'>('全部')
  const [filterStatus, setFilterStatus] = useState<InventoryStatus | '全部'>('全部')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = inventories.filter(i =>
    (filterCat === '全部' || i.category === filterCat) &&
    (filterStatus === '全部' || i.status === filterStatus)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value as InventoryCategory | '全部')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="全部">全部品类</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as InventoryStatus | '全部')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="全部">全部状态</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Link to="/inventory/stats" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">📊 统计</Link>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">+ 新增批次</button>
        </div>
      </div>

      {showAdd && <AddInventoryForm onAdd={addInventory} onClose={() => setShowAdd(false)} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">原料名称</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">品类</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">批次号</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">数量</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">供应商</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">到期日</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">状态</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700">{i.name}</td>
                <td className="px-4 py-3 text-gray-500">{i.category}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i.batchNo}</td>
                <td className="px-4 py-3 text-right text-gray-700">{i.quantity} {i.unit}</td>
                <td className="px-4 py-3 text-gray-500">{i.supplier}</td>
                <td className="px-4 py-3 text-gray-500">{i.expiryDate}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    i.status === '在库' ? 'bg-emerald-100 text-emerald-700' :
                    i.status === '即将过期' ? 'bg-amber-100 text-amber-700' :
                    i.status === '已过期' ? 'bg-rose-100 text-rose-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{i.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link to={`/inventory/${i.id}`} className="text-emerald-600 hover:underline text-xs">详情</Link>
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

function AddInventoryForm({ onAdd, onClose }: { onAdd: (item: Omit<import('../types').InventoryBatch, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', category: '咖啡豆' as InventoryCategory, batchNo: '', quantity: 0, unit: 'kg', supplier: '', productionDate: '', expiryDate: '', status: '在库' as InventoryStatus, storeId: 'S001',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ ...form, quantity: Number(form.quantity) })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-emerald-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-700">新增库存批次</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <input required placeholder="原料名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as InventoryCategory })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input required placeholder="批次号" value={form.batchNo} onChange={e => setForm({ ...form, batchNo: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="number" placeholder="数量" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="单位" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required placeholder="供应商" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="date" value={form.productionDate} onChange={e => setForm({ ...form, productionDate: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">确认新增</button>
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">取消</button>
      </div>
    </form>
  )
}
