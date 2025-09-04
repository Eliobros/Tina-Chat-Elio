import { Notification, User, Post, Comment } from '../models'

export interface NotificationWithActor {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'follow_request' | 'follow_accepted'
  actorId: string
  postId?: string
  commentId?: string
  isRead: boolean
  data?: any
  createdAt: Date
  updatedAt: Date
  actor: {
    id: string
    name: string
    avatar?: string
  }
  post?: {
    id: string
    content: string
    image?: string
  }
  comment?: {
    id: string
    content: string
  }
}

export class NotificationService {
  // Criar notificação
  static async createNotification(data: {
    userId: string
    type: 'like' | 'comment' | 'follow' | 'mention' | 'follow_request' | 'follow_accepted'
    actorId: string
    postId?: string
    commentId?: string
    data?: any
  }): Promise<Notification> {
    try {
      // Verifica se já existe uma notificação similar recente (evita spam)
      const existingNotification = await Notification.findOne({
        where: {
          userId: data.userId,
          type: data.type,
          actorId: data.actorId,
          postId: data.postId,
          commentId: data.commentId,
          createdAt: {
            [require('sequelize').Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
          },
        },
      })

      if (existingNotification) {
        // Atualiza a notificação existente
        await existingNotification.update({
          isRead: false,
          updatedAt: new Date(),
        })
        return existingNotification
      }

      // Cria nova notificação
      const notification = await Notification.create({
        userId: data.userId,
        type: data.type,
        actorId: data.actorId,
        postId: data.postId,
        commentId: data.commentId,
        data: data.data,
        isRead: false,
      })

      return notification
    } catch (error) {
      throw error
    }
  }

  // Buscar notificações de um usuário
  static async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    notifications: NotificationWithActor[]
    totalPages: number
    currentPage: number
    unreadCount: number
  }> {
    try {
      const offset = (page - 1) * limit

      const { rows: notifications, count: totalNotifications } = await Notification.findAndCountAll({
        where: { userId },
        include: [
          {
            model: User,
            as: 'actor',
            attributes: ['id', 'name', 'avatar'],
          },
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'content', 'image'],
            required: false,
          },
          {
            model: Comment,
            as: 'comment',
            attributes: ['id', 'content'],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      // Conta notificações não lidas
      const unreadCount = await Notification.count({
        where: { userId, isRead: false },
      })

      const totalPages = Math.ceil(totalNotifications / limit)

      return {
        notifications: notifications as NotificationWithActor[],
        totalPages,
        currentPage: page,
        unreadCount,
      }
    } catch (error) {
      throw error
    }
  }

  // Marcar notificação como lida
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId },
      })

      if (!notification) {
        throw new Error('Notificação não encontrada')
      }

      await notification.update({ isRead: true })
      return true
    } catch (error) {
      throw error
    }
  }

  // Marcar todas as notificações como lidas
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      )
      return true
    } catch (error) {
      throw error
    }
  }

  // Deletar notificação
  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId },
      })

      if (!notification) {
        throw new Error('Notificação não encontrada')
      }

      await notification.destroy()
      return true
    } catch (error) {
      throw error
    }
  }

  // Deletar notificações antigas (mais de 30 dias)
  static async deleteOldNotifications(userId: string): Promise<number> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const deletedCount = await Notification.destroy({
        where: {
          userId,
          createdAt: {
            [require('sequelize').Op.lt]: thirtyDaysAgo,
          },
        },
      })

      return deletedCount
    } catch (error) {
      throw error
    }
  }

  // Buscar notificações de follow requests pendentes
  static async getFollowRequests(userId: string): Promise<NotificationWithActor[]> {
    try {
      const notifications = await Notification.findAll({
        where: {
          userId,
          type: 'follow_request',
          isRead: false,
        },
        include: [
          {
            model: User,
            as: 'actor',
            attributes: ['id', 'name', 'avatar', 'bio'],
          },
        ],
        order: [['createdAt', 'DESC']],
      })

      return notifications as NotificationWithActor[]
    } catch (error) {
      throw error
    }
  }

  // Criar notificação de like em post
  static async notifyPostLike(postId: string, actorId: string): Promise<void> {
    try {
      const post = await Post.findByPk(postId, { include: [{ model: User, as: 'author' }] })
      if (!post || post.authorId === actorId) return // Não notifica o próprio autor

      await this.createNotification({
        userId: post.authorId,
        type: 'like',
        actorId,
        postId,
        data: { postContent: post.content.substring(0, 100) },
      })
    } catch (error) {
      console.error('Erro ao criar notificação de like:', error)
    }
  }

  // Criar notificação de comentário
  static async notifyComment(commentId: string, actorId: string): Promise<void> {
    try {
      const comment = await Comment.findByPk(commentId, { 
        include: [
          { model: Post, as: 'post' },
          { model: User, as: 'author' }
        ] 
      })
      
      if (!comment || comment.authorId === actorId) return

      await this.createNotification({
        userId: comment.post.authorId,
        type: 'comment',
        actorId,
        postId: comment.postId,
        commentId,
        data: { commentContent: comment.content.substring(0, 100) },
      })
    } catch (error) {
      console.error('Erro ao criar notificação de comentário:', error)
    }
  }
}






