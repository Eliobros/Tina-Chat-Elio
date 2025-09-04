import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Edit3,
  Camera,
  Users,
  Calendar,
  Globe,
  Settings
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Post {
  id: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  createdAt: Date
  isLiked: boolean
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    // Verificar se é o próprio perfil
    setIsOwnProfile(user?.id === id)

    // Simular posts do usuário
    const mockPosts: Post[] = [
      {
        id: '1',
        content: 'Hoje foi um dia incrível explorando as ruas de Maputo! A arquitetura colonial e os mercados locais são de tirar o fôlego. 🇲🇿✨ #Maputo #Moçambique #Cultura',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        likes: 28,
        comments: 12,
        shares: 5,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        isLiked: false
      },
      {
        id: '2',
        content: 'Finalmente consegui visitar a Ilha de Moçambique! As praias são paradisíacas e a história é fascinante. Recomendo muito para quem quiser conhecer mais sobre a cultura moçambicana. 🏝️🌊',
        likes: 45,
        comments: 18,
        shares: 8,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
        isLiked: true
      },
      {
        id: '3',
        content: 'Experimentando a culinária local na Beira! O camarão grelhado e o arroz de coco são simplesmente divinos. A gastronomia moçambicana é uma experiência única! 🍤🍚 #Beira #Gastronomia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        likes: 32,
        comments: 15,
        shares: 6,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
        isLiked: false
      }
    ]
    setPosts(mockPosts)
  }, [id, user?.id])

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        }
      }
      return post
    }))
  }

  const handleComment = (postId: string) => {
    console.log('Comentar no post:', postId)
  }

  const handleShare = (postId: string) => {
    console.log('Compartilhar post:', postId)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Faça login para ver perfis
          </h2>
          <p className="text-gray-600">
            Entre na sua conta para acessar perfis de usuários
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-mozambique-green to-primary-600 rounded-t-xl relative">
            <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors duration-200">
              <Camera size={20} />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative -mt-16">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  {isOwnProfile && (
                    <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200">
                      <Camera size={16} />
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  {user.bio && (
                    <p className="text-gray-600 max-w-md">{user.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Membro desde 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {isOwnProfile ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Edit3 size={16} />
                      <span>Editar Perfil</span>
                    </button>
                    <button className="btn-secondary flex items-center space-x-2">
                      <Settings size={16} />
                      <span>Configurações</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-primary">Seguir</button>
                    <button className="btn-secondary">Mensagem</button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.followers}</div>
                <div className="text-sm text-gray-500">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.following}</div>
                <div className="text-sm text-gray-500">Seguindo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button className="flex-1 py-2 px-4 bg-white text-primary-600 font-medium rounded-md shadow-sm">
          Posts
        </button>
        <button className="flex-1 py-2 px-4 text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Fotos
        </button>
        <button className="flex-1 py-2 px-4 text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Amigos
        </button>
        <button className="flex-1 py-2 px-4 text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Sobre
        </button>
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="card">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{user.location || 'Moçambique'}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(post.createdAt, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-900 whitespace-pre-wrap">
                {post.content}
              </p>
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post image"
                  className="w-full h-64 object-cover rounded-lg mt-3"
                />
              )}
            </div>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span>{post.likes} curtidas</span>
                <span>{post.comments} comentários</span>
                <span>{post.shares} compartilhamentos</span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  post.isLiked 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                <span>Curtir</span>
              </button>

              <button
                onClick={() => handleComment(post.id)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
              >
                <MessageCircle size={20} />
                <span>Comentar</span>
              </button>

              <button
                onClick={() => handleShare(post.id)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              >
                <Share2 size={20} />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma publicação ainda
          </h3>
          <p className="text-gray-500">
            {isOwnProfile 
              ? 'Comece a compartilhar suas experiências moçambicanas!' 
              : 'Este usuário ainda não fez nenhuma publicação.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Profile
