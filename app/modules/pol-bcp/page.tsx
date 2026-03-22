'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#0369a1'

const UI = {
  fr: {
    title: "Politiques & Proc\u00e9dures \u2014 Continuit\u00e9 d\u2019activit\u00e9",
    subtitle: "Les 9 documents officiels de la continuit\u00e9 d\u2019activit\u00e9 d\u2019i-Hub",
    fiches: '9 fiches', time: '∼18 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures \u2014 Business Continuity",
    subtitle: "The 9 official business continuity documents of i-Hub",
    fiches: '9 cards', time: '∼18 min',
    start: 'Discover the documents 📚', prev: '← Previous', next: 'Next document',
    home: '← Home', ref: 'Reference', obj: '🎯 Objective', app: '👥 Applies to', res: '📝 Summary',
    fin: 'Documents reviewed!', finSub: 'You know i-Hub’s policies and procedures.',
    backHome: '← Back', restart: '🔄 Restart',
    total: 'Total',
  },
}

type Fiche = { id: number; ref: string; emoji: string; titre: string; objectif: string; applicable: string; resume: string }

const FICHES_FR: Fiche[] = [
  { id:1, ref:'POL-BCP-001', emoji:'🎓', titre:"Awareness Program_New joiner",
    objectif:"Sensibiliser les nouveaux collaborateurs aux proc\u00e9dures BCP d\u00e8s leur arriv\u00e9e",
    applicable:"Tous les nouveaux collaborateurs",
    resume:"Programme de sensibilisation destin\u00e9 aux nouveaux collaborateurs sur les proc\u00e9dures de continuit\u00e9 des activit\u00e9s.",
  },
  { id:2, ref:'POL-BCP-002', emoji:'🔄', titre:"Business Continuity Management System Policy",
    objectif:"D\u00e9finir le cadre du SMCA conforme ISO 22301 et assurer la r\u00e9silience op\u00e9rationnelle",
    applicable:"Toute l\u2019organisation i-Hub",
    resume:"Politique du syst\u00e8me de management de la continuit\u00e9 d'activit\u00e9 (SMCA) conforme \u00e0 la norme ISO 22301.",
  },
  { id:3, ref:'POL-BCP-003', emoji:'🔄', titre:"Business Continuity Plans",
    objectif:"Garantir la continuit\u00e9 des activit\u00e9s critiques lors d\u2019incidents ou sinistres",
    applicable:"\u00c9quipes op\u00e9rationnelles et management",
    resume:"Plans op\u00e9rationnels d\u00e9crivant les mesures \u00e0 mettre en \u0153uvre pour assurer la continuit\u00e9 des activit\u00e9s en cas de sinistre.",
  },
  { id:4, ref:'POL-BCP-004', emoji:'📊', titre:"Business Impact Analysis",
    objectif:"Identifier les processus critiques et d\u00e9finir les RTO/RPO",
    applicable:"Direction, BCP Officer, responsables m\u00e9tier",
    resume:"Analyse d'impact sur les activit\u00e9s (BIA) identifiant les processus critiques, les d\u00e9lais de reprise et les ressources minimales n\u00e9cessaires.",
  },
  { id:5, ref:'POL-BCP-005', emoji:'🚨', titre:"Crisis Communication Plan",
    objectif:"Encadrer la communication de crise interne et externe",
    applicable:"Direction, communication, \u00e9quipes op\u00e9rationnelles",
    resume:"Plan d\u00e9finissant les proc\u00e9dures et responsabilit\u00e9s en mati\u00e8re de communication interne et externe lors d'une crise.",
  },
  { id:6, ref:'POL-BCP-006', emoji:'🚨', titre:"Crisis Management Plan",
    objectif:"Coordonner la r\u00e9ponse organisationnelle en situation de crise",
    applicable:"Cellule de crise, direction, BCP Officer",
    resume:"Plan de gestion de crise d\u00e9crivant les r\u00f4les, la cellule de crise et les proc\u00e9dures d'escalade et de d\u00e9cision.",
  },
  { id:7, ref:'POL-BCP-007', emoji:'🚨', titre:"Disaster Recovery Plan (DRP)",
    objectif:"Restaurer les syst\u00e8mes IT critiques apr\u00e8s une interruption majeure",
    applicable:"IT, BCP Officer, \u00e9quipes techniques",
    resume:"Plan de reprise apr\u00e8s sinistre (DRP) couvrant la restauration des syst\u00e8mes IT et infrastructures critiques apr\u00e8s une interruption majeure.",
  },
  { id:8, ref:'POL-BCP-008', emoji:'📍', titre:"Relocation Exercise Report 2024",
    objectif:"Documenter les r\u00e9sultats de l\u2019exercice et identifier les axes d\u2019am\u00e9lioration",
    applicable:"BCP Officer, toutes les \u00e9quipes ayant particip\u00e9",
    resume:"Rapport de l'exercice 2024 de d\u00e9localisation, documentant les r\u00e9sultats, \u00e9carts constat\u00e9s et actions correctives \u00e0 mettre en oeuvre.",
  },
  { id:9, ref:'POL-BCP-009', emoji:'⚠️', titre:"Risk Assessment Report",
    objectif:"\u00c9valuer les risques mena\u00e7ant la continuit\u00e9 et prioriser les actions",
    applicable:"BCP Officer, direction, risk management",
    resume:"Rapport d'\u00e9valuation des risques li\u00e9s \u00e0 la continuit\u00e9 d'activit\u00e9, identifiant les menaces, vuln\u00e9rabilit\u00e9s et niveaux d'exposition.",
  },
]

const FICHES_EN: Fiche[] = [
  { id:1, ref:'POL-BCP-001', emoji:'🎓', titre:"Awareness Program_New joiner",
    objectif:"Raise new joiners\u2019 awareness of BCP procedures from day one",
    applicable:"All new joiners",
    resume:"Awareness programme for new joiners covering business continuity procedures and employee responsibilities.",
  },
  { id:2, ref:'POL-BCP-002', emoji:'🔄', titre:"Business Continuity Management System Policy",
    objectif:"Define the ISO 22301-compliant BCMS framework and ensure operational resilience",
    applicable:"The entire i-Hub organisation",
    resume:"Business Continuity Management System (BCMS) policy compliant with ISO 22301, defining scope, objectives and governance.",
  },
  { id:3, ref:'POL-BCP-003', emoji:'🔄', titre:"Business Continuity Plans",
    objectif:"Ensure continuity of critical activities during incidents or disasters",
    applicable:"Operational teams and management",
    resume:"Operational plans outlining the measures to maintain critical business activities during and after a disruptive incident.",
  },
  { id:4, ref:'POL-BCP-004', emoji:'📊', titre:"Business Impact Analysis",
    objectif:"Identify critical processes and define RTO/RPO objectives",
    applicable:"Management, BCP Officer, business owners",
    resume:"Business Impact Analysis (BIA) identifying critical processes, recovery time objectives (RTO) and minimum resource requirements.",
  },
  { id:5, ref:'POL-BCP-005', emoji:'🚨', titre:"Crisis Communication Plan",
    objectif:"Govern internal and external crisis communication",
    applicable:"Management, communications, operational teams",
    resume:"Plan defining procedures and responsibilities for internal and external communication during a crisis situation.",
  },
  { id:6, ref:'POL-BCP-006', emoji:'🚨', titre:"Crisis Management Plan",
    objectif:"Coordinate organisational response in crisis situations",
    applicable:"Crisis team, management, BCP Officer",
    resume:"Crisis management plan describing roles, the crisis management team structure, escalation and decision-making procedures.",
  },
  { id:7, ref:'POL-BCP-007', emoji:'🚨', titre:"Disaster Recovery Plan (DRP)",
    objectif:"Restore critical IT systems following a major disruption",
    applicable:"IT, BCP Officer, technical teams",
    resume:"Disaster Recovery Plan (DRP) covering the restoration of IT systems and critical infrastructure following a major disruption.",
  },
  { id:8, ref:'POL-BCP-008', emoji:'📍', titre:"Relocation Exercise Report 2024",
    objectif:"Document exercise results and identify improvement areas",
    applicable:"BCP Officer, all participating teams",
    resume:"Report on the 2024 relocation exercise, documenting results, gaps identified and corrective actions to be implemented.",
  },
  { id:9, ref:'POL-BCP-009', emoji:'⚠️', titre:"Risk Assessment Report",
    objectif:"Assess risks threatening continuity and prioritise actions",
    applicable:"BCP Officer, management, risk management",
    resume:"Risk assessment report for business continuity, identifying threats, vulnerabilities and exposure levels.",
  },
]

export default function ModulePolBCP() {
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>🔄 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{'fr'===l?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔄</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{'fr'===lang ? "Politiques & Proc\u00e9dures \u2014 Continuit\u00e9 d\u2019activit\u00e9" : "Policies & Procedures \u2014 Business Continuity"}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{'fr'===lang ? "Les 9 documents officiels de la continuit\u00e9 d\u2019activit\u00e9 d\u2019i-Hub" : "The 9 official business continuity documents of i-Hub"}</p>
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
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{'fr'===lang ? "Les 9 documents officiels de la continuit\u00e9 d\u2019activit\u00e9 d\u2019i-Hub" : "The 9 official business continuity documents of i-Hub"}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>9</div>
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
