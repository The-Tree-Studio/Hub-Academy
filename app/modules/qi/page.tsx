'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e07b39'

const UI = {
  fr: {
    title: 'QI — Qualified Intermediary',
    subtitle: 'La retenue à la source américaine — ce que vérifie i-Hub pour ses clients PSF',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Ce qu’est le statut QI et pourquoi les PSF le demandent',
      'Comment la retenue à la source américaine fonctionne',
      'Les formulaires W liés au QI que vérifie i-Hub',
      'La différence entre QI, FATCA et CRS',
      'Le rôle d’i-Hub : vérifier sur instruction du PSF QI',
      'Les red flags à signaler au PSF lors des vérifications',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR', goFurther: '🔍 Aller plus loin',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · VRAI OU FAUX', q1title: '✅ Vrai ou Faux — QI en pratique',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q2label: 'QUIZ 2/3 · QUEL TAUX ?', q2title: '💰 Quelle retenue s’applique ?',
    q2sub: 'Pour chaque profil de client final, quel taux de retenue le PSF QI doit-il appliquer ?',
    q3label: 'QUIZ 3/3 · CAS PRATIQUES', q3title: '🔍 Que signale i-Hub au PSF ?',
    q3sub: 'Un PSF QI vous transmet un dossier — que faites-vous ?',
    resultTitle: 'Module QI terminé — 20 fiches maîtrisées !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    pts_gained: 'pts', medal_gold: 'Expert QI !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Dernier quiz →',
    validate: 'Valider',
  },
  en: {
    title: 'QI — Qualified Intermediary',
    subtitle: 'US withholding tax — what i-Hub verifies for its QI PSF clients',
    learn: '📚 What you will learn:',
    learnItems: [
      'What QI status is and why PSFs request it',
      'How US withholding tax works',
      'QI-related W forms that i-Hub verifies',
      'The difference between QI, FATCA and CRS',
      'i-Hub’s role: verify on instruction from the QI PSF',
      'Red flags to flag to the PSF during verifications',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '🔍 Go further',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · TRUE OR FALSE', q1title: '✅ True or False — QI in practice',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q2label: 'QUIZ 2/3 · WHICH RATE?', q2title: '💰 Which withholding rate applies?',
    q2sub: 'For each final client profile, what withholding rate must the QI PSF apply?',
    q3label: 'QUIZ 3/3 · CASE STUDIES', q3title: '🔍 What does i-Hub flag to the PSF?',
    q3sub: 'A QI PSF transmits a file — what do you do?',
    resultTitle: 'QI module complete — 20 cards mastered!',
    backHome: '← Back', restart: '🔄 Restart',
    pts_gained: 'pts', medal_gold: 'QI Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Last quiz →',
    validate: 'Validate',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🇺🇸', titre:"C’est quoi le QI ?", contenu:[
    { icon:'🇺🇸', texte:"**QI** = Qualified Intermediary = Intermédiaire Qualifié — statut accordé par l’**IRS américain** aux institutions financières étrangères" },
    { icon:'💰', texte:"Il concerne les revenus de **source américaine** (dividendes et intérêts sur titres américains) perçus par les clients finaux des PSF" },
    { icon:'🏦', texte:"Le **PSF** signe un accord QI avec l’IRS — il s’engage à identifier ses clients finaux et à appliquer le bon taux de retenue" },
    { icon:'🔍', texte:"i-Hub intervient **sur instruction du PSF QI** pour vérifier les formulaires W des clients finaux dans le cadre du SLA" },
  ], aretenir:"QI = gestion de la retenue fiscale US sur les revenus américains. C’est le PSF qui a le statut QI. i-Hub vérifie sur instruction." },

  { id:2, emoji:'💰', titre:"La retenue à la source américaine", contenu:[
    { icon:'🇺🇸', texte:"Tout **revenu de source américaine** (dividende Apple, intérêt sur bon du Trésor US) est soumis à une **retenue à la source** payée à l’IRS" },
    { icon:'⚠️', texte:"Taux par défaut sans QI : **30%** — appliqué automatiquement si l’identité du bénéficiaire n’est pas documentée" },
    { icon:'⬇️', texte:"Avec statut QI et bonne documentation : taux réduit selon la **convention fiscale** entre le pays du client final et les USA (souvent 0%, 5% ou 15%)" },
    { icon:'🇧🇪', texte:"Exemple : convention USA-Luxembourg → dividendes américains taxés à **15%** pour un résident luxembourgeois au lieu de 30%" },
  ], aretenir:"Sans QI ou sans bonne documentation : 30% de retenue. Avec QI et formulaires corrects : taux conventionnel réduit. L’enjeu est financier." },

  { id:3, emoji:'🌟', titre:"Pourquoi les PSF demandent le statut QI", contenu:[
    { icon:'💼', texte:"Les clients finaux des PSF détiennent souvent des **portefeuilles d’actions américaines** (Apple, Amazon, Microsoft…)" },
    { icon:'💸', texte:"Sans statut QI, le PSF applique 30% de retenue sur tous les dividendes US — ce qui **pénalise fortement** les clients finaux" },
    { icon:'✅', texte:"Avec le statut QI, le PSF peut appliquer les **taux réduits conventionnels** en identifiant correctement ses clients finaux" },
    { icon:'📜', texte:"En contrepartie : le PSF QI s’engage à des **obligations strictes** d’identification, documentation et reporting envers l’IRS" },
  ], aretenir:"Le statut QI profite avant tout aux clients finaux des PSF. C’est un avantage fiscal conditionné à une documentation rigoureuse." },

  { id:4, emoji:'📝', titre:"Les formulaires W dans le contexte QI", contenu:[
    { icon:'🇺🇸', texte:"**W-9** : rempli par le client final **US Person** — permet au PSF QI de lui appliquer le taux US applicable" },
    { icon:'📝', texte:"**W-8BEN** : rempli par le client final **non-US (particulier)** — permet d’appliquer le taux conventionnel de son pays de résidence" },
    { icon:'🏢', texte:"**W-8BEN-E** : rempli par une **entité non-US** — précise la catégorie (IFE, NFFE) et le taux applicable" },
    { icon:'🔍', texte:"**Rôle d’i-Hub** : vérifier que le bon formulaire est présent et cohérent pour chaque client final détenant des titres US — si prévu au SLA" },
  ], aretenir:"Le formulaire W détermine le taux de retenue applicable. Sans formulaire valide : 30% par défaut. i-Hub vérifie leur présence et cohérence." },

  { id:5, emoji:'🌍', titre:"QI vs FATCA : deux dispositifs américains distincts", contenu:[
    { icon:'💰', texte:"**QI** : concerne les **revenus** de source américaine — quel taux de retenue appliquer sur dividendes et intérêts US ?" },
    { icon:'👤', texte:"**FATCA** : concerne les **comptes** des US Persons — quels comptes déclarer à l’IRS ?" },
    { icon:'🔄', texte:"Les deux peuvent s’appliquer **simultanément** : un client final US Person détenant des actions Apple → FATCA (compte à déclarer) ET QI (retenue sur dividendes)" },
    { icon:'📝', texte:"Pour i-Hub : les formulaires W servent aux **deux dispositifs** — le même W-9 ou W-8BEN couvre FATCA et QI" },
  ], aretenir:"QI = retenue sur revenus US. FATCA = déclaration de comptes US. Même formulaire W, deux usages différents. i-Hub vérifie les deux." },

  { id:6, emoji:'📊', titre:"Les taux de retenue selon les conventions", contenu:[
    { icon:'0%', texte:"**0%** : intérêts sur obligations américaines pour les non-US Persons dans certains cas — formulaire W-8BEN requis" },
    { icon:'15%', texte:"**15%** : dividendes américains pour les résidents de pays ayant une convention fiscale avec les USA (ex : Luxembourg, France, Allemagne)" },
    { icon:'30%', texte:"**30%** : taux par défaut appliqué si aucun formulaire valide ou si le pays du client final n’a pas de convention avec les USA" },
    { icon:'🔍', texte:"i-Hub vérifie que le formulaire fourni par le client final correspond à sa situation — le PSF applique ensuite le bon taux" },
  ], aretenir:"Le taux de retenue dépend du formulaire et de la convention. i-Hub vérifie les documents. Le PSF QI applique le taux." },

  { id:7, emoji:'🏦', titre:"Qui a le statut QI : le PSF, pas i-Hub", contenu:[
    { icon:'🏦', texte:"C’est le **PSF** (banque, fonds, assureur) qui signe l’accord QI avec l’IRS — il devient responsable de son application" },
    { icon:'🚫', texte:"**i-Hub n’a pas de statut QI** — i-Hub est un PSF de support sous-traitant, pas une institution financière déclarante" },
    { icon:'📜', texte:"Le PSF QI assume les obligations : identifier les clients finaux, appliquer les bons taux, reporter à l’IRS" },
    { icon:'🔍', texte:"i-Hub intervient **sur instruction du PSF QI** dans le cadre du SLA — uniquement pour la vérification documentaire" },
  ], aretenir:"PSF = titulaire du statut QI et responsable. i-Hub = sous-traitant qui vérifie les formulaires sur instruction du PSF, dans le SLA." },

  { id:8, emoji:'🚨', titre:"Les red flags QI à signaler au PSF", contenu:[
    { icon:'🔴', texte:"**W-8BEN expiré** : formulaire de plus de 3 ans sans renouvellement pour un client final détenant des titres US" },
    { icon:'🔴', texte:"**Incohérence de pays** : le pays de résidence du formulaire W-8BEN ne correspond pas aux autres documents du dossier" },
    { icon:'🔴', texte:"**Indices d’américanité** : adresse US ou naissance aux USA sur le dossier alors que le client final a fourni un W-8BEN (non-US)" },
    { icon:'🔴', texte:"**Formulaire manquant** : client final détenant des titres US sans aucun formulaire W dans le dossier" },
  ], aretenir:"Tout red flag QI est signalé au PSF. i-Hub ne décide pas du taux à appliquer — c’est la responsabilité exclusive du PSF QI." },

  { id:9, emoji:'📅', titre:"La validité des formulaires W", contenu:[
    { icon:'📝', texte:"**W-8BEN** : valable **3 ans** à partir de la date de signature — expiration à surveiller" },
    { icon:'💼', texte:"**W-8BEN-E** : valable **3 ans** également — mais toute modification de situation de l’entité impose un renouvellement immédiat" },
    { icon:'🔄', texte:"**W-9** : pas de date d’expiration officielle — mais à renouveler si changement de statut (perte de nationalité US…)" },
    { icon:'🛑', texte:"Un formulaire expiré = retenue par défaut de **30%** appliquée par le PSF — préjudice direct pour le client final" },
  ], aretenir:"W-8BEN et W-8BEN-E expirent après 3 ans. Un formulaire expiré détecté par i-Hub est signalé immédiatement au PSF." },

  { id:10, emoji:'🌟', titre:"Changement de circonstances et QI", contenu:[
    { icon:'👤', texte:"Si le client final **change de pays de résidence**, son formulaire W-8BEN n’est plus valide — le taux conventionnel change" },
    { icon:'🇺🇸', texte:"Si le client final **acquiert la nationalité américaine**, le W-8BEN devient invalide — un W-9 doit être fourni" },
    { icon:'🚨', texte:"Le client final a l’obligation de notifier son PSF en cas de changement — le PSF sollicite alors un nouveau formulaire" },
    { icon:'🔍', texte:"i-Hub peut détecter un indice de changement lors de ses vérifications et le **signale au PSF** qui prend la décision" },
  ], aretenir:"Tout changement de situation du client final peut modifier le taux de retenue applicable. i-Hub signale les indices au PSF." },

  { id:11, emoji:'🇧🇪', titre:"La convention fiscale USA-Luxembourg", contenu:[
    { icon:'🇧🇪', texte:"Le Luxembourg a signé une **convention fiscale** avec les USA qui réduit les taux de retenue pour les résidents luxembourgeois" },
    { icon:'📊', texte:"Dividendes américains : **15%** (au lieu de 30%) pour les résidents luxembourgeois avec W-8BEN valide" },
    { icon:'📊', texte:"Intérêts américains : **0%** pour la plupart des résidents luxembourgeois avec W-8BEN valide" },
    { icon:'🔍', texte:"Pour bénéficier de ces taux réduits : le client final doit fournir un **W-8BEN valide** mentionnant le Luxembourg comme pays de résidence" },
  ], aretenir:"Convention LU-USA : 15% sur dividendes, 0% sur intérêts. Condition : W-8BEN valide avec résidence luxembourgeoise." },

  { id:12, emoji:'🏢', titre:"Le cas des entités : W-8BEN-E et QI", contenu:[
    { icon:'🏢', texte:"Une **entité non-US** détenant des titres américains doit fournir un **W-8BEN-E** pour bénéficier du taux conventionnel" },
    { icon:'📊', texte:"Le W-8BEN-E précise la **catégorie FATCA** de l’entité (IFE participante, NFFE active, passive…) et le taux applicable" },
    { icon:'⚠️', texte:"Une **NFFE passive** avec des actionnaires américains significatifs doit le mentionner — le PSF applique alors un traitement spécifique" },
    { icon:'🔍', texte:"i-Hub vérifie la **cohérence** du W-8BEN-E avec le profil de l’entité et signale toute incohérence au PSF" },
  ], aretenir:"Pour les entités, le W-8BEN-E est plus complexe que le W-8BEN individuel. i-Hub vérifie la cohérence et signale au PSF." },

  { id:13, emoji:'📎', titre:"Ce que le PSF QI reporte à l’IRS", contenu:[
    { icon:'🇺🇸', texte:"Le PSF QI doit reporter à l’IRS les **paiements de source américaine** effectués aux clients finaux et les retenues appliquées" },
    { icon:'📊', texte:"Formulaires de reporting : **Form 1042-S** (paiements à des non-US Persons) et **Form 1042** (récapitulatif annuel)" },
    { icon:'🚫', texte:"Ce reporting **ne concerne pas i-Hub** — c’est la responsabilité exclusive du PSF QI vis-à-vis de l’IRS" },
    { icon:'🔍', texte:"i-Hub peut être sollicité par le PSF pour vérifier des **données d’identification** utilisées dans ces reportings si prévu au SLA" },
  ], aretenir:"Form 1042-S = reporting QI du PSF à l’IRS. i-Hub ne fait pas ce reporting. Il peut vérifier des données sous-jacentes si le SLA le prévoit." },

  { id:14, emoji:'🔒', titre:"Conservation et confidentialité des documents QI", contenu:[
    { icon:'📅', texte:"Les formulaires W collectés dans le contexte QI doivent être conservés **au moins 5 ans** après la fin de la relation" },
    { icon:'🔒', texte:"Ces documents contiennent des **données fiscales sensibles** (statut fiscal, TIN, résidence) — couverts par le RGPD et le secret professionnel" },
    { icon:'📤', texte:"i-Hub transmet les données vérifiées au PSF via des **canaux sécurisés** prévus au SLA — jamais directement à l’IRS" },
    { icon:'💻', texte:"i-Hub archive ses propres **rapports de vérification** QI pour justifier sa diligence en cas de contrôle" },
  ], aretenir:"Conservé, sécurisé, transmis uniquement au PSF. Jamais à l’IRS. Les données QI sont parmi les plus sensibles." },

  { id:15, emoji:'🤔', titre:"QI, FATCA et CRS : les liens", contenu:[
    { icon:'💰', texte:"**QI** + **FATCA** se basent tous deux sur les formulaires W — le même W-8BEN sert à la fois pour la retenue QI et la documentation FATCA" },
    { icon:'🌍', texte:"**CRS** est indépendant : basé sur la résidence fiscale, pas sur les revenus US — utilise l’autocertification, pas les formulaires W" },
    { icon:'🔄', texte:"Un même client final peut être concerné par les **trois** simultanément — i-Hub vérifie les documents correspondants selon le SLA" },
    { icon:'📌', texte:"Synthèse : W-9/W-8 = QI + FATCA. Autocertification = CRS. i-Hub vérifie les deux types si prévu au SLA." },
  ], aretenir:"QI et FATCA partagent les mêmes formulaires W. CRS utilise l’autocertification. i-Hub peut vérifier les deux si le SLA le prévoit." },

  { id:16, emoji:'📊', titre:"Taux de retenue : tableau synthèse", contenu:[
    { icon:'🇺🇸', texte:"**US Person** (W-9) : taux variables selon le type de revenu et la situation fiscale américaine du client final" },
    { icon:'🌍', texte:"**Non-US avec convention** (W-8BEN) : taux réduit conventionnel — ex : 15% dividendes pour résident luxembourgeois" },
    { icon:'⚠️', texte:"**Non-US sans convention** (W-8BEN) : 30% par défaut — ex : résident d’un pays sans accord fiscal avec les USA" },
    { icon:'❌', texte:"**Sans formulaire valide** : 30% par défaut obligatoire — c’est pourquoi la vérification des formulaires par i-Hub est essentielle" },
  ], aretenir:"30% = pénalité de l’absence de documentation. La vérification rigoureuse des formulaires W par i-Hub protège les clients finaux du PSF." },

  { id:17, emoji:'👤', titre:"Profils de clients finaux et QI", contenu:[
    { icon:'🇺🇸', texte:"**US Person** : W-9 requis, retenue selon le droit fiscal américain, compte FATCA-déclarable" },
    { icon:'🌍', texte:"**Non-US résident dans pays avec convention** : W-8BEN requis, taux réduit conventionnel applicable" },
    { icon:'🌐', texte:"**Non-US résident dans pays sans convention** : W-8BEN requis, taux de 30% appliqué malgré tout" },
    { icon:'🏢', texte:"**Entité non-US** : W-8BEN-E requis, taux selon la catégorie FATCA et la convention applicable" },
  ], aretenir:"Chaque profil de client final appelle un formulaire différent. i-Hub vérifie que le bon formulaire est présent et cohérent avec le profil." },

  { id:18, emoji:'🚨', titre:"Le cas du formulaire manquant", contenu:[
    { icon:'🔴', texte:"Client final détenant des titres US **sans aucun formulaire W** dans le dossier transmis par le PSF" },
    { icon:'📌', texte:"Action i-Hub : **signaler immédiatement au PSF** l’absence de formulaire, avec identification du client final concerné" },
    { icon:'🏦', texte:"C’est le **PSF** qui contacte son client final pour obtenir le formulaire manquant — pas i-Hub directement (sauf SLA spécifique)" },
    { icon:'⚠️', texte:"En attendant : le PSF applique **30% par défaut** sur les revenus US du client final concerné" },
  ], aretenir:"Formulaire manquant = signal immédiat au PSF. 30% de retenue s’applique jusqu’à régularisation. i-Hub documente et transmet." },

  { id:19, emoji:'📎', titre:"Le processus de vérification QI d’i-Hub", contenu:[
    { icon:'1️⃣', texte:"**Recevoir** le dossier du client final transmis par le PSF QI avec les titres américains concernés" },
    { icon:'2️⃣', texte:"**Vérifier** la présence et la validité du formulaire W — bon type, non expiré, cohérent avec le profil" },
    { icon:'3️⃣', texte:"**Détecter** tout red flag (formulaire expiré, indices d’américanité, incohérence de pays)" },
    { icon:'4️⃣', texte:"**Signaler** au PSF les red flags avec documentation — le PSF décide du taux et de l’action à prendre" },
    { icon:'5️⃣', texte:"**Archiver** le rapport de vérification pour justifier la diligence d’i-Hub" },
  ], aretenir:"Recevoir → Vérifier → Détecter → Signaler → Archiver. i-Hub ne décide jamais du taux — c’est toujours le PSF QI." },

  { id:20, emoji:'🎓', titre:"Résumé : QI en un coup d’œil", contenu:[
    { icon:'🇺🇸', texte:"**QI** : statut IRS optionnel pour les PSF — permet d’appliquer les taux réduits conventionnels sur les revenus US des clients finaux" },
    { icon:'💰', texte:"**Sans QI ou sans formulaire valide** : 30% de retenue par défaut sur tous les revenus de source américaine" },
    { icon:'📝', texte:"**Formulaires** : W-9 (US Person), W-8BEN (non-US particulier), W-8BEN-E (entité non-US) — à vérifier par i-Hub" },
    { icon:'🔍', texte:"**i-Hub** : vérifie les formulaires sur instruction du PSF QI, dans le cadre du SLA. Signale les red flags. Ne décide jamais du taux." },
  ], aretenir:"QI = outil fiscal du PSF. i-Hub = vérificateur de formulaires sur instruction. PSF = responsable du taux appliqué et du reporting IRS." },
]

const FICHES_EN = [
  { id:1, emoji:'🇺🇸', titre:"What is QI?", contenu:[
    { icon:'🇺🇸', texte:"**QI** = Qualified Intermediary — status granted by the **US IRS** to foreign financial institutions" },
    { icon:'💰', texte:"It concerns **US-source income** (dividends and interest on US securities) received by PSFs’ final clients" },
    { icon:'🏦', texte:"The **PSF** signs a QI agreement with the IRS — committing to identify its final clients and apply the correct withholding rate" },
    { icon:'🔍', texte:"i-Hub acts **on the QI PSF’s instruction** to verify W forms of final clients within the SLA scope" },
  ], aretenir:"QI = management of US tax withholding on US income. It is the PSF that holds QI status. i-Hub verifies on instruction." },
  { id:2, emoji:'💰', titre:"US withholding tax", contenu:[
    { icon:'🇺🇸', texte:"All **US-source income** (Apple dividend, US Treasury interest) is subject to **withholding tax** paid to the IRS" },
    { icon:'⚠️', texte:"Default rate without QI: **30%** — automatically applied if the beneficiary’s identity is not documented" },
    { icon:'⬇️', texte:"With QI status and proper documentation: reduced rate per the **tax treaty** between the final client’s country and the US (often 0%, 5% or 15%)" },
    { icon:'🇧🇪', texte:"Example: US-Luxembourg treaty → US dividends taxed at **15%** for Luxembourg residents instead of 30%" },
  ], aretenir:"Without QI or proper documentation: 30% withholding. With QI and correct forms: reduced treaty rate. The financial stakes are significant." },
  { id:3, emoji:'🌟', titre:"Why PSFs request QI status", contenu:[
    { icon:'💼', texte:"PSFs’ final clients often hold **US equity portfolios** (Apple, Amazon, Microsoft…)" },
    { icon:'💸', texte:"Without QI status, the PSF applies 30% withholding on all US dividends — **heavily penalising** final clients" },
    { icon:'✅', texte:"With QI status, the PSF can apply **reduced treaty rates** by correctly identifying its final clients" },
    { icon:'📜', texte:"In return: the QI PSF commits to **strict obligations** of identification, documentation and reporting to the IRS" },
  ], aretenir:"QI status primarily benefits PSFs’ final clients. It is a tax benefit conditional on rigorous documentation." },
  { id:4, emoji:'📝', titre:"W forms in the QI context", contenu:[
    { icon:'🇺🇸', texte:"**W-9**: completed by **US Person** final client — allows the QI PSF to apply the applicable US rate" },
    { icon:'📝', texte:"**W-8BEN**: completed by **non-US individual** final client — allows application of the treaty rate for their country of residence" },
    { icon:'🏢', texte:"**W-8BEN-E**: completed by a **non-US entity** — specifies category (FFI, NFFE) and applicable rate" },
    { icon:'🔍', texte:"**i-Hub’s role**: verify that the correct form is present and consistent for each final client holding US securities — if in SLA scope" },
  ], aretenir:"The W form determines the applicable withholding rate. Without a valid form: 30% by default. i-Hub verifies their presence and consistency." },
  { id:5, emoji:'🌍', titre:"QI vs FATCA: two distinct US frameworks", contenu:[
    { icon:'💰', texte:"**QI**: concerns **income** of US origin — what withholding rate to apply on US dividends and interest?" },
    { icon:'👤', texte:"**FATCA**: concerns **accounts** of US Persons — which accounts to report to the IRS?" },
    { icon:'🔄', texte:"Both can apply **simultaneously**: a US Person final client holding Apple shares → FATCA (account to report) AND QI (withholding on dividends)" },
    { icon:'📝', texte:"For i-Hub: W forms serve **both frameworks** — the same W-9 or W-8BEN covers both FATCA and QI" },
  ], aretenir:"QI = withholding on US income. FATCA = reporting of US accounts. Same W form, two different uses. i-Hub verifies both." },
  { id:6, emoji:'📊', titre:"Withholding rates by treaty", contenu:[
    { icon:'0%', texte:"**0%**: US bond interest for non-US Persons in certain cases — valid W-8BEN required" },
    { icon:'15%', texte:"**15%**: US dividends for residents of countries with a tax treaty with the US (e.g. Luxembourg, France, Germany)" },
    { icon:'30%', texte:"**30%**: default rate applied if no valid form or if the final client’s country has no treaty with the US" },
    { icon:'🔍', texte:"i-Hub verifies that the form provided by the final client matches their situation — the PSF then applies the correct rate" },
  ], aretenir:"Withholding rate depends on the form and the treaty. i-Hub verifies the documents. The QI PSF applies the rate." },
  { id:7, emoji:'🏦', titre:"Who holds QI status: the PSF, not i-Hub", contenu:[
    { icon:'🏦', texte:"It is the **PSF** (bank, fund, insurer) that signs the QI agreement with the IRS — and becomes responsible for its application" },
    { icon:'🚫', texte:"**i-Hub does not hold QI status** — i-Hub is a support PSF subcontractor, not a declaring financial institution" },
    { icon:'📜', texte:"The QI PSF assumes the obligations: identify final clients, apply correct rates, report to the IRS" },
    { icon:'🔍', texte:"i-Hub acts **on the QI PSF’s instruction** within the SLA — solely for documentary verification" },
  ], aretenir:"PSF = QI status holder and responsible party. i-Hub = subcontractor that verifies forms on PSF instruction, within the SLA." },
  { id:8, emoji:'🚨', titre:"QI red flags to flag to the PSF", contenu:[
    { icon:'🔴', texte:"**Expired W-8BEN**: form over 3 years old without renewal for a final client holding US securities" },
    { icon:'🔴', texte:"**Country inconsistency**: country of residence on W-8BEN does not match other documents in the file" },
    { icon:'🔴', texte:"**US indicia**: US address or US birthplace in the file while the final client provided a W-8BEN (non-US)" },
    { icon:'🔴', texte:"**Missing form**: final client holding US securities with no W form in the file" },
  ], aretenir:"Every QI red flag is flagged to the PSF. i-Hub does not decide the applicable rate — that is the exclusive responsibility of the QI PSF." },
  { id:9, emoji:'📅', titre:"Validity of W forms", contenu:[
    { icon:'📝', texte:"**W-8BEN**: valid for **3 years** from the date of signature — expiry to monitor" },
    { icon:'💼', texte:"**W-8BEN-E**: also valid for **3 years** — but any change in the entity’s situation requires immediate renewal" },
    { icon:'🔄', texte:"**W-9**: no official expiry date — but to be renewed if status changes (loss of US nationality…)" },
    { icon:'🛑', texte:"An expired form = default **30% withholding** applied by the PSF — direct financial harm to the final client" },
  ], aretenir:"W-8BEN and W-8BEN-E expire after 3 years. An expired form detected by i-Hub is flagged immediately to the PSF." },
  { id:10, emoji:'🌟', titre:"Change of circumstances and QI", contenu:[
    { icon:'👤', texte:"If the final client **changes country of residence**, their W-8BEN is no longer valid — the treaty rate changes" },
    { icon:'🇺🇸', texte:"If the final client **acquires US nationality**, the W-8BEN becomes invalid — a W-9 must be provided" },
    { icon:'🚨', texte:"The final client must notify their PSF of any change — the PSF then requests a new form" },
    { icon:'🔍', texte:"i-Hub may detect an indicator of change during verification and **flags it to the PSF** which makes the decision" },
  ], aretenir:"Any change in the final client’s situation may change the applicable withholding rate. i-Hub flags indicators to the PSF." },
  { id:11, emoji:'🇧🇪', titre:"The US-Luxembourg tax treaty", contenu:[
    { icon:'🇧🇪', texte:"Luxembourg has signed a **tax treaty** with the US that reduces withholding rates for Luxembourg residents" },
    { icon:'📊', texte:"US dividends: **15%** (instead of 30%) for Luxembourg residents with a valid W-8BEN" },
    { icon:'📊', texte:"US interest: **0%** for most Luxembourg residents with a valid W-8BEN" },
    { icon:'🔍', texte:"To benefit from these reduced rates: the final client must provide a **valid W-8BEN** stating Luxembourg as country of residence" },
  ], aretenir:"LU-US treaty: 15% on dividends, 0% on interest. Condition: valid W-8BEN with Luxembourg residency." },
  { id:12, emoji:'🏢', titre:"Entity case: W-8BEN-E and QI", contenu:[
    { icon:'🏢', texte:"A **non-US entity** holding US securities must provide a **W-8BEN-E** to benefit from the treaty rate" },
    { icon:'📊', texte:"The W-8BEN-E specifies the entity’s **FATCA category** (participating FFI, active NFFE, passive…) and the applicable rate" },
    { icon:'⚠️', texte:"A **passive NFFE** with significant US shareholders must disclose them — the PSF then applies specific treatment" },
    { icon:'🔍', texte:"i-Hub verifies the **consistency** of the W-8BEN-E with the entity’s profile and flags any inconsistency to the PSF" },
  ], aretenir:"For entities, W-8BEN-E is more complex than individual W-8BEN. i-Hub verifies consistency and flags to PSF." },
  { id:13, emoji:'📎', titre:"What the QI PSF reports to the IRS", contenu:[
    { icon:'🇺🇸', texte:"The QI PSF must report to the IRS the **US-source payments** made to final clients and the withholding applied" },
    { icon:'📊', texte:"Reporting forms: **Form 1042-S** (payments to non-US Persons) and **Form 1042** (annual summary)" },
    { icon:'🚫', texte:"This reporting **does not concern i-Hub** — it is the exclusive responsibility of the QI PSF vis-à-vis the IRS" },
    { icon:'🔍', texte:"i-Hub may be asked by the PSF to verify **identification data** used in these reports if specified in the SLA" },
  ], aretenir:"Form 1042-S = QI PSF reporting to IRS. i-Hub does not do this reporting. It may verify underlying data if the SLA provides for it." },
  { id:14, emoji:'🔒', titre:"Retention and confidentiality of QI documents", contenu:[
    { icon:'📅', texte:"W forms collected in the QI context must be retained for **at least 5 years** after end of relationship" },
    { icon:'🔒', texte:"These documents contain **sensitive tax data** (tax status, TIN, residency) — covered by GDPR and professional secrecy" },
    { icon:'📤', texte:"i-Hub transmits verified data to the PSF via **secure channels** per the SLA — never directly to the IRS" },
    { icon:'💻', texte:"i-Hub archives its own **QI verification reports** to justify its diligence in case of audit" },
  ], aretenir:"Retained, secured, transmitted to PSF only. Never to IRS. QI data is among the most sensitive." },
  { id:15, emoji:'🤔', titre:"QI, FATCA and CRS: the links", contenu:[
    { icon:'💰', texte:"**QI** + **FATCA** both use W forms — the same W-8BEN serves both QI withholding and FATCA documentation" },
    { icon:'🌍', texte:"**CRS** is independent: based on tax residency, not US income — uses self-certification, not W forms" },
    { icon:'🔄', texte:"The same final client may be subject to all **three** simultaneously — i-Hub verifies the corresponding documents per SLA" },
    { icon:'📌', texte:"Summary: W-9/W-8 = QI + FATCA. Self-certification = CRS. i-Hub verifies both types if in SLA scope." },
  ], aretenir:"QI and FATCA share W forms. CRS uses self-certification. i-Hub may verify both types if the SLA provides for it." },
  { id:16, emoji:'📊', titre:"Withholding rates: summary table", contenu:[
    { icon:'🇺🇸', texte:"**US Person** (W-9): varying rates depending on the type of income and the final client’s US tax situation" },
    { icon:'🌍', texte:"**Non-US with treaty** (W-8BEN): reduced treaty rate — e.g. 15% dividends for Luxembourg resident" },
    { icon:'⚠️', texte:"**Non-US without treaty** (W-8BEN): 30% by default — e.g. resident of a country with no US tax agreement" },
    { icon:'❌', texte:"**Without valid form**: 30% by default mandatory — this is why i-Hub’s form verification is essential" },
  ], aretenir:"30% = penalty for lack of documentation. i-Hub’s rigorous W form verification protects the PSF’s final clients." },
  { id:17, emoji:'👤', titre:"Final client profiles and QI", contenu:[
    { icon:'🇺🇸', texte:"**US Person**: W-9 required, withholding per US tax law, FATCA-reportable account" },
    { icon:'🌍', texte:"**Non-US in treaty country**: W-8BEN required, applicable reduced treaty rate" },
    { icon:'🌐', texte:"**Non-US in non-treaty country**: W-8BEN required, 30% rate applied regardless" },
    { icon:'🏢', texte:"**Non-US entity**: W-8BEN-E required, rate per FATCA category and applicable treaty" },
  ], aretenir:"Each final client profile requires a different form. i-Hub verifies that the correct form is present and consistent with the profile." },
  { id:18, emoji:'🚨', titre:"The missing form case", contenu:[
    { icon:'🔴', texte:"Final client holding US securities with **no W form at all** in the file transmitted by the PSF" },
    { icon:'📌', texte:"i-Hub action: **flag immediately to the PSF** the missing form, identifying the final client concerned" },
    { icon:'🏦', texte:"It is the **PSF** that contacts its final client to obtain the missing form — not i-Hub directly (unless specified in SLA)" },
    { icon:'⚠️', texte:"In the meantime: the PSF applies **30% by default** on the US income of the final client concerned" },
  ], aretenir:"Missing form = immediate flag to PSF. 30% withholding applies until rectification. i-Hub documents and transmits." },
  { id:19, emoji:'📎', titre:"i-Hub’s QI verification process", contenu:[
    { icon:'1️⃣', texte:"**Receive** the final client’s file transmitted by the QI PSF with the relevant US securities" },
    { icon:'2️⃣', texte:"**Verify** the presence and validity of the W form — correct type, not expired, consistent with profile" },
    { icon:'3️⃣', texte:"**Detect** any red flag (expired form, US indicia, country inconsistency)" },
    { icon:'4️⃣', texte:"**Flag** red flags to the PSF with documentation — the PSF decides on the rate and action" },
    { icon:'5️⃣', texte:"**Archive** the verification report to justify i-Hub’s diligence" },
  ], aretenir:"Receive → Verify → Detect → Flag → Archive. i-Hub never decides the rate — always the QI PSF." },
  { id:20, emoji:'🎓', titre:"Summary: QI at a glance", contenu:[
    { icon:'🇺🇸', texte:"**QI**: optional IRS status for PSFs — allows application of reduced treaty rates on US income of final clients" },
    { icon:'💰', texte:"**Without QI or valid form**: 30% default withholding on all US-source income" },
    { icon:'📝', texte:"**Forms**: W-9 (US Person), W-8BEN (non-US individual), W-8BEN-E (non-US entity) — to be verified by i-Hub" },
    { icon:'🔍', texte:"**i-Hub**: verifies forms on QI PSF instruction, within SLA. Flags red flags. Never decides the rate." },
  ], aretenir:"QI = PSF’s tax tool. i-Hub = form verifier on instruction. PSF = responsible for the applied rate and IRS reporting." },
]

const VF_FR = [
  { texte:"i-Hub possède le statut QI et peut appliquer les taux réduits directement", reponse:false, explication:"Non ! C’est le PSF qui a le statut QI. i-Hub est sous-traitant et vérifie les formulaires sur instruction du PSF." },
  { texte:"Sans formulaire W valide, le PSF applique 30% de retenue par défaut", reponse:true, explication:"Exact ! 30% est le taux par défaut en l’absence de documentation valide. C’est l’enjeu de la vérification des formulaires." },
  { texte:"Le W-8BEN est valable indéfiniment", reponse:false, explication:"Non ! Le W-8BEN expire après 3 ans. Un formulaire expiré détecté par i-Hub doit être signalé immédiatement au PSF." },
  { texte:"QI et FATCA utilisent les mêmes formulaires W", reponse:true, explication:"Exact ! Le même W-8BEN sert à la fois pour la retenue QI et la documentation FATCA." },
  { texte:"La convention USA-Luxembourg réduit les dividendes américains à 15% pour les résidents luxembourgeois", reponse:true, explication:"Exact ! Au lieu des 30% par défaut, un résident luxembourgeois avec W-8BEN valide ne paie que 15% sur les dividendes US." },
  { texte:"i-Hub décide du taux de retenue à appliquer quand il détecte un formulaire expiré", reponse:false, explication:"Non ! i-Hub signale le formulaire expiré au PSF. C’est le PSF QI qui décide du taux et de l’action à prendre." },
  { texte:"Un client final US Person doit fournir un W-9, pas un W-8BEN", reponse:true, explication:"Exact ! Le W-9 est pour les US Persons. Le W-8BEN est pour les non-US Persons." },
  { texte:"i-Hub reporte directement à l’IRS les paiements de source américaine", reponse:false, explication:"Non ! C’est le PSF QI qui reporte à l’IRS via le Form 1042-S. i-Hub n’est jamais en contact avec l’IRS." },
  { texte:"Un client final peut être soumis à QI, FATCA et CRS simultanément", reponse:true, explication:"Exact ! Un US Person détenant des actions américaines et résident en France est concerné par les trois dispositifs." },
  { texte:"Le W-8BEN-E est utilisé pour les particuliers non-américains", reponse:false, explication:"Non ! Le W-8BEN-E est pour les entités (sociétés, fonds…). Le W-8BEN est pour les particuliers." },
]
const VF_EN = [
  { texte:"i-Hub holds QI status and can apply reduced rates directly", reponse:false, explication:"No! It is the PSF that holds QI status. i-Hub is a subcontractor and verifies forms on the PSF’s instruction." },
  { texte:"Without a valid W form, the PSF applies 30% withholding by default", reponse:true, explication:"Correct! 30% is the default rate in the absence of valid documentation. This is why form verification matters." },
  { texte:"The W-8BEN is valid indefinitely", reponse:false, explication:"No! The W-8BEN expires after 3 years. An expired form detected by i-Hub must be flagged immediately to the PSF." },
  { texte:"QI and FATCA use the same W forms", reponse:true, explication:"Correct! The same W-8BEN serves both QI withholding and FATCA documentation purposes." },
  { texte:"The US-Luxembourg treaty reduces US dividends to 15% for Luxembourg residents", reponse:true, explication:"Correct! Instead of the default 30%, a Luxembourg resident with a valid W-8BEN pays only 15% on US dividends." },
  { texte:"i-Hub decides the withholding rate to apply when it detects an expired form", reponse:false, explication:"No! i-Hub flags the expired form to the PSF. It is the QI PSF that decides on the rate and action to take." },
  { texte:"A US Person final client must provide a W-9, not a W-8BEN", reponse:true, explication:"Correct! W-9 is for US Persons. W-8BEN is for non-US Persons." },
  { texte:"i-Hub reports US-source payments directly to the IRS", reponse:false, explication:"No! It is the QI PSF that reports to the IRS via Form 1042-S. i-Hub is never in contact with the IRS." },
  { texte:"A final client can be subject to QI, FATCA and CRS simultaneously", reponse:true, explication:"Correct! A US Person holding US shares and resident in France is concerned by all three frameworks." },
  { texte:"The W-8BEN-E is used for non-US individuals", reponse:false, explication:"No! W-8BEN-E is for entities (companies, funds…). W-8BEN is for individuals." },
]

const TAUX_FR = [
  { profil:"Client final résident au Luxembourg, non-américain, détient des actions Apple", taux:"15%", explication:"Convention USA-Luxembourg : 15% sur les dividendes américains pour les résidents luxembourgeois avec W-8BEN valide." },
  { profil:"Client final américain (US Person), détient des obligations du Trésor américain", taux:"Variable (taux US)", explication:"US Person = W-9. Le taux dépend de la situation fiscale américaine du client final — appliqué par le PSF." },
  { profil:"Client final résident au Brésil (pas de convention fiscale avec les USA)", taux:"30%", explication:"Pas de convention USA-Brésil. Malgré un W-8BEN valide, le taux de 30% s’applique par défaut." },
  { profil:"Client final résident en France, détient des intérêts sur obligations américaines", taux:"0%", explication:"Convention USA-France : intérêts américains à 0% pour les résidents français avec W-8BEN valide." },
  { profil:"Client final sans aucun formulaire W dans le dossier", taux:"30% (défaut)", explication:"Absence de formulaire = 30% obligatoire. i-Hub signale l’anomalie au PSF qui doit obtenir le formulaire." },
]
const TAUX_EN = [
  { profil:"Luxembourg resident final client, non-US, holds Apple shares", taux:"15%", explication:"US-Luxembourg treaty: 15% on US dividends for Luxembourg residents with valid W-8BEN." },
  { profil:"US Person final client, holds US Treasury bonds", taux:"Variable (US rate)", explication:"US Person = W-9. Rate depends on the final client’s US tax situation — applied by the PSF." },
  { profil:"Final client resident in Brazil (no tax treaty with the US)", taux:"30%", explication:"No US-Brazil treaty. Despite a valid W-8BEN, the 30% default rate applies." },
  { profil:"French resident final client, holds interest on US bonds", taux:"0%", explication:"US-France treaty: 0% on US interest for French residents with valid W-8BEN." },
  { profil:"Final client with no W form at all in the file", taux:"30% (default)", explication:"No form = mandatory 30%. i-Hub flags the anomaly to the PSF which must obtain the form." },
]

const CAS_FR = [
  { situation:"Un PSF QI transmet le dossier d’un client final luxembourgeois détenant des actions Microsoft. Le W-8BEN date de 2021.", action:"Signaler au PSF : W-8BEN expiré (plus de 3 ans) — risque de passage à 30%", options:["Accepter — le formulaire est présent","Signaler au PSF : W-8BEN expiré (plus de 3 ans) — risque de passage à 30%","Appliquer 30% directement","Demander un nouveau formulaire au client final"], explication:"W-8BEN signé en 2021 = expiré depuis 2024. i-Hub le signale au PSF. C’est le PSF qui contacte son client final pour renouveler." },
  { situation:"Un PSF transmet le dossier d’une entité luxembourgeoise NFFE passive avec un actionnaire américain détenant 15% du capital.", action:"Signaler au PSF : NFFE passive avec actionnaire US — vérifier le W-8BEN-E et les obligations FATCA", options:["Accepter le dossier — 15% < 25%","Signaler au PSF : NFFE passive avec actionnaire US — vérifier le W-8BEN-E et les obligations FATCA","Déclarer l’actionnaire américain directement","Refuser le dossier"], explication:"15% > 10% (seuil FATCA pour NFFE passive). i-Hub signale au PSF qui vérifiera les obligations FATCA et le W-8BEN-E." },
  { situation:"Un client final allemand détenant des actions Apple fournit un W-8BEN mentionnant la résidence en Suisse. Son passeport indique une adresse à Munich.", action:"Signaler l’incohérence au PSF : résidence W-8BEN ≠ adresse passeport", options:["Accepter — le client a signé","Signaler l’incohérence au PSF : résidence W-8BEN ≠ adresse passeport","Appliquer le taux allemand","Demander un nouveau formulaire"], explication:"Adresse Munich (Allemagne) vs résidence Suisse sur W-8BEN = incohérence documentaire à signaler immédiatement au PSF." },
]
const CAS_EN = [
  { situation:"A QI PSF transmits the file of a Luxembourg final client holding Microsoft shares. The W-8BEN dates from 2021.", action:"Flag to PSF: expired W-8BEN (over 3 years) — risk of reverting to 30%", options:["Accept — the form is present","Flag to PSF: expired W-8BEN (over 3 years) — risk of reverting to 30%","Apply 30% directly","Request a new form from the final client"], explication:"W-8BEN signed in 2021 = expired since 2024. i-Hub flags to the PSF. The PSF contacts its final client to renew." },
  { situation:"A PSF transmits the file of a Luxembourg passive NFFE entity with a US shareholder holding 15% of the capital.", action:"Flag to PSF: passive NFFE with US shareholder — verify W-8BEN-E and FATCA obligations", options:["Accept the file — 15% < 25%","Flag to PSF: passive NFFE with US shareholder — verify W-8BEN-E and FATCA obligations","Report the US shareholder directly","Reject the file"], explication:"15% > 10% (FATCA threshold for passive NFFEs). i-Hub flags to PSF which will verify FATCA obligations and W-8BEN-E." },
  { situation:"A German final client holding Apple shares provides a W-8BEN stating Swiss residency. Their passport shows a Munich address.", action:"Flag inconsistency to PSF: W-8BEN residency ≠ passport address", options:["Accept — the client signed","Flag inconsistency to PSF: W-8BEN residency ≠ passport address","Apply the German rate","Request a new form"], explication:"Munich address (Germany) vs Swiss residency on W-8BEN = documentary inconsistency to flag immediately to the PSF." },
]

export default function ModuleQI() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeVF, setActiveVF] = useState(() => pickRandom(VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct'|'wrong'|null>(null)

  const [activeTaux] = useState(() => shuffle(TAUX_FR))
  const [tauxIndex, setTauxIndex] = useState(0)
  const [tauxRevealed, setTauxRevealed] = useState(false)
  const [tauxScore, setTauxScore] = useState(0)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState<string|null>(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l: 'fr'|'en') {
    const bv=l==='fr'?VF_FR:VF_EN; const bc=l==='fr'?CAS_FR:CAS_EN
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
    setTauxIndex(0); setTauxRevealed(false); setTauxScore(0)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l) }

  function repondreVF(rep: boolean) {
    if (vfRepondu!==null) return
    const correct=activeVF[vfIndex].reponse===rep; setVfRepondu(rep); setVfAnimation(correct?'correct':'wrong')
    if (correct) setVfScore(s=>s+1)
    setTimeout(()=>{ setVfAnimation(null); setVfRepondu(null); if(vfIndex+1<activeVF.length){setVfIndex(i=>i+1)}else{setScore(s=>s+(correct?vfScore+1:vfScore)*5);setPhase('quiz2')} },2200)
  }

  function nextTaux() {
    setTauxScore(s=>s+1)
    if (tauxIndex+1<activeTaux.length) { setTauxIndex(i=>i+1); setTauxRevealed(false) }
    else { setScore(s=>s+tauxScore*3); setPhase('quiz3') }
  }

  function repCas(opt: string) { if(casRepondu!==null)return; const correct=opt===activeCas[casIndex].action; setCasRepondu(opt); if(correct)setCasScore(s=>s+1) }
  function nextCas() { if(casIndex+1<activeCas.length){setCasIndex(i=>i+1);setCasRepondu(null)}else{setScore(s=>s+casScore*7);setPhase('resultat')} }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>💰 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l=><button key={l} onClick={()=>switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
        </div>
        <span style={{background:'white',border:`1px solid ${C}`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>💰</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=><div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>✓</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.quiz,icon:'🎮'},{label:t.time,icon:'⏱️'}].map((b,i)=><div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase==='fiches') {
    const fiche=FICHES[ficheIndex]; const progress=((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${progress}%`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1}/{FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i)=><div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:`2px solid ${C}30`,boxShadow:`0 8px 40px ${C}15`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
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
            {ficheIndex>0&&<button onClick={()=>{setFicheIndex(i=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex<FICHES.length-1?`${t.next} (${ficheIndex+2}/${FICHES.length}) →`:t.quizBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase==='quiz1') {
    const q=activeVF[vfIndex]
    return (
      <div style={{...base,background:vfAnimation==='correct'?'#d1fae5':vfAnimation==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar/>
        <div style={{background:vfAnimation==='correct'?'#6ee7b7':vfAnimation==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(vfIndex/activeVF.length)*100}%`}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q1label} — {vfIndex+1}/{activeVF.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q1title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80px'}}>
            <p style={{fontSize:'18px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
          </div>
          {vfRepondu===null?(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={()=>repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={()=>repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.false}</button>
            </div>
          ):(
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnimation==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{vfAnimation==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{q.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeVF.map((_,i)=><div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=vfIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase==='quiz2') {
    const cas=activeTaux[tauxIndex]
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(tauxIndex/activeTaux.length)*100}%`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q2label} — {tauxIndex+1}/{activeTaux.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q2title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q2sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:`2px solid ${C}30`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>👤 {cas.profil}</p>
          </div>
          {!tauxRevealed?(
            <button onClick={()=>setTauxRevealed(true)} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
              {lang==='fr'?'🔍 Voir le taux applicable':'🔍 See applicable rate'}
            </button>
          ):(
            <div>
              <div style={{background:`${C}10`,border:`2px solid ${C}40`,borderRadius:'12px',padding:'24px',marginBottom:'16px',textAlign:'center'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{lang==='fr'?'Taux applicable':'Applicable rate'}</p>
                <p style={{margin:'0 0 12px',fontSize:'36px',fontWeight:'800',color:'#1f2937'}}>{cas.taux}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>💡 {cas.explication}</p>
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',fontSize:'13px',color:'#059669',fontWeight:'600'}}>
                {lang==='fr'?'ℹ️ i-Hub vérifie le formulaire W. Le PSF QI applique le taux.':'ℹ️ i-Hub verifies the W form. The QI PSF applies the rate.'}
              </div>
              <button onClick={nextTaux} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
                {tauxIndex<activeTaux.length-1?t.next2:t.last}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase==='quiz3') {
    const cas=activeCas[casIndex]
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(casIndex/activeCas.length)*100}%`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:`2px solid ${C}30`,marginBottom:'16px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu===null?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i)=>(
                <button key={i} onClick={()=>repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left',transition:'all 0.15s'}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=`${C}08`}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ):(
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>
                {cas.options.map((opt,i)=>{const isC=opt===cas.action,isCh=opt===casRepondu;return(
                  <div key={i} style={{padding:'12px 16px',background:isC?'#d1fae5':isCh?'#fee2e2':'white',border:`1.5px solid ${isC?'#6ee7b7':isCh?'#fca5a5':'#e5e7eb'}`,borderRadius:'10px',fontSize:'14px',fontWeight:'600',color:isC?'#059669':isCh?'#ef4444':'#9ca3af'}}>
                    {isC?'✅ ':isCh?'❌ ':''}{opt}
                  </div>
                )})}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'12px',padding:'14px',marginBottom:'14px'}}>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>💡 {cas.explication}</p>
              </div>
              <button onClick={nextCas} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
                {casIndex<activeCas.length-1?t.next2:t.last}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const total=Math.min(100,score),medal=total>=80?'🥇':total>=50?'🥈':'🥉',msg=total>=80?t.medal_gold:total>=50?t.medal_silver:t.medal_bronze
  return (
    <div style={base}><NavBar/>
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
          <button onClick={()=>router.back()} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.backHome}</button>
          <button onClick={()=>{initQuizzes(lang);setScore(0);setPhase('intro')}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
