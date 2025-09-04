import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'socializenow-do-user-24724798-0.h.db.ondigitalocean.com',
  port: 25060,
  username: 'doadmin',
  password: 'AVNS_I26EoS-WB_jRks3kFaa',
  database: 'socializenow',
  logging: false, // Desabilita logs SQL no console
  pool: {
    max: 5, // Máximo de conexões
    min: 0, // Mínimo de conexões
    acquire: 30000, // Tempo máximo para adquirir conexão
    idle: 10000 // Tempo máximo que uma conexão pode ficar inativa
  }
})

export default sequelize
