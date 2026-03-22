const fs = require('fs');

// Unicode right quote to avoid JS string parsing issues
const Q = '\u2019';

function q(str) {
  // Replace all ASCII apostrophes between word chars with unicode right quote
  return str.replace(/([a-zA-Z0-9\u00C0-\u00FF])'([a-zA-Z0-9\u00C0-\u00FF])/g, `$1${Q}$2`);
}

const FICHES_FR = [
  {id:1,emoji:'🌍',titre:q("C'est quoi le CRS ?"),contenu:[
    {icon:'🎯',texte:q("**CRS** = Common Reporting Standard = Norme Commune de Déclaration — standard de l'OCDE pour l'échange automatique d'informations fiscales")},
    {icon:'📅',texte:q("Adopté en 2014 par l'OCDE, le CRS est en vigueur au Luxembourg depuis **2016**")},
    {icon:'🌍',texte:q("Plus de **100 pays** participent au CRS — c'est le système mondial de transparence fiscale le plus large jamais créé")},
    {icon:'🎯',texte:q("Objectif : permettre aux administrations fiscales de connaître les comptes que leurs résidents détiennent **à l'étranger**")},
  ],aretenir:q("Le CRS est la réponse internationale à l'évasion fiscale. i-Hub, en tant qu'IFE luxembourgeoise, y est directement soumis.")},

  {id:2,emoji:'🤝',titre:q("CRS vs FATCA : les différences clés"),contenu:[
    {icon:'🇺🇸',texte:q("**FATCA** : initiative américaine unilatérale — basée sur la **nationalité/citoyenneté** (US Person)")},
    {icon:'🌍',texte:q("**CRS** : initiative multilatérale OCDE — basée sur la **résidence fiscale** du titulaire du compte")},
    {icon:'📊',texte:q("FATCA : seuls les comptes US sont déclarés à l'IRS. CRS : tous les comptes de résidents étrangers sont déclarés à leur pays")},
    {icon:'🔄',texte:q("Un client peut être soumis aux deux : résident français de nationalité américaine → FATCA ET CRS en parallèle")},
  ],aretenir:q("CRS et FATCA coexistent. La différence fondamentale : FATCA = nationalité, CRS = résidence fiscale.")},

  {id:3,emoji:'🏠',titre:q("La résidence fiscale : concept central du CRS"),contenu:[
    {icon:'📍',texte:q("La **résidence fiscale** est le pays où une personne est imposable sur ses revenus mondiaux — pas forcément où elle vit")},
    {icon:'📋',texte:q("Chaque pays a ses propres règles pour déterminer la résidence fiscale (séjour > 183 jours, foyer permanent, centre d'intérêts...)")},
    {icon:'2️⃣',texte:q("Une personne peut avoir **plusieurs résidences fiscales** simultanément — toutes doivent être déclarées")},
    {icon:'🚫',texte:q("**Pas de résidence fiscale nulle** : tout individu a au moins une résidence fiscale quelque part dans le monde")},
  ],aretenir:q("i-Hub doit identifier la ou les résidences fiscales de chaque client — pas seulement son lieu de résidence physique."),
  plusLoin:[
    {icon:'💡',texte:q("Les **conventions de double imposition** (CDI) peuvent déterminer quelle résidence fiscale prime en cas de conflit")},
    {icon:'🔍',texte:q("En cas de doute sur la résidence fiscale, i-Hub signale l'incohérence au **PSF**, qui demande une **auto-certification** complémentaire au client final")},
    {icon:'🌍',texte:q("Certains pays (ex: Monaco, Bahamas) ne participent pas au CRS — leurs résidents ne font pas l'objet d'un échange automatique")},
  ]},

  {id:4,emoji:'🏦',titre:q("i-Hub : Institution Financière Déclarante"),contenu:[
    {icon:'🎯',texte:q("i-Hub **n’est pas** une IFD (Institution Financière Déclarante) — il ne reçoit pas de dépôts et ne gère pas de comptes pour ses propres clients")},
    {icon:'📋',texte:q("Les IFD (banques, fonds, assureurs) sont les **PSF clients d’i-Hub** — ce sont eux qui déclarent au CRS sous leur propre responsabilité")},
    {icon:'🏛️',texte:q("Les **PSF clients** d’i-Hub déclarent chaque année à l'ACD (Administration des Contributions Directes) du Luxembourg")},
    {icon:'🔄',texte:q("L'ACD transmet ensuite les informations aux **autorités fiscales des pays de résidence** des clients concernés")},
  ],aretenir:q("i-Hub est un **PSF de support** : il vérifie la cohérence documentaire pour le compte des PSF. Ce sont les PSF qui collectent, classent et déclarent — pas i-Hub.")},

  {id:5,emoji:'📋',titre:q("Les comptes déclarables au CRS"),contenu:[
    {icon:'👤',texte:q("**Comptes de personnes physiques** : tout compte détenu par un résident fiscal d'un pays CRS autre que le Luxembourg")},
    {icon:'🏢',texte:q("**Comptes d'entités passives** avec des **personnes détenant le contrôle** résidentes dans un pays CRS")},
    {icon:'💰',texte:q("**Seuils de déclaration** : comptes préexistants de personnes physiques < 1M USD peuvent bénéficier d'une procédure allégée")},
    {icon:'🚫',texte:q("**Exclusions** : comptes de retraite réglementés, comptes dormants de faible valeur, certains produits d'assurance")},
  ],aretenir:q("Pas tous les comptes sont déclarables. La classification correcte de chaque compte est essentielle pour i-Hub.")},

  {id:6,emoji:'📝',titre:q("L'auto-certification du client final du PSF"),contenu:[
    {icon:'📄',texte:q("L'**auto-certification** est le document par lequel le **client final du PSF** déclare lui-même sa ou ses résidences fiscales au **PSF**")},
    {icon:'✍️',texte:q("Elle doit être signée par le client et doit contenir : nom, adresse, pays de résidence fiscale, **NIF** (numéro d'identification fiscale)")},
    {icon:'⏱️',texte:q("Le **PSF** doit obtenir l'auto-certification du client final dans les **90 jours** suivant l'ouverture — i-Hub vérifie sa présence et sa cohérence")},
    {icon:'🔄',texte:q("L'auto-certification doit être **mise à jour** si la situation du client final change — le client final notifie le **PSF**, qui sollicite i-Hub pour re-vérifier si nécessaire")},
  ],aretenir:q("Sans auto-certification valide, le **PSF** ne peut pas finaliser l'entrée en relation avec son client final. i-Hub vérifie que le document est présent et cohérent."),
  plusLoin:[
    {icon:'📋',texte:q("Le format de l'auto-certification n'est pas imposé — le **PSF** utilise son propre formulaire ou un modèle OCDE, qu'i-Hub reçoit et vérifie")},
    {icon:'🔍',texte:q("i-Hub vérifie la **plausibilité** de l'auto-certification reçue par rapport aux autres documents d'identité du client final")},
    {icon:'⚠️',texte:q("Une auto-certification **incohérente** avec les données KYC doit être rejetée et une nouvelle demandée")},
  ]},

  {id:7,emoji:'🔢',titre:q("Le NIF — Numéro d'Identification Fiscale"),contenu:[
    {icon:'🎯',texte:q("Le **NIF** est l'identifiant fiscal attribué par chaque pays à ses résidents — indispensable pour le CRS")},
    {icon:'🌍',texte:q("Chaque pays a son propre format de NIF : **Luxembourg** (matricule), **France** (numéro fiscal), **Allemagne** (Steuer-ID)...")},
    {icon:'❓',texte:q("Si le client n'a pas de NIF (certains pays n'en délivrent pas), il doit le **justifier** dans l'auto-certification")},
    {icon:'📋',texte:q("Le **PSF** doit conserver et déclarer le NIF, i-Hub vérifie sa présence et cohérence de chaque titulaire de compte déclarable à l'ACD")},
  ],aretenir:q("Le NIF est la clé de voûte du CRS. Sans NIF, la déclaration est incomplète — i-Hub doit relancer le client.")},

  {id:8,emoji:'🗂️',titre:q("Classification des entités au CRS"),contenu:[
    {icon:'🏦',texte:q("**IFD** (Institution Financière Déclarante) : soumise aux obligations CRS — banques, fonds, PSF...")},
    {icon:'🏢',texte:q("**ENF Active** (Entité Non Financière Active) : société dont l'activité principale est non financière — peu d'obligations")},
    {icon:'🟡',texte:q("**ENF Passive** : holding ou entité patrimoniale — doit identifier ses **personnes détenant le contrôle**")},
    {icon:'👥',texte:q("**Personnes détenant le contrôle** d'une ENF Passive = UBO au sens CRS (seuil : participation > 25% en général)")},
  ],aretenir:q("La classification CRS d'une entité détermine ce qu'Le PSF collecte et déclare. i-Hub vérifie la cohérence des documents transmis. ENF Passive = vigilance accrue.")},

  {id:9,emoji:'📊',titre:q("Que déclare-t-on à l'ACD ?"),contenu:[
    {icon:'👤',texte:q("**Identité** : nom, adresse, date de naissance, NIF et pays de résidence fiscale du titulaire déclarable")},
    {icon:'🔢',texte:q("**Numéro de compte** et **solde ou valeur** au 31 décembre de l'année de déclaration")},
    {icon:'💰',texte:q("**Revenus** : intérêts, dividendes, autres revenus générés sur le compte durant l'année")},
    {icon:'📅',texte:q("Déclaration annuelle à l'ACD — délai : **30 juin** de l'année suivante (ex : données 2024 → 30 juin 2025)")},
  ],aretenir:q("La déclaration CRS est exhaustive : identité + solde + revenus. Une omission partielle est une infraction.")},

  {id:10,emoji:'🔍',titre:q("Procédures de diligence raisonnable"),contenu:[
    {icon:'🆕',texte:q("**Nouveaux comptes** : auto-certification obligatoire dès l'ouverture — aucune ouverture sans résidence fiscale identifiée")},
    {icon:'📁',texte:q("**Comptes préexistants** (ouverts avant le 1er janvier 2016) : revue documentaire pour détecter les indices de résidence étrangère")},
    {icon:'💎',texte:q("**Comptes de valeur élevée** (> 1M USD) : procédure renforcée incluant une **revue des dossiers papier** et entretien avec le gestionnaire")},
    {icon:'🔄',texte:q("**Surveillance continue** : mise à jour obligatoire en cas de changement de circonstances signalé par le client ou détecté par i-Hub")},
  ],aretenir:q("Nouveaux comptes = auto-certification obligatoire. Comptes préexistants = revue documentaire. Comptes > 1M = procédure renforcée.")},

  {id:11,emoji:'🚨',titre:q("Changement de circonstances"),contenu:[
    {icon:'🔔',texte:q("Un **changement de circonstances** = tout événement modifiant la résidence fiscale d'un client")},
    {icon:'📋',texte:q("Exemples : déménagement dans un nouveau pays, obtention d'une nouvelle nationalité, changement d'adresse postale")},
    {icon:'⚡',texte:q("Le **PSF** doit traiter le changement dans les **90 jours** — obtenir une nouvelle auto-certification du client final et reclassifier — i-Hub vérifie le nouveau document")},
    {icon:'🚫',texte:q("Si le client final ne fournit pas de nouvelle auto-certification, le **PSF** applique la **présomption de résidence** basée sur les indices disponibles},
  ],aretenir:q("i-Hub ne peut pas ignorer un changement de circonstances. Toute mise à jour d'adresse peut déclencher une reclassification CRS.")},

  {id:12,emoji:'⚖️',titre:q("Sanctions en cas de manquement au CRS"),contenu:[
    {icon:'💸',texte:q("**Amendes ACD** : jusqu'à **250 000 €** par déclaration incorrecte, incomplète ou tardive au Luxembourg")},
    {icon:'🏛️',texte:q("**Sanctions CSSF** : retrait de licence ou suspension d'activité pour manquements graves et répétés")},
    {icon:'⚖️',texte:q("**Sanctions pénales** : jusqu'à 5 ans d'emprisonnement pour obstruction délibérée au CRS")},
    {icon:'📰',texte:q("**Risque réputationnel** : publication des sanctions — impact majeur sur la confiance des clients d'i-Hub")},
  ],aretenir:q("Les sanctions CRS sont sévères et cumulables. La conformité coûte moins cher que le risque de sanction."),
  plusLoin:[
    {icon:'🔍',texte:q("L'ACD réalise des **contrôles aléatoires** des déclarations CRS — i-Hub doit pouvoir justifier chaque choix de classification")},
    {icon:'🤝',texte:q("Un **programme de divulgation volontaire** existe : corriger une erreur avant contrôle réduit significativement les sanctions")},
    {icon:'🌍',texte:q("Le **Forum mondial de l'OCDE** surveille la mise en œuvre du CRS dans chaque pays — Luxembourg est régulièrement évalué")},
  ]},

  {id:13,emoji:'🔒',titre:q("CRS et protection des données (RGPD)"),contenu:[
    {icon:'⚖️',texte:q("La collecte de données CRS implique des **données personnelles** — le RGPD s'applique en parallèle")},
    {icon:'📋',texte:q("i-Hub doit **informer ses clients** de la collecte et transmission de leurs données dans le cadre du CRS (droit à l'information)")},
    {icon:'🔒',texte:q("Les données CRS doivent être stockées de façon **sécurisée** et conservées **5 ans minimum** après la déclaration")},
    {icon:'🚫',texte:q("La finalité de la collecte (CRS) est **légalement imposée** — le client ne peut pas s'y opposer en invoquant le RGPD")},
  ],aretenir:q("RGPD et CRS s'appliquent simultanément. i-Hub doit informer ses clients de la transmission de leurs données fiscales.")},

  {id:14,emoji:'🌐',titre:q("Pays participants au CRS"),contenu:[
    {icon:'✅',texte:q("Plus de **100 juridictions** participent au CRS — dont tous les pays de l'UE, le Royaume-Uni, l'Australie, le Canada, le Japon...")},
    {icon:'🚫',texte:q("**Non-participants notables** : USA (qui a son propre FATCA), quelques paradis fiscaux et petits États")},
    {icon:'🔄',texte:q("La liste des pays participants est **mise à jour régulièrement** — le **PSF** et i-Hub doivent vérifier la liste avant chaque campagne de vérification nouvelles")},
    {icon:'📋',texte:q("Un compte détenu par un résident d'un pays non-participant au CRS n'est **pas déclarable** sous ce régime")},
  ],aretenir:q("La liste des pays CRS détermine quels comptes sont déclarables. Un pays qui rejoint le CRS peut rendre des comptes existants déclarables."),
  plusLoin:[
    {icon:'🌍',texte:q("**Échange réciproque** : le Luxembourg reçoit aussi des informations de l'étranger sur les comptes de résidents luxembourgeois détenus à l'étranger")},
    {icon:'📅',texte:q("**Premiers échanges** : Luxembourg a effectué ses premiers échanges CRS en **septembre 2017**")},
    {icon:'🔍',texte:q("Le **Forum mondial** surveille la qualité des échanges — un pays qui transmet des données incomplètes peut être sanctionné")},
  ]},

  {id:15,emoji:'👨‍💼',titre:q("Rôles et responsabilités chez i-Hub"),contenu:[
    {icon:'🎯',texte:q("**Onboarding** : collecte l'auto-certification et vérifie sa cohérence avec le dossier KYC dès l'entrée en relation")},
    {icon:'🔍',texte:q("**Compliance** : valide les classifications complexes (ENF Passive, doubles résidences fiscales), tranche les cas ambigus")},
    {icon:'💻',texte:q("**IT / Data** : gère les systèmes de classification, génère les fichiers XML annuels et envoie à l'ACD")},
    {icon:'👤',texte:q("**Chaque employé** : doit signaler tout indice de changement de résidence fiscale d'un client à l'équipe Compliance")},
  ],aretenir:q("Le CRS est un processus d'équipe. Onboarding, Compliance, IT et management ont chacun un rôle précis et complémentaire.")},
];

const FICHES_EN = [
  {id:1,emoji:'🌍',titre:q("What is the CRS?"),contenu:[
    {icon:'🎯',texte:q("**CRS** = Common Reporting Standard — the OECD standard for the automatic exchange of tax information between countries")},
    {icon:'📅',texte:q("Adopted by the OECD in 2014, the CRS has been in force in Luxembourg since **2016**")},
    {icon:'🌍',texte:q("Over **100 countries** participate in the CRS — the largest global tax transparency system ever created")},
    {icon:'🎯',texte:q("Goal: allow tax authorities to know about accounts their residents hold **abroad**")},
  ],aretenir:q("The CRS is the international response to tax evasion. i-Hub, as a Luxembourg FFI, is directly subject to it.")},

  {id:2,emoji:'🤝',titre:q("CRS vs FATCA: key differences"),contenu:[
    {icon:'🇺🇸',texte:q("**FATCA**: unilateral US initiative — based on **nationality/citizenship** (US Person)")},
    {icon:'🌍',texte:q("**CRS**: multilateral OECD initiative — based on the **tax residence** of the account holder")},
    {icon:'📊',texte:q("FATCA: only US accounts reported to IRS. CRS: all accounts of foreign residents reported to their home country")},
    {icon:'🔄',texte:q("A client may be subject to both: French resident with US nationality → FATCA AND CRS simultaneously")},
  ],aretenir:q("CRS and FATCA coexist. The key difference: FATCA = nationality, CRS = tax residence.")},

  {id:3,emoji:'🏠',titre:q("Tax residence: the CRS core concept"),contenu:[
    {icon:'📍',texte:q("**Tax residence** is the country where a person is taxable on their worldwide income — not necessarily where they live")},
    {icon:'📋',texte:q("Each country has its own rules for determining tax residence (stay > 183 days, permanent home, centre of interests...)")},
    {icon:'2️⃣',texte:q("A person may have **multiple tax residences** simultaneously — all must be declared")},
    {icon:'🚫',texte:q("**No nil tax residence**: every individual has at least one tax residence somewhere in the world")},
  ],aretenir:q("i-Hub must identify the tax residence(s) of each client — not just their physical place of residence."),
  plusLoin:[
    {icon:'💡',texte:q("**Double tax treaties** (DTTs) may determine which tax residence prevails in case of conflict")},
    {icon:'🔍',texte:q("If tax residence is unclear, i-Hub flags the inconsistency to the **PSF**, who requests additional **self-certification** from the final client")},
    {icon:'🌍',texte:q("Some countries (e.g. Monaco, Bahamas) do not participate in CRS — their residents are not subject to automatic exchange")},
  ]},

  {id:4,emoji:'🏦',titre:q("i-Hub: a Reporting Financial Institution"),contenu:[
    {icon:'🎯',texte:q("i-Hub is **not** an RFI (Reporting Financial Institution) — it does not hold deposits or manage accounts for its own clients")},
    {icon:'📋',texte:q("RFIs include: banks, investment funds, insurance companies, support PSFs like i-Hub")},
    {icon:'🏛️',texte:q("i-Hub’s **PSF clients** report annually to the ACD (Administration des Contributions Directes) in Luxembourg")},
    {icon:'🔄',texte:q("The ACD then transmits the information to the **tax authorities of the clients' countries of residence**")},
  ],aretenir:q("i-Hub is on the front line of CRS. It collects, classifies and reports — the ACD redistributes to partner countries.")},

  {id:5,emoji:'📋',titre:q("Reportable accounts under CRS"),contenu:[
    {icon:'👤',texte:q("**Individual accounts**: any account held by a tax resident of a CRS country other than Luxembourg")},
    {icon:'🏢',texte:q("**Passive entity accounts** with **controlling persons** resident in a CRS country")},
    {icon:'💰',texte:q("**Reporting thresholds**: pre-existing individual accounts below USD 1M may benefit from simplified procedures")},
    {icon:'🚫',texte:q("**Exclusions**: regulated retirement accounts, dormant low-value accounts, certain insurance products")},
  ],aretenir:q("Not all accounts are reportable. Correct classification of each account is essential for i-Hub.")},

  {id:6,emoji:'📝',titre:q("PSF final client self-certification"),contenu:[
    {icon:'📄',texte:q("The **self-certification** is the document by which the **PSF's final client** declares their tax residence(s) to the **PSF**")},
    {icon:'✍️',texte:q("It must be signed and contain: name, address, country of tax residence, **TIN** (tax identification number)")},
    {icon:'⏱️',texte:q("The **PSF** must obtain the self-certification from the final client within **90 days** of account opening — i-Hub verifies its presence and consistency")},
    {icon:'🔄',texte:q("The self-certification must be **updated** if the final client's situation changes — the final client notifies the **PSF**, who may ask i-Hub to re-verify")},
  ],aretenir:q("Without a valid self-certification, the **PSF** cannot complete onboarding of its final client. i-Hub verifies that the document is present and consistent."),
  plusLoin:[
    {icon:'📋',texte:q("The format is not prescribed — the **PSF** uses its own form or an OECD template, which i-Hub receives and verifies")},
    {icon:'🔍',texte:q("i-Hub verifies the **plausibility** of the self-certification received against other identity documents of the final client")},
    {icon:'⚠️',texte:q("A self-certification **inconsistent** with KYC data must be rejected and a new one requested")},
  ]},

  {id:7,emoji:'🔢',titre:q("TIN — Tax Identification Number"),contenu:[
    {icon:'🎯',texte:q("The **TIN** is the tax identifier assigned by each country to its residents — essential for CRS")},
    {icon:'🌍',texte:q("Each country has its own TIN format: **Luxembourg** (matricule), **France** (numéro fiscal), **Germany** (Steuer-ID)...")},
    {icon:'❓',texte:q("If the client has no TIN (some countries do not issue them), they must **justify** this in the self-certification")},
    {icon:'📋',texte:q("i-Hub must **retain and report** the TIN of each reportable account holder to the ACD")},
  ],aretenir:q("The TIN is the cornerstone of CRS. Without a TIN, the report is incomplete — i-Hub must follow up with the client.")},

  {id:8,emoji:'🗂️',titre:q("Entity classification under CRS"),contenu:[
    {icon:'🏦',texte:q("**RFI** (Reporting Financial Institution): subject to CRS obligations — banks, funds, PSFs...")},
    {icon:'🏢',texte:q("**Active NFE** (Non-Financial Entity): company whose main activity is non-financial — limited obligations")},
    {icon:'🟡',texte:q("**Passive NFE**: holding or investment entity — must identify its **controlling persons**")},
    {icon:'👥',texte:q("**Controlling persons** of a Passive NFE = UBOs in CRS terms (threshold: ownership > 25% in general)")},
  ],aretenir:q("CRS entity classification determines what the **PSF** must collect and report. For i-Hub: Passive NFE = enhanced documentary verification.")},

  {id:9,emoji:'📊',titre:q("What is reported to the ACD?"),contenu:[
    {icon:'👤',texte:q("**Identity**: name, address, date of birth, TIN and country of tax residence of the reportable holder")},
    {icon:'🔢',texte:q("**Account number** and **balance or value** as of 31 December of the reporting year")},
    {icon:'💰',texte:q("**Income**: interest, dividends, other income generated on the account during the year")},
    {icon:'📅',texte:q("Annual report to the ACD — deadline: **30 June** of the following year (e.g. 2024 data → 30 June 2025)")},
  ],aretenir:q("The CRS report is comprehensive: identity + balance + income. A partial omission is a violation.")},

  {id:10,emoji:'🔍',titre:q("Due diligence procedures"),contenu:[
    {icon:'🆕',texte:q("**New accounts**: self-certification mandatory at opening — no account without identified tax residence")},
    {icon:'📁',texte:q("**Pre-existing accounts** (opened before 1 January 2016): documentary review to detect foreign residence indicators")},
    {icon:'💎',texte:q("**High-value accounts** (> USD 1M): enhanced procedure including **paper file review** and relationship manager interview")},
    {icon:'🔄',texte:q("**Ongoing monitoring**: mandatory update when a change of circumstances is reported or detected")},
  ],aretenir:q("New accounts = mandatory self-certification. Pre-existing = documentary review. Above USD 1M = enhanced procedure.")},

  {id:11,emoji:'🚨',titre:q("Change of circumstances"),contenu:[
    {icon:'🔔',texte:q("A **change of circumstances** = any event that modifies a client's tax residence")},
    {icon:'📋',texte:q("Examples: relocation to a new country, acquisition of a new nationality, change of postal address")},
    {icon:'⚡',texte:q("The **PSF** must process the change within **90 days** — obtain a new self-certification from the final client and reclassify — i-Hub verifies the new document")},
    {icon:'🚫',texte:q("If the final client does not provide a new self-certification, the **PSF** applies a **residence presumption** based on available indicators")},
  ],aretenir:q("i-Hub cannot ignore a change of circumstances. Any address update may trigger a CRS reclassification.")},

  {id:12,emoji:'⚖️',titre:q("Penalties for CRS non-compliance"),contenu:[
    {icon:'💸',texte:q("**ACD fines**: up to **€250,000** per incorrect, incomplete or late declaration in Luxembourg")},
    {icon:'🏛️',texte:q("**CSSF sanctions**: licence withdrawal or activity suspension for serious and repeated breaches")},
    {icon:'⚖️',texte:q("**Criminal penalties**: up to 5 years' imprisonment for deliberate obstruction of CRS")},
    {icon:'📰',texte:q("**Reputational risk**: publication of sanctions — major impact on client trust in i-Hub")},
  ],aretenir:q("CRS penalties are severe and cumulative. Compliance costs less than the risk of sanctions."),
  plusLoin:[
    {icon:'🔍',texte:q("The ACD conducts **random checks** on CRS declarations — i-Hub must justify every classification decision")},
    {icon:'🤝',texte:q("A **voluntary disclosure programme** exists: correcting an error before an audit significantly reduces penalties")},
    {icon:'🌍',texte:q("The **OECD Global Forum** monitors CRS implementation in each country — Luxembourg is regularly reviewed")},
  ]},

  {id:13,emoji:'🔒',titre:q("CRS and data protection (GDPR)"),contenu:[
    {icon:'⚖️',texte:q("CRS data collection involves **personal data** — GDPR applies in parallel")},
    {icon:'📋',texte:q("i-Hub must **inform clients** of the collection and transmission of their data under CRS (right to information)")},
    {icon:'🔒',texte:q("CRS data must be stored **securely** and retained for a **minimum of 5 years** after declaration")},
    {icon:'🚫',texte:q("The purpose of collection (CRS) is **legally mandated** — clients cannot object on GDPR grounds")},
  ],aretenir:q("GDPR and CRS apply simultaneously. i-Hub must inform its clients of the transmission of their tax data.")},

  {id:14,emoji:'🌐',titre:q("CRS participating countries"),contenu:[
    {icon:'✅',texte:q("Over **100 jurisdictions** participate in CRS — including all EU countries, the UK, Australia, Canada, Japan...")},
    {icon:'🚫',texte:q("**Notable non-participants**: USA (which has its own FATCA), some tax havens and small states")},
    {icon:'🔄',texte:q("The list of participating countries is **updated regularly** — the **PSF** and i-Hub should check the list before each verification campaign")},
    {icon:'📋',texte:q("An account held by a resident of a CRS non-participant country is **not reportable** under this regime")},
  ],aretenir:q("The CRS country list determines which accounts are reportable. A new country joining CRS may make existing accounts reportable."),
  plusLoin:[
    {icon:'🌍',texte:q("**Reciprocal exchange**: Luxembourg also receives information from abroad about accounts held by Luxembourg residents overseas")},
    {icon:'📅',texte:q("**First exchanges**: Luxembourg conducted its first CRS exchanges in **September 2017**")},
    {icon:'🔍',texte:q("The **Global Forum** monitors exchange quality — a country transmitting incomplete data may face consequences")},
  ]},

  {id:15,emoji:'👨‍💼',titre:q("Roles and responsibilities at i-Hub"),contenu:[
    {icon:'🎯',texte:q("**Onboarding**: collects self-certification and checks its consistency with KYC file at relationship opening")},
    {icon:'🔍',texte:q("**Compliance**: validates complex classifications (Passive NFE, dual tax residences), decides ambiguous cases")},
    {icon:'💻',texte:q("**IT / Data**: manages classification systems, generates annual XML files and submits to ACD")},
    {icon:'👤',texte:q("**Every employee**: must flag any indicator of a client's change of tax residence to the Compliance team")},
  ],aretenir:q("CRS is a team process. Onboarding, Compliance, IT and management each have a precise and complementary role.")},
];

const MATCHING_FR = [
  {sigle:'CRS',definition:q("Norme commune de déclaration OCDE")},
  {sigle:'IFD',definition:q("Institution financière qui déclare au CRS")},
  {sigle:'Résidence fiscale',definition:q("Pays où une personne est imposable sur ses revenus mondiaux")},
  {sigle:'NIF',definition:q("Numéro d'identification fiscale d'un contribuable")},
  {sigle:'Auto-certification',definition:q("Document par lequel le client déclare sa résidence fiscale")},
  {sigle:'ENF Passive',definition:q("Entité patrimoniale devant déclarer ses UBO étrangers")},
  {sigle:'ACD',definition:q("Autorité luxembourgeoise recevant les déclarations CRS")},
  {sigle:'ENF Active',definition:q("Société opérationnelle peu soumise aux obligations CRS")},
  {sigle:'Changement de circonstances',definition:q("Événement modifiant la résidence fiscale d'un client")},
  {sigle:'90 jours',definition:q("Délai pour obtenir une auto-certification après ouverture")},
];
const MATCHING_EN = [
  {sigle:'CRS',definition:q("OECD common reporting standard")},
  {sigle:'RFI',definition:q("Financial institution that reports under CRS")},
  {sigle:'Tax residence',definition:q("Country where a person is taxable on worldwide income")},
  {sigle:'TIN',definition:q("Tax identification number of a taxpayer")},
  {sigle:'Self-certification',definition:q("Document by which the client declares their tax residence")},
  {sigle:'Passive NFE',definition:q("Investment entity that must disclose foreign UBOs")},
  {sigle:'ACD',definition:q("Luxembourg authority receiving CRS reports")},
  {sigle:'Active NFE',definition:q("Operating company with limited CRS obligations")},
  {sigle:'Change of circumstances',definition:q("Event that modifies a client's tax residence")},
  {sigle:'90 days',definition:q("Deadline to obtain a self-certification after account opening")},
];

const VF_FR = [
  {texte:q("Le CRS est basé sur la nationalité du titulaire du compte"),reponse:false,explication:q("Non ! Le CRS est basé sur la résidence fiscale, pas la nationalité. C'est FATCA qui utilise la nationalité.")},
  {texte:q("Le Luxembourg a effectué ses premiers échanges CRS en 2017"),reponse:true,explication:q("Exact ! Les premiers échanges CRS luxembourgeois ont eu lieu en septembre 2017.")},
  {texte:q("Une personne peut avoir plusieurs résidences fiscales simultanément"),reponse:true,explication:q("Exact ! Une personne peut être résidente fiscale dans plusieurs pays à la fois — toutes doivent être déclarées.")},
  {texte:q("i-Hub ne déclare pas aux autorités fiscales étrangères — c'est le rôle du PSF via l'ACD"),reponse:false,explication:q("Non ! C'est le PSF qui déclare à l'ACD luxembourgeoise, qui transmet ensuite aux pays partenaires.")},
  {texte:q("L'auto-certification doit être obtenue dans les 90 jours suivant l'ouverture du compte"),reponse:true,explication:q("Exact ! Le délai légal est de 90 jours. Au-delà, i-Hub est en infraction.")},
  {texte:q("Les USA participent au CRS"),reponse:false,explication:q("Non ! Les USA ont leur propre système (FATCA) et ne participent pas au CRS de l'OCDE.")},
  {texte:q("Une ENF Active doit déclarer ses personnes détenant le contrôle"),reponse:false,explication:q("Non ! C'est l'ENF Passive qui doit déclarer ses personnes détenant le contrôle résidentes à l'étranger.")},
  {texte:q("La déclaration CRS annuelle est due avant le 30 juin"),reponse:true,explication:q("Exact ! Le délai de déclaration à l'ACD est le 30 juin de l'année suivant l'année de référence.")},
  {texte:q("Le RGPD s'oppose à la collecte de données dans le cadre du CRS"),reponse:false,explication:q("Non ! La collecte CRS est légalement imposée — le client ne peut pas l'opposer au RGPD.")},
  {texte:q("L'amende ACD peut atteindre 250 000 € par déclaration incorrecte"),reponse:true,explication:q("Exact ! Les sanctions luxembourgeoises pour manquement CRS peuvent atteindre 250 000 € par infraction.")},
  {texte:q("CRS et FATCA ne peuvent jamais s'appliquer au même client en même temps"),reponse:false,explication:q("Non ! Un résident français de nationalité américaine est soumis aux deux simultanément.")},
  {texte:q("Les comptes de valeur supérieure à 1 million USD font l'objet d'une procédure renforcée"),reponse:true,explication:q("Exact ! Les comptes > 1M USD nécessitent une procédure de diligence renforcée incluant une revue documentaire complète.")},
];
const VF_EN = [
  {texte:q("The CRS is based on the account holder's nationality"),reponse:false,explication:q("No! The CRS is based on tax residence, not nationality. It's FATCA that uses nationality.")},
  {texte:q("Luxembourg conducted its first CRS exchanges in 2017"),reponse:true,explication:q("Correct! Luxembourg's first CRS exchanges took place in September 2017.")},
  {texte:q("A person can have multiple tax residences simultaneously"),reponse:true,explication:q("Correct! A person can be a tax resident in several countries at once — all must be declared.")},
  {texte:q("i-Hub reports directly to foreign tax authorities"),reponse:false,explication:q("No! It is the **PSF** that reports to the Luxembourg ACD, which then transmits to partner countries.")},
  {texte:q("Self-certification must be obtained within 90 days of account opening"),reponse:true,explication:q("Correct! The legal deadline is 90 days. Beyond this, i-Hub is in breach.")},
  {texte:q("The USA participates in CRS"),reponse:false,explication:q("No! The USA has its own system (FATCA) and does not participate in the OECD CRS.")},
  {texte:q("An Active NFE must disclose its controlling persons"),reponse:false,explication:q("No! It's the Passive NFE that must disclose its controlling persons resident abroad.")},
  {texte:q("The annual CRS report is due before 30 June"),reponse:true,explication:q("Correct! The ACD reporting deadline is 30 June of the year following the reference year.")},
  {texte:q("GDPR prevents data collection under CRS"),reponse:false,explication:q("No! CRS data collection is legally mandated — clients cannot invoke GDPR against it.")},
  {texte:q("The ACD fine can reach €250,000 per incorrect declaration"),reponse:true,explication:q("Correct! Luxembourg penalties for CRS breaches can reach €250,000 per violation.")},
  {texte:q("CRS and FATCA can never apply to the same client at the same time"),reponse:false,explication:q("No! A French resident with US nationality is subject to both simultaneously.")},
  {texte:q("Accounts above USD 1 million are subject to an enhanced procedure"),reponse:true,explication:q("Correct! Accounts over USD 1M require an enhanced due diligence procedure including a full document review.")},
];

const CAS_FR = [
  {
    situation:q("Un résident belge est client final d'un PSF. Il refuse de remplir l'auto-certification auprès du PSF."),
    action:q("Bloquer l'ouverture — auto-certification obligatoire dans les 90 jours"),
    options:[q("Ouvrir le compte — la Belgique est un pays ami"),q("Bloquer l'ouverture — auto-certification obligatoire dans les 90 jours"),q("Ouvrir et déclarer à l'ACD sans auto-certification"),q("Appliquer FATCA à la place du CRS")],
    explication:q("L'auto-certification est obligatoire dans les 90 jours. Sans elle, le **PSF** ne peut pas finaliser l'entrée en relation avec son client final.")
  },
  {
    situation:q("Une holding luxembourgeoise a un actionnaire français détenant 30% du capital. Elle se déclare ENF Active."),
    action:q("Reclassifier en ENF Passive — 30% = personne détenant le contrôle à déclarer"),
    options:[q("Accepter — ENF Active = pas d'obligation CRS"),q("Demander un W-8BEN-E"),q("Reclassifier en ENF Passive — 30% = personne détenant le contrôle à déclarer"),q("Déclarer la holding comme résidente française")],
    explication:q("Une holding dont les revenus sont majoritairement passifs est une ENF Passive. 30% > 25% → actionnaire français à déclarer.")
  },
  {
    situation:q("Un client déménage d'Allemagne en Thaïlande (non-participant CRS). Il soumet une nouvelle auto-certification."),
    action:q("Reclassifier comme non-déclarable — la Thaïlande ne participe pas au CRS"),
    options:[q("Continuer à déclarer à l'ACD — prudence"),q("Reclassifier comme non-déclarable — la Thaïlande ne participe pas au CRS"),q("Appliquer FATCA à la place"),q("Déclarer à l'Allemagne car il y résidait avant")],
    explication:q("La Thaïlande ne participe pas au CRS. Un résident thaïlandais n'est pas déclarable sous ce régime — sous réserve de vérification.")
  },
  {
    situation:q("Un client ouvre un compte le 1er mars 2025. Au 30 juin 2025, il n'a toujours pas fourni son auto-certification."),
    action:q("Infraction — délai de 90 jours dépassé, signaler à l'équipe Compliance"),
    options:[q("Pas de problème — 30 juin est la date limite de déclaration"),q("Accorder 90 jours supplémentaires"),q("Infraction — délai de 90 jours dépassé, signaler à l'équipe Compliance"),q("Clôturer le compte immédiatement")],
    explication:q("90 jours à partir du 1er mars = 30 mai. Au 30 juin le délai est largement dépassé. Il faut escalader à Compliance.")
  },
  {
    situation:q("Un résident luxembourgeois d'origine américaine déclare une résidence fiscale aux USA uniquement dans son auto-certification."),
    action:q("Vérifier : FATCA s'applique (US Person), CRS non — mais demander confirmation de non-résidence LU"),
    options:[q("Appliquer CRS uniquement — pas besoin de FATCA"),q("Ignorer — il est luxembourgeois"),q("Vérifier : FATCA s'applique (US Person), CRS non — mais demander confirmation de non-résidence LU"),q("Déclarer sous les deux régimes automatiquement")],
    explication:q("US Person → FATCA obligatoire. Résidence fiscale USA seulement → CRS non applicable. Mais vérifier la non-résidence LU.")
  },
];
const CAS_EN = [
  {
    situation:q("A Belgian resident is a final client of a PSF. They refuse to complete the self-certification with the PSF."),
    action:q("Block opening — self-certification mandatory within 90 days"),
    options:[q("Open the account — Belgium is a partner country"),q("Block opening — self-certification mandatory within 90 days"),q("Open and report to ACD without self-certification"),q("Apply FATCA instead of CRS")],
    explication:q("Self-certification is mandatory within 90 days. Without it, the **PSF** cannot complete the onboarding of its final client.")
  },
  {
    situation:q("A Luxembourg holding has a French shareholder holding 30% of capital. It declares itself an Active NFE."),
    action:q("Reclassify as Passive NFE — 30% = controlling person to be reported"),
    options:[q("Accept — Active NFE = no CRS obligation"),q("Request a W-8BEN-E"),q("Reclassify as Passive NFE — 30% = controlling person to be reported"),q("Report the holding as a French resident")],
    explication:q("A holding with mainly passive income is a Passive NFE. 30% > 25% → French shareholder must be reported.")
  },
  {
    situation:q("A client moves from Germany to Thailand (CRS non-participant). They submit a new self-certification."),
    action:q("Reclassify as non-reportable — Thailand does not participate in CRS"),
    options:[q("Continue reporting to ACD — caution prevails"),q("Reclassify as non-reportable — Thailand does not participate in CRS"),q("Apply FATCA instead"),q("Report to Germany as they previously resided there")],
    explication:q("Thailand does not participate in CRS. A Thai resident is not reportable under this regime — subject to verification.")
  },
  {
    situation:q("A client opens an account on 1 March 2025. By 30 June 2025, they have still not provided their self-certification."),
    action:q("Breach — 90-day deadline exceeded, escalate to Compliance team"),
    options:[q("No problem — 30 June is the reporting deadline"),q("Grant an additional 90 days"),q("Breach — 90-day deadline exceeded, escalate to Compliance team"),q("Close the account immediately")],
    explication:q("90 days from 1 March = 30 May. By 30 June the deadline has long passed. Escalate to Compliance.")
  },
  {
    situation:q("A Luxembourg resident of US origin declares US tax residence only in their self-certification."),
    action:q("Check: FATCA applies (US Person), CRS does not — but confirm non-Luxembourg residence"),
    options:[q("Apply CRS only — no need for FATCA"),q("Ignore — they are Luxembourg-based"),q("Check: FATCA applies (US Person), CRS does not — but confirm non-Luxembourg residence"),q("Report under both regimes automatically")],
    explication:q("US Person → FATCA mandatory. Tax residence USA only → CRS not applicable. But verify non-Luxembourg tax residence.")
  },
];

const tsx = `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const UI = {
  fr: {
    title: 'CRS', subtitle: 'Common Reporting Standard \u2014 L\u2019\u00e9change automatique d\u2019informations fiscales',
    learn: '\ud83d\udcda Ce que vous allez apprendre :', learnItems: ${JSON.stringify(["Le principe du CRS et son cadre juridique au Luxembourg","La différence fondamentale entre CRS et FATCA","La notion de résidence fiscale et d'auto-certification","Le rôle d'i-Hub comme Institution Financière Déclarante","La classification CRS des entités (ENF Active, ENF Passive)","Les sanctions en cas de manquement au CRS"].map(q))},
    fiches:'15 fiches', quiz:'3 quiz fun', time:'~15 min',
    start:"C\u2019est parti ! \ud83d\ude80", prev:'\u2190 Pr\u00e9c\u00e9dent', next:'Fiche suivante',
    quizBtn:'\ud83c\udfae Passer aux quiz !', toRetain:'\u00c0 RETENIR', goFurther:'\ud83d\udd0d Aller plus loin',
    home:'\u2190 Accueil', pts:'\ud83e\ude99',
    quiz1label:'QUIZ 1/3 \u00b7 ASSOCIER LES PAIRES', quiz1title:'\ud83e\udde9 Reliez chaque terme \u00e0 sa d\u00e9finition',
    quiz1sub:"Cliquez d\u2019abord sur un terme, puis sur sa d\u00e9finition",
    sigles:'Termes', definitions:'D\u00e9finitions', quiz1done:'Parfait ! Tous les termes associ\u00e9s !',
    quiz2label:'QUIZ 2/3 \u00b7 VRAI OU FAUX', quiz2title:'\u2705 Vrai ou Faux \u2014 CRS en pratique',
    true:'\u2705 VRAI', false:'\u274c FAUX', correct:'Bravo !', wrong:'Pas tout \u00e0 fait...',
    quiz3label:'QUIZ 3/3 \u00b7 CAS PRATIQUES', quiz3title:'\ud83d\udd0d Analysez la situation',
    quiz3sub:'Quelle action s\u2019impose ?',
    resultTitle:'Module CRS termin\u00e9 \u2014 15 fiches ma\u00eetris\u00e9es !',
    backHome:'\u2190 Retour aux modules', restart:'\ud83d\udd04 Recommencer ce module',
    pts_gained:'points gagn\u00e9s', medal_gold:'Expert CRS !',
    medal_silver:'Bon r\u00e9sultat, continuez !', medal_bronze:'Relisez les fiches et r\u00e9essayez !',
    score:'Score total', next2:'Quiz suivant \u2192', last:'Dernier quiz \u2192',
  },
  en: {
    title: 'CRS', subtitle: 'Common Reporting Standard \u2014 Automatic exchange of tax information',
    learn: '\ud83d\udcda What you will learn:', learnItems: ${JSON.stringify(["The CRS principle and its legal framework in Luxembourg","The key difference between CRS and FATCA","The concept of tax residence and self-certification","i-Hub's role as a Reporting Financial Institution","CRS entity classification (Active NFE, Passive NFE)","Penalties for CRS non-compliance"].map(q))},
    fiches:'15 cards', quiz:'3 fun quizzes', time:'~15 min',
    start:"Let\u2019s go! \ud83d\ude80", prev:'\u2190 Previous', next:'Next card',
    quizBtn:'\ud83c\udfae Go to quizzes!', toRetain:'KEY TAKEAWAY', goFurther:'\ud83d\udd0d Go further',
    home:'\u2190 Home', pts:'\ud83e\ude99',
    quiz1label:'QUIZ 1/3 \u00b7 MATCH THE PAIRS', quiz1title:'\ud83e\udde9 Match each term to its definition',
    quiz1sub:'Click a term first, then its definition',
    sigles:'Terms', definitions:'Definitions', quiz1done:'Perfect! All terms matched!',
    quiz2label:'QUIZ 2/3 \u00b7 TRUE OR FALSE', quiz2title:'\u2705 True or False \u2014 CRS in practice',
    true:'\u2705 TRUE', false:'\u274c FALSE', correct:'Well done!', wrong:'Not quite...',
    quiz3label:'QUIZ 3/3 \u00b7 CASE STUDIES', quiz3title:'\ud83d\udd0d Analyse the situation',
    quiz3sub:'Which action is required?',
    resultTitle:'CRS module complete \u2014 15 cards mastered!',
    backHome:'\u2190 Back to modules', restart:'\ud83d\udd04 Restart this module',
    pts_gained:'points earned', medal_gold:'CRS Expert!',
    medal_silver:'Good result, keep going!', medal_bronze:'Review the cards and try again!',
    score:'Total score', next2:'Next quiz \u2192', last:'Last quiz \u2192',
  },
}

const FICHES_FR = ${JSON.stringify(FICHES_FR, null, 2)}
const FICHES_EN = ${JSON.stringify(FICHES_EN, null, 2)}
const MATCHING_FR = ${JSON.stringify(MATCHING_FR)}
const MATCHING_EN = ${JSON.stringify(MATCHING_EN)}
const VF_FR = ${JSON.stringify(VF_FR)}
const VF_EN = ${JSON.stringify(VF_EN)}
const CAS_FR = ${JSON.stringify(CAS_FR)}
const CAS_EN = ${JSON.stringify(CAS_EN)}

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
    } else { setMatchError(lang==='fr'?\`\u274c "\${def}" ne correspond pas \u00e0 \${matchSelected}.\`:\`\u274c "\${def}" does not match \${matchSelected}.\`); setMatchSelected(null) }
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
      <button onClick={()=>router.push('/')} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#ffffff',fontWeight:'700',fontSize:'16px'}}>\ud83c\udf0d {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          <button onClick={()=>switchLang('fr')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='fr'?C:'transparent',color:'white',transition:'all 0.2s'}}>\ud83c\uddfb\ud83c\uddf7 FR</button>
          <button onClick={()=>switchLang('en')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='en'?C:'transparent',color:'white',transition:'all 0.2s'}}>\ud83c\uddec\ud83c\udde7 EN</button>
        </div>
        <span style={{background:'white',border:\`1px solid \${C}\`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>\u2b50 {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>\ud83c\udf0d</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'18px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'32px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item: string,i: number)=>(
            <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}>
              <span style={{color:C,fontWeight:'700'}}>\u2713</span>
              <span style={{color:'#4b5563',fontSize:'15px'}}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'32px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'\ud83d\udcd6'},{label:t.quiz,icon:'\ud83c\udfae'},{label:t.time,icon:'\u23f1\ufe0f'}].map((b,i)=>(
            <div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>
          ))}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer',boxShadow:\`0 4px 20px \${C}50\`}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase==='fiches') {
    const fiche=FICHES[ficheIndex] as any; const progress=((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar/>
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${progress}%\`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'200px'}}>
              {FICHES.map((_: any,i: number)=>(<div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>))}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',boxShadow:\`0 8px 40px \${C}15\`,border:\`2px solid \${C}30\`,overflow:'hidden',marginBottom:'20px'}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0,lineHeight:1.3}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item: any,i: number)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                </div>
              ))}
              <div style={{background:\`\${C}10\`,border:\`1px solid \${C}30\`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>\ud83d\udca1</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
              {fiche.plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen((o: boolean)=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:\`1.5px solid \${C}\`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'}}>
                    <span>{t.goFurther}</span>
                    <span style={{transition:'transform 0.3s',transform:plusLoinOpen?'rotate(180deg)':'rotate(0deg)',display:'inline-block'}}>\u25be</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:\`\${C}08\`,border:\`1px solid \${C}25\`,borderRadius:'0 0 10px 10px',padding:'16px',marginTop:'-4px',borderTop:'none'}}>
                      {fiche.plusLoin.map((item: any,i: number)=>(
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
            {ficheIndex>0 && <button onClick={()=>{setFicheIndex((i: number)=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontSize:'15px',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex((i: number)=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')}
              style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700',boxShadow:\`0 4px 16px \${C}40\`}}>
              {ficheIndex<FICHES.length-1?\`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) \u2192\`:t.quizBtn}
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
                {activeMatching.map((m: any)=>{const ip=!!matchPairs[m.sigle],is=matchSelected===m.sigle;return(
                  <button key={m.sigle} onClick={()=>handleMatchSigle(m.sigle)} disabled={ip}
                    style={{padding:'12px',borderRadius:'10px',fontSize:'14px',fontWeight:'700',cursor:ip?'default':'pointer',transition:'all 0.2s',background:ip?'#d1fae5':is?C:'white',color:ip?'#059669':is?'white':'#1f2937',border:ip?'1.5px solid #6ee7b7':is?\`1.5px solid \${C}\`:'1.5px solid #e5e7eb'}}>
                    {ip?'\u2713 ':''}{m.sigle}
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
                    {ip?'\u2713 ':''}{m.definition}
                  </button>
                )})}
              </div>
            </div>
          </div>
          {done&&<><div style={{background:'#d1fae5',border:'1px solid #6ee7b7',borderRadius:'16px',padding:'20px',textAlign:'center',marginBottom:'16px'}}>
            <p style={{fontSize:'28px',margin:'0 0 8px'}}>\ud83c\udf89</p>
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
          <div style={{background:C,height:'6px',width:\`\${(vfIndex/activeVF.length)*100}%\`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'24px'}}>{t.quiz2label} \u2014 {vfIndex+1}/{activeVF.length}</span>
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
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'\ud83c\udf89':'\ud83d\ude05'}</p>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(casIndex/activeCas.length)*100}%\`,transition:'width 0.4s ease'}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.quiz3label} \u2014 {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.quiz3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.quiz3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:\`2px solid \${C}30\`,marginBottom:'20px',boxShadow:\`0 4px 20px \${C}10\`}}>
            <p style={{fontSize:'16px',fontWeight:'600',color:'#1f2937',lineHeight:1.6,margin:0}}>\ud83d\udccb {cas.situation}</p>
          </div>
          {casRepondu===null?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt: string,i: number)=>(
                <button key={i} onClick={()=>repCas(opt)}
                  style={{padding:'16px 20px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left',transition:'all 0.15s'}}
                  onMouseOver={(e)=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=\`\${C}08\`}}
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
                  return <div key={i} style={{padding:'16px 20px',background:isCorrect?'#d1fae5':isChosen?'#fee2e2':'white',border:\`1.5px solid \${isCorrect?'#6ee7b7':isChosen?'#fca5a5':'#e5e7eb'}\`,borderRadius:'12px',fontSize:'14px',fontWeight:'600',color:isCorrect?'#059669':isChosen?'#dc2626':'#9ca3af'}}>
                    {isCorrect?'\u2705 ':isChosen?'\u274c ':''}{opt}
                  </div>
                })}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
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
        <h2 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{msg}</h2>
        <p style={{color:'#4b5563',fontSize:'16px',marginBottom:'32px'}}>{t.resultTitle}</p>
        <div style={{background:'white',borderRadius:'20px',padding:'32px',boxShadow:\`0 8px 32px \${C}10\`,marginBottom:'24px'}}>
          <div style={{fontSize:'56px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'24px'}}>/100</span></div>
          <p style={{color:'#6b7280',margin:'0 0 20px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#f3f4f6',borderRadius:'8px',height:'12px',overflow:'hidden'}}>
            <div style={{background:\`linear-gradient(90deg,\${C},#06b6d4)\`,height:'12px',width:\`\${total}%\`,borderRadius:'8px'}}/>
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
`;

fs.mkdirSync('app/modules/crs', { recursive: true });
fs.writeFileSync('app/modules/crs/page.tsx', tsx, 'utf8');
console.log('✅ app/modules/crs/page.tsx écrit !');
