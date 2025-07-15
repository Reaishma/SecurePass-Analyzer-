import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { passwordAnalysisRequestSchema, passwordGeneratorSchema } from "@shared/schema";
import { PasswordAnalysisService } from "./services/passwordAnalysis";
import { CryptoService } from "./services/cryptoService";
import { ThreatIntelligenceService } from "./services/threatIntelligence";

export async function registerRoutes(app: Express): Promise<Server> {
  const passwordAnalysisService = new PasswordAnalysisService();
  const cryptoService = new CryptoService();
  const threatIntelligenceService = new ThreatIntelligenceService();

  // Analyze password endpoint
  app.post("/api/password/analyze", async (req, res) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      
      // Perform all security analyses
      const owaspCompliance = passwordAnalysisService.analyzeOwasp(password);
      const sansCompliance = passwordAnalysisService.analyzeSans(password);
      const strengthScore = passwordAnalysisService.calculatePasswordStrength(password);
      const securityPosture = passwordAnalysisService.calculateSecurityPosture(password, owaspCompliance.score, sansCompliance.score);
      const threatIntelligence = await threatIntelligenceService.analyzeThreatIntelligence(password);
      const cryptoAnalysis = await cryptoService.analyzeCrypto(password);
      const recommendations = passwordAnalysisService.generateRecommendations(password, owaspCompliance, sansCompliance);
      
      // Store analysis (with hashed password for security)
      const analysisData = {
        passwordHash: cryptoAnalysis.sha256Hash,
        strengthScore,
        owaspCompliance,
        sansCompliance,
        threatIntelligence,
        cryptoAnalysis,
        recommendations,
        securityPosture: securityPosture.score
      };
      
      const analysis = await storage.createPasswordAnalysis(analysisData);
      
      res.json({
        id: analysis.id,
        strengthScore,
        owaspCompliance,
        sansCompliance,
        threatIntelligence,
        cryptoAnalysis,
        recommendations,
        securityPosture
      });
    } catch (error) {
      console.error("Password analysis error:", error);
      res.status(400).json({ message: "Invalid password analysis request" });
    }
  });

  // Generate secure password endpoint
  app.post("/api/password/generate", async (req, res) => {
    try {
      const options = passwordGeneratorSchema.parse(req.body);
      
      const password = cryptoService.generateSecurePassword(options.length, {
        includeUppercase: options.includeUppercase,
        includeLowercase: options.includeLowercase,
        includeNumbers: options.includeNumbers,
        includeSymbols: options.includeSymbols
      });
      
      const strengthScore = passwordAnalysisService.calculatePasswordStrength(password);
      const entropy = 0; // Will be calculated in future update
      const estimatedCrackTime = cryptoService.calculateCrackTime(password);
      
      res.json({
        password,
        strength: strengthScore,
        entropy,
        estimatedCrackTime
      });
    } catch (error) {
      console.error("Password generation error:", error);
      res.status(400).json({ message: "Invalid password generation request" });
    }
  });

  // Get threat intelligence for password
  app.post("/api/threat-intelligence/check", async (req, res) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      
      const [ibmXForce, alienVault] = await Promise.all([
        threatIntelligenceService.checkIBMXForce(password),
        threatIntelligenceService.checkAlienVault(password)
      ]);
      
      res.json({
        ibmXForce,
        alienVault
      });
    } catch (error) {
      console.error("Threat intelligence error:", error);
      res.status(400).json({ message: "Invalid threat intelligence request" });
    }
  });

  // Get password analysis history
  app.get("/api/password/history", async (req, res) => {
    try {
      const history = await storage.getPasswordAnalysisHistory();
      res.json(history);
    } catch (error) {
      console.error("History retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve password analysis history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

