import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";
import { SecurityRecommendation } from "@shared/schema";

interface SecurityRecommendationsProps {
  data?: SecurityRecommendation[];
}

export function SecurityRecommendations({ data }: SecurityRecommendationsProps) {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <ArrowRight className="text-accent-red mt-1 h-4 w-4" />;
      case 'warning':
        return <ArrowRight className="text-accent-orange mt-1 h-4 w-4" />;
      case 'info':
        return <ArrowRight className="text-blue-500 mt-1 h-4 w-4" />;
      default:
        return <ArrowRight className="text-neutral-medium mt-1 h-4 w-4" />;
    }
  };

  const defaultRecommendations: SecurityRecommendation[] = [
    {
      type: 'info',
      title: 'Enter a Password',
      description: 'Type a password to get personalized security recommendations',
      priority: 1
    },
    {
      type: 'info',
      title: 'Use Strong Passwords',
      description: 'Combine uppercase, lowercase, numbers, and special characters',
      priority: 2
    },
    {
      type: 'info',
      title: 'Aim for Length',
      description: 'Longer passwords are exponentially harder to crack',
      priority: 3
    },
    {
      type: 'info',
      title: 'Avoid Common Patterns',
      description: 'Stay away from predictable sequences and keyboard patterns',
      priority: 4
    }
  ];

  const recommendations = data && data.length > 0 ? data : defaultRecommendations;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="text-accent-orange mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold text-neutral-dark">Security Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              {getRecommendationIcon(recommendation.type)}
              <div>
                <p className="text-sm font-medium text-neutral-dark">{recommendation.title}</p>
                <p className="text-xs text-neutral-medium">{recommendation.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

