import type { InventoryBatch, QualityRecord, DeliveryOrder } from './types'

const today = new Date().toISOString().slice(0, 10)
const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}
const daysLater = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const initialInventories: InventoryBatch[] = [
  { id: 'inv-001', name: '埃塞俄比亚耶加雪菲', category: '咖啡豆', batchNo: 'BN-2026-0601', quantity: 50, unit: 'kg', supplier: '云南品源', productionDate: daysAgo(30), expiryDate: daysLater(60), status: '在库', storeId: 'S001' },
  { id: 'inv-002', name: '哥伦比亚慧兰', category: '咖啡豆', batchNo: 'BN-2026-0602', quantity: 30, unit: 'kg', supplier: '云南品源', productionDate: daysAgo(45), expiryDate: daysLater(45), status: '在库', storeId: 'S001' },
  { id: 'inv-003', name: '鲜牛奶', category: '牛奶', batchNo: 'BN-2026-0610', quantity: 200, unit: 'L', supplier: '光明乳业', productionDate: daysAgo(3), expiryDate: daysLater(10), status: '在库', storeId: 'S001' },
  { id: 'inv-004', name: '燕麦奶', category: '牛奶', batchNo: 'BN-2026-0611', quantity: 80, unit: 'L', supplier: 'OATLY', productionDate: daysAgo(10), expiryDate: daysLater(50), status: '在库', storeId: 'S001' },
  { id: 'inv-005', name: '香草糖浆', category: '糖浆', batchNo: 'BN-2026-0620', quantity: 15, unit: '瓶', supplier: '莫林', productionDate: daysAgo(60), expiryDate: daysLater(90), status: '在库', storeId: 'S001' },
  { id: 'inv-006', name: '焦糖糖浆', category: '糖浆', batchNo: 'BN-2026-0621', quantity: 8, unit: '瓶', supplier: '莫林', productionDate: daysAgo(90), expiryDate: daysLater(5), status: '即将过期', storeId: 'S001' },
  { id: 'inv-007', name: '12oz纸杯', category: '杯材', batchNo: 'BN-2026-0630', quantity: 3000, unit: '个', supplier: '鑫达包装', productionDate: daysAgo(15), expiryDate: daysLater(180), status: '在库', storeId: 'S001' },
  { id: 'inv-008', name: '16oz塑料杯', category: '杯材', batchNo: 'BN-2026-0631', quantity: 2000, unit: '个', supplier: '鑫达包装', productionDate: daysAgo(15), expiryDate: daysLater(180), status: '在库', storeId: 'S001' },
  { id: 'inv-009', name: '巴拿马瑰夏', category: '咖啡豆', batchNo: 'BN-2026-0640', quantity: 0, unit: 'kg', supplier: '云南品源', productionDate: daysAgo(120), expiryDate: daysAgo(30), status: '已过期', storeId: 'S001' },
  { id: 'inv-010', name: '椰浆', category: '其他', batchNo: 'BN-2026-0650', quantity: 0, unit: '罐', supplier: '椰树集团', productionDate: daysAgo(60), expiryDate: daysAgo(5), status: '已用完', storeId: 'S001' },
  { id: 'inv-011', name: '抹茶粉', category: '其他', batchNo: 'BN-2026-0651', quantity: 5, unit: 'kg', supplier: '京都宇治', productionDate: daysAgo(20), expiryDate: daysLater(100), status: '在库', storeId: 'S001' },
  { id: 'inv-012', name: '巧克力酱', category: '糖浆', batchNo: 'BN-2026-0660', quantity: 12, unit: '瓶', supplier: '莫林', productionDate: daysAgo(40), expiryDate: daysLater(3), status: '即将过期', storeId: 'S001' },
]

export const initialQualities: QualityRecord[] = [
  { id: 'qc-001', beverage: '美式咖啡', barista: '张明', temperature: 92, extractionTime: 25, tasteScore: 9, appearanceScore: 8, overallScore: 8.5, status: '合格', createdAt: `${today}T08:15:00`, remark: '' },
  { id: 'qc-002', beverage: '拿铁', barista: '李芳', temperature: 65, extractionTime: 22, tasteScore: 9, appearanceScore: 9, overallScore: 9.0, status: '合格', createdAt: `${today}T08:30:00`, remark: '' },
  { id: 'qc-003', beverage: '卡布奇诺', barista: '王磊', temperature: 63, extractionTime: 24, tasteScore: 7, appearanceScore: 6, overallScore: 6.5, status: '待复检', createdAt: `${today}T09:00:00`, remark: '奶泡不够细腻' },
  { id: 'qc-004', beverage: '燕麦拿铁', barista: '张明', temperature: 60, extractionTime: 23, tasteScore: 8, appearanceScore: 8, overallScore: 8.0, status: '合格', createdAt: `${today}T09:20:00`, remark: '' },
  { id: 'qc-005', beverage: '摩卡', barista: '李芳', temperature: 68, extractionTime: 28, tasteScore: 5, appearanceScore: 4, overallScore: 4.5, status: '不合格', createdAt: `${today}T09:45:00`, remark: '萃取过度，焦苦味重' },
  { id: 'qc-006', beverage: '冷萃咖啡', barista: '王磊', temperature: 8, extractionTime: 720, tasteScore: 9, appearanceScore: 9, overallScore: 9.0, status: '合格', createdAt: `${today}T10:00:00`, remark: '12小时冷萃' },
  { id: 'qc-007', beverage: '香草拿铁', barista: '张明', temperature: 64, extractionTime: 22, tasteScore: 8, appearanceScore: 8, overallScore: 8.0, status: '合格', createdAt: `${today}T10:30:00`, remark: '' },
  { id: 'qc-008', beverage: '焦糖玛奇朵', barista: '李芳', temperature: 66, extractionTime: 26, tasteScore: 7, appearanceScore: 7, overallScore: 7.0, status: '合格', createdAt: `${today}T11:00:00`, remark: '' },
  { id: 'qc-009', beverage: '抹茶拿铁', barista: '王磊', temperature: 62, extractionTime: 20, tasteScore: 6, appearanceScore: 5, overallScore: 5.5, status: '待复检', createdAt: `${today}T11:30:00`, remark: '抹茶沉淀不均匀' },
  { id: 'qc-010', beverage: '美式咖啡', barista: '张明', temperature: 91, extractionTime: 24, tasteScore: 9, appearanceScore: 9, overallScore: 9.0, status: '合格', createdAt: `${today}T13:00:00`, remark: '' },
  { id: 'qc-011', beverage: '拿铁', barista: '李芳', temperature: 64, extractionTime: 23, tasteScore: 8, appearanceScore: 8, overallScore: 8.0, status: '合格', createdAt: `${today}T13:30:00`, remark: '' },
  { id: 'qc-012', beverage: '椰子拿铁', barista: '王磊', temperature: 61, extractionTime: 22, tasteScore: 8, appearanceScore: 7, overallScore: 7.5, status: '合格', createdAt: `${today}T14:00:00`, remark: '' },
]

export const initialOrders: DeliveryOrder[] = [
  { id: 'ord-001', orderNo: 'MT-20260617001', platform: '美团', customer: '赵先生', items: [{ name: '美式咖啡', quantity: 2, price: 24 }, { name: '拿铁', quantity: 1, price: 32 }], totalAmount: 80, status: '已完成', createdAt: `${today}T08:00:00`, completedAt: `${today}T08:35:00`, rider: '刘骑手', remark: '' },
  { id: 'ord-002', orderNo: 'EL-20260617001', platform: '饿了么', customer: '钱女士', items: [{ name: '燕麦拿铁', quantity: 1, price: 36 }, { name: '抹茶拿铁', quantity: 1, price: 34 }], totalAmount: 70, status: '配送中', createdAt: `${today}T08:15:00`, completedAt: '', rider: '陈骑手', remark: '少冰' },
  { id: 'ord-003', orderNo: 'ZJ-20260617001', platform: '自建小程序', customer: '孙先生', items: [{ name: '冷萃咖啡', quantity: 1, price: 38 }], totalAmount: 38, status: '待制作', createdAt: `${today}T08:30:00`, completedAt: '', rider: '', remark: '' },
  { id: 'ord-004', orderNo: 'MT-20260617002', platform: '美团', customer: '李女士', items: [{ name: '摩卡', quantity: 2, price: 70 }, { name: '焦糖玛奇朵', quantity: 1, price: 36 }], totalAmount: 106, status: '制作中', createdAt: `${today}T08:45:00`, completedAt: '', rider: '', remark: '多加奶油' },
  { id: 'ord-005', orderNo: 'EL-20260617002', platform: '饿了么', customer: '周先生', items: [{ name: '拿铁', quantity: 3, price: 96 }], totalAmount: 96, status: '待配送', createdAt: `${today}T09:00:00`, completedAt: '', rider: '张骑手', remark: '公司订单' },
  { id: 'ord-006', orderNo: 'MT-20260617003', platform: '美团', customer: '吴女士', items: [{ name: '香草拿铁', quantity: 1, price: 34 }, { name: '美式咖啡', quantity: 1, price: 24 }], totalAmount: 58, status: '已完成', createdAt: `${today}T09:10:00`, completedAt: `${today}T09:45:00`, rider: '王骑手', remark: '' },
  { id: 'ord-007', orderNo: 'ZJ-20260617002', platform: '自建小程序', customer: '郑先生', items: [{ name: '卡布奇诺', quantity: 1, price: 32 }, { name: '椰子拿铁', quantity: 1, price: 36 }], totalAmount: 68, status: '已完成', createdAt: `${today}T09:20:00`, completedAt: `${today}T09:55:00`, rider: '赵骑手', remark: '' },
  { id: 'ord-008', orderNo: 'MT-20260617004', platform: '美团', customer: '王先生', items: [{ name: '拿铁', quantity: 2, price: 64 }], totalAmount: 64, status: '已取消', createdAt: `${today}T09:30:00`, completedAt: '', rider: '', remark: '顾客取消' },
  { id: 'ord-009', orderNo: 'EL-20260617003', platform: '饿了么', customer: '冯女士', items: [{ name: '燕麦拿铁', quantity: 2, price: 72 }, { name: '冷萃咖啡', quantity: 1, price: 38 }], totalAmount: 110, status: '待制作', createdAt: `${today}T10:00:00`, completedAt: '', rider: '', remark: '不要冰' },
  { id: 'ord-010', orderNo: 'ZJ-20260617003', platform: '自建小程序', customer: '陈先生', items: [{ name: '美式咖啡', quantity: 1, price: 24 }], totalAmount: 24, status: '制作中', createdAt: `${today}T10:15:00`, completedAt: '', rider: '', remark: '' },
  { id: 'ord-011', orderNo: 'MT-20260617005', platform: '美团', customer: '褚女士', items: [{ name: '抹茶拿铁', quantity: 1, price: 34 }, { name: '拿铁', quantity: 1, price: 32 }], totalAmount: 66, status: '已完成', createdAt: `${today}T10:30:00`, completedAt: `${today}T11:05:00`, rider: '刘骑手', remark: '' },
  { id: 'ord-012', orderNo: 'EL-20260617004', platform: '饿了么', customer: '卫先生', items: [{ name: '摩卡', quantity: 1, price: 35 }, { name: '焦糖玛奇朵', quantity: 2, price: 72 }], totalAmount: 107, status: '配送中', createdAt: `${today}T10:45:00`, completedAt: '', rider: '李骑手', remark: '加糖' },
  { id: 'ord-013', orderNo: 'MT-20260617006', platform: '美团', customer: '蒋女士', items: [{ name: '冷萃咖啡', quantity: 2, price: 76 }], totalAmount: 76, status: '待制作', createdAt: `${today}T11:00:00`, completedAt: '', rider: '', remark: '' },
  { id: 'ord-014', orderNo: 'ZJ-20260617004', platform: '自建小程序', customer: '沈先生', items: [{ name: '香草拿铁', quantity: 3, price: 102 }], totalAmount: 102, status: '制作中', createdAt: `${today}T11:15:00`, completedAt: '', rider: '', remark: '公司下午茶' },
  { id: 'ord-015', orderNo: 'MT-20260617007', platform: '美团', customer: '韩女士', items: [{ name: '拿铁', quantity: 1, price: 32 }, { name: '卡布奇诺', quantity: 1, price: 32 }], totalAmount: 64, status: '待配送', createdAt: `${today}T11:30:00`, completedAt: '', rider: '周骑手', remark: '' },
]
