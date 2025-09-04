import { DataTypes, Model, Sequelize } from 'sequelize'
import sequelize from '../config/database'

interface UserAttributes {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  bio?: string
  location?: string
  birthDate?: Date
  phone?: string
  website?: string
  followers: number
  following: number
  postsCount: number
  isVerified: boolean
  isPrivate: boolean
  lastSeen?: Date
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'followers' | 'following' | 'postsCount' | 'isVerified' | 'isPrivate'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string
  public name!: string
  public email!: string
  public password!: string
  public avatar?: string
  public bio?: string
  public location?: string
  public birthDate?: Date
  public phone?: string
  public website?: string
  public followers!: number
  public following!: number
  public postsCount!: number
  public isVerified!: boolean
  public isPrivate!: boolean
  public lastSeen?: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    followers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    following: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    postsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
)

export default User
