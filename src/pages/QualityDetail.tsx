import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../store'
import type { QualityStatus } from '../types'

export default function QualityDetail() {
  const { id } = useParams<{ id: string }>()
  const { qualities, updateQualityStatus } = useAppState()
  const navigate = useNavigate()
  const item = qualities.find(q => q.id === id)

  if (!item) return <p className="text-gray-500">未找到该品控记录</p>

  const statusOptions: QualityStatus[] = ['合格', '待复检', '不合格']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← 返回</button>
        <span className="text-gray-300">|</span>
        <Link to="/quality" className="text-sm text-emerald-600 hover:underline">品控列表</Link>
        <Link to="/quality/stats" className="text-sm text-emerald-600 hover:underline">品控统计</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{item.beverage}</h2>
            <p className="text-sm text-gray-400 mt-1">{item.barista} · {new Date(item.createdAt).toLocaleString('zh-CN')}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            item.status === '合格' ? 'bg-emerald-100 text-emerald-700' :
            item.status === '不合格' ? 'bg-rose-100 text-rose-700' :
            'bg-amber-100 text-amber-700'
          }`}>{item.status}</span>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">口感评分</p>
            <p className={`text-4xl font-bold ${item.tasteScore >= 8 ? 'text-emerald-600' : item.tasteScore >= 6 ? 'text-amber-600' : 'text-rose-600'}`}>{item.tasteScore}</p>
            <p className="text-xs text-gray-400 mt-1">/ 10</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">外观评分</p>
            <p className={`text-4xl font-bold ${item.appearanceScore >= 8 ? 'text-emerald-600' : item.appearanceScore >= 6 ? 'text-amber-600' : 'text-rose-600'}`}>{item.appearanceScore}</p>
            <p className="text-xs text-gray-400 mt-1">/ 10</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">综合评分</p>
            <p className={`text-4xl font-bold ${item.overallScore >= 8 ? 'text-emerald-600' : item.overallScore >= 6 ? 'text-amber-600' : 'text-rose-600'}`}>{item.overallScore}</p>
            <p className="text-xs text-gray-400 mt-1">/ 10</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">温度</p>
            <p className="text-sm font-medium text-gray-700">{item.temperature}℃</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">萃取时间</p>
            <p className="text-sm font-medium text-gray-700">{item.extractionTime}s</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">咖啡师</p>
            <p className="text-sm font-medium text-gray-700">{item.barista}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">记录时间</p>
            <p className="text-sm font-medium text-gray-700">{new Date(item.createdAt).toLocaleString('zh-CN')}</p>
          </div>
        </div>

        {item.remark && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-xs text-amber-600 font-medium mb-1">备注</p>
            <p className="text-sm text-amber-800">{item.remark}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">状态变更</h3>
          <div className="flex gap-2">
            {statusOptions.map(s => (
              <button
                key={s}
                disabled={item.status === s}
                onClick={() => updateQualityStatus(item.id, s)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  item.status === s
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : s === '合格' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : s === '不合格' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
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
