import { Request, Response } from 'express';
import { userService } from '../services';
import bcrypt from 'bcrypt';
import { CustomRequest } from '../middlewares/authentication';
import { generateToken } from '../utils/generateToken';

// CREA UN NUEVO USUARIO
export const postOneUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUserAndProfile(
      name,
      email,
      hashedPassword,
      role
    );
    res.status(201).json({
      success: true,
      data: { message: 'User registered successfully :I', user: user },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(500)
      .json({ message: `Error creating ${role}`, error: errorMessage });
  }
};

// LOGUEA AL USUARIO
export const loginUser = async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findOneUser(email, password);
    const token = generateToken(user.id, user.email);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Error in server..', error });
  }
};

// OBTIENE INFORMACION DEL PERFIL DEL USUARIO
export const userProfileData = async (req: CustomRequest, res: Response) => {
  const userId = (req.user as { id: string }).id;

  try {
    const user = await userService.findUserById(userId);
    const profile = await userService.findUserProfile(user.id, user.role);

    res.json({ success: true, user, profile });
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
