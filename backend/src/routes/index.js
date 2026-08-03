import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import protectedRoutes from './protected.routes.js';
import usersRoutes from './users.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import uploadRoutes from './upload.routes.js';
import aiRoutes from './ai.routes.js';
import resumeRoutes from './resume.routes.js';
import jobDescriptionRoutes from './jobDescription.routes.js';
import interviewRoutes from './interview.routes.js';
import companyRoutes from './company.routes.js';
import codingRoutes from './coding.routes.js';

const apiRouter = Router();

// Mount health check endpoints at root of /api/v1 (/api/v1/health & /api/v1/ping)
apiRouter.use("/", healthRoutes);

// Auth endpoints
apiRouter.use("/auth", authRoutes);

// Protected / sample endpoints
apiRouter.use('/protected', protectedRoutes);

// User profile endpoints
apiRouter.use('/users', usersRoutes);

// Upload endpoints for Cloudinary-backed files
apiRouter.use('/uploads', uploadRoutes);

// Resume endpoints
apiRouter.use('/resumes', resumeRoutes);

// Job Description endpoints
apiRouter.use('/job-descriptions', jobDescriptionRoutes);

// Interview session endpoints
apiRouter.use('/interviews', interviewRoutes);

// Company and interviewer style metadata
apiRouter.use('/companies', companyRoutes);

// AI provider endpoints
apiRouter.use('/ai', aiRoutes);

// Coding endpoints (runs & submits)
apiRouter.use('/coding', codingRoutes);

// Dashboard aggregation endpoints
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;
