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
  const myOrders = orders.filter(o => o.status !== 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
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
            <CardDescription>Orders waiting for confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : pendingOrders.length === 0 ? (
              <p className="text-center text-muted-foreground">No pending orders</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">Tel: {order.customerPhone}</p>
                        {order.deliveryAddress && (
                          <p className="text-sm text-muted-foreground">Address: {order.deliveryAddress}</p>
                        )}
                      </div>
                      <p className="font-bold text-lg">{order.totalAmount} DT</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        onClick={() => handleOrderAction(order.id, 'confirmed')}
                        className="flex-1"
                      >
                        Confirm
                      </Button>
                      <Button 
                        onClick={() => handleOrderAction(order.id, 'refused')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Refuse
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
            <CardDescription>Orders you've confirmed</CardDescription>
          </CardHeader>
          <CardContent>
            {myOrders.length === 0 ? (
              <p className="text-center text-muted-foreground">No confirmed deliveries yet</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.totalAmount} DT</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'refused' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
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
