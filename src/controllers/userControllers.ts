import { Request, Response } from "express"
import { hashPassword } from "../services/password.service";
import prisma from '../models/user';
import user from "../models/user";


export const createUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({ message: "El email es obligatorio" })
        }
        if (!password) {
            res.status(400).json({ message: "La contraseña es obligatoria" })
        }

        const hashedPasswordWord = await hashPassword(password)
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPasswordWord
                }
            }

        )
        res.status(201).json(user)
    } catch (error: any) {
        console.log(error)
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: "el mail ingresado ya existe" })
        }
        res.status(500).json({ error: "hubo un error intentalo mas tarde" })
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany()
        res.status(200).json(users)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "hubo un error intentalo mas tarde" })

    }

}
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)

    try {
       const user = await prisma.findUnique({
         where:{
            id:userId
         }
       })
       if(!user){
        res.status(404).json({ error: "El usuario no fue encontrado" })
       }
        res.status(200).json(user)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "hubo un error intentalo mas tarde" })
    }
}
