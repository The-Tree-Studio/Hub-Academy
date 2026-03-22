'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '#e91e8c'

const UI = {
  fr: {
    title: 'AML/KYC pour nos clients PSF',
    subtitle: 'Les obligations réglementaires d’i-Hub vis-à-vis de ses propres clients',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Pourquoi i-Hub a ses propres obligations AML/CTF réglementaires',
      'La différence entre obligations contractuelles et réglementaires',
      'Ce qu’i-Hub doit surveiller sur ses propres clients PSF',
      'Comment la plateforme unique crée un risque d’interférence',
      'Les contrôles AML que i-Hub applique à ses propres clients',
      'La vigilance à exercer lors de toute modification de la plateforme',
    ],
    fiches: '16 fiches', time: '∼15 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    toRetain: 'À RETENIR',
    home: '← Accueil',
    finTitle: 'Les 4 règles clés — AML/KYC de nos propres clients',
    finSub: 'À retenir absolument',
    backHome: '← Retour aux modules', restart: '🔄 Recommencer',
  },
  en: {
    title: 'AML/KYC for our PSF clients',
    subtitle: 'i-Hub’s own regulatory AML/CTF obligations towards its clients',
    learn: '📚 What you will learn:',
    learnItems: [
      'Why i-Hub has its own regulatory AML/CTF obligations',
      'The difference between contractual and regulatory obligations',
      'What i-Hub must monitor about its own PSF clients',
      'How the shared platform creates an interference risk',
      'The AML controls i-Hub applies to its own clients',
      'The vigilance required when modifying the platform',
    ],
    fiches: '16 cards', time: '∼15 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    toRetain: 'KEY TAKEAWAY',
    home: '← Home',
    finTitle: '4 Key Rules — AML/KYC of our own clients',
    finSub: 'Essential takeaways',
    backHome: '← Back to modules', restart: '🔄 Restart',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🏦', titre:'i-Hub a ses propres obligations AML — pas seulement contractuelles', contenu:[
    { icon:'📜', texte:'i-Hub est un **PSF de support** agréé par la CSSF — à ce titre, il est soumis aux mêmes obligations AML/CTF réglementaires que ses clients PSF' },
    { icon:'🔄', texte:'Double dimension : i-Hub gère les obligations **contractuelles** envers ses clients (SLA) ET ses propres obligations **réglementaires** envers la CSSF' },
    { icon:'⚠️', texte:'Ces deux dimensions sont indépendantes : même si un PSF client ne demande rien de spécifique dans son SLA, i-Hub a des obligations légales sur ses propres clients' },
    { icon:'🔍', texte:'Concrètement : i-Hub doit faire du KYC sur ses propres clients PSF, les screener, les surveiller — tout comme un PSF le fait pour ses clients finaux' },
  ], aretenir:'i-Hub = PSF de support soumis à la réglementation AML. Ses obligations vis-à-vis de ses propres clients PSF sont réglementaires, pas seulement contractuelles.' },

  { id:2, emoji:'🔄', titre:'Contractuel vs réglementaire : la différence essentielle', contenu:[
    { icon:'📜', texte:'**Obligation contractuelle** (SLA) : ce que i-Hub s’engage à faire pour son client PSF, défini dans le contrat — peut varier d’un client à l’autre' },
    { icon:'🏦', texte:'**Obligation réglementaire** (CSSF/loi 2004) : ce que i-Hub DOIT faire sur ses propres clients, imposé par la loi — s’applique à tous les clients sans exception' },
    { icon:'⚠️', texte:'Un client PSF peut demander zéro service AML dans son SLA — i-Hub doit quand même faire son propre KYC sur ce client et le monitorer' },
    { icon:'📌', texte:'La CSSF peut auditer i-Hub sur la qualité de sa surveillance de ses propres clients — indépendamment de ce que les SLA prévoient' },
  ], aretenir:'SLA = ce qu’on fait pour le client. Règlementation = ce qu’on fait sur le client. Les deux existent en parallèle et sont indépendants.' },

  { id:3, emoji:'👤', titre:'KYC de nos propres clients PSF', contenu:[
    { icon:'👤', texte:'i-Hub doit **identifier et vérifier** l’identité de chaque client PSF avant d’entrer en relation avec lui' },
    { icon:'📜', texte:'Documents à collecter : statuts de la société PSF, extrait de registre, identification des dirigeants, agrément CSSF (ou équivalent)' },
    { icon:'👤', texte:'Identification des **UBO** du PSF client : qui détient le PSF ? Qui exerce le contrôle réel ? Ces personnes physiques doivent être identifiées' },
    { icon:'💵', texte:'**Source des fonds** : comprendre d’où proviennent les honoraires et rémunérations que verse le PSF à i-Hub' },
  ], aretenir:'i-Hub fait du KYC sur ses propres clients PSF : statuts, dirigeants, UBO, agrément. Tout comme un PSF le fait pour ses propres clients finaux.' },

  { id:4, emoji:'📊', titre:'Scoring de risque de nos propres clients', contenu:[
    { icon:'📊', texte:'Chaque client PSF doit se voir attribuer un **niveau de risque AML** par i-Hub : faible, moyen, élevé' },
    { icon:'🔴', texte:'Facteurs augmentant le risque : PSF actif dans des juridictions à risque, clients finaux à risque élevé, structure actionnariale complexe, historique de problèmes AML' },
    { icon:'🔄', texte:'Le scoring est **révisé périodiquement** — un PSF qui change d’actionnaire ou qui étend ses activités peut voir son niveau de risque évoluer' },
    { icon:'🔍', texte:'Le niveau de risque d’un client PSF influence le niveau de surveillance que i-Hub exerce sur lui et la fréquence de révision du dossier' },
  ], aretenir:'i-Hub score ses clients PSF comme les PSF scorent leurs clients finaux. Risque élevé = surveillance accrue. Révision périodique obligatoire.' },

  { id:5, emoji:'🎯', titre:'Name Screening de nos propres clients', contenu:[
    { icon:'🎯', texte:'Les clients PSF et leurs dirigeants/UBO doivent être **screenés contre les listes de sanctions** (ONU, UE, OFAC) avant entrée en relation et en continu' },
    { icon:'🔄', texte:'Le screening continu est particulièrement important : un dirigeant d’un PSF client peut être sanctionné après la signature du contrat' },
    { icon:'🚨', texte:'Un match confirmé sur un client PSF = escalade immédiate à la direction d’i-Hub + possible STR à la CRF' },
    { icon:'📌', texte:'i-Hub ne peut pas continuer à travailler pour un PSF dont un dirigeant est sanctionné sans prendre de mesures immédiates' },
  ], aretenir:'Screening des clients PSF + leurs dirigeants + leurs UBO. Continu. Match = escalade direction i-Hub + possible STR. Pas de délai.' },

  { id:6, emoji:'📈', titre:'Surveillance des transactions et honoraires', contenu:[
    { icon:'📈', texte:'i-Hub doit surveiller les **mouvements financiers** de ses clients PSF : honoraires reçus, modalités de paiement, évolutions inhabituelles' },
    { icon:'⚠️', texte:'Signaux d’alerte : paiements en espèces ou cryptomonnaies non justifiés, virements depuis des pays à risque, montants très supérieurs aux contrats signés' },
    { icon:'💰', texte:'Un PSF client qui paie depuis un compte dans une juridiction à risque non mentionne dans le KYC initial = anomalie à signaler en interne' },
    { icon:'📎', texte:'Ces observations sont documentées dans le dossier AML du client PSF et font l’objet d’une revue périodique' },
  ], aretenir:'Surveiller les honoraires reçus des PSF clients : montant, provenance, modalités. Toute anomalie documétée et examinée.' },

  { id:7, emoji:'🔄', titre:'Révision périodique des dossiers clients PSF', contenu:[
    { icon:'🔄', texte:'Les dossiers KYC des clients PSF doivent être **révisés régulièrement** — fréquence selon le niveau de risque attribué' },
    { icon:'📅', texte:'Changements qui déclenchent une révision immédiate : changement de dirigeant, nouveau propriétaire du PSF, expansion vers de nouvelles activités ou juridictions' },
    { icon:'📝', texte:'La révision vérifie : documents toujours valides, dirigeants inchangés, screening à jour, profil de risque toujours adéquat' },
    { icon:'💼', texte:'Un PSF qui ne répond pas aux demandes de mise à jour de son dossier KYC = signal d’alerte potentiel' },
  ], aretenir:'Dossiers PSF clients = KYC vivants, pas statiques. Révision périodique obligatoire. Changement de dirigeant = révision immédiate.' },

  { id:8, emoji:'⚠️', titre:'La DDR pour nos clients PSF à risque élevé', contenu:[
    { icon:'🔴', texte:'Certains clients PSF nécessitent une **Due Diligence Renforcée** de la part d’i-Hub : PSF actif dans des pays à risque, structure actionnariale complexe, dirigeant PPE' },
    { icon:'📜', texte:'En DDR : documents supplémentaires sur les dirigeants, organigramme complet jusqu’aux UBO, justification de la source des fonds du PSF' },
    { icon:'🚨', texte:'Un PSF client dont un UBO est une PPE = DDR automatique pour i-Hub, indépendamment du niveau de service prévu dans le SLA' },
    { icon:'👏', texte:'Cette DDR est en plus des obligations contractuelles — elle peut conduire i-Hub à refuser ou à mettre fin à une relation client en cas de risque inacceptable' },
  ], aretenir:'DDR sur clients PSF à risque élevé : PPE, pays à risque, structures opaques. Indépendante du SLA. Peut aller jusqu’au refus de la relation.' },

  { id:9, emoji:'💻', titre:'La plateforme unique : une vigilance particulière', contenu:[
    { icon:'💻', texte:'La **même plateforme** gère à la fois : (1) les données des clients finaux des PSF que i-Hub traite, et (2) les données de surveillance AML des PSF clients eux-mêmes' },
    { icon:'⚠️', texte:'Risque spécifique : toute **modification de la plateforme** (mise à jour, nouvelle fonctionnalité, correction de bug) peut impacter les deux dimensions simultanément' },
    { icon:'🔍', texte:'Exemple : une modification d’un filtre de screening peut à la fois altérer les contrôles des clients finaux des PSF ET la surveillance des PSF eux-mêmes' },
    { icon:'🚨', texte:'Toute modification de la plateforme doit être **testée et validée** pour ses impacts sur les deux niveaux de surveillance avant mise en production' },
  ], aretenir:'Plateforme unique = double exposition. Modifier la plateforme peut impacter la surveillance réglementaire d’i-Hub sur ses propres clients. Tester les deux niveaux avant tout déploiement.' },

  { id:10, emoji:'🔧', titre:'Gestion des modifications de la plateforme', contenu:[
    { icon:'1️⃣', texte:'**Identifier l’impact double** : toute modification doit être évaluée pour son impact sur (a) les services fournis aux PSF et (b) la surveillance des PSF clients' },
    { icon:'2️⃣', texte:'**Tester les deux niveaux** : les tests de recette doivent couvrir les cas d’usage des clients finaux ET les cas de surveillance des PSF clients' },
    { icon:'3️⃣', texte:'**Documenter les changements** : toute modification est tracée avec son impact évalué sur la conformité AML des deux niveaux' },
    { icon:'4️⃣', texte:'**Alerter la Compliance** : tout doute sur l’impact d’une modification sur la surveillance réglementaire = escalade immédiate avant déploiement' },
  ], aretenir:'Modifier la plateforme = processus rigoureux. Double test. Documentation. Compliance alertée avant tout déploiement impactant la surveillance.' },

  { id:11, emoji:'👥', titre:'Les PPE parmi nos clients PSF', contenu:[
    { icon:'👥', texte:'Si un dirigeant ou un UBO d’un PSF client est une PPE, i-Hub doit appliquer une **DDR sur ce client** — pas seulement vérifier les documents transmis pour les clients finaux' },
    { icon:'🔄', texte:'La surveillance PPE est **continue** : un dirigeant devient PPE après la signature du contrat si nommer à une fonction politique — i-Hub doit le détecter' },
    { icon:'📰', texte:'Le monitoring des médias adverses sur les dirigeants de nos clients PSF est une obligation réglementaire d’i-Hub — pas seulement une option contractuelle' },
    { icon:'🚨', texte:'PPE détecté parmi nos clients : information immédiate de la direction d’i-Hub + déclenchement DDR + examen de la relation contractuelle' },
  ], aretenir:'PPE parmi nos clients = DDR immédiate. Monitoring continu des dirigeants des PSF clients. Obligation réglementaire d’i-Hub, pas optionnelle.' },

  { id:12, emoji:'🌍', titre:'Les PSF clients dans des pays à risque', contenu:[
    { icon:'🌍', texte:'Un PSF client dont le siège social, les actionnaires ou l’activité principale sont liés à un **pays à risque GAFI** nécessite une DDR de la part d’i-Hub' },
    { icon:'📌', texte:'Le fait que le PSF soit agréé par la CSSF ne dispense pas i-Hub de son propre KYC — l’agrément CSSF réduit le risque mais ne l’élimine pas' },
    { icon:'🔄', texte:'Un PSF agréé dont les actionnaires changent et intègrent des intérêts d’un pays à risque = mise à jour immédiate du dossier KYC + recalcul du risque' },
    { icon:'🔍', texte:'i-Hub surveille les évolutions de structure de ses clients PSF : changement de propriétaire = élément déclencheur d’une révision' },
  ], aretenir:'Agrément CSSF ≠ dispense de KYC. i-Hub surveille les évolutions de structure de ses clients. Nouveau propriétaire à risque = révision immédiate.' },

  { id:13, emoji:'🚨', titre:'La déclaration de soupçon (STR) sur un client PSF', contenu:[
    { icon:'🚨', texte:'Si i-Hub détecte un soupçon de blanchiment ou de financement du terrorisme chez un **client PSF**, il a l’obligation de déclarer à la CRF' },
    { icon:'🛑', texte:'L’**interdiction de divulgation (tipping off)** s’applique : i-Hub ne peut pas informer le PSF qu’une STR a été faite à son sujet' },
    { icon:'💼', texte:'Situation délicate : continuer à travailler pour un PSF sur lequel une STR a été déposée — procédure interne à suivre, direction i-Hub immédiatement impliquée' },
    { icon:'🔒', texte:'La STR est un acte grave et confidentiel — jamais discutée avec le client concerné, ni avec des collègues non habilités' },
  ], aretenir:'i-Hub peut faire une STR sur un de ses propres clients PSF. Tipping off interdit. Direction immédiatement impliquée. Strict secret.' },

  { id:14, emoji:'📎', titre:'Documentation et traçabilité de la surveillance', contenu:[
    { icon:'📎', texte:'Tout le processus KYC/AML d’i-Hub sur ses propres clients PSF doit être **documenté et archivé** : dossiers KYC, screenings, révisions, incidents' },
    { icon:'💼', texte:'La CSSF peut demander à auditer ces dossiers à tout moment — i-Hub doit pouvoir démontrer sa diligence réglementaire' },
    { icon:'📅', texte:'Conservation minimale : **5 ans** après la fin de la relation avec le PSF client' },
    { icon:'💻', texte:'Ces dossiers sont séparés des dossiers des clients finaux des PSF — deux niveaux distincts dans la plateforme' },
  ], aretenir:'Dossiers KYC/AML des clients PSF : archivés, auditables, séparés des clients finaux. 5 ans minimum après fin de relation.' },

  { id:15, emoji:'🔒', titre:'Séparation des niveaux sur la plateforme', contenu:[
    { icon:'🔒', texte:'La plateforme doit maintenir une **séparation claire** entre : (a) les données KYC des clients finaux des PSF et (b) les dossiers de surveillance AML des PSF clients eux-mêmes' },
    { icon:'🔍', texte:'Un employé travaillant sur le dossier d’un client final d’un PSF ne doit pas avoir accès automatique au dossier AML interne du PSF lui-même' },
    { icon:'⚠️', texte:'Toute modification de la séparation des niveaux (droits d’accès, segmentation des données) doit être validée par la Compliance et la direction' },
    { icon:'📅', texte:'Les audits CSSF peuvent vérifier cette séparation — une confusion entre les deux niveaux serait une défaillance grave' },
  ], aretenir:'Deux niveaux = deux espaces séparés sur la plateforme. La confusion entre clients finaux et clients PSF est une défaillance grave.' },

  { id:16, emoji:'🎓', titre:'Résumé : les obligations AML d’i-Hub sur ses propres clients', contenu:[
    { icon:'1️⃣', texte:'**KYC complet** sur chaque client PSF : statuts, dirigeants, UBO, agrément, scoring de risque' },
    { icon:'2️⃣', texte:'**Screening continu** des PSF clients et de leurs dirigeants/UBO contre les listes de sanctions' },
    { icon:'3️⃣', texte:'**Surveillance des mouvements financiers** (honoraires) et des évolutions de structure des PSF clients' },
    { icon:'4️⃣', texte:'**Plateforme unique** = risque d’interférence : toute modification doit être testée sur les deux niveaux avant déploiement' },
    { icon:'5️⃣', texte:'**STR possible** sur un client PSF si soupçon confirmé — direction i-Hub immédiatement impliquée, tipping off interdit' },
  ], aretenir:'i-Hub surveille ses clients PSF comme les PSF surveillent leurs clients finaux. Même règlementation, même rigueur, même traçabilité.' },
]

const FICHES_EN = [
  { id:1, emoji:'🏦', titre:'i-Hub has its own AML obligations — not just contractual', contenu:[
    { icon:'📜', texte:'i-Hub is a **support PSF** approved by the CSSF — as such, it is subject to the same regulatory AML/CTF obligations as its PSF clients' },
    { icon:'🔄', texte:'Dual dimension: i-Hub manages **contractual** obligations to its clients (SLA) AND its own **regulatory** obligations to the CSSF' },
    { icon:'⚠️', texte:'These two dimensions are independent: even if a PSF client requests nothing specific in its SLA, i-Hub has legal obligations regarding its own clients' },
    { icon:'🔍', texte:'In practice: i-Hub must perform KYC on its own PSF clients, screen them, monitor them — just as a PSF does for its final clients' },
  ], aretenir:'i-Hub = regulated support PSF. Its obligations towards its own PSF clients are regulatory, not just contractual.' },
  { id:2, emoji:'🔄', titre:'Contractual vs regulatory: the essential difference', contenu:[
    { icon:'📜', texte:'**Contractual obligation** (SLA): what i-Hub commits to do for its PSF client, defined in the contract — may vary between clients' },
    { icon:'🏦', texte:'**Regulatory obligation** (CSSF/2004 Law): what i-Hub MUST do regarding its own clients, imposed by law — applies to all clients without exception' },
    { icon:'⚠️', texte:'A PSF client may request zero AML services in its SLA — i-Hub must still perform its own KYC on that client and monitor it' },
    { icon:'📌', texte:'The CSSF can audit i-Hub on the quality of its surveillance of its own clients — independently of what the SLAs provide' },
  ], aretenir:'SLA = what we do for the client. Regulation = what we do regarding the client. Both exist in parallel and are independent.' },
  { id:3, emoji:'👤', titre:'KYC of our own PSF clients', contenu:[
    { icon:'👤', texte:'i-Hub must **identify and verify** the identity of each PSF client before entering into a relationship' },
    { icon:'📜', texte:'Documents to collect: PSF articles of association, register extract, director identification, CSSF licence (or equivalent)' },
    { icon:'👤', texte:'Identification of PSF client **UBOs**: who owns the PSF? Who exercises real control? These individuals must be identified' },
    { icon:'💵', texte:'**Source of funds**: understand where the fees and remuneration paid by the PSF to i-Hub come from' },
  ], aretenir:'i-Hub performs KYC on its own PSF clients: articles, directors, UBOs, licence. Just as a PSF does for its own final clients.' },
  { id:4, emoji:'📊', titre:'Risk scoring our own clients', contenu:[
    { icon:'📊', texte:'Each PSF client must be assigned an **AML risk level** by i-Hub: low, medium, high' },
    { icon:'🔴', texte:'Risk-increasing factors: PSF active in high-risk jurisdictions, high-risk final clients, complex ownership structure, AML history' },
    { icon:'🔄', texte:'Scoring is **periodically reviewed** — a PSF that changes shareholder or expands activities may see its risk level change' },
    { icon:'🔍', texte:'A PSF client’s risk level influences the level of monitoring i-Hub exercises and the file review frequency' },
  ], aretenir:'i-Hub scores its PSF clients as PSFs score their final clients. High risk = enhanced monitoring. Periodic review mandatory.' },
  { id:5, emoji:'🎯', titre:'Name Screening of our own clients', contenu:[
    { icon:'🎯', texte:'PSF clients and their directors/UBOs must be **screened against sanctions lists** (UN, EU, OFAC) before onboarding and on an ongoing basis' },
    { icon:'🔄', texte:'Ongoing screening is particularly important: a PSF client director may be sanctioned after the contract is signed' },
    { icon:'🚨', texte:'Confirmed match on a PSF client = immediate escalation to i-Hub management + possible STR to the FIU' },
    { icon:'📌', texte:'i-Hub cannot continue to work for a PSF whose director is sanctioned without taking immediate action' },
  ], aretenir:'Screen PSF clients + their directors + their UBOs. Ongoing. Match = escalate to i-Hub management + possible STR. No delay.' },
  { id:6, emoji:'📈', titre:'Transaction and fee monitoring', contenu:[
    { icon:'📈', texte:'i-Hub must monitor the **financial flows** of its PSF clients: fees received, payment methods, unusual changes' },
    { icon:'⚠️', texte:'Alert signals: unjustified cash or cryptocurrency payments, transfers from high-risk countries, amounts far exceeding signed contracts' },
    { icon:'💰', texte:'A PSF client paying from an account in a high-risk jurisdiction not mentioned in initial KYC = internal anomaly to flag' },
    { icon:'📎', texte:'These observations are documented in the PSF client’s AML file and subject to periodic review' },
  ], aretenir:'Monitor fees received from PSF clients: amount, origin, method. Any anomaly documented and reviewed.' },
  { id:7, emoji:'🔄', titre:'Periodic review of PSF client files', contenu:[
    { icon:'🔄', texte:'PSF clients’ KYC files must be **regularly reviewed** — frequency based on assigned risk level' },
    { icon:'📅', texte:'Changes triggering immediate review: change of director, new PSF owner, expansion into new activities or jurisdictions' },
    { icon:'📝', texte:'Review checks: documents still valid, directors unchanged, screening up to date, risk profile still adequate' },
    { icon:'💼', texte:'A PSF that does not respond to KYC update requests = potential alert signal' },
  ], aretenir:'PSF client files = living KYC, not static. Periodic review mandatory. Change of director = immediate review.' },
  { id:8, emoji:'⚠️', titre:'EDD for high-risk PSF clients', contenu:[
    { icon:'🔴', texte:'Some PSF clients require **Enhanced Due Diligence** from i-Hub: PSF active in high-risk countries, complex ownership, PEP director' },
    { icon:'📜', texte:'In EDD: additional documents on directors, full org chart down to UBOs, justification of the PSF’s source of funds' },
    { icon:'🚨', texte:'PSF client whose UBO is a PEP = automatic EDD for i-Hub, regardless of service level in the SLA' },
    { icon:'👏', texte:'This EDD is in addition to contractual obligations — it may lead i-Hub to refuse or terminate a client relationship in case of unacceptable risk' },
  ], aretenir:'EDD on high-risk PSF clients: PEP, high-risk countries, opaque structures. Independent of SLA. Can lead to refusal of relationship.' },
  { id:9, emoji:'💻', titre:'The shared platform: specific vigilance required', contenu:[
    { icon:'💻', texte:'The **same platform** manages: (1) final client data of PSFs that i-Hub processes, and (2) AML surveillance data of PSF clients themselves' },
    { icon:'⚠️', texte:'Specific risk: any **platform modification** (update, new feature, bug fix) may impact both dimensions simultaneously' },
    { icon:'🔍', texte:'Example: modifying a screening filter can both alter controls on PSFs’ final clients AND surveillance of the PSFs themselves' },
    { icon:'🚨', texte:'Any platform modification must be **tested and validated** for its impact on both surveillance levels before production deployment' },
  ], aretenir:'Shared platform = double exposure. Modifying the platform can impact i-Hub’s regulatory surveillance of its own clients. Test both levels before any deployment.' },
  { id:10, emoji:'🔧', titre:'Managing platform modifications', contenu:[
    { icon:'1️⃣', texte:'**Identify dual impact**: every modification must be assessed for impact on (a) services provided to PSFs and (b) surveillance of PSF clients' },
    { icon:'2️⃣', texte:'**Test both levels**: acceptance tests must cover final client use cases AND PSF client surveillance use cases' },
    { icon:'3️⃣', texte:'**Document changes**: every modification traced with assessed impact on AML compliance at both levels' },
    { icon:'4️⃣', texte:'**Alert Compliance**: any doubt about a modification’s impact on regulatory surveillance = immediate escalation before deployment' },
  ], aretenir:'Modifying the platform = rigorous process. Dual testing. Documentation. Compliance alerted before any deployment impacting surveillance.' },
  { id:11, emoji:'👥', titre:'PEPs among our PSF clients', contenu:[
    { icon:'👥', texte:'If a director or UBO of a PSF client is a PEP, i-Hub must apply **EDD on that client** — not just check documents transmitted for final clients' },
    { icon:'🔄', texte:'PEP monitoring is **ongoing**: a director becomes a PEP after contract signing if appointed to a political function — i-Hub must detect this' },
    { icon:'📰', texte:'Adverse media monitoring on our PSF clients’ directors is a regulatory obligation of i-Hub — not just a contractual option' },
    { icon:'🚨', texte:'PEP detected among our clients: immediate notification to i-Hub management + EDD triggered + review of contractual relationship' },
  ], aretenir:'PEP among our clients = immediate EDD. Ongoing monitoring of PSF client directors. Regulatory obligation of i-Hub, not optional.' },
  { id:12, emoji:'🌍', titre:'PSF clients in high-risk countries', contenu:[
    { icon:'🌍', texte:'A PSF client whose registered office, shareholders or main activity are linked to a **FATF high-risk country** requires EDD from i-Hub' },
    { icon:'📌', texte:'The fact that the PSF is approved by the CSSF does not exempt i-Hub from its own KYC — CSSF approval reduces risk but does not eliminate it' },
    { icon:'🔄', texte:'An approved PSF whose shareholders change and include interests from a high-risk country = immediate KYC file update + risk recalculation' },
    { icon:'🔍', texte:'i-Hub monitors structural changes of its PSF clients: change of owner = triggering event for a review' },
  ], aretenir:'CSSF approval ≠ exemption from KYC. i-Hub monitors structural changes of its clients. New high-risk owner = immediate review.' },
  { id:13, emoji:'🚨', titre:'Filing an STR on a PSF client', contenu:[
    { icon:'🚨', texte:'If i-Hub detects suspicion of money laundering or terrorist financing by a **PSF client**, it has an obligation to report to the FIU' },
    { icon:'🛑', texte:'The **tipping off prohibition** applies: i-Hub cannot inform the PSF that an STR has been filed regarding them' },
    { icon:'💼', texte:'Delicate situation: continuing to work for a PSF on which an STR has been filed — internal procedure to follow, i-Hub management immediately involved' },
    { icon:'🔒', texte:'An STR is a serious and confidential act — never discussed with the client concerned or with non-authorised colleagues' },
  ], aretenir:'i-Hub can file an STR on one of its own PSF clients. Tipping off prohibited. i-Hub management immediately involved. Strict secrecy.' },
  { id:14, emoji:'📎', titre:'Documentation and traceability of surveillance', contenu:[
    { icon:'📎', texte:'i-Hub’s entire KYC/AML process on its own PSF clients must be **documented and archived**: KYC files, screenings, reviews, incidents' },
    { icon:'💼', texte:'The CSSF can request to audit these files at any time — i-Hub must be able to demonstrate its regulatory diligence' },
    { icon:'📅', texte:'Minimum retention: **5 years** after the end of the relationship with the PSF client' },
    { icon:'💻', texte:'These files are separate from the final client files of PSFs — two distinct levels on the platform' },
  ], aretenir:'KYC/AML files of PSF clients: archived, auditable, separate from final clients. 5 years minimum after end of relationship.' },
  { id:15, emoji:'🔒', titre:'Level separation on the platform', contenu:[
    { icon:'🔒', texte:'The platform must maintain a **clear separation** between: (a) final client KYC data processed on behalf of PSFs and (b) AML surveillance files of PSF clients themselves' },
    { icon:'🔍', texte:'A staff member working on a PSF’s final client file should not automatically have access to the PSF’s own internal AML file' },
    { icon:'⚠️', texte:'Any modification to level separation (access rights, data segmentation) must be validated by Compliance and management' },
    { icon:'📅', texte:'CSSF audits can verify this separation — confusion between the two levels would be a serious failure' },
  ], aretenir:'Two levels = two separate spaces on the platform. Confusion between final clients and PSF clients is a serious failure.' },
  { id:16, emoji:'🎓', titre:'Summary: i-Hub’s AML obligations on its own clients', contenu:[
    { icon:'1️⃣', texte:'**Full KYC** on each PSF client: articles, directors, UBOs, licence, risk scoring' },
    { icon:'2️⃣', texte:'**Ongoing screening** of PSF clients and their directors/UBOs against sanctions lists' },
    { icon:'3️⃣', texte:'**Financial monitoring** (fees) and structural change surveillance of PSF clients' },
    { icon:'4️⃣', texte:'**Shared platform** = interference risk: any modification must be tested on both levels before deployment' },
    { icon:'5️⃣', texte:'**STR possible** on a PSF client if suspicion confirmed — i-Hub management immediately involved, tipping off prohibited' },
  ], aretenir:'i-Hub monitors its PSF clients as PSFs monitor their final clients. Same regulation, same rigour, same traceability.' },
]

const REGLES_OR = {
  fr: [
    { icon:'📜', titre:'1. Obligations réglementaires ≠ contractuelles', texte:'Le KYC/AML d’i-Hub sur ses propres clients PSF est imposé par la loi — pas par les SLA. Il s’applique à tous les clients sans exception.' },
    { icon:'💻', titre:'2. Plateforme unique = double vigilance', texte:'Toute modification de la plateforme doit être testée sur les deux niveaux (clients finaux ET surveillance des PSF clients) avant déploiement.' },
    { icon:'🔒', titre:'3. Séparation stricte des niveaux', texte:'Les données KYC des clients finaux et les dossiers de surveillance des PSF clients sont deux espaces séparés. Toute confusion = défaillance grave.' },
    { icon:'🚨', titre:'4. STR et escalade direction', texte:'Un soupçon sur un PSF client = escalade immédiate à la direction d’i-Hub. STR possible. Tipping off interdit. Strict secret.' },
  ],
  en: [
    { icon:'📜', titre:'1. Regulatory ≠ contractual obligations', texte:'i-Hub’s KYC/AML on its own PSF clients is imposed by law — not by SLAs. It applies to all clients without exception.' },
    { icon:'💻', titre:'2. Shared platform = dual vigilance', texte:'Any platform modification must be tested on both levels (final clients AND PSF client surveillance) before deployment.' },
    { icon:'🔒', titre:'3. Strict level separation', texte:'Final client KYC data and PSF client surveillance files are two separate spaces. Any confusion = serious failure.' },
    { icon:'🚨', titre:'4. STR and management escalation', texte:'Suspicion on a PSF client = immediate escalation to i-Hub management. STR possible. Tipping off prohibited. Strict secrecy.' },
  ],
}

export default function ModuleAMLKYCNosClients() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'fin'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN
  const regles = REGLES_OR[lang]

  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0) }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={() => router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'15px'}}>🏦 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
        {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={base}><NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🏦</div>
        <h1 style={{fontSize:'26px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:`${C}10`,border:`2px solid ${C}30`,borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
          <p style={{margin:'0 0 8px',fontWeight:'800',color:C,fontSize:'14px'}}>⚠️ {lang==='fr'?'MODULE SPÉCIFIQUE i-Hub':'i-Hub SPECIFIC MODULE'}</p>
          <p style={{margin:0,fontSize:'14px',color:'#374151'}}>{lang==='fr'?'Ce module traite des obligations réglementaires d'i-Hub en tant que PSF de support — pas des obligations envers les clients finaux des PSF.':'This module covers i-Hub's regulatory obligations as a support PSF — not obligations towards PSFs' final clients.'}</p>
        </div>
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
              {FICHES.map((_,i) => <div key={i} onClick={() => setFicheIndex(i)} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
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
            {ficheIndex > 0 && <button onClick={() => setFicheIndex(i => i-1)} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={() => ficheIndex < FICHES.length-1 ? setFicheIndex(i => i+1) : setPhase('fin')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
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
