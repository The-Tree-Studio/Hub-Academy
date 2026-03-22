const fs = require('fs');
const PINK = '#e91e8c';

fs.mkdirSync('app/modules/aml-grands-principes', { recursive: true });
fs.writeFileSync('app/modules/aml-grands-principes/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '${PINK}'

const UI = {
  fr: {
    title: 'AML/CTF \u2014 Les grands principes',
    subtitle: 'Comprendre le cadre anti-blanchiment et financement du terrorisme',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Les 3 \u00e9tapes du blanchiment d\u2019argent',
      'Les obligations AML/CTF des PSF luxembourgeois',
      'Le r\u00f4le de la CSSF et des autorit\u00e9s comp\u00e9tentes',
      'La notion de vigilance proportionn\u00e9e',
      'Les 4 r\u00e8gles d\u2019or d\u2019i-Hub en mati\u00e8re AML',
      'Ce qu\u2019i-Hub fait et ne fait pas dans le cadre AML',
    ],
    fiches: '19 fiches', time: '\u223c15 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    toRetain: '\u00c0 RETENIR', goFurther: '\ud83d\udd0d Aller plus loin',
    home: '\u2190 Accueil',
    finTitle: 'Les 4 r\u00e8gles d\u2019or i-Hub \u2014 AML/CTF',
    finSub: '\u00c0 retenir absolument avant de passer \u00e0 la suite',
    backHome: '\u2190 Retour aux modules', restart: '\ud83d\udd04 Recommencer',
  },
  en: {
    title: 'AML/CTF \u2014 Core Principles',
    subtitle: 'Understanding the anti-money laundering and counter-terrorism financing framework',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'The 3 stages of money laundering',
      'AML/CTF obligations of Luxembourg PSFs',
      'The role of the CSSF and competent authorities',
      'The concept of proportionate vigilance',
      'i-Hub\u2019s 4 golden rules for AML',
      'What i-Hub does and does not do in the AML framework',
    ],
    fiches: '19 cards', time: '\u223c15 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    toRetain: 'KEY TAKEAWAY', goFurther: '\ud83d\udd0d Go further',
    home: '\u2190 Home',
    finTitle: 'i-Hub\u2019s 4 Golden Rules \u2014 AML/CTF',
    finSub: 'Essential takeaways before moving on',
    backHome: '\u2190 Back to modules', restart: '\ud83d\udd04 Restart',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udcb0', titre:'C\u2019est quoi le blanchiment d\u2019argent\u00a0?', contenu:[
    { icon:'\ud83d\udcb0', texte:'Le **blanchiment d\u2019argent** est le processus qui consiste \u00e0 dissimuler l\u2019origine ill\u00e9gale de fonds en les faisant passer pour l\u00e9gitimes' },
    { icon:'\ud83d\udea8', texte:'Les fonds proviennent d\u2019activit\u00e9s criminelles\u00a0: trafic de drogues, corruption, fraude fiscale, crime organis\u00e9\u2026' },
    { icon:'\ud83c\udf0d', texte:'Le syst\u00e8me financier mondial est utilis\u00e9 comme vecteur \u2014 c\u2019est pourquoi les PSF sont en premi\u00e8re ligne' },
    { icon:'\ud83d\udcca', texte:'Estimation mondiale\u00a0: entre **2 et 5% du PIB mondial** blanchis chaque ann\u00e9e, soit 800 milliards \u00e0 2 000 milliards de dollars' },
  ], aretenir:'Le blanchiment transforme de l\u2019argent sale en argent propre via le syst\u00e8me financier. Les PSF sont des cibles et des vecteurs potentiels.' },

  { id:2, emoji:'\ud83d\udd04', titre:'Les 3 \u00e9tapes du blanchiment', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Placement** (Placement)\u00a0: introduction des fonds ill\u00e9gaux dans le syst\u00e8me financier \u2014 la phase la plus risqu\u00e9e pour le criminel' },
    { icon:'2\ufe0f\u20e3', texte:'**Empilage** (Layering)\u00a0: multiplication des transactions pour brouiller les pistes \u2014 virements internationaux, conversions, soci\u00e9t\u00e9s \u00e9crans' },
    { icon:'3\ufe0f\u20e3', texte:'**Int\u00e9gration** (Integration)\u00a0: r\u00e9introduction des fonds dans l\u2019\u00e9conomie l\u00e9gale \u2014 immobilier, investissements, activit\u00e9s commerciales' },
    { icon:'\ud83d\udd0d', texte:'i-Hub intervient principalement au stade du **placement et de l\u2019empilage** \u2014 en v\u00e9rifiant la coh\u00e9rence documentaire des dossiers' },
  ], aretenir:'3 \u00e9tapes\u00a0: Placement \u2192 Empilage \u2192 Int\u00e9gration. Les PSF sont expos\u00e9s \u00e0 toutes les \u00e9tapes. i-Hub aide \u00e0 d\u00e9tecter les incoh\u00e9rences au stade documentaire.' },

  { id:3, emoji:'\ud83d\udca3', titre:'Le financement du terrorisme (CTF)', contenu:[
    { icon:'\ud83d\udca3', texte:'Le **financement du terrorisme** (CTF = Counter-Terrorism Financing) est distinct du blanchiment\u00a0: les fonds peuvent \u00eatre d\u2019origine l\u00e9gale' },
    { icon:'\ud83d\udd0d', texte:'Ce qui compte\u00a0: la **destination** des fonds (financer des actes terroristes) et non leur origine' },
    { icon:'\u26a0\ufe0f', texte:'De petits montants peuvent avoir un impact \u00e9norme \u2014 la surveillance des transactions inhabituelles est cruciale' },
    { icon:'\ud83d\udcdc', texte:'Le CTF est r\u00e9gi par les m\u00eames lois que l\u2019AML au Luxembourg \u2014 loi du 12 novembre 2004 modifi\u00e9e' },
  ], aretenir:'AML = d\u00e9tecter l\u2019argent sale. CTF = d\u00e9tecter le financement d\u2019actes terroristes. Les deux sont couverts par les m\u00eames obligations l\u00e9gales.' },

  { id:4, emoji:'\ud83c\uddf1\ud83c\uddfa', titre:'Le cadre l\u00e9gal luxembourgeois', contenu:[
    { icon:'\ud83d\udcdc', texte:'**Loi du 12 novembre 2004** relative \u00e0 la lutte contre le blanchiment et le financement du terrorisme \u2014 transposition des directives europ\u00e9ennes' },
    { icon:'\ud83c\uddea\ud83c\uddfa', texte:'**5\u00e8me directive anti-blanchiment** de l\u2019UE (AMLD5) transpos\u00e9e au Luxembourg en 2020 \u2014 renforcement de la transparence des UBO' },
    { icon:'\ud83c\udfe6', texte:'**CSSF** (Commission de Surveillance du Secteur Financier)\u00a0: autorit\u00e9 de contr\u00f4le principale des PSF pour l\u2019AML/CTF' },
    { icon:'\ud83d\udccc', texte:'**GAFI** (Groupe d\u2019Action Financi\u00e8re)\u00a0: organisation internationale qui fixe les standards mondiaux \u2014 les 40 recommandations GAFI' },
  ], aretenir:'Cadre l\u00e9gal\u00a0: loi 2004 + directives UE + recommandations GAFI. La CSSF contr\u00f4le les PSF. i-Hub, sous-traitant, op\u00e8re dans ce cadre sur instruction du PSF.' },

  { id:5, emoji:'\ud83c\udfe6', titre:'Les obligations des PSF luxembourgeois', contenu:[
    { icon:'\ud83d\udc64', texte:'**KYC** (Know Your Customer)\u00a0: identifier et v\u00e9rifier l\u2019identit\u00e9 du client final avant d\u2019entrer en relation' },
    { icon:'\ud83d\udc65', texte:'**UBO**\u00a0: identifier le b\u00e9n\u00e9ficiaire effectif final (pers. physique d\u00e9tenant > 25% ou exer\u00e7ant le contr\u00f4le)' },
    { icon:'\ud83d\udcca', texte:'**Scoring de risque**\u00a0: \u00e9valuer le niveau de risque AML de chaque client final (faible, moyen, \u00e9lev\u00e9)' },
    { icon:'\ud83d\udea8', texte:'**D\u00e9claration de soup\u00e7on (STR)**\u00a0: d\u00e9clarer \u00e0 la CRF (Cellule de Renseignement Financier) tout soup\u00e7on de blanchiment' },
  ], aretenir:'Les PSF ont 4 obligations principales\u00a0: KYC, UBO, scoring de risque, d\u00e9claration de soup\u00e7on. i-Hub peut intervenir sur le KYC/UBO sur instruction du SLA.' },

  { id:6, emoji:'\ud83d\udd0d', titre:'La vigilance proportionn\u00e9e', contenu:[
    { icon:'\ud83d\udfe2', texte:'**Vigilance simplifi\u00e9e**\u00a0: pour les clients finaux \u00e0 faible risque (institutionnels europ\u00e9ens, entit\u00e9s cot\u00e9es\u2026) \u2014 contr\u00f4les r\u00e9duits' },
    { icon:'\ud83d\udfe1', texte:'**Vigilance standard**\u00a0: pour la majorit\u00e9 des clients finaux \u2014 KYC complet, v\u00e9rification des documents d\u2019identit\u00e9' },
    { icon:'\ud83d\udd34', texte:'**Vigilance renforc\u00e9e**\u00a0: pour les clients \u00e0 risque \u00e9lev\u00e9 (PPE, pays \u00e0 risque, structures complexes, transactions inhabituelles)' },
    { icon:'\ud83d\udcdc', texte:'Le niveau de vigilance est d\u00e9termin\u00e9 par le **PSF** \u2014 i-Hub adapte ses v\u00e9rifications documentaires selon le niveau indiqu\u00e9 dans le SLA' },
  ], aretenir:'Vigilance = proportionn\u00e9e au risque. C\u2019est le PSF qui fixe le niveau. i-Hub applique les contr\u00f4les correspondants pr\u00e9vus dans le SLA.' },

  { id:7, emoji:'\ud83d\udc65', titre:'Les Personnes Politiquement Expos\u00e9es (PPE)', contenu:[
    { icon:'\ud83d\udc65', texte:'Une **PPE** est une personne occupant ou ayant occup\u00e9 une fonction publique importante\u00a0: chef d\u2019\u00c9tat, ministre, juge, dirigeant d\u2019entreprise \u00e9tatique\u2026' },
    { icon:'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67', texte:'Les **membres de la famille** et les **pers. li\u00e9es** \u00e0 une PPE sont \u00e9galement consid\u00e9r\u00e9s comme PPE' },
    { icon:'\ud83d\udd34', texte:'Une PPE = **vigilance renforc\u00e9e automatique** \u2014 pas d\u2019exception' },
    { icon:'\ud83d\udd0d', texte:'i-Hub signale toute PPE d\u00e9tect\u00e9e dans les documents transmis par le PSF \u2014 le PSF d\u00e9cide du niveau de vigilance \u00e0 appliquer' },
  ], aretenir:'PPE = vigilance renforc\u00e9e automatique. i-Hub d\u00e9tecte et signale au PSF. Le PSF prend les d\u00e9cisions d\u2019acceptation et de suivi.' },

  { id:8, emoji:'\ud83c\udf10', titre:'Les pays \u00e0 risque', contenu:[
    { icon:'\ud83d\udccb', texte:'Certains pays pr\u00e9sentent un risque AML/CTF \u00e9lev\u00e9\u00a0: **liste GAFI** (pays \u00e0 haut risque et sous surveillance) + liste UE' },
    { icon:'\ud83d\udd34', texte:'Tout client final li\u00e9 \u00e0 un pays \u00e0 risque (r\u00e9sidence, nationalit\u00e9, source des fonds) = **vigilance renforc\u00e9e** par le PSF' },
    { icon:'\ud83d\udd04', texte:'Les listes sont mises \u00e0 jour r\u00e9guli\u00e8rement \u2014 un pays peut entrer ou sortir de la liste' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la nationalit\u00e9 et la r\u00e9sidence dans les documents \u2014 et signale au PSF si un pays \u00e0 risque est d\u00e9tect\u00e9' },
  ], aretenir:'Pays GAFI \u00e0 risque = vigilance renforc\u00e9e automatique pour le PSF. i-Hub d\u00e9tecte le lien au pays dans les documents et signale.' },

  { id:9, emoji:'\ud83d\udcb5', titre:'La source des fonds et la source du patrimoine', contenu:[
    { icon:'\ud83d\udcb5', texte:'**Source des fonds** (SOF = Source of Funds)\u00a0: d\u2019o\u00f9 vient l\u2019argent d\u00e9pos\u00e9 sp\u00e9cifiquement\u00a0? (salaire, dividendes, vente immobili\u00e8re\u2026)' },
    { icon:'\ud83c\udfe0', texte:'**Source du patrimoine** (SOW = Source of Wealth)\u00a0: comment le client final a-t-il constitu\u00e9 l\u2019ensemble de son patrimoine\u00a0?' },
    { icon:'\ud83d\udd34', texte:'Ces informations sont cruciales en vigilance renforc\u00e9e \u2014 exig\u00e9es pour toutes les PPE et pays \u00e0 risque' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie la **pr\u00e9sence** des justificatifs SOF/SOW dans le dossier si le PSF le pr\u00e9voit dans le SLA \u2014 pas leur exactitude' },
  ], aretenir:'SOF = d\u2019o\u00f9 vient cet argent. SOW = d\u2019o\u00f9 vient tout le patrimoine. i-Hub v\u00e9rifie la pr\u00e9sence des justificatifs, pas leur v\u00e9racit\u00e9.' },

  { id:10, emoji:'\ud83d\udd35', titre:'La CRF\u00a0: Cellule de Renseignement Financier', contenu:[
    { icon:'\ud83d\udd35', texte:'La **CRF** (Cellule de Renseignement Financier) est l\u2019autorit\u00e9 luxembourgeoise qui re\u00e7oit les d\u00e9clarations de soup\u00e7on (STR)' },
    { icon:'\ud83d\udce4', texte:'Les **PSF** sont tenus de d\u00e9clarer tout soup\u00e7on de blanchiment ou de financement du terrorisme \u00e0 la CRF' },
    { icon:'\ud83d\uded1', texte:'Le PSF ne peut pas informer le client final qu\u2019une STR a \u00e9t\u00e9 faite (**interdiction de divulgation** \u2014 tipping off)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub n\u2019a pas de relation directe avec la CRF \u2014 il signale les anomalies au PSF, c\u2019est le PSF qui d\u00e9cide de la STR' },
  ], aretenir:'STR = d\u00e9claration de soup\u00e7on au CRF. C\u2019est la responsabilit\u00e9 du PSF. i-Hub signale les anomalies au PSF, pas \u00e0 la CRF.' },

  { id:11, emoji:'\ud83d\udc64', titre:'Le KYC\u00a0: Know Your Customer', contenu:[
    { icon:'\ud83d\udc64', texte:'Le **KYC** (Connaissance du Client) est l\u2019ensemble des mesures d\u2019identification et de v\u00e9rification d\u2019un client final' },
    { icon:'\ud83d\udccb', texte:'Documents standard\u00a0: pi\u00e8ce d\u2019identit\u00e9, justificatif de domicile, informations professionnelles, source des fonds' },
    { icon:'\ud83d\udd04', texte:'Le KYC est un **processus continu** \u2014 les informations doivent \u00eatre mises \u00e0 jour r\u00e9guli\u00e8rement par le PSF' },
    { icon:'\ud83d\udd0d', texte:'i-Hub peut \u00eatre mandat\u00e9 par le PSF pour v\u00e9rifier la **coh\u00e9rence** des documents KYC collect\u00e9s \u2014 selon le SLA' },
  ], aretenir:'KYC = conna\u00eetre et v\u00e9rifier le client final. C\u2019est une obligation continue du PSF. i-Hub v\u00e9rifie la coh\u00e9rence documentaire si pr\u00e9vu au SLA.' },

  { id:12, emoji:'\ud83d\udcc4', titre:'Les documents d\u2019identit\u00e9 acceptables', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Passeport**\u00a0: document d\u2019identit\u00e9 de r\u00e9f\u00e9rence \u2014 acceptabl\u00e9 universellement, photo, MRZ (zone lisible par machine)' },
    { icon:'\ud83c\uddea\ud83c\uddfa', texte:'**Carte d\u2019identit\u00e9 europ\u00e9enne**\u00a0: accept\u00e9e pour les ressortissants UE \u2014 recto + verso obligatoires' },
    { icon:'\ud83d\ude97', texte:'**Permis de conduire**\u00a0: accept\u00e9 dans certains contextes \u2014 souvent insuffisant seul pour un KYC bancaire complet' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie\u00a0: **non-expir\u00e9**, **lisible**, **photo visible**, **donn\u00e9es coh\u00e9rentes** avec le reste du dossier transmis par le PSF' },
  ], aretenir:'Passeport = r\u00e9f\u00e9rence. i-Hub v\u00e9rifie non-expir\u00e9, lisible, coh\u00e9rent. Toute anomalie visible dans le document = signal au PSF.' },

  { id:13, emoji:'\ud83d\udcca', titre:'L\u2019approche par les risques (RBA)', contenu:[
    { icon:'\ud83d\udcca', texte:'La **RBA** (Risk-Based Approach) est le principe fondateur de l\u2019AML moderne\u00a0: adapter les contr\u00f4les au niveau de risque r\u00e9el' },
    { icon:'\ud83d\udfe2', texte:'Risque faible \u2192 contr\u00f4les l\u00e9gers. Risque \u00e9lev\u00e9 \u2192 contr\u00f4les renforc\u00e9s. Ressources concentr\u00e9es l\u00e0 o\u00f9 le risque est le plus \u00e9lev\u00e9' },
    { icon:'\ud83c\udfe6', texte:'Le **PSF** \u00e9tablit sa propre matrice de risque et fixe les seuils \u2014 i-Hub applique les niveaux de v\u00e9rification pr\u00e9vus pour chaque risque dans le SLA' },
    { icon:'\ud83d\udccc', texte:'La RBA est impos\u00e9e par le GAFI et les directives europ\u00e9ennes \u2014 les PSF qui ne l\u2019appliquent pas s\u2019exposent \u00e0 des sanctions CSSF' },
  ], aretenir:'RBA = plus le risque est \u00e9lev\u00e9, plus les contr\u00f4les sont rigoureux. Le PSF fixe les niveaux. i-Hub applique les contr\u00f4les correspondants du SLA.' },

  { id:14, emoji:'\ud83d\udcc8', titre:'Le monitoring continu', contenu:[
    { icon:'\ud83d\udcc8', texte:'L\u2019AML ne s\u2019arr\u00eate pas \u00e0 l\u2019entr\u00e9e en relation \u2014 le PSF doit surveiller les **transactions en continu** tout au long de la relation' },
    { icon:'\ud83d\udea8', texte:'Signaux d\u2019alerte\u00a0: transactions inhabituelles, montants anormaux, changements soudains de comportement, op\u00e9rations sans justification \u00e9conomique' },
    { icon:'\ud83d\udd04', texte:'Le **r\u00e9examen p\u00e9riodique** du dossier client final est obligatoire \u2014 fr\u00e9quence d\u00e9termin\u00e9e par le niveau de risque' },
    { icon:'\ud83d\udd0d', texte:'i-Hub peut \u00eatre mandat\u00e9 pour des v\u00e9rifications documentaires p\u00e9riodiques \u2014 toujours sur instruction du PSF et dans le SLA' },
  ], aretenir:'L\u2019AML est un processus continu, pas ponctuel. Le PSF surveille les transactions. i-Hub peut \u00eatre mandat\u00e9 pour les r\u00e9examens documentaires.' },

  { id:15, emoji:'\ud83c\udfdb\ufe0f', titre:'La responsabilit\u00e9 p\u00e9nale en mati\u00e8re AML', contenu:[
    { icon:'\u2696\ufe0f', texte:'Le blanchiment d\u2019argent est un **crime** au Luxembourg \u2014 passible de 1 \u00e0 5 ans de prison et/ou d\u2019une amende' },
    { icon:'\ud83c\udfe6', texte:'La **responsabilit\u00e9 p\u00e9nale** peut \u00eatre engag\u00e9e contre la **personne physique** (employ\u00e9 du PSF) ET contre le **PSF** lui-m\u00eame' },
    { icon:'\ud83d\udd35', texte:'Un employ\u00e9 d\u2019i-Hub qui ignorerait volontairement un signal AML pourrait voir sa responsabilit\u00e9 personnelle engag\u00e9e' },
    { icon:'\ud83d\udd0d', texte:'C\u2019est pourquoi **tout signal visible doit \u00eatre signal\u00e9 au PSF** \u2014 m\u00eame s\u2019il para\u00eet anodin ou hors p\u00e9rim\u00e8tre SLA' },
  ], aretenir:'AML = responsabilit\u00e9 p\u00e9nale personnelle. Ignorer un signal visible peut engager la responsabilit\u00e9 de l\u2019employ\u00e9. Toujours signaler au PSF.' },

  { id:16, emoji:'\ud83d\udd0d', titre:'Ce que i-Hub fait en mati\u00e8re AML', contenu:[
    { icon:'\u2705', texte:'**V\u00e9rifie** la coh\u00e9rence et la compl\u00e9tude des documents KYC transmis par le PSF' },
    { icon:'\u2705', texte:'**D\u00e9tecte** les anomalies visibles\u00a0: document expir\u00e9, photo incoh\u00e9rente, indices de PPE ou de pays \u00e0 risque' },
    { icon:'\u2705', texte:'**Signale** au PSF toute anomalie document\u00e9e \u2014 dans le p\u00e9rim\u00e8tre du SLA ET hors p\u00e9rim\u00e8tre si signal visible' },
    { icon:'\u2705', texte:'**Archive** les rapports de v\u00e9rification pour sa propre protection et celle du PSF' },
  ], aretenir:'i-Hub v\u00e9rifie, d\u00e9tecte, signale et archive. Toujours sur instruction du PSF. Dans le SLA \u2014 et au-del\u00e0 si signal visible.' },

  { id:17, emoji:'\u274c', titre:'Ce que i-Hub NE fait PAS en mati\u00e8re AML', contenu:[
    { icon:'\u274c', texte:'i-Hub ne **d\u00e9cide pas** du niveau de risque d\u2019un client final \u2014 c\u2019est la responsabilit\u00e9 du PSF' },
    { icon:'\u274c', texte:'i-Hub ne **fait pas de STR** (d\u00e9claration de soup\u00e7on) \u2014 seul le PSF peut d\u00e9clarer \u00e0 la CRF' },
    { icon:'\u274c', texte:'i-Hub ne **bloque pas** de transactions ni de comptes \u2014 c\u2019est le PSF qui prend les d\u00e9cisions op\u00e9rationnelles' },
    { icon:'\u274c', texte:'i-Hub ne **contacte pas** le client final directement pour des questions AML \u2014 sauf disposition sp\u00e9cifique du SLA' },
  ], aretenir:'i-Hub ne d\u00e9cide pas, ne d\u00e9clare pas, ne bloque pas, ne contacte pas. Il d\u00e9tecte et signale au PSF. Les d\u00e9cisions appartiennent au PSF.' },

    { id:18, emoji:'\ud83d\udd04', titre:'Deux dimensions\u00a0: contractuel vs r\u00e9glementaire', contenu:[
    { icon:'\ud83d\udcdc', texte:'Les modules de cette plateforme couvrent principalement les **obligations contractuelles** d\u2019i-Hub\u00a0: ce que i-Hub fait *pour* ses clients PSF et leurs clients finaux, dans le cadre des SLA sign\u00e9s' },
    { icon:'\ud83c\udfe6', texte:'Mais i-Hub est aussi un **PSF de support agr\u00e9\u00e9 par la CSSF**\u00a0: il a ses propres obligations r\u00e9glementaires AML/CTF vis-\u00e0-vis de ses propres clients PSF, ind\u00e9pendamment de tout SLA' },
    { icon:'\ud83d\udd04', texte:'**Dimension 1 \u2014 Contractuelle**\u00a0: ce que i-Hub fait *pour* le PSF et ses clients finaux (d\u00e9fini dans le SLA, varie selon les clients)' },
    { icon:'\ud83c\udfe6', texte:'**Dimension 2 \u2014 R\u00e9glementaire**\u00a0: ce que i-Hub fait *sur* ses propres clients PSF (impos\u00e9 par la loi, s\u2019applique \u00e0 tous les clients sans exception)' },
  ], aretenir:'Tous les modules de la plateforme = obligations contractuelles. Un module d\u00e9di\u00e9 \u00ab\u00a0AML/KYC \u2014 Nos clients PSF\u00a0\u00bb couvre les obligations r\u00e9glementaires d\u2019i-Hub sur ses propres clients.' },

  { id:19, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: AML/CTF en 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**AML/CTF** = lutter contre le blanchiment et le financement du terrorisme via des contr\u00f4les sur les clients finaux des PSF' },
    { icon:'2\ufe0f\u20e3', texte:'**PSF**\u00a0: obligations de KYC, UBO, scoring, d\u00e9claration de soup\u00e7on \u2014 responsabilit\u00e9 l\u00e9gale et p\u00e9nale' },
    { icon:'3\ufe0f\u20e3', texte:'**RBA**\u00a0: contr\u00f4les proportionn\u00e9s au risque \u2014 simplifi\u00e9s, standards ou renforc\u00e9s selon le profil du client final' },
    { icon:'4\ufe0f\u20e3', texte:'**i-Hub**\u00a0: v\u00e9rifie la coh\u00e9rence documentaire sur instruction du PSF, dans le cadre du SLA' },
    { icon:'5\ufe0f\u20e3', texte:'**Tout signal visible**\u00a0: signal\u00e9 au PSF, m\u00eame hors p\u00e9rim\u00e8tre \u2014 jamais ignor\u00e9, jamais trait\u00e9 seul' },
  ], aretenir:'AML/CTF\u00a0: le PSF est responsable, i-Hub est v\u00e9rificateur sur instruction. Tout signal = PSF. Jamais de d\u00e9cision seul.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udcb0', titre:'What is money laundering?', contenu:[
    { icon:'\ud83d\udcb0', texte:'**Money laundering** is the process of concealing the illegal origin of funds by making them appear legitimate' },
    { icon:'\ud83d\udea8', texte:'Funds originate from criminal activities: drug trafficking, corruption, tax fraud, organised crime\u2026' },
    { icon:'\ud83c\udf0d', texte:'The global financial system is used as a vector \u2014 this is why PSFs are on the front line' },
    { icon:'\ud83d\udcca', texte:'Global estimate: between **2 and 5% of world GDP** laundered annually, i.e. $800 billion to $2 trillion' },
  ], aretenir:'Money laundering turns dirty money into clean money via the financial system. PSFs are both targets and potential vectors.' },

  { id:2, emoji:'\ud83d\udd04', titre:'The 3 stages of money laundering', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Placement**: introducing illegal funds into the financial system \u2014 the riskiest phase for the criminal' },
    { icon:'2\ufe0f\u20e3', texte:'**Layering**: multiplying transactions to obscure the trail \u2014 international transfers, conversions, shell companies' },
    { icon:'3\ufe0f\u20e3', texte:'**Integration**: reintroducing funds into the legal economy \u2014 real estate, investments, commercial activities' },
    { icon:'\ud83d\udd0d', texte:'i-Hub intervenes mainly at the **placement and layering** stages \u2014 by checking documentary consistency of files' },
  ], aretenir:'3 stages: Placement \u2192 Layering \u2192 Integration. PSFs are exposed at all stages. i-Hub helps detect inconsistencies at the documentary stage.' },

  { id:3, emoji:'\ud83d\udca3', titre:'Terrorist financing (CTF)', contenu:[
    { icon:'\ud83d\udca3', texte:'**Terrorist financing** (CTF) is distinct from money laundering: the funds may be of legal origin' },
    { icon:'\ud83d\udd0d', texte:'What matters: the **destination** of the funds (financing terrorist acts), not their origin' },
    { icon:'\u26a0\ufe0f', texte:'Small amounts can have a massive impact \u2014 monitoring unusual transactions is crucial' },
    { icon:'\ud83d\udcdc', texte:'CTF is governed by the same laws as AML in Luxembourg \u2014 Law of 12 November 2004 as amended' },
  ], aretenir:'AML = detecting dirty money. CTF = detecting terrorist financing. Both are covered by the same legal obligations.' },

  { id:4, emoji:'\ud83c\uddf1\ud83c\uddfa', titre:'The Luxembourg legal framework', contenu:[
    { icon:'\ud83d\udcdc', texte:'**Law of 12 November 2004** on combating money laundering and terrorist financing \u2014 transposition of EU directives' },
    { icon:'\ud83c\uddea\ud83c\uddfa', texte:'**5th EU Anti-Money Laundering Directive** (AMLD5) transposed in Luxembourg in 2020 \u2014 enhanced UBO transparency' },
    { icon:'\ud83c\udfe6', texte:'**CSSF** (Commission for the Supervision of the Financial Sector): main supervisory authority for PSFs on AML/CTF' },
    { icon:'\ud83d\udccc', texte:'**FATF** (Financial Action Task Force): international body setting global standards \u2014 the 40 FATF Recommendations' },
  ], aretenir:'Legal framework: 2004 Law + EU directives + FATF recommendations. CSSF supervises PSFs. i-Hub, as subcontractor, operates within this framework on the PSF\u2019s instruction.' },

  { id:5, emoji:'\ud83c\udfe6', titre:'Luxembourg PSF obligations', contenu:[
    { icon:'\ud83d\udc64', texte:'**KYC** (Know Your Customer): identify and verify the final client\u2019s identity before entering into a relationship' },
    { icon:'\ud83d\udc65', texte:'**UBO**: identify the ultimate beneficial owner (individual holding > 25% or exercising control)' },
    { icon:'\ud83d\udcca', texte:'**Risk scoring**: assess the AML risk level of each final client (low, medium, high)' },
    { icon:'\ud83d\udea8', texte:'**STR** (Suspicious Transaction Report): report any suspicion of money laundering to the FIU (Financial Intelligence Unit)' },
  ], aretenir:'PSFs have 4 main obligations: KYC, UBO, risk scoring, STR. i-Hub may intervene on KYC/UBO on SLA instruction.' },

  { id:6, emoji:'\ud83d\udd0d', titre:'Proportionate vigilance', contenu:[
    { icon:'\ud83d\udfe2', texte:'**Simplified vigilance**: for low-risk final clients (European institutions, listed entities\u2026) \u2014 reduced controls' },
    { icon:'\ud83d\udfe1', texte:'**Standard vigilance**: for most final clients \u2014 full KYC, identity document verification' },
    { icon:'\ud83d\udd34', texte:'**Enhanced vigilance**: for high-risk clients (PEPs, high-risk countries, complex structures, unusual transactions)' },
    { icon:'\ud83d\udcdc', texte:'The vigilance level is set by the **PSF** \u2014 i-Hub adapts its documentary verifications to the level specified in the SLA' },
  ], aretenir:'Vigilance = proportionate to risk. The PSF sets the level. i-Hub applies the corresponding controls specified in the SLA.' },

  { id:7, emoji:'\ud83d\udc65', titre:'Politically Exposed Persons (PEPs)', contenu:[
    { icon:'\ud83d\udc65', texte:'A **PEP** is a person holding or having held a prominent public function: head of state, minister, judge, state enterprise director\u2026' },
    { icon:'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67', texte:'**Family members** and **close associates** of a PEP are also considered PEPs' },
    { icon:'\ud83d\udd34', texte:'PEP = **automatic enhanced vigilance** \u2014 no exceptions' },
    { icon:'\ud83d\udd0d', texte:'i-Hub flags any PEP detected in documents transmitted by the PSF \u2014 the PSF decides on the vigilance level to apply' },
  ], aretenir:'PEP = automatic enhanced vigilance. i-Hub detects and flags to PSF. The PSF makes acceptance and follow-up decisions.' },

  { id:8, emoji:'\ud83c\udf10', titre:'High-risk countries', contenu:[
    { icon:'\ud83d\udccb', texte:'Some countries present a high AML/CTF risk: **FATF list** (high-risk and monitored jurisdictions) + EU list' },
    { icon:'\ud83d\udd34', texte:'Any final client linked to a high-risk country (residency, nationality, source of funds) = **enhanced vigilance** by PSF' },
    { icon:'\ud83d\udd04', texte:'Lists are updated regularly \u2014 a country may enter or leave the list' },
    { icon:'\ud83d\udd0d', texte:'i-Hub checks nationality and residency in documents \u2014 and flags to PSF if a high-risk country is detected' },
  ], aretenir:'FATF high-risk country = automatic enhanced vigilance for PSF. i-Hub detects the country link in documents and flags.' },

  { id:9, emoji:'\ud83d\udcb5', titre:'Source of funds and source of wealth', contenu:[
    { icon:'\ud83d\udcb5', texte:'**Source of Funds (SOF)**: where does the specific deposited money come from? (salary, dividends, property sale\u2026)' },
    { icon:'\ud83c\udfe0', texte:'**Source of Wealth (SOW)**: how did the final client build their overall wealth?' },
    { icon:'\ud83d\udd34', texte:'This information is crucial in enhanced vigilance \u2014 required for all PEPs and high-risk countries' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies the **presence** of SOF/SOW supporting documents in the file if the PSF specifies this in the SLA \u2014 not their accuracy' },
  ], aretenir:'SOF = where this money comes from. SOW = where the overall wealth comes from. i-Hub checks presence of documents, not their veracity.' },

  { id:10, emoji:'\ud83d\udd35', titre:'The FIU: Financial Intelligence Unit', contenu:[
    { icon:'\ud83d\udd35', texte:'The **FIU** (Cellule de Renseignement Financier) is the Luxembourg authority that receives suspicious transaction reports (STRs)' },
    { icon:'\ud83d\udce4', texte:'**PSFs** are required to report any suspicion of money laundering or terrorist financing to the FIU' },
    { icon:'\ud83d\uded1', texte:'The PSF cannot inform the final client that an STR has been filed (**tipping off prohibition**)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub has no direct relationship with the FIU \u2014 it flags anomalies to the PSF, and the PSF decides on the STR' },
  ], aretenir:'STR = suspicious transaction report to FIU. PSF\u2019s responsibility. i-Hub flags anomalies to the PSF, not to the FIU.' },

  { id:11, emoji:'\ud83d\udc64', titre:'KYC: Know Your Customer', contenu:[
    { icon:'\ud83d\udc64', texte:'**KYC** is the set of measures for identifying and verifying a final client' },
    { icon:'\ud83d\udccb', texte:'Standard documents: ID document, proof of address, professional information, source of funds' },
    { icon:'\ud83d\udd04', texte:'KYC is an **ongoing process** \u2014 information must be regularly updated by the PSF' },
    { icon:'\ud83d\udd0d', texte:'i-Hub may be mandated by the PSF to verify the **consistency** of collected KYC documents \u2014 per the SLA' },
  ], aretenir:'KYC = know and verify the final client. It is an ongoing PSF obligation. i-Hub verifies documentary consistency if specified in the SLA.' },

  { id:12, emoji:'\ud83d\udcc4', titre:'Acceptable identity documents', contenu:[
    { icon:'\ud83e\udeaa', texte:'**Passport**: reference identity document \u2014 universally accepted, photo, MRZ (machine readable zone)' },
    { icon:'\ud83c\uddea\ud83c\uddfa', texte:'**European ID card**: accepted for EU nationals \u2014 front and back mandatory' },
    { icon:'\ud83d\ude97', texte:'**Driving licence**: accepted in some contexts \u2014 often insufficient alone for a full banking KYC' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies: **not expired**, **legible**, **photo visible**, **data consistent** with the rest of the file transmitted by PSF' },
  ], aretenir:'Passport = reference. i-Hub checks not expired, legible, consistent. Any visible anomaly = flag to PSF.' },

  { id:13, emoji:'\ud83d\udcca', titre:'The Risk-Based Approach (RBA)', contenu:[
    { icon:'\ud83d\udcca', texte:'The **RBA** is the founding principle of modern AML: adapt controls to the actual level of risk' },
    { icon:'\ud83d\udfe2', texte:'Low risk \u2192 lighter controls. High risk \u2192 enhanced controls. Resources concentrated where risk is highest' },
    { icon:'\ud83c\udfe6', texte:'The **PSF** establishes its own risk matrix and sets thresholds \u2014 i-Hub applies the verification levels per risk specified in the SLA' },
    { icon:'\ud83d\udccc', texte:'The RBA is required by FATF and EU directives \u2014 PSFs that do not apply it face CSSF sanctions' },
  ], aretenir:'RBA = the higher the risk, the more rigorous the controls. The PSF sets the levels. i-Hub applies the corresponding SLA controls.' },

  { id:14, emoji:'\ud83d\udcc8', titre:'Ongoing monitoring', contenu:[
    { icon:'\ud83d\udcc8', texte:'AML does not stop at onboarding \u2014 the PSF must monitor **transactions on an ongoing basis** throughout the relationship' },
    { icon:'\ud83d\udea8', texte:'Alert signals: unusual transactions, abnormal amounts, sudden behavioural changes, operations without economic justification' },
    { icon:'\ud83d\udd04', texte:'**Periodic review** of the final client file is mandatory \u2014 frequency determined by risk level' },
    { icon:'\ud83d\udd0d', texte:'i-Hub may be mandated for periodic documentary verifications \u2014 always on the PSF\u2019s instruction and within the SLA' },
  ], aretenir:'AML is an ongoing process, not a one-off. The PSF monitors transactions. i-Hub may be mandated for periodic documentary reviews.' },

  { id:15, emoji:'\ud83c\udfdb\ufe0f', titre:'Criminal liability in AML', contenu:[
    { icon:'\u2696\ufe0f', texte:'Money laundering is a **crime** in Luxembourg \u2014 punishable by 1 to 5 years imprisonment and/or a fine' },
    { icon:'\ud83c\udfe6', texte:'**Criminal liability** may be engaged against the **individual** (PSF employee) AND against the **PSF** itself' },
    { icon:'\ud83d\udd35', texte:'An i-Hub employee who wilfully ignores an AML signal could face personal criminal liability' },
    { icon:'\ud83d\udd0d', texte:'This is why **all visible signals must be flagged to the PSF** \u2014 even if they seem minor or outside the SLA scope' },
  ], aretenir:'AML = personal criminal liability. Ignoring a visible signal may engage individual liability. Always flag to PSF.' },

  { id:16, emoji:'\ud83d\udd0d', titre:'What i-Hub does in AML', contenu:[
    { icon:'\u2705', texte:'**Verifies** the consistency and completeness of KYC documents transmitted by the PSF' },
    { icon:'\u2705', texte:'**Detects** visible anomalies: expired document, inconsistent photo, PEP or high-risk country indicia' },
    { icon:'\u2705', texte:'**Flags** to the PSF any documented anomaly \u2014 within SLA scope AND beyond if a visible signal is detected' },
    { icon:'\u2705', texte:'**Archives** verification reports for its own protection and that of the PSF' },
  ], aretenir:'i-Hub verifies, detects, flags and archives. Always on the PSF\u2019s instruction. Within the SLA \u2014 and beyond if a visible signal exists.' },

  { id:17, emoji:'\u274c', titre:'What i-Hub does NOT do in AML', contenu:[
    { icon:'\u274c', texte:'i-Hub does **not decide** on the risk level of a final client \u2014 that is the PSF\u2019s responsibility' },
    { icon:'\u274c', texte:'i-Hub does **not file STRs** \u2014 only the PSF can report to the FIU' },
    { icon:'\u274c', texte:'i-Hub does **not block** transactions or accounts \u2014 the PSF makes operational decisions' },
    { icon:'\u274c', texte:'i-Hub does **not contact** the final client directly for AML matters \u2014 unless specifically provided in the SLA' },
  ], aretenir:'i-Hub does not decide, report, block or contact. It detects and flags to the PSF. Decisions belong to the PSF.' },

    { id:18, emoji:'\ud83d\udd04', titre:'Two dimensions: contractual vs regulatory', contenu:[
    { icon:'\ud83d\udcdc', texte:'The modules on this platform primarily cover i-Hub\u2019s **contractual obligations**: what i-Hub does *for* its PSF clients and their final clients, within the SLA framework' },
    { icon:'\ud83c\udfe6', texte:'But i-Hub is also a **CSSF-approved support PSF**: it has its own regulatory AML/CTF obligations towards its own PSF clients, independently of any SLA' },
    { icon:'\ud83d\udd04', texte:'**Dimension 1 \u2014 Contractual**: what i-Hub does *for* the PSF and its final clients (defined in the SLA, varies between clients)' },
    { icon:'\ud83c\udfe6', texte:'**Dimension 2 \u2014 Regulatory**: what i-Hub does *regarding* its own PSF clients (imposed by law, applies to all clients without exception)' },
  ], aretenir:'All platform modules = contractual obligations. A dedicated module \u201cAML/KYC \u2014 Our PSF clients\u201d covers i-Hub\u2019s regulatory obligations on its own clients.' },

  { id:19, emoji:'\ud83c\udf93', titre:'Summary: AML/CTF in 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**AML/CTF** = combating money laundering and terrorist financing via controls on PSFs\u2019 final clients' },
    { icon:'2\ufe0f\u20e3', texte:'**PSF**: KYC, UBO, scoring, STR obligations \u2014 legal and criminal responsibility' },
    { icon:'3\ufe0f\u20e3', texte:'**RBA**: controls proportionate to risk \u2014 simplified, standard or enhanced per final client profile' },
    { icon:'4\ufe0f\u20e3', texte:'**i-Hub**: verifies documentary consistency on PSF instruction, within the SLA framework' },
    { icon:'5\ufe0f\u20e3', texte:'**Any visible signal**: flagged to PSF, even outside scope \u2014 never ignored, never handled alone' },
  ], aretenir:'AML/CTF: PSF is responsible, i-Hub is verifier on instruction. Any signal = PSF. Never decide alone.' },
]

const REGLES_OR = {
  fr: [
    { icon:'\ud83d\udd0d', titre:'1. V\u00e9rifier, pas d\u00e9cider', texte:'i-Hub v\u00e9rifie la coh\u00e9rence documentaire. C\u2019est le PSF qui \u00e9value le risque et prend les d\u00e9cisions.' },
    { icon:'\ud83d\udce2', titre:'2. Signaler, pas g\u00e9rer', texte:'Toute anomalie visible \u2014 m\u00eame mineure, m\u00eame hors SLA \u2014 est signal\u00e9e au PSF. i-Hub ne g\u00e8re pas les cas AML.' },
    { icon:'\ud83d\udcce', titre:'3. Documenter tout', texte:'Chaque v\u00e9rification est dat\u00e9e, archiv\u00e9e, tra\u00e7able. C\u2019est la protection d\u2019i-Hub en cas de contr\u00f4le.' },
    { icon:'\ud83d\udcdc', titre:'4. Respecter le SLA', texte:'i-Hub agit sur instruction du PSF, dans le cadre du SLA. Tout point hors p\u00e9rim\u00e8tre est clarifi\u00e9 avant d\u2019agir.' },
  ],
  en: [
    { icon:'\ud83d\udd0d', titre:'1. Verify, not decide', texte:'i-Hub verifies documentary consistency. It is the PSF that assesses risk and makes decisions.' },
    { icon:'\ud83d\udce2', titre:'2. Flag, not manage', texte:'Any visible anomaly \u2014 even minor, even outside SLA \u2014 is flagged to the PSF. i-Hub does not manage AML cases.' },
    { icon:'\ud83d\udcce', titre:'3. Document everything', texte:'Every verification is dated, archived, traceable. This is i-Hub\u2019s protection in case of an audit.' },
    { icon:'\ud83d\udcdc', titre:'4. Respect the SLA', texte:'i-Hub acts on the PSF\u2019s instruction, within the SLA framework. Anything outside scope is clarified before acting.' },
  ],
}

export default function ModuleAMLGrandsPrincipes() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'fin'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN
  const regles = REGLES_OR[lang]

  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setPlusLoinOpen(false) }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }

  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={() => router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🛡️ {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={base}><NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🛡️</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i) => <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>✓</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.time,icon:'⏱️'}].map((b,i) => <div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={() => setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase === 'fiches') {
    const fiche = FICHES[ficheIndex]; const progress = ((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar />
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${progress}%\`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i) => <div key={i} onClick={() => {setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
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
            {ficheIndex > 0 && <button onClick={() => {setFicheIndex(i => i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={() => ficheIndex < FICHES.length-1 ? (setFicheIndex(i => i+1), setPlusLoinOpen(false)) : setPhase('fin')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex < FICHES.length-1 ? \`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) →\` : (lang==='fr'?'Terminer le module ✓':'Complete module ✓')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={base}><NavBar />
      <div style={{maxWidth:'620px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'16px'}}>🏆</div>
        <h2 style={{fontSize:'26px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.finTitle}</h2>
        <p style={{color:'#4b5563',marginBottom:'32px',fontSize:'15px'}}>{t.finSub}</p>
        <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'32px'}}>
          {regles.map((r,i) => (
            <div key={i} style={{background:'white',border:\`2px solid \${C}30\`,borderRadius:'16px',padding:'20px',display:'flex',gap:'16px',alignItems:'flex-start',textAlign:'left',boxShadow:\`0 4px 20px \${C}10\`}}>
              <span style={{fontSize:'28px',minWidth:'36px',textAlign:'center'}}>{r.icon}</span>
              <div>
                <p style={{margin:'0 0 6px',fontWeight:'800',color:C,fontSize:'15px'}}>{r.titre}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',lineHeight:1.6}}>{r.texte}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
          <button onClick={() => router.back()} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.backHome}</button>
          <button onClick={() => {setPhase('intro');setFicheIndex(0)}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
`, 'utf8');
console.log('✅ AML Grands Principes écrit !');
