import { Card, CardContent } from "@/components/ui/card";
import { Shield, Check, X } from "lucide-react";
import { OwaspCompliance as OwaspComplianceType } from "@shared/schema";

interface OwaspComplianceProps {
  data?: OwaspComplianceType;
}

export function OwaspCompliance({ data }: OwaspComplianceProps) {
  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <Check className="h-4 w-4 text-accent-green" />
    ) : (
      <X className="h-4 w-4 text-accent-red" />
    );
  };

  const getPassedCount = () => {
    if (!data) return 0;
    return Object.values(data).filter((value, index) => index < 8 && value).length;
  };

  const getComplianceColor = () => {
    const passed = getPassedCount();
    if (passed >= 7) return "text-accent-green";
    if (passed >= 5) return "text-accent-orange";
    return "text-accent-red";
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">OWASP Compliance</h3>
          <div className="flex items-center">
            <Shield className={`mr-2 h-4 w-4 ${getComplianceColor()}`} />
            <span className={`text-sm font-medium ${getComplianceColor()}`}>
              {getPassedCount()}/8 Passed
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Minimum Length (8+)</span>
            {getStatusIcon(data?.minimumLength || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Uppercase Letter</span>
            {getStatusIcon(data?.uppercaseLetter || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Lowercase Letter</span>
            {getStatusIcon(data?.lowercaseLetter || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Number</span>
            {getStatusIcon(data?.number || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Special Character</span>
            {getStatusIcon(data?.specialCharacter || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">No Common Patterns</span>
            {getStatusIcon(data?.noCommonPatterns || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">No Dictionary Words</span>
            {getStatusIcon(data?.noDictionaryWords || false)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">No Personal Info</span>
            {getStatusIcon(data?.noPersonalInfo || false)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
