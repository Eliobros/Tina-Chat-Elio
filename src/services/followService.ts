import { Follow, User, Notification } from '../models'

export interface FollowData {
  followerId: string
  followingId: string
}

export interface FollowStatus {
  isFollowing: boolean
  isPending: boolean
  canFollow: boolean
}

export class FollowService {
  // Seguir um usuário
  static async followUser(data: FollowData): Promise<boolean> {
    try {
      // Verifica se não está tentando seguir a si mesmo
      if (data.followerId === data.followingId) {
        throw new Error('Você não pode seguir a si mesmo')
      }

      // Verifica se já está seguindo
      const existingFollow = await Follow.findOne({
        where: {
          followerId: data.followerId,
          followingId: data.followingId,
        },
      })

      if (existingFollow) {
        throw new Error('Você já está seguindo este usuário')
      }

      // Busca informações do usuário que está sendo seguido
      const targetUser = await User.findByPk(data.followingId)
      if (!targetUser) {
        throw new Error('Usuário não encontrado')
      }

      // Se a conta é privada, o follow fica pendente
      const isAccepted = !targetUser.isPrivate

      // Cria o follow
      await Follow.create({
        followerId: data.followerId,
        followingId: data.followingId,
        isAccepted,
      })

      // Atualiza contadores
      if (isAccepted) {
        await User.increment('followers', { where: { id: data.followingId } })
        await User.increment('following', { where: { id: data.followerId } })
      }

      // Cria notificação
      await Notification.create({
        userId: data.followingId,
        type: targetUser.isPrivate ? 'follow_request' : 'follow',
        actorId: data.followerId,
        isRead: false,
      })

      return true
    } catch (error) {
      throw error
    }
  }

  // Deixar de seguir um usuário
  static async unfollowUser(data: FollowData): Promise<boolean> {
    try {
      const follow = await Follow.findOne({
        where: {
          followerId: data.followerId,
          followingId: data.followingId,
        },
      })

      if (!follow) {
        throw new Error('Você não está seguindo este usuário')
      }

      // Remove o follow
      await follow.destroy()

      // Atualiza contadores
      if (follow.isAccepted) {
        await User.decrement('followers', { where: { id: data.followingId } })
        await User.decrement('following', { where: { id: data.followerId } })
      }

      return true
    } catch (error) {
      throw error
    }
  }

  // Aceitar solicitação de follow
  static async acceptFollowRequest(data: FollowData): Promise<boolean> {
    try {
      const follow = await Follow.findOne({
        where: {
          followerId: data.followerId,
          followingId: data.followingId,
          isAccepted: false,
        },
      })

      if (!follow) {
        throw new Error('Solicitação de follow não encontrada')
      }

      // Aceita o follow
      await follow.update({ isAccepted: true })

      // Atualiza contadores
      await User.increment('followers', { where: { id: data.followingId } })
      await User.increment('following', { where: { id: data.followerId } })

      // Cria notificação de aceitação
      await Notification.create({
        userId: data.followerId,
        type: 'follow_accepted',
        actorId: data.followingId,
        isRead: false,
      })

      return true
    } catch (error) {
      throw error
    }
  }

  // Rejeitar solicitação de follow
  static async rejectFollowRequest(data: FollowData): Promise<boolean> {
    try {
      const follow = await Follow.findOne({
        where: {
          followerId: data.followerId,
          followingId: data.followingId,
          isAccepted: false,
        },
      })

      if (!follow) {
        throw new Error('Solicitação de follow não encontrada')
      }

      // Remove o follow
      await follow.destroy()

      return true
    } catch (error) {
      throw error
    }
  }

  // Verificar status de follow
  static async getFollowStatus(followerId: string, followingId: string): Promise<FollowStatus> {
    try {
      const follow = await Follow.findOne({
        where: {
          followerId,
          followingId,
        },
      })

      if (!follow) {
        return {
          isFollowing: false,
          isPending: false,
          canFollow: true,
        }
      }

      if (follow.isAccepted) {
        return {
          isFollowing: true,
          isPending: false,
          canFollow: false,
        }
      } else {
        return {
          isFollowing: false,
          isPending: true,
          canFollow: false,
        }
      }
    } catch (error) {
      throw error
    }
  }

  // Buscar seguidores de um usuário
  static async getUserFollowers(
    userId: string,
    currentUserId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    followers: any[]
    totalPages: number
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit

      const { rows: follows, count: totalFollows } = await Follow.findAndCountAll({
        where: {
          followingId: userId,
          isAccepted: true,
        },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'name', 'avatar', 'bio', 'location'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      const totalPages = Math.ceil(totalFollows / limit)

      return {
        followers: follows.map(follow => follow.follower),
        totalPages,
        currentPage: page,
      }
    } catch (error) {
      throw error
    }
  }

  // Buscar usuários que um usuário segue
  static async getUserFollowing(
    userId: string,
    currentUserId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    following: any[]
    totalPages: number
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit

      const { rows: follows, count: totalFollows } = await Follow.findAndCountAll({
        where: {
          followerId: userId,
          isAccepted: true,
        },
        include: [
          {
            model: User,
            as: 'following',
            attributes: ['id', 'name', 'avatar', 'bio', 'location'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      const totalPages = Math.ceil(totalFollows / limit)

      return {
        following: follows.map(follow => follow.following),
        totalPages,
        currentPage: page,
      }
    } catch (error) {
      throw error
    }
  }
}






