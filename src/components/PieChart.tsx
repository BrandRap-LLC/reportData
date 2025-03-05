import React from 'react';

interface PieChartProps {
  newCustomers: number;
  returningCustomers: number;
}

const PieChart: React.FC<PieChartProps> = ({ newCustomers, returningCustomers }) => {
  const total = newCustomers + returningCustomers;
  const newPercentage = (newCustomers / total) * 100;
  const returningPercentage = (returningCustomers / total) * 100;
  
  // Calculate the stroke-dasharray values for the SVG circle
  const circumference = 2 * Math.PI * 40; // radius is 40
  const newCustomersDash = (newPercentage / 100) * circumference;
  const returningCustomersDash = (returningPercentage / 100) * circumference;
  
  return (
    <div className="card h-full">
      <h3 className="text-primary-600 font-medium mb-4">Customer Acquisition & Retention</h3>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full" viewBox="0 0 100 100" aria-label={`Pie chart showing ${newPercentage.toFixed(1)}% new customers and ${returningPercentage.toFixed(1)}% returning customers`}>
            {/* Returning customers slice (first in the pie) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#C49C81"
              strokeWidth="20"
              strokeDasharray={`${returningCustomersDash} ${circumference}`}
              transform="rotate(-90 50 50)"
              aria-hidden="true"
            />
            {/* New customers slice */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#976751"
              strokeWidth="20"
              strokeDasharray={`${newCustomersDash} ${circumference}`}
              strokeDashoffset={-returningCustomersDash}
              transform="rotate(-90 50 50)"
              aria-hidden="true"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-primary-600">Total</p>
              <p className="text-2xl font-bold text-primary-800">{total}</p>
            </div>
          </div>
        </div>
        
        <div className="ml-0 md:ml-6 mt-6 md:mt-0">
          <div className="mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2" aria-hidden="true"></div>
              <span className="text-sm font-medium text-primary-800">New Customers</span>
            </div>
            <p className="text-xl font-bold ml-6 text-primary-700">{newCustomers} ({newPercentage.toFixed(1)}%)</p>
          </div>
          
          <div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2" aria-hidden="true"></div>
              <span className="text-sm font-medium text-primary-800">Returning Customers</span>
            </div>
            <p className="text-xl font-bold ml-6 text-primary-700">{returningCustomers} ({returningPercentage.toFixed(1)}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;