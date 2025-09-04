import { Post, User, Like, Comment } from '../models'
import { Op } from 'sequelize'
import { NotificationService } from './notificationService'

export interface CreatePostData {
  content: string
  image?: string
  authorId: string
}

export interface PostWithAuthor {
  id: string
  content: string
  image?: string
  authorId: string
  likes: number
  comments: number
  shares: number
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    avatar?: string
  }
  isLiked?: boolean
  comments?: any[]
}

export class PostService {
  // Criar um novo post
  static async createPost(data: CreatePostData): Promise<PostWithAuthor> {
    try {
      const post = await Post.create({
        content: data.content,
        image: data.image,
        authorId: data.authorId,
        likes: 0,
        comments: 0,
        shares: 0,
      })

      // Incrementa o contador de posts do usuário
      await User.increment('postsCount', { where: { id: data.authorId } })

      // Busca o post com informações do autor
      const postWithAuthor = await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
      })

      return postWithAuthor as PostWithAuthor
    } catch (error) {
      throw error
    }
  }

  // Buscar todos os posts (feed)
  static async getFeedPosts(userId?: string, page: number = 1, limit: number = 10): Promise<{
    posts: PostWithAuthor[]
    totalPages: number
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit

      // Busca posts com informações do autor
      const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      // Se há um usuário logado, verifica se ele curtiu cada post
      let postsWithLikes: PostWithAuthor[] = posts as PostWithAuthor[]
      
      if (userId) {
        const postIds = posts.map(post => post.id)
        const userLikes = await Like.findAll({
          where: {
            userId,
            postId: { [Op.in]: postIds },
          },
        })

        const likedPostIds = new Set(userLikes.map(like => like.postId))
        
        postsWithLikes = posts.map(post => ({
          ...post.toJSON(),
          isLiked: likedPostIds.has(post.id),
        })) as PostWithAuthor[]
      }

      const totalPages = Math.ceil(totalPosts / limit)

      return {
        posts: postsWithLikes,
        totalPages,
        currentPage: page,
      }
    } catch (error) {
      throw error
    }
  }

  // Buscar posts de um usuário específico
  static async getUserPosts(userId: string, currentUserId?: string, page: number = 1, limit: number = 10): Promise<{
    posts: PostWithAuthor[]
    totalPages: number
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit

      const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
        where: { authorId: userId },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      // Verifica se o usuário atual curtiu cada post
      let postsWithLikes: PostWithAuthor[] = posts as PostWithAuthor[]
      
      if (currentUserId) {
        const postIds = posts.map(post => post.id)
        const userLikes = await Like.findAll({
          where: {
            userId: currentUserId,
            postId: { [Op.in]: postIds },
          },
        })

        const likedPostIds = new Set(userLikes.map(like => like.postId))
        
        postsWithLikes = posts.map(post => ({
          ...post.toJSON(),
          isLiked: likedPostIds.has(post.id),
        })) as PostWithAuthor[]
      }

      const totalPages = Math.ceil(totalPosts / limit)

      return {
        posts: postsWithLikes,
        totalPages,
        currentPage: page,
      }
    } catch (error) {
      throw error
    }
  }

  // Curtir/descurtir um post
  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    try {
      const existingLike = await Like.findOne({
        where: { postId, userId },
      })

      if (existingLike) {
        // Remove o like
        await existingLike.destroy()
        
        // Decrementa o contador de likes
        await Post.decrement('likes', { where: { id: postId } })
        
        const post = await Post.findByPk(postId)
        return { liked: false, likesCount: post?.likes || 0 }
      } else {
        // Adiciona o like
        await Like.create({ postId, userId })
        
        // Incrementa o contador de likes
        await Post.increment('likes', { where: { id: postId } })
        
        // Cria notificação de like
        await NotificationService.notifyPostLike(postId, userId)
        
        const post = await Post.findByPk(postId)
        return { liked: true, likesCount: post?.likes || 0 }
      }
    } catch (error) {
      throw error
    }
  }

  // Deletar um post
  static async deletePost(postId: string, userId: string): Promise<boolean> {
    try {
      const post = await Post.findByPk(postId)
      
      if (!post) {
        throw new Error('Post não encontrado')
      }

      if (post.authorId !== userId) {
        throw new Error('Você não tem permissão para deletar este post')
      }

      // Remove todos os likes do post
      await Like.destroy({ where: { postId } })
      
      // Remove todos os comentários do post
      await Comment.destroy({ where: { postId } })
      
      // Decrementa o contador de posts do usuário
      await User.decrement('postsCount', { where: { id: userId } })
      
      // Remove o post
      await post.destroy()
      
      return true
    } catch (error) {
      throw error
    }
  }

  // Buscar um post específico
  static async getPostById(postId: string, userId?: string): Promise<PostWithAuthor | null> {
    try {
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
      })

      if (!post) return null

      let postWithLike: PostWithAuthor = post.toJSON() as PostWithAuthor

      // Verifica se o usuário atual curtiu o post
      if (userId) {
        const like = await Like.findOne({
          where: { postId, userId },
        })
        postWithLike.isLiked = !!like
      }

      return postWithLike
    } catch (error) {
      throw error
    }
  }

  // Buscar posts com imagens
  static async getPostsWithImages(userId?: string, page: number = 1, limit: number = 10): Promise<{
    posts: PostWithAuthor[]
    totalPages: number
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit

      const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
        where: {
          image: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      // Verifica likes se há usuário logado
      let postsWithLikes: PostWithAuthor[] = posts as PostWithAuthor[]
      
      if (userId) {
        const postIds = posts.map(post => post.id)
        const userLikes = await Like.findAll({
          where: {
            userId,
            postId: { [Op.in]: postIds },
          },
        })

        const likedPostIds = new Set(userLikes.map(like => like.postId))
        
        postsWithLikes = posts.map(post => ({
          ...post.toJSON(),
          isLiked: likedPostIds.has(post.id),
        })) as PostWithAuthor[]
      }

      const totalPages = Math.ceil(totalPosts / limit)

      return {
        posts: postsWithLikes,
        totalPages,
        currentPage: page,
      }
    } catch (error) {
      throw error
    }
  }
}
