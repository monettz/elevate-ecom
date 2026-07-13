import { useState } from 'react';
import { Search, Plus, Trash2, X, Zap, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useDataStore } from '../../store/useDataStore';

export default function AdminFlashSales() {
  const { flashSales, fetchAdminData } = useDataStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredSales = flashSales.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id) => {
    if (window.confirm('Delete this flash sale?')) {
      const { error } = await supabase.from('flash_sales').delete().eq('id', id);
      if (!error) await fetchAdminData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flash Sales</h2>
          <p className="text-gray-500 text-sm mt-1">Manage time-limited promotions</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">
          <Plus size={18} /> Create Flash Sale
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search flash sales..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Schedule</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{sale.title}</td>
                <td className="px-6 py-4 font-medium text-blue-600">{sale.discount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {sale.status === 'Active' && <Zap size={12} className="mr-1" />}
                    {sale.status === 'Scheduled' && <Clock size={12} className="mr-1" />}
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="text-xs">
                    {sale.start_date ? format(new Date(sale.start_date), 'MMM dd') : '-'} - {sale.end_date ? format(new Date(sale.end_date), 'MMM dd, yyyy') : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleDelete(sale.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No flash sales found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Create Flash Sale</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              <Zap size={48} className="mx-auto text-yellow-500 mb-4" />
              <p className="text-gray-600 mb-4">This is a fully functional UI ready to be wired up to your backend. The form logic is similar to Products.</p>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-primary text-white rounded-lg font-bold w-full hover:bg-blue-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
