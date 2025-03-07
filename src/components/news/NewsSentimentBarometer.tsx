
import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface NewsSentimentBarometerProps {
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

export const NewsSentimentBarometer = ({ 
  positiveCount, 
  negativeCount, 
  neutralCount 
}: NewsSentimentBarometerProps) => {
  const total = positiveCount + negativeCount + neutralCount;
  
  // Calculate percentages
  const positivePercentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const negativePercentage = total > 0 ? Math.round((negativeCount / total) * 100) : 0;
  const neutralPercentage = total > 0 ? Math.round((neutralCount / total) * 100) : 0;
  
  // Calculate the sentiment score (-100 to 100)
  // -100 means completely negative, 0 is neutral, 100 is completely positive
  const sentimentScore = total > 0 
    ? Math.round(((positiveCount - negativeCount) / total) * 100) 
    : 0;
  
  // Calculate progress value (0-100) for the Progress component
  // Map the sentiment score (-100 to 100) to a progress value (0 to 100)
  const progressValue = sentimentScore < 0 
    ? 50 - Math.abs(sentimentScore) / 2 
    : 50 + sentimentScore / 2;
    
  // Get barometer label based on sentiment score
  const getBarometerLabel = () => {
    if (sentimentScore > 30) return "Very Positive";
    if (sentimentScore > 10) return "Positive";
    if (sentimentScore > -10) return "Neutral";
    if (sentimentScore > -30) return "Negative";
    return "Very Negative";
  };
  
  // Get sentiment color
  const getSentimentColor = () => {
    if (sentimentScore > 30) return "text-green-600 dark:text-green-400";
    if (sentimentScore > 10) return "text-green-500 dark:text-green-400";
    if (sentimentScore > -10) return "text-gray-600 dark:text-gray-400";
    if (sentimentScore > -30) return "text-red-500 dark:text-red-400";
    return "text-red-600 dark:text-red-400";
  };
  
  return (
    <div className="border rounded-lg p-4 bg-muted/10 space-y-4">
      <h3 className="font-medium text-center">Market Sentiment Barometer</h3>
      
      <div className="relative pt-4">
        <div className="flex justify-between mb-1 text-xs">
          <div className="flex items-center text-green-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            Positive
          </div>
          <div className="flex items-center text-gray-500">
            <Minus className="h-3 w-3 mr-1" />
            Neutral
          </div>
          <div className="flex items-center text-red-500">
            <TrendingDown className="h-3 w-3 mr-1" />
            Negative
          </div>
        </div>
        
        <div className="relative">
          <Progress value={progressValue} className="h-3">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-l-full opacity-70"></div>
              <div className="w-1/2 bg-gradient-to-r from-amber-400 to-red-500 rounded-r-full opacity-70"></div>
            </div>
          </Progress>
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-slate-800 dark:bg-slate-200 z-10"
            aria-hidden="true"
          />
        </div>
        
        <div className="flex items-center justify-center mt-3 text-sm font-medium">
          <span className={getSentimentColor()}>{getBarometerLabel()}</span>
          {sentimentScore < 0 ? (
            <ArrowLeft className={`ml-1 h-4 w-4 text-red-500`} />
          ) : sentimentScore > 0 ? (
            <ArrowRight className={`ml-1 h-4 w-4 text-green-500`} />
          ) : (
            <Minus className={`ml-1 h-4 w-4 text-gray-500`} />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 text-center text-sm bg-muted/20 rounded-lg py-2">
        <div>
          <div className="text-green-500 font-medium">{positivePercentage}%</div>
          <div className="text-xs text-muted-foreground">Positive</div>
        </div>
        <div>
          <div className="text-gray-500 font-medium">{neutralPercentage}%</div>
          <div className="text-xs text-muted-foreground">Neutral</div>
        </div>
        <div>
          <div className="text-red-500 font-medium">{negativePercentage}%</div>
          <div className="text-xs text-muted-foreground">Negative</div>
        </div>
      </div>
    </div>
  );
};
