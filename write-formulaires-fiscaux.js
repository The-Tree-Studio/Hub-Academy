const fs = require('fs');
const ORANGE = '#e07b39';

fs.mkdirSync('app/modules/formulaires-fiscaux', { recursive: true });
fs.writeFileSync('app/modules/formulaires-fiscaux/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${ORANGE}'

const UI = {
  fr: {
    title: 'V\u00e9rifier un W-9, W-8BEN ou autocertification',
    subtitle: 'Les formulaires fiscaux en pratique \u2014 ce que v\u00e9rifie i-Hub pour ses clients PSF',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'La structure et les informations cl\u00e9s de chaque formulaire',
      'Comment v\u00e9rifier la coh\u00e9rence d\u2019un W-9',
      'Comment v\u00e9rifier la coh\u00e9rence d\u2019un W-8BEN',
      'Comment v\u00e9rifier la coh\u00e9rence d\u2019un W-8BEN-E',
      'Comment v\u00e9rifier une autocertification CRS',
      'Les red flags \u00e0 signaler au PSF dans chaque formulaire',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR', goFurther: '\ud83d\udd0d Aller plus loin',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 QUEL FORMULAIRE\u00a0?', q1title: '\ud83d\udcdd Quel formulaire correspond \u00e0 ce profil\u00a0?',
    q1sub: 'Pour chaque profil de client final, quel formulaire le PSF doit-il collecter\u00a0?',
    q2label: 'QUIZ 2/3 \u00b7 RED FLAG OU PAS\u00a0?', q2title: '\ud83d\udea8 Est-ce un red flag \u00e0 signaler\u00a0?',
    q2sub: 'Pour chaque situation d\u00e9tect\u00e9e dans un formulaire, faut-il signaler au PSF\u00a0?',
    oui: '\ud83d\udea8 Signaler', non: '\u2705 OK',
    q3label: 'QUIZ 3/3 \u00b7 CAS PRATIQUES', q3title: '\ud83d\udd0d Analysez le formulaire',
    q3sub: 'Un PSF vous transmet un formulaire \u2014 que faites-vous\u00a0?',
    resultTitle: 'Module termin\u00e9 \u2014 Vous savez v\u00e9rifier les formulaires fiscaux\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    pts_gained: 'pts', medal_gold: 'Expert formulaires\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Terminer \u2192',
    validate: 'Valider',
  },
  en: {
    title: 'Verifying W-9, W-8BEN or self-certification',
    subtitle: 'Tax forms in practice \u2014 what i-Hub verifies for its PSF clients',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'The structure and key information of each form',
      'How to verify the consistency of a W-9',
      'How to verify the consistency of a W-8BEN',
      'How to verify the consistency of a W-8BEN-E',
      'How to verify a CRS self-certification',
      'Red flags to flag to the PSF in each form',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '\ud83d\udd0d Go further',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 WHICH FORM?', q1title: '\ud83d\udcdd Which form matches this profile?',
    q1sub: 'For each final client profile, which form must the PSF collect?',
    q2label: 'QUIZ 2/3 \u00b7 RED FLAG OR NOT?', q2title: '\ud83d\udea8 Is this a red flag to flag?',
    q2sub: 'For each situation detected in a form, should it be flagged to the PSF?',
    oui: '\ud83d\udea8 Flag it', non: '\u2705 OK',
    q3label: 'QUIZ 3/3 \u00b7 CASE STUDIES', q3title: '\ud83d\udd0d Analyse the form',
    q3sub: 'A PSF sends you a form \u2014 what do you do?',
    resultTitle: 'Module complete \u2014 You know how to verify tax forms!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    pts_gained: 'pts', medal_gold: 'Forms Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Finish \u2192',
    validate: 'Validate',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udcdd', titre:'Vue d\u2019ensemble\u00a0: les 4 formulaires cl\u00e9s', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**W-9**\u00a0: rempli par les **US Persons** \u2014 certifie le statut am\u00e9ricain et le TIN' },
    { icon:'\ud83d\udcdd', texte:'**W-8BEN**\u00a0: rempli par les **particuliers non-US** \u2014 certifie le statut non-am\u00e9ricain (valable 3 ans)' },
    { icon:'\ud83c\udfe2', texte:'**W-8BEN-E**\u00a0: rempli par les **entit\u00e9s non-US** \u2014 pr\u00e9cise la cat\u00e9gorie FATCA' },
    { icon:'\ud83c\udf0d', texte:'**Autocertification CRS**\u00a0: remplie par tout client final \u2014 d\u00e9clare la r\u00e9sidence fiscale et le NIF' },
  ], aretenir:'Ces 4 formulaires sont le c\u0153ur du travail de v\u00e9rification d\u2019i-Hub. Les ma\u00eetriser = savoir quoi chercher et quoi signaler.' },

  { id:2, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:'Le W-9\u00a0: structure et informations cl\u00e9s', contenu:[
    { icon:'\ud83d\udc64', texte:'**Ligne 1**\u00a0: nom du client final (doit correspondre exactement au nom sur les autres documents d\u2019identit\u00e9)' },
    { icon:'\ud83c\udfe2', texte:'**Ligne 3**\u00a0: type d\u2019entit\u00e9 (individual, S-Corp, LLC\u2026) \u2014 coh\u00e9rence \u00e0 v\u00e9rifier avec les autres documents' },
    { icon:'\ud83d\udd22', texte:'**Partie I**\u00a0: le **TIN** (Taxpayer Identification Number) \u2014 SSN pour les particuliers, EIN pour les entit\u00e9s' },
    { icon:'\u270d\ufe0f', texte:'**Partie II**\u00a0: certification sign\u00e9e sous peine de parjure \u2014 la signature et la date sont obligatoires' },
  ], aretenir:'W-9\u00a0: nom + type d\u2019entit\u00e9 + TIN + signature. Toute absence ou incoh\u00e9rence est signal\u00e9e au PSF.' },

  { id:3, emoji:'\ud83d\udea8', titre:'Red flags W-9 \u00e0 signaler au PSF', contenu:[
    { icon:'\ud83d\udd34', texte:'**TIN absent ou incomplet**\u00a0: le num\u00e9ro fiscal am\u00e9ricain est manquant ou mal format\u00e9 (SSN = XXX-XX-XXXX)' },
    { icon:'\ud83d\udd34', texte:'**Nom incoh\u00e9rent**\u00a0: le nom sur le W-9 ne correspond pas au nom sur le passeport ou les autres documents' },
    { icon:'\ud83d\udd34', texte:'**Signature manquante**\u00a0: le formulaire n\u2019est pas sign\u00e9 ou n\u2019est pas dat\u00e9' },
    { icon:'\ud83d\udd34', texte:'**W-9 fourni par un non-US apparent**\u00a0: indice de non-am\u00e9ricanit\u00e9 visible mais formulaire US fourni \u2014 contradiction' },
  ], aretenir:'Tout red flag W-9 est signal\u00e9 au PSF avec documentation. i-Hub ne corrige pas, ne recontacte pas le client final directement.' },

  { id:4, emoji:'\ud83d\udcdd', titre:'Le W-8BEN\u00a0: structure et informations cl\u00e9s', contenu:[
    { icon:'\ud83d\udc64', texte:'**Partie I (1-7)**\u00a0: nom, nationalit\u00e9, pays de r\u00e9sidence fiscale, adresse permanente, NIF du pays de r\u00e9sidence' },
    { icon:'\ud83c\udf10', texte:'**Partie II (8-10)**\u00a0: claim de convention fiscale \u2014 pays et article de la convention invoqus, taux r\u00e9duit demand\u00e9' },
    { icon:'\u270d\ufe0f', texte:'**Partie III**\u00a0: certification sign\u00e9e sous peine de parjure \u2014 signature + date obligatoires' },
    { icon:'\ud83d\udcc5', texte:'**Validit\u00e9**\u00a0: 3 ans \u00e0 partir de la date de signature \u2014 toujours v\u00e9rifier la date' },
  ], aretenir:'W-8BEN\u00a0: identit\u00e9 + r\u00e9sidence + convention + signature + date. Et toujours v\u00e9rifier la date d\u2019expiration.' },

  { id:5, emoji:'\ud83d\udea8', titre:'Red flags W-8BEN \u00e0 signaler au PSF', contenu:[
    { icon:'\ud83d\udd34', texte:'**Formulaire expir\u00e9**\u00a0: date de signature de plus de 3 ans sans renouvellement' },
    { icon:'\ud83d\udd34', texte:'**Naissance aux USA**\u00a0: lieu de naissance aux USA visible sur le passeport mais W-8BEN (non-US) fourni' },
    { icon:'\ud83d\udd34', texte:'**Pays de r\u00e9sidence incoh\u00e9rent**\u00a0: pays mentionn\u00e9 sur le W-8BEN diff\u00e9rent de l\u2019adresse sur les autres documents' },
    { icon:'\ud83d\udd34', texte:'**NIF absent**\u00a0: le num\u00e9ro fiscal du pays de r\u00e9sidence est manquant sans justification valable' },
    { icon:'\ud83d\udd34', texte:'**Signature manquante ou date absente**\u00a0: formulaire incomplet = invalide' },
  ], aretenir:'5 red flags W-8BEN\u00a0: expir\u00e9, n\u00e9 aux USA, pays incoh\u00e9rent, NIF absent, signature manquante. Tout red flag \u2192 signal au PSF.' },

  { id:6, emoji:'\ud83d\udd0d', titre:'V\u00e9rifier la coh\u00e9rence du W-8BEN', contenu:[
    { icon:'\u2705', texte:'**Nom**\u00a0: correspond au nom sur le passeport et les autres documents d\u2019identit\u00e9\u00a0?' },
    { icon:'\u2705', texte:'**Pays de r\u00e9sidence**\u00a0: coh\u00e9rent avec l\u2019adresse dans le dossier KYC\u00a0? Pas de signe de r\u00e9sidence am\u00e9ricaine\u00a0?' },
    { icon:'\u2705', texte:'**NIF**\u00a0: format correct pour le pays mentionn\u00e9\u00a0? (ex\u00a0: NIF fran\u00e7ais = 13 chiffres)' },
    { icon:'\u2705', texte:'**Date**\u00a0: moins de 3 ans\u00a0? Sinon\u00a0: formulaire expir\u00e9, signaler au PSF' },
  ], aretenir:'La v\u00e9rification W-8BEN = 4 points\u00a0: nom, r\u00e9sidence, NIF, date. Si un point cloche\u00a0: signal au PSF.' },

  { id:7, emoji:'\ud83c\udfe2', titre:'Le W-8BEN-E\u00a0: structure simplifi\u00e9e', contenu:[
    { icon:'\ud83c\udfe2', texte:'**Partie I (1-4)**\u00a0: nom de l\u2019entit\u00e9, pays de constitution, type d\u2019entit\u00e9, pays de r\u00e9sidence fiscale' },
    { icon:'\ud83c\udfaf', texte:'**Chapitre 4 (case FATCA)**\u00a0: cat\u00e9gorie FATCA de l\u2019entit\u00e9 (IFE participante, NFFE active, NFFE passive\u2026)' },
    { icon:'\ud83d\udc65', texte:'**UBO am\u00e9ricains** (pour NFFE passive)\u00a0: section d\u00e9di\u00e9e \u00e0 identifier les actionnaires US > 10%' },
    { icon:'\u270d\ufe0f', texte:'**Certification**\u00a0: sign\u00e9 par un repr\u00e9sentant habilit\u00e9 de l\u2019entit\u00e9 \u2014 titre et capacit\u00e9 \u00e0 v\u00e9rifier' },
  ], aretenir:'Le W-8BEN-E est plus complexe que le W-8BEN individuel. Pour les cas douteux\u00a0: signaler au PSF plut\u00f4t que d\u2019interpr\u00e9ter seul.' },

  { id:8, emoji:'\ud83d\udea8', titre:'Red flags W-8BEN-E \u00e0 signaler au PSF', contenu:[
    { icon:'\ud83d\udd34', texte:'**Cat\u00e9gorie FATCA incoh\u00e9rente**\u00a0: l\u2019entit\u00e9 se d\u00e9clare NFFE Active mais semble \u00eatre une holding passive' },
    { icon:'\ud83d\udd34', texte:'**GIIN absent pour une IFE**\u00a0: une IFE participante doit indiquer son GIIN \u2014 absence = anomalie' },
    { icon:'\ud83d\udd34', texte:'**UBO am\u00e9ricain non mentionn\u00e9**\u00a0: dossier montre un actionnaire avec indices d\u2019am\u00e9ricanit\u00e9 non signal\u00e9 dans le formulaire' },
    { icon:'\ud83d\udd34', texte:'**Signataire non habilit\u00e9**\u00a0: la personne qui signe n\u2019est pas mentionn\u00e9e comme dirigeant dans les statuts' },
  ], aretenir:'W-8BEN-E\u00a0: coh\u00e9rence de la cat\u00e9gorie + GIIN si IFE + UBO US + signataire habilit\u00e9. Tout doute \u2192 signal au PSF.' },

  { id:9, emoji:'\ud83c\udf0d', titre:'L\u2019autocertification CRS\u00a0: structure', contenu:[
    { icon:'\ud83d\udc64', texte:'**Section Identit\u00e9**\u00a0: nom, date et lieu de naissance, nationalit\u00e9, adresse de r\u00e9sidence' },
    { icon:'\ud83c\udf0d', texte:'**Section R\u00e9sidence fiscale**\u00a0: pays de r\u00e9sidence fiscale(s) \u2014 peut en avoir plusieurs \u2014 et le NIF correspondant' },
    { icon:'\ud83d\udd22', texte:'**NIF**\u00a0: num\u00e9ro d\u2019identification fiscale du ou des pays de r\u00e9sidence \u2014 format sp\u00e9cifique \u00e0 chaque pays' },
    { icon:'\u270d\ufe0f', texte:'**Certification**\u00a0: signature du client final sous peine de parjure + date' },
  ], aretenir:'Autocertification CRS\u00a0: identit\u00e9 + r\u00e9sidence(s) fiscale(s) + NIF + signature. Toujours v\u00e9rifier la coh\u00e9rence avec le dossier.' },

  { id:10, emoji:'\ud83d\udea8', titre:'Red flags autocertification CRS', contenu:[
    { icon:'\ud83d\udd34', texte:'**R\u00e9sidence incoh\u00e9rente**\u00a0: pays d\u00e9clar\u00e9 diff\u00e9rent de l\u2019adresse visible dans le dossier KYC' },
    { icon:'\ud83d\udd34', texte:'**NIF absent**\u00a0: sans justification valable (le pays concern\u00e9 \u00e9met bien des NIF)' },
    { icon:'\ud83d\udd34', texte:'**Format NIF incorrect**\u00a0: le format du NIF ne correspond pas au pays de r\u00e9sidence d\u00e9clar\u00e9' },
    { icon:'\ud83d\udd34', texte:'**Indices FATCA visibles non r\u00e9fl\u00e9chis dans le CRS**\u00a0: adresse US visible mais r\u00e9sidence CRS hors USA' },
    { icon:'\ud83d\udd34', texte:'**Signature manquante ou date absente**' },
  ], aretenir:'5 red flags CRS\u00a0: r\u00e9sidence incoh\u00e9rente, NIF absent, format NIF faux, contradictions FATCA/CRS, signature manquante.' },

  { id:11, emoji:'\ud83d\udd0d', titre:'V\u00e9rifier la coh\u00e9rence de l\u2019autocertification', contenu:[
    { icon:'\u2705', texte:'**R\u00e9sidence**\u00a0: le pays d\u00e9clar\u00e9 est-il coh\u00e9rent avec l\u2019adresse dans le dossier KYC et les autres documents\u00a0?' },
    { icon:'\u2705', texte:'**NIF**\u00a0: le format correspond-il au pays d\u00e9clar\u00e9\u00a0? (consulter la liste des formats de NIF par pays si n\u00e9cessaire)' },
    { icon:'\u2705', texte:'**Coh\u00e9rence FATCA/CRS**\u00a0: des indices d\u2019am\u00e9ricanit\u00e9 visibles sont-ils absents de la documentation CRS\u00a0?' },
    { icon:'\u2705', texte:'**Signature et date**\u00a0: pr\u00e9sentes et r\u00e9centes\u00a0? En cas de changement de circonstances, autocertification \u00e0 jour\u00a0?' },
  ], aretenir:'V\u00e9rification autocertification = 4 points\u00a0: r\u00e9sidence, NIF, coh\u00e9rence FATCA, signature. Un point douteux \u2192 signal au PSF.' },

  { id:12, emoji:'\ud83d\udd22', titre:'Les formats de NIF\u00a0: rep\u00e8res pratiques', contenu:[
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:'**Luxembourg**\u00a0: matricule de 13 chiffres (ex\u00a0: 1952030800001)' },
    { icon:'\ud83c\uddeb\ud83c\uddf7', texte:'**France**\u00a0: num\u00e9ro fiscal de 13 chiffres ou SPI de 13 chiffres' },
    { icon:'\ud83c\udde9\ud83c\uddea', texte:'**Allemagne**\u00a0: Steueridentifikationsnummer de 11 chiffres' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**USA**\u00a0: SSN = XXX-XX-XXXX (9 chiffres) ou EIN = XX-XXXXXXX pour les entit\u00e9s' },
  ], aretenir:'Un NIF avec un format incompatible avec le pays d\u00e9clar\u00e9 est un red flag \u00e0 signaler. En cas de doute\u00a0: signaler au PSF.', plusLoin:[
    { icon:'\ud83c\udf0d', texte:'Le **portail NIF de l\u2019OCDE** (oecd.org/tax/automatic-exchange) liste les formats valides pour tous les pays \u2014 outil de r\u00e9f\u00e9rence' },
    { icon:'\ud83c\udde8\ud83c\uddf3', texte:'**Chine**\u00a0: n\u2019\u00e9met pas de NIF pour tous les r\u00e9sidents \u2014 cas fr\u00e9quent \u00e0 documenter avec justification' },
  ]},

  { id:13, emoji:'\u2694\ufe0f', titre:'W-9 vs W-8BEN\u00a0: choisir le bon formulaire', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**Client final US Person**\u00a0: W-9 obligatoire \u2014 si un W-8BEN est fourni \u00e0 la place = red flag \u00e0 signaler' },
    { icon:'\ud83c\udf0d', texte:'**Client final non-US particulier**\u00a0: W-8BEN requis \u2014 si un W-9 est fourni = red flag (client se d\u00e9clare US)' },
    { icon:'\ud83c\udfe2', texte:'**Entit\u00e9 non-US**\u00a0: W-8BEN-E requis \u2014 un W-8BEN individuel pour une entit\u00e9 = red flag' },
    { icon:'\ud83e\udd14', texte:'En cas de doute sur le type de client final\u00a0: **signaler au PSF** plut\u00f4t que de choisir soi-m\u00eame' },
  ], aretenir:'Mauvais formulaire = red flag. i-Hub ne demande pas de nouveau formulaire directement au client final \u2014 c\u2019est le PSF qui le fait.' },

  { id:14, emoji:'\ud83d\udd04', titre:'Changement de circonstances et formulaires', contenu:[
    { icon:'\ud83d\udc64', texte:'Si le client final **change de pays de r\u00e9sidence**\u00a0: W-8BEN et autocertification CRS doivent \u00eatre renouvels' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Si le client final **acquiert la nationalit\u00e9 am\u00e9ricaine**\u00a0: le W-8BEN devient invalide, un W-9 est requis' },
    { icon:'\ud83c\udfe2', texte:'Si une entit\u00e9 **change de structure**\u00a0: le W-8BEN-E doit \u00eatre renouvel\u00e9 et la cat\u00e9gorie FATCA v\u00e9rifi\u00e9e' },
    { icon:'\ud83d\udd0d', texte:'i-Hub d\u00e9tecte les indices de changement lors de ses v\u00e9rifications et les **signale au PSF** \u2014 le PSF sollicite les nouveaux formulaires' },
  ], aretenir:'Un changement de situation = formulaires \u00e0 renouveler. i-Hub d\u00e9tecte, signale au PSF. Le PSF contacte son client final.' },

  { id:15, emoji:'\ud83d\udcce', titre:'Documentation et archivage des v\u00e9rifications', contenu:[
    { icon:'\ud83d\udcdd', texte:'Pour chaque formulaire v\u00e9rifi\u00e9\u00a0: i-Hub documente le **r\u00e9sultat** (OK ou red flags d\u00e9tect\u00e9s) et la **date** de v\u00e9rification' },
    { icon:'\ud83d\udce4', texte:'Ce rapport est transmis au PSF avec les donn\u00e9es v\u00e9rifi\u00e9es, via les **canaux s\u00e9curis\u00e9s** pr\u00e9vus au SLA' },
    { icon:'\ud83d\uddc2\ufe0f', texte:'i-Hub archive ses rapports de v\u00e9rification **au moins 5 ans** pour justifier sa diligence en cas de contr\u00f4le' },
    { icon:'\ud83d\udd12', texte:'Les donn\u00e9es fiscales des clients finaux sont **hautement confidentielles** \u2014 RGPD + secret professionnel s\u2019appliquent' },
  ], aretenir:'Documenter chaque v\u00e9rification prot\u00e8ge i-Hub. Rapport transmis au PSF uniquement. Jamais \u00e0 l\u2019ACD ou l\u2019IRS directement.' },

  { id:16, emoji:'\ud83c\udf10', titre:'Le NIF absent\u00a0: que faire\u00a0?', contenu:[
    { icon:'\ud83d\udd0d', texte:'Un NIF absent n\u2019est pas toujours un red flag absolu \u2014 certains pays n\u2019\u00e9mettent pas de NIF pour tous leurs r\u00e9sidents' },
    { icon:'\ud83d\udcdd', texte:'Dans ce cas\u00a0: le formulaire doit **justifier l\u2019absence** (case d\u00e9di\u00e9e\u00a0: "le pays n\u2019\u00e9met pas de NIF" ou "en cours de demande")' },
    { icon:'\ud83d\udea8', texte:'Si l\u2019absence n\u2019est pas justifi\u00e9e\u00a0: **red flag \u00e0 signaler au PSF** \u2014 le PSF demande une justification \u00e0 son client final' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie **si le pays concern\u00e9 \u00e9met bien des NIF** (portail OCDE) avant de conclure \u00e0 une anomalie' },
  ], aretenir:'NIF absent = v\u00e9rifier si justif\u00e9 ou si le pays n\u2019\u00e9met pas de NIF. Sans justification valable\u00a0: signal au PSF.' },

  { id:17, emoji:'\ud83c\udde7\ud83c\uddea', titre:'Cas particulier\u00a0: client avec double r\u00e9sidence', contenu:[
    { icon:'\ud83c\udf0d', texte:'Un client final peut avoir **plusieurs r\u00e9sidences fiscales** \u2014 il doit les d\u00e9clarer **toutes** dans l\u2019autocertification CRS' },
    { icon:'\ud83d\udd22', texte:'Pour chaque pays de r\u00e9sidence\u00a0: un **NIF distinct** doit \u00eatre fourni' },
    { icon:'\ud83d\udea8', texte:'Si l\u2019autocertification ne mentionne qu\u2019une seule r\u00e9sidence mais que des indices pointent vers une deuxi\u00e8me\u00a0: signaler au PSF' },
    { icon:'\ud83d\udccc', texte:'Exemple\u00a0: travailleur frontalier franco-luxembourgeois \u2014 peut \u00eatre r\u00e9sident fiscal dans les deux pays' },
  ], aretenir:'Double r\u00e9sidence = deux NIF dans l\u2019autocertification. Si indices d\u2019une deuxi\u00e8me r\u00e9sidence sans d\u00e9claration\u00a0: signal au PSF.' },

  { id:18, emoji:'\ud83d\udcb0', titre:'Formulaires et retenue\u00a0: le lien avec QI', contenu:[
    { icon:'\ud83d\udcb0', texte:'La **qualit\u00e9 du formulaire W** d\u00e9termine directement le taux de retenue appliqu\u00e9 par le PSF QI' },
    { icon:'\ud83d\udd34', texte:'W-8BEN expir\u00e9 \u2192 PSF applique **30%** par d\u00e9faut au lieu du taux conventionnel r\u00e9duit' },
    { icon:'\ud83d\udd34', texte:'W-8BEN avec pays de r\u00e9sidence incorrect \u2192 **mauvais taux** appliqu\u00e9 (convention du mauvais pays)' },
    { icon:'\ud83d\udd0d', texte:'La v\u00e9rification rigoureuse des formulaires par i-Hub **prot\u00e8ge directement** les clients finaux du PSF' },
  ], aretenir:'Un formulaire inexact = mauvais taux de retenue. La qualit\u00e9 de la v\u00e9rification i-Hub a un impact financier direct sur les clients finaux.' },

  { id:19, emoji:'\ud83d\uded1', titre:'Ce que i-Hub ne fait pas', contenu:[
    { icon:'\u274c', texte:'i-Hub **ne corrige pas** les formulaires \u2014 il signale les erreurs au PSF qui contacte son client final' },
    { icon:'\u274c', texte:'i-Hub **ne contacte pas** le client final directement pour obtenir un nouveau formulaire (sauf SLA sp\u00e9cifique)' },
    { icon:'\u274c', texte:'i-Hub **ne d\u00e9cide pas** de la classification fiscale finale \u2014 c\u2019est la responsabilit\u00e9 du PSF' },
    { icon:'\u274c', texte:'i-Hub **ne valide pas** un formulaire incomplet ou incoh\u00e9rent m\u00eame si le client final insiste' },
  ], aretenir:'D\u00e9tecter \u2260 Corriger. Signaler \u2260 D\u00e9cider. i-Hub est le contr\u00f4leur qualit\u00e9. Le PSF est le responsable fiscal.' },

  { id:20, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: les 4 points de v\u00e9rification universels', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Le bon formulaire**\u00a0: est-ce le bon type selon le profil du client final\u00a0?' },
    { icon:'2\ufe0f\u20e3', texte:'**La compl\u00e9tude**\u00a0: toutes les informations obligatoires sont-elles pr\u00e9sentes (nom, NIF, pays, signature, date)\u00a0?' },
    { icon:'3\ufe0f\u20e3', texte:'**La coh\u00e9rence interne**\u00a0: les informations du formulaire sont-elles coh\u00e9rentes entre elles\u00a0?' },
    { icon:'4\ufe0f\u20e3', texte:'**La coh\u00e9rence externe**\u00a0: les informations du formulaire concordent-elles avec les autres documents du dossier\u00a0?' },
  ], aretenir:'4 points universels\u00a0: bon formulaire + complet + coh\u00e9rent en interne + coh\u00e9rent avec le dossier. Tout \u00e9cart \u2192 signal au PSF.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udcdd', titre:'Overview: the 4 key forms', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**W-9**: completed by **US Persons** \u2014 certifies US status and TIN' },
    { icon:'\ud83d\udcdd', texte:'**W-8BEN**: completed by **non-US individuals** \u2014 certifies non-US status (valid 3 years)' },
    { icon:'\ud83c\udfe2', texte:'**W-8BEN-E**: completed by **non-US entities** \u2014 specifies FATCA category' },
    { icon:'\ud83c\udf0d', texte:'**CRS self-certification**: completed by any final client \u2014 declares tax residency and TIN' },
  ], aretenir:'These 4 forms are the core of i-Hub\u2019s verification work. Master them = know what to look for and what to flag.' },
  { id:2, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:'The W-9: structure and key information', contenu:[
    { icon:'\ud83d\udc64', texte:'**Line 1**: name of the final client (must match exactly the name on other identity documents)' },
    { icon:'\ud83c\udfe2', texte:'**Line 3**: entity type (individual, S-Corp, LLC\u2026) \u2014 consistency to verify with other documents' },
    { icon:'\ud83d\udd22', texte:'**Part I**: the **TIN** (Taxpayer Identification Number) \u2014 SSN for individuals, EIN for entities' },
    { icon:'\u270d\ufe0f', texte:'**Part II**: certification signed under penalty of perjury \u2014 signature and date are mandatory' },
  ], aretenir:'W-9: name + entity type + TIN + signature. Any absence or inconsistency is flagged to the PSF.' },
  { id:3, emoji:'\ud83d\udea8', titre:'W-9 red flags to flag to the PSF', contenu:[
    { icon:'\ud83d\udd34', texte:'**Missing or incomplete TIN**: US tax number is absent or incorrectly formatted (SSN = XXX-XX-XXXX)' },
    { icon:'\ud83d\udd34', texte:'**Inconsistent name**: name on W-9 does not match name on passport or other documents' },
    { icon:'\ud83d\udd34', texte:'**Missing signature**: form is unsigned or undated' },
    { icon:'\ud83d\udd34', texte:'**W-9 provided by apparent non-US person**: visible US indicia absent but W-9 submitted \u2014 contradiction' },
  ], aretenir:'Any W-9 red flag is flagged to the PSF with documentation. i-Hub does not correct, does not contact the final client directly.' },
  { id:4, emoji:'\ud83d\udcdd', titre:'The W-8BEN: structure and key information', contenu:[
    { icon:'\ud83d\udc64', texte:'**Part I (1-7)**: name, nationality, country of tax residence, permanent address, TIN of country of residence' },
    { icon:'\ud83c\udf10', texte:'**Part II (8-10)**: treaty claim \u2014 country and article of treaty invoked, reduced rate requested' },
    { icon:'\u270d\ufe0f', texte:'**Part III**: certification signed under penalty of perjury \u2014 signature + date mandatory' },
    { icon:'\ud83d\udcc5', texte:'**Validity**: 3 years from the date of signature \u2014 always check the date' },
  ], aretenir:'W-8BEN: identity + residency + treaty + signature + date. Always check the expiry date.' },
  { id:5, emoji:'\ud83d\udea8', titre:'W-8BEN red flags to flag to the PSF', contenu:[
    { icon:'\ud83d\udd34', texte:'**Expired form**: signature date over 3 years ago without renewal' },
    { icon:'\ud83d\udd34', texte:'**US birthplace**: US birthplace visible on passport but W-8BEN (non-US) provided' },
    { icon:'\ud83d\udd34', texte:'**Inconsistent country of residence**: country on W-8BEN differs from address on other documents' },
    { icon:'\ud83d\udd34', texte:'**Missing TIN**: no tax ID for the declared country without valid justification' },
    { icon:'\ud83d\udd34', texte:'**Missing signature or date**: incomplete form = invalid' },
  ], aretenir:'5 W-8BEN red flags: expired, US birthplace, inconsistent country, missing TIN, missing signature. Any flag \u2192 signal to PSF.' },
  { id:6, emoji:'\ud83d\udd0d', titre:'Verifying W-8BEN consistency', contenu:[
    { icon:'\u2705', texte:'**Name**: matches the name on passport and other identity documents?' },
    { icon:'\u2705', texte:'**Country of residence**: consistent with the address in the KYC file? No sign of US residency?' },
    { icon:'\u2705', texte:'**TIN**: correct format for the declared country? (e.g. French TIN = 13 digits)' },
    { icon:'\u2705', texte:'**Date**: less than 3 years old? If not: expired form, flag to PSF' },
  ], aretenir:'W-8BEN verification = 4 points: name, residency, TIN, date. If one point is off: flag to PSF.' },
  { id:7, emoji:'\ud83c\udfe2', titre:'The W-8BEN-E: simplified structure', contenu:[
    { icon:'\ud83c\udfe2', texte:'**Part I (1-4)**: entity name, country of incorporation, entity type, country of tax residence' },
    { icon:'\ud83c\udfaf', texte:'**Chapter 4 (FATCA box)**: entity\u2019s FATCA category (participating FFI, active NFFE, passive NFFE\u2026)' },
    { icon:'\ud83d\udc65', texte:'**US UBOs** (for passive NFFEs): dedicated section to identify US shareholders > 10%' },
    { icon:'\u270d\ufe0f', texte:'**Certification**: signed by an authorised representative of the entity \u2014 title and capacity to verify' },
  ], aretenir:'W-8BEN-E is more complex than individual W-8BEN. For doubtful cases: flag to PSF rather than interpret alone.' },
  { id:8, emoji:'\ud83d\udea8', titre:'W-8BEN-E red flags to flag to the PSF', contenu:[
    { icon:'\ud83d\udd34', texte:'**Inconsistent FATCA category**: entity declares Active NFFE but appears to be a passive holding' },
    { icon:'\ud83d\udd34', texte:'**Missing GIIN for an FFI**: a participating FFI must state its GIIN \u2014 absence = anomaly' },
    { icon:'\ud83d\udd34', texte:'**Undisclosed US UBO**: file shows a shareholder with US indicia not mentioned in the form' },
    { icon:'\ud83d\udd34', texte:'**Unauthorised signatory**: person signing is not listed as a director in the articles of association' },
  ], aretenir:'W-8BEN-E: category consistency + GIIN if FFI + US UBOs + authorised signatory. Any doubt \u2192 flag to PSF.' },
  { id:9, emoji:'\ud83c\udf0d', titre:'CRS self-certification: structure', contenu:[
    { icon:'\ud83d\udc64', texte:'**Identity section**: name, date and place of birth, nationality, residential address' },
    { icon:'\ud83c\udf0d', texte:'**Tax residency section**: country(ies) of tax residence \u2014 may have multiple \u2014 and corresponding TIN' },
    { icon:'\ud83d\udd22', texte:'**TIN**: tax identification number for the country(ies) of residence \u2014 country-specific format' },
    { icon:'\u270d\ufe0f', texte:'**Certification**: final client signature under penalty of perjury + date' },
  ], aretenir:'CRS self-cert: identity + tax residency(ies) + TIN + signature. Always verify consistency with the file.' },
  { id:10, emoji:'\ud83d\udea8', titre:'CRS self-certification red flags', contenu:[
    { icon:'\ud83d\udd34', texte:'**Inconsistent residency**: declared country differs from the address visible in the KYC file' },
    { icon:'\ud83d\udd34', texte:'**Missing TIN**: without valid justification (the relevant country does issue TINs)' },
    { icon:'\ud83d\udd34', texte:'**Incorrect TIN format**: TIN format does not match the declared country of residence' },
    { icon:'\ud83d\udd34', texte:'**Visible FATCA indicia not reflected in CRS**: US address visible but CRS residency outside US' },
    { icon:'\ud83d\udd34', texte:'**Missing signature or date**' },
  ], aretenir:'5 CRS red flags: inconsistent residency, missing TIN, wrong TIN format, FATCA/CRS contradictions, missing signature.' },
  { id:11, emoji:'\ud83d\udd0d', titre:'Verifying self-certification consistency', contenu:[
    { icon:'\u2705', texte:'**Residency**: is the declared country consistent with the KYC file address and other documents?' },
    { icon:'\u2705', texte:'**TIN**: is the format correct for the declared country? (consult OECD TIN format list if needed)' },
    { icon:'\u2705', texte:'**FATCA/CRS consistency**: are any visible US indicia absent from the CRS documentation?' },
    { icon:'\u2705', texte:'**Signature and date**: present and recent? In case of change of circumstances, is the self-cert up to date?' },
  ], aretenir:'Self-cert verification = 4 points: residency, TIN, FATCA consistency, signature. One doubtful point \u2192 flag to PSF.' },
  { id:12, emoji:'\ud83d\udd22', titre:'TIN formats: practical reference points', contenu:[
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:'**Luxembourg**: 13-digit matricule number (e.g. 1952030800001)' },
    { icon:'\ud83c\uddeb\ud83c\uddf7', texte:'**France**: 13-digit tax number or 13-digit SPI' },
    { icon:'\ud83c\udde9\ud83c\uddea', texte:'**Germany**: 11-digit Steueridentifikationsnummer' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**USA**: SSN = XXX-XX-XXXX (9 digits) or EIN = XX-XXXXXXX for entities' },
  ], aretenir:'A TIN with a format incompatible with the declared country is a red flag to flag. When in doubt: flag to PSF.', plusLoin:[
    { icon:'\ud83c\udf0d', texte:'The **OECD TIN portal** (oecd.org/tax/automatic-exchange) lists valid formats for all countries \u2014 reference tool' },
    { icon:'\ud83c\udde8\ud83c\uddf3', texte:'**China**: does not issue TINs for all residents \u2014 a frequent case to document with justification' },
  ]},
  { id:13, emoji:'\u2694\ufe0f', titre:'W-9 vs W-8BEN: choosing the right form', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**US Person final client**: W-9 mandatory \u2014 if W-8BEN is provided instead = red flag to flag' },
    { icon:'\ud83c\udf0d', texte:'**Non-US individual final client**: W-8BEN required \u2014 if W-9 is provided = red flag (client declares as US)' },
    { icon:'\ud83c\udfe2', texte:'**Non-US entity**: W-8BEN-E required \u2014 individual W-8BEN for an entity = red flag' },
    { icon:'\ud83e\udd14', texte:'When in doubt about the final client type: **flag to PSF** rather than deciding alone' },
  ], aretenir:'Wrong form = red flag. i-Hub does not request a new form directly from the final client \u2014 the PSF does that.' },
  { id:14, emoji:'\ud83d\udd04', titre:'Change of circumstances and forms', contenu:[
    { icon:'\ud83d\udc64', texte:'If the final client **changes country of residence**: W-8BEN and CRS self-cert must be renewed' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'If the final client **acquires US nationality**: W-8BEN becomes invalid, W-9 required' },
    { icon:'\ud83c\udfe2', texte:'If an entity **changes structure**: W-8BEN-E must be renewed and FATCA category reverified' },
    { icon:'\ud83d\udd0d', texte:'i-Hub detects indicators of change during verifications and **flags them to the PSF** \u2014 PSF requests new forms' },
  ], aretenir:'A change of situation = forms to renew. i-Hub detects, flags to PSF. The PSF contacts its final client.' },
  { id:15, emoji:'\ud83d\udcce', titre:'Documentation and archiving of verifications', contenu:[
    { icon:'\ud83d\udcdd', texte:'For each verified form: i-Hub documents the **result** (OK or red flags detected) and the **date** of verification' },
    { icon:'\ud83d\udce4', texte:'This report is transmitted to the PSF with the verified data, via **secure channels** per the SLA' },
    { icon:'\ud83d\uddc2\ufe0f', texte:'i-Hub archives its verification reports for **at least 5 years** to justify its diligence in case of audit' },
    { icon:'\ud83d\udd12', texte:'Final clients\u2019 tax data is **highly confidential** \u2014 GDPR + professional secrecy apply' },
  ], aretenir:'Document every verification to protect i-Hub. Report transmitted to PSF only. Never to ACD or IRS directly.' },
  { id:16, emoji:'\ud83c\udf10', titre:'Missing TIN: what to do?', contenu:[
    { icon:'\ud83d\udd0d', texte:'A missing TIN is not always an absolute red flag \u2014 some countries do not issue TINs for all residents' },
    { icon:'\ud83d\udcdd', texte:'In that case: the form must **justify the absence** (dedicated box: "country does not issue TINs" or "application pending")' },
    { icon:'\ud83d\udea8', texte:'If the absence is not justified: **red flag to flag to the PSF** \u2014 PSF requests justification from its final client' },
    { icon:'\ud83d\udd0d', texte:'i-Hub checks **whether the relevant country does issue TINs** (OECD portal) before concluding there is an anomaly' },
  ], aretenir:'Missing TIN = check if justified or if country does not issue TINs. Without valid justification: flag to PSF.' },
  { id:17, emoji:'\ud83c\udde7\ud83c\uddea', titre:'Special case: client with dual residency', contenu:[
    { icon:'\ud83c\udf0d', texte:'A final client may have **multiple tax residencies** \u2014 they must declare **all of them** in the CRS self-certification' },
    { icon:'\ud83d\udd22', texte:'For each country of residence: a **separate TIN** must be provided' },
    { icon:'\ud83d\udea8', texte:'If self-cert mentions only one residency but indicators point to a second: flag to PSF' },
    { icon:'\ud83d\udccc', texte:'Example: Franco-Luxembourg cross-border worker \u2014 may be tax resident in both countries' },
  ], aretenir:'Dual residency = two TINs in self-cert. If indicators of second residency without declaration: flag to PSF.' },
  { id:18, emoji:'\ud83d\udcb0', titre:'Forms and withholding: the QI link', contenu:[
    { icon:'\ud83d\udcb0', texte:'The **quality of the W form** directly determines the withholding rate applied by the QI PSF' },
    { icon:'\ud83d\udd34', texte:'Expired W-8BEN \u2192 PSF applies **30%** by default instead of the reduced treaty rate' },
    { icon:'\ud83d\udd34', texte:'W-8BEN with incorrect country of residence \u2192 **wrong rate** applied (wrong country\u2019s treaty)' },
    { icon:'\ud83d\udd0d', texte:'Rigorous form verification by i-Hub **directly protects** the PSF\u2019s final clients' },
  ], aretenir:'Inaccurate form = wrong withholding rate. Quality of i-Hub\u2019s verification has a direct financial impact on final clients.' },
  { id:19, emoji:'\ud83d\uded1', titre:'What i-Hub does NOT do', contenu:[
    { icon:'\u274c', texte:'i-Hub **does not correct** forms \u2014 it flags errors to the PSF which contacts its final client' },
    { icon:'\u274c', texte:'i-Hub **does not contact** the final client directly to obtain a new form (unless specified in SLA)' },
    { icon:'\u274c', texte:'i-Hub **does not decide** the final tax classification \u2014 that is the PSF\u2019s responsibility' },
    { icon:'\u274c', texte:'i-Hub **does not validate** an incomplete or inconsistent form even if the final client insists' },
  ], aretenir:'Detect \u2260 Correct. Flag \u2260 Decide. i-Hub is the quality controller. The PSF is the tax responsible party.' },
  { id:20, emoji:'\ud83c\udf93', titre:'Summary: the 4 universal verification points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Right form**: is it the correct type for the final client\u2019s profile?' },
    { icon:'2\ufe0f\u20e3', texte:'**Completeness**: are all mandatory items present (name, TIN, country, signature, date)?' },
    { icon:'3\ufe0f\u20e3', texte:'**Internal consistency**: are the form\u2019s own items consistent with each other?' },
    { icon:'4\ufe0f\u20e3', texte:'**External consistency**: does the form information match the other documents in the file?' },
  ], aretenir:'4 universal points: right form + complete + internally consistent + consistent with file. Any gap \u2192 flag to PSF.' },
]

const PROFILS_FR = [
  { profil:"Particulier fran\u00e7ais, r\u00e9sident \u00e0 Paris, non-am\u00e9ricain", form:"W-8BEN + autocertification CRS (France)" },
  { profil:"Citoyenne am\u00e9ricaine r\u00e9sidant \u00e0 Luxembourg", form:"W-9 + autocertification CRS (Luxembourg)" },
  { profil:"Soci\u00e9t\u00e9 luxembourgeoise (NFFE active)", form:"W-8BEN-E + autocertification CRS entit\u00e9" },
  { profil:"Fonds belge (IFE participante avec GIIN)", form:"W-8BEN-E avec GIIN" },
  { profil:"Particulier allemand r\u00e9sident en Suisse", form:"W-8BEN (r\u00e9sidence Suisse) + autocertification CRS (Suisse)" },
]
const PROFILS_EN = [
  { profil:"French individual, resident in Paris, non-US", form:"W-8BEN + CRS self-certification (France)" },
  { profil:"US female citizen residing in Luxembourg", form:"W-9 + CRS self-certification (Luxembourg)" },
  { profil:"Luxembourg company (active NFFE)", form:"W-8BEN-E + entity CRS self-certification" },
  { profil:"Belgian fund (participating FFI with GIIN)", form:"W-8BEN-E with GIIN" },
  { profil:"German individual resident in Switzerland", form:"W-8BEN (Swiss residency) + CRS self-certification (Switzerland)" },
]

const REDFLAGS_FR = [
  { situation:"W-8BEN sign\u00e9 le 15 janvier 2021", isFlag:true, explication:"Expir\u00e9 depuis janvier 2024 (3 ans). Red flag \u00e0 signaler au PSF imm\u00e9diatement." },
  { situation:"W-9 avec TIN format XXX-XX-XXXX complet et coh\u00e9rent", isFlag:false, explication:"TIN correctement format\u00e9 et complet. Aucun red flag." },
  { situation:"W-8BEN\u00a0: pays de r\u00e9sidence 'Luxembourg', adresse dans le dossier\u00a0: Frankfurt, Allemagne", isFlag:true, explication:"Incoh\u00e9rence entre pays de r\u00e9sidence (LU) et adresse (DE). Red flag \u00e0 signaler au PSF." },
  { situation:"Autocertification CRS\u00a0: NIF fran\u00e7ais de 13 chiffres pour un r\u00e9sident fran\u00e7ais", isFlag:false, explication:"Format NIF fran\u00e7ais correct (13 chiffres). Aucun red flag." },
  { situation:"W-8BEN-E\u00a0: entit\u00e9 se d\u00e9clare 'NFFE Active' mais dossier montre 80% de revenus passifs", isFlag:true, explication:"Incoh\u00e9rence de cat\u00e9gorie FATCA. Une NFFE avec 80% de revenus passifs est probablement passive. Signal au PSF." },
  { situation:"W-9 sans signature mais avec TIN valide", isFlag:true, explication:"Signature obligatoire sur W-9. Formulaire invalide sans signature. Signal au PSF." },
  { situation:"Autocertification CRS\u00a0: NIF absent, mention 'pays n\u2019\u00e9met pas de NIF'", isFlag:false, explication:"Justification de l\u2019absence de NIF pr\u00e9sente. Si le pays ne l\u2019\u00e9met pas, pas de red flag." },
  { situation:"W-8BEN\u00a0: lieu de naissance 'New York' sur le passeport joint", isFlag:true, explication:"Naissance aux USA + W-8BEN (non-US) = contradiction. Indice d\u2019am\u00e9ricanit\u00e9 \u00e0 signaler au PSF." },
]
const REDFLAGS_EN = [
  { situation:"W-8BEN signed on 15 January 2021", isFlag:true, explication:"Expired since January 2024 (3 years). Red flag to flag to PSF immediately." },
  { situation:"W-9 with TIN in correct XXX-XX-XXXX format, complete and consistent", isFlag:false, explication:"TIN correctly formatted and complete. No red flag." },
  { situation:"W-8BEN: country of residence 'Luxembourg', address in file: Frankfurt, Germany", isFlag:true, explication:"Inconsistency between country of residence (LU) and address (DE). Red flag to flag to PSF." },
  { situation:"CRS self-cert: 13-digit French TIN for a French resident", isFlag:false, explication:"Correct French TIN format (13 digits). No red flag." },
  { situation:"W-8BEN-E: entity declares 'Active NFFE' but file shows 80% passive income", isFlag:true, explication:"FATCA category inconsistency. An NFFE with 80% passive income is likely passive. Flag to PSF." },
  { situation:"W-9 without signature but with valid TIN", isFlag:true, explication:"Signature mandatory on W-9. Form invalid without signature. Flag to PSF." },
  { situation:"CRS self-cert: TIN absent, note 'country does not issue TINs'", isFlag:false, explication:"Absence of TIN is justified. If the country does not issue them, no red flag." },
  { situation:"W-8BEN: place of birth 'New York' on attached passport", isFlag:true, explication:"US birthplace + W-8BEN (non-US) = contradiction. US indicium to flag to PSF." },
]

const CAS_FR = [
  { situation:"Un PSF transmet le W-8BEN d\u2019un client final espagnol. Date de signature\u00a0: 3 mars 2022. Pays de r\u00e9sidence\u00a0: Espagne. NIF espagnol\u00a0: 12345678Z (format correct). Signature pr\u00e9sente.", action:"Signaler au PSF\u00a0: W-8BEN expir\u00e9 (plus de 3 ans)", options:["Accepter \u2014 tout est coh\u00e9rent","Signaler au PSF\u00a0: W-8BEN expir\u00e9 (plus de 3 ans)","Demander un W-9","Appliquer 30% de retenue directement"], explication:"Tout est coh\u00e9rent SAUF la date\u00a0: sign\u00e9 en mars 2022 = expir\u00e9 en mars 2025. i-Hub signale l\u2019expiration au PSF." },
  { situation:"Un PSF transmet le W-8BEN-E d\u2019une holding luxembourgeoise. Cat\u00e9gorie\u00a0: NFFE Active. Dans les documents\u00a0: 70% des revenus sont des dividendes et int\u00e9r\u00eats. Actionnaire principal\u00a0: M. Johnson (adresse Texas, USA).", action:"Signaler deux incoh\u00e9rences au PSF\u00a0: cat\u00e9gorie NFFE + actionnaire US", options:["Accepter \u2014 l\u2019entit\u00e9 a sign\u00e9","Signaler uniquement l\u2019actionnaire US","Signaler deux incoh\u00e9rences au PSF\u00a0: cat\u00e9gorie NFFE + actionnaire US","Reclassifier en NFFE Passive"], explication:"Double anomalie\u00a0: 70% revenus passifs = probable NFFE Passive. + Actionnaire US (adresse Texas) = indice FATCA. Les deux \u00e0 signaler au PSF." },
  { situation:"Un PSF transmet une autocertification CRS d\u2019un client final portugais r\u00e9sident \u00e0 Lisbonne. NIF portugais\u00a0: 123456789 (9 chiffres \u2014 format correct). Signature pr\u00e9sente et dat\u00e9e de ce mois. Adresse KYC\u00a0: Lisbonne.", action:"Aucun red flag \u2014 transmettre les donn\u00e9es v\u00e9rifi\u00e9es au PSF", options:["Signaler un red flag","Demander un W-8BEN en plus","Aucun red flag \u2014 transmettre les donn\u00e9es v\u00e9rifi\u00e9es au PSF","V\u00e9rifier aupr\u00e8s de l\u2019ACD"], explication:"Tout est coh\u00e9rent\u00a0: r\u00e9sidence Lisbonne coh\u00e9rente avec le dossier, NIF portugais format correct, signature r\u00e9cente. Aucun red flag." },
]
const CAS_EN = [
  { situation:"A PSF transmits a W-8BEN for a Spanish final client. Signature date: 3 March 2022. Country of residence: Spain. Spanish TIN: 12345678Z (correct format). Signature present.", action:"Flag to PSF: expired W-8BEN (over 3 years)", options:["Accept \u2014 everything is consistent","Flag to PSF: expired W-8BEN (over 3 years)","Request a W-9","Apply 30% withholding directly"], explication:"Everything is consistent EXCEPT the date: signed March 2022 = expired March 2025. i-Hub flags the expiry to the PSF." },
  { situation:"A PSF transmits the W-8BEN-E of a Luxembourg holding company. Category: Active NFFE. In the documents: 70% of income is dividends and interest. Main shareholder: Mr Johnson (Texas address, USA).", action:"Flag two inconsistencies to PSF: NFFE category + US shareholder", options:["Accept \u2014 the entity signed","Flag only the US shareholder","Flag two inconsistencies to PSF: NFFE category + US shareholder","Reclassify as Passive NFFE"], explication:"Double anomaly: 70% passive income = likely Passive NFFE. + US shareholder (Texas address) = FATCA indicium. Both to flag to PSF." },
  { situation:"A PSF transmits a CRS self-certification for a Portuguese final client resident in Lisbon. Portuguese TIN: 123456789 (9 digits \u2014 correct format). Signature present and dated this month. KYC address: Lisbon.", action:"No red flag \u2014 transmit verified data to the PSF", options:["Flag a red flag","Request a W-8BEN as well","No red flag \u2014 transmit verified data to the PSF","Check with the ACD"], explication:"Everything is consistent: Lisbon residency matches the file, Portuguese TIN correct format, recent signature. No red flag." },
]

export default function ModuleFormulaires() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeProfiles] = useState(() => shuffle(PROFILS_FR))
  const [profIndex, setProfIndex] = useState(0)
  const [profRevealed, setProfRevealed] = useState(false)

  const [activeFlags, setActiveFlags] = useState(() => pickRandom(REDFLAGS_FR, 8))
  const [flagAnswers, setFlagAnswers] = useState<Record<number, boolean|null>>({})
  const [flagSubmitted, setFlagSubmitted] = useState(false)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState<string|null>(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l: 'fr'|'en') {
    const bf=l==='fr'?REDFLAGS_FR:REDFLAGS_EN; const bc=l==='fr'?CAS_FR:CAS_EN
    setProfIndex(0); setProfRevealed(false)
    setActiveFlags(pickRandom(bf,8)); setFlagAnswers({}); setFlagSubmitted(false)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l) }

  function nextProf() {
    setScore(s=>s+2)
    if (profIndex+1<activeProfiles.length) { setProfIndex(i=>i+1); setProfRevealed(false) }
    else { setPhase('quiz2') }
  }

  function submitFlags() {
    let correct=0
    activeFlags.forEach((item,i)=>{ if(flagAnswers[i]===item.isFlag) correct++ })
    setScore(s=>s+correct*2); setFlagSubmitted(true)
  }

  function repCas(opt: string) { if(casRepondu!==null)return; const correct=opt===activeCas[casIndex].action; setCasRepondu(opt); if(correct)setCasScore(s=>s+1) }
  function nextCas() { if(casIndex+1<activeCas.length){setCasIndex(i=>i+1);setCasRepondu(null)}else{setScore(s=>s+casScore*7);setPhase('resultat')} }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'14px'}}>\ud83d\udcdd {lang==='fr'?'Formulaires fiscaux':'Tax forms'}</span>
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
        <div style={{fontSize:'72px',marginBottom:'20px'}}>\ud83d\udcdd</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
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
              {(fiche as any).plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen(o=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:\`1.5px solid \${C}\`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span>{t.goFurther}</span><span style={{transform:plusLoinOpen?'rotate(180deg)':'rotate(0)',display:'inline-block'}}>\u25be</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:\`\${C}08\`,border:\`1px solid \${C}25\`,borderRadius:'0 0 10px 10px',padding:'16px',borderTop:'none'}}>
                      {((fiche as any).plusLoin as {icon:string,texte:string}[]).map((item,i)=>(
                        <div key={i} style={{display:'flex',gap:'12px',padding:'10px 0',borderBottom:i<(fiche as any).plusLoin.length-1?\`1px solid \${C}20\`:'none'}}>
                          <span style={{fontSize:'20px',minWidth:'28px'}}>{item.icon}</span>
                          <p style={{margin:0,fontSize:'14px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
    const prof=activeProfiles[profIndex]
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(profIndex/activeProfiles.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q1label} \u2014 {profIndex+1}/{activeProfiles.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q1title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q1sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:\`2px solid \${C}30\`,marginBottom:'16px'}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>\ud83d\udc64 {prof.profil}</p>
          </div>
          {!profRevealed?(
            <button onClick={()=>setProfRevealed(true)} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
              {lang==='fr'?'\ud83d\udd0d Voir le formulaire requis':'\ud83d\udd0d See required form'}
            </button>
          ):(
            <div>
              <div style={{background:\`\${C}10\`,border:\`2px solid \${C}40\`,borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
                <p style={{margin:'0 0 6px',fontSize:'12px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{lang==='fr'?'Formulaire requis':'Required form'}</p>
                <p style={{margin:0,fontSize:'18px',fontWeight:'700',color:'#1f2937'}}>{prof.form}</p>
              </div>
              <button onClick={nextProf} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
                {profIndex<activeProfiles.length-1?t.next2:t.last}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase==='quiz2') {
    const allAnswered=Object.keys(flagAnswers).length===activeFlags.length
    return (
      <div style={base}><NavBar/>
        <div style={{maxWidth:'700px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q2label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.q2title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q2sub}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px'}}>
            {activeFlags.map((item,i)=>{
              const answered=flagAnswers[i]!==undefined
              const correct=flagSubmitted&&flagAnswers[i]===item.isFlag
              const wrong=flagSubmitted&&flagAnswers[i]!==item.isFlag
              return (
                <div key={i} style={{background:flagSubmitted?(correct?'#f0fdf4':'#fff1f1'):'white',borderRadius:'12px',padding:'14px 16px',border:\`1.5px solid \${flagSubmitted?(correct?'#6ee7b7':'#fca5a5'):'#e5e7eb'}\`}}>
                  <p style={{margin:'0 0 10px',fontSize:'14px',fontWeight:'500',color:'#374151'}}>{item.situation}</p>
                  {!flagSubmitted?(
                    <div style={{display:'flex',gap:'8px'}}>
                      <button onClick={()=>setFlagAnswers(a=>({...a,[i]:true}))} style={{padding:'6px 14px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:flagAnswers[i]===true?C:'#f3f4f6',color:flagAnswers[i]===true?'white':'#374151'}}>{t.oui}</button>
                      <button onClick={()=>setFlagAnswers(a=>({...a,[i]:false}))} style={{padding:'6px 14px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:flagAnswers[i]===false?'#059669':'#f3f4f6',color:flagAnswers[i]===false?'white':'#374151'}}>{t.non}</button>
                    </div>
                  ):(
                    <div>
                      <span style={{fontSize:'16px'}}>{correct?'\u2705':'\u274c'}</span>
                      <span style={{fontSize:'13px',color:'#374151',fontStyle:'italic',marginLeft:'8px'}}>{item.explication}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {!flagSubmitted?(
            <button onClick={submitFlags} disabled={!allAnswered} style={{width:'100%',padding:'16px',background:allAnswered?C:'#e5e7eb',border:'none',borderRadius:'12px',color:allAnswered?'white':'#9ca3af',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>
              {t.validate} ({Object.keys(flagAnswers).length}/{activeFlags.length})
            </button>
          ):(
            <button onClick={()=>setPhase('quiz3')} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.next2}</button>
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
            <p style={{fontSize:'14px',fontWeight:'500',color:'#374151',lineHeight:1.7,margin:0}}>\ud83d\udccb {cas.situation}</p>
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
console.log('✅ Formulaires fiscaux écrit !');
