const fs = require('fs');

const tsx = `'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

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
    titre: "AML/CTF", emoji: '🛡️', couleur: '#e91e8c',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'aml-grands-principes',   ready: true },
      { title: 'AML/KYC des clients finaux',     icon: '🔍', slug: 'aml-kyc',                ready: true  },
      { title: 'AML/KYC — Nos clients PSF',    icon: '🏦', slug: 'aml-kyc-nos-clients',    ready: true  },
      { title: 'Cohérence des documents',       icon: '🔎', slug: 'aml-coherence-documents',    ready: true  },
      { title: 'DDR',                           icon: '📋', slug: 'aml-ddr',                    ready: true },
      { title: 'Fraudes aux documents',         icon: '⚠️', slug: 'aml-fraudes-documents',      ready: true },
      { title: 'Name Screening',                icon: '🔎', slug: 'aml-name-screening',         ready: true },
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
    titre: 'Fiscalité internationale', emoji: '💼', couleur: '#e07b39',
    modules: [
      { title: 'Les grands principes',                          icon: '📖', slug: 'fiscalite-grands-principes',  ready: true  },
      { title: 'CRS — Common Reporting Standard',              icon: '🌍', slug: 'crs',                         ready: true  },
      { title: 'FATCA — Foreign Account Tax Compliance Act',   icon: '🇺🇸', slug: 'fatca',                       ready: true  },
      { title: 'FATCA vs CRS vs QI — Quelles différences ?',  icon: '↔️', slug: 'fatca-crs-qi-differences',    ready: true  },
      { title: "Indices d'américanité",                        icon: '🦅', slug: 'indices-americanite',         ready: true  },
      { title: 'QI — Qualified Intermediary',                  icon: '💰', slug: 'qi',                          ready: true  },
      { title: 'Vérifier un W-9, W-8BEN ou Tax Self-Cert',    icon: '📋', slug: 'formulaires-fiscaux',          ready: true  },
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
      { title: 'Gouvernance',               icon: '🏛️', slug: 'gouvernance',            ready: false },
      { title: 'Mutualisation',                 icon: '🔗', slug: 'mutualisation',          ready: false },
      { title: 'Veille réglementaire',          icon: '📡', slug: 'veille-reglementaire',   ready: false },
      { title: 'Circulaire 24/850',             icon: '📰', slug: 'circulaire-24-850',      ready: false },
      { title: 'Whistleblowing',                icon: '📣', slug: 'whistleblowing',         ready: false },
    ],
  },
  {
    titre: 'Protection des données', emoji: '🔐', couleur: '#0891b2',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'data-grands-principes',  ready: false },
      { title: 'GDPR / RGPD',                   icon: '🔐', slug: 'gdpr-rgpd',              ready: false },

      { title: 'Secret professionnel',          icon: '🤫', slug: 'secret-professionnel',   ready: false },
      { title: 'Sécurité des données',          icon: '🛡️', slug: 'securite-donnees',       ready: false },
    ],
  },
  {
    titre: 'Résilience & Infrastructure IT', emoji: '💻', couleur: '#059669',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'it-grands-principes',    ready: false },

      { title: 'Infrastructure IT',             icon: '🖥️', slug: 'infrastructure-it',      ready: false },
      { title: 'Résilience IT (DORA)',          icon: '💻', slug: 'resilience-it',          ready: false },

    ],
  },
  {
    titre: 'Sécurité', emoji: '🔒', couleur: '#6d28d9',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'securite-grands-principes', ready: false },
      { title: 'Gestion des accès',             icon: '🔑', slug: 'gestion-acces',          ready: false },
      { title: 'Cybersécurité',                 icon: '🛡️', slug: 'cybersecurite',          ready: false },
      { title: 'Sécurité physique',             icon: '🏢', slug: 'securite-physique',      ready: false },
      { title: 'ISO 27001',                     icon: '🏅', slug: 'iso-27001',              ready: false },
      { title: 'Incidents de sécurité',         icon: '🚨', slug: 'incidents-securite',     ready: false },
      { title: 'Politique de sécurité',         icon: '📋', slug: 'politique-securite',     ready: false },
    ],
  },
  {
    titre: 'Externalisation', emoji: '🤝', couleur: '#0369a1',
    modules: [
      { title: 'Circulaire 22/806',              icon: '🤝', slug: 'externalisation',        ready: false },
    ],

  },
  {
    titre: 'Services clients', emoji: '🎯', couleur: '#f59e0b',
    modules: [
      { title: 'Les grands principes',          icon: '📖', slug: 'services-grands-principes', ready: false },
      { title: 'Gestion incidents clients',     icon: '🔧', slug: 'incidents-clients',      ready: false },
      { title: 'Onboarding client',             icon: '🤝', slug: 'onboarding-client',      ready: false },
      { title: 'Catalogue de services i-Hub',  icon: '📂', slug: 'catalogue-services',     ready: false },
      { title: 'Reporting clients',             icon: '📈', slug: 'reporting-clients',      ready: false },
      { title: 'SLA',                           icon: '📏', slug: 'sla',                    ready: false },
    ],
  },
]

const THEMES_EN = [
  {
    titre: 'AML/CTF', emoji: '🛡️', couleur: '#e91e8c',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'aml-grands-principes',   ready: true },
      { title: 'AML/KYC Final Clients',   icon: '🔍', slug: 'aml-kyc',                ready: true  },
      { title: 'AML/KYC — Our PSF clients', icon: '🏦', slug: 'aml-kyc-nos-clients',    ready: true  },
      { title: 'Document Consistency',    icon: '🔎', slug: 'aml-coherence-documents',    ready: true  },
      { title: 'DDR',                     icon: '📋', slug: 'aml-ddr',                    ready: true },
      { title: 'Document Fraud',          icon: '⚠️', slug: 'aml-fraudes-documents',      ready: true },
      { title: 'Name Screening',          icon: '🔎', slug: 'aml-name-screening',         ready: true },
      { title: 'Suspicious Operations',   icon: '🚨', slug: 'operations-suspectes',   ready: false },
      { title: 'Client Risk Scoring',     icon: '📊', slug: 'risk-scoring',           ready: false },
      { title: 'UBO',                     icon: '👤', slug: 'ubo',                    ready: false },
    ],
  },
  {
    titre: 'Business Continuity', emoji: '🔄', couleur: '#0369a1',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'bca-grands-principes',   ready: false },
      { title: 'Crisis Management',       icon: '🆘', slug: 'gestion-crise',          ready: false },
      { title: 'Incident Management',     icon: '🚨', slug: 'gestion-incidents',      ready: false },
      { title: 'ISO 22301',               icon: '🏆', slug: 'iso-22301',              ready: false },
      { title: 'BCP',                     icon: '📆', slug: 'bcp',                    ready: false },
      { title: 'DRP',                     icon: '⚙️', slug: 'drp',                    ready: false },
      { title: 'BCP Tests',               icon: '🧪', slug: 'tests-bcp',              ready: false },
    ],
  },
  {
    titre: 'Employee Rights & Duties', emoji: '👥', couleur: '#b45309',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'employe-grands-principes', ready: false },
      { title: 'Employee Rights',         icon: '✊', slug: 'droits-employe',          ready: false },
      { title: 'Employee Obligations',    icon: '📌', slug: 'obligations-employe',     ready: false },
    ],
  },
  {
    titre: 'International Taxation', emoji: '💼', couleur: '#e07b39',
    modules: [
      { title: 'Key Principles',                          icon: '📖', slug: 'fiscalite-grands-principes', ready: false },
      { title: 'CRS — Common Reporting Standard',        icon: '🌍', slug: 'crs',                       ready: true  },
      { title: 'FATCA',                                  icon: '🇺🇸', slug: 'fatca',                     ready: true  },
      { title: 'FATCA vs CRS vs QI',                    icon: '↔️', slug: 'fatca-crs-qi-differences',  ready: true  },
      { title: 'Indicia of US Status',                   icon: '🦅', slug: 'indices-americanite',       ready: false },
      { title: 'QI — Qualified Intermediary',            icon: '💰', slug: 'qi',                        ready: true  },
      { title: 'W-9, W-8BEN & Tax Self-Certs',          icon: '📋', slug: 'formulaires-fiscaux',        ready: false },
    ],
  },
  {
    titre: 'Governance & Compliance', emoji: '⚖️', couleur: '#7c3aed',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'gouvernance-grands-principes', ready: false },
      { title: 'Accessibility',           icon: '♿', slug: 'accessibilite',          ready: false },
      { title: 'Internal Control',        icon: '🔎', slug: 'controle-interne',       ready: false },
      { title: 'Conflicts of Interest',   icon: '⚡', slug: 'conflits-interets',      ready: false },
      { title: 'Risk Management',         icon: '⚖️', slug: 'gestion-risques',        ready: false },
      { title: 'Governance',          icon: '🏛️', slug: 'gouvernance',            ready: false },
      { title: 'Mutualisation',           icon: '🔗', slug: 'mutualisation',          ready: false },
      { title: 'Regulatory Watch',        icon: '📡', slug: 'veille-reglementaire',   ready: false },
      { title: 'Whistleblowing',          icon: '📣', slug: 'whistleblowing',         ready: false },
      { title: 'Circular 24/850',         icon: '📰', slug: 'circulaire-24-850',      ready: false },
    ],
  },
  {
    titre: 'Data Protection', emoji: '🔐', couleur: '#0891b2',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'data-grands-principes',  ready: false },
      { title: 'GDPR / RGPD',             icon: '🔐', slug: 'gdpr-rgpd',              ready: false },

      { title: 'Professional Secrecy',    icon: '🤫', slug: 'secret-professionnel',   ready: false },
      { title: 'Data Security',           icon: '🛡️', slug: 'securite-donnees',       ready: false },
    ],
  },
  {
    titre: 'IT Resilience & Infrastructure', emoji: '💻', couleur: '#059669',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'it-grands-principes',    ready: false },
      { title: 'IT Infrastructure',       icon: '🖥️', slug: 'infrastructure-it',      ready: false },
      { title: 'IT Resilience (DORA)',    icon: '💻', slug: 'resilience-it',          ready: false },
    ],
  },
  {
    titre: 'Security', emoji: '🔒', couleur: '#6d28d9',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'securite-grands-principes', ready: false },
      { title: 'Access Management',       icon: '🔑', slug: 'gestion-acces',          ready: false },
      { title: 'Cybersecurity',           icon: '🛡️', slug: 'cybersecurite',          ready: false },
      { title: 'ISO 27001',               icon: '🏅', slug: 'iso-27001',              ready: false },
      { title: 'Physical Security',       icon: '🏢', slug: 'securite-physique',      ready: false },
      { title: 'Security Incidents',      icon: '🚨', slug: 'incidents-securite',     ready: false },
      { title: 'Security Policy',         icon: '📋', slug: 'politique-securite',     ready: false },
    ],
  },
  {
    titre: 'Client Services', emoji: '🎯', couleur: '#f59e0b',
    modules: [
      { title: 'Key Principles',          icon: '📖', slug: 'services-grands-principes', ready: false },
      { title: 'Client Incidents',        icon: '🔧', slug: 'incidents-clients',      ready: false },
      { title: 'Client Onboarding',       icon: '🤝', slug: 'onboarding-client',      ready: false },
      { title: 'i-Hub Service Catalogue', icon: '📂', slug: 'catalogue-services',     ready: false },
      { title: 'Client Reporting',        icon: '📈', slug: 'reporting-clients',      ready: false },
      { title: 'SLA',                     icon: '📏', slug: 'sla',                    ready: false },
    ],
  },
]

const UI = {
  fr: {
    subtitle: 'PSF Luxembourg', logout: 'Déconnexion',
    available: 'disponible', coming: 'à venir',
    modules: 'module', modulesP: 'modules', dispo: 'DISPO', soon: 'Bientôt disponible',
    quizzes: 'Fiches + quiz interactifs', dashboard: 'Mon tableau de bord',
    formations: 'FORMATIONS', profil: 'MON PROFIL',
    noModules: "Aucun module complété pour l'instant",
    noModulesDesc: 'Commencez un module pour gagner votre première certification !',
    yourCerts: 'Vos certifications', totalScore: 'HubCoins 🪙', rank: 'Niveau',
    toUnlock: 'À débloquer', progress: 'Progression globale', allModules: 'Tous les modules',
    seeModules: 'Voir les modules →',
    earned: 'Obtenu',
    ranks: ['🌱 Débutant', '🌿 Apprenti', '⭐ Confirmé', '🏆 Expert', '🎓 Maître Réglementaire'],
    selectTheme: 'Sélectionnez un thème dans le menu pour voir les modules.',
    welcome: 'Bienvenue sur Hub Academy',
    welcomeSub: 'Votre plateforme de formation réglementaire i-Hub',
    statTotal: 'modules au total',
    statDispo: 'disponible',
    statThemes: 'thématiques',
  },
  en: {
    subtitle: 'PSF Luxembourg', logout: 'Logout',
    available: 'available', coming: 'coming soon',
    modules: 'module', modulesP: 'modules', dispo: 'AVAIL.', soon: 'Coming soon',
    quizzes: 'Cards + interactive quizzes', dashboard: 'My Dashboard',
    formations: 'TRAINING', profil: 'MY PROFILE',
    noModules: 'No modules completed yet',
    noModulesDesc: 'Start a module to earn your first certification!',
    yourCerts: 'Your certifications', totalScore: 'HubCoins 🪙', rank: 'Level',
    toUnlock: 'To unlock', progress: 'Overall progress', allModules: 'All modules',
    seeModules: 'See modules →',
    earned: 'Earned',
    ranks: ['🌱 Beginner', '🌿 Apprentice', '⭐ Confirmed', '🏆 Expert', '🎓 Regulatory Master'],
    selectTheme: 'Select a theme from the menu to view its modules.',
    welcome: 'Welcome to Hub Academy',
    welcomeSub: 'Your i-Hub regulatory training platform',
    statTotal: 'total modules',
    statDispo: 'available',
    statThemes: 'themes',
  },
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  const [view, setView] = useState<'welcome'|'theme'|'dashboard'>('welcome')
  const [activeTheme, setActiveTheme] = useState<number>(0)
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

  const ACCENT = '#e07b39'
  const SIDEBAR_BG = '#ffffff'
  const SIDEBAR_HOVER = '#f3f4f6'
  const SIDEBAR_ACTIVE = '#fff7ed'

  const sidebarItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 16px', cursor: 'pointer', fontSize: '13px',
    fontWeight: active ? '600' : '400',
    color: active ? '#111827' : '#374151',
    background: active ? SIDEBAR_ACTIVE : 'transparent',
    borderLeft: active ? \`3px solid \${ACCENT}\` : '3px solid transparent',
    transition: 'all 0.15s', userSelect: 'none',
  })

  if (loading) return (
    <div style={{ minHeight: '100vh', background: SIDEBAR_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, fontSize: '16px', fontFamily: 'sans-serif' }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f0f2f5' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: '210px', minWidth: '210px', background: SIDEBAR_BG, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0 } as React.CSSProperties}>

        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', background: ACCENT, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎓</div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px', lineHeight: 1.2 }}>Hub Academy</div>
              <div style={{ color: '#6b7280', fontSize: '10px' }}>{t.subtitle}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>

          {/* Section Formations */}
          <div style={{ padding: '8px 16px 4px', fontSize: '10px', fontWeight: '700', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>{t.formations}</div>

          {THEMES.map((theme, ti) => {
            const readyCount = theme.modules.filter(m => m.ready).length
            const isActive = view === 'theme' && activeTheme === ti
            return (
              <div
                key={ti}
                style={sidebarItemStyle(isActive)}
                onClick={() => { setView('theme'); setActiveTheme(ti) }}
                onMouseOver={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = SIDEBAR_HOVER }}
                onMouseOut={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{theme.emoji}</span>
                <span style={{ flex: 1, lineHeight: 1.3 }}>{theme.titre}</span>
                {readyCount > 0 && (
                  <span style={{ background: ACCENT, color: 'white', fontSize: '9px', fontWeight: '700', borderRadius: '10px', padding: '1px 5px', flexShrink: 0 }}>{readyCount}</span>
                )}
                {readyCount === 0 && (
                  <span style={{ color: '#6b7280', fontSize: '11px', flexShrink: 0 }}>{theme.modules.length}</span>
                )}
              </div>
            )
          })}

          {/* Divider */}
          <div style={{ margin: '12px 16px', borderTop: '1px solid #e5e7eb' }} />

          {/* Section Profil */}
          <div style={{ padding: '4px 16px 4px', fontSize: '10px', fontWeight: '700', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>{t.profil}</div>

          <div
            style={sidebarItemStyle(view === 'dashboard')}
            onClick={() => setView('dashboard')}
            onMouseOver={e => { if (view !== 'dashboard') (e.currentTarget as HTMLElement).style.background = SIDEBAR_HOVER }}
            onMouseOut={e => { if (view !== 'dashboard') (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{ fontSize: '14px' }}>🏆</span>
            <span style={{ flex: 1 }}>{t.dashboard}</span>
            {earnedCerts.length > 0 && (
              <span style={{ background: '#e91e8c', color: 'white', fontSize: '9px', fontWeight: '700', borderRadius: '10px', padding: '1px 5px' }}>{earnedCerts.length}</span>
            )}
          </div>
        </nav>

        {/* Bottom: lang + logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {(['fr', 'en'] as const).map(l => (
              <button key={l} onClick={() => { saveLang(l); setLang(l) }}
                style={{ flex: 1, padding: '5px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', background: lang === l ? ACCENT : '#3d2410', color: lang === l ? 'white' : '#6b7280', transition: 'all 0.2s' }}>
                {l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            style={{ width: '100%', padding: '7px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#374151', cursor: 'pointer', fontSize: '11px', fontWeight: '600', transition: 'all 0.2s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.color = ACCENT }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
            {t.logout}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 28px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', flexShrink: 0 }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{user?.email}</span>
          <div style={{ width: '1px', height: '20px', background: '#e5e7eb' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4b5563' }}>
            <span style={{ fontSize: '14px' }}>🪙</span>
            <span style={{ fontWeight: '700', color: '#1f2937' }}>{totalPoints}</span>
            <span>HubCoins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', color: ACCENT }}>
            🎓 {t.ranks[rankIndex]}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

          {/* WELCOME VIEW */}
          {view === 'welcome' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px' }}>{t.welcome}</h1>
                <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>{t.welcomeSub}</p>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px', }}>
                {[
                  { value: totalModules, label: t.statTotal, icon: '📚', color: '#3b82f6' },
                  { value: readyModules, label: t.statDispo, icon: '✅', color: '#10b981' },
                  { value: THEMES.length, label: t.statThemes, icon: '🗂️', color: ACCENT },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '22px', marginBottom: '8px' }}>{s.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, marginBottom: '2px' }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: '#4b5563' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* All themes summary */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{t.allModules}</h2>
                </div>
                <div>
                  {THEMES.map((theme, ti) => {
                    const rc = theme.modules.filter(m => m.ready).length
                    return (
                      <div key={ti}
                        onClick={() => { setView('theme'); setActiveTheme(ti) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: ti < THEMES.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseOver={e => (e.currentTarget as HTMLElement).style.background = '#f9fafb'}
                        onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: \`\${theme.couleur}15\`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{theme.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937', marginBottom: '2px' }}>{theme.titre}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{theme.modules.length} {theme.modules.length > 1 ? 'modules' : 'module'}</div>
                        </div>
                        {rc > 0 ? (
                          <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '3px 10px' }}>✓ {rc} {lang === 'fr' ? 'dispo' : 'avail.'}</span>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '13px' }}>›</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* THEME VIEW */}
          {view === 'theme' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: \`\${THEMES[activeTheme].couleur}18\`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{THEMES[activeTheme].emoji}</div>
                  <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: '0 0 2px' }}>{THEMES[activeTheme].titre}</h1>
                    <p style={{ color: '#4b5563', fontSize: '13px', margin: 0 }}>
                      {THEMES[activeTheme].modules.length} {THEMES[activeTheme].modules.length > 1 ? (lang === 'fr' ? 'modules' : 'modules') : 'module'}
                      {THEMES[activeTheme].modules.filter(m => m.ready).length > 0 && (
                        <span style={{ color: '#10b981', fontWeight: '600' }}> · {THEMES[activeTheme].modules.filter(m => m.ready).length} {lang === 'fr' ? 'disponible' : 'available'}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', }}>
                {THEMES[activeTheme].modules.map((m, i) => (
                  <div key={i}
                    onClick={() => m.ready && router.push(\`/modules/\${m.slug}\`)}
                    style={{
                      background: 'white', borderRadius: '12px', padding: '18px',
                      border: m.ready ? \`1.5px solid \${THEMES[activeTheme].couleur}40\` : '1.5px solid #e5e7eb',
                      cursor: m.ready ? 'pointer' : 'default',
                      opacity: m.ready ? 1 : 0.55, position: 'relative',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                    } as React.CSSProperties}
                    onMouseOver={e => { if (m.ready) { (e.currentTarget as HTMLElement).style.borderColor = THEMES[activeTheme].couleur; (e.currentTarget as HTMLElement).style.boxShadow = \`0 4px 16px \${THEMES[activeTheme].couleur}20\`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' } }}
                    onMouseOut={e => { if (m.ready) { (e.currentTarget as HTMLElement).style.borderColor = \`\${THEMES[activeTheme].couleur}40\`; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' } }}
                  >
                    {m.ready && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: THEMES[activeTheme].couleur, color: 'white', fontSize: '9px', fontWeight: '700', borderRadius: '20px', padding: '2px 7px' }}>{t.dispo}</span>
                    )}
                    {completedModules.includes(m.slug) && (
                      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '13px' }}>✅</span>
                    )}
                    <div style={{ fontSize: '26px', marginBottom: '10px' }}>{m.icon}</div>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#1f2937', lineHeight: 1.4, marginBottom: '4px' }}>{m.title}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: m.ready ? '10px' : 0 }}>
                      {m.ready ? t.quizzes : t.soon}
                    </div>
                    {m.ready && (
                      <div style={{ background: '#f3f4f6', borderRadius: '3px', height: '3px' }}>
                        <div style={{ background: completedModules.includes(m.slug) ? '#10b981' : THEMES[activeTheme].couleur, borderRadius: '3px', height: '3px', width: completedModules.includes(m.slug) ? '100%' : '0%', transition: 'width 0.8s ease' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div style={{ }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px' }}>{t.dashboard}</h1>
                <p style={{ color: '#4b5563', fontSize: '13px', margin: 0 }}>{user?.email}</p>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: lang === 'fr' ? 'Certifications' : 'Certifications', value: String(earnedCerts.length), icon: '🏅', color: '#e91e8c' },
                  { label: t.totalScore, value: String(totalPoints), icon: '⭐', color: '#7c3aed' },
                  { label: t.rank, value: t.ranks[rankIndex], icon: '🎓', color: '#059669', small: true },
                ].map((card, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '26px', marginBottom: '8px' }}>{card.icon}</div>
                    <div style={{ fontSize: (card as any).small ? '13px' : '28px', fontWeight: '800', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                    <div style={{ fontSize: '12px', color: '#4b5563' }}>{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{t.progress}</span>
                  <span style={{ color: '#e91e8c', fontWeight: '700', fontSize: '14px' }}>{earnedCerts.length}/{Object.keys(CERTIFICATIONS).length}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg, #e91e8c, #f472b6)', height: '10px', width: \`\${(earnedCerts.length / Object.keys(CERTIFICATIONS).length) * 100}%\`, borderRadius: '8px', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Certs */}
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '14px' }}>{t.yourCerts}</h3>
              {earnedCerts.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', border: '2px dashed #e5e7eb' }}>
                  <div style={{ fontSize: '44px', marginBottom: '14px' }}>🌱</div>
                  <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '17px', margin: '0 0 8px' }}>{t.noModules}</p>
                  <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: '13px' }}>{t.noModulesDesc}</p>
                  <button onClick={() => setView('welcome')} style={{ padding: '10px 24px', background: ACCENT, border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                    {t.seeModules}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                  {earnedCerts.map(({ slug, cert }) => (
                    <div key={slug} style={{ background: 'white', borderRadius: '12px', padding: '22px', border: '1.5px solid #fce7f3', boxShadow: '0 2px 10px rgba(233,30,140,0.06)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #e91e8c, #f472b6)' }} />
                      <div style={{ fontSize: '34px', marginBottom: '10px' }}>{(cert as any).emoji}</div>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: '#1f2937', marginBottom: '4px' }}>{lang === 'fr' ? (cert as any).fr : (cert as any).en}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>{lang === 'fr' ? (cert as any).desc_fr : (cert as any).desc_en}</div>
                      <div style={{ background: '#e91e8c', color: 'white', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '700', display: 'inline-block' }}>
                        ✓ {t.earned}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* To unlock */}
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>{t.toUnlock}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
                {Object.entries(CERTIFICATIONS).filter(([slug]) => !completedModules.includes(slug)).map(([slug, cert]) => (
                  <div key={slug} style={{ background: 'white', borderRadius: '10px', padding: '12px', border: '1px solid #f3f4f6', opacity: 0.55, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '22px', filter: 'grayscale(1)', flexShrink: 0 }}>{(cert as any).emoji}</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '12px', color: '#1f2937' }}>{lang === 'fr' ? (cert as any).fr : (cert as any).en}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>🔒 {t.toUnlock}</div>
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
`;

fs.writeFileSync('app/page.tsx', tsx, 'utf8');
console.log('✅ app/page.tsx écrit avec le nouveau design GRC !');
