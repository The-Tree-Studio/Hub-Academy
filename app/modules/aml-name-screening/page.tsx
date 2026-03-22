'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e91e8c'

const UI = {
  fr: {
    title: 'Name Screening',
    subtitle: 'Créibler les noms contre les listes de sanctions — le rôle précis d’i-Hub',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Ce qu’est le Name Screening et pourquoi il existe',
      'Les principales listes de sanctions (ONU, UE, OFAC…)',
      'La différence entre un vrai match et un faux positif',
      'Le processus de screening : comment ça marche',
      'Ce que fait i-Hub en cas de match',
      'L’importance de l’exactitude de la saisie des noms',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · VRAI MATCH OU FAUX POSITIF ?',
    q1title: '🔍 Ce résultat est-il un vrai match ou un faux positif ?',
    match: '🚨 Vrai match — Escalader', fp: '🟢 Faux positif — Documenter',
    q2label: 'QUIZ 2/3 · VRAI OU FAUX', q2title: '✅ Vrai ou Faux — Name Screening',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q3label: 'QUIZ 3/3 · CAS PRATIQUES', q3title: '🤔 Quelle est la bonne action ?',
    resultTitle: 'Module Name Screening terminé — Vous gérez les listes de sanctions !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    medal_gold: 'Expert Screening !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Terminer →',
  },
  en: {
    title: 'Name Screening',
    subtitle: 'Screening names against sanctions lists — i-Hub’s precise role',
    learn: '📚 What you will learn:',
    learnItems: [
      'What Name Screening is and why it exists',
      'The main sanctions lists (UN, EU, OFAC…)',
      'The difference between a true match and a false positive',
      'The screening process: how it works',
      'What i-Hub does in case of a match',
      'The importance of accurate name entry',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · TRUE MATCH OR FALSE POSITIVE?',
    q1title: '🔍 Is this result a true match or a false positive?',
    match: '🚨 True match — Escalate', fp: '🟢 False positive — Document',
    q2label: 'QUIZ 2/3 · TRUE OR FALSE', q2title: '✅ True or False — Name Screening',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q3label: 'QUIZ 3/3 · CASE STUDIES', q3title: '🤔 What is the correct action?',
    resultTitle: 'Name Screening module complete — You handle sanctions lists!',
    backHome: '← Back', restart: '🔄 Restart',
    medal_gold: 'Screening Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Finish →',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🔍', titre:'C’est quoi le Name Screening ?', contenu:[
    { icon:'🔍', texte:'Le **Name Screening** consiste à vérifier les noms des clients finaux contre des **listes de sanctions, de personnes interdites ou à risque** publiées par les autorités internationales' },
    { icon:'🎯', texte:'Objectif : détecter si un client final est une personne sanctionée, un terroriste désigné, un trafiquant identifié ou une entité interdite' },
    { icon:'🏦', texte:'C’est une obligation légale des **PSF** — le screening est réalisé sur instruction du PSF, dans le cadre du SLA avec i-Hub' },
    { icon:'🔄', texte:'Le screening est effectué à l’**entrée en relation** et **en continu** tout au long de la relation client' },
  ], aretenir:'Name Screening = vérifier les noms contre les listes de sanctions. Obligation du PSF. i-Hub exécute sur instruction, dans le cadre du SLA.' },

  { id:2, emoji:'📜', titre:'Les principales listes de sanctions', contenu:[
    { icon:'🇺🇳', texte:'**ONU** : Comité des sanctions du Conseil de sécurité — liste la plus universelle, s’impose à tous les États membres' },
    { icon:'🇪🇺', texte:'**UE** (Règlement CE) : sanctionne des individus, entités et pays — mise à jour fréquente, consultable sur EUR-Lex' },
    { icon:'🇺🇸', texte:'**OFAC** (Office of Foreign Assets Control) : liste américaine — SDN List (Specially Designated Nationals) — impact mondial via le dollar' },
    { icon:'🇱🇺', texte:'**CSSF / Luxembourg** : le PSF doit contrôler contre toutes ces listes — i-Hub utilise les outils de screening du PSF ou les siens selon le SLA' },
  ], aretenir:'4 listes clés : ONU, UE, OFAC, et listes nationales. Le PSF est responsable de couvrir toutes les listes applicables.' },

  { id:3, emoji:'📊', titre:'Comment fonctionne le screening', contenu:[
    { icon:'1️⃣', texte:'**Saisie** : le nom du client final est entré dans l’outil de screening — exactitude critique (Rue ≠ Avenue, Jean ≠ Jeanne)' },
    { icon:'2️⃣', texte:'**Comparaison** : l’outil compare le nom saisi contre les milliers d’entrées dans les listes de sanctions' },
    { icon:'3️⃣', texte:'**Résultat** : l’outil retourne les correspondances potentielles avec un **score de similarité** (ex : 85% match)' },
    { icon:'4️⃣', texte:'**Analyse humaine** : un collaborateur i-Hub analyse chaque résultat pour déterminer si c’est un vrai match ou un faux positif' },
  ], aretenir:'Saisir → Comparer → Analyser. L’outil fait la recherche, l’humain fait l’analyse. L’exactitude de la saisie est déterminante.' },

  { id:4, emoji:'⚠️', titre:'Le vrai match vs le faux positif', contenu:[
    { icon:'🚨', texte:'**Vrai match** : les informations correspondent réellement à la personne sanctionée — même nom, même date de naissance, même nationalité' },
    { icon:'🟢', texte:'**Faux positif** : le nom ressemble à celui d’une personne sanctionée mais c’est une personne différente — homonymie fréquente' },
    { icon:'📊', texte:'Les outils de screening génèrent beaucoup de **faux positifs** — Mohamed Ali par exemple peut correspondre à des milliers de personnes' },
    { icon:'📌', texte:'L’analyse humaine est indispensable — un faux positif non géré peut bloquer un client légitime, un vrai match non détecté peut exposer le PSF' },
  ], aretenir:'Vrai match = mêmes identifiants confirmés. Faux positif = ressemblance de nom sans correspondance réelle. L’analyse humaine tranche.' },

  { id:5, emoji:'🔍', titre:'Comment analyser un résultat de screening', contenu:[
    { icon:'1️⃣', texte:'**Comparer les identifiants clés** : date de naissance, nationalité, adresse, numéro de passeport — correspondent-ils à la personne sur la liste ?' },
    { icon:'2️⃣', texte:'**Vérifier la spécificité du nom** : un nom très commun (Mohamed, Jean Martin) = forte probabilité de faux positif' },
    { icon:'3️⃣', texte:'**Consulter la notice de la liste** : chaque entrée dans une liste de sanctions comporte des informations de désambiguaïisation' },
    { icon:'4️⃣', texte:'**Documenter la conclusion** : faux positif documenté avec justification, ou vrai match escaladé immédiatement au PSF' },
  ], aretenir:'Analyser = comparer les identifiants + vérifier la notice + documenter. Faux positif = justifier. Vrai match = escalader.' },

  { id:6, emoji:'🚨', titre:'Que fait i-Hub en cas de vrai match ?', contenu:[
    { icon:'🚨', texte:'Un vrai match (ou un match non écarté) est **immédiatement escaladé au PSF** — pas d’attente, pas de délai' },
    { icon:'🛑', texte:'i-Hub **ne décide pas** de la suite — c’est le PSF qui décide de geler le compte, refuser la relation ou déclarer à la CRF' },
    { icon:'📎', texte:'Le rapport transmis au PSF contient : le nom criblé, la liste concernée, le score de correspondance, les informations comparatives' },
    { icon:'📅', texte:'i-Hub archive le résultat de l’analyse — qu’il s’agisse d’un vrai match ou d’un faux positif documenté' },
  ], aretenir:'Vrai match = escalade immédiate au PSF. i-Hub ne gèle pas, ne déclare pas. Il signale et archive. Le PSF décide.' },

  { id:7, emoji:'🟢', titre:'Que fait i-Hub en cas de faux positif ?', contenu:[
    { icon:'🟢', texte:'Un faux positif est **documenté et archivé** — avec la justification précise (date de naissance différente, nationalité différente…)' },
    { icon:'📝', texte:'La documentation doit être **suffisamment détaillée** pour qu’un contrôleur puisse comprendre pourquoi le match a été écarté' },
    { icon:'⚠️', texte:'Un faux positif écarté sans justification suffisante peut être considéré comme une **négligence** en cas de contrôle CSSF' },
    { icon:'📌', texte:'Le PSF peut être informé du faux positif selon les procédures du SLA — même si ce n’est pas un vrai match' },
  ], aretenir:'Faux positif = documenter la justification précise. Pas d’écart sans raison écrite. Le dossier de screening doit être traçable.' },

  { id:8, emoji:'📝', titre:'L’importance absolue de l’exactitude des noms', contenu:[
    { icon:'📌', texte:'Un nom mal saisi = un screening incomplet = risque de passer à côté d’un vrai match' },
    { icon:'⚠️', texte:'Exemples d’erreurs critiques : « Jean-Marc » saisi « Jean Marc » (sans trait d’union), ou « Al-Rashid » saisi « AlRashid »' },
    { icon:'🔄', texte:'Il faut screener **toutes les variantes du nom** : nom de naissance, nom marital, alias connus, translittérations' },
    { icon:'🔍', texte:'i-Hub saisit les noms **exactement comme ils figurent sur les documents officiels** — sans approximation ni simplification' },
  ], aretenir:'Exactitude = sécurité. Un nom mal saisi rate un match. Toutes les variantes du nom sont screenées. Copier les documents officiels.' },

  { id:9, emoji:'🌍', titre:'Les listes de sanctions : ce qu’elles contiennent', contenu:[
    { icon:'👤', texte:'**Personnes physiques** : individus sanctionés, terroristes désignés, trafiquants, proliferateurs d’armes' },
    { icon:'🏢', texte:'**Entités** : sociétés, organisations, gouvernements, navires — toute entité désignée comme sanctionnée' },
    { icon:'🌍', texte:'**Pays** : certains pays font l’objet de sanctions générales (ex : Iran, Russie, Corée du Nord) ou sectorielles' },
    { icon:'🔄', texte:'Les listes sont **mises à jour très régulièrement** — une personne peut être ajoutée ou retirée à tout moment' },
  ], aretenir:'Listes = personnes, entités, pays. Mises à jour constantes. Le screening doit utiliser les listes à jour du jour du contrôle.' },

  { id:10, emoji:'📊', titre:'Le score de similarité', contenu:[
    { icon:'📊', texte:'Les outils de screening retournent un **score de similarité** (ex : 70%, 85%, 100%) entre le nom saisi et les entrées des listes' },
    { icon:'🔴', texte:'Un score de **100%** (match exact) ne signifie pas automatiquement un vrai match — des homonymes peuvent exister' },
    { icon:'🟡', texte:'Un score de **70-80%** peut être un vrai match si le nom est rare, ou un faux positif si le nom est très commun' },
    { icon:'📌', texte:'Le seuil de déclenchement d’une alerte est défini par le PSF dans sa politique de screening — i-Hub applique ce seuil' },
  ], aretenir:'Score élevé ≠ vrai match automatique. Le score déclenche l’analyse, pas la conclusion. L’humain analyse chaque alerte.' },

  { id:11, emoji:'🔄', titre:'Le screening continu', contenu:[
    { icon:'🔄', texte:'Le screening ne se fait pas qu’à l’entrée en relation — les clients existants doivent être **recriblés régulièrement**' },
    { icon:'📅', texte:'Pourquoi : une personne peut être ajoutée à une liste de sanctions après avoir ouvert son compte — le PSF doit le détecter' },
    { icon:'📢', texte:'Tout **événement déclencheur** (mise à jour des listes, alerte médias, changement de statut) peut déclencher un re-screening' },
    { icon:'🔍', texte:'i-Hub peut être mandaté pour des screenings périodiques ou à la demande — toujours sur instruction du PSF' },
  ], aretenir:'Screening = ponctuel ET continu. Les listes changent, les clients peuvent être ajoutés. Re-screening périodique obligatoire.' },

  { id:12, emoji:'👤', titre:'Les alias et variantes de noms', contenu:[
    { icon:'👤', texte:'Une personne sanctionnée peut avoir plusieurs **alias** (noms utilisés, noms d’emprunt, surnoms) listés dans les listes' },
    { icon:'🔄', texte:'La translittération d’un nom arabe, cyrillique ou chinois peut générer plusieurs variantes écrites en alphabet latin' },
    { icon:'📝', texte:'Il faut screener : le **nom complet**, le **nom de jeune fille** si différent, les **alias** connus mentionnés dans le dossier' },
    { icon:'🔍', texte:'i-Hub screene toutes les variantes présentes dans le dossier — et signale au PSF si le nombre d’alias est inhabituel' },
  ], aretenir:'Screener toutes les variantes : nom complet, nom de naissance, alias connus. Un alias non screené peut masquer un vrai match.' },

  { id:13, emoji:'🏢', titre:'Le screening des entités', contenu:[
    { icon:'🏢', texte:'Le screening s’applique aussi aux **entités** (sociétés, fonds, associations) — pas seulement aux personnes physiques' },
    { icon:'👤', texte:'Il faut screener l’entité elle-même ET ses **dirigeants, actionnaires et UBO** — une entité non sanctionnée peut avoir un dirigeant sanctionné' },
    { icon:'📌', texte:'Les entités peuvent être sanctionnées directement (dans la liste) ou indirectement (contrôlées par une personne sanctionnée)' },
    { icon:'🔍', texte:'i-Hub screene l’entité + ses dirigeants + ses UBO si prévu dans le SLA — résultat transmis au PSF' },
  ], aretenir:'Screening entité = l’entité + ses dirigeants + ses UBO. Une entité propre peut avoir un dirigeant sanctionné.' },

  { id:14, emoji:'📅', titre:'Fréquence et timing du screening', contenu:[
    { icon:'🌟', texte:'**À l’entrée en relation** : screening obligatoire avant tout engagement — pas d’ouverture sans résultat de screening' },
    { icon:'🔄', texte:'**Périodiquement** : fréquence définie par le PSF selon le risque du client (mensuel pour les hauts risques, trimestriel ou annuel sinon)' },
    { icon:'📢', texte:'**À la demande** : lors d’un événement (mise à jour de liste, alerte externe, transaction inhabituelle)' },
    { icon:'🔍', texte:'i-Hub applique le calendrier de screening défini dans le SLA — et signale au PSF si une liste importante a été mise à jour' },
  ], aretenir:'Screening : entrée + périodique + à la demande. Fréquence définie par le PSF. i-Hub applique le calendrier du SLA.' },

  { id:15, emoji:'💻', titre:'Les outils de screening', contenu:[
    { icon:'💻', texte:'Des outils spécialisés (Dow Jones, World-Check, ACAMS…) agrègent les listes de sanctions mondiales et permettent le screening automatisé' },
    { icon:'🔍', texte:'Ces outils font la **recherche automatique** — mais l’**analyse des résultats** reste humaine, réalisée par i-Hub' },
    { icon:'📜', texte:'Le PSF choisit l’outil et définit les paramètres (seuils, listes à couvrir) — i-Hub utilise les outils mis à disposition ou les siens selon le SLA' },
    { icon:'⏰', texte:'Les outils doivent être **mis à jour régulièrement** pour couvrir les dernières mises à jour des listes — responsabilité du PSF ou d’i-Hub selon le SLA' },
  ], aretenir:'Outil = recherche automatique. Humain = analyse des résultats. Les deux sont nécessaires. L’outil ne remplace pas le jugement.' },

  { id:16, emoji:'⚠️', titre:'Sanctions et gel des avoirs', contenu:[
    { icon:'⚠️', texte:'Transacter avec une personne ou entité sanctionnée peut constituer une **violation des sanctions** — infraction pénale grave' },
    { icon:'🔒', texte:'En cas de match confirmé, le PSF a l’obligation de **geler les avoirs** immédiatement et de notifier les autorités compétentes' },
    { icon:'💰', texte:'Les amendes pour violation de sanctions peuvent atteindre des **milliards de dollars** — plusieurs grandes banques ont été condamnées' },
    { icon:'🔍', texte:'C’est pourquoi l’escalade immédiate par i-Hub en cas de match est non-négociable — le délai peut coûter cher au PSF' },
  ], aretenir:'Violation de sanctions = infraction pénale + gel immédiat. Escalade immédiate en cas de match est non-négociable.' },

  { id:17, emoji:'📎', titre:'La documentation du screening', contenu:[
    { icon:'📎', texte:'Chaque screening réalisé doit être **documenté et archivé** : date, nom(s) criblé(s), liste(s) utilisée(s), résultat(s), analyse' },
    { icon:'🟢', texte:'Pour un faux positif : noter précisément pourquoi le match a été écarté (date de naissance différente, nationalité différente…)' },
    { icon:'🚨', texte:'Pour un vrai match : noter l’heure et la date de l’escalade au PSF, la personne contactée, les informations transmises' },
    { icon:'💼', texte:'Cette documentation est la preuve de diligence d’i-Hub — elle doit résister à un audit CSSF ou une enquête judiciaire' },
  ], aretenir:'Documentation screening = preuve de diligence. Faux positif : justification écrite. Vrai match : heure et personne contactée au PSF.' },

  { id:18, emoji:'🤔', titre:'Les cas limites : quand éscalader', contenu:[
    { icon:'🔴', texte:'**Doute impossible à lever** : les informations disponibles ne permettent pas de conclure faux positif avec certitude → escalader' },
    { icon:'🔴', texte:'**Match partiel sur nom rare** : le prénom diffère mais le nom de famille est identique et très rare → escalader au PSF' },
    { icon:'🔴', texte:'**Informations manquantes** : pas assez d’identifiants pour confirmer ou écarter → escalader et demander plus d’informations via le PSF' },
    { icon:'📌', texte:'Règle : en cas de doute, on escalade. Escalader à tort est moins grave qu’ignorer un vrai match.' },
  ], aretenir:'En cas de doute = escalade. Il vaut mieux escalader à tort que rater un vrai match. Le PSF a les moyens de trancher.' },

  { id:19, emoji:'💡', titre:'Screening et exactitude de la saisie : le lien crucial', contenu:[
    { icon:'📌', texte:'Un nom mal saisi peut générer un **faux négatif** (match réel non détecté) — pire qu’un faux positif' },
    { icon:'📝', texte:'Exemple : « Qadafi » saisi « Kadhafi » peut ne pas matcher « Gaddafi » dans la liste — toutes les translittérations doivent être testées' },
    { icon:'🔄', texte:'Les bons outils gèrent les variantes orthographiques automatiquement — mais une saisie exacte reste la base' },
    { icon:'🛑', texte:'Une saisie approximative qui laisse passer un sanctionné peut engager la **responsabilité d’i-Hub** contractuellement' },
  ], aretenir:'Saisie exacte = base du screening. Faux négatif (match raté) = risque maximal. Toujours copier depuis le document officiel.' },

  { id:20, emoji:'🎓', titre:'Résumé : Name Screening en 5 points', contenu:[
    { icon:'1️⃣', texte:'**Screening** = vérifier noms vs listes de sanctions — ONU, UE, OFAC, listes nationales' },
    { icon:'2️⃣', texte:'**Exactitude** = obligation absolue de la saisie — toutes les variantes du nom, copie exacte des documents' },
    { icon:'3️⃣', texte:'**Analyse** = l’outil cherche, l’humain analyse — vrai match vs faux positif, documentation dans tous les cas' },
    { icon:'4️⃣', texte:'**Vrai match** = escalade immédiate et non-négociable au PSF — jamais de délai' },
    { icon:'5️⃣', texte:'**Doute** = escalade. Faux positif = documentation précise. Tout est archivé pour la traçabilité.' },
  ], aretenir:'Screening : saisir exactement, analyser humainement, escalader les matchs, documenter tout. Le PSF décide des suites.' },
]

const FICHES_EN = [
  { id:1, emoji:'🔍', titre:'What is Name Screening?', contenu:[
    { icon:'🔍', texte:'**Name Screening** involves checking the names of final clients against **sanctions lists, prohibited or risk persons lists** published by international authorities' },
    { icon:'🎯', texte:'Goal: detect whether a final client is a sanctioned person, designated terrorist, identified trafficker or prohibited entity' },
    { icon:'🏦', texte:'It is a legal obligation of **PSFs** — screening is performed on the PSF’s instruction, within the SLA with i-Hub' },
    { icon:'🔄', texte:'Screening is performed at **onboarding** and **on an ongoing basis** throughout the client relationship' },
  ], aretenir:'Name Screening = check names against sanctions lists. PSF obligation. i-Hub executes on instruction, within SLA.' },
  { id:2, emoji:'📜', titre:'The main sanctions lists', contenu:[
    { icon:'🇺🇳', texte:'**UN**: Security Council sanctions committee — most universal list, binding on all member states' },
    { icon:'🇪🇺', texte:'**EU** (EC Regulation): sanctions individuals, entities and countries — frequently updated, searchable on EUR-Lex' },
    { icon:'🇺🇸', texte:'**OFAC** (Office of Foreign Assets Control): US list — SDN List (Specially Designated Nationals) — global impact via the dollar' },
    { icon:'🇱🇺', texte:'**CSSF / Luxembourg**: PSF must screen against all applicable lists — i-Hub uses PSF or own screening tools per SLA' },
  ], aretenir:'4 key lists: UN, EU, OFAC, national lists. PSF is responsible for covering all applicable lists.' },
  { id:3, emoji:'📊', titre:'How screening works', contenu:[
    { icon:'1️⃣', texte:'**Entry**: final client name entered into screening tool — accuracy critical (Street ≠ Avenue, John ≠ Joan)' },
    { icon:'2️⃣', texte:'**Comparison**: tool compares entered name against thousands of entries in sanctions lists' },
    { icon:'3️⃣', texte:'**Result**: tool returns potential matches with a **similarity score** (e.g. 85% match)' },
    { icon:'4️⃣', texte:'**Human analysis**: an i-Hub team member analyses each result to determine if it is a true match or false positive' },
  ], aretenir:'Enter → Compare → Analyse. The tool searches, the human analyses. Entry accuracy is decisive.' },
  { id:4, emoji:'⚠️', titre:'True match vs false positive', contenu:[
    { icon:'🚨', texte:'**True match**: information genuinely matches the sanctioned person — same name, same date of birth, same nationality' },
    { icon:'🟢', texte:'**False positive**: name resembles a sanctioned person but is a different person — common homonymy' },
    { icon:'📊', texte:'Screening tools generate many **false positives** — Mohamed Ali for example may match thousands of people' },
    { icon:'📌', texte:'Human analysis is essential — an unhandled false positive may block a legitimate client, an undetected true match may expose the PSF' },
  ], aretenir:'True match = same confirmed identifiers. False positive = name resemblance without real match. Human analysis decides.' },
  { id:5, emoji:'🔍', titre:'How to analyse a screening result', contenu:[
    { icon:'1️⃣', texte:'**Compare key identifiers**: date of birth, nationality, address, passport number — do they match the listed person?' },
    { icon:'2️⃣', texte:'**Check name specificity**: a very common name (Mohamed, Jean Martin) = high probability of false positive' },
    { icon:'3️⃣', texte:'**Consult the list entry**: each sanctions list entry contains disambiguation information' },
    { icon:'4️⃣', texte:'**Document the conclusion**: false positive documented with justification, or true match immediately escalated to PSF' },
  ], aretenir:'Analyse = compare identifiers + check entry + document. False positive = justify. True match = escalate.' },
  { id:6, emoji:'🚨', titre:'What i-Hub does in case of a true match', contenu:[
    { icon:'🚨', texte:'A true match (or an uncleared match) is **immediately escalated to the PSF** — no waiting, no delay' },
    { icon:'🛑', texte:'i-Hub **does not decide** on follow-up — the PSF decides to freeze the account, refuse the relationship or report to FIU' },
    { icon:'📎', texte:'Report transmitted to PSF contains: screened name, relevant list, match score, comparative information' },
    { icon:'📅', texte:'i-Hub archives the analysis result — whether a true match or documented false positive' },
  ], aretenir:'True match = immediate escalation to PSF. i-Hub does not freeze, does not report. It flags and archives. PSF decides.' },
  { id:7, emoji:'🟢', titre:'What i-Hub does in case of a false positive', contenu:[
    { icon:'🟢', texte:'A false positive is **documented and archived** — with precise justification (different date of birth, different nationality…)' },
    { icon:'📝', texte:'Documentation must be **sufficiently detailed** for an auditor to understand why the match was dismissed' },
    { icon:'⚠️', texte:'A false positive dismissed without sufficient justification may be considered **negligence** in a CSSF audit' },
    { icon:'📌', texte:'The PSF may be notified of the false positive per SLA procedures — even if it is not a true match' },
  ], aretenir:'False positive = document precise justification. No dismissal without written reason. Screening file must be traceable.' },
  { id:8, emoji:'📝', titre:'The absolute importance of accurate name entry', contenu:[
    { icon:'📌', texte:'A misspelled name = incomplete screening = risk of missing a true match' },
    { icon:'⚠️', texte:'Critical error examples: “Jean-Marc” entered as “Jean Marc” (without hyphen), or “Al-Rashid” as “AlRashid”' },
    { icon:'🔄', texte:'All **name variants** must be screened: birth name, married name, known aliases, transliterations' },
    { icon:'🔍', texte:'i-Hub enters names **exactly as they appear on official documents** — no approximation or simplification' },
  ], aretenir:'Accuracy = security. A misspelled name misses a match. All name variants are screened. Copy from official documents.' },
  { id:9, emoji:'🌍', titre:'Sanctions lists: what they contain', contenu:[
    { icon:'👤', texte:'**Individuals**: sanctioned persons, designated terrorists, identified traffickers, weapons proliferators' },
    { icon:'🏢', texte:'**Entities**: companies, organisations, governments, vessels — any entity designated as sanctioned' },
    { icon:'🌍', texte:'**Countries**: some countries are subject to general (e.g. Iran, Russia, North Korea) or sectoral sanctions' },
    { icon:'🔄', texte:'Lists are **updated very frequently** — a person can be added or removed at any time' },
  ], aretenir:'Lists = individuals, entities, countries. Constantly updated. Screening must use lists current on the day of the check.' },
  { id:10, emoji:'📊', titre:'The similarity score', contenu:[
    { icon:'📊', texte:'Screening tools return a **similarity score** (e.g. 70%, 85%, 100%) between the entered name and list entries' },
    { icon:'🔴', texte:'A score of **100%** (exact match) does not automatically mean a true match — homonyms may exist' },
    { icon:'🟡', texte:'A score of **70-80%** may be a true match if the name is rare, or a false positive if the name is very common' },
    { icon:'📌', texte:'The alert threshold is set by the PSF in its screening policy — i-Hub applies this threshold' },
  ], aretenir:'High score ≠ automatic true match. Score triggers analysis, not conclusion. Human analyses every alert.' },
  { id:11, emoji:'🔄', titre:'Ongoing screening', contenu:[
    { icon:'🔄', texte:'Screening is not only done at onboarding — existing clients must be **re-screened regularly**' },
    { icon:'📅', texte:'Why: a person can be added to a sanctions list after opening their account — the PSF must detect this' },
    { icon:'📢', texte:'Any **triggering event** (list update, external alert, unusual transaction) can trigger a re-screening' },
    { icon:'🔍', texte:'i-Hub may be mandated for periodic or on-demand screenings — always on PSF instruction' },
  ], aretenir:'Screening = periodic AND ongoing. Lists change, clients can be added. Periodic re-screening mandatory.' },
  { id:12, emoji:'👤', titre:'Aliases and name variants', contenu:[
    { icon:'👤', texte:'A sanctioned person may have several **aliases** (used names, assumed names, nicknames) listed in the sanctions entries' },
    { icon:'🔄', texte:'Transliteration of an Arabic, Cyrillic or Chinese name can generate several written variants in the Latin alphabet' },
    { icon:'📝', texte:'Must screen: **full name**, **maiden name** if different, **known aliases** mentioned in the file' },
    { icon:'🔍', texte:'i-Hub screens all variants present in the file — and flags to PSF if the number of aliases is unusual' },
  ], aretenir:'Screen all variants: full name, birth name, known aliases. An unscreened alias may hide a true match.' },
  { id:13, emoji:'🏢', titre:'Entity screening', contenu:[
    { icon:'🏢', texte:'Screening also applies to **entities** (companies, funds, associations) — not only individuals' },
    { icon:'👤', texte:'The entity itself AND its **directors, shareholders and UBOs** must be screened — an unsanctioned entity may have a sanctioned director' },
    { icon:'📌', texte:'Entities can be sanctioned directly (listed) or indirectly (controlled by a sanctioned person)' },
    { icon:'🔍', texte:'i-Hub screens entity + directors + UBOs if specified in SLA — result transmitted to PSF' },
  ], aretenir:'Entity screening = entity + directors + UBOs. A clean entity may have a sanctioned director.' },
  { id:14, emoji:'📅', titre:'Screening frequency and timing', contenu:[
    { icon:'🌟', texte:'**At onboarding**: mandatory screening before any commitment — no opening without screening result' },
    { icon:'🔄', texte:'**Periodically**: frequency set by PSF per client risk (monthly for high risk, quarterly or annual otherwise)' },
    { icon:'📢', texte:'**On demand**: during an event (list update, external alert, unusual transaction)' },
    { icon:'🔍', texte:'i-Hub applies the screening schedule defined in the SLA — and flags to PSF if a major list has been updated' },
  ], aretenir:'Screening: onboarding + periodic + on demand. Frequency set by PSF. i-Hub applies SLA schedule.' },
  { id:15, emoji:'💻', titre:'Screening tools', contenu:[
    { icon:'💻', texte:'Specialist tools (Dow Jones, World-Check, ACAMS…) aggregate global sanctions lists and enable automated screening' },
    { icon:'🔍', texte:'These tools perform the **automated search** — but **analysing results** remains human, performed by i-Hub' },
    { icon:'📜', texte:'PSF chooses tool and sets parameters (thresholds, lists to cover) — i-Hub uses tools provided or its own per SLA' },
    { icon:'⏰', texte:'Tools must be **regularly updated** to cover latest list changes — PSF or i-Hub responsibility per SLA' },
  ], aretenir:'Tool = automated search. Human = result analysis. Both are necessary. The tool does not replace judgement.' },
  { id:16, emoji:'⚠️', titre:'Sanctions and asset freezing', contenu:[
    { icon:'⚠️', texte:'Transacting with a sanctioned person or entity may constitute a **sanctions violation** — serious criminal offence' },
    { icon:'🔒', texte:'On a confirmed match, PSF has an obligation to **freeze assets** immediately and notify competent authorities' },
    { icon:'💰', texte:'Fines for sanctions violations can reach **billions of dollars** — several major banks have been convicted' },
    { icon:'🔍', texte:'This is why immediate escalation by i-Hub on a match is non-negotiable — delay can be very costly for the PSF' },
  ], aretenir:'Sanctions violation = criminal offence + immediate freeze. Immediate escalation on match is non-negotiable.' },
  { id:17, emoji:'📎', titre:'Screening documentation', contenu:[
    { icon:'📎', texte:'Every screening performed must be **documented and archived**: date, screened name(s), list(s) used, result(s), analysis' },
    { icon:'🟢', texte:'For a false positive: note precisely why the match was dismissed (different date of birth, different nationality…)' },
    { icon:'🚨', texte:'For a true match: note the time and date of escalation to PSF, person contacted, information transmitted' },
    { icon:'💼', texte:'This documentation is i-Hub’s proof of diligence — it must withstand a CSSF audit or judicial investigation' },
  ], aretenir:'Screening documentation = proof of diligence. False positive: written justification. True match: time and PSF contact noted.' },
  { id:18, emoji:'🤔', titre:'Borderline cases: when to escalate', contenu:[
    { icon:'🔴', texte:'**Unresolvable doubt**: available information does not allow concluding false positive with certainty → escalate' },
    { icon:'🔴', texte:'**Partial match on rare name**: first name differs but family name is identical and very rare → escalate to PSF' },
    { icon:'🔴', texte:'**Missing information**: not enough identifiers to confirm or dismiss → escalate and request more info via PSF' },
    { icon:'📌', texte:'Rule: when in doubt, escalate. Escalating wrongly is less serious than missing a true match.' },
  ], aretenir:'When in doubt = escalate. Better to escalate wrongly than miss a true match. The PSF has means to decide.' },
  { id:19, emoji:'💡', titre:'Screening and name entry accuracy: the crucial link', contenu:[
    { icon:'📌', texte:'A misspelled name can generate a **false negative** (real match not detected) — worse than a false positive' },
    { icon:'📝', texte:'Example: “Qadafi” entered as “Kadhafi” may not match “Gaddafi” on the list — all transliterations must be tested' },
    { icon:'🔄', texte:'Good tools handle spelling variants automatically — but accurate entry remains the foundation' },
    { icon:'🛑', texte:'Approximate entry that lets a sanctioned person through may engage **i-Hub’s contractual liability**' },
  ], aretenir:'Accurate entry = basis of screening. False negative (missed match) = maximum risk. Always copy from official document.' },
  { id:20, emoji:'🎓', titre:'Summary: Name Screening in 5 points', contenu:[
    { icon:'1️⃣', texte:'**Screening** = check names vs sanctions lists — UN, EU, OFAC, national lists' },
    { icon:'2️⃣', texte:'**Accuracy** = absolute obligation in entry — all name variants, exact copy from documents' },
    { icon:'3️⃣', texte:'**Analysis** = tool searches, human analyses — true match vs false positive, documented in all cases' },
    { icon:'4️⃣', texte:'**True match** = immediate and non-negotiable escalation to PSF — never any delay' },
    { icon:'5️⃣', texte:'**Doubt** = escalate. False positive = precise documentation. Everything archived for traceability.' },
  ], aretenir:'Screening: enter accurately, analyse humanly, escalate matches, document everything. PSF decides follow-up.' },
]

const MATCH_FR = [
  { result:'Nom criblé : "Mohamed Al-Farsi", né le 12/03/1975, nationalité irakienne. Liste : "Mohamed Al-Farsi, né le 12/03/1975, nationalité irakienne, désigné ONU 2019"', isMatch:true, explication:'Même nom, même date de naissance, même nationalité = vrai match. Escalade immédiate au PSF.' },
  { result:'Nom criblé : "Jean Dupont", né le 05/07/1982, français. Liste : "Jean Dupont, né le 05/07/1956, syrien, désigné UE 2021"', isMatch:false, explication:'Même nom mais date de naissance différente (26 ans d’écart) et nationalité différente. Faux positif à documenter.' },
  { result:'Nom criblé : "Vladimir Petrov", né le 22/11/1968, russe. Liste : "Vladimir Petrov", né le 22/11/1968, aucune autre info disponible"', isMatch:true, explication:'Même nom, même date de naissance. Même si peu d’infos : impossible d’écarter avec certitude. Escalader au PSF.' },
  { result:'Nom criblé : "Ahmed Hassan", né le 01/01/1990, marocain. Liste : "Ahmed Hassan" (prénom identique, patronyme très commun, pas de date de naissance)'  , isMatch:false, explication:'Nom très commun + aucun identifiant supplémentaire confirmant la correspondance. Faux positif à documenter avec justification.' },
  { result:'Nom criblé : "Olga Kovalenko", née le 14/06/1979, ukrainienne. Liste : "Olga Kovalenko, née le 14/06/1979, nationalité russe"', isMatch:false, explication:'Même nom et date de naissance mais nationalité différente. Faux positif probable — documenter la différence de nationalité. Si doute persistant, escalader.' },
  { result:'Nom criblé : "Kim Sung Jin", né le 30/09/1971, coréen du Nord. Liste : "Kim Sung Jin, né le 30/09/1971, coréen du Nord, sanctionné OFAC"', isMatch:true, explication:'Tous les identifiants correspondent. Vrai match. Escalade immédiate et non-négociable au PSF.' },
]
const MATCH_EN = [
  { result:'Screened name: "Mohamed Al-Farsi", born 12/03/1975, Iraqi nationality. List: "Mohamed Al-Farsi, born 12/03/1975, Iraqi nationality, UN designated 2019"', isMatch:true, explication:'Same name, same date of birth, same nationality = true match. Immediate escalation to PSF.' },
  { result:'Screened name: "Jean Dupont", born 05/07/1982, French. List: "Jean Dupont, born 05/07/1956, Syrian, EU designated 2021"', isMatch:false, explication:'Same name but different date of birth (26-year gap) and different nationality. False positive to document.' },
  { result:'Screened name: "Vladimir Petrov", born 22/11/1968, Russian. List: "Vladimir Petrov", born 22/11/1968, no other info available"', isMatch:true, explication:'Same name, same date of birth. Even with limited info: cannot dismiss with certainty. Escalate to PSF.' },
  { result:'Screened name: "Ahmed Hassan", born 01/01/1990, Moroccan. List: "Ahmed Hassan" (same first name, very common surname, no date of birth)', isMatch:false, explication:'Very common name + no additional confirming identifier. False positive to document with justification.' },
  { result:'Screened name: "Olga Kovalenko", born 14/06/1979, Ukrainian. List: "Olga Kovalenko, born 14/06/1979, Russian nationality"', isMatch:false, explication:'Same name and date of birth but different nationality. Probable false positive — document the nationality difference. If doubt persists, escalate.' },
  { result:'Screened name: "Kim Sung Jin", born 30/09/1971, North Korean. List: "Kim Sung Jin, born 30/09/1971, North Korean, OFAC sanctioned"', isMatch:true, explication:'All identifiers match. True match. Immediate and non-negotiable escalation to PSF.' },
]

const VF_FR = [
  { texte:'Un score de 100% dans un outil de screening garantit que c’est un vrai match', reponse:false, explication:'Non ! Un score élevé déclenche une analyse, pas une conclusion. Des homonymes parfaits existent. L’humain doit analyser.' },
  { texte:'i-Hub doit escalader immédiatement au PSF tout match qu’il ne peut pas écarter avec certitude', reponse:true, explication:'Exact ! En cas de doute non résolu, escalader est la seule option. Mieux vaut escalader à tort que rater un vrai match.' },
  { texte:'Un faux positif écarté sans documentation écrite est acceptable', reponse:false, explication:'Non ! Tout faux positif doit être documenté avec justification précise. Un écart non documenté peut être considéré comme une négligence.' },
  { texte:'Le screening des entités inclut aussi leurs dirigeants et UBO', reponse:true, explication:'Exact ! Une entité non sanctionnée peut avoir un dirigeant sanctionné. Tous doivent être screenés.' },
  { texte:'Le screening est uniquement réalisé à l’entrée en relation', reponse:false, explication:'Non ! Le screening est aussi continu — les clients existants doivent être recriblés régulièrement car les listes évoluent.' },
  { texte:'Un nom mal saisi peut générer un faux négatif plus dangereux qu’un faux positif', reponse:true, explication:'Exact ! Un faux négatif (match réel non détecté) expose le PSF à une violation de sanctions. Plus dangereux qu’un faux positif.' },
]
const VF_EN = [
  { texte:'A 100% score in a screening tool guarantees a true match', reponse:false, explication:'No! A high score triggers analysis, not a conclusion. Perfect homonyms exist. The human must analyse.' },
  { texte:'i-Hub must immediately escalate to PSF any match it cannot dismiss with certainty', reponse:true, explication:'Correct! When doubt cannot be resolved, escalation is the only option. Better to escalate wrongly than miss a true match.' },
  { texte:'A false positive dismissed without written documentation is acceptable', reponse:false, explication:'No! Every false positive must be documented with precise justification. An undocumented dismissal may be considered negligence.' },
  { texte:'Entity screening also includes their directors and UBOs', reponse:true, explication:'Correct! An unsanctioned entity may have a sanctioned director. All must be screened.' },
  { texte:'Screening is only performed at onboarding', reponse:false, explication:'No! Screening is also ongoing — existing clients must be re-screened regularly as lists evolve.' },
  { texte:'A misspelled name can generate a false negative more dangerous than a false positive', reponse:true, explication:'Correct! A false negative (real match not detected) exposes the PSF to a sanctions violation. More dangerous than a false positive.' },
]

const CAS_FR = [
  { situation:'Le PSF demande à i-Hub de screener "Mohammed Ben Ali", né le 15/04/1985, tunisien. L’outil retourne 5 correspondances. L’une a le même nom et date de naissance mais nationalité syrienne.', action:'Escalader au PSF : match sur nom et date de naissance, nationalité différente — doute non écarté avec certitude', options:['Accepter — nationalité différente = faux positif certain','Escalader au PSF : match sur nom et date de naissance, nationalité différente — doute non écarté avec certitude','Ignorer — trop de correspondances pour une décision','Demander directement au client final'], explication:'Nom + date de naissance identiques même si nationalité diffère : le doute ne peut pas être écarté avec certitude. Escalade au PSF.' },
  { situation:'Screening d’une société luxembourgeoise. L’entité n’est pas dans les listes. Mais un des dirigeants est sanctionné par l’OFAC.', action:'Escalader au PSF : dirigeant de l’entité sanctionné OFAC', options:['Accepter — la société elle-même n’est pas listée','Escalader au PSF : dirigeant de l’entité sanctionné OFAC','Informer directement le dirigeant','Ignorer — hors périmètre SLA si non demandé'], explication:'Un dirigeant sanctionné = vrai match à escalader même si l’entité ne l’est pas. L’entité peut être contrôlée par un sanctionné.' },
  { situation:'Screening de "Marie Durand", française, née le 03/02/1991. Aucun match dans les listes ONU, UE, OFAC. Pas d’alerte.', action:'Documenter le résultat négatif et archiver', options:['Ne pas archiver — pas de résultat = pas de documentation nécessaire','Documenter le résultat négatif et archiver','Recommencer le screening dans 1 heure par sécurité','Signaler au PSF que le screening est négatif'], explication:'Même un résultat négatif doit être documenté et archivé : date, listes utilisées, résultat. C’est la traçabilité de la diligence d’i-Hub.' },
]
const CAS_EN = [
  { situation:'PSF asks i-Hub to screen "Mohammed Ben Ali", born 15/04/1985, Tunisian. Tool returns 5 matches. One has same name and date of birth but Syrian nationality.', action:'Escalate to PSF: match on name and date of birth, different nationality — doubt cannot be dismissed with certainty', options:['Accept — different nationality = certain false positive','Escalate to PSF: match on name and date of birth, different nationality — doubt cannot be dismissed with certainty','Ignore — too many matches for a decision','Ask the final client directly'], explication:'Name + date of birth identical even if nationality differs: doubt cannot be dismissed with certainty. Escalate to PSF.' },
  { situation:'Screening of a Luxembourg company. The entity is not on any list. But one of the directors is sanctioned by OFAC.', action:'Escalate to PSF: entity director OFAC sanctioned', options:['Accept — the company itself is not listed','Escalate to PSF: entity director OFAC sanctioned','Inform the director directly','Ignore — outside SLA scope if not requested'], explication:'A sanctioned director = true match to escalate even if the entity is not. The entity may be controlled by a sanctioned person.' },
  { situation:'Screening of "Marie Durand", French, born 03/02/1991. No match in UN, EU, OFAC lists. No alert.', action:'Document negative result and archive', options:['Do not archive — no result = no documentation needed','Document negative result and archive','Restart screening in 1 hour for safety','Notify PSF that screening is negative'], explication:'Even a negative result must be documented and archived: date, lists used, result. This is the traceability of i-Hub’s diligence.' },
]

export default function ModuleNameScreening() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeMatch, setActiveMatch] = useState(() => pickRandom(MATCH_FR, 5))
  const [matchIndex, setMatchIndex] = useState(0)
  const [matchAnswer, setMatchAnswer] = useState<boolean|null>(null)
  const [matchScore, setMatchScore] = useState(0)
  const [matchAnim, setMatchAnim] = useState<'correct'|'wrong'|null>(null)

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
    const bm = l==='fr'?MATCH_FR:MATCH_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveMatch(pickRandom(bm,5)); setMatchIndex(0); setMatchScore(0); setMatchAnswer(null); setMatchAnim(null)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnim(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); initQuizzes(l) }

  function repMatch(rep: boolean) {
    if (matchAnswer !== null) return
    const correct = activeMatch[matchIndex].isMatch === rep
    setMatchAnswer(rep); setMatchAnim(correct ? 'correct' : 'wrong')
    if (correct) setMatchScore(s => s + 1)
    setTimeout(() => {
      setMatchAnim(null); setMatchAnswer(null)
      if (matchIndex + 1 < activeMatch.length) { setMatchIndex(i => i + 1) }
      else { setScore(s => s + (correct ? matchScore + 1 : matchScore) * 6); setPhase('quiz2') }
    }, 2500)
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🎯 {t.title}</span>
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
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🎯</div>
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
    const a = activeMatch[matchIndex]
    return (
      <div style={{...base,background:matchAnim==='correct'?'#d1fae5':matchAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:matchAnim==='correct'?'#6ee7b7':matchAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(matchIndex/activeMatch.length)*100}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'640px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {matchIndex+1}/{activeMatch.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q1title}</h2>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',textAlign:'left'}}>
            <p style={{fontSize:'14px',fontWeight:'600',color:'#374151',lineHeight:1.7,margin:0}}>🎯 {a.result}</p>
          </div>
          {matchAnswer === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repMatch(true)} style={{padding:'18px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'13px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.match}</button>
              <button onClick={() => repMatch(false)} style={{padding:'18px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'13px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.fp}</button>
            </div>
          ) : (
            <div style={{background:matchAnim==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${matchAnim==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{matchAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:matchAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{matchAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{a.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeMatch.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=matchIndex?C:'#e5e7eb'}}/>)}
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
            <p style={{fontSize:'17px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
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
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>🎯 {cas.situation}</p>
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
