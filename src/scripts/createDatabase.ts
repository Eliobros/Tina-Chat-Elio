import sequelize from '../config/database'

async function createDatabase() {
  console.log('🔍 Conectando ao MySQL...')
  
  try {
    // Testa a conexão sem especificar o banco
    await sequelize.authenticate()
    console.log('✅ Conexão com MySQL estabelecida com sucesso!')
    
    // Cria o banco de dados
    console.log('🔄 Criando banco de dados "socializenow"...')
    await sequelize.query('CREATE DATABASE IF NOT EXISTS socializenow;')
    console.log('✅ Banco de dados "socializenow" criado com sucesso!')
    
    // Fecha a conexão atual
    await sequelize.close()
    
    // Reconecta especificando o banco de dados
    console.log('🔄 Reconectando ao banco de dados...')
    const sequelizeWithDB = new (require('sequelize').Sequelize)({
      dialect: 'mysql',
      host: 'socializenow-do-user-24724798-0.h.db.ondigitalocean.com',
      port: 25060,
      username: 'doadmin',
      password: 'AVNS_I26EoS-WB_jRks3kFaa',
      database: 'socializenow',
      logging: false,
    })
    
    await sequelizeWithDB.authenticate()
    console.log('✅ Conectado ao banco "socializenow" com sucesso!')
    
    await sequelizeWithDB.close()
    console.log('🎉 Banco de dados configurado e pronto para uso!')
    
  } catch (error) {
    console.error('💥 Erro durante a criação do banco:', error)
  }
}

// Executa se o arquivo for executado diretamente
if (require.main === module) {
  createDatabase()
}

export default createDatabase







