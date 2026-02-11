import { Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    }, []);

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b py-4">
                            <div className="flex items-center gap-4">
                                <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <h2 className="text-xl font-semibold">{item.name}</h2>
                                    <p>₹{item.price}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(index)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-700 cursor-pointer outline-2 outline-offset-2 outline-pink-500 hover:bg-black px-2 py-1"
                            >
                                <Trash className="inline-block" />
                                <span>Remove</span>
                            </button>

                        </div>
                    ))}
                    <div className="mt-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Total: ₹{total}</h2>
                        <Link to="/checkout" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
