import { useState } from 'react';
import { Search, Eye, Filter, Download, MoreVertical, X, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../../lib/supabase';
import { useDataStore } from '../../store/useDataStore';

const StatusBadge = ({ status }) => {
  const styles = {
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
    'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
    'Shipped': 'bg-purple-100 text-purple-800 border-purple-200',
    'Out for Delivery': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
  };
  
  const icons = {
    'Delivered': <CheckCircle size={14} className="mr-1" />,
    'Processing': <Clock size={14} className="mr-1" />,
    'Shipped': <Truck size={14} className="mr-1" />,
    'Out for Delivery': <MapPin size={14} className="mr-1" />,
    'Pending': <Clock size={14} className="mr-1" />,
    'Cancelled': <X size={14} className="mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default function AdminOrders() {
  const { orders, fetchAdminData } = useDataStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Orders Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 30);
      
      // Table data
      const tableColumn = ["Order ID", "Customer", "Date", "Total (TZS)", "Status", "Coupon"];
      const tableRows = [];

      orders.forEach(order => {
        const orderData = [
          order.id,
          order.customer_name,
          format(new Date(order.date), 'yyyy-MM-dd'),
          order.total.toLocaleString(undefined, {minimumFractionDigits: 2}),
          order.status,
          order.coupon_code ? `${order.coupon_code} (-${order.discount_amount})` : 'None'
        ];
        tableRows.push(orderData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] }, // primary blue
      });

      doc.save('orders_report.pdf');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Error generating PDF: ' + error.message);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const updatePayload = { status: newStatus };
    const now = new Date().toISOString();
    
    if (newStatus === 'Processing') updatePayload.processing_date = now;
    if (newStatus === 'Shipped') updatePayload.shipped_date = now;
    if (newStatus === 'Out for Delivery') updatePayload.out_for_delivery_date = now;
    if (newStatus === 'Delivered') updatePayload.delivered_date = now;

    const { error } = await supabase.from('orders').update(updatePayload).eq('id', orderId);
    
    if (error) {
      console.error('Error updating status:', error);
      alert(`Failed to update status. Please make sure you have run the SQL snippet in your Supabase dashboard to create the missing timestamp columns!\\n\\nError: ${error.message}`);
      return;
    }

    await fetchAdminData();
    
    // Update the modal's state so it reflects instantly while open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, ...updatePayload });
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchTerms = search.toLowerCase().trim();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerms) || 
      (order.customer_name || '').toLowerCase().includes(searchTerms) ||
      (order.customer_email || '').toLowerCase().includes(searchTerms);
      
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    if (searchTerms === '') return matchesStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-4 justify-between bg-gray-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Name, or Email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4 font-medium text-primary hover:underline">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={(order.customer_avatar && !order.customer_avatar.includes('pravatar')) ? order.customer_avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name || 'U')}&background=random`} alt={order.customer_name} className="w-8 h-8 rounded-full border border-gray-200" />
                        <div>
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-xs text-gray-500">{order.customer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div>{format(new Date(order.date), 'MMM dd, yyyy')}</div>
                      <div className="text-xs">{format(new Date(order.date), 'hh:mm a')}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      TZS {order.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No orders found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedOrder.id}</h3>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {format(new Date(selectedOrder.date), 'MMMM dd, yyyy')} at {format(new Date(selectedOrder.date), 'hh:mm a')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors bg-white shadow-sm border border-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-8 flex-1 custom-scrollbar">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h4>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <img src={(selectedOrder.customer_avatar && !selectedOrder.customer_avatar.includes('pravatar')) ? selectedOrder.customer_avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedOrder.customer_name || 'U')}&background=random`} alt={selectedOrder.customer_name} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-full">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-medium block mb-1">{selectedOrder.customer_name}</span>
                      {(selectedOrder.address || '').split(', ').map((line, i) => (
                        <span key={i} className="block text-gray-500">{line}</span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                  <ul className="divide-y divide-gray-100">
                    {(selectedOrder.order_items || []).map((item, idx) => (
                      <li key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × TZS {item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                        <div className="font-bold text-gray-900">
                          TZS {(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-5 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-1 pb-2 border-b border-gray-100">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-medium">TZS {(selectedOrder.order_items || []).reduce((acc, item) => acc + (item.quantity * item.price), 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    {selectedOrder.coupon_code && (
                      <div className="flex justify-between items-center text-sm text-emerald-600 mb-2 border-b border-gray-200 pb-2">
                        <span className="font-medium">Coupon Applied ({selectedOrder.coupon_code})</span>
                        <span className="font-medium">- TZS {Number(selectedOrder.discount_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Paid</span>
                      <span className="text-xl font-bold text-primary">TZS {selectedOrder.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 ml-2">Update Status:</span>
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors bg-white border border-gray-200 shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
