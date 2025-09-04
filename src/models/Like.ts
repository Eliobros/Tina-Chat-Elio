import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'
import Post from './Post'

interface LikeAttributes {
  id: string
  userId: string
  postId: string
  createdAt?: Date
}

interface LikeCreationAttributes extends Omit<LikeAttributes, 'id'> {}

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
  public id!: string
  public userId!: string
  public postId!: string
  public readonly createdAt!: Date
}

Like.init(
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
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'likes',
    timestamps: false, // Apenas createdAt
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'], // Um usuário só pode curtir um post uma vez
      },
    ],
  }
)

// Relacionamentos
Like.belongsTo(User, { foreignKey: 'userId' })
Like.belongsTo(Post, { foreignKey: 'postId' })

User.hasMany(Like, { foreignKey: 'userId' })
Post.hasMany(Like, { foreignKey: 'postId' })

export default Like







