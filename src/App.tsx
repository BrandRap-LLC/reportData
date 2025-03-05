import React, { useState, useRef, useEffect } from 'react';
import { reportData, fetchData, formatCurrency, formatPercentage, getMonthOverMonthChange, getYearOverYearChange, getRetentionRate, getThreeMonthAverage, getThreeMonthChangePercentage, getThreeMonthYoYChangePercentage } from './data/reportData';
import KPICard from './components/KPICard';
import PieChart from './components/PieChart';
import CustomerGrowthChart from './components/CustomerGrowthChart';
import RevenueChart from './components/RevenueChart';
import CustomerValueComparison from './components/CustomerValueComparison';
import RevenueSourceBreakdown from './components/RevenueSourceBreakdown';
import RevenueSourcePercentage from './components/RevenueSourcePercentage';
import RevenueSourceTrend from './components/RevenueSourceTrend';
import QuarterlyComparison from './components/QuarterlyComparison';
import MonthOverMonthHeatmap from './components/MonthOverMonthHeatmap';
import MetricsTable from './components/MetricsTable';
import KeyMetricsSummary from './components/KeyMetricsSummary';
import InsightsRecommendations from './components/InsightsRecommendations';
import NewCustomerTrend from './components/NewCustomerTrend';
import NewCustomerContribution from './components/NewCustomerContribution';
import NewCustomerRevenue from './components/NewCustomerRevenue';
import NewCustomerInsights from './components/NewCustomerInsights';
import NewCustomerKPI from './components/NewCustomerKPI';
import ThreeMonthComparison from './components/ThreeMonthComparison';
import YearOverYearTable from './components/YearOverYearTable';
import YearOverYearChart from './components/YearOverYearChart';
import { Menu, X, Download, Calendar, BarChart2, Users, DollarSign, TrendingUp, PieChart as PieChartIcon, RefreshCw, Activity, Lightbulb } from 'lucide-react';

function App() {
  // Get latest month data
  const path = window.location.pathname; 
  const clientURL = path.split("/")[2]; 
  const nameData = clientURL.split(".");

  const latestMonth = reportData[reportData?.length - 1];
  const previousMonth = reportData[reportData?.length - 2];
  const sameMonthLastYear = reportData?.length > 12 ? reportData[reportData?.length - 13] : null;

  // Calculate KPI changes
  const totalCustomersChange = getMonthOverMonthChange(latestMonth?.totalCustomers, previousMonth?.totalCustomers);
  const totalRevenueChange = getMonthOverMonthChange(latestMonth?.totalRevenue, previousMonth?.totalRevenue);

  // Calculate YoY changes
  const yoyCustomerGrowth = sameMonthLastYear
    ? getYearOverYearChange(reportData, reportData?.length - 1, 'totalCustomers')
    : 0;

  const yoyRevenueGrowth = sameMonthLastYear
    ? getYearOverYearChange(reportData, reportData?.length - 1, 'totalRevenue')
    : 0;

  // Calculate 3-month changes
  const threeMonthCustomerChange = getThreeMonthChangePercentage(reportData, 'totalCustomers');
  const threeMonthRevenueChange = getThreeMonthChangePercentage(reportData, 'totalRevenue');

  // State for active section
  const [activeSection, setActiveSection] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for section navigation
  const executiveSummaryRef = useRef<HTMLElement>(null);
  const threeMonthRef = useRef<HTMLElement>(null);
  const yoyRef = useRef<HTMLElement>(null);
  const trendsRef = useRef<HTMLElement>(null);
  const revenueRef = useRef<HTMLElement>(null);
  const newCustomerRef = useRef<HTMLElement>(null);
  const quarterlyRef = useRef<HTMLElement>(null);
  const tablesRef = useRef<HTMLElement>(null);
  const insightsRef = useRef<HTMLElement>(null);

  // Function to scroll to section
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Function to handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);

    // Scroll to appropriate section
    if (section === 'executive') scrollToSection(executiveSummaryRef);
    if (section === 'threemonth') scrollToSection(threeMonthRef);
    if (section === 'yoy') scrollToSection(yoyRef);
    if (section === 'trends') scrollToSection(trendsRef);
    if (section === 'revenue') scrollToSection(revenueRef);
    if (section === 'newcustomer') scrollToSection(newCustomerRef);
    if (section === 'quarterly') scrollToSection(quarterlyRef);
    if (section === 'tables') scrollToSection(tablesRef);
    if (section === 'insights') scrollToSection(insightsRef);
  };

  // Function to export data as CSV
  const exportData = () => {
    const headers = [
      'Month',
      'New Customers',
      'New Customer Revenue',
      'New Customer Revenue %',
      'Returning Customers',
      'Returning Customer Revenue %',
      'Returning Customer Revenue',
      'Total Customers',
      'Total Revenue',
      'Average Revenue per Customer'
    ];

    const csvRows = [
      headers.join(','),
      ...reportData?.map(row => [
        row?.month,
        row?.newCustomers,
        row?.newCustomerRevenue,
        `${row?.newCustomerRevenuePercentage}%`,
        row?.returningCustomers,
        `${row?.returningCustomerRevenuePercentage}%`,
        row?.returningCustomerRevenue,
        row?.totalCustomers,
        row?.totalRevenue,
        row?.averageRevenuePerCustomer
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${nameData[0]}MD_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [data, setData] = useState([]);




  useEffect(() => {
    const loadReportData = async () => {
      const fetchedData:any = await fetchData(); // Wait for API response
      console.log("Fetched Data:", fetchedData);
      setData(fetchedData); // Update local state
    };



    loadReportData();
  }, []); // Run only once on mount

  return (
    <>
      {
        reportData?.length > 0 ? (
          <div className="min-h-screen bg-background">
            {/* Skip to content link for accessibility */}
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>

            {/* Header */}
            <header className="bg-primary-700 shadow-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-white text-capitalize">{nameData[0]}</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <h2 className="hidden md:block text-xl font-semibold text-white">Big Numbers Report Dashboard - February 2025</h2>
                    <button
                      onClick={exportData}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-background text-primary-700 hover:bg-primary-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      aria-label="Export data as CSV"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                      className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      aria-expanded={mobileMenuOpen}
                      aria-controls="mobile-menu"
                    >
                      <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                      {mobileMenuOpen ? (
                        <X className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Menu className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Navigation */}
            <div
              className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-75 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-hidden={!mobileMenuOpen}
            >
              <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto z-50 transform transition-transform ease-in-out duration-300 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary-700">Navigation</h2>
                  <button
                    className="rounded-md text-gray-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <nav className="flex-1">
                  <ul className="space-y-2">
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'all' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('all')}
                      >
                        <BarChart2 className="inline-block w-5 h-5 mr-2" />
                        All Sections
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'executive' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('executive')}
                      >
                        <Activity className="inline-block w-5 h-5 mr-2" />
                        Executive Summary
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'threemonth' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('threemonth')}
                      >
                        <Calendar className="inline-block w-5 h-5 mr-2" />
                        3-Month Performance
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'yoy' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('yoy')}
                      >
                        <RefreshCw className="inline-block w-5 h-5 mr-2" />
                        Year-over-Year Analysis
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'trends' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('trends')}
                      >
                        <TrendingUp className="inline-block w-5 h-5 mr-2" />
                        Trend Analysis
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'revenue' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('revenue')}
                      >
                        <DollarSign className="inline-block w-5 h-5 mr-2" />
                        Revenue Composition
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'newcustomer' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('newcustomer')}
                      >
                        <Users className="inline-block w-5 h-5 mr-2" />
                        New Customer Analysis
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'quarterly' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('quarterly')}
                      >
                        <Calendar className="inline-block w-5 h-5 mr-2" />
                        Quarterly Analysis
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'tables' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('tables')}
                      >
                        <BarChart2 className="inline-block w-5 h-5 mr-2" />
                        Detailed Tables
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${activeSection === 'insights' ? 'bg-background text-primary-700' : 'text-primary-800 hover:bg-background'}`}
                        onClick={() => handleSectionChange('insights')}
                      >
                        <Lightbulb className="inline-block w-5 h-5 mr-2" />
                        Insights
                      </button>
                    </li>
                  </ul>
                </nav>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-primary-700">
                    © {new Date().getFullYear()} {nameData[0]} MD MedSpa
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="bg-white shadow-sm mb-6 sticky top-16 z-40 no-print">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-1 overflow-x-auto py-3 hide-scrollbar">
                  <button
                    className={`nav-button ${activeSection === 'all' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('all')}
                    aria-current={activeSection === 'all' ? 'page' : undefined}
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    All Sections
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'executive' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('executive')}
                    aria-current={activeSection === 'executive' ? 'page' : undefined}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Executive Summary
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'threemonth' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('threemonth')}
                    aria-current={activeSection === 'threemonth' ? 'page' : undefined}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    3-Month
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'yoy' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('yoy')}
                    aria-current={activeSection === 'yoy' ? 'page' : undefined}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Year-over-Year
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'trends' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('trends')}
                    aria-current={activeSection === 'trends' ? 'page' : undefined}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trends
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'revenue' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('revenue')}
                    aria-current={activeSection === 'revenue' ? 'page' : undefined}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Revenue
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'newcustomer' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('newcustomer')}
                    aria-current={activeSection === 'newcustomer' ? 'page' : undefined}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    New Customers
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'quarterly' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('quarterly')}
                    aria-current={activeSection === 'quarterly' ? 'page' : undefined}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Quarterly
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'tables' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('tables')}
                    aria-current={activeSection === 'tables' ? 'page' : undefined}
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Tables
                  </button>
                  <button
                    className={`nav-button ${activeSection === 'insights' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('insights')}
                    aria-current={activeSection === 'insights' ? 'page' : undefined}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Insights
                  </button>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              {/* Executive Summary Section */}
              {(activeSection === 'all' || activeSection === 'executive') && (
                <section ref={executiveSummaryRef} className="mb-12">
                  <h2 className="section-title">Executive Summary</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                      title="Total Customers"
                      value={latestMonth?.totalCustomers.toString()}
                      comparisonData={[
                        {
                          label: "vs Last 3 Months",
                          value: threeMonthCustomerChange,
                          type: "primary",
                          suffix: "%"
                        },
                        {
                          label: "vs Last Year",
                          value: yoyCustomerGrowth,
                          type: "secondary",
                          suffix: "%"
                        },
                        {
                          label: "vs Last Month",
                          value: totalCustomersChange,
                          type: "tertiary",
                          suffix: "%"
                        }
                      ]}
                      icon={<Users className="h-5 w-5" />}
                    />
                    <KPICard
                      title="Total Revenue"
                      value={formatCurrency(latestMonth?.totalRevenue)}
                      comparisonData={[
                        {
                          label: "vs Last 3 Months",
                          value: threeMonthRevenueChange,
                          type: "primary",
                          suffix: "%"
                        },
                        {
                          label: "vs Last Year",
                          value: yoyRevenueGrowth,
                          type: "secondary",
                          suffix: "%"
                        },
                        {
                          label: "vs Last Month",
                          value: totalRevenueChange,
                          type: "tertiary",
                          suffix: "%"
                        }
                      ]}
                      icon={<DollarSign className="h-5 w-5" />}
                    />
                    <NewCustomerKPI data={reportData} />
                    <KPICard
                      title="YoY Revenue Growth"
                      value={formatPercentage(yoyRevenueGrowth)}
                      change={yoyRevenueGrowth}
                      suffix=" pts"
                      icon={<TrendingUp className="h-5 w-5" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <PieChart
                      newCustomers={latestMonth?.newCustomers}
                      returningCustomers={latestMonth?.returningCustomers}
                    />
                    <div className="card h-full">
                      <h3 className="text-primary-600 font-medium mb-4">New vs. Returning Revenue</h3>
                      <div className="flex flex-col h-full justify-center">
                        <div className="relative pt-1 mb-6">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary-100 text-primary-800">
                                New Customer Revenue
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-primary-800">
                                {latestMonth?.newCustomerRevenuePercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                            <div style={{ width: `${latestMonth?.newCustomerRevenuePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"></div>
                          </div>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-secondary-light text-primary-800">
                                Returning Customer Revenue
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-primary-800">
                                {latestMonth?.returningCustomerRevenuePercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary-light">
                            <div style={{ width: `${latestMonth?.returningCustomerRevenuePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary-DEFAULT"></div>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-primary-700 text-sm">
                            New customer revenue: {formatCurrency(latestMonth?.newCustomerRevenue)}
                          </p>
                          <p className="text-primary-700 text-sm">
                            Returning customer revenue: {formatCurrency(latestMonth?.returningCustomerRevenue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* 3-Month Performance Section */}
              {(activeSection === 'all' || activeSection === 'threemonth') && (
                <section ref={threeMonthRef} className="mb-12">
                  <h2 className="section-title">3-Month Performance</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ThreeMonthComparison
                      data={reportData}
                      title="New Customer Acquisition"
                      metric="newCustomers"
                    />
                    <ThreeMonthComparison
                      data={reportData}
                      title="Total Revenue"
                      metric="totalRevenue"
                      valuePrefix="$"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <ThreeMonthComparison
                      data={reportData}
                      title="Average Revenue per Customer"
                      metric="averageRevenuePerCustomer"
                      valuePrefix="$"
                    />
                    <ThreeMonthComparison
                      data={reportData}
                      title="Returning Customers"
                      metric="returningCustomers"
                    />
                  </div>
                </section>
              )}

              {/* Year-over-Year Analysis Section */}
              {(activeSection === 'all' || activeSection === 'yoy') && (
                <section ref={yoyRef} className="mb-12">
                  <h2 className="section-title">Year-over-Year Analysis</h2>

                  <YearOverYearTable data={reportData} />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <YearOverYearChart
                      data={reportData}
                      title="New Customer Trend"
                      metric="newCustomers"
                    />
                    <YearOverYearChart
                      data={reportData}
                      title="Revenue Trend"
                      metric="totalRevenue"
                      valuePrefix="$"
                    />
                  </div>
                </section>
              )}

              {/* Trend Analysis Section */}
              {(activeSection === 'all' || activeSection === 'trends') && (
                <section ref={trendsRef} className="mb-12">
                  <h2 className="section-title">Trend Analysis</h2>

                  <CustomerGrowthChart data={reportData} />
                  <RevenueChart data={reportData} />
                  <CustomerValueComparison
                    currentMonth={latestMonth}
                    previousMonth={previousMonth}
                  />
                </section>
              )}

              {/* Revenue Composition Section */}
              {(activeSection === 'all' || activeSection === 'revenue') && (
                <section ref={revenueRef} className="mb-12">
                  <h2 className="section-title">Revenue Composition</h2>

                  <RevenueSourceBreakdown data={reportData} />
                  <RevenueSourcePercentage data={reportData} />
                  <RevenueSourceTrend data={reportData} />
                </section>
              )}

              {/* New Customer Analysis Section */}
              {(activeSection === 'all' || activeSection === 'newcustomer') && (
                <section ref={newCustomerRef} className="mb-12">
                  <h2 className="section-title">New Customer Analysis</h2>

                  <NewCustomerTrend data={reportData} />
                  <NewCustomerContribution data={reportData} />
                  <NewCustomerRevenue data={reportData} />
                  <NewCustomerInsights data={reportData} />
                </section>
              )}

              {/* Quarterly Analysis Section */}
              {(activeSection === 'all' || activeSection === 'quarterly') && (
                <section ref={quarterlyRef} className="mb-12">
                  <h2 className="section-title">Quarterly & Seasonal Analysis</h2>

                  <QuarterlyComparison data={reportData} />
                  <MonthOverMonthHeatmap data={reportData} />
                </section>
              )}

              {/* Detailed Tables Section */}
              {(activeSection === 'all' || activeSection === 'tables') && (
                <section ref={tablesRef} className="mb-12">
                  <h2 className="section-title">Detailed Performance</h2>

                  <MetricsTable data={reportData} />
                  <KeyMetricsSummary data={reportData} />
                </section>
              )}

              {/* Insights Section */}
              {(activeSection === 'all' || activeSection === 'insights') && (
                <section ref={insightsRef} className="mb-12">
                  <h2 className="section-title">Insights & Recommendations</h2>

                  <InsightsRecommendations data={reportData} />
                </section>
              )}
            </main>

            {/* Footer */}
            <footer className="bg-primary-700 shadow-sm py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-center text-sm text-white mb-4 md:mb-0">
                    © {new Date().getFullYear()} <span className='text-capitalize'>{nameData[0]}</span> MD MedSpa. All rights reserved.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-sm text-background hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 rounded-md px-3 py-1"
                      aria-label="Back to top"
                    >
                      Back to top
                    </button>
                    <button
                      onClick={exportData}
                      className="text-sm text-background hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 rounded-md px-3 py-1"
                      aria-label="Export data"
                    >
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          <>Loading</>
        )
      }
    </>

  );
}

export default App;