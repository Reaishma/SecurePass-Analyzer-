import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Check, X } from "lucide-react";
import { SansCompliance as SansComplianceType } from "@shared/schema";

interface SansGuidelinesProps {
  data?: SansComplianceType;
}

export function SansGuidelines({ data }: SansGuidelinesProps) {
  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <Check className="h-4 w-4 text-accent-green" />
    ) : (
      <X className="h-4 w-4 text-accent-red" />
    );
  };

  const getComplianceLevel = () => {
    if (!data) return "Poor";
    if (data.score >= 80) return "Excellent";
    if (data.score >= 60) return "Good";
    if (data.score >= 40) return "Moderate";
    return "Poor";
  };

  const getComplianceColor = () => {
    const level = getComplianceLevel();
    if (level === "Excellent") return "text-accent-green";
    if (level === "Good") return "text-blue-600";
    if (level === "Moderate") return "text-accent-orange";
    return "text-accent-red";
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">SANS Guidelines</h3>
          <div className="flex items-center">
            <AlertTriangle className={`mr-2 h-4 w-4 ${getComplianceColor()}`} />
            <span className={`text-sm font-medium ${getComplianceColor()}`}>
              {getComplianceLevel()}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Length ≥ 12 chars</span>
            {getStatusIcon(data?.lengthCheck || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Complexity Score</span>
            <span className={`text-sm font-medium ${
              data?.complexityScore === 'High' ? 'text-accent-green' :
              data?.complexityScore === 'Medium' ? 'text-accent-orange' : 'text-accent-red'
            }`}>
              {data?.complexityScore || 'Low'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Entropy Level</span>
            <span className={`text-sm font-medium ${
              (data?.entropyLevel || 0) >= 50 ? 'text-accent-green' :
              (data?.entropyLevel || 0) >= 30 ? 'text-accent-orange' : 'text-accent-red'
            }`}>
              {data?.entropyLevel || 0} bits
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Uniqueness</span>
            {getStatusIcon(data?.uniqueness || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">No Keyboard Patterns</span>
            {getStatusIcon(data?.noKeyboardPatterns || false)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

