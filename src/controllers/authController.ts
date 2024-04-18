import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.services";



export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if(!email) throw new Error("El email es obligatorio")
        if(!password) throw new Error("La contraseña es obligatoria")
        const hashedPassword = await hashPassword(password)
        console.log(hashedPassword)
        const user = await prisma.create(
            {
                data: {
                    email,
                    password:hashedPassword
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token })
    } catch (error: any) {
        console.log(error)
        if(!email){
            res.status(400).json({message:"El email es obligatorio"})
        }
        if(!password){
            res.status(400).json({message:"La contraseña es obligatoria"})
        }
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({message: "el mail ingresado ya existe"})
        }
        res.status(500).json({ error: "hubo un error en el registro" })
    }

}