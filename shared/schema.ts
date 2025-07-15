import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const passwordAnalysis = pgTable("password_analysis", {
  id: serial("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  strengthScore: integer("strength_score").notNull(),
  owaspCompliance: jsonb("owasp_compliance"),
  sansCompliance: jsonb("sans_compliance"),
  threatIntelligence: jsonb("threat_intelligence"),
  cryptoAnalysis: jsonb("crypto_analysis"),
  recommendations: jsonb("recommendations"),
  securityPosture: integer("security_posture").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPasswordAnalysisSchema = createInsertSchema(passwordAnalysis).omit({
  id: true,
  createdAt: true,
});

export const passwordAnalysisRequestSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const passwordGeneratorSchema = z.object({
  length: z.number().min(8).max(128),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PasswordAnalysis = typeof passwordAnalysis.$inferSelect;
export type InsertPasswordAnalysis = z.infer<typeof insertPasswordAnalysisSchema>;
export type PasswordAnalysisRequest = z.infer<typeof passwordAnalysisRequestSchema>;
export type PasswordGeneratorRequest = z.infer<typeof passwordGeneratorSchema>;

export interface OwaspCompliance {
  minimumLength: boolean;
  uppercaseLetter: boolean;
  lowercaseLetter: boolean;
  number: boolean;
  specialCharacter: boolean;
  noCommonPatterns: boolean;
  noDictionaryWords: boolean;
  noPersonalInfo: boolean;
  score: number;
}

export interface SansCompliance {
  lengthCheck: boolean;
  complexityScore: string;
  entropyLevel: number;
  uniqueness: boolean;
  noKeyboardPatterns: boolean;
  score: number;
}

export interface ThreatIntelligence {
  breachDatabaseMatch: boolean;
  breachDetails?: string;
  commonPasswordList: boolean;
  threatScore: number;
  riskLevel: string;
}

export interface CryptoAnalysis {
  sha256Hash: string;
  bcryptHash: string;
  salt: string;
  iterations: number;
  algorithm: string;
}

export interface SecurityRecommendation {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  priority: number;
}

export interface SecurityPosture {
  score: number;
  riskLevel: string;
  recommendation: string;
}

export interface PasswordGeneratorResult {
  password: string;
  strength: number;
  entropy: number;
  estimatedCrackTime: string;
}

