
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  BarChart2, 
  MessageCircle,
  Database,
  Flame
} from 'lucide-react';

interface IndicatorProps {
  name: string;
  value: string;
  status?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const Indicator = ({ name, value, status = 'neutral', icon }: IndicatorProps) => {
  const statusClasses = {
    positive: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    negative: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    neutral: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  };
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center">
        <div className="p-2 mr-3 rounded-full bg-secondary/50">
          {icon}
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <Badge variant="outline" className={statusClasses[status]}>
        {value}
      </Badge>
    </div>
  );
};

export const TradingSystemInfo = () => {
  // Mock data - would be replaced with actual API data
  const technicalScore = 0.68;
  const sentimentScore = 0.45;
  const macroScore = 0.52;
  const onchainScore = 0.71;
  const lastModelTraining = "2 hours ago";
  const modelAccuracy = "74.5%";
  
  // Determine status based on score
  const getStatus = (score: number) => {
    if (score >= 0.6) return 'positive';
    if (score <= 0.4) return 'negative';
    return 'neutral';
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" />
          <div>
            <CardTitle>Prometheus System</CardTitle>
            <CardDescription>Trading system components</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <Indicator 
            name="Technical Analysis" 
            value={`${(technicalScore * 100).toFixed(1)}%`}
            status={getStatus(technicalScore)}
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <Indicator 
            name="Sentiment Analysis" 
            value={`${(sentimentScore * 100).toFixed(1)}%`}
            status={getStatus(sentimentScore)}
            icon={<MessageCircle className="h-4 w-4" />}
          />
          <Indicator 
            name="Macro Economic" 
            value={`${(macroScore * 100).toFixed(1)}%`}
            status={getStatus(macroScore)}
            icon={<Activity className="h-4 w-4" />}
          />
          <Indicator 
            name="On-Chain Metrics" 
            value={`${(onchainScore * 100).toFixed(1)}%`}
            status={getStatus(onchainScore)}
            icon={<Database className="h-4 w-4" />}
          />
          <Indicator 
            name="ML Model Accuracy" 
            value={modelAccuracy}
            status="positive"
            icon={<Brain className="h-4 w-4" />}
          />
          <Indicator 
            name="Last Model Training" 
            value={lastModelTraining}
            status="neutral"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};
