import { Router } from "express";
import { servicoController } from "../controllers/servicoController.js";

const router = Router();

// GET /servicos
router.get("/", servicoController.getAll);

// POST /servicos
router.post("/", servicoController.create);

export default router;
