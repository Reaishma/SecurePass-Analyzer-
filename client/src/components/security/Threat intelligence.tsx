import { Card, CardContent } from "@/components/ui/card";
import { Database, AlertTriangle, List, Shield } from "lucide-react";
import { ThreatIntelligence as ThreatIntelligenceType } from "@shared/schema";

interface ThreatIntelligenceProps {
  data?: ThreatIntelligenceType;
}

export function ThreatIntelligence({ data }: ThreatIntelligenceProps) {
  const getRiskLevelColor = () => {
    if (!data) return "text-neutral-medium";
    switch (data.riskLevel) {
      case 'Critical': return "text-red-600";
      case 'High': return "text-accent-red";
      case 'Medium': return "text-accent-orange";
      case 'Low': return "text-accent-green";
      default: return "text-neutral-medium";
    }
  };

  const getBorderColor = () => {
    if (!data) return "border-gray-200";
    switch (data.riskLevel) {
      case 'Critical': return "border-red-200";
      case 'High': return "border-red-200";
      case 'Medium': return "border-orange-200";
      case 'Low': return "border-green-200";
      default: return "border-gray-200";
    }
  };

  const getBackgroundColor = () => {
    if (!data) return "bg-gray-50";
    switch (data.riskLevel) {
      case 'Critical': return "bg-red-50";
      case 'High': return "bg-red-50";
      case 'Medium': return "bg-orange-50";
      case 'Low': return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Threat Intelligence</h3>
          <div className="flex items-center space-x-2">
            <Database className="text-primary-blue text-sm h-4 w-4" />
            <span className="text-xs text-neutral-medium">IBM X-Force • AlienVault</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {data?.breachDatabaseMatch && (
            <div className={`${getBackgroundColor()} border ${getBorderColor()} rounded-lg p-4`}>
              <div className="flex items-center">
                <AlertTriangle className="text-accent-red mr-2 h-4 w-4" />
                <span className="text-sm font-medium text-accent-red">Breach Database Match</span>
              </div>
              <p className="text-xs text-neutral-medium mt-1">
                {data.breachDetails || 'Similar password found in security breach'}
              </p>
            </div>
          )}
          
          {data?.commonPasswordList && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <List className="text-accent-orange mr-2 h-4 w-4" />
                <span className="text-sm font-medium text-accent-orange">Common Password List</span>
              </div>
              <p className="text-xs text-neutral-medium mt-1">
                Variations found in top 10,000 passwords
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="text-primary-blue mr-2 h-4 w-4" />
              <span className="text-sm font-medium text-primary-blue">Threat Score</span>
            </div>
            <p className="text-xs text-neutral-medium mt-1">
              {data?.riskLevel || 'Unknown'} risk - {data?.threatScore || 0}/10 vulnerability rating
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

