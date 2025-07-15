import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { CryptoAnalysis } from '@shared/schema';

export class CryptoService {
  private static readonly SALT_ROUNDS = 12;

  async analyzeCrypto(password: string): Promise<CryptoAnalysis> {
    const sha256Hash = this.generateSHA256(password);
    const bcryptResult = await this.generateBcrypt(password);
    
    return {
      sha256Hash,
      bcryptHash: bcryptResult.hash,
      salt: bcryptResult.salt,
      iterations: CryptoService.SALT_ROUNDS,
      algorithm: 'bcrypt'
    };
  }

  private generateSHA256(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private async generateBcrypt(password: string): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt(CryptoService.SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    
    return {
      hash,
      salt: salt.substring(0, 7) + salt.substring(7, 15) // Extract salt portion
    };
  }

  generateSecurePassword(length: number, options: {
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
  }): string {
    let charset = '';
    
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  calculateCrackTime(password: string): string {
    const charset = this.getCharsetSize(password);
    const length = password.length;
    
    // Assuming 1 billion guesses per second (modern GPU)
    const totalCombinations = Math.pow(charset, length);
    const averageGuesses = totalCombinations / 2;
    const guessesPerSecond = 1e9;
    
    const secondsToCrack = averageGuesses / guessesPerSecond;
    
    if (secondsToCrack < 60) {
      return `${Math.round(secondsToCrack)} seconds`;
    } else if (secondsToCrack < 3600) {
      return `${Math.round(secondsToCrack / 60)} minutes`;
    } else if (secondsToCrack < 86400) {
      return `${Math.round(secondsToCrack / 3600)} hours`;
    } else if (secondsToCrack < 31536000) {
      return `${Math.round(secondsToCrack / 86400)} days`;
    } else {
      return `${Math.round(secondsToCrack / 31536000)} years`;
    }
  }

