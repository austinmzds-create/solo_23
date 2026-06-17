import { Link } from 'react-router-dom'
import { useAppState } from '../store'
import { groupByItems } from '../utils/groupBy'

export default function QualityStats() {
  const { qualities } = useAppState()

  const totalRecords = qualities.length
  const passCount = qualities.filter(q => q.status === '合格').length
  const failCount = qualities.filter(q => q.status === '不合格').length
  const recheckCount = qualities.filter(q => q.status === '待复检').length
  const passRate = totalRecords > 0 ? ((passCount / totalRecords) * 100).toFixed(1) : '0.0'

  const avgTaste = totalRecords > 0 ? (qualities.reduce((s, q) => s + q.tasteScore, 0) / totalRecords).toFixed(1) : '0.0'
  const avgAppearance = totalRecords > 0 ? (qualities.reduce((s, q) => s + q.appearanceScore, 0) / totalRecords).toFixed(1) : '0.0'
  const avgOverall = totalRecords > 0 ? (qualities.reduce((s, q) => s + q.overallScore, 0) / totalRecords).toFixed(1) : '0.0'

  const byBarista = groupByItems(qualities, q => q.barista)
  const byBeverage = groupByItems(qualities, q => q.beverage)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/quality" className="text-sm text-emerald-600 hover:underline">← 返回列表</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="品检总数" value={totalRecords} color="bg-emerald-500" />
        <StatCard label="合格率" value={`${passRate}%`} color="bg-blue-500" />
        <StatCard label="待复检" value={recheckCount} color="bg-amber-500" />
        <StatCard label="不合格" value={failCount} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-400 mb-2">平均口感评分</p>
          <p className="text-3xl font-bold text-gray-800">{avgTaste}</p>
          <p className="text-xs text-gray-400">/ 10</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-400 mb-2">平均外观评分</p>
          <p className="text-3xl font-bold text-gray-800">{avgAppearance}</p>
          <p className="text-xs text-gray-400">/ 10</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-400 mb-2">平均综合评分</p>
          <p className="text-3xl font-bold text-gray-800">{avgOverall}</p>
          <p className="text-xs text-gray-400">/ 10</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">按咖啡师统计</h3>
          <div className="space-y-3">
            {Object.entries(byBarista).map(([barista, records]) => {
              const passRate = ((records.filter(q => q.status === '合格').length / records.length) * 100).toFixed(0)
              const avgScore = (records.reduce((s, q) => s + q.overallScore, 0) / records.length).toFixed(1)
              return (
                <div key={barista} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-600">{barista}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{records.length} 杯</span>
                    <span className="text-xs text-emerald-600">合格 {passRate}%</span>
                    <span className="text-sm font-medium text-gray-700">均分 {avgScore}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">按饮品统计</h3>
          <div className="space-y-3">
            {Object.entries(byBeverage).map(([beverage, records]) => {
              const avgScore = (records.reduce((s, q) => s + q.overallScore, 0) / records.length).toFixed(1)
              return (
                <div key={beverage} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-600">{beverage}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{records.length} 杯</span>
                    <span className="text-sm font-medium text-gray-700">均分 {avgScore}</span>
                    <Link to="/quality" className="text-xs text-emerald-600 hover:underline">查看 →</Link>
                  </div>
                </div>
              )
            })}
          </div>
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
