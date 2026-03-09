'use client'

import React, { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/image'

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  image: string | null;
  categoryId: string | null;
  category: Category;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  stripeSessionId: string | null;
  shippingName: string | null;
  shippingEmail: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
  user: {
    email: string;
    name: string | null;
  };
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'orders'>('categories');
  
  // Category State
  const { data: categories, mutate: mutateCategories } = useSWR<Category[]>('/api/categories', fetcher);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string>('');
  
  // Product State
  const { data: products, mutate: mutateProducts } = useSWR<Product[]>('/api/products', fetcher);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    categoryId: '',
    image: ''
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Orders State
  const { data: orders, mutate: mutateOrders } = useSWR<Order[]>('/api/admin/orders', fetcher);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string>('');
  
  // Refs for scrolling to forms
  const categoryFormRef = useRef<HTMLDivElement>(null);
  const productFormRef = useRef<HTMLDivElement>(null);
  
  // Scroll to form when editing
  useEffect(() => {
    if (activeTab === 'categories' && editingCategoryId) {
      categoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingCategoryId, activeTab]);
  
  useEffect(() => {
    if (activeTab === 'products' && editingProductId) {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingProductId, activeTab]);

  // Category Image Handling
  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  // Upload Image to Cloudinary
  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.url;
      } else {
        alert('Image upload failed: ' + data.error);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Category CRUD Operations
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = categoryForm.image;
    if (categoryImageFile) {
      const uploadedUrl = await uploadImage(categoryImageFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    const dataToSend = {
      ...categoryForm,
      image: imageUrl
    };

    if (editingCategoryId) {
      await fetch(`/api/categories/${editingCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      mutateCategories();
      resetCategoryForm();
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      mutateCategories();
      resetCategoryForm();
    }
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description,
      image: category.image
    });
    setCategoryImagePreview(category.image);
    setEditingCategoryId(category.id);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    mutateCategories();
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', image: '' });
    setEditingCategoryId(null);
    setCategoryImageFile(null);
    setCategoryImagePreview('');
  };

  // Product CRUD Operations
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = productForm.image || '';
    
    if (productImageFiles.length > 0) {
      const uploadedUrl = await uploadImage(productImageFiles[0]);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const dataToSend = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      inventory: parseInt(productForm.inventory),
      categoryId: productForm.categoryId,
      image: imageUrl
    };

    if (editingProductId) {
      await fetch(`/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      mutateProducts();
      resetProductForm();
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      mutateProducts();
      resetProductForm();
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      inventory: product.inventory.toString(),
      categoryId: product.categoryId || '',
      image: product.image || ''
    });
    setProductImagePreviews(product.image ? [product.image] : []);
    setEditingProductId(product.id);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    mutateProducts();
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      inventory: '',
      categoryId: '',
      image: ''
    });
    setEditingProductId(null);
    setProductImageFiles([]);
    setProductImagePreviews([]);
  };

  // Orders CRUD Operations
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        mutateOrders();
        setUpdatingStatus('');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-amber-200">
        <button
          onClick={() => setActiveTab('categories')}
          className={`relative px-6 py-3 font-semibold transition-colors duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-amber-600 after:origin-left after:transition-transform after:duration-300 after:ease-out
            ${
              activeTab === 'categories'
                ? 'text-amber-600 after:scale-x-100'
                : 'text-gray-500 hover:text-gray-900 after:scale-x-0'
            }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`relative px-6 py-3 font-semibold transition-colors duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-amber-600 after:origin-left after:transition-transform after:duration-300 after:ease-out
            ${
              activeTab === 'products'
                ? 'text-amber-600 after:scale-x-100'
                : 'text-gray-500 hover:text-gray-900 after:scale-x-0'
            }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`relative px-6 py-3 font-semibold transition-colors duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-amber-600 after:origin-left after:transition-transform after:duration-300 after:ease-out
            ${
              activeTab === 'orders'
                ? 'text-amber-600 after:scale-x-100'
                : 'text-gray-500 hover:text-gray-900 after:scale-x-0'
            }`}
        >
          Orders
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          {/* Category Form */}
          <div ref={categoryFormRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingCategoryId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {categoryImagePreview && (
                  <div className="mt-4 relative w-32 h-32">
                    <Image
                      src={categoryImagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-(--primary) text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingCategoryId ? 'Update Category' : 'Add Category'}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image || '/placeholder.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {/* Product Form */}
          <div ref={productFormRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingProductId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">What is your Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Inventory</label>
                  <input
                    type="number"
                    value={productForm.inventory}
                    onChange={(e) => setProductForm({ ...productForm, inventory: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                >
                  <option value="">Select a category</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProductImageFiles([file]);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProductImagePreviews([reader.result as string]);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {productImagePreviews.length > 0 && (
                  <div className="mt-4 relative w-32 h-32">
                    <Image
                      src={productImagePreviews[0]}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-red-300 text-black px-6 py-2 rounded-full hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingProductId ? 'Update Product' : 'Add Product'}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="bg-primary text-black px-6 py-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-(--primary) font-bold mb-1">${product.price}</p>
                  <p className="text-sm text-gray-500 mb-2">Stock: {product.inventory}</p>
                  <p className="text-sm text-gray-500 mb-4">Category: {product.category?.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
          
          {!orders ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-3 text-left font-semibold text-sm">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Shipping Address</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(orders) && orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{order.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm">{order.user?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{order.user?.email || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-bold text-(--primary)">${typeof order.total === 'string' ? parseFloat(order.total).toFixed(2) : order.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          disabled={updatingOrderId === order.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.shippingAddress ? (
                          <div className="text-xs">
                            <p>{order.shippingAddress}</p>
                            <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                            <p>{order.shippingCountry}</p>
                          </div>
                        ) : (
                          <p className="text-gray-400">No address</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-xs">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
