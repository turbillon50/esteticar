import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import servicesRouter from "./services";
import locationsRouter from "./locations";
import timeslotsRouter from "./timeslots";
import bookingsRouter from "./bookings";
import providerRouter from "./provider";
import adminRouter from "./admin";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(servicesRouter);
router.use(locationsRouter);
router.use(timeslotsRouter);
router.use(bookingsRouter);
router.use(providerRouter);
router.use(adminRouter);
router.use(dashboardRouter);

export default router;
