const fs = require('fs');
const PINK = '#e91e8c';

fs.mkdirSync('app/modules/aml-fraudes-documents', { recursive: true });
fs.writeFileSync('app/modules/aml-fraudes-documents/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${PINK}'

const UI = {
  fr: {
    title: 'Fraudes aux documents',
    subtitle: 'Reconnaître les signaux visuels suspects \u2014 sans \u00eatre expert en falsification',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Les types de fraudes documentaires les plus fr\u00e9quentes',
      'Les signaux visuels suspects \u00e0 d\u00e9tecter',
      'Ce que i-Hub peut et ne peut pas faire face \u00e0 un document suspect',
      'La diff\u00e9rence entre signal et certitude de fraude',
      'Comment signaler au PSF sans conclure',
      'Les documents les plus souvent falsifi\u00e9s',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 SIGNAL OU PAS\u00a0?', q1title: '\ud83d\udd0d Ce signe est-il un signal suspect\u00a0?',
    suspect: '\ud83d\udea8 Signal suspect', ok: '\u2705 Normal \u2014 pas de signal',
    q2label: 'QUIZ 2/3 \u00b7 VRAI OU FAUX', q2title: '\u2705 Vrai ou Faux \u2014 Fraudes documentaires',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q3label: 'QUIZ 3/3 \u00b7 QUE FAIT i-Hub\u00a0?', q3title: '\ud83e\udd14 Quelle est la bonne r\u00e9action\u00a0?',
    resultTitle: 'Module termin\u00e9 \u2014 Vous d\u00e9tectez les signaux suspects\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    medal_gold: 'Expert fraudes\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Terminer \u2192',
  },
  en: {
    title: 'Document Fraud',
    subtitle: 'Recognising suspicious visual signals \u2014 without being a forgery expert',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'The most common types of document fraud',
      'Suspicious visual signals to detect',
      'What i-Hub can and cannot do when facing a suspicious document',
      'The difference between a signal and certainty of fraud',
      'How to flag to PSF without concluding',
      'The most frequently forged documents',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 SIGNAL OR NOT?', q1title: '\ud83d\udd0d Is this sign a suspicious signal?',
    suspect: '\ud83d\udea8 Suspicious signal', ok: '\u2705 Normal \u2014 no signal',
    q2label: 'QUIZ 2/3 \u00b7 TRUE OR FALSE', q2title: '\u2705 True or False \u2014 Document fraud',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q3label: 'QUIZ 3/3 \u00b7 WHAT DOES i-Hub DO?', q3title: '\ud83e\udd14 What is the correct reaction?',
    resultTitle: 'Module complete \u2014 You detect suspicious signals!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    medal_gold: 'Fraud Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Finish \u2192',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\u26a0\ufe0f', titre:'La fraude documentaire\u00a0: de quoi parle-t-on\u00a0?', contenu:[
    { icon:'\u26a0\ufe0f', texte:'La **fraude documentaire** consiste \u00e0 produire ou utiliser un faux document pour obtenir un avantage (compte bancaire, cr\u00e9dit, identit\u00e9 l\u00e9gale)' },
    { icon:'\ud83d\udcca', texte:'C\u2019est l\u2019une des entr\u00e9es les plus fr\u00e9quentes dans le blanchiment \u2014 une identit\u00e9 false permet d\u2019ouvrir des comptes fictifs' },
    { icon:'\ud83d\udd0d', texte:'i-Hub n\u2019est **pas** un expert en authentification documentaire \u2014 mais il doit signaler tout **signal visuel suspect** au PSF' },
    { icon:'\ud83d\uded1', texte:'R\u00e8gle absolue\u00a0: \u00ab\u00a0je vois quelque chose d\u2019\u00e9trange\u00a0\u00bb = signal au PSF. Jamais conclure \u00ab\u00a0c\u2019est un faux\u00a0\u00bb seul.' },
  ], aretenir:'Signal visuel suspect \u2260 certitude de fraude. i-Hub signale ce qu\u2019il voit. La conclusion appartient aux experts du PSF.' },

  { id:2, emoji:'\ud83d\udcf8', titre:'Les 3 types de fraudes documentaires', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Document falsifi\u00e9**\u00a0: un document authentique modifi\u00e9 (photo chang\u00e9e, nom alt\u00e9r\u00e9, date modifi\u00e9e)' },
    { icon:'2\ufe0f\u20e3', texte:'**Document contrefait**\u00a0: un faux document fabriqu\u00e9 de toutes pi\u00e8ces imitant un document officiel' },
    { icon:'3\ufe0f\u20e3', texte:'**Document authentique utilis\u00e9 frauduleusement**\u00a0: un vrai document appartenant \u00e0 quelqu\u2019un d\u2019autre (vol d\u2019identit\u00e9)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub peut potentiellement d\u00e9tecter des signaux des types 1 et 2 visuellement \u2014 le type 3 est hors p\u00e9rim\u00e8tre sans base de donn\u00e9es' },
  ], aretenir:'3 types\u00a0: falsifi\u00e9, contrefait, utilis\u00e9 frauduleusement. i-Hub peut d\u00e9tecter des signaux visuels sur les deux premiers.' },

  { id:3, emoji:'\ud83d\udcf8', titre:'Signaux sur la photo', contenu:[
    { icon:'\ud83d\udd34', texte:'**Photo flou\u00e9e ou coup\u00e9e**\u00a0: intentionnellement d\u00e9grad\u00e9e pour masquer les traits ou \u00e9viter la comparaison' },
    { icon:'\ud83d\udd34', texte:'**Photo collage visible**\u00a0: bords nets autour de la photo, zone photo de couleur l\u00e9g\u00e8rement diff\u00e9rente du reste du document' },
    { icon:'\ud83d\udd34', texte:'**Pliure suspecte** pr\u00e9cisement sur la zone photo \u2014 peut indiquer une tentative de remplacement' },
    { icon:'\ud83d\udd34', texte:'**Diff\u00e9rence de r\u00e9solution** entre la photo et le reste du document \u2014 photo de meilleure ou moins bonne qualit\u00e9' },
  ], aretenir:'4 signaux photo\u00a0: flou/coup\u00e9, bords de collage, pliure sur photo, diff\u00e9rence de r\u00e9solution. Tout signal visible = alert au PSF.' },

  { id:4, emoji:'\ud83d\udcdd', titre:'Signaux sur les donn\u00e9es textuelles', contenu:[
    { icon:'\ud83d\udd34', texte:'**Police diff\u00e9rente** sur une partie du document \u2014 un chiffre ou une lettre d\u2019un style l\u00e9g\u00e8rement diff\u00e9rent' },
    { icon:'\ud83d\udd34', texte:'**Alignement irr\u00e9gulier** \u2014 une ligne de texte l\u00e9g\u00e8rement d\u00e9cal\u00e9e par rapport aux autres' },
    { icon:'\ud83d\udd34', texte:'**MRZ incoh\u00e9rente**\u00a0: les donn\u00e9es dans la zone lisible en bas du passeport ne correspondent pas au corps du document' },
    { icon:'\ud83d\udd34', texte:'**Surimpression visible**\u00a0: trace d\u2019une donn\u00e9e pr\u00e9c\u00e9dente (date ou nom) transparaissant sous la nouvelle' },
  ], aretenir:'Police, alignement, MRZ, surimpression \u2014 4 signaux textuels. i-Hub les signale au PSF sans conclure \u00e0 la fraude.' },

  { id:5, emoji:'\ud83d\udcbb', titre:'Signaux num\u00e9riques (documents scann\u00e9s)', contenu:[
    { icon:'\ud83d\udd34', texte:'**Pixels inhabituels** autour d\u2019un chiffre ou d\u2019un nom \u2014 indice de copier-coller ou de retouche num\u00e9rique' },
    { icon:'\ud83d\udd34', texte:'**Compression JPEG excessive** sur une partie seulement \u2014 signe d\u2019une modification post-scan' },
    { icon:'\ud83d\udd34', texte:'**M\u00e9tadonn\u00e9es suspectes** du fichier PDF ou image \u2014 logiciel d\u2019\u00e9dition (Photoshop, GIMP) dans les m\u00e9tadonn\u00e9es' },
    { icon:'\ud83d\udd34', texte:'**Fond de document** (guilloch\u00e9s, filigranes) visible \u00e0 certains endroits mais absent \u00e0 d\u2019autres' },
  ], aretenir:'Pixels, compression, m\u00e9tadonn\u00e9es, filigranes discontinus \u2014 signaux num\u00e9riques. i-Hub signale ce qui est visible, pas les m\u00e9tadonn\u00e9es (hors p\u00e9rim\u00e8tre).' },

  { id:6, emoji:'\ud83e\udeaa', titre:'Les documents les plus souvent falsifi\u00e9s', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Passeport**\u00a0: le plus cibl\u00e9, car accept\u00e9 universellement \u2014 notamment les passeports des pays ayant des stickers visa collables' },
    { icon:'\ud83c\udfe0', texte:'**Justificatif de domicile**\u00a0: tr\u00e8s facile \u00e0 falsifier num\u00e9riquement \u2014 adresse modifi\u00e9e sur une vraie facture' },
    { icon:'\ud83d\udcbc', texte:'**Bulletins de salaire**\u00a0: montant modifi\u00e9 pour justifier une source de fonds plus importante' },
    { icon:'\ud83c\udfe2', texte:'**Extrait Kbis / registre de commerce**\u00a0: date ou donn\u00e9es modifi\u00e9es pour donner une apparence l\u00e9gitime \u00e0 une entit\u00e9' },
  ], aretenir:'4 documents les plus falsifi\u00e9s\u00a0: passeport, justificatif domicile, bulletin de salaire, Kbis. Vigilance accrue sur ces documents.' },

  { id:7, emoji:'\ud83d\udd0d', titre:'Ce que i-Hub peut d\u00e9tecter', contenu:[
    { icon:'\u2705', texte:'Signaux **visuellement d\u00e9tectables** sur un document num\u00e9rique\u00a0: photo, police, alignement, MRZ, pliures' },
    { icon:'\u2705', texte:'**Incoh\u00e9rence entre donn\u00e9es**\u00a0: le nom dans la MRZ ne correspond pas au nom dans le corps du passeport' },
    { icon:'\u2705', texte:'**Document visuellement d\u00e9grad\u00e9**\u00a0: scan trop sombre, photo illisible, document d\u00e9coup\u00e9 \u2014 retransmission demand\u00e9e' },
    { icon:'\u2705', texte:'**Diff\u00e9rences entre documents**\u00a0: la photo sur le permis de conduire semble diff\u00e9rente de celle du passeport' },
  ], aretenir:'i-Hub d\u00e9tecte les signaux visibles : photo, police, MRZ, coh\u00e9rence entre documents. Tout signal = transmission au PSF.' },

  { id:8, emoji:'\u274c', titre:'Ce que i-Hub NE peut PAS d\u00e9tecter', contenu:[
    { icon:'\u274c', texte:'i-Hub ne peut **pas** d\u00e9terminer si un passeport est enti\u00e8rement contrefait \u2014 expertise technique requise (police, gendarmerie)' },
    { icon:'\u274c', texte:'i-Hub ne peut **pas** d\u00e9tecter qu\u2019un vrai document a \u00e9t\u00e9 vol\u00e9 et utilis\u00e9 par une autre personne \u2014 hors p\u00e9rim\u00e8tre' },
    { icon:'\u274c', texte:'i-Hub ne peut **pas** analyser les m\u00e9tadonn\u00e9es num\u00e9riques des fichiers \u2014 sauf si le SLA le pr\u00e9voit avec des outils sp\u00e9cifiques' },
    { icon:'\u274c', texte:'i-Hub ne peut **pas** v\u00e9rifier les \u00e9l\u00e9ments de s\u00e9curit\u00e9 physiques (hologrammes, encres UV) sur des copies num\u00e9riques' },
  ], aretenir:'i-Hub d\u00e9tecte le visible. Il ne peut pas expertiser les faux, d\u00e9tecter les vols d\u2019identit\u00e9 ou analyser les \u00e9l\u00e9ments physiques.' },

  { id:9, emoji:'\ud83d\udce2', titre:'Comment signaler un document suspect', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**D\u00e9crire pr\u00e9cis\u00e9ment le signal**\u00a0: \u00ab\u00a0la zone photo du passeport pr\u00e9sente des bords nets sugg\u00e9rant un remplacement\u00a0\u00bb' },
    { icon:'2\ufe0f\u20e3', texte:'**Ne pas conclure**\u00a0: \u00ab\u00a0signal \u00e0 v\u00e9rifier\u00a0\u00bb et non \u00ab\u00a0ce document est un faux\u00a0\u00bb' },
    { icon:'3\ufe0f\u20e3', texte:'**Signaler au PSF** dans le rapport de v\u00e9rification avec les observations pr\u00e9cises' },
    { icon:'4\ufe0f\u20e3', texte:'**Archiver** le rapport \u2014 si le document est effectivement frauduleux, la tra\u00e7abilit\u00e9 prot\u00e8ge i-Hub' },
  ], aretenir:'D\u00e9crire \u2192 Ne pas conclure \u2192 Signaler au PSF \u2192 Archiver. Le rapport doit \u00eatre factuel, jamais accusatoire.' },

  { id:10, emoji:'\ud83d\udd0d', titre:'La MRZ du passeport\u00a0: ce qu\u2019elle contient', contenu:[
    { icon:'\ud83d\udcdd', texte:'La **MRZ** (Machine Readable Zone) est la zone de deux lignes en bas du passeport, form\u00e9e de lettres et chiffres' },
    { icon:'\ud83d\udcca', texte:'Elle contient\u00a0: code pays, nom et pr\u00e9nom, num\u00e9ro de passeport, nationalit\u00e9, date de naissance, date d\u2019expiration' },
    { icon:'\u26a0\ufe0f', texte:'Signal cl\u00e9\u00a0: si les donn\u00e9es MRZ ne correspondent pas aux donn\u00e9es du corps du passeport \u2014 incoh\u00e9rence \u00e0 signaler' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie visuellement que la MRZ est **lisible, compl\u00e8te et coh\u00e9rente** avec les donn\u00e9es du reste du document' },
  ], aretenir:'MRZ lisible + coh\u00e9rente avec le corps = bon signe. MRZ illisible ou incoh\u00e9rente = signal au PSF.' },

  { id:11, emoji:'\ud83c\udfe0', titre:'Le justificatif de domicile\u00a0: signals sp\u00e9cifiques', contenu:[
    { icon:'\ud83d\udd34', texte:'**Logo ou en-t\u00eate al\u00e9atoire**\u00a0: logo du fournisseur flou, pixelis\u00e9 ou visuellement diff\u00e9rent des vrais documents de ce fournisseur' },
    { icon:'\ud83d\udd34', texte:'**Adresse modifi\u00e9e**\u00a0: zone d\u2019adresse d\u2019une police l\u00e9g\u00e8rement diff\u00e9rente du reste du texte' },
    { icon:'\ud83d\udd34', texte:'**Date suspecte**\u00a0: date de facturation qui ne correspond pas \u00e0 un cycle de facturation normal (ex\u00a0: facture \u00e9lectrique du 31 f\u00e9vrier)' },
    { icon:'\ud83d\udd34', texte:'**Format inhabituel**\u00a0: mise en page tr\u00e8s diff\u00e9rente des justificatifs de m\u00eame type habituellement vus' },
  ], aretenir:'Justificatif de domicile = document facile \u00e0 falsifier. Logo, adresse, date, format \u2014 4 zones de vigilance sp\u00e9cifiques.' },

  { id:12, emoji:'\ud83d\udcbc', titre:'Le bulletin de salaire\u00a0: signaux sp\u00e9cifiques', contenu:[
    { icon:'\ud83d\udd34', texte:'**Montant incoh\u00e9rent**\u00a0: salaire net tr\u00e8s sup\u00e9rieur au salaire brut, ou montants ronds suspects (ex\u00a0: exactement 10\u00a0000\u20ac nets)' },
    { icon:'\ud83d\udd34', texte:'**Cotisations sociales absentes ou erron\u00e9es**\u00a0: un vrai bulletin de salaire fran\u00e7ais ou luxembourgeois a des cotisations d\u00e9taill\u00e9es' },
    { icon:'\ud83d\udd34', texte:'**Incoh\u00e9rence avec le contrat**\u00a0: salaire diff\u00e9rent du contrat de travail fourni dans le m\u00eame dossier' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale toute incoh\u00e9rence visible \u2014 c\u2019est le PSF qui demande des clarifications \u00e0 son client final' },
  ], aretenir:'Bulletin de salaire\u00a0: montant coh\u00e9rent, cotisations pr\u00e9sentes, compatible avec le contrat. Toute incoh\u00e9rence = signal.' },

  { id:13, emoji:'\ud83d\udcf1', titre:'Les copies num\u00e9riques vs les originaux', contenu:[
    { icon:'\ud83d\udcf1', texte:'La plupart des documents re\u00e7us par i-Hub sont des **copies num\u00e9riques** (scan, photo, PDF) \u2014 pas des originaux' },
    { icon:'\u26a0\ufe0f', texte:'Limite importante\u00a0: les \u00e9l\u00e9ments de s\u00e9curit\u00e9 physiques (hologrammes, encres r\u00e9actives, microimpressions) ne sont pas v\u00e9rifiables sur num\u00e9rique' },
    { icon:'\ud83d\udd0d', texte:'Sur une copie num\u00e9rique, i-Hub se concentre sur\u00a0: photo, police, alignement, MRZ, coh\u00e9rence des donn\u00e9es, qualit\u00e9 du scan' },
    { icon:'\ud83d\udcdc', texte:'Si le SLA pr\u00e9voit une v\u00e9rification d\u2019original physique, i-Hub applique les proc\u00e9dures correspondantes du PSF' },
  ], aretenir:'Copie num\u00e9rique = limite sur les \u00e9l\u00e9ments physiques. i-Hub se concentre sur le visible\u00a0: photo, police, MRZ, coh\u00e9rence.' },

  { id:14, emoji:'\ud83d\udd0d', titre:'La comparaison entre documents', contenu:[
    { icon:'\ud83d\udd0d', texte:'Comparer la **photo sur le passeport** avec la photo sur un autre document d\u2019identit\u00e9 (carte d\u2019identit\u00e9, permis) \u2014 correspondent-elles\u00a0?' },
    { icon:'\ud83d\udcdd', texte:'Comparer la **signature** sur le passeport (si visible) avec la signature sur le formulaire KYC \u2014 sont-elles compatibles\u00a0?' },
    { icon:'\ud83c\udf82', texte:'Comparer la **date de naissance** sur le passeport et sur l\u2019extrait de naissance s\u2019il est fourni \u2014 diff\u00e9rence = signal' },
    { icon:'\ud83d\uded1', texte:'Toute diff\u00e9rence entre deux documents est signal\u00e9e \u2014 m\u00eame si une explication culturelle est possible' },
  ], aretenir:'Comparer photo, signature, date de naissance entre documents. Toute diff\u00e9rence = signal au PSF, m\u00eame si explication possible.' },

  { id:15, emoji:'\ud83d\uded1', titre:'La r\u00e8gle absolue\u00a0: signal, pas conclusion', contenu:[
    { icon:'\u2705', texte:'Ce qu\u2019i-Hub dit\u00a0: \u00ab\u00a0J\u2019observe que la zone photo pr\u00e9sente des bords nets qui m\u00e9ritent v\u00e9rification\u00a0\u00bb' },
    { icon:'\u274c', texte:'Ce qu\u2019i-Hub NE dit PAS\u00a0: \u00ab\u00a0Ce document est faux\u00a0\u00bb ou \u00ab\u00a0Ce client est un fraudeur\u00a0\u00bb' },
    { icon:'\u26a0\ufe0f', texte:'Une accusation infond\u00e9e de fraude peut engager la **responsabilit\u00e9 juridique** d\u2019i-Hub et du PSF' },
    { icon:'\ud83d\udcce', texte:'Le rapport est factuel\u00a0: \u00ab\u00a0signal d\u00e9tect\u00e9, \u00e0 valider par le PSF\u00a0\u00bb \u2014 jamais accusatoire' },
  ], aretenir:'Signal \u2260 conclusion. Factuel et neutre dans le rapport. C\u2019est le PSF qui tranche. Une fausse accusation = probl\u00e8me juridique.' },

  { id:16, emoji:'\ud83d\udc6e', titre:'Que fait le PSF face \u00e0 un document suspect\u00a0?', contenu:[
    { icon:'\ud83d\udc6e', texte:'Le PSF peut demander \u00e0 son client final de **fournir l\u2019original** physique ou de passer en agence' },
    { icon:'\ud83d\udd0d', texte:'Le PSF peut soumettre le document \u00e0 des **experts en authentification** (services sp\u00e9cialis\u00e9s, police)' },
    { icon:'\ud83d\udea8', texte:'Si la fraude est confirm\u00e9e, le PSF peut \u00eatre oblig\u00e9 de faire une **STR \u00e0 la CRF** et de refuser la relation' },
    { icon:'\ud83d\udd0d', texte:'i-Hub transmet le rapport factuel au PSF \u2014 c\u2019est le PSF qui d\u00e9cide des \u00e9tapes suivantes' },
  ], aretenir:'Face \u00e0 un signal d\u2019i-Hub, le PSF peut\u00a0: demander l\u2019original, consulter des experts, faire une STR. i-Hub ne fait rien de tout cela seul.' },

  { id:17, emoji:'\u26a0\ufe0f', titre:'Les red flags combin\u00e9s', contenu:[
    { icon:'\ud83d\udd34', texte:'**Plusieurs signaux simultan\u00e9s**\u00a0: photo suspecte + police diff\u00e9rente + MRZ incoh\u00e9rente = risque tr\u00e8s \u00e9lev\u00e9' },
    { icon:'\ud83d\udd34', texte:'**Signal documentaire + comportement**\u00a0: document suspect + refus de fournir l\u2019original + source de fonds \u00e9lev\u00e9e' },
    { icon:'\ud83d\udd34', texte:'**Incoh\u00e9rence crois\u00e9e**\u00a0: photo diff\u00e9rente entre passeport et permis de conduire du m\u00eame dossier' },
    { icon:'\ud83d\udcce', texte:'Plus les red flags se cumulent, plus le rapport i-Hub est d\u00e9taill\u00e9 \u2014 et plus urgent est le signal au PSF' },
  ], aretenir:'Plusieurs signals simultan\u00e9s = urgence accrue du signal au PSF. Chaque signal est document\u00e9 s\u00e9par\u00e9ment dans le rapport.' },

  { id:18, emoji:'\ud83d\udcc5', titre:'Documents de substitution suspects', contenu:[
    { icon:'\u26a0\ufe0f', texte:'Quand un client final refuse de fournir un document sp\u00e9cifique et propose une **alternative inhabituelle**\u00a0: signal' },
    { icon:'\ud83d\udcdd', texte:'Exemple\u00a0: refus de fournir un passeport, remplacement par une pil\u00e8 de documents non-officiels ou une traduction non certifi\u00e9e' },
    { icon:'\ud83d\uded1', texte:'Un document officiel ne peut pas \u00eatre remplac\u00e9 par un document non-officiel \u2014 le PSF doit obtenir le document requis' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale au PSF si les documents transmis ne correspondent pas \u00e0 ce qui \u00e9tait requis dans le SLA' },
  ], aretenir:'Document de substitution non-officiel = signal au PSF. Le PSF exige le document requis aupr\u00e8s de son client final.' },

  { id:19, emoji:'\ud83d\udca1', titre:'Les 5 questions de v\u00e9rification anti-fraude', contenu:[
    { icon:'\u2753', texte:'**La photo est-elle visible et non modifi\u00e9e\u00a0?** \u2014 bords nets, r\u00e9solution coh\u00e9rente, pas de pliure suspecte' },
    { icon:'\u2753', texte:'**La MRZ est-elle lisible et coh\u00e9rente avec le corps du document\u00a0?**' },
    { icon:'\u2753', texte:'**La police de caract\u00e8res est-elle uniforme sur tout le document\u00a0?**' },
    { icon:'\u2753', texte:'**Les donn\u00e9es du document correspondent-elles aux autres documents du dossier\u00a0?**' },
    { icon:'\u2753', texte:'**Le document a-t-il l\u2019apparence visuelle attendue pour ce type et ce pays\u00a0?**' },
  ], aretenir:'5 questions\u00a0: photo, MRZ, police, coh\u00e9rence crois\u00e9e, apparence attendue. Si une r\u00e9ponse soul\u00e8ve un doute = signal au PSF.' },

  { id:20, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: fraudes documentaires en 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**3 types de fraudes**\u00a0: falsifi\u00e9, contrefait, utilis\u00e9 frauduleusement. i-Hub peut d\u00e9tecter des signaux sur les deux premiers.' },
    { icon:'2\ufe0f\u20e3', texte:'**5 zones de v\u00e9rification**\u00a0: photo, MRZ, police, coh\u00e9rence crois\u00e9e, apparence g\u00e9n\u00e9rale' },
    { icon:'3\ufe0f\u20e3', texte:'**Signal \u2260 conclusion**\u00a0: i-Hub d\u00e9crit ce qu\u2019il voit sans accuser. Rapport factuel et neutre.' },
    { icon:'4\ufe0f\u20e3', texte:'**Tout signal = PSF**\u00a0: transmettre au PSF qui d\u00e9cide des \u00e9tapes suivantes (original, experts, STR)' },
    { icon:'5\ufe0f\u20e3', texte:'**Archiver**\u00a0: chaque v\u00e9rification dat\u00e9e et archiv\u00e9e \u2014 protection d\u2019i-Hub si la fraude est confirm\u00e9e ult\u00e9rieurement' },
  ], aretenir:'Fraude documentaire\u00a0: d\u00e9tecter le visible, signaler au PSF, ne pas conclure, archiver. Factuel et neutre toujours.' },
]

const FICHES_EN = [
  { id:1, emoji:'\u26a0\ufe0f', titre:'Document fraud: what are we talking about?', contenu:[
    { icon:'\u26a0\ufe0f', texte:'**Document fraud** consists of producing or using a false document to obtain an advantage (bank account, credit, legal identity)' },
    { icon:'\ud83d\udcca', texte:'It is one of the most common entry points into money laundering \u2014 a false identity enables fictitious accounts to be opened' },
    { icon:'\ud83d\udd0d', texte:'i-Hub is **not** a documentary authentication expert \u2014 but it must flag any **suspicious visual signal** to the PSF' },
    { icon:'\ud83d\uded1', texte:'Absolute rule: \u201cI see something strange\u201d = flag to PSF. Never conclude \u201cit\u2019s a forgery\u201d alone.' },
  ], aretenir:'Suspicious visual signal \u2260 certainty of fraud. i-Hub flags what it sees. Conclusions belong to PSF experts.' },
  { id:2, emoji:'\ud83d\udcf8', titre:'The 3 types of document fraud', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Altered document**: an authentic document that has been modified (photo changed, name altered, date modified)' },
    { icon:'2\ufe0f\u20e3', texte:'**Counterfeit document**: a fake document made from scratch imitating an official document' },
    { icon:'3\ufe0f\u20e3', texte:'**Authentic document used fraudulently**: a real document belonging to someone else (identity theft)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub may potentially detect signals from types 1 and 2 visually \u2014 type 3 is out of scope without a database' },
  ], aretenir:'3 types: altered, counterfeit, fraudulently used. i-Hub can detect visual signals on the first two.' },
  { id:3, emoji:'\ud83d\udcf8', titre:'Photo signals', contenu:[
    { icon:'\ud83d\udd34', texte:'**Blurred or cut photo**: intentionally degraded to mask features or avoid comparison' },
    { icon:'\ud83d\udd34', texte:'**Visible photo collage**: sharp edges around the photo, photo zone slightly different colour from the rest' },
    { icon:'\ud83d\udd34', texte:'**Suspicious fold** precisely on the photo area \u2014 may indicate a replacement attempt' },
    { icon:'\ud83d\udd34', texte:'**Resolution difference** between photo and rest of document \u2014 photo of better or worse quality' },
  ], aretenir:'4 photo signals: blurred/cut, collage edges, fold on photo, resolution difference. Any visible signal = flag to PSF.' },
  { id:4, emoji:'\ud83d\udcdd', titre:'Text data signals', contenu:[
    { icon:'\ud83d\udd34', texte:'**Different font** on part of the document \u2014 a digit or letter of slightly different style' },
    { icon:'\ud83d\udd34', texte:'**Irregular alignment** \u2014 a line of text slightly offset from the others' },
    { icon:'\ud83d\udd34', texte:'**Inconsistent MRZ**: data in the machine-readable zone does not match the document body' },
    { icon:'\ud83d\udd34', texte:'**Visible overprint**: trace of a previous value (date or name) showing through the new one' },
  ], aretenir:'Font, alignment, MRZ, overprint \u2014 4 text signals. i-Hub flags them to PSF without concluding fraud.' },
  { id:5, emoji:'\ud83d\udcbb', titre:'Digital signals (scanned documents)', contenu:[
    { icon:'\ud83d\udd34', texte:'**Unusual pixels** around a digit or name \u2014 sign of copy-paste or digital editing' },
    { icon:'\ud83d\udd34', texte:'**Excessive JPEG compression** on one part only \u2014 sign of post-scan modification' },
    { icon:'\ud83d\udd34', texte:'**Suspicious file metadata** \u2014 editing software (Photoshop, GIMP) in PDF or image metadata' },
    { icon:'\ud83d\udd34', texte:'**Document background** (guilloch\u00e9s, watermarks) visible in some areas but absent in others' },
  ], aretenir:'Pixels, compression, metadata, discontinuous watermarks \u2014 digital signals. i-Hub flags what is visible, not metadata (out of scope).' },
  { id:6, emoji:'\ud83e\udeaa', titre:'The most frequently forged documents', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Passport**: the most targeted, universally accepted \u2014 especially passports from countries with pasteable visa stickers' },
    { icon:'\ud83c\udfe0', texte:'**Proof of residence**: very easy to forge digitally \u2014 address modified on a real invoice' },
    { icon:'\ud83d\udcbc', texte:'**Payslips**: amount modified to justify a larger source of funds' },
    { icon:'\ud83c\udfe2', texte:'**Company extract / trade register**: date or data modified to give a legitimate appearance to an entity' },
  ], aretenir:'4 most forged documents: passport, proof of residence, payslip, company extract. Heightened vigilance on these.' },
  { id:7, emoji:'\ud83d\udd0d', titre:'What i-Hub can detect', contenu:[
    { icon:'\u2705', texte:'**Visually detectable signals** on a digital document: photo, font, alignment, MRZ, folds' },
    { icon:'\u2705', texte:'**Data inconsistency**: the name in the MRZ does not match the name in the passport body' },
    { icon:'\u2705', texte:'**Visually degraded document**: too dark scan, illegible photo, cut document \u2014 retransmission requested' },
    { icon:'\u2705', texte:'**Differences between documents**: photo on driving licence appears different from passport photo' },
  ], aretenir:'i-Hub detects visible signals: photo, font, MRZ, cross-document consistency. Every signal = transmission to PSF.' },
  { id:8, emoji:'\u274c', titre:'What i-Hub CANNOT detect', contenu:[
    { icon:'\u274c', texte:'i-Hub **cannot** determine if a passport is entirely counterfeit \u2014 technical expertise required (police, gendarmerie)' },
    { icon:'\u274c', texte:'i-Hub **cannot** detect that a real document was stolen and used by another person \u2014 out of scope' },
    { icon:'\u274c', texte:'i-Hub **cannot** analyse digital file metadata \u2014 unless SLA provides for this with specific tools' },
    { icon:'\u274c', texte:'i-Hub **cannot** verify physical security features (holograms, UV inks) on digital copies' },
  ], aretenir:'i-Hub detects what is visible. It cannot expertly assess forgeries, detect identity theft or check physical features.' },
  { id:9, emoji:'\ud83d\udce2', titre:'How to flag a suspicious document', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Describe the signal precisely**: \u201cthe passport photo area has sharp edges suggesting a replacement\u201d' },
    { icon:'2\ufe0f\u20e3', texte:'**Do not conclude**: \u201csignal to verify\u201d and not \u201cthis document is a forgery\u201d' },
    { icon:'3\ufe0f\u20e3', texte:'**Flag to PSF** in the verification report with precise observations' },
    { icon:'4\ufe0f\u20e3', texte:'**Archive** the report \u2014 if the document is indeed fraudulent, traceability protects i-Hub' },
  ], aretenir:'Describe \u2192 Do not conclude \u2192 Flag to PSF \u2192 Archive. The report must be factual, never accusatory.' },
  { id:10, emoji:'\ud83d\udd0d', titre:'The passport MRZ: what it contains', contenu:[
    { icon:'\ud83d\udcdd', texte:'The **MRZ** (Machine Readable Zone) is the two-line zone at the bottom of the passport, made up of letters and digits' },
    { icon:'\ud83d\udcca', texte:'It contains: country code, surname and given names, passport number, nationality, date of birth, expiry date' },
    { icon:'\u26a0\ufe0f', texte:'Key signal: if MRZ data does not match data in the passport body \u2014 inconsistency to flag' },
    { icon:'\ud83d\udd0d', texte:'i-Hub visually checks that the MRZ is **legible, complete and consistent** with the rest of the document\u2019s data' },
  ], aretenir:'Legible MRZ + consistent with body = good sign. Illegible or inconsistent MRZ = flag to PSF.' },
  { id:11, emoji:'\ud83c\udfe0', titre:'Proof of residence: specific signals', contenu:[
    { icon:'\ud83d\udd34', texte:'**Random logo or header**: provider logo blurry, pixelated or visually different from real documents of that provider' },
    { icon:'\ud83d\udd34', texte:'**Modified address**: address area in slightly different font from the rest of the text' },
    { icon:'\ud83d\udd34', texte:'**Suspicious date**: billing date inconsistent with normal billing cycles (e.g. electricity bill dated 31 February)' },
    { icon:'\ud83d\udd34', texte:'**Unusual format**: layout very different from similar document types usually seen' },
  ], aretenir:'Proof of residence = easy to forge. Logo, address, date, format \u2014 4 specific vigilance areas.' },
  { id:12, emoji:'\ud83d\udcbc', titre:'Payslip: specific signals', contenu:[
    { icon:'\ud83d\udd34', texte:'**Inconsistent amount**: net salary much higher than gross, or suspiciously round amounts (e.g. exactly \u20ac10,000 net)' },
    { icon:'\ud83d\udd34', texte:'**Absent or erroneous social contributions**: a genuine French or Luxembourg payslip has detailed contributions' },
    { icon:'\ud83d\udd34', texte:'**Inconsistency with contract**: salary different from the employment contract in the same file' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags any visible inconsistency \u2014 PSF seeks clarification from its final client' },
  ], aretenir:'Payslip: consistent amount, contributions present, compatible with contract. Any inconsistency = flag.' },
  { id:13, emoji:'\ud83d\udcf1', titre:'Digital copies vs originals', contenu:[
    { icon:'\ud83d\udcf1', texte:'Most documents received by i-Hub are **digital copies** (scan, photo, PDF) \u2014 not originals' },
    { icon:'\u26a0\ufe0f', texte:'Important limit: physical security features (holograms, reactive inks, microprints) cannot be verified digitally' },
    { icon:'\ud83d\udd0d', texte:'On a digital copy, i-Hub focuses on: photo, font, alignment, MRZ, data consistency, scan quality' },
    { icon:'\ud83d\udcdc', texte:'If the SLA provides for physical original verification, i-Hub applies the PSF\u2019s corresponding procedures' },
  ], aretenir:'Digital copy = limits on physical features. i-Hub focuses on what is visible: photo, font, MRZ, consistency.' },
  { id:14, emoji:'\ud83d\udd0d', titre:'Cross-document comparison', contenu:[
    { icon:'\ud83d\udd0d', texte:'Compare the **photo on the passport** with the photo on another identity document (ID card, licence) \u2014 do they match?' },
    { icon:'\ud83d\udcdd', texte:'Compare the **signature** on the passport (if visible) with the signature on the KYC form \u2014 are they compatible?' },
    { icon:'\ud83c\udf82', texte:'Compare the **date of birth** on the passport and birth certificate if provided \u2014 difference = signal' },
    { icon:'\ud83d\uded1', texte:'Any difference between two documents is flagged \u2014 even if a cultural explanation is possible' },
  ], aretenir:'Compare photo, signature, date of birth between documents. Any difference = flag to PSF, even if explanation possible.' },
  { id:15, emoji:'\ud83d\uded1', titre:'The absolute rule: signal, not conclusion', contenu:[
    { icon:'\u2705', texte:'What i-Hub says: \u201cI observe that the photo area has sharp edges that warrant verification\u201d' },
    { icon:'\u274c', texte:'What i-Hub does NOT say: \u201cThis document is fake\u201d or \u201cThis client is a fraudster\u201d' },
    { icon:'\u26a0\ufe0f', texte:'An unfounded fraud accusation can engage i-Hub\u2019s and the PSF\u2019s **legal liability**' },
    { icon:'\ud83d\udcce', texte:'The report is factual: \u201csignal detected, to be validated by the PSF\u201d \u2014 never accusatory' },
  ], aretenir:'Signal \u2260 conclusion. Factual and neutral in the report. PSF decides. A false accusation = legal problem.' },
  { id:16, emoji:'\ud83d\udc6e', titre:'What the PSF does with a suspicious document', contenu:[
    { icon:'\ud83d\udc6e', texte:'The PSF can ask its final client to **provide the physical original** or come into a branch' },
    { icon:'\ud83d\udd0d', texte:'The PSF can submit the document to **authentication experts** (specialist services, police)' },
    { icon:'\ud83d\udea8', texte:'If fraud is confirmed, the PSF may be required to file a **STR to the FIU** and refuse the relationship' },
    { icon:'\ud83d\udd0d', texte:'i-Hub transmits the factual report to the PSF \u2014 it is the PSF that decides on next steps' },
  ], aretenir:'On i-Hub\u2019s signal, PSF can: request original, consult experts, file STR. i-Hub does none of this alone.' },
  { id:17, emoji:'\u26a0\ufe0f', titre:'Combined red flags', contenu:[
    { icon:'\ud83d\udd34', texte:'**Multiple simultaneous signals**: suspicious photo + different font + inconsistent MRZ = very high risk' },
    { icon:'\ud83d\udd34', texte:'**Documentary signal + behaviour**: suspicious document + refusal to provide original + high source of funds' },
    { icon:'\ud83d\udd34', texte:'**Cross-document inconsistency**: different photo between passport and driving licence in the same file' },
    { icon:'\ud83d\udcce', texte:'The more red flags accumulate, the more detailed i-Hub\u2019s report \u2014 and the more urgent the flag to PSF' },
  ], aretenir:'Multiple simultaneous signals = increased urgency of flag to PSF. Each signal documented separately in the report.' },
  { id:18, emoji:'\ud83d\udcc5', titre:'Suspicious substitute documents', contenu:[
    { icon:'\u26a0\ufe0f', texte:'When a final client refuses to provide a specific document and proposes an **unusual alternative**: signal' },
    { icon:'\ud83d\udcdd', texte:'Example: refusal to provide passport, replaced by a pile of unofficial documents or uncertified translation' },
    { icon:'\ud83d\uded1', texte:'An official document cannot be replaced by an unofficial one \u2014 the PSF must obtain the required document' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags to PSF if documents transmitted do not match what was required in the SLA' },
  ], aretenir:'Unofficial substitute document = flag to PSF. The PSF requires the correct document from its final client.' },
  { id:19, emoji:'\ud83d\udca1', titre:'The 5 anti-fraud verification questions', contenu:[
    { icon:'\u2753', texte:'**Is the photo visible and unmodified?** \u2014 sharp edges, consistent resolution, no suspicious fold' },
    { icon:'\u2753', texte:'**Is the MRZ legible and consistent with the document body?**' },
    { icon:'\u2753', texte:'**Is the font uniform throughout the document?**' },
    { icon:'\u2753', texte:'**Do the document data match the other documents in the file?**' },
    { icon:'\u2753', texte:'**Does the document have the expected visual appearance for this type and country?**' },
  ], aretenir:'5 questions: photo, MRZ, font, cross-consistency, expected appearance. Any doubt = flag to PSF.' },
  { id:20, emoji:'\ud83c\udf93', titre:'Summary: document fraud in 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**3 fraud types**: altered, counterfeit, fraudulently used. i-Hub can detect signals on the first two.' },
    { icon:'2\ufe0f\u20e3', texte:'**5 verification zones**: photo, MRZ, font, cross-consistency, general appearance' },
    { icon:'3\ufe0f\u20e3', texte:'**Signal \u2260 conclusion**: i-Hub describes what it sees without accusing. Factual and neutral report.' },
    { icon:'4\ufe0f\u20e3', texte:'**Every signal = PSF**: transmit to PSF which decides next steps (original, experts, STR)' },
    { icon:'5\ufe0f\u20e3', texte:'**Archive**: every dated verification archived \u2014 i-Hub protection if fraud confirmed later' },
  ], aretenir:'Document fraud: detect what is visible, flag to PSF, do not conclude, archive. Factual and neutral always.' },
]

const SIGNALS_FR = [
  { signal:'Photo du passeport l\u00e9g\u00e8rement floue mais la personne est identifiable', isSuspect:false, explication:'Photo l\u00e9g\u00e8rement floue mais lisible = acceptable. Le fl ou seul n\u2019est pas un signal de fraude si la personne reste identifiable.' },
  { signal:'Bords nets et tr\u00e8s pr\u00e9cis autour de la photo du passeport', isSuspect:true, explication:'Bords nets autour de la photo = signal possible de remplacement de photo (collage). \u00c0 signaler au PSF.' },
  { signal:'MRZ du passeport lisible mais le nom en MRZ est "DUPONT" et le corps du document dit "DUPOND"', isSuspect:true, explication:'Incoh\u00e9rence MRZ vs corps du document = signal tr\u00e8s significatif. Le nom devrait \u00eatre identique. Signal imm\u00e9diat au PSF.' },
  { signal:'Passeport en parfait \u00e9tat, scan de bonne qualit\u00e9, donn\u00e9es lisibles et coh\u00e9rentes', isSuspect:false, explication:'Document en bon \u00e9tat, scan clair, donn\u00e9es coh\u00e9rentes = aucun signal suspect. Pas de raison de signaler.' },
  { signal:'Un chiffre dans la date d\u2019expiration semble d\u2019une police l\u00e9g\u00e8rement diff\u00e9rente', isSuspect:true, explication:'Police diff\u00e9rente sur un seul caract\u00e8re = signal suspect de modification. \u00c0 signaler au PSF m\u00eame si l\u2019explication peut \u00eatre innocent.' },
  { signal:'Justificatif de domicile avec logo de l\u2019entreprise pixelis\u00e9 et flou', isSuspect:true, explication:'Logo pixelis\u00e9 = signal suspect de falsification num\u00e9rique. Les vrais documents d\u2019une entreprise ont g\u00e9n\u00e9ralement un logo net.' },
  { signal:'Passeport scan\u00e9 l\u00e9g\u00e8rement de biais (pas droit)', isSuspect:false, explication:'Scan l\u00e9g\u00e8rement de biais = probl\u00e8me de num\u00e9risation, pas de signal de fraude. Document \u00e0 redemander si illisible.' },
  { signal:'Photo du permis de conduire diff\u00e8re visiblement de la photo du passeport du m\u00eame dossier', isSuspect:true, explication:'Photos diff\u00e9rentes entre deux documents du m\u00eame dossier = signal tr\u00e8s significatif. Peut indiquer un vol d\u2019identit\u00e9 ou une falsification.' },
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
  { texte:'i-Hub peut affirmer qu\u2019un document est faux si plusieurs signaux sont visibles', reponse:false, explication:'Non\u00a0! m\u00eame avec plusieurs signaux, i-Hub ne conclut jamais \u00ab\u00a0c\u2019est un faux\u00a0\u00bb. Il signale les observations au PSF.' },
  { texte:'Un document num\u00e9rique ne peut pas avoir d\u2019\u00e9l\u00e9ments de s\u00e9curit\u00e9 physiques v\u00e9rifiables', reponse:true, explication:'Exact\u00a0! Hologrammes, encres UV, microimpressions ne sont pas v\u00e9rifiables sur un scan. Limite importante d\u2019i-Hub.' },
  { texte:'Une pliure pr\u00e9cis\u00e9ment sur la zone photo est un signal suspect', reponse:true, explication:'Exact\u00a0! Une pliure exactement sur la photo peut indiquer une tentative de remplacement. \u00c0 signaler au PSF.' },
  { texte:'Si la MRZ est lisible, le document est n\u00e9cessairement authentique', reponse:false, explication:'Non\u00a0! Une MRZ lisible n\u2019exclut pas une falsification des donn\u00e9es dans le corps du document. Il faut v\u00e9rifier la coh\u00e9rence.' },
  { texte:'Un justificatif de domicile est plus facile \u00e0 falsifier num\u00e9riquement qu\u2019un passeport', reponse:true, explication:'Exact\u00a0! Un passeport a des \u00e9l\u00e9ments de s\u00e9curit\u00e9 plus complexes. Un justificatif de domicile est un simple document imprim\u00e9.' },
  { texte:'i-Hub doit refuser de valider un dossier si un signal suspect est d\u00e9tect\u00e9', reponse:false, explication:'Non\u00a0! i-Hub ne refuse pas seul. Il signale le document suspect au PSF qui d\u00e9cide des suites \u00e0 donner.' },
]
const VF_EN = [
  { texte:'i-Hub can confirm a document is fake if multiple signals are visible', reponse:false, explication:'No! Even with multiple signals, i-Hub never concludes \u201cit\u2019s a forgery\u201d. It flags observations to PSF.' },
  { texte:'A digital document cannot have verifiable physical security features', reponse:true, explication:'Correct! Holograms, UV inks, microprints cannot be verified on a scan. An important i-Hub limitation.' },
  { texte:'A fold precisely on the photo area is a suspicious signal', reponse:true, explication:'Correct! A fold exactly on the photo may indicate a replacement attempt. Flag to PSF.' },
  { texte:'If the MRZ is legible, the document is necessarily authentic', reponse:false, explication:'No! A legible MRZ does not rule out falsification of data in the document body. Consistency must be verified.' },
  { texte:'A proof of residence is easier to forge digitally than a passport', reponse:true, explication:'Correct! A passport has more complex security features. A proof of residence is a simple printed document.' },
  { texte:'i-Hub must refuse to validate a file if a suspicious signal is detected', reponse:false, explication:'No! i-Hub does not refuse alone. It flags the suspicious document to PSF which decides next steps.' },
]

const CAS_FR = [
  { situation:'Le PSF transmet un passeport fran\u00e7ais. La photo semble l\u00e9g\u00e8rement diff\u00e9rente de la photo du permis de conduire du m\u00eame dossier, mais les deux sont lisibles.', action:'Signaler au PSF\u00a0: photos potentiellement diff\u00e9rentes entre passeport et permis', options:['Accepter \u2014 les deux documents sont lisibles','Signaler au PSF\u00a0: photos potentiellement diff\u00e9rentes entre passeport et permis','D\u00e9clarer le dossier frauduleux','Demander directement au client final une explication'], explication:'Des photos visuellement diff\u00e9rentes entre deux documents du m\u00eame dossier = signal significatif \u00e0 transmettre au PSF. i-Hub ne conclut pas.' },
  { situation:'Le PSF transmet un justificatif de domicile. Le logo de l\u2019op\u00e9rateur t\u00e9l\u00e9phonique est pixelis\u00e9 et flou, mais l\u2019adresse et le nom correspondent au dossier.', action:'Signaler au PSF\u00a0: logo pixelis\u00e9 signal suspect de falsification num\u00e9rique', options:['Accepter \u2014 nom et adresse sont corrects','Signaler au PSF\u00a0: logo pixelis\u00e9 signal suspect de falsification num\u00e9rique','Contacter l\u2019op\u00e9rateur t\u00e9l\u00e9phonique pour v\u00e9rifier','D\u00e9clarer le document faux'], explication:'Logo pixelis\u00e9 = signal visuel de possible falsification. i-Hub signale au PSF m\u00eame si nom et adresse concordent.' },
  { situation:'Le PSF transmet un passeport. La MRZ est lisible et parfaitement coh\u00e9rente avec le corps du document. Photo claire. Aucun signe suspect.', action:'Valider le document \u2014 aucun signal suspect d\u00e9tect\u00e9', options:['Signaler quand m\u00eame au PSF par pr\u00e9caution','Demander l\u2019original physique syst\u00e9matiquement','Valider le document \u2014 aucun signal suspect d\u00e9tect\u00e9','Demander un deuxi\u00e8me document d\u2019identit\u00e9'], explication:'Document coh\u00e9rent, photo claire, MRZ correcte = aucun signal. i-Hub valide sans chercher des probl\u00e8mes l\u00e0 o\u00f9 il n\u2019y en a pas.' },
]
const CAS_EN = [
  { situation:'PSF transmits a French passport. The photo seems slightly different from the driving licence photo in the same file, but both are legible.', action:'Flag to PSF: photos potentially different between passport and licence', options:['Accept \u2014 both documents are legible','Flag to PSF: photos potentially different between passport and licence','Declare the file fraudulent','Ask the final client directly for an explanation'], explication:'Visually different photos between two documents in the same file = significant signal to transmit to PSF. i-Hub does not conclude.' },
  { situation:'PSF transmits a proof of residence. The phone operator\u2019s logo is pixelated and blurry, but address and name match the file.', action:'Flag to PSF: pixelated logo suspicious signal of digital forgery', options:['Accept \u2014 name and address are correct','Flag to PSF: pixelated logo suspicious signal of digital forgery','Contact the phone operator to verify','Declare the document fake'], explication:'Pixelated logo = visual signal of possible forgery. i-Hub flags to PSF even if name and address match.' },
  { situation:'PSF transmits a passport. MRZ is legible and perfectly consistent with the document body. Clear photo. No suspicious signs.', action:'Validate document \u2014 no suspicious signal detected', options:['Flag to PSF anyway as a precaution','Systematically request the physical original','Validate document \u2014 no suspicious signal detected','Request a second identity document'], explication:'Consistent document, clear photo, correct MRZ = no signal. i-Hub validates without looking for problems where there are none.' },
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
      <button onClick={() => router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>⚠️ {t.title}</span>
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
    const a = activeSig[sigIndex]
    return (
      <div style={{...base,background:sigAnim==='correct'?'#d1fae5':sigAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:sigAnim==='correct'?'#6ee7b7':sigAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:\`\${(sigIndex/activeSig.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'580px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {sigIndex+1}/{activeSig.length}</span>
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
            <div style={{background:sigAnim==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${sigAnim==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
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
console.log('✅ Fraudes documents écrit !');
