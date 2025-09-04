import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 50 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          {/* Logo e Nome */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/src/images/logo.png" 
                alt="SocializeNow" 
                style={{ height: '40px', width: '40px' }}
              />
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#009639',
                marginLeft: '12px'
              }}>
                SocializeNow
              </span>
            </Link>
          </div>

          {/* Links de Navegação - Desktop */}
          <div style={{ display: 'none', alignItems: 'center', gap: '32px' }}>
            <Link 
              to="/feed" 
              style={{ 
                color: '#374151', 
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Feed
            </Link>
            <Link 
              to="/explore" 
              style={{ 
                color: '#374151', 
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Explorar
            </Link>
            <Link 
              to="/messages" 
              style={{ 
                color: '#374151', 
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Mensagens
            </Link>
          </div>

          {/* Menu do Usuário - Desktop */}
          <div style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/login"
              style={{ 
                color: '#374151', 
                textDecoration: 'none',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Entrar
            </Link>
            <Link
              to="/register"
              style={{ 
                backgroundColor: '#009639', 
                color: 'white', 
                textDecoration: 'none',
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: '500'
              }}
            >
              Cadastrar
            </Link>
          </div>

          {/* Menu Mobile */}
          <div style={{ display: 'block' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ 
                color: '#374151', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div style={{ 
          backgroundColor: 'white', 
          borderTop: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link
              to="/feed"
              style={{ 
                display: 'block',
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              to="/explore"
              style={{ 
                display: 'block',
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar
            </Link>
            <Link
              to="/messages"
              style={{ 
                display: 'block',
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Mensagens
            </Link>
            <Link
              to="/login"
              style={{ 
                display: 'block',
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              to="/register"
              style={{ 
                display: 'block',
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#009639',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
