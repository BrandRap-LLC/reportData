import React from 'react';
import { ReportData, getMonthOverMonthChange, getYearOverYearChange, getRetentionRate, generateInsights } from '../data/reportData';
import { AlertTriangle, TrendingUp, TrendingDown, Lightbulb, ArrowRight, Calendar } from 'lucide-react';

interface InsightsRecommendationsProps {
  data: ReportData[];
}

const InsightsRecommendations: React.FC<InsightsRecommendationsProps> = ({ data }) => {
  // Generate insights using the new function
  const insights = generateInsights(data);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="card">
        <h3 className="text-primary-600 font-medium mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-primary-600" aria-hidden="true" />
          Key Observations
        </h3>
        
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.filter(insight => insight.type === 'three_month_comparison').length > 0 && (
              <div className="mb-4">
                <h4 className="text-primary-600 font-medium text-sm mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                  3-Month Trends
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {insights
                    .filter(insight => insight.type === 'three_month_comparison')
                    .map((insight, index) => (
                      <li key={index} className={`text-sm ${insight.isPositive ? 'text-positive' : 'text-negative'}`}>
                        {insight.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            
            {insights.filter(insight => insight.type === 'year_over_year').length > 0 && (
              <div className="mb-4">
                <h4 className="text-secondary-DEFAULT font-medium text-sm mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true" />
                  Year-over-Year Trends
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {insights
                    .filter(insight => insight.type === 'year_over_year')
                    .map((insight, index) => (
                      <li key={index} className={`text-sm ${insight.isPositive ? 'text-positive' : 'text-negative'}`}>
                        {insight.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            
            {insights.filter(insight => insight.type === 'month_over_month').length > 0 && (
              <div className="mb-4 opacity-80">
                <h4 className="text-primary-800 font-medium text-sm mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true" />
                  Month-over-Month Changes
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {insights
                    .filter(insight => insight.type === 'month_over_month')
                    .map((insight, index) => (
                      <li key={index} className={`text-sm ${insight.isPositive ? 'text-positive' : 'text-negative'}`}>
                        {insight.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-primary-700 italic">No significant trends detected in the current data.</p>
        )}
      </div>
      
      <div className="card">
        <h3 className="text-primary-600 font-medium mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-primary-600" aria-hidden="true" />
          Recommendation Engine
        </h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-primary-600 pl-4 py-1">
            <h4 className="text-primary-600 font-medium text-sm mb-1 flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" aria-hidden="true" />
              Focus on 3-Month Trends
            </h4>
            <p className="text-sm text-primary-800">
              Prioritize analyzing 3-month trends over monthly fluctuations for more reliable insights. This reduces the impact of short-term volatility and provides a clearer picture of business performance.
            </p>
          </div>
          
          <div className="border-l-4 border-secondary-DEFAULT pl-4 py-1">
            <h4 className="text-secondary-dark font-medium text-sm mb-1 flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" aria-hidden="true" />
              Compare with Same Period Last Year
            </h4>
            <p className="text-sm text-primary-800">
              Always benchmark current performance against the same period last year to account for seasonality. This provides context for whether current performance is truly improving or just following seasonal patterns.
            </p>
          </div>
          
          <div className="border-l-4 border-primary-700 pl-4 py-1">
            <h4 className="text-primary-700 font-medium text-sm mb-1 flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" aria-hidden="true" />
              Set Rolling Targets
            </h4>
            <p className="text-sm text-primary-800">
              Establish rolling 3-month targets rather than fixed monthly goals. This approach provides more flexibility while maintaining accountability for consistent performance improvement.
            </p>
          </div>
          
          <div className="border-l-4 border-background pl-4 py-1">
            <h4 className="text-primary-700 font-medium text-sm mb-1 flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" aria-hidden="true" />
              Implement Quarterly Reviews
            </h4>
            <p className="text-sm text-primary-800">
              Schedule comprehensive quarterly performance reviews that analyze 3-month periods and year-over-year comparisons. This cadence aligns with standard business cycles and provides meaningful intervals for strategic adjustments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsRecommendations;