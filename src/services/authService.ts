import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models'

const JWT_SECRET = 'socializenow_mozambique_2024_secret_key'
const JWT_EXPIRES_IN = '7d'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  location?: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    bio?: string
    location?: string
    followers: number
    following: number
  }
  token: string
}

export class AuthService {
  // Registro de usuário
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Verifica se o usuário já existe
      const existingUser = await User.findOne({ where: { email: data.email } })
      if (existingUser) {
        throw new Error('Email já está em uso')
      }

      // Criptografa a senha
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(data.password, saltRounds)

      // Cria o usuário
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        location: data.location,
        followers: 0,
        following: 0,
      })

      // Gera o token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      // Retorna os dados do usuário (sem senha) e o token
      const { password, ...userWithoutPassword } = user.toJSON()
      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      throw error
    }
  }

  // Login do usuário
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Busca o usuário pelo email
      const user = await User.findOne({ where: { email: data.email } })
      if (!user) {
        throw new Error('Email ou senha incorretos')
      }

      // Verifica a senha
      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      if (!isPasswordValid) {
        throw new Error('Email ou senha incorretos')
      }

      // Gera o token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      // Retorna os dados do usuário (sem senha) e o token
      const { password, ...userWithoutPassword } = user.toJSON()
      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      throw error
    }
  }

  // Verifica o token JWT
  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
      const user = await User.findByPk(decoded.userId)
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const { password, ...userWithoutPassword } = user.toJSON()
      return userWithoutPassword
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  // Busca usuário por ID
  static async getUserById(id: string) {
    try {
      const user = await User.findByPk(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const { password, ...userWithoutPassword } = user.toJSON()
      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  // Atualiza perfil do usuário
  static async updateProfile(userId: string, data: Partial<{ name: string; bio: string; location: string; avatar: string }>) {
    try {
      const user = await User.findByPk(userId)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      await user.update(data)
      
      const { password, ...userWithoutPassword } = user.toJSON()
      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }
}







