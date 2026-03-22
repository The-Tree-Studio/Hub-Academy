require("fs").writeFileSync("app/modules/fatca/page.tsx", `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom(arr, n) { return shuffle(arr).slice(0, n) }

const UI = {
  fr: {
    title: 'FATCA', subtitle: "Foreign Account Tax Compliance Act — Ce que ça change pour i-Hub",
    learn: '📚 Ce que vous allez apprendre :', learnItems: [
      'Pourquoi FATCA existe et qui est concerné',
      'La définition d’une US Person et des indices d’américanité',
      'Les obligations de classification et de documentation',
      'Les formulaires W-9, W-8BEN et W-8BEN-E',
      'Le rôle de i-Hub comme institution financière déclarante',
      'Les sanctions en cas de manquement à FATCA',
    ],
    fiches:'20 fiches', quiz:'3 quiz fun', time:'~20 min',
    start:"C’est parti ! 🚀", prev:'← Précédent', next:'Fiche suivante',
    quizBtn:'🎮 Passer aux quiz !', toRetain:'À RETENIR', goFurther:'🔍 Aller plus loin',
    home:'← Accueil', pts:'🪙',
    quiz1label:'QUIZ 1/3 · ASSOCIER LES PAIRES', quiz1title:'🧩 Reliez chaque terme à sa définition',
    quiz1sub:"Cliquez d’abord sur un terme, puis sur sa définition",
    sigles:'Termes', definitions:'Définitions', quiz1done:'Parfait ! Tous les termes associés !',
    quiz2label:'QUIZ 2/3 · VRAI OU FAUX', quiz2title:'✅ Vrai ou Faux — FATCA en pratique',
    true:'✅ VRAI', false:'❌ FAUX', correct:'Bravo !', wrong:'Pas tout à fait...',
    quiz3label:'QUIZ 3/3 · CAS PRATIQUES', quiz3title:'🔍 Analysez la situation',
    quiz3sub:'Quel formulaire ou quelle action s’impose ?',
    resultTitle:'Module FATCA terminé — 20 fiches maîtrisées !',
    backHome:'← Retour aux modules', restart:'🔄 Recommencer ce module',
    pts_gained:'points gagnés', medal_gold:'Expert FATCA !',
    medal_silver:'Bon résultat, continuez !', medal_bronze:'Relisez les fiches et réessayez !',
    score:'Score total', next2:'Quiz suivant →', last:'Dernier quiz →',
  },
  en: {
    title: 'FATCA', subtitle: "Foreign Account Tax Compliance Act — What it means for i-Hub",
    learn: '📚 What you will learn:', learnItems: [
      'Why FATCA exists and who is affected',
      'The definition of a US Person and indicia of US status',
      'Classification and documentation obligations',
      'W-9, W-8BEN and W-8BEN-E forms',
      'i-Hub’s role as a reporting financial institution',
      'Penalties for FATCA non-compliance',
    ],
    fiches:'20 cards', quiz:'3 fun quizzes', time:'~20 min',
    start:"Let’s go! 🚀", prev:'← Previous', next:'Next card',
    quizBtn:'🎮 Go to quizzes!', toRetain:'KEY TAKEAWAY', goFurther:'🔍 Go further',
    home:'← Home', pts:'🪙',
    quiz1label:'QUIZ 1/3 · MATCH THE PAIRS', quiz1title:'🧩 Match each term to its definition',
    quiz1sub:'Click a term first, then its definition',
    sigles:'Terms', definitions:'Definitions', quiz1done:'Perfect! All terms matched!',
    quiz2label:'QUIZ 2/3 · TRUE OR FALSE', quiz2title:'✅ True or False — FATCA in practice',
    true:'✅ TRUE', false:'❌ FALSE', correct:'Well done!', wrong:'Not quite...',
    quiz3label:'QUIZ 3/3 · CASE STUDIES', quiz3title:'🔍 Analyse the situation',
    quiz3sub:'Which form or action is required?',
    resultTitle:'FATCA module complete — 20 cards mastered!',
    backHome:'← Back to modules', restart:'🔄 Restart this module',
    pts_gained:'points earned', medal_gold:'FATCA Expert!',
    medal_silver:'Good result, keep going!', medal_bronze:'Review the cards and try again!',
    score:'Total score', next2:'Next quiz →', last:'Last quiz →',
  },
}

const FICHES_FR = [
  {id:1,emoji:'🦅',titre:"C’est quoi FATCA ?",contenu:[
    {icon:'🇺🇸',texte:"**FATCA** = Foreign Account Tax Compliance Act — loi fiscale américaine adoptée en **2010** sous Obama"},
    {icon:'🎯',texte:"Objectif : forcer les institutions financières **hors des USA** à déclarer les comptes détenus par des **US Persons** à l’IRS"},
    {icon:'🌍',texte:"FATCA s’applique à toutes les institutions financières mondiales — y compris **i-Hub** au Luxembourg"},
    {icon:'⚡',texte:"En cas de non-coopération : retenue à la source de **30%** sur tous les paiements de source américaine"},
  ],aretenir:"FATCA est une loi américaine à portée mondiale. Elle impose à i-Hub d’identifier et de déclarer ses clients américains à l’IRS."},

  {id:2,emoji:'🤝',titre:"L’accord IGA Luxembourg-USA",contenu:[
    {icon:'📜',texte:"Le Luxembourg a signé un **IGA Modèle 1** (Intergovernmental Agreement) avec les USA le **28 mars 2014**"},
    {icon:'🏛️',texte:"Grâce à l’IGA, les institutions luxembourgeoises déclarent à l'**Administration des Contributions Directes (ACD)** — pas directement à l’IRS"},
    {icon:'📋',texte:"L’ACD transmet ensuite les données à l’IRS — système de déclaration **gouvernement à gouvernement**"},
    {icon:'⚖️',texte:"La loi luxembourgeoise du **24 juillet 2015** transpose l’IGA en droit national — contraignant pour toutes les IFE luxembourgeoises"},
  ],aretenir:"Grâce à l’IGA Modèle 1, i-Hub déclare à l’ACD (Luxembourg), pas directement à l’IRS américain.",
  plusLoin:[
    {icon:'🌍',texte:"**IGA Modèle 1** (Luxembourg) = déclaration via gouvernement local. **IGA Modèle 2** = déclaration directe à l’IRS"},
    {icon:'📅',texte:"Le Luxembourg a été parmi les **premiers pays européens** à signer un IGA Modèle 1 en 2014"},
    {icon:'🔄',texte:"L’IGA est mis à jour régulièrement — i-Hub doit surveiller les évolutions de l’ACD"},
  ]},

  {id:3,emoji:'👤',titre:"C’est quoi une US Person ?",contenu:[
    {icon:'🇺🇸',texte:"**US Person** = toute personne physique ou morale soumise à l’impôt américain — quelle que soit sa résidence"},
    {icon:'👶',texte:"Citoyen américain (né aux USA ou naturalisé), y compris les **doubles nationaux** (ex: franco-américain)"},
    {icon:'🏠',texte:"**Résident fiscal américain** = toute personne résidant légalement aux USA (carte verte / Green Card)"},
    {icon:'🏢',texte:"Entités US : sociétés constituées aux USA, trusts régis par le droit américain, successions imposables aux USA"},
  ],aretenir:"Une US Person n’est pas forcément résidente aux USA. Un Luxembourgeois né à New York et naturalisé luxembourgeois reste une US Person."},

  {id:4,emoji:'🔍',titre:"Les indices d’américanité (Indicia)",contenu:[
    {icon:'1️⃣',texte:"**Lieu de naissance** aux USA — même si la personne est citoyenne d’un autre pays"},
    {icon:'2️⃣',texte:"**Adresse de résidence** ou adresse postale (y compris une boîte postale) aux USA"},
    {icon:'3️⃣',texte:"**Numéro de téléphone** américain associé au compte"},
    {icon:'4️⃣',texte:"**Ordre de virement permanent** vers un compte américain"},
    {icon:'5️⃣',texte:"**Procuration ou délégation de signature** accordée à une personne ayant une adresse aux USA"},
    {icon:'6️⃣',texte:"**Adresse de correspondance 'care of'** ou 'hold mail' comme seule adresse du titulaire du compte"},
  ],aretenir:"Un seul indice détecté oblige i-Hub à demander une documentation complémentaire ou à reclassifier le client.",
  plusLoin:[
    {icon:'💡',texte:"Un indice ne signifie pas automatiquement US Person — mais déclenche une **obligation de vérification documentaire**"},
    {icon:'📋',texte:"Si le client fournit un **W-8BEN** valide avec certification de non-américanité, l’indice peut être levé"},
    {icon:'⚠️',texte:"En cas de contradiction entre les documents et les indices, la **présomption d’américanité** s’applique"},
  ]},

  {id:5,emoji:'📋',titre:"Le formulaire W-9",contenu:[
    {icon:'🎯',texte:"Le **W-9** est rempli par les **US Persons** — il certifie leur statut de contribuable américain"},
    {icon:'🔢',texte:"Il contient le **TIN** (Taxpayer Identification Number) — l’équivalent du numéro fiscal américain (SSN ou EIN)"},
    {icon:'✍️',texte:"Le client signe le W-9 **sous peine de parjure** — fausse déclaration = infraction pénale aux USA"},
    {icon:'📁',texte:"i-Hub doit conserver le W-9 et le **déclarer à l’ACD** avec les informations du compte"},
  ],aretenir:"W-9 = formulaire des US Persons. Sans TIN valide, i-Hub doit appliquer une retenue de substitution de 24%."},

  {id:6,emoji:'📝',titre:"Le formulaire W-8BEN (personnes physiques)",contenu:[
    {icon:'🎯',texte:"Le **W-8BEN** est rempli par les **non-US Persons** (personnes physiques) pour certifier leur statut non-américain"},
    {icon:'⏳',texte:"Sa validité est de **3 ans** à compter de la date de signature — il doit être renouvelé"},
    {icon:'🔄',texte:"En cas de **changement de circonstances** (ex: obtention de la nationalité américaine), le client doit remettre un nouveau formulaire **immédiatement**"},
    {icon:'💡',texte:"Il peut aussi permettre de bénéficier d’une **convention fiscale** entre le pays du client et les USA (réduction de retenue)"},
  ],aretenir:"W-8BEN = formulaire des non-US Persons physiques. Sa validité de 3 ans impose un suivi actif par i-Hub."},

  {id:7,emoji:'🏢',titre:"Le formulaire W-8BEN-E (entités)",contenu:[
    {icon:'🎯',texte:"Le **W-8BEN-E** est l’équivalent du W-8BEN pour les **entités** (sociétés, fonds, associations...)"},
    {icon:'📊',texte:"Il précise la **catégorie FATCA** de l’entité (IFE participante, IFE non-déclarante, NFFE active, NFFE passive...)"},
    {icon:'🔍',texte:"C’est le formulaire le plus **complexe** — il comporte plus de 30 parties selon le statut de l’entité"},
    {icon:'✅',texte:"i-Hub doit **vérifier la cohérence** entre le statut déclaré dans le W-8BEN-E et les informations disponibles"},
  ],aretenir:"W-8BEN-E = formulaire des entités non-américaines. Sa complexité exige une vérification par l’équipe Compliance.",
  plusLoin:[
    {icon:'📋',texte:"Une entité peut être une **IFE participante** (elle-même soumise à FATCA) — dans ce cas, elle fournit son **GIIN**"},
    {icon:'💡',texte:"Une **NFFE passive** avec des UBO américains > 10% doit déclarer ces UBO dans son W-8BEN-E"},
    {icon:'⚠️',texte:"Un W-8BEN-E incohérent ou incomplet oblige i-Hub à demander des clarifications avant tout service"},
  ]},

  {id:8,emoji:'🏦',titre:"i-Hub : quelle catégorie FATCA ?",contenu:[
    {icon:'🎯',texte:"i-Hub est une **IFE** (Institution Financière Étrangère) — une Foreign Financial Institution (FFI) selon FATCA"},
    {icon:'✅',texte:"i-Hub est une **IFE Participante** — elle a conclu un accord avec l’IRS via l’IGA luxembourgeois"},
    {icon:'🔢',texte:"i-Hub dispose d’un **GIIN** (Global Intermediary Identification Number) — son identifiant FATCA unique enregistré auprès de l’IRS"},
    {icon:'📋',texte:"En tant qu’IFE participante, i-Hub doit **classifier ses clients**, collecter les formulaires et déclarer à l’ACD"},
  ],aretenir:"i-Hub est une IFE participante avec un GIIN. Elle est directement responsable de ses obligations FATCA."},

  {id:9,emoji:'🗂️',titre:"Classification des clients : les grandes catégories",contenu:[
    {icon:'🇺🇸',texte:"**US Person spécifiée** : personne physique ou entité américaine à déclarer à l’IRS — le cœur de FATCA"},
    {icon:'🏦',texte:"**IFE participante / enregistrée** : institution financière elle-même soumise à FATCA — échange de GIIN"},
    {icon:'🔵',texte:"**NFFE active** : société non financière dont l’activité principale n’est pas financière — présomption de non-américanité"},
    {icon:'🟡',texte:"**NFFE passive** : holding ou entité patrimoniale — doit déclarer ses UBO américains éventuels"},
  ],aretenir:"Chaque client doit être classifié selon sa catégorie FATCA. La classification détermine les obligations documentaires."},

  {id:10,emoji:'📅',titre:"Le processus de due diligence FATCA",contenu:[
    {icon:'1️⃣',texte:"**Identifier** : collecter les informations d’entrée en relation et rechercher les indices d’américanité"},
    {icon:'2️⃣',texte:"**Documenter** : obtenir le formulaire W approprié (W-9, W-8BEN ou W-8BEN-E) selon le statut"},
    {icon:'3️⃣',texte:"**Classifier** : attribuer la catégorie FATCA correcte dans les systèmes d’i-Hub"},
    {icon:'4️⃣',texte:"**Surveiller** : mettre à jour les formulaires à l’expiration ou en cas de changement de circonstances"},
    {icon:'5️⃣',texte:"**Déclarer** : transmettre chaque année les données des comptes US à l’ACD avant le **30 juin**"},
  ],aretenir:"Le due diligence FATCA n’est pas un exercice unique — il s’étale sur toute la durée de la relation avec le client."},

  {id:11,emoji:'📊',titre:"Qu’est-ce qu’on déclare à l’ACD ?",contenu:[
    {icon:'👤',texte:"**Nom, adresse et TIN** du titulaire du compte américain"},
    {icon:'🔢',texte:"**Numéro du compte** et **solde ou valeur** au 31 décembre de l’année de déclaration"},
    {icon:'💰',texte:"**Revenus portés au crédit** du compte : intérêts, dividendes, produits de cession d’actifs américains"},
    {icon:'📅',texte:"La déclaration est annuelle — délai au **30 juin** de l’année suivante (ex: déclaration 2024 → 30 juin 2025)"},
  ],aretenir:"La déclaration FATCA porte sur le solde du compte ET les revenus. Une omission partielle est aussi une infraction.",
  plusLoin:[
    {icon:'📋',texte:"Le format de déclaration à l’ACD est standardisé — fichier **XML** selon les spécifications OCDE/IRS"},
    {icon:'🔍',texte:"L’ACD peut effectuer des **contrôles** sur les déclarations soumises par les IFE luxembourgeoises"},
    {icon:'💡',texte:"Les comptes de **valeur inférieure à 50 000 USD** peuvent bénéficier d’exemptions de déclaration selon l’IGA"},
  ]},

  {id:12,emoji:'💰',titre:"La retenue à la source de 30%",contenu:[
    {icon:'⚡',texte:"Si i-Hub ne coopère pas à FATCA, l’IRS impose une **retenue de 30%** sur tous les paiements de source US reçus"},
    {icon:'📋',texte:"Paiements concernés : intérêts, dividendes, loyers, salaires, commissions de source américaine"},
    {icon:'🛡️',texte:"Grâce à l’IGA signé, i-Hub échappe à cette retenue — à condition de respecter ses obligations FATCA"},
    {icon:'⚠️',texte:"Un client **récalcitrant** (qui refuse de fournir sa documentation) peut lui-même être soumis à la retenue de 30%"},
  ],aretenir:"La retenue de 30% est la sanction ultime de FATCA. L’IGA luxembourgeois protège i-Hub — à condition de respecter les règles."},

  {id:13,emoji:'🚫',titre:"Comptes et clients récalcitrants",contenu:[
    {icon:'🔴',texte:"Un compte est **récalcitrant** si son titulaire refuse de fournir les informations ou formulaires demandés"},
    {icon:'📋',texte:"i-Hub doit **signaler ces comptes à l’ACD** dans une catégorie spécifique — même sans les données complètes"},
    {icon:'⏱️',texte:"Un délai raisonnable est accordé au client pour se conformer — mais i-Hub ne peut pas indéfiniment différer"},
    {icon:'🚪',texte:"En dernier recours, i-Hub peut être amené à **clôturer le compte ou mettre fin à la relation** avec un client récalcitrant"},
  ],aretenir:"Un client qui refuse de s’identifier FATCA ne bloque pas la déclaration — il y figure comme 'récalcitrant'."},

  {id:14,emoji:'🏢',titre:"FATCA et les entités : NFFE active vs passive",contenu:[
    {icon:'🔵',texte:"**NFFE Active** : société opérationnelle dont moins de 50% des revenus et actifs sont passifs (ex: holding industrielle)"},
    {icon:'🟡',texte:"**NFFE Passive** : entité patrimoniale ou holding dont plus de 50% des revenus ou actifs sont passifs (intérêts, dividendes, loyers)"},
    {icon:'⚠️',texte:"Pour une **NFFE Passive**, i-Hub doit identifier les UBO qui sont des US Persons avec une participation > 10%"},
    {icon:'📋',texte:"Si des UBO américains sont identifiés dans une NFFE Passive, i-Hub **les déclare à l’ACD** comme comptes US"},
  ],aretenir:"Une NFFE passive avec des actionnaires américains > 10% est déclarable. La classification NFFE active ou passive est donc cruciale."},

  {id:15,emoji:'🔄',titre:"Surveillance continue et changements de circonstances",contenu:[
    {icon:'📅',texte:"Les formulaires W ont une **durée de vie limitée** : W-8 valide 3 ans, W-9 indéfini mais à renouveler si changement"},
    {icon:'🚨',texte:"Tout **changement de circonstances** (mariage, déménagement, acquisition de nationalité US) impose un nouveau formulaire"},
    {icon:'📰',texte:"i-Hub doit surveiller les **negative news** et les changements dans les bases publiques pouvant indiquer une américanité"},
    {icon:'🔔',texte:"Les systèmes d’i-Hub doivent générer des **alertes automatiques** avant l’expiration des formulaires W"},
  ],aretenir:"La classification FATCA n’est pas définitive. Un client non-US peut devenir US Person — i-Hub doit le détecter."},

  {id:16,emoji:'⚖️',titre:"Les sanctions en cas de manquement",contenu:[
    {icon:'💸',texte:"**Retenue de 30%** sur les paiements de source US — sanction principale pour les IFE non-coopérantes"},
    {icon:'📋',texte:"**Amendes ACD** pour déclarations incomplètes, incorrectes ou tardives — jusqu’à plusieurs milliers d’euros par compte"},
    {icon:'🏛️',texte:"**Sanctions pénales** pour les dirigeants en cas de manquements graves ou intentionnels à FATCA"},
    {icon:'📰',texte:"**Risque réputationnel** majeur — l’IRS publie la liste des IFE non-coopérantes"},
  ],aretenir:"Le coût du non-respect de FATCA dépasse largement le coût de la conformité. Aucun manquement ne peut être ignoré.",
  plusLoin:[
    {icon:'🔍',texte:"L’IRS dispose d’un **outil de recherche public** (FATCA FFI List) pour vérifier si une IFE est bien enregistrée"},
    {icon:'⚡',texte:"En 2023, l’IRS a renforcé les **pénalités pour TIN manquants** — les IFE sans TIN valide font face à des sanctions accrues"},
    {icon:'🤝',texte:"Le Luxembourg a mis en place un **programme de conformité** via l’ACD pour aider les IFE à se corriger sans sanction"},
  ]},

  {id:17,emoji:'🔗',titre:"FATCA vs CRS : quelles différences ?",contenu:[
    {icon:'🇺🇸',texte:"**FATCA** : initiative **unilatérale américaine** — seuls les comptes US sont déclarés, à l’IRS (via ACD)"},
    {icon:'🌍',texte:"**CRS** : initiative **multilatérale OCDE** — tous les comptes de résidents étrangers sont déclarés à leur pays de résidence"},
    {icon:'📊',texte:"FATCA se base sur la **nationalité/citoyenneté** (US Person), CRS se base sur la **résidence fiscale**"},
    {icon:'🔄',texte:"Un client peut être soumis aux deux : un résident français de nationalité américaine → FATCA **ET** CRS"},
  ],aretenir:"FATCA et CRS coexistent et peuvent s’appliquer au même client. i-Hub gère les deux cadres en parallèle.",},

  {id:18,emoji:'📁',titre:"Conservation des documents FATCA",contenu:[
    {icon:'📅',texte:"Tous les formulaires W et documents FATCA doivent être conservés **au minimum 5 ans** après la fin de la relation"},
    {icon:'🔒',texte:"Les données doivent être stockées de manière **sécurisée et confidentielle** — conformément au RGPD également"},
    {icon:'🔍',texte:"En cas de contrôle par l’ACD ou la CSSF, i-Hub doit être capable de **produire tout document** dans des délais courts"},
    {icon:'📋',texte:"Les formulaires doivent être **archivés par compte** avec leur date de collecte et leur statut (valide / expiré)"},
  ],aretenir:"Conserver = se protéger. Sans documentation traçable, i-Hub ne peut pas prouver sa conformité en cas de contrôle."},

  {id:19,emoji:'🤔',titre:"Cas pratiques : qui déclare quoi ?",contenu:[
    {icon:'🇺🇸',texte:"**Client US Person individuel** → W-9 obligatoire, compte déclaré à l’ACD avec solde et revenus"},
    {icon:'🏢',texte:"**Fonds luxembourgeois (IFE participante)** → W-8BEN-E avec GIIN, pas de déclaration compte — échange de GIIN"},
    {icon:'🏗️',texte:"**Holding passive avec actionnaire américain 15%** → W-8BEN-E NFFE Passive, déclaration de l’UBO américain"},
    {icon:'🤷',texte:"**Client qui refuse de remplir le W** → compte récalcitrant, déclaré comme tel à l’ACD, relation à risque"},
  ],aretenir:"Chaque situation client appelle une réponse documentaire précise. En cas de doute, l’équipe Compliance décide."},

  {id:20,emoji:'👨‍💼',titre:"Le rôle de chaque équipe chez i-Hub",contenu:[
    {icon:'🎯',texte:"**Équipe commerciale / onboarding** : collecte les formulaires W dès l’entrée en relation, détecte les indices d’américanité"},
    {icon:'🔍',texte:"**Équipe Compliance** : valide les classifications complexes (NFFE passive, situations mixtes), tranche les cas douteux"},
    {icon:'📊',texte:"**Équipe IT / Data** : gère les systèmes de surveillance, les alertes d’expiration et la génération des fichiers XML ACD"},
    {icon:'🏛️',texte:"**Direction** : responsable légale de la conformité FATCA d’i-Hub — engagement personnel vis-à-vis de l’IGA"},
  ],aretenir:"FATCA est l’affaire de toute l’entreprise — pas seulement de la Compliance. Chaque équipe a un rôle précis à jouer."},
]

const FICHES_EN = [
  {id:1,emoji:'🦅',titre:"What is FATCA?",contenu:[
    {icon:'🇺🇸',texte:"**FATCA** = Foreign Account Tax Compliance Act — US tax law enacted in **2010** under the Obama administration"},
    {icon:'🎯',texte:"Goal: force financial institutions **outside the US** to report accounts held by **US Persons** to the IRS"},
    {icon:'🌍',texte:"FATCA applies to all financial institutions worldwide — including **i-Hub** in Luxembourg"},
    {icon:'⚡',texte:"Non-cooperation penalty: **30% withholding tax** on all US-source payments"},
  ],aretenir:"FATCA is a US law with global reach. It requires i-Hub to identify and report its US clients to the IRS."},

  {id:2,emoji:'🤝',titre:"The Luxembourg-USA IGA",contenu:[
    {icon:'📜',texte:"Luxembourg signed a **Model 1 IGA** (Intergovernmental Agreement) with the US on **28 March 2014**"},
    {icon:'🏛️',texte:"Under the IGA, Luxembourg institutions report to the **Administration des Contributions Directes (ACD)** — not directly to the IRS"},
    {icon:'📋',texte:"The ACD then transmits data to the IRS — a **government-to-government** reporting system"},
    {icon:'⚖️',texte:"The Luxembourg law of **24 July 2015** transposes the IGA into national law — binding on all Luxembourg FFIs"},
  ],aretenir:"Thanks to the Model 1 IGA, i-Hub reports to the ACD (Luxembourg), not directly to the US IRS.",
  plusLoin:[
    {icon:'🌍',texte:"**Model 1 IGA** (Luxembourg) = reporting via local government. **Model 2 IGA** = direct reporting to the IRS"},
    {icon:'📅',texte:"Luxembourg was among the **first European countries** to sign a Model 1 IGA in 2014"},
    {icon:'🔄',texte:"The IGA is updated regularly — i-Hub must monitor ACD developments"},
  ]},

  {id:3,emoji:'👤',titre:"What is a US Person?",contenu:[
    {icon:'🇺🇸',texte:"**US Person** = any individual or entity subject to US tax — regardless of where they live"},
    {icon:'👶',texte:"US citizens (born in the US or naturalised), including **dual nationals** (e.g. Franco-American)"},
    {icon:'🏠',texte:"**US tax resident** = any person lawfully residing in the US (Green Card holder)"},
    {icon:'🏢',texte:"US entities: companies incorporated in the US, trusts governed by US law, US taxable estates"},
  ],aretenir:"A US Person does not necessarily live in the US. A Luxembourger born in New York who took Luxembourg nationality remains a US Person."},

  {id:4,emoji:'🔍',titre:"Indicia of US Status",contenu:[
    {icon:'1️⃣',texte:"**US place of birth** — even if the person holds citizenship of another country"},
    {icon:'2️⃣',texte:"**US residential or mailing address** (including a PO Box) on file"},
    {icon:'3️⃣',texte:"**US telephone number** associated with the account"},
    {icon:'4️⃣',texte:"**Standing transfer order** to a US account"},
    {icon:'5️⃣',texte:"**Power of attorney or signatory authority** granted to a person with a US address"},
    {icon:'6️⃣',texte:"**'Care of' or 'hold mail' address** as the only address on file for the account holder"},
  ],aretenir:"A single indicium detected requires i-Hub to request additional documentation or reclassify the client.",
  plusLoin:[
    {icon:'💡',texte:"An indicium does not automatically mean US Person — but triggers a **documentary verification obligation**"},
    {icon:'📋',texte:"If the client provides a valid **W-8BEN** certifying non-US status, the indicium can be rebutted"},
    {icon:'⚠️',texte:"If documents and indicia conflict, the **presumption of US status** applies"},
  ]},

  {id:5,emoji:'📋',titre:"The W-9 Form",contenu:[
    {icon:'🎯',texte:"The **W-9** is completed by **US Persons** — it certifies their US taxpayer status"},
    {icon:'🔢',texte:"It contains the **TIN** (Taxpayer Identification Number) — the US tax ID (SSN or EIN)"},
    {icon:'✍️',texte:"The client signs the W-9 **under penalty of perjury** — false declaration = criminal offence under US law"},
    {icon:'📁',texte:"i-Hub must retain the W-9 and **report it to the ACD** with the account information"},
  ],aretenir:"W-9 = US Person form. Without a valid TIN, i-Hub must apply a 24% backup withholding tax."},

  {id:6,emoji:'📝',titre:"The W-8BEN Form (individuals)",contenu:[
    {icon:'🎯',texte:"The **W-8BEN** is completed by **non-US Persons** (individuals) to certify their non-US status"},
    {icon:'⏳',texte:"Valid for **3 years** from the date of signature — must be renewed"},
    {icon:'🔄',texte:"In case of a **change in circumstances** (e.g. acquiring US nationality), the client must submit a new form **immediately**"},
    {icon:'💡',texte:"It may also allow the client to benefit from a **tax treaty** between their country and the US (reduced withholding)"},
  ],aretenir:"W-8BEN = non-US individual form. Its 3-year validity requires active tracking by i-Hub."},

  {id:7,emoji:'🏢',titre:"The W-8BEN-E Form (entities)",contenu:[
    {icon:'🎯',texte:"The **W-8BEN-E** is the equivalent of W-8BEN for **entities** (companies, funds, associations...)"},
    {icon:'📊',texte:"It specifies the entity’s **FATCA category** (Participating FFI, Non-Reporting FFI, Active NFFE, Passive NFFE...)"},
    {icon:'🔍',texte:"It is the most **complex form** — over 30 parts depending on the entity’s status"},
    {icon:'✅',texte:"i-Hub must **verify consistency** between the declared status in W-8BEN-E and available information"},
  ],aretenir:"W-8BEN-E = non-US entity form. Its complexity requires review by the Compliance team.",
  plusLoin:[
    {icon:'📋',texte:"An entity may be a **participating FFI** (itself subject to FATCA) — in that case, it provides its **GIIN**"},
    {icon:'💡',texte:"A **passive NFFE** with US beneficial owners > 10% must disclose those UBOs in its W-8BEN-E"},
    {icon:'⚠️',texte:"An inconsistent or incomplete W-8BEN-E requires i-Hub to seek clarification before providing services"},
  ]},

  {id:8,emoji:'🏦',titre:"i-Hub: what FATCA category?",contenu:[
    {icon:'🎯',texte:"i-Hub is an **FFI** (Foreign Financial Institution) — a financial institution outside the US under FATCA"},
    {icon:'✅',texte:"i-Hub is a **Participating FFI** — it has entered into an agreement with the IRS via the Luxembourg IGA"},
    {icon:'🔢',texte:"i-Hub has a **GIIN** (Global Intermediary Identification Number) — its unique FATCA identifier registered with the IRS"},
    {icon:'📋',texte:"As a participating FFI, i-Hub must **classify clients**, collect forms and report to the ACD"},
  ],aretenir:"i-Hub is a participating FFI with a GIIN. It is directly responsible for its FATCA obligations."},

  {id:9,emoji:'🗂️',titre:"Client classification: main categories",contenu:[
    {icon:'🇺🇸',texte:"**Specified US Person**: US individual or entity to be reported to the IRS — the core of FATCA"},
    {icon:'🏦',texte:"**Participating / registered FFI**: financial institution itself subject to FATCA — GIIN exchange"},
    {icon:'🔵',texte:"**Active NFFE**: operating company whose main activity is non-financial — presumed non-US"},
    {icon:'🟡',texte:"**Passive NFFE**: holding or investment entity — must disclose any US beneficial owners"},
  ],aretenir:"Every client must be classified under a FATCA category. Classification determines documentary obligations."},

  {id:10,emoji:'📅',titre:"The FATCA due diligence process",contenu:[
    {icon:'1️⃣',texte:"**Identify**: collect onboarding information and search for US indicia"},
    {icon:'2️⃣',texte:"**Document**: obtain the appropriate W form (W-9, W-8BEN or W-8BEN-E) based on status"},
    {icon:'3️⃣',texte:"**Classify**: assign the correct FATCA category in i-Hub’s systems"},
    {icon:'4️⃣',texte:"**Monitor**: update forms on expiry or upon change of circumstances"},
    {icon:'5️⃣',texte:"**Report**: transmit account data for US accounts to the ACD annually before **30 June**"},
  ],aretenir:"FATCA due diligence is not a one-off exercise — it spans the entire client relationship."},

  {id:11,emoji:'📊',titre:"What is reported to the ACD?",contenu:[
    {icon:'👤',texte:"**Name, address and TIN** of the US account holder"},
    {icon:'🔢',texte:"**Account number** and **balance or value** as of 31 December of the reporting year"},
    {icon:'💰',texte:"**Income credited** to the account: interest, dividends, proceeds from US asset disposals"},
    {icon:'📅',texte:"Reporting is annual — deadline **30 June** of the following year (e.g. 2024 report → 30 June 2025)"},
  ],aretenir:"FATCA reporting covers both the account balance AND income. A partial omission is also a violation.",
  plusLoin:[
    {icon:'📋',texte:"The reporting format to the ACD is standardised — **XML file** per OECD/IRS specifications"},
    {icon:'🔍',texte:"The ACD may carry out **checks** on declarations submitted by Luxembourg FFIs"},
    {icon:'💡',texte:"Accounts **below USD 50,000** may benefit from reporting exemptions under the IGA"},
  ]},

  {id:12,emoji:'💰',titre:"The 30% withholding tax",contenu:[
    {icon:'⚡',texte:"If i-Hub does not cooperate with FATCA, the IRS imposes a **30% withholding** on all US-source payments received"},
    {icon:'📋',texte:"Payments covered: US-source interest, dividends, rents, wages, commissions"},
    {icon:'🛡️',texte:"Thanks to the signed IGA, i-Hub avoids this withholding — provided it meets its FATCA obligations"},
    {icon:'⚠️',texte:"A **recalcitrant** client (who refuses to provide documentation) may themselves be subject to 30% withholding"},
  ],aretenir:"The 30% withholding is FATCA’s ultimate sanction. The Luxembourg IGA protects i-Hub — as long as rules are followed."},

  {id:13,emoji:'🚫',titre:"Recalcitrant accounts and clients",contenu:[
    {icon:'🔴',texte:"An account is **recalcitrant** if the holder refuses to provide the requested information or forms"},
    {icon:'📋',texte:"i-Hub must **report these accounts to the ACD** in a specific category — even without complete data"},
    {icon:'⏱️',texte:"A reasonable deadline is given to the client to comply — but i-Hub cannot defer indefinitely"},
    {icon:'🚪',texte:"As a last resort, i-Hub may need to **close the account or end the relationship** with a recalcitrant client"},
  ],aretenir:"A client who refuses to self-certify does not block the report — they appear as 'recalcitrant'."},

  {id:14,emoji:'🏢',titre:"FATCA and entities: Active vs Passive NFFE",contenu:[
    {icon:'🔵',texte:"**Active NFFE**: operating company where less than 50% of income and assets are passive (e.g. industrial holding)"},
    {icon:'🟡',texte:"**Passive NFFE**: investment or patrimonial entity where more than 50% of income or assets are passive (interest, dividends, rent)"},
    {icon:'⚠️',texte:"For a **Passive NFFE**, i-Hub must identify UBOs who are US Persons with an ownership interest > 10%"},
    {icon:'📋',texte:"If US UBOs are identified in a Passive NFFE, i-Hub **reports them to the ACD** as US accounts"},
  ],aretenir:"A passive NFFE with US shareholders > 10% is reportable. Active vs Passive NFFE classification is therefore critical."},

  {id:15,emoji:'🔄',titre:"Ongoing monitoring and change of circumstances",contenu:[
    {icon:'📅',texte:"W forms have a **limited lifespan**: W-8 valid 3 years, W-9 indefinite but must be renewed on change"},
    {icon:'🚨',texte:"Any **change of circumstances** (marriage, relocation, acquisition of US nationality) requires a new form"},
    {icon:'📰',texte:"i-Hub must monitor **negative news** and changes in public records that may indicate US status"},
    {icon:'🔔',texte:"i-Hub’s systems must generate **automatic alerts** before W forms expire"},
  ],aretenir:"FATCA classification is not final. A non-US client can become a US Person — i-Hub must detect this."},

  {id:16,emoji:'⚖️',titre:"Penalties for non-compliance",contenu:[
    {icon:'💸',texte:"**30% withholding** on US-source payments — main penalty for non-cooperating FFIs"},
    {icon:'📋',texte:"**ACD fines** for incomplete, incorrect or late declarations — up to several thousand euros per account"},
    {icon:'🏛️',texte:"**Criminal sanctions** for managers in cases of serious or wilful FATCA breaches"},
    {icon:'📰',texte:"**Major reputational risk** — the IRS publishes a list of non-cooperating FFIs"},
  ],aretenir:"The cost of FATCA non-compliance far exceeds the cost of compliance. No breach can be ignored.",
  plusLoin:[
    {icon:'🔍',texte:"The IRS has a **public search tool** (FATCA FFI List) to verify whether an FFI is properly registered"},
    {icon:'⚡',texte:"In 2023, the IRS strengthened **penalties for missing TINs** — FFIs without valid TINs face increased sanctions"},
    {icon:'🤝',texte:"Luxembourg has a **compliance programme** via the ACD to help FFIs self-correct without penalty"},
  ]},

  {id:17,emoji:'🔗',titre:"FATCA vs CRS: key differences",contenu:[
    {icon:'🇺🇸',texte:"**FATCA**: **unilateral US initiative** — only US accounts are reported, to the IRS (via ACD)"},
    {icon:'🌍',texte:"**CRS**: **multilateral OECD initiative** — all accounts of foreign residents are reported to their country of residence"},
    {icon:'📊',texte:"FATCA is based on **nationality/citizenship** (US Person), CRS is based on **tax residency**"},
    {icon:'🔄',texte:"A client may be subject to both: a French resident of US nationality → FATCA **AND** CRS"},
  ],aretenir:"FATCA and CRS coexist and may apply to the same client. i-Hub manages both frameworks in parallel."},

  {id:18,emoji:'📁',titre:"Retention of FATCA documents",contenu:[
    {icon:'📅',texte:"All W forms and FATCA documents must be retained for **at least 5 years** after the end of the relationship"},
    {icon:'🔒',texte:"Data must be stored **securely and confidentially** — also in line with GDPR requirements"},
    {icon:'🔍',texte:"In the event of an ACD or CSSF audit, i-Hub must be able to **produce any document** within short deadlines"},
    {icon:'📋',texte:"Forms must be **archived by account** with their collection date and status (valid / expired)"},
  ],aretenir:"Retention = protection. Without traceable documentation, i-Hub cannot prove compliance in an audit."},

  {id:19,emoji:'🤔',titre:"Case studies: who reports what?",contenu:[
    {icon:'🇺🇸',texte:"**Individual US Person client** → W-9 required, account reported to ACD with balance and income"},
    {icon:'🏢',texte:"**Luxembourg fund (participating FFI)** → W-8BEN-E with GIIN, no account report — GIIN exchange"},
    {icon:'🏗️',texte:"**Passive holding with 15% US shareholder** → W-8BEN-E Passive NFFE, US UBO reported"},
    {icon:'🤷',texte:"**Client who refuses to complete the W form** → recalcitrant account, reported as such to the ACD"},
  ],aretenir:"Each client situation calls for a precise documentary response. When in doubt, the Compliance team decides."},

  {id:20,emoji:'👨‍💼',titre:"Each team’s role at i-Hub",contenu:[
    {icon:'🎯',texte:"**Commercial / onboarding team**: collects W forms at onboarding, detects US indicia"},
    {icon:'🔍',texte:"**Compliance team**: validates complex classifications (passive NFFE, mixed situations), decides borderline cases"},
    {icon:'📊',texte:"**IT / Data team**: manages monitoring systems, expiry alerts and ACD XML file generation"},
    {icon:'🏛️',texte:"**Management**: legally responsible for i-Hub’s FATCA compliance — personal commitment under the IGA"},
  ],aretenir:"FATCA is everyone’s responsibility — not just Compliance. Each team has a precise role to play."},
]

const MATCHING_FR = [
  {sigle:'FATCA',definition:'Loi fiscale américaine sur les comptes étrangers'},
  {sigle:'IGA',definition:'Accord intergouvernemental USA-Luxembourg'},
  {sigle:'US Person',definition:'Personne soumise à l’impôt américain'},
  {sigle:'GIIN',definition:'Numéro d’identification FATCA d’une IFE'},
  {sigle:'W-9',definition:'Formulaire rempli par les US Persons'},
  {sigle:'W-8BEN',definition:'Formulaire de non-américanité (particuliers)'},
  {sigle:'W-8BEN-E',definition:'Formulaire de non-américanité (entités)'},
  {sigle:'NFFE Passive',definition:'Entité patrimoniale devant déclarer ses UBO US'},
  {sigle:'TIN',definition:'Numéro fiscal américain'},
  {sigle:'ACD',definition:'Autorité luxembourgeoise qui reçoit les déclarations FATCA'},
  {sigle:'IFE',definition:'Institution financière étrangère soumise à FATCA'},
  {sigle:'Indice',definition:'Signe d’une possible américanité du client'},
]
const MATCHING_EN = [
  {sigle:'FATCA',definition:'US tax law on foreign accounts'},
  {sigle:'IGA',definition:'US-Luxembourg intergovernmental agreement'},
  {sigle:'US Person',definition:'Person subject to US taxation'},
  {sigle:'GIIN',definition:'FATCA identification number of an FFI'},
  {sigle:'W-9',definition:'Form completed by US Persons'},
  {sigle:'W-8BEN',definition:'Non-US status form (individuals)'},
  {sigle:'W-8BEN-E',definition:'Non-US status form (entities)'},
  {sigle:'Passive NFFE',definition:'Investment entity that must disclose US UBOs'},
  {sigle:'TIN',definition:'US tax identification number'},
  {sigle:'ACD',definition:'Luxembourg authority receiving FATCA reports'},
  {sigle:'FFI',definition:'Foreign financial institution subject to FATCA'},
  {sigle:'Indicium',definition:'Sign of a client’s possible US status'},
]

const VF_FR = [
  {texte:"FATCA a été adoptée en 2010 par le gouvernement américain",reponse:true,explication:"Exact ! FATCA est une loi de 2010, adoptée sous la présidence Obama."},
  {texte:"i-Hub déclare directement à l’IRS américain",reponse:false,explication:"Non ! Grâce à l’IGA Modèle 1, i-Hub déclare à l’ACD luxembourgeoise, qui transmet ensuite à l’IRS."},
  {texte:"Un citoyen américain vivant au Luxembourg est une US Person",reponse:true,explication:"Exact ! La citoyenneté américaine entraîne le statut de US Person indépendamment du lieu de résidence."},
  {texte:"Le W-8BEN est valable indéfiniment",reponse:false,explication:"Non ! Le W-8BEN est valide 3 ans seulement. i-Hub doit surveiller les dates d’expiration."},
  {texte:"La retenue FATCA peut atteindre 30% des paiements de source US",reponse:true,explication:"Exact ! C’est la sanction principale pour les IFE non-coopérantes avec FATCA."},
  {texte:"Une NFFE Active doit déclarer ses UBO américains",reponse:false,explication:"Non ! C’est la NFFE Passive qui doit déclarer ses UBO américains au-delà de 10%."},
  {texte:"Un compte récalcitrant doit être déclaré à l’ACD",reponse:true,explication:"Exact ! i-Hub déclare les comptes récalcitrants dans une catégorie spécifique, même sans données complètes."},
  {texte:"FATCA et CRS sont des dispositifs identiques",reponse:false,explication:"Non ! FATCA est américain et basé sur la nationalité. CRS est multilatéral et basé sur la résidence fiscale."},
  {texte:"Le W-9 est rempli par les personnes qui ne sont pas américaines",reponse:false,explication:"Non ! Le W-9 est rempli par les US Persons. Les non-américains remplissent le W-8BEN ou W-8BEN-E."},
  {texte:"Les documents FATCA doivent être conservés au moins 5 ans",reponse:true,explication:"Exact ! La durée minimale de conservation est de 5 ans après la fin de la relation d’affaires."},
  {texte:"Un numéro de téléphone américain est un indice d’américanité",reponse:true,explication:"Exact ! C’est l’un des 6 indices d’américanité qui obligent i-Hub à vérifier le statut du client."},
  {texte:"La déclaration annuelle FATCA doit être faite avant le 31 décembre",reponse:false,explication:"Non ! La déclaration FATCA à l’ACD est due avant le 30 juin de l’année suivante."},
]
const VF_EN = [
  {texte:"FATCA was enacted in 2010 by the US government",reponse:true,explication:"Correct! FATCA is a 2010 law enacted under the Obama presidency."},
  {texte:"i-Hub reports directly to the US IRS",reponse:false,explication:"No! Thanks to the Model 1 IGA, i-Hub reports to the Luxembourg ACD, which then forwards to the IRS."},
  {texte:"A US citizen living in Luxembourg is a US Person",reponse:true,explication:"Correct! US citizenship creates US Person status regardless of place of residence."},
  {texte:"The W-8BEN is valid indefinitely",reponse:false,explication:"No! The W-8BEN is only valid for 3 years. i-Hub must monitor expiry dates."},
  {texte:"FATCA withholding can reach 30% of US-source payments",reponse:true,explication:"Correct! This is the main penalty for FFIs not cooperating with FATCA."},
  {texte:"An Active NFFE must disclose its US beneficial owners",reponse:false,explication:"No! It’s the Passive NFFE that must disclose US beneficial owners above 10%."},
  {texte:"A recalcitrant account must be reported to the ACD",reponse:true,explication:"Correct! i-Hub reports recalcitrant accounts in a specific category, even without complete data."},
  {texte:"FATCA and CRS are identical frameworks",reponse:false,explication:"No! FATCA is a US initiative based on nationality. CRS is multilateral and based on tax residency."},
  {texte:"The W-9 is completed by non-US persons",reponse:false,explication:"No! The W-9 is completed by US Persons. Non-US persons complete the W-8BEN or W-8BEN-E."},
  {texte:"FATCA documents must be retained for at least 5 years",reponse:true,explication:"Correct! The minimum retention period is 5 years after the end of the business relationship."},
  {texte:"A US telephone number is an indicium of US status",reponse:true,explication:"Correct! It is one of the 6 indicia that require i-Hub to verify the client’s status."},
  {texte:"The annual FATCA report must be filed before 31 December",reponse:false,explication:"No! The FATCA report to the ACD is due before 30 June of the following year."},
]

const CAS_FR = [
  {situation:"Un client indique être né à Miami mais détient la nationalité luxembourgeoise depuis 10 ans. Il refuse de remplir un formulaire.",action:"Compte récalcitrant — déclarer à l’ACD et envisager la clôture",options:["Rien — il est luxembourgeois","W-8BEN suffit","Compte récalcitrant — déclarer à l’ACD et envisager la clôture","W-9 obligatoire"],explication:"La naissance à Miami est un indice d’américanité. Sans documentation, le compte est récalcitrant."},
  {situation:"Une société luxembourgeoise (fonds SICAV) enregistrée à l’IRS fournit son GIIN.",action:"W-8BEN-E avec GIIN — pas de déclaration compte",options:["W-9 obligatoire","W-8BEN-E avec GIIN — pas de déclaration compte","Pas de formulaire nécessaire","Déclarer à l’ACD comme US Person"],explication:"Une IFE participante (SICAV enregistrée) fournit son GIIN via W-8BEN-E — pas de déclaration de compte."},
  {situation:"Une holding luxembourgeoise passive a un actionnaire américain détenant 15% du capital.",action:"W-8BEN-E NFFE Passive + déclarer l’UBO américain à l’ACD",options:["W-8BEN-E NFFE Active — rien à déclarer","W-8BEN-E NFFE Passive + déclarer l’UBO américain à l’ACD","Pas de déclaration — seuil de 25% non atteint","W-9 pour la holding"],explication:"15% > 10% → l’UBO américain dans une NFFE Passive doit être déclaré à l’ACD. Le seuil FATCA est 10%, pas 25%."},
  {situation:"Un client remet un W-8BEN signé en 2021. Nous sommes en 2025.",action:"Demander un nouveau W-8BEN — l’ancien a expiré",options:["Conserver l’ancien — il reste valable","Demander un nouveau W-8BEN — l’ancien a expiré","Reclassifier comme US Person","Aucune action nécessaire"],explication:"Le W-8BEN de 2021 a expiré en 2024 (valide 3 ans). Un nouveau formulaire est obligatoire."},
  {situation:"Un particulier américain (Green Card) souhaite utiliser les services d’i-Hub.",action:"W-9 obligatoire + déclaration à l’ACD",options:["W-8BEN car il réside au Luxembourg","W-9 obligatoire + déclaration à l’ACD","Aucun formulaire — pas de lien avec les USA","W-8BEN-E car c’est une entité"],explication:"Un détenteur de Green Card est une US Person — W-9 obligatoire et déclaration à l’ACD."},
]
const CAS_EN = [
  {situation:"A client states they were born in Miami but has held Luxembourg nationality for 10 years. They refuse to complete any form.",action:"Recalcitrant account — report to ACD and consider closure",options:["Nothing — they are Luxembourg national","W-8BEN is sufficient","Recalcitrant account — report to ACD and consider closure","W-9 mandatory"],explication:"Birth in Miami is a US indicium. Without documentation, the account is recalcitrant."},
  {situation:"A Luxembourg SICAV registered with the IRS provides its GIIN.",action:"W-8BEN-E with GIIN — no account report",options:["W-9 mandatory","W-8BEN-E with GIIN — no account report","No form required","Report to ACD as US Person"],explication:"A participating FFI (registered SICAV) provides its GIIN via W-8BEN-E — no account report."},
  {situation:"A Luxembourg passive holding company has a US shareholder holding 15% of capital.",action:"W-8BEN-E Passive NFFE + report US UBO to ACD",options:["W-8BEN-E Active NFFE — nothing to report","W-8BEN-E Passive NFFE + report US UBO to ACD","No report — 25% threshold not reached","W-9 for the holding"],explication:"15% > 10% → the US UBO in a Passive NFFE must be reported to the ACD. FATCA threshold is 10%, not 25%."},
  {situation:"A client submits a W-8BEN signed in 2021. We are now in 2025.",action:"Request a new W-8BEN — the old one has expired",options:["Keep the old one — still valid","Request a new W-8BEN — the old one has expired","Reclassify as US Person","No action needed"],explication:"The 2021 W-8BEN expired in 2024 (valid 3 years). A new form is mandatory."},
  {situation:"A US individual (Green Card holder) wishes to use i-Hub’s services.",action:"W-9 mandatory + report to ACD",options:["W-8BEN as they reside in Luxembourg","W-9 mandatory + report to ACD","No form — no US link","W-8BEN-E as it is an entity"],explication:"A Green Card holder is a US Person — W-9 is mandatory and reporting to ACD required."},
]

export default function ModuleFatca() {
  const router = useRouter()
  const [lang, setLang] = useState('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)

  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN
  const C = '#e07b39'

  const [activeMatching, setActiveMatching] = useState(() => pickRandom(MATCHING_FR, 6))
  const [matchSelected, setMatchSelected] = useState(null)
  const [matchPairs, setMatchPairs] = useState({})
  const [matchError, setMatchError] = useState(null)

  const [activeVF, setActiveVF] = useState(() => pickRandom(VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState(null)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l) {
    const bm = l==='fr'?MATCHING_FR:MATCHING_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveMatching(pickRandom(bm,6))
    setMatchPairs({}); setMatchSelected(null); setMatchError(null)
    setActiveVF(pickRandom(bv,6))
    setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
    setActiveCas(pickRandom(bc,3))
    setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }

  function switchLang(l) {
    saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l)
  }

  function handleMatchSigle(sigle) { if (matchPairs[sigle]) return; setMatchSelected(sigle); setMatchError(null) }
  function handleMatchDef(def) {
    if (!matchSelected) return
    const correct = activeMatching.find(m => m.sigle===matchSelected)?.definition
    if (correct===def) {
      const np={...matchPairs,[matchSelected]:def}; setMatchPairs(np); setMatchSelected(null)
      if (Object.keys(np).length===activeMatching.length) setScore(s=>s+15)
    } else { setMatchError(lang==='fr'?\`❌ "\${def}" ne correspond pas à \${matchSelected}.\`:\`❌ "\${def}" does not match \${matchSelected}.\`); setMatchSelected(null) }
  }

  function repondreVF(rep) {
    if (vfRepondu!==null) return
    const correct=activeVF[vfIndex].reponse===rep; setVfRepondu(rep); setVfAnimation(correct?'correct':'wrong')
    if (correct) setVfScore(s=>s+1)
    setTimeout(() => {
      setVfAnimation(null); setVfRepondu(null)
      if (vfIndex+1 < activeVF.length) { setVfIndex(i=>i+1) }
      else { const fs=correct?vfScore+1:vfScore; setScore(s=>s+fs*5); setPhase('quiz3') }
    }, 2200)
  }

  function repCas(opt) {
    if (casRepondu!==null) return
    const correct=opt===activeCas[casIndex].action
    setCasRepondu(opt)
    if (correct) setCasScore(s=>s+1)
  }
  function nextCas() {
    if (casIndex+1 < activeCas.length) { setCasIndex(i=>i+1); setCasRepondu(null) }
    else { setScore(s=>s+casScore*7); setPhase('resultat') }
  }

  const base = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }

  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.push('/')} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#ffffff',fontWeight:'700',fontSize:'16px'}}>🦅 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          <button onClick={()=>switchLang('fr')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='fr'?C:'transparent',color:'white',transition:'all 0.2s'}}>🇫🇷 FR</button>
          <button onClick={()=>switchLang('en')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='en'?C:'transparent',color:'white',transition:'all 0.2s'}}>🇬🇧 EN</button>
        </div>
        <span style={{background:'white',border:\`1px solid \${C}\`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🦅</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'18px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'32px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=>(
            <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}>
              <span style={{color:C,fontWeight:'700'}}>✓</span>
              <span style={{color:'#4b5563',fontSize:'15px'}}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'32px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.quiz,icon:'🎮'},{label:t.time,icon:'⏱️'}].map((b,i)=>(
            <div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>
          ))}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer',boxShadow:\`0 4px 20px \${C}50\`}}>{t.start}</button>
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
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'200px'}}>
              {FICHES.map((_,i)=>(<div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>))}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',boxShadow:\`0 8px 40px \${C}15\`,border:\`2px solid \${C}30\`,overflow:'hidden',marginBottom:'20px'}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0,lineHeight:1.3}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                </div>
              ))}
              <div style={{background:\`\${C}10\`,border:\`1px solid \${C}30\`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>💡</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
              {fiche.plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen(o=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:\`1.5px solid \${C}\`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'}}>
                    <span>{t.goFurther}</span>
                    <span style={{transition:'transform 0.3s',transform:plusLoinOpen?'rotate(180deg)':'rotate(0deg)',display:'inline-block'}}>▾</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:\`\${C}08\`,border:\`1px solid \${C}25\`,borderRadius:'0 0 10px 10px',padding:'16px',marginTop:'-4px',borderTop:'none'}}>
                      {fiche.plusLoin.map((item,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:i<fiche.plusLoin.length-1?\`1px solid \${C}20\`:'none'}}>
                          <span style={{fontSize:'20px',minWidth:'28px',textAlign:'center'}}>{item.icon}</span>
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
            {ficheIndex>0 && <button onClick={()=>{setFicheIndex(i=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontSize:'15px',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')}
              style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700',boxShadow:\`0 4px 16px \${C}40\`}}>
              {ficheIndex<FICHES.length-1?\`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) →\`:t.quizBtn}
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
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz1label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.quiz1title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.quiz1sub}</p>
          </div>
          {matchError && <div style={{background:'#fee2e2',border:'1px solid #fca5a5',borderRadius:'12px',padding:'12px 16px',marginBottom:'16px',color:'#dc2626',fontSize:'14px',textAlign:'center'}}>{matchError}</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.sigles}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {activeMatching.map(m=>{const ip=!!matchPairs[m.sigle],is=matchSelected===m.sigle;return(
                  <button key={m.sigle} onClick={()=>handleMatchSigle(m.sigle)} disabled={ip}
                    style={{padding:'12px',borderRadius:'10px',fontSize:'14px',fontWeight:'700',cursor:ip?'default':'pointer',transition:'all 0.2s',background:ip?'#d1fae5':is?C:'white',color:ip?'#059669':is?'white':'#1f2937',border:ip?'1.5px solid #6ee7b7':is?\`1.5px solid \${C}\`:'1.5px solid #e5e7eb',boxShadow:is?\`0 4px 16px \${C}40\`:'none'}}>
                    {ip?'✓ ':''}{m.sigle}
                  </button>
                )})}
              </div>
            </div>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.definitions}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {shuffle(activeMatching.map(m=>({definition:m.definition}))).map(m=>{const ip=Object.values(matchPairs).includes(m.definition);return(
                  <button key={m.definition} onClick={()=>handleMatchDef(m.definition)} disabled={ip||!matchSelected}
                    style={{padding:'12px',borderRadius:'10px',fontSize:'13px',fontWeight:'500',cursor:(ip||!matchSelected)?'default':'pointer',transition:'all 0.2s',textAlign:'left',background:ip?'#d1fae5':matchSelected?'white':'#f9fafb',color:ip?'#059669':'#374151',border:ip?'1.5px solid #6ee7b7':'1.5px solid #e5e7eb',opacity:(!matchSelected&&!ip)?0.6:1}}>
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
    const q=activeVF[vfIndex]
    return (
      <div style={{...base,background:vfAnimation==='correct'?'#d1fae5':vfAnimation==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar/>
        <div style={{background:vfAnimation==='correct'?'#6ee7b7':vfAnimation==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:\`\${(vfIndex/activeVF.length)*100}%\`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'24px'}}>{t.quiz2label} — {vfIndex+1}/{activeVF.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.quiz2title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'32px 24px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'28px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'18px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
          </div>
          {vfRepondu===null?(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={()=>repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={()=>repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#dc2626',cursor:'pointer'}}>{t.false}</button>
            </div>
          ):(
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnimation==='correct'?'#059669':'#dc2626',fontSize:'18px',margin:'0 0 8px'}}>{vfAnimation==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'15px',margin:0,fontStyle:'italic'}}>{q.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
            {activeVF.map((_,i)=><div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=vfIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase==='quiz3') {
    const cas=activeCas[casIndex]
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${((casIndex)/activeCas.length)*100}%\`,transition:'width 0.4s ease'}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.quiz3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.quiz3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:\`2px solid \${C}30\`,marginBottom:'20px',boxShadow:\`0 4px 20px \${C}10\`}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#1f2937',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu===null?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i)=>(
                <button key={i} onClick={()=>repCas(opt)}
                  style={{padding:'16px 20px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left',transition:'all 0.15s'}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor=C;e.currentTarget.style.background=\`\${C}08\`}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ):(
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px'}}>
                {cas.options.map((opt,i)=>{
                  const isCorrect=opt===cas.action; const isChosen=opt===casRepondu
                  return <div key={i} style={{padding:'16px 20px',background:isCorrect?'#d1fae5':isChosen?'#fee2e2':'white',border:\`1.5px solid \${isCorrect?'#6ee7b7':isChosen?'#fca5a5':'#e5e7eb'}\`,borderRadius:'12px',fontSize:'14px',fontWeight:'600',color:isCorrect?'#059669':isChosen?'#dc2626':'#9ca3af'}}>
                    {isCorrect?'✅ ':isChosen?'❌ ':''}{opt}
                  </div>
                })}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
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
        <h2 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{msg}</h2>
        <p style={{color:'#4b5563',fontSize:'16px',marginBottom:'32px'}}>{t.resultTitle}</p>
        <div style={{background:'white',borderRadius:'20px',padding:'32px',boxShadow:\`0 8px 32px \${C}10\`,marginBottom:'24px'}}>
          <div style={{fontSize:'56px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'24px'}}>/100</span></div>
          <p style={{color:'#6b7280',margin:'0 0 20px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#f3f4f6',borderRadius:'8px',height:'12px',overflow:'hidden'}}>
            <div style={{background:\`linear-gradient(90deg,\${C},#f59e0b)\`,height:'12px',width:\`\${total}%\`,borderRadius:'8px'}}/>
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
`, "utf8");
console.log("✅ app/modules/fatca/page.tsx écrit !");
