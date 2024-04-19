import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userControllers";


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret"

//Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "No autorizado" })
    }
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            console.error("error en la authenticacion", error)
            return res.status(403).json({ error: "No tienes acceso a este recurso" })
        }
        next()

    })
}

router.post("/", authenticateToken, createUser)
router.get("/", authenticateToken, getAllUsers)
router.get("/:id", authenticateToken, getUserById)
router.put("/:id", authenticateToken, updateUser)
router.delete("/:id", authenticateToken,deleteUser)


export default router;