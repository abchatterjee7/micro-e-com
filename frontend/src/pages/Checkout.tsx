import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(AuthContext);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum: number, item: any) => sum + item.price, 0);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handlePayment = () => {
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
            alert('Razorpay SDK not loaded. Please refresh the page and try again.');
            return;
        }

        // Get Razorpay key from environment
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        
        if (!razorpayKey || razorpayKey === 'undefined') {
            alert('Payment configuration error. Razorpay key is not configured properly.');
            console.error('Environment variables:', import.meta.env);
            return;
        }

        const options = {
            key: razorpayKey,
            amount: total * 100, // Amount in paise (INR)
            currency: "INR",
            name: "MicroEcom",
            description: "Purchase of items",
            image: "/logo.png",
            handler: function (response: any) {
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                localStorage.removeItem('cart');
                navigate('/order-success');
            },
            prefill: {
                name: user?.firstName || user?.username || "Customer",
                email: user?.email || "customer@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#ec4899" // Pink color to match theme
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment modal dismissed');
                },
                escape: true,
                backdropclose: true
            }
        };

        try {
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();
        } catch (error) {
            console.error('Razorpay initialization error:', error);
            alert('Payment initialization failed. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="mb-6">Please login to proceed with checkout.</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
                <h2 className="text-xl mb-4">Order Summary</h2>
                <p className="mb-4">Total Items: {cart.length}</p>
                <p className="text-2xl font-bold mb-6">Total Amount: ₹{total.toFixed(2)}</p>
                <button 
                    onClick={handlePayment} 
                    className="w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600 transition-colors font-semibold"
                >
                    Pay with Razorpay
                </button>
            </div>
        </div>
    );
};

export default Checkout;
