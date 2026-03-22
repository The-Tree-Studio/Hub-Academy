'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e91e8c'

const UI = {
  fr: {
    title: 'Cohérence des documents KYC',
    subtitle: 'Détecter les incohérences documentaires — le cœur du travail de vérification i-Hub',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Les types de documents KYC et ce qu’ils doivent prouver',
      'Les incohérences les plus fréquentes à détecter',
      'La méthode de vérification croisée entre documents',
      'Ce qui déclenche un signal au PSF',
      'Les limites de la vérification documentaire',
      'Comment documenter et signaler une incohérence',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · INCOHÉRENCE OU PAS ?',
    q1title: '🔍 Cette situation est-elle une incohérence à signaler ?',
    signaler: '🚨 Incohérence — Signaler', ok: '✅ Cohérent — Accepter',
    q2label: 'QUIZ 2/3 · VRAI OU FAUX',
    q2title: '✅ Vrai ou Faux',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q3label: 'QUIZ 3/3 · QUE SIGNALE i-Hub ?',
    q3title: '🤔 Quelle est la bonne action ?',
    resultTitle: 'Module terminé — Vous détectez les incohérences comme un pro !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    medal_gold: 'Expert cohérence !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Terminer →',
  },
  en: {
    title: 'KYC Document Consistency',
    subtitle: 'Detecting documentary inconsistencies — the core of i-Hub’s verification work',
    learn: '📚 What you will learn:',
    learnItems: [
      'KYC document types and what they must prove',
      'The most common inconsistencies to detect',
      'The cross-document verification method',
      'What triggers a flag to the PSF',
      'The limits of documentary verification',
      'How to document and flag an inconsistency',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · INCONSISTENCY OR NOT?',
    q1title: '🔍 Is this situation an inconsistency to flag?',
    signaler: '🚨 Inconsistency — Flag', ok: '✅ Consistent — Accept',
    q2label: 'QUIZ 2/3 · TRUE OR FALSE',
    q2title: '✅ True or False',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q3label: 'QUIZ 3/3 · WHAT DOES i-Hub FLAG?',
    q3title: '🤔 What is the correct action?',
    resultTitle: 'Module complete — You detect inconsistencies like a pro!',
    backHome: '← Back', restart: '🔄 Restart',
    medal_gold: 'Consistency Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Finish →',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🔍', titre:'C’est quoi la cohérence documentaire ?', contenu:[
    { icon:'📋', texte:'La **cohérence documentaire** consiste à vérifier que tous les documents d’un dossier racontent la **même histoire** sur le client final' },
    { icon:'⚠️', texte:'Une incohérence = des informations contradictoires entre deux ou plusieurs documents du dossier' },
    { icon:'🔍', texte:'Exemples : prénom différent entre passeport et contrat, adresse incompatible entre KYC et justificatif de domicile' },
    { icon:'📎', texte:'C’est le **travail principal d’i-Hub** : toute incohérence visible est signalée au PSF, qui demande des clarifications à son client final' },
  ], aretenir:'Cohérence = tous les documents racontent la même histoire. Toute contradiction visible = signal au PSF.' },

  { id:2, emoji:'📋', titre:'Les catégories de documents KYC', contenu:[
    { icon:'🪪', texte:'**Identité** : passeport, carte d’identité, permis de conduire — prouvent qui est la personne' },
    { icon:'🏠', texte:'**Domicile** : facture (eau, gaz, électricité), relevé bancaire, avis d’imposition — prouvent où vit la personne' },
    { icon:'💼', texte:'**Activité professionnelle** : contrat de travail, extrait Kbis, statuts de société — prouvent ce que fait la personne' },
    { icon:'💵', texte:'**Source des fonds** : bulletins de salaire, relevés de compte, acte de vente — prouvent d’où vient l’argent' },
  ], aretenir:'4 catégories de documents KYC. i-Hub vérifie la cohérence entre eux — chaque document doit confirmer les autres.' },

  { id:3, emoji:'🌟', titre:'Les points de cohérence à vérifier', contenu:[
    { icon:'📝', texte:'**Nom et prénom** : identiques sur tous les documents (attention aux variations orthographiques, noms composés, traits d’union)' },
    { icon:'🏠', texte:'**Adresse** : cohérente entre le formulaire KYC, le justificatif de domicile et les autres documents' },
    { icon:'🎂', texte:'**Date de naissance** : identique sur le passeport, la carte d’identité et les autres documents officiels' },
    { icon:'🇳🇱', texte:'**Nationalité** : cohérente avec le passeport présenté et la résidence fiscale déclarée' },
  ], aretenir:'Nom, adresse, date de naissance, nationalité — 4 points fondamentaux à vérifier en croisé sur tous les documents du dossier.' },

  { id:4, emoji:'📸', titre:'Vérification de la photo et des données biométriques', contenu:[
    { icon:'📸', texte:'La **photo** sur le document d’identité doit être visible, lisible et correspondre à une vraie personne (pas flouée, non coupée)' },
    { icon:'📰', texte:'La **MRZ** (zone lisible par machine, lignes en bas du passeport) doit être présente et lisible' },
    { icon:'⚠️', texte:'Signes suspects : photo modifiée, pliure suspect sur la zone photo, données MRZ qui ne correspondent pas au corps du document' },
    { icon:'🔍', texte:'i-Hub signale tout document difficile à lire ou présentant des signes visuels suspects — jamais d’expertise en authentification' },
  ], aretenir:'Photo visible + MRZ lisible = conditions minimales. i-Hub signale les documents illisibles ou visuellement suspects au PSF.' },

  { id:5, emoji:'📅', titre:'La validité dans le temps', contenu:[
    { icon:'⏰', texte:'Tout document d’identité **expiré** est signalé au PSF — même si les données semblent correctes' },
    { icon:'📝', texte:'Un **justificatif de domicile** doit généralement dater de moins de **3 mois** — une facture de 2019 n’est pas valide' },
    { icon:'🔄', texte:'Une **source des fonds** datée de plusieurs années peut ne plus être pertinente selon le contexte' },
    { icon:'🛑', texte:'Règle : tout document expiré ou dont la date soulève une question = signal au PSF, qui décide de la suite' },
  ], aretenir:'Document expiré = signal au PSF. Justificatif de domicile > 3 mois = signal. i-Hub ne valide pas un dossier avec des documents périmés.' },

  { id:6, emoji:'🏠', titre:'Cohérence de l’adresse', contenu:[
    { icon:'📨', texte:'L’adresse sur le **formulaire KYC** doit correspondre à celle du **justificatif de domicile** transmis' },
    { icon:'⚠️', texte:'Incohérence fréquente : KYC indique Luxembourg mais justificatif de domicile est une facture étrangère' },
    { icon:'📌', texte:'Une **deuxième adresse** (résidence secondaire, adresse professionnelle) peut être légitime — à documenter' },
    { icon:'🚨', texte:'Une adresse **c/o** ou **hold mail** comme seule adresse = anomalie à signaler (aussi indice FATCA n°6)' },
  ], aretenir:'Adresse KYC = adresse justificatif de domicile. Toute différence = signal au PSF. Adresse c/o seule = anomalie majeure.' },

  { id:7, emoji:'💼', titre:'Cohérence professionnelle', contenu:[
    { icon:'💼', texte:'L’activité professionnelle déclarée doit être cohérente avec les **justificatifs fournis** (contrat de travail, Kbis…)' },
    { icon:'💰', texte:'La **source des fonds** doit être compatible avec l’activité professionnelle : un employé modeste ne peut pas justifier des millions' },
    { icon:'⚠️', texte:'Incohérence : client déclaré « retraité » mais justificatif montre un contrat de travail actif' },
    { icon:'🔍', texte:'i-Hub signale l’incohérence visible — c’est le PSF qui demande des éclaircissements à son client final' },
  ], aretenir:'Profession + source des fonds doivent être cohérentes. Un écart visible entre les deux est signalé au PSF.' },

  { id:8, emoji:'💰', titre:'Cohérence de la source des fonds', contenu:[
    { icon:'💰', texte:'Les **fonds déposés** doivent être justifiables par les documents fournis : salaire, héritage, vente immobilière, dividendes' },
    { icon:'⚠️', texte:'Signal d’alerte : montant des fonds bien supérieur à ce que le profil professionnel permet de justifier' },
    { icon:'📝', texte:'Un **acte notarié de vente**, un **relevé d’héritage**, un **bulletin de salaire** sont des justificatifs valables' },
    { icon:'🔍', texte:'i-Hub vérifie la **présence** des justificatifs demandés et leur **cohérence** avec le profil — pas leur véracité comptable' },
  ], aretenir:'Source des fonds doit être documentée et cohérente avec le profil. i-Hub vérifie la présence et la cohérence visible.' },

  { id:9, emoji:'🏢', titre:'Les documents d’entité', contenu:[
    { icon:'📜', texte:'Pour une **personne morale** : extrait Kbis ou équivalent, statuts, liste des dirigeants et actionnaires' },
    { icon:'👤', texte:'Les informations sur les **dirigeants** dans les statuts doivent correspondre aux documents d’identité fournis' },
    { icon:'📊', texte:'La **structure d’actionnariat** dans les statuts doit être cohérente avec le formulaire UBO transmis par le PSF' },
    { icon:'🔍', texte:'i-Hub signale toute discordance entre les statuts, le Kbis et la déclaration UBO — le PSF clarifie avec son client final' },
  ], aretenir:'Pour une entité : Kbis + statuts + déclaration UBO doivent être cohérents entre eux. Tout écart = signal au PSF.' },

  { id:10, emoji:'⚠️', titre:'Les incohérences les plus fréquentes', contenu:[
    { icon:'🔴', texte:'**Nom différent** : prénom abrégé sur un document, nom de jeune fille vs nom marié, orthographe variable' },
    { icon:'🔴', texte:'**Adresse incompatible** : ville différente entre KYC et justificatif, pays différent entre domicile et résidence fiscale' },
    { icon:'🔴', texte:'**Date de naissance différente** : même si écart d’un seul jour — peut indiquer une erreur de saisie ou un document falsifié' },
    { icon:'🔴', texte:'**Nationalité incohérente** : passeport français mais formulaire KYC indique nationalité suisse' },
    { icon:'🔴', texte:'**Document expiré** : passeport expiré depuis 2 ans dans le dossier' },
  ], aretenir:'Les 5 incohérences les plus fréquentes : nom, adresse, date de naissance, nationalité, expiration. i-Hub les détecte et signale.' },

  { id:11, emoji:'📝', titre:'La méthode de vérification croisée', contenu:[
    { icon:'1️⃣', texte:'**Lire chaque document** individuellement et noter les informations clés (nom, adresse, date, nationalité)' },
    { icon:'2️⃣', texte:'**Comparer** les informations entre documents deux à deux — passeport vs KYC, KYC vs justificatif domicile…' },
    { icon:'3️⃣', texte:'**Identifier** toute discordance, même mineure — les petites incohérences peuvent en cacher de grandes' },
    { icon:'4️⃣', texte:'**Documenter et signaler** au PSF chaque incohérence détectée avec précision' },
  ], aretenir:'Méthode : lire → comparer → identifier → documenter → signaler. Systématique sur chaque dossier, sans exception.' },

  { id:12, emoji:'🛑', titre:'Ce que i-Hub NE vérifie PAS', contenu:[
    { icon:'❌', texte:'i-Hub ne vérifie **pas** l’authenticité des documents (faux papiers) — il n’est pas expert en falsification' },
    { icon:'❌', texte:'i-Hub ne vérifie **pas** les bases de données externes (registres nationaux, bases pénales) — c’est hors périmètre' },
    { icon:'❌', texte:'i-Hub ne **décide pas** si le client final est acceptable ou non — c’est la responsabilité du PSF' },
    { icon:'❌', texte:'i-Hub ne **corrige pas** les documents — il signale et archive, le PSF demande les corrections à son client final' },
  ], aretenir:'i-Hub détecte les incohérences visibles. Il ne détecte pas les faux, ne consulte pas de bases externes, ne décide pas.' },

  { id:13, emoji:'📎', titre:'Comment documenter une incohérence', contenu:[
    { icon:'1️⃣', texte:'**Préciser le document concerné** : passeport n°XXX, formulaire KYC daté du JJ/MM/AAAA' },
    { icon:'2️⃣', texte:'**Décrire l’incohérence** : « Prénom «Jean-Marie» sur le passeport vs «Jean» sur le KYC »' },
    { icon:'3️⃣', texte:'**Signaler au PSF** dans le rapport de vérification, avec la mention claire de l’anomalie détectée' },
    { icon:'4️⃣', texte:'**Archiver** le rapport — i-Hub conserve la trace de chaque vérification pour sa propre protection' },
  ], aretenir:'Documenter = précision + description + rapport. Pas de vague menté « incohérence » — décrire exactement ce qui diffère.' },

  { id:14, emoji:'🌟', titre:'L’exactitude de la saisie des données', contenu:[
    { icon:'📌', texte:'i-Hub a une obligation d’**exactitude absolue** dans la saisie et l’enregistrement des données clients' },
    { icon:'🏠', texte:'"Rue" et "Avenue" sont **deux adresses différentes** — une erreur de saisie peut invalider un contrôle ou générer un faux positif en Name Screening' },
    { icon:'📝', texte:'Tout écart entre le document source et les données saisies dans le système doit être **corrigé immédiatement**' },
    { icon:'🛑', texte:'Les données saisies dérivent directement des documents officels — ne jamais approximer ou simplifier' },
  ], aretenir:'Exactitude = obligation absolue. Rue ≠ Avenue. Une mauvaise saisie peut fausser tous les contrôles en aval. Toujours copier les données exactes du document.' },

  { id:15, emoji:'🌐', titre:'Les différences culturelles et orthographiques', contenu:[
    { icon:'🌐', texte:'Certaines incohérences apparentes sont des **différences culturelles légitimes** : translittération arabe/cyrillique/chinoise' },
    { icon:'📝', texte:'Exemples : « Mohammed » / « Mohamed » / « Muhammad » peuvent être la même personne avec des documents différents' },
    { icon:'⚠️', texte:'Même en cas de différence culturelle explicable, i-Hub **signale quand même** au PSF avec la mention de l’explication possible' },
    { icon:'📌', texte:'C’est le PSF qui confirme avec son client final que les documents correspondent bien à la même personne' },
  ], aretenir:'Différences culturelles = signal avec note d’explication possible. i-Hub ne tranche pas seul — le PSF confirme avec son client final.' },

  { id:16, emoji:'📊', titre:'Le dossier incomplet', contenu:[
    { icon:'🛑', texte:'Un dossier **incomplet** (document manquant) est signalé au PSF avec la liste précise des documents manquants' },
    { icon:'📝', texte:'Un dossier avec documents manquants peut être **validé partiellement** après escalade au client — mais il est **marqué comme incomplet** dans le système jusqu’à réception des éléments manquants' },
    { icon:'📢', texte:'Le signal au PSF précise : document attendu selon le SLA, nature de ce qui manque, impact sur la validation possible' },
    { icon:'⏰', texte:'i-Hub ne fixe pas de délai au PSF — c’est le PSF qui gère le suivi avec son client final et les échéances réglementaires' },
  ], aretenir:'Dossier avec manquants = signal + marquage incomplet dans le système. Après escalade, peut être validé partiellement. Le PSF gère les relances.' },

  { id:17, emoji:'🔥', titre:'Les red flags supplémentaires', contenu:[
    { icon:'🔴', texte:'**Multiple versions** d’un même document dans le dossier (deux justificatifs de domicile contradictoires)' },
    { icon:'🔴', texte:'**Document modifié** visuellement : pixels suspects, bords irregóuliers, police différente sur une partie du document' },
    { icon:'🔴', texte:'**Informations saisies** qui ne correspondent pas aux documents scannés (erreur de saisie ou manipulation)' },
    { icon:'🔴', texte:'**Refus de fournir** un document demandé sans justification valide — signalé au PSF même si hors SLA' },
  ], aretenir:'Documents multiples contradictoires, visuellement suspects ou refus de fournir = red flags à signaler immédiatement au PSF.' },

  { id:18, emoji:'📱', titre:'La vérification à distance (documents numériques)', contenu:[
    { icon:'📱', texte:'Les documents transmis numériquement (scan, photo, PDF) sont les plus fréquents — même rigueur que pour les originaux' },
    { icon:'⚠️', texte:'Limites de la numérisation : certaines falsifications ne sont détectables qu’à l’examen physique — hors périmètre i-Hub' },
    { icon:'🔍', texte:'i-Hub signale les documents **illisibles** (trop sombres, flous, coupés) et demande une retransmission via le PSF' },
    { icon:'📜', texte:'Les **exigences de résolution minimale** pour les documents numériques sont définies dans le SLA avec le PSF' },
  ], aretenir:'Document numérique illisible = signal au PSF pour retransmission. i-Hub ne peut pas valider un document illisible.' },

  { id:19, emoji:'💡', titre:'Les 3 questions de la vérification de cohérence', contenu:[
    { icon:'❓', texte:'**Est-ce que les documents présents se confirment mutuellement ?** — nom, adresse, date de naissance, nationalité concordants' },
    { icon:'❓', texte:'**Est-ce que les documents sont tous valides ?** — non expirés, lisibles, non modifiés visuellement' },
    { icon:'❓', texte:'**Est-ce que le dossier est complet ?** — tous les documents requis par le SLA sont présents' },
  ], aretenir:'3 questions : concordance → validité → complétude. Si une réponse est « non » ou « incertain » = signal au PSF.' },

  { id:20, emoji:'🎓', titre:'Résumé : la vérification de cohérence en pratique', contenu:[
    { icon:'1️⃣', texte:'**Recevoir** le dossier transmis par le PSF avec l’ensemble des documents KYC' },
    { icon:'2️⃣', texte:'**Vérifier** chaque document individuellement (validité, lisibilité, complétude)' },
    { icon:'3️⃣', texte:'**Comparer** en croisé toutes les informations clés entre documents' },
    { icon:'4️⃣', texte:'**Signaler** au PSF toute incohérence ou document manquant, avec précision' },
    { icon:'5️⃣', texte:'**Archiver** le rapport de vérification daté — protection d’i-Hub et traçabilité' },
  ], aretenir:'Recevoir → Vérifier → Comparer → Signaler → Archiver. i-Hub ne décide pas, ne corrige pas — il détecte et signale.' },
]

const FICHES_EN = [
  { id:1, emoji:'🔍', titre:'What is documentary consistency?', contenu:[
    { icon:'📋', texte:'**Documentary consistency** means verifying that all documents in a file tell the **same story** about the final client' },
    { icon:'⚠️', texte:'An inconsistency = contradictory information between two or more documents in the file' },
    { icon:'🔍', texte:'Examples: different first name between passport and contract, address mismatch between KYC and proof of residence' },
    { icon:'📎', texte:'This is **i-Hub’s core work**: any visible inconsistency is flagged to the PSF, which seeks clarification from its final client' },
  ], aretenir:'Consistency = all documents tell the same story. Any visible contradiction = flag to PSF.' },
  { id:2, emoji:'📋', titre:'KYC document categories', contenu:[
    { icon:'🪪', texte:'**Identity**: passport, ID card, driving licence — prove who the person is' },
    { icon:'🏠', texte:'**Residence**: utility bill, bank statement, tax notice — prove where the person lives' },
    { icon:'💼', texte:'**Professional activity**: employment contract, company extract, articles — prove what the person does' },
    { icon:'💵', texte:'**Source of funds**: payslips, bank statements, sale deed — prove where the money comes from' },
  ], aretenir:'4 KYC document categories. i-Hub checks consistency between them — each document must confirm the others.' },
  { id:3, emoji:'🌟', titre:'Consistency points to verify', contenu:[
    { icon:'📝', texte:'**Name**: identical on all documents (watch for spelling variations, compound names, hyphens)' },
    { icon:'🏠', texte:'**Address**: consistent between KYC form, proof of residence and other documents' },
    { icon:'🎂', texte:'**Date of birth**: identical on passport, ID card and other official documents' },
    { icon:'🇳🇱', texte:'**Nationality**: consistent with the presented passport and declared tax residence' },
  ], aretenir:'Name, address, date of birth, nationality — 4 fundamental points to cross-check across all documents in the file.' },
  { id:4, emoji:'📸', titre:'Photo and biometric data verification', contenu:[
    { icon:'📸', texte:'The **photo** on the identity document must be visible, legible and show a real person (not blurred, not cut off)' },
    { icon:'📰', texte:'The **MRZ** (machine readable zone, lines at the bottom of the passport) must be present and legible' },
    { icon:'⚠️', texte:'Suspicious signs: modified photo, suspicious fold on photo area, MRZ data not matching the document body' },
    { icon:'🔍', texte:'i-Hub flags any difficult-to-read document or one showing visual suspicious signs — never performs authentication expertise' },
  ], aretenir:'Visible photo + legible MRZ = minimum conditions. i-Hub flags illegible or visually suspicious documents to PSF.' },
  { id:5, emoji:'📅', titre:'Validity over time', contenu:[
    { icon:'⏰', texte:'Any **expired** identity document is flagged to the PSF — even if the data seems correct' },
    { icon:'📝', texte:'A **proof of residence** must generally be less than **3 months old** — a 2019 utility bill is not valid' },
    { icon:'🔄', texte:'A **source of funds** document several years old may no longer be relevant depending on context' },
    { icon:'🛑', texte:'Rule: any expired document or one whose date raises a question = flag to PSF, which decides on next steps' },
  ], aretenir:'Expired document = flag to PSF. Proof of residence > 3 months = flag. i-Hub does not validate a file with outdated documents.' },
  { id:6, emoji:'🏠', titre:'Address consistency', contenu:[
    { icon:'📨', texte:'The address on the **KYC form** must match the one on the **proof of residence** transmitted' },
    { icon:'⚠️', texte:'Common inconsistency: KYC states Luxembourg but proof of residence is a foreign utility bill' },
    { icon:'📌', texte:'A **second address** (secondary residence, business address) may be legitimate — to be documented' },
    { icon:'🚨', texte:'A **care of** or **hold mail** address as the only address = anomaly to flag (also FATCA indicium #6)' },
  ], aretenir:'KYC address = proof of residence address. Any difference = flag to PSF. Care of as only address = major anomaly.' },
  { id:7, emoji:'💼', titre:'Professional consistency', contenu:[
    { icon:'💼', texte:'The declared professional activity must be consistent with the **supporting documents** provided (employment contract, company extract…)' },
    { icon:'💰', texte:'The **source of funds** must be compatible with the professional activity: a modest employee cannot justify millions' },
    { icon:'⚠️', texte:'Inconsistency: client declared as “retired” but document shows an active employment contract' },
    { icon:'🔍', texte:'i-Hub flags the visible inconsistency — the PSF seeks clarification from its final client' },
  ], aretenir:'Profession + source of funds must be consistent. A visible gap between the two is flagged to PSF.' },
  { id:8, emoji:'💰', titre:'Source of funds consistency', contenu:[
    { icon:'💰', texte:'**Deposited funds** must be justifiable by documents provided: salary, inheritance, property sale, dividends' },
    { icon:'⚠️', texte:'Alert signal: fund amount significantly exceeding what the professional profile can justify' },
    { icon:'📝', texte:'A **notarial sale deed**, **inheritance statement**, **payslip** are valid supporting documents' },
    { icon:'🔍', texte:'i-Hub verifies the **presence** of required documents and their **consistency** with the profile — not their accounting accuracy' },
  ], aretenir:'Source of funds must be documented and consistent with the profile. i-Hub checks visible presence and consistency.' },
  { id:9, emoji:'🏢', titre:'Entity documents', contenu:[
    { icon:'📜', texte:'For a **legal entity**: company extract or equivalent, articles of association, list of directors and shareholders' },
    { icon:'👤', texte:'Information on **directors** in the articles must match the identity documents provided' },
    { icon:'📊', texte:'The **shareholding structure** in the articles must be consistent with the UBO form transmitted by the PSF' },
    { icon:'🔍', texte:'i-Hub flags any discrepancy between articles, company extract and UBO declaration — PSF clarifies with its final client' },
  ], aretenir:'For an entity: company extract + articles + UBO declaration must be consistent. Any discrepancy = flag to PSF.' },
  { id:10, emoji:'⚠️', titre:'The most common inconsistencies', contenu:[
    { icon:'🔴', texte:'**Different name**: abbreviated first name on one document, maiden vs married name, spelling variation' },
    { icon:'🔴', texte:'**Incompatible address**: different city between KYC and proof, different country between domicile and tax residence' },
    { icon:'🔴', texte:'**Different date of birth**: even a one-day difference — may indicate a data entry error or falsified document' },
    { icon:'🔴', texte:'**Inconsistent nationality**: French passport but KYC form states Swiss nationality' },
    { icon:'🔴', texte:'**Expired document**: passport expired 2 years ago still in the file' },
  ], aretenir:'5 most common inconsistencies: name, address, date of birth, nationality, expiry. i-Hub detects and flags them.' },
  { id:11, emoji:'📝', titre:'The cross-verification method', contenu:[
    { icon:'1️⃣', texte:'**Read each document** individually and note key information (name, address, date, nationality)' },
    { icon:'2️⃣', texte:'**Compare** information between documents two by two — passport vs KYC, KYC vs proof of residence…' },
    { icon:'3️⃣', texte:'**Identify** any discrepancy, even minor — small inconsistencies may hide larger ones' },
    { icon:'4️⃣', texte:'**Document and flag** to PSF each detected inconsistency with precision' },
  ], aretenir:'Method: read → compare → identify → document → flag. Systematic on every file, without exception.' },
  { id:12, emoji:'🛑', titre:'What i-Hub does NOT verify', contenu:[
    { icon:'❌', texte:'i-Hub does **not** verify document authenticity (forged papers) — it is not a forgery expert' },
    { icon:'❌', texte:'i-Hub does **not** check external databases (national registers, criminal records) — outside scope' },
    { icon:'❌', texte:'i-Hub does **not decide** whether the final client is acceptable or not — PSF’s responsibility' },
    { icon:'❌', texte:'i-Hub does **not correct** documents — it flags and archives, PSF requests corrections from its final client' },
  ], aretenir:'i-Hub detects visible inconsistencies. It does not detect forgeries, does not consult external databases, does not decide.' },
  { id:13, emoji:'📎', titre:'How to document an inconsistency', contenu:[
    { icon:'1️⃣', texte:'**Specify the document**: passport no. XXX, KYC form dated DD/MM/YYYY' },
    { icon:'2️⃣', texte:'**Describe the inconsistency**: “First name ‘Jean-Marie’ on passport vs ‘Jean’ on KYC”' },
    { icon:'3️⃣', texte:'**Flag to PSF** in the verification report, with a clear mention of the detected anomaly' },
    { icon:'4️⃣', texte:'**Archive** the report — i-Hub retains a record of every verification for its own protection' },
  ], aretenir:'Document = precision + description + report. Not a vague “inconsistency” — describe exactly what differs.' },
  { id:14, emoji:'🌟', titre:'Data entry accuracy', contenu:[
    { icon:'📌', texte:'i-Hub has an obligation of **absolute accuracy** in entering and recording client data' },
    { icon:'🏠', texte:'"Street" and "Avenue" are **two different addresses** — a data entry error can invalidate a control or generate a false positive in Name Screening' },
    { icon:'📝', texte:'Any discrepancy between the source document and data entered in the system must be **corrected immediately**' },
    { icon:'🛑', texte:'Data entered derives directly from official documents — never approximate or simplify' },
  ], aretenir:'Accuracy = absolute obligation. Street ≠ Avenue. A bad entry can distort all downstream controls. Always copy exact data from the document.' },
  { id:15, emoji:'🌐', titre:'Cultural and spelling differences', contenu:[
    { icon:'🌐', texte:'Some apparent inconsistencies are **legitimate cultural differences**: Arabic/Cyrillic/Chinese transliteration' },
    { icon:'📝', texte:'Examples: “Mohammed” / “Mohamed” / “Muhammad” may be the same person with different documents' },
    { icon:'⚠️', texte:'Even with an explainable cultural difference, i-Hub **still flags** to the PSF with a note of the possible explanation' },
    { icon:'📌', texte:'The PSF confirms with its final client that the documents indeed belong to the same person' },
  ], aretenir:'Cultural differences = flag with possible explanation note. i-Hub does not decide alone — the PSF confirms with its final client.' },
  { id:16, emoji:'📊', titre:'The incomplete file', contenu:[
    { icon:'🛑', texte:'An **incomplete** file (missing document) is flagged to the PSF with the precise list of missing documents' },
    { icon:'📝', texte:'A file with missing documents may be **partially validated** after escalation to the client — but it is **marked as incomplete** in the system until missing items are received' },
    { icon:'📢', texte:'The flag to PSF specifies: document expected per SLA, nature of what is missing, impact on possible validation' },
    { icon:'⏰', texte:'i-Hub does not set deadlines for the PSF — the PSF manages follow-up with its final client and regulatory deadlines' },
  ], aretenir:'File with missing items = flag + marked incomplete in system. After escalation, may be partially validated. PSF manages follow-ups.' },
  { id:17, emoji:'🔥', titre:'Additional red flags', contenu:[
    { icon:'🔴', texte:'**Multiple versions** of the same document in the file (two contradictory proofs of residence)' },
    { icon:'🔴', texte:'**Visually modified document**: suspicious pixels, irregular edges, different font on part of the document' },
    { icon:'🔴', texte:'**Data entry inconsistent** with scanned documents (entry error or manipulation)' },
    { icon:'🔴', texte:'**Refusal to provide** a requested document without valid justification — flagged to PSF even if outside SLA' },
  ], aretenir:'Multiple contradictory documents, visually suspicious or refusal to provide = red flags to flag immediately to PSF.' },
  { id:18, emoji:'📱', titre:'Remote verification (digital documents)', contenu:[
    { icon:'📱', texte:'Digitally transmitted documents (scan, photo, PDF) are most common — same rigour as for originals' },
    { icon:'⚠️', texte:'Scanning limitations: some falsifications are only detectable upon physical examination — outside i-Hub scope' },
    { icon:'🔍', texte:'i-Hub flags **illegible** documents (too dark, blurry, cut off) and requests retransmission via PSF' },
    { icon:'📜', texte:'**Minimum resolution requirements** for digital documents are defined in the SLA with the PSF' },
  ], aretenir:'Illegible digital document = flag to PSF for retransmission. i-Hub cannot validate an illegible document.' },
  { id:19, emoji:'💡', titre:'The 3 consistency verification questions', contenu:[
    { icon:'❓', texte:'**Do the documents present confirm each other?** — name, address, date of birth, nationality all consistent' },
    { icon:'❓', texte:'**Are all documents valid?** — not expired, legible, not visually modified' },
    { icon:'❓', texte:'**Is the file complete?** — all documents required by the SLA are present' },
  ], aretenir:'3 questions: concordance → validity → completeness. If any answer is “no” or “uncertain” = flag to PSF.' },
  { id:20, emoji:'🎓', titre:'Summary: consistency verification in practice', contenu:[
    { icon:'1️⃣', texte:'**Receive** the file transmitted by the PSF with all KYC documents' },
    { icon:'2️⃣', texte:'**Verify** each document individually (validity, legibility, completeness)' },
    { icon:'3️⃣', texte:'**Cross-compare** all key information between documents' },
    { icon:'4️⃣', texte:'**Flag** to PSF any inconsistency or missing document, with precision' },
    { icon:'5️⃣', texte:'**Archive** the dated verification report — i-Hub’s protection and traceability' },
  ], aretenir:'Receive → Verify → Compare → Flag → Archive. i-Hub does not decide, does not correct — it detects and flags.' },
]

const COHERENCE_FR = [
  { situation:'Passeport au nom de "Jean-Marie Dupont" mais formulaire KYC indique "Jean Dupont"', isIncoherence:true, explication:'Différence sur le prénom = incohérence matérielle. i-Hub signale au PSF qui clarifie avec son client final.' },
  { situation:'Passeport français valide + justificatif de domicile luxembourgeois récent', isIncoherence:false, explication:'Nationalité française avec résidence luxembourgeoise = situation légitime et fréquente au Luxembourg. Pas d’incohérence.' },
  { situation:'Date de naissance 15/03/1985 sur passeport vs 15/03/1958 sur formulaire KYC', isIncoherence:true, explication:'Écart de 27 ans sur la date de naissance = incohérence critique. Probable erreur de saisie ou confusion de dossiers. Signal immédiat au PSF.' },
  { situation:'Justificatif de domicile daté de janvier (il y a 2 mois)', isIncoherence:false, explication:'Justificatif de moins de 3 mois = valide. Pas d’incohérence sur la date.' },
  { situation:'Adresse "12 Rue de la Paix, Luxembourg" sur KYC mais justificatif de domicile à "12 Rue de la Paix, Paris"', isIncoherence:true, explication:'Pays différents entre KYC et justificatif de domicile = incohérence matérielle. Signal au PSF.' },
  { situation:'Photo passeport légèrement floue mais document visible et lisible dans l’ensemble', isIncoherence:false, explication:'Document lisible dans l’ensemble = acceptable. La légère flou n’empêche pas l’identification. Pas de signal nécessaire.' },
  { situation:'Passeport expiré depuis 6 mois dans le dossier', isIncoherence:true, explication:'Document expiré = invalide, même si les données sont correctes. i-Hub signale au PSF.' },
  { situation:'Prénom "Mohamed" sur passeport maroc / "Mohammed" sur visa européen', isIncoherence:true, explication:'Différence d’orthographe sur le prénom = signalé avec note d’explication possible (translittération). Le PSF confirme avec son client final.' },
]
const COHERENCE_EN = [
  { situation:'Passport in name of "Jean-Marie Dupont" but KYC form states "Jean Dupont"', isIncoherence:true, explication:'First name difference = material inconsistency. i-Hub flags to PSF which clarifies with its final client.' },
  { situation:'Valid French passport + recent Luxembourg proof of residence', isIncoherence:false, explication:'French nationality with Luxembourg residency = legitimate and common situation in Luxembourg. No inconsistency.' },
  { situation:'Date of birth 15/03/1985 on passport vs 15/03/1958 on KYC form', isIncoherence:true, explication:'27-year gap in date of birth = critical inconsistency. Likely data entry error or file mix-up. Immediate flag to PSF.' },
  { situation:'Proof of residence dated January (2 months ago)', isIncoherence:false, explication:'Proof less than 3 months old = valid. No date inconsistency.' },
  { situation:'Address "12 Rue de la Paix, Luxembourg" on KYC but proof of residence at "12 Rue de la Paix, Paris"', isIncoherence:true, explication:'Different countries between KYC and proof of residence = material inconsistency. Flag to PSF.' },
  { situation:'Passport photo slightly blurry but document overall visible and legible', isIncoherence:false, explication:'Document overall legible = acceptable. Slight blur does not prevent identification. No flag needed.' },
  { situation:'Passport expired 6 months ago in the file', isIncoherence:true, explication:'Expired document = invalid, even if data is correct. i-Hub flags to PSF.' },
  { situation:'First name "Mohamed" on Moroccan passport / "Mohammed" on European visa', isIncoherence:true, explication:'Different spelling of first name = flagged with possible explanation note (transliteration). PSF confirms with its final client.' },
]

const VF_FR = [
  { texte:'i-Hub peut valider un dossier même si un document est expiré', reponse:false, explication:'Non ! Tout document expiré est signalé au PSF. i-Hub ne valide pas un dossier avec des documents périmés.' },
  { texte:'Une différence mineure d’orthographe sur le prénom doit quand même être signalée', reponse:true, explication:'Exact ! Toute incohérence, même mineure, est signalée. C’est le PSF qui évalue si c’est matériel.' },
  { texte:'i-Hub peut détecter un faux passeport lors de la vérification documentaire', reponse:false, explication:'Non ! i-Hub n’est pas expert en authentification. Il détecte les incohérences visibles, pas les faux.' },
  { texte:'Un justificatif de domicile daté de 4 mois est acceptable', reponse:false, explication:'Non ! Un justificatif de domicile doit dater de moins de 3 mois. 4 mois = expiré, à signaler au PSF.' },
  { texte:'i-Hub signale les incohérences même si elles sont peut-être dues à des différences culturelles', reponse:true, explication:'Exact ! i-Hub signale avec une note d’explication possible. C’est le PSF qui confirme avec son client final.' },
  { texte:'Un dossier incomplet ne peut jamais être validé, même partiellement', reponse:false, explication:'Non ! Après escalade au client, un dossier peut être validé partiellement mais il est marqué comme incomplet dans le système jusqu’à réception des éléments.' },
]
const VF_EN = [
  { texte:'i-Hub can validate a file even if a document is expired', reponse:false, explication:'No! Any expired document is flagged to PSF. i-Hub does not validate a file with outdated documents.' },
  { texte:'A minor spelling difference in a first name must still be flagged', reponse:true, explication:'Correct! Any inconsistency, even minor, is flagged. The PSF assesses whether it is material.' },
  { texte:'i-Hub can detect a forged passport during documentary verification', reponse:false, explication:'No! i-Hub is not an authentication expert. It detects visible inconsistencies, not forgeries.' },
  { texte:'A proof of residence dated 4 months ago is acceptable', reponse:false, explication:'No! Proof of residence must be less than 3 months old. 4 months = expired, flag to PSF.' },
  { texte:'i-Hub flags inconsistencies even if they may be due to cultural differences', reponse:true, explication:'Correct! i-Hub flags with a possible explanation note. The PSF confirms with its final client.' },
  { texte:'An incomplete file can never be validated, even partially', reponse:false, explication:'No! After client escalation, a file may be partially validated but it is marked as incomplete in the system until missing items are received.' },
]

const CAS_FR = [
  { situation:'Le PSF transmet un dossier : passeport au nom "Sophie MARTIN-LEBLANC" + KYC au nom "Sophie LEBLANC". Date de naissance et adresse identiques partout.', action:'Signaler l’incohérence sur le nom au PSF', options:['Accepter — même adresse et date de naissance','Signaler l’incohérence sur le nom au PSF','Demander un 3ème document','Rejeter le dossier'], explication:'Nom différent entre passeport et KYC = incohérence matérielle. Même si tout le reste concorde, le nom doit être clarifié par le PSF avec son client final.' },
  { situation:'Le PSF transmet un dossier avec un justificatif de domicile daté de 5 mois. Tous les autres documents sont cohérents.', action:'Signaler au PSF : justificatif de domicile expiré (> 3 mois)', options:['Accepter — tous les autres documents sont bons','Signaler au PSF : justificatif de domicile expiré (> 3 mois)','Ignorer — l’adresse ne change probablement pas','Demander directement au client final un nouveau document'], explication:'Justificatif > 3 mois = expiré. i-Hub signale au PSF. C’est le PSF qui demande le nouveau document à son client final.' },
  { situation:'Le PSF transmet un dossier complet. Tout est cohérent. La photo du passeport est légèrement floue mais la personne est identifiable.', action:'Valider le dossier — photo lisible et documents cohérents', options:['Signaler la photo floue au PSF','Valider le dossier — photo lisible et documents cohérents','Demander un autre document photo','Rejeter le passeport'], explication:'Photo légèrement floue mais identifiable = acceptable. Dossier complet et cohérent = validation possible.' },
]
const CAS_EN = [
  { situation:'PSF transmits a file: passport in name "Sophie MARTIN-LEBLANC" + KYC in name "Sophie LEBLANC". Date of birth and address identical throughout.', action:'Flag name inconsistency to PSF', options:['Accept — same address and date of birth','Flag name inconsistency to PSF','Request a third document','Reject the file'], explication:'Different name between passport and KYC = material inconsistency. Even if everything else matches, the name must be clarified by PSF with its final client.' },
  { situation:'PSF transmits a file with a proof of residence dated 5 months ago. All other documents are consistent.', action:'Flag to PSF: proof of residence expired (> 3 months)', options:['Accept — all other documents are fine','Flag to PSF: proof of residence expired (> 3 months)','Ignore — the address probably hasn’t changed','Request a new document directly from the final client'], explication:'Proof > 3 months = expired. i-Hub flags to PSF. It is the PSF that requests a new document from its final client.' },
  { situation:'PSF transmits a complete file. Everything is consistent. The passport photo is slightly blurry but the person is identifiable.', action:'Validate file — legible photo and consistent documents', options:['Flag the blurry photo to PSF','Validate file — legible photo and consistent documents','Request another photo document','Reject the passport'], explication:'Slightly blurry but identifiable photo = acceptable. Complete and consistent file = validation possible.' },
]

export default function ModuleCoherenceDocuments() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeCoh, setActiveCoh] = useState(() => pickRandom(COHERENCE_FR, 6))
  const [cohIndex, setCohIndex] = useState(0)
  const [cohAnswer, setCohAnswer] = useState<boolean|null>(null)
  const [cohScore, setCohScore] = useState(0)
  const [cohAnim, setCohAnim] = useState<'correct'|'wrong'|null>(null)

  const [activeVF, setActiveVF] = useState(() => pickRandom(VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct'|'wrong'|null>(null)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState<string|null>(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l: 'fr'|'en') {
    const bc = l==='fr'?COHERENCE_FR:COHERENCE_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bca = l==='fr'?CAS_FR:CAS_EN
    setActiveCoh(pickRandom(bc,6)); setCohIndex(0); setCohScore(0); setCohAnswer(null); setCohAnim(null)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
    setActiveCas(pickRandom(bca,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); initQuizzes(l) }

  function repCoh(rep: boolean) {
    if (cohAnswer !== null) return
    const correct = activeCoh[cohIndex].isIncoherence === rep
    setCohAnswer(rep); setCohAnim(correct ? 'correct' : 'wrong')
    if (correct) setCohScore(s => s + 1)
    setTimeout(() => {
      setCohAnim(null); setCohAnswer(null)
      if (cohIndex + 1 < activeCoh.length) { setCohIndex(i => i + 1) }
      else { setScore(s => s + (correct ? cohScore + 1 : cohScore) * 5); setPhase('quiz2') }
    }, 2200)
  }

  function repondreVF(rep: boolean) {
    if (vfRepondu !== null) return
    const correct = activeVF[vfIndex].reponse === rep
    setVfRepondu(rep); setVfAnimation(correct ? 'correct' : 'wrong')
    if (correct) setVfScore(s => s + 1)
    setTimeout(() => {
      setVfAnimation(null); setVfRepondu(null)
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
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🔍 {t.title}</span>
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
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔍</div>
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
    const a = activeCoh[cohIndex]
    return (
      <div style={{...base,background:cohAnim==='correct'?'#d1fae5':cohAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:cohAnim==='correct'?'#6ee7b7':cohAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(cohIndex/activeCoh.length)*100}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'580px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {cohIndex+1}/{activeCoh.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q1title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>📄 {a.situation}</p>
          </div>
          {cohAnswer === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repCoh(true)} style={{padding:'18px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'14px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.signaler}</button>
              <button onClick={() => repCoh(false)} style={{padding:'18px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'14px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.ok}</button>
            </div>
          ) : (
            <div style={{background:cohAnim==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${cohAnim==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{cohAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:cohAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{cohAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{a.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeCoh.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=cohIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz2') {
    const q = activeVF[vfIndex]
    return (
      <div style={{...base,background:vfAnimation==='correct'?'#d1fae5':vfAnimation==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:vfAnimation==='correct'?'#6ee7b7':vfAnimation==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
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
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnimation==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{vfAnimation==='correct'?t.correct:t.wrong}</p>
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
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:`2px solid ${C}30`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i) => (
                <button key={i} onClick={() => repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left'}}
                  onMouseOver={e => {(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=`${C}08`}}
                  onMouseOut={e => {(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
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
