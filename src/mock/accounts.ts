export type UserRole = 'admin' | 'operator' | 'auditor'

export interface MockUser {
  username: string
  password: string
  name: string
  role: UserRole
  roleLabel: string
}

export const mockUsers: MockUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: '区域店长',
    role: 'admin',
    roleLabel: '管理员'
  },
  {
    username: 'operator',
    password: 'operator123',
    name: '门店班长',
    role: 'operator',
    roleLabel: '班长'
  },
  {
    username: 'auditor',
    password: 'auditor123',
    name: '品控稽核',
    role: 'auditor',
    roleLabel: '稽核员'
  }
]
