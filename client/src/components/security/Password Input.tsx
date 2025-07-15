import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Info } from "lucide-react";

interface PasswordInputProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onAnalysisComplete: (data: any) => void;
  isAnalyzing: boolean;
}

export function PasswordInput({ password, onPasswordChange, onAnalysisComplete, isAnalyzing }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Very Weak");
  const [strengthColor, setStrengthColor] = useState("bg-red-500");

  const analyzePasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/password/analyze", { password });
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data);
      setStrengthScore(data.strengthScore);
      updateStrengthDisplay(data.strengthScore);
    },
    onError: (error) => {
      console.error("Password analysis failed:", error);
    }
  });

  useEffect(() => {
    if (password.length > 0) {
      const timer = setTimeout(() => {
        analyzePasswordMutation.mutate(password);
      }, 500); // Debounce analysis

      return () => clearTimeout(timer);
    } else {
      setStrengthScore(0);
      setStrengthLabel("Very Weak");
      setStrengthColor("bg-red-500");
    }
  }, [password]);

  const updateStrengthDisplay = (score: number) => {
    switch (score) {
      case 1:
        setStrengthLabel("Very Weak (1/5)");
        setStrengthColor("bg-red-500");
        break;
      case 2:
        setStrengthLabel("Weak (2/5)");
        setStrengthColor("bg-accent-orange");
        break;
      case 3:
        setStrengthLabel("Fair (3/5)");
        setStrengthColor("bg-yellow-500");
        break;
      case 4:
        setStrengthLabel("Good (4/5)");
        setStrengthColor("bg-blue-500");
        break;
      case 5:
        setStrengthLabel("Strong (5/5)");
        setStrengthColor("bg-accent-green");
        break;
      default:
        setStrengthLabel("Very Weak (0/5)");
        setStrengthColor("bg-red-500");
    }
  };

  const getStrengthWidth = () => {
    return `${(strengthScore / 5) * 100}%`;
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-dark">Password Security Analysis</h2>
          <div className="flex items-center space-x-2">
            <Info className="text-blue-500 h-4 w-4" />
            <span className="text-sm text-neutral-medium">Real-time OWASP & SANS compliance check</span>
          </div>
        </div>
        
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter password for security analysis..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0 text-neutral-medium hover:text-neutral-dark"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Real-time Strength Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-dark">Password Strength</span>
            <span className={`text-sm font-semibold ${strengthScore <= 2 ? 'text-accent-orange' : strengthScore <= 3 ? 'text-yellow-600' : strengthScore <= 4 ? 'text-blue-600' : 'text-accent-green'}`}>
              {isAnalyzing ? "Analyzing..." : strengthLabel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
              style={{ width: getStrengthWidth() }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

