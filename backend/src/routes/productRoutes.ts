import express from "express";
import { getProduct, seedProduct } from "../controllers/productController";

const router = express.Router();

router.get("/", getProduct);
router.post("/seed", seedProduct);

export default router;