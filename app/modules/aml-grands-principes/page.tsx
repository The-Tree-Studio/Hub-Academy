'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#e91e8c'

const UI = {
  fr: {
    title: 'AML/CTF — Les grands principes',
    subtitle: 'Comprendre le cadre anti-blanchiment et financement du terrorisme',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Les 3 étapes du blanchiment d’argent',
      'Les obligations AML/CTF des PSF luxembourgeois',
      'Le rôle de la CSSF et des autorités compétentes',
      'La notion de vigilance proportionnée',
      'Les 4 règles d’or d’i-Hub en matière AML',
      'Ce qu’i-Hub fait et ne fait pas dans le cadre AML',
    ],
    fiches: '19 fiches', time: '∼15 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    toRetain: 'À RETENIR', goFurther: '🔍 Aller plus loin',
    home: '← Accueil',
    finTitle: 'Les 4 règles d’or i-Hub — AML/CTF',
    finSub: 'À retenir absolument avant de passer à la suite',
    backHome: '← Retour aux modules', restart: '🔄 Recommencer',
  },
  en: {
    title: 'AML/CTF — Core Principles',
    subtitle: 'Understanding the anti-money laundering and counter-terrorism financing framework',
    learn: '📚 What you will learn:',
    learnItems: [
      'The 3 stages of money laundering',
      'AML/CTF obligations of Luxembourg PSFs',
      'The role of the CSSF and competent authorities',
      'The concept of proportionate vigilance',
      'i-Hub’s 4 golden rules for AML',
      'What i-Hub does and does not do in the AML framework',
    ],
    fiches: '19 cards', time: '∼15 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    toRetain: 'KEY TAKEAWAY', goFurther: '🔍 Go further',
    home: '← Home',
    finTitle: 'i-Hub’s 4 Golden Rules — AML/CTF',
    finSub: 'Essential takeaways before moving on',
    backHome: '← Back to modules', restart: '🔄 Restart',
  },
}

const FICHES_FR = [
  { id:1, emoji:'💰', titre:'C’est quoi le blanchiment d’argent ?', contenu:[
    { icon:'💰', texte:'Le **blanchiment d’argent** est le processus qui consiste à dissimuler l’origine illégale de fonds en les faisant passer pour légitimes' },
    { icon:'🚨', texte:'Les fonds proviennent d’activités criminelles : trafic de drogues, corruption, fraude fiscale, crime organisé…' },
    { icon:'🌍', texte:'Le système financier mondial est utilisé comme vecteur — c’est pourquoi les PSF sont en première ligne' },
    { icon:'📊', texte:'Estimation mondiale : entre **2 et 5% du PIB mondial** blanchis chaque année, soit 800 milliards à 2 000 milliards de dollars' },
  ], aretenir:'Le blanchiment transforme de l’argent sale en argent propre via le système financier. Les PSF sont des cibles et des vecteurs potentiels.' },

  { id:2, emoji:'🔄', titre:'Les 3 étapes du blanchiment', contenu:[
    { icon:'1️⃣', texte:'**Placement** (Placement) : introduction des fonds illégaux dans le système financier — la phase la plus risquée pour le criminel' },
    { icon:'2️⃣', texte:'**Empilage** (Layering) : multiplication des transactions pour brouiller les pistes — virements internationaux, conversions, sociétés écrans' },
    { icon:'3️⃣', texte:'**Intégration** (Integration) : réintroduction des fonds dans l’économie légale — immobilier, investissements, activités commerciales' },
    { icon:'🔍', texte:'i-Hub intervient principalement au stade du **placement et de l’empilage** — en vérifiant la cohérence documentaire des dossiers' },
  ], aretenir:'3 étapes : Placement → Empilage → Intégration. Les PSF sont exposés à toutes les étapes. i-Hub aide à détecter les incohérences au stade documentaire.' },

  { id:3, emoji:'💣', titre:'Le financement du terrorisme (CTF)', contenu:[
    { icon:'💣', texte:'Le **financement du terrorisme** (CTF = Counter-Terrorism Financing) est distinct du blanchiment : les fonds peuvent être d’origine légale' },
    { icon:'🔍', texte:'Ce qui compte : la **destination** des fonds (financer des actes terroristes) et non leur origine' },
    { icon:'⚠️', texte:'De petits montants peuvent avoir un impact énorme — la surveillance des transactions inhabituelles est cruciale' },
    { icon:'📜', texte:'Le CTF est régi par les mêmes lois que l’AML au Luxembourg — loi du 12 novembre 2004 modifiée' },
  ], aretenir:'AML = détecter l’argent sale. CTF = détecter le financement d’actes terroristes. Les deux sont couverts par les mêmes obligations légales.' },

  { id:4, emoji:'🇱🇺', titre:'Le cadre légal luxembourgeois', contenu:[
    { icon:'📜', texte:'**Loi du 12 novembre 2004** relative à la lutte contre le blanchiment et le financement du terrorisme — transposition des directives européennes' },
    { icon:'🇪🇺', texte:'**5ème directive anti-blanchiment** de l’UE (AMLD5) transposée au Luxembourg en 2020 — renforcement de la transparence des UBO' },
    { icon:'🏦', texte:'**CSSF** (Commission de Surveillance du Secteur Financier) : autorité de contrôle principale des PSF pour l’AML/CTF' },
    { icon:'📌', texte:'**GAFI** (Groupe d’Action Financière) : organisation internationale qui fixe les standards mondiaux — les 40 recommandations GAFI' },
  ], aretenir:'Cadre légal : loi 2004 + directives UE + recommandations GAFI. La CSSF contrôle les PSF. i-Hub, sous-traitant, opère dans ce cadre sur instruction du PSF.' },

  { id:5, emoji:'🏦', titre:'Les obligations des PSF luxembourgeois', contenu:[
    { icon:'👤', texte:'**KYC** (Know Your Customer) : identifier et vérifier l’identité du client final avant d’entrer en relation' },
    { icon:'👥', texte:'**UBO** : identifier le bénéficiaire effectif final (pers. physique détenant > 25% ou exerçant le contrôle)' },
    { icon:'📊', texte:'**Scoring de risque** : évaluer le niveau de risque AML de chaque client final (faible, moyen, élevé)' },
    { icon:'🚨', texte:'**Déclaration de soupçon (STR)** : déclarer à la CRF (Cellule de Renseignement Financier) tout soupçon de blanchiment' },
  ], aretenir:'Les PSF ont 4 obligations principales : KYC, UBO, scoring de risque, déclaration de soupçon. i-Hub peut intervenir sur le KYC/UBO sur instruction du SLA.' },

  { id:6, emoji:'🔍', titre:'La vigilance proportionnée', contenu:[
    { icon:'🟢', texte:'**Vigilance simplifiée** : pour les clients finaux à faible risque (institutionnels européens, entités cotées…) — contrôles réduits' },
    { icon:'🟡', texte:'**Vigilance standard** : pour la majorité des clients finaux — KYC complet, vérification des documents d’identité' },
    { icon:'🔴', texte:'**Vigilance renforcée** : pour les clients à risque élevé (PPE, pays à risque, structures complexes, transactions inhabituelles)' },
    { icon:'📜', texte:'Le niveau de vigilance est déterminé par le **PSF** — i-Hub adapte ses vérifications documentaires selon le niveau indiqué dans le SLA' },
  ], aretenir:'Vigilance = proportionnée au risque. C’est le PSF qui fixe le niveau. i-Hub applique les contrôles correspondants prévus dans le SLA.' },

  { id:7, emoji:'👥', titre:'Les Personnes Politiquement Exposées (PPE)', contenu:[
    { icon:'👥', texte:'Une **PPE** est une personne occupant ou ayant occupé une fonction publique importante : chef d’État, ministre, juge, dirigeant d’entreprise étatique…' },
    { icon:'👨‍👩‍👧', texte:'Les **membres de la famille** et les **pers. liées** à une PPE sont également considérés comme PPE' },
    { icon:'🔴', texte:'Une PPE = **vigilance renforcée automatique** — pas d’exception' },
    { icon:'🔍', texte:'i-Hub signale toute PPE détectée dans les documents transmis par le PSF — le PSF décide du niveau de vigilance à appliquer' },
  ], aretenir:'PPE = vigilance renforcée automatique. i-Hub détecte et signale au PSF. Le PSF prend les décisions d’acceptation et de suivi.' },

  { id:8, emoji:'🌐', titre:'Les pays à risque', contenu:[
    { icon:'📋', texte:'Certains pays présentent un risque AML/CTF élevé : **liste GAFI** (pays à haut risque et sous surveillance) + liste UE' },
    { icon:'🔴', texte:'Tout client final lié à un pays à risque (résidence, nationalité, source des fonds) = **vigilance renforcée** par le PSF' },
    { icon:'🔄', texte:'Les listes sont mises à jour régulièrement — un pays peut entrer ou sortir de la liste' },
    { icon:'🔍', texte:'i-Hub vérifie la nationalité et la résidence dans les documents — et signale au PSF si un pays à risque est détecté' },
  ], aretenir:'Pays GAFI à risque = vigilance renforcée automatique pour le PSF. i-Hub détecte le lien au pays dans les documents et signale.' },

  { id:9, emoji:'💵', titre:'La source des fonds et la source du patrimoine', contenu:[
    { icon:'💵', texte:'**Source des fonds** (SOF = Source of Funds) : d’où vient l’argent déposé spécifiquement ? (salaire, dividendes, vente immobilière…)' },
    { icon:'🏠', texte:'**Source du patrimoine** (SOW = Source of Wealth) : comment le client final a-t-il constitué l’ensemble de son patrimoine ?' },
    { icon:'🔴', texte:'Ces informations sont cruciales en vigilance renforcée — exigées pour toutes les PPE et pays à risque' },
    { icon:'🔍', texte:'i-Hub vérifie la **présence** des justificatifs SOF/SOW dans le dossier si le PSF le prévoit dans le SLA — pas leur exactitude' },
  ], aretenir:'SOF = d’où vient cet argent. SOW = d’où vient tout le patrimoine. i-Hub vérifie la présence des justificatifs, pas leur véracité.' },

  { id:10, emoji:'🔵', titre:'La CRF : Cellule de Renseignement Financier', contenu:[
    { icon:'🔵', texte:'La **CRF** (Cellule de Renseignement Financier) est l’autorité luxembourgeoise qui reçoit les déclarations de soupçon (STR)' },
    { icon:'📤', texte:'Les **PSF** sont tenus de déclarer tout soupçon de blanchiment ou de financement du terrorisme à la CRF' },
    { icon:'🛑', texte:'Le PSF ne peut pas informer le client final qu’une STR a été faite (**interdiction de divulgation** — tipping off)' },
    { icon:'🔍', texte:'i-Hub n’a pas de relation directe avec la CRF — il signale les anomalies au PSF, c’est le PSF qui décide de la STR' },
  ], aretenir:'STR = déclaration de soupçon au CRF. C’est la responsabilité du PSF. i-Hub signale les anomalies au PSF, pas à la CRF.' },

  { id:11, emoji:'👤', titre:'Le KYC : Know Your Customer', contenu:[
    { icon:'👤', texte:'Le **KYC** (Connaissance du Client) est l’ensemble des mesures d’identification et de vérification d’un client final' },
    { icon:'📋', texte:'Documents standard : pièce d’identité, justificatif de domicile, informations professionnelles, source des fonds' },
    { icon:'🔄', texte:'Le KYC est un **processus continu** — les informations doivent être mises à jour régulièrement par le PSF' },
    { icon:'🔍', texte:'i-Hub peut être mandaté par le PSF pour vérifier la **cohérence** des documents KYC collectés — selon le SLA' },
  ], aretenir:'KYC = connaître et vérifier le client final. C’est une obligation continue du PSF. i-Hub vérifie la cohérence documentaire si prévu au SLA.' },

  { id:12, emoji:'📄', titre:'Les documents d’identité acceptables', contenu:[
    { icon:'🪪', texte:'**Passeport** : document d’identité de référence — acceptablé universellement, photo, MRZ (zone lisible par machine)' },
    { icon:'🇪🇺', texte:'**Carte d’identité européenne** : acceptée pour les ressortissants UE — recto + verso obligatoires' },
    { icon:'🚗', texte:'**Permis de conduire** : accepté dans certains contextes — souvent insuffisant seul pour un KYC bancaire complet' },
    { icon:'🔍', texte:'i-Hub vérifie : **non-expiré**, **lisible**, **photo visible**, **données cohérentes** avec le reste du dossier transmis par le PSF' },
  ], aretenir:'Passeport = référence. i-Hub vérifie non-expiré, lisible, cohérent. Toute anomalie visible dans le document = signal au PSF.' },

  { id:13, emoji:'📊', titre:'L’approche par les risques (RBA)', contenu:[
    { icon:'📊', texte:'La **RBA** (Risk-Based Approach) est le principe fondateur de l’AML moderne : adapter les contrôles au niveau de risque réel' },
    { icon:'🟢', texte:'Risque faible → contrôles légers. Risque élevé → contrôles renforcés. Ressources concentrées là où le risque est le plus élevé' },
    { icon:'🏦', texte:'Le **PSF** établit sa propre matrice de risque et fixe les seuils — i-Hub applique les niveaux de vérification prévus pour chaque risque dans le SLA' },
    { icon:'📌', texte:'La RBA est imposée par le GAFI et les directives européennes — les PSF qui ne l’appliquent pas s’exposent à des sanctions CSSF' },
  ], aretenir:'RBA = plus le risque est élevé, plus les contrôles sont rigoureux. Le PSF fixe les niveaux. i-Hub applique les contrôles correspondants du SLA.' },

  { id:14, emoji:'📈', titre:'Le monitoring continu', contenu:[
    { icon:'📈', texte:'L’AML ne s’arrête pas à l’entrée en relation — le PSF doit surveiller les **transactions en continu** tout au long de la relation' },
    { icon:'🚨', texte:'Signaux d’alerte : transactions inhabituelles, montants anormaux, changements soudains de comportement, opérations sans justification économique' },
    { icon:'🔄', texte:'Le **réexamen périodique** du dossier client final est obligatoire — fréquence déterminée par le niveau de risque' },
    { icon:'🔍', texte:'i-Hub peut être mandaté pour des vérifications documentaires périodiques — toujours sur instruction du PSF et dans le SLA' },
  ], aretenir:'L’AML est un processus continu, pas ponctuel. Le PSF surveille les transactions. i-Hub peut être mandaté pour les réexamens documentaires.' },

  { id:15, emoji:'🏛️', titre:'La responsabilité pénale en matière AML', contenu:[
    { icon:'⚖️', texte:'Le blanchiment d’argent est un **crime** au Luxembourg — passible de 1 à 5 ans de prison et/ou d’une amende' },
    { icon:'🏦', texte:'La **responsabilité pénale** peut être engagée contre la **personne physique** (employé du PSF) ET contre le **PSF** lui-même' },
    { icon:'🔵', texte:'Un employé d’i-Hub qui ignorerait volontairement un signal AML pourrait voir sa responsabilité personnelle engagée' },
    { icon:'🔍', texte:'C’est pourquoi **tout signal visible doit être signalé au PSF** — même s’il paraît anodin ou hors périmètre SLA' },
  ], aretenir:'AML = responsabilité pénale personnelle. Ignorer un signal visible peut engager la responsabilité de l’employé. Toujours signaler au PSF.' },

  { id:16, emoji:'🔍', titre:'Ce que i-Hub fait en matière AML', contenu:[
    { icon:'✅', texte:'**Vérifie** la cohérence et la complétude des documents KYC transmis par le PSF' },
    { icon:'✅', texte:'**Détecte** les anomalies visibles : document expiré, photo incohérente, indices de PPE ou de pays à risque' },
    { icon:'✅', texte:'**Signale** au PSF toute anomalie documentée — dans le périmètre du SLA ET hors périmètre si signal visible' },
    { icon:'✅', texte:'**Archive** les rapports de vérification pour sa propre protection et celle du PSF' },
  ], aretenir:'i-Hub vérifie, détecte, signale et archive. Toujours sur instruction du PSF. Dans le SLA — et au-delà si signal visible.' },

  { id:17, emoji:'❌', titre:'Ce que i-Hub NE fait PAS en matière AML', contenu:[
    { icon:'❌', texte:'i-Hub ne **décide pas** du niveau de risque d’un client final — c’est la responsabilité du PSF' },
    { icon:'❌', texte:'i-Hub ne **fait pas de STR** (déclaration de soupçon) — seul le PSF peut déclarer à la CRF' },
    { icon:'❌', texte:'i-Hub ne **bloque pas** de transactions ni de comptes — c’est le PSF qui prend les décisions opérationnelles' },
    { icon:'❌', texte:'i-Hub ne **contacte pas** le client final directement pour des questions AML — sauf disposition spécifique du SLA' },
  ], aretenir:'i-Hub ne décide pas, ne déclare pas, ne bloque pas, ne contacte pas. Il détecte et signale au PSF. Les décisions appartiennent au PSF.' },

    { id:18, emoji:'🔄', titre:'Deux dimensions : contractuel vs réglementaire', contenu:[
    { icon:'📜', texte:'Les modules de cette plateforme couvrent principalement les **obligations contractuelles** d’i-Hub : ce que i-Hub fait *pour* ses clients PSF et leurs clients finaux, dans le cadre des SLA signés' },
    { icon:'🏦', texte:'Mais i-Hub est aussi un **PSF de support agréé par la CSSF** : il a ses propres obligations réglementaires AML/CTF vis-à-vis de ses propres clients PSF, indépendamment de tout SLA' },
    { icon:'🔄', texte:'**Dimension 1 — Contractuelle** : ce que i-Hub fait *pour* le PSF et ses clients finaux (défini dans le SLA, varie selon les clients)' },
    { icon:'🏦', texte:'**Dimension 2 — Réglementaire** : ce que i-Hub fait *sur* ses propres clients PSF (imposé par la loi, s’applique à tous les clients sans exception)' },
  ], aretenir:'Tous les modules de la plateforme = obligations contractuelles. Un module dédié « AML/KYC — Nos clients PSF » couvre les obligations réglementaires d’i-Hub sur ses propres clients.' },

  { id:19, emoji:'🎓', titre:'Résumé : AML/CTF en 5 points', contenu:[
    { icon:'1️⃣', texte:'**AML/CTF** = lutter contre le blanchiment et le financement du terrorisme via des contrôles sur les clients finaux des PSF' },
    { icon:'2️⃣', texte:'**PSF** : obligations de KYC, UBO, scoring, déclaration de soupçon — responsabilité légale et pénale' },
    { icon:'3️⃣', texte:'**RBA** : contrôles proportionnés au risque — simplifiés, standards ou renforcés selon le profil du client final' },
    { icon:'4️⃣', texte:'**i-Hub** : vérifie la cohérence documentaire sur instruction du PSF, dans le cadre du SLA' },
    { icon:'5️⃣', texte:'**Tout signal visible** : signalé au PSF, même hors périmètre — jamais ignoré, jamais traité seul' },
  ], aretenir:'AML/CTF : le PSF est responsable, i-Hub est vérificateur sur instruction. Tout signal = PSF. Jamais de décision seul.' },
]

const FICHES_EN = [
  { id:1, emoji:'💰', titre:'What is money laundering?', contenu:[
    { icon:'💰', texte:'**Money laundering** is the process of concealing the illegal origin of funds by making them appear legitimate' },
    { icon:'🚨', texte:'Funds originate from criminal activities: drug trafficking, corruption, tax fraud, organised crime…' },
    { icon:'🌍', texte:'The global financial system is used as a vector — this is why PSFs are on the front line' },
    { icon:'📊', texte:'Global estimate: between **2 and 5% of world GDP** laundered annually, i.e. $800 billion to $2 trillion' },
  ], aretenir:'Money laundering turns dirty money into clean money via the financial system. PSFs are both targets and potential vectors.' },

  { id:2, emoji:'🔄', titre:'The 3 stages of money laundering', contenu:[
    { icon:'1️⃣', texte:'**Placement**: introducing illegal funds into the financial system — the riskiest phase for the criminal' },
    { icon:'2️⃣', texte:'**Layering**: multiplying transactions to obscure the trail — international transfers, conversions, shell companies' },
    { icon:'3️⃣', texte:'**Integration**: reintroducing funds into the legal economy — real estate, investments, commercial activities' },
    { icon:'🔍', texte:'i-Hub intervenes mainly at the **placement and layering** stages — by checking documentary consistency of files' },
  ], aretenir:'3 stages: Placement → Layering → Integration. PSFs are exposed at all stages. i-Hub helps detect inconsistencies at the documentary stage.' },

  { id:3, emoji:'💣', titre:'Terrorist financing (CTF)', contenu:[
    { icon:'💣', texte:'**Terrorist financing** (CTF) is distinct from money laundering: the funds may be of legal origin' },
    { icon:'🔍', texte:'What matters: the **destination** of the funds (financing terrorist acts), not their origin' },
    { icon:'⚠️', texte:'Small amounts can have a massive impact — monitoring unusual transactions is crucial' },
    { icon:'📜', texte:'CTF is governed by the same laws as AML in Luxembourg — Law of 12 November 2004 as amended' },
  ], aretenir:'AML = detecting dirty money. CTF = detecting terrorist financing. Both are covered by the same legal obligations.' },

  { id:4, emoji:'🇱🇺', titre:'The Luxembourg legal framework', contenu:[
    { icon:'📜', texte:'**Law of 12 November 2004** on combating money laundering and terrorist financing — transposition of EU directives' },
    { icon:'🇪🇺', texte:'**5th EU Anti-Money Laundering Directive** (AMLD5) transposed in Luxembourg in 2020 — enhanced UBO transparency' },
    { icon:'🏦', texte:'**CSSF** (Commission for the Supervision of the Financial Sector): main supervisory authority for PSFs on AML/CTF' },
    { icon:'📌', texte:'**FATF** (Financial Action Task Force): international body setting global standards — the 40 FATF Recommendations' },
  ], aretenir:'Legal framework: 2004 Law + EU directives + FATF recommendations. CSSF supervises PSFs. i-Hub, as subcontractor, operates within this framework on the PSF’s instruction.' },

  { id:5, emoji:'🏦', titre:'Luxembourg PSF obligations', contenu:[
    { icon:'👤', texte:'**KYC** (Know Your Customer): identify and verify the final client’s identity before entering into a relationship' },
    { icon:'👥', texte:'**UBO**: identify the ultimate beneficial owner (individual holding > 25% or exercising control)' },
    { icon:'📊', texte:'**Risk scoring**: assess the AML risk level of each final client (low, medium, high)' },
    { icon:'🚨', texte:'**STR** (Suspicious Transaction Report): report any suspicion of money laundering to the FIU (Financial Intelligence Unit)' },
  ], aretenir:'PSFs have 4 main obligations: KYC, UBO, risk scoring, STR. i-Hub may intervene on KYC/UBO on SLA instruction.' },

  { id:6, emoji:'🔍', titre:'Proportionate vigilance', contenu:[
    { icon:'🟢', texte:'**Simplified vigilance**: for low-risk final clients (European institutions, listed entities…) — reduced controls' },
    { icon:'🟡', texte:'**Standard vigilance**: for most final clients — full KYC, identity document verification' },
    { icon:'🔴', texte:'**Enhanced vigilance**: for high-risk clients (PEPs, high-risk countries, complex structures, unusual transactions)' },
    { icon:'📜', texte:'The vigilance level is set by the **PSF** — i-Hub adapts its documentary verifications to the level specified in the SLA' },
  ], aretenir:'Vigilance = proportionate to risk. The PSF sets the level. i-Hub applies the corresponding controls specified in the SLA.' },

  { id:7, emoji:'👥', titre:'Politically Exposed Persons (PEPs)', contenu:[
    { icon:'👥', texte:'A **PEP** is a person holding or having held a prominent public function: head of state, minister, judge, state enterprise director…' },
    { icon:'👨‍👩‍👧', texte:'**Family members** and **close associates** of a PEP are also considered PEPs' },
    { icon:'🔴', texte:'PEP = **automatic enhanced vigilance** — no exceptions' },
    { icon:'🔍', texte:'i-Hub flags any PEP detected in documents transmitted by the PSF — the PSF decides on the vigilance level to apply' },
  ], aretenir:'PEP = automatic enhanced vigilance. i-Hub detects and flags to PSF. The PSF makes acceptance and follow-up decisions.' },

  { id:8, emoji:'🌐', titre:'High-risk countries', contenu:[
    { icon:'📋', texte:'Some countries present a high AML/CTF risk: **FATF list** (high-risk and monitored jurisdictions) + EU list' },
    { icon:'🔴', texte:'Any final client linked to a high-risk country (residency, nationality, source of funds) = **enhanced vigilance** by PSF' },
    { icon:'🔄', texte:'Lists are updated regularly — a country may enter or leave the list' },
    { icon:'🔍', texte:'i-Hub checks nationality and residency in documents — and flags to PSF if a high-risk country is detected' },
  ], aretenir:'FATF high-risk country = automatic enhanced vigilance for PSF. i-Hub detects the country link in documents and flags.' },

  { id:9, emoji:'💵', titre:'Source of funds and source of wealth', contenu:[
    { icon:'💵', texte:'**Source of Funds (SOF)**: where does the specific deposited money come from? (salary, dividends, property sale…)' },
    { icon:'🏠', texte:'**Source of Wealth (SOW)**: how did the final client build their overall wealth?' },
    { icon:'🔴', texte:'This information is crucial in enhanced vigilance — required for all PEPs and high-risk countries' },
    { icon:'🔍', texte:'i-Hub verifies the **presence** of SOF/SOW supporting documents in the file if the PSF specifies this in the SLA — not their accuracy' },
  ], aretenir:'SOF = where this money comes from. SOW = where the overall wealth comes from. i-Hub checks presence of documents, not their veracity.' },

  { id:10, emoji:'🔵', titre:'The FIU: Financial Intelligence Unit', contenu:[
    { icon:'🔵', texte:'The **FIU** (Cellule de Renseignement Financier) is the Luxembourg authority that receives suspicious transaction reports (STRs)' },
    { icon:'📤', texte:'**PSFs** are required to report any suspicion of money laundering or terrorist financing to the FIU' },
    { icon:'🛑', texte:'The PSF cannot inform the final client that an STR has been filed (**tipping off prohibition**)' },
    { icon:'🔍', texte:'i-Hub has no direct relationship with the FIU — it flags anomalies to the PSF, and the PSF decides on the STR' },
  ], aretenir:'STR = suspicious transaction report to FIU. PSF’s responsibility. i-Hub flags anomalies to the PSF, not to the FIU.' },

  { id:11, emoji:'👤', titre:'KYC: Know Your Customer', contenu:[
    { icon:'👤', texte:'**KYC** is the set of measures for identifying and verifying a final client' },
    { icon:'📋', texte:'Standard documents: ID document, proof of address, professional information, source of funds' },
    { icon:'🔄', texte:'KYC is an **ongoing process** — information must be regularly updated by the PSF' },
    { icon:'🔍', texte:'i-Hub may be mandated by the PSF to verify the **consistency** of collected KYC documents — per the SLA' },
  ], aretenir:'KYC = know and verify the final client. It is an ongoing PSF obligation. i-Hub verifies documentary consistency if specified in the SLA.' },

  { id:12, emoji:'📄', titre:'Acceptable identity documents', contenu:[
    { icon:'🪪', texte:'**Passport**: reference identity document — universally accepted, photo, MRZ (machine readable zone)' },
    { icon:'🇪🇺', texte:'**European ID card**: accepted for EU nationals — front and back mandatory' },
    { icon:'🚗', texte:'**Driving licence**: accepted in some contexts — often insufficient alone for a full banking KYC' },
    { icon:'🔍', texte:'i-Hub verifies: **not expired**, **legible**, **photo visible**, **data consistent** with the rest of the file transmitted by PSF' },
  ], aretenir:'Passport = reference. i-Hub checks not expired, legible, consistent. Any visible anomaly = flag to PSF.' },

  { id:13, emoji:'📊', titre:'The Risk-Based Approach (RBA)', contenu:[
    { icon:'📊', texte:'The **RBA** is the founding principle of modern AML: adapt controls to the actual level of risk' },
    { icon:'🟢', texte:'Low risk → lighter controls. High risk → enhanced controls. Resources concentrated where risk is highest' },
    { icon:'🏦', texte:'The **PSF** establishes its own risk matrix and sets thresholds — i-Hub applies the verification levels per risk specified in the SLA' },
    { icon:'📌', texte:'The RBA is required by FATF and EU directives — PSFs that do not apply it face CSSF sanctions' },
  ], aretenir:'RBA = the higher the risk, the more rigorous the controls. The PSF sets the levels. i-Hub applies the corresponding SLA controls.' },

  { id:14, emoji:'📈', titre:'Ongoing monitoring', contenu:[
    { icon:'📈', texte:'AML does not stop at onboarding — the PSF must monitor **transactions on an ongoing basis** throughout the relationship' },
    { icon:'🚨', texte:'Alert signals: unusual transactions, abnormal amounts, sudden behavioural changes, operations without economic justification' },
    { icon:'🔄', texte:'**Periodic review** of the final client file is mandatory — frequency determined by risk level' },
    { icon:'🔍', texte:'i-Hub may be mandated for periodic documentary verifications — always on the PSF’s instruction and within the SLA' },
  ], aretenir:'AML is an ongoing process, not a one-off. The PSF monitors transactions. i-Hub may be mandated for periodic documentary reviews.' },

  { id:15, emoji:'🏛️', titre:'Criminal liability in AML', contenu:[
    { icon:'⚖️', texte:'Money laundering is a **crime** in Luxembourg — punishable by 1 to 5 years imprisonment and/or a fine' },
    { icon:'🏦', texte:'**Criminal liability** may be engaged against the **individual** (PSF employee) AND against the **PSF** itself' },
    { icon:'🔵', texte:'An i-Hub employee who wilfully ignores an AML signal could face personal criminal liability' },
    { icon:'🔍', texte:'This is why **all visible signals must be flagged to the PSF** — even if they seem minor or outside the SLA scope' },
  ], aretenir:'AML = personal criminal liability. Ignoring a visible signal may engage individual liability. Always flag to PSF.' },

  { id:16, emoji:'🔍', titre:'What i-Hub does in AML', contenu:[
    { icon:'✅', texte:'**Verifies** the consistency and completeness of KYC documents transmitted by the PSF' },
    { icon:'✅', texte:'**Detects** visible anomalies: expired document, inconsistent photo, PEP or high-risk country indicia' },
    { icon:'✅', texte:'**Flags** to the PSF any documented anomaly — within SLA scope AND beyond if a visible signal is detected' },
    { icon:'✅', texte:'**Archives** verification reports for its own protection and that of the PSF' },
  ], aretenir:'i-Hub verifies, detects, flags and archives. Always on the PSF’s instruction. Within the SLA — and beyond if a visible signal exists.' },

  { id:17, emoji:'❌', titre:'What i-Hub does NOT do in AML', contenu:[
    { icon:'❌', texte:'i-Hub does **not decide** on the risk level of a final client — that is the PSF’s responsibility' },
    { icon:'❌', texte:'i-Hub does **not file STRs** — only the PSF can report to the FIU' },
    { icon:'❌', texte:'i-Hub does **not block** transactions or accounts — the PSF makes operational decisions' },
    { icon:'❌', texte:'i-Hub does **not contact** the final client directly for AML matters — unless specifically provided in the SLA' },
  ], aretenir:'i-Hub does not decide, report, block or contact. It detects and flags to the PSF. Decisions belong to the PSF.' },

    { id:18, emoji:'🔄', titre:'Two dimensions: contractual vs regulatory', contenu:[
    { icon:'📜', texte:'The modules on this platform primarily cover i-Hub’s **contractual obligations**: what i-Hub does *for* its PSF clients and their final clients, within the SLA framework' },
    { icon:'🏦', texte:'But i-Hub is also a **CSSF-approved support PSF**: it has its own regulatory AML/CTF obligations towards its own PSF clients, independently of any SLA' },
    { icon:'🔄', texte:'**Dimension 1 — Contractual**: what i-Hub does *for* the PSF and its final clients (defined in the SLA, varies between clients)' },
    { icon:'🏦', texte:'**Dimension 2 — Regulatory**: what i-Hub does *regarding* its own PSF clients (imposed by law, applies to all clients without exception)' },
  ], aretenir:'All platform modules = contractual obligations. A dedicated module “AML/KYC — Our PSF clients” covers i-Hub’s regulatory obligations on its own clients.' },

  { id:19, emoji:'🎓', titre:'Summary: AML/CTF in 5 points', contenu:[
    { icon:'1️⃣', texte:'**AML/CTF** = combating money laundering and terrorist financing via controls on PSFs’ final clients' },
    { icon:'2️⃣', texte:'**PSF**: KYC, UBO, scoring, STR obligations — legal and criminal responsibility' },
    { icon:'3️⃣', texte:'**RBA**: controls proportionate to risk — simplified, standard or enhanced per final client profile' },
    { icon:'4️⃣', texte:'**i-Hub**: verifies documentary consistency on PSF instruction, within the SLA framework' },
    { icon:'5️⃣', texte:'**Any visible signal**: flagged to PSF, even outside scope — never ignored, never handled alone' },
  ], aretenir:'AML/CTF: PSF is responsible, i-Hub is verifier on instruction. Any signal = PSF. Never decide alone.' },
]

const REGLES_OR = {
  fr: [
    { icon:'🔍', titre:'1. Vérifier, pas décider', texte:'i-Hub vérifie la cohérence documentaire. C’est le PSF qui évalue le risque et prend les décisions.' },
    { icon:'📢', titre:'2. Signaler, pas gérer', texte:'Toute anomalie visible — même mineure, même hors SLA — est signalée au PSF. i-Hub ne gère pas les cas AML.' },
    { icon:'📎', titre:'3. Documenter tout', texte:'Chaque vérification est datée, archivée, traçable. C’est la protection d’i-Hub en cas de contrôle.' },
    { icon:'📜', titre:'4. Respecter le SLA', texte:'i-Hub agit sur instruction du PSF, dans le cadre du SLA. Tout point hors périmètre est clarifié avant d’agir.' },
  ],
  en: [
    { icon:'🔍', titre:'1. Verify, not decide', texte:'i-Hub verifies documentary consistency. It is the PSF that assesses risk and makes decisions.' },
    { icon:'📢', titre:'2. Flag, not manage', texte:'Any visible anomaly — even minor, even outside SLA — is flagged to the PSF. i-Hub does not manage AML cases.' },
    { icon:'📎', titre:'3. Document everything', texte:'Every verification is dated, archived, traceable. This is i-Hub’s protection in case of an audit.' },
    { icon:'📜', titre:'4. Respect the SLA', texte:'i-Hub acts on the PSF’s instruction, within the SLA framework. Anything outside scope is clarified before acting.' },
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
      <button onClick={() => router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${progress}%`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i) => <div key={i} onClick={() => {setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:`2px solid ${C}30`,boxShadow:`0 8px 40px ${C}15`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i) => (
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
            {ficheIndex > 0 && <button onClick={() => {setFicheIndex(i => i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={() => ficheIndex < FICHES.length-1 ? (setFicheIndex(i => i+1), setPlusLoinOpen(false)) : setPhase('fin')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex < FICHES.length-1 ? `${t.next} (${ficheIndex+2}/${FICHES.length}) →` : (lang==='fr'?'Terminer le module ✓':'Complete module ✓')}
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
            <div key={i} style={{background:'white',border:`2px solid ${C}30`,borderRadius:'16px',padding:'20px',display:'flex',gap:'16px',alignItems:'flex-start',textAlign:'left',boxShadow:`0 4px 20px ${C}10`}}>
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
