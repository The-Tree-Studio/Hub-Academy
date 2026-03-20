'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/')
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a0e1a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div style={{background:'#111827',padding:'40px',borderRadius:'16px',width:'100%',maxWidth:'400px',border:'1px solid #1e293b'}}>
        <h1 style={{color:'#0ee6c7',textAlign:'center',marginBottom:'8px',fontSize:'28px'}}>Hub Academy</h1>
        <p style={{color:'#64748b',textAlign:'center',marginBottom:'32px'}}>Connectez-vous pour continuer</p>
        {error && <div style={{background:'rgba(248,113,113,0.1)',border:'1px solid #f87171',color:'#f87171',padding:'12px',borderRadius:'8px',marginBottom:'16px',fontSize:'14px'}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:'16px'}}>
            <label style={{color:'#94a3b8',fontSize:'14px',display:'block',marginBottom:'6px'}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              style={{width:'100%',padding:'12px',background:'#1e293b',border:'1px solid #334155',borderRadius:'8px',color:'white',fontSize:'14px',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{color:'#94a3b8',fontSize:'14px',display:'block',marginBottom:'6px'}}>Mot de passe</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              style={{width:'100%',padding:'12px',background:'#1e293b',border:'1px solid #334155',borderRadius:'8px',color:'white',fontSize:'14px',boxSizing:'border-box'}}/>
          </div>
          <button type="submit" disabled={loading}
            style={{width:'100%',padding:'14px',background:'#0ee6c7',color:'#0a0e1a',border:'none',borderRadius:'8px',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>
      </div>
    </div>
  )
} 
