import sequelize from '../config/database'
import User from './User'
import Post from './Post'
import Like from './Like'
import Comment from './Comment'
import Follow from './Follow'
import Notification from './Notification'

// Relacionamentos entre modelos
User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' })
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })

User.hasMany(Like, { as: 'likes', foreignKey: 'userId' })
Like.belongsTo(User, { as: 'user', foreignKey: 'userId' })

Post.hasMany(Like, { as: 'postLikes', foreignKey: 'postId' })
Like.belongsTo(Post, { as: 'post', foreignKey: 'postId' })

User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' })
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' })

Post.hasMany(Comment, { as: 'postComments', foreignKey: 'postId' })
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' })

// Relacionamentos de Follow
User.belongsToMany(User, {
  as: 'followers',
  through: Follow,
  foreignKey: 'followingId',
  otherKey: 'followerId',
})

User.belongsToMany(User, {
  as: 'following',
  through: Follow,
  foreignKey: 'followerId',
  otherKey: 'followingId',
})

// Relacionamentos de Notification
User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' })
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' })

User.hasMany(Notification, { as: 'actorNotifications', foreignKey: 'actorId' })
Notification.belongsTo(User, { as: 'actor', foreignKey: 'actorId' })

// Função para sincronizar o banco de dados
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log('✅ Banco de dados sincronizado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error)
    throw error
  }
}

// Função para testar a conexão
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error)
    throw error
  }
}

// Função para fechar a conexão
export const closeConnection = async () => {
  try {
    await sequelize.close()
    console.log('✅ Conexão com banco de dados fechada com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao fechar conexão com banco de dados:', error)
    throw error
  }
}

export {
  sequelize,
  User,
  Post,
  Like,
  Comment,
  Follow,
  Notification,
}
