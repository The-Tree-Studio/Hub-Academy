'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); setLoading(false) }
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0a0e1a',display:'flex',alignItems:'center',justifyContent:'center',color:'#0ee6c7',fontSize:'18px'}}>
      Chargement...
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#0a0e1a',color:'white',fontFamily:'sans-serif'}}>
      <div style={{background:'#111827',borderBottom:'1px solid #1e293b',padding:'16px 32px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{color:'#0ee6c7',fontWeight:'700',fontSize:'20px'}}>Hub Academy</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'#64748b',fontSize:'14px'}}>{user?.email}</span>
          <button onClick={handleLogout} style={{padding:'8px 16px',background:'transparent',border:'1px solid #334155',borderRadius:'8px',color:'#94a3b8',cursor:'pointer',fontSize:'14px'}}>
            Déconnexion
          </button>
        </div>
      </div>
      <div style={{padding:'40px 32px',textAlign:'center'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Bienvenue sur <span style={{color:'#0ee6c7'}}>Hub Academy</span> 🎓</h1>
        <p style={{color:'#64748b',marginBottom:'40px'}}>Votre plateforme de formation réglementaire</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px',maxWidth:'1200px',margin:'0 auto'}}>
          {['Gouvernance PSF','GDPR/RGPD','KYC','Whistleblowing','Sécurité des données','Secret professionnel','FATCA/CRS/QI','Gestion des risques','Conflits d\'intérêts','Veille réglementaire'].map((m,i) => (
            <div key={i} style={{background:'#111827',border:'1px solid #1e293b',borderRadius:'12px',padding:'24px',cursor:'pointer',transition:'border-color 0.2s'}}
              onMouseOver={e=>(e.currentTarget.style.borderColor='#0ee6c7')}
              onMouseOut={e=>(e.currentTarget.style.borderColor='#1e293b')}>
              <div style={{fontSize:'32px',marginBottom:'12px'}}>📚</div>
              <div style={{fontWeight:'600',marginBottom:'8px'}}>{m}</div>
              <div style={{color:'#64748b',fontSize:'14px'}}>Module {i+1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}