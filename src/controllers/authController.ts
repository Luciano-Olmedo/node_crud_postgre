import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.services";


//Register
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if (!email){
            res.status(400).json({ message: "El email es obligatorio" })
        } 
         if (!password) {
            res.status(400).json({ message: "La contraseña es obligatoria" })
        }       
        const hashedPassword = await hashPassword(password)
        console.log(hashedPassword)
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token })
    } catch (error: any) {
        console.log(error)       
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: "el mail ingresado ya existe" })
        }
        res.status(500).json({ error: "hubo un error en el registro" })
    }

}

//Login

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {
        if (!email){
            res.status(400).json({ message: "El email es obligatorio" })
        } 
         if (!password) {
            res.status(400).json({ message: "La contraseña es obligatoria" })
        }       
        const user = await prisma.findUnique({ where: { email } })
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" })
            return
        }
        const passwordMatch = await comparePassword(password, user.password)
        if(!passwordMatch){
            res.status(401).json({ message: "Usuario y contraseña no coinciden"})
        }
        const token = generateToken(user)
        res.status(200).json({ token})

    } catch (error) {
        console.log("error",error)
    }

}