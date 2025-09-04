import { Comment, User, Post } from '../models'
import { Op } from 'sequelize'

export interface CreateCommentData {
  content: string
  authorId: string
  postId: string
  parentId?: string
}

export interface CommentWithAuthor {
  id: string
  content: string
  authorId: string
  postId: string
  parentId?: string
  likes: number
  isEdited: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    avatar?: string
  }
  replies?: CommentWithAuthor[]
  isLiked?: boolean
}

export class CommentService {
  // Criar um novo comentário
  static async createComment(data: CreateCommentData): Promise<CommentWithAuthor> {
    try {
      const comment = await Comment.create({
        content: data.content,
        authorId: data.authorId,
        postId: data.postId,
        parentId: data.parentId,
        likes: 0,
        isEdited: false,
      })

      // Busca o comentário com informações do autor
      const commentWithAuthor = await Comment.findByPk(comment.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
      })

      return commentWithAuthor as CommentWithAuthor
    } catch (error) {
      throw error
    }
  }

  // Buscar comentários de um post
  static async getPostComments(
    postId: string, 
    userId?: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{
    comments: CommentWithAuthor[]
    totalPages: number
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit

      // Busca comentários principais (sem parentId)
      const { rows: comments, count: totalComments } = await Comment.findAndCountAll({
        where: { 
          postId,
          parentId: null // Apenas comentários principais
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

      // Para cada comentário principal, busca as respostas
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await Comment.findAll({
            where: { parentId: comment.id },
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar'],
              },
            ],
            order: [['createdAt', 'ASC']],
            limit: 10, // Limita respostas por comentário
          })

          return {
            ...comment.toJSON(),
            replies: replies.map(reply => reply.toJSON()),
          }
        })
      )

      const totalPages = Math.ceil(totalComments / limit)

      return {
        comments: commentsWithReplies as CommentWithAuthor[],
        totalPages,
        currentPage: page,
      }
    } catch (error) {
      throw error
    }
  }

  // Atualizar um comentário
  static async updateComment(
    commentId: string, 
    authorId: string, 
    content: string
  ): Promise<CommentWithAuthor> {
    try {
      const comment = await Comment.findOne({
        where: { id: commentId, authorId }
      })

      if (!comment) {
        throw new Error('Comentário não encontrado ou você não tem permissão para editá-lo')
      }

      await comment.update({
        content,
        isEdited: true,
      })

      // Busca o comentário atualizado com informações do autor
      const updatedComment = await Comment.findByPk(commentId, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
      })

      return updatedComment as CommentWithAuthor
    } catch (error) {
      throw error
    }
  }

  // Deletar um comentário
  static async deleteComment(commentId: string, authorId: string): Promise<boolean> {
    try {
      const comment = await Comment.findOne({
        where: { id: commentId, authorId }
      })

      if (!comment) {
        throw new Error('Comentário não encontrado ou você não tem permissão para deletá-lo')
      }

      // Deleta também todas as respostas
      await Comment.destroy({
        where: { parentId: commentId }
      })

      // Deleta o comentário principal
      await comment.destroy()

      return true
    } catch (error) {
      throw error
    }
  }

  // Curtir/descurtir um comentário
  static async toggleCommentLike(commentId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    try {
      const comment = await Comment.findByPk(commentId)
      if (!comment) {
        throw new Error('Comentário não encontrado')
      }

      // Aqui você pode implementar um sistema de likes para comentários similar ao de posts
      // Por simplicidade, vou apenas incrementar/decrementar o contador
      const newLikesCount = comment.likes + 1
      await comment.update({ likes: newLikesCount })

      return { liked: true, likesCount: newLikesCount }
    } catch (error) {
      throw error
    }
  }
}






