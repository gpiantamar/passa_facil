import { Router } from "express";
import { clienteController } from "../controllers/clienteController.js";

const router = Router();

// GET /clientes
router.get("/", clienteController.getAll);

// POST /clientes
router.post("/", clienteController.create);

export default router;
