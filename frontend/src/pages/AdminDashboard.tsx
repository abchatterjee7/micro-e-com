import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const [categories, setCategories] = useState<any[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await api.get('/categories');
            console.log("Categories response:", response.data);
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.warn("Categories API returned non-array data:", response.data);
                setCategories([]);
            }
        } catch (error: any) {
            console.error("Failed to fetch categories", error);
            if (error.code === 'ERR_NETWORK') {
                console.error("Network error: Is the API Gateway (port 8095) running?");
            }
            setCategories([]);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return alert("Please enter a category name");

        setIsCreatingCategory(true);
        try {
            console.log("Creating category:", newCategoryName);
            const res = await api.post('/categories', { name: newCategoryName });
            console.log("Category created res:", res.data);
            alert('Category created successfully!');
            setNewCategoryName('');
            fetchCategories();
        } catch (error: any) {
            console.error("Failed to create category", error);
            const msg = error.response?.data?.message || error.message || "Unknown error";
            alert('Failed to create category: ' + msg);
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingProduct(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);
        if (image) formData.append('image', image);

        try {
            console.log("Adding product...");
            await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Product added successfully!');
            
            // Clear form fields after successful submission
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setStock('');
            setImage(null);
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
            
        } catch (error: any) {
            console.error("Failed to add product", error);
            const msg = error.response?.data?.message || error.message || "Unknown error";
            alert('Failed to add product: ' + msg);
        } finally {
            setIsAddingProduct(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <form onSubmit={handleCreateCategory} className="bg-white p-6 rounded shadow-md max-w-lg mb-8">
                <h2 className="text-xl mb-4">Create Category</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="New Category Name"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        className="flex-1 border p-2 rounded"
                        disabled={isCreatingCategory}
                    />
                    <button
                        type="submit"
                        disabled={isCreatingCategory}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                    >
                        {isCreatingCategory ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-lg">
                <h2 className="text-xl mb-4">Add Product</h2>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 mb-2 rounded" />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 mb-2 rounded" />
                <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full border p-2 mb-2 rounded" />
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full border p-2 mb-2 rounded"
                    required
                >
                    <option value="">{isLoadingCategories ? 'Loading...' : 'Select Category'}</option>
                    {Array.isArray(categories) && categories.map((cat) => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="w-full border p-2 mb-2 rounded" required />
                <input type="file" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} className="w-full border p-2 mb-2 rounded" />
                <button
                    type="submit"
                    disabled={isAddingProduct}
                    className="bg-green-500 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
                >
                    {isAddingProduct ? 'Adding...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AdminDashboard;
