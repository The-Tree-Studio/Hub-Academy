'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const MODULES = [
  { title: 'Gouvernance PSF', icon: '🏛️', slug: 'gouvernance-psf', ready: false },
  { title: 'GDPR / RGPD', icon: '🔐', slug: 'gdpr-rgpd', ready: false },
  { title: 'AML/KYC Rules', icon: '🔍', slug: 'aml-kyc', ready: true },
  { title: 'Whistleblowing', icon: '📣', slug: 'whistleblowing', ready: false },
  { title: 'Sécurité des données', icon: '🛡️', slug: 'securite-donnees', ready: false },
  { title: 'Secret professionnel', icon: '🤫', slug: 'secret-professionnel', ready: false },
  { title: 'FATCA / CRS / QI', icon: '🌍', slug: 'fatca-crs', ready: false },
  { title: 'Gestion des risques', icon: '⚖️', slug: 'gestion-risques', ready: false },
  { title: "Conflits d'intérêts", icon: '⚡', slug: 'conflits-interets', ready: false },
  { title: 'Veille réglementaire', icon: '📡', slug: 'veille-reglementaire', ready: false },
  { title: 'Name Screening', icon: '🔎', slug: 'name-screening', ready: false },
  { title: 'Externalisation 22/806', icon: '🤝', slug: 'externalisation', ready: false },
  { title: 'Résilience IT (DORA)', icon: '💻', slug: 'resilience-it', ready: false },
  { title: 'Risk Scoring client', icon: '📊', slug: 'risk-scoring', ready: false },
  { title: 'DDR', icon: '📋', slug: 'ddr', ready: false },
  { title: 'Infrastructure IT', icon: '🖥️', slug: 'infrastructure-it', ready: false },
  { title: 'Obligations employé', icon: '📌', slug: 'obligations-employe', ready: false },
  { title: 'Droits employé', icon: '✊', slug: 'droits-employe', ready: false },
  { title: 'ISO 27001', icon: '🏅', slug: 'iso-27001', ready: false },
  { title: 'ISO 22301', icon: '🏆', slug: 'iso-22301', ready: false },
  { title: 'Circulaire 24/850', icon: '📰', slug: 'circulaire-24-850', ready: false },
]

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
    <div style={{ minHeight: '100vh', background: '#fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e91e8c', fontSize: '18px' }}>
      Chargement...
    </div>
  )

  const readyCount = MODULES.filter(m => m.ready).length

  return (
    <div style={{ minHeight: '100vh', background: '#fff0f5', color: '#1e293b', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #fce4ec', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(233,30,140,0.08)' }}>
        <span style={{ color: '#e91e8c', fontWeight: '700', fontSize: '20px' }}>🎓 Hub Academy</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #fce4ec', borderRadius: '8px', color: '#e91e8c', cursor: 'pointer', fontSize: '14px' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
          Bienvenue sur <span style={{ color: '#e91e8c' }}>Hub Academy</span> 🎓
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Votre plateforme de formation réglementaire</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e91e8c15', borderRadius: '20px', padding: '6px 14px', marginBottom: '40px' }}>
          <span style={{ color: '#e91e8c', fontSize: '13px', fontWeight: '700' }}>{readyCount} module{readyCount > 1 ? 's' : ''} disponible{readyCount > 1 ? 's' : ''}</span>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>· {MODULES.length - readyCount} à venir</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {MODULES.map((m, i) => (
            <div key={i}
              onClick={() => m.ready && router.push(`/modules/${m.slug}`)}
              style={{
                background: 'white',
                border: m.ready ? '1.5px solid #fce4ec' : '1.5px solid #f1f5f9',
                borderRadius: '14px',
                padding: '24px',
                cursor: m.ready ? 'pointer' : 'default',
                transition: 'all 0.2s',
                boxShadow: m.ready ? '0 2px 8px rgba(233,30,140,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
                opacity: m.ready ? 1 : 0.65,
                position: 'relative',
              }}
              onMouseOver={e => { if (m.ready) { e.currentTarget.style.borderColor = '#e91e8c'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(233,30,140,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
              onMouseOut={e => { if (m.ready) { e.currentTarget.style.borderColor = '#fce4ec'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(233,30,140,0.06)'; e.currentTarget.style.transform = 'translateY(0)' } }}>
              {m.ready && (
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#d1fae5', color: '#059669', fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '2px 8px' }}>
                  DISPONIBLE
                </span>
              )}
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{m.icon}</div>
              <div style={{ fontWeight: '700', marginBottom: '6px', color: '#1e293b', fontSize: '15px' }}>{m.title}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
                {m.ready ? 'Fiches + 3 quiz interactifs' : 'Module · Bientôt disponible'}
              </div>
              <div style={{ background: '#fff0f5', borderRadius: '6px', height: '5px' }}>
                <div style={{ background: '#e91e8c', borderRadius: '6px', height: '5px', width: '0%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
