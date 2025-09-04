import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import User from './User'

interface FollowAttributes {
  id: string
  followerId: string
  followingId: string
  isAccepted: boolean // Para contas privadas
}

interface FollowCreationAttributes extends Omit<FollowAttributes, 'id' | 'isAccepted'> {}

class Follow extends Model<FollowAttributes, FollowCreationAttributes> implements FollowAttributes {
  public id!: string
  public followerId!: string
  public followingId!: string
  public isAccepted!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Follow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Para contas públicas
    },
  },
  {
    sequelize,
    tableName: 'follows',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['followerId', 'followingId'],
      },
    ],
  }
)

// Relacionamentos
Follow.belongsTo(User, { as: 'follower', foreignKey: 'followerId' })
Follow.belongsTo(User, { as: 'following', foreignKey: 'followingId' })

export default Follow






