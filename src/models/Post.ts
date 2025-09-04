import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'

interface PostAttributes {
  id: string
  content: string
  image?: string
  authorId: string
  likes: number
  comments: number
  shares: number
  createdAt?: Date
  updatedAt?: Date
}

interface PostCreationAttributes extends Omit<PostAttributes, 'id' | 'likes' | 'comments' | 'shares'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string
  public content!: string
  public image?: string
  public authorId!: string
  public likes!: number
  public comments!: number
  public shares!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Post.init(
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
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shares: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'posts',
    timestamps: true,
  }
)

// Relacionamento: Post pertence a um User
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })
User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' })

export default Post







