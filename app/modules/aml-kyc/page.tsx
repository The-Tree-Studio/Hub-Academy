'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const UI = {
  fr: {
    title: 'AML/KYC Rules', subtitle: "Les obligations directes d'i-Hub envers ses clients",
    learn: '📚 Ce que vous allez apprendre :', learnItems: ['Le cadre légal luxembourgeois (loi 2004, GAFI, AMLD5)','CDD, EDD, SDD — les 3 niveaux de vigilance','UBO, PEP, risk scoring — les concepts clés','Comment constituer un dossier KYC complet',"Les signaux d'alerte et que faire en cas de doute","Le rôle de la CRF et de l'équipe Compliance d'i-Hub"],
    fiches:'21 fiches',quiz:'3 quiz fun',time:'~20 min',start:"C'est parti ! 🚀",prev:'← Précédent',next:'Fiche suivante',quizBtn:'🎮 Passer aux quiz !',toRetain:'À RETENIR',goFurther:'🔭 Aller plus loin',home:'← Accueil',pts:'🪙',
    quiz1title:'🧩 Reliez chaque sigle à sa définition',quiz1sub:"Cliquez d'abord sur un sigle, puis sur sa définition",quiz1label:'QUIZ 1/3 · ASSOCIER LES PAIRES',sigles:'Sigles',definitions:'Définitions',quiz1done:'Parfait ! Tous les sigles sont associés !',
    quiz2label:'QUIZ 2/3 · CONSTRUIRE LE DOSSIER',quiz2title:'🧱 Assemblez les éléments dans le bon ordre !',quiz2folder:'📁 Votre dossier',quiz2empty:'Cliquez sur les éléments ci-dessous dans le bon ordre...',quiz2available:'Éléments disponibles',quiz2done:'Parfait ! Dans le bon ordre !',
    quiz3label:'QUIZ 3/3 · VRAI OU FAUX',true:'✅ VRAI',false:'❌ FAUX',correct:'Bravo !',wrong:'Pas tout à fait...',next2:'Quiz suivant →',last:'Dernier quiz →',
    resultTitle:'Module AML/KYC terminé — 21 fiches maîtrisées !',backHome:'← Retour aux modules',restart:'🔄 Recommencer ce module',pts_gained:'points gagnés',medal_gold:'Expert AML/KYC !',medal_silver:'Bon résultat, continuez !',medal_bronze:'Relisez les fiches et réessayez !',score:'Score total',
  },
  en: {
    title: 'AML/KYC Rules', subtitle: "i-Hub's direct obligations towards its clients",
    learn: '📚 What you will learn:', learnItems: ['Luxembourg legal framework (2004 law, FATF, AMLD5)','CDD, EDD, SDD — the 3 levels of due diligence','UBO, PEP, risk scoring — key concepts','How to build a complete KYC file','Red flags and what to do when in doubt',"The role of the FIU and i-Hub's Compliance team"],
    fiches:'21 cards',quiz:'3 fun quizzes',time:'~20 min',start:"Let's go! 🚀",prev:'← Previous',next:'Next card',quizBtn:'🎮 Go to quizzes!',toRetain:'KEY TAKEAWAY',goFurther:'🔭 Go further',home:'← Home',pts:'🪙',
    quiz1title:'🧩 Match each acronym to its definition',quiz1sub:'Click an acronym first, then its definition',quiz1label:'QUIZ 1/3 · MATCH THE PAIRS',sigles:'Acronyms',definitions:'Definitions',quiz1done:'Perfect! All acronyms matched!',
    quiz2label:'QUIZ 2/3 · BUILD THE FILE',quiz2title:'🧱 Assemble the steps in the right order!',quiz2folder:'📁 Your file',quiz2empty:'Click on the items below in the correct order...',quiz2available:'Available items',quiz2done:'Perfect! Correct order!',
    quiz3label:'QUIZ 3/3 · TRUE OR FALSE',true:'✅ TRUE',false:'❌ FALSE',correct:'Well done!',wrong:'Not quite...',next2:'Next quiz →',last:'Last quiz →',
    resultTitle:'AML/KYC module complete — 21 cards mastered!',backHome:'← Back to modules',restart:'🔄 Restart this module',pts_gained:'points earned',medal_gold:'AML/KYC Expert!',medal_silver:'Good result, keep going!',medal_bronze:'Review the cards and try again!',score:'Total score',
  },
}

const FICHES_FR = [
  {id:1,emoji:'🔍',titre:"C'est quoi l'AML/KYC pour i-Hub ?",contenu:[{icon:'💰',texte:"**AML** = Anti-Money Laundering = Lutte contre le blanchiment d'argent et le financement du terrorisme (LBC/FT)"},{icon:'🪪',texte:"**KYC** = Know Your Customer = Connaître ses clients avant, pendant et après la relation d'affaires"},{icon:'🏢',texte:"i-Hub est un **PSF de support** (Professionnel du Secteur Financier) agréé par la CSSF au Luxembourg"},{icon:'⚖️',texte:"En tant que PSF de support, i-Hub est directement soumis à la **Loi du 12 novembre 2004** modifiée sur la LBC/FT"}],aretenir:"i-Hub n'est pas une banque, mais a des obligations AML/KYC directes et personnelles vis-à-vis de chacun de ses clients."},
  {id:2,emoji:'📜',titre:"Le cadre légal luxembourgeois",contenu:[{icon:'🇱🇺',texte:"**Loi du 12 novembre 2004** — loi fondamentale LBC/FT au Luxembourg, modifiée plusieurs fois depuis"},{icon:'🇪🇺',texte:"**Directive européenne AMLD5 (2018/843)** — transposée au Luxembourg, renforce la transparence sur les UBO"},{icon:'📋',texte:"**Règlement CSSF 12-02** — précise les obligations de vigilance pour les professionnels financiers"},{icon:'🌍',texte:"**Recommandations du GAFI** — 40 recommandations internationales sur la LBC/FT, adoptées par le Luxembourg"}],aretenir:"La loi de 2004 est la colonne vertébrale. Tout le reste (directives, règlements, circulaires CSSF) vient la compléter.",plusLoin:[{icon:'📅',texte:"**AMLD6 (2021)** — élargit les infractions sous-jacentes au blanchiment et renforce les sanctions pénales"},{icon:'🔭',texte:"**AMLD7 en cours** — prévoit la création d'une **Autorité européenne AML (AMLA)** basée à Francfort dès 2026"},{icon:'🇱🇺',texte:"**Règlement CSSF 20-05** — introduit les exigences de gouvernance interne spécifiques aux PSF"}]},
  {id:3,emoji:'🤝',titre:"Qui sont les clients d'i-Hub ?",contenu:[{icon:'🏛️',texte:"**Banques et établissements de crédit** — agréés par la BCE ou la CSSF, niveau de surveillance maximal"},{icon:'📊',texte:"**Fonds d'investissement** (OPCVM, FIA, SIF, RAIF) — vérification du gestionnaire et du dépositaire"},{icon:'🛡️',texte:"**Compagnies d'assurance** — soumises à la supervision du CAA (Commissariat aux Assurances)"},{icon:'💼',texte:"**Autres PSF** (PSF spécialisés, PSF de support) — eux aussi directement soumis à la loi LBC/FT"}],aretenir:"Tous les clients d'i-Hub sont des entités réglementées. Cela facilite le KYC mais ne le supprime pas !"},
  {id:4,emoji:'📋',titre:"Les 5 obligations fondamentales",contenu:[{icon:'1️⃣',texte:"**Identifier** le client et vérifier son identité (numéro RCS, extrait de registre, statuts)"},{icon:'2️⃣',texte:"**Identifier le bénéficiaire effectif** (UBO) — qui détient ou contrôle réellement le client ?"},{icon:'3️⃣',texte:"**Comprendre la relation d'affaires** — pourquoi ce client veut-il nos services ?"},{icon:'4️⃣',texte:"**Surveiller en continu** — mettre à jour le dossier si la situation change"},{icon:'5️⃣',texte:"**Déclarer** toute opération suspecte à la CRF Luxembourg"}],aretenir:"Ces 5 obligations s'appliquent AVANT de signer le contrat et pendant toute la durée de la relation."},
  {id:5,emoji:'🔬',titre:"La CDD — Customer Due Diligence",contenu:[{icon:'📌',texte:"**CDD** = Customer Due Diligence = mesures de vigilance standard appliquées à tous les clients sans exception"},{icon:'🧾',texte:"Comprend : vérification d'identité, collecte des documents, compréhension de l'activité du client"},{icon:'🔄',texte:"La CDD est un **processus continu** — pas seulement lors de l'entrée en relation, mais tout au long du contrat"},{icon:'📁',texte:"Tout doit être **documenté** et conservé pendant **10 ans** après la fin de la relation d'affaires"}],aretenir:"La CDD est le niveau de vigilance de base. Elle s'applique à TOUS les clients, même les plus simples."},
  {id:6,emoji:'📁',titre:"Le dossier KYC en pratique",contenu:[{icon:'📄',texte:"**Extrait de registre de commerce** (RCS) — document officiel de moins de 3 mois"},{icon:'📜',texte:"**Statuts coordonnés** de la société cliente — pour connaître l'objet social et les dirigeants"},{icon:'🪪',texte:"**Pièces d'identité** des dirigeants, administrateurs et UBO (détenant +25%)"},{icon:'🔐',texte:"**Copie de la licence CSSF ou CAA** du client — preuve qu'il est lui-même réglementé"},{icon:'📝',texte:"**Questionnaire AML** signé par le client — déclaration sur l'origine des fonds et l'activité"}],aretenir:"Pas de dossier KYC complet = pas de contrat. C'est une obligation légale, pas une formalité optionnelle."},
  {id:7,emoji:'👤',titre:"C'est quoi un UBO ?",contenu:[{icon:'🎯',texte:"**UBO** = Ultimate Beneficial Owner = Bénéficiaire Effectif Final — la personne physique qui, en dernier ressort, possède ou contrôle l'entité cliente"},{icon:'25%',texte:"Toute personne physique détenant **directement ou indirectement plus de 25%** des parts est considérée UBO"},{icon:'🏛️',texte:"Au Luxembourg, les UBO doivent être inscrits au **Registre des Bénéficiaires Effectifs (RBE)** — obligatoire depuis 2019"},{icon:'🔍',texte:"Si aucune personne ne dépasse 25%, on identifie la ou les personnes exerçant le **contrôle effectif** de fait"}],aretenir:"Identifier l'UBO permet de savoir QUI se cache vraiment derrière une société.",plusLoin:[{icon:'🏛️',texte:"Le **RBE luxembourgeois** est public depuis 2019 — toute société doit y inscrire ses UBO sous peine d'amende jusqu'à 1,25 million €"},{icon:'🔗',texte:"En cas de **chaîne de holdings complexe**, i-Hub doit remonter toute la chaîne jusqu'à la personne physique réelle"},{icon:'🤝',texte:"Si le client refuse d'identifier ses UBO sans justification, i-Hub doit **refuser la relation d'affaires**"}]},
  {id:8,emoji:'🏛️',titre:"C'est quoi un PEP ?",contenu:[{icon:'👑',texte:"**PEP** = Politically Exposed Person = Personne Politiquement Exposée exerçant ou ayant exercé une fonction publique importante"},{icon:'📋',texte:"Exemples : chefs d'État, ministres, parlementaires, juges de hautes cours, dirigeants de banques centrales"},{icon:'👨‍👩‍👧',texte:"Les **membres de la famille proche** et **associés étroits** d'un PEP sont aussi considérés PEP"},{icon:'⏰',texte:"Un PEP reste PEP pendant **au moins 12 mois** après avoir quitté ses fonctions"}],aretenir:"Un PEP n'est pas forcément suspect, mais son profil exige automatiquement des mesures de vigilance renforcées (EDD)."},
  {id:9,emoji:'⬆️',titre:"L'EDD — Enhanced Due Diligence",contenu:[{icon:'🔬',texte:"**EDD** = Enhanced Due Diligence = Vigilance renforcée, appliquée aux clients à **risque plus élevé**"},{icon:'🚩',texte:"Déclenchée pour : les PEP, clients de pays à risque GAFI, structures complexes, activités sensibles"},{icon:'📋',texte:"En pratique : informations supplémentaires sur l'origine des fonds, validation par la direction, surveillance accrue"},{icon:'✍️',texte:"L'EDD doit être **documentée et approuvée** par l'équipe Compliance d'i-Hub avant toute entrée en relation"}],aretenir:"L'EDD n'est pas un refus automatique — c'est une vigilance plus poussée. On peut accepter un PEP avec plus de contrôles."},
  {id:10,emoji:'⬇️',titre:"La SDD — Vigilance simplifiée",contenu:[{icon:'✅',texte:"**SDD** = Simplified Due Diligence = Vigilance allégée pour les clients à **risque faible démontré**"},{icon:'🏛️',texte:"Applicable aux organismes publics d'État, administrations ou entités cotées sur un marché réglementé UE"},{icon:'⚠️',texte:"La SDD ne signifie PAS l'absence totale de vigilance — on collecte quand même les documents de base"},{icon:'🔄',texte:"Si le niveau de risque évolue, on passe immédiatement à la CDD standard ou à l'EDD"}],aretenir:"La SDD est l'exception, pas la règle. Chez i-Hub, la grande majorité des clients relèvent de la CDD standard."},
  {id:11,emoji:'🌍',titre:"Les pays à risque — listes GAFI",contenu:[{icon:'🚨',texte:"**Liste noire GAFI** — pays sous appel à l'action, mesures renforcées obligatoires (ex: Iran, Corée du Nord, Myanmar)"},{icon:'🟡',texte:"**Liste grise GAFI** — pays sous surveillance accrue qui travaillent à améliorer leur dispositif AML"},{icon:'🇪🇺',texte:"**Liste noire UE** — pays tiers à haut risque identifiés par la Commission européenne, révisée régulièrement"},{icon:'🔄',texte:"Ces listes sont **mises à jour 3 fois par an** (février, juin, octobre)"}],aretenir:"Un client dont l'activité principale est dans un pays listé GAFI déclenche automatiquement l'EDD.",plusLoin:[{icon:'🌍',texte:"**Liste noire GAFI actuelle (2024)** : Iran, Corée du Nord, Myanmar — transactions quasi-impossibles"},{icon:'🟡',texte:"**Liste grise exemples** : Bulgarie, Cameroun, Croatie, Monaco, Namibie, Nigeria, Vietnam"},{icon:'📋',texte:"L'équipe Compliance d'i-Hub effectue une veille à chaque publication du GAFI"}]},
  {id:12,emoji:'📊',titre:"Le Risk Scoring d'un client",contenu:[{icon:'⚖️',texte:"Le **risk scoring** = attribuer une note de risque (faible / moyen / élevé) à chaque client selon des critères objectifs"},{icon:'📍',texte:"Critères évalués : pays d'origine, type d'entité, secteur d'activité, structure d'actionnariat, présence de PEP"},{icon:'🔢',texte:"Chez i-Hub, le scoring est formalisé dans une **matrice de risque** validée par l'équipe Compliance et mise à jour annuellement"},{icon:'📈',texte:"Le score détermine la vigilance : **faible → SDD**, **moyen → CDD standard**, **élevé → EDD**"}],aretenir:"Le risk scoring est un outil objectif pour calibrer la vigilance. Il protège i-Hub et garantit une approche proportionnée."},
  {id:13,emoji:'👁️',titre:"La surveillance continue",contenu:[{icon:'🔄',texte:"Le KYC n'est pas un exercice ponctuel — la relation d'affaires doit être **surveillée tout au long de sa durée**"},{icon:'📅',texte:"**Mise à jour annuelle** pour les clients à risque élevé, tous les **3 ans** pour les clients à risque standard"},{icon:'🚨',texte:"Mise à jour **immédiate** si : changement de dirigeant, de structure, d'actionnariat, d'activité"},{icon:'📰',texte:"**Surveillance des actualités négatives** (negative news) — presse, bases de données de sanctions"}],aretenir:"Un dossier KYC à jour est aussi important qu'un dossier initial complet."},
  {id:14,emoji:'🚩',titre:"Les signaux d'alerte (Red Flags)",contenu:[{icon:'🔴',texte:"**Structure opaque** : actionnariat complexe avec des holdings dans des pays peu coopératifs"},{icon:'🔴',texte:"**Refus de fournir des documents** ou d'identifier les UBO sans justification valable"},{icon:'🔴',texte:"**Origine des fonds inexpliquée** ou incohérente avec l'activité déclarée du client"},{icon:'🔴',texte:"**Présence sur des listes de sanctions** (OFAC, UE, ONU) ou liens avec des personnes sanctionnées"},{icon:'🔴',texte:"**Pression pour conclure rapidement** un contrat sans passer par les procédures normales de due diligence"}],aretenir:"L'accumulation de signaux doit alerter et déclencher une EDD ou un refus motivé.",plusLoin:[{icon:'💡',texte:"**Technique du 'smurfing'** — fragmenter les paiements en petits montants pour éviter les seuils de déclaration"},{icon:'🌐',texte:"**Pays non coopératifs** : filiales intermédiaires aux Îles Caïmans ou au Panama sans justification économique"},{icon:'📰',texte:"**Negative news** : une simple recherche sur le nom du client fait partie des bonnes pratiques de CDD"}]},
  {id:15,emoji:'🚨',titre:"Que faire en cas de doute ?",contenu:[{icon:'🛑',texte:"**Ne jamais agir seul** — tout doute doit être signalé à l'**équipe Compliance** d'i-Hub"},{icon:'📝',texte:"**Documenter tout** : questions posées, réponses reçues, documents collectés, décisions prises"},{icon:'🚫',texte:"**Ne pas informer le client** qu'une déclaration de soupçon est en cours — c'est le **tipping-off**, interdit par la loi"},{icon:'⏸️',texte:"En cas de doute sérieux, **suspendre la relation** jusqu'à la décision formelle de l'équipe Compliance"}],aretenir:"STOP — SIGNAL — DOCUMENTE. Ne jamais prendre seul une décision sur un cas sensible."},
  {id:16,emoji:'📢',titre:"La CRF Luxembourg",contenu:[{icon:'🏛️',texte:"**CRF** = Cellule de Renseignement Financier — autorité qui reçoit, analyse et traite les déclarations de soupçon"},{icon:'📨',texte:"Les déclarations se font via la plateforme sécurisée **goAML** — système en ligne géré par la CRF Luxembourg"},{icon:'🔐',texte:"La déclaration est **strictement confidentielle** — le client ne doit jamais savoir qu'un STR a été déposé"},{icon:'⚡',texte:"Après déclaration, la CRF peut **geler les avoirs**, enquêter ou transmettre au Parquet"}],aretenir:"Déclarer à la CRF est une obligation légale. L'absence de déclaration expose i-Hub à des sanctions pénales."},
  {id:17,emoji:'🤫',titre:"Secret professionnel vs obligation de déclarer",contenu:[{icon:'🔒',texte:"Les PSF sont soumis au **secret professionnel** — ils ne peuvent normalement pas divulguer les infos de leurs clients"},{icon:'⚖️',texte:"**Exception légale** : l'obligation de déclarer à la CRF **prime** sur le secret professionnel en cas de soupçon"},{icon:'🚫',texte:"Le **tipping-off** reste interdit même après la levée du secret professionnel"},{icon:'👨‍⚖️',texte:"Cette exception est prévue par la **loi du 12 novembre 2004** — le déclarant de bonne foi est protégé légalement"}],aretenir:"Déclarer à la CRF de bonne foi protège i-Hub légalement, même si le soupçon s'avère infondé."},
  {id:18,emoji:'❄️',titre:"Le gel des avoirs",contenu:[{icon:'🚫',texte:"Le **gel des avoirs** = bloquer immédiatement tout fonds lié à une personne ou entité figurant sur une liste de sanctions"},{icon:'📋',texte:"Listes à consulter : **ONU, UE (règlement 2580/2001), OFAC (USA)**, liste luxembourgeoise du Trésor"},{icon:'⚡',texte:"Le gel est **immédiat et automatique** dès qu'un nom apparaît sur une liste — sans attendre de décision judiciaire"},{icon:'📢',texte:"i-Hub doit **notifier la CRF et le Parquet** en cas de gel d'avoirs"}],aretenir:"Le gel s'applique même si la transaction est déjà en cours. On arrête tout et on appelle l'équipe Compliance.",plusLoin:[{icon:'🇺🇸',texte:"**OFAC (US)** — ses sanctions s'appliquent aux entités traitant en dollars ou avec des correspondants américains"},{icon:'⚡',texte:"**Faux positifs** : les outils de screening génèrent souvent des correspondances sur des noms communs — documenter chaque analyse"},{icon:'📋',texte:"Si un fournisseur ou client est nouvellement sanctionné, i-Hub a l'obligation de **résilier le contrat**"}]},
  {id:19,emoji:'⚠️',titre:"Les sanctions en cas de manquement",contenu:[{icon:'💶',texte:"**Amendes administratives** CSSF pouvant atteindre **5 millions d'euros** ou 10% du chiffre d'affaires annuel"},{icon:'📛',texte:"**Retrait de la licence PSF** — i-Hub ne pourrait plus exercer son activité au Luxembourg"},{icon:'⚖️',texte:"**Poursuites pénales** pour les dirigeants et employés impliqués — jusqu'à 5 ans d'emprisonnement"},{icon:'📰',texte:"**Publication publique** de la sanction sur le site de la CSSF — atteinte majeure à la réputation d'i-Hub"}],aretenir:"Les sanctions AML/KYC sont parmi les plus sévères du secteur financier. L'ignorance de la loi n'est jamais une excuse."},
  {id:20,emoji:'🔎',titre:"Le Name Screening sur les fournisseurs d'i-Hub",contenu:[{icon:'🏢',texte:"i-Hub doit faire du **name screening** non seulement sur ses clients, mais aussi sur ses **fournisseurs et prestataires**"},{icon:'📋',texte:"Tout fournisseur qui accède aux systèmes ou données d'i-Hub doit être **vérifié avant la signature du contrat**"},{icon:'🔍',texte:"Le screening consiste à comparer le nom du fournisseur contre les **listes de sanctions** (ONU, UE, OFAC) et bases PEP"},{icon:'🚨',texte:"Un fournisseur listé doit être **immédiatement bloqué** — aucune transaction, aucun paiement, aucun accès"},{icon:'🔄',texte:"Le screening est **continu** — une alerte peut surgir si un fournisseur existant est nouvellement sanctionné"}],aretenir:"Les obligations AML d'i-Hub ne s'arrêtent pas aux clients. Les fournisseurs font aussi partie du périmètre."},
  {id:21,emoji:'👨‍💼',titre:"Le rôle de l'équipe Compliance chez i-Hub",contenu:[{icon:'🎯',texte:"Le **Responsable Compliance** d'i-Hub est le référent AML, personnellement agréé par la CSSF"},{icon:'📋',texte:"Ses missions : définir la politique AML/KYC, valider les dossiers à risque, former les équipes, rédiger le rapport CSSF"},{icon:'🚨',texte:"En cas de doute ou red flag, **c'est lui que vous contactez** — il a l'autorité pour bloquer ou autoriser une relation"},{icon:'🤝',texte:"**Vous aussi, vous avez un rôle** — chaque employé d'i-Hub est un maillon de la chaîne AML"}],aretenir:"La conformité est l'affaire de tous — chaque employé est responsable de ce qu'il observe au quotidien."},
]

const FICHES_EN = [
  {id:1,emoji:'🔍',titre:"What is AML/KYC for i-Hub?",contenu:[{icon:'💰',texte:"**AML** = Anti-Money Laundering = fighting money laundering and terrorist financing (ML/TF)"},{icon:'🪪',texte:"**KYC** = Know Your Customer = identifying and verifying clients before, during and after the business relationship"},{icon:'🏢',texte:"i-Hub is a **support PSF** (Professional of the Financial Sector) licensed by the CSSF in Luxembourg"},{icon:'⚖️',texte:"As a support PSF, i-Hub is directly subject to the **Luxembourg Law of 12 November 2004** on AML/CTF"}],aretenir:"i-Hub is not a bank, but has direct and personal AML/KYC obligations towards each of its clients."},
  {id:2,emoji:'📜',titre:"The Luxembourg legal framework",contenu:[{icon:'🇱🇺',texte:"**Law of 12 November 2004** — fundamental AML/CTF law in Luxembourg, amended several times since"},{icon:'🇪🇺',texte:"**European Directive AMLD5 (2018/843)** — transposed into Luxembourg law, strengthens UBO transparency"},{icon:'📋',texte:"**CSSF Regulation 12-02** — specifies due diligence obligations for financial professionals"},{icon:'🌍',texte:"**FATF Recommendations** — 40 international AML/CTF recommendations adopted by Luxembourg"}],aretenir:"The 2004 law is the backbone. All other texts (directives, CSSF regulations, circulars) complement and clarify it.",plusLoin:[{icon:'📅',texte:"**AMLD6 (2021)** — expands predicate offences and strengthens criminal liability for legal persons"},{icon:'🔭',texte:"**AMLD7 upcoming** — plans to create a **European AML Authority (AMLA)** based in Frankfurt from 2026"},{icon:'🇱🇺',texte:"**CSSF Regulation 20-05** — introduces internal governance requirements for PSFs, including a mandatory approved AML Officer"}]},
  {id:3,emoji:'🤝',titre:"Who are i-Hub's clients?",contenu:[{icon:'🏛️',texte:"**Banks and credit institutions** — licensed by the ECB or CSSF, maximum level of scrutiny"},{icon:'📊',texte:"**Investment funds** (UCITS, AIF, SIF, RAIF) — verification of the manager and depositary"},{icon:'🛡️',texte:"**Insurance companies** — supervised by the CAA (Commissariat aux Assurances)"},{icon:'💼',texte:"**Other PSFs** (specialised PSFs, support PSFs) — also directly subject to AML/CTF law"}],aretenir:"All i-Hub's clients are regulated entities. This simplifies KYC but does not remove the obligation!"},
  {id:4,emoji:'📋',titre:"The 5 core obligations",contenu:[{icon:'1️⃣',texte:"**Identify** the client and verify their identity (company registration number, official extract, articles)"},{icon:'2️⃣',texte:"**Identify the beneficial owner** (UBO) — who ultimately owns or controls the client?"},{icon:'3️⃣',texte:"**Understand the business relationship** — why does this client want our services?"},{icon:'4️⃣',texte:"**Ongoing monitoring** — update the file when the situation changes (directors, shareholding, activity)"},{icon:'5️⃣',texte:"**Report** any suspicious transaction to the Luxembourg FIU"}],aretenir:"These 5 obligations apply BEFORE signing the contract and throughout the entire business relationship."},
  {id:5,emoji:'🔬',titre:"CDD — Customer Due Diligence",contenu:[{icon:'📌',texte:"**CDD** = Customer Due Diligence = standard vigilance measures applied to all clients without exception"},{icon:'🧾',texte:"Includes: identity verification, document collection, understanding the client's business activity"},{icon:'🔄',texte:"CDD is an **ongoing process** — not just at onboarding, but throughout the entire contract"},{icon:'📁',texte:"Everything must be **documented** and retained for **10 years** after the end of the business relationship"}],aretenir:"CDD is the baseline level of vigilance. It applies to ALL clients, even the simplest ones."},
  {id:6,emoji:'📁',titre:"The KYC file in practice",contenu:[{icon:'📄',texte:"**Company register extract** (RCS) — official document less than 3 months old"},{icon:'📜',texte:"**Updated articles of association** — to identify the corporate purpose and authorised directors"},{icon:'🪪',texte:"**Identity documents** for directors, managers and UBOs (holding +25%)"},{icon:'🔐',texte:"**Copy of the client's CSSF or CAA licence** — proof that they are themselves a regulated professional"},{icon:'📝',texte:"**AML questionnaire** signed by the client — declaration on source of funds, activity and identified risks"}],aretenir:"No complete KYC file = no contract. This is a legal obligation, not an optional administrative formality."},
  {id:7,emoji:'👤',titre:"What is a UBO?",contenu:[{icon:'🎯',texte:"**UBO** = Ultimate Beneficial Owner — the natural person who ultimately owns or controls the client entity"},{icon:'25%',texte:"Any natural person holding **directly or indirectly more than 25%** of shares or voting rights is a UBO"},{icon:'🏛️',texte:"In Luxembourg, UBOs must be registered in the **Register of Beneficial Owners (RBE)** — mandatory since 2019"},{icon:'🔍',texte:"If no person exceeds 25%, identify the person(s) exercising **effective control** in practice (e.g. CEO)"}],aretenir:"Identifying the UBO reveals WHO is really behind a company — key to detecting opaque structures.",plusLoin:[{icon:'🏛️',texte:"The **Luxembourg RBE** is public since 2019 — failure to register UBOs can result in fines up to €1.25 million"},{icon:'🔗',texte:"For **complex holding chains**, i-Hub must trace the full chain up to the actual natural person"},{icon:'🤝',texte:"If the client refuses to identify its UBOs without valid justification, i-Hub must **refuse the business relationship**"}]},
  {id:8,emoji:'🏛️',titre:"What is a PEP?",contenu:[{icon:'👑',texte:"**PEP** = Politically Exposed Person — a natural person who holds or has held an important public function"},{icon:'📋',texte:"Examples: heads of state, ministers, MPs, high court judges, central bank governors, ambassadors"},{icon:'👨‍👩‍👧',texte:"**Close family members** and **close associates** of a PEP are also considered PEPs"},{icon:'⏰',texte:"A PEP remains a PEP for **at least 12 months** after leaving their position"}],aretenir:"A PEP is not necessarily suspicious, but their profile automatically requires enhanced due diligence (EDD)."},
  {id:9,emoji:'⬆️',titre:"EDD — Enhanced Due Diligence",contenu:[{icon:'🔬',texte:"**EDD** = Enhanced Due Diligence — heightened vigilance applied to clients presenting a **higher risk**"},{icon:'🚩',texte:"Triggered for: PEPs, clients from FATF high-risk countries, complex structures, sensitive activities"},{icon:'📋',texte:"In practice: additional information on source of funds, management approval, enhanced transaction monitoring"},{icon:'✍️',texte:"EDD must be **documented and approved** by i-Hub's Compliance team before entering the business relationship"}],aretenir:"EDD is not an automatic refusal — it is more thorough vigilance. A PEP client can be accepted with more controls."},
  {id:10,emoji:'⬇️',titre:"SDD — Simplified Due Diligence",contenu:[{icon:'✅',texte:"**SDD** = Simplified Due Diligence — reduced vigilance applicable only to clients with a **demonstrated low risk**"},{icon:'🏛️',texte:"Applicable for example to public bodies, state administrations or entities listed on a regulated EU market"},{icon:'⚠️',texte:"SDD does NOT mean zero vigilance — basic identification documents must still be collected"},{icon:'🔄',texte:"If the risk level changes, switch immediately to standard CDD or EDD as appropriate"}],aretenir:"SDD is the exception, not the rule. At i-Hub, the vast majority of clients fall under standard CDD."},
  {id:11,emoji:'🌍',titre:"High-risk countries — FATF lists",contenu:[{icon:'🚨',texte:"**FATF Black List** — countries under call for action, enhanced measures mandatory (e.g. Iran, North Korea, Myanmar)"},{icon:'🟡',texte:"**FATF Grey List** — countries under increased monitoring working to improve their AML frameworks"},{icon:'🇪🇺',texte:"**EU Black List** — high-risk third countries identified by the European Commission, regularly updated"},{icon:'🔄',texte:"These lists are **updated 3 times a year** (February, June, October)"}],aretenir:"A client whose main activity is in a FATF-listed country automatically triggers EDD. No exceptions.",plusLoin:[{icon:'🌍',texte:"**Current FATF black list (2024)**: Iran, North Korea, Myanmar — transactions virtually impossible"},{icon:'🟡',texte:"**Grey list examples**: Bulgaria, Cameroon, Croatia, Monaco, Namibia, Nigeria, Vietnam"},{icon:'📋',texte:"i-Hub's Compliance team monitors each FATF publication"}]},
  {id:12,emoji:'📊',titre:"Client risk scoring",contenu:[{icon:'⚖️',texte:"**Risk scoring** = assigning a risk rating (low/medium/high) to each client based on objective criteria"},{icon:'📍',texte:"Criteria assessed: country of origin, entity type, business sector, ownership structure, PEP presence"},{icon:'🔢',texte:"At i-Hub, scoring is formalised in a **risk matrix** validated by the Compliance team and updated annually"},{icon:'📈',texte:"The score determines vigilance level: **low → SDD**, **medium → standard CDD**, **high → EDD**"}],aretenir:"Risk scoring is an objective tool to calibrate vigilance — it protects i-Hub and ensures a proportionate approach."},
  {id:13,emoji:'👁️',titre:"Ongoing monitoring",contenu:[{icon:'🔄',texte:"KYC is not a one-off exercise — the business relationship must be **monitored continuously**"},{icon:'📅',texte:"**Annual update** for high-risk clients, every **3 years** for standard-risk clients"},{icon:'🚨',texte:"**Immediate update** if: change of director, structure, shareholding, or business activity"},{icon:'📰',texte:"**Negative news screening** — press, sanctions databases, automated alerts on client names"}],aretenir:"An up-to-date KYC file is as important as a complete initial file. Any change triggers a review."},
  {id:14,emoji:'🚩',titre:"Red flags",contenu:[{icon:'🔴',texte:"**Opaque structure**: complex shareholding with multiple holding layers in non-cooperative countries"},{icon:'🔴',texte:"**Refusal to provide documents** or identify UBOs without valid justification"},{icon:'🔴',texte:"**Unexplained source of funds** or inconsistent with the client's declared business activity"},{icon:'🔴',texte:"**Presence on sanctions lists** (OFAC, EU, UN) or links to sanctioned persons"},{icon:'🔴',texte:"**Pressure to close quickly** without going through normal due diligence procedures"}],aretenir:"An accumulation of red flags should trigger EDD or a motivated refusal of the business relationship.",plusLoin:[{icon:'💡',texte:"**'Smurfing'** — breaking payments into small amounts to avoid reporting thresholds"},{icon:'🌐',texte:"**Non-cooperative jurisdictions**: intermediate subsidiaries in the Cayman Islands or Panama without economic justification"},{icon:'📰',texte:"**Negative news**: a simple Google search on the client's name is part of good CDD practice"}]},
  {id:15,emoji:'🚨',titre:"What to do when in doubt?",contenu:[{icon:'🛑',texte:"**Never act alone** — any doubt must be immediately reported to i-Hub's **Compliance team**"},{icon:'📝',texte:"**Document everything**: questions asked, answers received, documents collected, decisions taken"},{icon:'🚫',texte:"**Never inform the client** that a suspicious transaction report is being filed — this is **tipping-off**, prohibited by law"},{icon:'⏸️',texte:"If in serious doubt, **suspend the relationship** or transactions until a formal decision from Compliance"}],aretenir:"STOP — REPORT — DOCUMENT. Never make a decision alone on a sensitive or ambiguous case."},
  {id:16,emoji:'📢',titre:"The Luxembourg FIU (CRF)",contenu:[{icon:'🏛️',texte:"**CRF** = Cellule de Renseignement Financier — Luxembourg's FIU, receives and analyses suspicious transaction reports"},{icon:'📨',texte:"Reports are filed via the **goAML** secure online platform managed directly by the CRF Luxembourg"},{icon:'🔐',texte:"The report is **strictly confidential** — the client must never know that an STR has been filed"},{icon:'⚡',texte:"After a report, the CRF can **freeze assets**, investigate or refer to the Public Prosecutor"}],aretenir:"Reporting to the CRF is a legal obligation. Failure to report exposes i-Hub and its directors to criminal sanctions."},
  {id:17,emoji:'🤫',titre:"Professional secrecy vs. reporting obligation",contenu:[{icon:'🔒',texte:"PSFs are subject to **professional secrecy** — they normally cannot disclose client information to third parties"},{icon:'⚖️',texte:"**Legal exception**: the obligation to report to the CRF **overrides** professional secrecy in ML/TF suspicion cases"},{icon:'🚫',texte:"**Tipping-off** remains prohibited even after the waiver of professional secrecy"},{icon:'👨‍⚖️',texte:"This exception is explicitly provided for in the **Law of 12 November 2004** — good faith reporters are legally protected"}],aretenir:"Reporting to the CRF in good faith protects i-Hub legally, even if the suspicion later proves unfounded."},
  {id:18,emoji:'❄️',titre:"Asset freezing",contenu:[{icon:'🚫',texte:"**Asset freezing** = immediately blocking any funds linked to a person or entity on a sanctions list"},{icon:'📋',texte:"Lists to check: **UN, EU (Regulation 2580/2001), OFAC (USA)**, Luxembourg Treasury national list"},{icon:'⚡',texte:"Freezing is **immediate and automatic** as soon as a name appears on a list — no court order needed"},{icon:'📢',texte:"i-Hub must **notify the CRF and the Public Prosecutor** and maintain a register of frozen assets"}],aretenir:"Freezing applies even if a transaction is already in progress. Stop everything and call the Compliance team.",plusLoin:[{icon:'🇺🇸',texte:"**OFAC (US)** — its sanctions apply to entities dealing in dollars or with US correspondent banks"},{icon:'⚡',texte:"**False positives**: screening tools often match common names — document every analysis and decision to lift the flag"},{icon:'📋',texte:"If an existing supplier or client is newly sanctioned, i-Hub must **terminate the contract**"}]},
  {id:19,emoji:'⚠️',titre:"Penalties for non-compliance",contenu:[{icon:'💶',texte:"**CSSF administrative fines** of up to **€5 million** or 10% of annual turnover"},{icon:'📛',texte:"**Withdrawal of the PSF licence** — i-Hub could no longer operate in Luxembourg"},{icon:'⚖️',texte:"**Criminal proceedings** against directors and employees involved — up to 5 years' imprisonment"},{icon:'📰',texte:"**Public disclosure** of the sanction on the CSSF website — major and lasting reputational damage"}],aretenir:"AML/KYC penalties are among the most severe in the financial sector. Ignorance of the law is never an excuse."},
  {id:20,emoji:'🔎',titre:"Name screening of i-Hub's suppliers",contenu:[{icon:'🏢',texte:"i-Hub must conduct **name screening** not only on its clients, but also on its **suppliers and service providers**"},{icon:'📋',texte:"Any supplier accessing i-Hub's systems or data must be **verified before the contract is signed**"},{icon:'🔍',texte:"Screening means checking the supplier's name against **sanctions lists** (UN, EU, OFAC) and PEP databases"},{icon:'🚨',texte:"A listed supplier must be **immediately blocked** — no transactions, no payments, no access"},{icon:'🔄',texte:"Screening is **ongoing** — an alert may arise if an existing supplier is newly sanctioned"}],aretenir:"i-Hub's AML obligations do not stop at clients. Suppliers are also part of the due diligence perimeter."},
  {id:21,emoji:'👨‍💼',titre:"The role of i-Hub's Compliance team",contenu:[{icon:'🎯',texte:"The **Compliance Officer** at i-Hub is the AML reference, personally approved by the CSSF"},{icon:'📋',texte:"Their role: define AML/KYC policy, validate high-risk files, train staff, prepare the annual CSSF report"},{icon:'🚨',texte:"When in doubt or when a red flag is detected, **they are the one you contact** — they can block or approve a relationship"},{icon:'🤝',texte:"**You also have a role** — every i-Hub employee is a link in the AML chain"}],aretenir:"Compliance is everyone's responsibility — every employee is accountable for what they observe day to day."},
]

const BANQUE_MATCHING_FR = [{sigle:'AML',definition:'Lutte contre le blanchiment'},{sigle:'KYC',definition:'Connaissance du client'},{sigle:'UBO',definition:'Bénéficiaire effectif final'},{sigle:'PEP',definition:'Personne politiquement exposée'},{sigle:'EDD',definition:'Vigilance renforcée'},{sigle:'CRF',definition:'Cellule renseignement financier'},{sigle:'SDD',definition:'Vigilance simplifiée'},{sigle:'CDD',definition:'Vigilance standard'},{sigle:'STR',definition:'Rapport de transaction suspecte'},{sigle:'RBE',definition:'Registre des bénéficiaires effectifs'},{sigle:'GAFI',definition:"Groupe d'action financière"},{sigle:'PSF',definition:'Professionnel du secteur financier'},{sigle:'CSSF',definition:'Superviseur financier luxembourgeois'},{sigle:'OFAC',definition:'Sanctions financières américaines'},{sigle:'AMLA',definition:'Future autorité AML européenne'}]
const BANQUE_MATCHING_EN = [{sigle:'AML',definition:'Anti-money laundering'},{sigle:'KYC',definition:'Know your customer'},{sigle:'UBO',definition:'Ultimate beneficial owner'},{sigle:'PEP',definition:'Politically exposed person'},{sigle:'EDD',definition:'Enhanced due diligence'},{sigle:'FIU',definition:'Financial intelligence unit'},{sigle:'SDD',definition:'Simplified due diligence'},{sigle:'CDD',definition:'Standard due diligence'},{sigle:'STR',definition:'Suspicious transaction report'},{sigle:'RBE',definition:'Beneficial owner register'},{sigle:'FATF',definition:'Financial Action Task Force'},{sigle:'PSF',definition:'Financial sector professional'},{sigle:'CSSF',definition:'Luxembourg financial supervisor'},{sigle:'OFAC',definition:'US financial sanctions authority'},{sigle:'AMLA',definition:'Future European AML authority'}]

const BANQUE_BRIQUES_FR = [
  {scenario:"Constituez le dossier KYC dans l'ordre correct",items:[{id:'rcs',texte:'📄 Extrait RCS',ordre:1},{id:'statuts',texte:'📜 Statuts coordonnés',ordre:2},{id:'id',texte:"🪪 Pièce d'identité dirigeant",ordre:3},{id:'licence',texte:'🔐 Licence CSSF client',ordre:4},{id:'questionnaire',texte:'📝 Questionnaire AML',ordre:5},{id:'validation',texte:'✅ Validation équipe Compliance',ordre:6}]},
  {scenario:"Ordonnez les étapes en cas de soupçon de blanchiment",items:[{id:'stop',texte:'🛑 Suspendre la transaction',ordre:1},{id:'doc',texte:'📝 Documenter les faits',ordre:2},{id:'signal',texte:"📢 Alerter l'équipe Compliance",ordre:3},{id:'analyse',texte:'🔬 Analyser le dossier',ordre:4},{id:'str',texte:'📨 Déclarer à la CRF si confirmé',ordre:5},{id:'notp',texte:'🤫 Ne jamais informer le client',ordre:6}]},
  {scenario:"Ordonnez les niveaux de vigilance du plus faible au plus fort",items:[{id:'sdd',texte:'⬇️ SDD — Vigilance simplifiée',ordre:1},{id:'cdd',texte:'🔬 CDD — Vigilance standard',ordre:2},{id:'edd',texte:'⬆️ EDD — Vigilance renforcée',ordre:3},{id:'str2',texte:'🚨 Signalement à la CRF',ordre:4},{id:'gel',texte:'❄️ Gel des avoirs',ordre:5},{id:'refus',texte:'🚫 Refus de la relation',ordre:6}]},
]
const BANQUE_BRIQUES_EN = [
  {scenario:"Build the KYC file in the correct order",items:[{id:'rcs',texte:'📄 Company register extract',ordre:1},{id:'statuts',texte:'📜 Updated articles of association',ordre:2},{id:'id',texte:'🪪 Director identity document',ordre:3},{id:'licence',texte:'🔐 Client CSSF licence',ordre:4},{id:'questionnaire',texte:'📝 AML questionnaire',ordre:5},{id:'validation',texte:'✅ Compliance team approval',ordre:6}]},
  {scenario:"Order the steps when a ML suspicion arises",items:[{id:'stop',texte:'🛑 Suspend the transaction',ordre:1},{id:'doc',texte:'📝 Document the facts',ordre:2},{id:'signal',texte:'📢 Alert the Compliance team',ordre:3},{id:'analyse',texte:'🔬 Analyse the file',ordre:4},{id:'str',texte:'📨 Report to FIU if confirmed',ordre:5},{id:'notp',texte:'🤫 Never inform the client',ordre:6}]},
  {scenario:"Order due diligence levels from lowest to highest",items:[{id:'sdd',texte:'⬇️ SDD — Simplified due diligence',ordre:1},{id:'cdd',texte:'🔬 CDD — Standard due diligence',ordre:2},{id:'edd',texte:'⬆️ EDD — Enhanced due diligence',ordre:3},{id:'str2',texte:'🚨 Report to FIU',ordre:4},{id:'gel',texte:'❄️ Asset freezing',ordre:5},{id:'refus',texte:'🚫 Refusal of relationship',ordre:6}]},
]

const BANQUE_VF_FR = [
  {texte:"i-Hub doit vérifier l'identité de ses clients car c'est une banque",reponse:false,explication:"i-Hub est un PSF de support, pas une banque. Mais la loi LBC/FT s'applique quand même !"},
  {texte:"Un client PEP nécessite des mesures de vigilance renforcées (EDD)",reponse:true,explication:"Exact ! Toute personne politiquement exposée déclenche automatiquement l'EDD."},
  {texte:"Si le dossier KYC est incomplet, on peut quand même signer le contrat",reponse:false,explication:"Non ! Pas de KYC complet = pas de relation d'affaires. C'est une obligation légale."},
  {texte:"Le dossier KYC doit être conservé 10 ans après la fin de la relation",reponse:true,explication:"Exact ! La loi impose une conservation de 10 ans de tous les documents KYC."},
  {texte:"On peut informer un client qu'une déclaration de soupçon a été faite à la CRF",reponse:false,explication:"Non ! C'est le tipping-off, strictement interdit par la loi."},
  {texte:"Un UBO est toute personne détenant plus de 25% d'une société",reponse:true,explication:"Exact ! Le seuil légal est fixé à 25% de détention directe ou indirecte."},
  {texte:"Le GAFI publie ses listes de pays à risque une fois par an",reponse:false,explication:"Non ! Le GAFI publie ses listes 3 fois par an : en février, juin et octobre."},
  {texte:"Le gel des avoirs s'applique même si une transaction est déjà en cours",reponse:true,explication:"Exact ! Le gel est immédiat, sans délai ni exception."},
  {texte:"Un PEP reste soumis à l'EDD au moins 12 mois après avoir quitté ses fonctions",reponse:true,explication:"Exact ! Le statut PEP persiste au minimum 12 mois après la cessation des fonctions."},
  {texte:"i-Hub peut ignorer le screening des fournisseurs s'ils sont luxembourgeois",reponse:false,explication:"Non ! Tout fournisseur doit être screené quelle que soit sa nationalité."},
  {texte:"L'équipe Compliance est la seule responsable de la conformité AML chez i-Hub",reponse:false,explication:"Non ! Chaque employé est responsable de signaler les anomalies."},
  {texte:"La SDD dispense totalement de collecter des documents",reponse:false,explication:"Non ! La SDD allège la vigilance mais ne supprime pas l'obligation de base."},
]
const BANQUE_VF_EN = [
  {texte:"i-Hub must verify client identity because it is a bank",reponse:false,explication:"i-Hub is a support PSF, not a bank. But AML/CTF law applies nonetheless!"},
  {texte:"A PEP client requires enhanced due diligence (EDD)",reponse:true,explication:"Correct! Any politically exposed person automatically triggers EDD."},
  {texte:"You can sign a contract even if the KYC file is incomplete",reponse:false,explication:"No! No complete KYC file = no business relationship. This is a legal obligation."},
  {texte:"KYC files must be kept for 10 years after the end of the relationship",reponse:true,explication:"Correct! The law requires retention of all KYC documents for 10 years."},
  {texte:"You can inform a client that a suspicious transaction report has been filed",reponse:false,explication:"No! This is tipping-off, strictly prohibited by law under criminal penalty."},
  {texte:"A UBO is any person holding more than 25% of a company",reponse:true,explication:"Correct! The legal threshold is 25% direct or indirect ownership."},
  {texte:"The FATF publishes its high-risk country lists once a year",reponse:false,explication:"No! The FATF publishes its lists 3 times a year: February, June and October."},
  {texte:"Asset freezing applies even if a transaction is already in progress",reponse:true,explication:"Correct! Freezing is immediate, with no delay or exception."},
  {texte:"A PEP remains subject to EDD for at least 12 months after leaving office",reponse:true,explication:"Correct! PEP status persists for a minimum of 12 months after leaving the position."},
  {texte:"i-Hub can skip supplier screening if they are Luxembourg-based",reponse:false,explication:"No! All suppliers must be screened regardless of their nationality."},
  {texte:"Only the Compliance team is responsible for AML compliance at i-Hub",reponse:false,explication:"No! Every employee is responsible for reporting anomalies."},
  {texte:"SDD fully exempts from collecting any documents",reponse:false,explication:"No! SDD reduces vigilance but does not remove the basic collection obligation."},
]

export default function ModuleAmlKyc() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)

  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeMatching, setActiveMatching] = useState(() => pickRandom(BANQUE_MATCHING_FR, 6))
  const [matchSelected, setMatchSelected] = useState<string|null>(null)
  const [matchPairs, setMatchPairs] = useState<Record<string,string>>({})
  const [matchError, setMatchError] = useState<string|null>(null)
  const [activeScenario, setActiveScenario] = useState(() => BANQUE_BRIQUES_FR[0])
  const [briquesDisponibles, setBriquesDisponibles] = useState(() => shuffle(BANQUE_BRIQUES_FR[0].items))
  const [briquesPlacees, setBriquesPlacees] = useState<{id:string,texte:string,ordre:number}[]>([])
  const [briqueMessage, setBriqueMessage] = useState<string|null>(null)
  const [activeVF, setActiveVF] = useState(() => pickRandom(BANQUE_VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct'|'wrong'|null>(null)

  const C = '#e91e8c'

  function initQuizzes(l: 'fr'|'en') {
    const bm = l==='fr'?BANQUE_MATCHING_FR:BANQUE_MATCHING_EN
    const bb = l==='fr'?BANQUE_BRIQUES_FR:BANQUE_BRIQUES_EN
    const bv = l==='fr'?BANQUE_VF_FR:BANQUE_VF_EN
    const nm = pickRandom(bm,6); const ns = bb[Math.floor(Math.random()*bb.length)]; const nv = pickRandom(bv,6)
    setActiveMatching(nm); setActiveScenario(ns); setBriquesDisponibles(shuffle([...ns.items])); setActiveVF(nv)
    setMatchPairs({}); setMatchSelected(null); setMatchError(null)
    setBriquesPlacees([]); setBriqueMessage(null)
    setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
  }

  function switchLang(l: 'fr'|'en') {
    saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l)
  }

  function handleMatchSigle(sigle: string) { if (matchPairs[sigle]) return; setMatchSelected(sigle); setMatchError(null) }
  function handleMatchDef(def: string) {
    if (!matchSelected) return
    const correct = activeMatching.find(m => m.sigle===matchSelected)?.definition
    if (correct===def) {
      const np={...matchPairs,[matchSelected]:def}; setMatchPairs(np); setMatchSelected(null)
      if (Object.keys(np).length===activeMatching.length) setScore(s=>s+15)
    } else { setMatchError(lang==='fr'?`❌ "${def}" ne correspond pas à ${matchSelected}.`:`❌ "${def}" does not match ${matchSelected}.`); setMatchSelected(null) }
  }
  function placerBrique(b:{id:string,texte:string,ordre:number}) {
    const exp=briquesPlacees.length+1
    if (b.ordre===exp) { const nl=[...briquesPlacees,b]; setBriquesPlacees(nl); setBriquesDisponibles(d=>d.filter(x=>x.id!==b.id)); setBriqueMessage(null); if (b.ordre===activeScenario.items.length) setScore(s=>s+15) }
    else setBriqueMessage(lang==='fr'?`⚠️ L'étape n°${exp} doit venir avant.`:`⚠️ Step ${exp} must come first.`)
  }
  function repondreVF(rep:boolean) {
    if (vfRepondu!==null) return
    const correct=activeVF[vfIndex].reponse===rep; setVfRepondu(rep); setVfAnimation(correct?'correct':'wrong')
    if (correct) setVfScore(s=>s+1)
    setTimeout(() => {
      setVfAnimation(null)
      setVfRepondu(null)
      if (vfIndex + 1 < activeVF.length) {
        setVfIndex(i => i + 1)
      } else {
        const finalScore = correct ? vfScore + 1 : vfScore
        setScore(s => s + finalScore * 5)
        setPhase('resultat')
      }
    }, 2200)
  }

  const base:React.CSSProperties={minHeight:'100vh',background:'#f3f4f6',fontFamily:"'Segoe UI',system-ui,sans-serif",color:'#1f2937'}

  const NavBar=()=>(
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(61,32,16,0.2)'}}>
      <button onClick={()=>router.push('/')} style={{background:'none',border:'1px solid #e91e8c',borderRadius:'8px',padding:'6px 12px',color:'#e91e8c',cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#e91e8c',fontWeight:'700',fontSize:'16px'}}>🔍 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.1)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          <button onClick={()=>switchLang('fr')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='fr'?C:'transparent',color:lang==='fr'?'white':'#e8d5c0',transition:'all 0.2s'}}>🇫🇷 FR</button>
          <button onClick={()=>switchLang('en')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='en'?C:'transparent',color:lang==='en'?'white':'#e8d5c0',transition:'all 0.2s'}}>🇬🇧 EN</button>
        </div>
        <span style={{background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔍</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'18px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'32px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=>(
            <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #fce4ec':'none'}}>
              <span style={{color:C,fontWeight:'700'}}>✓</span>
              <span style={{color:'#1f2937',fontSize:'15px'}}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'32px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.quiz,icon:'🎮'},{label:t.time,icon:'⏱️'}].map((b,i)=>(
            <div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>
          ))}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer',boxShadow:'0 4px 20px rgba(233,30,140,0.35)'}}>{t.start}</button>
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
            <span style={{fontSize:'13px',color:'#4b5563',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'200px'}}>
              {FICHES.map((_,i)=>(<div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#e8d5c0',cursor:'pointer',transition:'all 0.2s'}}/>))}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',boxShadow:'0 8px 40px rgba(233,30,140,0.12)',border:`2px solid ${C}30`,overflow:'hidden',marginBottom:'20px'}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0,lineHeight:1.3}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#1f2937'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C}">$1</strong>`)}}/>
                </div>
              ))}
              <div style={{background:`${C}10`,border:`1px solid ${C}30`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>💡</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#1f2937',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
              {(fiche as any).plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen(o=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:`1.5px solid ${C}`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'}}>
                    <span>{t.goFurther}</span>
                    <span style={{fontSize:'18px',transition:'transform 0.3s',transform:plusLoinOpen?'rotate(180deg)':'rotate(0deg)',display:'inline-block'}}>▾</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:`${C}08`,border:`1px solid ${C}25`,borderRadius:'0 0 10px 10px',padding:'16px',marginTop:'-4px',borderTop:'none'}}>
                      {((fiche as any).plusLoin as {icon:string,texte:string}[]).map((item,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:i<(fiche as any).plusLoin.length-1?`1px solid ${C}20`:'none'}}>
                          <span style={{fontSize:'20px',minWidth:'28px',textAlign:'center'}}>{item.icon}</span>
                          <p style={{margin:0,fontSize:'14px',lineHeight:1.6,color:'#1f2937'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C}">$1</strong>`)}}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            {ficheIndex>0 && <button onClick={()=>{setFicheIndex(i=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#4b5563',cursor:'pointer',fontSize:'15px',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')}
              style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700',boxShadow:`0 4px 16px ${C}40`}}>
              {ficheIndex<FICHES.length-1?`${t.next} (${ficheIndex+2}/${FICHES.length}) →`:t.quizBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase==='quiz1') {
    const done=Object.keys(matchPairs).length===activeMatching.length
    return (
      <div style={base}><NavBar/>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <span style={{background:'#7c3aed15',color:'#7c3aed',borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz1label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.quiz1title}</h2>
            <p style={{color:'#4b5563',fontSize:'14px',margin:0}}>{t.quiz1sub}</p>
          </div>
          {matchError && <div style={{background:'#fee2e2',border:'1px solid #fca5a5',borderRadius:'12px',padding:'12px 16px',marginBottom:'16px',color:'#dc2626',fontSize:'14px',textAlign:'center'}}>{matchError}</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#4b5563',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.sigles}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {activeMatching.map(m=>{const ip=!!matchPairs[m.sigle],is=matchSelected===m.sigle;return(
                  <button key={m.sigle} onClick={()=>handleMatchSigle(m.sigle)} disabled={ip}
                    style={{padding:'14px',borderRadius:'12px',fontSize:'16px',fontWeight:'800',cursor:ip?'default':'pointer',transition:'all 0.2s',background:ip?'#d1fae5':is?'#7c3aed':'white',color:ip?'#059669':is?'white':'#6b3a2a',boxShadow:is?'0 4px 16px #7c3aed50':'0 2px 8px rgba(0,0,0,0.06)',transform:is?'scale(1.04)':'scale(1)',border:ip?'1.5px solid #6ee7b7':is?'1.5px solid #7c3aed':'1.5px solid #e5e7eb'} as React.CSSProperties}>
                    {ip?'✓ ':''}{m.sigle}
                  </button>
                )})}
              </div>
            </div>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#4b5563',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.definitions}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {shuffle(activeMatching.map(m=>({definition:m.definition}))).map(m=>{const ip=Object.values(matchPairs).includes(m.definition);return(
                  <button key={m.definition} onClick={()=>handleMatchDef(m.definition)} disabled={ip||!matchSelected}
                    style={{padding:'14px',borderRadius:'12px',fontSize:'14px',fontWeight:'600',cursor:(ip||!matchSelected)?'default':'pointer',transition:'all 0.2s',textAlign:'left',background:ip?'#d1fae5':matchSelected?'white':'#f9fafb',color:ip?'#059669':'#6b3a2a',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',border:ip?'1.5px solid #6ee7b7':'1.5px solid #e5e7eb',opacity:(!matchSelected&&!ip)?0.6:1} as React.CSSProperties}>
                    {ip?'✓ ':''}{m.definition}
                  </button>
                )})}
              </div>
            </div>
          </div>
          {done&&<><div style={{background:'#d1fae5',border:'1px solid #6ee7b7',borderRadius:'16px',padding:'20px',textAlign:'center',marginBottom:'16px'}}>
            <p style={{fontSize:'28px',margin:'0 0 8px'}}>🎉</p>
            <p style={{fontWeight:'800',color:'#059669',fontSize:'18px',margin:'0 0 4px'}}>{t.quiz1done}</p>
            <p style={{color:'#6ee7b7',margin:0,fontSize:'14px'}}>+15 {t.pts_gained}</p>
          </div>
          <button onClick={()=>setPhase('quiz2')} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.next2}</button></>}
        </div>
      </div>
    )
  }

  if (phase==='quiz2') {
    const done=briquesPlacees.length===activeScenario.items.length
    return (
      <div style={base}><NavBar/>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <span style={{background:'#0891b215',color:'#0891b2',borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz2label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.quiz2title}</h2>
            <p style={{color:'#4b5563',fontSize:'14px',margin:0}}>{activeScenario.scenario}</p>
          </div>
          <div style={{background:'white',border:'2px dashed #0891b240',borderRadius:'16px',padding:'20px',marginBottom:'20px',minHeight:'100px'}}>
            <p style={{fontSize:'12px',fontWeight:'700',color:'#4b5563',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'12px'}}>{t.quiz2folder}</p>
            {briquesPlacees.length===0?<p style={{color:'#4b5563',textAlign:'center',fontSize:'14px',padding:'16px 0'}}>{t.quiz2empty}</p>:
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {briquesPlacees.map((b,i)=>(
                  <div key={b.id} style={{background:'#ecfdf5',border:'1px solid #6ee7b7',borderRadius:'10px',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px',fontSize:'14px',fontWeight:'600',color:'#059669'}}>
                    <span style={{background:'#059669',color:'white',borderRadius:'50%',width:'22px',height:'22px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',flexShrink:0}}>{i+1}</span>
                    {b.texte}
                  </div>
                ))}
              </div>}
          </div>
          {briqueMessage&&<div style={{background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:'12px',padding:'12px 16px',marginBottom:'16px',color:'#92400e',fontSize:'14px',textAlign:'center'}}>{briqueMessage}</div>}
          {briquesDisponibles.length>0&&(
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#4b5563',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'12px'}}>{t.quiz2available}</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                {briquesDisponibles.map(b=>(
                  <button key={b.id} onClick={()=>placerBrique(b)}
                    style={{padding:'14px 16px',background:'white',border:'2px solid #0891b230',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#0891b2',textAlign:'left',transition:'all 0.15s'}}
                    onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor='#0891b2';(e.currentTarget as HTMLElement).style.background='#f0f9ff'}}
                    onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#0891b230';(e.currentTarget as HTMLElement).style.background='white'}}>
                    {b.texte}
                  </button>
                ))}
              </div>
            </div>
          )}
          {done&&<><div style={{background:'#d1fae5',border:'1px solid #6ee7b7',borderRadius:'16px',padding:'20px',textAlign:'center',marginTop:'20px',marginBottom:'16px'}}>
            <p style={{fontSize:'28px',margin:'0 0 8px'}}>🏆</p>
            <p style={{fontWeight:'800',color:'#059669',fontSize:'18px',margin:'0 0 4px'}}>{t.quiz2done}</p>
            <p style={{color:'#6ee7b7',margin:0,fontSize:'14px'}}>+15 {t.pts_gained}</p>
          </div>
          <button onClick={()=>setPhase('quiz3')} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.last}</button></>}
        </div>
      </div>
    )
  }

  if (phase==='quiz3') {
    const q=activeVF[vfIndex]
    return (
      <div style={{...base,transition:'background 0.3s',background:vfAnimation==='correct'?'#d1fae5':vfAnimation==='wrong'?'#fee2e2':'#f3f4f6'}}><NavBar/>
        <div style={{background:vfAnimation==='correct'?'#6ee7b7':vfAnimation==='wrong'?'#fca5a5':'#e8d5c0',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(vfIndex/activeVF.length)*100}%`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'24px'}}>{t.quiz3label} — {vfIndex+1}/{activeVF.length}</span>
          <div style={{background:'white',borderRadius:'20px',padding:'32px 24px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'28px',minHeight:'100px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'19px',fontWeight:'700',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
          </div>
          {vfRepondu===null?(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={()=>repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'22px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={()=>repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'22px',fontWeight:'800',color:'#dc2626',cursor:'pointer'}}>{t.false}</button>
            </div>
          ):(
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnimation==='correct'?'#059669':'#dc2626',fontSize:'18px',margin:'0 0 8px'}}>{vfAnimation==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#1f2937',fontSize:'15px',margin:0,fontStyle:'italic'}}>{q.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
            {activeVF.map((_,i)=><div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=vfIndex?C:'#e8d5c0'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  const total=Math.min(100,score),medal=total>=80?'🥇':total>=50?'🥈':'🥉',msg=total>=80?t.medal_gold:total>=50?t.medal_silver:t.medal_bronze
  return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'560px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'80px',marginBottom:'16px'}}>{medal}</div>
        <h2 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{msg}</h2>
        <p style={{color:'#4b5563',fontSize:'16px',marginBottom:'32px'}}>{t.resultTitle}</p>
        <div style={{background:'white',borderRadius:'20px',padding:'32px',boxShadow:`0 8px 32px ${C}10`,marginBottom:'24px'}}>
          <div style={{fontSize:'56px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'24px'}}>/100</span></div>
          <p style={{color:'#4b5563',margin:'0 0 20px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#e5e7eb',borderRadius:'8px',height:'12px',overflow:'hidden'}}>
            <div style={{background:`linear-gradient(90deg,${C},#f472b6)`,height:'12px',width:`${total}%`,borderRadius:'8px'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
          <button onClick={()=>router.push('/')} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.backHome}</button>
          <button onClick={()=>{initQuizzes(lang);setScore(0);setPhase('intro')}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
