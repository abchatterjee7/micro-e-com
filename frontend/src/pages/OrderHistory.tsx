const OrderHistory = () => {
  const orders = [
    { id: '1001', date: '2026-01-01', status: 'Delivered', total: '₹120.00' },
    { id: '1002', date: '2026-01-03', status: 'Shipped', total: '₹75.00' },
    { id: '1003', date: '2026-01-05', status: 'Processing', total: '₹50.00' },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Order History</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border rounded overflow-hidden">
          <thead className="bg-blue-200">
            <tr>
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="py-2 px-4 border">{order.id}</td>
                <td className="py-2 px-4 border">{order.date}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">{order.total}</td>
                <td className="py-2 px-4 border">
                  <button className="text-blue-500 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
