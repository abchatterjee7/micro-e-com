import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import ProductSlider from '../components/ProductSlider';

const ProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                    setFilteredProducts(res.data);
                } else {
                    console.warn("Products API returned non-array data:", res.data);
                    setProducts([]);
                    setFilteredProducts([]);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on search query
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search');
        
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [location.search, products]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="text-gray-500 text-xl animate-pulse">Loading products...</div>
            </div>
        );
    }

    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductSlider />
            
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Products'}
                </h1>
                {searchQuery && (
                    <p className="text-gray-600">
                        Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="text-center">
                        <p className="text-gray-500 text-xl mb-4">
                            {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
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

export default ProductList;
