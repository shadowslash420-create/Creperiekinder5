import { useAuth } from '@/contexts/auth-context';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  status: string;
  totalAmount: string;
  items: string;
  createdAt: Date;
}

export default function LivreurDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const myOrders = orders.filter(o => o.status !== 'pending' && o.status !== 'refused');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="mt-4">Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{pendingOrders.length}</CardTitle>
              <CardDescription>Pending Orders</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{myOrders.length}</CardTitle>
              <CardDescription>My Deliveries</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
            <CardDescription>New orders waiting for your confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : pendingOrders.length === 0 ? (
              <p className="text-center text-muted-foreground">No pending orders</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-lg">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          📞 {order.customerPhone}
                        </p>
                        {order.deliveryAddress && (
                          <p className="text-sm text-muted-foreground mt-1">
                            📍 {order.deliveryAddress}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Type: <span className="font-medium">{order.orderType}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Ordered: {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-bold text-xl">{order.totalAmount} DT</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        onClick={() => handleOrderAction(order.id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Accept & Deliver
                      </Button>
                      <Button 
                        onClick={() => handleOrderAction(order.id, 'refused')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Deliveries</CardTitle>
            <CardDescription>Orders you've accepted for delivery</CardDescription>
          </CardHeader>
          <CardContent>
            {myOrders.length === 0 ? (
              <p className="text-center text-muted-foreground">No confirmed deliveries yet</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          📞 {order.customerPhone}
                        </p>
                        {order.deliveryAddress && (
                          <p className="text-sm text-muted-foreground mt-1">
                            📍 {order.deliveryAddress}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.totalAmount} DT</p>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.status === 'confirmed' && (
                      <div className="mt-3">
                        <Button 
                          onClick={() => handleOrderAction(order.id, 'delivered')}
                          className="w-full"
                          size="sm"
                        >
                          Mark as Delivered
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
