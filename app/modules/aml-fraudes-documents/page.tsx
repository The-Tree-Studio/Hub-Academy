'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e91e8c'

const UI = {
  fr: {
    title: 'Fraudes aux documents',
    subtitle: 'Reconnaître les signaux visuels suspects — sans être expert en falsification',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Les types de fraudes documentaires les plus fréquentes',
      'Les signaux visuels suspects à détecter',
      'Ce que i-Hub peut et ne peut pas faire face à un document suspect',
      'La différence entre signal et certitude de fraude',
      'Comment signaler au PSF sans conclure',
      'Les documents les plus souvent falsifiés',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · SIGNAL OU PAS ?', q1title: '🔍 Ce signe est-il un signal suspect ?',
    suspect: '🚨 Signal suspect', ok: '✅ Normal — pas de signal',
    q2label: 'QUIZ 2/3 · VRAI OU FAUX', q2title: '✅ Vrai ou Faux — Fraudes documentaires',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q3label: 'QUIZ 3/3 · QUE FAIT i-Hub ?', q3title: '🤔 Quelle est la bonne réaction ?',
    resultTitle: 'Module terminé — Vous détectez les signaux suspects !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    medal_gold: 'Expert fraudes !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Terminer →',
  },
  en: {
    title: 'Document Fraud',
    subtitle: 'Recognising suspicious visual signals — without being a forgery expert',
    learn: '📚 What you will learn:',
    learnItems: [
      'The most common types of document fraud',
      'Suspicious visual signals to detect',
      'What i-Hub can and cannot do when facing a suspicious document',
      'The difference between a signal and certainty of fraud',
      'How to flag to PSF without concluding',
      'The most frequently forged documents',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · SIGNAL OR NOT?', q1title: '🔍 Is this sign a suspicious signal?',
    suspect: '🚨 Suspicious signal', ok: '✅ Normal — no signal',
    q2label: 'QUIZ 2/3 · TRUE OR FALSE', q2title: '✅ True or False — Document fraud',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q3label: 'QUIZ 3/3 · WHAT DOES i-Hub DO?', q3title: '🤔 What is the correct reaction?',
    resultTitle: 'Module complete — You detect suspicious signals!',
    backHome: '← Back', restart: '🔄 Restart',
    medal_gold: 'Fraud Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Finish →',
  },
}

const FICHES_FR = [
  { id:1, emoji:'⚠️', titre:'La fraude documentaire : de quoi parle-t-on ?', contenu:[
    { icon:'⚠️', texte:'La **fraude documentaire** consiste à produire ou utiliser un faux document pour obtenir un avantage (compte bancaire, crédit, identité légale)' },
    { icon:'📊', texte:'C’est l’une des entrées les plus fréquentes dans le blanchiment — une identité false permet d’ouvrir des comptes fictifs' },
    { icon:'🔍', texte:'i-Hub n’est **pas** un expert en authentification documentaire — mais il doit signaler tout **signal visuel suspect** au PSF' },
    { icon:'🛑', texte:'Règle absolue : « je vois quelque chose d’étrange » = signal au PSF. Jamais conclure « c’est un faux » seul.' },
  ], aretenir:'Signal visuel suspect ≠ certitude de fraude. i-Hub signale ce qu’il voit. La conclusion appartient aux experts du PSF.' },

  { id:2, emoji:'📸', titre:'Les 3 types de fraudes documentaires', contenu:[
    { icon:'1️⃣', texte:'**Document falsifié** : un document authentique modifié (photo changée, nom altéré, date modifiée)' },
    { icon:'2️⃣', texte:'**Document contrefait** : un faux document fabriqué de toutes pièces imitant un document officiel' },
    { icon:'3️⃣', texte:'**Document authentique utilisé frauduleusement** : un vrai document appartenant à quelqu’un d’autre (vol d’identité)' },
    { icon:'🔍', texte:'i-Hub peut potentiellement détecter des signaux des types 1 et 2 visuellement — le type 3 est hors périmètre sans base de données' },
  ], aretenir:'3 types : falsifié, contrefait, utilisé frauduleusement. i-Hub peut détecter des signaux visuels sur les deux premiers.' },

  { id:3, emoji:'📸', titre:'Signaux sur la photo', contenu:[
    { icon:'🔴', texte:'**Photo flouée ou coupée** : intentionnellement dégradée pour masquer les traits ou éviter la comparaison' },
    { icon:'🔴', texte:'**Photo collage visible** : bords nets autour de la photo, zone photo de couleur légèrement différente du reste du document' },
    { icon:'🔴', texte:'**Pliure suspecte** précisement sur la zone photo — peut indiquer une tentative de remplacement' },
    { icon:'🔴', texte:'**Différence de résolution** entre la photo et le reste du document — photo de meilleure ou moins bonne qualité' },
  ], aretenir:'4 signaux photo : flou/coupé, bords de collage, pliure sur photo, différence de résolution. Tout signal visible = alert au PSF.' },

  { id:4, emoji:'📝', titre:'Signaux sur les données textuelles', contenu:[
    { icon:'🔴', texte:'**Police différente** sur une partie du document — un chiffre ou une lettre d’un style légèrement différent' },
    { icon:'🔴', texte:'**Alignement irrégulier** — une ligne de texte légèrement décalée par rapport aux autres' },
    { icon:'🔴', texte:'**MRZ incohérente** : les données dans la zone lisible en bas du passeport ne correspondent pas au corps du document' },
    { icon:'🔴', texte:'**Surimpression visible** : trace d’une donnée précédente (date ou nom) transparaissant sous la nouvelle' },
  ], aretenir:'Police, alignement, MRZ, surimpression — 4 signaux textuels. i-Hub les signale au PSF sans conclure à la fraude.' },

  { id:5, emoji:'💻', titre:'Signaux numériques (documents scannés)', contenu:[
    { icon:'🔴', texte:'**Pixels inhabituels** autour d’un chiffre ou d’un nom — indice de copier-coller ou de retouche numérique' },
    { icon:'🔴', texte:'**Compression JPEG excessive** sur une partie seulement — signe d’une modification post-scan' },
    { icon:'🔴', texte:'**Métadonnées suspectes** du fichier PDF ou image — logiciel d’édition (Photoshop, GIMP) dans les métadonnées' },
    { icon:'🔴', texte:'**Fond de document** (guillochés, filigranes) visible à certains endroits mais absent à d’autres' },
  ], aretenir:'Pixels, compression, métadonnées, filigranes discontinus — signaux numériques. i-Hub signale ce qui est visible, pas les métadonnées (hors périmètre).' },

  { id:6, emoji:'🪪', titre:'Les documents les plus souvent falsifiés', contenu:[
    { icon:'🪪', texte:'**Passeport** : le plus ciblé, car accepté universellement — notamment les passeports des pays ayant des stickers visa collables' },
    { icon:'🏠', texte:'**Justificatif de domicile** : très facile à falsifier numériquement — adresse modifiée sur une vraie facture' },
    { icon:'💼', texte:'**Bulletins de salaire** : montant modifié pour justifier une source de fonds plus importante' },
    { icon:'🏢', texte:'**Extrait Kbis / registre de commerce** : date ou données modifiées pour donner une apparence légitime à une entité' },
  ], aretenir:'4 documents les plus falsifiés : passeport, justificatif domicile, bulletin de salaire, Kbis. Vigilance accrue sur ces documents.' },

  { id:7, emoji:'🔍', titre:'Ce que i-Hub peut détecter', contenu:[
    { icon:'✅', texte:'Signaux **visuellement détectables** sur un document numérique : photo, police, alignement, MRZ, pliures' },
    { icon:'✅', texte:'**Incohérence entre données** : le nom dans la MRZ ne correspond pas au nom dans le corps du passeport' },
    { icon:'✅', texte:'**Document visuellement dégradé** : scan trop sombre, photo illisible, document découpé — retransmission demandée' },
    { icon:'✅', texte:'**Différences entre documents** : la photo sur le permis de conduire semble différente de celle du passeport' },
  ], aretenir:'i-Hub détecte les signaux visibles : photo, police, MRZ, cohérence entre documents. Tout signal = transmission au PSF.' },

  { id:8, emoji:'❌', titre:'Ce que i-Hub NE peut PAS détecter', contenu:[
    { icon:'❌', texte:'i-Hub ne peut **pas** déterminer si un passeport est entièrement contrefait — expertise technique requise (police, gendarmerie)' },
    { icon:'❌', texte:'i-Hub ne peut **pas** détecter qu’un vrai document a été volé et utilisé par une autre personne — hors périmètre' },
    { icon:'❌', texte:'i-Hub ne peut **pas** analyser les métadonnées numériques des fichiers — sauf si le SLA le prévoit avec des outils spécifiques' },
    { icon:'❌', texte:'i-Hub ne peut **pas** vérifier les éléments de sécurité physiques (hologrammes, encres UV) sur des copies numériques' },
  ], aretenir:'i-Hub détecte le visible. Il ne peut pas expertiser les faux, détecter les vols d’identité ou analyser les éléments physiques.' },

  { id:9, emoji:'📢', titre:'Comment signaler un document suspect', contenu:[
    { icon:'1️⃣', texte:'**Décrire précisément le signal** : « la zone photo du passeport présente des bords nets suggérant un remplacement »' },
    { icon:'2️⃣', texte:'**Ne pas conclure** : « signal à vérifier » et non « ce document est un faux »' },
    { icon:'3️⃣', texte:'**Signaler au PSF** dans le rapport de vérification avec les observations précises' },
    { icon:'4️⃣', texte:'**Archiver** le rapport — si le document est effectivement frauduleux, la traçabilité protège i-Hub' },
  ], aretenir:'Décrire → Ne pas conclure → Signaler au PSF → Archiver. Le rapport doit être factuel, jamais accusatoire.' },

  { id:10, emoji:'🔍', titre:'La MRZ du passeport : ce qu’elle contient', contenu:[
    { icon:'📝', texte:'La **MRZ** (Machine Readable Zone) est la zone de deux lignes en bas du passeport, formée de lettres et chiffres' },
    { icon:'📊', texte:'Elle contient : code pays, nom et prénom, numéro de passeport, nationalité, date de naissance, date d’expiration' },
    { icon:'⚠️', texte:'Signal clé : si les données MRZ ne correspondent pas aux données du corps du passeport — incohérence à signaler' },
    { icon:'🔍', texte:'i-Hub vérifie visuellement que la MRZ est **lisible, complète et cohérente** avec les données du reste du document' },
  ], aretenir:'MRZ lisible + cohérente avec le corps = bon signe. MRZ illisible ou incohérente = signal au PSF.' },

  { id:11, emoji:'🏠', titre:'Le justificatif de domicile : signals spécifiques', contenu:[
    { icon:'🔴', texte:'**Logo ou en-tête aléatoire** : logo du fournisseur flou, pixelisé ou visuellement différent des vrais documents de ce fournisseur' },
    { icon:'🔴', texte:'**Adresse modifiée** : zone d’adresse d’une police légèrement différente du reste du texte' },
    { icon:'🔴', texte:'**Date suspecte** : date de facturation qui ne correspond pas à un cycle de facturation normal (ex : facture électrique du 31 février)' },
    { icon:'🔴', texte:'**Format inhabituel** : mise en page très différente des justificatifs de même type habituellement vus' },
  ], aretenir:'Justificatif de domicile = document facile à falsifier. Logo, adresse, date, format — 4 zones de vigilance spécifiques.' },

  { id:12, emoji:'💼', titre:'Le bulletin de salaire : signaux spécifiques', contenu:[
    { icon:'🔴', texte:'**Montant incohérent** : salaire net très supérieur au salaire brut, ou montants ronds suspects (ex : exactement 10 000€ nets)' },
    { icon:'🔴', texte:'**Cotisations sociales absentes ou erronées** : un vrai bulletin de salaire français ou luxembourgeois a des cotisations détaillées' },
    { icon:'🔴', texte:'**Incohérence avec le contrat** : salaire différent du contrat de travail fourni dans le même dossier' },
    { icon:'🔍', texte:'i-Hub signale toute incohérence visible — c’est le PSF qui demande des clarifications à son client final' },
  ], aretenir:'Bulletin de salaire : montant cohérent, cotisations présentes, compatible avec le contrat. Toute incohérence = signal.' },

  { id:13, emoji:'📱', titre:'Les copies numériques vs les originaux', contenu:[
    { icon:'📱', texte:'La plupart des documents reçus par i-Hub sont des **copies numériques** (scan, photo, PDF) — pas des originaux' },
    { icon:'⚠️', texte:'Limite importante : les éléments de sécurité physiques (hologrammes, encres réactives, microimpressions) ne sont pas vérifiables sur numérique' },
    { icon:'🔍', texte:'Sur une copie numérique, i-Hub se concentre sur : photo, police, alignement, MRZ, cohérence des données, qualité du scan' },
    { icon:'📜', texte:'Si le SLA prévoit une vérification d’original physique, i-Hub applique les procédures correspondantes du PSF' },
  ], aretenir:'Copie numérique = limite sur les éléments physiques. i-Hub se concentre sur le visible : photo, police, MRZ, cohérence.' },

  { id:14, emoji:'🔍', titre:'La comparaison entre documents', contenu:[
    { icon:'🔍', texte:'Comparer la **photo sur le passeport** avec la photo sur un autre document d’identité (carte d’identité, permis) — correspondent-elles ?' },
    { icon:'📝', texte:'Comparer la **signature** sur le passeport (si visible) avec la signature sur le formulaire KYC — sont-elles compatibles ?' },
    { icon:'🎂', texte:'Comparer la **date de naissance** sur le passeport et sur l’extrait de naissance s’il est fourni — différence = signal' },
    { icon:'🛑', texte:'Toute différence entre deux documents est signalée — même si une explication culturelle est possible' },
  ], aretenir:'Comparer photo, signature, date de naissance entre documents. Toute différence = signal au PSF, même si explication possible.' },

  { id:15, emoji:'🛑', titre:'La règle absolue : signal, pas conclusion', contenu:[
    { icon:'✅', texte:'Ce qu’i-Hub dit : « J’observe que la zone photo présente des bords nets qui méritent vérification »' },
    { icon:'❌', texte:'Ce qu’i-Hub NE dit PAS : « Ce document est faux » ou « Ce client est un fraudeur »' },
    { icon:'⚠️', texte:'Une accusation infondée de fraude peut engager la **responsabilité juridique** d’i-Hub et du PSF' },
    { icon:'📎', texte:'Le rapport est factuel : « signal détecté, à valider par le PSF » — jamais accusatoire' },
  ], aretenir:'Signal ≠ conclusion. Factuel et neutre dans le rapport. C’est le PSF qui tranche. Une fausse accusation = problème juridique.' },

  { id:16, emoji:'👮', titre:'Que fait le PSF face à un document suspect ?', contenu:[
    { icon:'👮', texte:'Le PSF peut demander à son client final de **fournir l’original** physique ou de passer en agence' },
    { icon:'🔍', texte:'Le PSF peut soumettre le document à des **experts en authentification** (services spécialisés, police)' },
    { icon:'🚨', texte:'Si la fraude est confirmée, le PSF peut être obligé de faire une **STR à la CRF** et de refuser la relation' },
    { icon:'🔍', texte:'i-Hub transmet le rapport factuel au PSF — c’est le PSF qui décide des étapes suivantes' },
  ], aretenir:'Face à un signal d’i-Hub, le PSF peut : demander l’original, consulter des experts, faire une STR. i-Hub ne fait rien de tout cela seul.' },

  { id:17, emoji:'⚠️', titre:'Les red flags combinés', contenu:[
    { icon:'🔴', texte:'**Plusieurs signaux simultanés** : photo suspecte + police différente + MRZ incohérente = risque très élevé' },
    { icon:'🔴', texte:'**Signal documentaire + comportement** : document suspect + refus de fournir l’original + source de fonds élevée' },
    { icon:'🔴', texte:'**Incohérence croisée** : photo différente entre passeport et permis de conduire du même dossier' },
    { icon:'📎', texte:'Plus les red flags se cumulent, plus le rapport i-Hub est détaillé — et plus urgent est le signal au PSF' },
  ], aretenir:'Plusieurs signals simultanés = urgence accrue du signal au PSF. Chaque signal est documenté séparément dans le rapport.' },

  { id:18, emoji:'📅', titre:'Documents de substitution suspects', contenu:[
    { icon:'⚠️', texte:'Quand un client final refuse de fournir un document spécifique et propose une **alternative inhabituelle** : signal' },
    { icon:'📝', texte:'Exemple : refus de fournir un passeport, remplacement par une pilè de documents non-officiels ou une traduction non certifiée' },
    { icon:'🛑', texte:'Un document officiel ne peut pas être remplacé par un document non-officiel — le PSF doit obtenir le document requis' },
    { icon:'🔍', texte:'i-Hub signale au PSF si les documents transmis ne correspondent pas à ce qui était requis dans le SLA' },
  ], aretenir:'Document de substitution non-officiel = signal au PSF. Le PSF exige le document requis auprès de son client final.' },

  { id:19, emoji:'💡', titre:'Les 5 questions de vérification anti-fraude', contenu:[
    { icon:'❓', texte:'**La photo est-elle visible et non modifiée ?** — bords nets, résolution cohérente, pas de pliure suspecte' },
    { icon:'❓', texte:'**La MRZ est-elle lisible et cohérente avec le corps du document ?**' },
    { icon:'❓', texte:'**La police de caractères est-elle uniforme sur tout le document ?**' },
    { icon:'❓', texte:'**Les données du document correspondent-elles aux autres documents du dossier ?**' },
    { icon:'❓', texte:'**Le document a-t-il l’apparence visuelle attendue pour ce type et ce pays ?**' },
  ], aretenir:'5 questions : photo, MRZ, police, cohérence croisée, apparence attendue. Si une réponse soulève un doute = signal au PSF.' },

  { id:20, emoji:'🎓', titre:'Résumé : fraudes documentaires en 5 points', contenu:[
    { icon:'1️⃣', texte:'**3 types de fraudes** : falsifié, contrefait, utilisé frauduleusement. i-Hub peut détecter des signaux sur les deux premiers.' },
    { icon:'2️⃣', texte:'**5 zones de vérification** : photo, MRZ, police, cohérence croisée, apparence générale' },
    { icon:'3️⃣', texte:'**Signal ≠ conclusion** : i-Hub décrit ce qu’il voit sans accuser. Rapport factuel et neutre.' },
    { icon:'4️⃣', texte:'**Tout signal = PSF** : transmettre au PSF qui décide des étapes suivantes (original, experts, STR)' },
    { icon:'5️⃣', texte:'**Archiver** : chaque vérification datée et archivée — protection d’i-Hub si la fraude est confirmée ultérieurement' },
  ], aretenir:'Fraude documentaire : détecter le visible, signaler au PSF, ne pas conclure, archiver. Factuel et neutre toujours.' },
]

const FICHES_EN = [
  { id:1, emoji:'⚠️', titre:'Document fraud: what are we talking about?', contenu:[
    { icon:'⚠️', texte:'**Document fraud** consists of producing or using a false document to obtain an advantage (bank account, credit, legal identity)' },
    { icon:'📊', texte:'It is one of the most common entry points into money laundering — a false identity enables fictitious accounts to be opened' },
    { icon:'🔍', texte:'i-Hub is **not** a documentary authentication expert — but it must flag any **suspicious visual signal** to the PSF' },
    { icon:'🛑', texte:'Absolute rule: “I see something strange” = flag to PSF. Never conclude “it’s a forgery” alone.' },
  ], aretenir:'Suspicious visual signal ≠ certainty of fraud. i-Hub flags what it sees. Conclusions belong to PSF experts.' },
  { id:2, emoji:'📸', titre:'The 3 types of document fraud', contenu:[
    { icon:'1️⃣', texte:'**Altered document**: an authentic document that has been modified (photo changed, name altered, date modified)' },
    { icon:'2️⃣', texte:'**Counterfeit document**: a fake document made from scratch imitating an official document' },
    { icon:'3️⃣', texte:'**Authentic document used fraudulently**: a real document belonging to someone else (identity theft)' },
    { icon:'🔍', texte:'i-Hub may potentially detect signals from types 1 and 2 visually — type 3 is out of scope without a database' },
  ], aretenir:'3 types: altered, counterfeit, fraudulently used. i-Hub can detect visual signals on the first two.' },
  { id:3, emoji:'📸', titre:'Photo signals', contenu:[
    { icon:'🔴', texte:'**Blurred or cut photo**: intentionally degraded to mask features or avoid comparison' },
    { icon:'🔴', texte:'**Visible photo collage**: sharp edges around the photo, photo zone slightly different colour from the rest' },
    { icon:'🔴', texte:'**Suspicious fold** precisely on the photo area — may indicate a replacement attempt' },
    { icon:'🔴', texte:'**Resolution difference** between photo and rest of document — photo of better or worse quality' },
  ], aretenir:'4 photo signals: blurred/cut, collage edges, fold on photo, resolution difference. Any visible signal = flag to PSF.' },
  { id:4, emoji:'📝', titre:'Text data signals', contenu:[
    { icon:'🔴', texte:'**Different font** on part of the document — a digit or letter of slightly different style' },
    { icon:'🔴', texte:'**Irregular alignment** — a line of text slightly offset from the others' },
    { icon:'🔴', texte:'**Inconsistent MRZ**: data in the machine-readable zone does not match the document body' },
    { icon:'🔴', texte:'**Visible overprint**: trace of a previous value (date or name) showing through the new one' },
  ], aretenir:'Font, alignment, MRZ, overprint — 4 text signals. i-Hub flags them to PSF without concluding fraud.' },
  { id:5, emoji:'💻', titre:'Digital signals (scanned documents)', contenu:[
    { icon:'🔴', texte:'**Unusual pixels** around a digit or name — sign of copy-paste or digital editing' },
    { icon:'🔴', texte:'**Excessive JPEG compression** on one part only — sign of post-scan modification' },
    { icon:'🔴', texte:'**Suspicious file metadata** — editing software (Photoshop, GIMP) in PDF or image metadata' },
    { icon:'🔴', texte:'**Document background** (guillochés, watermarks) visible in some areas but absent in others' },
  ], aretenir:'Pixels, compression, metadata, discontinuous watermarks — digital signals. i-Hub flags what is visible, not metadata (out of scope).' },
  { id:6, emoji:'🪪', titre:'The most frequently forged documents', contenu:[
    { icon:'🪪', texte:'**Passport**: the most targeted, universally accepted — especially passports from countries with pasteable visa stickers' },
    { icon:'🏠', texte:'**Proof of residence**: very easy to forge digitally — address modified on a real invoice' },
    { icon:'💼', texte:'**Payslips**: amount modified to justify a larger source of funds' },
    { icon:'🏢', texte:'**Company extract / trade register**: date or data modified to give a legitimate appearance to an entity' },
  ], aretenir:'4 most forged documents: passport, proof of residence, payslip, company extract. Heightened vigilance on these.' },
  { id:7, emoji:'🔍', titre:'What i-Hub can detect', contenu:[
    { icon:'✅', texte:'**Visually detectable signals** on a digital document: photo, font, alignment, MRZ, folds' },
    { icon:'✅', texte:'**Data inconsistency**: the name in the MRZ does not match the name in the passport body' },
    { icon:'✅', texte:'**Visually degraded document**: too dark scan, illegible photo, cut document — retransmission requested' },
    { icon:'✅', texte:'**Differences between documents**: photo on driving licence appears different from passport photo' },
  ], aretenir:'i-Hub detects visible signals: photo, font, MRZ, cross-document consistency. Every signal = transmission to PSF.' },
  { id:8, emoji:'❌', titre:'What i-Hub CANNOT detect', contenu:[
    { icon:'❌', texte:'i-Hub **cannot** determine if a passport is entirely counterfeit — technical expertise required (police, gendarmerie)' },
    { icon:'❌', texte:'i-Hub **cannot** detect that a real document was stolen and used by another person — out of scope' },
    { icon:'❌', texte:'i-Hub **cannot** analyse digital file metadata — unless SLA provides for this with specific tools' },
    { icon:'❌', texte:'i-Hub **cannot** verify physical security features (holograms, UV inks) on digital copies' },
  ], aretenir:'i-Hub detects what is visible. It cannot expertly assess forgeries, detect identity theft or check physical features.' },
  { id:9, emoji:'📢', titre:'How to flag a suspicious document', contenu:[
    { icon:'1️⃣', texte:'**Describe the signal precisely**: “the passport photo area has sharp edges suggesting a replacement”' },
    { icon:'2️⃣', texte:'**Do not conclude**: “signal to verify” and not “this document is a forgery”' },
    { icon:'3️⃣', texte:'**Flag to PSF** in the verification report with precise observations' },
    { icon:'4️⃣', texte:'**Archive** the report — if the document is indeed fraudulent, traceability protects i-Hub' },
  ], aretenir:'Describe → Do not conclude → Flag to PSF → Archive. The report must be factual, never accusatory.' },
  { id:10, emoji:'🔍', titre:'The passport MRZ: what it contains', contenu:[
    { icon:'📝', texte:'The **MRZ** (Machine Readable Zone) is the two-line zone at the bottom of the passport, made up of letters and digits' },
    { icon:'📊', texte:'It contains: country code, surname and given names, passport number, nationality, date of birth, expiry date' },
    { icon:'⚠️', texte:'Key signal: if MRZ data does not match data in the passport body — inconsistency to flag' },
    { icon:'🔍', texte:'i-Hub visually checks that the MRZ is **legible, complete and consistent** with the rest of the document’s data' },
  ], aretenir:'Legible MRZ + consistent with body = good sign. Illegible or inconsistent MRZ = flag to PSF.' },
  { id:11, emoji:'🏠', titre:'Proof of residence: specific signals', contenu:[
    { icon:'🔴', texte:'**Random logo or header**: provider logo blurry, pixelated or visually different from real documents of that provider' },
    { icon:'🔴', texte:'**Modified address**: address area in slightly different font from the rest of the text' },
    { icon:'🔴', texte:'**Suspicious date**: billing date inconsistent with normal billing cycles (e.g. electricity bill dated 31 February)' },
    { icon:'🔴', texte:'**Unusual format**: layout very different from similar document types usually seen' },
  ], aretenir:'Proof of residence = easy to forge. Logo, address, date, format — 4 specific vigilance areas.' },
  { id:12, emoji:'💼', titre:'Payslip: specific signals', contenu:[
    { icon:'🔴', texte:'**Inconsistent amount**: net salary much higher than gross, or suspiciously round amounts (e.g. exactly €10,000 net)' },
    { icon:'🔴', texte:'**Absent or erroneous social contributions**: a genuine French or Luxembourg payslip has detailed contributions' },
    { icon:'🔴', texte:'**Inconsistency with contract**: salary different from the employment contract in the same file' },
    { icon:'🔍', texte:'i-Hub flags any visible inconsistency — PSF seeks clarification from its final client' },
  ], aretenir:'Payslip: consistent amount, contributions present, compatible with contract. Any inconsistency = flag.' },
  { id:13, emoji:'📱', titre:'Digital copies vs originals', contenu:[
    { icon:'📱', texte:'Most documents received by i-Hub are **digital copies** (scan, photo, PDF) — not originals' },
    { icon:'⚠️', texte:'Important limit: physical security features (holograms, reactive inks, microprints) cannot be verified digitally' },
    { icon:'🔍', texte:'On a digital copy, i-Hub focuses on: photo, font, alignment, MRZ, data consistency, scan quality' },
    { icon:'📜', texte:'If the SLA provides for physical original verification, i-Hub applies the PSF’s corresponding procedures' },
  ], aretenir:'Digital copy = limits on physical features. i-Hub focuses on what is visible: photo, font, MRZ, consistency.' },
  { id:14, emoji:'🔍', titre:'Cross-document comparison', contenu:[
    { icon:'🔍', texte:'Compare the **photo on the passport** with the photo on another identity document (ID card, licence) — do they match?' },
    { icon:'📝', texte:'Compare the **signature** on the passport (if visible) with the signature on the KYC form — are they compatible?' },
    { icon:'🎂', texte:'Compare the **date of birth** on the passport and birth certificate if provided — difference = signal' },
    { icon:'🛑', texte:'Any difference between two documents is flagged — even if a cultural explanation is possible' },
  ], aretenir:'Compare photo, signature, date of birth between documents. Any difference = flag to PSF, even if explanation possible.' },
  { id:15, emoji:'🛑', titre:'The absolute rule: signal, not conclusion', contenu:[
    { icon:'✅', texte:'What i-Hub says: “I observe that the photo area has sharp edges that warrant verification”' },
    { icon:'❌', texte:'What i-Hub does NOT say: “This document is fake” or “This client is a fraudster”' },
    { icon:'⚠️', texte:'An unfounded fraud accusation can engage i-Hub’s and the PSF’s **legal liability**' },
    { icon:'📎', texte:'The report is factual: “signal detected, to be validated by the PSF” — never accusatory' },
  ], aretenir:'Signal ≠ conclusion. Factual and neutral in the report. PSF decides. A false accusation = legal problem.' },
  { id:16, emoji:'👮', titre:'What the PSF does with a suspicious document', contenu:[
    { icon:'👮', texte:'The PSF can ask its final client to **provide the physical original** or come into a branch' },
    { icon:'🔍', texte:'The PSF can submit the document to **authentication experts** (specialist services, police)' },
    { icon:'🚨', texte:'If fraud is confirmed, the PSF may be required to file a **STR to the FIU** and refuse the relationship' },
    { icon:'🔍', texte:'i-Hub transmits the factual report to the PSF — it is the PSF that decides on next steps' },
  ], aretenir:'On i-Hub’s signal, PSF can: request original, consult experts, file STR. i-Hub does none of this alone.' },
  { id:17, emoji:'⚠️', titre:'Combined red flags', contenu:[
    { icon:'🔴', texte:'**Multiple simultaneous signals**: suspicious photo + different font + inconsistent MRZ = very high risk' },
    { icon:'🔴', texte:'**Documentary signal + behaviour**: suspicious document + refusal to provide original + high source of funds' },
    { icon:'🔴', texte:'**Cross-document inconsistency**: different photo between passport and driving licence in the same file' },
    { icon:'📎', texte:'The more red flags accumulate, the more detailed i-Hub’s report — and the more urgent the flag to PSF' },
  ], aretenir:'Multiple simultaneous signals = increased urgency of flag to PSF. Each signal documented separately in the report.' },
  { id:18, emoji:'📅', titre:'Suspicious substitute documents', contenu:[
    { icon:'⚠️', texte:'When a final client refuses to provide a specific document and proposes an **unusual alternative**: signal' },
    { icon:'📝', texte:'Example: refusal to provide passport, replaced by a pile of unofficial documents or uncertified translation' },
    { icon:'🛑', texte:'An official document cannot be replaced by an unofficial one — the PSF must obtain the required document' },
    { icon:'🔍', texte:'i-Hub flags to PSF if documents transmitted do not match what was required in the SLA' },
  ], aretenir:'Unofficial substitute document = flag to PSF. The PSF requires the correct document from its final client.' },
  { id:19, emoji:'💡', titre:'The 5 anti-fraud verification questions', contenu:[
    { icon:'❓', texte:'**Is the photo visible and unmodified?** — sharp edges, consistent resolution, no suspicious fold' },
    { icon:'❓', texte:'**Is the MRZ legible and consistent with the document body?**' },
    { icon:'❓', texte:'**Is the font uniform throughout the document?**' },
    { icon:'❓', texte:'**Do the document data match the other documents in the file?**' },
    { icon:'❓', texte:'**Does the document have the expected visual appearance for this type and country?**' },
  ], aretenir:'5 questions: photo, MRZ, font, cross-consistency, expected appearance. Any doubt = flag to PSF.' },
  { id:20, emoji:'🎓', titre:'Summary: document fraud in 5 points', contenu:[
    { icon:'1️⃣', texte:'**3 fraud types**: altered, counterfeit, fraudulently used. i-Hub can detect signals on the first two.' },
    { icon:'2️⃣', texte:'**5 verification zones**: photo, MRZ, font, cross-consistency, general appearance' },
    { icon:'3️⃣', texte:'**Signal ≠ conclusion**: i-Hub describes what it sees without accusing. Factual and neutral report.' },
    { icon:'4️⃣', texte:'**Every signal = PSF**: transmit to PSF which decides next steps (original, experts, STR)' },
    { icon:'5️⃣', texte:'**Archive**: every dated verification archived — i-Hub protection if fraud confirmed later' },
  ], aretenir:'Document fraud: detect what is visible, flag to PSF, do not conclude, archive. Factual and neutral always.' },
]

const SIGNALS_FR = [
  { signal:'Photo du passeport légèrement floue mais la personne est identifiable', isSuspect:false, explication:'Photo légèrement floue mais lisible = acceptable. Le fl ou seul n’est pas un signal de fraude si la personne reste identifiable.' },
  { signal:'Bords nets et très précis autour de la photo du passeport', isSuspect:true, explication:'Bords nets autour de la photo = signal possible de remplacement de photo (collage). À signaler au PSF.' },
  { signal:'MRZ du passeport lisible mais le nom en MRZ est "DUPONT" et le corps du document dit "DUPOND"', isSuspect:true, explication:'Incohérence MRZ vs corps du document = signal très significatif. Le nom devrait être identique. Signal immédiat au PSF.' },
  { signal:'Passeport en parfait état, scan de bonne qualité, données lisibles et cohérentes', isSuspect:false, explication:'Document en bon état, scan clair, données cohérentes = aucun signal suspect. Pas de raison de signaler.' },
  { signal:'Un chiffre dans la date d’expiration semble d’une police légèrement différente', isSuspect:true, explication:'Police différente sur un seul caractère = signal suspect de modification. À signaler au PSF même si l’explication peut être innocent.' },
  { signal:'Justificatif de domicile avec logo de l’entreprise pixelisé et flou', isSuspect:true, explication:'Logo pixelisé = signal suspect de falsification numérique. Les vrais documents d’une entreprise ont généralement un logo net.' },
  { signal:'Passeport scané légèrement de biais (pas droit)', isSuspect:false, explication:'Scan légèrement de biais = problème de numérisation, pas de signal de fraude. Document à redemander si illisible.' },
  { signal:'Photo du permis de conduire diffère visiblement de la photo du passeport du même dossier', isSuspect:true, explication:'Photos différentes entre deux documents du même dossier = signal très significatif. Peut indiquer un vol d’identité ou une falsification.' },
]
const SIGNALS_EN = [
  { signal:'Passport photo slightly blurry but person is identifiable', isSuspect:false, explication:'Slightly blurry but legible photo = acceptable. Blur alone is not a fraud signal if the person remains identifiable.' },
  { signal:'Very sharp and precise edges around the passport photo', isSuspect:true, explication:'Sharp edges around photo = possible photo replacement signal (collage). Flag to PSF.' },
  { signal:'Passport MRZ legible but MRZ name is "DUPONT" and document body says "DUPOND"', isSuspect:true, explication:'MRZ vs document body inconsistency = very significant signal. Name should be identical. Immediate flag to PSF.' },
  { signal:'Passport in perfect condition, good quality scan, legible and consistent data', isSuspect:false, explication:'Document in good condition, clear scan, consistent data = no suspicious signal. No reason to flag.' },
  { signal:'A digit in the expiry date appears to be in a slightly different font', isSuspect:true, explication:'Different font on a single character = suspicious signal of modification. Flag to PSF even if explanation may be innocent.' },
  { signal:'Proof of residence with pixelated and blurry company logo', isSuspect:true, explication:'Pixelated logo = suspicious signal of digital forgery. Real company documents generally have a sharp logo.' },
  { signal:'Passport scanned slightly at an angle (not straight)', isSuspect:false, explication:'Slightly angled scan = digitisation issue, not a fraud signal. Document to re-request if illegible.' },
  { signal:'Driving licence photo visibly differs from passport photo in the same file', isSuspect:true, explication:'Different photos between two documents in the same file = very significant signal. May indicate identity theft or forgery.' },
]

const VF_FR = [
  { texte:'i-Hub peut affirmer qu’un document est faux si plusieurs signaux sont visibles', reponse:false, explication:'Non ! même avec plusieurs signaux, i-Hub ne conclut jamais « c’est un faux ». Il signale les observations au PSF.' },
  { texte:'Un document numérique ne peut pas avoir d’éléments de sécurité physiques vérifiables', reponse:true, explication:'Exact ! Hologrammes, encres UV, microimpressions ne sont pas vérifiables sur un scan. Limite importante d’i-Hub.' },
  { texte:'Une pliure précisément sur la zone photo est un signal suspect', reponse:true, explication:'Exact ! Une pliure exactement sur la photo peut indiquer une tentative de remplacement. À signaler au PSF.' },
  { texte:'Si la MRZ est lisible, le document est nécessairement authentique', reponse:false, explication:'Non ! Une MRZ lisible n’exclut pas une falsification des données dans le corps du document. Il faut vérifier la cohérence.' },
  { texte:'Un justificatif de domicile est plus facile à falsifier numériquement qu’un passeport', reponse:true, explication:'Exact ! Un passeport a des éléments de sécurité plus complexes. Un justificatif de domicile est un simple document imprimé.' },
  { texte:'i-Hub doit refuser de valider un dossier si un signal suspect est détecté', reponse:false, explication:'Non ! i-Hub ne refuse pas seul. Il signale le document suspect au PSF qui décide des suites à donner.' },
]
const VF_EN = [
  { texte:'i-Hub can confirm a document is fake if multiple signals are visible', reponse:false, explication:'No! Even with multiple signals, i-Hub never concludes “it’s a forgery”. It flags observations to PSF.' },
  { texte:'A digital document cannot have verifiable physical security features', reponse:true, explication:'Correct! Holograms, UV inks, microprints cannot be verified on a scan. An important i-Hub limitation.' },
  { texte:'A fold precisely on the photo area is a suspicious signal', reponse:true, explication:'Correct! A fold exactly on the photo may indicate a replacement attempt. Flag to PSF.' },
  { texte:'If the MRZ is legible, the document is necessarily authentic', reponse:false, explication:'No! A legible MRZ does not rule out falsification of data in the document body. Consistency must be verified.' },
  { texte:'A proof of residence is easier to forge digitally than a passport', reponse:true, explication:'Correct! A passport has more complex security features. A proof of residence is a simple printed document.' },
  { texte:'i-Hub must refuse to validate a file if a suspicious signal is detected', reponse:false, explication:'No! i-Hub does not refuse alone. It flags the suspicious document to PSF which decides next steps.' },
]

const CAS_FR = [
  { situation:'Le PSF transmet un passeport français. La photo semble légèrement différente de la photo du permis de conduire du même dossier, mais les deux sont lisibles.', action:'Signaler au PSF : photos potentiellement différentes entre passeport et permis', options:['Accepter — les deux documents sont lisibles','Signaler au PSF : photos potentiellement différentes entre passeport et permis','Déclarer le dossier frauduleux','Demander directement au client final une explication'], explication:'Des photos visuellement différentes entre deux documents du même dossier = signal significatif à transmettre au PSF. i-Hub ne conclut pas.' },
  { situation:'Le PSF transmet un justificatif de domicile. Le logo de l’opérateur téléphonique est pixelisé et flou, mais l’adresse et le nom correspondent au dossier.', action:'Signaler au PSF : logo pixelisé signal suspect de falsification numérique', options:['Accepter — nom et adresse sont corrects','Signaler au PSF : logo pixelisé signal suspect de falsification numérique','Contacter l’opérateur téléphonique pour vérifier','Déclarer le document faux'], explication:'Logo pixelisé = signal visuel de possible falsification. i-Hub signale au PSF même si nom et adresse concordent.' },
  { situation:'Le PSF transmet un passeport. La MRZ est lisible et parfaitement cohérente avec le corps du document. Photo claire. Aucun signe suspect.', action:'Valider le document — aucun signal suspect détecté', options:['Signaler quand même au PSF par précaution','Demander l’original physique systématiquement','Valider le document — aucun signal suspect détecté','Demander un deuxième document d’identité'], explication:'Document cohérent, photo claire, MRZ correcte = aucun signal. i-Hub valide sans chercher des problèmes là où il n’y en a pas.' },
]
const CAS_EN = [
  { situation:'PSF transmits a French passport. The photo seems slightly different from the driving licence photo in the same file, but both are legible.', action:'Flag to PSF: photos potentially different between passport and licence', options:['Accept — both documents are legible','Flag to PSF: photos potentially different between passport and licence','Declare the file fraudulent','Ask the final client directly for an explanation'], explication:'Visually different photos between two documents in the same file = significant signal to transmit to PSF. i-Hub does not conclude.' },
  { situation:'PSF transmits a proof of residence. The phone operator’s logo is pixelated and blurry, but address and name match the file.', action:'Flag to PSF: pixelated logo suspicious signal of digital forgery', options:['Accept — name and address are correct','Flag to PSF: pixelated logo suspicious signal of digital forgery','Contact the phone operator to verify','Declare the document fake'], explication:'Pixelated logo = visual signal of possible forgery. i-Hub flags to PSF even if name and address match.' },
  { situation:'PSF transmits a passport. MRZ is legible and perfectly consistent with the document body. Clear photo. No suspicious signs.', action:'Validate document — no suspicious signal detected', options:['Flag to PSF anyway as a precaution','Systematically request the physical original','Validate document — no suspicious signal detected','Request a second identity document'], explication:'Consistent document, clear photo, correct MRZ = no signal. i-Hub validates without looking for problems where there are none.' },
]

export default function ModuleFraudesDocuments() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeSig, setActiveSig] = useState(() => pickRandom(SIGNALS_FR, 6))
  const [sigIndex, setSigIndex] = useState(0)
  const [sigAnswer, setSigAnswer] = useState<boolean|null>(null)
  const [sigScore, setSigScore] = useState(0)
  const [sigAnim, setSigAnim] = useState<'correct'|'wrong'|null>(null)

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
    const bs = l==='fr'?SIGNALS_FR:SIGNALS_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveSig(pickRandom(bs,6)); setSigIndex(0); setSigScore(0); setSigAnswer(null); setSigAnim(null)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnim(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); initQuizzes(l) }

  function repSig(rep: boolean) {
    if (sigAnswer !== null) return
    const correct = activeSig[sigIndex].isSuspect === rep
    setSigAnswer(rep); setSigAnim(correct ? 'correct' : 'wrong')
    if (correct) setSigScore(s => s + 1)
    setTimeout(() => {
      setSigAnim(null); setSigAnswer(null)
      if (sigIndex + 1 < activeSig.length) { setSigIndex(i => i + 1) }
      else { setScore(s => s + (correct ? sigScore + 1 : sigScore) * 5); setPhase('quiz2') }
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>⚠️ {t.title}</span>
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
        <div style={{fontSize:'72px',marginBottom:'20px'}}>⚠️</div>
        <h1 style={{fontSize:'26px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
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
    const a = activeSig[sigIndex]
    return (
      <div style={{...base,background:sigAnim==='correct'?'#d1fae5':sigAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:sigAnim==='correct'?'#6ee7b7':sigAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(sigIndex/activeSig.length)*100}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'580px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {sigIndex+1}/{activeSig.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q1title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>🔍 {a.signal}</p>
          </div>
          {sigAnswer === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repSig(true)} style={{padding:'18px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'13px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.suspect}</button>
              <button onClick={() => repSig(false)} style={{padding:'18px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'13px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.ok}</button>
            </div>
          ) : (
            <div style={{background:sigAnim==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${sigAnim==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{sigAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:sigAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{sigAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{a.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeSig.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=sigIndex?C:'#e5e7eb'}}/>)}
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
