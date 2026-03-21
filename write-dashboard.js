const content = `'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const THEMES = [
  {
    titre: "Continuit\u00e9 de l'activit\u00e9", emoji: '\u{1F504}', couleur: '#0369a1',
    modules: [
      { title: 'Gestion de crise', icon: '\u{1F198}', slug: 'gestion-crise', ready: false },
      { title: 'Gestion des incidents', icon: '\u{1F6A8}', slug: 'gestion-incidents', ready: false },
      { title: 'Plan de continuit\u00e9 (BCP)', icon: '\u{1F4C6}', slug: 'bcp', ready: false },
      { title: 'Plan de reprise IT (DRP)', icon: '\u2699\uFE0F', slug: 'drp', ready: false },
      { title: 'Tests & exercices BCP', icon: '\u{1F9EA}', slug: 'tests-bcp', ready: false },
    ],
  },
  {
    titre: 'Droits & Obligations des employ\u00e9s', emoji: '\u{1F465}', couleur: '#b45309',
    modules: [
      { title: 'Droits employ\u00e9', icon: '\u270A', slug: 'droits-employe', ready: false },
      { title: 'Obligations employ\u00e9', icon: '\u{1F4CC}', slug: 'obligations-employe', ready: false },
    ],
  },
  {
    titre: 'Fiscalit\u00e9 internationale', emoji: '\u{1F4BC}', couleur: '#dc2626',
    modules: [
      { title: 'FATCA / CRS / QI', icon: '\u{1F30D}', slug: 'fatca-crs', ready: false },
    ],
  },
  {
    titre: 'Gouvernance & Conformit\u00e9', emoji: '\u2696\uFE0F', couleur: '#7c3aed',
    modules: [
      { title: 'Accessibilit\u00e9', icon: '\u267F', slug: 'accessibilite', ready: false },
      { title: "Conflits d'int\u00e9r\u00eats", icon: '\u26A1', slug: 'conflits-interets', ready: false },
      { title: 'Contr\u00f4le Interne', icon: '\u{1F50E}', slug: 'controle-interne', ready: false },
      { title: 'Gestion des risques', icon: '\u2696\uFE0F', slug: 'gestion-risques', ready: false },
      { title: 'Gouvernance PSF', icon: '\u{1F3DB}\uFE0F', slug: 'gouvernance-psf', ready: false },
      { title: 'Mutualisation', icon: '\u{1F517}', slug: 'mutualisation', ready: false },
      { title: 'Veille r\u00e9glementaire', icon: '\u{1F4E1}', slug: 'veille-reglementaire', ready: false },
      { title: 'Whistleblowing', icon: '\u{1F4E3}', slug: 'whistleblowing', ready: false },
    ],
  },
  {
    titre: 'Protection des donn\u00e9es', emoji: '\u{1F510}', couleur: '#0891b2',
    modules: [
      { title: 'GDPR / RGPD', icon: '\u{1F510}', slug: 'gdpr-rgpd', ready: false },
      { title: 'ISO 27001', icon: '\u{1F3C5}', slug: 'iso-27001', ready: false },
      { title: 'Secret professionnel', icon: '\u{1F92B}', slug: 'secret-professionnel', ready: false },
      { title: 'S\u00e9curit\u00e9 des donn\u00e9es', icon: '\u{1F6E1}\uFE0F', slug: 'securite-donnees', ready: false },
    ],
  },
  {
    titre: 'R\u00e8gles anti-blanchiment', emoji: '\u{1F6E1}\uFE0F', couleur: '#e91e8c',
    modules: [
      { title: 'AML/KYC Rules', icon: '\u{1F50D}', slug: 'aml-kyc', ready: true },
      { title: 'DDR', icon: '\u{1F4CB}', slug: 'ddr', ready: false },
      { title: 'Name Screening', icon: '\u{1F50E}', slug: 'name-screening', ready: false },
      { title: 'Op\u00e9rations suspectes', icon: '\u{1F6A8}', slug: 'operations-suspectes', ready: false },
      { title: 'Risk Scoring client', icon: '\u{1F4CA}', slug: 'risk-scoring', ready: false },
      { title: 'UBO \u2014 B\u00e9n\u00e9ficiaire effectif', icon: '\u{1F464}', slug: 'ubo', ready: false },
    ],
  },
  {
    titre: 'R\u00e9silience & Infrastructure IT', emoji: '\u{1F4BB}', couleur: '#059669',
    modules: [
      { title: 'Circulaire 24/850', icon: '\u{1F4F0}', slug: 'circulaire-24-850', ready: false },
      { title: 'Externalisation 22/806', icon: '\u{1F91D}', slug: 'externalisation', ready: false },
      { title: 'Infrastructure IT', icon: '\u{1F5A5}\uFE0F', slug: 'infrastructure-it', ready: false },
      { title: 'ISO 22301', icon: '\u{1F3C6}', slug: 'iso-22301', ready: false },
      { title: 'R\u00e9silience IT (DORA)', icon: '\u{1F4BB}', slug: 'resilience-it', ready: false },
    ],
  },
  {
    titre: 'Services prest\u00e9s aux clients', emoji: '\u{1F3AF}', couleur: '#c2410c',
    modules: [
      { title: 'Catalogue des services i-Hub', icon: '\u{1F4C2}', slug: 'catalogue-services', ready: false },
      { title: 'Gestion des incidents clients', icon: '\u{1F527}', slug: 'incidents-clients', ready: false },
      { title: 'Niveaux de service (SLA)', icon: '\u{1F4CF}', slug: 'sla', ready: false },
      { title: 'Onboarding client', icon: '\u{1F91D}', slug: 'onboarding-client', ready: false },
      { title: 'Rapports & reporting clients', icon: '\u{1F4C8}', slug: 'reporting-clients', ready: false },
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
    <div style={{ minHeight: '100vh', background: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d2010', fontSize: '18px' }}>
      Chargement...
    </div>
  )

  const totalModules = THEMES.reduce((acc, t) => acc + t.modules.length, 0)
  const readyModules = THEMES.reduce((acc, t) => acc + t.modules.filter(m => m.ready).length, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', color: '#3d2010', fontFamily: 'sans-serif' }}>

      {/* HEADER bandeau brun foncé */}
      <div style={{ background: '#3d2010', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(61,32,16,0.25)' }}>
        <span style={{ color: '#e91e8c', fontWeight: '800', fontSize: '22px', letterSpacing: '0.5px' }}>
          \u{1F393} Hub Academy
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#e8d5c0', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #e91e8c', borderRadius: '8px', color: '#e91e8c', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            D\u00e9connexion
          </button>
        </div>
      </div>

      {/* HERO bandeau brun moyen */}
      <div style={{ background: '#5c3d2e', padding: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'white' }}>
          Bienvenue sur <span style={{ color: '#e91e8c' }}>Hub Academy</span> \u{1F393}
        </h1>
        <p style={{ color: '#e8d5c0', marginBottom: '16px', fontSize: '15px' }}>Votre plateforme de formation r\u00e9glementaire</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(233,30,140,0.15)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: '20px', padding: '6px 16px' }}>
          <span style={{ color: '#e91e8c', fontSize: '13px', fontWeight: '700' }}>{readyModules} module disponible</span>
          <span style={{ color: '#e8d5c0', fontSize: '13px' }}>\u00b7 {totalModules - readyModules} \u00e0 venir \u00b7 {THEMES.length} th\u00e9matiques</span>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {THEMES.map((theme, ti) => {
            const isOpen = !!openThemes[ti]
            const readyCount = theme.modules.filter(m => m.ready).length
            return (
              <div key={ti} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(61,32,16,0.08)', border: \`1.5px solid \${isOpen ? '#3d2010' : '#e8d5c0'}\`, transition: 'all 0.2s' }}>

                {/* En-tête accordéon */}
                <button onClick={() => toggleTheme(ti)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 24px', background: isOpen ? '#3d2010' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isOpen ? 'rgba(255,255,255,0.12)' : '#f0e6d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {theme.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: isOpen ? 'white' : '#3d2010', marginBottom: '2px' }}>{theme.titre}</div>
                    <div style={{ fontSize: '12px', color: isOpen ? '#e8d5c0' : '#9c7c5e' }}>
                      {theme.modules.length} module{theme.modules.length > 1 ? 's' : ''}
                      {readyCount > 0 && <span style={{ color: '#e91e8c', fontWeight: '600' }}> \u00b7 {readyCount} disponible{readyCount > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  {readyCount > 0 && (
                    <span style={{ background: '#e91e8c', color: 'white', fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '3px 10px', flexShrink: 0 }}>
                      \u2713 {readyCount} dispo
                    </span>
                  )}
                  <div style={{ fontSize: '18px', color: isOpen ? '#e91e8c' : '#9c7c5e', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>\u25be</div>
                </button>

                {/* Modules */}
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #e8d5c0', background: '#faf6f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', paddingTop: '16px' }}>
                      {theme.modules.map((m, i) => (
                        <div key={i}
                          onClick={() => m.ready && router.push(\`/modules/\${m.slug}\`)}
                          style={{ background: 'white', border: m.ready ? '1.5px solid #e8d5c0' : '1.5px solid #ede0d4', borderRadius: '12px', padding: '16px', cursor: m.ready ? 'pointer' : 'default', transition: 'all 0.2s', opacity: m.ready ? 1 : 0.5, position: 'relative' } as React.CSSProperties}
                          onMouseOver={e => { if (m.ready) { e.currentTarget.style.borderColor = '#3d2010'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(61,32,16,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                          onMouseOut={e => { if (m.ready) { e.currentTarget.style.borderColor = '#e8d5c0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' } }}>
                          {m.ready && (
                            <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#e91e8c', color: 'white', fontSize: '9px', fontWeight: '700', borderRadius: '20px', padding: '2px 7px' }}>DISPO</span>
                          )}
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>{m.icon}</div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: '#3d2010', lineHeight: 1.3, marginBottom: '4px' }}>{m.title}</div>
                          <div style={{ fontSize: '11px', color: '#9c7c5e' }}>{m.ready ? 'Fiches + quiz interactifs' : 'Bient\u00f4t disponible'}</div>
                          {m.ready && (
                            <div style={{ marginTop: '10px', background: '#f0e6d8', borderRadius: '4px', height: '3px' }}>
                              <div style={{ background: '#e91e8c', borderRadius: '4px', height: '3px', width: '0%' }} />
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
`
require('fs').writeFileSync('app/page.tsx', content, 'utf8')
console.log('OK! Dashboard beige/brun/rose ecrit!')
