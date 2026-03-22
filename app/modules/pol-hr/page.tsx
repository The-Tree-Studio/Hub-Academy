'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#b45309'

const UI = {
  fr: {
    title: "Politiques & Proc\u00e9dures \u2014 Droits & Obligations RH",
    subtitle: "14 politiques et proc\u00e9dures RH applicables \u00e0 tous les collaborateurs",
    fiches: '14 fiches', time: '∼28 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures \u2014 Employee Rights & Duties",
    subtitle: "14 HR policies and procedures applicable to all employees",
    fiches: '14 cards', time: '∼28 min',
    start: 'Discover the documents 📚', prev: '← Previous', next: 'Next document',
    home: '← Home', ref: 'Reference', obj: '🎯 Objective', app: '👥 Applies to', res: '📝 Summary',
    fin: 'Documents reviewed!', finSub: 'You know i-Hub’s policies and procedures.',
    backHome: '← Back', restart: '🔄 Restart',
    total: 'Total',
  },
}

type Fiche = { id: number; ref: string; emoji: string; titre: string; objectif: string; applicable: string; resume: string }

const FICHES_FR: Fiche[] = [
  { id:1, ref:'POL-HR-030', emoji:'🔄', titre:"Change process",
    objectif:"Encadrer les changements de situation professionnelle des collaborateurs",
    applicable:"RH, managers, collaborateurs concern\u00e9s",
    resume:"Proc\u00e9dure de gestion des changements RH (mobilit\u00e9 interne, \u00e9volution de poste, modification contractuelle).",
  },
  { id:2, ref:'POL-HR-031', emoji:'📜', titre:"Code of Conduct",
    objectif:"D\u00e9finir les standards \u00e9thiques et comportementaux attendus de tous",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Code de conduite d\u00e9finissant les valeurs, principes \u00e9thiques et comportements attendus de l'ensemble des collaborateurs.",
  },
  { id:3, ref:'POL-HR-032', emoji:'🚶', titre:"Offboarding process",
    objectif:"Assurer un d\u00e9part structur\u00e9, s\u00e9curis\u00e9 et conforme des collaborateurs",
    applicable:"RH, IT, managers, collaborateur sortant",
    resume:"Processus de d\u00e9part des collaborateurs incluant la restitution des acc\u00e8s, la transmission des connaissances et les formalit\u00e9s administratives.",
  },
  { id:4, ref:'POL-HR-033', emoji:'👋', titre:"Onboarding process",
    objectif:"Garantir une int\u00e9gration r\u00e9ussie et conforme des nouveaux collaborateurs",
    applicable:"RH, managers, nouveau collaborateur",
    resume:"Processus d'int\u00e9gration des nouveaux collaborateurs couvrant l'accueil, les acc\u00e8s syst\u00e8mes, les formations obligatoires et le suivi de la p\u00e9riode d'essai.",
  },
  { id:5, ref:'POL-HR-034', emoji:'🏠', titre:"Teleworking Policy",
    objectif:"Encadrer le t\u00e9l\u00e9travail dans le respect des droits et obligations l\u00e9gaux",
    applicable:"Collaborateurs \u00e9ligibles au t\u00e9l\u00e9travail, managers",
    resume:"Politique de t\u00e9l\u00e9travail d\u00e9finissant les conditions d'\u00e9ligibilit\u00e9, les droits et obligations des t\u00e9l\u00e9travailleurs et les modalit\u00e9s de contr\u00f4le.",
  },
  { id:6, ref:'POL-HR-035', emoji:'🎓', titre:"Training Policy",
    objectif:"D\u00e9finir les engagements d\u2019i-Hub en mati\u00e8re de formation et d\u00e9veloppement",
    applicable:"Tous les collaborateurs i-Hub, direction, RH",
    resume:"Politique de formation d\u00e9finissant les objectifs, le budget, les parcours obligatoires et les modalit\u00e9s de validation des comp\u00e9tences.",
  },
  { id:7, ref:'POL-HR-036', emoji:'⛔', titre:"Anti Discrimination and Harassment Policy",
    objectif:"Pr\u00e9venir et traiter toute forme de discrimination et harc\u00e8lement",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Politique d\u00e9finissant l'engagement d'i-Hub en mati\u00e8re de lutte contre toute forme de discrimination et de harc\u00e8lement (moral, sexuel) au travail, incluant les proc\u00e9dures de signalement et de traitement.",
  },
  { id:8, ref:'POL-HR-039', emoji:'🚶', titre:"Internal Mobility Procedure",
    objectif:"Faciliter et encadrer la mobilit\u00e9 interne des collaborateurs",
    applicable:"Collaborateurs postulant en interne, RH, managers",
    resume:"Proc\u00e9dure encadrant les demandes et processus de mobilit\u00e9 interne au sein d'i-Hub, incluant les crit\u00e8res d'\u00e9ligibilit\u00e9, les \u00e9tapes de candidature et les modalit\u00e9s de transition de poste.",
  },
  { id:9, ref:'POL-HR-040', emoji:'🚗', titre:"Parking Policy",
    objectif:"Organiser et s\u00e9curiser l\u2019acc\u00e8s au parking des collaborateurs",
    applicable:"Tous les collaborateurs utilisant le parking i-Hub",
    resume:"Politique d\u00e9finissant les r\u00e8gles d'acc\u00e8s, d'utilisation et de gestion du parking mis \u00e0 disposition des collaborateurs d'i-Hub.",
  },
  { id:10, ref:'POL-HR-041', emoji:'📊', titre:"Performance Management Policy",
    objectif:"Encadrer l\u2019\u00e9valuation des performances en lien avec les exigences ISO 27001",
    applicable:"Tous les collaborateurs i-Hub, managers, RH",
    resume:"Politique encadrant le processus d'\u00e9valuation des performances des collaborateurs d'i-Hub, incluant les crit\u00e8res d'\u00e9valuation, la p\u00e9riodicit\u00e9 et les modalit\u00e9s de feedback, en lien avec les exigences ISO 27001.",
  },
  { id:11, ref:'POL-HR-042', emoji:'📖', titre:"Policy and Procedure Manual",
    objectif:"Centraliser toutes les politiques et proc\u00e9dures en vigueur chez i-Hub",
    applicable:"Toute l\u2019organisation i-Hub",
    resume:"Manuel de r\u00e9f\u00e9rence centralisant l'ensemble des politiques et proc\u00e9dures applicables au sein d'i-Hub, servant de guide pour la gestion documentaire et la conformit\u00e9 interne.",
  },
  { id:12, ref:'POL-HR-043', emoji:'👤', titre:"Recruitment Procedure",
    objectif:"D\u00e9finir un processus de recrutement \u00e9quitable, structur\u00e9 et conforme",
    applicable:"RH, managers recruteurs, candidats",
    resume:"Proc\u00e9dure d\u00e9finissant les \u00e9tapes du processus de recrutement d'i-Hub, incluant la publication des offres, la s\u00e9lection des candidats, les entretiens et la prise de d\u00e9cision.",
  },
  { id:13, ref:'POL-HR-044', emoji:'💰', titre:"Remuneration Policy",
    objectif:"D\u00e9finir les r\u00e8gles de r\u00e9mun\u00e9ration \u00e9quitables et transparentes",
    applicable:"Direction, RH, tous les collaborateurs",
    resume:"Politique d\u00e9finissant les principes et r\u00e8gles de r\u00e9mun\u00e9ration applicables au personnel d'i-Hub, incluant les composantes fixes et variables et les modalit\u00e9s de r\u00e9vision salariale.",
  },
  { id:14, ref:'POL-HR-045', emoji:'🏠', titre:"Teleworking Policy and Best Practices",
    objectif:"D\u00e9finir les r\u00e8gles et bonnes pratiques du t\u00e9l\u00e9travail incluant la s\u00e9curit\u00e9",
    applicable:"Collaborateurs en t\u00e9l\u00e9travail, managers, IT",
    resume:"Politique et bonnes pratiques encadrant le t\u00e9l\u00e9travail au sein d'i-Hub, d\u00e9finissant les conditions d'\u00e9ligibilit\u00e9, les obligations des collaborateurs et les r\u00e8gles de s\u00e9curit\u00e9 applicables.",
  },
]

const FICHES_EN: Fiche[] = [
  { id:1, ref:'POL-HR-030', emoji:'🔄', titre:"Change process",
    objectif:"Govern changes to employees\u2019 professional situation",
    applicable:"HR, managers, concerned employees",
    resume:"Procedure for managing HR changes including internal mobility, role changes and contractual amendments.",
  },
  { id:2, ref:'POL-HR-031', emoji:'📜', titre:"Code of Conduct",
    objectif:"Define ethical and behavioural standards expected of all employees",
    applicable:"All i-Hub employees",
    resume:"Code of conduct defining the values, ethical principles and expected behaviours of all employees.",
  },
  { id:3, ref:'POL-HR-032', emoji:'🚶', titre:"Offboarding process",
    objectif:"Ensure structured, secure and compliant employee departures",
    applicable:"HR, IT, managers, departing employee",
    resume:"Offboarding process covering access revocation, knowledge transfer and administrative formalities upon employee departure.",
  },
  { id:4, ref:'POL-HR-033', emoji:'👋', titre:"Onboarding process",
    objectif:"Ensure successful and compliant onboarding of new employees",
    applicable:"HR, managers, new joiner",
    resume:"Onboarding process for new employees covering welcome, system access, mandatory training and probation period monitoring.",
  },
  { id:5, ref:'POL-HR-034', emoji:'🏠', titre:"Teleworking Policy",
    objectif:"Govern remote working in compliance with legal rights and obligations",
    applicable:"Eligible remote workers, managers",
    resume:"Teleworking policy defining eligibility criteria, rights and obligations of remote workers and monitoring arrangements.",
  },
  { id:6, ref:'POL-HR-035', emoji:'🎓', titre:"Training Policy",
    objectif:"Define i-Hub\u2019s commitments regarding training and development",
    applicable:"All i-Hub employees, management, HR",
    resume:"Training policy defining objectives, budget, mandatory learning paths and competency validation modalities.",
  },
  { id:7, ref:'POL-HR-036', emoji:'⛔', titre:"Anti Discrimination and Harassment Policy",
    objectif:"Prevent and address all forms of discrimination and harassment",
    applicable:"All i-Hub employees",
    resume:"Policy defining i-Hub's commitment to combating all forms of discrimination and harassment (moral, sexual) in the workplace, including reporting and handling procedures.",
  },
  { id:8, ref:'POL-HR-039', emoji:'🚶', titre:"Internal Mobility Procedure",
    objectif:"Facilitate and govern internal staff mobility",
    applicable:"Internal applicants, HR, managers",
    resume:"Procedure governing internal mobility requests and processes within i-Hub, including eligibility criteria, application steps and job transition modalities.",
  },
  { id:9, ref:'POL-HR-040', emoji:'🚗', titre:"Parking Policy",
    objectif:"Organise and secure employee access to the parking facility",
    applicable:"All employees using the i-Hub parking facility",
    resume:"Policy defining the rules for access, use and management of the parking facility made available to i-Hub employees.",
  },
  { id:10, ref:'POL-HR-041', emoji:'📊', titre:"Performance Management Policy",
    objectif:"Govern performance evaluation aligned with ISO 27001 requirements",
    applicable:"All i-Hub employees, managers, HR",
    resume:"Policy governing the performance evaluation process for i-Hub employees, including assessment criteria, frequency and feedback modalities, aligned with ISO 27001 requirements.",
  },
  { id:11, ref:'POL-HR-042', emoji:'📖', titre:"Policy and Procedure Manual",
    objectif:"Centralise all applicable policies and procedures within i-Hub",
    applicable:"The entire i-Hub organisation",
    resume:"Reference manual centralising all applicable policies and procedures within i-Hub, serving as a guide for document management and internal compliance.",
  },
  { id:12, ref:'POL-HR-043', emoji:'👤', titre:"Recruitment Procedure",
    objectif:"Define a fair, structured and compliant recruitment process",
    applicable:"HR, hiring managers, candidates",
    resume:"Procedure defining the steps of i-Hub's recruitment process, including job posting, candidate selection, interviews and decision-making.",
  },
  { id:13, ref:'POL-HR-044', emoji:'💰', titre:"Remuneration Policy",
    objectif:"Define fair and transparent remuneration rules",
    applicable:"Management, HR, all employees",
    resume:"Policy defining the remuneration principles and rules applicable to i-Hub staff, including fixed and variable components and salary review modalities.",
  },
  { id:14, ref:'POL-HR-045', emoji:'🏠', titre:"Teleworking Policy and Best Practices",
    objectif:"Define remote working rules and best practices including security",
    applicable:"Remote workers, managers, IT",
    resume:"Policy and best practices governing remote working at i-Hub, defining eligibility conditions, employee obligations and applicable security rules.",
  },
]

export default function ModulePolHR() {
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>👥 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{'fr'===l?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>👥</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{{'fr'===lang ? "Politiques & Proc\u00e9dures \u2014 Droits & Obligations RH" : "Policies & Procedures \u2014 Employee Rights & Duties"}}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{{'fr'===lang ? "14 politiques et proc\u00e9dures RH applicables \u00e0 tous les collaborateurs" : "14 HR policies and procedures applicable to all employees"}}</p>
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
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{{'fr'===lang ? "14 politiques et proc\u00e9dures RH applicables \u00e0 tous les collaborateurs" : "14 HR policies and procedures applicable to all employees"}}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>14</div>
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
