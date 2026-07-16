import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, Upload, X, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useDataStore } from '../../store/useDataStore';

export default function AdminProducts() {
  const { products, fetchProducts, categories } = useDataStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: categories?.length > 0 ? categories[0].name : '',
    image: null,
    badge: '',
    isNew: false,
    isBestDeal: false,
    isTrending: false,
    stock: '',
    description: ''
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) await fetchProducts();
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        oldPrice: product.old_price || '',
        category: product.category,
        image: product.image,
        badge: product.badge || '',
        isNew: product.is_new || false,
        isBestDeal: product.is_best_deal || false,
        isTrending: product.is_trending || false,
        stock: product.stock || 0,
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        category: categories?.length > 0 ? categories[0].name : '',
        image: null,
        badge: '',
        isNew: false,
        isBestDeal: false,
        isTrending: false,
        stock: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Mutually exclusive placements
      if (name === 'isBestDeal' && checked) {
        newData.isTrending = false;
      }
      if (name === 'isTrending' && checked) {
        newData.isBestDeal = false;
      }
      
      return newData;
    });
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
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
      category: formData.category,
      image: formData.image,
      badge: formData.badge,
      is_new: formData.isNew,
      is_best_deal: formData.isBestDeal,
      is_trending: formData.isTrending,
      stock: Number(formData.stock),
      description: formData.description
    };

    const { error } = editingProduct
      ? await supabase.from('products').update(productData).eq('id', editingProduct.id)
      : await supabase.from('products').insert(productData);
      
    if (error) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message}\n\nIf the error mentions missing columns, make sure you ran the SQL snippet in your Supabase dashboard!`);
      return;
    }
    
    await fetchProducts();
    handleCloseModal();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your catalog, pricing, and inventory</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (TZS)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-full h-full p-3 text-gray-400" />
                          )}
                        </div>
                        <div className="font-medium text-gray-900 max-w-[200px] truncate" title={product.name}>
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.price.toLocaleString()}</div>
                      {product.old_price && (
                        <div className="text-xs text-gray-400 line-through">{product.old_price.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors title='Edit'"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors title='Delete'"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No products found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors bg-white shadow-sm border border-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar p-6">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Product Image</label>
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 relative group">
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
                      <p className="text-sm font-medium text-gray-900 mb-1">Upload a high-quality product image.</p>
                      <p className="text-xs text-gray-500 mb-4">Recommended size: 800x800px. Max size: 2MB.</p>
                      <label className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer shadow-sm transition-colors inline-block">
                        Choose File
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Sony Alpha a7 IV"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (TZS) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. 3500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Old Price (TZS)</label>
                    <input
                      type="number"
                      name="oldPrice"
                      min="0"
                      value={formData.oldPrice}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Optional, for discounts"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. 50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Badge Text</label>
                    <input
                      type="text"
                      name="badge"
                      value={formData.badge}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Sale, Hot, 20% Off"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 mt-8 md:col-span-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleFormChange}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm font-bold text-gray-700">Mark as "New"</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isBestDeal"
                        checked={formData.isBestDeal}
                        onChange={handleFormChange}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm font-bold text-gray-700">Show in "Today's Best Deals"</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleFormChange}
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-bold text-gray-700">Show in "Trending Products"</span>
                    </label>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter detailed product description..."
                    ></textarea>
                  </div>

                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-700 font-bold hover:bg-gray-200 rounded-lg transition-colors bg-white border border-gray-200 shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="productForm"
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
