'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e91e8c'

const UI = {
  fr: {
    title: 'DDR — Due Diligence Renforcée',
    subtitle: 'Quand les contrôles standards ne suffisent pas — le rôle d’i-Hub face aux dossiers à risque élevé',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Ce qui déclenche une Due Diligence Renforcée (DDR)',
      'Les différences entre vigilance standard et renforcée',
      'Les documents supplémentaires requis en DDR',
      'Le rôle d’i-Hub dans les dossiers DDR',
      'PPE, pays à risque, structures complexes : comment vérifier',
      'Ce que i-Hub ne décide jamais seul',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · DDR OU PAS ?', q1title: '🔴 Ce profil déclenche-t-il une DDR ?',
    ddr: '🔴 DDR requise', std: '🟢 Vigilance standard',
    q2label: 'QUIZ 2/3 · VRAI OU FAUX', q2title: '✅ Vrai ou Faux — DDR en pratique',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q3label: 'QUIZ 3/3 · CAS DDR', q3title: '🤔 Quelle est la bonne action ?',
    resultTitle: 'Module DDR terminé — Vous gérez les dossiers complexes !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    medal_gold: 'Expert DDR !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Terminer →',
  },
  en: {
    title: 'EDD — Enhanced Due Diligence',
    subtitle: 'When standard controls are not enough — i-Hub’s role with high-risk files',
    learn: '📚 What you will learn:',
    learnItems: [
      'What triggers Enhanced Due Diligence (EDD)',
      'Differences between standard and enhanced vigilance',
      'Additional documents required in EDD',
      'i-Hub’s role in EDD files',
      'PEPs, high-risk countries, complex structures: how to verify',
      'What i-Hub never decides alone',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · EDD OR NOT?', q1title: '🔴 Does this profile trigger EDD?',
    ddr: '🔴 EDD required', std: '🟢 Standard vigilance',
    q2label: 'QUIZ 2/3 · TRUE OR FALSE', q2title: '✅ True or False — EDD in practice',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q3label: 'QUIZ 3/3 · EDD CASES', q3title: '🤔 What is the correct action?',
    resultTitle: 'EDD module complete — You handle complex files!',
    backHome: '← Back', restart: '🔄 Restart',
    medal_gold: 'EDD Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Finish →',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🔴', titre:'C’est quoi la DDR ?', contenu:[
    { icon:'🔴', texte:'La **Due Diligence Renforcée** (DDR) est un niveau de contrôle plus approfondi que la vigilance standard, appliqué aux clients à risque élevé' },
    { icon:'📜', texte:'Imposée par la **loi luxembourgeoise de 2004** et les directives européennes AML — pas optionnelle pour les cas concernés' },
    { icon:'🏦', texte:'C’est le **PSF** qui décide de l’appliquer selon sa politique de risque — i-Hub intervient pour vérifier les documents supplémentaires si le SLA le prévoit' },
    { icon:'🔍', texte:'DDR = plus de documents à collecter par le PSF + vérifications plus approfondies par i-Hub dans le cadre du SLA' },
  ], aretenir:'DDR = contrôles renforcés pour les profils à risque élevé. Obligatoire dans certains cas. Décidée par le PSF, vérifiée par i-Hub sur instruction.' },

  { id:2, emoji:'🔄', titre:'Standard vs Renforcée : les différences', contenu:[
    { icon:'🟢', texte:'**Vigilance standard** : identité + domicile + activité professionnelle + source des fonds de base' },
    { icon:'🔴', texte:'**DDR** : idem + source des fonds détaillée (SOF) + source du patrimoine (SOW) + informations sur les bénéficiaires effectifs (UBO) + surveillance accrue' },
    { icon:'📅', texte:'**Fréquence de révision** : standard = périodique. DDR = plus fréquente, définie par le PSF selon le profil de risque' },
    { icon:'💻', texte:'**Approbation hiérarchique** : l’entrée en relation DDR nécessite souvent l’approbation d’un responsable Compliance au sein du PSF' },
  ], aretenir:'DDR = vigilance standard + plus de documents + SOF/SOW détaillés + révision plus fréquente. Le PSF décide, i-Hub vérifie.' },

  { id:3, emoji:'👥', titre:'Déclencheur n°1 : Les PPE', contenu:[
    { icon:'👥', texte:'Toute **PPE** (Personne Politiquement Exposée) déclenche **automatiquement** une DDR — pas d’exception, pas d’appréciation discrétionnaire' },
    { icon:'👨‍👩‍👧', texte:'Sont également PPE : les **membres de la famille proche** (conjoint, enfants, parents) et les **personnes liées** (associés proches)' },
    { icon:'📝', texte:'Documents supplémentaires pour une PPE : justificatif de fonction, source du patrimoine détaillée, médias adverses (negative news)' },
    { icon:'🔍', texte:'i-Hub vérifie la présence de tous les documents DDR requis pour une PPE et signale tout manquant au PSF' },
  ], aretenir:'PPE = DDR automatique et obligatoire. Famille et associés inclus. i-Hub vérifie la complétude du dossier DDR.' },

  { id:4, emoji:'🌍', titre:'Déclencheur n°2 : Pays à risque élevé', contenu:[
    { icon:'🌍', texte:'Tout client final lié à un **pays à haut risque** (liste GAFI, liste noire UE) déclenche une DDR' },
    { icon:'📌', texte:'Le lien au pays peut être : nationalité, résidence, source des fonds, siège social de l’entité cliente' },
    { icon:'🔄', texte:'Les listes sont mises à jour par le GAFI et l’UE : le PSF est responsable de consulter les listes en vigueur' },
    { icon:'🔍', texte:'i-Hub signale tout lien à un pays à risque visible dans les documents — le PSF décide du niveau de DDR à appliquer' },
  ], aretenir:'Pays GAFI/UE à risque = DDR. i-Hub détecte le lien pays dans les documents. Le PSF décide du traitement.' },

  { id:5, emoji:'🏢', titre:'Déclencheur n°3 : Structures complexes', contenu:[
    { icon:'🏢', texte:'Les **structures légales complexes** — holdings en cascade, trusts, foundations, sociétés offshores — déclenchent une DDR' },
    { icon:'🤔', texte:'La complexité peut être utilisée pour dissimuler l’identité du bénéficiaire effectif réel (UBO)' },
    { icon:'📋', texte:'Documents supplémentaires : organigramme complet, statuts de chaque entité intermédiaire, documents d’identité de chaque UBO' },
    { icon:'🔍', texte:'i-Hub vérifie la cohérence de la structure : les statuts concordent-ils avec l’organigramme ? Les UBO sont-ils bien identifiés ?' },
  ], aretenir:'Structure complexe = DDR. i-Hub vérifie la cohérence entre l’organigramme, les statuts et les documents UBO.' },

  { id:6, emoji:'💰', titre:'Déclencheur n°4 : Transactions inhabituelles', contenu:[
    { icon:'💰', texte:'Des transactions **inhabituelles par leur montant, fréquence ou nature** par rapport au profil du client final déclenchent une révision DDR' },
    { icon:'⚠️', texte:'Exemples : virement soudain d’un montant élevé depuis un pays à risque, activité intense sur un compte habituellement dormant' },
    { icon:'📊', texte:'Le PSF utilise ses outils de **monitoring de transactions** pour détecter ces anomalies' },
    { icon:'🔍', texte:'i-Hub peut être mandaté pour une revue documentaire du dossier existant suite à une alerte transaction — sur instruction du PSF' },
  ], aretenir:'Transaction inhabituelle = possible DDR ou revue du dossier. Le PSF décide. i-Hub intervient sur instruction pour la revue documentaire.' },

  { id:9, emoji:'📰', titre:'Les médias adverses (Negative News)', contenu:[
    { icon:'📰', texte:'La recherche de **médias adverses** consiste à rechercher des articles de presse négatifs sur un client final (enquêtes, condamnations, scandales)' },
    { icon:'🏦', texte:'C’est une obligation **du PSF** en DDR — pas une tâche d’i-Hub sauf si le SLA le prévoit explicitement' },
    { icon:'🔍', texte:'Si i-Hub detecte fortuitement un article négatif sur un client final lors de ses vérifications, il le **signale au PSF** immédiatement' },
    { icon:'🛑', texte:'i-Hub ne décide pas de la suite — c’est le PSF qui évalue l’impact et décide des mesures à prendre' },
  ], aretenir:'Negative news = obligation du PSF. Si i-Hub détecte fortuitement une information négative, il signale au PSF immédiatement.' },

  { id:10, emoji:'👤', titre:'Vérification de la PPE : les éléments spécifiques', contenu:[
    { icon:'👤', texte:'**Identification de la fonction** : quel poste, quelle institution, quelle période ? Le document doit l’indiquer clairement' },
    { icon:'⏱️', texte:'**Durée du statut PPE** : une personne reste PPE pendant **12 mois** après avoir quitté sa fonction — contrôles maintenus' },
    { icon:'💵', texte:'**Source du patrimoine** : un ministre ne peut pas justifier 10 millions d’euros uniquement avec son salaire — à documenter' },
    { icon:'🔍', texte:'i-Hub vérifie la présence des documents identifiant la fonction et la SOW — signal si manquant ou incohérent' },
  ], aretenir:'PPE : vérifier la fonction + SOW + negative news (PSF). Le statut PPE dure 12 mois après la fin de la fonction.' },

  { id:11, emoji:'🏢', titre:'Les structures : identifier l’UBO réel', contenu:[
    { icon:'🏢', texte:'L’**UBO** (Ultimate Beneficial Owner) est la personne physique qui contrôle en dernier ressort l’entité cliente (> 25%)' },
    { icon:'📊', texte:'En DDR, l’**organigramme complet** de la structure doit être fourni — jusqu’à la personne physique finale' },
    { icon:'⚠️', texte:'Piège fréquent : plusieurs actionnaires à 24,9% chacun pour éviter le seuil des 25% — signal au PSF même si chacun < 25%' },
    { icon:'🔍', texte:'i-Hub vérifie que l’organigramme et les statuts concordent — et que tous les UBO déclarés > 25% ont un dossier d’identité complet' },
  ], aretenir:'UBO = personne physique > 25%. En DDR, organigramme jusqu’à la personne physique + identité de chaque UBO. Structure suspecte = signal.' },

  { id:12, emoji:'🔄', titre:'La révision DDR périodique', contenu:[
    { icon:'🔄', texte:'Les dossiers DDR ne sont pas statiques — ils doivent être **révisés périodiquement** par le PSF (fréquence selon le risque)' },
    { icon:'📅', texte:'Changements qui déclenchent une révision immédiate : changement de statut PPE, transactions inhabituelles, nouveau lien avec un pays à risque' },
    { icon:'📎', texte:'i-Hub peut être mandaté pour des **révisions documentaires périodiques** — vérifier que les documents DDR sont toujours valides et complets' },
    { icon:'⏰', texte:'Documents DDR qui expirent : pièces d’identité, justificatifs de domicile, certains justificatifs SOF — à renouveler' },
  ], aretenir:'DDR = processus continu, pas ponctuel. Révisions périodiques obligatoires. i-Hub peut être mandaté pour les révisions documentaires.' },

  { id:13, emoji:'🛑', titre:'Ce que i-Hub NE décide PAS en DDR', contenu:[
    { icon:'❌', texte:'i-Hub ne décide **pas** si un client est une PPE ou non — il signale les indices visibles, le PSF tranche' },
    { icon:'❌', texte:'i-Hub ne décide **pas** si le niveau de DDR est suffisant — c’est la politique de risque du PSF' },
    { icon:'❌', texte:'i-Hub ne décide **pas** si la source des fonds est légitime — il vérifie la présence et la cohérence des documents' },
    { icon:'❌', texte:'i-Hub ne décide **pas** d’accepter ou de refuser un client — c’est la responsabilité du PSF' },
  ], aretenir:'En DDR comme ailleurs : i-Hub vérifie et signale. Le PSF décide. Jamais l’inverse.' },

  { id:14, emoji:'📝', titre:'Les documents spécifiques DDR à vérifier', contenu:[
    { icon:'📝', texte:'**Justificatif de fonction PPE** : arrêté de nomination, décret, publication officielle — doit identifier clairement le rôle' },
    { icon:'🏠', texte:'**Documents SOW** : déclarations fiscales, actes notariés, contrats de cession — justifiant la constitution du patrimoine' },
    { icon:'🏢', texte:'**Organigramme certifié** : daté, signé, cohérent avec les statuts de chaque société dans la chaîne' },
    { icon:'👤', texte:'**Identité de chaque UBO** : passeport valide + justificatif de domicile pour chaque personne physique détenant > 25%' },
  ], aretenir:'4 documents clés DDR : justificatif de fonction + SOW + organigramme certifié + identité de chaque UBO. Tout manquant = signal au PSF.' },

  { id:15, emoji:'🌐', titre:'DDR et pays à risque : ce que vérifie i-Hub', contenu:[
    { icon:'🌐', texte:'Pour un client final lié à un pays à risque : vérifier que le dossier contient les **justificatifs d’activité légitime** dans ce pays' },
    { icon:'💵', texte:'La **source des fonds** provenant d’un pays à risque doit être justifiée de manière particulièrement détaillée' },
    { icon:'📌', texte:'i-Hub vérifie la présence des documents supplémentaires prévus dans le SLA pour ce type de profil' },
    { icon:'🛑', texte:'Tout lien à un pays à risque non documenté = signal au PSF, même si le PSF a déjà accepté le dossier' },
  ], aretenir:'Pays à risque = documents supplémentaires. i-Hub vérifie leur présence et cohérence. Lien non documenté = signal.' },

  { id:16, emoji:'📎', titre:'Comment signaler en DDR', contenu:[
    { icon:'1️⃣', texte:'**Préciser le déclencheur DDR** : PPE, pays à risque, structure complexe, transaction inhabituelle' },
    { icon:'2️⃣', texte:'**Lister les documents manquants** : SOF, SOW, organigramme, identité UBO — avec précision' },
    { icon:'3️⃣', texte:'**Signaler les incohérences** : discordance entre organigramme et statuts, SOW incompatible avec le profil' },
    { icon:'4️⃣', texte:'**Archiver** le rapport DDR — plus détaillé qu’un rapport standard, car les enjeux sont plus élevés' },
  ], aretenir:'Rapport DDR = plus détaillé que standard. Déclencheur + manquants + incohérences. Archive soignée pour protection d’i-Hub.' },

  { id:17, emoji:'⚠️', titre:'Les red flags DDR à signaler', contenu:[
    { icon:'🔴', texte:'**Refus de fournir** les documents DDR demandés par le PSF sans justification valide' },
    { icon:'🔴', texte:'**UBO qui change** à chaque demande de mise à jour — structure visiblement opaque' },
    { icon:'🔴', texte:'**SOW incompatible** avec la fonction ou le profil : patrimoine disproportionné par rapport à l’activité déclarée' },
    { icon:'🔴', texte:'**Organigramme incomplet** ou refusant d’aller jusqu’à la personne physique finale' },
  ], aretenir:'Red flags DDR : refus de fournir, UBO instable, SOW disproportionnée, organigramme tronqué. Chacun = signal immédiat au PSF.' },

  { id:18, emoji:'📊', titre:'Résumé : les 4 déclencheurs DDR', contenu:[
    { icon:'👥', texte:'**PPE** : personne politiquement exposée ou proche — DDR automatique et obligatoire' },
    { icon:'🌍', texte:'**Pays à risque** : nationalité, résidence ou source des fonds liée à un pays GAFI/UE à risque' },
    { icon:'🏢', texte:'**Structure complexe** : holding, trust, fondation, offshore — opécité potentielle sur l’UBO' },
    { icon:'💰', texte:'**Transaction inhabituelle** : montant, fréquence ou nature anormaux par rapport au profil' },
  ], aretenir:'4 déclencheurs DDR : PPE + pays à risque + structure complexe + transaction inhabituelle. Le PSF décide, i-Hub vérifie.' },

  { id:19, emoji:'💡', titre:'La DDR vue d’i-Hub : ce qui change concrètement', contenu:[
    { icon:'📝', texte:'**Plus de documents** : SOF détaillée, SOW, organigramme, identité UBO — la checklist est plus longue' },
    { icon:'🔍', texte:'**Vérifications croisées supplémentaires** : organigramme vs statuts, SOW vs profil professionnel, SOF vs opérations concernées' },
    { icon:'📢', texte:'**Signalement plus détaillé** : chaque manquant et chaque incohérence sont décrits avec précision dans le rapport' },
    { icon:'📎', texte:'**Archive plus complète** : conserver tous les documents vérifiés + le rapport DDR daté et détaillé' },
  ], aretenir:'DDR pour i-Hub = checklist plus longue + vérifications croisées supplémentaires + rapport plus détaillé. Logique = la même.' },

  { id:20, emoji:'🎓', titre:'Résumé : DDR en 5 points', contenu:[
    { icon:'1️⃣', texte:'**DDR** = contrôles renforcés pour les profils à risque élevé — PPE, pays à risque, structures complexes, transactions inhabituelles' },
    { icon:'2️⃣', texte:'**Le PSF** décide d’appliquer la DDR et collecte les documents supplémentaires' },
    { icon:'3️⃣', texte:'**i-Hub** vérifie la complétude et la cohérence des documents DDR si prévu au SLA' },
    { icon:'4️⃣', texte:'**Tout manquant ou incohérence** est signalé au PSF dans un rapport détaillé' },
    { icon:'5️⃣', texte:'**i-Hub ne décide jamais** du niveau de risque ni de l’acceptabilité du client — toujours le PSF' },
  ], aretenir:'DDR : plus de documents, plus de vérifications, même logique. PSF décide, i-Hub vérifie sur instruction.' },
]

const FICHES_EN = [
  { id:1, emoji:'🔴', titre:'What is EDD?', contenu:[
    { icon:'🔴', texte:'**Enhanced Due Diligence** (EDD) is a deeper level of control than standard vigilance, applied to high-risk clients' },
    { icon:'📜', texte:'Required by the **Luxembourg 2004 law** and EU AML directives — not optional for covered cases' },
    { icon:'🏦', texte:'It is the **PSF** that decides to apply it based on its risk policy — i-Hub intervenes to verify additional documents if the SLA provides' },
    { icon:'🔍', texte:'EDD = more documents to collect by PSF + more thorough verifications by i-Hub within the SLA scope' },
  ], aretenir:'EDD = enhanced controls for high-risk profiles. Mandatory in certain cases. Decided by PSF, verified by i-Hub on instruction.' },
  { id:2, emoji:'🔄', titre:'Standard vs Enhanced: the differences', contenu:[
    { icon:'🟢', texte:'**Standard vigilance**: identity + residence + professional activity + basic source of funds' },
    { icon:'🔴', texte:'**EDD**: same + detailed source of funds (SOF) + source of wealth (SOW) + UBO information + enhanced monitoring' },
    { icon:'📅', texte:'**Review frequency**: standard = periodic. EDD = more frequent, defined by PSF per risk profile' },
    { icon:'💻', texte:'**Hierarchical approval**: EDD relationship entry often requires Compliance management approval within the PSF' },
  ], aretenir:'EDD = standard vigilance + more documents collected by PSF + more frequent review. PSF decides, i-Hub verifies.' },
  { id:3, emoji:'👥', titre:'Trigger #1: PEPs', contenu:[
    { icon:'👥', texte:'Any **PEP** (Politically Exposed Person) **automatically** triggers EDD — no exceptions, no discretionary assessment' },
    { icon:'👨‍👩‍👧', texte:'Also PEPs: **immediate family members** (spouse, children, parents) and **close associates**' },
    { icon:'📝', texte:'Additional PEP documents: function certificate, detailed source of wealth, adverse media (negative news)' },
    { icon:'🔍', texte:'i-Hub verifies the presence of all EDD documents required for a PEP and flags any missing ones to the PSF' },
  ], aretenir:'PEP = automatic and mandatory EDD. Family and associates included. i-Hub verifies EDD file completeness.' },
  { id:4, emoji:'🌍', titre:'Trigger #2: High-risk countries', contenu:[
    { icon:'🌍', texte:'Any final client linked to a **high-risk country** (FATF list, EU blacklist) triggers EDD' },
    { icon:'📌', texte:'Country link can be: nationality, residency, source of funds, registered office of client entity' },
    { icon:'🔄', texte:'Lists are updated by FATF and EU: the PSF is responsible for consulting current lists' },
    { icon:'🔍', texte:'i-Hub flags any high-risk country link visible in documents — the PSF decides on the EDD level to apply' },
  ], aretenir:'FATF/EU high-risk country = EDD. i-Hub detects the country link in documents. PSF decides on treatment.' },
  { id:5, emoji:'🏢', titre:'Trigger #3: Complex structures', contenu:[
    { icon:'🏢', texte:'**Complex legal structures** — cascading holdings, trusts, foundations, offshore companies — trigger EDD' },
    { icon:'🤔', texte:'Complexity may be used to conceal the identity of the real ultimate beneficial owner (UBO)' },
    { icon:'📋', texte:'Additional documents: full organisational chart, articles of each intermediate entity, identity documents of each UBO' },
    { icon:'🔍', texte:'i-Hub verifies structure consistency: do articles match the org chart? Are all UBOs properly identified?' },
  ], aretenir:'Complex structure = EDD. i-Hub verifies consistency between org chart, articles and UBO documents.' },
  { id:6, emoji:'💰', titre:'Trigger #4: Unusual transactions', contenu:[
    { icon:'💰', texte:'Transactions **unusual in amount, frequency or nature** relative to the final client’s profile trigger an EDD review' },
    { icon:'⚠️', texte:'Examples: sudden large transfer from a high-risk country, intense activity on a normally dormant account' },
    { icon:'📊', texte:'The PSF uses its **transaction monitoring** tools to detect these anomalies' },
    { icon:'🔍', texte:'i-Hub may be mandated for a documentary review of the existing file following a transaction alert — on PSF instruction' },
  ], aretenir:'Unusual transaction = possible EDD or file review. PSF decides. i-Hub intervenes on instruction for documentary review.' },

  { id:9, emoji:'📰', titre:'Adverse media (Negative News)', contenu:[
    { icon:'📰', texte:'**Adverse media screening** involves searching for negative press articles about a final client (investigations, convictions, scandals)' },
    { icon:'🏦', texte:'This is a **PSF obligation** in EDD — not an i-Hub task unless explicitly provided for in the SLA' },
    { icon:'🔍', texte:'If i-Hub incidentally detects a negative article about a final client during its verifications, it **flags to PSF** immediately' },
    { icon:'🛑', texte:'i-Hub does not decide on follow-up — the PSF assesses the impact and decides on measures to take' },
  ], aretenir:'Negative news = PSF obligation. If i-Hub incidentally detects negative information, it flags to PSF immediately.' },
  { id:10, emoji:'👤', titre:'PEP verification: specific elements', contenu:[
    { icon:'👤', texte:'**Function identification**: which role, which institution, which period? The document must state this clearly' },
    { icon:'⏱️', texte:'**PEP status duration**: a person remains PEP for **12 months** after leaving their function — controls maintained' },
    { icon:'💵', texte:'**Source of wealth**: a minister cannot justify €10 million solely with their salary — must be documented' },
    { icon:'🔍', texte:'i-Hub verifies presence of documents identifying the function and SOW — flags if missing or inconsistent' },
  ], aretenir:'PEP: verify presence of function documents. PEP status lasts 12 months after leaving the function.' },
  { id:11, emoji:'🏢', titre:'Structures: identifying the real UBO', contenu:[
    { icon:'🏢', texte:'The **UBO** (Ultimate Beneficial Owner) is the individual who ultimately controls the client entity (> 25%)' },
    { icon:'📊', texte:'In EDD, the **complete organisational chart** must be provided — down to the final individual' },
    { icon:'⚠️', texte:'Common trap: multiple shareholders at 24.9% each to avoid the 25% threshold — flag to PSF even if each < 25%' },
    { icon:'🔍', texte:'i-Hub verifies org chart and articles are consistent — and that all declared UBOs > 25% have a complete identity file' },
  ], aretenir:'UBO = individual > 25%. In EDD, org chart down to individual + identity of each UBO. Suspicious structure = flag.' },
  { id:12, emoji:'🔄', titre:'Periodic EDD review', contenu:[
    { icon:'🔄', texte:'EDD files are not static — they must be **periodically reviewed** by the PSF (frequency per risk level)' },
    { icon:'📅', texte:'Changes triggering immediate review: change of PEP status, unusual transactions, new link to high-risk country' },
    { icon:'📎', texte:'i-Hub may be mandated for **periodic documentary reviews** — verify EDD documents are still valid and complete' },
    { icon:'⏰', texte:'Expiring EDD documents: identity documents, proof of residence, some SOF documents — to be renewed' },
  ], aretenir:'EDD = ongoing process, not one-off. Periodic reviews mandatory. i-Hub may be mandated for documentary reviews.' },
  { id:13, emoji:'🛑', titre:'What i-Hub does NOT decide in EDD', contenu:[
    { icon:'❌', texte:'i-Hub does **not** decide whether a client is a PEP or not — it flags visible indicators, PSF decides' },
    { icon:'❌', texte:'i-Hub does **not** decide whether the EDD level is sufficient — that is the PSF’s risk policy' },
    { icon:'❌', texte:'i-Hub does **not** decide whether the source of funds is legitimate — it checks document presence and consistency' },
    { icon:'❌', texte:'i-Hub does **not** decide to accept or reject a client — that is the PSF’s responsibility' },
  ], aretenir:'In EDD as elsewhere: i-Hub verifies and flags. The PSF decides. Never the reverse.' },
  { id:14, emoji:'📝', titre:'Specific EDD documents to verify', contenu:[
    { icon:'📝', texte:'**PEP function certificate**: appointment decree, official publication — must clearly identify the role' },
    { icon:'🏠', texte:'**SOW documents**: tax declarations, notarial deeds, transfer agreements — justifying wealth build-up' },
    { icon:'🏢', texte:'**Certified org chart**: dated, signed, consistent with each company’s articles in the chain' },
    { icon:'👤', texte:'**Each UBO’s identity**: valid passport + proof of residence for each individual holding > 25%' },
  ], aretenir:'3 key EDD documents for i-Hub: function certificate + certified org chart + each UBO’s identity. Any missing = flag to PSF.' },
  { id:15, emoji:'🌐', titre:'EDD and high-risk countries: what i-Hub verifies', contenu:[
    { icon:'🌐', texte:'For a final client linked to a high-risk country: verify the file contains **legitimate activity justification** in that country' },
    { icon:'💵', texte:'**Source of funds** from a high-risk country must be justified in particularly detailed manner' },
    { icon:'📌', texte:'i-Hub checks presence of additional documents specified in the SLA for this profile type' },
    { icon:'🛑', texte:'Any undocumented link to a high-risk country = flag to PSF, even if PSF has already accepted the file' },
  ], aretenir:'High-risk country = additional documents. i-Hub checks their presence and consistency. Undocumented link = flag.' },
  { id:16, emoji:'📎', titre:'How to flag in EDD', contenu:[
    { icon:'1️⃣', texte:'**State the EDD trigger**: PEP, high-risk country, complex structure, unusual transaction' },
    { icon:'2️⃣', texte:'**List missing documents**: SOF, SOW, org chart, UBO identity — with precision' },
    { icon:'3️⃣', texte:'**Flag inconsistencies**: discrepancy between org chart and articles, SOW incompatible with profile' },
    { icon:'4️⃣', texte:'**Archive** the EDD report — more detailed than a standard report, given the higher stakes' },
  ], aretenir:'EDD report = more detailed than standard. Trigger + missing items + inconsistencies. Careful archive for i-Hub protection.' },
  { id:17, emoji:'⚠️', titre:'EDD red flags to flag', contenu:[
    { icon:'🔴', texte:'**Refusal to provide** EDD documents requested by PSF without valid justification' },
    { icon:'🔴', texte:'**UBO that changes** with each update request — visibly opaque structure' },
    { icon:'🔴', texte:'**SOW incompatible** with function or profile: disproportionate wealth vs declared activity' },
    { icon:'🔴', texte:'**Incomplete org chart** or one that stops before reaching the final individual' },
  ], aretenir:'EDD red flags: refusal to provide, unstable UBO, truncated org chart. Each = immediate flag to PSF.' },
  { id:18, emoji:'📊', titre:'Summary: the 4 EDD triggers', contenu:[
    { icon:'👥', texte:'**PEP**: politically exposed person or associate — automatic and mandatory EDD' },
    { icon:'🌍', texte:'**High-risk country**: nationality, residency or source of funds linked to FATF/EU high-risk country' },
    { icon:'🏢', texte:'**Complex structure**: holding, trust, foundation, offshore — potential UBO opacity' },
    { icon:'💰', texte:'**Unusual transaction**: abnormal amount, frequency or nature relative to profile' },
  ], aretenir:'4 EDD triggers: PEP + high-risk country + complex structure + unusual transaction. PSF decides, i-Hub verifies.' },
  { id:19, emoji:'💡', titre:'EDD from i-Hub’s perspective: what changes in practice', contenu:[
    { icon:'📝', texte:'**More documents**: detailed SOF, SOW, org chart, UBO identity — the checklist is longer' },
    { icon:'🔍', texte:'**Additional cross-checks**: org chart vs articles, SOW vs professional profile, SOF vs relevant transactions' },
    { icon:'📢', texte:'**More detailed flagging**: each missing item and inconsistency described precisely in the report' },
    { icon:'📎', texte:'**More complete archive**: retain all verified documents + dated and detailed EDD report' },
  ], aretenir:'EDD for i-Hub = longer checklist + additional cross-checks + more detailed report. Same logic throughout.' },
  { id:20, emoji:'🎓', titre:'Summary: EDD in 5 points', contenu:[
    { icon:'1️⃣', texte:'**EDD** = enhanced controls for high-risk profiles — PEPs, high-risk countries, complex structures, unusual transactions' },
    { icon:'2️⃣', texte:'The **PSF** decides to apply EDD and collects additional documents' },
    { icon:'3️⃣', texte:'**i-Hub** verifies completeness and consistency of EDD documents if specified in the SLA' },
    { icon:'4️⃣', texte:'**Any missing item or inconsistency** is flagged to PSF in a detailed report' },
    { icon:'5️⃣', texte:'**i-Hub never decides** on risk level or client acceptability — always the PSF' },
  ], aretenir:'EDD: more documents, more verifications, same logic. PSF decides, i-Hub verifies on instruction.' },
]

const DDR_PROFILS_FR = [
  { profil:'Client final : M. Dupont, employé luxembourgeois, salaire mensuel de 3 500€, aucune activité à l’étranger', isDDR:false, explication:'Profil standard sans facteur de risque élevé. Vigilance standard suffisante. Pas de DDR requise.' },
  { profil:'Client final : Mme Kowalski, ancienne ministre de l’économie polonaise, maintenant retraitée', isDDR:true, explication:'Ancienne ministre = PPE. Le statut PPE dure 12 mois après la fin de la fonction. DDR automatique et obligatoire.' },
  { profil:'Client final : société luxembourgeoise simple, 2 associés identifiés, activité commerciale en Luxembourg uniquement', isDDR:false, explication:'Structure simple, associés identifiés, pas de pays à risque. Vigilance standard suffisante.' },
  { profil:'Client final : holding avec 4 niveaux de sociétés dont une aux Îles Caïmans', isDDR:true, explication:'Structure complexe (4 niveaux) + pays à risque (Cayman Islands) = DDR requise. Double déclencheur.' },
  { profil:'Client final : M. Nguyen, résident luxembourgeois, ingenieur, origine vietnamienne', isDDR:false, explication:'Le Vietnam n’est pas sur la liste GAFI. Origine étrangère seule ne suffit pas à déclencher une DDR.' },
  { profil:'Client final : fonds d’investissement dont les fonds proviennent partiellement d’Iran', isDDR:true, explication:'L’Iran est sur la liste GAFI des pays à haut risque. Source de fonds liée à l’Iran = DDR obligatoire.' },
  { profil:'Client final : M. Diallo, PDG d’une société privée luxembourgeoise cotée en bourse', isDDR:false, explication:'PDG d’entreprise privée cotée ≠ PPE. Les PPE sont liées aux fonctions publiques, pas privées. Vigilance standard.' },
  { profil:'Client final : M. Schmidt, fils du Premier ministre allemand, étudiant à Luxembourg', isDDR:true, explication:'Fils d’un chef de gouvernement = membre de la famille d’une PPE = lui-même PPE. DDR automatique.' },
]
const DDR_PROFILS_EN = [
  { profil:'Final client: Mr Dupont, Luxembourg employee, monthly salary €3,500, no foreign activity', isDDR:false, explication:'Standard profile with no high-risk factor. Standard vigilance sufficient. No EDD required.' },
  { profil:'Final client: Ms Kowalski, former Polish Minister of Economy, now retired', isDDR:true, explication:'Former minister = PEP. PEP status lasts 12 months after leaving the function. Automatic and mandatory EDD.' },
  { profil:'Final client: simple Luxembourg company, 2 identified partners, commercial activity in Luxembourg only', isDDR:false, explication:'Simple structure, identified partners, no high-risk country. Standard vigilance sufficient.' },
  { profil:'Final client: holding with 4 levels of companies including one in the Cayman Islands', isDDR:true, explication:'Complex structure (4 levels) + high-risk country (Cayman Islands) = EDD required. Double trigger.' },
  { profil:'Final client: Mr Nguyen, Luxembourg resident, engineer, Vietnamese origin', isDDR:false, explication:'Vietnam is not on the FATF list. Foreign origin alone is not sufficient to trigger EDD.' },
  { profil:'Final client: investment fund whose funds partially originate from Iran', isDDR:true, explication:'Iran is on the FATF high-risk country list. Source of funds linked to Iran = mandatory EDD.' },
  { profil:'Final client: Mr Diallo, CEO of a listed private Luxembourg company', isDDR:false, explication:'CEO of a listed private company ≠ PEP. PEPs are linked to public functions, not private ones. Standard vigilance.' },
  { profil:'Final client: Mr Schmidt, son of the German Chancellor, student in Luxembourg', isDDR:true, explication:'Son of a head of government = family member of a PEP = himself a PEP. Automatic EDD.' },
]

const VF_FR = [
  { texte:'Un client qui a été ministre il y a 6 mois reste soumis à la DDR', reponse:true, explication:'Exact ! Le statut PPE dure 12 mois après la fin de la fonction. 6 mois = encore PPE = DDR obligatoire.' },
  { texte:'i-Hub décide si la source de fonds d’un client DDR est légitime', reponse:false, explication:'Non ! i-Hub vérifie la présence et la cohérence des documents SOF. La légitimité est décidée par le PSF.' },
  { texte:'Le conjoint d’une PPE est lui-même considéré comme PPE', reponse:true, explication:'Exact ! Les membres de la famille proche d’une PPE sont eux-mêmes considérés comme PPE.' },
  { texte:'Une structure avec plusieurs niveaux de sociétés déclenche toujours une DDR', reponse:false, explication:'Pas nécessairement. C’est la complexité opaque et l’impossibilité d’identifier l’UBO qui déclenchent la DDR, pas le nombre de niveaux seul.' },
  { texte:'i-Hub peut refuser un dossier DDR incomplet sans consulter le PSF', reponse:false, explication:'Non ! i-Hub signale les manquants au PSF. C’est le PSF qui décide des suites. i-Hub ne refuse jamais seul.' },
  { texte:'La recherche de médias adverses est une obligation du PSF, pas d’i-Hub', reponse:true, explication:'Exact ! La negative news screening est une obligation du PSF en DDR. i-Hub signale s’il détecte quelque chose fortuitement.' },
]
const VF_EN = [
  { texte:'A client who was minister 6 months ago remains subject to EDD', reponse:true, explication:'Correct! PEP status lasts 12 months after leaving the function. 6 months = still PEP = mandatory EDD.' },
  { texte:'i-Hub decides whether an EDD client’s source of funds is legitimate', reponse:false, explication:'No! i-Hub verifies presence and consistency of SOF documents. Legitimacy is decided by the PSF.' },
  { texte:'A PEP’s spouse is themselves considered a PEP', reponse:true, explication:'Correct! Immediate family members of a PEP are themselves considered PEPs.' },
  { texte:'A structure with multiple company levels always triggers EDD', reponse:false, explication:'Not necessarily. It is opaque complexity and inability to identify the UBO that trigger EDD, not the number of levels alone.' },
  { texte:'i-Hub can reject an incomplete EDD file without consulting the PSF', reponse:false, explication:'No! i-Hub flags missing items to the PSF. The PSF decides on next steps. i-Hub never rejects alone.' },
  { texte:'Adverse media screening is a PSF obligation, not i-Hub’s', reponse:true, explication:'Correct! Negative news screening is a PSF obligation in EDD. i-Hub flags if it incidentally detects something.' },
]

const CAS_FR = [
  { situation:'Le PSF transmet un dossier DDR pour une PPE. Le dossier contient identité + SOF + mais aucun document SOW.', action:'Signaler au PSF : document SOW manquant pour dossier PPE', options:['Accepter — SOF présente, c’est suffisant','Signaler au PSF : document SOW manquant pour dossier PPE','Estimer la SOW à partir du profil','Demander directement au client final'], explication:'Pour une PPE, la SOW est obligatoire en DDR. SOF seule = insuffisant. i-Hub signale le manquant au PSF.' },
  { situation:'Le PSF transmet un organigramme pour une holding. L’organigramme s’arrête à une société et n’indique pas les personnes physiques actionnaires.', action:'Signaler au PSF : organigramme incomplet, UBO non identifié', options:['Accepter — la société est identifiée','Signaler au PSF : organigramme incomplet, UBO non identifié','Identifier l’UBO sur internet','Rejeter le dossier'], explication:'Un organigramme doit aller jusqu’à la personne physique. S’il s’arrête à une entité, l’UBO réel n’est pas identifié. Signal au PSF.' },
  { situation:'Le PSF transmet un dossier DDR complet : identité + SOF + SOW + organigramme + identité de chaque UBO. Tout est cohérent.', action:'Valider le dossier DDR — complet et cohérent', options:['Signaler quand même au PSF par précaution','Valider le dossier DDR — complet et cohérent','Demander des documents supplémentaires','Refuser — les dossiers DDR sont toujours suspects'], explication:'Un dossier DDR complet et cohérent est validé. i-Hub ne cherche pas à trouver des problèmes là où il n’y en a pas.' },
]
const CAS_EN = [
  { situation:'PSF transmits an EDD file for a PEP. File contains identity + SOF + but no SOW document.', action:'Flag to PSF: SOW document missing for PEP file', options:['Accept — SOF is present, that’s sufficient','Flag to PSF: SOW document missing for PEP file','Estimate SOW from the profile','Request directly from the final client'], explication:'For a PEP, SOW is mandatory in EDD. SOF alone = insufficient. i-Hub flags the missing item to PSF.' },
  { situation:'PSF transmits an org chart for a holding. The chart stops at a company and does not indicate individual shareholders.', action:'Flag to PSF: incomplete org chart, UBO not identified', options:['Accept — the company is identified','Flag to PSF: incomplete org chart, UBO not identified','Identify the UBO on the internet','Reject the file'], explication:'An org chart must go down to the individual. If it stops at an entity, the real UBO is not identified. Flag to PSF.' },
  { situation:'PSF transmits a complete EDD file: identity + SOF + SOW + org chart + each UBO’s identity. Everything is consistent.', action:'Validate EDD file — complete and consistent', options:['Flag to PSF anyway as a precaution','Validate EDD file — complete and consistent','Request additional documents','Reject — EDD files are always suspicious'], explication:'A complete and consistent EDD file is validated. i-Hub does not look for problems where there are none.' },
]

export default function ModuleDDR() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeDDR, setActiveDDR] = useState(() => pickRandom(DDR_PROFILS_FR, 6))
  const [ddrIndex, setDdrIndex] = useState(0)
  const [ddrAnswer, setDdrAnswer] = useState<boolean|null>(null)
  const [ddrScore, setDdrScore] = useState(0)
  const [ddrAnim, setDdrAnim] = useState<'correct'|'wrong'|null>(null)

  const [activeVF, setActiveVF] = useState(() => pickRandom(VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnim, setVfAnim] = useState<'correct'|'wrong'|null>(null)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState<string|null>(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l: 'fr'|'en') {
    const bd = l==='fr'?DDR_PROFILS_FR:DDR_PROFILS_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveDDR(pickRandom(bd,6)); setDdrIndex(0); setDdrScore(0); setDdrAnswer(null); setDdrAnim(null)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnim(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); initQuizzes(l) }

  function repDDR(rep: boolean) {
    if (ddrAnswer !== null) return
    const correct = activeDDR[ddrIndex].isDDR === rep
    setDdrAnswer(rep); setDdrAnim(correct ? 'correct' : 'wrong')
    if (correct) setDdrScore(s => s + 1)
    setTimeout(() => {
      setDdrAnim(null); setDdrAnswer(null)
      if (ddrIndex + 1 < activeDDR.length) { setDdrIndex(i => i + 1) }
      else { setScore(s => s + (correct ? ddrScore + 1 : ddrScore) * 5); setPhase('quiz2') }
    }, 2200)
  }

  function repondreVF(rep: boolean) {
    if (vfRepondu !== null) return
    const correct = activeVF[vfIndex].reponse === rep
    setVfRepondu(rep); setVfAnim(correct ? 'correct' : 'wrong')
    if (correct) setVfScore(s => s + 1)
    setTimeout(() => {
      setVfAnim(null); setVfRepondu(null)
      if (vfIndex + 1 < activeVF.length) { setVfIndex(i => i + 1) }
      else { setScore(s => s + (correct ? vfScore + 1 : vfScore) * 5); setPhase('quiz3') }
    }, 2200)
  }

  function repCas(opt: string) { if (casRepondu !== null) return; const correct = opt === activeCas[casIndex].action; setCasRepondu(opt); if (correct) setCasScore(s => s + 1) }
  function nextCas() { if (casIndex + 1 < activeCas.length) { setCasIndex(i => i + 1); setCasRepondu(null) } else { setScore(s => s + casScore * 7); setPhase('resultat') } }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={() => router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🔴 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
        </div>
        <span style={{background:'white',border:`1px solid ${C}`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={base}><NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔴</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i) => <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>✓</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.quiz,icon:'🎮'},{label:t.time,icon:'⏱️'}].map((b,i) => <div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={() => setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase === 'fiches') {
    const fiche = FICHES[ficheIndex]; const progress = ((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar />
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${progress}%`,transition:'width 0.4s',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1}/{FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i) => <div key={i} onClick={() => setFicheIndex(i)} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:`2px solid ${C}30`,boxShadow:`0 8px 40px ${C}15`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i) => (
                <div key={i} style={{display:'flex',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C}">$1</strong>`)}}/>
                </div>
              ))}
              <div style={{background:`${C}10`,border:`1px solid ${C}30`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px'}}>
                <span>💡</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            {ficheIndex > 0 && <button onClick={() => setFicheIndex(i => i-1)} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={() => ficheIndex < FICHES.length-1 ? setFicheIndex(i => i+1) : setPhase('quiz1')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex < FICHES.length-1 ? `${t.next} (${ficheIndex+2}/${FICHES.length}) →` : t.quizBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz1') {
    const a = activeDDR[ddrIndex]
    return (
      <div style={{...base,background:ddrAnim==='correct'?'#d1fae5':ddrAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:ddrAnim==='correct'?'#6ee7b7':ddrAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(ddrIndex/activeDDR.length)*100}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'580px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {ddrIndex+1}/{activeDDR.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q1title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>👤 {a.profil}</p>
          </div>
          {ddrAnswer === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repDDR(true)} style={{padding:'18px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'14px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.ddr}</button>
              <button onClick={() => repDDR(false)} style={{padding:'18px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'14px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.std}</button>
            </div>
          ) : (
            <div style={{background:ddrAnim==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${ddrAnim==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{ddrAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:ddrAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{ddrAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{a.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeDDR.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=ddrIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz2') {
    const q = activeVF[vfIndex]
    return (
      <div style={{...base,background:vfAnim==='correct'?'#d1fae5':vfAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:vfAnim==='correct'?'#6ee7b7':vfAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(vfIndex/activeVF.length)*100}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q2label} — {vfIndex+1}/{activeVF.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q2title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80px'}}>
            <p style={{fontSize:'18px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
          </div>
          {vfRepondu === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={() => repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.false}</button>
            </div>
          ) : (
            <div style={{background:vfAnim==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnim==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{vfAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{q.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeVF.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=vfIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz3') {
    const cas = activeCas[casIndex]
    return (
      <div style={base}><NavBar />
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(casIndex/activeCas.length)*100}%`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:0}}>{t.q3title}</h2>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:`2px solid ${C}30`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i) => (
                <button key={i} onClick={() => repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left'}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=`${C}08`}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>
                {cas.options.map((opt,i) => { const isC=opt===cas.action,isCh=opt===casRepondu; return (
                  <div key={i} style={{padding:'12px 16px',background:isC?'#d1fae5':isCh?'#fee2e2':'white',border:`1.5px solid ${isC?'#6ee7b7':isCh?'#fca5a5':'#e5e7eb'}`,borderRadius:'10px',fontSize:'14px',fontWeight:'600',color:isC?'#059669':isCh?'#ef4444':'#9ca3af'}}>
                    {isC?'✅ ':isCh?'❌ ':''}{opt}
                  </div>
                )})}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'12px',padding:'14px',marginBottom:'14px'}}>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>💡 {cas.explication}</p>
              </div>
              <button onClick={nextCas} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
                {casIndex < activeCas.length-1 ? t.next2 : t.last}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const total=Math.min(100,score), medal=total>=80?'🥇':total>=50?'🥈':'🥉', msg=total>=80?t.medal_gold:total>=50?t.medal_silver:t.medal_bronze
  return (
    <div style={base}><NavBar />
      <div style={{maxWidth:'560px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'80px',marginBottom:'16px'}}>{medal}</div>
        <h2 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{msg}</h2>
        <p style={{color:'#4b5563',marginBottom:'32px'}}>{t.resultTitle}</p>
        <div style={{background:'white',borderRadius:'20px',padding:'28px',marginBottom:'24px'}}>
          <div style={{fontSize:'52px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'22px'}}>/100</span></div>
          <p style={{color:'#6b7280',margin:'0 0 16px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#f3f4f6',borderRadius:'8px',height:'10px',overflow:'hidden'}}>
            <div style={{background:`linear-gradient(90deg,${C},#f59e0b)`,height:'10px',width:`${total}%`,borderRadius:'8px'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
          <button onClick={() => router.back()} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.backHome}</button>
          <button onClick={() => {initQuizzes(lang);setScore(0);setPhase('intro')}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
