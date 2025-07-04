import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tab } from '@headlessui/react';
import { 
  PhoneIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  CogIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { clientService } from '../services/clientService';
import { phoneNumberService } from '../services/phoneNumberService';
import { billingService } from '../services/billingService';
import { usageService } from '../services/usageService';
import { format, subDays } from 'date-fns';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id!),
    enabled: !!id,
  });

  const { data: phoneNumbers } = useQuery({
    queryKey: ['phoneNumbers', id],
    queryFn: () => phoneNumberService.getClientNumbers(id!),
    enabled: !!id,
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => billingService.getInvoices({ clientId: id }),
    enabled: !!id,
  });

  const { data: usageStats } = useQuery({
    queryKey: ['usageStats', id],
    queryFn: () => usageService.getClientUsageStats(
      id!,
      subDays(new Date(), 30).toISOString(),
      new Date().toISOString()
    ),
    enabled: !!id,
  });

  if (clientLoading) {
    return <div className="text-center py-8">Loading client details...</div>;
  }

  if (!client) {
    return <div className="text-center py-8">Client not found</div>;
  }

  const tabs = [
    { name: 'Overview', icon: ChartBarIcon },
    { name: 'Phone Numbers', icon: PhoneIcon },
    { name: 'Invoices', icon: DocumentTextIcon },
    { name: 'Settings', icon: CogIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/clients"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to clients
        </Link>
      </div>

      {/* Client Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.businessName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {client.name} • {client.clientCode}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
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

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              ${client.currentBalance.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Credit Limit</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              ${client.creditLimit.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900 capitalize">
              {client.billingCycle}
            </dd>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              <div className="flex items-center justify-center">
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.name}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* Overview Tab */}
          <Tab.Panel className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{client.contactEmail || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{client.contactPhone || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900">{client.address || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              {/* Usage Summary */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Summary (Last 30 Days)</h3>
                {usageStats ? (
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Calls</dt>
                      <dd className="text-sm text-gray-900">{usageStats.totalCalls} calls ({usageStats.totalMinutes} minutes)</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total SMS</dt>
                      <dd className="text-sm text-gray-900">{usageStats.totalSms} messages</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Cost</dt>
                      <dd className="text-sm text-gray-900">${usageStats.totalCost.toFixed(2)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-gray-500">No usage data available</p>
                )}
              </div>
            </div>
          </Tab.Panel>

          {/* Phone Numbers Tab */}
          <Tab.Panel className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Phone Numbers</h3>
            </div>
            {phoneNumbers && phoneNumbers.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Display Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {phoneNumbers.map((number) => (
                      <tr key={number.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {number.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {number.displayName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {number.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${number.monthlyFee.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              number.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {number.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No phone numbers provisioned
              </div>
            )}
          </Tab.Panel>

          {/* Invoices Tab */}
          <Tab.Panel className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
            </div>
            {invoices && invoices.invoices.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link
                            to={`/billing/invoice/${invoice.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(invoice.billingPeriodStart), 'MMM d')} - {format(new Date(invoice.billingPeriodEnd), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${invoice.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No invoices found
              </div>
            )}
          </Tab.Panel>

          {/* Settings Tab */}
          <Tab.Panel className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client Settings</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Notifications</h4>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={client.settings?.notifications?.email}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={client.settings?.notifications?.sms}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={client.settings?.notifications?.lowBalance}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Low balance alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={client.settings?.notifications?.highUsage}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">High usage alerts</span>
                  </label>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}