
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PatternIdentifierProps {
  cryptocurrency: string;
  dateRange: { from: Date; to: Date };
  eventCategories: string[];
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'mixed';
  category: string;
  occurrences: number;
  averageImpact: number;
  timeDelay: number;
}

// Mock data generator for patterns
const generatePatterns = (crypto: string, categories: string[]): Pattern[] => {
  const patterns: Pattern[] = [
    {
      id: '1',
      name: 'Regulatory Announcement Effect',
      description: 'Price typically drops immediately after regulatory announcements, then recovers within 7-14 days',
      confidence: 87,
      impact: 'mixed' as const,
      category: 'regulatory',
      occurrences: 28,
      averageImpact: -12.4,
      timeDelay: 1.2
    },
    {
      id: '2',
      name: 'Federal Reserve Rate Decision',
      description: 'Interest rate hikes correlate with short-term sell-offs in crypto markets',
      confidence: 92,
      impact: 'negative' as const,
      category: 'economic',
      occurrences: 12,
      averageImpact: -7.8,
      timeDelay: 0.5
    },
    {
      id: '3',
      name: 'Major Corporate Adoption',
      description: 'Announcements of corporate crypto treasury additions lead to sustained price increases',
      confidence: 76,
      impact: 'positive' as const,
      category: 'economic',
      occurrences: 8,
      averageImpact: 18.3,
      timeDelay: 2.1
    },
    {
      id: '4',
      name: 'Geopolitical Instability',
      description: 'Regional political instability initially causes volatility followed by increased adoption',
      confidence: 64,
      impact: 'mixed' as const,
      category: 'political',
      occurrences: 19,
      averageImpact: 9.7,
      timeDelay: 8.4
    },
    {
      id: '5',
      name: 'Major Exchange Hack',
      description: 'Security breaches at major exchanges cause immediate sharp declines followed by consolidation',
      confidence: 82,
      impact: 'negative' as const,
      category: 'disaster',
      occurrences: 7,
      averageImpact: -24.6,
      timeDelay: 0.2
    },
    {
      id: '6',
      name: 'Institutional Investment Announcement',
      description: 'Announcements of major institutional investments lead to sustained rallies',
      confidence: 88,
      impact: 'positive' as const,
      category: 'economic',
      occurrences: 15,
      averageImpact: 14.2,
      timeDelay: 1.8
    },
    {
      id: '7',
      name: 'Global Liquidity Crisis',
      description: 'Banking or liquidity crises initially cause selloffs but later drive crypto adoption',
      confidence: 71,
      impact: 'mixed' as const,
      category: 'economic',
      occurrences: 6,
      averageImpact: -8.9,
      timeDelay: 15.2
    },
    {
      id: '8',
      name: 'Stablecoin Regulation',
      description: 'Regulatory statements specifically about stablecoins impact broader crypto market',
      confidence: 79,
      impact: 'negative' as const,
      category: 'regulatory',
      occurrences: 11,
      averageImpact: -11.3,
      timeDelay: 3.8
    },
  ].filter(pattern => categories.includes(pattern.category));
  
  return patterns;
};

export const PatternIdentifier = ({
  cryptocurrency,
  dateRange,
  eventCategories
}: PatternIdentifierProps) => {
  const patterns = generatePatterns(cryptocurrency, eventCategories);
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };
  
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'economic':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Economic</Badge>;
      case 'political':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">Political</Badge>;
      case 'regulatory':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Regulatory</Badge>;
      case 'disaster':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Disaster</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pattern Identification</CardTitle>
        <CardDescription>
          Historical patterns detected between world events and {cryptocurrency} price movements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {patterns.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium">No patterns detected</h3>
            <p className="mt-1">
              Try selecting different event categories or expanding the date range
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Confidence</TableHead>
                <TableHead className="text-center">Impact</TableHead>
                <TableHead className="text-right">Delay (days)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patterns.map((pattern) => (
                <TableRow key={pattern.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{pattern.name}</div>
                      <div className="text-xs text-muted-foreground">{pattern.description}</div>
                      <div className="text-xs mt-1">
                        <span className="inline-flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                          {pattern.occurrences} occurrences
                        </span>
                        <span className="inline-flex items-center ml-3">
                          {getImpactIcon(pattern.impact)}
                          <span className="ml-1">{pattern.averageImpact}% avg</span>
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(pattern.category)}</TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <Progress value={pattern.confidence} className={`h-2 ${getConfidenceColor(pattern.confidence)}`} />
                      <div className="text-xs font-medium">{pattern.confidence}%</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`flex items-center justify-center ${getImpactColor(pattern.impact)}`}>
                      {getImpactIcon(pattern.impact)}
                      <span className="ml-1 capitalize">{pattern.impact}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {pattern.timeDelay.toFixed(1)}d
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
