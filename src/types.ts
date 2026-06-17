export type InventoryStatus = '在库' | '即将过期' | '已过期' | '已用完'
export type InventoryCategory = '咖啡豆' | '牛奶' | '糖浆' | '杯材' | '其他'
export type QualityStatus = '合格' | '待复检' | '不合格'
export type OrderPlatform = '美团' | '饿了么' | '自建小程序'
export type OrderStatus = '待制作' | '制作中' | '待配送' | '配送中' | '已完成' | '已取消'

export interface InventoryBatch {
  id: string
  name: string
  category: InventoryCategory
  batchNo: string
  quantity: number
  unit: string
  supplier: string
  productionDate: string
  expiryDate: string
  status: InventoryStatus
  storeId: string
}

export interface QualityRecord {
  id: string
  beverage: string
  barista: string
  temperature: number
  extractionTime: number
  tasteScore: number
  appearanceScore: number
  overallScore: number
  status: QualityStatus
  createdAt: string
  remark: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface DeliveryOrder {
  id: string
  orderNo: string
  platform: OrderPlatform
  customer: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  completedAt: string
  rider: string
  remark: string
}

export interface AppState {
  inventories: InventoryBatch[]
  qualities: QualityRecord[]
  orders: DeliveryOrder[]
  addInventory: (item: Omit<InventoryBatch, 'id'>) => void
  updateInventoryStatus: (id: string, status: InventoryStatus) => void
  addQuality: (item: Omit<QualityRecord, 'id'>) => void
  updateQualityStatus: (id: string, status: QualityStatus) => void
  addOrder: (item: Omit<DeliveryOrder, 'id'>) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
}
