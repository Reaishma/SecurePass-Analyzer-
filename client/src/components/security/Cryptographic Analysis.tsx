import { Card, CardContent } from "@/components/ui/card";
import { Key, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CryptoAnalysis } from "@shared/schema";

interface CryptographicAnalysisProps {
  data?: CryptoAnalysis;
}

export function CryptographicAnalysis({ data }: CryptographicAnalysisProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${label} copied successfully`,
      });
    });
  };

  const truncateHash = (hash: string, length: number = 32) => {
    return hash.length > length ? `${hash.substring(0, length)}...` : hash;
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Cryptographic Analysis</h3>
          <div className="flex items-center">
            <Key className="text-secondary-green mr-2 h-4 w-4" />
            <span className="text-xs text-neutral-medium">OpenSSL</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">SHA-256 Hash</label>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-neutral-medium">
              <div className="flex items-center justify-between">
                <span className="break-all pr-2">
                  {data?.sha256Hash ? truncateHash(data.sha256Hash, 56) : 'Enter password to generate hash'}
                </span>
                {data?.sha256Hash && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-primary-blue hover:text-primary-dark flex-shrink-0"
                    onClick={() => copyToClipboard(data.sha256Hash, "SHA-256 hash")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">bcrypt Hash</label>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-neutral-medium">
              <div className="flex items-center justify-between">
                <span className="break-all pr-2">
                  {data?.bcryptHash ? truncateHash(data.bcryptHash, 56) : 'Enter password to generate hash'}
                </span>
                {data?.bcryptHash && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-primary-blue hover:text-primary-dark flex-shrink-0"
                    onClick={() => copyToClipboard(data.bcryptHash, "bcrypt hash")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Salt</label>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono text-neutral-medium">
                <span>{data?.salt || 'N/A'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Iterations</label>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono text-neutral-medium">
                <span>{data?.iterations ? `${data.iterations} (${Math.pow(2, data.iterations)})` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

