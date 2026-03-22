const fs = require('fs');
const PINK = '#e91e8c';

fs.mkdirSync('app/modules/aml-coherence-documents', { recursive: true });
fs.writeFileSync('app/modules/aml-coherence-documents/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${PINK}'

const UI = {
  fr: {
    title: 'Coh\u00e9rence des documents KYC',
    subtitle: 'D\u00e9tecter les incoh\u00e9rences documentaires \u2014 le c\u0153ur du travail de v\u00e9rification i-Hub',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Les types de documents KYC et ce qu\u2019ils doivent prouver',
      'Les incoh\u00e9rences les plus fr\u00e9quentes \u00e0 d\u00e9tecter',
      'La m\u00e9thode de v\u00e9rification crois\u00e9e entre documents',
      'Ce qui d\u00e9clenche un signal au PSF',
      'Les limites de la v\u00e9rification documentaire',
      'Comment documenter et signaler une incoh\u00e9rence',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 INCOH\u00c9RENCE OU PAS\u00a0?',
    q1title: '\ud83d\udd0d Cette situation est-elle une incoh\u00e9rence \u00e0 signaler\u00a0?',
    signaler: '\ud83d\udea8 Incoh\u00e9rence \u2014 Signaler', ok: '\u2705 Coh\u00e9rent \u2014 Accepter',
    q2label: 'QUIZ 2/3 \u00b7 VRAI OU FAUX',
    q2title: '\u2705 Vrai ou Faux',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q3label: 'QUIZ 3/3 \u00b7 QUE SIGNALE i-Hub\u00a0?',
    q3title: '\ud83e\udd14 Quelle est la bonne action\u00a0?',
    resultTitle: 'Module termin\u00e9 \u2014 Vous d\u00e9tectez les incoh\u00e9rences comme un pro\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    medal_gold: 'Expert coh\u00e9rence\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Terminer \u2192',
  },
  en: {
    title: 'KYC Document Consistency',
    subtitle: 'Detecting documentary inconsistencies \u2014 the core of i-Hub\u2019s verification work',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'KYC document types and what they must prove',
      'The most common inconsistencies to detect',
      'The cross-document verification method',
      'What triggers a flag to the PSF',
      'The limits of documentary verification',
      'How to document and flag an inconsistency',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 INCONSISTENCY OR NOT?',
    q1title: '\ud83d\udd0d Is this situation an inconsistency to flag?',
    signaler: '\ud83d\udea8 Inconsistency \u2014 Flag', ok: '\u2705 Consistent \u2014 Accept',
    q2label: 'QUIZ 2/3 \u00b7 TRUE OR FALSE',
    q2title: '\u2705 True or False',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q3label: 'QUIZ 3/3 \u00b7 WHAT DOES i-Hub FLAG?',
    q3title: '\ud83e\udd14 What is the correct action?',
    resultTitle: 'Module complete \u2014 You detect inconsistencies like a pro!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    medal_gold: 'Consistency Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Finish \u2192',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udd0d', titre:'C\u2019est quoi la coh\u00e9rence documentaire\u00a0?', contenu:[
    { icon:'\ud83d\udccb', texte:'La **coh\u00e9rence documentaire** consiste \u00e0 v\u00e9rifier que tous les documents d\u2019un dossier racontent la **m\u00eame histoire** sur le client final' },
    { icon:'\u26a0\ufe0f', texte:'Une incoh\u00e9rence = des informations contradictoires entre deux ou plusieurs documents du dossier' },
    { icon:'\ud83d\udd0d', texte:'Exemples\u00a0: pr\u00e9nom diff\u00e9rent entre passeport et contrat, adresse incompatible entre KYC et justificatif de domicile' },
    { icon:'\ud83d\udcce', texte:'C\u2019est le **travail principal d\u2019i-Hub**\u00a0: toute incoh\u00e9rence visible est signal\u00e9e au PSF, qui demande des clarifications \u00e0 son client final' },
  ], aretenir:'Coh\u00e9rence = tous les documents racontent la m\u00eame histoire. Toute contradiction visible = signal au PSF.' },

  { id:2, emoji:'\ud83d\udccb', titre:'Les cat\u00e9gories de documents KYC', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Identit\u00e9**\u00a0: passeport, carte d\u2019identit\u00e9, permis de conduire \u2014 prouvent qui est la personne' },
    { icon:'\ud83c\udfe0', texte:'**Domicile**\u00a0: facture (eau, gaz, \u00e9lectricit\u00e9), relev\u00e9 bancaire, avis d\u2019imposition \u2014 prouvent o\u00f9 vit la personne' },
    { icon:'\ud83d\udcbc', texte:'**Activit\u00e9 professionnelle**\u00a0: contrat de travail, extrait Kbis, statuts de soci\u00e9t\u00e9 \u2014 prouvent ce que fait la personne' },
    { icon:'\ud83d\udcb5', texte:'**Source des fonds**\u00a0: bulletins de salaire, relevés de compte, acte de vente \u2014 prouvent d\u2019o\u00f9 vient l\u2019argent' },
  ], aretenir:'4 cat\u00e9gories de documents KYC. i-Hub v\u00e9rifie la coh\u00e9rence entre eux \u2014 chaque document doit confirmer les autres.' },

  { id:3, emoji:'\ud83c\udf1f', titre:'Les points de coh\u00e9rence \u00e0 v\u00e9rifier', contenu:[
    { icon:'\ud83d\udcdd', texte:'**Nom et pr\u00e9nom**\u00a0: identiques sur tous les documents (attention aux variations orthographiques, noms compos\u00e9s, traits d\u2019union)' },
    { icon:'\ud83c\udfe0', texte:'**Adresse**\u00a0: coh\u00e9rente entre le formulaire KYC, le justificatif de domicile et les autres documents' },
    { icon:'\ud83c\udf82', texte:'**Date de naissance**\u00a0: identique sur le passeport, la carte d\u2019identit\u00e9 et les autres documents officiels' },
    { icon:'\ud83c\uddf3\ud83c\uddf1', texte:'**Nationalit\u00e9**\u00a0: coh\u00e9rente avec le passeport pr\u00e9sent\u00e9 et la r\u00e9sidence fiscale d\u00e9clar\u00e9e' },
  ], aretenir:'Nom, adresse, date de naissance, nationalit\u00e9 \u2014 4 points fondamentaux \u00e0 v\u00e9rifier en crois\u00e9 sur tous les documents du dossier.' },

  { id:4, emoji:'\ud83d\udcf8', titre:'V\u00e9rification de la photo et des donn\u00e9es biom\u00e9triques', contenu:[
    { icon:'\ud83d\udcf8', texte:'La **photo** sur le document d\u2019identit\u00e9 doit \u00eatre visible, lisible et correspondre \u00e0 une vraie personne (pas flou\u00e9e, non coup\u00e9e)' },
    { icon:'\ud83d\udcf0', texte:'La **MRZ** (zone lisible par machine, lignes en bas du passeport) doit \u00eatre pr\u00e9sente et lisible' },
    { icon:'\u26a0\ufe0f', texte:'Signes suspects\u00a0: photo modifi\u00e9e, pliure suspect sur la zone photo, donn\u00e9es MRZ qui ne correspondent pas au corps du document' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale tout document difficile \u00e0 lire ou pr\u00e9sentant des signes visuels suspects \u2014 jamais d\u2019expertise en authentification' },
  ], aretenir:'Photo visible + MRZ lisible = conditions minimales. i-Hub signale les documents illisibles ou visuellement suspects au PSF.' },

  { id:5, emoji:'\ud83d\udcc5', titre:'La validit\u00e9 dans le temps', contenu:[
    { icon:'\u23f0', texte:'Tout document d\u2019identit\u00e9 **expir\u00e9** est signal\u00e9 au PSF \u2014 m\u00eame si les donn\u00e9es semblent correctes' },
    { icon:'\ud83d\udcdd', texte:'Un **justificatif de domicile** doit g\u00e9n\u00e9ralement dater de moins de **3 mois** \u2014 une facture de 2019 n\u2019est pas valide' },
    { icon:'\ud83d\udd04', texte:'Une **source des fonds** dat\u00e9e de plusieurs ann\u00e9es peut ne plus \u00eatre pertinente selon le contexte' },
    { icon:'\ud83d\uded1', texte:'R\u00e8gle\u00a0: tout document expir\u00e9 ou dont la date soul\u00e8ve une question = signal au PSF, qui d\u00e9cide de la suite' },
  ], aretenir:'Document expir\u00e9 = signal au PSF. Justificatif de domicile > 3 mois = signal. i-Hub ne valide pas un dossier avec des documents p\u00e9rim\u00e9s.' },

  { id:6, emoji:'\ud83c\udfe0', titre:'Coh\u00e9rence de l\u2019adresse', contenu:[
    { icon:'\ud83d\udce8', texte:'L\u2019adresse sur le **formulaire KYC** doit correspondre \u00e0 celle du **justificatif de domicile** transmis' },
    { icon:'\u26a0\ufe0f', texte:'Incoh\u00e9rence fr\u00e9quente\u00a0: KYC indique Luxembourg mais justificatif de domicile est une facture \u00e9trang\u00e8re' },
    { icon:'\ud83d\udccc', texte:'Une **deuxi\u00e8me adresse** (r\u00e9sidence secondaire, adresse professionnelle) peut \u00eatre l\u00e9gitime \u2014 \u00e0 documenter' },
    { icon:'\ud83d\udea8', texte:'Une adresse **c/o** ou **hold mail** comme seule adresse = anomalie \u00e0 signaler (aussi indice FATCA n\u00b06)' },
  ], aretenir:'Adresse KYC = adresse justificatif de domicile. Toute diff\u00e9rence = signal au PSF. Adresse c/o seule = anomalie majeure.' },

  { id:7, emoji:'\ud83d\udcbc', titre:'Coh\u00e9rence professionnelle', contenu:[
    { icon:'\ud83d\udcbc', texte:'L\u2019activit\u00e9 professionnelle d\u00e9clar\u00e9e doit \u00eatre coh\u00e9rente avec les **justificatifs fournis** (contrat de travail, Kbis\u2026)' },
    { icon:'\ud83d\udcb0', texte:'La **source des fonds** doit \u00eatre compatible avec l\u2019activit\u00e9 professionnelle\u00a0: un employ\u00e9 modeste ne peut pas justifier des millions' },
    { icon:'\u26a0\ufe0f', texte:'Incoh\u00e9rence\u00a0: client d\u00e9clar\u00e9 \u00ab\u00a0retrait\u00e9\u00a0\u00bb mais justificatif montre un contrat de travail actif' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale l\u2019incoh\u00e9rence visible \u2014 c\u2019est le PSF qui demande des \u00e9claircissements \u00e0 son client final' },
  ], aretenir:'Profession + source des fonds doivent \u00eatre coh\u00e9rentes. Un \u00e9cart visible entre les deux est signal\u00e9 au PSF.' },

  { id:8, emoji:'\ud83d\udcb0', titre:'Coh\u00e9rence de la source des fonds', contenu:[
    { icon:'\ud83d\udcb0', texte:'Les **fonds d\u00e9pos\u00e9s** doivent \u00eatre justifiables par les documents fournis\u00a0: salaire, h\u00e9ritage, vente immobili\u00e8re, dividendes' },
    { icon:'\u26a0\ufe0f', texte:'Signal d\u2019alerte\u00a0: montant des fonds bien sup\u00e9rieur \u00e0 ce que le profil professionnel permet de justifier' },
    { icon:'\ud83d\udcdd', texte:'Un **acte notari\u00e9 de vente**, un **relev\u00e9 d\u2019h\u00e9ritage**, un **bulletin de salaire** sont des justificatifs valables' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la **pr\u00e9sence** des justificatifs demand\u00e9s et leur **coh\u00e9rence** avec le profil \u2014 pas leur v\u00e9racit\u00e9 comptable' },
  ], aretenir:'Source des fonds doit \u00eatre document\u00e9e et coh\u00e9rente avec le profil. i-Hub v\u00e9rifie la pr\u00e9sence et la coh\u00e9rence visible.' },

  { id:9, emoji:'\ud83c\udfe2', titre:'Les documents d\u2019entit\u00e9', contenu:[
    { icon:'\ud83d\udcdc', texte:'Pour une **personne morale**\u00a0: extrait Kbis ou \u00e9quivalent, statuts, liste des dirigeants et actionnaires' },
    { icon:'\ud83d\udc64', texte:'Les informations sur les **dirigeants** dans les statuts doivent correspondre aux documents d\u2019identit\u00e9 fournis' },
    { icon:'\ud83d\udcca', texte:'La **structure d\u2019actionnariat** dans les statuts doit \u00eatre coh\u00e9rente avec le formulaire UBO transmis par le PSF' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale toute discordance entre les statuts, le Kbis et la d\u00e9claration UBO \u2014 le PSF clarifie avec son client final' },
  ], aretenir:'Pour une entit\u00e9\u00a0: Kbis + statuts + d\u00e9claration UBO doivent \u00eatre coh\u00e9rents entre eux. Tout \u00e9cart = signal au PSF.' },

  { id:10, emoji:'\u26a0\ufe0f', titre:'Les incoh\u00e9rences les plus fr\u00e9quentes', contenu:[
    { icon:'\ud83d\udd34', texte:'**Nom diff\u00e9rent**\u00a0: pr\u00e9nom abr\u00e9g\u00e9 sur un document, nom de jeune fille vs nom mari\u00e9, orthographe variable' },
    { icon:'\ud83d\udd34', texte:'**Adresse incompatible**\u00a0: ville diff\u00e9rente entre KYC et justificatif, pays diff\u00e9rent entre domicile et r\u00e9sidence fiscale' },
    { icon:'\ud83d\udd34', texte:'**Date de naissance diff\u00e9rente**\u00a0: m\u00eame si \u00e9cart d\u2019un seul jour \u2014 peut indiquer une erreur de saisie ou un document falsifi\u00e9' },
    { icon:'\ud83d\udd34', texte:'**Nationalit\u00e9 incoh\u00e9rente**\u00a0: passeport fran\u00e7ais mais formulaire KYC indique nationalit\u00e9 suisse' },
    { icon:'\ud83d\udd34', texte:'**Document expir\u00e9**\u00a0: passeport expir\u00e9 depuis 2 ans dans le dossier' },
  ], aretenir:'Les 5 incoh\u00e9rences les plus fr\u00e9quentes\u00a0: nom, adresse, date de naissance, nationalit\u00e9, expiration. i-Hub les d\u00e9tecte et signale.' },

  { id:11, emoji:'\ud83d\udcdd', titre:'La m\u00e9thode de v\u00e9rification crois\u00e9e', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Lire chaque document** individuellement et noter les informations cl\u00e9s (nom, adresse, date, nationalit\u00e9)' },
    { icon:'2\ufe0f\u20e3', texte:'**Comparer** les informations entre documents deux \u00e0 deux \u2014 passeport vs KYC, KYC vs justificatif domicile\u2026' },
    { icon:'3\ufe0f\u20e3', texte:'**Identifier** toute discordance, m\u00eame mineure \u2014 les petites incoh\u00e9rences peuvent en cacher de grandes' },
    { icon:'4\ufe0f\u20e3', texte:'**Documenter et signaler** au PSF chaque incoh\u00e9rence d\u00e9tect\u00e9e avec pr\u00e9cision' },
  ], aretenir:'M\u00e9thode\u00a0: lire \u2192 comparer \u2192 identifier \u2192 documenter \u2192 signaler. Syst\u00e9matique sur chaque dossier, sans exception.' },

  { id:12, emoji:'\ud83d\uded1', titre:'Ce que i-Hub NE v\u00e9rifie PAS', contenu:[
    { icon:'\u274c', texte:'i-Hub ne v\u00e9rifie **pas** l\u2019authenticit\u00e9 des documents (faux papiers) \u2014 il n\u2019est pas expert en falsification' },
    { icon:'\u274c', texte:'i-Hub ne v\u00e9rifie **pas** les bases de donn\u00e9es externes (registres nationaux, bases p\u00e9nales) \u2014 c\u2019est hors p\u00e9rim\u00e8tre' },
    { icon:'\u274c', texte:'i-Hub ne **d\u00e9cide pas** si le client final est acceptable ou non \u2014 c\u2019est la responsabilit\u00e9 du PSF' },
    { icon:'\u274c', texte:'i-Hub ne **corrige pas** les documents \u2014 il signale et archive, le PSF demande les corrections \u00e0 son client final' },
  ], aretenir:'i-Hub d\u00e9tecte les incoh\u00e9rences visibles. Il ne d\u00e9tecte pas les faux, ne consulte pas de bases externes, ne d\u00e9cide pas.' },

  { id:13, emoji:'\ud83d\udcce', titre:'Comment documenter une incoh\u00e9rence', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Pr\u00e9ciser le document concern\u00e9**\u00a0: passeport n\u00b0XXX, formulaire KYC dat\u00e9 du JJ/MM/AAAA' },
    { icon:'2\ufe0f\u20e3', texte:'**D\u00e9crire l\u2019incoh\u00e9rence**\u00a0: \u00ab\u00a0Pr\u00e9nom \u00abJean-Marie\u00bb sur le passeport vs \u00abJean\u00bb sur le KYC\u00a0\u00bb' },
    { icon:'3\ufe0f\u20e3', texte:'**Signaler au PSF** dans le rapport de v\u00e9rification, avec la mention claire de l\u2019anomalie d\u00e9tect\u00e9e' },
    { icon:'4\ufe0f\u20e3', texte:'**Archiver** le rapport \u2014 i-Hub conserve la trace de chaque v\u00e9rification pour sa propre protection' },
  ], aretenir:'Documenter = pr\u00e9cision + description + rapport. Pas de vague ment\u00e9 \u00ab\u00a0incoh\u00e9rence\u00a0\u00bb \u2014 d\u00e9crire exactement ce qui diff\u00e8re.' },

  { id:14, emoji:'\ud83c\udf1f', titre:'La notion d\u2019incoh\u00e9rence mat\u00e9rielle', contenu:[
    { icon:'\ud83d\udfe2', texte:'**Incoh\u00e9rence non-mat\u00e9rielle**\u00a0: diff\u00e9rence mineure sans impact sur l\u2019identification (ex\u00a0: \u00ab\u00a0Rue\u00a0\u00bb vs \u00ab\u00a0Avenue\u00a0\u00bb) \u2014 signal\u00e9 quand m\u00eame' },
    { icon:'\ud83d\udfe1', texte:'**Incoh\u00e9rence mat\u00e9rielle**\u00a0: diff\u00e9rence sur le nom, la date de naissance ou la nationalit\u00e9 \u2014 signal d\u2019alerte prioritaire' },
    { icon:'\ud83d\udd34', texte:'**Incoh\u00e9rence critique**\u00a0: document expir\u00e9 + incoh\u00e9rence sur le nom + adresse incompatible \u2014 cumul qui augmente le risque' },
    { icon:'\ud83d\udccc', texte:'Toute incoh\u00e9rence \u2014 quelle que soit son importance apparent \u2014 est signal\u00e9e. C\u2019est le PSF qui \u00e9value l\u2019impact' },
  ], aretenir:'i-Hub signale toute incoh\u00e9rence, m\u00eame mineure. C\u2019est le PSF qui d\u00e9cide si c\u2019est mat\u00e9riel ou non. Ne pas filtrer.' },

  { id:15, emoji:'\ud83c\udf10', titre:'Les diff\u00e9rences culturelles et orthographiques', contenu:[
    { icon:'\ud83c\udf10', texte:'Certaines incoh\u00e9rences apparentes sont des **diff\u00e9rences culturelles l\u00e9gitimes**\u00a0: translitt\u00e9ration arabe/cyrillique/chinoise' },
    { icon:'\ud83d\udcdd', texte:'Exemples\u00a0: \u00ab\u00a0Mohammed\u00a0\u00bb / \u00ab\u00a0Mohamed\u00a0\u00bb / \u00ab\u00a0Muhammad\u00a0\u00bb peuvent \u00eatre la m\u00eame personne avec des documents diff\u00e9rents' },
    { icon:'\u26a0\ufe0f', texte:'M\u00eame en cas de diff\u00e9rence culturelle explicable, i-Hub **signale quand m\u00eame** au PSF avec la mention de l\u2019explication possible' },
    { icon:'\ud83d\udccc', texte:'C\u2019est le PSF qui confirme avec son client final que les documents correspondent bien \u00e0 la m\u00eame personne' },
  ], aretenir:'Diff\u00e9rences culturelles = signal avec note d\u2019explication possible. i-Hub ne tranche pas seul \u2014 le PSF confirme avec son client final.' },

  { id:16, emoji:'\ud83d\udcca', titre:'Le dossier incomplet', contenu:[
    { icon:'\ud83d\uded1', texte:'Un dossier **incomplet** (document manquant) est signal\u00e9 au PSF avec la liste pr\u00e9cise des documents manquants' },
    { icon:'\ud83d\udcdd', texte:'i-Hub ne valide pas un dossier partiel \u2014 m\u00eame si les documents pr\u00e9sents sont tous coh\u00e9rents' },
    { icon:'\ud83d\udce2', texte:'Le signal au PSF pr\u00e9cise\u00a0: document attendu selon le SLA, nature de ce qui manque, impact sur la validation possible' },
    { icon:'\u23f0', texte:'i-Hub ne fixe pas de d\u00e9lai au PSF \u2014 c\u2019est le PSF qui g\u00e8re le suivi avec son client final et les \u00e9ch\u00e9ances r\u00e9glementaires' },
  ], aretenir:'Dossier incomplet = signal avec liste des manquants. i-Hub ne valide pas partiellement. Le PSF g\u00e8re les relances.' },

  { id:17, emoji:'\ud83d\udd25', titre:'Les red flags suppl\u00e9mentaires', contenu:[
    { icon:'\ud83d\udd34', texte:'**Multiple versions** d\u2019un m\u00eame document dans le dossier (deux justificatifs de domicile contradictoires)' },
    { icon:'\ud83d\udd34', texte:'**Document modifi\u00e9** visuellement\u00a0: pixels suspects, bords irreg\u00f3uliers, police diff\u00e9rente sur une partie du document' },
    { icon:'\ud83d\udd34', texte:'**Informations saisies** qui ne correspondent pas aux documents scann\u00e9s (erreur de saisie ou manipulation)' },
    { icon:'\ud83d\udd34', texte:'**Refus de fournir** un document demand\u00e9 sans justification valide \u2014 signal\u00e9 au PSF m\u00eame si hors SLA' },
  ], aretenir:'Documents multiples contradictoires, visuellement suspects ou refus de fournir = red flags \u00e0 signaler imm\u00e9diatement au PSF.' },

  { id:18, emoji:'\ud83d\udcf1', titre:'La v\u00e9rification \u00e0 distance (documents num\u00e9riques)', contenu:[
    { icon:'\ud83d\udcf1', texte:'Les documents transmis num\u00e9riquement (scan, photo, PDF) sont les plus fr\u00e9quents \u2014 m\u00eame rigueur que pour les originaux' },
    { icon:'\u26a0\ufe0f', texte:'Limites de la num\u00e9risation\u00a0: certaines falsifications ne sont d\u00e9tectables qu\u2019\u00e0 l\u2019examen physique \u2014 hors p\u00e9rim\u00e8tre i-Hub' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale les documents **illisibles** (trop sombres, flous, coup\u00e9s) et demande une retransmission via le PSF' },
    { icon:'\ud83d\udcdc', texte:'Les **exigences de r\u00e9solution minimale** pour les documents num\u00e9riques sont d\u00e9finies dans le SLA avec le PSF' },
  ], aretenir:'Document num\u00e9rique illisible = signal au PSF pour retransmission. i-Hub ne peut pas valider un document illisible.' },

  { id:19, emoji:'\ud83d\udca1', titre:'Les 3 questions de la v\u00e9rification de coh\u00e9rence', contenu:[
    { icon:'\u2753', texte:'**Est-ce que les documents pr\u00e9sents se confirment mutuellement\u00a0?** \u2014 nom, adresse, date de naissance, nationalit\u00e9 concordants' },
    { icon:'\u2753', texte:'**Est-ce que les documents sont tous valides\u00a0?** \u2014 non expir\u00e9s, lisibles, non modifi\u00e9s visuellement' },
    { icon:'\u2753', texte:'**Est-ce que le dossier est complet\u00a0?** \u2014 tous les documents requis par le SLA sont pr\u00e9sents' },
  ], aretenir:'3 questions\u00a0: concordance \u2192 validit\u00e9 \u2192 compl\u00e9tude. Si une r\u00e9ponse est \u00ab\u00a0non\u00a0\u00bb ou \u00ab\u00a0incertain\u00a0\u00bb = signal au PSF.' },

  { id:20, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: la v\u00e9rification de coh\u00e9rence en pratique', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Recevoir** le dossier transmis par le PSF avec l\u2019ensemble des documents KYC' },
    { icon:'2\ufe0f\u20e3', texte:'**V\u00e9rifier** chaque document individuellement (validit\u00e9, lisibilit\u00e9, compl\u00e9tude)' },
    { icon:'3\ufe0f\u20e3', texte:'**Comparer** en crois\u00e9 toutes les informations cl\u00e9s entre documents' },
    { icon:'4\ufe0f\u20e3', texte:'**Signaler** au PSF toute incoh\u00e9rence ou document manquant, avec pr\u00e9cision' },
    { icon:'5\ufe0f\u20e3', texte:'**Archiver** le rapport de v\u00e9rification dat\u00e9 \u2014 protection d\u2019i-Hub et tra\u00e7abilit\u00e9' },
  ], aretenir:'Recevoir \u2192 V\u00e9rifier \u2192 Comparer \u2192 Signaler \u2192 Archiver. i-Hub ne d\u00e9cide pas, ne corrige pas \u2014 il d\u00e9tecte et signale.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udd0d', titre:'What is documentary consistency?', contenu:[
    { icon:'\ud83d\udccb', texte:'**Documentary consistency** means verifying that all documents in a file tell the **same story** about the final client' },
    { icon:'\u26a0\ufe0f', texte:'An inconsistency = contradictory information between two or more documents in the file' },
    { icon:'\ud83d\udd0d', texte:'Examples: different first name between passport and contract, address mismatch between KYC and proof of residence' },
    { icon:'\ud83d\udcce', texte:'This is **i-Hub\u2019s core work**: any visible inconsistency is flagged to the PSF, which seeks clarification from its final client' },
  ], aretenir:'Consistency = all documents tell the same story. Any visible contradiction = flag to PSF.' },
  { id:2, emoji:'\ud83d\udccb', titre:'KYC document categories', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Identity**: passport, ID card, driving licence \u2014 prove who the person is' },
    { icon:'\ud83c\udfe0', texte:'**Residence**: utility bill, bank statement, tax notice \u2014 prove where the person lives' },
    { icon:'\ud83d\udcbc', texte:'**Professional activity**: employment contract, company extract, articles \u2014 prove what the person does' },
    { icon:'\ud83d\udcb5', texte:'**Source of funds**: payslips, bank statements, sale deed \u2014 prove where the money comes from' },
  ], aretenir:'4 KYC document categories. i-Hub checks consistency between them \u2014 each document must confirm the others.' },
  { id:3, emoji:'\ud83c\udf1f', titre:'Consistency points to verify', contenu:[
    { icon:'\ud83d\udcdd', texte:'**Name**: identical on all documents (watch for spelling variations, compound names, hyphens)' },
    { icon:'\ud83c\udfe0', texte:'**Address**: consistent between KYC form, proof of residence and other documents' },
    { icon:'\ud83c\udf82', texte:'**Date of birth**: identical on passport, ID card and other official documents' },
    { icon:'\ud83c\uddf3\ud83c\uddf1', texte:'**Nationality**: consistent with the presented passport and declared tax residence' },
  ], aretenir:'Name, address, date of birth, nationality \u2014 4 fundamental points to cross-check across all documents in the file.' },
  { id:4, emoji:'\ud83d\udcf8', titre:'Photo and biometric data verification', contenu:[
    { icon:'\ud83d\udcf8', texte:'The **photo** on the identity document must be visible, legible and show a real person (not blurred, not cut off)' },
    { icon:'\ud83d\udcf0', texte:'The **MRZ** (machine readable zone, lines at the bottom of the passport) must be present and legible' },
    { icon:'\u26a0\ufe0f', texte:'Suspicious signs: modified photo, suspicious fold on photo area, MRZ data not matching the document body' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags any difficult-to-read document or one showing visual suspicious signs \u2014 never performs authentication expertise' },
  ], aretenir:'Visible photo + legible MRZ = minimum conditions. i-Hub flags illegible or visually suspicious documents to PSF.' },
  { id:5, emoji:'\ud83d\udcc5', titre:'Validity over time', contenu:[
    { icon:'\u23f0', texte:'Any **expired** identity document is flagged to the PSF \u2014 even if the data seems correct' },
    { icon:'\ud83d\udcdd', texte:'A **proof of residence** must generally be less than **3 months old** \u2014 a 2019 utility bill is not valid' },
    { icon:'\ud83d\udd04', texte:'A **source of funds** document several years old may no longer be relevant depending on context' },
    { icon:'\ud83d\uded1', texte:'Rule: any expired document or one whose date raises a question = flag to PSF, which decides on next steps' },
  ], aretenir:'Expired document = flag to PSF. Proof of residence > 3 months = flag. i-Hub does not validate a file with outdated documents.' },
  { id:6, emoji:'\ud83c\udfe0', titre:'Address consistency', contenu:[
    { icon:'\ud83d\udce8', texte:'The address on the **KYC form** must match the one on the **proof of residence** transmitted' },
    { icon:'\u26a0\ufe0f', texte:'Common inconsistency: KYC states Luxembourg but proof of residence is a foreign utility bill' },
    { icon:'\ud83d\udccc', texte:'A **second address** (secondary residence, business address) may be legitimate \u2014 to be documented' },
    { icon:'\ud83d\udea8', texte:'A **care of** or **hold mail** address as the only address = anomaly to flag (also FATCA indicium #6)' },
  ], aretenir:'KYC address = proof of residence address. Any difference = flag to PSF. Care of as only address = major anomaly.' },
  { id:7, emoji:'\ud83d\udcbc', titre:'Professional consistency', contenu:[
    { icon:'\ud83d\udcbc', texte:'The declared professional activity must be consistent with the **supporting documents** provided (employment contract, company extract\u2026)' },
    { icon:'\ud83d\udcb0', texte:'The **source of funds** must be compatible with the professional activity: a modest employee cannot justify millions' },
    { icon:'\u26a0\ufe0f', texte:'Inconsistency: client declared as \u201cretired\u201d but document shows an active employment contract' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags the visible inconsistency \u2014 the PSF seeks clarification from its final client' },
  ], aretenir:'Profession + source of funds must be consistent. A visible gap between the two is flagged to PSF.' },
  { id:8, emoji:'\ud83d\udcb0', titre:'Source of funds consistency', contenu:[
    { icon:'\ud83d\udcb0', texte:'**Deposited funds** must be justifiable by documents provided: salary, inheritance, property sale, dividends' },
    { icon:'\u26a0\ufe0f', texte:'Alert signal: fund amount significantly exceeding what the professional profile can justify' },
    { icon:'\ud83d\udcdd', texte:'A **notarial sale deed**, **inheritance statement**, **payslip** are valid supporting documents' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies the **presence** of required documents and their **consistency** with the profile \u2014 not their accounting accuracy' },
  ], aretenir:'Source of funds must be documented and consistent with the profile. i-Hub checks visible presence and consistency.' },
  { id:9, emoji:'\ud83c\udfe2', titre:'Entity documents', contenu:[
    { icon:'\ud83d\udcdc', texte:'For a **legal entity**: company extract or equivalent, articles of association, list of directors and shareholders' },
    { icon:'\ud83d\udc64', texte:'Information on **directors** in the articles must match the identity documents provided' },
    { icon:'\ud83d\udcca', texte:'The **shareholding structure** in the articles must be consistent with the UBO form transmitted by the PSF' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags any discrepancy between articles, company extract and UBO declaration \u2014 PSF clarifies with its final client' },
  ], aretenir:'For an entity: company extract + articles + UBO declaration must be consistent. Any discrepancy = flag to PSF.' },
  { id:10, emoji:'\u26a0\ufe0f', titre:'The most common inconsistencies', contenu:[
    { icon:'\ud83d\udd34', texte:'**Different name**: abbreviated first name on one document, maiden vs married name, spelling variation' },
    { icon:'\ud83d\udd34', texte:'**Incompatible address**: different city between KYC and proof, different country between domicile and tax residence' },
    { icon:'\ud83d\udd34', texte:'**Different date of birth**: even a one-day difference \u2014 may indicate a data entry error or falsified document' },
    { icon:'\ud83d\udd34', texte:'**Inconsistent nationality**: French passport but KYC form states Swiss nationality' },
    { icon:'\ud83d\udd34', texte:'**Expired document**: passport expired 2 years ago still in the file' },
  ], aretenir:'5 most common inconsistencies: name, address, date of birth, nationality, expiry. i-Hub detects and flags them.' },
  { id:11, emoji:'\ud83d\udcdd', titre:'The cross-verification method', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Read each document** individually and note key information (name, address, date, nationality)' },
    { icon:'2\ufe0f\u20e3', texte:'**Compare** information between documents two by two \u2014 passport vs KYC, KYC vs proof of residence\u2026' },
    { icon:'3\ufe0f\u20e3', texte:'**Identify** any discrepancy, even minor \u2014 small inconsistencies may hide larger ones' },
    { icon:'4\ufe0f\u20e3', texte:'**Document and flag** to PSF each detected inconsistency with precision' },
  ], aretenir:'Method: read \u2192 compare \u2192 identify \u2192 document \u2192 flag. Systematic on every file, without exception.' },
  { id:12, emoji:'\ud83d\uded1', titre:'What i-Hub does NOT verify', contenu:[
    { icon:'\u274c', texte:'i-Hub does **not** verify document authenticity (forged papers) \u2014 it is not a forgery expert' },
    { icon:'\u274c', texte:'i-Hub does **not** check external databases (national registers, criminal records) \u2014 outside scope' },
    { icon:'\u274c', texte:'i-Hub does **not decide** whether the final client is acceptable or not \u2014 PSF\u2019s responsibility' },
    { icon:'\u274c', texte:'i-Hub does **not correct** documents \u2014 it flags and archives, PSF requests corrections from its final client' },
  ], aretenir:'i-Hub detects visible inconsistencies. It does not detect forgeries, does not consult external databases, does not decide.' },
  { id:13, emoji:'\ud83d\udcce', titre:'How to document an inconsistency', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Specify the document**: passport no. XXX, KYC form dated DD/MM/YYYY' },
    { icon:'2\ufe0f\u20e3', texte:'**Describe the inconsistency**: \u201cFirst name \u2018Jean-Marie\u2019 on passport vs \u2018Jean\u2019 on KYC\u201d' },
    { icon:'3\ufe0f\u20e3', texte:'**Flag to PSF** in the verification report, with a clear mention of the detected anomaly' },
    { icon:'4\ufe0f\u20e3', texte:'**Archive** the report \u2014 i-Hub retains a record of every verification for its own protection' },
  ], aretenir:'Document = precision + description + report. Not a vague \u201cinconsistency\u201d \u2014 describe exactly what differs.' },
  { id:14, emoji:'\ud83c\udf1f', titre:'The concept of material inconsistency', contenu:[
    { icon:'\ud83d\udfe2', texte:'**Non-material inconsistency**: minor difference with no identification impact (e.g. \u201cStreet\u201d vs \u201cRoad\u201d) \u2014 still flagged' },
    { icon:'\ud83d\udfe1', texte:'**Material inconsistency**: difference on name, date of birth or nationality \u2014 priority alert signal' },
    { icon:'\ud83d\udd34', texte:'**Critical inconsistency**: expired document + name inconsistency + incompatible address \u2014 accumulation increases risk' },
    { icon:'\ud83d\udccc', texte:'Any inconsistency \u2014 whatever its apparent importance \u2014 is flagged. The PSF assesses the impact' },
  ], aretenir:'i-Hub flags every inconsistency, even minor ones. The PSF decides whether it is material. Do not filter.' },
  { id:15, emoji:'\ud83c\udf10', titre:'Cultural and spelling differences', contenu:[
    { icon:'\ud83c\udf10', texte:'Some apparent inconsistencies are **legitimate cultural differences**: Arabic/Cyrillic/Chinese transliteration' },
    { icon:'\ud83d\udcdd', texte:'Examples: \u201cMohammed\u201d / \u201cMohamed\u201d / \u201cMuhammad\u201d may be the same person with different documents' },
    { icon:'\u26a0\ufe0f', texte:'Even with an explainable cultural difference, i-Hub **still flags** to the PSF with a note of the possible explanation' },
    { icon:'\ud83d\udccc', texte:'The PSF confirms with its final client that the documents indeed belong to the same person' },
  ], aretenir:'Cultural differences = flag with possible explanation note. i-Hub does not decide alone \u2014 the PSF confirms with its final client.' },
  { id:16, emoji:'\ud83d\udcca', titre:'The incomplete file', contenu:[
    { icon:'\ud83d\uded1', texte:'An **incomplete** file (missing document) is flagged to the PSF with the precise list of missing documents' },
    { icon:'\ud83d\udcdd', texte:'i-Hub does not validate a partial file \u2014 even if the documents present are all consistent' },
    { icon:'\ud83d\udce2', texte:'The flag to PSF specifies: document expected per SLA, nature of what is missing, impact on possible validation' },
    { icon:'\u23f0', texte:'i-Hub does not set deadlines for the PSF \u2014 the PSF manages follow-up with its final client and regulatory deadlines' },
  ], aretenir:'Incomplete file = flag with list of missing items. i-Hub does not partially validate. PSF manages follow-ups.' },
  { id:17, emoji:'\ud83d\udd25', titre:'Additional red flags', contenu:[
    { icon:'\ud83d\udd34', texte:'**Multiple versions** of the same document in the file (two contradictory proofs of residence)' },
    { icon:'\ud83d\udd34', texte:'**Visually modified document**: suspicious pixels, irregular edges, different font on part of the document' },
    { icon:'\ud83d\udd34', texte:'**Data entry inconsistent** with scanned documents (entry error or manipulation)' },
    { icon:'\ud83d\udd34', texte:'**Refusal to provide** a requested document without valid justification \u2014 flagged to PSF even if outside SLA' },
  ], aretenir:'Multiple contradictory documents, visually suspicious or refusal to provide = red flags to flag immediately to PSF.' },
  { id:18, emoji:'\ud83d\udcf1', titre:'Remote verification (digital documents)', contenu:[
    { icon:'\ud83d\udcf1', texte:'Digitally transmitted documents (scan, photo, PDF) are most common \u2014 same rigour as for originals' },
    { icon:'\u26a0\ufe0f', texte:'Scanning limitations: some falsifications are only detectable upon physical examination \u2014 outside i-Hub scope' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags **illegible** documents (too dark, blurry, cut off) and requests retransmission via PSF' },
    { icon:'\ud83d\udcdc', texte:'**Minimum resolution requirements** for digital documents are defined in the SLA with the PSF' },
  ], aretenir:'Illegible digital document = flag to PSF for retransmission. i-Hub cannot validate an illegible document.' },
  { id:19, emoji:'\ud83d\udca1', titre:'The 3 consistency verification questions', contenu:[
    { icon:'\u2753', texte:'**Do the documents present confirm each other?** \u2014 name, address, date of birth, nationality all consistent' },
    { icon:'\u2753', texte:'**Are all documents valid?** \u2014 not expired, legible, not visually modified' },
    { icon:'\u2753', texte:'**Is the file complete?** \u2014 all documents required by the SLA are present' },
  ], aretenir:'3 questions: concordance \u2192 validity \u2192 completeness. If any answer is \u201cno\u201d or \u201cuncertain\u201d = flag to PSF.' },
  { id:20, emoji:'\ud83c\udf93', titre:'Summary: consistency verification in practice', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Receive** the file transmitted by the PSF with all KYC documents' },
    { icon:'2\ufe0f\u20e3', texte:'**Verify** each document individually (validity, legibility, completeness)' },
    { icon:'3\ufe0f\u20e3', texte:'**Cross-compare** all key information between documents' },
    { icon:'4\ufe0f\u20e3', texte:'**Flag** to PSF any inconsistency or missing document, with precision' },
    { icon:'5\ufe0f\u20e3', texte:'**Archive** the dated verification report \u2014 i-Hub\u2019s protection and traceability' },
  ], aretenir:'Receive \u2192 Verify \u2192 Compare \u2192 Flag \u2192 Archive. i-Hub does not decide, does not correct \u2014 it detects and flags.' },
]

const COHERENCE_FR = [
  { situation:'Passeport au nom de "Jean-Marie Dupont" mais formulaire KYC indique "Jean Dupont"', isIncoherence:true, explication:'Diff\u00e9rence sur le pr\u00e9nom = incoh\u00e9rence mat\u00e9rielle. i-Hub signale au PSF qui clarifie avec son client final.' },
  { situation:'Passeport fran\u00e7ais valide + justificatif de domicile luxembourgeois r\u00e9cent', isIncoherence:false, explication:'Nationalit\u00e9 fran\u00e7aise avec r\u00e9sidence luxembourgeoise = situation l\u00e9gitime et fr\u00e9quente au Luxembourg. Pas d\u2019incoh\u00e9rence.' },
  { situation:'Date de naissance 15/03/1985 sur passeport vs 15/03/1958 sur formulaire KYC', isIncoherence:true, explication:'\u00c9cart de 27 ans sur la date de naissance = incoh\u00e9rence critique. Probable erreur de saisie ou confusion de dossiers. Signal imm\u00e9diat au PSF.' },
  { situation:'Justificatif de domicile dat\u00e9 de janvier (il y a 2 mois)', isIncoherence:false, explication:'Justificatif de moins de 3 mois = valide. Pas d\u2019incoh\u00e9rence sur la date.' },
  { situation:'Adresse "12 Rue de la Paix, Luxembourg" sur KYC mais justificatif de domicile \u00e0 "12 Rue de la Paix, Paris"', isIncoherence:true, explication:'Pays diff\u00e9rents entre KYC et justificatif de domicile = incoh\u00e9rence mat\u00e9rielle. Signal au PSF.' },
  { situation:'Photo passeport l\u00e9g\u00e8rement floue mais document visible et lisible dans l\u2019ensemble', isIncoherence:false, explication:'Document lisible dans l\u2019ensemble = acceptable. La l\u00e9g\u00e8re flou n\u2019emp\u00eache pas l\u2019identification. Pas de signal n\u00e9cessaire.' },
  { situation:'Passeport expir\u00e9 depuis 6 mois dans le dossier', isIncoherence:true, explication:'Document expir\u00e9 = invalide, m\u00eame si les donn\u00e9es sont correctes. i-Hub signale au PSF.' },
  { situation:'Pr\u00e9nom "Mohamed" sur passeport maroc / "Mohammed" sur visa europ\u00e9en', isIncoherence:true, explication:'Diff\u00e9rence d\u2019orthographe sur le pr\u00e9nom = signal\u00e9 avec note d\u2019explication possible (translitt\u00e9ration). Le PSF confirme avec son client final.' },
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
  { texte:'i-Hub peut valider un dossier m\u00eame si un document est expir\u00e9', reponse:false, explication:'Non ! Tout document expir\u00e9 est signal\u00e9 au PSF. i-Hub ne valide pas un dossier avec des documents p\u00e9rim\u00e9s.' },
  { texte:'Une diff\u00e9rence mineure d\u2019orthographe sur le pr\u00e9nom doit quand m\u00eame \u00eatre signal\u00e9e', reponse:true, explication:'Exact ! Toute incoh\u00e9rence, m\u00eame mineure, est signal\u00e9e. C\u2019est le PSF qui \u00e9value si c\u2019est mat\u00e9riel.' },
  { texte:'i-Hub peut d\u00e9tecter un faux passeport lors de la v\u00e9rification documentaire', reponse:false, explication:'Non ! i-Hub n\u2019est pas expert en authentification. Il d\u00e9tecte les incoh\u00e9rences visibles, pas les faux.' },
  { texte:'Un justificatif de domicile dat\u00e9 de 4 mois est acceptable', reponse:false, explication:'Non ! Un justificatif de domicile doit dater de moins de 3 mois. 4 mois = expir\u00e9, \u00e0 signaler au PSF.' },
  { texte:'i-Hub signale les incoh\u00e9rences m\u00eame si elles sont peut-\u00eatre dues \u00e0 des diff\u00e9rences culturelles', reponse:true, explication:'Exact ! i-Hub signale avec une note d\u2019explication possible. C\u2019est le PSF qui confirme avec son client final.' },
  { texte:'Si un document manque, i-Hub peut valider le reste du dossier partiellement', reponse:false, explication:'Non ! Un dossier incomplet ne peut pas \u00eatre valid\u00e9 partiellement. i-Hub signale les documents manquants au PSF.' },
]
const VF_EN = [
  { texte:'i-Hub can validate a file even if a document is expired', reponse:false, explication:'No! Any expired document is flagged to PSF. i-Hub does not validate a file with outdated documents.' },
  { texte:'A minor spelling difference in a first name must still be flagged', reponse:true, explication:'Correct! Any inconsistency, even minor, is flagged. The PSF assesses whether it is material.' },
  { texte:'i-Hub can detect a forged passport during documentary verification', reponse:false, explication:'No! i-Hub is not an authentication expert. It detects visible inconsistencies, not forgeries.' },
  { texte:'A proof of residence dated 4 months ago is acceptable', reponse:false, explication:'No! Proof of residence must be less than 3 months old. 4 months = expired, flag to PSF.' },
  { texte:'i-Hub flags inconsistencies even if they may be due to cultural differences', reponse:true, explication:'Correct! i-Hub flags with a possible explanation note. The PSF confirms with its final client.' },
  { texte:'If a document is missing, i-Hub can partially validate the rest of the file', reponse:false, explication:'No! An incomplete file cannot be partially validated. i-Hub flags missing documents to PSF.' },
]

const CAS_FR = [
  { situation:'Le PSF transmet un dossier\u00a0: passeport au nom "Sophie MARTIN-LEBLANC" + KYC au nom "Sophie LEBLANC". Date de naissance et adresse identiques partout.', action:'Signaler l\u2019incoh\u00e9rence sur le nom au PSF', options:['Accepter \u2014 m\u00eame adresse et date de naissance','Signaler l\u2019incoh\u00e9rence sur le nom au PSF','Demander un 3\u00e8me document','Rejeter le dossier'], explication:'Nom diff\u00e9rent entre passeport et KYC = incoh\u00e9rence mat\u00e9rielle. M\u00eame si tout le reste concorde, le nom doit \u00eatre clarifi\u00e9 par le PSF avec son client final.' },
  { situation:'Le PSF transmet un dossier avec un justificatif de domicile dat\u00e9 de 5 mois. Tous les autres documents sont coh\u00e9rents.', action:'Signaler au PSF\u00a0: justificatif de domicile expir\u00e9 (> 3 mois)', options:['Accepter \u2014 tous les autres documents sont bons','Signaler au PSF\u00a0: justificatif de domicile expir\u00e9 (> 3 mois)','Ignorer \u2014 l\u2019adresse ne change probablement pas','Demander directement au client final un nouveau document'], explication:'Justificatif > 3 mois = expir\u00e9. i-Hub signale au PSF. C\u2019est le PSF qui demande le nouveau document \u00e0 son client final.' },
  { situation:'Le PSF transmet un dossier complet. Tout est coh\u00e9rent. La photo du passeport est l\u00e9g\u00e8rement floue mais la personne est identifiable.', action:'Valider le dossier \u2014 photo lisible et documents coh\u00e9rents', options:['Signaler la photo floue au PSF','Valider le dossier \u2014 photo lisible et documents coh\u00e9rents','Demander un autre document photo','Rejeter le passeport'], explication:'Photo l\u00e9g\u00e8rement floue mais identifiable = acceptable. Dossier complet et coh\u00e9rent = validation possible.' },
]
const CAS_EN = [
  { situation:'PSF transmits a file: passport in name "Sophie MARTIN-LEBLANC" + KYC in name "Sophie LEBLANC". Date of birth and address identical throughout.', action:'Flag name inconsistency to PSF', options:['Accept \u2014 same address and date of birth','Flag name inconsistency to PSF','Request a third document','Reject the file'], explication:'Different name between passport and KYC = material inconsistency. Even if everything else matches, the name must be clarified by PSF with its final client.' },
  { situation:'PSF transmits a file with a proof of residence dated 5 months ago. All other documents are consistent.', action:'Flag to PSF: proof of residence expired (> 3 months)', options:['Accept \u2014 all other documents are fine','Flag to PSF: proof of residence expired (> 3 months)','Ignore \u2014 the address probably hasn\u2019t changed','Request a new document directly from the final client'], explication:'Proof > 3 months = expired. i-Hub flags to PSF. It is the PSF that requests a new document from its final client.' },
  { situation:'PSF transmits a complete file. Everything is consistent. The passport photo is slightly blurry but the person is identifiable.', action:'Validate file \u2014 legible photo and consistent documents', options:['Flag the blurry photo to PSF','Validate file \u2014 legible photo and consistent documents','Request another photo document','Reject the passport'], explication:'Slightly blurry but identifiable photo = acceptable. Complete and consistent file = validation possible.' },
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
      <button onClick={() => router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🔍 {t.title}</span>
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
    const a = activeCoh[cohIndex]
    return (
      <div style={{...base,background:cohAnim==='correct'?'#d1fae5':cohAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:cohAnim==='correct'?'#6ee7b7':cohAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:\`\${(cohIndex/activeCoh.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'580px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {cohIndex+1}/{activeCoh.length}</span>
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
            <div style={{background:cohAnim==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${cohAnim==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
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
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(casIndex/activeCas.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:\`2px solid \${C}30\`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i) => (
                <button key={i} onClick={() => repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left'}}
                  onMouseOver={e => {(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=\`\${C}08\`}}
                  onMouseOut={e => {(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
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
console.log('✅ Cohérence documents écrit !');
