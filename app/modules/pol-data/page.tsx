'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#0891b2'

const UI = {
  fr: {
    title: "Politiques & Proc\u00e9dures \u2014 Protection des donn\u00e9es",
    subtitle: "Les politiques RGPD et protection des donn\u00e9es d\u2019i-Hub",
    fiches: '4 fiches', time: '∼8 min',
    start: 'Découvrir les documents 📚', prev: '← Précédent', next: 'Document suivant',
    home: '← Accueil', ref: 'Référence', obj: '🎯 Objectif', app: '👥 Applicable à', res: '📝 Résumé',
    fin: 'Documents consultés !', finSub: 'Vous connaissez les politiques et procédures d’i-Hub.',
    backHome: '← Retour', restart: '🔄 Recommencer',
    total: 'Total',
  },
  en: {
    title: "Policies & Procedures \u2014 Data Protection",
    subtitle: "i-Hub\u2019s GDPR and data protection policies",
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
  { id:1, ref:'POL-CMP-023', emoji:'🔐', titre:"Data Protection Policy",
    objectif:"\u00c9tablir les principes de traitement des donn\u00e9es personnelles conform\u00e9ment au RGPD",
    applicable:"Toute l\u2019organisation i-Hub",
    resume:"Politique de protection des donn\u00e9es personnelles d'i-Hub, \u00e9tablissant les principes, obligations et responsabilit\u00e9s en mati\u00e8re de traitement des donn\u00e9es conform\u00e9ment au RGPD.",
  },
  { id:2, ref:'POL-CMP-024', emoji:'👤', titre:"Data Subject Rights Management Policy",
    objectif:"Garantir l\u2019exercice effectif des droits des personnes concern\u00e9es",
    applicable:"Compliance, DPO, \u00e9quipes op\u00e9rationnelles",
    resume:"Politique d\u00e9finissant les droits des personnes concern\u00e9es (acc\u00e8s, rectification, effacement, portabilit\u00e9, opposition) et les proc\u00e9dures internes pour y r\u00e9pondre dans les d\u00e9lais r\u00e9glementaires.",
  },
  { id:3, ref:'POL-HR-037', emoji:'🔐', titre:"Employees Privacy Information Notice",
    objectif:"Informer les employ\u00e9s sur le traitement de leurs donn\u00e9es personnelles",
    applicable:"Tous les employ\u00e9s d\u2019i-Hub",
    resume:"Notice d'information \u00e0 destination des employ\u00e9s sur le traitement de leurs donn\u00e9es personnelles dans le cadre de la relation de travail, conform\u00e9ment aux exigences RGPD.",
  },
  { id:4, ref:'POL-HR-038', emoji:'🔐', titre:"HR Privacy Policy",
    objectif:"D\u00e9finir les r\u00e8gles de confidentialit\u00e9 applicables aux donn\u00e9es RH",
    applicable:"D\u00e9partement RH, DPO, direction",
    resume:"Politique de confidentialit\u00e9 RH d\u00e9finissant les principes de traitement des donn\u00e9es personnelles des collaborateurs, les finalit\u00e9s, dur\u00e9es de conservation et droits applicables.",
  },
]

const FICHES_EN: Fiche[] = [
  { id:1, ref:'POL-CMP-023', emoji:'🔐', titre:"Data Protection Policy",
    objectif:"Establish personal data processing principles in accordance with GDPR",
    applicable:"The entire i-Hub organisation",
    resume:"i-Hub's data protection policy establishing the principles, obligations and responsibilities for personal data processing in accordance with GDPR.",
  },
  { id:2, ref:'POL-CMP-024', emoji:'👤', titre:"Data Subject Rights Management Policy",
    objectif:"Ensure effective exercise of data subjects\u2019 rights",
    applicable:"Compliance, DPO, operational teams",
    resume:"Policy defining data subjects' rights (access, rectification, erasure, portability, objection) and internal procedures to respond within regulatory deadlines.",
  },
  { id:3, ref:'POL-HR-037', emoji:'🔐', titre:"Employees Privacy Information Notice",
    objectif:"Inform employees about the processing of their personal data",
    applicable:"All i-Hub employees",
    resume:"Information notice for employees regarding the processing of their personal data within the employment relationship, in accordance with GDPR requirements.",
  },
  { id:4, ref:'POL-HR-038', emoji:'🔐', titre:"HR Privacy Policy",
    objectif:"Define confidentiality rules applicable to HR data",
    applicable:"HR department, DPO, management",
    resume:"HR privacy policy defining the principles for processing employees' personal data, including purposes, retention periods and applicable rights.",
  },
]

export default function ModulePolDATA() {
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
      <button onClick={() => router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{}{'fr'===lang ? '← Accueil' : '← Home'}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>🔐 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{'fr'===l?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={{...base}}>
      <NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔐</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{{'fr'===lang ? "Politiques & Proc\u00e9dures \u2014 Protection des donn\u00e9es" : "Policies & Procedures \u2014 Data Protection"}}</h1>
        <p style={{fontSize:'15px',color:'#4b5563',marginBottom:'32px'}}>{{'fr'===lang ? "Les politiques RGPD et protection des donn\u00e9es d\u2019i-Hub" : "i-Hub\u2019s GDPR and data protection policies"}}</p>
        <div style={{background:'white',border:`1px solid ${C}30`,borderRadius:'16px',padding:'20px',marginBottom:'28px'}}>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            {[{icon:'📜',label:t.fiches},{icon:'⏱️',label:t.time}].map((b,i) => <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px 20px',display:'flex',alignItems:'center',gap:'8px',fontSize:'15px',color:'#374151'}}><span>{b.icon}</span><span>{b.label}</span></div>)}
          </div>
        </div>
        <div style={{background:`${C}10`,border:`1px solid ${C}30`,borderRadius:'12px',padding:'16px',marginBottom:'28px',fontSize:'14px',color:'#374151'}}>
          💡 {'fr'===lang ? 'Chaque fiche présente : la référence officielle, l’objectif, les destinataires et un résumé.' : 'Each card shows: the official reference, objective, audience and a summary.'}
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
              <span style={{fontSize:'44px'}}>{}{'fr'===lang ? '📜' : '📜'}</span>
              <div style={{flex:1}}>
                <p style={{margin:'0 0 4px',color:'rgba(255,255,255,0.75)',fontSize:'12px',fontWeight:'600',letterSpacing:'1px'}}>{{'fr'===lang ? 'RÉFÉRENCE' : 'REFERENCE'}} : {fiche.ref}</p>
                <h2 style={{color:'white',fontSize:'19px',fontWeight:'800',margin:0,lineHeight:1.3}}>{}{'fr'===lang ? '📜' : '📜'} {fiche.titre}</h2>
              </div>
            </div>
            <div style={{padding:'24px 28px',display:'flex',flexDirection:'column',gap:'18px'}}>
              <div style={{background:`${C}08`,border:`1px solid ${C}25`,borderRadius:'12px',padding:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'800',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>🎯 {lang==='fr'?'Objectif':'Objective'}</p>
                <p style={{margin:0,fontSize:'15px',color:'#374151',lineHeight:1.6,fontWeight:'600'}}>{}{'fr'===lang ? '' : ''}{fiche.objectif}</p>
              </div>
              <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'12px',padding:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'800',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px'}}>👥 {lang==='fr'?'Applicable à':'Applies to'}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',lineHeight:1.5}}>{}{'fr'===lang ? '' : ''}{fiche.applicable}</p>
              </div>
              <div style={{background:'#fafafa',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'800',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px'}}>📝 {lang==='fr'?'Résumé':'Summary'}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',lineHeight:1.65}}>{}{'fr'===lang ? '' : ''}{fiche.resume}</p>
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
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{{'fr'===lang ? "Les politiques RGPD et protection des donn\u00e9es d\u2019i-Hub" : "i-Hub\u2019s GDPR and data protection policies"}}</p>
        <div style={{background:'white',borderRadius:'16px',border:`2px solid ${C}30`,padding:'24px',marginBottom:'28px'}}>
          <div style={{fontSize:'40px',fontWeight:'800',color:C,marginBottom:'4px'}}>4</div>
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
