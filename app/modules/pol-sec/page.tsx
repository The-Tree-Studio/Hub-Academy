'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#6d28d9'

const UI = {
  fr: {
    title: "Politiques & Proc\u00e9dures \u2014 S\u00e9curit\u00e9 de l\u2019information",
    subtitle: "25 politiques de s\u00e9curit\u00e9 de l\u2019information (ISO 27001) d\u2019i-Hub",
    fiches: '25 fiches', time: '∼50 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures \u2014 Information Security",
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
    objectif:"D\u00e9finir les r\u00e8gles d\u2019utilisation acceptable des ressources informationnelles",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Politique d'utilisation acceptable des actifs informationnels d\u00e9finissant les r\u00e8gles d'usage des ressources IT (ISO 27001 A.8.1.3).",
  },
  { id:2, ref:'POL-SEC-052', emoji:'🔓', titre:"Access Control Policy",
    objectif:"Encadrer la gestion des droits d\u2019acc\u00e8s aux syst\u00e8mes et donn\u00e9es",
    applicable:"IT, S\u00e9curit\u00e9, managers, tous les utilisateurs",
    resume:"Politique de contr\u00f4le d'acc\u00e8s d\u00e9finissant les principes de gestion des droits d'acc\u00e8s logiques aux syst\u00e8mes et donn\u00e9es (ISO 27001 A.9.1.1).",
  },
  { id:3, ref:'POL-SEC-053', emoji:'📋', titre:"Asset management Policy",
    objectif:"Assurer l\u2019inventaire, la classification et la protection des actifs informationnels",
    applicable:"IT, S\u00e9curit\u00e9, responsables d\u2019actifs",
    resume:"Politique de gestion des actifs informationnels couvrant l'inventaire, la classification et la responsabilit\u00e9 des actifs (ISO 27001 A.8).",
  },
  { id:4, ref:'POL-SEC-054', emoji:'🎓', titre:"Awareness Program Plan",
    objectif:"Planifier et ex\u00e9cuter le programme annuel de sensibilisation \u00e0 la s\u00e9curit\u00e9",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Plan du programme annuel de sensibilisation \u00e0 la s\u00e9curit\u00e9 de l'information, incluant les th\u00e8mes, publics cibles et calendrier.",
  },
  { id:5, ref:'POL-SEC-055', emoji:'🎓', titre:"Awareness Program_New Joiner",
    objectif:"Sensibiliser d\u00e8s l\u2019arriv\u00e9e les nouveaux collaborateurs aux enjeux s\u00e9curit\u00e9",
    applicable:"Tous les nouveaux collaborateurs",
    resume:"Module de sensibilisation \u00e0 la s\u00e9curit\u00e9 de l'information destin\u00e9 sp\u00e9cifiquement aux nouveaux collaborateurs lors de leur int\u00e9gration.",
  },
  { id:6, ref:'POL-SEC-056', emoji:'🔐', titre:"Cryptographic (Encryption) Policy",
    objectif:"Encadrer l\u2019usage de la cryptographie pour prot\u00e9ger les donn\u00e9es sensibles",
    applicable:"IT, S\u00e9curit\u00e9, d\u00e9veloppeurs, administrateurs",
    resume:"Politique d'utilisation de la cryptographie et du chiffrement pour prot\u00e9ger la confidentialit\u00e9 et l'int\u00e9grit\u00e9 des donn\u00e9es (ISO 27001 A.10.1.1).",
  },
  { id:7, ref:'POL-SEC-057', emoji:'🛡️', titre:"Information and Security Policy",
    objectif:"\u00c9tablir la politique g\u00e9n\u00e9rale de s\u00e9curit\u00e9 de l\u2019information du SMSI",
    applicable:"Toute l\u2019organisation i-Hub",
    resume:"Politique g\u00e9n\u00e9rale de s\u00e9curit\u00e9 de l'information approuv\u00e9e par la direction, document de r\u00e9f\u00e9rence du SMSI (ISO 27001 \u00a75.2).",
  },
  { id:8, ref:'POL-SEC-058', emoji:'🏷️', titre:"Information Classification Policy",
    objectif:"D\u00e9finir les niveaux de classification et r\u00e8gles de manipulation de l\u2019information",
    applicable:"Tous les collaborateurs manipulant de l\u2019information",
    resume:"Politique de classification de l'information d\u00e9finissant les niveaux de sensibilit\u00e9 et les r\u00e8gles de traitement associ\u00e9es (ISO 27001 A.8.2.1).",
  },
  { id:9, ref:'POL-SEC-059', emoji:'👥', titre:"Information security roles and responsibilities",
    objectif:"Clarifier l\u2019organisation et les responsabilit\u00e9s en mati\u00e8re de s\u00e9curit\u00e9",
    applicable:"Direction, CISO, responsables s\u00e9curit\u00e9",
    resume:"Document d\u00e9finissant les r\u00f4les, responsabilit\u00e9s et l'organisation de la s\u00e9curit\u00e9 de l'information au sein de l'entreprise (ISO 27001 A.6.1.1).",
  },
  { id:10, ref:'POL-SEC-060', emoji:'🏠', titre:"Mobile Device and Teleworking Policy",
    objectif:"Encadrer la s\u00e9curit\u00e9 des appareils mobiles et du travail \u00e0 distance",
    applicable:"Collaborateurs utilisant appareils mobiles ou en t\u00e9l\u00e9travail",
    resume:"Politique encadrant l'usage des appareils mobiles et le t\u00e9l\u00e9travail du point de vue de la s\u00e9curit\u00e9 de l'information (ISO 27001 A.6).",
  },
  { id:11, ref:'POL-SEC-061', emoji:'🌐', titre:"Network Security Management",
    objectif:"Assurer la s\u00e9curit\u00e9, la surveillance et la segmentation du r\u00e9seau",
    applicable:"IT, S\u00e9curit\u00e9, administrateurs r\u00e9seau",
    resume:"Politique et proc\u00e9dures de gestion de la s\u00e9curit\u00e9 r\u00e9seau, incluant la segmentation, le filtrage et la surveillance (ISO 27001 A.13).",
  },
  { id:12, ref:'POL-SEC-062', emoji:'💬', titre:"Operating Procedures for Information and Communication",
    objectif:"Documenter les proc\u00e9dures op\u00e9rationnelles s\u00e9curis\u00e9es pour les syst\u00e8mes d\u2019information",
    applicable:"\u00c9quipes IT et op\u00e9rations",
    resume:"Proc\u00e9dures op\u00e9rationnelles document\u00e9es pour l'exploitation s\u00e9curis\u00e9e des syst\u00e8mes d'information et de communication.",
  },
  { id:13, ref:'POL-SEC-064', emoji:'🔑', titre:"Password Policy",
    objectif:"Imposer des r\u00e8gles robustes de gestion des mots de passe",
    applicable:"Tous les utilisateurs des syst\u00e8mes i-Hub",
    resume:"Politique de gestion des mots de passe d\u00e9finissant les r\u00e8gles de complexit\u00e9, de rotation et de stockage s\u00e9curis\u00e9 (ISO 27001 A.9.2.1).",
  },
  { id:14, ref:'POL-SEC-065', emoji:'📊', titre:"Performance Evaluation",
    objectif:"\u00c9valuer les performances du SMSI et assurer l\u2019am\u00e9lioration continue",
    applicable:"CISO, direction, auditeurs internes",
    resume:"Proc\u00e9dure d'\u00e9valuation des performances du SMSI incluant les audits internes, la revue de direction et les indicateurs cl\u00e9s (ISO 27001 \u00a79).",
  },
  { id:15, ref:'POL-SEC-066', emoji:'🏢', titre:"Physical and environmental security",
    objectif:"Prot\u00e9ger les locaux, \u00e9quipements et zones sensibles d\u2019i-Hub",
    applicable:"IT, S\u00e9curit\u00e9, facility management",
    resume:"Politique de s\u00e9curit\u00e9 physique et environnementale prot\u00e9geant les locaux, \u00e9quipements et zones sensibles (ISO 27001 A.11).",
  },
  { id:16, ref:'POL-SEC-067', emoji:'🚀', titre:"Release Management Policy",
    objectif:"S\u00e9curiser le processus de mise en production des d\u00e9veloppements",
    applicable:"IT, S\u00e9curit\u00e9, \u00e9quipe Produits, d\u00e9veloppeurs",
    resume:"Politique de gestion des mises en production int\u00e9grant la s\u00e9curit\u00e9 dans le cycle de d\u00e9veloppement et de d\u00e9ploiement (ISO 27001 A.14).",
  },
  { id:17, ref:'POL-SEC-068', emoji:'💻', titre:"Security Development Methodology Policy",
    objectif:"Int\u00e9grer la s\u00e9curit\u00e9 dans tout le cycle de d\u00e9veloppement logiciel",
    applicable:"D\u00e9veloppeurs, \u00e9quipe Produits, S\u00e9curit\u00e9",
    resume:"M\u00e9thodologie de d\u00e9veloppement s\u00e9curis\u00e9 (SSDLC) int\u00e9grant les exigences de s\u00e9curit\u00e9 d\u00e8s la conception des applications (ISO 27001 A.14).",
  },
  { id:18, ref:'POL-SEC-069', emoji:'🚨', titre:"Service Managed Security Incident Management Policy",
    objectif:"Encadrer la gestion des incidents de s\u00e9curit\u00e9 via le SOC externalis\u00e9",
    applicable:"SOC externalis\u00e9, S\u00e9curit\u00e9, IT, direction",
    resume:"Politique de gestion des incidents de s\u00e9curit\u00e9 via un SOC externalis\u00e9, incluant les SLA et proc\u00e9dures d'escalade (ISO 27001).",
  },
  { id:19, ref:'POL-SEC-070', emoji:'🤝', titre:"Supplier Security",
    objectif:"Imposer des exigences de s\u00e9curit\u00e9 contractuelles aux fournisseurs",
    applicable:"S\u00e9curit\u00e9, Outsourcing Officer, Compliance",
    resume:"Politique de s\u00e9curit\u00e9 fournisseurs d\u00e9finissant les exigences contractuelles et les contr\u00f4les applicables aux prestataires tiers (ISO 27001 A.15.1.1).",
  },
  { id:20, ref:'POL-SEC-071', emoji:'🕵️', titre:"Technical Vulnerability Management",
    objectif:"G\u00e9rer proactivement les vuln\u00e9rabilit\u00e9s techniques des syst\u00e8mes",
    applicable:"IT, S\u00e9curit\u00e9, administrateurs syst\u00e8mes",
    resume:"Proc\u00e9dure de gestion des vuln\u00e9rabilit\u00e9s techniques incluant la veille, l'\u00e9valuation des risques, les correctifs et le suivi (ISO 27001 A.12.6).",
  },
  { id:21, ref:'POL-SEC-072', emoji:'📱', titre:"Bring Your Own Device Policy",
    objectif:"Encadrer l\u2019usage des appareils personnels dans le contexte professionnel",
    applicable:"Collaborateurs utilisant des appareils personnels",
    resume:"Politique encadrant l'utilisation des appareils personnels (BYOD) dans le cadre professionnel, d\u00e9finissant les r\u00e8gles d'acc\u00e8s aux syst\u00e8mes d'i-Hub, les mesures de s\u00e9curit\u00e9 requises et les responsabilit\u00e9s des utilisateurs. (ISO 27001 A.6.2.1)",
  },
  { id:22, ref:'POL-SEC-073', emoji:'👤', titre:"Human Resource Security Policy",
    objectif:"D\u00e9finir les obligations de s\u00e9curit\u00e9 RH tout au long de la relation de travail",
    applicable:"RH, S\u00e9curit\u00e9, managers, tous les collaborateurs",
    resume:"Politique d\u00e9finissant les obligations de s\u00e9curit\u00e9 applicables aux ressources humaines avant, pendant et apr\u00e8s la relation de travail, incluant la v\u00e9rification des ant\u00e9c\u00e9dents, la sensibilisation et les mesures de d\u00e9part. (ISO 27001 A.7.1)",
  },
  { id:23, ref:'POL-SEC-074', emoji:'💾', titre:"Information backup and restore Policy",
    objectif:"Garantir la disponibilit\u00e9 et l\u2019int\u00e9grit\u00e9 des donn\u00e9es par des sauvegardes r\u00e9guli\u00e8res",
    applicable:"IT, S\u00e9curit\u00e9, administrateurs syst\u00e8mes",
    resume:"Politique d\u00e9finissant les r\u00e8gles et proc\u00e9dures de sauvegarde et de restauration des informations d'i-Hub, garantissant la disponibilit\u00e9 et l'int\u00e9grit\u00e9 des donn\u00e9es en cas d'incident. (ISO 27001 A.12.3.1)",
  },
  { id:24, ref:'POL-SEC-075', emoji:'📤', titre:"Information Transfer Policy",
    objectif:"Encadrer les transferts d\u2019information s\u00e9curis\u00e9s avec les tiers",
    applicable:"Tous les collaborateurs \u00e9changeant des informations",
    resume:"Politique encadrant les r\u00e8gles et proc\u00e9dures relatives au transfert d'informations entre i-Hub et les parties externes (clients, prestataires, partenaires), incluant les exigences de s\u00e9curit\u00e9 et de confidentialit\u00e9.",
  },
  { id:25, ref:'POL-SEC-076', emoji:'🔧', titre:"System Acquisition, Development and Maintenance Policy",
    objectif:"Int\u00e9grer la s\u00e9curit\u00e9 dans l\u2019acquisition, d\u00e9veloppement et maintenance des syst\u00e8mes",
    applicable:"IT, S\u00e9curit\u00e9, \u00e9quipe Produits, d\u00e9veloppeurs",
    resume:"Politique d\u00e9finissant les exigences de s\u00e9curit\u00e9 applicables tout au long du cycle de vie des syst\u00e8mes d'information, de leur acquisition \u00e0 leur maintenance, conform\u00e9ment \u00e0 l'annexe A.14 de la norme ISO 27001.",
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
    objectif:"Raise new joiners\u2019 security awareness from day one",
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
    resume:"General information security policy approved by management, serving as the ISMS reference document (ISO 27001 \u00a75.2).",
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
    resume:"ISMS performance evaluation procedure including internal audits, management review and key indicators (ISO 27001 \u00a79).",
  },
  { id:15, ref:'POL-SEC-066', emoji:'🏢', titre:"Physical and environmental security",
    objectif:"Protect i-Hub\u2019s premises, equipment and sensitive areas",
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
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{{'fr'===lang ? "Politiques & Proc\u00e9dures \u2014 S\u00e9curit\u00e9 de l\u2019information" : "Policies & Procedures \u2014 Information Security"}}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{{'fr'===lang ? "25 politiques de s\u00e9curit\u00e9 de l\u2019information (ISO 27001) d\u2019i-Hub" : "25 i-Hub information security policies (ISO 27001)"}}</p>
        <div style={{background:'white',border:`1px solid ${C}30`,borderRadius:'16px',padding:'20px',marginBottom:'28px'}}>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            {[{icon:'📜',label:t.fiches},{icon:'⏱️',label:t.time}].map((b,i) => <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px 20px',display:'flex',alignItems:'center',gap:'8px',fontSize:'15px',color:'#374151'}}><span>{b.icon}</span><span>{b.label}</span></div>)}
          </div>
        </div>
        <div style={{background:`${C}10`,border:`1px solid ${C}30`,borderRadius:'12px',padding:'16px',marginBottom:'28px',fontSize:'14px',color:'#374151'}}>
          💡 {'fr'===lang ? 'Chaque fiche présente : référence, objectif, destinataires et résumé.' : 'Each card shows: the official reference, objective, audience and a summary.'}
        </div>
        <button onClick={() => setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{{'fr'===lang ? 'Découvrir les documents 📚' : 'Discover the documents 📚'}}</button>
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
                <p style={{margin:'0 0 4px',color:'rgba(255,255,255,0.75)',fontSize:'12px',fontWeight:'600',letterSpacing:'1px'}}>{{'fr'===lang ? 'RÉFÉRENCE' : 'REFERENCE'}} : {fiche.ref}</p>
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
            {idx > 0 && <button onClick={()=>setIdx(i=>i-1)} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>{{'fr'===lang?'← Précédent':'← Previous'}}</button>}
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
        <h2 style={{fontSize:'26px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{{'fr'===lang?'Documents consultés !':'Documents reviewed!'}}</h2>
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{{'fr'===lang ? "25 politiques de s\u00e9curit\u00e9 de l\u2019information (ISO 27001) d\u2019i-Hub" : "25 i-Hub information security policies (ISO 27001)"}}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>25</div>
          <p style={{color:'#6b7280',margin:0,fontSize:'14px'}}>{{'fr'===lang?'documents passés en revue':'documents reviewed'}}</p>
        </div>
        <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
          <button onClick={()=>router.back()} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{{'fr'===lang?'← Retour':'← Back'}}</button>
          <button onClick={()=>{setPhase('intro');setIdx(0)}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{{'fr'===lang?'🔄 Recommencer':'🔄 Restart'}}</button>
        </div>
      </div>
    </div>
  )
}
