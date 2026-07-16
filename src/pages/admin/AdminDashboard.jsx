import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { BarChart } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';

export default function AdminDashboard() {
  const { orders, customers } = useDataStore();

  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);

  const stats = [
    { name: 'Total Revenue', value: `TZS ${totalRevenue.toLocaleString()}`, change: '+0.0%', trend: 'up', icon: DollarSign },
    { name: 'Orders', value: orders.length.toString(), change: '+0.0%', trend: 'up', icon: ShoppingBag },
    { name: 'Customers', value: customers.length.toString(), change: '+0.0%', trend: 'up', icon: Users },
    { name: 'Active Now', value: '1', change: '0%', trend: 'up', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of your store's performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-2 min-h-[400px] flex flex-col items-center justify-center text-gray-400">
          <BarChart className="w-16 h-16 mb-4 opacity-50" />
          <p>Revenue Chart goes here</p>
        </div>

        {/* Recent Activity placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
          <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                <img src={(order.customer_avatar && !order.customer_avatar.includes('pravatar')) ? order.customer_avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name || 'U')}&background=random`} alt={order.customer_name} className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{order.customer_name}</p>
                  <p className="text-xs text-gray-500 truncate">{order.id}</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">TZS {Number(order.total).toLocaleString()}</div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-gray-500">No recent orders.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
