import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { path: '/', label: '运营总览', icon: '📊' },
  { path: '/inventory', label: '库存批次', icon: '📦' },
  { path: '/quality', label: '出杯品控', icon: '☕' },
  { path: '/orders', label: '外卖订单', icon: '🛵' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const getTitle = () => {
    if (location.pathname === '/') return '运营总览'
    if (location.pathname.startsWith('/inventory')) return '库存批次'
    if (location.pathname.startsWith('/quality')) return '出杯品控'
    if (location.pathname.startsWith('/orders')) return '外卖订单'
    return '青禾咖啡'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-emerald-900 text-white flex flex-col transition-all duration-200 shrink-0`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-emerald-800">
          {sidebarOpen && <span className="text-lg font-bold tracking-wide">🌿 青禾咖啡</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-emerald-300 hover:text-white p-1">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive ? 'bg-emerald-700 text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-emerald-800 text-xs text-emerald-400">
          {sidebarOpen && '门店: 望京SOHO店'}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">{getTitle()}</h1>
          <span className="text-sm text-gray-400">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
