'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── DATA ────────────────────────────────────────────────────────────────────

const FICHES = [
  {
    id: 1,
    emoji: '🏦',
    titre: "C'est quoi l'AML/KYC pour i-Hub ?",
    couleur: '#e91e8c',
    contenu: [
      { icon: '🔍', texte: "**AML** = Anti-Money Laundering = Lutte contre le blanchiment d'argent" },
      { icon: '🪪', texte: "**KYC** = Know Your Customer = Connaître ses clients" },
      { icon: '🇱🇺', texte: "En tant que **PSF de support** luxembourgeois, i-Hub est soumis à la **Loi du 12 novembre 2004** (modifiée) sur la LBC/FT" },
      { icon: '⚖️', texte: "Cela signifie qu'i-Hub doit vérifier l'identité et la légitimité de **chaque client** avant de lui fournir des services" },
    ],
    aretenir: "i-Hub n'est pas une banque, mais a quand même des obligations AML/KYC directes vis-à-vis de ses clients.",
  },
  {
    id: 2,
    emoji: '🤝',
    titre: 'Qui sont les clients d\'i-Hub ?',
    couleur: '#7c3aed',
    contenu: [
      { icon: '🏛️', texte: "**Banques et établissements de crédit** — clients à haut niveau de surveillance" },
      { icon: '📊', texte: "**Fonds d'investissement (OPCVM, FIA)** — vérifie les gestionnaires et dépositaires" },
      { icon: '🛡️', texte: "**Compagnies d'assurance** — obligation de vérifier la licence CSSF/CAA" },
      { icon: '💼', texte: "**Autres PSF** (PSF spécialisés, PSF de support) — même soumis à la loi" },
    ],
    aretenir: "Tous les clients d'i-Hub sont eux-mêmes des entités réglementées. Cela simplifie le KYC mais ne le supprime pas !",
  },
  {
    id: 3,
    emoji: '📋',
    titre: 'Les 5 obligations fondamentales',
    couleur: '#0891b2',
    contenu: [
      { icon: '1️⃣', texte: "**Identifier** le client et vérifier son identité (numéro RCS, extrait de registre, statuts)" },
      { icon: '2️⃣', texte: "**Identifier le bénéficiaire effectif** (UBO = Ultimate Beneficial Owner) — qui détient +25% ?" },
      { icon: '3️⃣', texte: "**Comprendre la relation d'affaires** — pourquoi ce client veut nos services ?" },
      { icon: '4️⃣', texte: "**Surveiller en continu** — mettre à jour le dossier si changement de situation" },
      { icon: '5️⃣', texte: "**Déclarer** toute opération suspecte à la CRF (Cellule de Renseignement Financier)" },
    ],
    aretenir: "Ces 5 obligations s'appliquent AVANT de signer le contrat et pendant toute la durée de la relation.",
  },
  {
    id: 4,
    emoji: '📁',
    titre: 'Le dossier KYC en pratique',
    couleur: '#059669',
    contenu: [
      { icon: '📄', texte: "**Extrait de registre de commerce** (RCS) — moins de 3 mois" },
      { icon: '📜', texte: "**Statuts coordonnés** de la société cliente" },
      { icon: '🪪', texte: "**Pièces d'identité des dirigeants** et des UBO (+25%)" },
      { icon: '🔐', texte: "**Copie de la licence CSSF** du client (banque, fonds, PSF…)" },
      { icon: '📝', texte: "**Questionnaire AML** signé par le client" },
      { icon: '🔄', texte: "**Mise à jour annuelle** ou lors d'un changement matériel" },
    ],
    aretenir: "Pas de dossier KYC complet = pas de contrat. C'est une obligation légale, pas une formalité optionnelle.",
  },
  {
    id: 5,
    emoji: '🚨',
    titre: 'PEP, EDD et signalement',
    couleur: '#dc2626',
    contenu: [
      { icon: '🏛️', texte: "**PEP** = Politically Exposed Person = personne exerçant une fonction publique importante (ministre, député, dirigeant d'État)" },
      { icon: '🔬', texte: "**EDD** = Enhanced Due Diligence = mesures de vigilance renforcées pour les clients à risque élevé" },
      { icon: '🚩', texte: "**Signaux d'alerte** : client inconnu, structure opaque, pays à risque GAFI, refus de fournir des documents" },
      { icon: '📢', texte: "**RAS/STR** = Rapport d'Activité Suspecte — à envoyer à la **CRF Luxembourg** si doute" },
    ],
    aretenir: "En cas de doute, on ne prend PAS de risque. On consulte le Responsable AML d'i-Hub et on documente tout.",
  },
]

const QUIZ_MATCHING = [
  { sigle: 'AML', definition: 'Lutte contre le blanchiment' },
  { sigle: 'KYC', definition: 'Connaissance du client' },
  { sigle: 'UBO', definition: 'Bénéficiaire effectif final' },
  { sigle: 'PEP', definition: 'Personne politiquement exposée' },
  { sigle: 'EDD', definition: 'Vigilance renforcée' },
  { sigle: 'CRF', definition: 'Cellule renseignement financier' },
]

const QUIZ_BRIQUES = [
  { id: 'rcs', texte: '📄 Extrait RCS', ordre: 1 },
  { id: 'statuts', texte: '📜 Statuts coordonnés', ordre: 2 },
  { id: 'id', texte: '🪪 Pièce d\'identité dirigeant', ordre: 3 },
  { id: 'licence', texte: '🔐 Licence CSSF client', ordre: 4 },
  { id: 'questionnaire', texte: '📝 Questionnaire AML', ordre: 5 },
  { id: 'validation', texte: '✅ Validation RR/AMLCO', ordre: 6 },
]

const QUIZ_VRAI_FAUX = [
  { texte: "i-Hub doit vérifier l'identité de ses clients car c'est une banque", reponse: false, explication: "i-Hub est un PSF de support, pas une banque. Mais la loi LBC/FT s'applique quand même !" },
  { texte: "Un client PEP nécessite des mesures de vigilance renforcées (EDD)", reponse: true, explication: "Exact ! Toute personne politiquement exposée déclenche automatiquement l'EDD." },
  { texte: "Si le dossier KYC est incomplet, on peut quand même signer le contrat", reponse: false, explication: "Non ! Pas de KYC complet = pas de relation d'affaires. C'est une obligation légale." },
  { texte: "Le dossier KYC doit être mis à jour lors d'un changement de dirigeant", reponse: true, explication: "Exact ! Tout changement matériel oblige à actualiser le dossier." },
  { texte: "En cas de doute sur un client, on peut ignorer si c'est une grande banque connue", reponse: false, explication: "Non ! La notoriété ne dispense pas des obligations. On documente et consulte l'AMLCO." },
]

// ─── COMPOSANT PRINCIPAL ─────────────────────────────────────────────────────

export default function ModuleAmlKyc() {
  const router = useRouter()
  const [phase, setPhase] = useState<'intro' | 'fiches' | 'quiz1' | 'quiz2' | 'quiz3' | 'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)

  // Quiz 1 — Matching
  const [matchSelected, setMatchSelected] = useState<string | null>(null)
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({})
  const [matchDefs, setMatchDefs] = useState(() => [...QUIZ_MATCHING].sort(() => Math.random() - 0.5))
  const [matchError, setMatchError] = useState<string | null>(null)

  // Quiz 2 — Briques
  const [briquesDisponibles, setBriquesDisponibles] = useState(() => [...QUIZ_BRIQUES].sort(() => Math.random() - 0.5))
  const [briquesPlacees, setBriquesPlacees] = useState<typeof QUIZ_BRIQUES>([])
  const [briqueMessage, setBriqueMessage] = useState<string | null>(null)

  // Quiz 3 — Vrai/Faux
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean | null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct' | 'wrong' | null>(null)

  // ─── MATCHING ───────────────────────────────────────────────────────────────
  function handleMatchSigle(sigle: string) {
    if (matchPairs[sigle]) return
    setMatchSelected(sigle)
    setMatchError(null)
  }

  function handleMatchDef(def: string) {
    if (!matchSelected) return
    const correct = QUIZ_MATCHING.find(m => m.sigle === matchSelected)?.definition
    if (correct === def) {
      const newPairs = { ...matchPairs, [matchSelected]: def }
      setMatchPairs(newPairs)
      setMatchSelected(null)
      if (Object.keys(newPairs).length === QUIZ_MATCHING.length) {
        setScore(s => s + 20)
      }
    } else {
      setMatchError(`❌ "${def}" ne correspond pas à ${matchSelected}. Réessaie !`)
      setMatchSelected(null)
    }
  }

  function matchComplete() { return Object.keys(matchPairs).length === QUIZ_MATCHING.length }

  // ─── BRIQUES ────────────────────────────────────────────────────────────────
  function placerBrique(brique: typeof QUIZ_BRIQUES[0]) {
    const expectedOrdre = briquesPlacees.length + 1
    if (brique.ordre === expectedOrdre) {
      setBriquesPlacees(p => [...p, brique])
      setBriquesDisponibles(d => d.filter(b => b.id !== brique.id))
      setBriqueMessage(null)
      if (brique.ordre === QUIZ_BRIQUES.length) {
        setScore(s => s + 20)
      }
    } else {
      setBriqueMessage(`⚠️ Pas encore ! Le document n°${expectedOrdre} doit venir avant.`)
    }
  }

  function briquesComplete() { return briquesPlacees.length === QUIZ_BRIQUES.length }

  // ─── VRAI/FAUX ──────────────────────────────────────────────────────────────
  function repondreVF(rep: boolean) {
    if (vfRepondu !== null) return
    const correct = QUIZ_VRAI_FAUX[vfIndex].reponse === rep
    setVfRepondu(rep)
    setVfAnimation(correct ? 'correct' : 'wrong')
    if (correct) setVfScore(s => s + 1)
    setTimeout(() => {
      setVfAnimation(null)
      setVfRepondu(null)
      if (vfIndex + 1 < QUIZ_VRAI_FAUX.length) {
        setVfIndex(i => i + 1)
      } else {
        const finalVfScore = correct ? vfScore + 1 : vfScore
        setScore(s => s + finalVfScore * 4)
        setPhase('resultat')
      }
    }, 2200)
  }

  const totalScore = Math.min(100, score)

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  const base: React.CSSProperties = {
    minHeight: '100vh',
    background: '#fff0f5',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#1e293b',
  }

  // Barre de retour
  const NavBar = () => (
    <div style={{ background: 'white', borderBottom: '1px solid #fce4ec', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(233,30,140,0.06)' }}>
      <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #fce4ec', borderRadius: '8px', padding: '6px 12px', color: '#e91e8c', cursor: 'pointer', fontSize: '14px' }}>
        ← Accueil
      </button>
      <span style={{ color: '#e91e8c', fontWeight: '700', fontSize: '16px' }}>🔍 AML/KYC Rules</span>
      <span style={{ marginLeft: 'auto', background: '#fff0f5', border: '1px solid #fce4ec', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', color: '#e91e8c', fontWeight: '600' }}>
        ⭐ {score} pts
      </span>
    </div>
  )

  // ── INTRO ──
  if (phase === 'intro') return (
    <div style={base}>
      <NavBar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px', animation: 'bounce 1s ease infinite alternate' }}>🔍</div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
          AML/KYC Rules
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '8px' }}>Les obligations directes d'i-Hub</p>
        <div style={{ background: 'white', border: '1px solid #fce4ec', borderRadius: '16px', padding: '24px', marginTop: '32px', marginBottom: '32px', textAlign: 'left' }}>
          <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#e91e8c' }}>📚 Ce que vous allez apprendre :</p>
          {['Pourquoi i-Hub a des obligations AML/KYC directes', 'Quels documents collecter sur vos clients', 'Ce qu\'est un PEP, un UBO, la CDD et l\'EDD', 'Comment réagir face à un signal d\'alerte'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', borderBottom: i < 3 ? '1px solid #fce4ec' : 'none' }}>
              <span style={{ color: '#e91e8c', fontWeight: '700', minWidth: '20px' }}>✓</span>
              <span style={{ color: '#475569', fontSize: '15px' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[{ label: '5 fiches', icon: '📖' }, { label: '3 quiz fun', icon: '🎮' }, { label: '~12 min', icon: '⏱️' }].map((b, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #fce4ec', borderRadius: '12px', padding: '10px 20px', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{b.icon}</span> {b.label}
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('fiches')} style={{ background: '#e91e8c', color: 'white', border: 'none', borderRadius: '12px', padding: '16px 48px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.35)', transition: 'all 0.2s' }}
          onMouseOver={e => { (e.target as HTMLButtonElement).style.background = '#c0186f'; (e.target as HTMLButtonElement).style.transform = 'scale(1.04)' }}
          onMouseOut={e => { (e.target as HTMLButtonElement).style.background = '#e91e8c'; (e.target as HTMLButtonElement).style.transform = 'scale(1)' }}>
          C'est parti ! 🚀
        </button>
      </div>
      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }`}</style>
    </div>
  )

  // ── FICHES ──
  if (phase === 'fiches') {
    const fiche = FICHES[ficheIndex]
    const progress = ((ficheIndex + 1) / FICHES.length) * 100
    return (
      <div style={base}>
        <NavBar />
        {/* Progress */}
        <div style={{ background: '#fce4ec', height: '6px' }}>
          <div style={{ background: fiche.couleur, height: '6px', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: '0 4px 4px 0' }} />
        </div>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>FICHE {ficheIndex + 1} / {FICHES.length}</span>
            <span style={{ fontSize: '13px', color: fiche.couleur, fontWeight: '700', background: `${fiche.couleur}15`, padding: '4px 12px', borderRadius: '20px' }}>AML/KYC Rules</span>
          </div>

          {/* Carte fiche */}
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: `0 8px 40px ${fiche.couleur}20`, border: `2px solid ${fiche.couleur}30`, overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ background: fiche.couleur, padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>{fiche.emoji}</div>
              <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>{fiche.titre}</h2>
            </div>
            <div style={{ padding: '24px' }}>
              {fiche.contenu.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: i < fiche.contenu.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <span style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>{item.icon}</span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}
                    dangerouslySetInnerHTML={{ __html: item.texte.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
              {/* À retenir */}
              <div style={{ background: `${fiche.couleur}10`, border: `1px solid ${fiche.couleur}30`, borderRadius: '12px', padding: '16px', marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px' }}>💡</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: fiche.couleur, textTransform: 'uppercase', letterSpacing: '1px' }}>À RETENIR</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontStyle: 'italic' }}>{fiche.aretenir}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {ficheIndex > 0 && (
              <button onClick={() => setFicheIndex(i => i - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #fce4ec', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
                ← Précédent
              </button>
            )}
            <button
              onClick={() => ficheIndex < FICHES.length - 1 ? setFicheIndex(i => i + 1) : setPhase('quiz1')}
              style={{ flex: 2, padding: '14px', background: fiche.couleur, border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: `0 4px 16px ${fiche.couleur}40` }}>
              {ficheIndex < FICHES.length - 1 ? 'Fiche suivante →' : '🎮 Passer aux quiz !'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ 1 — MATCHING ──
  if (phase === 'quiz1') {
    const done = matchComplete()
    return (
      <div style={base}>
        <NavBar />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ background: '#7c3aed15', color: '#7c3aed', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>QUIZ 1/3 · ASSOCIER LES PAIRES</span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' }}>🧩 Reliez chaque sigle à sa définition</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Cliquez d'abord sur un sigle, puis sur sa définition</p>
          </div>

          {matchError && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '14px', textAlign: 'center' }}>
              {matchError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Sigles */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Sigles</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {QUIZ_MATCHING.map(m => {
                  const isPaired = !!matchPairs[m.sigle]
                  const isSelected = matchSelected === m.sigle
                  return (
                    <button key={m.sigle} onClick={() => handleMatchSigle(m.sigle)}
                      disabled={isPaired}
                      style={{
                        padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: isPaired ? 'default' : 'pointer', transition: 'all 0.2s',
                        background: isPaired ? '#d1fae5' : isSelected ? '#7c3aed' : 'white',
                        color: isPaired ? '#059669' : isSelected ? 'white' : '#1e293b',
                        boxShadow: isSelected ? '0 4px 16px #7c3aed50' : '0 2px 8px rgba(0,0,0,0.06)',
                        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                        border: isPaired ? '1.5px solid #6ee7b7' : isSelected ? '1.5px solid #7c3aed' : '1.5px solid #e2e8f0',
                      } as React.CSSProperties}>
                      {isPaired ? '✓' : ''} {m.sigle}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Définitions */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Définitions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchDefs.map(m => {
                  const isPaired = Object.values(matchPairs).includes(m.definition)
                  return (
                    <button key={m.definition} onClick={() => handleMatchDef(m.definition)}
                      disabled={isPaired || !matchSelected}
                      style={{
                        padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: (isPaired || !matchSelected) ? 'default' : 'pointer', border: 'none', transition: 'all 0.2s', textAlign: 'left',
                        background: isPaired ? '#d1fae5' : matchSelected ? 'white' : '#f8fafc',
                        color: isPaired ? '#059669' : '#1e293b',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: isPaired ? '1.5px solid #6ee7b7' : '1.5px solid #e2e8f0',
                        opacity: (!matchSelected && !isPaired) ? 0.6 : 1,
                      } as React.CSSProperties}>
                      {isPaired ? '✓ ' : ''}{m.definition}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {done && (
            <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '28px', margin: '0 0 8px' }}>🎉</p>
              <p style={{ fontWeight: '800', color: '#059669', fontSize: '18px', margin: '0 0 4px' }}>Parfait ! Tous les sigles sont associés !</p>
              <p style={{ color: '#6ee7b7', margin: 0, fontSize: '14px' }}>+20 points gagnés</p>
            </div>
          )}

          {done && (
            <button onClick={() => setPhase('quiz2')} style={{ width: '100%', padding: '16px', background: '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.35)' }}>
              Quiz suivant →
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── QUIZ 2 — BRIQUES ──
  if (phase === 'quiz2') {
    const done = briquesComplete()
    return (
      <div style={base}>
        <NavBar />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ background: '#0891b215', color: '#0891b2', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>QUIZ 2/3 · CONSTRUIRE LE DOSSIER KYC</span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' }}>🧱 Assemblez les briques dans l'ordre !</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Cliquez les documents dans le bon ordre pour constituer un dossier KYC complet</p>
          </div>

          {/* Zone de dépôt — dossier construit */}
          <div style={{ background: 'white', border: '2px dashed #0891b240', borderRadius: '16px', padding: '20px', marginBottom: '20px', minHeight: '120px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>📁 Votre dossier KYC</p>
            {briquesPlacees.length === 0
              ? <p style={{ color: '#cbd5e1', textAlign: 'center', fontSize: '14px', padding: '20px 0' }}>Cliquez sur les documents ci-dessous pour les ajouter dans l'ordre...</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {briquesPlacees.map((b, i) => (
                  <div key={b.id} style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                    <span style={{ background: '#059669', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>{i + 1}</span>
                    {b.texte}
                  </div>
                ))}
              </div>
            }
          </div>

          {briqueMessage && (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#92400e', fontSize: '14px', textAlign: 'center' }}>
              {briqueMessage}
            </div>
          )}

          {/* Briques disponibles */}
          {briquesDisponibles.length > 0 && (
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Documents disponibles</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {briquesDisponibles.map(b => (
                  <button key={b.id} onClick={() => placerBrique(b)}
                    style={{ padding: '14px 16px', background: 'white', border: '2px solid #0891b230', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#0891b2', textAlign: 'left', transition: 'all 0.15s', boxShadow: '0 2px 8px rgba(8,145,178,0.08)' }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0891b2'; (e.currentTarget as HTMLElement).style.background = '#f0f9ff' }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0891b230'; (e.currentTarget as HTMLElement).style.background = 'white' }}>
                    {b.texte}
                  </button>
                ))}
              </div>
            </div>
          )}

          {done && (
            <>
              <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '16px', padding: '20px', textAlign: 'center', marginTop: '20px', marginBottom: '16px' }}>
                <p style={{ fontSize: '28px', margin: '0 0 8px' }}>🏆</p>
                <p style={{ fontWeight: '800', color: '#059669', fontSize: '18px', margin: '0 0 4px' }}>Dossier KYC complet et dans l'ordre !</p>
                <p style={{ color: '#6ee7b7', margin: 0, fontSize: '14px' }}>+20 points gagnés</p>
              </div>
              <button onClick={() => setPhase('quiz3')} style={{ width: '100%', padding: '16px', background: '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.35)' }}>
                Dernier quiz →
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── QUIZ 3 — VRAI/FAUX ──
  if (phase === 'quiz3') {
    const q = QUIZ_VRAI_FAUX[vfIndex]
    const progress = ((vfIndex) / QUIZ_VRAI_FAUX.length) * 100
    return (
      <div style={{ ...base, transition: 'background 0.3s', background: vfAnimation === 'correct' ? '#d1fae5' : vfAnimation === 'wrong' ? '#fee2e2' : '#fff0f5' }}>
        <NavBar />
        <div style={{ background: vfAnimation === 'correct' ? '#6ee7b7' : vfAnimation === 'wrong' ? '#fca5a5' : '#fce4ec', height: '6px' }}>
          <div style={{ background: '#e91e8c', height: '6px', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <span style={{ background: '#e91e8c15', color: '#e91e8c', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '24px' }}>
            QUIZ 3/3 · VRAI OU FAUX — Question {vfIndex + 1}/{QUIZ_VRAI_FAUX.length}
          </span>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: '28px', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', lineHeight: 1.5, margin: 0 }}>{q.texte}</p>
          </div>

          {vfRepondu === null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => repondreVF(true)}
                style={{ padding: '20px', background: '#d1fae5', border: '2px solid #6ee7b7', borderRadius: '16px', fontSize: '22px', fontWeight: '800', color: '#059669', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>
                ✅ VRAI
              </button>
              <button onClick={() => repondreVF(false)}
                style={{ padding: '20px', background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '16px', fontSize: '22px', fontWeight: '800', color: '#dc2626', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>
                ❌ FAUX
              </button>
            </div>
          ) : (
            <div style={{ background: vfAnimation === 'correct' ? '#d1fae5' : '#fee2e2', border: `2px solid ${vfAnimation === 'correct' ? '#6ee7b7' : '#fca5a5'}`, borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '28px', margin: '0 0 8px' }}>{vfAnimation === 'correct' ? '🎉' : '😅'}</p>
              <p style={{ fontWeight: '800', color: vfAnimation === 'correct' ? '#059669' : '#dc2626', fontSize: '18px', margin: '0 0 8px' }}>
                {vfAnimation === 'correct' ? 'Bravo, bonne réponse !' : 'Pas tout à fait...'}
              </p>
              <p style={{ color: '#475569', fontSize: '15px', margin: 0, fontStyle: 'italic' }}>{q.explication}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {QUIZ_VRAI_FAUX.map((_, i) => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < vfIndex ? '#e91e8c' : i === vfIndex ? '#e91e8c' : '#fce4ec', opacity: i <= vfIndex ? 1 : 0.4 }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── RÉSULTAT ──
  const pct = totalScore
  const medal = pct >= 80 ? '🥇' : pct >= 50 ? '🥈' : '🥉'
  const msg = pct >= 80 ? 'Expert AML/KYC !' : pct >= 50 ? 'Bon résultat, continuez !' : 'Relisez les fiches et réessayez !'
  return (
    <div style={base}>
      <NavBar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>{medal}</div>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' }}>{msg}</h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px' }}>Module AML/KYC Rules terminé</p>

        {/* Score */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(233,30,140,0.10)', marginBottom: '24px' }}>
          <div style={{ fontSize: '56px', fontWeight: '800', color: '#e91e8c', marginBottom: '4px' }}>{pct}<span style={{ fontSize: '24px' }}>/100</span></div>
          <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: '14px' }}>Score total</p>
          <div style={{ background: '#fff0f5', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, #e91e8c, #f472b6)', height: '12px', width: `${pct}%`, borderRadius: '8px', transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '20px' }}>
            {[{ label: 'Matching', pts: '20/20' }, { label: 'Briques', pts: '20/20' }, { label: 'Vrai/Faux', pts: `${vfScore * 4}/20` }].map((s, i) => (
              <div key={i} style={{ background: '#fff0f5', borderRadius: '10px', padding: '12px', fontSize: '13px' }}>
                <div style={{ fontWeight: '700', color: '#e91e8c', fontSize: '16px' }}>{s.pts}</div>
                <div style={{ color: '#94a3b8' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button onClick={() => router.push('/')} style={{ padding: '16px', background: '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>
            ← Retour aux modules
          </button>
          <button onClick={() => { setPhase('intro'); setScore(0); setMatchPairs({}); setMatchSelected(null); setBriquesDisponibles([...QUIZ_BRIQUES].sort(() => Math.random() - 0.5)); setBriquesPlacees([]); setVfIndex(0); setVfScore(0) }}
            style={{ padding: '14px', background: 'white', border: '1px solid #fce4ec', borderRadius: '12px', color: '#e91e8c', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            🔄 Recommencer ce module
          </button>
        </div>
      </div>
    </div>
  )
}
