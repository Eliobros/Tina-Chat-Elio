import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import User from './User'
import Post from './Post'
import Comment from './Comment'

interface NotificationAttributes {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'follow_request' | 'follow_accepted'
  actorId: string // Quem causou a notificação
  postId?: string
  commentId?: string
  isRead: boolean
  data?: any // Dados adicionais em JSON
}

interface NotificationCreationAttributes extends Omit<NotificationAttributes, 'id' | 'isRead'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string
  public userId!: string
  public type!: 'like' | 'comment' | 'follow' | 'mention' | 'follow_request' | 'follow_accepted'
  public actorId!: string
  public postId?: string
  public commentId?: string
  public isRead!: boolean
  public data?: any

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('like', 'comment', 'follow', 'mention', 'follow_request', 'follow_accepted'),
      allowNull: false,
    },
    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Post,
        key: 'id',
      },
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Comment,
        key: 'id',
      },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'isRead'],
      },
      {
        fields: ['userId', 'createdAt'],
      },
    ],
  }
)

// Relacionamentos
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Notification.belongsTo(User, { as: 'actor', foreignKey: 'actorId' })
Notification.belongsTo(Post, { as: 'post', foreignKey: 'postId' })
Notification.belongsTo(Comment, { as: 'comment', foreignKey: 'commentId' })

export default Notification






