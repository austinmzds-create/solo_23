import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import InventoryList from './pages/InventoryList'
import InventoryDetail from './pages/InventoryDetail'
import InventoryStats from './pages/InventoryStats'
import QualityList from './pages/QualityList'
import QualityDetail from './pages/QualityDetail'
import QualityStats from './pages/QualityStats'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import OrderStats from './pages/OrderStats'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/:id" element={<InventoryDetail />} />
        <Route path="inventory/stats" element={<InventoryStats />} />
        <Route path="quality" element={<QualityList />} />
        <Route path="quality/:id" element={<QualityDetail />} />
        <Route path="quality/stats" element={<QualityStats />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="orders/stats" element={<OrderStats />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
