import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Image, 
  Smile,
  MapPin,
  MoreHorizontal
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Post {
  id: string
  author: {
    id: string
    name: string
    avatar: string
    location: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  createdAt: Date
  isLiked: boolean
}

const Feed: React.FC = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)

  useEffect(() => {
    // Simular posts iniciais
    const mockPosts: Post[] = [
      {
        id: '1',
        author: {
          id: '2',
          name: 'Maria Santos',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          location: 'Beira, Moçambique'
        },
        content: 'Acabei de chegar da praia da Beira! Que lugar incrível para relaxar e aproveitar o sol moçambicano. 🌊☀️ #Beira #Moçambique #Praia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        likes: 24,
        comments: 8,
        shares: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        isLiked: false
      },
      {
        id: '2',
        author: {
          id: '3',
          name: 'Carlos Mambo',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          location: 'Maputo, Moçambique'
        },
        content: 'Hoje foi um dia incrível no mercado da Baixa! Comprei especiarias frescas e conheci pessoas maravilhosas. A cultura moçambicana é realmente especial. 🇲🇿',
        likes: 31,
        comments: 12,
        shares: 5,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        isLiked: true
      },
      {
        id: '3',
        author: {
          id: '4',
          name: 'Ana Costa',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          location: 'Nampula, Moçambique'
        },
        content: 'Finalmente consegui visitar a Ilha de Moçambique! A arquitetura histórica e as praias são de tirar o fôlego. Recomendo muito! 🏝️✨',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        likes: 45,
        comments: 15,
        shares: 7,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        isLiked: false
      }
    ]
    setPosts(mockPosts)
  }, [])

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    setIsCreatingPost(true)
    
    // Simular criação de post
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: user!.id,
        name: user!.name,
        avatar: user!.avatar || '',
        location: user!.location || 'Moçambique'
      },
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
      isLiked: false
    }

    setPosts([newPost, ...posts])
    setNewPostContent('')
    setIsCreatingPost(false)
  }

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
    // Implementar funcionalidade de comentários
    console.log('Comentar no post:', postId)
  }

  const handleShare = (postId: string) => {
    // Implementar funcionalidade de compartilhamento
    console.log('Compartilhar post:', postId)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Faça login para ver o feed
          </h2>
          <p className="text-gray-600">
            Entre na sua conta para ver as publicações dos seus amigos
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Create Post */}
      <div className="card mb-6">
        <div className="flex space-x-3">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="O que está acontecendo em Moçambique hoje?"
              className="w-full border-0 resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
              rows={3}
            />
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
                  <Image size={20} />
                </button>
                <button className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
                  <Smile size={20} />
                </button>
                <button className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
                  <MapPin size={20} />
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isCreatingPost}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingPost ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="card">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {post.author.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{post.author.location}</span>
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
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <MoreHorizontal size={20} />
              </button>
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
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma publicação ainda
          </h3>
          <p className="text-gray-500">
            Seja o primeiro a compartilhar algo na sua rede!
          </p>
        </div>
      )}
    </div>
  )
}

export default Feed










