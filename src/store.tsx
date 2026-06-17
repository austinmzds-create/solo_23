import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AppState, InventoryBatch, QualityRecord, DeliveryOrder, InventoryStatus, QualityStatus, OrderStatus } from './types'
import { initialInventories, initialQualities, initialOrders } from './mockData'

const AppContext = createContext<AppState | null>(null)

let nextInvId = 13
let nextQcId = 13
let nextOrdId = 16

export function AppProvider({ children }: { children: ReactNode }) {
  const [inventories, setInventories] = useState<InventoryBatch[]>(initialInventories)
  const [qualities, setQualities] = useState<QualityRecord[]>(initialQualities)
  const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders)

  const addInventory = useCallback((item: Omit<InventoryBatch, 'id'>) => {
    setInventories(prev => [...prev, { ...item, id: `inv-${String(nextInvId++).padStart(3, '0')}` }])
  }, [])

  const updateInventoryStatus = useCallback((id: string, status: InventoryStatus) => {
    setInventories(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }, [])

  const addQuality = useCallback((item: Omit<QualityRecord, 'id'>) => {
    setQualities(prev => [...prev, { ...item, id: `qc-${String(nextQcId++).padStart(3, '0')}` }])
  }, [])

  const updateQualityStatus = useCallback((id: string, status: QualityStatus) => {
    setQualities(prev => prev.map(q => q.id === id ? { ...q, status } : q))
  }, [])

  const addOrder = useCallback((item: Omit<DeliveryOrder, 'id'>) => {
    setOrders(prev => [...prev, { ...item, id: `ord-${String(nextOrdId++).padStart(3, '0')}` }])
  }, [])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }, [])

  return (
    <AppContext.Provider value={{ inventories, qualities, orders, addInventory, updateInventoryStatus, addQuality, updateQualityStatus, addOrder, updateOrderStatus }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}
