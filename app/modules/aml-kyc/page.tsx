'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FICHES = [
  {
    id: 1, emoji: '🔍', titre: "C'est quoi l'AML/KYC pour i-Hub ?", couleur: '#e91e8c',
    contenu: [
      { icon: '💰', texte: "**AML** = Anti-Money Laundering = Lutte contre le blanchiment d'argent et le financement du terrorisme (LBC/FT)" },
      { icon: '🪪', texte: "**KYC** = Know Your Customer = Connaître ses clients avant, pendant et après la relation d'affaires" },
      { icon: '🏢', texte: "i-Hub est un **PSF de support** (Professionnel du Secteur Financier) agréé par la CSSF au Luxembourg" },
      { icon: '⚖️', texte: "En tant que PSF de support, i-Hub est directement soumis à la **Loi du 12 novembre 2004** modifiée sur la LBC/FT" },
    ],
    aretenir: "i-Hub n'est pas une banque, mais a des obligations AML/KYC directes et personnelles vis-à-vis de chacun de ses clients.",
  },
  {
    id: 2, emoji: '📜', titre: "Le cadre légal luxembourgeois", couleur: '#e91e8c',
    contenu: [
      { icon: '🇱🇺', texte: "**Loi du 12 novembre 2004** — loi fondamentale LBC/FT au Luxembourg, modifiée plusieurs fois depuis" },
      { icon: '🇪🇺', texte: "**Directive européenne AMLD5 (2018/843)** — transposée au Luxembourg, renforce la transparence sur les UBO" },
      { icon: '📋', texte: "**Règlement CSSF 12-02** — précise les obligations de vigilance pour les professionnels financiers" },
      { icon: '🌍', texte: "**Recommandations du GAFI** — 40 recommandations internationales sur la LBC/FT, adoptées par le Luxembourg" },
    ],
    aretenir: "La loi de 2004 est la colonne vertébrale. Tout le reste (directives, règlements, circulaires CSSF) vient la compléter et la préciser.",
  },
  {
    id: 3, emoji: '🤝', titre: "Qui sont les clients d'i-Hub ?", couleur: '#e91e8c',
    contenu: [
      { icon: '🏛️', texte: "**Banques et établissements de crédit** — agréés par la BCE ou la CSSF, niveau de surveillance maximal" },
      { icon: '📊', texte: "**Fonds d'investissement** (OPCVM, FIA, SIF, RAIF) — vérification du gestionnaire et du dépositaire" },
      { icon: '🛡️', texte: "**Compagnies d'assurance** — soumises à la supervision du CAA (Commissariat aux Assurances)" },
      { icon: '💼', texte: "**Autres PSF** (PSF spécialisés, PSF de support) — eux aussi directement soumis à la loi LBC/FT" },
    ],
    aretenir: "Tous les clients d'i-Hub sont eux-mêmes des entités réglementées. Cela facilite le KYC mais ne le supprime pas !",
  },
  {
    id: 4, emoji: '📋', titre: "Les 5 obligations fondamentales", couleur: '#e91e8c',
    contenu: [
      { icon: '1️⃣', texte: "**Identifier** le client et vérifier son identité (numéro RCS, extrait de registre, statuts)" },
      { icon: '2️⃣', texte: "**Identifier le bénéficiaire effectif** (UBO) — qui détient ou contrôle réellement le client ?" },
      { icon: '3️⃣', texte: "**Comprendre la relation d'affaires** — pourquoi ce client veut-il nos services ? Quelle est son activité ?" },
      { icon: '4️⃣', texte: "**Surveiller en continu** — mettre à jour le dossier si la situation change (dirigeants, actionnariat, activité)" },
      { icon: '5️⃣', texte: "**Déclarer** toute opération suspecte à la CRF (Cellule de Renseignement Financier) Luxembourg" },
    ],
    aretenir: "Ces 5 obligations s'appliquent AVANT de signer le contrat et pendant toute la durée de la relation commerciale.",
  },
  {
    id: 5, emoji: '🔬', titre: "La CDD — Customer Due Diligence", couleur: '#e91e8c',
    contenu: [
      { icon: '📌', texte: "**CDD** = Customer Due Diligence = mesures de vigilance standard appliquées à tous les clients sans exception" },
      { icon: '🧾', texte: "Comprend : vérification d'identité, collecte des documents, compréhension de l'activité et de l'objet social" },
      { icon: '🔄', texte: "La CDD est un **processus continu** — pas seulement lors de l'entrée en relation, mais tout au long du contrat" },
      { icon: '📁', texte: "Tout doit être **documenté** et conservé pendant **10 ans** après la fin de la relation d'affaires (obligation légale)" },
    ],
    aretenir: "La CDD est le niveau de vigilance de base. Elle s'applique à TOUS les clients, même les plus simples.",
  },
  {
    id: 6, emoji: '📁', titre: "Le dossier KYC en pratique", couleur: '#e91e8c',
    contenu: [
      { icon: '📄', texte: "**Extrait de registre de commerce** (RCS) — document officiel de moins de 3 mois, obligatoire pour toute société" },
      { icon: '📜', texte: "**Statuts coordonnés** de la société cliente — pour connaître l'objet social et les dirigeants autorisés" },
      { icon: '🪪', texte: "**Pièces d'identité** des dirigeants, administrateurs et UBO (bénéficiaires effectifs détenant +25%)" },
      { icon: '🔐', texte: "**Copie de la licence CSSF ou CAA** du client — preuve qu'il est lui-même un professionnel réglementé" },
      { icon: '📝', texte: "**Questionnaire AML** signé par le client — déclaration sur l'origine des fonds, l'activité, les risques identifiés" },
    ],
    aretenir: "Pas de dossier KYC complet = pas de contrat. C'est une obligation légale, pas une formalité administrative optionnelle.",
  },
  {
    id: 7, emoji: '👤', titre: "C'est quoi un UBO ?", couleur: '#e91e8c',
    contenu: [
      { icon: '🎯', texte: "**UBO** = Ultimate Beneficial Owner = Bénéficiaire Effectif Final — la personne physique qui, en dernier ressort, possède ou contrôle l'entité cliente" },
      { icon: '25%', texte: "Toute personne physique détenant **directement ou indirectement plus de 25%** des parts ou droits de vote est considérée UBO" },
      { icon: '🏛️', texte: "Au Luxembourg, les UBO doivent être inscrits au **Registre des Bénéficiaires Effectifs (RBE)** — obligatoire depuis 2019" },
      { icon: '🔍', texte: "Si aucune personne ne dépasse 25%, on identifie la ou les personnes exerçant le **contrôle effectif** de fait (ex: PDG)" },
    ],
    aretenir: "Identifier l'UBO permet de savoir QUI se cache vraiment derrière une société. C'est la clé pour détecter les structures opaques.",
  },
  {
    id: 8, emoji: '🏛️', titre: "C'est quoi un PEP ?", couleur: '#e91e8c',
    contenu: [
      { icon: '👑', texte: "**PEP** = Politically Exposed Person = Personne Politiquement Exposée exerçant ou ayant exercé une fonction publique importante" },
      { icon: '📋', texte: "Exemples : chefs d'État, ministres, parlementaires, juges de hautes cours, dirigeants de banques centrales, ambassadeurs" },
      { icon: '👨‍👩‍👧', texte: "Les **membres de la famille proche** (conjoint, enfants, parents) et **associés étroits** d'un PEP sont aussi considérés PEP" },
      { icon: '⏰', texte: "Un PEP reste PEP pendant **au moins 12 mois** après avoir quitté ses fonctions (parfois plus selon l'évaluation des risques)" },
    ],
    aretenir: "Un PEP n'est pas forcément suspect, mais son profil exige automatiquement des mesures de vigilance renforcées (EDD).",
  },
  {
    id: 9, emoji: '⬆️', titre: "L'EDD — Enhanced Due Diligence", couleur: '#e91e8c',
    contenu: [
      { icon: '🔬', texte: "**EDD** = Enhanced Due Diligence = Vigilance renforcée, appliquée aux clients présentant un **risque plus élevé**" },
      { icon: '🚩', texte: "Déclenchée pour : les PEP, les clients de pays à risque GAFI, les structures complexes, les activités sensibles" },
      { icon: '📋', texte: "En pratique : informations supplémentaires sur l'origine des fonds, validation par la direction, surveillance accrue des transactions" },
      { icon: '✍️', texte: "L'EDD doit être **documentée et approuvée** par l'équipe Compliance d'i-Hub avant toute entrée en relation ou renouvellement de contrat" },
    ],
    aretenir: "L'EDD n'est pas un refus automatique — c'est une vigilance plus poussée. On peut accepter un client PEP, mais avec davantage de contrôles.",
  },
  {
    id: 10, emoji: '⬇️', titre: "La SDD — Vigilance simplifiée", couleur: '#e91e8c',
    contenu: [
      { icon: '✅', texte: "**SDD** = Simplified Due Diligence = Vigilance allégée applicable uniquement aux clients présentant un **risque faible démontré**" },
      { icon: '🏛️', texte: "Applicable par exemple aux organismes publics d'État, administrations ou entités cotées sur un marché réglementé UE" },
      { icon: '⚠️', texte: "La SDD ne signifie PAS l'absence totale de vigilance — on collecte quand même les documents d'identification de base" },
      { icon: '🔄', texte: "Si le niveau de risque évolue à tout moment, on passe immédiatement à la CDD standard ou à l'EDD selon les circonstances" },
    ],
    aretenir: "La SDD est l'exception, pas la règle. Chez i-Hub, la grande majorité des clients relèvent de la CDD standard.",
  },
  {
    id: 11, emoji: '🌍', titre: "Les pays à risque — listes GAFI", couleur: '#e91e8c',
    contenu: [
      { icon: '🚨', texte: "**Liste noire GAFI** (High-Risk Jurisdictions) — pays sous appel à l'action, mesures renforcées obligatoires (ex: Iran, Corée du Nord, Myanmar)" },
      { icon: '🟡', texte: "**Liste grise GAFI** (Increased Monitoring) — pays sous surveillance accrue qui travaillent à améliorer leur dispositif AML" },
      { icon: '🇪🇺', texte: "**Liste noire UE** — pays tiers à haut risque identifiés par la Commission européenne, révisée régulièrement" },
      { icon: '🔄', texte: "Ces listes sont **mises à jour régulièrement** — i-Hub doit les consulter avant chaque nouvelle relation d'affaires internationale" },
    ],
    aretenir: "Un client dont l'activité principale est dans un pays listé GAFI déclenche automatiquement l'EDD. Pas de dérogation possible.",
  },
  {
    id: 12, emoji: '📊', titre: "Le Risk Scoring d'un client", couleur: '#e91e8c',
    contenu: [
      { icon: '⚖️', texte: "Le **risk scoring** = attribuer une note de risque (faible / moyen / élevé) à chaque client selon des critères objectifs définis" },
      { icon: '📍', texte: "Critères évalués : pays d'origine, type d'entité, secteur d'activité, structure d'actionnariat, présence de PEP ou sanctions" },
      { icon: '🔢', texte: "Chez i-Hub, le scoring est formalisé dans une **matrice de risque** validée par l'équipe Compliance et mise à jour chaque année" },
      { icon: '📈', texte: "Le score détermine le niveau de vigilance applicable : **faible → SDD**, **moyen → CDD standard**, **élevé → EDD**" },
    ],
    aretenir: "Le risk scoring est un outil objectif pour calibrer la vigilance. Il protège i-Hub et garantit une approche proportionnée et documentée.",
  },
  {
    id: 13, emoji: '👁️', titre: "La surveillance continue", couleur: '#e91e8c',
    contenu: [
      { icon: '🔄', texte: "Le KYC n'est pas un exercice ponctuel — la relation d'affaires doit être **surveillée tout au long de sa durée**" },
      { icon: '📅', texte: "**Mise à jour annuelle** pour les clients à risque élevé, tous les **3 ans** pour les clients à risque standard" },
      { icon: '🚨', texte: "Mise à jour **immédiate** si : changement de dirigeant, de structure, d'actionnariat, d'activité ou d'incident de conformité signalé" },
      { icon: '📰', texte: "**Surveillance des actualités négatives** (negative news) — presse, bases de données de sanctions, alertes automatisées sur les noms" },
    ],
    aretenir: "Un dossier KYC à jour est aussi important qu'un dossier initial complet. Une relation qui évolue doit déclencher une révision.",
  },
  {
    id: 14, emoji: '🚩', titre: "Les signaux d'alerte (Red Flags)", couleur: '#e91e8c',
    contenu: [
      { icon: '🔴', texte: "**Structure opaque** : actionnariat complexe avec de multiples couches de holdings dans des pays peu coopératifs" },
      { icon: '🔴', texte: "**Refus de fournir des documents** ou d'identifier les UBO sans justification valable ou légitime" },
      { icon: '🔴', texte: "**Origine des fonds inexpliquée** ou incohérente avec l'activité déclarée et le profil économique du client" },
      { icon: '🔴', texte: "**Présence sur des listes de sanctions** (OFAC, UE, ONU) ou liens avérés avec des personnes sanctionnées" },
      { icon: '🔴', texte: "**Pression pour conclure rapidement** un contrat sans passer par les procédures normales de due diligence d'i-Hub" },
    ],
    aretenir: "Un seul red flag n'est pas forcément bloquant, mais l'accumulation de signaux doit alerter et déclencher une EDD ou un refus motivé.",
  },
  {
    id: 15, emoji: '🚨', titre: "Que faire en cas de doute ?", couleur: '#e91e8c',
    contenu: [
      { icon: '🛑', texte: "**Ne jamais agir seul** — tout doute doit être immédiatement signalé au **Responsable AML (équipe Compliance)** d'i-Hub" },
      { icon: '📝', texte: "**Documenter tout** : les questions posées, les réponses reçues, les documents collectés, les décisions prises avec leur date" },
      { icon: '🚫', texte: "**Ne pas informer le client** qu'une déclaration de soupçon est en cours — c'est le **tipping-off**, strictement interdit par la loi" },
      { icon: '⏸️', texte: "En cas de doute sérieux, **suspendre la relation** ou les transactions en cours jusqu'à la décision formelle de l'équipe Compliance" },
    ],
    aretenir: "En cas de doute : STOP — SIGNAL — DOCUMENTE. Ne jamais prendre seul une décision sur un cas sensible ou ambigu.",
  },
  {
    id: 16, emoji: '📢', titre: "La CRF Luxembourg", couleur: '#e91e8c',
    contenu: [
      { icon: '🏛️', texte: "**CRF** = Cellule de Renseignement Financier — autorité luxembourgeoise qui reçoit, analyse et traite les déclarations de soupçon" },
      { icon: '📨', texte: "Les déclarations se font via la plateforme sécurisée **goAML** — système en ligne géré directement par la CRF Luxembourg" },
      { icon: '🔐', texte: "La déclaration est **strictement confidentielle** — le client ne doit jamais savoir qu'un STR (Suspicious Transaction Report) a été déposé" },
      { icon: '⚡', texte: "Après déclaration, la CRF peut **geler les avoirs**, enquêter ou transmettre au Parquet — i-Hub n'a plus la main sur la suite" },
    ],
    aretenir: "Déclarer à la CRF est une obligation légale, pas une option. L'absence de déclaration expose i-Hub et ses dirigeants à des sanctions pénales.",
  },
  {
    id: 17, emoji: '🤫', titre: "Secret professionnel vs obligation de déclarer", couleur: '#e91e8c',
    contenu: [
      { icon: '🔒', texte: "Les PSF sont soumis au **secret professionnel** — ils ne peuvent normalement pas divulguer les informations de leurs clients à des tiers" },
      { icon: '⚖️', texte: "**Exception légale** : l'obligation de déclarer à la CRF **prime** sur le secret professionnel en cas de soupçon de blanchiment ou financement du terrorisme" },
      { icon: '🚫', texte: "Le **tipping-off** (informer le client d'une déclaration ou d'une enquête en cours) reste interdit même après la levée du secret" },
      { icon: '👨‍⚖️', texte: "Cette exception est prévue explicitement par la **loi du 12 novembre 2004** — le déclarant de bonne foi est protégé légalement" },
    ],
    aretenir: "Déclarer à la CRF de bonne foi protège i-Hub légalement, même si le soupçon s'avère infondé à posteriori.",
  },
  {
    id: 18, emoji: '❄️', titre: "Le gel des avoirs", couleur: '#e91e8c',
    contenu: [
      { icon: '🚫', texte: "Le **gel des avoirs** = blocage immédiat de tout fonds, transaction ou service lié à une personne ou entité figurant sur une liste de sanctions" },
      { icon: '📋', texte: "Listes à consulter en priorité : **ONU, UE (règlement 2580/2001), OFAC (USA)**, et liste nationale luxembourgeoise du Trésor" },
      { icon: '⚡', texte: "Le gel est **immédiat et automatique** dès qu'un nom apparaît sur une liste — sans attendre de décision judiciaire" },
      { icon: '📢', texte: "i-Hub doit **notifier la CRF et le Parquet** en cas de gel d'avoirs et tenir un registre précis des actifs gelés" },
    ],
    aretenir: "Le gel s'applique même si la transaction est déjà en cours. En cas de match sur une liste de sanctions : on arrête tout et on appelle l'équipe Compliance.",
  },
  {
    id: 19, emoji: '⚠️', titre: "Les sanctions en cas de manquement", couleur: '#e91e8c',
    contenu: [
      { icon: '💶', texte: "**Amendes administratives** de la CSSF pouvant atteindre **5 millions d'euros** ou 10% du chiffre d'affaires annuel total" },
      { icon: '📛', texte: "**Retrait de la licence PSF** — i-Hub ne pourrait plus exercer son activité au Luxembourg, fin immédiate de l'activité" },
      { icon: '⚖️', texte: "**Poursuites pénales** pour les dirigeants et employés impliqués — jusqu'à 5 ans d'emprisonnement selon les cas" },
      { icon: '📰', texte: "**Publication publique** de la sanction sur le site de la CSSF — atteinte majeure et durable à la réputation d'i-Hub" },
    ],
    aretenir: "Les sanctions AML/KYC sont parmi les plus sévères du secteur financier luxembourgeois. L'ignorance de la loi n'est jamais une excuse recevable.",
  },
  {
    id: 20, emoji: '👨‍💼', titre: "Le rôle de l'équipe Compliance chez i-Hub", couleur: '#e91e8c',
    contenu: [
      { icon: '🎯', texte: "**équipe Compliance** = Anti-Money Laundering Compliance Officer = Responsable AML d'i-Hub, personnellement agréé par la CSSF" },
      { icon: '📋', texte: "Ses missions : définir la politique AML/KYC, valider les dossiers à risque, former les équipes, rédiger le rapport annuel CSSF" },
      { icon: '🚨', texte: "En cas de doute ou red flag détecté, **c'est lui que vous contactez** — il a l'autorité pour bloquer ou autoriser une relation d'affaires" },
      { icon: '🤝', texte: "**Vous aussi, vous avez un rôle** — chaque employé d'i-Hub est un maillon de la chaîne AML. Votre vigilance au quotidien compte !" },
    ],
    aretenir: "L'équipe Compliance est le référent AML d'i-Hub. Mais la conformité est l'affaire de tous — chaque employé est responsable de ce qu'il observe.",
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
  { id: 'id', texte: "🪪 Pièce d'identité dirigeant", ordre: 3 },
  { id: 'licence', texte: '🔐 Licence CSSF client', ordre: 4 },
  { id: 'questionnaire', texte: '📝 Questionnaire AML', ordre: 5 },
  { id: 'validation', texte: '✅ Validation équipe Compliance', ordre: 6 },
]

const QUIZ_VRAI_FAUX = [
  { texte: "i-Hub doit vérifier l'identité de ses clients car c'est une banque", reponse: false, explication: "i-Hub est un PSF de support, pas une banque. Mais la loi LBC/FT s'applique quand même !" },
  { texte: "Un client PEP nécessite des mesures de vigilance renforcées (EDD)", reponse: true, explication: "Exact ! Toute personne politiquement exposée déclenche automatiquement l'EDD." },
  { texte: "Si le dossier KYC est incomplet, on peut quand même signer le contrat", reponse: false, explication: "Non ! Pas de KYC complet = pas de relation d'affaires. C'est une obligation légale." },
  { texte: "Le dossier KYC doit être conservé 10 ans après la fin de la relation", reponse: true, explication: "Exact ! La loi impose une conservation de 10 ans de tous les documents KYC." },
  { texte: "On peut informer un client qu'une déclaration de soupçon a été faite à la CRF", reponse: false, explication: "Non ! C'est le tipping-off, strictement interdit par la loi sous peine de sanctions pénales." },
  { texte: "L'équipe Compliance est la seule personne responsable de la conformité AML chez i-Hub", reponse: false, explication: "Non ! Chaque employé est responsable de signaler les anomalies. La conformité est l'affaire de tous." },
]

export default function ModuleAmlKyc() {
  const router = useRouter()
  const [phase, setPhase] = useState<'intro' | 'fiches' | 'quiz1' | 'quiz2' | 'quiz3' | 'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)

  const [matchSelected, setMatchSelected] = useState<string | null>(null)
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({})
  const [matchDefs] = useState(() => [...QUIZ_MATCHING].sort(() => Math.random() - 0.5))
  const [matchError, setMatchError] = useState<string | null>(null)

  const [briquesDisponibles, setBriquesDisponibles] = useState(() => [...QUIZ_BRIQUES].sort(() => Math.random() - 0.5))
  const [briquesPlacees, setBriquesPlacees] = useState<typeof QUIZ_BRIQUES>([])
  const [briqueMessage, setBriqueMessage] = useState<string | null>(null)

  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean | null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct' | 'wrong' | null>(null)

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
      if (Object.keys(newPairs).length === QUIZ_MATCHING.length) setScore(s => s + 15)
    } else {
      setMatchError(`❌ "${def}" ne correspond pas à ${matchSelected}. Réessaie !`)
      setMatchSelected(null)
    }
  }

  function placerBrique(brique: typeof QUIZ_BRIQUES[0]) {
    const expected = briquesPlacees.length + 1
    if (brique.ordre === expected) {
      const newList = [...briquesPlacees, brique]
      setBriquesPlacees(newList)
      setBriquesDisponibles(d => d.filter(b => b.id !== brique.id))
      setBriqueMessage(null)
      if (brique.ordre === QUIZ_BRIQUES.length) setScore(s => s + 15)
    } else {
      setBriqueMessage(`⚠️ Pas encore ! Le document n°${expected} doit venir avant.`)
    }
  }

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
        const finalScore = correct ? vfScore + 1 : vfScore
        setScore(s => s + finalScore * 5)
        setPhase('resultat')
      }
    }, 2200)
  }

  const base: React.CSSProperties = { minHeight: '100vh', background: '#fff0f5', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1e293b' }

  const NavBar = () => (
    <div style={{ background: 'white', borderBottom: '1px solid #fce4ec', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(233,30,140,0.06)' }}>
      <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #fce4ec', borderRadius: '8px', padding: '6px 12px', color: '#e91e8c', cursor: 'pointer', fontSize: '14px' }}>← Accueil</button>
      <span style={{ color: '#e91e8c', fontWeight: '700', fontSize: '16px' }}>🔍 AML/KYC Rules</span>
      <span style={{ marginLeft: 'auto', background: '#fff0f5', border: '1px solid #fce4ec', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', color: '#e91e8c', fontWeight: '600' }}>⭐ {score} pts</span>
    </div>
  )

  if (phase === 'intro') return (
    <div style={base}>
      <NavBar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🔍</div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>AML/KYC Rules</h1>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>Les obligations directes d'i-Hub envers ses clients</p>
        <div style={{ background: 'white', border: '1px solid #fce4ec', borderRadius: '16px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
          <p style={{ margin: '0 0 16px', fontWeight: '700', color: '#e91e8c' }}>📚 Ce que vous allez apprendre :</p>
          {[
            'Le cadre légal luxembourgeois (loi 2004, GAFI, AMLD5)',
            'CDD, EDD, SDD — les 3 niveaux de vigilance',
            'UBO, PEP, risk scoring — les concepts clés',
            'Comment constituer un dossier KYC complet',
            "Les signaux d'alerte et que faire en cas de doute",
            "Le rôle de la CRF et de l'équipe Compliance d'i-Hub",
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: i < 5 ? '1px solid #fce4ec' : 'none' }}>
              <span style={{ color: '#e91e8c', fontWeight: '700' }}>✓</span>
              <span style={{ color: '#475569', fontSize: '15px' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[{ label: '20 fiches', icon: '📖' }, { label: '3 quiz fun', icon: '🎮' }, { label: '~20 min', icon: '⏱️' }].map((b, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #fce4ec', borderRadius: '12px', padding: '10px 20px', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {b.icon} {b.label}
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('fiches')} style={{ background: '#e91e8c', color: 'white', border: 'none', borderRadius: '12px', padding: '16px 48px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.35)' }}>
          C'est parti ! 🚀
        </button>
      </div>
    </div>
  )

  if (phase === 'fiches') {
    const fiche = FICHES[ficheIndex]
    const progress = ((ficheIndex + 1) / FICHES.length) * 100
    return (
      <div style={base}>
        <NavBar />
        <div style={{ background: '#fce4ec', height: '6px' }}>
          <div style={{ background: fiche.couleur, height: '6px', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: '0 4px 4px 0' }} />
        </div>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>FICHE {ficheIndex + 1} / {FICHES.length}</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '200px' }}>
              {FICHES.map((_, i) => (
                <div key={i} onClick={() => setFicheIndex(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === ficheIndex ? fiche.couleur : i < ficheIndex ? '#e91e8c50' : '#fce4ec', cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: `0 8px 40px ${fiche.couleur}20`, border: `2px solid ${fiche.couleur}30`, overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ background: fiche.couleur, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{fiche.emoji}</div>
              <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>{fiche.titre}</h2>
            </div>
            <div style={{ padding: '20px' }}>
              {fiche.contenu.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < fiche.contenu.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <span style={{ fontSize: '22px', minWidth: '30px', textAlign: 'center' }}>{item.icon}</span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}
                    dangerouslySetInnerHTML={{ __html: item.texte.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${fiche.couleur}">$1</strong>`) }} />
                </div>
              ))}
              <div style={{ background: `${fiche.couleur}10`, border: `1px solid ${fiche.couleur}30`, borderRadius: '12px', padding: '14px', marginTop: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: fiche.couleur, textTransform: 'uppercase', letterSpacing: '1px' }}>À RETENIR</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontStyle: 'italic' }}>{fiche.aretenir}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {ficheIndex > 0 && (
              <button onClick={() => setFicheIndex(i => i - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #fce4ec', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>← Précédent</button>
            )}
            <button onClick={() => ficheIndex < FICHES.length - 1 ? setFicheIndex(i => i + 1) : setPhase('quiz1')}
              style={{ flex: 2, padding: '14px', background: fiche.couleur, border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: `0 4px 16px ${fiche.couleur}40` }}>
              {ficheIndex < FICHES.length - 1 ? `Fiche suivante (${ficheIndex + 2}/${FICHES.length}) →` : '🎮 Passer aux quiz !'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz1') {
    const done = Object.keys(matchPairs).length === QUIZ_MATCHING.length
    return (
      <div style={base}>
        <NavBar />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ background: '#7c3aed15', color: '#7c3aed', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>QUIZ 1/3 · ASSOCIER LES PAIRES</span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' }}>🧩 Reliez chaque sigle à sa définition</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Cliquez d'abord sur un sigle, puis sur sa définition</p>
          </div>
          {matchError && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '14px', textAlign: 'center' }}>{matchError}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Sigles</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {QUIZ_MATCHING.map(m => {
                  const isPaired = !!matchPairs[m.sigle]
                  const isSelected = matchSelected === m.sigle
                  return (
                    <button key={m.sigle} onClick={() => handleMatchSigle(m.sigle)} disabled={isPaired}
                      style={{ padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: isPaired ? 'default' : 'pointer', transition: 'all 0.2s', background: isPaired ? '#d1fae5' : isSelected ? '#7c3aed' : 'white', color: isPaired ? '#059669' : isSelected ? 'white' : '#1e293b', boxShadow: isSelected ? '0 4px 16px #7c3aed50' : '0 2px 8px rgba(0,0,0,0.06)', transform: isSelected ? 'scale(1.04)' : 'scale(1)', border: isPaired ? '1.5px solid #6ee7b7' : isSelected ? '1.5px solid #7c3aed' : '1.5px solid #e2e8f0' } as React.CSSProperties}>
                      {isPaired ? '✓ ' : ''}{m.sigle}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Définitions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchDefs.map(m => {
                  const isPaired = Object.values(matchPairs).includes(m.definition)
                  return (
                    <button key={m.definition} onClick={() => handleMatchDef(m.definition)} disabled={isPaired || !matchSelected}
                      style={{ padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: (isPaired || !matchSelected) ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', background: isPaired ? '#d1fae5' : matchSelected ? 'white' : '#f8fafc', color: isPaired ? '#059669' : '#1e293b', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: isPaired ? '1.5px solid #6ee7b7' : '1.5px solid #e2e8f0', opacity: (!matchSelected && !isPaired) ? 0.6 : 1 } as React.CSSProperties}>
                      {isPaired ? '✓ ' : ''}{m.definition}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          {done && (
            <>
              <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '28px', margin: '0 0 8px' }}>🎉</p>
                <p style={{ fontWeight: '800', color: '#059669', fontSize: '18px', margin: '0 0 4px' }}>Parfait ! Tous les sigles sont associés !</p>
                <p style={{ color: '#6ee7b7', margin: 0, fontSize: '14px' }}>+15 points gagnés</p>
              </div>
              <button onClick={() => setPhase('quiz2')} style={{ width: '100%', padding: '16px', background: '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>Quiz suivant →</button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'quiz2') {
    const done = briquesPlacees.length === QUIZ_BRIQUES.length
    return (
      <div style={base}>
        <NavBar />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ background: '#0891b215', color: '#0891b2', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>QUIZ 2/3 · CONSTRUIRE LE DOSSIER KYC</span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' }}>🧱 Assemblez les briques dans l'ordre !</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Cliquez les documents dans le bon ordre pour constituer un dossier KYC complet</p>
          </div>
          <div style={{ background: 'white', border: '2px dashed #0891b240', borderRadius: '16px', padding: '20px', marginBottom: '20px', minHeight: '100px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>📁 Votre dossier KYC</p>
            {briquesPlacees.length === 0
              ? <p style={{ color: '#cbd5e1', textAlign: 'center', fontSize: '14px', padding: '16px 0' }}>Cliquez sur les documents ci-dessous dans le bon ordre...</p>
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
          {briqueMessage && <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#92400e', fontSize: '14px', textAlign: 'center' }}>{briqueMessage}</div>}
          {briquesDisponibles.length > 0 && (
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Documents disponibles</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {briquesDisponibles.map(b => (
                  <button key={b.id} onClick={() => placerBrique(b)}
                    style={{ padding: '14px 16px', background: 'white', border: '2px solid #0891b230', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#0891b2', textAlign: 'left', transition: 'all 0.15s' }}
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
                <p style={{ fontWeight: '800', color: '#059669', fontSize: '18px', margin: '0 0 4px' }}>Dossier KYC complet et dans le bon ordre !</p>
                <p style={{ color: '#6ee7b7', margin: 0, fontSize: '14px' }}>+15 points gagnés</p>
              </div>
              <button onClick={() => setPhase('quiz3')} style={{ width: '100%', padding: '16px', background: '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>Dernier quiz →</button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'quiz3') {
    const q = QUIZ_VRAI_FAUX[vfIndex]
    return (
      <div style={{ ...base, transition: 'background 0.3s', background: vfAnimation === 'correct' ? '#d1fae5' : vfAnimation === 'wrong' ? '#fee2e2' : '#fff0f5' }}>
        <NavBar />
        <div style={{ background: vfAnimation === 'correct' ? '#6ee7b7' : vfAnimation === 'wrong' ? '#fca5a5' : '#fce4ec', height: '6px' }}>
          <div style={{ background: '#e91e8c', height: '6px', width: `${(vfIndex / QUIZ_VRAI_FAUX.length) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <span style={{ background: '#e91e8c15', color: '#e91e8c', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '24px' }}>
            QUIZ 3/3 · VRAI OU FAUX — {vfIndex + 1}/{QUIZ_VRAI_FAUX.length}
          </span>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: '28px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '19px', fontWeight: '700', color: '#1e293b', lineHeight: 1.5, margin: 0 }}>{q.texte}</p>
          </div>
          {vfRepondu === null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => repondreVF(true)} style={{ padding: '20px', background: '#d1fae5', border: '2px solid #6ee7b7', borderRadius: '16px', fontSize: '22px', fontWeight: '800', color: '#059669', cursor: 'pointer' }}>✅ VRAI</button>
              <button onClick={() => repondreVF(false)} style={{ padding: '20px', background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '16px', fontSize: '22px', fontWeight: '800', color: '#dc2626', cursor: 'pointer' }}>❌ FAUX</button>
            </div>
          ) : (
            <div style={{ background: vfAnimation === 'correct' ? '#d1fae5' : '#fee2e2', border: `2px solid ${vfAnimation === 'correct' ? '#6ee7b7' : '#fca5a5'}`, borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '28px', margin: '0 0 8px' }}>{vfAnimation === 'correct' ? '🎉' : '😅'}</p>
              <p style={{ fontWeight: '800', color: vfAnimation === 'correct' ? '#059669' : '#dc2626', fontSize: '18px', margin: '0 0 8px' }}>{vfAnimation === 'correct' ? 'Bravo !' : 'Pas tout à fait...'}</p>
              <p style={{ color: '#475569', fontSize: '15px', margin: 0, fontStyle: 'italic' }}>{q.explication}</p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {QUIZ_VRAI_FAUX.map((_, i) => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i <= vfIndex ? '#e91e8c' : '#fce4ec' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalScore = Math.min(100, score)
  const medal = totalScore >= 80 ? '🥇' : totalScore >= 50 ? '🥈' : '🥉'
  const msg = totalScore >= 80 ? 'Expert AML/KYC !' : totalScore >= 50 ? 'Bon résultat, continuez !' : 'Relisez les fiches et réessayez !'
  return (
    <div style={base}>
      <NavBar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>{medal}</div>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' }}>{msg}</h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px' }}>Module AML/KYC Rules terminé — 20 fiches maîtrisées !</p>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(233,30,140,0.10)', marginBottom: '24px' }}>
          <div style={{ fontSize: '56px', fontWeight: '800', color: '#e91e8c', marginBottom: '4px' }}>{totalScore}<span style={{ fontSize: '24px' }}>/100</span></div>
          <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: '14px' }}>Score total</p>
          <div style={{ background: '#fff0f5', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, #e91e8c, #f472b6)', height: '12px', width: `${totalScore}%`, borderRadius: '8px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button onClick={() => router.push('/')} style={{ padding: '16px', background: '#e91e8c', border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>← Retour aux modules</button>
          <button onClick={() => { setPhase('intro'); setScore(0); setMatchPairs({}); setMatchSelected(null); setBriquesDisponibles([...QUIZ_BRIQUES].sort(() => Math.random() - 0.5)); setBriquesPlacees([]); setVfIndex(0); setVfScore(0) }}
            style={{ padding: '14px', background: 'white', border: '1px solid #fce4ec', borderRadius: '12px', color: '#e91e8c', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            🔄 Recommencer ce module
          </button>
        </div>
      </div>
    </div>
  )
}
