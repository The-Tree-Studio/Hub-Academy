const fs = require('fs');
const ORANGE = '#e07b39';

fs.mkdirSync('app/modules/qi', { recursive: true });
fs.writeFileSync('app/modules/qi/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${ORANGE}'

const UI = {
  fr: {
    title: 'QI \u2014 Qualified Intermediary',
    subtitle: 'La retenue \u00e0 la source am\u00e9ricaine \u2014 ce que v\u00e9rifie i-Hub pour ses clients PSF',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Ce qu\u2019est le statut QI et pourquoi les PSF le demandent',
      'Comment la retenue \u00e0 la source am\u00e9ricaine fonctionne',
      'Les formulaires W li\u00e9s au QI que v\u00e9rifie i-Hub',
      'La diff\u00e9rence entre QI, FATCA et CRS',
      'Le r\u00f4le d\u2019i-Hub\u00a0: v\u00e9rifier sur instruction du PSF QI',
      'Les red flags \u00e0 signaler au PSF lors des v\u00e9rifications',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR', goFurther: '\ud83d\udd0d Aller plus loin',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 VRAI OU FAUX', q1title: '\u2705 Vrai ou Faux \u2014 QI en pratique',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q2label: 'QUIZ 2/3 \u00b7 QUEL TAUX\u00a0?', q2title: '\ud83d\udcb0 Quelle retenue s\u2019applique\u00a0?',
    q2sub: 'Pour chaque profil de client final, quel taux de retenue le PSF QI doit-il appliquer\u00a0?',
    q3label: 'QUIZ 3/3 \u00b7 CAS PRATIQUES', q3title: '\ud83d\udd0d Que signale i-Hub au PSF\u00a0?',
    q3sub: 'Un PSF QI vous transmet un dossier \u2014 que faites-vous\u00a0?',
    resultTitle: 'Module QI termin\u00e9 \u2014 20 fiches ma\u00eetris\u00e9es\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    pts_gained: 'pts', medal_gold: 'Expert QI\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Dernier quiz \u2192',
    validate: 'Valider',
  },
  en: {
    title: 'QI \u2014 Qualified Intermediary',
    subtitle: 'US withholding tax \u2014 what i-Hub verifies for its QI PSF clients',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'What QI status is and why PSFs request it',
      'How US withholding tax works',
      'QI-related W forms that i-Hub verifies',
      'The difference between QI, FATCA and CRS',
      'i-Hub\u2019s role: verify on instruction from the QI PSF',
      'Red flags to flag to the PSF during verifications',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '\ud83d\udd0d Go further',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 TRUE OR FALSE', q1title: '\u2705 True or False \u2014 QI in practice',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q2label: 'QUIZ 2/3 \u00b7 WHICH RATE?', q2title: '\ud83d\udcb0 Which withholding rate applies?',
    q2sub: 'For each final client profile, what withholding rate must the QI PSF apply?',
    q3label: 'QUIZ 3/3 \u00b7 CASE STUDIES', q3title: '\ud83d\udd0d What does i-Hub flag to the PSF?',
    q3sub: 'A QI PSF transmits a file \u2014 what do you do?',
    resultTitle: 'QI module complete \u2014 20 cards mastered!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    pts_gained: 'pts', medal_gold: 'QI Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Last quiz \u2192',
    validate: 'Validate',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:"C\u2019est quoi le QI\u00a0?", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**QI** = Qualified Intermediary = Interm\u00e9diaire Qualifi\u00e9 \u2014 statut accord\u00e9 par l\u2019**IRS am\u00e9ricain** aux institutions financi\u00e8res \u00e9trang\u00e8res" },
    { icon:'\ud83d\udcb0', texte:"Il concerne les revenus de **source am\u00e9ricaine** (dividendes et int\u00e9r\u00eats sur titres am\u00e9ricains) per\u00e7us par les clients finaux des PSF" },
    { icon:'\ud83c\udfe6', texte:"Le **PSF** signe un accord QI avec l\u2019IRS \u2014 il s\u2019engage \u00e0 identifier ses clients finaux et \u00e0 appliquer le bon taux de retenue" },
    { icon:'\ud83d\udd0d', texte:"i-Hub intervient **sur instruction du PSF QI** pour v\u00e9rifier les formulaires W des clients finaux dans le cadre du SLA" },
  ], aretenir:"QI = gestion de la retenue fiscale US sur les revenus am\u00e9ricains. C\u2019est le PSF qui a le statut QI. i-Hub v\u00e9rifie sur instruction." },

  { id:2, emoji:'\ud83d\udcb0', titre:"La retenue \u00e0 la source am\u00e9ricaine", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"Tout **revenu de source am\u00e9ricaine** (dividende Apple, int\u00e9r\u00eat sur bon du Tr\u00e9sor US) est soumis \u00e0 une **retenue \u00e0 la source** pay\u00e9e \u00e0 l\u2019IRS" },
    { icon:'\u26a0\ufe0f', texte:"Taux par d\u00e9faut sans QI\u00a0: **30%** \u2014 appliqu\u00e9 automatiquement si l\u2019identit\u00e9 du b\u00e9n\u00e9ficiaire n\u2019est pas document\u00e9e" },
    { icon:'\u2b07\ufe0f', texte:"Avec statut QI et bonne documentation\u00a0: taux r\u00e9duit selon la **convention fiscale** entre le pays du client final et les USA (souvent 0%, 5% ou 15%)" },
    { icon:'\ud83c\udde7\ud83c\uddea', texte:"Exemple\u00a0: convention USA-Luxembourg \u2192 dividendes am\u00e9ricains tax\u00e9s \u00e0 **15%** pour un r\u00e9sident luxembourgeois au lieu de 30%" },
  ], aretenir:"Sans QI ou sans bonne documentation\u00a0: 30% de retenue. Avec QI et formulaires corrects\u00a0: taux conventionnel r\u00e9duit. L\u2019enjeu est financier." },

  { id:3, emoji:'\ud83c\udf1f', titre:"Pourquoi les PSF demandent le statut QI", contenu:[
    { icon:'\ud83d\udcbc', texte:"Les clients finaux des PSF d\u00e9tiennent souvent des **portefeuilles d\u2019actions am\u00e9ricaines** (Apple, Amazon, Microsoft\u2026)" },
    { icon:'\ud83d\udcb8', texte:"Sans statut QI, le PSF applique 30% de retenue sur tous les dividendes US \u2014 ce qui **p\u00e9nalise fortement** les clients finaux" },
    { icon:'\u2705', texte:"Avec le statut QI, le PSF peut appliquer les **taux r\u00e9duits conventionnels** en identifiant correctement ses clients finaux" },
    { icon:'\ud83d\udcdc', texte:"En contrepartie\u00a0: le PSF QI s\u2019engage \u00e0 des **obligations strictes** d\u2019identification, documentation et reporting envers l\u2019IRS" },
  ], aretenir:"Le statut QI profite avant tout aux clients finaux des PSF. C\u2019est un avantage fiscal conditionn\u00e9 \u00e0 une documentation rigoureuse." },

  { id:4, emoji:'\ud83d\udcdd', titre:"Les formulaires W dans le contexte QI", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**W-9**\u00a0: rempli par le client final **US Person** \u2014 permet au PSF QI de lui appliquer le taux US applicable" },
    { icon:'\ud83d\udcdd', texte:"**W-8BEN**\u00a0: rempli par le client final **non-US (particulier)** \u2014 permet d\u2019appliquer le taux conventionnel de son pays de r\u00e9sidence" },
    { icon:'\ud83c\udfe2', texte:"**W-8BEN-E**\u00a0: rempli par une **entit\u00e9 non-US** \u2014 pr\u00e9cise la cat\u00e9gorie (IFE, NFFE) et le taux applicable" },
    { icon:'\ud83d\udd0d', texte:"**R\u00f4le d\u2019i-Hub**\u00a0: v\u00e9rifier que le bon formulaire est pr\u00e9sent et coh\u00e9rent pour chaque client final d\u00e9tenant des titres US \u2014 si pr\u00e9vu au SLA" },
  ], aretenir:"Le formulaire W d\u00e9termine le taux de retenue applicable. Sans formulaire valide\u00a0: 30% par d\u00e9faut. i-Hub v\u00e9rifie leur pr\u00e9sence et coh\u00e9rence." },

  { id:5, emoji:'\ud83c\udf0d', titre:"QI vs FATCA\u00a0: deux dispositifs am\u00e9ricains distincts", contenu:[
    { icon:'\ud83d\udcb0', texte:"**QI**\u00a0: concerne les **revenus** de source am\u00e9ricaine \u2014 quel taux de retenue appliquer sur dividendes et int\u00e9r\u00eats US\u00a0?" },
    { icon:'\ud83d\udc64', texte:"**FATCA**\u00a0: concerne les **comptes** des US Persons \u2014 quels comptes d\u00e9clarer \u00e0 l\u2019IRS\u00a0?" },
    { icon:'\ud83d\udd04', texte:"Les deux peuvent s\u2019appliquer **simultan\u00e9ment**\u00a0: un client final US Person d\u00e9tenant des actions Apple \u2192 FATCA (compte \u00e0 d\u00e9clarer) ET QI (retenue sur dividendes)" },
    { icon:'\ud83d\udcdd', texte:"Pour i-Hub\u00a0: les formulaires W servent aux **deux dispositifs** \u2014 le m\u00eame W-9 ou W-8BEN couvre FATCA et QI" },
  ], aretenir:"QI = retenue sur revenus US. FATCA = d\u00e9claration de comptes US. M\u00eame formulaire W, deux usages diff\u00e9rents. i-Hub v\u00e9rifie les deux." },

  { id:6, emoji:'\ud83d\udcca', titre:"Les taux de retenue selon les conventions", contenu:[
    { icon:'0%', texte:"**0%**\u00a0: int\u00e9r\u00eats sur obligations am\u00e9ricaines pour les non-US Persons dans certains cas \u2014 formulaire W-8BEN requis" },
    { icon:'15%', texte:"**15%**\u00a0: dividendes am\u00e9ricains pour les r\u00e9sidents de pays ayant une convention fiscale avec les USA (ex\u00a0: Luxembourg, France, Allemagne)" },
    { icon:'30%', texte:"**30%**\u00a0: taux par d\u00e9faut appliqu\u00e9 si aucun formulaire valide ou si le pays du client final n\u2019a pas de convention avec les USA" },
    { icon:'\ud83d\udd0d', texte:"i-Hub v\u00e9rifie que le formulaire fourni par le client final correspond \u00e0 sa situation \u2014 le PSF applique ensuite le bon taux" },
  ], aretenir:"Le taux de retenue d\u00e9pend du formulaire et de la convention. i-Hub v\u00e9rifie les documents. Le PSF QI applique le taux." },

  { id:7, emoji:'\ud83c\udfe6', titre:"Qui a le statut QI\u00a0: le PSF, pas i-Hub", contenu:[
    { icon:'\ud83c\udfe6', texte:"C\u2019est le **PSF** (banque, fonds, assureur) qui signe l\u2019accord QI avec l\u2019IRS \u2014 il devient responsable de son application" },
    { icon:'\ud83d\udeab', texte:"**i-Hub n\u2019a pas de statut QI** \u2014 i-Hub est un PSF de support sous-traitant, pas une institution financi\u00e8re d\u00e9clarante" },
    { icon:'\ud83d\udcdc', texte:"Le PSF QI assume les obligations\u00a0: identifier les clients finaux, appliquer les bons taux, reporter \u00e0 l\u2019IRS" },
    { icon:'\ud83d\udd0d', texte:"i-Hub intervient **sur instruction du PSF QI** dans le cadre du SLA \u2014 uniquement pour la v\u00e9rification documentaire" },
  ], aretenir:"PSF = titulaire du statut QI et responsable. i-Hub = sous-traitant qui v\u00e9rifie les formulaires sur instruction du PSF, dans le SLA." },

  { id:8, emoji:'\ud83d\udea8', titre:"Les red flags QI \u00e0 signaler au PSF", contenu:[
    { icon:'\ud83d\udd34', texte:"**W-8BEN expir\u00e9**\u00a0: formulaire de plus de 3 ans sans renouvellement pour un client final d\u00e9tenant des titres US" },
    { icon:'\ud83d\udd34', texte:"**Incoh\u00e9rence de pays**\u00a0: le pays de r\u00e9sidence du formulaire W-8BEN ne correspond pas aux autres documents du dossier" },
    { icon:'\ud83d\udd34', texte:"**Indices d\u2019am\u00e9ricanit\u00e9**\u00a0: adresse US ou naissance aux USA sur le dossier alors que le client final a fourni un W-8BEN (non-US)" },
    { icon:'\ud83d\udd34', texte:"**Formulaire manquant**\u00a0: client final d\u00e9tenant des titres US sans aucun formulaire W dans le dossier" },
  ], aretenir:"Tout red flag QI est signal\u00e9 au PSF. i-Hub ne d\u00e9cide pas du taux \u00e0 appliquer \u2014 c\u2019est la responsabilit\u00e9 exclusive du PSF QI." },

  { id:9, emoji:'\ud83d\udcc5', titre:"La validit\u00e9 des formulaires W", contenu:[
    { icon:'\ud83d\udcdd', texte:"**W-8BEN**\u00a0: valable **3 ans** \u00e0 partir de la date de signature \u2014 expiration \u00e0 surveiller" },
    { icon:'\ud83d\udcbc', texte:"**W-8BEN-E**\u00a0: valable **3 ans** \u00e9galement \u2014 mais toute modification de situation de l\u2019entit\u00e9 impose un renouvellement imm\u00e9diat" },
    { icon:'\ud83d\udd04', texte:"**W-9**\u00a0: pas de date d\u2019expiration officielle \u2014 mais \u00e0 renouveler si changement de statut (perte de nationalit\u00e9 US\u2026)" },
    { icon:'\ud83d\uded1', texte:"Un formulaire expir\u00e9 = retenue par d\u00e9faut de **30%** appliqu\u00e9e par le PSF \u2014 pr\u00e9judice direct pour le client final" },
  ], aretenir:"W-8BEN et W-8BEN-E expirent apr\u00e8s 3 ans. Un formulaire expir\u00e9 d\u00e9tect\u00e9 par i-Hub est signal\u00e9 imm\u00e9diatement au PSF." },

  { id:10, emoji:'\ud83c\udf1f', titre:"Changement de circonstances et QI", contenu:[
    { icon:'\ud83d\udc64', texte:"Si le client final **change de pays de r\u00e9sidence**, son formulaire W-8BEN n\u2019est plus valide \u2014 le taux conventionnel change" },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"Si le client final **acquiert la nationalit\u00e9 am\u00e9ricaine**, le W-8BEN devient invalide \u2014 un W-9 doit \u00eatre fourni" },
    { icon:'\ud83d\udea8', texte:"Le client final a l\u2019obligation de notifier son PSF en cas de changement \u2014 le PSF sollicite alors un nouveau formulaire" },
    { icon:'\ud83d\udd0d', texte:"i-Hub peut d\u00e9tecter un indice de changement lors de ses v\u00e9rifications et le **signale au PSF** qui prend la d\u00e9cision" },
  ], aretenir:"Tout changement de situation du client final peut modifier le taux de retenue applicable. i-Hub signale les indices au PSF." },

  { id:11, emoji:'\ud83c\udde7\ud83c\uddea', titre:"La convention fiscale USA-Luxembourg", contenu:[
    { icon:'\ud83c\udde7\ud83c\uddea', texte:"Le Luxembourg a sign\u00e9 une **convention fiscale** avec les USA qui r\u00e9duit les taux de retenue pour les r\u00e9sidents luxembourgeois" },
    { icon:'\ud83d\udcca', texte:"Dividendes am\u00e9ricains\u00a0: **15%** (au lieu de 30%) pour les r\u00e9sidents luxembourgeois avec W-8BEN valide" },
    { icon:'\ud83d\udcca', texte:"Int\u00e9r\u00eats am\u00e9ricains\u00a0: **0%** pour la plupart des r\u00e9sidents luxembourgeois avec W-8BEN valide" },
    { icon:'\ud83d\udd0d', texte:"Pour b\u00e9n\u00e9ficier de ces taux r\u00e9duits\u00a0: le client final doit fournir un **W-8BEN valide** mentionnant le Luxembourg comme pays de r\u00e9sidence" },
  ], aretenir:"Convention LU-USA\u00a0: 15% sur dividendes, 0% sur int\u00e9r\u00eats. Condition\u00a0: W-8BEN valide avec r\u00e9sidence luxembourgeoise." },

  { id:12, emoji:'\ud83c\udfe2', titre:"Le cas des entit\u00e9s\u00a0: W-8BEN-E et QI", contenu:[
    { icon:'\ud83c\udfe2', texte:"Une **entit\u00e9 non-US** d\u00e9tenant des titres am\u00e9ricains doit fournir un **W-8BEN-E** pour b\u00e9n\u00e9ficier du taux conventionnel" },
    { icon:'\ud83d\udcca', texte:"Le W-8BEN-E pr\u00e9cise la **cat\u00e9gorie FATCA** de l\u2019entit\u00e9 (IFE participante, NFFE active, passive\u2026) et le taux applicable" },
    { icon:'\u26a0\ufe0f', texte:"Une **NFFE passive** avec des actionnaires am\u00e9ricains significatifs doit le mentionner \u2014 le PSF applique alors un traitement sp\u00e9cifique" },
    { icon:'\ud83d\udd0d', texte:"i-Hub v\u00e9rifie la **coh\u00e9rence** du W-8BEN-E avec le profil de l\u2019entit\u00e9 et signale toute incoh\u00e9rence au PSF" },
  ], aretenir:"Pour les entit\u00e9s, le W-8BEN-E est plus complexe que le W-8BEN individuel. i-Hub v\u00e9rifie la coh\u00e9rence et signale au PSF." },

  { id:13, emoji:'\ud83d\udcce', titre:"Ce que le PSF QI reporte \u00e0 l\u2019IRS", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"Le PSF QI doit reporter \u00e0 l\u2019IRS les **paiements de source am\u00e9ricaine** effectu\u00e9s aux clients finaux et les retenues appliqu\u00e9es" },
    { icon:'\ud83d\udcca', texte:"Formulaires de reporting\u00a0: **Form 1042-S** (paiements \u00e0 des non-US Persons) et **Form 1042** (r\u00e9capitulatif annuel)" },
    { icon:'\ud83d\udeab', texte:"Ce reporting **ne concerne pas i-Hub** \u2014 c\u2019est la responsabilit\u00e9 exclusive du PSF QI vis-\u00e0-vis de l\u2019IRS" },
    { icon:'\ud83d\udd0d', texte:"i-Hub peut \u00eatre sollicit\u00e9 par le PSF pour v\u00e9rifier des **donn\u00e9es d\u2019identification** utilis\u00e9es dans ces reportings si pr\u00e9vu au SLA" },
  ], aretenir:"Form 1042-S = reporting QI du PSF \u00e0 l\u2019IRS. i-Hub ne fait pas ce reporting. Il peut v\u00e9rifier des donn\u00e9es sous-jacentes si le SLA le pr\u00e9voit." },

  { id:14, emoji:'\ud83d\udd12', titre:"Conservation et confidentialit\u00e9 des documents QI", contenu:[
    { icon:'\ud83d\udcc5', texte:"Les formulaires W collect\u00e9s dans le contexte QI doivent \u00eatre conserv\u00e9s **au moins 5 ans** apr\u00e8s la fin de la relation" },
    { icon:'\ud83d\udd12', texte:"Ces documents contiennent des **donn\u00e9es fiscales sensibles** (statut fiscal, TIN, r\u00e9sidence) \u2014 couverts par le RGPD et le secret professionnel" },
    { icon:'\ud83d\udce4', texte:"i-Hub transmet les donn\u00e9es v\u00e9rifi\u00e9es au PSF via des **canaux s\u00e9curis\u00e9s** pr\u00e9vus au SLA \u2014 jamais directement \u00e0 l\u2019IRS" },
    { icon:'\ud83d\udcbb', texte:"i-Hub archive ses propres **rapports de v\u00e9rification** QI pour justifier sa diligence en cas de contr\u00f4le" },
  ], aretenir:"Conserv\u00e9, s\u00e9curis\u00e9, transmis uniquement au PSF. Jamais \u00e0 l\u2019IRS. Les donn\u00e9es QI sont parmi les plus sensibles." },

  { id:15, emoji:'\ud83e\udd14', titre:"QI, FATCA et CRS\u00a0: les liens", contenu:[
    { icon:'\ud83d\udcb0', texte:"**QI** + **FATCA** se basent tous deux sur les formulaires W \u2014 le m\u00eame W-8BEN sert \u00e0 la fois pour la retenue QI et la documentation FATCA" },
    { icon:'\ud83c\udf0d', texte:"**CRS** est ind\u00e9pendant\u00a0: bas\u00e9 sur la r\u00e9sidence fiscale, pas sur les revenus US \u2014 utilise l\u2019autocertification, pas les formulaires W" },
    { icon:'\ud83d\udd04', texte:"Un m\u00eame client final peut \u00eatre concern\u00e9 par les **trois** simultan\u00e9ment \u2014 i-Hub v\u00e9rifie les documents correspondants selon le SLA" },
    { icon:'\ud83d\udccc', texte:"Synth\u00e8se\u00a0: W-9/W-8 = QI + FATCA. Autocertification = CRS. i-Hub v\u00e9rifie les deux types si pr\u00e9vu au SLA." },
  ], aretenir:"QI et FATCA partagent les m\u00eames formulaires W. CRS utilise l\u2019autocertification. i-Hub peut v\u00e9rifier les deux si le SLA le pr\u00e9voit." },

  { id:16, emoji:'\ud83d\udcca', titre:"Taux de retenue\u00a0: tableau synth\u00e8se", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**US Person** (W-9)\u00a0: taux variables selon le type de revenu et la situation fiscale am\u00e9ricaine du client final" },
    { icon:'\ud83c\udf0d', texte:"**Non-US avec convention** (W-8BEN)\u00a0: taux r\u00e9duit conventionnel \u2014 ex\u00a0: 15% dividendes pour r\u00e9sident luxembourgeois" },
    { icon:'\u26a0\ufe0f', texte:"**Non-US sans convention** (W-8BEN)\u00a0: 30% par d\u00e9faut \u2014 ex\u00a0: r\u00e9sident d\u2019un pays sans accord fiscal avec les USA" },
    { icon:'\u274c', texte:"**Sans formulaire valide**\u00a0: 30% par d\u00e9faut obligatoire \u2014 c\u2019est pourquoi la v\u00e9rification des formulaires par i-Hub est essentielle" },
  ], aretenir:"30% = p\u00e9nalit\u00e9 de l\u2019absence de documentation. La v\u00e9rification rigoureuse des formulaires W par i-Hub prot\u00e8ge les clients finaux du PSF." },

  { id:17, emoji:'\ud83d\udc64', titre:"Profils de clients finaux et QI", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**US Person**\u00a0: W-9 requis, retenue selon le droit fiscal am\u00e9ricain, compte FATCA-d\u00e9clarable" },
    { icon:'\ud83c\udf0d', texte:"**Non-US r\u00e9sident dans pays avec convention**\u00a0: W-8BEN requis, taux r\u00e9duit conventionnel applicable" },
    { icon:'\ud83c\udf10', texte:"**Non-US r\u00e9sident dans pays sans convention**\u00a0: W-8BEN requis, taux de 30% appliqu\u00e9 malgr\u00e9 tout" },
    { icon:'\ud83c\udfe2', texte:"**Entit\u00e9 non-US**\u00a0: W-8BEN-E requis, taux selon la cat\u00e9gorie FATCA et la convention applicable" },
  ], aretenir:"Chaque profil de client final appelle un formulaire diff\u00e9rent. i-Hub v\u00e9rifie que le bon formulaire est pr\u00e9sent et coh\u00e9rent avec le profil." },

  { id:18, emoji:'\ud83d\udea8', titre:"Le cas du formulaire manquant", contenu:[
    { icon:'\ud83d\udd34', texte:"Client final d\u00e9tenant des titres US **sans aucun formulaire W** dans le dossier transmis par le PSF" },
    { icon:'\ud83d\udccc', texte:"Action i-Hub\u00a0: **signaler imm\u00e9diatement au PSF** l\u2019absence de formulaire, avec identification du client final concern\u00e9" },
    { icon:'\ud83c\udfe6', texte:"C\u2019est le **PSF** qui contacte son client final pour obtenir le formulaire manquant \u2014 pas i-Hub directement (sauf SLA sp\u00e9cifique)" },
    { icon:'\u26a0\ufe0f', texte:"En attendant\u00a0: le PSF applique **30% par d\u00e9faut** sur les revenus US du client final concern\u00e9" },
  ], aretenir:"Formulaire manquant = signal imm\u00e9diat au PSF. 30% de retenue s\u2019applique jusqu\u2019\u00e0 r\u00e9gularisation. i-Hub documente et transmet." },

  { id:19, emoji:'\ud83d\udcce', titre:"Le processus de v\u00e9rification QI d\u2019i-Hub", contenu:[
    { icon:'1\ufe0f\u20e3', texte:"**Recevoir** le dossier du client final transmis par le PSF QI avec les titres am\u00e9ricains concern\u00e9s" },
    { icon:'2\ufe0f\u20e3', texte:"**V\u00e9rifier** la pr\u00e9sence et la validit\u00e9 du formulaire W \u2014 bon type, non expir\u00e9, coh\u00e9rent avec le profil" },
    { icon:'3\ufe0f\u20e3', texte:"**D\u00e9tecter** tout red flag (formulaire expir\u00e9, indices d\u2019am\u00e9ricanit\u00e9, incoh\u00e9rence de pays)" },
    { icon:'4\ufe0f\u20e3', texte:"**Signaler** au PSF les red flags avec documentation \u2014 le PSF d\u00e9cide du taux et de l\u2019action \u00e0 prendre" },
    { icon:'5\ufe0f\u20e3', texte:"**Archiver** le rapport de v\u00e9rification pour justifier la diligence d\u2019i-Hub" },
  ], aretenir:"Recevoir \u2192 V\u00e9rifier \u2192 D\u00e9tecter \u2192 Signaler \u2192 Archiver. i-Hub ne d\u00e9cide jamais du taux \u2014 c\u2019est toujours le PSF QI." },

  { id:20, emoji:'\ud83c\udf93', titre:"R\u00e9sum\u00e9\u00a0: QI en un coup d\u2019\u0153il", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**QI**\u00a0: statut IRS optionnel pour les PSF \u2014 permet d\u2019appliquer les taux r\u00e9duits conventionnels sur les revenus US des clients finaux" },
    { icon:'\ud83d\udcb0', texte:"**Sans QI ou sans formulaire valide**\u00a0: 30% de retenue par d\u00e9faut sur tous les revenus de source am\u00e9ricaine" },
    { icon:'\ud83d\udcdd', texte:"**Formulaires**\u00a0: W-9 (US Person), W-8BEN (non-US particulier), W-8BEN-E (entit\u00e9 non-US) \u2014 \u00e0 v\u00e9rifier par i-Hub" },
    { icon:'\ud83d\udd0d', texte:"**i-Hub**\u00a0: v\u00e9rifie les formulaires sur instruction du PSF QI, dans le cadre du SLA. Signale les red flags. Ne d\u00e9cide jamais du taux." },
  ], aretenir:"QI = outil fiscal du PSF. i-Hub = v\u00e9rificateur de formulaires sur instruction. PSF = responsable du taux appliqu\u00e9 et du reporting IRS." },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:"What is QI?", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**QI** = Qualified Intermediary \u2014 status granted by the **US IRS** to foreign financial institutions" },
    { icon:'\ud83d\udcb0', texte:"It concerns **US-source income** (dividends and interest on US securities) received by PSFs\u2019 final clients" },
    { icon:'\ud83c\udfe6', texte:"The **PSF** signs a QI agreement with the IRS \u2014 committing to identify its final clients and apply the correct withholding rate" },
    { icon:'\ud83d\udd0d', texte:"i-Hub acts **on the QI PSF\u2019s instruction** to verify W forms of final clients within the SLA scope" },
  ], aretenir:"QI = management of US tax withholding on US income. It is the PSF that holds QI status. i-Hub verifies on instruction." },
  { id:2, emoji:'\ud83d\udcb0', titre:"US withholding tax", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"All **US-source income** (Apple dividend, US Treasury interest) is subject to **withholding tax** paid to the IRS" },
    { icon:'\u26a0\ufe0f', texte:"Default rate without QI: **30%** \u2014 automatically applied if the beneficiary\u2019s identity is not documented" },
    { icon:'\u2b07\ufe0f', texte:"With QI status and proper documentation: reduced rate per the **tax treaty** between the final client\u2019s country and the US (often 0%, 5% or 15%)" },
    { icon:'\ud83c\udde7\ud83c\uddea', texte:"Example: US-Luxembourg treaty \u2192 US dividends taxed at **15%** for Luxembourg residents instead of 30%" },
  ], aretenir:"Without QI or proper documentation: 30% withholding. With QI and correct forms: reduced treaty rate. The financial stakes are significant." },
  { id:3, emoji:'\ud83c\udf1f', titre:"Why PSFs request QI status", contenu:[
    { icon:'\ud83d\udcbc', texte:"PSFs\u2019 final clients often hold **US equity portfolios** (Apple, Amazon, Microsoft\u2026)" },
    { icon:'\ud83d\udcb8', texte:"Without QI status, the PSF applies 30% withholding on all US dividends \u2014 **heavily penalising** final clients" },
    { icon:'\u2705', texte:"With QI status, the PSF can apply **reduced treaty rates** by correctly identifying its final clients" },
    { icon:'\ud83d\udcdc', texte:"In return: the QI PSF commits to **strict obligations** of identification, documentation and reporting to the IRS" },
  ], aretenir:"QI status primarily benefits PSFs\u2019 final clients. It is a tax benefit conditional on rigorous documentation." },
  { id:4, emoji:'\ud83d\udcdd', titre:"W forms in the QI context", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**W-9**: completed by **US Person** final client \u2014 allows the QI PSF to apply the applicable US rate" },
    { icon:'\ud83d\udcdd', texte:"**W-8BEN**: completed by **non-US individual** final client \u2014 allows application of the treaty rate for their country of residence" },
    { icon:'\ud83c\udfe2', texte:"**W-8BEN-E**: completed by a **non-US entity** \u2014 specifies category (FFI, NFFE) and applicable rate" },
    { icon:'\ud83d\udd0d', texte:"**i-Hub\u2019s role**: verify that the correct form is present and consistent for each final client holding US securities \u2014 if in SLA scope" },
  ], aretenir:"The W form determines the applicable withholding rate. Without a valid form: 30% by default. i-Hub verifies their presence and consistency." },
  { id:5, emoji:'\ud83c\udf0d', titre:"QI vs FATCA: two distinct US frameworks", contenu:[
    { icon:'\ud83d\udcb0', texte:"**QI**: concerns **income** of US origin \u2014 what withholding rate to apply on US dividends and interest?" },
    { icon:'\ud83d\udc64', texte:"**FATCA**: concerns **accounts** of US Persons \u2014 which accounts to report to the IRS?" },
    { icon:'\ud83d\udd04', texte:"Both can apply **simultaneously**: a US Person final client holding Apple shares \u2192 FATCA (account to report) AND QI (withholding on dividends)" },
    { icon:'\ud83d\udcdd', texte:"For i-Hub: W forms serve **both frameworks** \u2014 the same W-9 or W-8BEN covers both FATCA and QI" },
  ], aretenir:"QI = withholding on US income. FATCA = reporting of US accounts. Same W form, two different uses. i-Hub verifies both." },
  { id:6, emoji:'\ud83d\udcca', titre:"Withholding rates by treaty", contenu:[
    { icon:'0%', texte:"**0%**: US bond interest for non-US Persons in certain cases \u2014 valid W-8BEN required" },
    { icon:'15%', texte:"**15%**: US dividends for residents of countries with a tax treaty with the US (e.g. Luxembourg, France, Germany)" },
    { icon:'30%', texte:"**30%**: default rate applied if no valid form or if the final client\u2019s country has no treaty with the US" },
    { icon:'\ud83d\udd0d', texte:"i-Hub verifies that the form provided by the final client matches their situation \u2014 the PSF then applies the correct rate" },
  ], aretenir:"Withholding rate depends on the form and the treaty. i-Hub verifies the documents. The QI PSF applies the rate." },
  { id:7, emoji:'\ud83c\udfe6', titre:"Who holds QI status: the PSF, not i-Hub", contenu:[
    { icon:'\ud83c\udfe6', texte:"It is the **PSF** (bank, fund, insurer) that signs the QI agreement with the IRS \u2014 and becomes responsible for its application" },
    { icon:'\ud83d\udeab', texte:"**i-Hub does not hold QI status** \u2014 i-Hub is a support PSF subcontractor, not a declaring financial institution" },
    { icon:'\ud83d\udcdc', texte:"The QI PSF assumes the obligations: identify final clients, apply correct rates, report to the IRS" },
    { icon:'\ud83d\udd0d', texte:"i-Hub acts **on the QI PSF\u2019s instruction** within the SLA \u2014 solely for documentary verification" },
  ], aretenir:"PSF = QI status holder and responsible party. i-Hub = subcontractor that verifies forms on PSF instruction, within the SLA." },
  { id:8, emoji:'\ud83d\udea8', titre:"QI red flags to flag to the PSF", contenu:[
    { icon:'\ud83d\udd34', texte:"**Expired W-8BEN**: form over 3 years old without renewal for a final client holding US securities" },
    { icon:'\ud83d\udd34', texte:"**Country inconsistency**: country of residence on W-8BEN does not match other documents in the file" },
    { icon:'\ud83d\udd34', texte:"**US indicia**: US address or US birthplace in the file while the final client provided a W-8BEN (non-US)" },
    { icon:'\ud83d\udd34', texte:"**Missing form**: final client holding US securities with no W form in the file" },
  ], aretenir:"Every QI red flag is flagged to the PSF. i-Hub does not decide the applicable rate \u2014 that is the exclusive responsibility of the QI PSF." },
  { id:9, emoji:'\ud83d\udcc5', titre:"Validity of W forms", contenu:[
    { icon:'\ud83d\udcdd', texte:"**W-8BEN**: valid for **3 years** from the date of signature \u2014 expiry to monitor" },
    { icon:'\ud83d\udcbc', texte:"**W-8BEN-E**: also valid for **3 years** \u2014 but any change in the entity\u2019s situation requires immediate renewal" },
    { icon:'\ud83d\udd04', texte:"**W-9**: no official expiry date \u2014 but to be renewed if status changes (loss of US nationality\u2026)" },
    { icon:'\ud83d\uded1', texte:"An expired form = default **30% withholding** applied by the PSF \u2014 direct financial harm to the final client" },
  ], aretenir:"W-8BEN and W-8BEN-E expire after 3 years. An expired form detected by i-Hub is flagged immediately to the PSF." },
  { id:10, emoji:'\ud83c\udf1f', titre:"Change of circumstances and QI", contenu:[
    { icon:'\ud83d\udc64', texte:"If the final client **changes country of residence**, their W-8BEN is no longer valid \u2014 the treaty rate changes" },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"If the final client **acquires US nationality**, the W-8BEN becomes invalid \u2014 a W-9 must be provided" },
    { icon:'\ud83d\udea8', texte:"The final client must notify their PSF of any change \u2014 the PSF then requests a new form" },
    { icon:'\ud83d\udd0d', texte:"i-Hub may detect an indicator of change during verification and **flags it to the PSF** which makes the decision" },
  ], aretenir:"Any change in the final client\u2019s situation may change the applicable withholding rate. i-Hub flags indicators to the PSF." },
  { id:11, emoji:'\ud83c\udde7\ud83c\uddea', titre:"The US-Luxembourg tax treaty", contenu:[
    { icon:'\ud83c\udde7\ud83c\uddea', texte:"Luxembourg has signed a **tax treaty** with the US that reduces withholding rates for Luxembourg residents" },
    { icon:'\ud83d\udcca', texte:"US dividends: **15%** (instead of 30%) for Luxembourg residents with a valid W-8BEN" },
    { icon:'\ud83d\udcca', texte:"US interest: **0%** for most Luxembourg residents with a valid W-8BEN" },
    { icon:'\ud83d\udd0d', texte:"To benefit from these reduced rates: the final client must provide a **valid W-8BEN** stating Luxembourg as country of residence" },
  ], aretenir:"LU-US treaty: 15% on dividends, 0% on interest. Condition: valid W-8BEN with Luxembourg residency." },
  { id:12, emoji:'\ud83c\udfe2', titre:"Entity case: W-8BEN-E and QI", contenu:[
    { icon:'\ud83c\udfe2', texte:"A **non-US entity** holding US securities must provide a **W-8BEN-E** to benefit from the treaty rate" },
    { icon:'\ud83d\udcca', texte:"The W-8BEN-E specifies the entity\u2019s **FATCA category** (participating FFI, active NFFE, passive\u2026) and the applicable rate" },
    { icon:'\u26a0\ufe0f', texte:"A **passive NFFE** with significant US shareholders must disclose them \u2014 the PSF then applies specific treatment" },
    { icon:'\ud83d\udd0d', texte:"i-Hub verifies the **consistency** of the W-8BEN-E with the entity\u2019s profile and flags any inconsistency to the PSF" },
  ], aretenir:"For entities, W-8BEN-E is more complex than individual W-8BEN. i-Hub verifies consistency and flags to PSF." },
  { id:13, emoji:'\ud83d\udcce', titre:"What the QI PSF reports to the IRS", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"The QI PSF must report to the IRS the **US-source payments** made to final clients and the withholding applied" },
    { icon:'\ud83d\udcca', texte:"Reporting forms: **Form 1042-S** (payments to non-US Persons) and **Form 1042** (annual summary)" },
    { icon:'\ud83d\udeab', texte:"This reporting **does not concern i-Hub** \u2014 it is the exclusive responsibility of the QI PSF vis-\u00e0-vis the IRS" },
    { icon:'\ud83d\udd0d', texte:"i-Hub may be asked by the PSF to verify **identification data** used in these reports if specified in the SLA" },
  ], aretenir:"Form 1042-S = QI PSF reporting to IRS. i-Hub does not do this reporting. It may verify underlying data if the SLA provides for it." },
  { id:14, emoji:'\ud83d\udd12', titre:"Retention and confidentiality of QI documents", contenu:[
    { icon:'\ud83d\udcc5', texte:"W forms collected in the QI context must be retained for **at least 5 years** after end of relationship" },
    { icon:'\ud83d\udd12', texte:"These documents contain **sensitive tax data** (tax status, TIN, residency) \u2014 covered by GDPR and professional secrecy" },
    { icon:'\ud83d\udce4', texte:"i-Hub transmits verified data to the PSF via **secure channels** per the SLA \u2014 never directly to the IRS" },
    { icon:'\ud83d\udcbb', texte:"i-Hub archives its own **QI verification reports** to justify its diligence in case of audit" },
  ], aretenir:"Retained, secured, transmitted to PSF only. Never to IRS. QI data is among the most sensitive." },
  { id:15, emoji:'\ud83e\udd14', titre:"QI, FATCA and CRS: the links", contenu:[
    { icon:'\ud83d\udcb0', texte:"**QI** + **FATCA** both use W forms \u2014 the same W-8BEN serves both QI withholding and FATCA documentation" },
    { icon:'\ud83c\udf0d', texte:"**CRS** is independent: based on tax residency, not US income \u2014 uses self-certification, not W forms" },
    { icon:'\ud83d\udd04', texte:"The same final client may be subject to all **three** simultaneously \u2014 i-Hub verifies the corresponding documents per SLA" },
    { icon:'\ud83d\udccc', texte:"Summary: W-9/W-8 = QI + FATCA. Self-certification = CRS. i-Hub verifies both types if in SLA scope." },
  ], aretenir:"QI and FATCA share W forms. CRS uses self-certification. i-Hub may verify both types if the SLA provides for it." },
  { id:16, emoji:'\ud83d\udcca', titre:"Withholding rates: summary table", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**US Person** (W-9): varying rates depending on the type of income and the final client\u2019s US tax situation" },
    { icon:'\ud83c\udf0d', texte:"**Non-US with treaty** (W-8BEN): reduced treaty rate \u2014 e.g. 15% dividends for Luxembourg resident" },
    { icon:'\u26a0\ufe0f', texte:"**Non-US without treaty** (W-8BEN): 30% by default \u2014 e.g. resident of a country with no US tax agreement" },
    { icon:'\u274c', texte:"**Without valid form**: 30% by default mandatory \u2014 this is why i-Hub\u2019s form verification is essential" },
  ], aretenir:"30% = penalty for lack of documentation. i-Hub\u2019s rigorous W form verification protects the PSF\u2019s final clients." },
  { id:17, emoji:'\ud83d\udc64', titre:"Final client profiles and QI", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**US Person**: W-9 required, withholding per US tax law, FATCA-reportable account" },
    { icon:'\ud83c\udf0d', texte:"**Non-US in treaty country**: W-8BEN required, applicable reduced treaty rate" },
    { icon:'\ud83c\udf10', texte:"**Non-US in non-treaty country**: W-8BEN required, 30% rate applied regardless" },
    { icon:'\ud83c\udfe2', texte:"**Non-US entity**: W-8BEN-E required, rate per FATCA category and applicable treaty" },
  ], aretenir:"Each final client profile requires a different form. i-Hub verifies that the correct form is present and consistent with the profile." },
  { id:18, emoji:'\ud83d\udea8', titre:"The missing form case", contenu:[
    { icon:'\ud83d\udd34', texte:"Final client holding US securities with **no W form at all** in the file transmitted by the PSF" },
    { icon:'\ud83d\udccc', texte:"i-Hub action: **flag immediately to the PSF** the missing form, identifying the final client concerned" },
    { icon:'\ud83c\udfe6', texte:"It is the **PSF** that contacts its final client to obtain the missing form \u2014 not i-Hub directly (unless specified in SLA)" },
    { icon:'\u26a0\ufe0f', texte:"In the meantime: the PSF applies **30% by default** on the US income of the final client concerned" },
  ], aretenir:"Missing form = immediate flag to PSF. 30% withholding applies until rectification. i-Hub documents and transmits." },
  { id:19, emoji:'\ud83d\udcce', titre:"i-Hub\u2019s QI verification process", contenu:[
    { icon:'1\ufe0f\u20e3', texte:"**Receive** the final client\u2019s file transmitted by the QI PSF with the relevant US securities" },
    { icon:'2\ufe0f\u20e3', texte:"**Verify** the presence and validity of the W form \u2014 correct type, not expired, consistent with profile" },
    { icon:'3\ufe0f\u20e3', texte:"**Detect** any red flag (expired form, US indicia, country inconsistency)" },
    { icon:'4\ufe0f\u20e3', texte:"**Flag** red flags to the PSF with documentation \u2014 the PSF decides on the rate and action" },
    { icon:'5\ufe0f\u20e3', texte:"**Archive** the verification report to justify i-Hub\u2019s diligence" },
  ], aretenir:"Receive \u2192 Verify \u2192 Detect \u2192 Flag \u2192 Archive. i-Hub never decides the rate \u2014 always the QI PSF." },
  { id:20, emoji:'\ud83c\udf93', titre:"Summary: QI at a glance", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**QI**: optional IRS status for PSFs \u2014 allows application of reduced treaty rates on US income of final clients" },
    { icon:'\ud83d\udcb0', texte:"**Without QI or valid form**: 30% default withholding on all US-source income" },
    { icon:'\ud83d\udcdd', texte:"**Forms**: W-9 (US Person), W-8BEN (non-US individual), W-8BEN-E (non-US entity) \u2014 to be verified by i-Hub" },
    { icon:'\ud83d\udd0d', texte:"**i-Hub**: verifies forms on QI PSF instruction, within SLA. Flags red flags. Never decides the rate." },
  ], aretenir:"QI = PSF\u2019s tax tool. i-Hub = form verifier on instruction. PSF = responsible for the applied rate and IRS reporting." },
]

const VF_FR = [
  { texte:"i-Hub poss\u00e8de le statut QI et peut appliquer les taux r\u00e9duits directement", reponse:false, explication:"Non\u00a0! C\u2019est le PSF qui a le statut QI. i-Hub est sous-traitant et v\u00e9rifie les formulaires sur instruction du PSF." },
  { texte:"Sans formulaire W valide, le PSF applique 30% de retenue par d\u00e9faut", reponse:true, explication:"Exact\u00a0! 30% est le taux par d\u00e9faut en l\u2019absence de documentation valide. C\u2019est l\u2019enjeu de la v\u00e9rification des formulaires." },
  { texte:"Le W-8BEN est valable ind\u00e9finiment", reponse:false, explication:"Non\u00a0! Le W-8BEN expire apr\u00e8s 3 ans. Un formulaire expir\u00e9 d\u00e9tect\u00e9 par i-Hub doit \u00eatre signal\u00e9 imm\u00e9diatement au PSF." },
  { texte:"QI et FATCA utilisent les m\u00eames formulaires W", reponse:true, explication:"Exact\u00a0! Le m\u00eame W-8BEN sert \u00e0 la fois pour la retenue QI et la documentation FATCA." },
  { texte:"La convention USA-Luxembourg r\u00e9duit les dividendes am\u00e9ricains \u00e0 15% pour les r\u00e9sidents luxembourgeois", reponse:true, explication:"Exact\u00a0! Au lieu des 30% par d\u00e9faut, un r\u00e9sident luxembourgeois avec W-8BEN valide ne paie que 15% sur les dividendes US." },
  { texte:"i-Hub d\u00e9cide du taux de retenue \u00e0 appliquer quand il d\u00e9tecte un formulaire expir\u00e9", reponse:false, explication:"Non\u00a0! i-Hub signale le formulaire expir\u00e9 au PSF. C\u2019est le PSF QI qui d\u00e9cide du taux et de l\u2019action \u00e0 prendre." },
  { texte:"Un client final US Person doit fournir un W-9, pas un W-8BEN", reponse:true, explication:"Exact\u00a0! Le W-9 est pour les US Persons. Le W-8BEN est pour les non-US Persons." },
  { texte:"i-Hub reporte directement \u00e0 l\u2019IRS les paiements de source am\u00e9ricaine", reponse:false, explication:"Non\u00a0! C\u2019est le PSF QI qui reporte \u00e0 l\u2019IRS via le Form 1042-S. i-Hub n\u2019est jamais en contact avec l\u2019IRS." },
  { texte:"Un client final peut \u00eatre soumis \u00e0 QI, FATCA et CRS simultan\u00e9ment", reponse:true, explication:"Exact\u00a0! Un US Person d\u00e9tenant des actions am\u00e9ricaines et r\u00e9sident en France est concern\u00e9 par les trois dispositifs." },
  { texte:"Le W-8BEN-E est utilis\u00e9 pour les particuliers non-am\u00e9ricains", reponse:false, explication:"Non\u00a0! Le W-8BEN-E est pour les entit\u00e9s (soci\u00e9t\u00e9s, fonds\u2026). Le W-8BEN est pour les particuliers." },
]
const VF_EN = [
  { texte:"i-Hub holds QI status and can apply reduced rates directly", reponse:false, explication:"No! It is the PSF that holds QI status. i-Hub is a subcontractor and verifies forms on the PSF\u2019s instruction." },
  { texte:"Without a valid W form, the PSF applies 30% withholding by default", reponse:true, explication:"Correct! 30% is the default rate in the absence of valid documentation. This is why form verification matters." },
  { texte:"The W-8BEN is valid indefinitely", reponse:false, explication:"No! The W-8BEN expires after 3 years. An expired form detected by i-Hub must be flagged immediately to the PSF." },
  { texte:"QI and FATCA use the same W forms", reponse:true, explication:"Correct! The same W-8BEN serves both QI withholding and FATCA documentation purposes." },
  { texte:"The US-Luxembourg treaty reduces US dividends to 15% for Luxembourg residents", reponse:true, explication:"Correct! Instead of the default 30%, a Luxembourg resident with a valid W-8BEN pays only 15% on US dividends." },
  { texte:"i-Hub decides the withholding rate to apply when it detects an expired form", reponse:false, explication:"No! i-Hub flags the expired form to the PSF. It is the QI PSF that decides on the rate and action to take." },
  { texte:"A US Person final client must provide a W-9, not a W-8BEN", reponse:true, explication:"Correct! W-9 is for US Persons. W-8BEN is for non-US Persons." },
  { texte:"i-Hub reports US-source payments directly to the IRS", reponse:false, explication:"No! It is the QI PSF that reports to the IRS via Form 1042-S. i-Hub is never in contact with the IRS." },
  { texte:"A final client can be subject to QI, FATCA and CRS simultaneously", reponse:true, explication:"Correct! A US Person holding US shares and resident in France is concerned by all three frameworks." },
  { texte:"The W-8BEN-E is used for non-US individuals", reponse:false, explication:"No! W-8BEN-E is for entities (companies, funds\u2026). W-8BEN is for individuals." },
]

const TAUX_FR = [
  { profil:"Client final r\u00e9sident au Luxembourg, non-am\u00e9ricain, d\u00e9tient des actions Apple", taux:"15%", explication:"Convention USA-Luxembourg\u00a0: 15% sur les dividendes am\u00e9ricains pour les r\u00e9sidents luxembourgeois avec W-8BEN valide." },
  { profil:"Client final am\u00e9ricain (US Person), d\u00e9tient des obligations du Tr\u00e9sor am\u00e9ricain", taux:"Variable (taux US)", explication:"US Person = W-9. Le taux d\u00e9pend de la situation fiscale am\u00e9ricaine du client final \u2014 appliqu\u00e9 par le PSF." },
  { profil:"Client final r\u00e9sident au Br\u00e9sil (pas de convention fiscale avec les USA)", taux:"30%", explication:"Pas de convention USA-Br\u00e9sil. Malgr\u00e9 un W-8BEN valide, le taux de 30% s\u2019applique par d\u00e9faut." },
  { profil:"Client final r\u00e9sident en France, d\u00e9tient des int\u00e9r\u00eats sur obligations am\u00e9ricaines", taux:"0%", explication:"Convention USA-France\u00a0: int\u00e9r\u00eats am\u00e9ricains \u00e0 0% pour les r\u00e9sidents fran\u00e7ais avec W-8BEN valide." },
  { profil:"Client final sans aucun formulaire W dans le dossier", taux:"30% (d\u00e9faut)", explication:"Absence de formulaire = 30% obligatoire. i-Hub signale l\u2019anomalie au PSF qui doit obtenir le formulaire." },
]
const TAUX_EN = [
  { profil:"Luxembourg resident final client, non-US, holds Apple shares", taux:"15%", explication:"US-Luxembourg treaty: 15% on US dividends for Luxembourg residents with valid W-8BEN." },
  { profil:"US Person final client, holds US Treasury bonds", taux:"Variable (US rate)", explication:"US Person = W-9. Rate depends on the final client\u2019s US tax situation \u2014 applied by the PSF." },
  { profil:"Final client resident in Brazil (no tax treaty with the US)", taux:"30%", explication:"No US-Brazil treaty. Despite a valid W-8BEN, the 30% default rate applies." },
  { profil:"French resident final client, holds interest on US bonds", taux:"0%", explication:"US-France treaty: 0% on US interest for French residents with valid W-8BEN." },
  { profil:"Final client with no W form at all in the file", taux:"30% (default)", explication:"No form = mandatory 30%. i-Hub flags the anomaly to the PSF which must obtain the form." },
]

const CAS_FR = [
  { situation:"Un PSF QI transmet le dossier d\u2019un client final luxembourgeois d\u00e9tenant des actions Microsoft. Le W-8BEN date de 2021.", action:"Signaler au PSF\u00a0: W-8BEN expir\u00e9 (plus de 3 ans) \u2014 risque de passage \u00e0 30%", options:["Accepter \u2014 le formulaire est pr\u00e9sent","Signaler au PSF\u00a0: W-8BEN expir\u00e9 (plus de 3 ans) \u2014 risque de passage \u00e0 30%","Appliquer 30% directement","Demander un nouveau formulaire au client final"], explication:"W-8BEN sign\u00e9 en 2021 = expir\u00e9 depuis 2024. i-Hub le signale au PSF. C\u2019est le PSF qui contacte son client final pour renouveler." },
  { situation:"Un PSF transmet le dossier d\u2019une entit\u00e9 luxembourgeoise NFFE passive avec un actionnaire am\u00e9ricain d\u00e9tenant 15% du capital.", action:"Signaler au PSF\u00a0: NFFE passive avec actionnaire US \u2014 v\u00e9rifier le W-8BEN-E et les obligations FATCA", options:["Accepter le dossier \u2014 15% < 25%","Signaler au PSF\u00a0: NFFE passive avec actionnaire US \u2014 v\u00e9rifier le W-8BEN-E et les obligations FATCA","D\u00e9clarer l\u2019actionnaire am\u00e9ricain directement","Refuser le dossier"], explication:"15% > 10% (seuil FATCA pour NFFE passive). i-Hub signale au PSF qui v\u00e9rifiera les obligations FATCA et le W-8BEN-E." },
  { situation:"Un client final allemand d\u00e9tenant des actions Apple fournit un W-8BEN mentionnant la r\u00e9sidence en Suisse. Son passeport indique une adresse \u00e0 Munich.", action:"Signaler l\u2019incoh\u00e9rence au PSF\u00a0: r\u00e9sidence W-8BEN \u2260 adresse passeport", options:["Accepter \u2014 le client a sign\u00e9","Signaler l\u2019incoh\u00e9rence au PSF\u00a0: r\u00e9sidence W-8BEN \u2260 adresse passeport","Appliquer le taux allemand","Demander un nouveau formulaire"], explication:"Adresse Munich (Allemagne) vs r\u00e9sidence Suisse sur W-8BEN = incoh\u00e9rence documentaire \u00e0 signaler imm\u00e9diatement au PSF." },
]
const CAS_EN = [
  { situation:"A QI PSF transmits the file of a Luxembourg final client holding Microsoft shares. The W-8BEN dates from 2021.", action:"Flag to PSF: expired W-8BEN (over 3 years) \u2014 risk of reverting to 30%", options:["Accept \u2014 the form is present","Flag to PSF: expired W-8BEN (over 3 years) \u2014 risk of reverting to 30%","Apply 30% directly","Request a new form from the final client"], explication:"W-8BEN signed in 2021 = expired since 2024. i-Hub flags to the PSF. The PSF contacts its final client to renew." },
  { situation:"A PSF transmits the file of a Luxembourg passive NFFE entity with a US shareholder holding 15% of the capital.", action:"Flag to PSF: passive NFFE with US shareholder \u2014 verify W-8BEN-E and FATCA obligations", options:["Accept the file \u2014 15% < 25%","Flag to PSF: passive NFFE with US shareholder \u2014 verify W-8BEN-E and FATCA obligations","Report the US shareholder directly","Reject the file"], explication:"15% > 10% (FATCA threshold for passive NFFEs). i-Hub flags to PSF which will verify FATCA obligations and W-8BEN-E." },
  { situation:"A German final client holding Apple shares provides a W-8BEN stating Swiss residency. Their passport shows a Munich address.", action:"Flag inconsistency to PSF: W-8BEN residency \u2260 passport address", options:["Accept \u2014 the client signed","Flag inconsistency to PSF: W-8BEN residency \u2260 passport address","Apply the German rate","Request a new form"], explication:"Munich address (Germany) vs Swiss residency on W-8BEN = documentary inconsistency to flag immediately to the PSF." },
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
      <button onClick={()=>router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>\ud83d\udcb0 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l=><button key={l} onClick={()=>switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'\ud83c\uddeb\ud83c\uddf7 FR':'\ud83c\uddec\ud83c\udde7 EN'}</button>)}
        </div>
        <span style={{background:'white',border:\`1px solid \${C}\`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>\u2b50 {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>\ud83d\udcb0</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=><div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>\u2713</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'\ud83d\udcd6'},{label:t.quiz,icon:'\ud83c\udfae'},{label:t.time,icon:'\u23f1\ufe0f'}].map((b,i)=><div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase==='fiches') {
    const fiche=FICHES[ficheIndex]; const progress=((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${progress}%\`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1}/{FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i)=><div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:\`2px solid \${C}30\`,boxShadow:\`0 8px 40px \${C}15\`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                </div>
              ))}
              <div style={{background:\`\${C}10\`,border:\`1px solid \${C}30\`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px'}}>
                <span>\ud83d\udca1</span>
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
              {ficheIndex<FICHES.length-1?\`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) \u2192\`:t.quizBtn}
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
          <div style={{background:C,height:'6px',width:\`\${(vfIndex/activeVF.length)*100}%\`}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q1label} \u2014 {vfIndex+1}/{activeVF.length}</span>
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
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'\ud83c\udf89':'\ud83d\ude05'}</p>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(tauxIndex/activeTaux.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q2label} \u2014 {tauxIndex+1}/{activeTaux.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q2title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q2sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:\`2px solid \${C}30\`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>\ud83d\udc64 {cas.profil}</p>
          </div>
          {!tauxRevealed?(
            <button onClick={()=>setTauxRevealed(true)} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
              {lang==='fr'?'\ud83d\udd0d Voir le taux applicable':'\ud83d\udd0d See applicable rate'}
            </button>
          ):(
            <div>
              <div style={{background:\`\${C}10\`,border:\`2px solid \${C}40\`,borderRadius:'12px',padding:'24px',marginBottom:'16px',textAlign:'center'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{lang==='fr'?'Taux applicable':'Applicable rate'}</p>
                <p style={{margin:'0 0 12px',fontSize:'36px',fontWeight:'800',color:'#1f2937'}}>{cas.taux}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>\ud83d\udca1 {cas.explication}</p>
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',fontSize:'13px',color:'#059669',fontWeight:'600'}}>
                {lang==='fr'?'\u2139\ufe0f i-Hub v\u00e9rifie le formulaire W. Le PSF QI applique le taux.':'\u2139\ufe0f i-Hub verifies the W form. The QI PSF applies the rate.'}
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(casIndex/activeCas.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} \u2014 {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:\`2px solid \${C}30\`,marginBottom:'16px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>\ud83d\udccb {cas.situation}</p>
          </div>
          {casRepondu===null?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i)=>(
                <button key={i} onClick={()=>repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left',transition:'all 0.15s'}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=\`\${C}08\`}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ):(
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>
                {cas.options.map((opt,i)=>{const isC=opt===cas.action,isCh=opt===casRepondu;return(
                  <div key={i} style={{padding:'12px 16px',background:isC?'#d1fae5':isCh?'#fee2e2':'white',border:\`1.5px solid \${isC?'#6ee7b7':isCh?'#fca5a5':'#e5e7eb'}\`,borderRadius:'10px',fontSize:'14px',fontWeight:'600',color:isC?'#059669':isCh?'#ef4444':'#9ca3af'}}>
                    {isC?'\u2705 ':isCh?'\u274c ':''}{opt}
                  </div>
                )})}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'12px',padding:'14px',marginBottom:'14px'}}>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>\ud83d\udca1 {cas.explication}</p>
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

  const total=Math.min(100,score),medal=total>=80?'\ud83e\udd47':total>=50?'\ud83e\udd48':'\ud83e\udd49',msg=total>=80?t.medal_gold:total>=50?t.medal_silver:t.medal_bronze
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
            <div style={{background:\`linear-gradient(90deg,\${C},#f59e0b)\`,height:'10px',width:\`\${total}%\`,borderRadius:'8px'}}/>
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
`, 'utf8');
console.log('✅ QI module écrit !');
