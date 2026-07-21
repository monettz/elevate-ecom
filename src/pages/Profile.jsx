import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, User, MapPin, CreditCard, ChevronRight, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, isLoaded, isSignedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Redirect if not logged in
  if (isLoaded && !isSignedIn) {
    navigate('/login');
    return null;
  }

  if (!isLoaded || !user) return null;

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Profile editing state
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalMsg, setPersonalMsg] = useState('');

  // Address editing state
  const [address, setAddress] = useState(user?.user_metadata?.address || '');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');

  const handleUpdatePersonal = async () => {
    setIsSavingPersonal(true);
    setPersonalMsg('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName }
      });
      if (error) throw error;
      setPersonalMsg('Information updated successfully!');
    } catch (e) {
      setPersonalMsg('Error updating information.');
    }
    setIsSavingPersonal(false);
  };

  const handleUpdateAddress = async () => {
    setIsSavingAddress(true);
    setAddressMsg('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { address }
      });
      if (error) throw error;
      setAddressMsg('Address updated successfully!');
    } catch (e) {
      setAddressMsg('Error updating address.');
    }
    setIsSavingAddress(false);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const fetchOrders = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, order_items(*)`)
          .eq('customer_email', user.email)
          .order('date', { ascending: false });
          
        if (!error && data) {
          setOrders(data);
        }
        setIsLoadingOrders(false);
      };
      fetchOrders();
    }
  }, [isLoaded, isSignedIn, user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle size={18} className="text-emerald-500" />;
      case 'Shipped': return <Truck size={18} className="text-blue-500" />;
      case 'Processing': return <Clock size={18} className="text-amber-500" />;
      default: return <Package size={18} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'Shipped': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Processing': return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your account details, orders, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="w-16 h-16 bg-primary text-white rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold">
                {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" /> : (user?.user_metadata?.first_name ? user.user_metadata.first_name.charAt(0) : 'U')}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition ${activeTab === 'personal' ? 'bg-gray-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
              >
                <div className="flex items-center gap-3"><User size={20} /> Personal Info</div>
                {activeTab === 'personal' && <ChevronRight size={16} />}
              </button>
              
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition ${activeTab === 'orders' ? 'bg-gray-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
              >
                <div className="flex items-center gap-3"><Package size={20} /> My Orders</div>
                {activeTab === 'orders' && <ChevronRight size={16} />}
              </button>

              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition ${activeTab === 'addresses' ? 'bg-gray-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
              >
                <div className="flex items-center gap-3"><MapPin size={20} /> Addresses</div>
                {activeTab === 'addresses' && <ChevronRight size={16} />}
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 font-medium rounded-lg transition"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-3">
          
          {/* PERSONAL INFO TAB */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" readOnly value={user?.email || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-gray-500" />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly here for security reasons.</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button 
                  onClick={handleUpdatePersonal}
                  disabled={isSavingPersonal}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition shadow-sm disabled:opacity-50"
                >
                  {isSavingPersonal ? 'Saving...' : 'Save Changes'}
                </button>
                {personalMsg && <span className={`text-sm font-medium ${personalMsg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{personalMsg}</span>}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                  <p className="text-sm text-gray-500 mt-1">Track, return, or buy items again.</p>
                </div>
                <div className="text-sm text-gray-500">
                  {isLoadingOrders ? 'Loading...' : `${orders.length} Orders found`}
                </div>
              </div>

              {isLoadingOrders ? (
                <div className="text-center py-12 text-gray-500">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">You haven't placed any orders yet.</div>
              ) : orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 sm:px-6 border-b border-border flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-6 sm:gap-12 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Order Placed</p>
                        <p className="font-bold text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Total</p>
                        <p className="font-bold text-gray-900">TZS {Number(order.total).toLocaleString()}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-gray-500 mb-1">Order #</p>
                        <p className="font-bold text-gray-900">{order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">TZS {Number(item.price).toLocaleString()}</p>
                          </div>
                          <div className="hidden sm:flex flex-col justify-center gap-2">
                            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">
                              Buy It Again
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-200 transition">
                              View Item
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:hidden gap-2">
                      <Link to={`/order-tracking/${order.id}`} className="w-full px-4 py-3 bg-primary text-white flex items-center justify-center gap-2 text-sm font-bold rounded-lg hover:bg-blue-700 transition">
                        <Truck size={16} /> Track Package
                      </Link>
                      <Link to={`/invoice/${order.id}`} className="w-full px-4 py-3 bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold rounded-lg hover:bg-gray-200 transition">
                        View Invoice
                      </Link>
                    </div>

                    <div className="hidden sm:flex mt-6 pt-6 border-t border-gray-100 justify-end gap-3">
                       <Link to={`/order-tracking/${order.id}`} className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-primary hover:border-primary transition flex items-center gap-2">
                        <Truck size={16} /> Track Package
                      </Link>
                      <Link to={`/invoice/${order.id}`} className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-primary hover:border-primary transition flex items-center justify-center">
                        View Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Primary Shipping Address</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address (Street, City, Zip, Country)</label>
                  <textarea 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    rows={4}
                    placeholder="e.g. 456 Residential Avenue, Apt 2B, Brooklyn, NY 11201, United States"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none" 
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button 
                  onClick={handleUpdateAddress}
                  disabled={isSavingAddress}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                >
                  {isSavingAddress ? 'Saving...' : 'Save Address'}
                </button>
                {addressMsg && <span className={`text-sm font-medium ${addressMsg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{addressMsg}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
