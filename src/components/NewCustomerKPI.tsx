import React from 'react';
import { ReportData, getMonthOverMonthChange, getYearOverYearChange, getThreeMonthChangePercentage } from '../data/reportData';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

interface NewCustomerKPIProps {
  data: ReportData[];
}

const NewCustomerKPI: React.FC<NewCustomerKPIProps> = ({ data }) => {
  // console.log('data', data)
  // Get current and previous months
  const currentMonthIndex = data.length - 1;
  const currentMonth = data[currentMonthIndex];
  const previousMonth = data[currentMonthIndex - 1];
  const sameMonthLastYear = currentMonthIndex >= 12 ? data[currentMonthIndex - 12] : null;
  
  // Calculate month-over-month change
  const momChange = getMonthOverMonthChange(
    currentMonth.newCustomers,
    previousMonth.newCustomers
  );
  
  // Calculate year-over-year change
  const yoyChange = sameMonthLastYear 
    ? getYearOverYearChange(data, currentMonthIndex, 'newCustomers')
    : 0;
  
  // Calculate 3-month change
  const threeMonthChange = getThreeMonthChangePercentage(data, 'newCustomers');
  
  // Calculate new customer percentage of total
  const newCustomerPercentage = (currentMonth.newCustomers / currentMonth.totalCustomers) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary-600 text-base font-medium">New Customer KPI</h3>
        <div className="text-primary-600">
          <Users className="h-6 w-6" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <p className="text-3xl font-bold mb-4 text-primary-800" aria-label={`New Customers: ${currentMonth.newCustomers}`}>
          {currentMonth.newCustomers}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center comparison-primary">
            {threeMonthChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-positive mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-negative mr-1" />
            )}
            <span className={`text-sm font-medium ${threeMonthChange >= 0 ? 'text-positive' : 'text-negative'}`}>
              {threeMonthChange >= 0 ? '+' : ''}{threeMonthChange.toFixed(1)}% vs Last 3 Months
            </span>
          </div>
          
          {sameMonthLastYear && (
            <div className="flex items-center comparison-secondary">
              {yoyChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-positive mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-negative mr-1" />
              )}
              <span className={`text-sm font-medium ${yoyChange >= 0 ? 'text-positive' : 'text-negative'}`}>
                {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}% YoY
              </span>
            </div>
          )}
          
          <div className="flex items-center comparison-tertiary">
            {momChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-positive mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-negative mr-1" />
            )}
            <span className={`text-sm font-medium ${momChange >= 0 ? 'text-positive' : 'text-negative'}`}>
              {momChange >= 0 ? '+' : ''}{momChange.toFixed(1)}% MoM
            </span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-secondary-light">
            <span className="text-sm text-primary-700">
              {newCustomerPercentage.toFixed(1)}% of total customers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomerKPI;