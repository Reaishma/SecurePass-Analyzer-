import { Card, CardContent } from "@/components/ui/card";
import { Bug, Search, Network } from "lucide-react";

interface SecurityTestingToolsProps {
  password: string;
}

export function SecurityTestingTools({ password }: SecurityTestingToolsProps) {
  const getVulnerabilityLevel = () => {
    if (!password) return "No password provided";
    if (password.length < 8) return "High vulnerability - Password too short";
    if (password.length < 12) return "Medium vulnerability - Consider longer password";
    return "Low vulnerability - Good password length";
  };

  const getPenetrationTestResult = () => {
    if (!password) return "Enter password to estimate crack time";
    
    let crackTime = "Unknown";
    if (password.length >= 16 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      crackTime = "Several centuries with modern hardware";
    } else if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
      crackTime = "Several years with modern hardware";
    } else if (password.length >= 8) {
      crackTime = "Several months with modern hardware";
    } else {
      crackTime = "Minutes to hours with modern hardware";
    }
    
    return `Estimated crack time: ${crackTime}`;
  };

  const getRiskScore = () => {
    if (!password) return "0.0";
    
    let score = 0;
    if (password.length < 8) score += 4;
    if (!/[A-Z]/.test(password)) score += 2;
    if (!/[a-z]/.test(password)) score += 2;
    if (!/\d/.test(password)) score += 1;
    if (!/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(10, score).toFixed(1);
  };

  const getVulnerabilityColor = () => {
    const score = parseFloat(getRiskScore());
    if (score >= 7) return "text-accent-red";
    if (score >= 4) return "text-accent-orange";
    return "text-primary-blue";
  };

  const getVulnerabilityBackground = () => {
    const score = parseFloat(getRiskScore());
    if (score >= 7) return "bg-red-50 border-red-200";
    if (score >= 4) return "bg-orange-50 border-orange-200";
    return "bg-blue-50 border-blue-200";
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Security Testing Tools Integration</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-xs text-neutral-medium">
              <Bug className="text-accent-red mr-1 h-3 w-3" />
              <span>Metasploit</span>
            </div>
            <div className="flex items-center text-xs text-neutral-medium">
              <Search className="text-accent-orange mr-1 h-3 w-3" />
              <span>Burp Suite</span>
            </div>
            <div className="flex items-center text-xs text-neutral-medium">
              <Network className="text-primary-blue mr-1 h-3 w-3" />
              <span>Nessus</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${getVulnerabilityBackground()} border rounded-lg p-4`}>
            <div className="flex items-center mb-2">
              <Bug className={`mr-2 h-4 w-4 ${getVulnerabilityColor()}`} />
              <span className={`text-sm font-medium ${getVulnerabilityColor()}`}>Vulnerability Scan</span>
            </div>
            <p className="text-xs text-neutral-medium">{getVulnerabilityLevel()}</p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Search className="text-accent-orange mr-2 h-4 w-4" />
              <span className="text-sm font-medium text-accent-orange">Penetration Test</span>
            </div>
            <p className="text-xs text-neutral-medium">{getPenetrationTestResult()}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Network className="text-primary-blue mr-2 h-4 w-4" />
              <span className="text-sm font-medium text-primary-blue">Risk Assessment</span>
            </div>
            <p className="text-xs text-neutral-medium">
              {password ? `${getRiskScore()}/10 vulnerability score` : "Enter password for risk assessment"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

