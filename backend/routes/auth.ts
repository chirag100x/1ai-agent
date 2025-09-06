import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient();
const router = Router();

// ---------------------------
// Mock OTP / Auth Bypass
// ---------------------------

// POST /signin
// Accepts an email, creates/fetches the user, and returns a JWT token
router.post("/signin", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Create user if not exists
  let user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    user = await prismaClient.user.create({ data: { email } });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dummysecret");

  res.status(200).json({
    message: "Signed in (mock)",
    token,
    user: { id: user.id, email: user.email },
  });
});

// GET /me
// Returns a mock authenticated user
router.get("/me", async (req, res) => {
  // If frontend is not sending a token, just return test user
  res.json({
    user: {
      id: "test-user",
      email: "test@example.com",
    },
  });
});

// Optional: middleware to mock authentication for AI routes
export function mockAuthMiddleware(req: any, res: any, next: any) {
  // Any route that checks req.user will get this
  req.user = { id: "test-user", email: "test@example.com" };
  next();
}

export default router;

