import React from 'react'

const Home: React.FC = () => {
  console.log('Home component rendering...')
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e40af', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        Bem-vindo ao SocializeNow
      </h1>
      
      <p style={{ fontSize: '1.5rem', textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
        A primeira rede social moçambicana que conecta pessoas, culturas e experiências únicas do nosso país.
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        <button style={{ 
          backgroundColor: 'white', 
          color: '#1e40af', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '1.1rem', 
          marginRight: '1rem',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          Começar Agora
        </button>
        
        <button style={{ 
          backgroundColor: 'transparent', 
          color: 'white', 
          padding: '12px 24px', 
          border: '2px solid white', 
          borderRadius: '8px', 
          fontSize: '1.1rem',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Home
