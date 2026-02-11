import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { user, isAdmin } = useContext(AuthContext);
  const pageSize = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/orders?page=${currentPage - 1}&size=${pageSize}`);
        const data = response.data;
        
        if (data && typeof data === 'object') {
          // Handle Spring Data Page format
          setOrders(data.content || []);
          setTotalPages(data.totalPages || 1);
          setTotalOrders(data.totalElements || 0);
        } else if (Array.isArray(data)) {
          setOrders(data);
          setTotalPages(1);
          setTotalOrders(data.length);
        } else {
          console.warn("Orders API returned unexpected data:", data);
          setOrders([]);
          setTotalPages(1);
          setTotalOrders(0);
        }
      } catch (error: any) {
        console.error("Failed to fetch orders", error);
        if (error.code === 'ERR_NETWORK') {
          console.error("Network error: Is the API Gateway (port 8095) running?");
        }
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, currentPage]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-gray-500 text-xl">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your order history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No orders yet.</p>
          <p className="text-gray-400 mt-2">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left font-semibold">Order ID</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Date</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Items</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Total</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Status</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Payment ID</th>
                {isAdmin && <th className="py-3 px-4 border-b text-left font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">#{order.id}</td>
                  <td className="py-3 px-4 border-b">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-600">
                        Order items not available in current response
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b font-semibold">N/A</td>
                  <td className="py-3 px-4 border-b">
                    {isAdmin ? (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingOrderId === order.id}
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(order.status)}`}
                      >
                        <option value="PENDING">⚪ Pending</option>
                        <option value="PROCESSING">🟡 Processing</option>
                        <option value="SHIPPED">🔵 Shipped</option>
                        <option value="DELIVERED">🟢 Delivered</option>
                        <option value="CANCELLED">🔴 Cancelled</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status === 'DELIVERED' && '🟢 '}
                        {order.status === 'SHIPPED' && '🔵 '}
                        {order.status === 'PROCESSING' && '🟡 '}
                        {order.status === 'PENDING' && '⚪ '}
                        {order.status === 'CANCELLED' && '🔴 '}
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-500">
                    N/A
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        disabled={updatingOrderId === order.id || order.status === 'CANCELLED'}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {updatingOrderId === order.id ? 'Updating...' : 'Cancel'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalOrders} orders)
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
