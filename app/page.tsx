'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const HERO_IMAGE = '/hero.jpg'

const CERTIFICATIONS = {
  'aml-kyc':              { fr: '🕵️ Détective Financier',    en: '🕵️ Financial Detective',   emoji: '🕵️', desc_fr: "Maître de l'AML/KYC",       desc_en: 'AML/KYC Master' },
  'name-screening':       { fr: '🔎 Chasseur de Listes',     en: '🔎 List Hunter',            emoji: '🔎', desc_fr: 'Expert Name Screening',      desc_en: 'Name Screening Expert' },
  'risk-scoring':         { fr: '🎯 Sniper du Risque',       en: '🎯 Risk Sniper',            emoji: '🎯', desc_fr: 'Pro du Risk Scoring',        desc_en: 'Risk Scoring Pro' },
  'ubo':                  { fr: '🕵️ Chasseur de Fantômes',  en: '🕵️ Ghost Hunter',           emoji: '👤', desc_fr: 'Spécialiste UBO',            desc_en: 'UBO Specialist' },
  'ddr':                  { fr: '📋 Architecte des Données', en: '📋 Data Architect',         emoji: '📋', desc_fr: 'Expert DDR',                 desc_en: 'DDR Expert' },
  'operations-suspectes': { fr: '🚨 Gardien de la Vigilance',en: '🚨 Vigilance Guardian',    emoji: '🚨', desc_fr: 'Détecteur de soupçons',      desc_en: 'Suspicion Detector' },
  'gouvernance':          { fr: '🏛️ Architecte Gouvernance', en: '🏛️ Governance Architect',  emoji: '🏛️', desc_fr: 'Expert Gouvernance',         desc_en: 'Governance Expert' },
  'gestion-risques':      { fr: '⚖️ Équilibriste des Risques',en:'⚖️ Risk Tightrope Walker', emoji: '⚖️', desc_fr: 'Maître des risques',         desc_en: 'Risk Master' },
  'controle-interne':     { fr: '🔍 Œil de Lynx',           en: '🔍 Lynx Eye',              emoji: '🔍', desc_fr: 'Expert Contrôle Interne',    desc_en: 'Internal Control Expert' },
  'whistleblowing':       { fr: "📣 Lanceur d'Alerte Pro",   en: '📣 Pro Whistleblower',      emoji: '📣', desc_fr: 'Champion du signalement',    desc_en: 'Reporting Champion' },
  'gdpr-rgpd':            { fr: '🔐 Gardien des Données',   en: '🔐 Data Guardian',          emoji: '🔐', desc_fr: 'Expert RGPD',               desc_en: 'GDPR Expert' },
  'iso-27001':            { fr: '🏅 Chevalier Sécurité',    en: '🏅 Security Knight',        emoji: '🏅', desc_fr: 'Certifié ISO 27001',         desc_en: 'ISO 27001 Certified' },
  'resilience-it':        { fr: '💪 Pilier Numérique',      en: '💪 Digital Pillar',         emoji: '💻', desc_fr: 'Expert DORA',               desc_en: 'DORA Expert' },
  'fatca':                { fr: "🦅 Expert de l'Oncle Sam", en: '🦅 Uncle Sam Expert',       emoji: '🇺🇸', desc_fr: 'Maître FATCA',             desc_en: 'FATCA Master' },
  'crs':                  { fr: '🌍 Citoyen Fiscal Mondial', en: '🌍 Global Tax Citizen',     emoji: '🌍', desc_fr: 'Expert CRS',                desc_en: 'CRS Expert' },
}

const THEMES_FR = [
  {
    titre: "Anti-blanchiment d'argent", emoji: '🛡️', couleur: '#e91e8c',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'aml-grands-principes',   ready: false },
      { title: 'AML/KYC Rules',                 icon: '🔍', slug: 'aml-kyc',                ready: true  },
      { title: 'Cohérence des documents',       icon: '🔎', slug: 'coherence-documents',    ready: false },
      { title: 'DDR',                           icon: '📋', slug: 'ddr',                    ready: false },
      { title: 'Fraudes aux documents',         icon: '⚠️', slug: 'fraudes-documents',      ready: false },
      { title: 'Name Screening',                icon: '🔎', slug: 'name-screening',         ready: false },
      { title: 'Opérations suspectes',          icon: '🚨', slug: 'operations-suspectes',   ready: false },
      { title: 'Risk Scoring client',           icon: '📊', slug: 'risk-scoring',           ready: false },
      { title: 'UBO — Bénéficiaire effectif',   icon: '👤', slug: 'ubo',                    ready: false },
    ],
  },
  {
    titre: "Continuité de l'activité", emoji: '🔄', couleur: '#0369a1',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'bca-grands-principes',   ready: false },
      { title: 'Gestion de crise',              icon: '🆘', slug: 'gestion-crise',          ready: false },
      { title: 'Gestion des incidents',         icon: '🚨', slug: 'gestion-incidents',      ready: false },
      { title: 'ISO 22301',                     icon: '🏆', slug: 'iso-22301',              ready: false },
      { title: 'Plan de continuité (BCP)',      icon: '📆', slug: 'bcp',                    ready: false },
      { title: 'Plan de reprise IT (DRP)',      icon: '⚙️', slug: 'drp',                    ready: false },
      { title: 'Tests & exercices BCP',         icon: '🧪', slug: 'tests-bcp',              ready: false },
    ],
  },
  {
    titre: 'Droits & Obligations des employés', emoji: '👥', couleur: '#b45309',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'employe-grands-principes', ready: false },
      { title: 'Droits employé',                icon: '✊', slug: 'droits-employe',          ready: false },
      { title: 'Obligations employé',           icon: '📌', slug: 'obligations-employe',     ready: false },
    ],
  },
  {
    titre: 'Fiscalité internationale', emoji: '💼', couleur: '#dc2626',
    modules: [
      { title: 'Les grands principes',                          icon: '📖', slug: 'fiscalite-grands-principes',  ready: false },
      { title: 'CRS — Common Reporting Standard',              icon: '🌍', slug: 'crs',                         ready: false },
      { title: 'FATCA — Foreign Account Tax Compliance Act',   icon: '🇺🇸', slug: 'fatca',                       ready: false },
      { title: 'FATCA vs CRS vs QI — Quelles différences ?',  icon: '↔️', slug: 'fatca-crs-qi-differences',    ready: false },
      { title: "Indices d'américanité",                        icon: '🦅', slug: 'indices-americanite',         ready: false },
      { title: 'QI — Qualified Intermediary',                  icon: '💰', slug: 'qi',                          ready: false },
      { title: 'Vérifier un W-9, W-8BEN ou Tax Self-Cert',    icon: '📋', slug: 'formulaires-fiscaux',          ready: false },
    ],
  },
  {
    titre: 'Gouvernance & Conformité', emoji: '⚖️', couleur: '#7c3aed',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'gouvernance-grands-principes', ready: false },
      { title: 'Accessibilité',                 icon: '♿', slug: 'accessibilite',          ready: false },
      { title: 'Contrôle Interne',              icon: '🔎', slug: 'controle-interne',       ready: false },
      { title: "Gestion des Conflits d'intérêts",icon:'⚡', slug: 'conflits-interets',      ready: false },
      { title: 'Gestion des risques',           icon: '⚖️', slug: 'gestion-risques',        ready: false },
      { title: 'Gouvernance PSF',               icon: '🏛️', slug: 'gouvernance',            ready: false },
      { title: 'Mutualisation',                 icon: '🔗', slug: 'mutualisation',          ready: false },
      { title: 'Veille réglementaire',          icon: '📡', slug: 'veille-reglementaire',   ready: false },
      { title: 'Whistleblowing',                icon: '📣', slug: 'whistleblowing',         ready: false },
    ],
  },
  {
    titre: 'Protection des données', emoji: '🔐', couleur: '#0891b2',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'data-grands-principes',  ready: false },
      { title: 'GDPR / RGPD',                   icon: '🔐', slug: 'gdpr-rgpd',              ready: false },
      { title: 'ISO 27001',                     icon: '🏅', slug: 'iso-27001',              ready: false },
      { title: 'Secret professionnel',          icon: '🤫', slug: 'secret-professionnel',   ready: false },
      { title: 'Sécurité des données',          icon: '🛡️', slug: 'securite-donnees',       ready: false },
    ],
  },
  {
    titre: 'Résilience & Infrastructure IT', emoji: '💻', couleur: '#059669',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'it-grands-principes',    ready: false },
      { title: 'Circulaire 24/850',             icon: '📰', slug: 'circulaire-24-850',      ready: false },
      { title: 'Externalisation 22/806',        icon: '🤝', slug: 'externalisation',        ready: false },
      { title: 'Infrastructure IT',             icon: '🖥️', slug: 'infrastructure-it',      ready: false },
      { title: 'Résilience IT (DORA)',           icon: '💻', slug: 'resilience-it',          ready: false },
    ],
  },
  {
    titre: 'Sécurité', emoji: '🔒', couleur: '#6d28d9',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'securite-grands-principes', ready: false },
      { title: 'Cybersécurité',                 icon: '🛡️', slug: 'cybersecurite',          ready: false },
      { title: 'Gestion des accès',             icon: '🔑', slug: 'gestion-acces',          ready: false },
      { title: 'Incidents de sécurité',         icon: '🚨', slug: 'incidents-securite',     ready: false },
      { title: 'Politique de sécurité',         icon: '📋', slug: 'politique-securite',     ready: false },
      { title: 'Sécurité physique',             icon: '🏢', slug: 'securite-physique',      ready: false },
    ],
  },
  {
    titre: 'Services prestés aux clients', emoji: '🎯', couleur: '#c2410c',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'services-grands-principes', ready: false },
      { title: 'Catalogue des services i-Hub', icon: '📂', slug: 'catalogue-services',     ready: false },
      { title: 'Gestion des incidents clients',icon: '🔧', slug: 'incidents-clients',       ready: false },
      { title: 'Niveaux de service (SLA)',      icon: '📏', slug: 'sla',                    ready: false },
      { title: 'Onboarding client',             icon: '🤝', slug: 'onboarding-client',      ready: false },
      { title: 'Rapports & reporting clients', icon: '📈', slug: 'reporting-clients',       ready: false },
    ],
  },
]

const THEMES_EN = [
  {
    titre: 'Anti-Money Laundering', emoji: '🛡️', couleur: '#e91e8c',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'aml-grands-principes',   ready: false },
      { title: 'AML/KYC Rules',                 icon: '🔍', slug: 'aml-kyc',                ready: true  },
      { title: 'DDR',                           icon: '📋', slug: 'ddr',                    ready: false },
      { title: 'Document Consistency',          icon: '🔎', slug: 'coherence-documents',    ready: false },
      { title: 'Document Fraud',                icon: '⚠️', slug: 'fraudes-documents',      ready: false },
      { title: 'Name Screening',                icon: '🔎', slug: 'name-screening',         ready: false },
      { title: 'Risk Scoring',                  icon: '📊', slug: 'risk-scoring',           ready: false },
      { title: 'Suspicious Transactions',       icon: '🚨', slug: 'operations-suspectes',   ready: false },
      { title: 'UBO — Ultimate Beneficial Owner',icon:'👤', slug: 'ubo',                    ready: false },
    ],
  },
  {
    titre: 'Business Continuity', emoji: '🔄', couleur: '#0369a1',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'bca-grands-principes',   ready: false },
      { title: 'BCP — Business Continuity Plan',icon: '📆', slug: 'bcp',                    ready: false },
      { title: 'BCP Tests & Exercises',         icon: '🧪', slug: 'tests-bcp',              ready: false },
      { title: 'Crisis Management',             icon: '🆘', slug: 'gestion-crise',          ready: false },
      { title: 'DRP — IT Disaster Recovery',   icon: '⚙️', slug: 'drp',                    ready: false },
      { title: 'Incident Management',           icon: '🚨', slug: 'gestion-incidents',      ready: false },
      { title: 'ISO 22301',                     icon: '🏆', slug: 'iso-22301',              ready: false },
    ],
  },
  {
    titre: 'Data Protection', emoji: '🔐', couleur: '#0891b2',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'data-grands-principes',  ready: false },
      { title: 'Data Security',                 icon: '🛡️', slug: 'securite-donnees',       ready: false },
      { title: 'GDPR',                          icon: '🔐', slug: 'gdpr-rgpd',              ready: false },
      { title: 'ISO 27001',                     icon: '🏅', slug: 'iso-27001',              ready: false },
      { title: 'Professional Secrecy',          icon: '🤫', slug: 'secret-professionnel',   ready: false },
    ],
  },
  {
    titre: 'Employees Rights & Duties', emoji: '👥', couleur: '#b45309',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'employe-grands-principes', ready: false },
      { title: 'Employee Duties',               icon: '📌', slug: 'obligations-employe',     ready: false },
      { title: 'Employee Rights',               icon: '✊', slug: 'droits-employe',           ready: false },
    ],
  },
  {
    titre: 'Governance & Compliance', emoji: '⚖️', couleur: '#7c3aed',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'gouvernance-grands-principes', ready: false },
      { title: 'Accessibility',                 icon: '♿', slug: 'accessibilite',           ready: false },
      { title: 'Conflicts of Interest',         icon: '⚡', slug: 'conflits-interets',       ready: false },
      { title: 'Governance PSF',                icon: '🏛️', slug: 'gouvernance',             ready: false },
      { title: 'Internal Control',              icon: '🔎', slug: 'controle-interne',        ready: false },
      { title: 'Mutualisation',                 icon: '🔗', slug: 'mutualisation',           ready: false },
      { title: 'Regulatory Watch',              icon: '📡', slug: 'veille-reglementaire',    ready: false },
      { title: 'Risk Management',               icon: '⚖️', slug: 'gestion-risques',         ready: false },
      { title: 'Whistleblowing',                icon: '📣', slug: 'whistleblowing',          ready: false },
    ],
  },
  {
    titre: 'International Taxation', emoji: '💼', couleur: '#dc2626',
    modules: [
      { title: 'Key Principles',                            icon: '📖', slug: 'fiscalite-grands-principes', ready: false },
      { title: 'CRS — Common Reporting Standard',          icon: '🌍', slug: 'crs',                       ready: false },
      { title: 'FATCA — Foreign Account Tax Compliance',   icon: '🇺🇸', slug: 'fatca',                     ready: false },
      { title: 'FATCA vs CRS vs QI — Key Differences',    icon: '↔️', slug: 'fatca-crs-qi-differences',  ready: false },
      { title: 'Indicia of US Person Status',              icon: '🦅', slug: 'indices-americanite',       ready: false },
      { title: 'QI — Qualified Intermediary',              icon: '💰', slug: 'qi',                        ready: false },
      { title: 'Reviewing W-9, W-8BEN & Tax Self-Certs',  icon: '📋', slug: 'formulaires-fiscaux',        ready: false },
    ],
  },
  {
    titre: 'IT Resilience & Infrastructure', emoji: '💻', couleur: '#059669',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'it-grands-principes',    ready: false },
      { title: 'Circular 24/850',               icon: '📰', slug: 'circulaire-24-850',      ready: false },
      { title: 'IT Infrastructure',             icon: '🖥️', slug: 'infrastructure-it',      ready: false },
      { title: 'IT Resilience (DORA)',           icon: '💻', slug: 'resilience-it',          ready: false },
      { title: 'Outsourcing 22/806',             icon: '🤝', slug: 'externalisation',        ready: false },
    ],
  },
  {
    titre: 'Security', emoji: '🔒', couleur: '#6d28d9',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'securite-grands-principes', ready: false },
      { title: 'Access Management',             icon: '🔑', slug: 'gestion-acces',          ready: false },
      { title: 'Cybersecurity',                 icon: '🛡️', slug: 'cybersecurite',          ready: false },
      { title: 'Physical Security',             icon: '🏢', slug: 'securite-physique',      ready: false },
      { title: 'Security Incidents',            icon: '🚨', slug: 'incidents-securite',     ready: false },
      { title: 'Security Policy',               icon: '📋', slug: 'politique-securite',     ready: false },
    ],
  },
  {
    titre: 'Client Services', emoji: '🎯', couleur: '#c2410c',
    modules: [
      { title: 'Key Principles',                icon: '📖', slug: 'services-grands-principes', ready: false },
      { title: 'Client Incidents Management',   icon: '🔧', slug: 'incidents-clients',      ready: false },
      { title: 'Client Onboarding',             icon: '🤝', slug: 'onboarding-client',      ready: false },
      { title: 'i-Hub Service Catalogue',       icon: '📂', slug: 'catalogue-services',     ready: false },
      { title: 'Reporting to Clients',          icon: '📈', slug: 'reporting-clients',      ready: false },
      { title: 'Service Level Agreements (SLA)',icon: '📏', slug: 'sla',                    ready: false },
    ],
  },
]

const UI = {
  fr: {
    siteSubtitle: 'Votre plateforme de formation réglementaire',
    logout: 'Déconnexion', available: 'disponible', coming: 'à venir', themes: 'thématiques',
    modules: 'module', modulesP: 'modules', dispo: 'DISPO', soon: 'Bientôt disponible',
    quizzes: 'Fiches + quiz interactifs', dashboard: 'Mon tableau de bord',
    noModules: "Aucun module complété pour l'instant",
    noModulesDesc: 'Commencez un module pour gagner votre première certification !',
    yourCerts: 'Vos certifications obtenues', totalScore: 'HubCoins 🪙', rank: 'Niveau',
    toUnlock: 'À débloquer', progress: 'Progression globale', allModules: 'Tous les modules',
    ranks: ['🌱 Débutant', '🌿 Apprenti', '⭐ Confirmé', '🏆 Expert', '🎓 Maître Réglementaire'],
  },
  en: {
    siteSubtitle: 'Your regulatory training platform',
    logout: 'Logout', available: 'available', coming: 'coming soon', themes: 'themes',
    modules: 'module', modulesP: 'modules', dispo: 'AVAIL.', soon: 'Coming soon',
    quizzes: 'Cards + interactive quizzes', dashboard: 'My Dashboard',
    noModules: 'No modules completed yet',
    noModulesDesc: 'Start a module to earn your first certification!',
    yourCerts: 'Your earned certifications', totalScore: 'HubCoins 🪙', rank: 'Level',
    toUnlock: 'To unlock', progress: 'Overall progress', allModules: 'All modules',
    ranks: ['🌱 Beginner', '🌿 Apprentice', '⭐ Confirmed', '🏆 Expert', '🎓 Regulatory Master'],
  },
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  const [view, setView] = useState<'home'|'dashboard'>('home')
  const [openThemes, setOpenThemes] = useState<Record<number, boolean>>({ 0: true })
  const router = useRouter()
  const supabase = createClient()
  const [completedModules] = useState<string[]>(['aml-kyc'])

  useEffect(() => { setLang(getLang()) }, [])
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); setLoading(false) }
    })
  }, [])

  const t = UI[lang]
  const THEMES = lang === 'fr' ? THEMES_FR : THEMES_EN
  const totalModules = THEMES.reduce((acc, th) => acc + th.modules.length, 0)
  const readyModules = THEMES.reduce((acc, th) => acc + th.modules.filter(m => m.ready).length, 0)
  const earnedCerts = completedModules.map(s => ({ slug: s, cert: (CERTIFICATIONS as any)[s] })).filter(c => c.cert)
  const totalPoints = earnedCerts.length * 100
  const rankIndex = Math.min(Math.floor(totalPoints / 100), t.ranks.length - 1)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b3a2a', fontSize: '18px' }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f0', display: 'flex', fontFamily: 'sans-serif', color: '#6b3a2a' }}>

      {/* COLONNE IMAGE VERTICALE */}
      <div style={{ width: '280px', minWidth: '280px', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, overflow: 'hidden' } as React.CSSProperties}>
        <img src={HERO_IMAGE} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.92 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,32,16,0.18)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 16px' }}>
          <div style={{ fontSize: '30px', marginBottom: '6px' }}>🎓</div>
          <h1 style={{ color: '#e91e8c', fontWeight: '800', fontSize: '17px', margin: '0 0 4px', lineHeight: 1.2, textShadow: '0 2px 6px rgba(0,0,0,0.55)' }}>Hub Academy</h1>
          <p style={{ color: 'white', fontSize: '10px', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.55)', opacity: 0.9, lineHeight: 1.4 }}>{t.siteSubtitle}</p>
        </div>
      </div>

      {/* ZONE DROITE : header nav + contenu */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* HEADER NAV */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#6b3a2a', borderBottom: '1px solid #8b5a47', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', height: '52px', flexShrink: 0 }}>
          {[
            { key: 'home' as const, icon: '📚', labelFr: 'Formations', labelEn: 'Training' },
            { key: 'dashboard' as const, icon: '🏆', labelFr: 'Mon tableau de bord', labelEn: 'My Dashboard' },
          ].map(item => (
            <button key={item.key} onClick={() => setView(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: view === item.key ? 'rgba(233,30,140,0.25)' : 'transparent', color: view === item.key ? '#e91e8c' : '#e8d5c0', fontWeight: view === item.key ? '700' : '400', fontSize: '14px', transition: 'all 0.2s' }}>
              <span>{item.icon}</span>
              <span>{lang === 'fr' ? item.labelFr : item.labelEn}</span>
              {item.key === 'dashboard' && earnedCerts.length > 0 && (
                <span style={{ background: '#e91e8c', color: 'white', fontSize: '10px', fontWeight: '800', borderRadius: '20px', padding: '1px 6px' }}>{earnedCerts.length}</span>
              )}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px', gap: '2px' }}>
              {(['fr', 'en'] as const).map(l => (
                <button key={l} onClick={() => { saveLang(l); setLang(l) }}
                  style={{ padding: '4px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: lang === l ? '#e91e8c' : 'transparent', color: lang === l ? 'white' : '#e8d5c0', transition: 'all 0.2s' }}>
                  {l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                </button>
              ))}
            </div>
            <span style={{ color: '#e8d5c0', fontSize: '12px', opacity: 0.7 }}>{user?.email}</span>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(233,30,140,0.5)', borderRadius: '8px', color: '#e91e8c', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
              {t.logout}
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* HOME VIEW */}
        {view === 'home' && (
          <div style={{ padding: '40px 32px', maxWidth: '1000px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#6b3a2a', margin: '0 0 8px' }}>{t.allModules}</h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fce4ec', borderRadius: '20px', padding: '5px 14px' }}>
                <span style={{ color: '#e91e8c', fontSize: '13px', fontWeight: '700' }}>{readyModules} {t.available}</span>
                <span style={{ color: '#9c7c5e', fontSize: '13px' }}>· {totalModules - readyModules} {t.coming} · {THEMES.length} {t.themes}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {THEMES.map((theme, ti) => {
                const isOpen = !!openThemes[ti]
                const readyCount = theme.modules.filter(m => m.ready).length
                return (
                  <div key={ti} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,58,42,0.08)', border: `1.5px solid ${isOpen ? '#6b3a2a' : '#e8d5c0'}`, transition: 'all 0.2s' }}>
                    <button onClick={() => setOpenThemes(p => ({ ...p, [ti]: !p[ti] }))}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: isOpen ? '#6b3a2a' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isOpen ? 'rgba(255,255,255,0.12)' : '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{theme.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: isOpen ? 'white' : '#6b3a2a', marginBottom: '2px' }}>{theme.titre}</div>
                        <div style={{ fontSize: '12px', color: isOpen ? '#e8d5c0' : '#9c7c5e' }}>
                          {theme.modules.length} {theme.modules.length > 1 ? t.modulesP : t.modules}
                          {readyCount > 0 && <span style={{ color: '#e91e8c', fontWeight: '600' }}> · {readyCount} {t.available}</span>}
                        </div>
                      </div>
                      {readyCount > 0 && <span style={{ background: '#e91e8c', color: 'white', fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '3px 10px', flexShrink: 0 }}>✓ {readyCount}</span>}
                      <div style={{ fontSize: '16px', color: isOpen ? '#e91e8c' : '#9c7c5e', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>▾</div>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid #e8d5c0', background: '#faf6f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '10px', paddingTop: '14px' }}>
                          {theme.modules.map((m, i) => (
                            <div key={i} onClick={() => m.ready && router.push(`/modules/${m.slug}`)}
                              style={{ background: 'white', border: m.ready ? `1.5px solid ${theme.couleur}40` : '1.5px solid #e8d5c0', borderRadius: '12px', padding: '14px', cursor: m.ready ? 'pointer' : 'default', transition: 'all 0.2s', opacity: m.ready ? 1 : 0.5, position: 'relative' } as React.CSSProperties}
                              onMouseOver={e => { if (m.ready) { e.currentTarget.style.borderColor = theme.couleur; e.currentTarget.style.boxShadow = `0 4px 16px ${theme.couleur}20`; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                              onMouseOut={e => { if (m.ready) { e.currentTarget.style.borderColor = `${theme.couleur}40`; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' } }}>
                              {m.ready && <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#e91e8c', color: 'white', fontSize: '9px', fontWeight: '700', borderRadius: '20px', padding: '1px 6px' }}>{t.dispo}</span>}
                              {completedModules.includes(m.slug) && <span style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '12px' }}>✅</span>}
                              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{m.icon}</div>
                              <div style={{ fontWeight: '700', fontSize: '12px', color: '#6b3a2a', lineHeight: 1.3, marginBottom: '3px' }}>{m.title}</div>
                              <div style={{ fontSize: '10px', color: '#9c7c5e' }}>{m.ready ? t.quizzes : t.soon}</div>
                              {m.ready && <div style={{ marginTop: '8px', background: '#fce4ec', borderRadius: '3px', height: '3px' }}><div style={{ background: completedModules.includes(m.slug) ? '#059669' : '#e91e8c', borderRadius: '3px', height: '3px', width: completedModules.includes(m.slug) ? '100%' : '0%' }}/></div>}
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
        )}

        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <div style={{ padding: '40px 32px', maxWidth: '900px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#6b3a2a', margin: '0 0 6px' }}>{t.dashboard}</h2>
            <p style={{ color: '#9c7c5e', marginBottom: '32px' }}>{user?.email}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: lang === 'fr' ? 'Certifications' : 'Certifications', value: String(earnedCerts.length), icon: '🏅', color: '#e91e8c' },
                { label: t.totalScore, value: String(totalPoints) + ' 🪙', icon: '⭐', color: '#7c3aed' },
                { label: t.rank, value: t.ranks[rankIndex], icon: '🎓', color: '#059669', small: true },
              ].map((card, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1.5px solid #e8d5c0', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
                  <div style={{ fontSize: card.small ? '13px' : '26px', fontWeight: '800', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                  <div style={{ fontSize: '12px', color: '#9c7c5e' }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1.5px solid #e8d5c0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: '700', color: '#6b3a2a', fontSize: '14px' }}>{t.progress}</span>
                <span style={{ color: '#e91e8c', fontWeight: '700', fontSize: '14px' }}>{earnedCerts.length}/{Object.keys(CERTIFICATIONS).length}</span>
              </div>
              <div style={{ background: '#fce4ec', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #e91e8c, #f472b6)', height: '12px', width: `${(earnedCerts.length / Object.keys(CERTIFICATIONS).length) * 100}%`, borderRadius: '8px', transition: 'width 1s ease' }}/>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6b3a2a', marginBottom: '16px' }}>{t.yourCerts}</h3>
            {earnedCerts.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '2px dashed #e8d5c0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
                <p style={{ fontWeight: '700', color: '#6b3a2a', fontSize: '18px', margin: '0 0 8px' }}>{t.noModules}</p>
                <p style={{ color: '#9c7c5e', margin: 0, fontSize: '14px' }}>{t.noModulesDesc}</p>
                <button onClick={() => setView('home')} style={{ marginTop: '20px', padding: '12px 24px', background: '#e91e8c', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                  {lang === 'fr' ? 'Voir les modules →' : 'See modules →'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {earnedCerts.map(({ slug, cert }) => (
                  <div key={slug} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '2px solid #e91e8c30', boxShadow: '0 4px 20px rgba(233,30,140,0.08)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #e91e8c, #f472b6)' }}/>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>{cert.emoji}</div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#6b3a2a', marginBottom: '4px' }}>{lang === 'fr' ? cert.fr : cert.en}</div>
                    <div style={{ fontSize: '11px', color: '#9c7c5e', marginBottom: '12px' }}>{lang === 'fr' ? cert.desc_fr : cert.desc_en}</div>
                    <div style={{ background: '#e91e8c', color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '700', display: 'inline-block' }}>
                      ✓ {lang === 'fr' ? 'Obtenu' : 'Earned'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#9c7c5e', marginTop: '32px', marginBottom: '16px' }}>{t.toUnlock}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {Object.entries(CERTIFICATIONS).filter(([slug]) => !completedModules.includes(slug)).map(([slug, cert]) => (
                <div key={slug} style={{ background: '#faf6f0', borderRadius: '12px', padding: '14px', border: '1.5px solid #e8d5c0', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', filter: 'grayscale(1)' }}>{(cert as any).emoji}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '12px', color: '#6b3a2a' }}>{lang === 'fr' ? (cert as any).fr : (cert as any).en}</div>
                    <div style={{ fontSize: '11px', color: '#9c7c5e' }}>🔒 {t.toUnlock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
