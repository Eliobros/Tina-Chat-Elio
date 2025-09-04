import { testConnection, syncDatabase, closeConnection } from '../models'

async function testDatabase() {
  console.log('🔍 Testando conexão com o banco de dados...')
  
  try {
    // Testa a conexão
    const isConnected = await testConnection()
    
    if (isConnected) {
      console.log('🔄 Sincronizando modelos...')
      await syncDatabase()
      console.log('🎉 Tudo funcionando perfeitamente!')
    }
  } catch (error) {
    console.error('💥 Erro durante o teste:', error)
  } finally {
    // Fecha a conexão
    await closeConnection()
  }
}

// Executa o teste se o arquivo for executado diretamente
if (require.main === module) {
  testDatabase()
}

export default testDatabase







