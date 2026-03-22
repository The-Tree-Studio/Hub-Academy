'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#6d28d9'

const UI = {
  fr: {
    title: "Politiques & Procédures — Sécurité de l’information",
    subtitle: "25 politiques de sécurité de l’information (ISO 27001) d’i-Hub",
    fiches: '25 fiches', time: '∼50 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures — Information Security",
    subtitle: "25 i-Hub information security policies (ISO 27001)",
    fiches: '25 cards', time: '∼50 min',
    start: 'Discover the documents 📚', prev: '← Previous', next: 'Next document',
    home: '← Home', ref: 'Reference', obj: '🎯 Objective', app: '👥 Applies to', res: '📝 Summary',
    fin: 'Documents reviewed!', finSub: 'You know i-Hub’s policies and procedures.',
    backHome: '← Back', restart: '🔄 Restart',
    total: 'Total',
  },
}

type Fiche = { id: number; ref: string; emoji: string; titre: string; objectif: string; applicable: string; resume: string }

const FICHES_FR: Fiche[] = [
  { id:1, ref:'POL-SEC-051', emoji:'✅', titre:"Acceptable Use Policy",
    objectif:"Définir les règles d’utilisation acceptable des ressources informationnelles",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Politique d'utilisation acceptable des actifs informationnels définissant les règles d'usage des ressources IT (ISO 27001 A.8.1.3).",
  },
  { id:2, ref:'POL-SEC-052', emoji:'🔓', titre:"Access Control Policy",
    objectif:"Encadrer la gestion des droits d’accès aux systèmes et données",
    applicable:"IT, Sécurité, managers, tous les utilisateurs",
    resume:"Politique de contrôle d'accès définissant les principes de gestion des droits d'accès logiques aux systèmes et données (ISO 27001 A.9.1.1).",
  },
  { id:3, ref:'POL-SEC-053', emoji:'📋', titre:"Asset management Policy",
    objectif:"Assurer l’inventaire, la classification et la protection des actifs informationnels",
    applicable:"IT, Sécurité, responsables d’actifs",
    resume:"Politique de gestion des actifs informationnels couvrant l'inventaire, la classification et la responsabilité des actifs (ISO 27001 A.8).",
  },
  { id:4, ref:'POL-SEC-054', emoji:'🎓', titre:"Awareness Program Plan",
    objectif:"Planifier et exécuter le programme annuel de sensibilisation à la sécurité",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Plan du programme annuel de sensibilisation à la sécurité de l'information, incluant les thèmes, publics cibles et calendrier.",
  },
  { id:5, ref:'POL-SEC-055', emoji:'🎓', titre:"Awareness Program_New Joiner",
    objectif:"Sensibiliser dès l’arrivée les nouveaux collaborateurs aux enjeux sécurité",
    applicable:"Tous les nouveaux collaborateurs",
    resume:"Module de sensibilisation à la sécurité de l'information destiné spécifiquement aux nouveaux collaborateurs lors de leur intégration.",
  },
  { id:6, ref:'POL-SEC-056', emoji:'🔐', titre:"Cryptographic (Encryption) Policy",
    objectif:"Encadrer l’usage de la cryptographie pour protéger les données sensibles",
    applicable:"IT, Sécurité, développeurs, administrateurs",
    resume:"Politique d'utilisation de la cryptographie et du chiffrement pour protéger la confidentialité et l'intégrité des données (ISO 27001 A.10.1.1).",
  },
  { id:7, ref:'POL-SEC-057', emoji:'🛡️', titre:"Information and Security Policy",
    objectif:"Établir la politique générale de sécurité de l’information du SMSI",
    applicable:"Toute l’organisation i-Hub",
    resume:"Politique générale de sécurité de l'information approuvée par la direction, document de référence du SMSI (ISO 27001 §5.2).",
  },
  { id:8, ref:'POL-SEC-058', emoji:'🏷️', titre:"Information Classification Policy",
    objectif:"Définir les niveaux de classification et règles de manipulation de l’information",
    applicable:"Tous les collaborateurs manipulant de l’information",
    resume:"Politique de classification de l'information définissant les niveaux de sensibilité et les règles de traitement associées (ISO 27001 A.8.2.1).",
  },
  { id:9, ref:'POL-SEC-059', emoji:'👥', titre:"Information security roles and responsibilities",
    objectif:"Clarifier l’organisation et les responsabilités en matière de sécurité",
    applicable:"Direction, CISO, responsables sécurité",
    resume:"Document définissant les rôles, responsabilités et l'organisation de la sécurité de l'information au sein de l'entreprise (ISO 27001 A.6.1.1).",
  },
  { id:10, ref:'POL-SEC-060', emoji:'🏠', titre:"Mobile Device and Teleworking Policy",
    objectif:"Encadrer la sécurité des appareils mobiles et du travail à distance",
    applicable:"Collaborateurs utilisant appareils mobiles ou en télétravail",
    resume:"Politique encadrant l'usage des appareils mobiles et le télétravail du point de vue de la sécurité de l'information (ISO 27001 A.6).",
  },
  { id:11, ref:'POL-SEC-061', emoji:'🌐', titre:"Network Security Management",
    objectif:"Assurer la sécurité, la surveillance et la segmentation du réseau",
    applicable:"IT, Sécurité, administrateurs réseau",
    resume:"Politique et procédures de gestion de la sécurité réseau, incluant la segmentation, le filtrage et la surveillance (ISO 27001 A.13).",
  },
  { id:12, ref:'POL-SEC-062', emoji:'💬', titre:"Operating Procedures for Information and Communication",
    objectif:"Documenter les procédures opérationnelles sécurisées pour les systèmes d’information",
    applicable:"Équipes IT et opérations",
    resume:"Procédures opérationnelles documentées pour l'exploitation sécurisée des systèmes d'information et de communication.",
  },
  { id:13, ref:'POL-SEC-064', emoji:'🔑', titre:"Password Policy",
    objectif:"Imposer des règles robustes de gestion des mots de passe",
    applicable:"Tous les utilisateurs des systèmes i-Hub",
    resume:"Politique de gestion des mots de passe définissant les règles de complexité, de rotation et de stockage sécurisé (ISO 27001 A.9.2.1).",
  },
  { id:14, ref:'POL-SEC-065', emoji:'📊', titre:"Performance Evaluation",
    objectif:"Évaluer les performances du SMSI et assurer l’amélioration continue",
    applicable:"CISO, direction, auditeurs internes",
    resume:"Procédure d'évaluation des performances du SMSI incluant les audits internes, la revue de direction et les indicateurs clés (ISO 27001 §9).",
  },
  { id:15, ref:'POL-SEC-066', emoji:'🏢', titre:"Physical and environmental security",
    objectif:"Protéger les locaux, équipements et zones sensibles d’i-Hub",
    applicable:"IT, Sécurité, facility management",
    resume:"Politique de sécurité physique et environnementale protégeant les locaux, équipements et zones sensibles (ISO 27001 A.11).",
  },
  { id:16, ref:'POL-SEC-067', emoji:'🚀', titre:"Release Management Policy",
    objectif:"Sécuriser le processus de mise en production des développements",
    applicable:"IT, Sécurité, équipe Produits, développeurs",
    resume:"Politique de gestion des mises en production intégrant la sécurité dans le cycle de développement et de déploiement (ISO 27001 A.14).",
  },
  { id:17, ref:'POL-SEC-068', emoji:'💻', titre:"Security Development Methodology Policy",
    objectif:"Intégrer la sécurité dans tout le cycle de développement logiciel",
    applicable:"Développeurs, équipe Produits, Sécurité",
    resume:"Méthodologie de développement sécurisé (SSDLC) intégrant les exigences de sécurité dès la conception des applications (ISO 27001 A.14).",
  },
  { id:18, ref:'POL-SEC-069', emoji:'🚨', titre:"Service Managed Security Incident Management Policy",
    objectif:"Encadrer la gestion des incidents de sécurité via le SOC externalisé",
    applicable:"SOC externalisé, Sécurité, IT, direction",
    resume:"Politique de gestion des incidents de sécurité via un SOC externalisé, incluant les SLA et procédures d'escalade (ISO 27001).",
  },
  { id:19, ref:'POL-SEC-070', emoji:'🤝', titre:"Supplier Security",
    objectif:"Imposer des exigences de sécurité contractuelles aux fournisseurs",
    applicable:"Sécurité, Outsourcing Officer, Compliance",
    resume:"Politique de sécurité fournisseurs définissant les exigences contractuelles et les contrôles applicables aux prestataires tiers (ISO 27001 A.15.1.1).",
  },
  { id:20, ref:'POL-SEC-071', emoji:'🕵️', titre:"Technical Vulnerability Management",
    objectif:"Gérer proactivement les vulnérabilités techniques des systèmes",
    applicable:"IT, Sécurité, administrateurs systèmes",
    resume:"Procédure de gestion des vulnérabilités techniques incluant la veille, l'évaluation des risques, les correctifs et le suivi (ISO 27001 A.12.6).",
  },
  { id:21, ref:'POL-SEC-072', emoji:'📱', titre:"Bring Your Own Device Policy",
    objectif:"Encadrer l’usage des appareils personnels dans le contexte professionnel",
    applicable:"Collaborateurs utilisant des appareils personnels",
    resume:"Politique encadrant l'utilisation des appareils personnels (BYOD) dans le cadre professionnel, définissant les règles d'accès aux systèmes d'i-Hub, les mesures de sécurité requises et les responsabilités des utilisateurs. (ISO 27001 A.6.2.1)",
  },
  { id:22, ref:'POL-SEC-073', emoji:'👤', titre:"Human Resource Security Policy",
    objectif:"Définir les obligations de sécurité RH tout au long de la relation de travail",
    applicable:"RH, Sécurité, managers, tous les collaborateurs",
    resume:"Politique définissant les obligations de sécurité applicables aux ressources humaines avant, pendant et après la relation de travail, incluant la vérification des antécédents, la sensibilisation et les mesures de départ. (ISO 27001 A.7.1)",
  },
  { id:23, ref:'POL-SEC-074', emoji:'💾', titre:"Information backup and restore Policy",
    objectif:"Garantir la disponibilité et l’intégrité des données par des sauvegardes régulières",
    applicable:"IT, Sécurité, administrateurs systèmes",
    resume:"Politique définissant les règles et procédures de sauvegarde et de restauration des informations d'i-Hub, garantissant la disponibilité et l'intégrité des données en cas d'incident. (ISO 27001 A.12.3.1)",
  },
  { id:24, ref:'POL-SEC-075', emoji:'📤', titre:"Information Transfer Policy",
    objectif:"Encadrer les transferts d’information sécurisés avec les tiers",
    applicable:"Tous les collaborateurs échangeant des informations",
    resume:"Politique encadrant les règles et procédures relatives au transfert d'informations entre i-Hub et les parties externes (clients, prestataires, partenaires), incluant les exigences de sécurité et de confidentialité.",
  },
  { id:25, ref:'POL-SEC-076', emoji:'🔧', titre:"System Acquisition, Development and Maintenance Policy",
    objectif:"Intégrer la sécurité dans l’acquisition, développement et maintenance des systèmes",
    applicable:"IT, Sécurité, équipe Produits, développeurs",
    resume:"Politique définissant les exigences de sécurité applicables tout au long du cycle de vie des systèmes d'information, de leur acquisition à leur maintenance, conformément à l'annexe A.14 de la norme ISO 27001.",
  },
]

const FICHES_EN: Fiche[] = [
  { id:1, ref:'POL-SEC-051', emoji:'✅', titre:"Acceptable Use Policy",
    objectif:"Define acceptable use rules for informational resources",
    applicable:"All i-Hub employees",
    resume:"Acceptable use policy for information assets, defining rules for employee use of IT resources (ISO 27001 A.8.1.3).",
  },
  { id:2, ref:'POL-SEC-052', emoji:'🔓', titre:"Access Control Policy",
    objectif:"Govern the management of access rights to systems and data",
    applicable:"IT, Security, managers, all users",
    resume:"Access control policy defining the principles for managing logical access rights to systems and data (ISO 27001 A.9.1.1).",
  },
  { id:3, ref:'POL-SEC-053', emoji:'📋', titre:"Asset management Policy",
    objectif:"Ensure inventory, classification and protection of information assets",
    applicable:"IT, Security, asset owners",
    resume:"Information asset management policy covering inventory, classification and ownership of assets (ISO 27001 A.8).",
  },
  { id:4, ref:'POL-SEC-054', emoji:'🎓', titre:"Awareness Program Plan",
    objectif:"Plan and execute the annual security awareness programme",
    applicable:"All i-Hub employees",
    resume:"Annual information security awareness programme plan, including topics, target audiences and schedule.",
  },
  { id:5, ref:'POL-SEC-055', emoji:'🎓', titre:"Awareness Program_New Joiner",
    objectif:"Raise new joiners’ security awareness from day one",
    applicable:"All new joiners",
    resume:"Information security awareness module specifically designed for new joiners during their onboarding.",
  },
  { id:6, ref:'POL-SEC-056', emoji:'🔐', titre:"Cryptographic (Encryption) Policy",
    objectif:"Govern the use of cryptography to protect sensitive data",
    applicable:"IT, Security, developers, administrators",
    resume:"Policy on the use of cryptography and encryption to protect the confidentiality and integrity of data (ISO 27001 A.10.1.1).",
  },
  { id:7, ref:'POL-SEC-057', emoji:'🛡️', titre:"Information and Security Policy",
    objectif:"Establish the general information security policy of the ISMS",
    applicable:"The entire i-Hub organisation",
    resume:"General information security policy approved by management, serving as the ISMS reference document (ISO 27001 §5.2).",
  },
  { id:8, ref:'POL-SEC-058', emoji:'🏷️', titre:"Information Classification Policy",
    objectif:"Define information classification levels and handling rules",
    applicable:"All employees handling information",
    resume:"Information classification policy defining sensitivity levels and associated handling rules (ISO 27001 A.8.2.1).",
  },
  { id:9, ref:'POL-SEC-059', emoji:'👥', titre:"Information security roles and responsibilities",
    objectif:"Clarify the organisation and responsibilities in information security",
    applicable:"Management, CISO, security managers",
    resume:"Document defining roles, responsibilities and the organisational structure for information security (ISO 27001 A.6.1.1).",
  },
  { id:10, ref:'POL-SEC-060', emoji:'🏠', titre:"Mobile Device and Teleworking Policy",
    objectif:"Govern the security of mobile devices and remote working",
    applicable:"Employees using mobile devices or working remotely",
    resume:"Policy governing the use of mobile devices and teleworking from an information security perspective (ISO 27001 A.6).",
  },
  { id:11, ref:'POL-SEC-061', emoji:'🌐', titre:"Network Security Management",
    objectif:"Ensure network security, monitoring and segmentation",
    applicable:"IT, Security, network administrators",
    resume:"Network security management policy and procedures, including segmentation, filtering and monitoring (ISO 27001 A.13).",
  },
  { id:12, ref:'POL-SEC-062', emoji:'💬', titre:"Operating Procedures for Information and Communication",
    objectif:"Document secure operational procedures for information systems",
    applicable:"IT and operations teams",
    resume:"Documented operational procedures for the secure operation of information and communication systems.",
  },
  { id:13, ref:'POL-SEC-064', emoji:'🔑', titre:"Password Policy",
    objectif:"Impose robust password management rules",
    applicable:"All i-Hub system users",
    resume:"Password management policy defining complexity, rotation and secure storage requirements (ISO 27001 A.9.2.1).",
  },
  { id:14, ref:'POL-SEC-065', emoji:'📊', titre:"Performance Evaluation",
    objectif:"Evaluate ISMS performance and ensure continuous improvement",
    applicable:"CISO, management, internal auditors",
    resume:"ISMS performance evaluation procedure including internal audits, management review and key indicators (ISO 27001 §9).",
  },
  { id:15, ref:'POL-SEC-066', emoji:'🏢', titre:"Physical and environmental security",
    objectif:"Protect i-Hub’s premises, equipment and sensitive areas",
    applicable:"IT, Security, facility management",
    resume:"Physical and environmental security policy protecting premises, equipment and sensitive areas (ISO 27001 A.11).",
  },
  { id:16, ref:'POL-SEC-067', emoji:'🚀', titre:"Release Management Policy",
    objectif:"Secure the release management process for developments",
    applicable:"IT, Security, Products team, developers",
    resume:"Release management policy integrating security into the development and deployment lifecycle (ISO 27001 A.14).",
  },
  { id:17, ref:'POL-SEC-068', emoji:'💻', titre:"Security Development Methodology Policy",
    objectif:"Integrate security throughout the software development lifecycle",
    applicable:"Developers, Products team, Security",
    resume:"Secure software development methodology (SSDLC) integrating security requirements from the design phase (ISO 27001 A.14).",
  },
  { id:18, ref:'POL-SEC-069', emoji:'🚨', titre:"Service Managed Security Incident Management Policy",
    objectif:"Govern security incident management through the outsourced SOC",
    applicable:"Outsourced SOC, Security, IT, management",
    resume:"Managed security incident management policy for outsourced SOC services, including SLAs and escalation procedures.",
  },
  { id:19, ref:'POL-SEC-070', emoji:'🤝', titre:"Supplier Security",
    objectif:"Impose contractual security requirements on suppliers",
    applicable:"Security, Outsourcing Officer, Compliance",
    resume:"Supplier security policy defining contractual security requirements and controls applicable to third parties (ISO 27001 A.15.1.1).",
  },
  { id:20, ref:'POL-SEC-071', emoji:'🕵️', titre:"Technical Vulnerability Management",
    objectif:"Proactively manage technical vulnerabilities in systems",
    applicable:"IT, Security, system administrators",
    resume:"Technical vulnerability management procedure covering monitoring, risk assessment, patching and follow-up (ISO 27001 A.12.6).",
  },
  { id:21, ref:'POL-SEC-072', emoji:'📱', titre:"Bring Your Own Device Policy",
    objectif:"Govern the use of personal devices in a professional context",
    applicable:"Employees using personal devices",
    resume:"Policy governing the use of personal devices (BYOD) in a professional context, defining access rules to i-Hub systems, required security measures and user responsibilities. (ISO 27001 A.6.2.1)",
  },
  { id:22, ref:'POL-SEC-073', emoji:'👤', titre:"Human Resource Security Policy",
    objectif:"Define HR security obligations throughout the employment relationship",
    applicable:"HR, Security, managers, all employees",
    resume:"Policy defining security obligations applicable to human resources before, during and after the employment relationship, including background checks, awareness and offboarding measures. (ISO 27001 A.7.1)",
  },
  { id:23, ref:'POL-SEC-074', emoji:'💾', titre:"Information backup and restore Policy",
    objectif:"Ensure data availability and integrity through regular backups",
    applicable:"IT, Security, system administrators",
    resume:"Policy defining the rules and procedures for backing up and restoring i-Hub information, ensuring data availability and integrity in the event of an incident. (ISO 27001 A.12.3.1)",
  },
  { id:24, ref:'POL-SEC-075', emoji:'📤', titre:"Information Transfer Policy",
    objectif:"Govern secure information transfers with third parties",
    applicable:"All employees exchanging information",
    resume:"Policy governing the rules and procedures for transferring information between i-Hub and external parties (clients, service providers, partners), including security and confidentiality requirements.",
  },
  { id:25, ref:'POL-SEC-076', emoji:'🔧', titre:"System Acquisition, Development and Maintenance Policy",
    objectif:"Integrate security into system acquisition, development and maintenance",
    applicable:"IT, Security, Products team, developers",
    resume:"Policy defining security requirements applicable throughout the information system lifecycle, from acquisition to maintenance, in accordance with ISO 27001 Annex A.14.",
  },
]

export default function ModulePolSEC() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'fin'>('intro')
  const [idx, setIdx] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setIdx(0) }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }

  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={() => router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{'fr'===lang ? '← Accueil' : '← Home'}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>🔒 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{'fr'===l?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔒</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{'fr'===lang ? "Politiques & Procédures — Sécurité de l’information" : "Policies & Procedures — Information Security"}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{'fr'===lang ? "25 politiques de sécurité de l’information (ISO 27001) d’i-Hub" : "25 i-Hub information security policies (ISO 27001)"}</p>
        <div style={{background:'white',border:`1px solid ${C}30`,borderRadius:'16px',padding:'20px',marginBottom:'28px'}}>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            {[{icon:'📜',label:t.fiches},{icon:'⏱️',label:t.time}].map((b,i) => <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px 20px',display:'flex',alignItems:'center',gap:'8px',fontSize:'15px',color:'#374151'}}><span>{b.icon}</span><span>{b.label}</span></div>)}
          </div>
        </div>
        <div style={{background:`${C}10`,border:`1px solid ${C}30`,borderRadius:'12px',padding:'16px',marginBottom:'28px',fontSize:'14px',color:'#374151'}}>
          💡 {'fr'===lang ? 'Chaque fiche présente : référence, objectif, destinataires et résumé.' : 'Each card shows: the official reference, objective, audience and a summary.'}
        </div>
        <button onClick={() => setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{'fr'===lang ? 'Découvrir les documents 📚' : 'Discover the documents 📚'}</button>
      </div>
    </div>
  )

  if (phase === 'fiches') {
    const fiche = FICHES[idx]
    const progress = ((idx+1)/FICHES.length)*100
    return (
      <div style={{...base}}>
        <NavBar />
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${progress}%`,transition:'width 0.4s',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'720px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'DOCUMENT':'DOCUMENT'} {idx+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'260px'}}>
              {FICHES.map((_,i) => <div key={i} onClick={()=>setIdx(i)} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===idx?C:i<idx?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:`2px solid ${C}30`,boxShadow:`0 8px 40px ${C}12`}}>
            <div style={{background:C,padding:'24px 28px',display:'flex',alignItems:'center',gap:'16px'}}>
              <span style={{fontSize:'44px'}}>📜</span>
              <div style={{flex:1}}>
                <p style={{margin:'0 0 4px',color:'rgba(255,255,255,0.75)',fontSize:'12px',fontWeight:'600',letterSpacing:'1px'}}>{'fr'===lang ? 'RÉFÉRENCE' : 'REFERENCE'} : {fiche.ref}</p>
                <h2 style={{color:'white',fontSize:'19px',fontWeight:'800',margin:0,lineHeight:1.3}}>📜 {fiche.titre}</h2>
              </div>
            </div>
            <div style={{padding:'24px 28px',display:'flex',flexDirection:'column',gap:'18px'}}>
              <div style={{background:`${C}08`,border:`1px solid ${C}25`,borderRadius:'12px',padding:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'800',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>🎯 {lang==='fr'?'Objectif':'Objective'}</p>
                <p style={{margin:0,fontSize:'15px',color:'#374151',lineHeight:1.6,fontWeight:'600'}}>{fiche.objectif}</p>
              </div>
              <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'12px',padding:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'800',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px'}}>👥 {lang==='fr'?'Applicable à':'Applies to'}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',lineHeight:1.5}}>{fiche.applicable}</p>
              </div>
              <div style={{background:'#fafafa',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'800',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px'}}>📝 {lang==='fr'?'Résumé':'Summary'}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',lineHeight:1.65}}>{fiche.resume}</p>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            {idx > 0 && <button onClick={()=>setIdx(i=>i-1)} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>{'fr'===lang?'← Précédent':'← Previous'}</button>}
            <button onClick={()=>idx<FICHES.length-1?setIdx(i=>i+1):setPhase('fin')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {idx<FICHES.length-1 ? `${lang==='fr'?'Document suivant':'Next document'} (${idx+2}/${FICHES.length}) →` : (lang==='fr'?'Terminer ✔':'Complete ✔')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'560px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'16px'}}>🏆</div>
        <h2 style={{fontSize:'26px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{'fr'===lang?'Documents consultés !':'Documents reviewed!'}</h2>
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{'fr'===lang ? "25 politiques de sécurité de l’information (ISO 27001) d’i-Hub" : "25 i-Hub information security policies (ISO 27001)"}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>25</div>
          <p style={{color:'#6b7280',margin:0,fontSize:'14px'}}>{'fr'===lang?'documents passés en revue':'documents reviewed'}</p>
        </div>
        <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
          <button onClick={()=>router.back()} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{'fr'===lang?'← Retour':'← Back'}</button>
          <button onClick={()=>{setPhase('intro');setIdx(0)}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{'fr'===lang?'🔄 Recommencer':'🔄 Restart'}</button>
        </div>
      </div>
    </div>
  )
}
