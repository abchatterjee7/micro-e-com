import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const OrderSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home after 5 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="container mx-auto p-4">
            <div className="text-center py-16">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-xl text-gray-600 mb-4">Thank you for your order.</p>
                <p className="text-gray-500 mb-8">Your order has been placed successfully and will be delivered soon.</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                    
                    <button 
                        onClick={() => navigate('/history')}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition-colors ml-4"
                    >
                        View Order History
                    </button>
                </div>
                
                <p className="text-sm text-gray-400 mt-8">
                    You will be redirected to the homepage automatically in 5 seconds...
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;
