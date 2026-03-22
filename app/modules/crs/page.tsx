'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const UI = {
  fr: {
    title: 'CRS', subtitle: 'Common Reporting Standard — L’échange automatique d’informations fiscales',
    learn: '📚 Ce que vous allez apprendre :', learnItems: ["Le principe du CRS et son cadre juridique au Luxembourg","La différence fondamentale entre CRS et FATCA","La notion de résidence fiscale et d’auto-certification","Le rôle d’i-Hub comme Institution Financière Déclarante","La classification CRS des entités (ENF Active, ENF Passive)","Les sanctions en cas de manquement au CRS"],
    fiches:'15 fiches', quiz:'3 quiz fun', time:'~15 min',
    start:"C’est parti ! 🚀", prev:'← Précédent', next:'Fiche suivante',
    quizBtn:'🎮 Passer aux quiz !', toRetain:'À RETENIR', goFurther:'🔍 Aller plus loin',
    home:'← Accueil', pts:'🪙',
    quiz1label:'QUIZ 1/3 · ASSOCIER LES PAIRES', quiz1title:'🧩 Reliez chaque terme à sa définition',
    quiz1sub:"Cliquez d’abord sur un terme, puis sur sa définition",
    sigles:'Termes', definitions:'Définitions', quiz1done:'Parfait ! Tous les termes associés !',
    quiz2label:'QUIZ 2/3 · VRAI OU FAUX', quiz2title:'✅ Vrai ou Faux — CRS en pratique',
    true:'✅ VRAI', false:'❌ FAUX', correct:'Bravo !', wrong:'Pas tout à fait...',
    quiz3label:'QUIZ 3/3 · CAS PRATIQUES', quiz3title:'🔍 Analysez la situation',
    quiz3sub:'Quelle action s’impose ?',
    resultTitle:'Module CRS terminé — 15 fiches maîtrisées !',
    backHome:'← Retour aux modules', restart:'🔄 Recommencer ce module',
    pts_gained:'points gagnés', medal_gold:'Expert CRS !',
    medal_silver:'Bon résultat, continuez !', medal_bronze:'Relisez les fiches et réessayez !',
    score:'Score total', next2:'Quiz suivant →', last:'Dernier quiz →',
  },
  en: {
    title: 'CRS', subtitle: 'Common Reporting Standard — Automatic exchange of tax information',
    learn: '📚 What you will learn:', learnItems: ["The CRS principle and its legal framework in Luxembourg","The key difference between CRS and FATCA","The concept of tax residence and self-certification","i-Hub’s role as a Reporting Financial Institution","CRS entity classification (Active NFE, Passive NFE)","Penalties for CRS non-compliance"],
    fiches:'15 cards', quiz:'3 fun quizzes', time:'~15 min',
    start:"Let’s go! 🚀", prev:'← Previous', next:'Next card',
    quizBtn:'🎮 Go to quizzes!', toRetain:'KEY TAKEAWAY', goFurther:'🔍 Go further',
    home:'← Home', pts:'🪙',
    quiz1label:'QUIZ 1/3 · MATCH THE PAIRS', quiz1title:'🧩 Match each term to its definition',
    quiz1sub:'Click a term first, then its definition',
    sigles:'Terms', definitions:'Definitions', quiz1done:'Perfect! All terms matched!',
    quiz2label:'QUIZ 2/3 · TRUE OR FALSE', quiz2title:'✅ True or False — CRS in practice',
    true:'✅ TRUE', false:'❌ FALSE', correct:'Well done!', wrong:'Not quite...',
    quiz3label:'QUIZ 3/3 · CASE STUDIES', quiz3title:'🔍 Analyse the situation',
    quiz3sub:'Which action is required?',
    resultTitle:'CRS module complete — 15 cards mastered!',
    backHome:'← Back to modules', restart:'🔄 Restart this module',
    pts_gained:'points earned', medal_gold:'CRS Expert!',
    medal_silver:'Good result, keep going!', medal_bronze:'Review the cards and try again!',
    score:'Total score', next2:'Next quiz →', last:'Last quiz →',
  },
}

const FICHES_FR = [
  {
    "id": 1,
    "emoji": "🌍",
    "titre": "C’est quoi le CRS ?",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "**CRS** = Common Reporting Standard = Norme Commune de Déclaration — standard de l’OCDE pour l’échange automatique d’informations fiscales"
      },
      {
        "icon": "📅",
        "texte": "Adopté en 2014 par l’OCDE, le CRS est en vigueur au Luxembourg depuis **2016**"
      },
      {
        "icon": "🌍",
        "texte": "Plus de **100 pays** participent au CRS — c’est le système mondial de transparence fiscale le plus large jamais créé"
      },
      {
        "icon": "🎯",
        "texte": "Objectif : permettre aux administrations fiscales de connaître les comptes que leurs résidents détiennent **à l’étranger**"
      }
    ],
    "aretenir": "Le CRS est la réponse internationale à l’évasion fiscale. i-Hub, en tant qu’IFE luxembourgeoise, y est directement soumis."
  },
  {
    "id": 2,
    "emoji": "🤝",
    "titre": "CRS vs FATCA : les différences clés",
    "contenu": [
      {
        "icon": "🇺🇸",
        "texte": "**FATCA** : initiative américaine unilatérale — basée sur la **nationalité/citoyenneté** (US Person)"
      },
      {
        "icon": "🌍",
        "texte": "**CRS** : initiative multilatérale OCDE — basée sur la **résidence fiscale** du titulaire du compte"
      },
      {
        "icon": "📊",
        "texte": "FATCA : seuls les comptes US sont déclarés à l’IRS. CRS : tous les comptes de résidents étrangers sont déclarés à leur pays"
      },
      {
        "icon": "🔄",
        "texte": "Un client peut être soumis aux deux : résident français de nationalité américaine → FATCA ET CRS en parallèle"
      }
    ],
    "aretenir": "CRS et FATCA coexistent. La différence fondamentale : FATCA = nationalité, CRS = résidence fiscale."
  },
  {
    "id": 3,
    "emoji": "🏠",
    "titre": "La résidence fiscale : concept central du CRS",
    "contenu": [
      {
        "icon": "📍",
        "texte": "La **résidence fiscale** est le pays où une personne est imposable sur ses revenus mondiaux — pas forcément où elle vit"
      },
      {
        "icon": "📋",
        "texte": "Chaque pays a ses propres règles pour déterminer la résidence fiscale (séjour > 183 jours, foyer permanent, centre d’intérêts...)"
      },
      {
        "icon": "2️⃣",
        "texte": "Une personne peut avoir **plusieurs résidences fiscales** simultanément — toutes doivent être déclarées"
      },
      {
        "icon": "🚫",
        "texte": "**Pas de résidence fiscale nulle** : tout individu a au moins une résidence fiscale quelque part dans le monde"
      }
    ],
    "aretenir": "i-Hub doit identifier la ou les résidences fiscales de chaque client — pas seulement son lieu de résidence physique.",
    "plusLoin": [
      {
        "icon": "💡",
        "texte": "Les **conventions de double imposition** (CDI) peuvent déterminer quelle résidence fiscale prime en cas de conflit"
      },
      {
        "icon": "🔍",
        "texte": "En cas de doute sur la résidence fiscale, i-Hub signale l’incohérence au **PSF**, qui demande une **auto-certification** complémentaire au client final"
      },
      {
        "icon": "🌍",
        "texte": "Certains pays (ex: Monaco, Bahamas) ne participent pas au CRS — leurs résidents ne font pas l’objet d’un échange automatique"
      }
    ]
  },
  {
    "id": 4,
    "emoji": "🏦",
    "titre": "i-Hub face au CRS : vérificateur, pas déclarant ?",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "i-Hub **n’est pas** une IFD (Institution Financière Déclarante) — il ne reçoit pas de dépôts et ne gère pas de comptes pour ses propres clients"
      },
      {
        "icon": "📋",
        "texte": "Les IFD (banques, fonds, assureurs) sont les **PSF clients d’i-Hub** — ce sont eux qui déclarent au CRS sous leur propre responsabilité"
      },
      {
        "icon": "🏛️",
        "texte": "Les **PSF clients** d’i-Hub déclarent chaque année à l’ACD (Administration des Contributions Directes) du Luxembourg"
      },
      {
        "icon": "🔄",
        "texte": "L’ACD transmet ensuite les informations aux **autorités fiscales des pays de résidence** des clients concernés"
      }
    ],
    "aretenir": "i-Hub est un **PSF de support** : il vérifie la cohérence documentaire pour le compte des PSF. Ce sont les PSF qui collectent, classent et déclarent — pas i-Hub."
  },
  {
    "id": 5,
    "emoji": "📋",
    "titre": "Les comptes déclarables au CRS",
    "contenu": [
      {
        "icon": "👤",
        "texte": "**Comptes de personnes physiques** : tout compte détenu par un résident fiscal d’un pays CRS autre que le Luxembourg"
      },
      {
        "icon": "🏢",
        "texte": "**Comptes d’entités passives** avec des **personnes détenant le contrôle** résidentes dans un pays CRS"
      },
      {
        "icon": "💰",
        "texte": "**Seuils de déclaration** : comptes préexistants de personnes physiques < 1M USD peuvent bénéficier d’une procédure allégée"
      },
      {
        "icon": "🚫",
        "texte": "**Exclusions** : comptes de retraite réglementés, comptes dormants de faible valeur, certains produits d’assurance"
      }
    ],
    "aretenir": "Pas tous les comptes sont déclarables. La classification correcte de chaque compte est essentielle pour i-Hub."
  },
  {
    "id": 6,
    "emoji": "📝",
    "titre": "L’auto-certification du client final du PSF",
    "contenu": [
      {
        "icon": "📄",
        "texte": "L'**auto-certification** est le document par lequel le **client final du PSF** déclare lui-même sa ou ses résidences fiscales au **PSF**"
      },
      {
        "icon": "✍️",
        "texte": "Elle doit être signée par le client et doit contenir : nom, adresse, pays de résidence fiscale, **NIF** (numéro d’identification fiscale)"
      },
      {
        "icon": "⏱️",
        "texte": "Le **PSF** doit obtenir l’auto-certification du client final dans les **90 jours** suivant l’ouverture — i-Hub vérifie sa présence et sa cohérence"
      },
      {
        "icon": "🔄",
        "texte": "L’auto-certification doit être **mise à jour** si la situation du client final change — le client final notifie le **PSF**, qui sollicite i-Hub pour re-vérifier si nécessaire"
      }
    ],
    "aretenir": "Sans auto-certification valide, le **PSF** ne peut pas finaliser l’entrée en relation avec son client final. i-Hub vérifie que le document est présent et cohérent.",
    "plusLoin": [
      {
        "icon": "📋",
        "texte": "Le format de l’auto-certification n’est pas imposé — le **PSF** utilise son propre formulaire ou un modèle OCDE, qu’i-Hub reçoit et vérifie"
      },
      {
        "icon": "🔍",
        "texte": "i-Hub vérifie la **plausibilité** de l’auto-certification reçue par rapport aux autres documents d’identité du client final"
      },
      {
        "icon": "⚠️",
        "texte": "Une auto-certification **incohérente** avec les données KYC doit être rejetée et une nouvelle demandée"
      }
    ]
  },
  {
    "id": 7,
    "emoji": "🔢",
    "titre": "Le NIF — Numéro d’Identification Fiscale",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "Le **NIF** est l’identifiant fiscal attribué par chaque pays à ses résidents — indispensable pour le CRS"
      },
      {
        "icon": "🌍",
        "texte": "Chaque pays a son propre format de NIF : **Luxembourg** (matricule), **France** (numéro fiscal), **Allemagne** (Steuer-ID)..."
      },
      {
        "icon": "❓",
        "texte": "Si le client n’a pas de NIF (certains pays n’en délivrent pas), il doit le **justifier** dans l’auto-certification"
      },
      {
        "icon": "📋",
        "texte": "Le **PSF** doit conserver et déclarer le NIF, i-Hub vérifie sa présence et cohérence de chaque titulaire de compte déclarable à l’ACD"
      }
    ],
    "aretenir": "Le NIF est la clé de voûte du CRS. Sans NIF, la déclaration est incomplète — i-Hub doit relancer le client."
  },
  {
    "id": 8,
    "emoji": "🗂️",
    "titre": "Classification des entités au CRS",
    "contenu": [
      {
        "icon": "🏦",
        "texte": "**IFD** (Institution Financière Déclarante) : soumise aux obligations CRS — banques, fonds, PSF..."
      },
      {
        "icon": "🏢",
        "texte": "**ENF Active** (Entité Non Financière Active) : société dont l’activité principale est non financière — peu d’obligations"
      },
      {
        "icon": "🟡",
        "texte": "**ENF Passive** : holding ou entité patrimoniale — doit identifier ses **personnes détenant le contrôle**"
      },
      {
        "icon": "👥",
        "texte": "**Personnes détenant le contrôle** d’une ENF Passive = UBO au sens CRS (seuil : participation > 25% en général)"
      }
    ],
    "aretenir": "La classification CRS d’une entité détermine ce qu’Le PSF collecte et déclare. i-Hub vérifie la cohérence des documents transmis. ENF Passive = vigilance accrue."
  },
  {
    "id": 9,
    "emoji": "📊",
    "titre": "Que déclare notre client PSF à l’ACD ?",
    "contenu": [
      {
        "icon": "👤",
        "texte": "**Identité** : nom, adresse, date de naissance, NIF et pays de résidence fiscale du titulaire déclarable"
      },
      {
        "icon": "🔢",
        "texte": "**Numéro de compte** et **solde ou valeur** au 31 décembre de l’année de déclaration"
      },
      {
        "icon": "💰",
        "texte": "**Revenus** : intérêts, dividendes, autres revenus générés sur le compte durant l’année"
      },
      {
        "icon": "📅",
        "texte": "Déclaration annuelle à l’ACD — délai : **30 juin** de l’année suivante (ex : données 2024 → 30 juin 2025)"
      }
    ],
    "aretenir": "La déclaration CRS du PSF est exhaustive : identité + solde + revenus du client final. i-Hub vérifie les données d’identification — le PSF est responsable de la déclaration complète."
  },
  {
    "id": 10,
    "emoji": "🔍",
    "titre": "Procédures de diligence raisonnable",
    "contenu": [
      {
        "icon": "🆕",
        "texte": "**Nouveaux comptes** : auto-certification obligatoire dès l’ouverture — aucune ouverture sans résidence fiscale identifiée"
      },
      {
        "icon": "📁",
        "texte": "**Comptes préexistants** (ouverts avant le 1er janvier 2016) : revue documentaire pour détecter les indices de résidence étrangère"
      },
      {
        "icon": "💎",
        "texte": "**Comptes de valeur élevée** (> 1M USD) : procédure renforcée incluant une **revue des dossiers papier** et entretien avec le gestionnaire"
      },
      {
        "icon": "🔄",
        "texte": "**Surveillance continue** : mise à jour obligatoire en cas de changement de circonstances signalé par le client ou détecté par i-Hub"
      }
    ],
    "aretenir": "Nouveaux comptes = auto-certification obligatoire. Comptes préexistants = revue documentaire. Comptes > 1M = procédure renforcée."
  },
  {
    "id": 11,
    "emoji": "🚨",
    "titre": "Changement de circonstances",
    "contenu": [
      {
        "icon": "🔔",
        "texte": "Un **changement de circonstances** = tout événement modifiant la résidence fiscale d’un client"
      },
      {
        "icon": "📋",
        "texte": "Exemples : déménagement dans un nouveau pays, obtention d’une nouvelle nationalité, changement d’adresse postale"
      },
      {
        "icon": "⚡",
        "texte": "Le **PSF** doit traiter le changement dans les **90 jours** — obtenir une nouvelle auto-certification du client final et reclassifier — i-Hub vérifie le nouveau document"
      },
      {
        "icon": "🚫",
        "texte": "Si le client final ne fournit pas de nouvelle auto-certification, le **PSF** applique la **présomption de résidence** basée sur les indices disponibles"
      }
    ],
    "aretenir": "i-Hub ne peut pas ignorer un changement de circonstances. Toute mise à jour d’adresse peut déclencher une reclassification CRS."
  },
  {
    "id": 12,
    "emoji": "⚖️",
    "titre": "Sanctions en cas de manquement au CRS",
    "contenu": [
      {
        "icon": "💸",
        "texte": "**Amendes ACD** : jusqu’à **250 000 €** par déclaration incorrecte, incomplète ou tardive au Luxembourg"
      },
      {
        "icon": "🏛️",
        "texte": "**Sanctions CSSF** : retrait de licence ou suspension d’activité pour manquements graves et répétés"
      },
      {
        "icon": "⚖️",
        "texte": "**Sanctions pénales** : jusqu’à 5 ans d’emprisonnement pour obstruction délibérée au CRS"
      },
      {
        "icon": "📰",
        "texte": "**Risque réputationnel** : publication des sanctions — impact majeur sur la confiance des clients d’i-Hub"
      }
    ],
    "aretenir": "Les sanctions CRS sont sévères et cumulables. La conformité coûte moins cher que le risque de sanction.",
    "plusLoin": [
      {
        "icon": "🔍",
        "texte": "L’ACD réalise des **contrôles aléatoires** des déclarations CRS — i-Hub doit pouvoir justifier chaque choix de classification"
      },
      {
        "icon": "🤝",
        "texte": "Un **programme de divulgation volontaire** existe : corriger une erreur avant contrôle réduit significativement les sanctions"
      },
      {
        "icon": "🌍",
        "texte": "Le **Forum mondial de l’OCDE** surveille la mise en œuvre du CRS dans chaque pays — Luxembourg est régulièrement évalué"
      }
    ]
  },
  {
    "id": 13,
    "emoji": "🔒",
    "titre": "RGPD et CRS : ce que cela implique pour i-Hub",
    "contenu": [
      {
        "icon": "⚖️",
        "texte": "La collecte de données CRS implique des **données personnelles** — le RGPD s’applique en parallèle"
      },
      {
        "icon": "📋",
        "texte": "C’est le **PSF** qui informe ses clients finaux de la collecte et transmission de leurs données CRS — i-Hub, sous-traitant, traite ces données sur instruction du PSF"
      },
      {
        "icon": "🔒",
        "texte": "Les données CRS doivent être stockées de façon **sécurisée** et conservées **5 ans minimum** après la déclaration"
      },
      {
        "icon": "🚫",
        "texte": "La finalité de la collecte CRS est **légalement imposée** au PSF — le client final du PSF ne peut pas s’y opposer en invoquant le RGPD"
      }
    ],
    "aretenir": "RGPD et CRS s’appliquent simultanément au **PSF**. i-Hub traite les données sur instruction du PSF et doit sécuriser les données des clients finaux qu’il vérifie."
  },
  {
    "id": 14,
    "emoji": "🌐",
    "titre": "Pays participants au CRS",
    "contenu": [
      {
        "icon": "✅",
        "texte": "Plus de **100 juridictions** participent au CRS — dont tous les pays de l’UE, le Royaume-Uni, l’Australie, le Canada, le Japon..."
      },
      {
        "icon": "🚫",
        "texte": "**Non-participants notables** : USA (qui a son propre FATCA), quelques paradis fiscaux et petits États"
      },
      {
        "icon": "🔄",
        "texte": "La liste des pays participants est **mise à jour régulièrement** — le **PSF** et i-Hub doivent vérifier la liste avant chaque campagne de vérification nouvelles"
      },
      {
        "icon": "📋",
        "texte": "Un compte détenu par un résident d’un pays non-participant au CRS n’est **pas déclarable** sous ce régime"
      }
    ],
    "aretenir": "La liste des pays CRS détermine quels comptes sont déclarables. Un pays qui rejoint le CRS peut rendre des comptes existants déclarables.",
    "plusLoin": [
      {
        "icon": "🌍",
        "texte": "**Échange réciproque** : le Luxembourg reçoit aussi des informations de l’étranger sur les comptes de résidents luxembourgeois détenus à l’étranger"
      },
      {
        "icon": "📅",
        "texte": "**Premiers échanges** : Luxembourg a effectué ses premiers échanges CRS en **septembre 2017**"
      },
      {
        "icon": "🔍",
        "texte": "Le **Forum mondial** surveille la qualité des échanges — un pays qui transmet des données incomplètes peut être sanctionné"
      }
    ]
  },
  {
    "id": 15,
    "emoji": "👨‍💼",
    "titre": "Comment i-Hub intervient : sur instruction et dans le cadre du SLA",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "i-Hub **agit sur instruction** de ses clients PSF — jamais de sa propre initiative"
      },
      {
        "icon": "🔍",
        "texte": "Le **SLA** signé avec chaque PSF définit exactement quels documents vérifier, quels contrôles effectuer et comment restituer les résultats"
      },
      {
        "icon": "💻",
        "texte": "**IT / Data i-Hub** : gère les outils de vérification documentaire et la transmission sécurisée des données vérifiées aux PSF — c’est le **PSF** qui génère et envoie les fichiers XML à l’ACD"
      },
      {
        "icon": "👤",
        "texte": "Toute **anomalie détectée** lors de la vérification est documentée et signalée au PSF — c’est le PSF qui décide de la suite à donner"
      }
    ],
    "aretenir": "i-Hub = sous-traitant qui vérifie sur instruction du PSF, dans le cadre du SLA. Le PSF collecte, classe et déclare. i-Hub ne fait jamais partie de la chaîne de déclaration."
  }
]
const FICHES_EN = [
  {
    "id": 1,
    "emoji": "🌍",
    "titre": "What is the CRS?",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "**CRS** = Common Reporting Standard — the OECD standard for the automatic exchange of tax information between countries"
      },
      {
        "icon": "📅",
        "texte": "Adopted by the OECD in 2014, the CRS has been in force in Luxembourg since **2016**"
      },
      {
        "icon": "🌍",
        "texte": "Over **100 countries** participate in the CRS — the largest global tax transparency system ever created"
      },
      {
        "icon": "🎯",
        "texte": "Goal: allow tax authorities to know about accounts their residents hold **abroad**"
      }
    ],
    "aretenir": "The CRS is the international response to tax evasion. i-Hub, as a Luxembourg FFI, is directly subject to it."
  },
  {
    "id": 2,
    "emoji": "🤝",
    "titre": "CRS vs FATCA: key differences",
    "contenu": [
      {
        "icon": "🇺🇸",
        "texte": "**FATCA**: unilateral US initiative — based on **nationality/citizenship** (US Person)"
      },
      {
        "icon": "🌍",
        "texte": "**CRS**: multilateral OECD initiative — based on the **tax residence** of the account holder"
      },
      {
        "icon": "📊",
        "texte": "FATCA: only US accounts reported to IRS. CRS: all accounts of foreign residents reported to their home country"
      },
      {
        "icon": "🔄",
        "texte": "A client may be subject to both: French resident with US nationality → FATCA AND CRS simultaneously"
      }
    ],
    "aretenir": "CRS and FATCA coexist. The key difference: FATCA = nationality, CRS = tax residence."
  },
  {
    "id": 3,
    "emoji": "🏠",
    "titre": "Tax residence: the CRS core concept",
    "contenu": [
      {
        "icon": "📍",
        "texte": "**Tax residence** is the country where a person is taxable on their worldwide income — not necessarily where they live"
      },
      {
        "icon": "📋",
        "texte": "Each country has its own rules for determining tax residence (stay > 183 days, permanent home, centre of interests...)"
      },
      {
        "icon": "2️⃣",
        "texte": "A person may have **multiple tax residences** simultaneously — all must be declared"
      },
      {
        "icon": "🚫",
        "texte": "**No nil tax residence**: every individual has at least one tax residence somewhere in the world"
      }
    ],
    "aretenir": "i-Hub must identify the tax residence(s) of each client — not just their physical place of residence.",
    "plusLoin": [
      {
        "icon": "💡",
        "texte": "**Double tax treaties** (DTTs) may determine which tax residence prevails in case of conflict"
      },
      {
        "icon": "🔍",
        "texte": "If tax residence is unclear, i-Hub flags the inconsistency to the **PSF**, who requests additional **self-certification** from the final client"
      },
      {
        "icon": "🌍",
        "texte": "Some countries (e.g. Monaco, Bahamas) do not participate in CRS — their residents are not subject to automatic exchange"
      }
    ]
  },
  {
    "id": 4,
    "emoji": "🏦",
    "titre": "i-Hub and CRS: verifier, not reporter?",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "i-Hub is **not** an RFI (Reporting Financial Institution) — it does not hold deposits or manage accounts for its own clients"
      },
      {
        "icon": "📋",
        "texte": "RFIs include: banks, investment funds, insurance companies, support PSFs like i-Hub"
      },
      {
        "icon": "🏛️",
        "texte": "i-Hub’s **PSF clients** report annually to the ACD (Administration des Contributions Directes) in Luxembourg"
      },
      {
        "icon": "🔄",
        "texte": "The ACD then transmits the information to the **tax authorities of the clients' countries of residence**"
      }
    ],
    "aretenir": "i-Hub is on the front line of CRS. It collects, classifies and reports — the ACD redistributes to partner countries."
  },
  {
    "id": 5,
    "emoji": "📋",
    "titre": "Reportable accounts under CRS",
    "contenu": [
      {
        "icon": "👤",
        "texte": "**Individual accounts**: any account held by a tax resident of a CRS country other than Luxembourg"
      },
      {
        "icon": "🏢",
        "texte": "**Passive entity accounts** with **controlling persons** resident in a CRS country"
      },
      {
        "icon": "💰",
        "texte": "**Reporting thresholds**: pre-existing individual accounts below USD 1M may benefit from simplified procedures"
      },
      {
        "icon": "🚫",
        "texte": "**Exclusions**: regulated retirement accounts, dormant low-value accounts, certain insurance products"
      }
    ],
    "aretenir": "Not all accounts are reportable. Correct classification of each account is essential for i-Hub."
  },
  {
    "id": 6,
    "emoji": "📝",
    "titre": "PSF final client self-certification",
    "contenu": [
      {
        "icon": "📄",
        "texte": "The **self-certification** is the document by which the **PSF’s final client** declares their tax residence(s) to the **PSF**"
      },
      {
        "icon": "✍️",
        "texte": "It must be signed and contain: name, address, country of tax residence, **TIN** (tax identification number)"
      },
      {
        "icon": "⏱️",
        "texte": "The **PSF** must obtain the self-certification from the final client within **90 days** of account opening — i-Hub verifies its presence and consistency"
      },
      {
        "icon": "🔄",
        "texte": "The self-certification must be **updated** if the final client’s situation changes — the final client notifies the **PSF**, who may ask i-Hub to re-verify"
      }
    ],
    "aretenir": "Without a valid self-certification, the **PSF** cannot complete onboarding of its final client. i-Hub verifies that the document is present and consistent.",
    "plusLoin": [
      {
        "icon": "📋",
        "texte": "The format is not prescribed — the **PSF** uses its own form or an OECD template, which i-Hub receives and verifies"
      },
      {
        "icon": "🔍",
        "texte": "i-Hub verifies the **plausibility** of the self-certification received against other identity documents of the final client"
      },
      {
        "icon": "⚠️",
        "texte": "A self-certification **inconsistent** with KYC data must be rejected and a new one requested"
      }
    ]
  },
  {
    "id": 7,
    "emoji": "🔢",
    "titre": "TIN — Tax Identification Number",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "The **TIN** is the tax identifier assigned by each country to its residents — essential for CRS"
      },
      {
        "icon": "🌍",
        "texte": "Each country has its own TIN format: **Luxembourg** (matricule), **France** (numéro fiscal), **Germany** (Steuer-ID)..."
      },
      {
        "icon": "❓",
        "texte": "If the client has no TIN (some countries do not issue them), they must **justify** this in the self-certification"
      },
      {
        "icon": "📋",
        "texte": "i-Hub must **retain and report** the TIN of each reportable account holder to the ACD"
      }
    ],
    "aretenir": "The TIN is the cornerstone of CRS. Without a TIN, the report is incomplete — i-Hub must follow up with the client."
  },
  {
    "id": 8,
    "emoji": "🗂️",
    "titre": "Entity classification under CRS",
    "contenu": [
      {
        "icon": "🏦",
        "texte": "**RFI** (Reporting Financial Institution): subject to CRS obligations — banks, funds, PSFs..."
      },
      {
        "icon": "🏢",
        "texte": "**Active NFE** (Non-Financial Entity): company whose main activity is non-financial — limited obligations"
      },
      {
        "icon": "🟡",
        "texte": "**Passive NFE**: holding or investment entity — must identify its **controlling persons**"
      },
      {
        "icon": "👥",
        "texte": "**Controlling persons** of a Passive NFE = UBOs in CRS terms (threshold: ownership > 25% in general)"
      }
    ],
    "aretenir": "CRS entity classification determines what the **PSF** must collect and report. For i-Hub: Passive NFE = enhanced documentary verification."
  },
  {
    "id": 9,
    "emoji": "📊",
    "titre": "What does our PSF client report to the ACD?",
    "contenu": [
      {
        "icon": "👤",
        "texte": "**Identity**: name, address, date of birth, TIN and country of tax residence of the reportable holder"
      },
      {
        "icon": "🔢",
        "texte": "**Account number** and **balance or value** as of 31 December of the reporting year"
      },
      {
        "icon": "💰",
        "texte": "**Income**: interest, dividends, other income generated on the account during the year"
      },
      {
        "icon": "📅",
        "texte": "Annual report to the ACD — deadline: **30 June** of the following year (e.g. 2024 data → 30 June 2025)"
      }
    ],
    "aretenir": "The CRS report is comprehensive: identity + balance + income. A partial omission is a violation."
  },
  {
    "id": 10,
    "emoji": "🔍",
    "titre": "Due diligence procedures",
    "contenu": [
      {
        "icon": "🆕",
        "texte": "**New accounts**: self-certification mandatory at opening — no account without identified tax residence"
      },
      {
        "icon": "📁",
        "texte": "**Pre-existing accounts** (opened before 1 January 2016): documentary review to detect foreign residence indicators"
      },
      {
        "icon": "💎",
        "texte": "**High-value accounts** (> USD 1M): enhanced procedure including **paper file review** and relationship manager interview"
      },
      {
        "icon": "🔄",
        "texte": "**Ongoing monitoring**: mandatory update when a change of circumstances is reported or detected"
      }
    ],
    "aretenir": "New accounts = mandatory self-certification. Pre-existing = documentary review. Above USD 1M = enhanced procedure."
  },
  {
    "id": 11,
    "emoji": "🚨",
    "titre": "Change of circumstances",
    "contenu": [
      {
        "icon": "🔔",
        "texte": "A **change of circumstances** = any event that modifies a client’s tax residence"
      },
      {
        "icon": "📋",
        "texte": "Examples: relocation to a new country, acquisition of a new nationality, change of postal address"
      },
      {
        "icon": "⚡",
        "texte": "The **PSF** must process the change within **90 days** — obtain a new self-certification from the final client and reclassify — i-Hub verifies the new document"
      },
      {
        "icon": "🚫",
        "texte": "If the final client does not provide a new self-certification, the **PSF** applies a **residence presumption** based on available indicators"
      }
    ],
    "aretenir": "i-Hub cannot ignore a change of circumstances. Any address update may trigger a CRS reclassification."
  },
  {
    "id": 12,
    "emoji": "⚖️",
    "titre": "Penalties for CRS non-compliance",
    "contenu": [
      {
        "icon": "💸",
        "texte": "**ACD fines**: up to **€250,000** per incorrect, incomplete or late declaration in Luxembourg"
      },
      {
        "icon": "🏛️",
        "texte": "**CSSF sanctions**: licence withdrawal or activity suspension for serious and repeated breaches"
      },
      {
        "icon": "⚖️",
        "texte": "**Criminal penalties**: up to 5 years' imprisonment for deliberate obstruction of CRS"
      },
      {
        "icon": "📰",
        "texte": "**Reputational risk**: publication of sanctions — major impact on client trust in i-Hub"
      }
    ],
    "aretenir": "CRS penalties are severe and cumulative. Compliance costs less than the risk of sanctions.",
    "plusLoin": [
      {
        "icon": "🔍",
        "texte": "The ACD conducts **random checks** on CRS declarations — i-Hub must justify every classification decision"
      },
      {
        "icon": "🤝",
        "texte": "A **voluntary disclosure programme** exists: correcting an error before an audit significantly reduces penalties"
      },
      {
        "icon": "🌍",
        "texte": "The **OECD Global Forum** monitors CRS implementation in each country — Luxembourg is regularly reviewed"
      }
    ]
  },
  {
    "id": 13,
    "emoji": "🔒",
    "titre": "CRS and data protection (GDPR)",
    "contenu": [
      {
        "icon": "⚖️",
        "texte": "CRS data collection involves **personal data** — GDPR applies in parallel"
      },
      {
        "icon": "📋",
        "texte": "It is the **PSF** that informs its final clients of the collection and transmission of their CRS data — i-Hub, as subcontractor, processes this data on the PSF’s instruction"
      },
      {
        "icon": "🔒",
        "texte": "CRS data must be stored **securely** and retained for a **minimum of 5 years** after declaration"
      },
      {
        "icon": "🚫",
        "texte": "The purpose of collection (CRS) is **legally mandated** — clients cannot object on GDPR grounds"
      }
    ],
    "aretenir": "GDPR and CRS apply simultaneously to the **PSF**. i-Hub processes data on the PSF’s instruction and must secure the final clients' data it verifies."
  },
  {
    "id": 14,
    "emoji": "🌐",
    "titre": "CRS participating countries",
    "contenu": [
      {
        "icon": "✅",
        "texte": "Over **100 jurisdictions** participate in CRS — including all EU countries, the UK, Australia, Canada, Japan..."
      },
      {
        "icon": "🚫",
        "texte": "**Notable non-participants**: USA (which has its own FATCA), some tax havens and small states"
      },
      {
        "icon": "🔄",
        "texte": "The list of participating countries is **updated regularly** — the **PSF** and i-Hub should check the list before each verification campaign"
      },
      {
        "icon": "📋",
        "texte": "An account held by a resident of a CRS non-participant country is **not reportable** under this regime"
      }
    ],
    "aretenir": "The CRS country list determines which accounts are reportable. A new country joining CRS may make existing accounts reportable.",
    "plusLoin": [
      {
        "icon": "🌍",
        "texte": "**Reciprocal exchange**: Luxembourg also receives information from abroad about accounts held by Luxembourg residents overseas"
      },
      {
        "icon": "📅",
        "texte": "**First exchanges**: Luxembourg conducted its first CRS exchanges in **September 2017**"
      },
      {
        "icon": "🔍",
        "texte": "The **Global Forum** monitors exchange quality — a country transmitting incomplete data may face consequences"
      }
    ]
  },
  {
    "id": 15,
    "emoji": "👨‍💼",
    "titre": "How i-Hub intervenes: on instruction and within the SLA scope",
    "contenu": [
      {
        "icon": "🎯",
        "texte": "i-Hub **acts on instruction** from its PSF clients — never on its own initiative"
      },
      {
        "icon": "🔍",
        "texte": "The **SLA** signed with each PSF defines exactly which documents to verify, which checks to perform and how to report results"
      },
      {
        "icon": "💻",
        "texte": "i-Hub verifies **only what the SLA provides for** — no more, no less. Anything outside the scope is flagged to the PSF without being processed"
      },
      {
        "icon": "👤",
        "texte": "Any **anomaly detected** during verification is documented and flagged to the PSF — it is the PSF that decides on the follow-up action"
      }
    ],
    "aretenir": "i-Hub = subcontractor that verifies on the PSF’s instruction, within the SLA scope. The PSF collects, classifies and reports. i-Hub is never part of the reporting chain."
  }
]
const MATCHING_FR = [{"sigle":"CRS","definition":"Norme commune de déclaration OCDE"},{"sigle":"IFD","definition":"Institution financière qui déclare au CRS"},{"sigle":"Résidence fiscale","definition":"Pays où une personne est imposable sur ses revenus mondiaux"},{"sigle":"NIF","definition":"Numéro d’identification fiscale d’un contribuable"},{"sigle":"Auto-certification","definition":"Document par lequel le client déclare sa résidence fiscale"},{"sigle":"ENF Passive","definition":"Entité patrimoniale devant déclarer ses UBO étrangers"},{"sigle":"ACD","definition":"Autorité luxembourgeoise recevant les déclarations CRS"},{"sigle":"ENF Active","definition":"Société opérationnelle peu soumise aux obligations CRS"},{"sigle":"Changement de circonstances","definition":"Événement modifiant la résidence fiscale d’un client"},{"sigle":"90 jours","definition":"Délai pour obtenir une auto-certification après ouverture"}]
const MATCHING_EN = [{"sigle":"CRS","definition":"OECD common reporting standard"},{"sigle":"RFI","definition":"Financial institution that reports under CRS"},{"sigle":"Tax residence","definition":"Country where a person is taxable on worldwide income"},{"sigle":"TIN","definition":"Tax identification number of a taxpayer"},{"sigle":"Self-certification","definition":"Document by which the client declares their tax residence"},{"sigle":"Passive NFE","definition":"Investment entity that must disclose foreign UBOs"},{"sigle":"ACD","definition":"Luxembourg authority receiving CRS reports"},{"sigle":"Active NFE","definition":"Operating company with limited CRS obligations"},{"sigle":"Change of circumstances","definition":"Event that modifies a client’s tax residence"},{"sigle":"90 days","definition":"Deadline to obtain a self-certification after account opening"}]
const VF_FR = [{"texte":"Le CRS est basé sur la nationalité du titulaire du compte","reponse":false,"explication":"Non ! Le CRS est basé sur la résidence fiscale, pas la nationalité. C’est FATCA qui utilise la nationalité."},{"texte":"Le Luxembourg a effectué ses premiers échanges CRS en 2017","reponse":true,"explication":"Exact ! Les premiers échanges CRS luxembourgeois ont eu lieu en septembre 2017."},{"texte":"Une personne peut avoir plusieurs résidences fiscales simultanément","reponse":true,"explication":"Exact ! Une personne peut être résidente fiscale dans plusieurs pays à la fois — toutes doivent être déclarées."},{"texte":"i-Hub ne déclare pas aux autorités fiscales étrangères — c’est le rôle du PSF via l’ACD","reponse":false,"explication":"Non ! C’est le PSF qui déclare à l’ACD luxembourgeoise, qui transmet ensuite aux pays partenaires."},{"texte":"L’auto-certification doit être obtenue dans les 90 jours suivant l’ouverture du compte","reponse":true,"explication":"Exact ! Le délai légal est de 90 jours. Au-delà, i-Hub est en infraction."},{"texte":"Les USA participent au CRS","reponse":false,"explication":"Non ! Les USA ont leur propre système (FATCA) et ne participent pas au CRS de l’OCDE."},{"texte":"Une ENF Active doit déclarer ses personnes détenant le contrôle","reponse":false,"explication":"Non ! C’est l’ENF Passive qui doit déclarer ses personnes détenant le contrôle résidentes à l’étranger."},{"texte":"La déclaration CRS annuelle est due avant le 30 juin","reponse":true,"explication":"Exact ! Le délai de déclaration à l’ACD est le 30 juin de l’année suivant l’année de référence."},{"texte":"Le RGPD s’oppose à la collecte de données dans le cadre du CRS","reponse":false,"explication":"Non ! La collecte CRS est légalement imposée — le client ne peut pas l’opposer au RGPD."},{"texte":"L’amende ACD peut atteindre 250 000 € par déclaration incorrecte","reponse":true,"explication":"Exact ! Les sanctions luxembourgeoises pour manquement CRS peuvent atteindre 250 000 € par infraction."},{"texte":"CRS et FATCA ne peuvent jamais s’appliquer au même client en même temps","reponse":false,"explication":"Non ! Un résident français de nationalité américaine est soumis aux deux simultanément."},{"texte":"Les comptes de valeur supérieure à 1 million USD font l’objet d’une procédure renforcée","reponse":true,"explication":"Exact ! Les comptes > 1M USD nécessitent une procédure de diligence renforcée incluant une revue documentaire complète."}]
const VF_EN = [{"texte":"The CRS is based on the account holder’s nationality","reponse":false,"explication":"No! The CRS is based on tax residence, not nationality. It’s FATCA that uses nationality."},{"texte":"Luxembourg conducted its first CRS exchanges in 2017","reponse":true,"explication":"Correct! Luxembourg’s first CRS exchanges took place in September 2017."},{"texte":"A person can have multiple tax residences simultaneously","reponse":true,"explication":"Correct! A person can be a tax resident in several countries at once — all must be declared."},{"texte":"i-Hub reports directly to foreign tax authorities","reponse":false,"explication":"No! It is the **PSF** that reports to the Luxembourg ACD, which then transmits to partner countries."},{"texte":"Self-certification must be obtained within 90 days of account opening","reponse":true,"explication":"Correct! The legal deadline is 90 days. Beyond this, i-Hub is in breach."},{"texte":"The USA participates in CRS","reponse":false,"explication":"No! The USA has its own system (FATCA) and does not participate in the OECD CRS."},{"texte":"An Active NFE must disclose its controlling persons","reponse":false,"explication":"No! It’s the Passive NFE that must disclose its controlling persons resident abroad."},{"texte":"The annual CRS report is due before 30 June","reponse":true,"explication":"Correct! The ACD reporting deadline is 30 June of the year following the reference year."},{"texte":"GDPR prevents data collection under CRS","reponse":false,"explication":"No! CRS data collection is legally mandated — clients cannot invoke GDPR against it."},{"texte":"The ACD fine can reach €250,000 per incorrect declaration","reponse":true,"explication":"Correct! Luxembourg penalties for CRS breaches can reach €250,000 per violation."},{"texte":"CRS and FATCA can never apply to the same client at the same time","reponse":false,"explication":"No! A French resident with US nationality is subject to both simultaneously."},{"texte":"Accounts above USD 1 million are subject to an enhanced procedure","reponse":true,"explication":"Correct! Accounts over USD 1M require an enhanced due diligence procedure including a full document review."}]
const CAS_FR = [{"situation":"Un résident belge est client final d’un PSF. Il refuse de remplir l’auto-certification auprès du PSF.","action":"Bloquer l’ouverture — auto-certification obligatoire dans les 90 jours","options":["Ouvrir le compte — la Belgique est un pays ami","Bloquer l’ouverture — auto-certification obligatoire dans les 90 jours","Ouvrir et déclarer à l’ACD sans auto-certification","Appliquer FATCA à la place du CRS"],"explication":"L’auto-certification est obligatoire dans les 90 jours. Sans elle, le **PSF** ne peut pas finaliser l’entrée en relation avec son client final."},{"situation":"Une holding luxembourgeoise a un actionnaire français détenant 30% du capital. Elle se déclare ENF Active.","action":"Reclassifier en ENF Passive — 30% = personne détenant le contrôle à déclarer","options":["Accepter — ENF Active = pas d’obligation CRS","Demander un W-8BEN-E","Reclassifier en ENF Passive — 30% = personne détenant le contrôle à déclarer","Déclarer la holding comme résidente française"],"explication":"Une holding dont les revenus sont majoritairement passifs est une ENF Passive. 30% > 25% → actionnaire français à déclarer."},{"situation":"Un client déménage d’Allemagne en Thaïlande (non-participant CRS). Il soumet une nouvelle auto-certification.","action":"Reclassifier comme non-déclarable — la Thaïlande ne participe pas au CRS","options":["Continuer à déclarer à l’ACD — prudence","Reclassifier comme non-déclarable — la Thaïlande ne participe pas au CRS","Appliquer FATCA à la place","Déclarer à l’Allemagne car il y résidait avant"],"explication":"La Thaïlande ne participe pas au CRS. Un résident thaïlandais n’est pas déclarable sous ce régime — sous réserve de vérification."},{"situation":"Un client ouvre un compte le 1er mars 2025. Au 30 juin 2025, il n’a toujours pas fourni son auto-certification.","action":"Infraction — délai de 90 jours dépassé, signaler à l’équipe Compliance","options":["Pas de problème — 30 juin est la date limite de déclaration","Accorder 90 jours supplémentaires","Infraction — délai de 90 jours dépassé, signaler à l’équipe Compliance","Clôturer le compte immédiatement"],"explication":"90 jours à partir du 1er mars = 30 mai. Au 30 juin le délai est largement dépassé. Il faut escalader à Compliance."},{"situation":"Un résident luxembourgeois d’origine américaine déclare une résidence fiscale aux USA uniquement dans son auto-certification.","action":"Vérifier : FATCA s’applique (US Person), CRS non — mais demander confirmation de non-résidence LU","options":["Appliquer CRS uniquement — pas besoin de FATCA","Ignorer — il est luxembourgeois","Vérifier : FATCA s’applique (US Person), CRS non — mais demander confirmation de non-résidence LU","Déclarer sous les deux régimes automatiquement"],"explication":"US Person → FATCA obligatoire. Résidence fiscale USA seulement → CRS non applicable. Mais vérifier la non-résidence LU."}]
const CAS_EN = [{"situation":"A Belgian resident is a final client of a PSF. They refuse to complete the self-certification with the PSF.","action":"Block opening — self-certification mandatory within 90 days","options":["Open the account — Belgium is a partner country","Block opening — self-certification mandatory within 90 days","Open and report to ACD without self-certification","Apply FATCA instead of CRS"],"explication":"Self-certification is mandatory within 90 days. Without it, the **PSF** cannot complete the onboarding of its final client."},{"situation":"A Luxembourg holding has a French shareholder holding 30% of capital. It declares itself an Active NFE.","action":"Reclassify as Passive NFE — 30% = controlling person to be reported","options":["Accept — Active NFE = no CRS obligation","Request a W-8BEN-E","Reclassify as Passive NFE — 30% = controlling person to be reported","Report the holding as a French resident"],"explication":"A holding with mainly passive income is a Passive NFE. 30% > 25% → French shareholder must be reported."},{"situation":"A client moves from Germany to Thailand (CRS non-participant). They submit a new self-certification.","action":"Reclassify as non-reportable — Thailand does not participate in CRS","options":["Continue reporting to ACD — caution prevails","Reclassify as non-reportable — Thailand does not participate in CRS","Apply FATCA instead","Report to Germany as they previously resided there"],"explication":"Thailand does not participate in CRS. A Thai resident is not reportable under this regime — subject to verification."},{"situation":"A client opens an account on 1 March 2025. By 30 June 2025, they have still not provided their self-certification.","action":"Breach — 90-day deadline exceeded, escalate to Compliance team","options":["No problem — 30 June is the reporting deadline","Grant an additional 90 days","Breach — 90-day deadline exceeded, escalate to Compliance team","Close the account immediately"],"explication":"90 days from 1 March = 30 May. By 30 June the deadline has long passed. Escalate to Compliance."},{"situation":"A Luxembourg resident of US origin declares US tax residence only in their self-certification.","action":"Check: FATCA applies (US Person), CRS does not — but confirm non-Luxembourg residence","options":["Apply CRS only — no need for FATCA","Ignore — they are Luxembourg-based","Check: FATCA applies (US Person), CRS does not — but confirm non-Luxembourg residence","Report under both regimes automatically"],"explication":"US Person → FATCA mandatory. Tax residence USA only → CRS not applicable. But verify non-Luxembourg tax residence."}]

export default function ModuleCRS() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)

  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN
  const C = '#e07b39'

  const [activeMatching, setActiveMatching] = useState(() => pickRandom(lang==='fr'?MATCHING_FR:MATCHING_EN, 6))
  const [matchSelected, setMatchSelected] = useState<string|null>(null)
  const [matchPairs, setMatchPairs] = useState<Record<string,string>>({})
  const [matchError, setMatchError] = useState<string|null>(null)
  const [activeVF, setActiveVF] = useState(() => pickRandom(lang==='fr'?VF_FR:VF_EN, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct'|'wrong'|null>(null)
  const [activeCas, setActiveCas] = useState(() => pickRandom(lang==='fr'?CAS_FR:CAS_EN, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState<string|null>(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l: 'fr'|'en') {
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
  function switchLang(l: 'fr'|'en') {
    saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l)
  }
  function handleMatchSigle(sigle: string) { if (matchPairs[sigle]) return; setMatchSelected(sigle); setMatchError(null) }
  function handleMatchDef(def: string) {
    if (!matchSelected) return
    const correct = activeMatching.find((m: any) => m.sigle===matchSelected)?.definition
    if (correct===def) {
      const np={...matchPairs,[matchSelected]:def}; setMatchPairs(np); setMatchSelected(null)
      if (Object.keys(np).length===activeMatching.length) setScore((s: number)=>s+15)
    } else { setMatchError(lang==='fr'?`❌ "${def}" ne correspond pas à ${matchSelected}.`:`❌ "${def}" does not match ${matchSelected}.`); setMatchSelected(null) }
  }
  function repondreVF(rep: boolean) {
    if (vfRepondu!==null) return
    const correct=(activeVF[vfIndex] as any).reponse===rep; setVfRepondu(rep); setVfAnimation(correct?'correct':'wrong')
    if (correct) setVfScore((s: number)=>s+1)
    setTimeout(() => {
      setVfAnimation(null); setVfRepondu(null)
      if (vfIndex+1 < activeVF.length) { setVfIndex((i: number)=>i+1) }
      else { const fs=correct?vfScore+1:vfScore; setScore((s: number)=>s+fs*5); setPhase('quiz3') }
    }, 2200)
  }
  function repCas(opt: string) {
    if (casRepondu!==null) return
    const correct=opt===(activeCas[casIndex] as any).action
    setCasRepondu(opt)
    if (correct) setCasScore((s: number)=>s+1)
  }
  function nextCas() {
    if (casIndex+1 < activeCas.length) { setCasIndex((i: number)=>i+1); setCasRepondu(null) }
    else { setScore((s: number)=>s+casScore*7); setPhase('resultat') }
  }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.back()} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#ffffff',fontWeight:'700',fontSize:'16px'}}>🌍 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          <button onClick={()=>switchLang('fr')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='fr'?C:'transparent',color:'white',transition:'all 0.2s'}}>🇻🇷 FR</button>
          <button onClick={()=>switchLang('en')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='en'?C:'transparent',color:'white',transition:'all 0.2s'}}>🇬🇧 EN</button>
        </div>
        <span style={{background:'white',border:`1px solid ${C}`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🌍</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'18px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'32px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item: string,i: number)=>(
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
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer',boxShadow:`0 4px 20px ${C}50`}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase==='fiches') {
    const fiche=FICHES[ficheIndex] as any; const progress=((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${progress}%`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'200px'}}>
              {FICHES.map((_: any,i: number)=>(<div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>))}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',boxShadow:`0 8px 40px ${C}15`,border:`2px solid ${C}30`,overflow:'hidden',marginBottom:'20px'}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0,lineHeight:1.3}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item: any,i: number)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C}">$1</strong>`)}}/>
                </div>
              ))}
              <div style={{background:`${C}10`,border:`1px solid ${C}30`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>💡</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
              {fiche.plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen((o: boolean)=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:`1.5px solid ${C}`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'}}>
                    <span>{t.goFurther}</span>
                    <span style={{transition:'transform 0.3s',transform:plusLoinOpen?'rotate(180deg)':'rotate(0deg)',display:'inline-block'}}>▾</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:`${C}08`,border:`1px solid ${C}25`,borderRadius:'0 0 10px 10px',padding:'16px',marginTop:'-4px',borderTop:'none'}}>
                      {fiche.plusLoin.map((item: any,i: number)=>(
                        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:i<fiche.plusLoin.length-1?`1px solid ${C}20`:'none'}}>
                          <span style={{fontSize:'20px',minWidth:'28px',textAlign:'center'}}>{item.icon}</span>
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
            {ficheIndex>0 && <button onClick={()=>{setFicheIndex((i: number)=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontSize:'15px',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex((i: number)=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')}
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
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz1label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.quiz1title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.quiz1sub}</p>
          </div>
          {matchError && <div style={{background:'#fee2e2',border:'1px solid #fca5a5',borderRadius:'12px',padding:'12px 16px',marginBottom:'16px',color:'#dc2626',fontSize:'14px',textAlign:'center'}}>{matchError}</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.sigles}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {activeMatching.map((m: any)=>{const ip=!!matchPairs[m.sigle],is=matchSelected===m.sigle;return(
                  <button key={m.sigle} onClick={()=>handleMatchSigle(m.sigle)} disabled={ip}
                    style={{padding:'12px',borderRadius:'10px',fontSize:'14px',fontWeight:'700',cursor:ip?'default':'pointer',transition:'all 0.2s',background:ip?'#d1fae5':is?C:'white',color:ip?'#059669':is?'white':'#1f2937',border:ip?'1.5px solid #6ee7b7':is?`1.5px solid ${C}`:'1.5px solid #e5e7eb'}}>
                    {ip?'✓ ':''}{m.sigle}
                  </button>
                )})}
              </div>
            </div>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.definitions}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {shuffle(activeMatching.map((m: any)=>({definition:m.definition}))).map((m: any)=>{const ip=Object.values(matchPairs).includes(m.definition);return(
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
    const q2=activeVF[vfIndex] as any
    return (
      <div style={{...base,background:vfAnimation==='correct'?'#d1fae5':vfAnimation==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar/>
        <div style={{background:vfAnimation==='correct'?'#6ee7b7':vfAnimation==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:`${(vfIndex/activeVF.length)*100}%`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'24px'}}>{t.quiz2label} — {vfIndex+1}/{activeVF.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.quiz2title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'32px 24px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'28px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'18px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q2.texte}</p>
          </div>
          {vfRepondu===null?(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={()=>repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={()=>repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#dc2626',cursor:'pointer'}}>{t.false}</button>
            </div>
          ):(
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnimation==='correct'?'#059669':'#dc2626',fontSize:'18px',margin:'0 0 8px'}}>{vfAnimation==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'15px',margin:0,fontStyle:'italic'}}>{q2.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
            {activeVF.map((_: any,i: number)=><div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=vfIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase==='quiz3') {
    const cas=activeCas[casIndex] as any
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(casIndex/activeCas.length)*100}%`,transition:'width 0.4s ease'}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.quiz3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.quiz3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:`2px solid ${C}30`,marginBottom:'20px',boxShadow:`0 4px 20px ${C}10`}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#1f2937',lineHeight:1.6,margin:0}}>📋 {cas.situation}</p>
          </div>
          {casRepondu===null?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt: string,i: number)=>(
                <button key={i} onClick={()=>repCas(opt)}
                  style={{padding:'16px 20px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left',transition:'all 0.15s'}}
                  onMouseOver={(e)=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=`${C}08`}}
                  onMouseOut={(e)=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ):(
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px'}}>
                {cas.options.map((opt: string,i: number)=>{
                  const isCorrect=opt===cas.action; const isChosen=opt===casRepondu
                  return <div key={i} style={{padding:'16px 20px',background:isCorrect?'#d1fae5':isChosen?'#fee2e2':'white',border:`1.5px solid ${isCorrect?'#6ee7b7':isChosen?'#fca5a5':'#e5e7eb'}`,borderRadius:'12px',fontSize:'14px',fontWeight:'600',color:isCorrect?'#059669':isChosen?'#dc2626':'#9ca3af'}}>
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
        <div style={{background:'white',borderRadius:'20px',padding:'32px',boxShadow:`0 8px 32px ${C}10`,marginBottom:'24px'}}>
          <div style={{fontSize:'56px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'24px'}}>/100</span></div>
          <p style={{color:'#6b7280',margin:'0 0 20px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#f3f4f6',borderRadius:'8px',height:'12px',overflow:'hidden'}}>
            <div style={{background:`linear-gradient(90deg,${C},#06b6d4)`,height:'12px',width:`${total}%`,borderRadius:'8px'}}/>
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
