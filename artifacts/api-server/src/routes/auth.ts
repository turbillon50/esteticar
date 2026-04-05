import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import {
  RegisterBody,
  LoginBody,
} from "@workspace/api-zod";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "esteticar_salt").digest("hex");
}

function serializeUser(user: typeof usersTable.$inferSelect) {
  const { passwordHash: _ph, ...rest } = user;
  return rest;
}

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const { name, email, password, phone } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered", message: "Este correo ya está registrado" });
    return;
  }

  const passwordHash = hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    name,
    email,
    passwordHash,
    role: "customer",
    phone: phone ?? null,
  }).returning();

  req.session = { userId: user.id };
  res.status(201).json({ user: serializeUser(user), message: "Cuenta creada exitosamente" });
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid credentials", message: "Correo o contraseña incorrectos" });
    return;
  }

  req.session = { userId: user.id };
  res.json({ user: serializeUser(user), message: "Bienvenido de vuelta" });
});

router.post("/auth/logout", (req, res) => {
  req.session = null;
  res.json({ message: "Sesión cerrada" });
});

router.get("/auth/me", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated", message: "No has iniciado sesión" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "User not found", message: "Usuario no encontrado" });
    return;
  }

  res.json(serializeUser(user));
});

export default router;
