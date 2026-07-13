import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/ui/Logo';

export default function Invoice() {
  const { id } = useParams();
  const orderId = id || "ORD-847291";
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', orderId).single();
      if (data) setOrder(data);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading invoice...</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-red-500">Invoice not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link to="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition shadow-sm"
        >
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      {/* Invoice Document */}
      <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-8 mb-8 gap-6">
          <div>
            <div className="mb-4">
              <Logo className="origin-left scale-[1.2]" variant="horizontal" />
            </div>
            <p className="text-gray-500 text-sm">Elevate store<br/>s.l.p 76909<br/>0752391788<br/>kinondooni</p>
          </div>
          <div className="md:text-right">
            <h1 className="text-3xl font-light text-gray-300 mb-2 uppercase tracking-widest">Invoice</h1>
            <p className="font-bold text-gray-900"># {order.id}</p>
            <p className="text-gray-500 text-sm mt-1">Date: {format(new Date(order.date), 'MMMM dd, yyyy')}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="mb-10">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipped To</h3>
            <p className="font-bold text-gray-900">{order.customer_name}</p>
            <p className="text-gray-500 text-sm mt-1">
              {(order.address || '').split(', ').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-sm">
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider">Description</th>
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-center">Qty</th>
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-right">Unit Price</th>
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(order.order_items || []).map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-4 text-gray-600 text-center">{item.quantity}</td>
                  <td className="py-4 text-gray-600 text-right">TZS {item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-4 font-bold text-gray-900 text-right">TZS {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span>
              <span>TZS {order.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Tax (0%)</span>
              <span>TZS 0</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-gray-900 pt-3 mt-3">
              <span className="font-bold text-lg text-gray-900">Total Due</span>
              <span className="font-bold text-2xl text-gray-900">TZS {order.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
          <p className="font-medium text-gray-900 mb-1">Thank you for your business!</p>
          <p>If you have any questions about this invoice, please contact support@elevate.com</p>
        </div>
      </div>
    </div>
  );
}
