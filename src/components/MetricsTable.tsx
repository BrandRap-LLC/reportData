import React, { useState } from 'react';
import { ReportData, formatCurrency, formatPercentage, getMonthOverMonthChange } from '../data/reportData';

interface MetricsTableProps {
  data: ReportData[];
}

const MetricsTable: React.FC<MetricsTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof ReportData>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle sort click
  const handleSort = (field: keyof ReportData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.month.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'month') {
      // Special handling for date sorting
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    
    const valueA = a[sortField] as number;
    const valueB = b[sortField] as number;
    
    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });
  
  // Calculate month-over-month changes
  const getChange = (index: number, field: keyof ReportData): number => {
    if (index === 0) return 0;
    
    return getMonthOverMonthChange(
      data[index][field] as number,
      data[index - 1][field] as number
    );
  };
  
  return (
    <div className="card mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-primary-600 font-medium mb-2 sm:mb-0">Full Metrics Table</h3>
        
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-DEFAULT rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            aria-label="Search by month"
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-DEFAULT">
          <thead className="bg-background">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('month')}
                aria-sort={sortField === 'month' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>Month</span>
                  {sortField === 'month' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('newCustomers')}
                aria-sort={sortField === 'newCustomers' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span># New Cust.</span>
                  {sortField === 'newCustomers' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('newCustomerRevenue')}
                aria-sort={sortField === 'newCustomerRevenue' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>New Cust. Rev.</span>
                  {sortField === 'newCustomerRevenue' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('newCustomerRevenuePercentage')}
                aria-sort={sortField === 'newCustomerRevenuePercentage' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>New Cust. Rev. %</span>
                  {sortField === 'newCustomerRevenuePercentage' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('returningCustomers')}
                aria-sort={sortField === 'returningCustomers' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span># Ret. Cust.</span>
                  {sortField === 'returningCustomers' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('returningCustomerRevenuePercentage')}
                aria-sort={sortField === 'returningCustomerRevenuePercentage' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>Ret. Cust. Rev. %</span>
                  {sortField === 'returningCustomerRevenuePercentage' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('returningCustomerRevenue')}
                aria-sort={sortField === 'returningCustomerRevenue' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>Ret. Cust. Rev.</span>
                  {sortField === 'returningCustomerRevenue' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('totalCustomers')}
                aria-sort={sortField === 'totalCustomers' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span># Total Cust.</span>
                  {sortField === 'totalCustomers' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('totalRevenue')}
                aria-sort={sortField === 'totalRevenue' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>Total Rev.</span>
                  {sortField === 'totalRevenue' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('averageRevenuePerCustomer')}
                aria-sort={sortField === 'averageRevenuePerCustomer' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center">
                  <span>Avg Rev. / Cust.</span>
                  {sortField === 'averageRevenuePerCustomer' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                MoM Change %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => {
                const originalIndex = data.findIndex(item => item.month === row.month);
                const totalCustomersChange = getChange(originalIndex, 'totalCustomers');
                const totalRevenueChange = getChange(originalIndex, 'totalRevenue');
                
                return (
                  <tr key={row.month} className="hover:bg-background">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-800">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {row.newCustomers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(row.newCustomerRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatPercentage(row.newCustomerRevenuePercentage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {row.returningCustomers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatPercentage(row.returningCustomerRevenuePercentage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(row.returningCustomerRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {row.totalCustomers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(row.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(row.averageRevenuePerCustomer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className={totalCustomersChange > 0 ? 'text-positive' : totalCustomersChange < 0 ? 'text-negative' : 'text-gray-500'}>
                          Cust: {totalCustomersChange > 0 ? '+' : ''}{totalCustomersChange.toFixed(1)}%
                        </span>
                        <span className={totalRevenueChange > 0 ? 'text-positive' : totalRevenueChange < 0 ? 'text-negative' : 'text-gray-500'}>
                          Rev: {totalRevenueChange > 0 ? '+' : ''}{totalRevenueChange.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="px-6 py-4 text-center text-sm text-primary-700">
                  No data found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>Click on column headers to sort the table. Use the search box to filter by month.</p>
      </div>
    </div>
  );
};

export default MetricsTable;