import { createClient } from './server'
import { revalidatePath } from 'next/cache'

export async function getDashboardStats(shopId: string) {
  const supabase = await createClient()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // 1. Orders Today
  const { count: ordersToday } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)
    .gte('created_at', today.toISOString())

  // 2. Pending Orders
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)
    .eq('status', 'PENDING')

  // 3. In Printing
  const { count: printingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)
    .eq('status', 'PRINTING')

  // 4. Revenue Today
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('shop_id', shopId)
    .gte('created_at', today.toISOString())
  
  const revenueToday = revenueData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0

  return {
    ordersToday: ordersToday || 0,
    pendingOrders: pendingOrders || 0,
    printingOrders: printingOrders || 0,
    revenueToday: revenueToday
  }
}

export async function getRecentOrders(shopId: string, limit = 5) {
  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      mobile,
      total_amount,
      status,
      created_at,
      works (
        id,
        files (
          id,
          page_count
        )
      )
    `)
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return orders.map(order => ({
    id: order.id,
    customer: "Customer", // We don't have separate customer table, using mobile as identifier for now
    phone: order.mobile,
    files: order.works?.reduce((acc, work) => acc + (work.files?.length || 0), 0) || 0,
    pages: order.works?.reduce((acc, work) => acc + (work.files?.reduce((fAcc, f) => fAcc + (f.page_count || 0), 0) || 0), 0) || 0,
    status: order.status.toLowerCase(),
    amount: order.total_amount,
    time: formatTimeAgo(new Date(order.created_at))
  }))
}

export async function getOrdersOverTime(shopId: string) {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: orders } = await supabase
    .from('orders')
    .select('created_at')
    .eq('shop_id', shopId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: true })

  // Initialize 24 hours
  const hoursData: Record<string, number> = {}
  for (let i = 0; i < 24; i += 2) {
    const label = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`
    hoursData[label] = 0
  }

  orders?.forEach(order => {
    const date = new Date(order.created_at)
    const hour = date.getHours()
    const roundedHour = Math.floor(hour / 2) * 2
    const label = roundedHour === 0 ? "12 AM" : roundedHour < 12 ? `${roundedHour} AM` : roundedHour === 12 ? "12 PM" : `${roundedHour - 12} PM`
    if (hoursData[label] !== undefined) {
      hoursData[label]++
    }
  })

  return Object.entries(hoursData).map(([time, orders]) => ({ time, orders }))
}

export async function getShopByOwner(ownerId: string) {
  const supabase = await createClient()
  const { data: shop, error } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', ownerId)
    .single()
    
  if (error && error.code !== 'PGRST116') throw error
  return shop
}

export async function getShopData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  return getShopByOwner(user.id)
}

export async function createShop(shopData: {
  owner_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shops')
    .insert([shopData])
    .select()
    .single()
    
  if (error) throw error
  return data
}

export async function getPrinters(shopId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('printers')
    .select('*')
    .eq('shop_id', shopId)
    .order('name', { ascending: true })
    
  if (error) return []
  return data
}

export async function getNotifications(shopId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    
  if (error) return []
  return data
}

export async function getStaffProfiles(shopId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('shop_id', shopId)
    .order('name', { ascending: true })
    
  if (error) return []
  return data
}

export async function getCustomers(shopId: string) {
  const supabase = await createClient()
  // Derive customers from orders for now, or use a separate table if it exists
  const { data, error } = await supabase
    .from('orders')
    .select('mobile, status, total_amount, created_at')
    .eq('shop_id', shopId)
    
  if (error) return []
  
  // Aggregate by mobile
  const customerMap = new Map<string, any>()
  data?.forEach(order => {
    const existing = customerMap.get(order.mobile) || {
      phone: order.mobile,
      totalOrders: 0,
      totalSpend: 0,
      lastOrderDate: order.created_at
    }
    
    existing.totalOrders += 1
    existing.totalSpend += Number(order.total_amount)
    if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
      existing.lastOrderDate = order.created_at
    }
    customerMap.set(order.mobile, existing)
  })
  
  return Array.from(customerMap.values())
}

export async function getPricingRules(shopId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('shop_id', shopId)
    
  if (error) return []
  return data
}

export async function getTransactions(shopId: string, limit = 20) {
  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []

  return orders.map(order => ({
    id: `TXN-${order.id.slice(0, 4).toUpperCase()}`,
    orderId: `ORD-${order.id.slice(0, 4).toUpperCase()}`,
    customer: order.mobile,
    method: 'upi', // Default for now, as schema doesn't have payment_method
    amount: order.total_amount,
    status: order.payment_status.toLowerCase(),
    timestamp: order.created_at
  }))
}

export async function getReportData(shopId: string, days = 30) {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // 1. Revenue & Order Trends
  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, total_amount, status')
    .eq('shop_id', shopId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  // 2. Printer Utilization
  const { data: printers } = await supabase
    .from('printers')
    .select('name, queue_count')
    .eq('shop_id', shopId)

  const totalQueue = printers?.reduce((acc, p) => acc + (p.queue_count || 0), 0) || 1

  return {
    revenueData: aggregateTrend(orders || [], 'total_amount'),
    orderVolumeData: aggregateTrend(orders || [], 'count'),
    printerUtilization: printers?.map(p => ({
      name: p.name,
      value: Math.round(((p.queue_count || 0) / totalQueue) * 100),
      color: `oklch(${0.5 + Math.random() * 0.2} ${0.1 + Math.random() * 0.1} ${Math.random() * 360})`
    })) || []
  }
}

function aggregateTrend(data: any[], type: 'total_amount' | 'count') {
  const map: Record<string, number> = {}
  data.forEach(item => {
    const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (type === 'total_amount') {
      map[date] = (map[date] || 0) + Number(item.total_amount)
    } else {
      map[date] = (map[date] || 0) + 1
    }
  })
  return Object.entries(map).map(([date, value]) => ({ 
    date, 
    [type === 'total_amount' ? 'revenue' : 'orders']: value 
  }))
}

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  return date.toLocaleDateString()
}
