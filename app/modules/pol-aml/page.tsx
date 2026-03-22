'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#e91e8c'

const UI = {
  fr: {
    title: "Politiques & Procédures — AML/CTF",
    subtitle: "Les politiques et procédures AML/CTF d’i-Hub",
    fiches: '4 fiches', time: '∼8 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures — AML/CTF",
    subtitle: "i-Hub’s AML/CTF policies and procedures",
    fiches: '4 cards', time: '∼8 min',
    start: 'Discover the documents 📚', prev: '← Previous', next: 'Next document',
    home: '← Home', ref: 'Reference', obj: '🎯 Objective', app: '👥 Applies to', res: '📝 Summary',
    fin: 'Documents reviewed!', finSub: 'You know i-Hub’s policies and procedures.',
    backHome: '← Back', restart: '🔄 Restart',
    total: 'Total',
  },
}

type Fiche = { id: number; ref: string; emoji: string; titre: string; objectif: string; applicable: string; resume: string }

const FICHES_FR: Fiche[] = [
  { id:1, ref:'POL-CMP-010', emoji:'🔍', titre:"AML Policy",
    objectif:"Définir le cadre général LBC/FT applicable à i-Hub en tant que PSF",
    applicable:"Toute l’organisation i-Hub",
    resume:"Politique générale LBC/FT applicable à l'ensemble de l'organisation, définissant le cadre, les responsabilités et les principes d'action.",
  },
  { id:2, ref:'POL-CMP-011', emoji:'🔍', titre:"AML-KYC procedure",
    objectif:"Encadrer les diligences KYC/KYB lors de l’entrée en relation et du suivi continu",
    applicable:"Équipes Compliance, opérations KYC, account managers",
    resume:"Procédure opérationnelle encadrant les diligences KYC/KYB lors de l'entrée en relation et du suivi continu des clients.",
  },
  { id:3, ref:'POL-CMP-021', emoji:'⚠️', titre:"Country risk map",
    objectif:"Fournir une cartographie des niveaux de risque géographique pour les évaluations AML/CTF",
    applicable:"Compliance, équipes KYC/AML, account managers",
    resume:"Cartographie des risques pays utilisée dans le cadre de l'évaluation AML/CTF, définissant les niveaux de risque géographique applicables aux clients et contreparties d'i-Hub.",
  },
  { id:4, ref:'POL-CMP-022', emoji:'🏷️', titre:"ID Match Policy",
    objectif:"Définir les règles de vérification d’identité (ID match) dans le processus KYC/AML",
    applicable:"Équipes KYC, Compliance, opérations",
    resume:"Politique définissant les règles et procédures de vérification de correspondance d'identité (ID match) dans le cadre du processus KYC/AML d'i-Hub.",
  },
]

const FICHES_EN: Fiche[] = [
  { id:1, ref:'POL-CMP-010', emoji:'🔍', titre:"AML Policy",
    objectif:"Define the general AML/CFT framework applicable to i-Hub as a PSF",
    applicable:"The entire i-Hub organisation",
    resume:"General AML/CFT policy applicable across the organisation, defining the framework, responsibilities and principles of action.",
  },
  { id:2, ref:'POL-CMP-011', emoji:'🔍', titre:"AML-KYC procedure",
    objectif:"Govern KYC/KYB due diligence at onboarding and during ongoing monitoring",
    applicable:"Compliance, KYC operations, account managers",
    resume:"Operational procedure governing KYC/KYB due diligence during client onboarding and ongoing monitoring.",
  },
  { id:3, ref:'POL-CMP-021', emoji:'⚠️', titre:"Country risk map",
    objectif:"Provide a country risk level mapping for AML/CTF assessments",
    applicable:"Compliance, KYC/AML teams, account managers",
    resume:"Country risk mapping used in AML/CTF assessments, defining geographic risk levels applicable to i-Hub clients and counterparties.",
  },
  { id:4, ref:'POL-CMP-022', emoji:'🏷️', titre:"ID Match Policy",
    objectif:"Define identity matching verification rules within the KYC/AML process",
    applicable:"KYC teams, Compliance, operations",
    resume:"Policy defining the rules and procedures for identity matching (ID match) verification within i-Hub's KYC/AML process.",
  },
]

export default function ModulePolAML() {
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>🚨 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{'fr'===l?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🚨</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{'fr'===lang ? "Politiques & Procédures — AML/CTF" : "Policies & Procedures — AML/CTF"}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{'fr'===lang ? "Les politiques et procédures AML/CTF d’i-Hub" : "i-Hub’s AML/CTF policies and procedures"}</p>
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
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{'fr'===lang ? "Les politiques et procédures AML/CTF d’i-Hub" : "i-Hub’s AML/CTF policies and procedures"}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>4</div>
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
