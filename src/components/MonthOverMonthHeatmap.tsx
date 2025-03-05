import React from 'react';
import { ReportData, getMonthOverMonthChange } from '../data/reportData';

interface MonthOverMonthHeatmapProps {
  data: ReportData[];
}

const MonthOverMonthHeatmap: React.FC<MonthOverMonthHeatmapProps> = ({ data }) => {
  // Define metrics to display
  const metrics = [
    { key: 'totalCustomers', label: '# Total Cust.' },
    { key: 'totalRevenue', label: 'Total Rev.' },
    { key: 'newCustomers', label: '# New Cust.' },
    { key: 'returningCustomers', label: '# Ret. Cust.' },
    { key: 'averageRevenuePerCustomer', label: 'Avg Rev. / Cust.' }
  ];
  
  // Calculate month-over-month changes
  const changes = data.slice(1).map((month, index) => {
    const previousMonth = data[index];
    
    return metrics.reduce((acc, metric) => {
      acc[metric.key] = getMonthOverMonthChange(
        month[metric.key as keyof ReportData] as number,
        previousMonth[metric.key as keyof ReportData] as number
      );
      return acc;
    }, {} as Record<string, number>);
  });
  
  // Generate month labels
  const monthLabels = data.slice(1).map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  // Cell dimensions
  const cellWidth = 80;
  const cellHeight = 40;
  const headerHeight = 100;
  const rowHeaderWidth = 120;
  
  // Calculate total dimensions
  const width = rowHeaderWidth + cellWidth * monthLabels.length;
  const height = headerHeight + cellHeight * metrics.length;
  
  // Color scale function
  const getColorForValue = (value: number) => {
    if (value > 15) return '#7D5544'; // Dark brown (positive)
    if (value > 5) return '#976751'; // Medium brown (positive)
    if (value > 0) return '#C49C81'; // Light brown (positive)
    if (value > -5) return '#EDD7C8'; // Beige (slightly negative)
    if (value > -15) return '#E5C1B0'; // Lighter red (negative)
    return '#D35F5F'; // Red (very negative)
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Month-over-Month Growth</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Column Headers (Months) */}
          {monthLabels.map((month, i) => {
            const x = rowHeaderWidth + i * cellWidth;
            
            return (
              <g key={`header-${i}`}>
                <text
                  x={x + cellWidth / 2}
                  y={headerHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#6b7280"
                  transform={`rotate(-45, ${x + cellWidth / 2}, ${headerHeight / 2})`}
                >
                  {month}
                </text>
              </g>
            );
          })}
          
          {/* Row Headers (Metrics) */}
          {metrics.map((metric, i) => {
            const y = headerHeight + i * cellHeight;
            
            return (
              <g key={`row-${i}`}>
                <text
                  x={rowHeaderWidth - 10}
                  y={y + cellHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {metric.label}
                </text>
              </g>
            );
          })}
          
          {/* Cells */}
          {changes.map((monthChange, monthIndex) => {
            return metrics.map((metric, metricIndex) => {
              const x = rowHeaderWidth + monthIndex * cellWidth;
              const y = headerHeight + metricIndex * cellHeight;
              const value = monthChange[metric.key];
              
              return (
                <g key={`cell-${monthIndex}-${metricIndex}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellWidth}
                    height={cellHeight}
                    fill={getColorForValue(value)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={x + cellWidth / 2}
                    y={y + cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fill={value > 0 ? "#FFFFFF" : "#4A3728"}
                    fontWeight={Math.abs(value) > 10 ? "600" : "400"}
                  >
                    {`${value > 0 ? '+' : ''}${value.toFixed(1)}%`}
                  </text>
                </g>
              );
            });
          })}
        </svg>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: '#7D5544' }}></div>
          <span className="text-xs text-primary-800">&gt;15%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: '#976751' }}></div>
          <span className="text-xs text-primary-800">5-15%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: '#C49C81' }}></div>
          <span className="text-xs text-primary-800">0-5%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: '#EDD7C8' }}></div>
          <span className="text-xs text-primary-800">0 to -5%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: '#E5C1B0' }}></div>
          <span className="text-xs text-primary-800">-5 to -15%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: '#D35F5F' }}></div>
          <span className="text-xs text-primary-800">&lt;-15%</span>
        </div>
      </div>
    </div>
  );
};

export default MonthOverMonthHeatmap;