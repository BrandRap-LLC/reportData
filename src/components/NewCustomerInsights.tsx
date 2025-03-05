import React from 'react';
import { ReportData, formatCurrency, getMonthOverMonthChange, getYearOverYearChange } from '../data/reportData';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface NewCustomerInsightsProps {
  data: ReportData[];
}

const NewCustomerInsights: React.FC<NewCustomerInsightsProps> = ({ data }) => {
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
    : null;
  
  // Calculate new customer revenue change
  const revenueChange = getMonthOverMonthChange(
    currentMonth.newCustomerRevenue,
    previousMonth.newCustomerRevenue
  );
  
  // Calculate revenue per new customer
  const currentRevenuePerNewCustomer = currentMonth.newCustomerRevenue / currentMonth.newCustomers;
  const previousRevenuePerNewCustomer = previousMonth.newCustomerRevenue / previousMonth.newCustomers;
  const revenuePerCustomerChange = getMonthOverMonthChange(
    currentRevenuePerNewCustomer,
    previousRevenuePerNewCustomer
  );
  
  // Calculate new customer percentage of total
  const newCustomerPercentage = (currentMonth.newCustomers / currentMonth.totalCustomers) * 100;
  
  // Calculate 3-month average
  const threeMonthAvg = currentMonthIndex >= 2 
    ? (data[currentMonthIndex].newCustomers + data[currentMonthIndex - 1].newCustomers + data[currentMonthIndex - 2].newCustomers) / 3
    : currentMonth.newCustomers;
  
  // Calculate 12-month average
  const twelveMonthData = data.slice(Math.max(0, currentMonthIndex - 11), currentMonthIndex + 1);
  const twelveMonthAvg = twelveMonthData.reduce((sum, month) => sum + month.newCustomers, 0) / twelveMonthData.length;
  
  // Identify seasonal patterns
  const currentMonthName = currentMonth.month.split(' ')[0];
  const historicalSameMonths = data.filter(month => month.month.includes(currentMonthName));
  const historicalAvg = historicalSameMonths.reduce((sum, month) => sum + month.newCustomers, 0) / historicalSameMonths.length;
  const isAboveHistoricalAvg = currentMonth.newCustomers > historicalAvg;
  
  // Extract month names for display
  const currentMonthName2 = currentMonth.month.split(' ')[0];
  const previousMonthName = previousMonth.month.split(' ')[0];
   
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-primary-600" />
        New Customer Insights
      </h3>
      
      <div className="space-y-6">
        {/* Month-over-Month Change */}
        <div className="border-l-4 pl-4 py-2" style={{ borderColor: momChange >= 0 ? '#7D5544' : '#D35F5F' }}>
          <h4 className="text-primary-700 font-medium flex items-center">
            {momChange >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-2 text-positive" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-2 text-negative" />
            )}
            Month-over-Month Change
          </h4>
          <p className="text-primary-800">
            New customers <span className={momChange >= 0 ? 'text-positive font-medium' : 'text-negative font-medium'}>
              {momChange >= 0 ? 'increased' : 'decreased'} by {Math.abs(momChange).toFixed(1)}%
            </span> from {previousMonthName} to {currentMonthName2} 
            ({previousMonth.newCustomers} to {currentMonth.newCustomers}).
          </p>
        </div>
        
        {/* Year-over-Year Change */}
        {yoyChange !== null && (
          <div className="border-l-4 pl-4 py-2" style={{ borderColor: yoyChange >= 0 ? '#7D5544' : '#D35F5F' }}>
            <h4 className="text-primary-700 font-medium flex items-center">
              {yoyChange >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-2 text-positive" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-2 text-negative" />
              )}
              Year-over-Year Change
            </h4>
            <p className="text-primary-800">
              New customer acquisition is <span className={yoyChange >= 0 ? 'text-positive font-medium' : 'text-negative font-medium'}>
                {Math.abs(yoyChange).toFixed(1)}% {yoyChange >= 0 ? 'higher' : 'lower'}
              </span> than the same month last year
              ({sameMonthLastYear?.newCustomers} to {currentMonth.newCustomers}).
            </p>
          </div>
        )}
        
        {/* New Customer Revenue Impact */}
        <div className="border-l-4 pl-4 py-2" style={{ borderColor: revenueChange >= 0 ? '#7D5544' : '#D35F5F' }}>
          <h4 className="text-primary-700 font-medium flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
            Revenue Impact
          </h4>
          <p className="text-primary-800">
            New customers generated {formatCurrency(currentMonth.newCustomerRevenue)} in revenue, 
            <span className={revenueChange >= 0 ? ' text-positive font-medium' : ' text-negative font-medium'}>
              {' '}{revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
            </span> compared to last month.
          </p>
          <p className="text-primary-800 mt-1">
            Average revenue per new customer: {formatCurrency(currentRevenuePerNewCustomer)}
            <span className={revenuePerCustomerChange >= 0 ? ' text-positive font-medium' : ' text-negative font-medium'}>
              {' '}({revenuePerCustomerChange >= 0 ? '+' : ''}{revenuePerCustomerChange.toFixed(1)}%)
            </span>
          </p>
        </div>
        
        {/* New Customer Percentage */}
        <div className="border-l-4 pl-4 py-2 border-primary-600">
          <h4 className="text-primary-700 font-medium flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary-600" />
            Customer Base Composition
          </h4>
          <p className="text-primary-800">
            New customers represent <span className="font-medium">{newCustomerPercentage.toFixed(1)}%</span> of total customer base this month.
          </p>
          <p className="text-primary-800 mt-1">
            Compared to: 3-month avg ({(threeMonthAvg / currentMonth.totalCustomers * 100).toFixed(1)}%) | 
            12-month avg ({(twelveMonthAvg / currentMonth.totalCustomers * 100).toFixed(1)}%)
          </p>
        </div>
        
        {/* Seasonal Pattern Recognition */}
        <div className="border-l-4 pl-4 py-2 border-secondary-DEFAULT">
          <h4 className="text-primary-700 font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-secondary-DEFAULT" />
            Seasonal Pattern
          </h4>
          <p className="text-primary-800">
            Historically, {currentMonthName} shows {isAboveHistoricalAvg ? 'above' : 'below'} average new customer acquisition.
            Current: {currentMonth.newCustomers} vs. Historical Avg: {Math.round(historicalAvg)}
            <span className={isAboveHistoricalAvg ? ' text-positive font-medium' : ' text-negative font-medium'}>
              {' '}({((currentMonth.newCustomers - historicalAvg) / historicalAvg * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
        
        {/* Alert for significant changes */}
        {(Math.abs(momChange) > 20 || (yoyChange !== null && Math.abs(yoyChange) > 25)) && (
          <div className="bg-background border border-secondary-DEFAULT rounded-md p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-800">Attention Required</h3>
                <div className="mt-2 text-sm text-primary-700">
                  <p>
                    {Math.abs(momChange) > 20 ? 
                      `Significant ${momChange > 0 ? 'increase' : 'decrease'} (${Math.abs(momChange).toFixed(1)}%) in new customers month-over-month.` : 
                      `Significant ${yoyChange! > 0 ? 'increase' : 'decrease'} (${Math.abs(yoyChange!).toFixed(1)}%) in new customers year-over-year.`
                    } This may require further investigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCustomerInsights;