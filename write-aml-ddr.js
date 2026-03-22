const fs = require('fs');
const PINK = '#e91e8c';

fs.mkdirSync('app/modules/aml-ddr', { recursive: true });
fs.writeFileSync('app/modules/aml-ddr/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${PINK}'

const UI = {
  fr: {
    title: 'DDR \u2014 Due Diligence Renforc\u00e9e',
    subtitle: 'Quand les contr\u00f4les standards ne suffisent pas \u2014 le r\u00f4le d\u2019i-Hub face aux dossiers \u00e0 risque \u00e9lev\u00e9',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Ce qui d\u00e9clenche une Due Diligence Renforc\u00e9e (DDR)',
      'Les diff\u00e9rences entre vigilance standard et renforc\u00e9e',
      'Les documents suppl\u00e9mentaires requis en DDR',
      'Le r\u00f4le d\u2019i-Hub dans les dossiers DDR',
      'PPE, pays \u00e0 risque, structures complexes\u00a0: comment v\u00e9rifier',
      'Ce que i-Hub ne d\u00e9cide jamais seul',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 DDR OU PAS\u00a0?', q1title: '\ud83d\udd34 Ce profil d\u00e9clenche-t-il une DDR\u00a0?',
    ddr: '\ud83d\udd34 DDR requise', std: '\ud83d\udfe2 Vigilance standard',
    q2label: 'QUIZ 2/3 \u00b7 VRAI OU FAUX', q2title: '\u2705 Vrai ou Faux \u2014 DDR en pratique',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q3label: 'QUIZ 3/3 \u00b7 CAS DDR', q3title: '\ud83e\udd14 Quelle est la bonne action\u00a0?',
    resultTitle: 'Module DDR termin\u00e9 \u2014 Vous g\u00e9rez les dossiers complexes\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    medal_gold: 'Expert DDR\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Terminer \u2192',
  },
  en: {
    title: 'EDD \u2014 Enhanced Due Diligence',
    subtitle: 'When standard controls are not enough \u2014 i-Hub\u2019s role with high-risk files',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'What triggers Enhanced Due Diligence (EDD)',
      'Differences between standard and enhanced vigilance',
      'Additional documents required in EDD',
      'i-Hub\u2019s role in EDD files',
      'PEPs, high-risk countries, complex structures: how to verify',
      'What i-Hub never decides alone',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 EDD OR NOT?', q1title: '\ud83d\udd34 Does this profile trigger EDD?',
    ddr: '\ud83d\udd34 EDD required', std: '\ud83d\udfe2 Standard vigilance',
    q2label: 'QUIZ 2/3 \u00b7 TRUE OR FALSE', q2title: '\u2705 True or False \u2014 EDD in practice',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q3label: 'QUIZ 3/3 \u00b7 EDD CASES', q3title: '\ud83e\udd14 What is the correct action?',
    resultTitle: 'EDD module complete \u2014 You handle complex files!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    medal_gold: 'EDD Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Finish \u2192',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udd34', titre:'C\u2019est quoi la DDR\u00a0?', contenu:[
    { icon:'\ud83d\udd34', texte:'La **Due Diligence Renforc\u00e9e** (DDR) est un niveau de contr\u00f4le plus approfondi que la vigilance standard, appliqu\u00e9 aux clients \u00e0 risque \u00e9lev\u00e9' },
    { icon:'\ud83d\udcdc', texte:'Impos\u00e9e par la **loi luxembourgeoise de 2004** et les directives europ\u00e9ennes AML \u2014 pas optionnelle pour les cas concern\u00e9s' },
    { icon:'\ud83c\udfe6', texte:'C\u2019est le **PSF** qui d\u00e9cide de l\u2019appliquer selon sa politique de risque \u2014 i-Hub intervient pour v\u00e9rifier les documents suppl\u00e9mentaires si le SLA le pr\u00e9voit' },
    { icon:'\ud83d\udd0d', texte:'DDR = plus de documents \u00e0 collecter par le PSF + v\u00e9rifications plus approfondies par i-Hub dans le cadre du SLA' },
  ], aretenir:'DDR = contr\u00f4les renforc\u00e9s pour les profils \u00e0 risque \u00e9lev\u00e9. Obligatoire dans certains cas. D\u00e9cid\u00e9e par le PSF, v\u00e9rifi\u00e9e par i-Hub sur instruction.' },

  { id:2, emoji:'\ud83d\udd04', titre:'Standard vs Renforc\u00e9e\u00a0: les diff\u00e9rences', contenu:[
    { icon:'\ud83d\udfe2', texte:'**Vigilance standard**\u00a0: identit\u00e9 + domicile + activit\u00e9 professionnelle + source des fonds de base' },
    { icon:'\ud83d\udd34', texte:'**DDR**\u00a0: idem + source des fonds d\u00e9taill\u00e9e (SOF) + source du patrimoine (SOW) + informations sur les b\u00e9n\u00e9ficiaires effectifs (UBO) + surveillance accrue' },
    { icon:'\ud83d\udcc5', texte:'**Fr\u00e9quence de r\u00e9vision**\u00a0: standard = p\u00e9riodique. DDR = plus fr\u00e9quente, d\u00e9finie par le PSF selon le profil de risque' },
    { icon:'\ud83d\udcbb', texte:'**Approbation hi\u00e9rarchique**\u00a0: l\u2019entr\u00e9e en relation DDR n\u00e9cessite souvent l\u2019approbation d\u2019un responsable Compliance au sein du PSF' },
  ], aretenir:'DDR = vigilance standard + plus de documents + SOF/SOW d\u00e9taill\u00e9s + r\u00e9vision plus fr\u00e9quente. Le PSF d\u00e9cide, i-Hub v\u00e9rifie.' },

  { id:3, emoji:'\ud83d\udc65', titre:'D\u00e9clencheur n\u00b01\u00a0: Les PPE', contenu:[
    { icon:'\ud83d\udc65', texte:'Toute **PPE** (Personne Politiquement Expos\u00e9e) d\u00e9clenche **automatiquement** une DDR \u2014 pas d\u2019exception, pas d\u2019appr\u00e9ciation discr\u00e9tionnaire' },
    { icon:'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67', texte:'Sont \u00e9galement PPE\u00a0: les **membres de la famille proche** (conjoint, enfants, parents) et les **personnes li\u00e9es** (associ\u00e9s proches)' },
    { icon:'\ud83d\udcdd', texte:'Documents suppl\u00e9mentaires pour une PPE\u00a0: justificatif de fonction, source du patrimoine d\u00e9taill\u00e9e, m\u00e9dias adverses (negative news)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la pr\u00e9sence de tous les documents DDR requis pour une PPE et signale tout manquant au PSF' },
  ], aretenir:'PPE = DDR automatique et obligatoire. Famille et associ\u00e9s inclus. i-Hub v\u00e9rifie la compl\u00e9tude du dossier DDR.' },

  { id:4, emoji:'\ud83c\udf0d', titre:'D\u00e9clencheur n\u00b02\u00a0: Pays \u00e0 risque \u00e9lev\u00e9', contenu:[
    { icon:'\ud83c\udf0d', texte:'Tout client final li\u00e9 \u00e0 un **pays \u00e0 haut risque** (liste GAFI, liste noire UE) d\u00e9clenche une DDR' },
    { icon:'\ud83d\udccc', texte:'Le lien au pays peut \u00eatre\u00a0: nationalit\u00e9, r\u00e9sidence, source des fonds, si\u00e8ge social de l\u2019entit\u00e9 cliente' },
    { icon:'\ud83d\udd04', texte:'Les listes sont mises \u00e0 jour par le GAFI et l\u2019UE\u00a0: le PSF est responsable de consulter les listes en vigueur' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale tout lien \u00e0 un pays \u00e0 risque visible dans les documents \u2014 le PSF d\u00e9cide du niveau de DDR \u00e0 appliquer' },
  ], aretenir:'Pays GAFI/UE \u00e0 risque = DDR. i-Hub d\u00e9tecte le lien pays dans les documents. Le PSF d\u00e9cide du traitement.' },

  { id:5, emoji:'\ud83c\udfe2', titre:'D\u00e9clencheur n\u00b03\u00a0: Structures complexes', contenu:[
    { icon:'\ud83c\udfe2', texte:'Les **structures l\u00e9gales complexes** \u2014 holdings en cascade, trusts, foundations, soci\u00e9t\u00e9s offshores \u2014 d\u00e9clenchent une DDR' },
    { icon:'\ud83e\udd14', texte:'La complexit\u00e9 peut \u00eatre utilis\u00e9e pour dissimuler l\u2019identit\u00e9 du b\u00e9n\u00e9ficiaire effectif r\u00e9el (UBO)' },
    { icon:'\ud83d\udccb', texte:'Documents suppl\u00e9mentaires\u00a0: organigramme complet, statuts de chaque entit\u00e9 interm\u00e9diaire, documents d\u2019identit\u00e9 de chaque UBO' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la coh\u00e9rence de la structure\u00a0: les statuts concordent-ils avec l\u2019organigramme\u00a0? Les UBO sont-ils bien identifi\u00e9s\u00a0?' },
  ], aretenir:'Structure complexe = DDR. i-Hub v\u00e9rifie la coh\u00e9rence entre l\u2019organigramme, les statuts et les documents UBO.' },

  { id:6, emoji:'\ud83d\udcb0', titre:'D\u00e9clencheur n\u00b04\u00a0: Transactions inhabituelles', contenu:[
    { icon:'\ud83d\udcb0', texte:'Des transactions **inhabituelles par leur montant, fr\u00e9quence ou nature** par rapport au profil du client final d\u00e9clenchent une r\u00e9vision DDR' },
    { icon:'\u26a0\ufe0f', texte:'Exemples\u00a0: virement soudain d\u2019un montant \u00e9lev\u00e9 depuis un pays \u00e0 risque, activit\u00e9 intense sur un compte habituellement dormant' },
    { icon:'\ud83d\udcca', texte:'Le PSF utilise ses outils de **monitoring de transactions** pour d\u00e9tecter ces anomalies' },
    { icon:'\ud83d\udd0d', texte:'i-Hub peut \u00eatre mandat\u00e9 pour une revue documentaire du dossier existant suite \u00e0 une alerte transaction \u2014 sur instruction du PSF' },
  ], aretenir:'Transaction inhabituelle = possible DDR ou revue du dossier. Le PSF d\u00e9cide. i-Hub intervient sur instruction pour la revue documentaire.' },

  { id:9, emoji:'\ud83d\udcf0', titre:'Les m\u00e9dias adverses (Negative News)', contenu:[
    { icon:'\ud83d\udcf0', texte:'La recherche de **m\u00e9dias adverses** consiste \u00e0 rechercher des articles de presse n\u00e9gatifs sur un client final (enquêtes, condamnations, scandales)' },
    { icon:'\ud83c\udfe6', texte:'C\u2019est une obligation **du PSF** en DDR \u2014 pas une t\u00e2che d\u2019i-Hub sauf si le SLA le pr\u00e9voit explicitement' },
    { icon:'\ud83d\udd0d', texte:'Si i-Hub detecte fortuitement un article n\u00e9gatif sur un client final lors de ses v\u00e9rifications, il le **signale au PSF** imm\u00e9diatement' },
    { icon:'\ud83d\uded1', texte:'i-Hub ne d\u00e9cide pas de la suite \u2014 c\u2019est le PSF qui \u00e9value l\u2019impact et d\u00e9cide des mesures \u00e0 prendre' },
  ], aretenir:'Negative news = obligation du PSF. Si i-Hub d\u00e9tecte fortuitement une information n\u00e9gative, il signale au PSF imm\u00e9diatement.' },

  { id:10, emoji:'\ud83d\udc64', titre:'V\u00e9rification de la PPE\u00a0: les \u00e9l\u00e9ments sp\u00e9cifiques', contenu:[
    { icon:'\ud83d\udc64', texte:'**Identification de la fonction**\u00a0: quel poste, quelle institution, quelle p\u00e9riode\u00a0? Le document doit l\u2019indiquer clairement' },
    { icon:'\u23f1\ufe0f', texte:'**Dur\u00e9e du statut PPE**\u00a0: une personne reste PPE pendant **12 mois** apr\u00e8s avoir quitt\u00e9 sa fonction \u2014 contr\u00f4les maintenus' },
    { icon:'\ud83d\udcb5', texte:'**Source du patrimoine**\u00a0: un ministre ne peut pas justifier 10 millions d\u2019euros uniquement avec son salaire \u2014 \u00e0 documenter' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la pr\u00e9sence des documents identifiant la fonction et la SOW \u2014 signal si manquant ou incoh\u00e9rent' },
  ], aretenir:'PPE\u00a0: v\u00e9rifier la fonction + SOW + negative news (PSF). Le statut PPE dure 12 mois apr\u00e8s la fin de la fonction.' },

  { id:11, emoji:'\ud83c\udfe2', titre:'Les structures\u00a0: identifier l\u2019UBO r\u00e9el', contenu:[
    { icon:'\ud83c\udfe2', texte:'L\u2019**UBO** (Ultimate Beneficial Owner) est la personne physique qui contr\u00f4le en dernier ressort l\u2019entit\u00e9 cliente (> 25%)' },
    { icon:'\ud83d\udcca', texte:'En DDR, l\u2019**organigramme complet** de la structure doit \u00eatre fourni \u2014 jusqu\u2019\u00e0 la personne physique finale' },
    { icon:'\u26a0\ufe0f', texte:'Pi\u00e8ge fr\u00e9quent\u00a0: plusieurs actionnaires \u00e0 24,9% chacun pour \u00e9viter le seuil des 25% \u2014 signal au PSF m\u00eame si chacun < 25%' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie que l\u2019organigramme et les statuts concordent \u2014 et que tous les UBO d\u00e9clar\u00e9s > 25% ont un dossier d\u2019identit\u00e9 complet' },
  ], aretenir:'UBO = personne physique > 25%. En DDR, organigramme jusqu\u2019\u00e0 la personne physique + identit\u00e9 de chaque UBO. Structure suspecte = signal.' },

  { id:12, emoji:'\ud83d\udd04', titre:'La r\u00e9vision DDR p\u00e9riodique', contenu:[
    { icon:'\ud83d\udd04', texte:'Les dossiers DDR ne sont pas statiques \u2014 ils doivent \u00eatre **r\u00e9vis\u00e9s p\u00e9riodiquement** par le PSF (fr\u00e9quence selon le risque)' },
    { icon:'\ud83d\udcc5', texte:'Changements qui d\u00e9clenchent une r\u00e9vision imm\u00e9diate\u00a0: changement de statut PPE, transactions inhabituelles, nouveau lien avec un pays \u00e0 risque' },
    { icon:'\ud83d\udcce', texte:'i-Hub peut \u00eatre mandat\u00e9 pour des **r\u00e9visions documentaires p\u00e9riodiques** \u2014 v\u00e9rifier que les documents DDR sont toujours valides et complets' },
    { icon:'\u23f0', texte:'Documents DDR qui expirent\u00a0: pi\u00e8ces d\u2019identit\u00e9, justificatifs de domicile, certains justificatifs SOF \u2014 \u00e0 renouveler' },
  ], aretenir:'DDR = processus continu, pas ponctuel. R\u00e9visions p\u00e9riodiques obligatoires. i-Hub peut \u00eatre mandat\u00e9 pour les r\u00e9visions documentaires.' },

  { id:13, emoji:'\ud83d\uded1', titre:'Ce que i-Hub NE d\u00e9cide PAS en DDR', contenu:[
    { icon:'\u274c', texte:'i-Hub ne d\u00e9cide **pas** si un client est une PPE ou non \u2014 il signale les indices visibles, le PSF tranche' },
    { icon:'\u274c', texte:'i-Hub ne d\u00e9cide **pas** si le niveau de DDR est suffisant \u2014 c\u2019est la politique de risque du PSF' },
    { icon:'\u274c', texte:'i-Hub ne d\u00e9cide **pas** si la source des fonds est l\u00e9gitime \u2014 il v\u00e9rifie la pr\u00e9sence et la coh\u00e9rence des documents' },
    { icon:'\u274c', texte:'i-Hub ne d\u00e9cide **pas** d\u2019accepter ou de refuser un client \u2014 c\u2019est la responsabilit\u00e9 du PSF' },
  ], aretenir:'En DDR comme ailleurs\u00a0: i-Hub v\u00e9rifie et signale. Le PSF d\u00e9cide. Jamais l\u2019inverse.' },

  { id:14, emoji:'\ud83d\udcdd', titre:'Les documents sp\u00e9cifiques DDR \u00e0 v\u00e9rifier', contenu:[
    { icon:'\ud83d\udcdd', texte:'**Justificatif de fonction PPE**\u00a0: arr\u00eat\u00e9 de nomination, d\u00e9cret, publication officielle \u2014 doit identifier clairement le r\u00f4le' },
    { icon:'\ud83c\udfe0', texte:'**Documents SOW**\u00a0: d\u00e9clarations fiscales, actes notari\u00e9s, contrats de cession \u2014 justifiant la constitution du patrimoine' },
    { icon:'\ud83c\udfe2', texte:'**Organigramme certifi\u00e9**\u00a0: dat\u00e9, sign\u00e9, coh\u00e9rent avec les statuts de chaque soci\u00e9t\u00e9 dans la cha\u00eene' },
    { icon:'\ud83d\udc64', texte:'**Identit\u00e9 de chaque UBO**\u00a0: passeport valide + justificatif de domicile pour chaque personne physique d\u00e9tenant > 25%' },
  ], aretenir:'4 documents cl\u00e9s DDR\u00a0: justificatif de fonction + SOW + organigramme certifi\u00e9 + identit\u00e9 de chaque UBO. Tout manquant = signal au PSF.' },

  { id:15, emoji:'\ud83c\udf10', titre:'DDR et pays \u00e0 risque\u00a0: ce que v\u00e9rifie i-Hub', contenu:[
    { icon:'\ud83c\udf10', texte:'Pour un client final li\u00e9 \u00e0 un pays \u00e0 risque\u00a0: v\u00e9rifier que le dossier contient les **justificatifs d\u2019activit\u00e9 l\u00e9gitime** dans ce pays' },
    { icon:'\ud83d\udcb5', texte:'La **source des fonds** provenant d\u2019un pays \u00e0 risque doit \u00eatre justifi\u00e9e de mani\u00e8re particuli\u00e8rement d\u00e9taill\u00e9e' },
    { icon:'\ud83d\udccc', texte:'i-Hub v\u00e9rifie la pr\u00e9sence des documents suppl\u00e9mentaires pr\u00e9vus dans le SLA pour ce type de profil' },
    { icon:'\ud83d\uded1', texte:'Tout lien \u00e0 un pays \u00e0 risque non document\u00e9 = signal au PSF, m\u00eame si le PSF a d\u00e9j\u00e0 accept\u00e9 le dossier' },
  ], aretenir:'Pays \u00e0 risque = documents suppl\u00e9mentaires. i-Hub v\u00e9rifie leur pr\u00e9sence et coh\u00e9rence. Lien non document\u00e9 = signal.' },

  { id:16, emoji:'\ud83d\udcce', titre:'Comment signaler en DDR', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Pr\u00e9ciser le d\u00e9clencheur DDR**\u00a0: PPE, pays \u00e0 risque, structure complexe, transaction inhabituelle' },
    { icon:'2\ufe0f\u20e3', texte:'**Lister les documents manquants**\u00a0: SOF, SOW, organigramme, identit\u00e9 UBO \u2014 avec pr\u00e9cision' },
    { icon:'3\ufe0f\u20e3', texte:'**Signaler les incoh\u00e9rences**\u00a0: discordance entre organigramme et statuts, SOW incompatible avec le profil' },
    { icon:'4\ufe0f\u20e3', texte:'**Archiver** le rapport DDR \u2014 plus d\u00e9taill\u00e9 qu\u2019un rapport standard, car les enjeux sont plus \u00e9lev\u00e9s' },
  ], aretenir:'Rapport DDR = plus d\u00e9taill\u00e9 que standard. D\u00e9clencheur + manquants + incoh\u00e9rences. Archive soign\u00e9e pour protection d\u2019i-Hub.' },

  { id:17, emoji:'\u26a0\ufe0f', titre:'Les red flags DDR \u00e0 signaler', contenu:[
    { icon:'\ud83d\udd34', texte:'**Refus de fournir** les documents DDR demand\u00e9s par le PSF sans justification valide' },
    { icon:'\ud83d\udd34', texte:'**UBO qui change** \u00e0 chaque demande de mise \u00e0 jour \u2014 structure visiblement opaque' },
    { icon:'\ud83d\udd34', texte:'**SOW incompatible** avec la fonction ou le profil\u00a0: patrimoine disproportionn\u00e9 par rapport \u00e0 l\u2019activit\u00e9 d\u00e9clar\u00e9e' },
    { icon:'\ud83d\udd34', texte:'**Organigramme incomplet** ou refusant d\u2019aller jusqu\u2019\u00e0 la personne physique finale' },
  ], aretenir:'Red flags DDR\u00a0: refus de fournir, UBO instable, SOW disproportionn\u00e9e, organigramme tronqu\u00e9. Chacun = signal imm\u00e9diat au PSF.' },

  { id:18, emoji:'\ud83d\udcca', titre:'R\u00e9sum\u00e9\u00a0: les 4 d\u00e9clencheurs DDR', contenu:[
    { icon:'\ud83d\udc65', texte:'**PPE**\u00a0: personne politiquement expos\u00e9e ou proche \u2014 DDR automatique et obligatoire' },
    { icon:'\ud83c\udf0d', texte:'**Pays \u00e0 risque**\u00a0: nationalit\u00e9, r\u00e9sidence ou source des fonds li\u00e9e \u00e0 un pays GAFI/UE \u00e0 risque' },
    { icon:'\ud83c\udfe2', texte:'**Structure complexe**\u00a0: holding, trust, fondation, offshore \u2014 op\u00e9cit\u00e9 potentielle sur l\u2019UBO' },
    { icon:'\ud83d\udcb0', texte:'**Transaction inhabituelle**\u00a0: montant, fr\u00e9quence ou nature anormaux par rapport au profil' },
  ], aretenir:'4 d\u00e9clencheurs DDR\u00a0: PPE + pays \u00e0 risque + structure complexe + transaction inhabituelle. Le PSF d\u00e9cide, i-Hub v\u00e9rifie.' },

  { id:19, emoji:'\ud83d\udca1', titre:'La DDR vue d\u2019i-Hub\u00a0: ce qui change concr\u00e8tement', contenu:[
    { icon:'\ud83d\udcdd', texte:'**Plus de documents**\u00a0: SOF d\u00e9taill\u00e9e, SOW, organigramme, identit\u00e9 UBO \u2014 la checklist est plus longue' },
    { icon:'\ud83d\udd0d', texte:'**V\u00e9rifications crois\u00e9es suppl\u00e9mentaires**\u00a0: organigramme vs statuts, SOW vs profil professionnel, SOF vs op\u00e9rations concern\u00e9es' },
    { icon:'\ud83d\udce2', texte:'**Signalement plus d\u00e9taill\u00e9**\u00a0: chaque manquant et chaque incoh\u00e9rence sont d\u00e9crits avec pr\u00e9cision dans le rapport' },
    { icon:'\ud83d\udcce', texte:'**Archive plus compl\u00e8te**\u00a0: conserver tous les documents v\u00e9rifi\u00e9s + le rapport DDR dat\u00e9 et d\u00e9taill\u00e9' },
  ], aretenir:'DDR pour i-Hub = checklist plus longue + v\u00e9rifications crois\u00e9es suppl\u00e9mentaires + rapport plus d\u00e9taill\u00e9. Logique = la m\u00eame.' },

  { id:20, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: DDR en 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**DDR** = contr\u00f4les renforc\u00e9s pour les profils \u00e0 risque \u00e9lev\u00e9 \u2014 PPE, pays \u00e0 risque, structures complexes, transactions inhabituelles' },
    { icon:'2\ufe0f\u20e3', texte:'**Le PSF** d\u00e9cide d\u2019appliquer la DDR et collecte les documents suppl\u00e9mentaires' },
    { icon:'3\ufe0f\u20e3', texte:'**i-Hub** v\u00e9rifie la compl\u00e9tude et la coh\u00e9rence des documents DDR si pr\u00e9vu au SLA' },
    { icon:'4\ufe0f\u20e3', texte:'**Tout manquant ou incoh\u00e9rence** est signal\u00e9 au PSF dans un rapport d\u00e9taill\u00e9' },
    { icon:'5\ufe0f\u20e3', texte:'**i-Hub ne d\u00e9cide jamais** du niveau de risque ni de l\u2019acceptabilit\u00e9 du client \u2014 toujours le PSF' },
  ], aretenir:'DDR\u00a0: plus de documents, plus de v\u00e9rifications, m\u00eame logique. PSF d\u00e9cide, i-Hub v\u00e9rifie sur instruction.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udd34', titre:'What is EDD?', contenu:[
    { icon:'\ud83d\udd34', texte:'**Enhanced Due Diligence** (EDD) is a deeper level of control than standard vigilance, applied to high-risk clients' },
    { icon:'\ud83d\udcdc', texte:'Required by the **Luxembourg 2004 law** and EU AML directives \u2014 not optional for covered cases' },
    { icon:'\ud83c\udfe6', texte:'It is the **PSF** that decides to apply it based on its risk policy \u2014 i-Hub intervenes to verify additional documents if the SLA provides' },
    { icon:'\ud83d\udd0d', texte:'EDD = more documents to collect by PSF + more thorough verifications by i-Hub within the SLA scope' },
  ], aretenir:'EDD = enhanced controls for high-risk profiles. Mandatory in certain cases. Decided by PSF, verified by i-Hub on instruction.' },
  { id:2, emoji:'\ud83d\udd04', titre:'Standard vs Enhanced: the differences', contenu:[
    { icon:'\ud83d\udfe2', texte:'**Standard vigilance**: identity + residence + professional activity + basic source of funds' },
    { icon:'\ud83d\udd34', texte:'**EDD**: same + detailed source of funds (SOF) + source of wealth (SOW) + UBO information + enhanced monitoring' },
    { icon:'\ud83d\udcc5', texte:'**Review frequency**: standard = periodic. EDD = more frequent, defined by PSF per risk profile' },
    { icon:'\ud83d\udcbb', texte:'**Hierarchical approval**: EDD relationship entry often requires Compliance management approval within the PSF' },
  ], aretenir:'EDD = standard vigilance + more documents collected by PSF + more frequent review. PSF decides, i-Hub verifies.' },
  { id:3, emoji:'\ud83d\udc65', titre:'Trigger #1: PEPs', contenu:[
    { icon:'\ud83d\udc65', texte:'Any **PEP** (Politically Exposed Person) **automatically** triggers EDD \u2014 no exceptions, no discretionary assessment' },
    { icon:'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67', texte:'Also PEPs: **immediate family members** (spouse, children, parents) and **close associates**' },
    { icon:'\ud83d\udcdd', texte:'Additional PEP documents: function certificate, detailed source of wealth, adverse media (negative news)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies the presence of all EDD documents required for a PEP and flags any missing ones to the PSF' },
  ], aretenir:'PEP = automatic and mandatory EDD. Family and associates included. i-Hub verifies EDD file completeness.' },
  { id:4, emoji:'\ud83c\udf0d', titre:'Trigger #2: High-risk countries', contenu:[
    { icon:'\ud83c\udf0d', texte:'Any final client linked to a **high-risk country** (FATF list, EU blacklist) triggers EDD' },
    { icon:'\ud83d\udccc', texte:'Country link can be: nationality, residency, source of funds, registered office of client entity' },
    { icon:'\ud83d\udd04', texte:'Lists are updated by FATF and EU: the PSF is responsible for consulting current lists' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags any high-risk country link visible in documents \u2014 the PSF decides on the EDD level to apply' },
  ], aretenir:'FATF/EU high-risk country = EDD. i-Hub detects the country link in documents. PSF decides on treatment.' },
  { id:5, emoji:'\ud83c\udfe2', titre:'Trigger #3: Complex structures', contenu:[
    { icon:'\ud83c\udfe2', texte:'**Complex legal structures** \u2014 cascading holdings, trusts, foundations, offshore companies \u2014 trigger EDD' },
    { icon:'\ud83e\udd14', texte:'Complexity may be used to conceal the identity of the real ultimate beneficial owner (UBO)' },
    { icon:'\ud83d\udccb', texte:'Additional documents: full organisational chart, articles of each intermediate entity, identity documents of each UBO' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies structure consistency: do articles match the org chart? Are all UBOs properly identified?' },
  ], aretenir:'Complex structure = EDD. i-Hub verifies consistency between org chart, articles and UBO documents.' },
  { id:6, emoji:'\ud83d\udcb0', titre:'Trigger #4: Unusual transactions', contenu:[
    { icon:'\ud83d\udcb0', texte:'Transactions **unusual in amount, frequency or nature** relative to the final client\u2019s profile trigger an EDD review' },
    { icon:'\u26a0\ufe0f', texte:'Examples: sudden large transfer from a high-risk country, intense activity on a normally dormant account' },
    { icon:'\ud83d\udcca', texte:'The PSF uses its **transaction monitoring** tools to detect these anomalies' },
    { icon:'\ud83d\udd0d', texte:'i-Hub may be mandated for a documentary review of the existing file following a transaction alert \u2014 on PSF instruction' },
  ], aretenir:'Unusual transaction = possible EDD or file review. PSF decides. i-Hub intervenes on instruction for documentary review.' },

  { id:9, emoji:'\ud83d\udcf0', titre:'Adverse media (Negative News)', contenu:[
    { icon:'\ud83d\udcf0', texte:'**Adverse media screening** involves searching for negative press articles about a final client (investigations, convictions, scandals)' },
    { icon:'\ud83c\udfe6', texte:'This is a **PSF obligation** in EDD \u2014 not an i-Hub task unless explicitly provided for in the SLA' },
    { icon:'\ud83d\udd0d', texte:'If i-Hub incidentally detects a negative article about a final client during its verifications, it **flags to PSF** immediately' },
    { icon:'\ud83d\uded1', texte:'i-Hub does not decide on follow-up \u2014 the PSF assesses the impact and decides on measures to take' },
  ], aretenir:'Negative news = PSF obligation. If i-Hub incidentally detects negative information, it flags to PSF immediately.' },
  { id:10, emoji:'\ud83d\udc64', titre:'PEP verification: specific elements', contenu:[
    { icon:'\ud83d\udc64', texte:'**Function identification**: which role, which institution, which period? The document must state this clearly' },
    { icon:'\u23f1\ufe0f', texte:'**PEP status duration**: a person remains PEP for **12 months** after leaving their function \u2014 controls maintained' },
    { icon:'\ud83d\udcb5', texte:'**Source of wealth**: a minister cannot justify \u20ac10 million solely with their salary \u2014 must be documented' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies presence of documents identifying the function and SOW \u2014 flags if missing or inconsistent' },
  ], aretenir:'PEP: verify presence of function documents. PEP status lasts 12 months after leaving the function.' },
  { id:11, emoji:'\ud83c\udfe2', titre:'Structures: identifying the real UBO', contenu:[
    { icon:'\ud83c\udfe2', texte:'The **UBO** (Ultimate Beneficial Owner) is the individual who ultimately controls the client entity (> 25%)' },
    { icon:'\ud83d\udcca', texte:'In EDD, the **complete organisational chart** must be provided \u2014 down to the final individual' },
    { icon:'\u26a0\ufe0f', texte:'Common trap: multiple shareholders at 24.9% each to avoid the 25% threshold \u2014 flag to PSF even if each < 25%' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies org chart and articles are consistent \u2014 and that all declared UBOs > 25% have a complete identity file' },
  ], aretenir:'UBO = individual > 25%. In EDD, org chart down to individual + identity of each UBO. Suspicious structure = flag.' },
  { id:12, emoji:'\ud83d\udd04', titre:'Periodic EDD review', contenu:[
    { icon:'\ud83d\udd04', texte:'EDD files are not static \u2014 they must be **periodically reviewed** by the PSF (frequency per risk level)' },
    { icon:'\ud83d\udcc5', texte:'Changes triggering immediate review: change of PEP status, unusual transactions, new link to high-risk country' },
    { icon:'\ud83d\udcce', texte:'i-Hub may be mandated for **periodic documentary reviews** \u2014 verify EDD documents are still valid and complete' },
    { icon:'\u23f0', texte:'Expiring EDD documents: identity documents, proof of residence, some SOF documents \u2014 to be renewed' },
  ], aretenir:'EDD = ongoing process, not one-off. Periodic reviews mandatory. i-Hub may be mandated for documentary reviews.' },
  { id:13, emoji:'\ud83d\uded1', titre:'What i-Hub does NOT decide in EDD', contenu:[
    { icon:'\u274c', texte:'i-Hub does **not** decide whether a client is a PEP or not \u2014 it flags visible indicators, PSF decides' },
    { icon:'\u274c', texte:'i-Hub does **not** decide whether the EDD level is sufficient \u2014 that is the PSF\u2019s risk policy' },
    { icon:'\u274c', texte:'i-Hub does **not** decide whether the source of funds is legitimate \u2014 it checks document presence and consistency' },
    { icon:'\u274c', texte:'i-Hub does **not** decide to accept or reject a client \u2014 that is the PSF\u2019s responsibility' },
  ], aretenir:'In EDD as elsewhere: i-Hub verifies and flags. The PSF decides. Never the reverse.' },
  { id:14, emoji:'\ud83d\udcdd', titre:'Specific EDD documents to verify', contenu:[
    { icon:'\ud83d\udcdd', texte:'**PEP function certificate**: appointment decree, official publication \u2014 must clearly identify the role' },
    { icon:'\ud83c\udfe0', texte:'**SOW documents**: tax declarations, notarial deeds, transfer agreements \u2014 justifying wealth build-up' },
    { icon:'\ud83c\udfe2', texte:'**Certified org chart**: dated, signed, consistent with each company\u2019s articles in the chain' },
    { icon:'\ud83d\udc64', texte:'**Each UBO\u2019s identity**: valid passport + proof of residence for each individual holding > 25%' },
  ], aretenir:'3 key EDD documents for i-Hub: function certificate + certified org chart + each UBO\u2019s identity. Any missing = flag to PSF.' },
  { id:15, emoji:'\ud83c\udf10', titre:'EDD and high-risk countries: what i-Hub verifies', contenu:[
    { icon:'\ud83c\udf10', texte:'For a final client linked to a high-risk country: verify the file contains **legitimate activity justification** in that country' },
    { icon:'\ud83d\udcb5', texte:'**Source of funds** from a high-risk country must be justified in particularly detailed manner' },
    { icon:'\ud83d\udccc', texte:'i-Hub checks presence of additional documents specified in the SLA for this profile type' },
    { icon:'\ud83d\uded1', texte:'Any undocumented link to a high-risk country = flag to PSF, even if PSF has already accepted the file' },
  ], aretenir:'High-risk country = additional documents. i-Hub checks their presence and consistency. Undocumented link = flag.' },
  { id:16, emoji:'\ud83d\udcce', titre:'How to flag in EDD', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**State the EDD trigger**: PEP, high-risk country, complex structure, unusual transaction' },
    { icon:'2\ufe0f\u20e3', texte:'**List missing documents**: SOF, SOW, org chart, UBO identity \u2014 with precision' },
    { icon:'3\ufe0f\u20e3', texte:'**Flag inconsistencies**: discrepancy between org chart and articles, SOW incompatible with profile' },
    { icon:'4\ufe0f\u20e3', texte:'**Archive** the EDD report \u2014 more detailed than a standard report, given the higher stakes' },
  ], aretenir:'EDD report = more detailed than standard. Trigger + missing items + inconsistencies. Careful archive for i-Hub protection.' },
  { id:17, emoji:'\u26a0\ufe0f', titre:'EDD red flags to flag', contenu:[
    { icon:'\ud83d\udd34', texte:'**Refusal to provide** EDD documents requested by PSF without valid justification' },
    { icon:'\ud83d\udd34', texte:'**UBO that changes** with each update request \u2014 visibly opaque structure' },
    { icon:'\ud83d\udd34', texte:'**SOW incompatible** with function or profile: disproportionate wealth vs declared activity' },
    { icon:'\ud83d\udd34', texte:'**Incomplete org chart** or one that stops before reaching the final individual' },
  ], aretenir:'EDD red flags: refusal to provide, unstable UBO, truncated org chart. Each = immediate flag to PSF.' },
  { id:18, emoji:'\ud83d\udcca', titre:'Summary: the 4 EDD triggers', contenu:[
    { icon:'\ud83d\udc65', texte:'**PEP**: politically exposed person or associate \u2014 automatic and mandatory EDD' },
    { icon:'\ud83c\udf0d', texte:'**High-risk country**: nationality, residency or source of funds linked to FATF/EU high-risk country' },
    { icon:'\ud83c\udfe2', texte:'**Complex structure**: holding, trust, foundation, offshore \u2014 potential UBO opacity' },
    { icon:'\ud83d\udcb0', texte:'**Unusual transaction**: abnormal amount, frequency or nature relative to profile' },
  ], aretenir:'4 EDD triggers: PEP + high-risk country + complex structure + unusual transaction. PSF decides, i-Hub verifies.' },
  { id:19, emoji:'\ud83d\udca1', titre:'EDD from i-Hub\u2019s perspective: what changes in practice', contenu:[
    { icon:'\ud83d\udcdd', texte:'**More documents**: detailed SOF, SOW, org chart, UBO identity \u2014 the checklist is longer' },
    { icon:'\ud83d\udd0d', texte:'**Additional cross-checks**: org chart vs articles, SOW vs professional profile, SOF vs relevant transactions' },
    { icon:'\ud83d\udce2', texte:'**More detailed flagging**: each missing item and inconsistency described precisely in the report' },
    { icon:'\ud83d\udcce', texte:'**More complete archive**: retain all verified documents + dated and detailed EDD report' },
  ], aretenir:'EDD for i-Hub = longer checklist + additional cross-checks + more detailed report. Same logic throughout.' },
  { id:20, emoji:'\ud83c\udf93', titre:'Summary: EDD in 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**EDD** = enhanced controls for high-risk profiles \u2014 PEPs, high-risk countries, complex structures, unusual transactions' },
    { icon:'2\ufe0f\u20e3', texte:'The **PSF** decides to apply EDD and collects additional documents' },
    { icon:'3\ufe0f\u20e3', texte:'**i-Hub** verifies completeness and consistency of EDD documents if specified in the SLA' },
    { icon:'4\ufe0f\u20e3', texte:'**Any missing item or inconsistency** is flagged to PSF in a detailed report' },
    { icon:'5\ufe0f\u20e3', texte:'**i-Hub never decides** on risk level or client acceptability \u2014 always the PSF' },
  ], aretenir:'EDD: more documents, more verifications, same logic. PSF decides, i-Hub verifies on instruction.' },
]

const DDR_PROFILS_FR = [
  { profil:'Client final\u00a0: M. Dupont, employ\u00e9 luxembourgeois, salaire mensuel de 3 500\u20ac, aucune activit\u00e9 \u00e0 l\u2019\u00e9tranger', isDDR:false, explication:'Profil standard sans facteur de risque \u00e9lev\u00e9. Vigilance standard suffisante. Pas de DDR requise.' },
  { profil:'Client final\u00a0: Mme Kowalski, ancienne ministre de l\u2019\u00e9conomie polonaise, maintenant retrait\u00e9e', isDDR:true, explication:'Ancienne ministre = PPE. Le statut PPE dure 12 mois apr\u00e8s la fin de la fonction. DDR automatique et obligatoire.' },
  { profil:'Client final\u00a0: soci\u00e9t\u00e9 luxembourgeoise simple, 2 associ\u00e9s identifi\u00e9s, activit\u00e9 commerciale en Luxembourg uniquement', isDDR:false, explication:'Structure simple, associ\u00e9s identifi\u00e9s, pas de pays \u00e0 risque. Vigilance standard suffisante.' },
  { profil:'Client final\u00a0: holding avec 4 niveaux de soci\u00e9t\u00e9s dont une aux \u00celes Ca\u00efmans', isDDR:true, explication:'Structure complexe (4 niveaux) + pays \u00e0 risque (Cayman Islands) = DDR requise. Double d\u00e9clencheur.' },
  { profil:'Client final\u00a0: M. Nguyen, r\u00e9sident luxembourgeois, ingenieur, origine vietnamienne', isDDR:false, explication:'Le Vietnam n\u2019est pas sur la liste GAFI. Origine \u00e9trang\u00e8re seule ne suffit pas \u00e0 d\u00e9clencher une DDR.' },
  { profil:'Client final\u00a0: fonds d\u2019investissement dont les fonds proviennent partiellement d\u2019Iran', isDDR:true, explication:'L\u2019Iran est sur la liste GAFI des pays \u00e0 haut risque. Source de fonds li\u00e9e \u00e0 l\u2019Iran = DDR obligatoire.' },
  { profil:'Client final\u00a0: M. Diallo, PDG d\u2019une soci\u00e9t\u00e9 priv\u00e9e luxembourgeoise cot\u00e9e en bourse', isDDR:false, explication:'PDG d\u2019entreprise priv\u00e9e cot\u00e9e \u2260 PPE. Les PPE sont li\u00e9es aux fonctions publiques, pas priv\u00e9es. Vigilance standard.' },
  { profil:'Client final\u00a0: M. Schmidt, fils du Premier ministre allemand, \u00e9tudiant \u00e0 Luxembourg', isDDR:true, explication:'Fils d\u2019un chef de gouvernement = membre de la famille d\u2019une PPE = lui-m\u00eame PPE. DDR automatique.' },
]
const DDR_PROFILS_EN = [
  { profil:'Final client: Mr Dupont, Luxembourg employee, monthly salary \u20ac3,500, no foreign activity', isDDR:false, explication:'Standard profile with no high-risk factor. Standard vigilance sufficient. No EDD required.' },
  { profil:'Final client: Ms Kowalski, former Polish Minister of Economy, now retired', isDDR:true, explication:'Former minister = PEP. PEP status lasts 12 months after leaving the function. Automatic and mandatory EDD.' },
  { profil:'Final client: simple Luxembourg company, 2 identified partners, commercial activity in Luxembourg only', isDDR:false, explication:'Simple structure, identified partners, no high-risk country. Standard vigilance sufficient.' },
  { profil:'Final client: holding with 4 levels of companies including one in the Cayman Islands', isDDR:true, explication:'Complex structure (4 levels) + high-risk country (Cayman Islands) = EDD required. Double trigger.' },
  { profil:'Final client: Mr Nguyen, Luxembourg resident, engineer, Vietnamese origin', isDDR:false, explication:'Vietnam is not on the FATF list. Foreign origin alone is not sufficient to trigger EDD.' },
  { profil:'Final client: investment fund whose funds partially originate from Iran', isDDR:true, explication:'Iran is on the FATF high-risk country list. Source of funds linked to Iran = mandatory EDD.' },
  { profil:'Final client: Mr Diallo, CEO of a listed private Luxembourg company', isDDR:false, explication:'CEO of a listed private company \u2260 PEP. PEPs are linked to public functions, not private ones. Standard vigilance.' },
  { profil:'Final client: Mr Schmidt, son of the German Chancellor, student in Luxembourg', isDDR:true, explication:'Son of a head of government = family member of a PEP = himself a PEP. Automatic EDD.' },
]

const VF_FR = [
  { texte:'Un client qui a \u00e9t\u00e9 ministre il y a 6 mois reste soumis \u00e0 la DDR', reponse:true, explication:'Exact\u00a0! Le statut PPE dure 12 mois apr\u00e8s la fin de la fonction. 6 mois = encore PPE = DDR obligatoire.' },
  { texte:'i-Hub d\u00e9cide si la source de fonds d\u2019un client DDR est l\u00e9gitime', reponse:false, explication:'Non\u00a0! i-Hub v\u00e9rifie la pr\u00e9sence et la coh\u00e9rence des documents SOF. La l\u00e9gitimit\u00e9 est d\u00e9cid\u00e9e par le PSF.' },
  { texte:'Le conjoint d\u2019une PPE est lui-m\u00eame consid\u00e9r\u00e9 comme PPE', reponse:true, explication:'Exact\u00a0! Les membres de la famille proche d\u2019une PPE sont eux-m\u00eames consid\u00e9r\u00e9s comme PPE.' },
  { texte:'Une structure avec plusieurs niveaux de soci\u00e9t\u00e9s d\u00e9clenche toujours une DDR', reponse:false, explication:'Pas n\u00e9cessairement. C\u2019est la complexit\u00e9 opaque et l\u2019impossibilit\u00e9 d\u2019identifier l\u2019UBO qui d\u00e9clenchent la DDR, pas le nombre de niveaux seul.' },
  { texte:'i-Hub peut refuser un dossier DDR incomplet sans consulter le PSF', reponse:false, explication:'Non\u00a0! i-Hub signale les manquants au PSF. C\u2019est le PSF qui d\u00e9cide des suites. i-Hub ne refuse jamais seul.' },
  { texte:'La recherche de m\u00e9dias adverses est une obligation du PSF, pas d\u2019i-Hub', reponse:true, explication:'Exact\u00a0! La negative news screening est une obligation du PSF en DDR. i-Hub signale s\u2019il d\u00e9tecte quelque chose fortuitement.' },
]
const VF_EN = [
  { texte:'A client who was minister 6 months ago remains subject to EDD', reponse:true, explication:'Correct! PEP status lasts 12 months after leaving the function. 6 months = still PEP = mandatory EDD.' },
  { texte:'i-Hub decides whether an EDD client\u2019s source of funds is legitimate', reponse:false, explication:'No! i-Hub verifies presence and consistency of SOF documents. Legitimacy is decided by the PSF.' },
  { texte:'A PEP\u2019s spouse is themselves considered a PEP', reponse:true, explication:'Correct! Immediate family members of a PEP are themselves considered PEPs.' },
  { texte:'A structure with multiple company levels always triggers EDD', reponse:false, explication:'Not necessarily. It is opaque complexity and inability to identify the UBO that trigger EDD, not the number of levels alone.' },
  { texte:'i-Hub can reject an incomplete EDD file without consulting the PSF', reponse:false, explication:'No! i-Hub flags missing items to the PSF. The PSF decides on next steps. i-Hub never rejects alone.' },
  { texte:'Adverse media screening is a PSF obligation, not i-Hub\u2019s', reponse:true, explication:'Correct! Negative news screening is a PSF obligation in EDD. i-Hub flags if it incidentally detects something.' },
]

const CAS_FR = [
  { situation:'Le PSF transmet un dossier DDR pour une PPE. Le dossier contient identit\u00e9 + SOF + mais aucun document SOW.', action:'Signaler au PSF\u00a0: document SOW manquant pour dossier PPE', options:['Accepter \u2014 SOF pr\u00e9sente, c\u2019est suffisant','Signaler au PSF\u00a0: document SOW manquant pour dossier PPE','Estimer la SOW \u00e0 partir du profil','Demander directement au client final'], explication:'Pour une PPE, la SOW est obligatoire en DDR. SOF seule = insuffisant. i-Hub signale le manquant au PSF.' },
  { situation:'Le PSF transmet un organigramme pour une holding. L\u2019organigramme s\u2019arr\u00eate \u00e0 une soci\u00e9t\u00e9 et n\u2019indique pas les personnes physiques actionnaires.', action:'Signaler au PSF\u00a0: organigramme incomplet, UBO non identifi\u00e9', options:['Accepter \u2014 la soci\u00e9t\u00e9 est identifi\u00e9e','Signaler au PSF\u00a0: organigramme incomplet, UBO non identifi\u00e9','Identifier l\u2019UBO sur internet','Rejeter le dossier'], explication:'Un organigramme doit aller jusqu\u2019\u00e0 la personne physique. S\u2019il s\u2019arr\u00eate \u00e0 une entit\u00e9, l\u2019UBO r\u00e9el n\u2019est pas identifi\u00e9. Signal au PSF.' },
  { situation:'Le PSF transmet un dossier DDR complet\u00a0: identit\u00e9 + SOF + SOW + organigramme + identit\u00e9 de chaque UBO. Tout est coh\u00e9rent.', action:'Valider le dossier DDR \u2014 complet et coh\u00e9rent', options:['Signaler quand m\u00eame au PSF par pr\u00e9caution','Valider le dossier DDR \u2014 complet et coh\u00e9rent','Demander des documents suppl\u00e9mentaires','Refuser \u2014 les dossiers DDR sont toujours suspects'], explication:'Un dossier DDR complet et coh\u00e9rent est valid\u00e9. i-Hub ne cherche pas \u00e0 trouver des probl\u00e8mes l\u00e0 o\u00f9 il n\u2019y en a pas.' },
]
const CAS_EN = [
  { situation:'PSF transmits an EDD file for a PEP. File contains identity + SOF + but no SOW document.', action:'Flag to PSF: SOW document missing for PEP file', options:['Accept \u2014 SOF is present, that\u2019s sufficient','Flag to PSF: SOW document missing for PEP file','Estimate SOW from the profile','Request directly from the final client'], explication:'For a PEP, SOW is mandatory in EDD. SOF alone = insufficient. i-Hub flags the missing item to PSF.' },
  { situation:'PSF transmits an org chart for a holding. The chart stops at a company and does not indicate individual shareholders.', action:'Flag to PSF: incomplete org chart, UBO not identified', options:['Accept \u2014 the company is identified','Flag to PSF: incomplete org chart, UBO not identified','Identify the UBO on the internet','Reject the file'], explication:'An org chart must go down to the individual. If it stops at an entity, the real UBO is not identified. Flag to PSF.' },
  { situation:'PSF transmits a complete EDD file: identity + SOF + SOW + org chart + each UBO\u2019s identity. Everything is consistent.', action:'Validate EDD file \u2014 complete and consistent', options:['Flag to PSF anyway as a precaution','Validate EDD file \u2014 complete and consistent','Request additional documents','Reject \u2014 EDD files are always suspicious'], explication:'A complete and consistent EDD file is validated. i-Hub does not look for problems where there are none.' },
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
      <button onClick={() => router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🔴 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
        </div>
        <span style={{background:'white',border:\`1px solid \${C}\`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${progress}%\`,transition:'width 0.4s',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1}/{FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i) => <div key={i} onClick={() => setFicheIndex(i)} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:\`2px solid \${C}30\`,boxShadow:\`0 8px 40px \${C}15\`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i) => (
                <div key={i} style={{display:'flex',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                </div>
              ))}
              <div style={{background:\`\${C}10\`,border:\`1px solid \${C}30\`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px'}}>
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
              {ficheIndex < FICHES.length-1 ? \`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) →\` : t.quizBtn}
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
          <div style={{background:C,height:'6px',width:\`\${(ddrIndex/activeDDR.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'580px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {ddrIndex+1}/{activeDDR.length}</span>
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
            <div style={{background:ddrAnim==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${ddrAnim==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
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
          <div style={{background:C,height:'6px',width:\`\${(vfIndex/activeVF.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q2label} — {vfIndex+1}/{activeVF.length}</span>
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
            <div style={{background:vfAnim==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnim==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(casIndex/activeCas.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:0}}>{t.q3title}</h2>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:\`2px solid \${C}30\`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i) => (
                <button key={i} onClick={() => repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left'}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=\`\${C}08\`}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>
                {cas.options.map((opt,i) => { const isC=opt===cas.action,isCh=opt===casRepondu; return (
                  <div key={i} style={{padding:'12px 16px',background:isC?'#d1fae5':isCh?'#fee2e2':'white',border:\`1.5px solid \${isC?'#6ee7b7':isCh?'#fca5a5':'#e5e7eb'}\`,borderRadius:'10px',fontSize:'14px',fontWeight:'600',color:isC?'#059669':isCh?'#ef4444':'#9ca3af'}}>
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
            <div style={{background:\`linear-gradient(90deg,\${C},#f59e0b)\`,height:'10px',width:\`\${total}%\`,borderRadius:'8px'}}/>
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
`, 'utf8');
console.log('✅ DDR module écrit !');
