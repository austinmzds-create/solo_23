import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../store'
import type { QualityStatus } from '../types'

const statuses: QualityStatus[] = ['合格', '待复检', '不合格']

export default function QualityList() {
  const { qualities, addQuality } = useAppState()
  const [filterStatus, setFilterStatus] = useState<QualityStatus | '全部'>('全部')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = qualities.filter(q => filterStatus === '全部' || q.status === filterStatus)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as QualityStatus | '全部')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="全部">全部状态</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Link to="/quality/stats" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">📊 统计</Link>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">+ 新增品检</button>
        </div>
      </div>

      {showAdd && <AddQualityForm onAdd={addQuality} onClose={() => setShowAdd(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(q => (
          <Link key={q.id} to={`/quality/${q.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">{q.beverage}</p>
                <p className="text-xs text-gray-400 mt-0.5">{q.barista} · {new Date(q.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                q.status === '合格' ? 'bg-emerald-100 text-emerald-700' :
                q.status === '不合格' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>{q.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-400">口感</p>
                <p className="text-lg font-bold text-gray-700">{q.tasteScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">外观</p>
                <p className="text-lg font-bold text-gray-700">{q.appearanceScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">综合</p>
                <p className={`text-lg font-bold ${q.overallScore >= 8 ? 'text-emerald-600' : q.overallScore >= 6 ? 'text-amber-600' : 'text-rose-600'}`}>{q.overallScore}</p>
              </div>
            </div>
            {q.remark && <p className="text-xs text-gray-400 mt-3 italic">"{q.remark}"</p>}
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-400 py-8">暂无数据</p>}
    </div>
  )
}

function AddQualityForm({ onAdd, onClose }: { onAdd: (item: Omit<import('../types').QualityRecord, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    beverage: '', barista: '', temperature: 0, extractionTime: 0, tasteScore: 8, appearanceScore: 8, overallScore: 8, status: '合格' as QualityStatus, createdAt: new Date().toISOString().slice(0, 16), remark: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ ...form, temperature: Number(form.temperature), extractionTime: Number(form.extractionTime), tasteScore: Number(form.tasteScore), appearanceScore: Number(form.appearanceScore), overallScore: Number(form.overallScore), createdAt: new Date(form.createdAt).toISOString() })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-emerald-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-700">新增品控记录</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <input required placeholder="饮品名称" value={form.beverage} onChange={e => setForm({ ...form, beverage: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required placeholder="咖啡师" value={form.barista} onChange={e => setForm({ ...form, barista: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="number" placeholder="温度(℃)" value={form.temperature || ''} onChange={e => setForm({ ...form, temperature: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="number" placeholder="萃取时间(s)" value={form.extractionTime || ''} onChange={e => setForm({ ...form, extractionTime: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="number" min="1" max="10" placeholder="口感评分" value={form.tasteScore} onChange={e => setForm({ ...form, tasteScore: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="number" min="1" max="10" placeholder="外观评分" value={form.appearanceScore} onChange={e => setForm({ ...form, appearanceScore: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input required type="number" min="1" max="10" placeholder="综合评分" value={form.overallScore} onChange={e => setForm({ ...form, overallScore: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="备注" value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">确认新增</button>
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">取消</button>
      </div>
    </form>
  )
}
