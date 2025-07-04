import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  PhoneIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { clientService } from '../services/clientService';
import { billingService } from '../services/billingService';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function Dashboard() {
  const { data: clientsData } = useQuery({
    queryKey: ['clients', 'stats'],
    queryFn: () => clientService.getClients({ limit: 5 }),
  });

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices', 'recent'],
    queryFn: () => billingService.getInvoices({ limit: 5 }),
  });

  const stats = [
    {
      name: 'Total Clients',
      value: clientsData?.total || 0,
      icon: UserGroupIcon,
      href: '/clients',
    },
    {
      name: 'Active Numbers',
      value: '24',
      icon: PhoneIcon,
      href: '/phone-numbers',
    },
    {
      name: 'Monthly Revenue',
      value: '$4,250',
      icon: CurrencyDollarIcon,
      href: '/billing',
    },
    {
      name: 'Usage This Month',
      value: '12,450 min',
      icon: ChartBarIcon,
      href: '/billing',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Bowery Platform. Here's an overview of your business.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Clients */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Clients
            </h3>
            <div className="mt-5">
              {clientsData?.clients.length === 0 ? (
                <p className="text-sm text-gray-500">No clients yet</p>
              ) : (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {clientsData?.clients.map((client) => (
                      <li key={client.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {client.businessName}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {client.clientCode}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                client.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : client.status === 'suspended'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {client.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6">
                <Link
                  to="/clients"
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View all clients
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Invoices
            </h3>
            <div className="mt-5">
              {invoicesData?.invoices.length === 0 ? (
                <p className="text-sm text-gray-500">No invoices yet</p>
              ) : (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {invoicesData?.invoices.map((invoice) => (
                      <li key={invoice.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              Due {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${invoice.totalAmount.toFixed(2)}
                            </p>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                invoice.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : invoice.status === 'overdue'
                                  ? 'bg-red-100 text-red-800'
                                  : invoice.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6">
                <Link
                  to="/billing"
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View all invoices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}