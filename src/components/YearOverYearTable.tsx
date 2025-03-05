import React from 'react';
import { ReportData, formatCurrency } from '../data/reportData';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface YearOverYearTableProps {
  data: ReportData[];
}

const YearOverYearTable: React.FC<YearOverYearTableProps> = ({ data }) => {
  // Get current month and same month last year
  const currentMonth = data[data.length - 1];
  
  // Find same month last year
  const sameMonthLastYear = data.length > 12 ? data[data.length - 13] : null;
  
  // Define metrics to display
  const metrics = [
    { key: 'newCustomers', label: 'New Customers', format: (value: number) => value.toString() },
    { key: 'totalRevenue', label: 'Total Revenue', format: formatCurrency },
    { key: 'totalCustomers', label: 'Total Customers', format: (value: number) => value.toString() },
    { key: 'averageRevenuePerCustomer', label: 'Avg Revenue per Customer', format: formatCurrency },
    { key: 'newCustomerRevenuePercentage', label: 'New Customer Revenue %', format: (value: number) => `${value.toFixed(1)}%` }
  ];
  
  if (!sameMonthLastYear) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-primary-600 font-medium mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          Year-over-Year Comparison
        </h3>
        <div className="bg-background p-4 rounded-md text-center">
          <p className="text-primary-800">Year-over-year data not available. Need at least 13 months of data.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-primary-600" />
        Year-over-Year Comparison: {currentMonth.month}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 yoy-table">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Metric
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Current ({currentMonth.month})
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Last Year ({sameMonthLastYear.month})
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.map((metric) => {
              const current = currentMonth[metric.key as keyof ReportData] as number;
              const lastYear = sameMonthLastYear[metric.key as keyof ReportData] as number;
              const changePercent = ((current - lastYear) / lastYear) * 100;
              
              return (
                <tr key={metric.key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-800">
                    {metric.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                    {metric.format(current)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                    {metric.format(lastYear)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={`flex items-center ${changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>This table compares current metrics with the same month from the previous year to identify long-term trends and seasonal patterns.</p>
      </div>
    </div>
  );
};

export default YearOverYearTable;