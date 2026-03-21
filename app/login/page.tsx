'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(233,30,140,0.12)', border: '1px solid #fce4ec' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px' }}>Hub Academy</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>Connectez-vous pour accéder à vos formations</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #fce4ec', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#1e293b' }}
              onFocus={e => e.target.style.borderColor = '#e91e8c'}
              onBlur={e => e.target.style.borderColor = '#fce4ec'}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #fce4ec', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#1e293b' }}
              onFocus={e => e.target.style.borderColor = '#e91e8c'}
              onBlur={e => e.target.style.borderColor = '#fce4ec'}
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 14px', color: '#dc2626', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{ padding: '14px', background: loading || !email || !password ? '#f9a8d4' : '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: loading || !email || !password ? 'default' : 'pointer', marginTop: '4px', transition: 'background 0.2s' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  )
}
