import { useState } from 'react';
import { Search, Plus, Edit2, Image as ImageIcon, Upload, X, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useDataStore } from '../../store/useDataStore';

export default function AdminMedia() {
  const { banners, fetchAllData } = useDataStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta: '',
    type: 'Side Banner',
    bgColor: 'bg-gray-100',
    image: null
  });

  const filteredBanners = banners.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.discount || '',
        cta: banner.button_text || '',
        type: banner.placement_type || 'Horizontal Promo',
        bgColor: banner.bg_color || '',
        image: banner.image || ''
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        cta: '',
        type: 'Horizontal Promo',
        bgColor: 'bg-gray-100',
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bannerData = {
      title: formData.title,
      discount: formData.subtitle,
      bg_color: formData.bgColor,
      image: formData.image,
      button_text: formData.cta,
      placement_type: formData.type
    };

    const { error } = editingBanner
      ? await supabase.from('promotional_banners').update(bannerData).eq('id', editingBanner.id)
      : await supabase.from('promotional_banners').insert(bannerData);
      
    if (error) {
      console.error('Error saving banner:', error);
      alert(`Failed to save banner: ${error.message}\n\nMake sure you ran the SQL snippet to add the new columns!`);
      return;
    }
    
    await fetchAllData();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this promotional banner?')) {
      await supabase.from('promotional_banners').delete().eq('id', id);
      await fetchAllData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media & Banners</h2>
          <p className="text-gray-500 text-sm mt-1">Manage promotional banners, offers, and popup media</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search banners by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Preview</th>
              <th className="px-6 py-4">Banner Content</th>
              <th className="px-6 py-4">Placement Type</th>
              <th className="px-6 py-4">Background</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBanners.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                    {banner.image ? (
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-full h-full p-4 text-gray-400" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 mb-1">{banner.title}</div>
                  <div className="text-xs text-gray-500 font-medium">{banner.discount}</div>
                  {banner.button_text && (
                    <div className="text-xs text-blue-600 font-medium mt-1 uppercase">{banner.button_text}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800`}>
                    {banner.placement_type || 'Promo Banner'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full border border-gray-200 ${banner.bg_color}`}></span>
                    <span className="text-xs text-gray-500">{banner.bg_color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(banner)} 
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors title='Edit'"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)} 
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors title='Delete'"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredBanners.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No banners found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="text-primary" size={20} />
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors bg-white shadow-sm border border-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Banner Graphic</label>
                <div className="flex items-start gap-6">
                  <div className="w-40 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 relative group">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="text-white" size={24} />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={32} />
                        <span className="text-xs font-medium">Upload</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-sm font-medium text-gray-900 mb-1">Upload banner graphic.</p>
                    <p className="text-xs text-gray-500 mb-4">Recommended size: 1200x400px (Horizontal) or 400x400px (Side). Max size: 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Winter Sale (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle / Offer Text</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Up to 50% Off (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Button Text (CTA)</label>
                  <input
                    type="text"
                    name="cta"
                    value={formData.cta}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Shop Now (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Placement Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="Side Banner">Side Banner (Right of Hero)</option>
                    <option value="Horizontal Promo">Horizontal Promo (Below Deals)</option>
                    <option value="Hero Slider">Main Hero Slider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Background Color Code</label>
                  <input
                    type="text"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. bg-rose-50 or #ff0000"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-700 font-bold hover:bg-gray-200 rounded-lg transition-colors bg-white border border-gray-200 shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
