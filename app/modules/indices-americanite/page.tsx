'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e07b39'

const UI = {
  fr: {
    title: 'Indices d’américanité', subtitle: 'Détecter les signes d’une US Person — le rôle de vérification d’i-Hub',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: ['Les 6 indices officiels FATCA', 'Comment les détecter dans les documents', 'Ce qu’i-Hub fait quand un indice est détecté', 'Que faire en cas de contradiction entre indices et formulaire', 'Les situations particulières (double nationalité, Green Card…)', 'La règle d’or : signaler, ne pas conclure'],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR', goFurther: '🔍 Aller plus loin',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · INDICE OU PAS ?', q1title: '🔍 Est-ce un indice d’américanité ?',
    q1sub: 'Pour chaque élément, décidez si c’est un indice officiel FATCA ou non',
    oui: '🟢 Indice', non: '⚪ Pas un indice',
    q2label: 'QUIZ 2/3 · VRAI OU FAUX', q2title: '✅ Vrai ou Faux',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q3label: 'QUIZ 3/3 · QUE FAIT i-Hub ?', q3title: '🤔 Quelle est la bonne réaction ?',
    q3sub: 'Un indice a été détecté — que doit faire i-Hub ?',
    resultTitle: 'Module terminé — Vous savez détecter et signaler !',
    backHome: '← Retour', restart: '🔄 Recommencer',
    pts_gained: 'pts', medal_gold: 'Détective FATCA !', medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Terminer →',
  },
  en: {
    title: 'US Indicia', subtitle: 'Detecting signs of a US Person — i-Hub’s verification role',
    learn: '📚 What you will learn:',
    learnItems: ['The 6 official FATCA indicia', 'How to detect them in documents', 'What i-Hub does when an indicium is detected', 'What to do when indicia and form contradict each other', 'Special situations (dual nationality, Green Card…)', 'The golden rule: flag, do not conclude'],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '🔍 Go further',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · INDICIUM OR NOT?', q1title: '🔍 Is this a US indicium?',
    q1sub: 'For each element, decide whether it is an official FATCA indicium or not',
    oui: '🟢 Indicium', non: '⚪ Not an indicium',
    q2label: 'QUIZ 2/3 · TRUE OR FALSE', q2title: '✅ True or False',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q3label: 'QUIZ 3/3 · WHAT DOES i-Hub DO?', q3title: '🤔 What is the correct reaction?',
    q3sub: 'An indicium has been detected — what should i-Hub do?',
    resultTitle: 'Module complete — You know how to detect and flag!',
    backHome: '← Back', restart: '🔄 Restart',
    pts_gained: 'pts', medal_gold: 'FATCA Detective!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Finish →',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🔍', titre:'C’est quoi un indice d’américanité ?', contenu:[
    { icon:'🇺🇸', texte:'Un **indice d’américanité** est un élément dans le dossier du client final qui suggère une possible nationalité ou résidence américaine' },
    { icon:'🔍', texte:'Il ne prouve pas que le client est une US Person — il **oblige le PSF à vérifier** davantage avant de conclure' },
    { icon:'📌', texte:'FATCA définit **6 indices officiels** — i-Hub doit les connaître pour les détecter lors de ses vérifications documentaires' },
    { icon:'🛑', texte:'Quand i-Hub détecte un indice : il **signale au PSF** — c’est le PSF qui demande des clarifications au client final' },
  ], aretenir:'Un indice = un signal à transmettre au PSF. Pas une conclusion. Jamais i-Hub ne décide seul du statut US d’un client final.' },
  { id:2, emoji:'1️⃣', titre:'Indice n°1 : Lieu de naissance aux USA', contenu:[
    { icon:'👶', texte:'Le **lieu de naissance aux États-Unis** figurant sur un passeport ou document d’identité est un indice FATCA majeur' },
    { icon:'✅', texte:'Comment détecter : lors de la vérification du passeport ou extrait de naissance transmis par le PSF' },
    { icon:'⚠️', texte:'Attention : une personne née aux USA peut avoir renforcé sa nationalité étrangère — mais reste US Person sauf renonciation formelle' },
    { icon:'🚨', texte:'Action i-Hub : **signaler au PSF** — le client final a rempli un W-8BEN mais est né à Boston → contradiction à résoudre par le PSF' },
  ], aretenir:'Né aux USA + W-8BEN = red flag immédiat. i-Hub le signale au PSF qui demande des clarifications ou un W-9 au client final.' },
  { id:3, emoji:'2️⃣', titre:'Indice n°2 : Adresse américaine', contenu:[
    { icon:'🏠', texte:'Toute **adresse de résidence ou adresse postale aux USA** dans le dossier est un indice FATCA' },
    { icon:'📦', texte:'Inclut les **boîtes postales américaines** (PO Box) et les adresses de type « c/o » (aux bons soins de) aux USA' },
    { icon:'✅', texte:'Comment détecter : adresse figurant dans le formulaire KYC, la correspondance ou les documents transmis par le PSF' },
    { icon:'🚨', texte:'Action i-Hub : signaler au PSF si une adresse US est visible dans le dossier mais absente de la documentation fiscale' },
  ], aretenir:'Une adresse US dans le dossier du client final, même partielle ou secondaire, est un indice à signaler au PSF.' },
  { id:4, emoji:'3️⃣', titre:'Indice n°3 : Numéro de téléphone américain', contenu:[
    { icon:'📱', texte:'Un **numéro de téléphone américain** (+1) associé au compte du client final est un indice FATCA' },
    { icon:'🔢', texte:'Les indicatifs américains les plus courants : +1 suivi de 10 chiffres (ex : +1 212… pour New York, +1 310… pour Los Angeles)' },
    { icon:'✅', texte:'Comment détecter : dans les informations de contact du dossier client transmis par le PSF' },
    { icon:'🚨', texte:'Action i-Hub : signaler si le numéro de téléphone US n’est pas mentionné dans la documentation fiscale du client final' },
  ], aretenir:'Un numéro +1 dans le dossier client final, non mentionné dans les formulaires fiscaux = indice à signaler au PSF.' },
  { id:5, emoji:'4️⃣', titre:'Indice n°4 : Virement permanent vers les USA', contenu:[
    { icon:'💸', texte:'Un **ordre de virement permanent** vers un compte bancaire américain associé au compte du client final est un indice FATCA' },
    { icon:'🔍', texte:'Cela peut indiquer un lien économique fort avec les USA (propriété, revenus, famille)' },
    { icon:'✅', texte:'Comment détecter : dans les instructions de paiement ou ordres permanents associés au compte' },
    { icon:'🚨', texte:'Action i-Hub : signaler au PSF si un virement permanent vers un IBAN/ABA américain est visible dans le dossier' },
  ], aretenir:'Un virement récurrent vers les USA peut indiquer une US Person non identifiée. Signaler au PSF pour clarification.' },
  { id:6, emoji:'5️⃣', titre:'Indice n°5 : Procuration à une personne américaine', contenu:[
    { icon:'📝', texte:'Une **procuration ou délégation de signature** donnée à une personne ayant une adresse aux USA est un indice FATCA' },
    { icon:'🤔', texte:'Logique : si quelqu’un en qui vous avez confiance pour gérer vos finances vit aux USA, vous avez peut-être des liens américains' },
    { icon:'✅', texte:'Comment détecter : dans les documents de procuration transmis au PSF lors de l’entrée en relation' },
    { icon:'🚨', texte:'Action i-Hub : signaler au PSF si le mandataire a une adresse US et que cela n’est pas mentionné dans la documentation fiscale' },
  ], aretenir:'Un mandataire avec adresse US = indice à signaler. i-Hub ne juge pas — il informe le PSF qui clarifiera avec le client final.' },
  { id:7, emoji:'6️⃣', titre:'Indice n°6 : Adresse « c/o » ou « hold mail »', contenu:[
    { icon:'📨', texte:'Une **adresse de type « c/o »** (aux bons soins de) ou « hold mail » (courrier à retenir) comme seule adresse du client final est un indice' },
    { icon:'⚠️', texte:'Particularité : cet indice est plus fort que les autres car l’absence d’adresse permanente peut cacher une résidence américaine' },
    { icon:'✅', texte:'Comment détecter : lors de la vérification des documents KYC transmis par le PSF' },
    { icon:'🚨', texte:'Action i-Hub : signaler au PSF si « c/o » ou « hold mail » est la seule adresse disponible sans justification' },
  ], aretenir:'Une adresse c/o ou hold mail comme unique adresse est une anomalie documentaire et un indice FATCA à signaler immédiatement.' },
  { id:8, emoji:'📊', titre:'Tableau récapitulatif des 6 indices', contenu:[
    { icon:'1️⃣', texte:'**Lieu de naissance** aux USA sur un document d’identité' },
    { icon:'2️⃣', texte:'**Adresse** de résidence ou postale aux USA (y compris PO Box)' },
    { icon:'3️⃣', texte:'**Numéro de téléphone** américain (+1) dans le dossier' },
    { icon:'4️⃣', texte:'**Virement permanent** vers un compte bancaire aux USA' },
    { icon:'5️⃣', texte:'**Procuration ou délégation** donnée à quelqu’un avec adresse US' },
    { icon:'6️⃣', texte:'**Adresse c/o ou hold mail** comme seule adresse disponible' },
  ], aretenir:'Ces 6 indices sont définis par FATCA. Dès qu’un seul est visible dans le dossier transmis par le PSF, i-Hub le signale.' },
  { id:9, emoji:'🛑', titre:'Un indice ≠ certitude US Person', contenu:[
    { icon:'🤔', texte:'La présence d’un indice **ne signifie pas automatiquement** que le client final est une US Person' },
    { icon:'📝', texte:'Exemple : quelqu’un né aux USA qui a renfoncé à la citoyenneté américaine peut fournir une preuve de renonciation' },
    { icon:'🔄', texte:'Exemple : une adresse américaine peut appartenir à un résident étranger temporaire sans lien fiscal avec les USA' },
    { icon:'📌', texte:'C’est **le PSF** qui analyse le contexte et décide — i-Hub signale l’indice, pas la conclusion' },
  ], aretenir:'Indice ≠ conclusion. i-Hub détecte et signale. Le PSF demande des clarifications au client final et prend la décision finale.' },
  { id:10, emoji:'⚠️', titre:'La contradiction indice ≠ formulaire', contenu:[
    { icon:'🔴', texte:'Cas fréquent : le client final remplit un **W-8BEN** (non-US) mais le passeport montre une naissance à Chicago' },
    { icon:'🔴', texte:'Autre cas : autocertification CRS indique résidence luxembourgeoise mais une adresse US est visible dans le dossier' },
    { icon:'📌', texte:'Règle i-Hub : **toute contradiction** entre un formulaire fiscal et un indice visible doit être signalée au PSF' },
    { icon:'🚫', texte:'i-Hub n’accepte pas un formulaire incohérent — il documente la contradiction et la signale, le PSF tranche' },
  ], aretenir:'Formulaire W-8BEN + indice US visible = red flag immédiat. i-Hub signale la contradiction au PSF et la documente.' },
  { id:11, emoji:'🇺🇸', titre:'La double nationalité américaine', contenu:[
    { icon:'🇺🇸', texte:'Un **double national** (ex : franco-américain) est une **US Person** même s’il vit en France et possède un passeport français' },
    { icon:'📝', texte:'La nationalité américaine ne disparaît pas avec une autre nationalité — seule une **renonciation formelle** (CLN) y met fin' },
    { icon:'✅', texte:'Comment détecter : lieu de naissance aux USA sur le passeport français = indice à signaler même si le formulaire est W-8BEN' },
    { icon:'🛑', texte:'Action i-Hub : signaler au PSF — le PSF demandera au client final s’il possède la nationalité américaine' },
  ], aretenir:'Un passeport français avec lieu de naissance aux USA = possible double national = indice FATCA à signaler au PSF.' },
  { id:12, emoji:'🟩', titre:'La Green Card : résidence permanente US', contenu:[
    { icon:'🟩', texte:'Une **Green Card** (carte de résidence permanente) américaine fait de son détenteur une **US Person** même s’il vit ailleurs' },
    { icon:'✅', texte:'Comment détecter : mention de la Green Card dans les documents KYC, adresse historique aux USA, numéro d’alien' },
    { icon:'🔄', texte:'Une Green Card peut expirer ou avoir été abandonnée — le client final doit fournir la preuve de renonciation si c’est le cas' },
    { icon:'🚨', texte:'Action i-Hub : signaler au PSF si une Green Card passée ou présente est visible dans les documents transmis' },
  ], aretenir:'Green Card = US Person automatique. Même expirée, elle crée des obligations FATCA sauf preuve de renonciation en bonne et due forme.' },
  { id:13, emoji:'📋', titre:'Les documents où chercher les indices', contenu:[
    { icon:'🪪', texte:'**Passeport et pièce d’identité** : lieu de naissance, nationalité, numéro américain éventuel' },
    { icon:'📜', texte:'**Formulaire KYC et questionnaire d’entrée en relation** : adresse, numéro de téléphone, historique de résidence' },
    { icon:'💸', texte:'**Instructions de paiement** : IBAN/ABA américains dans les ordres de virement permanents' },
    { icon:'📝', texte:'**Actes de procuration** : adresse du mandataire, liens avec les USA' },
  ], aretenir:'Les indices se cachent dans les documents ordinaires du dossier. i-Hub les cherche même quand le formulaire fiscal semble en ordre.' },
  { id:14, emoji:'🔄', titre:'Que faire quand un indice est détecté ?', contenu:[
    { icon:'1️⃣', texte:'**Documenter** : noter l’indice détecté, sa source (quel document) et sa nature (quel type d’indice)' },
    { icon:'2️⃣', texte:'**Signaler au PSF** : transmettre le rapport de vérification avec la mention de l’indice détecté' },
    { icon:'3️⃣', texte:'**Ne pas conclure** : i-Hub ne classe pas le client final comme US Person — c’est la responsabilité du PSF' },
    { icon:'4️⃣', texte:'**Ne pas contacter le client final** : i-Hub ne contacte pas directement le client final sauf SLA spécifique' },
  ], aretenir:'Détecter → Documenter → Signaler au PSF. Jamais conclure, jamais contacter le client final directement.' },
  { id:15, emoji:'🤔', titre:'Les faux positifs : être méthodique', contenu:[
    { icon:'📌', texte:'Tous les indices ne mènent pas à une US Person — ils déclenchent une vérification, pas une conclusion' },
    { icon:'📝', texte:'Un client final peut avoir une adresse US sans lien fiscal (propriété de vacances, adresse de facturation…)' },
    { icon:'🪪', texte:'Un lieu de naissance aux USA peut concerner un enfant né lors d’un séjour temporaire des parents — cas documentable' },
    { icon:'📎', texte:'Dans tous les cas : i-Hub signale et documente, le PSF obtient les justificatifs du client final et décide' },
  ], aretenir:'Les faux positifs existent. i-Hub signale tout indice sans exception — le PSF dispose du contexte pour trancher avec le client final.' },
  { id:16, emoji:'🚨', titre:'La rèngle d’or : signaler, ne pas conclure', contenu:[
    { icon:'✅', texte:'Ce qu’i-Hub FAIT : détecter, documenter, signaler l’indice au PSF' },
    { icon:'❌', texte:'Ce qu’i-Hub NE FAIT PAS : classifier le client final comme US Person' },
    { icon:'❌', texte:'Ce qu’i-Hub NE FAIT PAS : ignorer un indice même « mineur » ou hors périmètre SLA' },
    { icon:'❌', texte:'Ce qu’i-Hub NE FAIT PAS : contacter le client final pour obtenir des clarifications (sauf SLA spécifique)' },
  ], aretenir:'La règle d’or : signal = PSF. Conclusion = PSF. Contact client final = PSF. i-Hub détecte et transmet, c’est tout.' },
  { id:17, emoji:'📜', titre:'Les documents de preuve de renonciation', contenu:[
    { icon:'📋', texte:'Un client final né aux USA peut avoir **renoncé à la citoyenneté américaine** — dans ce cas, FATCA ne s’applique plus' },
    { icon:'🇺🇸', texte:'La preuve de renonciation : le **CLN** (Certificate of Loss of Nationality) délivré par l’ambassade américaine' },
    { icon:'🔍', texte:'i-Hub vérifie la **présence et la validité** du CLN dans le dossier si le PSF l’a collecté — puis transmet au PSF' },
    { icon:'🛑', texte:'Sans CLN valide, un client né aux USA reste une US Person — même s’il a un passeport étranger depuis 40 ans' },
  ], aretenir:'CLN = seule preuve valide de renonciation à la nationalité US. i-Hub vérifie sa présence dans le dossier si fourni par le PSF.' },
  { id:18, emoji:'🌍', titre:'Les indices CRS : similaires mais différents', contenu:[
    { icon:'🌍', texte:'Pour CRS : les indices de **résidence étrangère** (adresse étrangère, NIF étranger, virement vers l’étranger)' },
    { icon:'🇺🇸', texte:'Pour FATCA : les 6 indices d’**américanité** (naissance, adresse, téléphone, virement, procuration, c/o)' },
    { icon:'🔄', texte:'Un même document peut contenir des indices FATCA **et** CRS — i-Hub doit vérifier les deux' },
    { icon:'📌', texte:'Dans les deux cas : i-Hub signale au PSF qui prend les mesures nécessaires avec son client final' },
  ], aretenir:'FATCA et CRS ont leurs propres indices. i-Hub les connaît tous et les signale au PSF sans exception.' },
  { id:19, emoji:'📎', titre:'La documentation des indices détectés', contenu:[
    { icon:'📝', texte:'i-Hub documente chaque indice détecté : type d’indice, source dans le dossier, date de détection' },
    { icon:'📤', texte:'Ce rapport est transmis au PSF avec les données vérifiées, via les canaux sécurisés prévus au SLA' },
    { icon:'🗂️', texte:'i-Hub archive ses rapports de vérification **pour sa propre protection** en cas de contrôle de la CSSF' },
    { icon:'⏰', texte:'La documentation doit être conservée **au moins 5 ans** après la fin de la relation avec le PSF concerné' },
  ], aretenir:'Documenter les indices détectés protège i-Hub. C’est la preuve de la diligence effectuée lors de la vérification.' },
  { id:20, emoji:'🎓', titre:'Résumé : le processus complet', contenu:[
    { icon:'1️⃣', texte:'**Recevoir** le dossier du client final transmis par le PSF' },
    { icon:'2️⃣', texte:'**Scanner** tous les documents à la recherche des 6 indices d’américanité (et des indices CRS si applicable)' },
    { icon:'3️⃣', texte:'**Documenter** chaque indice détecté : type, source, date' },
    { icon:'4️⃣', texte:'**Signaler** au PSF avec les données vérifiées et les red flags identifiés' },
    { icon:'5️⃣', texte:'**Archiver** le rapport de vérification pour la protection d’i-Hub' },
  ], aretenir:'Recevoir → Scanner → Documenter → Signaler → Archiver. i-Hub ne conclut jamais seul. Le PSF décide.' },
]

const FICHES_EN = [
  { id:1, emoji:'🔍', titre:'What is a US indicium?', contenu:[
    { icon:'🇺🇸', texte:'A **US indicium** is an element in the final client’s file that suggests a possible US nationality or residency' },
    { icon:'🔍', texte:'It does not prove the client is a US Person — it **requires the PSF to investigate further** before concluding' },
    { icon:'📌', texte:'FATCA defines **6 official indicia** — i-Hub must know them to detect them during documentary verifications' },
    { icon:'🛑', texte:'When i-Hub detects an indicium: it **flags to the PSF** — it is the PSF that seeks clarification from the final client' },
  ], aretenir:'An indicium = a signal to pass to the PSF. Not a conclusion. i-Hub never decides alone on a final client’s US status.' },
  { id:2, emoji:'1️⃣', titre:'Indicium #1: US place of birth', contenu:[
    { icon:'👶', texte:'A **US place of birth** on a passport or identity document is a major FATCA indicium' },
    { icon:'✅', texte:'How to detect: during verification of the passport or birth certificate transmitted by the PSF' },
    { icon:'⚠️', texte:'Note: someone born in the US who reinforced a foreign nationality remains a US Person unless they formally renounce' },
    { icon:'🚨', texte:'i-Hub action: **flag to the PSF** — final client completed W-8BEN but was born in Boston → contradiction to resolve by PSF' },
  ], aretenir:'Born in US + W-8BEN = immediate red flag. i-Hub flags to the PSF which requests clarification or W-9 from the final client.' },
  { id:3, emoji:'2️⃣', titre:'Indicium #2: US address', contenu:[
    { icon:'🏠', texte:'Any **US residential or mailing address** in the file is a FATCA indicium' },
    { icon:'📦', texte:'Includes **US PO Boxes** and “care of” addresses in the US' },
    { icon:'✅', texte:'How to detect: address in the KYC form, correspondence or documents transmitted by the PSF' },
    { icon:'🚨', texte:'i-Hub action: flag to PSF if a US address is visible in the file but absent from the tax documentation' },
  ], aretenir:'A US address in the final client’s file, even partial or secondary, is an indicium to flag to the PSF.' },
  { id:4, emoji:'3️⃣', titre:'Indicium #3: US phone number', contenu:[
    { icon:'📱', texte:'A **US phone number** (+1) associated with the final client’s account is a FATCA indicium' },
    { icon:'🔢', texte:'Common US codes: +1 followed by 10 digits (e.g. +1 212… for New York, +1 310… for Los Angeles)' },
    { icon:'✅', texte:'How to detect: in the contact information of the client file transmitted by the PSF' },
    { icon:'🚨', texte:'i-Hub action: flag if the US phone number is not mentioned in the final client’s tax documentation' },
  ], aretenir:'A +1 number in the final client file, not mentioned in tax forms = indicium to flag to PSF.' },
  { id:5, emoji:'4️⃣', titre:'Indicium #4: Standing transfer to the US', contenu:[
    { icon:'💸', texte:'A **standing transfer order** to a US bank account linked to the final client’s account is a FATCA indicium' },
    { icon:'🔍', texte:'This may indicate a strong economic link with the US (property, income, family)' },
    { icon:'✅', texte:'How to detect: in payment instructions or standing orders associated with the account' },
    { icon:'🚨', texte:'i-Hub action: flag to PSF if a standing transfer to a US IBAN/ABA is visible in the file' },
  ], aretenir:'A recurring transfer to the US may indicate an unidentified US Person. Flag to PSF for clarification.' },
  { id:6, emoji:'5️⃣', titre:'Indicium #5: Power of attorney to a US person', contenu:[
    { icon:'📝', texte:'A **power of attorney or signatory authority** granted to a person with a US address is a FATCA indicium' },
    { icon:'🤔', texte:'Logic: if someone you trust to manage your finances lives in the US, you may have US ties' },
    { icon:'✅', texte:'How to detect: in power of attorney documents transmitted to the PSF at onboarding' },
    { icon:'🚨', texte:'i-Hub action: flag to PSF if the attorney has a US address not mentioned in the tax documentation' },
  ], aretenir:'An attorney with a US address = indicium to flag. i-Hub does not judge — it informs the PSF which clarifies with the final client.' },
  { id:7, emoji:'6️⃣', titre:'Indicium #6: “Care of” or “hold mail” address', contenu:[
    { icon:'📨', texte:'A **“care of” or “hold mail” address** as the only address for the final client is a FATCA indicium' },
    { icon:'⚠️', texte:'Particularity: this indicium is stronger than others because the absence of a permanent address may hide a US residency' },
    { icon:'✅', texte:'How to detect: during verification of KYC documents transmitted by the PSF' },
    { icon:'🚨', texte:'i-Hub action: flag to PSF if “care of” or “hold mail” is the only available address without justification' },
  ], aretenir:'A c/o or hold mail address as the only address is a documentary anomaly and a FATCA indicium to flag immediately.' },
  { id:8, emoji:'📊', titre:'Summary table of the 6 indicia', contenu:[
    { icon:'1️⃣', texte:'**Place of birth** in the US on an identity document' },
    { icon:'2️⃣', texte:'**Residential or mailing address** in the US (including PO Box)' },
    { icon:'3️⃣', texte:'**US phone number** (+1) in the file' },
    { icon:'4️⃣', texte:'**Standing transfer** to a US bank account' },
    { icon:'5️⃣', texte:'**Power of attorney** granted to someone with a US address' },
    { icon:'6️⃣', texte:'**Care of or hold mail address** as the only available address' },
  ], aretenir:'These 6 indicia are defined by FATCA. As soon as one is visible in the file transmitted by the PSF, i-Hub flags it.' },
  { id:9, emoji:'🛑', titre:'An indicium ≠ certainty of US Person status', contenu:[
    { icon:'🤔', texte:'The presence of an indicium **does not automatically mean** the final client is a US Person' },
    { icon:'📝', texte:'Example: someone born in the US who formally renounced US citizenship can provide proof of renunciation' },
    { icon:'🔄', texte:'Example: a US address may belong to a temporary foreign resident with no fiscal US link' },
    { icon:'📌', texte:'It is **the PSF** that analyses the context and decides — i-Hub flags the indicium, not the conclusion' },
  ], aretenir:'Indicium ≠ conclusion. i-Hub detects and flags. The PSF seeks clarification from the final client and makes the final decision.' },
  { id:10, emoji:'⚠️', titre:'The contradiction: indicium vs form', contenu:[
    { icon:'🔴', texte:'Frequent case: final client completes a **W-8BEN** (non-US) but the passport shows a US birthplace' },
    { icon:'🔴', texte:'Another case: CRS self-certification states Luxembourg residency but a US address is visible in the file' },
    { icon:'📌', texte:'i-Hub rule: **any contradiction** between a tax form and a visible indicium must be flagged to the PSF' },
    { icon:'🚫', texte:'i-Hub does not accept an inconsistent form — it documents the contradiction and flags it, the PSF decides' },
  ], aretenir:'W-8BEN form + visible US indicium = immediate red flag. i-Hub flags the contradiction to the PSF and documents it.' },
  { id:11, emoji:'🇺🇸', titre:'US dual nationality', contenu:[
    { icon:'🇺🇸', texte:'A **dual national** (e.g. Franco-American) is a **US Person** even if they live in France and hold a French passport' },
    { icon:'📝', texte:'US nationality does not disappear with another nationality — only a formal **renunciation** (CLN) ends it' },
    { icon:'✅', texte:'How to detect: US birthplace on the French passport = indicium to flag even if the form is W-8BEN' },
    { icon:'🛑', texte:'i-Hub action: flag to PSF — the PSF will ask the final client whether they hold US nationality' },
  ], aretenir:'French passport with US birthplace = possible dual national = FATCA indicium to flag to the PSF.' },
  { id:12, emoji:'🟩', titre:'The Green Card: US permanent residency', contenu:[
    { icon:'🟩', texte:'A **Green Card** (US permanent resident card) makes its holder a **US Person** even if they live elsewhere' },
    { icon:'✅', texte:'How to detect: Green Card mentioned in KYC documents, historical US address, alien number' },
    { icon:'🔄', texte:'A Green Card may have expired or been surrendered — the final client must provide proof of surrender if so' },
    { icon:'🚨', texte:'i-Hub action: flag to PSF if a past or present Green Card is visible in the transmitted documents' },
  ], aretenir:'Green Card = automatic US Person. Even expired, it creates FATCA obligations unless proof of formal surrender is provided.' },
  { id:13, emoji:'📋', titre:'Documents where to look for indicia', contenu:[
    { icon:'🪪', texte:'**Passport and ID**: birthplace, nationality, possible US number' },
    { icon:'📜', texte:'**KYC form and onboarding questionnaire**: address, phone number, residence history' },
    { icon:'💸', texte:'**Payment instructions**: US IBAN/ABA in standing transfer orders' },
    { icon:'📝', texte:'**Power of attorney documents**: attorney’s address, US links' },
  ], aretenir:'Indicia hide in ordinary documents. i-Hub looks for them even when the tax form seems in order.' },
  { id:14, emoji:'🔄', titre:'What to do when an indicium is detected?', contenu:[
    { icon:'1️⃣', texte:'**Document**: note the indicium detected, its source (which document) and its nature (which type)' },
    { icon:'2️⃣', texte:'**Flag to the PSF**: transmit the verification report with the mention of the detected indicium' },
    { icon:'3️⃣', texte:'**Do not conclude**: i-Hub does not classify the final client as a US Person — this is the PSF’s responsibility' },
    { icon:'4️⃣', texte:'**Do not contact the final client**: i-Hub does not contact the final client directly unless specified in the SLA' },
  ], aretenir:'Detect → Document → Flag to PSF. Never conclude, never contact the final client directly.' },
  { id:15, emoji:'🤔', titre:'False positives: be methodical', contenu:[
    { icon:'📌', texte:'Not all indicia lead to a US Person — they trigger a verification, not a conclusion' },
    { icon:'📝', texte:'A final client may have a US address without a tax link (holiday property, billing address…)' },
    { icon:'🪪', texte:'A US birthplace may concern a child born during parents’ temporary stay — a documentable case' },
    { icon:'📎', texte:'In all cases: i-Hub flags and documents, the PSF obtains supporting documents from the final client and decides' },
  ], aretenir:'False positives exist. i-Hub flags every indicium without exception — the PSF has the context to decide with the final client.' },
  { id:16, emoji:'🚨', titre:'The golden rule: flag, do not conclude', contenu:[
    { icon:'✅', texte:'What i-Hub DOES: detect, document, flag the indicium to the PSF' },
    { icon:'❌', texte:'What i-Hub DOES NOT DO: classify the final client as a US Person' },
    { icon:'❌', texte:'What i-Hub DOES NOT DO: ignore an indicium even a “minor” one or outside the SLA scope' },
    { icon:'❌', texte:'What i-Hub DOES NOT DO: contact the final client for clarification (unless specific SLA provision)' },
  ], aretenir:'Golden rule: flag = PSF. Conclusion = PSF. Client contact = PSF. i-Hub detects and transmits, that is all.' },
  { id:17, emoji:'📜', titre:'Documents proving renunciation of US nationality', contenu:[
    { icon:'📋', texte:'A final client born in the US may have **renounced US citizenship** — in that case, FATCA no longer applies' },
    { icon:'🇺🇸', texte:'Proof of renunciation: the **CLN** (Certificate of Loss of Nationality) issued by the US embassy' },
    { icon:'🔍', texte:'i-Hub verifies the **presence and validity** of the CLN in the file if collected by the PSF — then transmits to PSF' },
    { icon:'🛑', texte:'Without a valid CLN, a client born in the US remains a US Person — even with a foreign passport for 40 years' },
  ], aretenir:'CLN = only valid proof of US nationality renunciation. i-Hub checks its presence in the file if provided by the PSF.' },
  { id:18, emoji:'🌍', titre:'CRS indicia: similar but different', contenu:[
    { icon:'🌍', texte:'For CRS: indicators of **foreign residency** (foreign address, foreign TIN, transfer abroad)' },
    { icon:'🇺🇸', texte:'For FATCA: the 6 **US indicia** (birth, address, phone, transfer, PoA, c/o)' },
    { icon:'🔄', texte:'The same document can contain FATCA **and** CRS indicia — i-Hub must check both' },
    { icon:'📌', texte:'In both cases: i-Hub flags to PSF which takes the necessary steps with its final client' },
  ], aretenir:'FATCA and CRS each have their own indicia. i-Hub knows all of them and flags every one to the PSF.' },
  { id:19, emoji:'📎', titre:'Documenting detected indicia', contenu:[
    { icon:'📝', texte:'i-Hub documents each detected indicium: type of indicium, source in the file, date of detection' },
    { icon:'📤', texte:'This report is transmitted to the PSF with the verified data, via secure channels per the SLA' },
    { icon:'🗂️', texte:'i-Hub archives its verification reports **for its own protection** in case of a CSSF audit' },
    { icon:'⏰', texte:'Documentation must be retained **at least 5 years** after the end of the relationship with the relevant PSF' },
  ], aretenir:'Documenting detected indicia protects i-Hub. It is the proof of diligence performed during verification.' },
  { id:20, emoji:'🎓', titre:'Summary: the complete process', contenu:[
    { icon:'1️⃣', texte:'**Receive** the final client’s file transmitted by the PSF' },
    { icon:'2️⃣', texte:'**Scan** all documents for the 6 US indicia (and CRS indicia if applicable)' },
    { icon:'3️⃣', texte:'**Document** each detected indicium: type, source, date' },
    { icon:'4️⃣', texte:'**Flag** to the PSF with verified data and identified red flags' },
    { icon:'5️⃣', texte:'**Archive** the verification report for i-Hub’s protection' },
  ], aretenir:'Receive → Scan → Document → Flag → Archive. i-Hub never concludes alone. The PSF decides.' },
]

const INDICIA_ITEMS_FR = [
  { texte: 'Lieu de naissance aux États-Unis', isIndice: true },
  { texte: 'Adresse de résidence aux USA', isIndice: true },
  { texte: 'Numéro de téléphone américain (+1)', isIndice: true },
  { texte: 'Virement permanent vers un compte américain', isIndice: true },
  { texte: 'Procuration donnée à une personne avec adresse US', isIndice: true },
  { texte: 'Adresse c/o ou hold mail comme seule adresse', isIndice: true },
  { texte: 'Nationalité française', isIndice: false },
  { texte: 'Compte en euros uniquement', isIndice: false },
  { texte: 'Client résident luxembourgeois', isIndice: false },
  { texte: 'Actionnaire principal de nationalité belge', isIndice: false },
  { texte: 'Passeport luxembourgeois valide', isIndice: false },
  { texte: 'Numéro de téléphone français (+33)', isIndice: false },
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
  { texte: 'Un seul indice d’américanité suffit pour que le PSF soit obligé de vérifier davantage', reponse: true, explication: 'Exact ! Un seul indice déclencheobligatoirement une vérification supplémentaire par le PSF.' },
  { texte: 'i-Hub peut classifier un client final comme US Person quand un indice est détecté', reponse: false, explication: 'Non ! i-Hub signale l’indice au PSF. C’est le PSF qui prend la décision de classification.' },
  { texte: 'Un lieu de naissance aux USA prouve que le client final est une US Person', reponse: false, explication: 'Non ! C’est un indice, pas une preuve. Le client peut avoir renoncé à la nationalité américaine (CLN).' },
  { texte: 'i-Hub doit documenter chaque indice détecté avant de le signaler au PSF', reponse: true, explication: 'Exact ! Documenter = se protéger. Le rapport de vérification prouve la diligence effectuée.' },
  { texte: 'Une adresse c/o est moins importante que les autres indices', reponse: false, explication: 'Non ! L’adresse c/o est même plus suspecte car l’absence d’adresse permanente peut masquer une résidence US.' },
  { texte: 'i-Hub peut contacter directement le client final pour clarifier un indice détecté', reponse: false, explication: 'Non (sauf SLA spécifique) ! i-Hub contacte le PSF qui lui-même contacte son client final.' },
  { texte: 'Un double national franco-américain est soumis à FATCA même s’il n’a jamais vécu aux USA', reponse: true, explication: 'Exact ! La nationalité américaine crée l’obligation FATCA, quelle que soit la résidence.' },
  { texte: 'Le CLN est le seul document acceptab pour prouver la renonciation à la nationalité US', reponse: true, explication: 'Exact ! Certificate of Loss of Nationality = seule preuve valide de renonciation formelle à la citoyenneté américaine.' },
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
  { situation: 'Vous vérifiez le passeport d’un client final : il est français, mais né à Chicago. Il a rempli un W-8BEN.', action: 'Signaler au PSF : contradiction indice n°1 vs W-8BEN', options: ['Accepter le W-8BEN — il est français', 'Signaler au PSF : contradiction indice n°1 vs W-8BEN', 'Remplacer le W-8BEN par un W-9', 'Ignorer — il a peut-être renoncé'], explication: 'Né à Chicago + W-8BEN = contradiction à signaler impérativement. Le PSF demandera un W-9 ou une preuve de renonciation (CLN).' },
  { situation: 'Dans le dossier KYC, le client final a un numéro de téléphone +1 415 (San Francisco) mais a fourni une autocertification CRS indiquant la Belgique comme résidence fiscale.', action: 'Signaler les deux : indice FATCA n°3 + possible incohérence CRS', options: ['Accepter — il peut avoir un téléphone US', 'Signaler les deux : indice FATCA n°3 + possible incohérence CRS', 'Ignorer — hors périmètre SLA', 'Modifier l’autocertification'], explication: 'Téléphone US = indice FATCA à signaler. L’incohérence avec la résidence belge mérite aussi d’être signalée. Le PSF clarifiera avec le client final.' },
  { situation: 'Le client final a fourni un W-9 (US Person). Vous n’avez détecté aucun autre indice.', action: 'Aucun red flag — transmettre les données vérifiées au PSF', options: ['Chercher d’autres indices à tout prix', 'Aucun red flag — transmettre les données vérifiées au PSF', 'Demander un W-8BEN en plus', 'Contacter l’IRS pour vérifier'], explication: 'W-9 fourni = client se déclare US Person. Pas d’indice contradictoire = pas de red flag. i-Hub transmet les données vérifiées au PSF.' },
  { situation: 'La seule adresse connue du client final est « c/o Me Dupont, 1 Rue de la Paix, Paris ». Il a rempli un W-8BEN.', action: 'Signaler indice n°6 (adresse c/o) au PSF', options: ['Accepter — c’est une adresse française', 'Signaler indice n°6 (adresse c/o) au PSF', 'Demander une adresse US en plus', 'Reclassifier comme US Person'], explication: 'Adresse c/o comme seule adresse = indice FATCA n°6 à signaler, même si l’adresse est française. Le PSF demandera une adresse permanente.' },
]
const CAS_EN = [
  { situation: 'You are verifying a final client’s passport: they are French but born in Chicago. They completed a W-8BEN.', action: 'Flag to PSF: contradiction between indicium #1 and W-8BEN', options: ['Accept the W-8BEN — they are French', 'Flag to PSF: contradiction between indicium #1 and W-8BEN', 'Replace W-8BEN with W-9', 'Ignore — they may have renounced'], explication: 'Born in Chicago + W-8BEN = contradiction to flag immediately. PSF will request a W-9 or proof of renunciation (CLN).' },
  { situation: 'In the KYC file, the final client has a +1 415 phone number (San Francisco) but provided a CRS self-certification stating Belgium as their tax residence.', action: 'Flag both: FATCA indicium #3 + possible CRS inconsistency', options: ['Accept — they may have a US phone', 'Flag both: FATCA indicium #3 + possible CRS inconsistency', 'Ignore — outside SLA scope', 'Amend the self-certification'], explication: 'US phone = FATCA indicium to flag. The inconsistency with Belgian residency also merits flagging. PSF will clarify with the final client.' },
  { situation: 'The final client provided a W-9 (US Person). You detected no other indicia.', action: 'No red flag — transmit verified data to the PSF', options: ['Keep looking for more indicia at all costs', 'No red flag — transmit verified data to the PSF', 'Request a W-8BEN as well', 'Contact the IRS to verify'], explication: 'W-9 provided = client self-declares as US Person. No contradictory indicium = no red flag. i-Hub transmits verified data to the PSF.' },
  { situation: 'The only known address for the final client is “c/o Mr Smith, 1 High Street, London”. They completed a W-8BEN.', action: 'Flag indicium #6 (c/o address) to the PSF', options: ['Accept — it is a UK address', 'Flag indicium #6 (c/o address) to the PSF', 'Request a US address as well', 'Reclassify as US Person'], explication: 'Care of address as the only address = FATCA indicium #6 to flag, even if the address is in the UK. PSF will request a permanent address.' },
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
      <button onClick={() => router.back()} style={{ background: 'none', border: `1px solid ${C}`, borderRadius: '8px', padding: '6px 12px', color: C, cursor: 'pointer', fontSize: '14px' }}>{t.home}</button>
      <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>🔍 {t.title}</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '2px', gap: '2px' }}>
          {(['fr', 'en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{ padding: '4px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: lang === l ? C : 'transparent', color: 'white' }}>{l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</button>)}
        </div>
        <span style={{ background: 'white', border: `1px solid ${C}`, borderRadius: '20px', padding: '4px 14px', fontSize: '13px', color: C, fontWeight: '600' }}>⭐ {score} {t.pts}</span>
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
        <div style={{ background: '#e5e7eb', height: '6px' }}><div style={{ background: C, height: '6px', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: '0 4px 4px 0' }} /></div>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>{lang === 'fr' ? 'FICHE' : 'CARD'} {ficheIndex + 1} / {FICHES.length}</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '220px' }}>
              {FICHES.map((_, i) => <div key={i} onClick={() => { setFicheIndex(i); setPlusLoinOpen(false) }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === ficheIndex ? C : i < ficheIndex ? C + '60' : '#d1d5db', cursor: 'pointer' }} />)}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', border: `2px solid ${C}30`, boxShadow: `0 8px 40px ${C}15` }}>
            <div style={{ background: C, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{fiche.emoji}</div>
              <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', margin: 0 }}>{fiche.titre}</h2>
            </div>
            <div style={{ padding: '20px' }}>
              {fiche.contenu.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < fiche.contenu.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <span style={{ fontSize: '22px', minWidth: '30px', textAlign: 'center' }}>{item.icon}</span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#374151' }} dangerouslySetInnerHTML={{ __html: item.texte.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C}">$1</strong>`) }} />
                </div>
              ))}
              <div style={{ background: `${C}10`, border: `1px solid ${C}30`, borderRadius: '12px', padding: '14px', marginTop: '14px', display: 'flex', gap: '10px' }}>
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
              {ficheIndex < FICHES.length - 1 ? `${t.next} (${ficheIndex + 2}/${FICHES.length}) →` : t.quizBtn}
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
            <span style={{ background: `${C}15`, color: C, borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>{t.q1label}</span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px' }}>{t.q1title}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{t.q1sub}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {activeIndicia.map((item, i) => {
              const answered = indiciaAnswers[i] !== undefined
              const correct = indiciaSubmitted && indiciaAnswers[i] === item.isIndice
              const wrong = indiciaSubmitted && indiciaAnswers[i] !== item.isIndice
              return (
                <div key={i} style={{ background: indiciaSubmitted ? (correct ? '#f0fdf4' : '#fff1f1') : 'white', borderRadius: '12px', padding: '14px 16px', border: `1.5px solid ${indiciaSubmitted ? (correct ? '#6ee7b7' : '#fca5a5') : '#e5e7eb'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              {lang === 'fr' ? `Valider (${Object.keys(indiciaAnswers).length}/${activeIndicia.length})` : `Validate (${Object.keys(indiciaAnswers).length}/${activeIndicia.length})`}
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
          <div style={{ background: C, height: '6px', width: `${(vfIndex / activeVF.length) * 100}%`, transition: 'width 0.4s' }} />
        </div>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <span style={{ background: `${C}15`, color: C, borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '20px' }}>{t.q2label} — {vfIndex + 1}/{activeVF.length}</span>
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
            <div style={{ background: vfAnimation === 'correct' ? '#d1fae5' : '#fee2e2', border: `2px solid ${vfAnimation === 'correct' ? '#6ee7b7' : '#fca5a5'}`, borderRadius: '16px', padding: '20px' }}>
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
        <div style={{ background: '#e5e7eb', height: '6px' }}><div style={{ background: C, height: '6px', width: `${(casIndex / activeCas.length) * 100}%` }} /></div>
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ background: `${C}15`, color: C, borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '12px' }}>{t.q3label} — {casIndex + 1}/{activeCas.length}</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', margin: '0 0 6px' }}>{t.q3title}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{t.q3sub}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: `2px solid ${C}30`, marginBottom: '20px' }}>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151', lineHeight: 1.6, margin: 0 }}>📋 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cas.options.map((opt, i) => (
                <button key={i} onClick={() => repCas(opt)} style={{ padding: '14px 18px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = C; (e.currentTarget as HTMLElement).style.background = `${C}08` }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.background = 'white' }}>
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {cas.options.map((opt, i) => { const isC = opt === cas.action, isCh = opt === casRepondu; return (<div key={i} style={{ padding: '12px 16px', background: isC ? '#d1fae5' : isCh ? '#fee2e2' : 'white', border: `1.5px solid ${isC ? '#6ee7b7' : isCh ? '#fca5a5' : '#e5e7eb'}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: isC ? '#059669' : isCh ? '#ef4444' : '#9ca3af' }}>{isC ? '✅ ' : isCh ? '❌ ' : ''}{opt}</div>) })}
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
            <div style={{ background: `linear-gradient(90deg,${C},#f59e0b)`, height: '10px', width: `${total}%`, borderRadius: '8px' }} />
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
