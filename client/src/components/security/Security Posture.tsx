import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { SecurityPosture as SecurityPostureType } from "@shared/schema";

interface SecurityPostureProps {
  data?: SecurityPostureType;
}

export function SecurityPosture({ data }: SecurityPostureProps) {
  const score = data?.score || 0;
  const riskLevel = data?.riskLevel || 'Unknown';
  const recommendation = data?.recommendation || 'Analyze password to get recommendations';

  const getScoreColor = () => {
    if (score >= 80) return "text-accent-green";
    if (score >= 60) return "text-accent-orange";
    if (score >= 40) return "text-yellow-600";
    return "text-accent-red";
  };

  const getCircleColor = () => {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#F57C00";
    if (score >= 40) return "#FFC107";
    return "#D32F2F";
  };

  const getStrokeDashoffset = () => {
    const circumference = 2 * Math.PI * 40;
    return circumference - (score / 100) * circumference;
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Security Posture</h3>
          <div className="flex items-center">
            <TrendingUp className="text-primary-blue mr-2 h-4 w-4" />
            <span className="text-sm font-medium text-primary-blue">Score: {score}/100</span>
          </div>
        </div>
        
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke="#ECEFF1" 
              strokeWidth="8" 
              fill="none"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke={getCircleColor()} 
              strokeWidth="8" 
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset={getStrokeDashoffset()}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-neutral-medium mb-2">
            Risk Level: <span className={`font-medium ${getScoreColor()}`}>{riskLevel}</span>
          </p>
          <p className="text-xs text-neutral-medium">{recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

