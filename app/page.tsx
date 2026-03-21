'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const THEMES = [
  {
    titre: "Continuité de l'activité", emoji: '🔄', couleur: '#0369a1',
    modules: [
      { title: 'Gestion de crise', icon: '🆘', slug: 'gestion-crise', ready: false },
      { title: 'Gestion des incidents', icon: '🚨', slug: 'gestion-incidents', ready: false },
      { title: 'Plan de continuité (BCP)', icon: '📆', slug: 'bcp', ready: false },
      { title: 'Plan de reprise IT (DRP)', icon: '⚙️', slug: 'drp', ready: false },
      { title: 'Tests & exercices BCP', icon: '🧪', slug: 'tests-bcp', ready: false },
    ],
  },
  {
    titre: 'Droits & Obligations des employés', emoji: '👥', couleur: '#b45309',
    modules: [
      { title: 'Droits employé', icon: '✊', slug: 'droits-employe', ready: false },
      { title: 'Obligations employé', icon: '📌', slug: 'obligations-employe', ready: false },
    ],
  },
  {
    titre: 'Fiscalité internationale', emoji: '💼', couleur: '#dc2626',
    modules: [
      { title: 'FATCA / CRS / QI', icon: '🌍', slug: 'fatca-crs', ready: false },
    ],
  },
  {
    titre: 'Gouvernance & Conformité', emoji: '⚖️', couleur: '#7c3aed',
    modules: [
      { title: 'Accessibilité', icon: '♿', slug: 'accessibilite', ready: false },
      { title: "Conflits d'intérêts", icon: '⚡', slug: 'conflits-interets', ready: false },
      { title: 'Contrôle Interne', icon: '🔎', slug: 'controle-interne', ready: false },
      { title: 'Gestion des risques', icon: '⚖️', slug: 'gestion-risques', ready: false },
      { title: 'Gouvernance PSF', icon: '🏛️', slug: 'gouvernance-psf', ready: false },
      { title: 'Mutualisation', icon: '🔗', slug: 'mutualisation', ready: false },
      { title: 'Veille réglementaire', icon: '📡', slug: 'veille-reglementaire', ready: false },
      { title: 'Whistleblowing', icon: '📣', slug: 'whistleblowing', ready: false },
    ],
  },
  {
    titre: 'Protection des données', emoji: '🔐', couleur: '#0891b2',
    modules: [
      { title: 'GDPR / RGPD', icon: '🔐', slug: 'gdpr-rgpd', ready: false },
      { title: 'ISO 27001', icon: '🏅', slug: 'iso-27001', ready: false },
      { title: 'Secret professionnel', icon: '🤫', slug: 'secret-professionnel', ready: false },
      { title: 'Sécurité des données', icon: '🛡️', slug: 'securite-donnees', ready: false },
    ],
  },
  {
    titre: 'Règles anti-blanchiment', emoji: '🛡️', couleur: '#e91e8c',
    modules: [
      { title: 'AML/KYC Rules', icon: '🔍', slug: 'aml-kyc', ready: true },
      { title: 'DDR', icon: '📋', slug: 'ddr', ready: false },
      { title: 'Name Screening', icon: '🔎', slug: 'name-screening', ready: false },
      { title: 'Opérations suspectes', icon: '🚨', slug: 'operations-suspectes', ready: false },
      { title: 'Risk Scoring client', icon: '📊', slug: 'risk-scoring', ready: false },
      { title: 'UBO — Bénéficiaire effectif', icon: '👤', slug: 'ubo', ready: false },
    ],
  },
  {
    titre: 'Résilience & Infrastructure IT', emoji: '💻', couleur: '#059669',
    modules: [
      { title: 'Circulaire 24/850', icon: '📰', slug: 'circulaire-24-850', ready: false },
      { title: 'Externalisation 22/806', icon: '🤝', slug: 'externalisation', ready: false },
      { title: 'Infrastructure IT', icon: '🖥️', slug: 'infrastructure-it', ready: false },
      { title: 'ISO 22301', icon: '🏆', slug: 'iso-22301', ready: false },
      { title: 'Résilience IT (DORA)', icon: '💻', slug: 'resilience-it', ready: false },
    ],
  },
  {
    titre: 'Services prestés aux clients', emoji: '🎯', couleur: '#c2410c',
    modules: [
      { title: 'Catalogue des services i-Hub', icon: '📂', slug: 'catalogue-services', ready: false },
      { title: 'Gestion des incidents clients', icon: '🔧', slug: 'incidents-clients', ready: false },
      { title: 'Niveaux de service (SLA)', icon: '📏', slug: 'sla', ready: false },
      { title: 'Onboarding client', icon: '🤝', slug: 'onboarding-client', ready: false },
      { title: 'Rapports & reporting clients', icon: '📈', slug: 'reporting-clients', ready: false },
    ],
  },
]

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [openThemes, setOpenThemes] = useState<Record<number, boolean>>({ 5: true })
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

  function toggleTheme(idx: number) {
    setOpenThemes(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c3d2e', fontSize: '18px' }}>
      Chargement...
    </div>
  )

  const totalModules = THEMES.reduce((acc, t) => acc + t.modules.length, 0)
  const readyModules = THEMES.reduce((acc, t) => acc + t.modules.filter(m => m.ready).length, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', color: '#3d2010', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e8d5c0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(92,61,46,0.08)' }}>
        <span style={{ color: '#5c3d2e', fontWeight: '800', fontSize: '20px' }}>🎓 Hub Academy</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#9c7c5e', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #e8d5c0', borderRadius: '8px', color: '#5c3d2e', cursor: 'pointer', fontSize: '14px' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#3d2010' }}>
            Bienvenue sur <span style={{ color: '#5c3d2e' }}>Hub Academy</span> 🎓
          </h1>
          <p style={{ color: '#9c7c5e', marginBottom: '12px' }}>Votre plateforme de formation réglementaire</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0e6d8', borderRadius: '20px', padding: '6px 16px' }}>
            <span style={{ color: '#5c3d2e', fontSize: '13px', fontWeight: '700' }}>{readyModules} module disponible</span>
            <span style={{ color: '#9c7c5e', fontSize: '13px' }}>· {totalModules - readyModules} à venir · {THEMES.length} thématiques</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {THEMES.map((theme, ti) => {
            const isOpen = !!openThemes[ti]
            const readyCount = theme.modules.filter(m => m.ready).length
            return (
              <div key={ti} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(92,61,46,0.08)', border: `1.5px solid ${isOpen ? theme.couleur + '40' : '#e8d5c0'}`, transition: 'all 0.2s' }}>
                <button onClick={() => toggleTheme(ti)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${theme.couleur}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {theme.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#3d2010', marginBottom: '2px' }}>{theme.titre}</div>
                    <div style={{ fontSize: '12px', color: '#9c7c5e' }}>
                      {theme.modules.length} module{theme.modules.length > 1 ? 's' : ''}
                      {readyCount > 0 && <span style={{ color: theme.couleur, fontWeight: '600' }}> · {readyCount} disponible{readyCount > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  {readyCount > 0 && (
                    <span style={{ background: '#d1fae5', color: '#059669', fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '3px 10px', flexShrink: 0 }}>
                      ✓ {readyCount} dispo
                    </span>
                  )}
                  <div style={{ fontSize: '18px', color: theme.couleur, transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>▾</div>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${theme.couleur}20` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', paddingTop: '16px' }}>
                      {theme.modules.map((m, i) => (
                        <div key={i}
                          onClick={() => m.ready && router.push(`/modules/${m.slug}`)}
                          style={{ background: m.ready ? 'white' : '#faf6f0', border: m.ready ? `1.5px solid ${theme.couleur}30` : '1.5px solid #e8d5c0', borderRadius: '12px', padding: '16px', cursor: m.ready ? 'pointer' : 'default', transition: 'all 0.2s', opacity: m.ready ? 1 : 0.55, position: 'relative', boxShadow: m.ready ? `0 2px 8px ${theme.couleur}10` : 'none' } as React.CSSProperties}
                          onMouseOver={e => { if (m.ready) { e.currentTarget.style.borderColor = theme.couleur; e.currentTarget.style.boxShadow = `0 4px 20px ${theme.couleur}25`; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                          onMouseOut={e => { if (m.ready) { e.currentTarget.style.borderColor = `${theme.couleur}30`; e.currentTarget.style.boxShadow = `0 2px 8px ${theme.couleur}10`; e.currentTarget.style.transform = 'translateY(0)' } }}>
                          {m.ready && (
                            <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#d1fae5', color: '#059669', fontSize: '9px', fontWeight: '700', borderRadius: '20px', padding: '2px 6px' }}>DISPO</span>
                          )}
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>{m.icon}</div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: '#3d2010', lineHeight: 1.3, marginBottom: '4px' }}>{m.title}</div>
                          <div style={{ fontSize: '11px', color: '#9c7c5e' }}>{m.ready ? 'Fiches + quiz interactifs' : 'Bientôt disponible'}</div>
                          {m.ready && (
                            <div style={{ marginTop: '10px', background: '#f0e6d8', borderRadius: '4px', height: '3px' }}>
                              <div style={{ background: theme.couleur, borderRadius: '4px', height: '3px', width: '0%' }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
