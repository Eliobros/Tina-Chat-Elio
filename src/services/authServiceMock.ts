import bcrypt from 'bcryptjs'

// Geração simples de token no front apenas para testes (NÃO USAR EM PRODUÇÃO)
const generateMockToken = (payload: { userId: string; email: string }) => {
  const data = { ...payload, ts: Date.now() }
  return btoa(JSON.stringify(data))
}

const parseMockToken = (token: string): { userId: string; email: string; ts: number } => {
  const json = atob(token)
  return JSON.parse(json)
}

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

export interface UpdateProfileData {
  name?: string
  bio?: string
  location?: string
  birthDate?: string
  phone?: string
  website?: string
  avatar?: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    bio?: string
    location?: string
    birthDate?: string
    phone?: string
    website?: string
    followers: number
    following: number
    postsCount: number
    isVerified: boolean
    isPrivate: boolean
    lastSeen?: string
  }
  token: string
}

// Simula um banco de dados em localStorage
const getUsers = () => {
  const users = localStorage.getItem('socializenow_users')
  return users ? JSON.parse(users) : []
}

const saveUsers = (users: any[]) => {
  localStorage.setItem('socializenow_users', JSON.stringify(users))
}

export class AuthService {
  // Registro de usuário
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const users = getUsers()
      
      // Verifica se o usuário já existe
      const existingUser = users.find((u: any) => u.email === data.email)
      if (existingUser) {
        throw new Error('Email já está em uso')
      }

      // Criptografa a senha
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(data.password, saltRounds)

      // Cria o usuário
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&${Date.now()}`,
        bio: '',
        location: data.location || '',
        birthDate: '',
        phone: '',
        website: '',
        followers: 0,
        following: 0,
        postsCount: 0,
        isVerified: false,
        isPrivate: false,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      users.push(newUser)
      saveUsers(users)

      // Gera token mock
      const token = generateMockToken({ userId: newUser.id, email: newUser.email })

      // Retorna os dados do usuário (sem senha) e o token
      const { password, ...userWithoutPassword } = newUser
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
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const users = getUsers()
      
      // Busca o usuário pelo email
      const user = users.find((u: any) => u.email === data.email)
      if (!user) {
        throw new Error('Email ou senha incorretos')
      }

      // Verifica a senha
      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      if (!isPasswordValid) {
        throw new Error('Email ou senha incorretos')
      }

      // Atualiza último acesso
      user.lastSeen = new Date().toISOString()
      saveUsers(users)

      // Gera token mock
      const token = generateMockToken({ userId: user.id, email: user.email })

      // Retorna os dados do usuário (sem senha) e o token
      const { password, ...userWithoutPassword } = user
      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      throw error
    }
  }

  // Verifica o token mock
  static async verifyToken(token: string) {
    try {
      const decoded = parseMockToken(token) as { userId: string; email: string }
      const users = getUsers()
      const user = users.find((u: any) => u.id === decoded.userId)
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  // Busca usuário por ID
  static async getUserById(id: string) {
    try {
      const users = getUsers()
      const user = users.find((u: any) => u.id === id)
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  // Atualiza perfil do usuário
  static async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      const users = getUsers()
      const userIndex = users.findIndex((u: any) => u.id === userId)
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado')
      }

      // Atualiza o usuário
      users[userIndex] = {
        ...users[userIndex],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      saveUsers(users)
      
      const { password, ...userWithoutPassword } = users[userIndex]
      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  // Buscar usuários por nome ou email
  static async searchUsers(query: string, currentUserId?: string) {
    try {
      const users = getUsers()
      const searchTerm = query.toLowerCase()
      
      const results = users
        .filter((user: any) => {
          if (user.id === currentUserId) return false // Exclui o usuário atual
          return user.name.toLowerCase().includes(searchTerm) || 
                 user.email.toLowerCase().includes(searchTerm)
        })
        .map((user: any) => {
          const { password, ...userWithoutPassword } = user
          return userWithoutPassword
        })
        .slice(0, 20) // Limita a 20 resultados

      return results
    } catch (error) {
      throw error
    }
  }
}
