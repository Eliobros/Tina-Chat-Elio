import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import User from './User'
import Post from './Post'

interface CommentAttributes {
  id: string
  content: string
  authorId: string
  postId: string
  parentId?: string // Para comentários aninhados
  likes: number
  isEdited: boolean
}

interface CommentCreationAttributes extends Omit<CommentAttributes, 'id' | 'likes' | 'isEdited'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: string
  public content!: string
  public authorId!: string
  public postId!: string
  public parentId?: string
  public likes!: number
  public isEdited!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Comment,
        key: 'id',
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
  }
)

// Relacionamentos
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' })
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' })
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' })
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' })

export default Comment






