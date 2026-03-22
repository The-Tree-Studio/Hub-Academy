const fs = require('fs');
const ORANGE = '#e07b39';

fs.mkdirSync('app/modules/indices-americanite', { recursive: true });
fs.writeFileSync('app/modules/indices-americanite/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${ORANGE}'

const UI = {
  fr: {
    title: 'Indices d\u2019am\u00e9ricanit\u00e9', subtitle: 'D\u00e9tecter les signes d\u2019une US Person \u2014 le r\u00f4le de v\u00e9rification d\u2019i-Hub',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: ['Les 6 indices officiels FATCA', 'Comment les d\u00e9tecter dans les documents', 'Ce qu\u2019i-Hub fait quand un indice est d\u00e9tect\u00e9', 'Que faire en cas de contradiction entre indices et formulaire', 'Les situations particuli\u00e8res (double nationalit\u00e9, Green Card\u2026)', 'La r\u00e8gle d\u2019or\u00a0: signaler, ne pas conclure'],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR', goFurther: '\ud83d\udd0d Aller plus loin',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 INDICE OU PAS\u00a0?', q1title: '\ud83d\udd0d Est-ce un indice d\u2019am\u00e9ricanit\u00e9\u00a0?',
    q1sub: 'Pour chaque \u00e9l\u00e9ment, d\u00e9cidez si c\u2019est un indice officiel FATCA ou non',
    oui: '\ud83d\udfe2 Indice', non: '\u26aa Pas un indice',
    q2label: 'QUIZ 2/3 \u00b7 VRAI OU FAUX', q2title: '\u2705 Vrai ou Faux',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q3label: 'QUIZ 3/3 \u00b7 QUE FAIT i-Hub\u00a0?', q3title: '\ud83e\udd14 Quelle est la bonne r\u00e9action\u00a0?',
    q3sub: 'Un indice a \u00e9t\u00e9 d\u00e9tect\u00e9 \u2014 que doit faire i-Hub\u00a0?',
    resultTitle: 'Module termin\u00e9 \u2014 Vous savez d\u00e9tecter et signaler\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    pts_gained: 'pts', medal_gold: 'D\u00e9tective FATCA\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Terminer \u2192',
  },
  en: {
    title: 'US Indicia', subtitle: 'Detecting signs of a US Person \u2014 i-Hub\u2019s verification role',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: ['The 6 official FATCA indicia', 'How to detect them in documents', 'What i-Hub does when an indicium is detected', 'What to do when indicia and form contradict each other', 'Special situations (dual nationality, Green Card\u2026)', 'The golden rule: flag, do not conclude'],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '\ud83d\udd0d Go further',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 INDICIUM OR NOT?', q1title: '\ud83d\udd0d Is this a US indicium?',
    q1sub: 'For each element, decide whether it is an official FATCA indicium or not',
    oui: '\ud83d\udfe2 Indicium', non: '\u26aa Not an indicium',
    q2label: 'QUIZ 2/3 \u00b7 TRUE OR FALSE', q2title: '\u2705 True or False',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q3label: 'QUIZ 3/3 \u00b7 WHAT DOES i-Hub DO?', q3title: '\ud83e\udd14 What is the correct reaction?',
    q3sub: 'An indicium has been detected \u2014 what should i-Hub do?',
    resultTitle: 'Module complete \u2014 You know how to detect and flag!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    pts_gained: 'pts', medal_gold: 'FATCA Detective!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Finish \u2192',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udd0d', titre:'C\u2019est quoi un indice d\u2019am\u00e9ricanit\u00e9\u00a0?', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Un **indice d\u2019am\u00e9ricanit\u00e9** est un \u00e9l\u00e9ment dans le dossier du client final qui sugg\u00e8re une possible nationalit\u00e9 ou r\u00e9sidence am\u00e9ricaine' },
    { icon:'\ud83d\udd0d', texte:'Il ne prouve pas que le client est une US Person \u2014 il **oblige le PSF \u00e0 v\u00e9rifier** davantage avant de conclure' },
    { icon:'\ud83d\udccc', texte:'FATCA d\u00e9finit **6 indices officiels** \u2014 i-Hub doit les conna\u00eetre pour les d\u00e9tecter lors de ses v\u00e9rifications documentaires' },
    { icon:'\ud83d\uded1', texte:'Quand i-Hub d\u00e9tecte un indice\u00a0: il **signale au PSF** \u2014 c\u2019est le PSF qui demande des clarifications au client final' },
  ], aretenir:'Un indice = un signal \u00e0 transmettre au PSF. Pas une conclusion. Jamais i-Hub ne d\u00e9cide seul du statut US d\u2019un client final.' },
  { id:2, emoji:'1\ufe0f\u20e3', titre:'Indice n\u00b01\u00a0: Lieu de naissance aux USA', contenu:[
    { icon:'\ud83d\udc76', texte:'Le **lieu de naissance aux \u00c9tats-Unis** figurant sur un passeport ou document d\u2019identit\u00e9 est un indice FATCA majeur' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: lors de la v\u00e9rification du passeport ou extrait de naissance transmis par le PSF' },
    { icon:'\u26a0\ufe0f', texte:'Attention\u00a0: une personne n\u00e9e aux USA peut avoir renforc\u00e9 sa nationalit\u00e9 \u00e9trang\u00e8re \u2014 mais reste US Person sauf renonciation formelle' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: **signaler au PSF** \u2014 le client final a rempli un W-8BEN mais est n\u00e9 \u00e0 Boston \u2192 contradiction \u00e0 r\u00e9soudre par le PSF' },
  ], aretenir:'N\u00e9 aux USA + W-8BEN = red flag imm\u00e9diat. i-Hub le signale au PSF qui demande des clarifications ou un W-9 au client final.' },
  { id:3, emoji:'2\ufe0f\u20e3', titre:'Indice n\u00b02\u00a0: Adresse am\u00e9ricaine', contenu:[
    { icon:'\ud83c\udfe0', texte:'Toute **adresse de r\u00e9sidence ou adresse postale aux USA** dans le dossier est un indice FATCA' },
    { icon:'\ud83d\udce6', texte:'Inclut les **bo\u00eetes postales am\u00e9ricaines** (PO Box) et les adresses de type \u00ab\u00a0c/o\u00a0\u00bb (aux bons soins de) aux USA' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: adresse figurant dans le formulaire KYC, la correspondance ou les documents transmis par le PSF' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: signaler au PSF si une adresse US est visible dans le dossier mais absente de la documentation fiscale' },
  ], aretenir:'Une adresse US dans le dossier du client final, m\u00eame partielle ou secondaire, est un indice \u00e0 signaler au PSF.' },
  { id:4, emoji:'3\ufe0f\u20e3', titre:'Indice n\u00b03\u00a0: Num\u00e9ro de t\u00e9l\u00e9phone am\u00e9ricain', contenu:[
    { icon:'\ud83d\udcf1', texte:'Un **num\u00e9ro de t\u00e9l\u00e9phone am\u00e9ricain** (+1) associ\u00e9 au compte du client final est un indice FATCA' },
    { icon:'\ud83d\udd22', texte:'Les indicatifs am\u00e9ricains les plus courants\u00a0: +1 suivi de 10 chiffres (ex\u00a0: +1 212\u2026 pour New York, +1 310\u2026 pour Los Angeles)' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: dans les informations de contact du dossier client transmis par le PSF' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: signaler si le num\u00e9ro de t\u00e9l\u00e9phone US n\u2019est pas mentionn\u00e9 dans la documentation fiscale du client final' },
  ], aretenir:'Un num\u00e9ro +1 dans le dossier client final, non mentionn\u00e9 dans les formulaires fiscaux = indice \u00e0 signaler au PSF.' },
  { id:5, emoji:'4\ufe0f\u20e3', titre:'Indice n\u00b04\u00a0: Virement permanent vers les USA', contenu:[
    { icon:'\ud83d\udcb8', texte:'Un **ordre de virement permanent** vers un compte bancaire am\u00e9ricain associ\u00e9 au compte du client final est un indice FATCA' },
    { icon:'\ud83d\udd0d', texte:'Cela peut indiquer un lien \u00e9conomique fort avec les USA (propri\u00e9t\u00e9, revenus, famille)' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: dans les instructions de paiement ou ordres permanents associ\u00e9s au compte' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: signaler au PSF si un virement permanent vers un IBAN/ABA am\u00e9ricain est visible dans le dossier' },
  ], aretenir:'Un virement r\u00e9current vers les USA peut indiquer une US Person non identifi\u00e9e. Signaler au PSF pour clarification.' },
  { id:6, emoji:'5\ufe0f\u20e3', titre:'Indice n\u00b05\u00a0: Procuration \u00e0 une personne am\u00e9ricaine', contenu:[
    { icon:'\ud83d\udcdd', texte:'Une **procuration ou d\u00e9l\u00e9gation de signature** donn\u00e9e \u00e0 une personne ayant une adresse aux USA est un indice FATCA' },
    { icon:'\ud83e\udd14', texte:'Logique\u00a0: si quelqu\u2019un en qui vous avez confiance pour g\u00e9rer vos finances vit aux USA, vous avez peut-\u00eatre des liens am\u00e9ricains' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: dans les documents de procuration transmis au PSF lors de l\u2019entr\u00e9e en relation' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: signaler au PSF si le mandataire a une adresse US et que cela n\u2019est pas mentionn\u00e9 dans la documentation fiscale' },
  ], aretenir:'Un mandataire avec adresse US = indice \u00e0 signaler. i-Hub ne juge pas \u2014 il informe le PSF qui clarifiera avec le client final.' },
  { id:7, emoji:'6\ufe0f\u20e3', titre:'Indice n\u00b06\u00a0: Adresse \u00ab\u00a0c/o\u00a0\u00bb ou \u00ab\u00a0hold mail\u00a0\u00bb', contenu:[
    { icon:'\ud83d\udce8', texte:'Une **adresse de type \u00ab\u00a0c/o\u00a0\u00bb** (aux bons soins de) ou \u00ab\u00a0hold mail\u00a0\u00bb (courrier \u00e0 retenir) comme seule adresse du client final est un indice' },
    { icon:'\u26a0\ufe0f', texte:'Particularit\u00e9\u00a0: cet indice est plus fort que les autres car l\u2019absence d\u2019adresse permanente peut cacher une r\u00e9sidence am\u00e9ricaine' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: lors de la v\u00e9rification des documents KYC transmis par le PSF' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: signaler au PSF si \u00ab\u00a0c/o\u00a0\u00bb ou \u00ab\u00a0hold mail\u00a0\u00bb est la seule adresse disponible sans justification' },
  ], aretenir:'Une adresse c/o ou hold mail comme unique adresse est une anomalie documentaire et un indice FATCA \u00e0 signaler imm\u00e9diatement.' },
  { id:8, emoji:'\ud83d\udcca', titre:'Tableau r\u00e9capitulatif des 6 indices', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Lieu de naissance** aux USA sur un document d\u2019identit\u00e9' },
    { icon:'2\ufe0f\u20e3', texte:'**Adresse** de r\u00e9sidence ou postale aux USA (y compris PO Box)' },
    { icon:'3\ufe0f\u20e3', texte:'**Num\u00e9ro de t\u00e9l\u00e9phone** am\u00e9ricain (+1) dans le dossier' },
    { icon:'4\ufe0f\u20e3', texte:'**Virement permanent** vers un compte bancaire aux USA' },
    { icon:'5\ufe0f\u20e3', texte:'**Procuration ou d\u00e9l\u00e9gation** donn\u00e9e \u00e0 quelqu\u2019un avec adresse US' },
    { icon:'6\ufe0f\u20e3', texte:'**Adresse c/o ou hold mail** comme seule adresse disponible' },
  ], aretenir:'Ces 6 indices sont d\u00e9finis par FATCA. D\u00e8s qu\u2019un seul est visible dans le dossier transmis par le PSF, i-Hub le signale.' },
  { id:9, emoji:'\ud83d\uded1', titre:'Un indice \u2260 certitude US Person', contenu:[
    { icon:'\ud83e\udd14', texte:'La pr\u00e9sence d\u2019un indice **ne signifie pas automatiquement** que le client final est une US Person' },
    { icon:'\ud83d\udcdd', texte:'Exemple\u00a0: quelqu\u2019un n\u00e9 aux USA qui a renfonc\u00e9 \u00e0 la citoyennet\u00e9 am\u00e9ricaine peut fournir une preuve de renonciation' },
    { icon:'\ud83d\udd04', texte:'Exemple\u00a0: une adresse am\u00e9ricaine peut appartenir \u00e0 un r\u00e9sident \u00e9tranger temporaire sans lien fiscal avec les USA' },
    { icon:'\ud83d\udccc', texte:'C\u2019est **le PSF** qui analyse le contexte et d\u00e9cide \u2014 i-Hub signale l\u2019indice, pas la conclusion' },
  ], aretenir:'Indice \u2260 conclusion. i-Hub d\u00e9tecte et signale. Le PSF demande des clarifications au client final et prend la d\u00e9cision finale.' },
  { id:10, emoji:'\u26a0\ufe0f', titre:'La contradiction indice \u2260 formulaire', contenu:[
    { icon:'\ud83d\udd34', texte:'Cas fr\u00e9quent\u00a0: le client final remplit un **W-8BEN** (non-US) mais le passeport montre une naissance \u00e0 Chicago' },
    { icon:'\ud83d\udd34', texte:'Autre cas\u00a0: autocertification CRS indique r\u00e9sidence luxembourgeoise mais une adresse US est visible dans le dossier' },
    { icon:'\ud83d\udccc', texte:'R\u00e8gle i-Hub\u00a0: **toute contradiction** entre un formulaire fiscal et un indice visible doit \u00eatre signal\u00e9e au PSF' },
    { icon:'\ud83d\udeab', texte:'i-Hub n\u2019accepte pas un formulaire incoh\u00e9rent \u2014 il documente la contradiction et la signale, le PSF tranche' },
  ], aretenir:'Formulaire W-8BEN + indice US visible = red flag imm\u00e9diat. i-Hub signale la contradiction au PSF et la documente.' },
  { id:11, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:'La double nationalit\u00e9 am\u00e9ricaine', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Un **double national** (ex\u00a0: franco-am\u00e9ricain) est une **US Person** m\u00eame s\u2019il vit en France et poss\u00e8de un passeport fran\u00e7ais' },
    { icon:'\ud83d\udcdd', texte:'La nationalit\u00e9 am\u00e9ricaine ne dispara\u00eet pas avec une autre nationalit\u00e9 \u2014 seule une **renonciation formelle** (CLN) y met fin' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: lieu de naissance aux USA sur le passeport fran\u00e7ais = indice \u00e0 signaler m\u00eame si le formulaire est W-8BEN' },
    { icon:'\ud83d\uded1', texte:'Action i-Hub\u00a0: signaler au PSF \u2014 le PSF demandera au client final s\u2019il poss\u00e8de la nationalit\u00e9 am\u00e9ricaine' },
  ], aretenir:'Un passeport fran\u00e7ais avec lieu de naissance aux USA = possible double national = indice FATCA \u00e0 signaler au PSF.' },
  { id:12, emoji:'\ud83d\udfe9', titre:'La Green Card\u00a0: r\u00e9sidence permanente US', contenu:[
    { icon:'\ud83d\udfe9', texte:'Une **Green Card** (carte de r\u00e9sidence permanente) am\u00e9ricaine fait de son d\u00e9tenteur une **US Person** m\u00eame s\u2019il vit ailleurs' },
    { icon:'\u2705', texte:'Comment d\u00e9tecter\u00a0: mention de la Green Card dans les documents KYC, adresse historique aux USA, num\u00e9ro d\u2019alien' },
    { icon:'\ud83d\udd04', texte:'Une Green Card peut expirer ou avoir \u00e9t\u00e9 abandonn\u00e9e \u2014 le client final doit fournir la preuve de renonciation si c\u2019est le cas' },
    { icon:'\ud83d\udea8', texte:'Action i-Hub\u00a0: signaler au PSF si une Green Card pass\u00e9e ou pr\u00e9sente est visible dans les documents transmis' },
  ], aretenir:'Green Card = US Person automatique. M\u00eame expir\u00e9e, elle cr\u00e9e des obligations FATCA sauf preuve de renonciation en bonne et due forme.' },
  { id:13, emoji:'\ud83d\udccb', titre:'Les documents o\u00f9 chercher les indices', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Passeport et pi\u00e8ce d\u2019identit\u00e9**\u00a0: lieu de naissance, nationalit\u00e9, num\u00e9ro am\u00e9ricain \u00e9ventuel' },
    { icon:'\ud83d\udcdc', texte:'**Formulaire KYC et questionnaire d\u2019entr\u00e9e en relation**\u00a0: adresse, num\u00e9ro de t\u00e9l\u00e9phone, historique de r\u00e9sidence' },
    { icon:'\ud83d\udcb8', texte:'**Instructions de paiement**\u00a0: IBAN/ABA am\u00e9ricains dans les ordres de virement permanents' },
    { icon:'\ud83d\udcdd', texte:'**Actes de procuration**\u00a0: adresse du mandataire, liens avec les USA' },
  ], aretenir:'Les indices se cachent dans les documents ordinaires du dossier. i-Hub les cherche m\u00eame quand le formulaire fiscal semble en ordre.' },
  { id:14, emoji:'\ud83d\udd04', titre:'Que faire quand un indice est d\u00e9tect\u00e9\u00a0?', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Documenter**\u00a0: noter l\u2019indice d\u00e9tect\u00e9, sa source (quel document) et sa nature (quel type d\u2019indice)' },
    { icon:'2\ufe0f\u20e3', texte:'**Signaler au PSF**\u00a0: transmettre le rapport de v\u00e9rification avec la mention de l\u2019indice d\u00e9tect\u00e9' },
    { icon:'3\ufe0f\u20e3', texte:'**Ne pas conclure**\u00a0: i-Hub ne classe pas le client final comme US Person \u2014 c\u2019est la responsabilit\u00e9 du PSF' },
    { icon:'4\ufe0f\u20e3', texte:'**Ne pas contacter le client final**\u00a0: i-Hub ne contacte pas directement le client final sauf SLA sp\u00e9cifique' },
  ], aretenir:'D\u00e9tecter \u2192 Documenter \u2192 Signaler au PSF. Jamais conclure, jamais contacter le client final directement.' },
  { id:15, emoji:'\ud83e\udd14', titre:'Les faux positifs\u00a0: \u00eatre m\u00e9thodique', contenu:[
    { icon:'\ud83d\udccc', texte:'Tous les indices ne m\u00e8nent pas \u00e0 une US Person \u2014 ils d\u00e9clenchent une v\u00e9rification, pas une conclusion' },
    { icon:'\ud83d\udcdd', texte:'Un client final peut avoir une adresse US sans lien fiscal (propri\u00e9t\u00e9 de vacances, adresse de facturation\u2026)' },
    { icon:'\ud83e\udeaa', texte:'Un lieu de naissance aux USA peut concerner un enfant n\u00e9 lors d\u2019un s\u00e9jour temporaire des parents \u2014 cas documentable' },
    { icon:'\ud83d\udcce', texte:'Dans tous les cas\u00a0: i-Hub signale et documente, le PSF obtient les justificatifs du client final et d\u00e9cide' },
  ], aretenir:'Les faux positifs existent. i-Hub signale tout indice sans exception \u2014 le PSF dispose du contexte pour trancher avec le client final.' },
  { id:16, emoji:'\ud83d\udea8', titre:'La r\u00e8ngle d\u2019or\u00a0: signaler, ne pas conclure', contenu:[
    { icon:'\u2705', texte:'Ce qu\u2019i-Hub FAIT\u00a0: d\u00e9tecter, documenter, signaler l\u2019indice au PSF' },
    { icon:'\u274c', texte:'Ce qu\u2019i-Hub NE FAIT PAS\u00a0: classifier le client final comme US Person' },
    { icon:'\u274c', texte:'Ce qu\u2019i-Hub NE FAIT PAS\u00a0: ignorer un indice m\u00eame \u00ab\u00a0mineur\u00a0\u00bb ou hors p\u00e9rim\u00e8tre SLA' },
    { icon:'\u274c', texte:'Ce qu\u2019i-Hub NE FAIT PAS\u00a0: contacter le client final pour obtenir des clarifications (sauf SLA sp\u00e9cifique)' },
  ], aretenir:'La r\u00e8gle d\u2019or\u00a0: signal = PSF. Conclusion = PSF. Contact client final = PSF. i-Hub d\u00e9tecte et transmet, c\u2019est tout.' },
  { id:17, emoji:'\ud83d\udcdc', titre:'Les documents de preuve de renonciation', contenu:[
    { icon:'\ud83d\udccb', texte:'Un client final n\u00e9 aux USA peut avoir **renonc\u00e9 \u00e0 la citoyennet\u00e9 am\u00e9ricaine** \u2014 dans ce cas, FATCA ne s\u2019applique plus' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'La preuve de renonciation\u00a0: le **CLN** (Certificate of Loss of Nationality) d\u00e9livr\u00e9 par l\u2019ambassade am\u00e9ricaine' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la **pr\u00e9sence et la validit\u00e9** du CLN dans le dossier si le PSF l\u2019a collect\u00e9 \u2014 puis transmet au PSF' },
    { icon:'\ud83d\uded1', texte:'Sans CLN valide, un client n\u00e9 aux USA reste une US Person \u2014 m\u00eame s\u2019il a un passeport \u00e9tranger depuis 40 ans' },
  ], aretenir:'CLN = seule preuve valide de renonciation \u00e0 la nationalit\u00e9 US. i-Hub v\u00e9rifie sa pr\u00e9sence dans le dossier si fourni par le PSF.' },
  { id:18, emoji:'\ud83c\udf0d', titre:'Les indices CRS\u00a0: similaires mais diff\u00e9rents', contenu:[
    { icon:'\ud83c\udf0d', texte:'Pour CRS\u00a0: les indices de **r\u00e9sidence \u00e9trang\u00e8re** (adresse \u00e9trang\u00e8re, NIF \u00e9tranger, virement vers l\u2019\u00e9tranger)' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Pour FATCA\u00a0: les 6 indices d\u2019**am\u00e9ricanit\u00e9** (naissance, adresse, t\u00e9l\u00e9phone, virement, procuration, c/o)' },
    { icon:'\ud83d\udd04', texte:'Un m\u00eame document peut contenir des indices FATCA **et** CRS \u2014 i-Hub doit v\u00e9rifier les deux' },
    { icon:'\ud83d\udccc', texte:'Dans les deux cas\u00a0: i-Hub signale au PSF qui prend les mesures n\u00e9cessaires avec son client final' },
  ], aretenir:'FATCA et CRS ont leurs propres indices. i-Hub les connaît tous et les signale au PSF sans exception.' },
  { id:19, emoji:'\ud83d\udcce', titre:'La documentation des indices d\u00e9tect\u00e9s', contenu:[
    { icon:'\ud83d\udcdd', texte:'i-Hub documente chaque indice d\u00e9tect\u00e9\u00a0: type d\u2019indice, source dans le dossier, date de d\u00e9tection' },
    { icon:'\ud83d\udce4', texte:'Ce rapport est transmis au PSF avec les donn\u00e9es v\u00e9rifi\u00e9es, via les canaux s\u00e9curis\u00e9s pr\u00e9vus au SLA' },
    { icon:'\ud83d\uddc2\ufe0f', texte:'i-Hub archive ses rapports de v\u00e9rification **pour sa propre protection** en cas de contr\u00f4le de la CSSF' },
    { icon:'\u23f0', texte:'La documentation doit \u00eatre conserv\u00e9e **au moins 5 ans** apr\u00e8s la fin de la relation avec le PSF concern\u00e9' },
  ], aretenir:'Documenter les indices d\u00e9tect\u00e9s prot\u00e8ge i-Hub. C\u2019est la preuve de la diligence effectu\u00e9e lors de la v\u00e9rification.' },
  { id:20, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: le processus complet', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Recevoir** le dossier du client final transmis par le PSF' },
    { icon:'2\ufe0f\u20e3', texte:'**Scanner** tous les documents \u00e0 la recherche des 6 indices d\u2019am\u00e9ricanit\u00e9 (et des indices CRS si applicable)' },
    { icon:'3\ufe0f\u20e3', texte:'**Documenter** chaque indice d\u00e9tect\u00e9\u00a0: type, source, date' },
    { icon:'4\ufe0f\u20e3', texte:'**Signaler** au PSF avec les donn\u00e9es v\u00e9rifi\u00e9es et les red flags identifi\u00e9s' },
    { icon:'5\ufe0f\u20e3', texte:'**Archiver** le rapport de v\u00e9rification pour la protection d\u2019i-Hub' },
  ], aretenir:'Recevoir \u2192 Scanner \u2192 Documenter \u2192 Signaler \u2192 Archiver. i-Hub ne conclut jamais seul. Le PSF d\u00e9cide.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udd0d', titre:'What is a US indicium?', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'A **US indicium** is an element in the final client\u2019s file that suggests a possible US nationality or residency' },
    { icon:'\ud83d\udd0d', texte:'It does not prove the client is a US Person \u2014 it **requires the PSF to investigate further** before concluding' },
    { icon:'\ud83d\udccc', texte:'FATCA defines **6 official indicia** \u2014 i-Hub must know them to detect them during documentary verifications' },
    { icon:'\ud83d\uded1', texte:'When i-Hub detects an indicium: it **flags to the PSF** \u2014 it is the PSF that seeks clarification from the final client' },
  ], aretenir:'An indicium = a signal to pass to the PSF. Not a conclusion. i-Hub never decides alone on a final client\u2019s US status.' },
  { id:2, emoji:'1\ufe0f\u20e3', titre:'Indicium #1: US place of birth', contenu:[
    { icon:'\ud83d\udc76', texte:'A **US place of birth** on a passport or identity document is a major FATCA indicium' },
    { icon:'\u2705', texte:'How to detect: during verification of the passport or birth certificate transmitted by the PSF' },
    { icon:'\u26a0\ufe0f', texte:'Note: someone born in the US who reinforced a foreign nationality remains a US Person unless they formally renounce' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: **flag to the PSF** \u2014 final client completed W-8BEN but was born in Boston \u2192 contradiction to resolve by PSF' },
  ], aretenir:'Born in US + W-8BEN = immediate red flag. i-Hub flags to the PSF which requests clarification or W-9 from the final client.' },
  { id:3, emoji:'2\ufe0f\u20e3', titre:'Indicium #2: US address', contenu:[
    { icon:'\ud83c\udfe0', texte:'Any **US residential or mailing address** in the file is a FATCA indicium' },
    { icon:'\ud83d\udce6', texte:'Includes **US PO Boxes** and \u201ccare of\u201d addresses in the US' },
    { icon:'\u2705', texte:'How to detect: address in the KYC form, correspondence or documents transmitted by the PSF' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: flag to PSF if a US address is visible in the file but absent from the tax documentation' },
  ], aretenir:'A US address in the final client\u2019s file, even partial or secondary, is an indicium to flag to the PSF.' },
  { id:4, emoji:'3\ufe0f\u20e3', titre:'Indicium #3: US phone number', contenu:[
    { icon:'\ud83d\udcf1', texte:'A **US phone number** (+1) associated with the final client\u2019s account is a FATCA indicium' },
    { icon:'\ud83d\udd22', texte:'Common US codes: +1 followed by 10 digits (e.g. +1 212\u2026 for New York, +1 310\u2026 for Los Angeles)' },
    { icon:'\u2705', texte:'How to detect: in the contact information of the client file transmitted by the PSF' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: flag if the US phone number is not mentioned in the final client\u2019s tax documentation' },
  ], aretenir:'A +1 number in the final client file, not mentioned in tax forms = indicium to flag to PSF.' },
  { id:5, emoji:'4\ufe0f\u20e3', titre:'Indicium #4: Standing transfer to the US', contenu:[
    { icon:'\ud83d\udcb8', texte:'A **standing transfer order** to a US bank account linked to the final client\u2019s account is a FATCA indicium' },
    { icon:'\ud83d\udd0d', texte:'This may indicate a strong economic link with the US (property, income, family)' },
    { icon:'\u2705', texte:'How to detect: in payment instructions or standing orders associated with the account' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: flag to PSF if a standing transfer to a US IBAN/ABA is visible in the file' },
  ], aretenir:'A recurring transfer to the US may indicate an unidentified US Person. Flag to PSF for clarification.' },
  { id:6, emoji:'5\ufe0f\u20e3', titre:'Indicium #5: Power of attorney to a US person', contenu:[
    { icon:'\ud83d\udcdd', texte:'A **power of attorney or signatory authority** granted to a person with a US address is a FATCA indicium' },
    { icon:'\ud83e\udd14', texte:'Logic: if someone you trust to manage your finances lives in the US, you may have US ties' },
    { icon:'\u2705', texte:'How to detect: in power of attorney documents transmitted to the PSF at onboarding' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: flag to PSF if the attorney has a US address not mentioned in the tax documentation' },
  ], aretenir:'An attorney with a US address = indicium to flag. i-Hub does not judge \u2014 it informs the PSF which clarifies with the final client.' },
  { id:7, emoji:'6\ufe0f\u20e3', titre:'Indicium #6: \u201cCare of\u201d or \u201chold mail\u201d address', contenu:[
    { icon:'\ud83d\udce8', texte:'A **\u201ccare of\u201d or \u201chold mail\u201d address** as the only address for the final client is a FATCA indicium' },
    { icon:'\u26a0\ufe0f', texte:'Particularity: this indicium is stronger than others because the absence of a permanent address may hide a US residency' },
    { icon:'\u2705', texte:'How to detect: during verification of KYC documents transmitted by the PSF' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: flag to PSF if \u201ccare of\u201d or \u201chold mail\u201d is the only available address without justification' },
  ], aretenir:'A c/o or hold mail address as the only address is a documentary anomaly and a FATCA indicium to flag immediately.' },
  { id:8, emoji:'\ud83d\udcca', titre:'Summary table of the 6 indicia', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Place of birth** in the US on an identity document' },
    { icon:'2\ufe0f\u20e3', texte:'**Residential or mailing address** in the US (including PO Box)' },
    { icon:'3\ufe0f\u20e3', texte:'**US phone number** (+1) in the file' },
    { icon:'4\ufe0f\u20e3', texte:'**Standing transfer** to a US bank account' },
    { icon:'5\ufe0f\u20e3', texte:'**Power of attorney** granted to someone with a US address' },
    { icon:'6\ufe0f\u20e3', texte:'**Care of or hold mail address** as the only available address' },
  ], aretenir:'These 6 indicia are defined by FATCA. As soon as one is visible in the file transmitted by the PSF, i-Hub flags it.' },
  { id:9, emoji:'\ud83d\uded1', titre:'An indicium \u2260 certainty of US Person status', contenu:[
    { icon:'\ud83e\udd14', texte:'The presence of an indicium **does not automatically mean** the final client is a US Person' },
    { icon:'\ud83d\udcdd', texte:'Example: someone born in the US who formally renounced US citizenship can provide proof of renunciation' },
    { icon:'\ud83d\udd04', texte:'Example: a US address may belong to a temporary foreign resident with no fiscal US link' },
    { icon:'\ud83d\udccc', texte:'It is **the PSF** that analyses the context and decides \u2014 i-Hub flags the indicium, not the conclusion' },
  ], aretenir:'Indicium \u2260 conclusion. i-Hub detects and flags. The PSF seeks clarification from the final client and makes the final decision.' },
  { id:10, emoji:'\u26a0\ufe0f', titre:'The contradiction: indicium vs form', contenu:[
    { icon:'\ud83d\udd34', texte:'Frequent case: final client completes a **W-8BEN** (non-US) but the passport shows a US birthplace' },
    { icon:'\ud83d\udd34', texte:'Another case: CRS self-certification states Luxembourg residency but a US address is visible in the file' },
    { icon:'\ud83d\udccc', texte:'i-Hub rule: **any contradiction** between a tax form and a visible indicium must be flagged to the PSF' },
    { icon:'\ud83d\udeab', texte:'i-Hub does not accept an inconsistent form \u2014 it documents the contradiction and flags it, the PSF decides' },
  ], aretenir:'W-8BEN form + visible US indicium = immediate red flag. i-Hub flags the contradiction to the PSF and documents it.' },
  { id:11, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:'US dual nationality', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'A **dual national** (e.g. Franco-American) is a **US Person** even if they live in France and hold a French passport' },
    { icon:'\ud83d\udcdd', texte:'US nationality does not disappear with another nationality \u2014 only a formal **renunciation** (CLN) ends it' },
    { icon:'\u2705', texte:'How to detect: US birthplace on the French passport = indicium to flag even if the form is W-8BEN' },
    { icon:'\ud83d\uded1', texte:'i-Hub action: flag to PSF \u2014 the PSF will ask the final client whether they hold US nationality' },
  ], aretenir:'French passport with US birthplace = possible dual national = FATCA indicium to flag to the PSF.' },
  { id:12, emoji:'\ud83d\udfe9', titre:'The Green Card: US permanent residency', contenu:[
    { icon:'\ud83d\udfe9', texte:'A **Green Card** (US permanent resident card) makes its holder a **US Person** even if they live elsewhere' },
    { icon:'\u2705', texte:'How to detect: Green Card mentioned in KYC documents, historical US address, alien number' },
    { icon:'\ud83d\udd04', texte:'A Green Card may have expired or been surrendered \u2014 the final client must provide proof of surrender if so' },
    { icon:'\ud83d\udea8', texte:'i-Hub action: flag to PSF if a past or present Green Card is visible in the transmitted documents' },
  ], aretenir:'Green Card = automatic US Person. Even expired, it creates FATCA obligations unless proof of formal surrender is provided.' },
  { id:13, emoji:'\ud83d\udccb', titre:'Documents where to look for indicia', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Passport and ID**: birthplace, nationality, possible US number' },
    { icon:'\ud83d\udcdc', texte:'**KYC form and onboarding questionnaire**: address, phone number, residence history' },
    { icon:'\ud83d\udcb8', texte:'**Payment instructions**: US IBAN/ABA in standing transfer orders' },
    { icon:'\ud83d\udcdd', texte:'**Power of attorney documents**: attorney\u2019s address, US links' },
  ], aretenir:'Indicia hide in ordinary documents. i-Hub looks for them even when the tax form seems in order.' },
  { id:14, emoji:'\ud83d\udd04', titre:'What to do when an indicium is detected?', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Document**: note the indicium detected, its source (which document) and its nature (which type)' },
    { icon:'2\ufe0f\u20e3', texte:'**Flag to the PSF**: transmit the verification report with the mention of the detected indicium' },
    { icon:'3\ufe0f\u20e3', texte:'**Do not conclude**: i-Hub does not classify the final client as a US Person \u2014 this is the PSF\u2019s responsibility' },
    { icon:'4\ufe0f\u20e3', texte:'**Do not contact the final client**: i-Hub does not contact the final client directly unless specified in the SLA' },
  ], aretenir:'Detect \u2192 Document \u2192 Flag to PSF. Never conclude, never contact the final client directly.' },
  { id:15, emoji:'\ud83e\udd14', titre:'False positives: be methodical', contenu:[
    { icon:'\ud83d\udccc', texte:'Not all indicia lead to a US Person \u2014 they trigger a verification, not a conclusion' },
    { icon:'\ud83d\udcdd', texte:'A final client may have a US address without a tax link (holiday property, billing address\u2026)' },
    { icon:'\ud83e\udeaa', texte:'A US birthplace may concern a child born during parents\u2019 temporary stay \u2014 a documentable case' },
    { icon:'\ud83d\udcce', texte:'In all cases: i-Hub flags and documents, the PSF obtains supporting documents from the final client and decides' },
  ], aretenir:'False positives exist. i-Hub flags every indicium without exception \u2014 the PSF has the context to decide with the final client.' },
  { id:16, emoji:'\ud83d\udea8', titre:'The golden rule: flag, do not conclude', contenu:[
    { icon:'\u2705', texte:'What i-Hub DOES: detect, document, flag the indicium to the PSF' },
    { icon:'\u274c', texte:'What i-Hub DOES NOT DO: classify the final client as a US Person' },
    { icon:'\u274c', texte:'What i-Hub DOES NOT DO: ignore an indicium even a \u201cminor\u201d one or outside the SLA scope' },
    { icon:'\u274c', texte:'What i-Hub DOES NOT DO: contact the final client for clarification (unless specific SLA provision)' },
  ], aretenir:'Golden rule: flag = PSF. Conclusion = PSF. Client contact = PSF. i-Hub detects and transmits, that is all.' },
  { id:17, emoji:'\ud83d\udcdc', titre:'Documents proving renunciation of US nationality', contenu:[
    { icon:'\ud83d\udccb', texte:'A final client born in the US may have **renounced US citizenship** \u2014 in that case, FATCA no longer applies' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Proof of renunciation: the **CLN** (Certificate of Loss of Nationality) issued by the US embassy' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies the **presence and validity** of the CLN in the file if collected by the PSF \u2014 then transmits to PSF' },
    { icon:'\ud83d\uded1', texte:'Without a valid CLN, a client born in the US remains a US Person \u2014 even with a foreign passport for 40 years' },
  ], aretenir:'CLN = only valid proof of US nationality renunciation. i-Hub checks its presence in the file if provided by the PSF.' },
  { id:18, emoji:'\ud83c\udf0d', titre:'CRS indicia: similar but different', contenu:[
    { icon:'\ud83c\udf0d', texte:'For CRS: indicators of **foreign residency** (foreign address, foreign TIN, transfer abroad)' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'For FATCA: the 6 **US indicia** (birth, address, phone, transfer, PoA, c/o)' },
    { icon:'\ud83d\udd04', texte:'The same document can contain FATCA **and** CRS indicia \u2014 i-Hub must check both' },
    { icon:'\ud83d\udccc', texte:'In both cases: i-Hub flags to PSF which takes the necessary steps with its final client' },
  ], aretenir:'FATCA and CRS each have their own indicia. i-Hub knows all of them and flags every one to the PSF.' },
  { id:19, emoji:'\ud83d\udcce', titre:'Documenting detected indicia', contenu:[
    { icon:'\ud83d\udcdd', texte:'i-Hub documents each detected indicium: type of indicium, source in the file, date of detection' },
    { icon:'\ud83d\udce4', texte:'This report is transmitted to the PSF with the verified data, via secure channels per the SLA' },
    { icon:'\ud83d\uddc2\ufe0f', texte:'i-Hub archives its verification reports **for its own protection** in case of a CSSF audit' },
    { icon:'\u23f0', texte:'Documentation must be retained **at least 5 years** after the end of the relationship with the relevant PSF' },
  ], aretenir:'Documenting detected indicia protects i-Hub. It is the proof of diligence performed during verification.' },
  { id:20, emoji:'\ud83c\udf93', titre:'Summary: the complete process', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Receive** the final client\u2019s file transmitted by the PSF' },
    { icon:'2\ufe0f\u20e3', texte:'**Scan** all documents for the 6 US indicia (and CRS indicia if applicable)' },
    { icon:'3\ufe0f\u20e3', texte:'**Document** each detected indicium: type, source, date' },
    { icon:'4\ufe0f\u20e3', texte:'**Flag** to the PSF with verified data and identified red flags' },
    { icon:'5\ufe0f\u20e3', texte:'**Archive** the verification report for i-Hub\u2019s protection' },
  ], aretenir:'Receive \u2192 Scan \u2192 Document \u2192 Flag \u2192 Archive. i-Hub never concludes alone. The PSF decides.' },
]

const INDICIA_ITEMS_FR = [
  { texte: 'Lieu de naissance aux \u00c9tats-Unis', isIndice: true },
  { texte: 'Adresse de r\u00e9sidence aux USA', isIndice: true },
  { texte: 'Num\u00e9ro de t\u00e9l\u00e9phone am\u00e9ricain (+1)', isIndice: true },
  { texte: 'Virement permanent vers un compte am\u00e9ricain', isIndice: true },
  { texte: 'Procuration donn\u00e9e \u00e0 une personne avec adresse US', isIndice: true },
  { texte: 'Adresse c/o ou hold mail comme seule adresse', isIndice: true },
  { texte: 'Nationalit\u00e9 fran\u00e7aise', isIndice: false },
  { texte: 'Compte en euros uniquement', isIndice: false },
  { texte: 'Client r\u00e9sident luxembourgeois', isIndice: false },
  { texte: 'Actionnaire principal de nationalit\u00e9 belge', isIndice: false },
  { texte: 'Passeport luxembourgeois valide', isIndice: false },
  { texte: 'Num\u00e9ro de t\u00e9l\u00e9phone fran\u00e7ais (+33)', isIndice: false },
]
const INDICIA_ITEMS_EN = [
  { texte: 'Place of birth in the United States', isIndice: true },
  { texte: 'US residential address', isIndice: true },
  { texte: 'US phone number (+1)', isIndice: true },
  { texte: 'Standing transfer to a US account', isIndice: true },
  { texte: 'Power of attorney to a person with US address', isIndice: true },
  { texte: 'Care of or hold mail address as only address', isIndice: true },
  { texte: 'French nationality', isIndice: false },
  { texte: 'Euro-only account', isIndice: false },
  { texte: 'Luxembourg resident client', isIndice: false },
  { texte: 'Main shareholder of Belgian nationality', isIndice: false },
  { texte: 'Valid Luxembourg passport', isIndice: false },
  { texte: 'French phone number (+33)', isIndice: false },
]

const VF_FR = [
  { texte: 'Un seul indice d\u2019am\u00e9ricanit\u00e9 suffit pour que le PSF soit oblig\u00e9 de v\u00e9rifier davantage', reponse: true, explication: 'Exact\u00a0! Un seul indice d\u00e9clencheobligatoirement une v\u00e9rification suppl\u00e9mentaire par le PSF.' },
  { texte: 'i-Hub peut classifier un client final comme US Person quand un indice est d\u00e9tect\u00e9', reponse: false, explication: 'Non\u00a0! i-Hub signale l\u2019indice au PSF. C\u2019est le PSF qui prend la d\u00e9cision de classification.' },
  { texte: 'Un lieu de naissance aux USA prouve que le client final est une US Person', reponse: false, explication: 'Non\u00a0! C\u2019est un indice, pas une preuve. Le client peut avoir renonc\u00e9 \u00e0 la nationalit\u00e9 am\u00e9ricaine (CLN).' },
  { texte: 'i-Hub doit documenter chaque indice d\u00e9tect\u00e9 avant de le signaler au PSF', reponse: true, explication: 'Exact\u00a0! Documenter = se prot\u00e9ger. Le rapport de v\u00e9rification prouve la diligence effectu\u00e9e.' },
  { texte: 'Une adresse c/o est moins importante que les autres indices', reponse: false, explication: 'Non\u00a0! L\u2019adresse c/o est m\u00eame plus suspecte car l\u2019absence d\u2019adresse permanente peut masquer une r\u00e9sidence US.' },
  { texte: 'i-Hub peut contacter directement le client final pour clarifier un indice d\u00e9tect\u00e9', reponse: false, explication: 'Non (sauf SLA sp\u00e9cifique)\u00a0! i-Hub contacte le PSF qui lui-m\u00eame contacte son client final.' },
  { texte: 'Un double national franco-am\u00e9ricain est soumis \u00e0 FATCA m\u00eame s\u2019il n\u2019a jamais v\u00e9cu aux USA', reponse: true, explication: 'Exact\u00a0! La nationalit\u00e9 am\u00e9ricaine cr\u00e9e l\u2019obligation FATCA, quelle que soit la r\u00e9sidence.' },
  { texte: 'Le CLN est le seul document acceptab pour prouver la renonciation \u00e0 la nationalit\u00e9 US', reponse: true, explication: 'Exact\u00a0! Certificate of Loss of Nationality = seule preuve valide de renonciation formelle \u00e0 la citoyennet\u00e9 am\u00e9ricaine.' },
]
const VF_EN = [
  { texte: 'A single US indicium is enough to require the PSF to investigate further', reponse: true, explication: 'Correct! A single indicium automatically triggers additional verification by the PSF.' },
  { texte: 'i-Hub can classify a final client as a US Person when an indicium is detected', reponse: false, explication: 'No! i-Hub flags the indicium to the PSF. It is the PSF that makes the classification decision.' },
  { texte: 'A US birthplace proves the final client is a US Person', reponse: false, explication: 'No! It is an indicium, not proof. The client may have renounced US nationality (CLN).' },
  { texte: 'i-Hub must document each detected indicium before flagging it to the PSF', reponse: true, explication: 'Correct! Document = protect yourself. The verification report proves the diligence performed.' },
  { texte: 'A care of address is less important than other indicia', reponse: false, explication: 'No! The c/o address is actually more suspect because the absence of a permanent address may hide a US residency.' },
  { texte: 'i-Hub can contact the final client directly to clarify a detected indicium', reponse: false, explication: 'No (unless specified in SLA)! i-Hub contacts the PSF which then contacts its final client.' },
  { texte: 'A Franco-American dual national is subject to FATCA even if they never lived in the US', reponse: true, explication: 'Correct! US nationality creates the FATCA obligation regardless of residency.' },
  { texte: 'The CLN is the only acceptable document to prove renunciation of US nationality', reponse: true, explication: 'Correct! Certificate of Loss of Nationality = only valid proof of formal renunciation of US citizenship.' },
]

const CAS_FR = [
  { situation: 'Vous v\u00e9rifiez le passeport d\u2019un client final\u00a0: il est fran\u00e7ais, mais n\u00e9 \u00e0 Chicago. Il a rempli un W-8BEN.', action: 'Signaler au PSF\u00a0: contradiction indice n\u00b01 vs W-8BEN', options: ['Accepter le W-8BEN \u2014 il est fran\u00e7ais', 'Signaler au PSF\u00a0: contradiction indice n\u00b01 vs W-8BEN', 'Remplacer le W-8BEN par un W-9', 'Ignorer \u2014 il a peut-\u00eatre renonc\u00e9'], explication: 'N\u00e9 \u00e0 Chicago + W-8BEN = contradiction \u00e0 signaler imp\u00e9rativement. Le PSF demandera un W-9 ou une preuve de renonciation (CLN).' },
  { situation: 'Dans le dossier KYC, le client final a un num\u00e9ro de t\u00e9l\u00e9phone +1 415 (San Francisco) mais a fourni une autocertification CRS indiquant la Belgique comme r\u00e9sidence fiscale.', action: 'Signaler les deux\u00a0: indice FATCA n\u00b03 + possible incoh\u00e9rence CRS', options: ['Accepter \u2014 il peut avoir un t\u00e9l\u00e9phone US', 'Signaler les deux\u00a0: indice FATCA n\u00b03 + possible incoh\u00e9rence CRS', 'Ignorer \u2014 hors p\u00e9rim\u00e8tre SLA', 'Modifier l\u2019autocertification'], explication: 'T\u00e9l\u00e9phone US = indice FATCA \u00e0 signaler. L\u2019incoh\u00e9rence avec la r\u00e9sidence belge m\u00e9rite aussi d\u2019\u00eatre signal\u00e9e. Le PSF clarifiera avec le client final.' },
  { situation: 'Le client final a fourni un W-9 (US Person). Vous n\u2019avez d\u00e9tect\u00e9 aucun autre indice.', action: 'Aucun red flag \u2014 transmettre les donn\u00e9es v\u00e9rifi\u00e9es au PSF', options: ['Chercher d\u2019autres indices \u00e0 tout prix', 'Aucun red flag \u2014 transmettre les donn\u00e9es v\u00e9rifi\u00e9es au PSF', 'Demander un W-8BEN en plus', 'Contacter l\u2019IRS pour v\u00e9rifier'], explication: 'W-9 fourni = client se d\u00e9clare US Person. Pas d\u2019indice contradictoire = pas de red flag. i-Hub transmet les donn\u00e9es v\u00e9rifi\u00e9es au PSF.' },
  { situation: 'La seule adresse connue du client final est \u00ab\u00a0c/o Me Dupont, 1 Rue de la Paix, Paris\u00a0\u00bb. Il a rempli un W-8BEN.', action: 'Signaler indice n\u00b06 (adresse c/o) au PSF', options: ['Accepter \u2014 c\u2019est une adresse fran\u00e7aise', 'Signaler indice n\u00b06 (adresse c/o) au PSF', 'Demander une adresse US en plus', 'Reclassifier comme US Person'], explication: 'Adresse c/o comme seule adresse = indice FATCA n\u00b06 \u00e0 signaler, m\u00eame si l\u2019adresse est fran\u00e7aise. Le PSF demandera une adresse permanente.' },
]
const CAS_EN = [
  { situation: 'You are verifying a final client\u2019s passport: they are French but born in Chicago. They completed a W-8BEN.', action: 'Flag to PSF: contradiction between indicium #1 and W-8BEN', options: ['Accept the W-8BEN \u2014 they are French', 'Flag to PSF: contradiction between indicium #1 and W-8BEN', 'Replace W-8BEN with W-9', 'Ignore \u2014 they may have renounced'], explication: 'Born in Chicago + W-8BEN = contradiction to flag immediately. PSF will request a W-9 or proof of renunciation (CLN).' },
  { situation: 'In the KYC file, the final client has a +1 415 phone number (San Francisco) but provided a CRS self-certification stating Belgium as their tax residence.', action: 'Flag both: FATCA indicium #3 + possible CRS inconsistency', options: ['Accept \u2014 they may have a US phone', 'Flag both: FATCA indicium #3 + possible CRS inconsistency', 'Ignore \u2014 outside SLA scope', 'Amend the self-certification'], explication: 'US phone = FATCA indicium to flag. The inconsistency with Belgian residency also merits flagging. PSF will clarify with the final client.' },
  { situation: 'The final client provided a W-9 (US Person). You detected no other indicia.', action: 'No red flag \u2014 transmit verified data to the PSF', options: ['Keep looking for more indicia at all costs', 'No red flag \u2014 transmit verified data to the PSF', 'Request a W-8BEN as well', 'Contact the IRS to verify'], explication: 'W-9 provided = client self-declares as US Person. No contradictory indicium = no red flag. i-Hub transmits verified data to the PSF.' },
  { situation: 'The only known address for the final client is \u201cc/o Mr Smith, 1 High Street, London\u201d. They completed a W-8BEN.', action: 'Flag indicium #6 (c/o address) to the PSF', options: ['Accept \u2014 it is a UK address', 'Flag indicium #6 (c/o address) to the PSF', 'Request a US address as well', 'Reclassify as US Person'], explication: 'Care of address as the only address = FATCA indicium #6 to flag, even if the address is in the UK. PSF will request a permanent address.' },
]

export default function ModuleIndices() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeIndicia, setActiveIndicia] = useState(() => pickRandom(INDICIA_ITEMS_FR, 8))
  const [indiciaAnswers, setIndiciaAnswers] = useState<Record<number, boolean|null>>({})
  const [indiciaSubmitted, setIndiciaSubmitted] = useState(false)

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
    const bi = l==='fr'?INDICIA_ITEMS_FR:INDICIA_ITEMS_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveIndicia(pickRandom(bi,8)); setIndiciaAnswers({}); setIndiciaSubmitted(false)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l) }

  function submitIndicia() {
    let correct = 0
    activeIndicia.forEach((item, i) => { if (indiciaAnswers[i] === item.isIndice) correct++ })
    setScore(s => s + correct * 2); setIndiciaSubmitted(true)
  }

  function repondreVF(rep: boolean) {
    if (vfRepondu !== null) return
    const correct = activeVF[vfIndex].reponse === rep; setVfRepondu(rep); setVfAnimation(correct ? 'correct' : 'wrong')
    if (correct) setVfScore(s => s + 1)
    setTimeout(() => { setVfAnimation(null); setVfRepondu(null); if (vfIndex + 1 < activeVF.length) { setVfIndex(i => i + 1) } else { setScore(s => s + (correct ? vfScore + 1 : vfScore) * 5); setPhase('quiz3') } }, 2200)
  }

  function repCas(opt: string) { if (casRepondu !== null) return; const correct = opt === activeCas[casIndex].action; setCasRepondu(opt); if (correct) setCasScore(s => s + 1) }
  function nextCas() { if (casIndex + 1 < activeCas.length) { setCasIndex(i => i + 1); setCasRepondu(null) } else { setScore(s => s + casScore * 7); setPhase('resultat') } }

  const base: React.CSSProperties = { minHeight: '100vh', background: '#f3f4f6', fontFamily: "'Segoe UI',system-ui,sans-serif", color: '#1f2937' }
  const NavBar = () => (
    <div style={{ background: '#6b7280', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: \`1px solid \${C}\`, borderRadius: '8px', padding: '6px 12px', color: C, cursor: 'pointer', fontSize: '14px' }}>{t.home}</button>
      <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>🔍 {t.title}</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '2px', gap: '2px' }}>
          {(['fr', 'en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{ padding: '4px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: lang === l ? C : 'transparent', color: 'white' }}>{l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</button>)}
        </div>
        <span style={{ background: 'white', border: \`1px solid \${C}\`, borderRadius: '20px', padding: '4px 14px', fontSize: '13px', color: C, fontWeight: '600' }}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={base}><NavBar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🔍</div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', marginBottom: '12px' }}>{t.title}</h1>
        <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '32px' }}>{t.subtitle}</p>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '28px', textAlign: 'left' }}>
          <p style={{ margin: '0 0 16px', fontWeight: '700', color: C }}>{t.learn}</p>
          {t.learnItems.map((item, i) => <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: i < t.learnItems.length - 1 ? '1px solid #f3f4f6' : 'none' }}><span style={{ color: C, fontWeight: '700' }}>✓</span><span style={{ color: '#4b5563', fontSize: '14px' }}>{item}</span></div>)}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[{ label: t.fiches, icon: '📖' }, { label: t.quiz, icon: '🎮' }, { label: t.time, icon: '⏱️' }].map((b, i) => <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '10px 20px', fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={() => setPhase('fiches')} style={{ background: C, color: 'white', border: 'none', borderRadius: '12px', padding: '16px 48px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}>{t.start}</button>
      </div>
    </div>
  )

  if (phase === 'fiches') {
    const fiche = FICHES[ficheIndex]; const progress = ((ficheIndex + 1) / FICHES.length) * 100
    return (
      <div style={base}><NavBar />
        <div style={{ background: '#e5e7eb', height: '6px' }}><div style={{ background: C, height: '6px', width: \`\${progress}%\`, transition: 'width 0.4s ease', borderRadius: '0 4px 4px 0' }} /></div>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>{lang === 'fr' ? 'FICHE' : 'CARD'} {ficheIndex + 1} / {FICHES.length}</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '220px' }}>
              {FICHES.map((_, i) => <div key={i} onClick={() => { setFicheIndex(i); setPlusLoinOpen(false) }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === ficheIndex ? C : i < ficheIndex ? C + '60' : '#d1d5db', cursor: 'pointer' }} />)}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', border: \`2px solid \${C}30\`, boxShadow: \`0 8px 40px \${C}15\` }}>
            <div style={{ background: C, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{fiche.emoji}</div>
              <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', margin: 0 }}>{fiche.titre}</h2>
            </div>
            <div style={{ padding: '20px' }}>
              {fiche.contenu.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < fiche.contenu.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <span style={{ fontSize: '22px', minWidth: '30px', textAlign: 'center' }}>{item.icon}</span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#374151' }} dangerouslySetInnerHTML={{ __html: item.texte.replace(/\\*\\*(.*?)\\*\\*/g, \`<strong style="color:\${C}">$1</strong>\`) }} />
                </div>
              ))}
              <div style={{ background: \`\${C}10\`, border: \`1px solid \${C}30\`, borderRadius: '12px', padding: '14px', marginTop: '14px', display: 'flex', gap: '10px' }}>
                <span>💡</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: C, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.toRetain}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#374151', fontStyle: 'italic' }}>{fiche.aretenir}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {ficheIndex > 0 && <button onClick={() => { setFicheIndex(i => i - 1); setPlusLoinOpen(false) }} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#6b7280', cursor: 'pointer', fontWeight: '600' }}>{t.prev}</button>}
            <button onClick={() => ficheIndex < FICHES.length - 1 ? (setFicheIndex(i => i + 1), setPlusLoinOpen(false)) : setPhase('quiz1')} style={{ flex: 2, padding: '14px', background: C, border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
              {ficheIndex < FICHES.length - 1 ? \`\${t.next} (\${ficheIndex + 2}/\${FICHES.length}) →\` : t.quizBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz1') {
    const allAnswered = Object.keys(indiciaAnswers).length === activeIndicia.length
    return (
      <div style={base}><NavBar />
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ background: \`\${C}15\`, color: C, borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>{t.q1label}</span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px' }}>{t.q1title}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{t.q1sub}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {activeIndicia.map((item, i) => {
              const answered = indiciaAnswers[i] !== undefined
              const correct = indiciaSubmitted && indiciaAnswers[i] === item.isIndice
              const wrong = indiciaSubmitted && indiciaAnswers[i] !== item.isIndice
              return (
                <div key={i} style={{ background: indiciaSubmitted ? (correct ? '#f0fdf4' : '#fff1f1') : 'white', borderRadius: '12px', padding: '14px 16px', border: \`1.5px solid \${indiciaSubmitted ? (correct ? '#6ee7b7' : '#fca5a5') : '#e5e7eb'}\`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#374151' }}>{item.texte}</span>
                  {!indiciaSubmitted ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setIndiciaAnswers(a => ({ ...a, [i]: true }))} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: indiciaAnswers[i] === true ? C : '#f3f4f6', color: indiciaAnswers[i] === true ? 'white' : '#374151' }}>{t.oui}</button>
                      <button onClick={() => setIndiciaAnswers(a => ({ ...a, [i]: false }))} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: indiciaAnswers[i] === false ? '#6b7280' : '#f3f4f6', color: indiciaAnswers[i] === false ? 'white' : '#374151' }}>{t.non}</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '18px' }}>{correct ? '✅' : '❌'}</span>
                  )}
                </div>
              )
            })}
          </div>
          {!indiciaSubmitted ? (
            <button onClick={submitIndicia} disabled={!allAnswered} style={{ width: '100%', padding: '16px', background: allAnswered ? C : '#e5e7eb', border: 'none', borderRadius: '12px', color: allAnswered ? 'white' : '#9ca3af', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>
              {lang === 'fr' ? \`Valider (\${Object.keys(indiciaAnswers).length}/\${activeIndicia.length})\` : \`Validate (\${Object.keys(indiciaAnswers).length}/\${activeIndicia.length})\`}
            </button>
          ) : (
            <button onClick={() => setPhase('quiz2')} style={{ width: '100%', padding: '16px', background: C, border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>{t.next2}</button>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'quiz2') {
    const q = activeVF[vfIndex]
    return (
      <div style={{ ...base, background: vfAnimation === 'correct' ? '#d1fae5' : vfAnimation === 'wrong' ? '#fee2e2' : '#f3f4f6', transition: 'background 0.3s' }}><NavBar />
        <div style={{ background: vfAnimation === 'correct' ? '#6ee7b7' : vfAnimation === 'wrong' ? '#fca5a5' : '#e5e7eb', height: '6px' }}>
          <div style={{ background: C, height: '6px', width: \`\${(vfIndex / activeVF.length) * 100}%\`, transition: 'width 0.4s' }} />
        </div>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <span style={{ background: \`\${C}15\`, color: C, borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '20px' }}>{t.q2label} — {vfIndex + 1}/{activeVF.length}</span>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', marginBottom: '20px' }}>{t.q2title}</h2>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', lineHeight: 1.5, margin: 0 }}>{q.texte}</p>
          </div>
          {vfRepondu === null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => repondreVF(true)} style={{ padding: '20px', background: '#d1fae5', border: '2px solid #6ee7b7', borderRadius: '16px', fontSize: '20px', fontWeight: '800', color: '#059669', cursor: 'pointer' }}>{t.true}</button>
              <button onClick={() => repondreVF(false)} style={{ padding: '20px', background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '16px', fontSize: '20px', fontWeight: '800', color: '#ef4444', cursor: 'pointer' }}>{t.false}</button>
            </div>
          ) : (
            <div style={{ background: vfAnimation === 'correct' ? '#d1fae5' : '#fee2e2', border: \`2px solid \${vfAnimation === 'correct' ? '#6ee7b7' : '#fca5a5'}\`, borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '28px', margin: '0 0 8px' }}>{vfAnimation === 'correct' ? '🎉' : '😅'}</p>
              <p style={{ fontWeight: '800', color: vfAnimation === 'correct' ? '#059669' : '#ef4444', fontSize: '18px', margin: '0 0 8px' }}>{vfAnimation === 'correct' ? t.correct : t.wrong}</p>
              <p style={{ color: '#374151', fontSize: '14px', margin: 0, fontStyle: 'italic' }}>{q.explication}</p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {activeVF.map((_, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i <= vfIndex ? C : '#e5e7eb' }} />)}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz3') {
    const cas = activeCas[casIndex]
    return (
      <div style={base}><NavBar />
        <div style={{ background: '#e5e7eb', height: '6px' }}><div style={{ background: C, height: '6px', width: \`\${(casIndex / activeCas.length) * 100}%\` }} /></div>
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ background: \`\${C}15\`, color: C, borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>{t.q3label} — {casIndex + 1}/{activeCas.length}</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', margin: '0 0 6px' }}>{t.q3title}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{t.q3sub}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: \`2px solid \${C}30\`, marginBottom: '20px' }}>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151', lineHeight: 1.6, margin: 0 }}>📋 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cas.options.map((opt, i) => (
                <button key={i} onClick={() => repCas(opt)} style={{ padding: '14px 18px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = C; (e.currentTarget as HTMLElement).style.background = \`\${C}08\` }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.background = 'white' }}>
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {cas.options.map((opt, i) => { const isC = opt === cas.action, isCh = opt === casRepondu; return (<div key={i} style={{ padding: '12px 16px', background: isC ? '#d1fae5' : isCh ? '#fee2e2' : 'white', border: \`1.5px solid \${isC ? '#6ee7b7' : isCh ? '#fca5a5' : '#e5e7eb'}\`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: isC ? '#059669' : isCh ? '#ef4444' : '#9ca3af' }}>{isC ? '✅ ' : isCh ? '❌ ' : ''}{opt}</div>) })}
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#374151', fontStyle: 'italic' }}>💡 {cas.explication}</p>
              </div>
              <button onClick={nextCas} style={{ width: '100%', padding: '16px', background: C, border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                {casIndex < activeCas.length - 1 ? t.next2 : t.last}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const total = Math.min(100, score), medal = total >= 80 ? '🥇' : total >= 50 ? '🥈' : '🥉', msg = total >= 80 ? t.medal_gold : total >= 50 ? t.medal_silver : t.medal_bronze
  return (
    <div style={base}><NavBar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>{medal}</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px' }}>{msg}</h2>
        <p style={{ color: '#4b5563', marginBottom: '32px' }}>{t.resultTitle}</p>
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ fontSize: '52px', fontWeight: '800', color: C, marginBottom: '4px' }}>{total}<span style={{ fontSize: '22px' }}>/100</span></div>
          <p style={{ color: '#6b7280', margin: '0 0 16px', fontSize: '14px' }}>{t.score}</p>
          <div style={{ background: '#f3f4f6', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ background: \`linear-gradient(90deg,\${C},#f59e0b)\`, height: '10px', width: \`\${total}%\`, borderRadius: '8px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button onClick={() => router.back()} style={{ padding: '16px', background: C, border: 'none', borderRadius: '12px', color: 'white', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>{t.backHome}</button>
          <button onClick={() => { initQuizzes(lang); setScore(0); setPhase('intro') }} style={{ padding: '14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', color: C, fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
`, 'utf8');
console.log('✅ Indices d\'américanité écrit !');
