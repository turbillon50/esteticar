import { Router } from "express";
import { db, locationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateLocationBody,
  GetLocationParams,
  UpdateLocationParams,
  UpdateLocationBody,
  DeleteLocationParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/locations", async (req, res) => {
  const locations = await db.select().from(locationsTable).orderBy(locationsTable.id);
  res.json(locations);
});

router.post("/locations", async (req, res) => {
  const parsed = CreateLocationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }
  const [location] = await db.insert(locationsTable).values({
    ...parsed.data,
    isActive: parsed.data.isActive ?? true,
  }).returning();
  res.status(201).json(location);
});

router.get("/locations/:id", async (req, res) => {
  const params = GetLocationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [location] = await db.select().from(locationsTable).where(eq(locationsTable.id, params.data.id)).limit(1);
  if (!location) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(location);
});

router.put("/locations/:id", async (req, res) => {
  const params = UpdateLocationParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateLocationBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Validation error" });
    return;
  }
  const [location] = await db.update(locationsTable)
    .set(body.data)
    .where(eq(locationsTable.id, params.data.id))
    .returning();
  if (!location) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(location);
});

router.delete("/locations/:id", async (req, res) => {
  const params = DeleteLocationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(locationsTable).where(eq(locationsTable.id, params.data.id));
  res.json({ message: "Sucursal eliminada" });
});

export default router;
