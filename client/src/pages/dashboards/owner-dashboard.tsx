import { useAuth } from '@/contexts/auth-context';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddMenuItemDialog } from '@/components/add-menu-item-dialog';
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customerName: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  deliveryFee: string;
  categoryId: string;
  imageUrl: string | null;
  available: boolean;
  popular: boolean;
}

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes, menuItemsRes] = await Promise.all([
        fetch('/api/orders', { credentials: 'include' }),
        fetch('/api/users', { credentials: 'include' }),
        fetch('/api/menu-items'),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (menuItemsRes.ok) {
        const menuItemsData = await menuItemsRes.json();
        setMenuItems(menuItemsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="mt-4">Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{orders.length}</CardTitle>
              <CardDescription>Total Orders</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {orders.filter(o => o.status === 'pending').length}
              </CardTitle>
              <CardDescription>Pending Orders</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{users.length}</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.totalAmount} DT</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'refused' ? 'bg-red-100 text-red-800' :
                          order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => handleOrderAction(order.id, 'confirmed')}
                          className="flex-1"
                          size="sm"
                        >
                          Confirm Order
                        </Button>
                        <Button 
                          onClick={() => handleOrderAction(order.id, 'refused')}
                          variant="destructive"
                          className="flex-1"
                          size="sm"
                        >
                          Decline Order
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Menu Items Management</CardTitle>
              <CardDescription>Manage your restaurant menu items</CardDescription>
            </div>
            <AddMenuItemDialog onSuccess={fetchData} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : menuItems.length === 0 ? (
              <p className="text-center text-muted-foreground">No menu items yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Image</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Delivery Fee</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                              No img
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-2">{item.price} DT</td>
                        <td className="p-2">{item.deliveryFee} DT</td>
                        <td className="p-2 capitalize">{item.categoryId}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {item.available && (
                              <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                Available
                              </span>
                            )}
                            {item.popular && (
                              <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                Popular
                              </span>
                            )}
                            {!item.available && (
                              <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground">No users yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="p-2">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'livreur' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
