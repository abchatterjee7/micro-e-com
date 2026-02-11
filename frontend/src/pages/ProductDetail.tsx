import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Failed to fetch product", error);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        // Simple local storage cart for demo
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-8">
                <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} className="w-1/2 rounded shadow" />
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-xl text-gray-700 mb-4">₹{product.price}</p>
                    <p className="mb-4">{product.description}</p>
                    <p className="mb-4 text-sm text-gray-500">Category: {product.category}</p>
                    <p className="mb-4 text-sm text-gray-500">Stock: {product.stock}</p>
                    <button onClick={addToCart} className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-700">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
