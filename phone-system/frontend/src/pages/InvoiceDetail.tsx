import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeftIcon, PrinterIcon, DownloadIcon } from '@heroicons/react/24/outline';
import { billingService } from '../services/billingService';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => billingService.getInvoice(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-8">Invoice not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/billing"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to invoices
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        {/* Invoice Header */}
        <div className="px-6 py-8 sm:px-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="mt-2 text-lg text-gray-600">{invoice.invoiceNumber}</p>
            </div>
            <div className="mt-4 sm:mt-0 space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <PrinterIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Print
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <DownloadIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Download PDF
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Bill To</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-medium">{invoice.client?.businessName}</p>
                <p>{invoice.client?.name}</p>
                {invoice.client?.address && <p>{invoice.client.address}</p>}
                {invoice.client?.contactEmail && <p>{invoice.client.contactEmail}</p>}
                {invoice.client?.contactPhone && <p>{invoice.client.contactPhone}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Invoice Date</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {format(new Date(invoice.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Due Date</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {format(new Date(invoice.dueDate), 'MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Status</h3>
                <p className="mt-1">
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
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Period */}
        <div className="border-t border-gray-200 px-6 py-4 sm:px-10">
          <p className="text-sm text-gray-600">
            Billing Period: {format(new Date(invoice.billingPeriodStart), 'MMMM d, yyyy')} - {format(new Date(invoice.billingPeriodEnd), 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Line Items */}
        <div className="px-6 sm:px-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-sm font-medium text-gray-900">Description</th>
                <th className="py-3 text-right text-sm font-medium text-gray-900">Qty</th>
                <th className="py-3 text-right text-sm font-medium text-gray-900">Unit Price</th>
                <th className="py-3 text-right text-sm font-medium text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.lineItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm text-gray-600">{item.description}</td>
                  <td className="py-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                  <td className="py-4 text-sm text-gray-600 text-right">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-4 text-sm text-gray-900 text-right font-medium">
                    ${item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Usage Summary */}
        {invoice.usageSummary && (
          <div className="border-t border-gray-200 px-6 py-6 sm:px-10">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Usage Summary</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
              <div>
                <p className="text-gray-500">Total Calls</p>
                <p className="font-medium">{invoice.usageSummary.totalCalls}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Minutes</p>
                <p className="font-medium">{invoice.usageSummary.totalCallMinutes}</p>
              </div>
              <div>
                <p className="text-gray-500">Total SMS</p>
                <p className="font-medium">{invoice.usageSummary.totalSms}</p>
              </div>
              <div>
                <p className="text-gray-500">Total MMS</p>
                <p className="font-medium">{invoice.usageSummary.totalMms}</p>
              </div>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="border-t border-gray-200 px-6 py-6 sm:px-10">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
              <span className="text-gray-900">${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${invoice.totalAmount.toFixed(2)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid</span>
                <span className="text-green-600">-${invoice.paidAmount.toFixed(2)}</span>
              </div>
            )}
            {invoice.paidAmount > 0 && invoice.paidAmount < invoice.totalAmount && (
              <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                <span className="text-gray-900">Balance Due</span>
                <span className="text-gray-900">
                  ${(invoice.totalAmount - invoice.paidAmount).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {invoice.status === 'pending' && (
          <div className="border-t border-gray-200 px-6 py-6 sm:px-10">
            <button className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Record Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}