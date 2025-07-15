
import { OwaspCompliance, SansCompliance, SecurityRecommendation, SecurityPosture } from '@shared/schema';

export class PasswordAnalysisService {
  private commonPatterns = [
    /(.)\1{2,}/g, // Repeated characters
    /123|234|345|456|567|678|789|890/g, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/gi, // Sequential letters
    /qwerty|asdf|zxcv|qazwsx|plokm/gi, // Keyboard patterns
  ];

  private commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'shadow',
    'superman', 'michael', 'football', 'baseball', 'trustno1', 'hello'
  ];

  private dictionaryWords = [
    'computer', 'internet', 'security', 'system', 'network', 'database',
    'server', 'client', 'application', 'software', 'hardware', 'firewall'
  ];

  analyzeOwasp(password: string): OwaspCompliance {
    const compliance: OwaspCompliance = {
      minimumLength: password.length >= 8,
      uppercaseLetter: /[A-Z]/.test(password),
      lowercaseLetter: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialCharacter: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password),
      noCommonPatterns: !this.hasCommonPatterns(password),
      noDictionaryWords: !this.hasDictionaryWords(password),
      noPersonalInfo: !this.hasPersonalInfo(password),
      score: 0
    };

    // Calculate score
    const criteria = Object.values(compliance).filter(Boolean).length - 1; // Exclude score itself
    compliance.score = Math.round((criteria / 8) * 100);

    return compliance;
  }

  analyzeSans(password: string): SansCompliance {
    const compliance: SansCompliance = {
      lengthCheck: password.length >= 12,
      complexityScore: this.calculateComplexityScore(password),
      entropyLevel: this.calculateEntropy(password),
      uniqueness: !this.commonPasswords.some(common => 
        password.toLowerCase().includes(common.toLowerCase())
      ),
      noKeyboardPatterns: !this.hasKeyboardPatterns(password),
      score: 0
    };

    // Calculate SANS score
    let score = 0;
    score += compliance.lengthCheck ? 20 : 0;
    score += compliance.complexityScore === 'High' ? 20 : compliance.complexityScore === 'Medium' ? 10 : 0;
    score += compliance.entropyLevel >= 50 ? 20 : compliance.entropyLevel >= 30 ? 10 : 0;
    score += compliance.uniqueness ? 20 : 0;
    score += compliance.noKeyboardPatterns ? 20 : 0;

    compliance.score = score;

    return compliance;
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    // Length bonus
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) strength += 1;
    
    // Penalty for common patterns
    if (this.hasCommonPatterns(password)) strength -= 1;
    if (this.hasDictionaryWords(password)) strength -= 1;
    
    // Entropy bonus
    const entropy = this.calculateEntropy(password);
    if (entropy >= 50) strength += 1;
    
    return Math.max(1, Math.min(5, strength));
  }

  calculateSecurityPosture(password: string, owaspScore: number, sansScore: number): SecurityPosture {
    const strengthScore = this.calculatePasswordStrength(password);
    const entropyScore = Math.min(100, this.calculateEntropy(password));
    
    // Weighted average
    const finalScore = Math.round(
      (owaspScore * 0.3) + 
      (sansScore * 0.3) + 
      (strengthScore * 20 * 0.2) + 
      (entropyScore * 0.2)
    );

    let riskLevel = 'High';
    let recommendation = 'Strengthen password immediately';

    if (finalScore >= 80) {
      riskLevel = 'Low';
      recommendation = 'Password meets security standards';
    } else if (finalScore >= 60) {
      riskLevel = 'Medium';
      recommendation = 'Strengthen complexity and length';
    } else if (finalScore >= 40) {
      riskLevel = 'High';
      recommendation = 'Significant improvements needed';
    } else {
      riskLevel = 'Critical';
      recommendation = 'Replace with secure password';
    }

    return {
      score: finalScore,
      riskLevel,
      recommendation
    };
  }

  generateRecommendations(password: string, owasp: OwaspCompliance, sans: SansCompliance): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    if (!owasp.number || !owasp.specialCharacter) {
      recommendations.push({
        type: 'critical',
        title: 'Add Numbers & Symbols',
        description: 'Include at least one number and special character',
        priority: 1
      });
    }

    if (!sans.lengthCheck) {
      recommendations.push({
        type: 'critical',
        title: 'Increase Length',
        description: 'Aim for 12+ characters for optimal security',
        priority: 2
      });
    }

    if (!owasp.noCommonPatterns) {
      recommendations.push({
        type: 'warning',
        title: 'Avoid Common Patterns',
        description: 'Replace predictable sequences with random elements',
        priority: 3
      });
    }

    if (!sans.uniqueness) {
      recommendations.push({
        type: 'warning',
        title: 'Use Passphrase Method',
        description: 'Consider 4-5 random words with separators',
        priority: 4
      });
    }

    if (sans.entropyLevel < 50) {
      recommendations.push({
        type: 'info',
        title: 'Increase Randomness',
        description: 'Add more unpredictable character combinations',
        priority: 5
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  private hasCommonPatterns(password: string): boolean {
    return this.commonPatterns.some(pattern => pattern.test(password));
  }

  private hasDictionaryWords(password: string): boolean {
    return this.dictionaryWords.some(word => 
      password.toLowerCase().includes(word.toLowerCase())
    );
  }

  private hasPersonalInfo(password: string): boolean {
    // Simple check for common personal info patterns
    const personalPatterns = [
      /19\d{2}|20\d{2}/g, // Years
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi, // Months
      /\b(admin|user|test|demo)\b/gi, // Common usernames
    ];
    
    return personalPatterns.some(pattern => pattern.test(password));
  }

  private hasKeyboardPatterns(password: string): boolean {
    const keyboardPatterns = [
      /qwerty|asdf|zxcv|qazwsx|plokm/gi,
      /12345|67890|09876|54321/g,
    ];
    
    return keyboardPatterns.some(pattern => pattern.test(password));
  }

  private calculateComplexityScore(password: string): string {
    let score = 0;
    
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) score++;
    
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    if (score >= 5) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  }

  private calculateEntropy(password: string): number {
    const charset = this.getCharsetSize(password);
    const length = password.length;
    
    // Shannon entropy approximation
    const entropy = length * Math.log2(charset);
    return Math.round(entropy);
  }

  private getCharsetSize(password: string): number {
    let size = 0;
    
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/\d/.test(password)) size += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) size += 32;
    
    return Math.max(1, size);
  }
}
