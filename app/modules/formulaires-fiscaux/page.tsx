'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e07b39'

const UI = {
  fr: {
    title: 'Vérifier un W-9, W-8BEN ou autocertification',
    subtitle: 'Les formulaires fiscaux en pratique — ce que vérifie i-Hub pour ses clients PSF',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'La structure et les informations clés de chaque formulaire',
      'Comment vérifier la cohérence d’un W-9',
      'Comment vérifier la cohérence d’un W-8BEN',
      'Comment vérifier la cohérence d’un W-8BEN-E',
      'Comment vérifier une autocertification CRS',
      'Les red flags à signaler au PSF dans chaque formulaire',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR', goFurther: '🔍 Aller plus loin',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · QUEL FORMULAIRE ?', q1title: '📝 Quel formulaire correspond à ce profil ?',
    q1sub: 'Pour chaque profil de client final, quel formulaire le PSF doit-il collecter ?',
    q2label: 'QUIZ 2/3 · RED FLAG OU PAS ?', q2title: '🚨 Est-ce un red flag à signaler ?',
    q2sub: 'Pour chaque situation détectée dans un formulaire, faut-il signaler au PSF ?',
    oui: '🚨 Signaler', non: '✅ OK',
    q3label: 'QUIZ 3/3 · CAS PRATIQUES', q3title: '🔍 Analysez le formulaire',
    q3sub: 'Un PSF vous transmet un formulaire — que faites-vous ?',
    resultTitle: 'Module terminé — Vous savez vérifier les formulaires fiscaux !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    pts_gained: 'pts', medal_gold: 'Expert formulaires !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Terminer →',
    validate: 'Valider',
  },
  en: {
    title: 'Verifying W-9, W-8BEN or self-certification',
    subtitle: 'Tax forms in practice — what i-Hub verifies for its PSF clients',
    learn: '📚 What you will learn:',
    learnItems: [
      'The structure and key information of each form',
      'How to verify the consistency of a W-9',
      'How to verify the consistency of a W-8BEN',
      'How to verify the consistency of a W-8BEN-E',
      'How to verify a CRS self-certification',
      'Red flags to flag to the PSF in each form',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '🔍 Go further',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · WHICH FORM?', q1title: '📝 Which form matches this profile?',
    q1sub: 'For each final client profile, which form must the PSF collect?',
    q2label: 'QUIZ 2/3 · RED FLAG OR NOT?', q2title: '🚨 Is this a red flag to flag?',
    q2sub: 'For each situation detected in a form, should it be flagged to the PSF?',
    oui: '🚨 Flag it', non: '✅ OK',
    q3label: 'QUIZ 3/3 · CASE STUDIES', q3title: '🔍 Analyse the form',
    q3sub: 'A PSF sends you a form — what do you do?',
    resultTitle: 'Module complete — You know how to verify tax forms!',
    backHome: '← Back', restart: '🔄 Restart',
    pts_gained: 'pts', medal_gold: 'Forms Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Finish →',
    validate: 'Validate',
  },
}

const FICHES_FR = [
  { id:1, emoji:'📝', titre:'Vue d’ensemble : les 4 formulaires clés', contenu:[
    { icon:'🇺🇸', texte:'**W-9** : rempli par les **US Persons** — certifie le statut américain et le TIN' },
    { icon:'📝', texte:'**W-8BEN** : rempli par les **particuliers non-US** — certifie le statut non-américain (valable 3 ans)' },
    { icon:'🏢', texte:'**W-8BEN-E** : rempli par les **entités non-US** — précise la catégorie FATCA' },
    { icon:'🌍', texte:'**Autocertification CRS** : remplie par tout client final — déclare la résidence fiscale et le NIF' },
  ], aretenir:'Ces 4 formulaires sont le cœur du travail de vérification d’i-Hub. Les maîtriser = savoir quoi chercher et quoi signaler.' },

  { id:2, emoji:'🇺🇸', titre:'Le W-9 : structure et informations clés', contenu:[
    { icon:'👤', texte:'**Ligne 1** : nom du client final (doit correspondre exactement au nom sur les autres documents d’identité)' },
    { icon:'🏢', texte:'**Ligne 3** : type d’entité (individual, S-Corp, LLC…) — cohérence à vérifier avec les autres documents' },
    { icon:'🔢', texte:'**Partie I** : le **TIN** (Taxpayer Identification Number) — SSN pour les particuliers, EIN pour les entités' },
    { icon:'✍️', texte:'**Partie II** : certification signée sous peine de parjure — la signature et la date sont obligatoires' },
  ], aretenir:'W-9 : nom + type d’entité + TIN + signature. Toute absence ou incohérence est signalée au PSF.' },

  { id:3, emoji:'🚨', titre:'Red flags W-9 à signaler au PSF', contenu:[
    { icon:'🔴', texte:'**TIN absent ou incomplet** : le numéro fiscal américain est manquant ou mal formaté (SSN = XXX-XX-XXXX)' },
    { icon:'🔴', texte:'**Nom incohérent** : le nom sur le W-9 ne correspond pas au nom sur le passeport ou les autres documents' },
    { icon:'🔴', texte:'**Signature manquante** : le formulaire n’est pas signé ou n’est pas daté' },
    { icon:'🔴', texte:'**W-9 fourni par un non-US apparent** : indice de non-américanité visible mais formulaire US fourni — contradiction' },
  ], aretenir:'Tout red flag W-9 est signalé au PSF avec documentation. i-Hub ne corrige pas, ne recontacte pas le client final directement.' },

  { id:4, emoji:'📝', titre:'Le W-8BEN : structure et informations clés', contenu:[
    { icon:'👤', texte:'**Partie I (1-7)** : nom, nationalité, pays de résidence fiscale, adresse permanente, NIF du pays de résidence' },
    { icon:'🌐', texte:'**Partie II (8-10)** : claim de convention fiscale — pays et article de la convention invoqus, taux réduit demandé' },
    { icon:'✍️', texte:'**Partie III** : certification signée sous peine de parjure — signature + date obligatoires' },
    { icon:'📅', texte:'**Validité** : 3 ans à partir de la date de signature — toujours vérifier la date' },
  ], aretenir:'W-8BEN : identité + résidence + convention + signature + date. Et toujours vérifier la date d’expiration.' },

  { id:5, emoji:'🚨', titre:'Red flags W-8BEN à signaler au PSF', contenu:[
    { icon:'🔴', texte:'**Formulaire expiré** : date de signature de plus de 3 ans sans renouvellement' },
    { icon:'🔴', texte:'**Naissance aux USA** : lieu de naissance aux USA visible sur le passeport mais W-8BEN (non-US) fourni' },
    { icon:'🔴', texte:'**Pays de résidence incohérent** : pays mentionné sur le W-8BEN différent de l’adresse sur les autres documents' },
    { icon:'🔴', texte:'**NIF absent** : le numéro fiscal du pays de résidence est manquant sans justification valable' },
    { icon:'🔴', texte:'**Signature manquante ou date absente** : formulaire incomplet = invalide' },
  ], aretenir:'5 red flags W-8BEN : expiré, né aux USA, pays incohérent, NIF absent, signature manquante. Tout red flag → signal au PSF.' },

  { id:6, emoji:'🔍', titre:'Vérifier la cohérence du W-8BEN', contenu:[
    { icon:'✅', texte:'**Nom** : correspond au nom sur le passeport et les autres documents d’identité ?' },
    { icon:'✅', texte:'**Pays de résidence** : cohérent avec l’adresse dans le dossier KYC ? Pas de signe de résidence américaine ?' },
    { icon:'✅', texte:'**NIF** : format correct pour le pays mentionné ? (ex : NIF français = 13 chiffres)' },
    { icon:'✅', texte:'**Date** : moins de 3 ans ? Sinon : formulaire expiré, signaler au PSF' },
  ], aretenir:'La vérification W-8BEN = 4 points : nom, résidence, NIF, date. Si un point cloche : signal au PSF.' },

  { id:7, emoji:'🏢', titre:'Le W-8BEN-E : structure simplifiée', contenu:[
    { icon:'🏢', texte:'**Partie I (1-4)** : nom de l’entité, pays de constitution, type d’entité, pays de résidence fiscale' },
    { icon:'🎯', texte:'**Chapitre 4 (case FATCA)** : catégorie FATCA de l’entité (IFE participante, NFFE active, NFFE passive…)' },
    { icon:'👥', texte:'**UBO américains** (pour NFFE passive) : section dédiée à identifier les actionnaires US > 10%' },
    { icon:'✍️', texte:'**Certification** : signé par un représentant habilité de l’entité — titre et capacité à vérifier' },
  ], aretenir:'Le W-8BEN-E est plus complexe que le W-8BEN individuel. Pour les cas douteux : signaler au PSF plutôt que d’interpréter seul.' },

  { id:8, emoji:'🚨', titre:'Red flags W-8BEN-E à signaler au PSF', contenu:[
    { icon:'🔴', texte:'**Catégorie FATCA incohérente** : l’entité se déclare NFFE Active mais semble être une holding passive' },
    { icon:'🔴', texte:'**GIIN absent pour une IFE** : une IFE participante doit indiquer son GIIN — absence = anomalie' },
    { icon:'🔴', texte:'**UBO américain non mentionné** : dossier montre un actionnaire avec indices d’américanité non signalé dans le formulaire' },
    { icon:'🔴', texte:'**Signataire non habilité** : la personne qui signe n’est pas mentionnée comme dirigeant dans les statuts' },
  ], aretenir:'W-8BEN-E : cohérence de la catégorie + GIIN si IFE + UBO US + signataire habilité. Tout doute → signal au PSF.' },

  { id:9, emoji:'🌍', titre:'L’autocertification CRS : structure', contenu:[
    { icon:'👤', texte:'**Section Identité** : nom, date et lieu de naissance, nationalité, adresse de résidence' },
    { icon:'🌍', texte:'**Section Résidence fiscale** : pays de résidence fiscale(s) — peut en avoir plusieurs — et le NIF correspondant' },
    { icon:'🔢', texte:'**NIF** : numéro d’identification fiscale du ou des pays de résidence — format spécifique à chaque pays' },
    { icon:'✍️', texte:'**Certification** : signature du client final sous peine de parjure + date' },
  ], aretenir:'Autocertification CRS : identité + résidence(s) fiscale(s) + NIF + signature. Toujours vérifier la cohérence avec le dossier.' },

  { id:10, emoji:'🚨', titre:'Red flags autocertification CRS', contenu:[
    { icon:'🔴', texte:'**Résidence incohérente** : pays déclaré différent de l’adresse visible dans le dossier KYC' },
    { icon:'🔴', texte:'**NIF absent** : sans justification valable (le pays concerné émet bien des NIF)' },
    { icon:'🔴', texte:'**Format NIF incorrect** : le format du NIF ne correspond pas au pays de résidence déclaré' },
    { icon:'🔴', texte:'**Indices FATCA visibles non réfléchis dans le CRS** : adresse US visible mais résidence CRS hors USA' },
    { icon:'🔴', texte:'**Signature manquante ou date absente**' },
  ], aretenir:'5 red flags CRS : résidence incohérente, NIF absent, format NIF faux, contradictions FATCA/CRS, signature manquante.' },

  { id:11, emoji:'🔍', titre:'Vérifier la cohérence de l’autocertification', contenu:[
    { icon:'✅', texte:'**Résidence** : le pays déclaré est-il cohérent avec l’adresse dans le dossier KYC et les autres documents ?' },
    { icon:'✅', texte:'**NIF** : le format correspond-il au pays déclaré ? (consulter la liste des formats de NIF par pays si nécessaire)' },
    { icon:'✅', texte:'**Cohérence FATCA/CRS** : des indices d’américanité visibles sont-ils absents de la documentation CRS ?' },
    { icon:'✅', texte:'**Signature et date** : présentes et récentes ? En cas de changement de circonstances, autocertification à jour ?' },
  ], aretenir:'Vérification autocertification = 4 points : résidence, NIF, cohérence FATCA, signature. Un point douteux → signal au PSF.' },

  { id:12, emoji:'🔢', titre:'Les formats de NIF : repères pratiques', contenu:[
    { icon:'🇱🇺', texte:'**Luxembourg** : matricule de 13 chiffres (ex : 1952030800001)' },
    { icon:'🇫🇷', texte:'**France** : numéro fiscal de 13 chiffres ou SPI de 13 chiffres' },
    { icon:'🇩🇪', texte:'**Allemagne** : Steueridentifikationsnummer de 11 chiffres' },
    { icon:'🇺🇸', texte:'**USA** : SSN = XXX-XX-XXXX (9 chiffres) ou EIN = XX-XXXXXXX pour les entités' },
  ], aretenir:'Un NIF avec un format incompatible avec le pays déclaré est un red flag à signaler. En cas de doute : signaler au PSF.', plusLoin:[
    { icon:'🌍', texte:'Le **portail NIF de l’OCDE** (oecd.org/tax/automatic-exchange) liste les formats valides pour tous les pays — outil de référence' },
    { icon:'🇨🇳', texte:'**Chine** : n’émet pas de NIF pour tous les résidents — cas fréquent à documenter avec justification' },
  ]},

  { id:13, emoji:'⚔️', titre:'W-9 vs W-8BEN : choisir le bon formulaire', contenu:[
    { icon:'🇺🇸', texte:'**Client final US Person** : W-9 obligatoire — si un W-8BEN est fourni à la place = red flag à signaler' },
    { icon:'🌍', texte:'**Client final non-US particulier** : W-8BEN requis — si un W-9 est fourni = red flag (client se déclare US)' },
    { icon:'🏢', texte:'**Entité non-US** : W-8BEN-E requis — un W-8BEN individuel pour une entité = red flag' },
    { icon:'🤔', texte:'En cas de doute sur le type de client final : **signaler au PSF** plutôt que de choisir soi-même' },
  ], aretenir:'Mauvais formulaire = red flag. i-Hub ne demande pas de nouveau formulaire directement au client final — c’est le PSF qui le fait.' },

  { id:14, emoji:'🔄', titre:'Changement de circonstances et formulaires', contenu:[
    { icon:'👤', texte:'Si le client final **change de pays de résidence** : W-8BEN et autocertification CRS doivent être renouvels' },
    { icon:'🇺🇸', texte:'Si le client final **acquiert la nationalité américaine** : le W-8BEN devient invalide, un W-9 est requis' },
    { icon:'🏢', texte:'Si une entité **change de structure** : le W-8BEN-E doit être renouvelé et la catégorie FATCA vérifiée' },
    { icon:'🔍', texte:'i-Hub détecte les indices de changement lors de ses vérifications et les **signale au PSF** — le PSF sollicite les nouveaux formulaires' },
  ], aretenir:'Un changement de situation = formulaires à renouveler. i-Hub détecte, signale au PSF. Le PSF contacte son client final.' },

  { id:15, emoji:'📎', titre:'Documentation et archivage des vérifications', contenu:[
    { icon:'📝', texte:'Pour chaque formulaire vérifié : i-Hub documente le **résultat** (OK ou red flags détectés) et la **date** de vérification' },
    { icon:'📤', texte:'Ce rapport est transmis au PSF avec les données vérifiées, via les **canaux sécurisés** prévus au SLA' },
    { icon:'🗂️', texte:'i-Hub archive ses rapports de vérification **au moins 5 ans** pour justifier sa diligence en cas de contrôle' },
    { icon:'🔒', texte:'Les données fiscales des clients finaux sont **hautement confidentielles** — RGPD + secret professionnel s’appliquent' },
  ], aretenir:'Documenter chaque vérification protège i-Hub. Rapport transmis au PSF uniquement. Jamais à l’ACD ou l’IRS directement.' },

  { id:16, emoji:'🌐', titre:'Le NIF absent : que faire ?', contenu:[
    { icon:'🔍', texte:'Un NIF absent n’est pas toujours un red flag absolu — certains pays n’émettent pas de NIF pour tous leurs résidents' },
    { icon:'📝', texte:'Dans ce cas : le formulaire doit **justifier l’absence** (case dédiée : "le pays n’émet pas de NIF" ou "en cours de demande")' },
    { icon:'🚨', texte:'Si l’absence n’est pas justifiée : **red flag à signaler au PSF** — le PSF demande une justification à son client final' },
    { icon:'🔍', texte:'i-Hub vérifie **si le pays concerné émet bien des NIF** (portail OCDE) avant de conclure à une anomalie' },
  ], aretenir:'NIF absent = vérifier si justifé ou si le pays n’émet pas de NIF. Sans justification valable : signal au PSF.' },

  { id:17, emoji:'🇧🇪', titre:'Cas particulier : client avec double résidence', contenu:[
    { icon:'🌍', texte:'Un client final peut avoir **plusieurs résidences fiscales** — il doit les déclarer **toutes** dans l’autocertification CRS' },
    { icon:'🔢', texte:'Pour chaque pays de résidence : un **NIF distinct** doit être fourni' },
    { icon:'🚨', texte:'Si l’autocertification ne mentionne qu’une seule résidence mais que des indices pointent vers une deuxième : signaler au PSF' },
    { icon:'📌', texte:'Exemple : travailleur frontalier franco-luxembourgeois — peut être résident fiscal dans les deux pays' },
  ], aretenir:'Double résidence = deux NIF dans l’autocertification. Si indices d’une deuxième résidence sans déclaration : signal au PSF.' },

  { id:18, emoji:'💰', titre:'Formulaires et retenue : le lien avec QI', contenu:[
    { icon:'💰', texte:'La **qualité du formulaire W** détermine directement le taux de retenue appliqué par le PSF QI' },
    { icon:'🔴', texte:'W-8BEN expiré → PSF applique **30%** par défaut au lieu du taux conventionnel réduit' },
    { icon:'🔴', texte:'W-8BEN avec pays de résidence incorrect → **mauvais taux** appliqué (convention du mauvais pays)' },
    { icon:'🔍', texte:'La vérification rigoureuse des formulaires par i-Hub **protège directement** les clients finaux du PSF' },
  ], aretenir:'Un formulaire inexact = mauvais taux de retenue. La qualité de la vérification i-Hub a un impact financier direct sur les clients finaux.' },

  { id:19, emoji:'🛑', titre:'Ce que i-Hub ne fait pas', contenu:[
    { icon:'❌', texte:'i-Hub **ne corrige pas** les formulaires — il signale les erreurs au PSF qui contacte son client final' },
    { icon:'❌', texte:'i-Hub **ne contacte pas** le client final directement pour obtenir un nouveau formulaire (sauf SLA spécifique)' },
    { icon:'❌', texte:'i-Hub **ne décide pas** de la classification fiscale finale — c’est la responsabilité du PSF' },
    { icon:'❌', texte:'i-Hub **ne valide pas** un formulaire incomplet ou incohérent même si le client final insiste' },
  ], aretenir:'Détecter ≠ Corriger. Signaler ≠ Décider. i-Hub est le contrôleur qualité. Le PSF est le responsable fiscal.' },

  { id:20, emoji:'🎓', titre:'Résumé : les 4 points de vérification universels', contenu:[
    { icon:'1️⃣', texte:'**Le bon formulaire** : est-ce le bon type selon le profil du client final ?' },
    { icon:'2️⃣', texte:'**La complétude** : toutes les informations obligatoires sont-elles présentes (nom, NIF, pays, signature, date) ?' },
    { icon:'3️⃣', texte:'**La cohérence interne** : les informations du formulaire sont-elles cohérentes entre elles ?' },
    { icon:'4️⃣', texte:'**La cohérence externe** : les informations du formulaire concordent-elles avec les autres documents du dossier ?' },
  ], aretenir:'4 points universels : bon formulaire + complet + cohérent en interne + cohérent avec le dossier. Tout écart → signal au PSF.' },
]

const FICHES_EN = [
  { id:1, emoji:'📝', titre:'Overview: the 4 key forms', contenu:[
    { icon:'🇺🇸', texte:'**W-9**: completed by **US Persons** — certifies US status and TIN' },
    { icon:'📝', texte:'**W-8BEN**: completed by **non-US individuals** — certifies non-US status (valid 3 years)' },
    { icon:'🏢', texte:'**W-8BEN-E**: completed by **non-US entities** — specifies FATCA category' },
    { icon:'🌍', texte:'**CRS self-certification**: completed by any final client — declares tax residency and TIN' },
  ], aretenir:'These 4 forms are the core of i-Hub’s verification work. Master them = know what to look for and what to flag.' },
  { id:2, emoji:'🇺🇸', titre:'The W-9: structure and key information', contenu:[
    { icon:'👤', texte:'**Line 1**: name of the final client (must match exactly the name on other identity documents)' },
    { icon:'🏢', texte:'**Line 3**: entity type (individual, S-Corp, LLC…) — consistency to verify with other documents' },
    { icon:'🔢', texte:'**Part I**: the **TIN** (Taxpayer Identification Number) — SSN for individuals, EIN for entities' },
    { icon:'✍️', texte:'**Part II**: certification signed under penalty of perjury — signature and date are mandatory' },
  ], aretenir:'W-9: name + entity type + TIN + signature. Any absence or inconsistency is flagged to the PSF.' },
  { id:3, emoji:'🚨', titre:'W-9 red flags to flag to the PSF', contenu:[
    { icon:'🔴', texte:'**Missing or incomplete TIN**: US tax number is absent or incorrectly formatted (SSN = XXX-XX-XXXX)' },
    { icon:'🔴', texte:'**Inconsistent name**: name on W-9 does not match name on passport or other documents' },
    { icon:'🔴', texte:'**Missing signature**: form is unsigned or undated' },
    { icon:'🔴', texte:'**W-9 provided by apparent non-US person**: visible US indicia absent but W-9 submitted — contradiction' },
  ], aretenir:'Any W-9 red flag is flagged to the PSF with documentation. i-Hub does not correct, does not contact the final client directly.' },
  { id:4, emoji:'📝', titre:'The W-8BEN: structure and key information', contenu:[
    { icon:'👤', texte:'**Part I (1-7)**: name, nationality, country of tax residence, permanent address, TIN of country of residence' },
    { icon:'🌐', texte:'**Part II (8-10)**: treaty claim — country and article of treaty invoked, reduced rate requested' },
    { icon:'✍️', texte:'**Part III**: certification signed under penalty of perjury — signature + date mandatory' },
    { icon:'📅', texte:'**Validity**: 3 years from the date of signature — always check the date' },
  ], aretenir:'W-8BEN: identity + residency + treaty + signature + date. Always check the expiry date.' },
  { id:5, emoji:'🚨', titre:'W-8BEN red flags to flag to the PSF', contenu:[
    { icon:'🔴', texte:'**Expired form**: signature date over 3 years ago without renewal' },
    { icon:'🔴', texte:'**US birthplace**: US birthplace visible on passport but W-8BEN (non-US) provided' },
    { icon:'🔴', texte:'**Inconsistent country of residence**: country on W-8BEN differs from address on other documents' },
    { icon:'🔴', texte:'**Missing TIN**: no tax ID for the declared country without valid justification' },
    { icon:'🔴', texte:'**Missing signature or date**: incomplete form = invalid' },
  ], aretenir:'5 W-8BEN red flags: expired, US birthplace, inconsistent country, missing TIN, missing signature. Any flag → signal to PSF.' },
  { id:6, emoji:'🔍', titre:'Verifying W-8BEN consistency', contenu:[
    { icon:'✅', texte:'**Name**: matches the name on passport and other identity documents?' },
    { icon:'✅', texte:'**Country of residence**: consistent with the address in the KYC file? No sign of US residency?' },
    { icon:'✅', texte:'**TIN**: correct format for the declared country? (e.g. French TIN = 13 digits)' },
    { icon:'✅', texte:'**Date**: less than 3 years old? If not: expired form, flag to PSF' },
  ], aretenir:'W-8BEN verification = 4 points: name, residency, TIN, date. If one point is off: flag to PSF.' },
  { id:7, emoji:'🏢', titre:'The W-8BEN-E: simplified structure', contenu:[
    { icon:'🏢', texte:'**Part I (1-4)**: entity name, country of incorporation, entity type, country of tax residence' },
    { icon:'🎯', texte:'**Chapter 4 (FATCA box)**: entity’s FATCA category (participating FFI, active NFFE, passive NFFE…)' },
    { icon:'👥', texte:'**US UBOs** (for passive NFFEs): dedicated section to identify US shareholders > 10%' },
    { icon:'✍️', texte:'**Certification**: signed by an authorised representative of the entity — title and capacity to verify' },
  ], aretenir:'W-8BEN-E is more complex than individual W-8BEN. For doubtful cases: flag to PSF rather than interpret alone.' },
  { id:8, emoji:'🚨', titre:'W-8BEN-E red flags to flag to the PSF', contenu:[
    { icon:'🔴', texte:'**Inconsistent FATCA category**: entity declares Active NFFE but appears to be a passive holding' },
    { icon:'🔴', texte:'**Missing GIIN for an FFI**: a participating FFI must state its GIIN — absence = anomaly' },
    { icon:'🔴', texte:'**Undisclosed US UBO**: file shows a shareholder with US indicia not mentioned in the form' },
    { icon:'🔴', texte:'**Unauthorised signatory**: person signing is not listed as a director in the articles of association' },
  ], aretenir:'W-8BEN-E: category consistency + GIIN if FFI + US UBOs + authorised signatory. Any doubt → flag to PSF.' },
  { id:9, emoji:'🌍', titre:'CRS self-certification: structure', contenu:[
    { icon:'👤', texte:'**Identity section**: name, date and place of birth, nationality, residential address' },
    { icon:'🌍', texte:'**Tax residency section**: country(ies) of tax residence — may have multiple — and corresponding TIN' },
    { icon:'🔢', texte:'**TIN**: tax identification number for the country(ies) of residence — country-specific format' },
    { icon:'✍️', texte:'**Certification**: final client signature under penalty of perjury + date' },
  ], aretenir:'CRS self-cert: identity + tax residency(ies) + TIN + signature. Always verify consistency with the file.' },
  { id:10, emoji:'🚨', titre:'CRS self-certification red flags', contenu:[
    { icon:'🔴', texte:'**Inconsistent residency**: declared country differs from the address visible in the KYC file' },
    { icon:'🔴', texte:'**Missing TIN**: without valid justification (the relevant country does issue TINs)' },
    { icon:'🔴', texte:'**Incorrect TIN format**: TIN format does not match the declared country of residence' },
    { icon:'🔴', texte:'**Visible FATCA indicia not reflected in CRS**: US address visible but CRS residency outside US' },
    { icon:'🔴', texte:'**Missing signature or date**' },
  ], aretenir:'5 CRS red flags: inconsistent residency, missing TIN, wrong TIN format, FATCA/CRS contradictions, missing signature.' },
  { id:11, emoji:'🔍', titre:'Verifying self-certification consistency', contenu:[
    { icon:'✅', texte:'**Residency**: is the declared country consistent with the KYC file address and other documents?' },
    { icon:'✅', texte:'**TIN**: is the format correct for the declared country? (consult OECD TIN format list if needed)' },
    { icon:'✅', texte:'**FATCA/CRS consistency**: are any visible US indicia absent from the CRS documentation?' },
    { icon:'✅', texte:'**Signature and date**: present and recent? In case of change of circumstances, is the self-cert up to date?' },
  ], aretenir:'Self-cert verification = 4 points: residency, TIN, FATCA consistency, signature. One doubtful point → flag to PSF.' },
  { id:12, emoji:'🔢', titre:'TIN formats: practical reference points', contenu:[
    { icon:'🇱🇺', texte:'**Luxembourg**: 13-digit matricule number (e.g. 1952030800001)' },
    { icon:'🇫🇷', texte:'**France**: 13-digit tax number or 13-digit SPI' },
    { icon:'🇩🇪', texte:'**Germany**: 11-digit Steueridentifikationsnummer' },
    { icon:'🇺🇸', texte:'**USA**: SSN = XXX-XX-XXXX (9 digits) or EIN = XX-XXXXXXX for entities' },
  ], aretenir:'A TIN with a format incompatible with the declared country is a red flag to flag. When in doubt: flag to PSF.', plusLoin:[
    { icon:'🌍', texte:'The **OECD TIN portal** (oecd.org/tax/automatic-exchange) lists valid formats for all countries — reference tool' },
    { icon:'🇨🇳', texte:'**China**: does not issue TINs for all residents — a frequent case to document with justification' },
  ]},
  { id:13, emoji:'⚔️', titre:'W-9 vs W-8BEN: choosing the right form', contenu:[
    { icon:'🇺🇸', texte:'**US Person final client**: W-9 mandatory — if W-8BEN is provided instead = red flag to flag' },
    { icon:'🌍', texte:'**Non-US individual final client**: W-8BEN required — if W-9 is provided = red flag (client declares as US)' },
    { icon:'🏢', texte:'**Non-US entity**: W-8BEN-E required — individual W-8BEN for an entity = red flag' },
    { icon:'🤔', texte:'When in doubt about the final client type: **flag to PSF** rather than deciding alone' },
  ], aretenir:'Wrong form = red flag. i-Hub does not request a new form directly from the final client — the PSF does that.' },
  { id:14, emoji:'🔄', titre:'Change of circumstances and forms', contenu:[
    { icon:'👤', texte:'If the final client **changes country of residence**: W-8BEN and CRS self-cert must be renewed' },
    { icon:'🇺🇸', texte:'If the final client **acquires US nationality**: W-8BEN becomes invalid, W-9 required' },
    { icon:'🏢', texte:'If an entity **changes structure**: W-8BEN-E must be renewed and FATCA category reverified' },
    { icon:'🔍', texte:'i-Hub detects indicators of change during verifications and **flags them to the PSF** — PSF requests new forms' },
  ], aretenir:'A change of situation = forms to renew. i-Hub detects, flags to PSF. The PSF contacts its final client.' },
  { id:15, emoji:'📎', titre:'Documentation and archiving of verifications', contenu:[
    { icon:'📝', texte:'For each verified form: i-Hub documents the **result** (OK or red flags detected) and the **date** of verification' },
    { icon:'📤', texte:'This report is transmitted to the PSF with the verified data, via **secure channels** per the SLA' },
    { icon:'🗂️', texte:'i-Hub archives its verification reports for **at least 5 years** to justify its diligence in case of audit' },
    { icon:'🔒', texte:'Final clients’ tax data is **highly confidential** — GDPR + professional secrecy apply' },
  ], aretenir:'Document every verification to protect i-Hub. Report transmitted to PSF only. Never to ACD or IRS directly.' },
  { id:16, emoji:'🌐', titre:'Missing TIN: what to do?', contenu:[
    { icon:'🔍', texte:'A missing TIN is not always an absolute red flag — some countries do not issue TINs for all residents' },
    { icon:'📝', texte:'In that case: the form must **justify the absence** (dedicated box: "country does not issue TINs" or "application pending")' },
    { icon:'🚨', texte:'If the absence is not justified: **red flag to flag to the PSF** — PSF requests justification from its final client' },
    { icon:'🔍', texte:'i-Hub checks **whether the relevant country does issue TINs** (OECD portal) before concluding there is an anomaly' },
  ], aretenir:'Missing TIN = check if justified or if country does not issue TINs. Without valid justification: flag to PSF.' },
  { id:17, emoji:'🇧🇪', titre:'Special case: client with dual residency', contenu:[
    { icon:'🌍', texte:'A final client may have **multiple tax residencies** — they must declare **all of them** in the CRS self-certification' },
    { icon:'🔢', texte:'For each country of residence: a **separate TIN** must be provided' },
    { icon:'🚨', texte:'If self-cert mentions only one residency but indicators point to a second: flag to PSF' },
    { icon:'📌', texte:'Example: Franco-Luxembourg cross-border worker — may be tax resident in both countries' },
  ], aretenir:'Dual residency = two TINs in self-cert. If indicators of second residency without declaration: flag to PSF.' },
  { id:18, emoji:'💰', titre:'Forms and withholding: the QI link', contenu:[
    { icon:'💰', texte:'The **quality of the W form** directly determines the withholding rate applied by the QI PSF' },
    { icon:'🔴', texte:'Expired W-8BEN → PSF applies **30%** by default instead of the reduced treaty rate' },
    { icon:'🔴', texte:'W-8BEN with incorrect country of residence → **wrong rate** applied (wrong country’s treaty)' },
    { icon:'🔍', texte:'Rigorous form verification by i-Hub **directly protects** the PSF’s final clients' },
  ], aretenir:'Inaccurate form = wrong withholding rate. Quality of i-Hub’s verification has a direct financial impact on final clients.' },
  { id:19, emoji:'🛑', titre:'What i-Hub does NOT do', contenu:[
    { icon:'❌', texte:'i-Hub **does not correct** forms — it flags errors to the PSF which contacts its final client' },
    { icon:'❌', texte:'i-Hub **does not contact** the final client directly to obtain a new form (unless specified in SLA)' },
    { icon:'❌', texte:'i-Hub **does not decide** the final tax classification — that is the PSF’s responsibility' },
    { icon:'❌', texte:'i-Hub **does not validate** an incomplete or inconsistent form even if the final client insists' },
  ], aretenir:'Detect ≠ Correct. Flag ≠ Decide. i-Hub is the quality controller. The PSF is the tax responsible party.' },
  { id:20, emoji:'🎓', titre:'Summary: the 4 universal verification points', contenu:[
    { icon:'1️⃣', texte:'**Right form**: is it the correct type for the final client’s profile?' },
    { icon:'2️⃣', texte:'**Completeness**: are all mandatory items present (name, TIN, country, signature, date)?' },
    { icon:'3️⃣', texte:'**Internal consistency**: are the form’s own items consistent with each other?' },
    { icon:'4️⃣', texte:'**External consistency**: does the form information match the other documents in the file?' },
  ], aretenir:'4 universal points: right form + complete + internally consistent + consistent with file. Any gap → flag to PSF.' },
]

const PROFILS_FR = [
  { profil:"Particulier français, résident à Paris, non-américain", form:"W-8BEN + autocertification CRS (France)" },
  { profil:"Citoyenne américaine résidant à Luxembourg", form:"W-9 + autocertification CRS (Luxembourg)" },
  { profil:"Société luxembourgeoise (NFFE active)", form:"W-8BEN-E + autocertification CRS entité" },
  { profil:"Fonds belge (IFE participante avec GIIN)", form:"W-8BEN-E avec GIIN" },
  { profil:"Particulier allemand résident en Suisse", form:"W-8BEN (résidence Suisse) + autocertification CRS (Suisse)" },
]
const PROFILS_EN = [
  { profil:"French individual, resident in Paris, non-US", form:"W-8BEN + CRS self-certification (France)" },
  { profil:"US female citizen residing in Luxembourg", form:"W-9 + CRS self-certification (Luxembourg)" },
  { profil:"Luxembourg company (active NFFE)", form:"W-8BEN-E + entity CRS self-certification" },
  { profil:"Belgian fund (participating FFI with GIIN)", form:"W-8BEN-E with GIIN" },
  { profil:"German individual resident in Switzerland", form:"W-8BEN (Swiss residency) + CRS self-certification (Switzerland)" },
]

const REDFLAGS_FR = [
  { situation:"W-8BEN signé le 15 janvier 2021", isFlag:true, explication:"Expiré depuis janvier 2024 (3 ans). Red flag à signaler au PSF immédiatement." },
  { situation:"W-9 avec TIN format XXX-XX-XXXX complet et cohérent", isFlag:false, explication:"TIN correctement formaté et complet. Aucun red flag." },
  { situation:"W-8BEN : pays de résidence 'Luxembourg', adresse dans le dossier : Frankfurt, Allemagne", isFlag:true, explication:"Incohérence entre pays de résidence (LU) et adresse (DE). Red flag à signaler au PSF." },
  { situation:"Autocertification CRS : NIF français de 13 chiffres pour un résident français", isFlag:false, explication:"Format NIF français correct (13 chiffres). Aucun red flag." },
  { situation:"W-8BEN-E : entité se déclare 'NFFE Active' mais dossier montre 80% de revenus passifs", isFlag:true, explication:"Incohérence de catégorie FATCA. Une NFFE avec 80% de revenus passifs est probablement passive. Signal au PSF." },
  { situation:"W-9 sans signature mais avec TIN valide", isFlag:true, explication:"Signature obligatoire sur W-9. Formulaire invalide sans signature. Signal au PSF." },
  { situation:"Autocertification CRS : NIF absent, mention 'pays n’émet pas de NIF'", isFlag:false, explication:"Justification de l’absence de NIF présente. Si le pays ne l’émet pas, pas de red flag." },
  { situation:"W-8BEN : lieu de naissance 'New York' sur le passeport joint", isFlag:true, explication:"Naissance aux USA + W-8BEN (non-US) = contradiction. Indice d’américanité à signaler au PSF." },
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
  { situation:"Un PSF transmet le W-8BEN d’un client final espagnol. Date de signature : 3 mars 2022. Pays de résidence : Espagne. NIF espagnol : 12345678Z (format correct). Signature présente.", action:"Signaler au PSF : W-8BEN expiré (plus de 3 ans)", options:["Accepter — tout est cohérent","Signaler au PSF : W-8BEN expiré (plus de 3 ans)","Demander un W-9","Appliquer 30% de retenue directement"], explication:"Tout est cohérent SAUF la date : signé en mars 2022 = expiré en mars 2025. i-Hub signale l’expiration au PSF." },
  { situation:"Un PSF transmet le W-8BEN-E d’une holding luxembourgeoise. Catégorie : NFFE Active. Dans les documents : 70% des revenus sont des dividendes et intérêts. Actionnaire principal : M. Johnson (adresse Texas, USA).", action:"Signaler deux incohérences au PSF : catégorie NFFE + actionnaire US", options:["Accepter — l’entité a signé","Signaler uniquement l’actionnaire US","Signaler deux incohérences au PSF : catégorie NFFE + actionnaire US","Reclassifier en NFFE Passive"], explication:"Double anomalie : 70% revenus passifs = probable NFFE Passive. + Actionnaire US (adresse Texas) = indice FATCA. Les deux à signaler au PSF." },
  { situation:"Un PSF transmet une autocertification CRS d’un client final portugais résident à Lisbonne. NIF portugais : 123456789 (9 chiffres — format correct). Signature présente et datée de ce mois. Adresse KYC : Lisbonne.", action:"Aucun red flag — transmettre les données vérifiées au PSF", options:["Signaler un red flag","Demander un W-8BEN en plus","Aucun red flag — transmettre les données vérifiées au PSF","Vérifier auprès de l’ACD"], explication:"Tout est cohérent : résidence Lisbonne cohérente avec le dossier, NIF portugais format correct, signature récente. Aucun red flag." },
]
const CAS_EN = [
  { situation:"A PSF transmits a W-8BEN for a Spanish final client. Signature date: 3 March 2022. Country of residence: Spain. Spanish TIN: 12345678Z (correct format). Signature present.", action:"Flag to PSF: expired W-8BEN (over 3 years)", options:["Accept — everything is consistent","Flag to PSF: expired W-8BEN (over 3 years)","Request a W-9","Apply 30% withholding directly"], explication:"Everything is consistent EXCEPT the date: signed March 2022 = expired March 2025. i-Hub flags the expiry to the PSF." },
  { situation:"A PSF transmits the W-8BEN-E of a Luxembourg holding company. Category: Active NFFE. In the documents: 70% of income is dividends and interest. Main shareholder: Mr Johnson (Texas address, USA).", action:"Flag two inconsistencies to PSF: NFFE category + US shareholder", options:["Accept — the entity signed","Flag only the US shareholder","Flag two inconsistencies to PSF: NFFE category + US shareholder","Reclassify as Passive NFFE"], explication:"Double anomaly: 70% passive income = likely Passive NFFE. + US shareholder (Texas address) = FATCA indicium. Both to flag to PSF." },
  { situation:"A PSF transmits a CRS self-certification for a Portuguese final client resident in Lisbon. Portuguese TIN: 123456789 (9 digits — correct format). Signature present and dated this month. KYC address: Lisbon.", action:"No red flag — transmit verified data to the PSF", options:["Flag a red flag","Request a W-8BEN as well","No red flag — transmit verified data to the PSF","Check with the ACD"], explication:"Everything is consistent: Lisbon residency matches the file, Portuguese TIN correct format, recent signature. No red flag." },
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
      <button onClick={()=>router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'14px'}}>📝 {lang==='fr'?'Formulaires fiscaux':'Tax forms'}</span>
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
        <div style={{fontSize:'72px',marginBottom:'20px'}}>📝</div>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
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
              {(fiche as any).plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen(o=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:`1.5px solid ${C}`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span>{t.goFurther}</span><span style={{transform:plusLoinOpen?'rotate(180deg)':'rotate(0)',display:'inline-block'}}>▾</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:`${C}08`,border:`1px solid ${C}25`,borderRadius:'0 0 10px 10px',padding:'16px',borderTop:'none'}}>
                      {((fiche as any).plusLoin as {icon:string,texte:string}[]).map((item,i)=>(
                        <div key={i} style={{display:'flex',gap:'12px',padding:'10px 0',borderBottom:i<(fiche as any).plusLoin.length-1?`1px solid ${C}20`:'none'}}>
                          <span style={{fontSize:'20px',minWidth:'28px'}}>{item.icon}</span>
                          <p style={{margin:0,fontSize:'14px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C}">$1</strong>`)}}/>
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
              {ficheIndex<FICHES.length-1?`${t.next} (${ficheIndex+2}/${FICHES.length}) →`:t.quizBtn}
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(profIndex/activeProfiles.length)*100}%`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q1label} — {profIndex+1}/{activeProfiles.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q1title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q1sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:`2px solid ${C}30`,marginBottom:'16px'}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>👤 {prof.profil}</p>
          </div>
          {!profRevealed?(
            <button onClick={()=>setProfRevealed(true)} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
              {lang==='fr'?'🔍 Voir le formulaire requis':'🔍 See required form'}
            </button>
          ):(
            <div>
              <div style={{background:`${C}10`,border:`2px solid ${C}40`,borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
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
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q2label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.q2title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q2sub}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px'}}>
            {activeFlags.map((item,i)=>{
              const answered=flagAnswers[i]!==undefined
              const correct=flagSubmitted&&flagAnswers[i]===item.isFlag
              const wrong=flagSubmitted&&flagAnswers[i]!==item.isFlag
              return (
                <div key={i} style={{background:flagSubmitted?(correct?'#f0fdf4':'#fff1f1'):'white',borderRadius:'12px',padding:'14px 16px',border:`1.5px solid ${flagSubmitted?(correct?'#6ee7b7':'#fca5a5'):'#e5e7eb'}`}}>
                  <p style={{margin:'0 0 10px',fontSize:'14px',fontWeight:'500',color:'#374151'}}>{item.situation}</p>
                  {!flagSubmitted?(
                    <div style={{display:'flex',gap:'8px'}}>
                      <button onClick={()=>setFlagAnswers(a=>({...a,[i]:true}))} style={{padding:'6px 14px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:flagAnswers[i]===true?C:'#f3f4f6',color:flagAnswers[i]===true?'white':'#374151'}}>{t.oui}</button>
                      <button onClick={()=>setFlagAnswers(a=>({...a,[i]:false}))} style={{padding:'6px 14px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:flagAnswers[i]===false?'#059669':'#f3f4f6',color:flagAnswers[i]===false?'white':'#374151'}}>{t.non}</button>
                    </div>
                  ):(
                    <div>
                      <span style={{fontSize:'16px'}}>{correct?'✅':'❌'}</span>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(casIndex/activeCas.length)*100}%`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:`2px solid ${C}30`,marginBottom:'16px'}}>
            <p style={{fontSize:'14px',fontWeight:'500',color:'#374151',lineHeight:1.7,margin:0}}>📋 {cas.situation}</p>
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
