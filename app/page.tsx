'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const HERO_IMAGE = '/hero.jpg'

const TRANSLATIONS = {
  fr: {
    welcome: "Bienvenue sur",
    subtitle: "Votre plateforme de formation réglementaire",
    available: "module disponible",
    availablePlural: "modules disponibles",
    coming: "à venir",
    themes: "thématiques",
    modules: "module",
    modulesPlural: "modules",
    dispo: "DISPO",
    dispoFull: "disponible",
    dispoFullPlural: "disponibles",
    soon: "Bientôt disponible",
    quizzes: "Fiches + quiz interactifs",
    logout: "Déconnexion",
  },
  en: {
    welcome: "Welcome to",
    subtitle: "Your regulatory training platform",
    available: "module available",
    availablePlural: "modules available",
    coming: "coming soon",
    themes: "themes",
    modules: "module",
    modulesPlural: "modules",
    dispo: "AVAIL.",
    dispoFull: "available",
    dispoFullPlural: "available",
    soon: "Coming soon",
    quizzes: "Flashcards + interactive quizzes",
    logout: "Logout",
  },
}

const THEMES_FR = [
  {
    titre: "Anti-blanchiment d'argent", emoji: '🛡️', couleur: '#e91e8c',
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
      { title: 'CRS — Common Reporting Standard', icon: '🌍', slug: 'crs', ready: false },
      { title: 'FATCA — Foreign Account Tax Compliance Act', icon: '🇺🇸', slug: 'fatca', ready: false },
      { title: 'FATCA vs CRS vs QI — Quelles différences ?', icon: '↔️', slug: 'fatca-crs-qi-differences', ready: false },
      { title: 'QI — Qualified Intermediary', icon: '💰', slug: 'qi', ready: false },
      { title: 'Vérifier un W-9, W-8BEN ou Tax Self-Certification', icon: '📋', slug: 'formulaires-fiscaux', ready: false },
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

const THEMES_EN = [
  {
    titre: "Anti-Money Laundering", emoji: '🛡️', couleur: '#e91e8c',
    modules: [
      { title: 'AML/KYC Rules', icon: '🔍', slug: 'aml-kyc', ready: true },
      { title: 'DDR', icon: '📋', slug: 'ddr', ready: false },
      { title: 'Name Screening', icon: '🔎', slug: 'name-screening', ready: false },
      { title: 'Risk Scoring', icon: '📊', slug: 'risk-scoring', ready: false },
      { title: 'Suspicious Transactions', icon: '🚨', slug: 'operations-suspectes', ready: false },
      { title: 'UBO — Ultimate Beneficial Owner', icon: '👤', slug: 'ubo', ready: false },
    ],
  },
  {
    titre: "Business Continuity", emoji: '🔄', couleur: '#0369a1',
    modules: [
      { title: 'BCP — Business Continuity Plan', icon: '📆', slug: 'bcp', ready: false },
      { title: 'BCP Tests & Exercises', icon: '🧪', slug: 'tests-bcp', ready: false },
      { title: 'Crisis Management', icon: '🆘', slug: 'gestion-crise', ready: false },
      { title: 'DRP — IT Disaster Recovery Plan', icon: '⚙️', slug: 'drp', ready: false },
      { title: 'Incident Management', icon: '🚨', slug: 'gestion-incidents', ready: false },
    ],
  },
  {
    titre: "Client Services", emoji: '🎯', couleur: '#c2410c',
    modules: [
      { title: 'Client Incidents Management', icon: '🔧', slug: 'incidents-clients', ready: false },
      { title: 'Client Onboarding', icon: '🤝', slug: 'onboarding-client', ready: false },
      { title: 'i-Hub Service Catalogue', icon: '📂', slug: 'catalogue-services', ready: false },
      { title: 'Reporting to Clients', icon: '📈', slug: 'reporting-clients', ready: false },
      { title: 'Service Level Agreements (SLA)', icon: '📏', slug: 'sla', ready: false },
    ],
  },
  {
    titre: "Data Protection", emoji: '🔐', couleur: '#0891b2',
    modules: [
      { title: 'Data Security', icon: '🛡️', slug: 'securite-donnees', ready: false },
      { title: 'GDPR', icon: '🔐', slug: 'gdpr-rgpd', ready: false },
      { title: 'ISO 27001', icon: '🏅', slug: 'iso-27001', ready: false },
      { title: 'Professional Secrecy', icon: '🤫', slug: 'secret-professionnel', ready: false },
    ],
  },
  {
    titre: "Employees Rights & Duties", emoji: '👥', couleur: '#b45309',
    modules: [
      { title: 'Employee Duties', icon: '📌', slug: 'obligations-employe', ready: false },
      { title: 'Employee Rights', icon: '✊', slug: 'droits-employe', ready: false },
    ],
  },
  {
    titre: "Governance & Compliance", emoji: '⚖️', couleur: '#7c3aed',
    modules: [
      { title: 'Accessibility', icon: '♿', slug: 'accessibilite', ready: false },
      { title: 'Conflicts of Interest', icon: '⚡', slug: 'conflits-interets', ready: false },
      { title: 'Internal Control', icon: '🔎', slug: 'controle-interne', ready: false },
      { title: 'Mutualisation', icon: '🔗', slug: 'mutualisation', ready: false },
      { title: 'PSF Governance', icon: '🏛️', slug: 'gouvernance-psf', ready: false },
      { title: 'Regulatory Watch', icon: '📡', slug: 'veille-reglementaire', ready: false },
      { title: 'Risk Management', icon: '⚖️', slug: 'gestion-risques', ready: false },
      { title: 'Whistleblowing', icon: '📣', slug: 'whistleblowing', ready: false },
    ],
  },
  {
    titre: "International Taxation", emoji: '💼', couleur: '#dc2626',
    modules: [
      { title: 'CRS — Common Reporting Standard', icon: '🌍', slug: 'crs', ready: false },
      { title: 'FATCA — Foreign Account Tax Compliance Act', icon: '🇺🇸', slug: 'fatca', ready: false },
      { title: 'FATCA vs CRS vs QI — Key Differences', icon: '↔️', slug: 'fatca-crs-qi-differences', ready: false },
      { title: 'QI — Qualified Intermediary', icon: '💰', slug: 'qi', ready: false },
      { title: 'Reviewing W-9, W-8BEN & Tax Self-Certifications', icon: '📋', slug: 'formulaires-fiscaux', ready: false },
    ],
  },
  {
    titre: "IT Resilience & Infrastructure", emoji: '💻', couleur: '#059669',
    modules: [
      { title: 'Circular 24/850', icon: '📰', slug: 'circulaire-24-850', ready: false },
      { title: 'IT Infrastructure', icon: '🖥️', slug: 'infrastructure-it', ready: false },
      { title: 'IT Resilience (DORA)', icon: '💻', slug: 'resilience-it', ready: false },
      { title: 'ISO 22301', icon: '🏆', slug: 'iso-22301', ready: false },
      { title: 'Outsourcing 22/806', icon: '🤝', slug: 'externalisation', ready: false },
    ],
  },
]

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [openThemes, setOpenThemes] = useState<Record<number, boolean>>({ 0: true })
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

  const t = TRANSLATIONS[lang]
  const THEMES = lang === 'fr' ? THEMES_FR : THEMES_EN

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d2010', fontSize: '18px' }}>
      Chargement...
    </div>
  )

  const totalModules = THEMES.reduce((acc, th) => acc + th.modules.length, 0)
  const readyModules = THEMES.reduce((acc, th) => acc + th.modules.filter(m => m.ready).length, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', color: '#3d2010', fontFamily: 'sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: '#3d2010', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(61,32,16,0.25)' }}>
        <span style={{ color: '#e91e8c', fontWeight: '800', fontSize: '22px', letterSpacing: '0.5px' }}>
          🎓 Hub Academy
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px', gap: '2px' }}>
            <button onClick={() => setLang('fr')} style={{ padding: '5px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: lang === 'fr' ? '#e91e8c' : 'transparent', color: lang === 'fr' ? 'white' : '#e8d5c0', transition: 'all 0.2s' }}>
              🇫🇷 FR
            </button>
            <button onClick={() => setLang('en')} style={{ padding: '5px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: lang === 'en' ? '#e91e8c' : 'transparent', color: lang === 'en' ? 'white' : '#e8d5c0', transition: 'all 0.2s' }}>
              🇬🇧 EN
            </button>
          </div>
          <span style={{ color: '#e8d5c0', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #e91e8c', borderRadius: '8px', color: '#e91e8c', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            {t.logout}
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ position: 'relative', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src={HERO_IMAGE} alt="Hub Academy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,32,16,0.58)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'white' }}>
            {t.welcome} <span style={{ color: '#e91e8c' }}>Hub Academy</span> 🎓
          </h1>
          <p style={{ color: '#e8d5c0', marginBottom: '16px', fontSize: '15px' }}>{t.subtitle}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(233,30,140,0.15)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: '20px', padding: '6px 16px' }}>
            <span style={{ color: '#e91e8c', fontSize: '13px', fontWeight: '700' }}>{readyModules} {readyModules > 1 ? t.availablePlural : t.available}</span>
            <span style={{ color: '#e8d5c0', fontSize: '13px' }}>· {totalModules - readyModules} {t.coming} · {THEMES.length} {t.themes}</span>
          </div>
        </div>
      </div>

      {/* THEMES */}
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {THEMES.map((theme, ti) => {
            const isOpen = !!openThemes[ti]
            const readyCount = theme.modules.filter(m => m.ready).length
            return (
              <div key={ti} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(61,32,16,0.08)', border: `1.5px solid ${isOpen ? '#3d2010' : '#e8d5c0'}`, transition: 'all 0.2s' }}>
                <button onClick={() => toggleTheme(ti)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 24px', background: isOpen ? '#3d2010' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isOpen ? 'rgba(255,255,255,0.12)' : '#f0e6d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {theme.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: isOpen ? 'white' : '#3d2010', marginBottom: '2px' }}>{theme.titre}</div>
                    <div style={{ fontSize: '12px', color: isOpen ? '#e8d5c0' : '#9c7c5e' }}>
                      {theme.modules.length} {theme.modules.length > 1 ? t.modulesPlural : t.modules}
                      {readyCount > 0 && <span style={{ color: '#e91e8c', fontWeight: '600' }}> · {readyCount} {readyCount > 1 ? t.dispoFullPlural : t.dispoFull}</span>}
                    </div>
                  </div>
                  {readyCount > 0 && (
                    <span style={{ background: '#e91e8c', color: 'white', fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '3px 10px', flexShrink: 0 }}>
                      ✓ {readyCount} {t.dispo}
                    </span>
                  )}
                  <div style={{ fontSize: '18px', color: isOpen ? '#e91e8c' : '#9c7c5e', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>▾</div>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #e8d5c0', background: '#faf6f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', paddingTop: '16px' }}>
                      {theme.modules.map((m, i) => (
                        <div key={i}
                          onClick={() => m.ready && router.push(`/modules/${m.slug}`)}
                          style={{ background: '#faf6f0', border: m.ready ? '1.5px solid #e8d5c0' : '1.5px solid #ede0d4', borderRadius: '12px', padding: '16px', cursor: m.ready ? 'pointer' : 'default', transition: 'all 0.2s', opacity: m.ready ? 1 : 0.5, position: 'relative' } as React.CSSProperties}
                          onMouseOver={e => { if (m.ready) { e.currentTarget.style.borderColor = '#3d2010'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(61,32,16,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                          onMouseOut={e => { if (m.ready) { e.currentTarget.style.borderColor = '#e8d5c0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' } }}>
                          {m.ready && (
                            <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#e91e8c', color: 'white', fontSize: '9px', fontWeight: '700', borderRadius: '20px', padding: '2px 7px' }}>{t.dispo}</span>
                          )}
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>{m.icon}</div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: '#3d2010', lineHeight: 1.3, marginBottom: '4px' }}>{m.title}</div>
                          <div style={{ fontSize: '11px', color: '#9c7c5e' }}>{m.ready ? t.quizzes : t.soon}</div>
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
