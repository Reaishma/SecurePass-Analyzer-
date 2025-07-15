fromseState } from "react";
import { PasswordInput } from "@/components/security/PasswordInput";
import { OwaspCompliance } from "@/components/security/OwaspCompliance";
import { SansGuidelines } from "@/components/security/SansGuidelines";
import { SecurityPosture } from "@/components/security/SecurityPosture";
import { ThreatIntelligence } from "@/components/security/ThreatIntelligence";
import { CryptographicAnalysis } from "@/components/security/CryptographicAnalysis";
import { SecurityRecommendations } from "@/components/security/SecurityRecommendations";
import { PasswordGenerator } from "@/components/security/PasswordGenerator";
import { SecurityTestingTools } from "@/components/security/SecurityTestingTools";
import { Shield, Cloud, Tag } from "lucide-react";

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (newPassword.length > 0) {
      // Debounce analysis
      setIsAnalyzing(true);
      // Analysis will be triggered by PasswordInput component
    }
  };

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="text-primary-blue text-2xl mr-3" />
              <h1 className="text-xl font-bold text-neutral-dark">SecurePass Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-neutral-medium">
                <Cloud className="text-primary-blue mr-2 h-4 w-4" />
                <span>Azure Security Center</span>
              </div>
              <div className="flex items-center text-sm text-neutral-medium">
                <Tag className="text-secondary-green mr-2 h-4 w-4" />
                <span>OWASP Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Password Input Section */}
        <div className="mb-8">
          <PasswordInput
            password={password}
            onPasswordChange={handlePasswordChange}
            onAnalysisComplete={handleAnalysisComplete}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Security Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <OwaspCompliance data={analysisData?.owaspCompliance} />
          <SansGuidelines data={analysisData?.sansCompliance} />
          <SecurityPosture data={analysisData?.securityPosture} />
        </div>

        {/* Threat Intelligence & Cryptography Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ThreatIntelligence data={analysisData?.threatIntelligence} />
          <CryptographicAnalysis data={analysisData?.cryptoAnalysis} />
        </div>

        {/* Security Recommendations & Password Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SecurityRecommendations data={analysisData?.recommendations} />
          <PasswordGenerator onPasswordGenerated={handlePasswordChange} />
        </div>

        {/* Security Testing Tools Integration */}
        <SecurityTestingTools password={password} />
      </main>
    </div>
  );
}

