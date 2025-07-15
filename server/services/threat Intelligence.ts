import { ThreatIntelligence } from '@shared/schema';

export class ThreatIntelligenceService {
  private knownBreaches = [
    { name: 'LinkedIn', year: 2012, passwords: ['linkedin', 'password123', 'welcome123'] },
    { name: 'Yahoo', year: 2013, passwords: ['yahoo123', 'mail123', 'ymail'] },
    { name: 'Adobe', year: 2013, passwords: ['adobe123', 'creative', 'photoshop'] },
    { name: 'Equifax', year: 2017, passwords: ['equifax', 'credit123', 'score123'] },
    { name: 'Facebook', year: 2019, passwords: ['facebook', 'fb123', 'social123'] }
  ];

  private commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'shadow',
    'superman', 'michael', 'football', 'baseball', 'trustno1', 'hello',
    'princess', 'sunshine', 'iloveyou', 'charlie', 'bailey', 'passw0rd',
    'jordan', 'assword', 'freedom', 'computer', 'internet', 'security'
  ];

  async analyzeThreatIntelligence(password: string): Promise<ThreatIntelligence> {
    const passwordLower = password.toLowerCase();
    
    // Check for breach database matches
    const breachMatch = this.knownBreaches.find(breach => 
      breach.passwords.some(p => passwordLower.includes(p))
    );
    
    // Check common password lists
    const isCommonPassword = this.commonPasswords.some(common => 
      passwordLower.includes(common) || this.calculateSimilarity(passwordLower, common) > 0.7
    );
    
    // Calculate threat score
    let threatScore = 0;
    
    if (breachMatch) threatScore += 4;
    if (isCommonPassword) threatScore += 3;
    if (this.hasWeakPatterns(password)) threatScore += 2;
    if (password.length < 8) threatScore += 1;
    
    // Determine risk level
    let riskLevel = 'Low';
    if (threatScore >= 7) riskLevel = 'Critical';
    else if (threatScore >= 5) riskLevel = 'High';
    else if (threatScore >= 3) riskLevel = 'Medium';
    
    return {
      breachDatabaseMatch: !!breachMatch,
      breachDetails: breachMatch ? `Similar password found in ${breachMatch.year} ${breachMatch.name} breach` : undefined,
      commonPasswordList: isCommonPassword,
      threatScore,
      riskLevel
    };
  }

  // Simulate IBM X-Force and AlienVault API calls
  async checkIBMXForce(password: string): Promise<{ threat: boolean; details: string }> {
    // In production, this would make actual API calls
    const passwordHash = this.simpleHash(password);
    const isKnownThreat = this.commonPasswords.includes(password.toLowerCase());
    
    return {
      threat: isKnownThreat,
      details: isKnownThreat ? 'Password found in IBM X-Force threat database' : 'No threats detected'
    };
  }

  async checkAlienVault(password: string): Promise<{ malicious: boolean; reputation: number }> {
    // In production, this would make actual API calls
    const reputation = this.calculateReputation(password);
    
    return {
      malicious: reputation < 50,
      reputation
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private hasWeakPatterns(password: string): boolean {
    const weakPatterns = [
      /(.)\1{2,}/g, // Repeated characters
      /123|234|345|456|567|678|789/g, // Sequential numbers
      /qwerty|asdf|zxcv/gi, // Keyboard patterns
      /password|admin|user|test/gi // Common words
    ];
    
    return weakPatterns.some(pattern => pattern.test(password));
  }

  private calculateReputation(password: string): number {
    let reputation = 100;
    
    if (this.commonPasswords.includes(password.toLowerCase())) reputation -= 50;
    if (password.length < 8) reputation -= 20;
    if (!/[A-Z]/.test(password)) reputation -= 10;
    if (!/[a-z]/.test(password)) reputation -= 10;
    if (!/\d/.test(password)) reputation -= 10;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) reputation -= 10;
    
    return Math.max(0, reputation);
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

