'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#7c3aed'

const UI = {
  fr: {
    title: "Politiques & Proc\u00e9dures \u2014 Gouvernance & Conformit\u00e9",
    subtitle: "12 documents encadrant la gouvernance et la conformit\u00e9 chez i-Hub",
    fiches: '12 fiches', time: '∼24 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures \u2014 Governance & Compliance",
    subtitle: "12 documents governing governance and compliance at i-Hub",
    fiches: '12 cards', time: '∼24 min',
    start: 'Discover the documents 📚', prev: '← Previous', next: 'Next document',
    home: '← Home', ref: 'Reference', obj: '🎯 Objective', app: '👥 Applies to', res: '📝 Summary',
    fin: 'Documents reviewed!', finSub: 'You know i-Hub’s policies and procedures.',
    backHome: '← Back', restart: '🔄 Restart',
    total: 'Total',
  },
}

type Fiche = { id: number; ref: string; emoji: string; titre: string; objectif: string; applicable: string; resume: string }

const FICHES_FR: Fiche[] = [
  { id:1, ref:'POL-CMP-012', emoji:'🎓', titre:"Awareness Program",
    objectif:"Assurer la conformit\u00e9 comportementale de tous les collaborateurs aux obligations r\u00e9glementaires",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Programme de sensibilisation \u00e0 la conformit\u00e9 (LBC/FT, \u00e9thique, r\u00e9glementation) destin\u00e9 aux nouveaux collaborateurs.",
  },
  { id:2, ref:'POL-CMP-013', emoji:'📜', titre:"Clients and Providers Management Procedure",
    objectif:"G\u00e9rer les relations clients et prestataires de mani\u00e8re conforme et tra\u00e7able",
    applicable:"Compliance, direction commerciale, account managers",
    resume:"Proc\u00e9dure r\u00e9gissant la gestion des relations clients et prestataires, incluant le processus d'onboarding, de risk assessment, les demandes d'autorisatoin de la CSSF si necessaire, le scoring du client/fournisseur, l'analyse de criticit\u00e9, les diligences pr\u00e9alables et le suivi p\u00e9riodique.",
  },
  { id:3, ref:'POL-CMP-014', emoji:'📮', titre:"Complaints Handling Policy",
    objectif:"Garantir un traitement \u00e9quitable, rapide et document\u00e9 des r\u00e9clamations",
    applicable:"Compliance, direction, \u00e9quipes en contact client",
    resume:"Politique de traitement des r\u00e9clamations d\u00e9finissant les d\u00e9lais, responsabilit\u00e9s et proc\u00e9dures d'escalade et de cl\u00f4ture.",
  },
  { id:4, ref:'POL-CMP-015', emoji:'⚖️', titre:"Compliance Charter and Policy",
    objectif:"D\u00e9finir le r\u00f4le, l\u2019ind\u00e9pendance et les missions de la fonction Compliance",
    applicable:"\u00c9quipe Compliance, direction, auditeurs",
    resume:"Charte et politique de conformit\u00e9 d\u00e9finissant le r\u00f4le, les missions et l'ind\u00e9pendance de la fonction Compliance.",
  },
  { id:5, ref:'POL-CMP-016', emoji:'🏦', titre:"Governance Policy",
    objectif:"\u00c9tablir les r\u00e8gles de gouvernance d\u2019entreprise d\u2019i-Hub",
    applicable:"Direction, Conseil d\u2019administration, Compliance",
    resume:"Politique de gouvernance d\u00e9finissant la structure organisationnelle, les instances de d\u00e9cision et les principes de bonne gouvernance.",
  },
  { id:6, ref:'POL-CMP-019', emoji:'⚠️', titre:"Risk Management Policy",
    objectif:"D\u00e9finir le cadre de gestion des risques et l\u2019app\u00e9tence au risque d\u2019i-Hub",
    applicable:"Direction, Compliance, risk management, toutes les \u00e9quipes",
    resume:"Politique de gestion des risques d\u00e9finissant le cadre, l'app\u00e9tence au risque, les responsabilit\u00e9s et les principes m\u00e9thodologiques.",
  },
  { id:7, ref:'POL-CMP-020', emoji:'⚠️', titre:"Risk Management Procedure",
    objectif:"D\u00e9crire les \u00e9tapes op\u00e9rationnelles d\u2019identification, \u00e9valuation et traitement des risques",
    applicable:"Risk managers, Compliance, responsables d\u2019\u00e9quipe",
    resume:"Proc\u00e9dure op\u00e9rationnelle d\u00e9crivant les \u00e9tapes d'identification, d'\u00e9valuation, de traitement et de suivi des risques.",
  },
  { id:8, ref:'POL-CMP-025', emoji:'⛔', titre:"Anti Bribery Corruption Policy",
    objectif:"Pr\u00e9venir et d\u00e9tecter tout acte de corruption ou prise d\u2019avantage illicite",
    applicable:"Tous les collaborateurs et sous-traitants i-Hub",
    resume:"Politique de pr\u00e9vention et de lutte contre la corruption et les pots-de-vin, d\u00e9finissant les r\u00e8gles de conduite, les interdictions et les obligations d\u00e9claratives applicables \u00e0 l'ensemble du personnel d'i-Hub.",
  },
  { id:9, ref:'POL-CMP-026', emoji:'📜', titre:"Compliants Handling Policy and Procedure",
    objectif:"Assurer le traitement conforme des r\u00e9clamations clients selon les exigences CSSF",
    applicable:"Compliance, \u00e9quipes en contact client, direction",
    resume:"Politique et proc\u00e9dure de gestion des r\u00e9clamations clients, d\u00e9finissant les circuits de traitement, les d\u00e9lais de r\u00e9ponse et les obligations de reporting conform\u00e9ment \u00e0 la r\u00e9glementation CSSF applicable.",
  },
  { id:10, ref:'POL-CMP-027', emoji:'🔎', titre:"Internal Audit Charter",
    objectif:"D\u00e9finir le cadre et les modalit\u00e9s de la fonction d\u2019audit interne",
    applicable:"Auditeur interne, direction, Compliance",
    resume:"Charte d\u00e9finissant la mission, le p\u00e9rim\u00e8tre, l'ind\u00e9pendance et les responsabilit\u00e9s de la fonction d'audit interne d'i-Hub, ainsi que les modalit\u00e9s de planification et de reporting des missions.",
  },
  { id:11, ref:'POL-CMP-028', emoji:'✏️', titre:"Signatories list of i-Hub",
    objectif:"Encadrer les pouvoirs de signature et d\u00e9l\u00e9gations au sein d\u2019i-Hub",
    applicable:"Direction, Compliance, d\u00e9partements concern\u00e9s",
    resume:"Document recensant les personnes habilit\u00e9es \u00e0 signer les documents officiels, contrats et engagements au nom d'i-Hub SA, avec indication des pouvoirs et limites d\u00e9l\u00e9gu\u00e9s.",
  },
  { id:12, ref:'POL-CMP-029', emoji:'📣', titre:"Whistleblowing Policy",
    objectif:"Prot\u00e9ger les lanceurs d\u2019alerte et encadrer les signalements internes",
    applicable:"Tous les collaborateurs i-Hub",
    resume:"Politique encadrant le dispositif de signalement des manquements et actes r\u00e9pr\u00e9hensibles (whistleblowing), garantissant la confidentialit\u00e9 des lanceurs d'alerte et les proc\u00e9dures de traitement des signalements.",
  },
]

const FICHES_EN: Fiche[] = [
  { id:1, ref:'POL-CMP-012', emoji:'🎓', titre:"Awareness Program",
    objectif:"Ensure all employees\u2019 behavioural compliance with regulatory obligations",
    applicable:"All i-Hub staff",
    resume:"Compliance awareness programme for new joiners covering AML/CFT obligations, ethics and applicable regulations.",
  },
  { id:2, ref:'POL-CMP-013', emoji:'📜', titre:"Clients and Providers Management Procedure",
    objectif:"Manage client and provider relationships in a compliant and traceable manner",
    applicable:"Compliance, commercial teams, account managers",
    resume:"Procedure governing the management of client and provider relationships, including initial due diligence and periodic reviews.",
  },
  { id:3, ref:'POL-CMP-014', emoji:'📮', titre:"Complaints Handling Policy",
    objectif:"Ensure fair, prompt and documented handling of complaints",
    applicable:"Compliance, management, client-facing teams",
    resume:"Complaints handling policy defining processing timelines, responsibilities, escalation procedures and closure requirements.",
  },
  { id:4, ref:'POL-CMP-015', emoji:'⚖️', titre:"Compliance Charter and Policy",
    objectif:"Define the role, independence and missions of the Compliance function",
    applicable:"Compliance team, management, auditors",
    resume:"Compliance charter and policy defining the role, mission and independence of the Compliance function within the organisation.",
  },
  { id:5, ref:'POL-CMP-016', emoji:'🏦', titre:"Governance Policy",
    objectif:"Establish i-Hub\u2019s corporate governance rules",
    applicable:"Management, Board of Directors, Compliance",
    resume:"Governance policy defining the organisational structure, decision-making bodies and principles of sound governance.",
  },
  { id:6, ref:'POL-CMP-019', emoji:'⚠️', titre:"Risk Management Policy",
    objectif:"Define i-Hub\u2019s risk management framework and risk appetite",
    applicable:"Management, Compliance, risk management, all teams",
    resume:"Risk management policy defining the framework, risk appetite, responsibilities and methodological principles.",
  },
  { id:7, ref:'POL-CMP-020', emoji:'⚠️', titre:"Risk Management Procedure",
    objectif:"Describe operational steps for risk identification, assessment and treatment",
    applicable:"Risk managers, Compliance, team managers",
    resume:"Operational procedure describing the steps for identifying, assessing, treating and monitoring risks.",
  },
  { id:8, ref:'POL-CMP-025', emoji:'⛔', titre:"Anti Bribery Corruption Policy",
    objectif:"Prevent and detect any act of bribery or illicit advantage-seeking",
    applicable:"All i-Hub employees and subcontractors",
    resume:"Policy for preventing and combating bribery and corruption, defining codes of conduct, prohibitions and reporting obligations applicable to all i-Hub staff.",
  },
  { id:9, ref:'POL-CMP-026', emoji:'📜', titre:"Compliants Handling Policy and Procedure",
    objectif:"Ensure compliant customer complaint handling per CSSF requirements",
    applicable:"Compliance, client-facing teams, management",
    resume:"Customer complaints management policy and procedure, defining processing workflows, response timelines and reporting obligations in accordance with applicable CSSF regulation.",
  },
  { id:10, ref:'POL-CMP-027', emoji:'🔎', titre:"Internal Audit Charter",
    objectif:"Define the framework and modalities of the internal audit function",
    applicable:"Internal auditor, management, Compliance",
    resume:"Charter defining the mission, scope, independence and responsibilities of i-Hub's internal audit function, as well as the planning and reporting modalities for audit engagements.",
  },
  { id:11, ref:'POL-CMP-028', emoji:'✏️', titre:"Signatories list of i-Hub",
    objectif:"Govern signing powers and delegations within i-Hub",
    applicable:"Management, Compliance, relevant departments",
    resume:"Document listing the persons authorised to sign official documents, contracts and commitments on behalf of i-Hub SA, with indication of delegated powers and limits.",
  },
  { id:12, ref:'POL-CMP-029', emoji:'📣', titre:"Whistleblowing Policy",
    objectif:"Protect whistleblowers and govern internal disclosures",
    applicable:"All i-Hub employees",
    resume:"Policy governing the reporting mechanism for wrongdoing and misconduct (whistleblowing), guaranteeing whistleblower confidentiality and the procedures for handling disclosures.",
  },
]

export default function ModulePolGOUV() {
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>⚖️ {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{'fr'===l?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>⚖️</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{'fr'===lang ? "Politiques & Proc\u00e9dures \u2014 Gouvernance & Conformit\u00e9" : "Policies & Procedures \u2014 Governance & Compliance"}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{'fr'===lang ? "12 documents encadrant la gouvernance et la conformit\u00e9 chez i-Hub" : "12 documents governing governance and compliance at i-Hub"}</p>
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
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{'fr'===lang ? "12 documents encadrant la gouvernance et la conformit\u00e9 chez i-Hub" : "12 documents governing governance and compliance at i-Hub"}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>12</div>
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
