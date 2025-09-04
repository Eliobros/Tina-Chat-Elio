import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthService, AuthResponse, UpdateProfileData } from '../services/authServiceMock'

interface User {
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

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, location?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: UpdateProfileData) => Promise<void>
  searchUsers: (query: string) => Promise<User[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response: AuthResponse = await AuthService.login({ email, password })
      
      // Salva o token no localStorage
      localStorage.setItem('socializenow_token', response.token)
      
      // Atualiza o estado do usuário
      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, location?: string) => {
    try {
      setLoading(true)
      const response: AuthResponse = await AuthService.register({ name, email, password, location })
      
      // Salva o token no localStorage
      localStorage.setItem('socializenow_token', response.token)
      
      // Atualiza o estado do usuário
      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('socializenow_token')
    
    // Limpa o estado do usuário
    setUser(null)
  }

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) throw new Error('Usuário não autenticado')
    
    try {
      setLoading(true)
      const updatedUser = await AuthService.updateProfile(user.id, data)
      setUser(updatedUser)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      return await AuthService.searchUsers(query, user?.id)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    searchUsers,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
