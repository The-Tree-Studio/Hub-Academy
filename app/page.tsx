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
    <div style={{minHeight:'100vh',background:'#fff0f5',display:'flex',alignItems:'center',justifyContent:'center',color:'#e91e8c',fontSize:'18px'}}>
      Chargement...
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#fff0f5',color:'#1e293b',fontFamily:'sans-serif'}}>
      <div style={{background:'white',borderBottom:'1px solid #fce4ec',padding:'16px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 8px rgba(233,30,140,0.08)'}}>
        <span style={{color:'#e91e8c',fontWeight:'700',fontSize:'20px'}}>Hub Academy</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'#94a3b8',fontSize:'14px'}}>{user?.email}</span>
          <button onClick={handleLogout} style={{padding:'8px 16px',background:'transparent',border:'1px solid #fce4ec',borderRadius:'8px',color:'#e91e8c',cursor:'pointer',fontSize:'14px'}}>
            Déconnexion
          </button>
        </div>
      </div>
      <div style={{padding:'40px 32px',textAlign:'center'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'8px',color:'#1e293b'}}>
          Bienvenue sur <span style={{color:'#e91e8c'}}>Hub Academy</span> 🎓
        </h1>
        <p style={{color:'#94a3b8',marginBottom:'40px'}}>Votre plateforme de formation réglementaire</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px',maxWidth:'1200px',margin:'0 auto'}}>
          {[
            {title:'Gouvernance PSF', icon:'🏛️'},
            {title:'GDPR / RGPD', icon:'🔐'},
            {title:'KYC', icon:'🔍'},
            {title:'Whistleblowing', icon:'📣'},
            {title:'Sécurité des données', icon:'🛡️'},
            {title:'Secret professionnel', icon:'🤫'},
            {title:'FATCA / CRS / QI', icon:'🌍'},
            {title:'Gestion des risques', icon:'⚖️'},
            {title:"Conflits d'intérêts", icon:'⚡'},
            {title:'Veille réglementaire', icon:'📡'},
          ].map((m,i) => (
            <div key={i}
              style={{background:'#e8f8f2',border:'1px solid #b2e8d4',borderRadius:'12px',padding:'24px',cursor:'pointer',transition:'all 0.2s',boxShadow:'0 2px 8px rgba(0,180,120,0.07)'}}
              onMouseOver={e=>{e.currentTarget.style.borderColor='#00b478';e.currentTarget.style.boxShadow='0 4px 16px rgba(0,180,120,0.2)'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor='#b2e8d4';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,180,120,0.07)'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>{m.icon}</div>
              <div style={{fontWeight:'600',marginBottom:'8px',color:'#1e293b'}}>{m.title}</div>
              <div style={{color:'#94a3b8',fontSize:'13px'}}>Module {i+1} · 10 fiches</div>
              <div style={{marginTop:'12px',background:'#fff0f5',borderRadius:'6px',height:'6px'}}>
                <div style={{background:'#e91e8c',borderRadius:'6px',height:'6px',width:'0%'}}></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{maxWidth:'680px',margin:'48px auto 0',padding:'0 0 48px'}}>
          <p style={{color:'#475569',marginBottom:'12px',fontSize:'15px'}}>
            en remplaçant l'ancien <code style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:'4px',padding:'2px 6px',fontSize:'13px',color:'#e91e8c'}}>page.tsx</code>. Puis dans le terminal :
          </p>
          <div style={{background:'#1e293b',borderRadius:'10px',overflow:'hidden'}}>
            <div style={{padding:'8px 16px',background:'#0f172a',color:'#94a3b8',fontSize:'12px',borderBottom:'1px solid #334155'}}>bash</div>
            <div style={{padding:'20px 24px',fontFamily:'monospace',fontSize:'14px',lineHeight:'2'}}>
              <div><span style={{color:'#38bdf8'}}>git</span> <span style={{color:'#e2e8f0'}}>add .</span></div>
              <div><span style={{color:'#38bdf8'}}>git</span> <span style={{color:'#e2e8f0'}}>commit -m </span><span style={{color:'#4ade80'}}>"mint dashboard"</span></div>
              <div><span style={{color:'#38bdf8'}}>git</span> <span style={{color:'#e2e8f0'}}>push</span></div>
            </div>
          </div>
          <p style={{color:'#475569',marginTop:'16px',fontSize:'15px'}}>Dites-moi quand c'est pushé ✅</p>
        </div>

      </div>
    </div>
  )
}
