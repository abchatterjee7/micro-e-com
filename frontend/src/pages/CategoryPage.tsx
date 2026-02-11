import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                
                console.log('CategoryPage: Fetching for category:', categoryName);
                
                // Fetch all categories to find category details
                const categoriesResponse = await api.get('/categories');
                const categories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
                console.log('Available categories:', categories.map(c => c.name));
                
                const foundCategory = categories.find(cat => 
                    cat.name.toLowerCase() === categoryName?.toLowerCase()
                );
                
                console.log('Found category:', foundCategory);
                
                if (foundCategory) {
                    setCategory(foundCategory);
                }
                
                // Fetch all products and filter by category on frontend
                const productsResponse = await api.get('/products');
                if (Array.isArray(productsResponse.data)) {
                    console.log('All products count:', productsResponse.data.length);
                    const filteredProducts = productsResponse.data.filter(product => {
                        console.log('Product category:', product.category, 'Looking for:', categoryName);
                        return product.category && product.category.toLowerCase() === categoryName?.toLowerCase();
                    });
                    console.log('Filtered products:', filteredProducts);
                    setProducts(filteredProducts);
                } else {
                    console.warn("Products API returned non-array data:", productsResponse.data);
                    setProducts([]);
                }
            } catch (error: any) {
                console.error("Failed to fetch category products", error);
                if (error.code === 'ERR_NETWORK') {
                    console.error("Network error: Is the API Gateway (port 8095) running?");
                }
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (categoryName) {
            fetchCategoryProducts();
        }
    }, [categoryName]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="text-gray-500 text-xl animate-pulse">Loading {categoryName} products...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link to="/" className="text-pink-500 hover:underline">Home</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 capitalize">{categoryName}</span>
            </div>

            {/* Category Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 capitalize">
                    {category?.name || categoryName}
                </h1>
                {category?.description && (
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {category.description}
                    </p>
                )}
                <p className="text-gray-500 mt-2">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="text-center">
                        <p className="text-gray-500 text-xl mb-4">
                            No products found in {categoryName} category.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition-colors"
                        >
                            Browse All Products
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="w-full h-56 bg-gray-100 flex justify-center items-center">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="object-contain h-full"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-4 text-lg font-medium">₹{product.price}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        Stock: {product.stock || 0}
                                    </span>
                                    {product.stock > 0 ? (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="mt-auto inline-block text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
