import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Shuffle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PasswordGeneratorResult } from "@shared/schema";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(5);
  const { toast } = useToast();

  const generatePasswordMutation = useMutation({
    mutationFn: async (options: any) => {
      const response = await apiRequest("POST", "/api/password/generate", options);
      return response.json() as Promise<PasswordGeneratorResult>;
    },
    onSuccess: (data) => {
      setGeneratedPassword(data.password);
      setPasswordStrength(data.strength);
    },
    onError: (error) => {
      console.error("Password generation failed:", error);
      toast({
        title: "Generation failed",
        description: "Unable to generate password. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    generatePasswordMutation.mutate({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Password copied successfully",
      });
    });
  };

  const usePassword = () => {
    onPasswordGenerated(generatedPassword);
    toast({
      title: "Password applied",
      description: "Generated password is now being analyzed",
    });
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 1: return "Very Weak (1/5)";
      case 2: return "Weak (2/5)";
      case 3: return "Fair (3/5)";
      case 4: return "Good (4/5)";
      case 5: return "Strong (5/5)";
      default: return "Unknown";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return "text-accent-red";
      case 2: return "text-accent-orange";
      case 3: return "text-yellow-600";
      case 4: return "text-blue-600";
      case 5: return "text-accent-green";
      default: return "text-neutral-medium";
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Secure Password Generator</h3>
          <Shuffle className="text-secondary-green h-5 w-5" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-neutral-dark">Length:</label>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={8}
              max={32}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-medium text-neutral-dark w-8">{length}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
              <label htmlFor="uppercase" className="text-sm text-neutral-medium">Uppercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
              <label htmlFor="lowercase" className="text-sm text-neutral-medium">Lowercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
              <label htmlFor="numbers" className="text-sm text-neutral-medium">Numbers</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
              <label htmlFor="symbols" className="text-sm text-neutral-medium">Symbols</label>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
            <div className="flex items-center justify-between">
              <span className="break-all pr-2">
                {generatedPassword || "Click 'Generate New' to create a password"}
              </span>
              {generatedPassword && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-primary-blue hover:text-primary-dark flex-shrink-0"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerate}
              disabled={generatePasswordMutation.isPending}
              className="flex-1 bg-primary-blue text-white hover:bg-primary-dark"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              {generatePasswordMutation.isPending ? "Generating..." : "Generate New"}
            </Button>
            <Button
              onClick={usePassword}
              disabled={!generatedPassword}
              className="flex-1 bg-secondary-green text-white hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Use This
            </Button>
          </div>
          
          {generatedPassword && (
            <div className="text-center">
              <p className="text-xs text-neutral-medium">
                Generated password strength: <span className={`font-medium ${getStrengthColor()}`}>{getStrengthLabel()}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

