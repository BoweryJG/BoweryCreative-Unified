import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { phoneNumberService } from '../services/phoneNumberService';
import { clientService } from '../services/clientService';
import toast from 'react-hot-toast';

export default function PhoneNumbers() {
  const [searchArea, setSearchArea] = useState('');
  const [searchContains, setSearchContains] = useState('');
  const [searchType, setSearchType] = useState('local');
  const [isSearching, setIsSearching] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('');

  const { data: clients } = useQuery({
    queryKey: ['clients', 'active'],
    queryFn: () => clientService.getClients({ status: 'active' }),
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await phoneNumberService.searchAvailableNumbers({
        areaCode: searchArea,
        contains: searchContains,
        type: searchType,
        limit: 10,
      });
      setAvailableNumbers(results);
      if (results.length === 0) {
        toast.error('No available numbers found matching your criteria');
      }
    } catch (error) {
      toast.error('Failed to search for numbers');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProvision = async (phoneNumber: string) => {
    if (!selectedClient) {
      toast.error('Please select a client first');
      return;
    }

    try {
      await phoneNumberService.provisionNumber({
        clientId: selectedClient,
        phoneNumber,
      });
      toast.success('Phone number provisioned successfully');
      // Remove from available list
      setAvailableNumbers(availableNumbers.filter(n => n.phoneNumber !== phoneNumber));
    } catch (error) {
      toast.error('Failed to provision phone number');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Phone Numbers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and provision phone numbers for your clients
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search Available Numbers</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              id="client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select a client</option>
              {clients?.clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.businessName} ({client.clientCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Number Type
            </label>
            <select
              id="type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="local">Local</option>
              <option value="toll_free">Toll Free</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
              Area Code
            </label>
            <input
              type="text"
              id="area"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              placeholder="e.g., 212"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contains" className="block text-sm font-medium text-gray-700">
              Contains
            </label>
            <input
              type="text"
              id="contains"
              value={searchContains}
              onChange={(e) => setSearchContains(e.target.value)}
              placeholder="e.g., 555"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <MagnifyingGlassIcon className="-ml-1 mr-2 h-5 w-5" />
            {isSearching ? 'Searching...' : 'Search Numbers'}
          </button>
        </div>
      </div>

      {/* Available Numbers */}
      {availableNumbers.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Numbers</h3>
            <div className="space-y-3">
              {availableNumbers.map((number) => (
                <div
                  key={number.phoneNumber}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {number.friendlyName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {number.locality}, {number.region} {number.postalCode}
                    </p>
                    <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                      {number.capabilities.voice && <span>Voice</span>}
                      {number.capabilities.SMS && <span>SMS</span>}
                      {number.capabilities.MMS && <span>MMS</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleProvision(number.phoneNumber)}
                    disabled={!selectedClient}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    Provision
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Client Numbers */}
      {selectedClient && (
        <ClientPhoneNumbers clientId={selectedClient} />
      )}
    </div>
  );
}

function ClientPhoneNumbers({ clientId }: { clientId: string }) {
  const { data: phoneNumbers, isLoading } = useQuery({
    queryKey: ['phoneNumbers', clientId],
    queryFn: () => phoneNumberService.getClientNumbers(clientId),
    enabled: !!clientId,
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading phone numbers...</div>;
  }

  if (!phoneNumbers || phoneNumbers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Phone Numbers</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capabilities
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {number.capabilities.voice && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Voice
                        </span>
                      )}
                      {number.capabilities.sms && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          SMS
                        </span>
                      )}
                      {number.capabilities.mms && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          MMS
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}