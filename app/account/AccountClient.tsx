'use client';

import { useUser } from '@clerk/nextjs';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

interface Order {
  id: string;
  sessionId: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserRole {
  userId: string;
  role: string;
  email: string;
  name: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AccountClient() {
  const { user, isLoaded } = useUser();
  const { data: userData, error: userError } = useSWR<UserRole>('/api/user/role', fetcher);
  const { data: orders, error: ordersError } = useSWR<Order[]>('/api/orders', fetcher);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="text-[#7d3d23] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#7d3d23] mb-8">
          My Account
        </h1>

        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#7d3d23] mb-4">
            Profile Information
          </h2>
          <div className="flex items-center gap-4 mb-4">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-lg font-medium text-[#2C2C2C]">
                {user?.fullName || userData?.name || 'Guest User'}
              </p>
              <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              {userData?.role && (
                <p className="text-sm text-[#7d3d23] font-medium mt-1">
                  Role: {userData.role}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#7d3d23] mb-4">
            Order History
          </h2>

          {ordersError && (
            <div className="text-red-600 p-4 bg-red-50 rounded-md">
              Failed to load orders. Please try again later.
            </div>
          )}

          {!orders && !ordersError && (
            <div className="text-gray-600">Loading orders...</div>
          )}

          {orders && orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Link
                href="/products"
                className="inline-block bg-[#7d3d23] hover:bg-[#6a3320] text-white font-semibold py-2 px-6 rounded-full transition duration-200"
              >
                Start Shopping
              </Link>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                    <div>
                      <p className="font-semibold text-[#2C2C2C]">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <p className="font-semibold text-[#7d3d23]">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className={`text-sm font-medium ${
                        order.status === 'DELIVERED' ? 'text-green-600' :
                        order.status === 'SHIPPED' ? 'text-blue-600' :
                        order.status === 'PROCESSING' ? 'text-yellow-600' :
                        order.status === 'CANCELLED' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.id}`}
                        className="flex items-center gap-3 py-2 border-t border-gray-100"
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#2C2C2C]">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-[#7d3d23]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
