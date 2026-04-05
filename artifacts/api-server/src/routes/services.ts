import { Router } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateServiceBody,
  GetServiceParams,
  UpdateServiceParams,
  UpdateServiceBody,
  DeleteServiceParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/services", async (req, res) => {
  const services = await db.select().from(servicesTable).orderBy(servicesTable.id);
  res.json(services.map(s => ({ ...s, price: Number(s.price) })));
});

router.post("/services", async (req, res) => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }
  const [service] = await db.insert(servicesTable).values({
    ...parsed.data,
    price: String(parsed.data.price),
    isActive: parsed.data.isActive ?? true,
  }).returning();
  res.status(201).json({ ...service, price: Number(service.price) });
});

router.get("/services/:id", async (req, res) => {
  const params = GetServiceParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, params.data.id)).limit(1);
  if (!service) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...service, price: Number(service.price) });
});

router.put("/services/:id", async (req, res) => {
  const params = UpdateServiceParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateServiceBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Validation error" });
    return;
  }
  const [service] = await db.update(servicesTable)
    .set({ ...body.data, price: body.data.price !== undefined ? String(body.data.price) : undefined })
    .where(eq(servicesTable.id, params.data.id))
    .returning();
  if (!service) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...service, price: Number(service.price) });
});

router.delete("/services/:id", async (req, res) => {
  const params = DeleteServiceParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(servicesTable).where(eq(servicesTable.id, params.data.id));
  res.json({ message: "Servicio eliminado" });
});

export default router;
