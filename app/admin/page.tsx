'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalOrders}
                </p>
              </div>
              <ShoppingBagIcon className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
                </p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.pendingOrders}
                </p>
              </div>
              <ClockIcon className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipped Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.shippedOrders}
                </p>
              </div>
              <TruckIcon className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/products/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/products"
              className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Dropshipping Platform</h3>
          <p className="text-blue-800">
            This admin panel allows you to manage your dropshipping e-commerce store.
            Add products from your suppliers, manage orders, and track shipments all in one place.
          </p>
          <ul className="mt-4 space-y-2 text-blue-800">
            <li>• Add products with supplier information</li>
            <li>• Track orders and update shipping status</li>
            <li>• Manage customer information</li>
            <li>• Monitor revenue and sales metrics</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
