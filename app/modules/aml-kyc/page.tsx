'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const THEMES = [
  {
    titre: '🛡️ Règles anti-blanchiment',
    couleur: '#e91e8c',
    modules: [
      { title: 'AML/KYC Rules', icon: '🔍', slug: 'aml-kyc', ready: true },
      { title: 'Name Screening', icon: '🔎', slug: 'name-screening', ready: false },
      { title: 'Risk Scoring client', icon: '📊', slug: 'risk-scoring', ready: false },
      { title: 'UBO — Bénéficiaire effectif', icon: '👤', slug: 'ubo', ready: false },
      { title: 'DDR', icon: '📋', slug: 'ddr', ready: false },
      { title: 'Opérations suspectes', icon: '🚨', slug: 'operations-suspectes', ready: false },
    ],
  },
  {
    titre: '⚖️ Gouvernance & Conformité',
    couleur: '#7c3aed',
    modules: [
      { title: 'Gouvernance PSF', icon: '🏛️', slug: 'gouvernance-psf', ready: false },
      { title: 'Gestion des risques', icon: '⚖️', slug: 'gestion-risques', ready: false },
      { title: "Conflits d'intérêts", icon: '⚡', slug: 'conflits-interets', ready: false },
      { title: 'Whistleblowing', icon: '📣', slug: 'whistleblowing', ready: false },
      { title: 'Veille réglementaire', icon: '📡', slug: 'veille-reglementaire', ready: false },
      { title: 'Mutualisation & Accessibilité', icon: '🔗', slug: 'mutualisation-accessibilite', ready: false },
      { title: 'Contrôle Interne', icon: '🔎', slug: 'controle-interne', ready: false },
    ],
  },
  {
    titre: '🔐 Protection des données',
    couleur: '#0891b2',
    modules: [
      { title: 'GDPR / RGPD', icon: '🔐', slug: 'gdpr-rgpd', ready: false },
      { title: 'Sécurité des données', icon: '🛡️', slug: 'securite-donnees', ready: false },
      { title: 'Secret professionnel', icon: '🤫', slug: 'secret-professionnel', ready: false },
      { title: 'ISO 27001', icon: '🏅', slug: 'iso-27001', ready: false },
    ],
  },
  {
    titre: '💻 Résilience & Infrastructure IT',
    couleur: '#059669',
    modules: [
      { title: 'Résilience IT (DORA)', icon: '💻', slug: 'resilience-it', ready: false },
      { title: 'Infrastructure IT', icon: '🖥️', slug: 'infrastructure-it', ready: false },
      { title: 'ISO 22301', icon: '🏆', slug: 'iso-22301', ready: false },
      { title: 'Externalisation 22/806', icon: '🤝', slug: 'externalisation', ready: false },
      { title: 'Circulaire 24/850', icon: '📰', slug: 'circulaire-24-850', ready: false },
    ],
  },
  {
    titre: '💼 Fiscalité internationale',
    couleur: '#dc2626',
    modules: [
      { title: 'FATCA / CRS / QI', icon: '🌍', slug: 'fatca-crs', ready: false },
    ],
  },
  {
    titre: '🎯 Services prestés aux clients',
    couleur: '#c2410c',
    modules: [
      { title: 'Catalogue des services i-Hub', icon: '📂', slug: 'catalogue-services', ready: false },
      { title: 'Niveaux de service (SLA)', icon: '📏', slug: 'sla', ready: false },
      { title: 'Gestion des incidents clients', icon: '🔧', slug: 'incidents-clients', ready: false },
      { title: 'Onboarding client', icon: '🤝', slug: 'onboarding-client', ready: false },
      { title: 'Rapports & reporting clients', icon: '📈', slug: 'reporting-clients', ready: false },
    ],
  },
  {
    titre: '🔄 Continuité de l\'activité',
    couleur: '#0369a1',
    modules: [
      { title: 'Plan de continuité (BCP)', icon: '📆', slug: 'bcp', ready: false },
      { title: 'Plan de reprise IT (DRP)', icon: '⚙️', slug: 'drp', ready: false },
      { title: 'Gestion de crise', icon: '🆘', slug: 'gestion-crise', ready: false },
      { title: 'Tests & exercices BCP', icon: '🧪', slug: 'tests-bcp', ready: false },
      { title: 'Gestion des incidents', icon: '🆘', slug: 'gestion-incidents', ready: false },
    ],
  },
  {
    titre: '👥 Droits & Obligations des employés',
    couleur: '#b45309',
    modules: [
      { title: 'Obligations employé', icon: '📌', slug: 'obligations-employe', ready: false },
      { title: 'Droits employé', icon: '✊', slug: 'droits-employe', ready: false },
    ],
  },
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

  const totalModules = THEMES.reduce((acc, t) => acc + t.modules.length, 0)
  const readyModules = THEMES.reduce((acc, t) => acc + t.modules.filter(m => m.ready).length, 0)

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

      <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
            Bienvenue sur <span style={{ color: '#e91e8c' }}>Hub Academy</span> 🎓
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '12px' }}>Votre plateforme de formation réglementaire</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e91e8c15', borderRadius: '20px', padding: '6px 16px' }}>
            <span style={{ color: '#e91e8c', fontSize: '13px', fontWeight: '700' }}>
              {readyModules} module{readyModules > 1 ? 's' : ''} disponible{readyModules > 1 ? 's' : ''}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>· {totalModules - readyModules} à venir</span>
          </div>
        </div>

        {/* Thèmes */}
        {THEMES.map((theme, ti) => (
          <div key={ti} style={{ marginBottom: '48px' }}>
            {/* Titre du thème */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ height: '4px', width: '36px', background: theme.couleur, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{theme.titre}</h2>
              <div style={{ flex: 1, height: '1px', background: '#fce4ec' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', flexShrink: 0 }}>
                {theme.modules.filter(m => m.ready).length}/{theme.modules.length}
              </span>
            </div>

            {/* Cartes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
              {theme.modules.map((m, i) => (
                <div key={i}
                  onClick={() => m.ready && router.push(`/modules/${m.slug}`)}
                  style={{
                    background: 'white',
                    border: m.ready ? `1.5px solid ${theme.couleur}35` : '1.5px solid #f1f5f9',
                    borderRadius: '14px',
                    padding: '20px',
                    cursor: m.ready ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    opacity: m.ready ? 1 : 0.58,
                    position: 'relative',
                    boxShadow: m.ready ? `0 2px 10px ${theme.couleur}10` : 'none',
                  } as React.CSSProperties}
                  onMouseOver={e => {
                    if (m.ready) {
                      e.currentTarget.style.borderColor = theme.couleur
                      e.currentTarget.style.boxShadow = `0 6px 24px ${theme.couleur}25`
                      e.currentTarget.style.transform = 'translateY(-3px)'
                    }
                  }}
                  onMouseOut={e => {
                    if (m.ready) {
                      e.currentTarget.style.borderColor = `${theme.couleur}35`
                      e.currentTarget.style.boxShadow = `0 2px 10px ${theme.couleur}10`
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}>

                  {m.ready && (
                    <span style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: '#d1fae5', color: '#059669',
                      fontSize: '10px', fontWeight: '700',
                      borderRadius: '20px', padding: '2px 8px',
                    }}>
                      DISPONIBLE
                    </span>
                  )}

                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>{m.icon}</div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#1e293b', fontSize: '14px', lineHeight: 1.3 }}>{m.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>
                    {m.ready ? 'Fiches + 3 quiz interactifs' : 'Bientôt disponible'}
                  </div>

                  <div style={{ background: '#fff0f5', borderRadius: '4px', height: '4px' }}>
                    <div style={{ background: theme.couleur, borderRadius: '4px', height: '4px', width: '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
