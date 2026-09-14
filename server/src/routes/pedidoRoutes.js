import { Router } from "express";
import { pedidoController } from "../controllers/pedidoController.js";

const router = Router();

// GET /pedidos
router.get("/", pedidoController.getAll);

// POST /pedidos
router.post("/", pedidoController.create);

// PATCH /pedidos/:id/status
router.patch("/:id/status", pedidoController.updateStatus);

export default router;
