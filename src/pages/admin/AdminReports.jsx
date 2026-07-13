import { Activity, DollarSign, Users, ShoppingCart, Download, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';
import { useDataStore } from '../../store/useDataStore';

export default function AdminReports() {
  const { orders, customers } = useDataStore();
  
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
  const totalOrders = orders.length;
  const activeCustomers = customers.length;
  
  // Chart Data Processing
  const salesByDate = orders.reduce((acc, order) => {
    const dateStr = format(new Date(order.date), 'MMM dd');
    if (!acc[dateStr]) acc[dateStr] = 0;
    acc[dateStr] += Number(order.total);
    return acc;
  }, {});
  
  const salesData = Object.entries(salesByDate)
    .map(([date, total]) => ({ date, total }))
    .slice(-7); // Last 7 days of activity
    
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  const COLORS = {
    'Delivered': '#22c55e',
    'Processing': '#3b82f6',
    'Shipped': '#a855f7',
    'Pending': '#eab308',
    'Cancelled': '#ef4444',
    'Out for Delivery': '#6366f1'
  };

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name] || '#94a3b8'
  }));
  
  const handleDownload = () => {
    const csvContent = `data:text/csv;charset=utf-8,Metric,Value\nTotal Revenue,TZS ${totalRevenue}\nTotal Orders,${totalOrders}\nActive Customers,${activeCustomers}\nConversion Rate,4.8%`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "store_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">Track your store's performance and growth</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: `TZS ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50', trend: '+15.2%' },
          { title: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+5.4%' },
          { title: 'Active Customers', value: activeCustomers.toString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', trend: '+12.1%' },
          { title: 'Conversion Rate', value: '4.8%', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50', trend: '-1.2%' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sales Over Time</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `TZS ${value/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`TZS ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No sales data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Orders by Status</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '14px', paddingTop: '20px'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No order data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
