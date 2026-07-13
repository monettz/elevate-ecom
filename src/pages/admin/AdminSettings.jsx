import { useState } from 'react';
import { Save, Store, Mail, CreditCard, Shield } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Store },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'email', name: 'Email Settings', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Configure your store preferences and integrations</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
            
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Store Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
                      <input type="text" defaultValue="Elevate E-Commerce" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Store Contact Email</label>
                      <input type="email" defaultValue="support@elevate.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Store Description</label>
                      <textarea rows="3" defaultValue="The best online store for electronics and fashion." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Currency</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                        <option value="TZS">Tanzanian Shilling (TZS)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="KES">Kenyan Shilling (KES)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Timezone</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                        <option>Africa/Dar_es_Salaam</option>
                        <option>Africa/Nairobi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6 animate-fade-in text-center py-12">
                <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Payment Gateways</h3>
                <p className="text-gray-500 max-w-md mx-auto">Connect your store to local and international payment gateways like Stripe, PayPal, or Mobile Money APIs here.</p>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6 animate-fade-in text-center py-12">
                <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Email Configuration</h3>
                <p className="text-gray-500 max-w-md mx-auto">Configure your SMTP server settings to send order receipts, tracking info, and marketing emails to your customers.</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in text-center py-12">
                <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Security & Authentication</h3>
                <p className="text-gray-500 max-w-md mx-auto">Manage admin access, two-factor authentication (2FA), and active sessions to keep your store backend secure.</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm">
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
