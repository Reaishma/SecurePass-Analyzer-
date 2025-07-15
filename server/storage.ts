import { users, passwordAnalysis, type User, type InsertUser, type PasswordAnalysis, type InsertPasswordAnalysis } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPasswordAnalysis(analysis: InsertPasswordAnalysis): Promise<PasswordAnalysis>;
  getPasswordAnalysisHistory(): Promise<PasswordAnalysis[]>;
  getPasswordAnalysisById(id: number): Promise<PasswordAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private passwordAnalyses: Map<number, PasswordAnalysis>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.passwordAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPasswordAnalysis(insertAnalysis: InsertPasswordAnalysis): Promise<PasswordAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: PasswordAnalysis = {
      id,
      passwordHash: insertAnalysis.passwordHash,
      strengthScore: insertAnalysis.strengthScore,
      owaspCompliance: insertAnalysis.owaspCompliance,
      sansCompliance: insertAnalysis.sansCompliance,
      threatIntelligence: insertAnalysis.threatIntelligence,
      cryptoAnalysis: insertAnalysis.cryptoAnalysis,
      recommendations: insertAnalysis.recommendations,
      securityPosture: insertAnalysis.securityPosture,
      createdAt: new Date()
    };
    this.passwordAnalyses.set(id, analysis);
    return analysis;
  }

  async getPasswordAnalysisHistory(): Promise<PasswordAnalysis[]> {
    return Array.from(this.passwordAnalyses.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 10); // Return last 10 analyses
  }

  async getPasswordAnalysisById(id: number): Promise<PasswordAnalysis | undefined> {
    return this.passwordAnalyses.get(id);
  }
}

export const storage = new MemStorage();

