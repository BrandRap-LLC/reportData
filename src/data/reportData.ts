export interface ReportData {
  month: string;
  newCustomers: number;
  newCustomerRevenue: number;
  newCustomerRevenuePercentage: number;
  returningCustomers: number;
  returningCustomerRevenuePercentage: number;
  returningCustomerRevenue: number;
  totalCustomers: number;
  totalRevenue: number;
  averageRevenuePerCustomer: number;
}

// / Define reportData and export it

export let reportData: ReportData[] = [];

// export const fetchData = async (): Promise<void> => {
//   try {
//     const response = await fetch(
//       "https://dev2.brandrapdev.co/creports/wp-json/client-reports/v1/report?client_url=Alluraderm.com"
//     );
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const result = await response.json();

//     // Ensure we have valid data in result.metrices
//     if (result?.metrices) {
   
//       reportData = result.metrices;

//       document.documentElement.style.setProperty(
//         "--primary-color",
//         `#${result["primary-color"]}`
//       );
//       document.documentElement.style.setProperty(
//         "--secondary-color",
//         `#${result["secondary-color"]}`
//       );
//       document.documentElement.style.setProperty(
//         "--background-color",
//         `#${result["background-color"]}`
//       );

//       return result.metrices;
//       // Update the exported variable
//     } else {
//       throw new Error("No metrics data found in the response");
//     }
//   } catch (error: any) {
//     console.error("Fetch error:", error.message);
//   }
// };

export const fetchData = async (): Promise<void> => {
  try {
    const path = window.location.pathname; 
    const clientURL = path.split("/")[1];

    if (!clientURL) throw new Error("No client URL found in the path");

    const apiURL = `https://dev2.brandrapdev.co/creports/wp-json/client-reports/v1/report?client_url=${clientURL}`;

    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();

    // Ensure we have valid data in result.metrices
    if (result?.metrices) {
      reportData = result.metrices;

      document.documentElement.style.setProperty(
        "--primary-color",
        `#${result["primary-color"]}`
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        `#${result["secondary-color"]}`
      );
      document.documentElement.style.setProperty(
        "--background-color",
        `#${result["background-color"]}`
      );

      return result.metrices;
    } else {
      throw new Error("No metrics data found in the response");
    }
  } catch (error: any) {
    console.error("Fetch error:", error.message);
  }
};



// Fetch data on module load
fetchData();

export default reportData;


// export const reportData: ReportData[] = [
//   {
//     month: "January 2024",
//     newCustomers: 120,
//     newCustomerRevenue: 74189,
//     newCustomerRevenuePercentage: 16,
//     returningCustomers: 648,
//     returningCustomerRevenuePercentage: 84,
//     returningCustomerRevenue: 400623,
//     totalCustomers: 768,
//     totalRevenue: 474812,
//     averageRevenuePerCustomer: 618
//   },
//   {
//     month: "February 2024",
//     newCustomers: 135,
//     newCustomerRevenue: 94439,
//     newCustomerRevenuePercentage: 16,
//     returningCustomers: 687,
//     returningCustomerRevenuePercentage: 84,
//     returningCustomerRevenue: 480591,
//     totalCustomers: 822,
//     totalRevenue: 575030,
//     averageRevenuePerCustomer: 700
//   },
//   {
//     month: "March 2024",
//     newCustomers: 131,
//     newCustomerRevenue: 84214,
//     newCustomerRevenuePercentage: 16,
//     returningCustomers: 686,
//     returningCustomerRevenuePercentage: 84,
//     returningCustomerRevenue: 440997,
//     totalCustomers: 817,
//     totalRevenue: 525211,
//     averageRevenuePerCustomer: 643
//   },
//   {
//     month: "April 2024",
//     newCustomers: 114,
//     newCustomerRevenue: 71298,
//     newCustomerRevenuePercentage: 15,
//     returningCustomers: 628,
//     returningCustomerRevenuePercentage: 85,
//     returningCustomerRevenue: 392764,
//     totalCustomers: 742,
//     totalRevenue: 464062,
//     averageRevenuePerCustomer: 625
//   },
//   {
//     month: "May 2024",
//     newCustomers: 102,
//     newCustomerRevenue: 61894,
//     newCustomerRevenuePercentage: 13,
//     returningCustomers: 667,
//     returningCustomerRevenuePercentage: 87,
//     returningCustomerRevenue: 404737,
//     totalCustomers: 769,
//     totalRevenue: 466631,
//     averageRevenuePerCustomer: 607
//   },
//   {
//     month: "June 2024",
//     newCustomers: 123,
//     newCustomerRevenue: 74379,
//     newCustomerRevenuePercentage: 16,
//     returningCustomers: 628,
//     returningCustomerRevenuePercentage: 84,
//     returningCustomerRevenue: 379756,
//     totalCustomers: 751,
//     totalRevenue: 454135,
//     averageRevenuePerCustomer: 605
//   },
//   {
//     month: "July 2024",
//     newCustomers: 91,
//     newCustomerRevenue: 55693,
//     newCustomerRevenuePercentage: 12,
//     returningCustomers: 646,
//     returningCustomerRevenuePercentage: 88,
//     returningCustomerRevenue: 395360,
//     totalCustomers: 737,
//     totalRevenue: 451053,
//     averageRevenuePerCustomer: 612
//   },
//   {
//     month: "August 2024",
//     newCustomers: 85,
//     newCustomerRevenue: 53656,
//     newCustomerRevenuePercentage: 12,
//     returningCustomers: 643,
//     returningCustomerRevenuePercentage: 88,
//     returningCustomerRevenue: 405889,
//     totalCustomers: 728,
//     totalRevenue: 459545,
//     averageRevenuePerCustomer: 631
//   },
//   {
//     month: "September 2024",
//     newCustomers: 101,
//     newCustomerRevenue: 60217,
//     newCustomerRevenuePercentage: 13,
//     returningCustomers: 651,
//     returningCustomerRevenuePercentage: 87,
//     returningCustomerRevenue: 388130,
//     totalCustomers: 752,
//     totalRevenue: 448347,
//     averageRevenuePerCustomer: 596
//   },
//   {
//     month: "October 2024",
//     newCustomers: 99,
//     newCustomerRevenue: 61583,
//     newCustomerRevenuePercentage: 13,
//     returningCustomers: 688,
//     returningCustomerRevenuePercentage: 87,
//     returningCustomerRevenue: 427970,
//     totalCustomers: 787,
//     totalRevenue: 489553,
//     averageRevenuePerCustomer: 622
//   },
//   {
//     month: "November 2024",
//     newCustomers: 77,
//     newCustomerRevenue: 44690,
//     newCustomerRevenuePercentage: 10,
//     returningCustomers: 678,
//     returningCustomerRevenuePercentage: 90,
//     returningCustomerRevenue: 393509,
//     totalCustomers: 755,
//     totalRevenue: 438199,
//     averageRevenuePerCustomer: 580
//   },
//   {
//     month: "December 2024",
//     newCustomers: 139,
//     newCustomerRevenue: 68130,
//     newCustomerRevenuePercentage: 16,
//     returningCustomers: 737,
//     returningCustomerRevenuePercentage: 84,
//     returningCustomerRevenue: 361234,
//     totalCustomers: 876,
//     totalRevenue: 429364,
//     averageRevenuePerCustomer: 490
//   },
//   {
//     month: "January 2025",
//     newCustomers: 115,
//     newCustomerRevenue: 64831,
//     newCustomerRevenuePercentage: 13,
//     returningCustomers: 788,
//     returningCustomerRevenuePercentage: 87,
//     returningCustomerRevenue: 444236,
//     totalCustomers: 903,
//     totalRevenue: 509067,
//     averageRevenuePerCustomer: 564
//   },
//   {
//     month: "February 2025",
//     newCustomers: 143,
//     newCustomerRevenue: 63734,
//     newCustomerRevenuePercentage: 18,
//     returningCustomers: 654,
//     returningCustomerRevenuePercentage: 82,
//     returningCustomerRevenue: 291481,
//     totalCustomers: 797,
//     totalRevenue: 355215,
//     averageRevenuePerCustomer: 446
//   }
// ];

// Helper functions for data analysis
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(0)}%`;
};

export const getMonthOverMonthChange = (current: number, previous: number): number => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

export const getYearOverYearChange = (data: ReportData[], currentIndex: number, metric: keyof ReportData): number => {
  if (currentIndex < 12) return 0; // Not enough data for YoY comparison

  const currentValue = data[currentIndex][metric] as number;
  const previousYearValue = data[currentIndex - 12][metric] as number;

  return ((currentValue - previousYearValue) / previousYearValue) * 100;
};

export const getRetentionRate = (data: ReportData[], index: number): number => {
  if (index <= 0) return 0;

  const currentMonthReturningCustomers = data[index].returningCustomers;
  const previousMonthTotalCustomers = data[index - 1].totalCustomers;

  return (currentMonthReturningCustomers / previousMonthTotalCustomers) * 100;
};

export const getThreeMonthAverage = (data: ReportData[], endIndex: number, metric: keyof ReportData): number => {
  if (endIndex < 2) return 0;

  let sum = 0;
  for (let i = endIndex; i > endIndex - 3; i--) {
    sum += data[i][metric] as number;
  }

  return sum / 3;
};

export const getThreeMonthComparison = (data: ReportData[], currentEndIndex: number, metric: keyof ReportData): number => {
  if (currentEndIndex < 5) return 0; // Need at least 6 months of data

  // Current 3 months
  const current3MonthAvg = getThreeMonthAverage(data, currentEndIndex, metric);

  // Previous 3 months
  const previous3MonthAvg = getThreeMonthAverage(data, currentEndIndex - 3, metric);

  return ((current3MonthAvg - previous3MonthAvg) / previous3MonthAvg) * 100;
};

export const getQuarterlyData = (data: ReportData[]): any[] => {
  const quarters: any[] = [];
  const quarterMap: { [key: string]: any } = {};

  data.forEach(month => {
    const dateParts = month.month.split(' ');
    const monthName = dateParts[0];
    const year = dateParts[1];

    let quarter = '';
    if (['January', 'February', 'March'].includes(monthName)) {
      quarter = `Q1 ${year}`;
    } else if (['April', 'May', 'June'].includes(monthName)) {
      quarter = `Q2 ${year}`;
    } else if (['July', 'August', 'September'].includes(monthName)) {
      quarter = `Q3 ${year}`;
    } else {
      quarter = `Q4 ${year}`;
    }

    if (!quarterMap[quarter]) {
      quarterMap[quarter] = {
        quarter,
        months: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0
      };
    }

    quarterMap[quarter].months += 1;
    quarterMap[quarter].totalRevenue += month.totalRevenue;
    quarterMap[quarter].totalCustomers += month.totalCustomers;
    quarterMap[quarter].newCustomers += month.newCustomers;
    quarterMap[quarter].returningCustomers += month.returningCustomers;
  });

  Object.values(quarterMap).forEach(quarter => {
    quarters.push({
      ...quarter,
      avgMonthlyRevenue: quarter.totalRevenue / quarter.months,
      avgMonthlyNewCustomers: quarter.newCustomers / quarter.months,
      avgMonthlyTotalCustomers: quarter.totalCustomers / quarter.months
    });
  });

  return quarters;
};

export const getLatestMonthData = (): ReportData => {
  return reportData[reportData.length - 1];
};

export const getPreviousMonthData = (): ReportData => {
  return reportData[reportData.length - 2];
};

export const getSameMonthLastYearData = (): ReportData | null => {
  if (reportData.length <= 12) return null;
  return reportData[reportData.length - 13];
};

// New helper functions for 3-month and YoY analysis

export const getThreeMonthData = (data: ReportData[], endIndex: number = data.length - 1): ReportData[] => {
  const startIndex = Math.max(0, endIndex - 2);
  return data.slice(startIndex, endIndex + 1);
};

export const getPreviousThreeMonthData = (data: ReportData[], currentEndIndex: number = data.length - 1): ReportData[] => {
  const endIndex = Math.max(0, currentEndIndex - 3);
  const startIndex = Math.max(0, endIndex - 2);
  return data.slice(startIndex, endIndex + 1);
};

export const calculateThreeMonthAggregate = (data: ReportData[], metric: keyof ReportData, endIndex: number = data.length - 1): number => {
  const threeMonthData = getThreeMonthData(data, endIndex);
  return threeMonthData.reduce((sum, item) => sum + (item[metric] as number), 0);
};

export const calculateThreeMonthAverage = (data: ReportData[], metric: keyof ReportData, endIndex: number = data.length - 1): number => {
  const threeMonthData = getThreeMonthData(data, endIndex);
  return threeMonthData.reduce((sum, item) => sum + (item[metric] as number), 0) / threeMonthData.length;
};

export const getThreeMonthChangePercentage = (data: ReportData[], metric: keyof ReportData): number => {
  const currentThreeMonthAvg = calculateThreeMonthAverage(data, metric);
  const previousThreeMonthAvg = calculateThreeMonthAverage(data, metric, data.length - 4);

  if (previousThreeMonthAvg === 0) return 0;
  return ((currentThreeMonthAvg - previousThreeMonthAvg) / previousThreeMonthAvg) * 100;
};

export const getSameThreeMonthsLastYear = (data: ReportData[]): ReportData[] | null => {
  if (data.length <= 15) return null; // Need at least 15 months of data

  const currentEndIndex = data.length - 1;
  const lastYearEndIndex = currentEndIndex - 12;

  return getThreeMonthData(data, lastYearEndIndex);
};

export const getThreeMonthYoYChangePercentage = (data: ReportData[], metric: keyof ReportData): number => {
  const currentThreeMonthAvg = calculateThreeMonthAverage(data, metric);
  const sameThreeMonthsLastYear = getSameThreeMonthsLastYear(data);

  if (!sameThreeMonthsLastYear) return 0;

  const lastYearAvg = sameThreeMonthsLastYear.reduce((sum, item) => sum + (item[metric] as number), 0) / sameThreeMonthsLastYear.length;

  if (lastYearAvg === 0) return 0;
  return ((currentThreeMonthAvg - lastYearAvg) / lastYearAvg) * 100;
};

export const generateInsights = (data: ReportData[]): any[] => {
  const insights = [];

  // Get latest data points
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  // Calculate 3-month comparisons
  const threeMonthNewCustomersChange = getThreeMonthChangePercentage(data, 'newCustomers');
  const threeMonthRevenueChange = getThreeMonthChangePercentage(data, 'totalRevenue');
  const threeMonthAvgRevenuePerCustomerChange = getThreeMonthChangePercentage(data, 'averageRevenuePerCustomer');

  // Calculate YoY comparisons
  const yoyNewCustomersChange = getYearOverYearChange(data, data.length - 1, 'newCustomers');
  const yoyRevenueChange = getYearOverYearChange(data, data.length - 1, 'totalRevenue');
  const yoyAvgRevenuePerCustomerChange = getYearOverYearChange(data, data.length - 1, 'averageRevenuePerCustomer');

  // 3-month insights (high priority)
  insights.push({
    type: 'three_month_comparison',
    metric: 'New Customers',
    value: calculateThreeMonthAverage(data, 'newCustomers').toFixed(0),
    change: threeMonthNewCustomersChange.toFixed(1),
    isPositive: threeMonthNewCustomersChange >= 0,
    priority: 1,
    text: `Average monthly new customers over the last 3 months ${threeMonthNewCustomersChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(threeMonthNewCustomersChange).toFixed(1)}% compared to the previous 3 months.`
  });

  insights.push({
    type: 'three_month_comparison',
    metric: 'Total Revenue',
    value: formatCurrency(calculateThreeMonthAverage(data, 'totalRevenue')),
    change: threeMonthRevenueChange.toFixed(1),
    isPositive: threeMonthRevenueChange >= 0,
    priority: 1,
    text: `Average monthly revenue over the last 3 months ${threeMonthRevenueChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(threeMonthRevenueChange).toFixed(1)}% compared to the previous 3 months.`
  });

  // YoY insights (medium priority)
  if (data.length > 12) {
    insights.push({
      type: 'year_over_year',
      metric: 'New Customers',
      value: currentMonth?.newCustomers.toString(),
      change: yoyNewCustomersChange.toFixed(1),
      isPositive: yoyNewCustomersChange >= 0,
      priority: 2,
      text: `New customer acquisition is ${yoyNewCustomersChange >= 0 ? 'up' : 'down'} ${Math.abs(yoyNewCustomersChange).toFixed(1)}% compared to the same month last year.`
    });

    insights.push({
      type: 'year_over_year',
      metric: 'Total Revenue',
      value: formatCurrency(currentMonth?.totalRevenue),
      change: yoyRevenueChange.toFixed(1),
      isPositive: yoyRevenueChange >= 0,
      priority: 2,
      text: `Total revenue is ${yoyRevenueChange >= 0 ? 'up' : 'down'} ${Math.abs(yoyRevenueChange).toFixed(1)}% compared to the same month last year.`
    });
  }

  // MoM insights (lower priority)
  const momNewCustomersChange = getMonthOverMonthChange(currentMonth?.newCustomers, previousMonth.newCustomers);
  const momRevenueChange = getMonthOverMonthChange(currentMonth?.totalRevenue, previousMonth.totalRevenue);

  insights.push({
    type: 'month_over_month',
    metric: 'New Customers',
    value: currentMonth?.newCustomers.toString(),
    change: momNewCustomersChange.toFixed(1),
    isPositive: momNewCustomersChange >= 0,
    priority: 3,
    text: `New customers ${momNewCustomersChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(momNewCustomersChange).toFixed(1)}% from last month.`
  });

  insights.push({
    type: 'month_over_month',
    metric: 'Total Revenue',
    value: formatCurrency(currentMonth?.totalRevenue),
    change: momRevenueChange.toFixed(1),
    isPositive: momRevenueChange >= 0,
    priority: 3,
    text: `Total revenue ${momRevenueChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(momRevenueChange).toFixed(1)}% from last month.`
  });

  // Sort insights by priority
  return insights.sort((a, b) => a.priority - b.priority);
};