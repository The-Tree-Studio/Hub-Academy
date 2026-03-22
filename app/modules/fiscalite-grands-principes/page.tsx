'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const UI = {
  fr: {
    title: 'Les grands principes',
    subtitle: 'Fiscalité internationale — Comprendre le cadre et le rôle d’i-Hub',
    learn: '📚 Ce que vous allez apprendre :', learnItems: [
      'Pourquoi la fiscalité internationale concerne i-Hub',
      'Qui est soumis à FATCA et CRS — et qui ne l’est pas',
      'Le rôle exact d’i-Hub : vérification, pas déclaration',
      'La différence entre le PSF déclarant et i-Hub sous-traitant',
      'Ce qu’i-Hub vérifie et ce qu’il ne vérifie pas (SLA)',
      'Pourquoi ces règles existent et ce qu’elles changent concrètement',
    ],
    fiches: '18 fiches', quiz: '3 quiz fun', time: '~18 min',
    start: "C’est parti ! 🚀", prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR', goFurther: '🔍 Aller plus loin',
    home: '← Accueil', pts: '🪙',
    quiz1label: 'QUIZ 1/3 · ASSOCIER LES PAIRES',
    quiz1title: '🧩 Reliez chaque concept à sa définition',
    quiz1sub: "Cliquez d’abord sur un concept, puis sur sa définition",
    sigles: 'Concepts', definitions: 'Définitions', quiz1done: 'Parfait ! Tous les concepts associés !',
    quiz2label: 'QUIZ 2/3 · VRAI OU FAUX',
    quiz2title: '✅ Vrai ou Faux — Rôle d’i-Hub',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    quiz3label: 'QUIZ 3/3 · QUI FAIT QUOI ?',
    quiz3title: '🤔 PSF ou i-Hub ?',
    quiz3sub: 'Qui est responsable de cette action ?',
    resultTitle: 'Module terminé — Le cadre est clair !',
    backHome: '← Retour aux modules', restart: '🔄 Recommencer ce module',
    pts_gained: 'points gagnés', medal_gold: 'Expert du cadre !',
    medal_silver: 'Bon résultat, continuez !', medal_bronze: 'Relisez les fiches et réessayez !',
    score: 'Score total', next2: 'Quiz suivant →', last: 'Dernier quiz →',
  },
  en: {
    title: 'Key Principles',
    subtitle: 'International Taxation — Understanding the framework and i-Hub’s role',
    learn: '📚 What you will learn:', learnItems: [
      'Why international taxation concerns i-Hub',
      'Who is subject to FATCA and CRS — and who is not',
      'i-Hub’s exact role: verification, not reporting',
      'The difference between the reporting PSF and i-Hub as subcontractor',
      'What i-Hub checks and what it does not (SLA)',
      'Why these rules exist and what they concretely change',
    ],
    fiches: '18 cards', quiz: '3 fun quizzes', time: '~18 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '🔍 Go further',
    home: '← Home', pts: '🪙',
    quiz1label: 'QUIZ 1/3 · MATCH THE PAIRS',
    quiz1title: '🧩 Match each concept to its definition',
    quiz1sub: 'Click a concept first, then its definition',
    sigles: 'Concepts', definitions: 'Definitions', quiz1done: 'Perfect! All concepts matched!',
    quiz2label: 'QUIZ 2/3 · TRUE OR FALSE',
    quiz2title: '✅ True or False — i-Hub’s role',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    quiz3label: 'QUIZ 3/3 · WHO DOES WHAT?',
    quiz3title: '🤔 PSF or i-Hub?',
    quiz3sub: 'Who is responsible for this action?',
    resultTitle: 'Module complete — The framework is clear!',
    backHome: '← Back to modules', restart: '🔄 Restart this module',
    pts_gained: 'points earned', medal_gold: 'Framework Expert!',
    medal_silver: 'Good result, keep going!', medal_bronze: 'Review the cards and try again!',
    score: 'Total score', next2: 'Next quiz →', last: 'Last quiz →',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🌐', titre:"Pourquoi la fiscalité internationale nous concerne", contenu:[
    { icon:'🏦', texte:"Les clients d’i-Hub sont des **PSF luxembourgeois** (banques, fonds, assureurs) qui gèrent des comptes de clients finaux du monde entier" },
    { icon:'🌍', texte:"Ces clients finaux peuvent être **américains** (FATCA) ou **résidents fiscaux étrangers** (CRS) \u2014 ce qui crée des obligations de déclaration fiscale" },
    { icon:'🔍', texte:"i-Hub **vérifie l’identité et la cohérence documentaire** des clients finaux pour le compte des PSF \u2014 y compris les formulaires fiscaux FATCA/CRS" },
    { icon:'📝', texte:"Sans comprendre ces règles, i-Hub ne peut pas faire correctement son travail de **vérification** ni signaler les incohérences aux PSF" },
  ], aretenir:"La fiscalité internationale nous concerne parce que nos clients PSF y sont soumis. Notre rôle : vérifier et signaler. Pas déclarer." },

  { id:2, emoji:'🏦', titre:"Qui est vraiment soumis à FATCA et CRS ?", contenu:[
    { icon:'✅', texte:"**Les PSF** (banques, fonds, assureurs) luxembourgeois \u2014 ils sont les **Institutions Financières Déclarantes** et reportent à l’ACD" },
    { icon:'✅', texte:"**Les clients finaux des PSF** \u2014 s’ils sont américains (FATCA) ou résidents fiscaux étrangers (CRS), leurs comptes sont déclarables" },
    { icon:'❌', texte:"**i-Hub n’est pas** une Institution Financière Déclarante \u2014 il ne reçoit pas de dépôts, ne gère pas de comptes et n’investit pas pour le compte de tiers" },
    { icon:'🔗', texte:"i-Hub est un **PSF de support** \u2014 sous-traitant des PSF, il exécute des tâches de vérification documentaire sur instruction" },
  ], aretenir:"PSF = déclarant. Client final = déclarable. i-Hub = vérificateur. Ces trois rôles sont distincts et ne se mélangent pas." },

  { id:3, emoji:'📄', titre:"Le rôle exact d’i-Hub dans le processus fiscal", contenu:[
    { icon:'🔍', texte:"i-Hub **vérifie la cohérence** des formulaires fiscaux (W-9, W-8BEN, autocertifications CRS) fournis par les clients finaux des PSF" },
    { icon:'🚨', texte:"i-Hub **signale les incohérences** détectées au PSF \u2014 par exemple un W-8BEN rempli par quelqu’un né aux USA, ou une adresse américaine non signalée" },
    { icon:'📎', texte:"i-Hub **transmet les données vérifiées** au PSF \u2014 c’est ensuite le PSF qui prend les décisions de classification et de déclaration" },
    { icon:'🚫', texte:"i-Hub **ne classe pas** les clients finaux, **ne déclare pas** à l’ACD, **ne décide pas** de l’action à prendre en cas de doute" },
  ], aretenir:"Vérifier ≠ Déclarer. Signaler ≠ Décider. i-Hub est les yeux du PSF sur le terrain \u2014 pas son bras légal.", plusLoin:[
    { icon:'📝', texte:"Le périmètre exact des vérifications d’i-Hub est **défini contractuellement** dans le SLA signé avec chaque PSF" },
    { icon:'⚠️', texte:"Si une vérification va au-delà du SLA, i-Hub s’expose à un risque de **responsabilité élargie** non prévue au contrat" },
    { icon:'🤝', texte:"En cas de doute sur le périmètre, l’équipe Compliance d’i-Hub et le contact PSF clarifient ensemble avant d’agir" },
  ]},

  { id:4, emoji:'📜', titre:"Le SLA : ce qu’i-Hub vérifie et ce qu’il ne vérifie pas", contenu:[
    { icon:'✅', texte:"**Ce qu’i-Hub vérifie** (exemples) : présence et cohérence d’un formulaire W-9 ou W-8BEN, indices d’américanité évidents, concordance entre pays de résidence et NIF" },
    { icon:'❌', texte:"**Ce qu’i-Hub ne vérifie pas** (exemples) : l’exactitude fiscale du NIF, la conformité légale globale du client, la classification FATCA finale" },
    { icon:'📜', texte:"Chaque **SLA** avec un PSF définit précisément la liste des points à vérifier et le format de restitution" },
    { icon:'🚨', texte:"En cas d’anomalie hors périmètre, i-Hub **signale quand même** au PSF \u2014 même si ce n’est pas contractuellement obligatoire" },
  ], aretenir:"Le SLA est la bible d’i-Hub. Il définit exactement ce qui est attendu. Ni plus, ni moins \u2014 mais avec le souci de signaler tout red flag visible." },

  { id:5, emoji:'🇺🇸', titre:"FATCA : pourquoi les États-Unis ont créé cette loi", contenu:[
    { icon:'💰', texte:"Avant FATCA, de nombreux **contribuables américains** cachaient leurs avoirs dans des banques étrangères pour échapper à l’impôt américain" },
    { icon:'⚡', texte:"En 2010, les USA ont adopté **FATCA** pour forcer les institutions financières mondiales à identifier et déclarer les comptes américains à l’IRS" },
    { icon:'🌍', texte:"La particularité américaine : les USA imposent leurs citoyens sur leur **revenu mondial**, même s’ils vivent à l’étranger \u2014 d’où l’importance d’identifier toute US Person" },
    { icon:'🇱🇺', texte:"Le Luxembourg a signé un **IGA Modèle 1** avec les USA en 2014 : les PSF luxembourgeois reportent à l’ACD qui transmet à l’IRS" },
  ], aretenir:"FATCA existe parce que les USA taxent leurs citoyens partout dans le monde. Les PSF luxembourgeois doivent donc identifier les Américains parmi leurs clients finaux." },

  { id:6, emoji:'🌍', titre:"CRS : pourquoi l’OCDE a créé ce standard", contenu:[
    { icon:'💸', texte:"L’évasion fiscale était mondiale : des résidents de nombreux pays cachaient leurs avoirs dans des pays à fiscalité favorable comme le Luxembourg" },
    { icon:'🤝', texte:"En 2014, l’**OCDE** a créé le **CRS** pour instaurer un échange automatique d’informations entre plus de 100 pays" },
    { icon:'🏠', texte:"Contrairement à FATCA, le CRS se base sur la **résidence fiscale** (où vit le client) et non sur la nationalité" },
    { icon:'📤', texte:"Concrètement : un résident français qui a un compte au Luxembourg → le PSF luxembourgeois déclare les infos à l’ACD → l’ACD transmet à la DGFiP française" },
  ], aretenir:"CRS vise à éliminer les paradis fiscaux en rendant transparents les comptes à l’étranger. Les PSF luxembourgeois sont au cœur du dispositif." },

  { id:7, emoji:'🤝', titre:"Les acteurs : qui fait quoi dans la chaîne", contenu:[
    { icon:'👤', texte:"**Client final** du PSF : remplit les formulaires (W-9, W-8BEN, autocertification CRS) et déclare sa situation fiscale" },
    { icon:'🏦', texte:"**PSF** (banque, fonds…) : collecte les formulaires, classe le client, déclare à l’ACD sous sa propre responsabilité" },
    { icon:'🔍', texte:"**i-Hub** (PSF de support) : vérifie la cohérence des formulaires pour le compte du PSF, dans le périmètre du SLA" },
    { icon:'🇱🇺', texte:"**ACD** (Luxembourg) : reçoit les déclarations des PSF et les transmet aux autorités fiscales des pays concernés" },
  ], aretenir:"Client → PSF → ACD : voilà la chaîne de déclaration. i-Hub est en amont du PSF, comme vérificateur \u2014 pas comme déclarant.", plusLoin:[
    { icon:'🏛️', texte:"L’**IRS** (USA) reçoit les déclarations FATCA via l’ACD \u2014 pas directement des PSF" },
    { icon:'🌍', texte:"Pour CRS : l’ACD transmet aux **autorités fiscales** du pays de résidence du client final (DGFiP France, Finanzamt Allemagne…)" },
    { icon:'🔒', texte:"Toutes ces transmissions sont **chiffrées et sécurisées** \u2014 les données fiscales des clients sont confidentielles" },
  ]},

  { id:8, emoji:'👤', titre:"Qui est un « client final » pour i-Hub ?", contenu:[
    { icon:'👨‍💼', texte:"Les **personnes physiques** qui ont un compte auprès du PSF \u2014 particuliers, dirigeants, actionnaires d’une entité cliente" },
    { icon:'🏢', texte:"Les **entités** (sociétés, fonds, fondations) dont le PSF gère le compte ou les actifs" },
    { icon:'🔗', texte:"Les **bénéficiaires effectifs** (UBO) des entités \u2014 leurs infos peuvent aussi figurer dans les formulaires FATCA/CRS" },
    { icon:'⚠️', texte:"i-Hub vérifie les informations **transmises par le PSF** \u2014 il n’est pas en contact direct avec le client final sauf exception prévue au SLA" },
  ], aretenir:"Le « client » d’i-Hub, c’est le PSF. Le « client final », c’est la personne ou entité dont i-Hub vérifie les documents \u2014 une distinction essentielle." },

  { id:9, emoji:'💱', titre:"FATCA et CRS : les deux systèmes en parallèle", contenu:[
    { icon:'🇺🇸', texte:"**FATCA** : américain, basé sur la **nationalité/citoyenneté** \u2014 toute US Person, où qu’elle vive" },
    { icon:'🌍', texte:"**CRS** : multilatéral OCDE, basé sur la **résidence fiscale** \u2014 tout résident étranger, quelle que soit sa nationalité" },
    { icon:'🔄', texte:"Les deux s’appliquent **en même temps** : un Américain vivant en France est soumis à FATCA (nationalité) ET CRS (résidence France)" },
    { icon:'📝', texte:"Pour i-Hub : les formulaires à vérifier sont différents (W-9/W-8BEN pour FATCA, autocertification pour CRS) mais la logique est la même" },
  ], aretenir:"FATCA et CRS coexistent. Un même client final peut générer des obligations dans les deux systèmes \u2014 i-Hub vérifie les deux." },

  { id:10, emoji:'💲', titre:"Le QI : un 3ème système lié aux retenues américaines", contenu:[
    { icon:'🇺🇸', texte:"**QI** = Qualified Intermediary \u2014 statut optionnel pour les institutions financières étrangères qui traitent des **revenus de source américaine**" },
    { icon:'💰', texte:"Concerne les dividendes et intérêts d’actions/obligations américaines détenues par les clients finaux des PSF" },
    { icon:'🔗', texte:"Le statut QI permet d’appliquer les **taux réduits** des conventions fiscales USA/Luxembourg plutôt que la retenue standard de 30%" },
    { icon:'👁️', texte:"Pour i-Hub : le QI est généralement géré directement par les PSF \u2014 i-Hub peut être impliqué dans la vérification des formulaires liés si prévu au SLA" },
  ], aretenir:"Le QI est complémentaire à FATCA. C’est le PSF qui décide d’avoir le statut QI et qui en assume les obligations \u2014 pas i-Hub." },

  { id:11, emoji:'📋', titre:"Les formulaires clés que vérifie i-Hub", contenu:[
    { icon:'🇺🇸', texte:"**W-9** : rempli par les US Persons \u2014 certifie le statut américain et le TIN (numéro fiscal US)" },
    { icon:'📝', texte:"**W-8BEN** : rempli par les non-US Persons (particuliers) \u2014 certifie le statut non-américain, valable 3 ans" },
    { icon:'🏢', texte:"**W-8BEN-E** : rempli par les entités non-américaines \u2014 plus complexe, précise la catégorie FATCA de l’entité" },
    { icon:'🌍', texte:"**Autocertification CRS** : déclaration de résidence fiscale \u2014 obligatoire pour tout nouveau compte depuis 2016" },
  ], aretenir:"Ces 4 formulaires sont le cœur du travail de vérification d’i-Hub. Les connaître = comprendre ce qu’on cherche et ce qu’on vérifie." },

  { id:12, emoji:'🔍', titre:"Ce que vérifie concrètement i-Hub", contenu:[
    { icon:'✅', texte:"**Présence du formulaire** : le bon formulaire a-t-il bien été fourni selon le type de client final ?" },
    { icon:'✅', texte:"**Cohérence interne** : les informations du formulaire sont-elles cohérentes entre elles (ex : pays de naissance vs pays de résidence déclaré) ?" },
    { icon:'✅', texte:"**Cohérence externe** : les informations du formulaire concordent-elles avec les autres documents d’identité collectés ?" },
    { icon:'✅', texte:"**Indices visibles** : des éléments visibles dans le dossier suggèrent-ils une américanité ou une résidence étrangère non déclarée ?" },
  ], aretenir:"i-Hub vérifie la cohérence \u2014 pas l’exactitude fiscale absolue. Ce travail est essentiel pour que le PSF puisse déclarer correctement.", plusLoin:[
    { icon:'📌', texte:"La **check-list de vérification** d’i-Hub est définie dans le SLA de chaque PSF \u2014 elle peut varier d’un client à l’autre" },
    { icon:'🚨', texte:"Tout red flag détecté doit être **documenté et signalé** au PSF, même s’il est hors périmètre SLA" },
    { icon:'👨‍⚖️', texte:"En cas de doute sur ce qu’il faut vérifier, l’équipe Compliance clarifie avec le contact PSF avant d’agir" },
  ]},

  { id:13, emoji:'🚨', titre:"Quand signaler une incohérence au PSF ?", contenu:[
    { icon:'🔴', texte:"**Naissance aux USA** sur un formulaire W-8BEN (non-US) \u2014 contradiction évidente à signaler" },
    { icon:'🔴', texte:"**Adresse américaine** ou numéro de téléphone US non mentionné dans la documentation fiscale" },
    { icon:'🔴', texte:"**NIF manquant** sans justification \u2014 ou NIF dont le format ne correspond pas au pays déclaré" },
    { icon:'🔴', texte:"**Formulaire expiré** : W-8BEN daté de plus de 3 ans sans renouvellement" },
    { icon:'🔴', texte:"**Incohérence entre documents** : passeport français mais autocertification CRS indiquant résidence allemande sans explication" },
  ], aretenir:"Quand quelque chose ne colle pas entre les documents, on signale au PSF. On ne tranche pas. On ne classe pas. On documente et on alerte." },

  { id:14, emoji:'💰', titre:"Les enjeux : pourquoi c’est important pour i-Hub", contenu:[
    { icon:'⚖️', texte:"Si i-Hub fait une erreur de vérification qui contribue à un manquement FATCA/CRS du PSF, sa **responsabilité contractuelle** peut être engagée" },
    { icon:'🔒', texte:"Les données fiscales des clients finaux sont **hautement confidentielles** \u2014 toute fuite peut engager la responsabilité d’i-Hub (RGPD + secret professionnel)" },
    { icon:'💼', texte:"La qualité des vérifications d’i-Hub est un **argument commercial** \u2014 les PSF choisissent un sous-traitant fiable et rigoureux" },
    { icon:'👀', texte:"La CSSF surveille les PSF \u2014 et peut étendre ses contrôles aux sous-traitants comme i-Hub en cas de manquement du PSF" },
  ], aretenir:"Bien faire son travail de vérification protège i-Hub légalement, préserve la relation avec le PSF et garantit la qualité du service." },

  { id:15, emoji:'👥', titre:"Les 3 types de clients finaux à connaître", contenu:[
    { icon:'👤', texte:"**Personne physique non-US** en dehors du Luxembourg \u2014 CRS peut s’appliquer \u2014 autocertification + NIF à vérifier" },
    { icon:'🇺🇸', texte:"**Personne physique US Person** \u2014 FATCA s’applique \u2014 W-9 à vérifier avec TIN" },
    { icon:'🏢', texte:"**Entité** (société, fonds, holding) \u2014 FATCA + CRS peuvent s’appliquer selon la nature et les actionnaires \u2014 W-8BEN-E ou autocertification entité" },
  ], aretenir:"Trois types, trois logiques. Pour chacun, i-Hub vérifie que le bon formulaire est présent et cohérent avec le profil du client final." },

  { id:16, emoji:'🔑', titre:"Le secret professionnel et la confidentialité fiscale", contenu:[
    { icon:'🔒', texte:"Les informations fiscales des clients finaux (nationalité, résidence, TIN) sont couvertes par le **secret professionnel PSF**" },
    { icon:'🛡️', texte:"i-Hub, en tant que sous-traitant, est lui aussi soumis à cette **obligation de confidentialité** \u2014 ces données ne peuvent pas être partagées hors du périmètre contractuel" },
    { icon:'💻', texte:"Le **RGPD** s’applique également : tout traitement de données fiscales doit respecter les principes de minimisation et de sécurité" },
    { icon:'📝', texte:"Les données vérifiées par i-Hub sont transmises au PSF via des **canaux sécurisés** prévus au SLA" },
  ], aretenir:"Les données fiscales qu’i-Hub traite sont parmi les plus sensibles. Leur protection est une obligation légale et contractuelle." },

  { id:17, emoji:'🔄', titre:"La mise à jour : un travail continu", contenu:[
    { icon:'📅', texte:"Les formulaires ont une **durée de validité** : le W-8BEN expire après 3 ans, l’autocertification CRS doit être renouvelée en cas de changement" },
    { icon:'🚨', texte:"Tout **changement de situation** du client final (déménagement, mariage, nouvelle nationalité) peut changer son statut fiscal" },
    { icon:'🔔', texte:"i-Hub peut recevoir du PSF des **demandes de vérification complémentaire** lorsque le PSF détecte un changement" },
    { icon:'📎', texte:"La qualité du **suivi et de la traçabilité** des vérifications est essentielle : chaque vérification doit être datée, documentée, archivée" },
  ], aretenir:"La fiscalité internationale n’est pas un exercice ponctuel. i-Hub doit être prêt à effectuer des vérifications complémentaires tout au long de la vie du dossier." },

  { id:18, emoji:'🎓', titre:"Ce que vous devez retenir de ce module", contenu:[
    { icon:'🏆', texte:"**i-Hub vérifie, le PSF déclare** \u2014 cette distinction est fondamentale et ne change jamais" },
    { icon:'📜', texte:"**Le SLA définit le périmètre** \u2014 ni plus, ni moins. En cas de doute, on clarifie avec le PSF avant d’agir" },
    { icon:'🚨', texte:"**Tout red flag se signale** \u2014 même hors périmètre, si quelque chose ne colle pas, on documente et on alerte le PSF" },
    { icon:'🔒', texte:"**La confidentialité est absolue** \u2014 les données fiscales des clients finaux ne sortent jamais du cadre contractuel" },
  ], aretenir:"4 règles d’or : vérifier (pas déclarer), respecter le SLA, signaler les red flags, protéger les données. Tout le reste découle de là.", plusLoin:[
    { icon:'📚', texte:"Les modules suivants (FATCA, CRS, QI, formulaires) approfondissent chaque système \u2014 ce module est le socle à garder en tête en permanence" },
    { icon:'👨‍⚖️', texte:"En cas de question sur le rôle d’i-Hub dans un cas concret, l’équipe Compliance est disponible" },
    { icon:'🔗', texte:"Le glossaire FATCA/CRS/QI est disponible dans les modules spécifiques de la thématique Fiscalité Internationale" },
  ]},
]

const FICHES_EN = [
  { id:1, emoji:'🌐', titre:"Why international taxation concerns us", contenu:[
    { icon:'🏦', texte:"i-Hub’s clients are **Luxembourg PSFs** (banks, funds, insurers) that manage accounts for final clients from around the world" },
    { icon:'🌍', texte:"These final clients may be **US nationals** (FATCA) or **foreign tax residents** (CRS) \u2014 which creates tax reporting obligations" },
    { icon:'🔍', texte:"i-Hub **verifies the identity and documentary consistency** of final clients on behalf of PSFs \u2014 including FATCA/CRS tax forms" },
    { icon:'📝', texte:"Without understanding these rules, i-Hub cannot properly carry out its **verification** work or flag inconsistencies to PSFs" },
  ], aretenir:"International taxation concerns us because our PSF clients are subject to it. Our role: verify and flag. Not report." },

  { id:2, emoji:'🏦', titre:"Who is actually subject to FATCA and CRS?", contenu:[
    { icon:'✅', texte:"**PSFs** (banks, funds, insurers) \u2014 they are the **Reporting Financial Institutions** and report to the ACD" },
    { icon:'✅', texte:"**PSFs’ final clients** \u2014 if they are US nationals (FATCA) or foreign tax residents (CRS), their accounts are reportable" },
    { icon:'❌', texte:"**i-Hub is not** a Reporting Financial Institution \u2014 it does not hold deposits, manage accounts or invest on behalf of third parties" },
    { icon:'🔗', texte:"i-Hub is a **support PSF** \u2014 a PSF subcontractor that performs documentary verification tasks on instruction" },
  ], aretenir:"PSF = reporter. Final client = reportable. i-Hub = verifier. These three roles are distinct and do not overlap." },

  { id:3, emoji:'📄', titre:"i-Hub’s exact role in the tax process", contenu:[
    { icon:'🔍', texte:"i-Hub **verifies consistency** of tax forms (W-9, W-8BEN, CRS self-certifications) provided by PSFs’ final clients" },
    { icon:'🚨', texte:"i-Hub **flags inconsistencies** to the PSF \u2014 e.g. a W-8BEN filled by someone born in the US, or an unreported US address" },
    { icon:'📎', texte:"i-Hub **transmits verified data** to the PSF \u2014 the PSF then makes classification and reporting decisions" },
    { icon:'🚫', texte:"i-Hub does **not classify** final clients, does **not report** to the ACD, does **not decide** on action in doubtful cases" },
  ], aretenir:"Verify ≠ Report. Flag ≠ Decide. i-Hub is the PSF’s eyes on the ground \u2014 not its legal arm.", plusLoin:[
    { icon:'📝', texte:"The exact scope of i-Hub’s verifications is **contractually defined** in the SLA signed with each PSF" },
    { icon:'⚠️', texte:"Going beyond the SLA exposes i-Hub to **extended liability** not covered by the contract" },
    { icon:'🤝', texte:"When in doubt about scope, i-Hub Compliance and the PSF contact clarify together before acting" },
  ]},

  { id:4, emoji:'📜', titre:"The SLA: what i-Hub checks and what it does not", contenu:[
    { icon:'✅', texte:"**What i-Hub checks** (examples): presence and consistency of a W-9 or W-8BEN, obvious US indicia, match between country of residence and TIN" },
    { icon:'❌', texte:"**What i-Hub does not check** (examples): fiscal accuracy of the TIN, overall legal compliance of the client, final FATCA classification" },
    { icon:'📜', texte:"Each **SLA** with a PSF precisely defines the list of items to verify and the reporting format" },
    { icon:'🚨', texte:"If an anomaly is outside scope, i-Hub **flags it anyway** \u2014 even if not contractually required" },
  ], aretenir:"The SLA is i-Hub’s bible. It defines exactly what is expected. No more, no less \u2014 but always with the intent to flag any visible red flag." },

  { id:5, emoji:'🇺🇸', titre:"FATCA: why the US created this law", contenu:[
    { icon:'💰', texte:"Before FATCA, many **US taxpayers** hid assets in foreign banks to avoid US taxation" },
    { icon:'⚡', texte:"In 2010, the US enacted **FATCA** to force global financial institutions to identify and report US accounts to the IRS" },
    { icon:'🌍', texte:"The US specificity: the US taxes its citizens on their **worldwide income**, even if they live abroad \u2014 hence the importance of identifying every US Person" },
    { icon:'🇱🇺', texte:"Luxembourg signed a **Model 1 IGA** with the US in 2014: Luxembourg PSFs report to the ACD, which forwards to the IRS" },
  ], aretenir:"FATCA exists because the US taxes its citizens worldwide. Luxembourg PSFs must therefore identify Americans among their final clients." },

  { id:6, emoji:'🌍', titre:"CRS: why the OECD created this standard", contenu:[
    { icon:'💸', texte:"Tax avoidance was global: residents of many countries hid assets in low-tax jurisdictions such as Luxembourg" },
    { icon:'🤝', texte:"In 2014, the **OECD** created **CRS** to establish automatic information exchange between over 100 countries" },
    { icon:'🏠', texte:"Unlike FATCA, CRS is based on **tax residency** (where the client lives), not nationality" },
    { icon:'📤', texte:"Concretely: a French resident with a Luxembourg account → the Luxembourg PSF reports to the ACD → the ACD forwards to the French DGFiP" },
  ], aretenir:"CRS aims to eliminate tax havens by making foreign accounts transparent. Luxembourg PSFs are at the heart of the system." },

  { id:7, emoji:'🤝', titre:"The actors: who does what in the chain", contenu:[
    { icon:'👤', texte:"**PSF’s final client**: completes the forms (W-9, W-8BEN, CRS self-certification) and declares their tax situation" },
    { icon:'🏦', texte:"**PSF** (bank, fund…): collects forms, classifies the client, reports to the ACD under its own responsibility" },
    { icon:'🔍', texte:"**i-Hub** (support PSF): verifies consistency of forms on behalf of the PSF, within the SLA scope" },
    { icon:'🇱🇺', texte:"**ACD** (Luxembourg): receives PSF declarations and forwards them to the relevant countries’ tax authorities" },
  ], aretenir:"Final client → PSF → ACD: this is the reporting chain. i-Hub is upstream of the PSF, as verifier \u2014 not reporter.", plusLoin:[
    { icon:'🏛️', texte:"The **IRS** (US) receives FATCA declarations via the ACD \u2014 not directly from PSFs" },
    { icon:'🌍', texte:"For CRS: the ACD forwards to the **tax authority** of the final client’s country of residence" },
    { icon:'🔒', texte:"All these transmissions are **encrypted and secure** \u2014 client tax data is confidential" },
  ]},

  { id:8, emoji:'👤', titre:"Who is a ‘final client’ for i-Hub?", contenu:[
    { icon:'👨‍💼', texte:"**Individuals** who hold an account with the PSF \u2014 private clients, directors, shareholders of a client entity" },
    { icon:'🏢', texte:"**Entities** (companies, funds, foundations) whose account or assets the PSF manages" },
    { icon:'🔗', texte:"**Beneficial owners** (UBOs) of entities \u2014 their information may also appear in FATCA/CRS forms" },
    { icon:'⚠️', texte:"i-Hub verifies information **transmitted by the PSF** \u2014 it is not in direct contact with the final client unless specified in the SLA" },
  ], aretenir:"i-Hub’s ‘client’ is the PSF. The ‘final client’ is the person or entity whose documents i-Hub checks \u2014 an essential distinction." },

  { id:9, emoji:'💱', titre:"FATCA and CRS: two parallel systems", contenu:[
    { icon:'🇺🇸', texte:"**FATCA**: US-based, based on **nationality/citizenship** \u2014 any US Person, wherever they live" },
    { icon:'🌍', texte:"**CRS**: multilateral OECD, based on **tax residency** \u2014 any foreign resident, regardless of nationality" },
    { icon:'🔄', texte:"Both apply **simultaneously**: a US citizen living in France is subject to FATCA (nationality) AND CRS (French residency)" },
    { icon:'📝', texte:"For i-Hub: the forms to verify differ (W-9/W-8BEN for FATCA, self-certification for CRS) but the logic is the same" },
  ], aretenir:"FATCA and CRS coexist. The same final client can trigger obligations under both systems \u2014 i-Hub verifies both." },

  { id:10, emoji:'💲', titre:"QI: a 3rd system linked to US withholding", contenu:[
    { icon:'🇺🇸', texte:"**QI** = Qualified Intermediary \u2014 optional status for foreign financial institutions dealing with **US-source income**" },
    { icon:'💰', texte:"Covers dividends and interest on US stocks/bonds held by PSFs’ final clients" },
    { icon:'🔗', texte:"QI status allows applying **reduced rates** under US/Luxembourg tax treaties rather than the standard 30% withholding" },
    { icon:'👁️', texte:"For i-Hub: QI is generally managed directly by PSFs \u2014 i-Hub may be involved in verifying related forms if specified in the SLA" },
  ], aretenir:"QI is complementary to FATCA. It is the PSF that decides to hold QI status and bears the obligations \u2014 not i-Hub." },

  { id:11, emoji:'📋', titre:"The key forms i-Hub verifies", contenu:[
    { icon:'🇺🇸', texte:"**W-9**: completed by US Persons \u2014 certifies US status and TIN (US tax number)" },
    { icon:'📝', texte:"**W-8BEN**: completed by non-US individuals \u2014 certifies non-US status, valid 3 years" },
    { icon:'🏢', texte:"**W-8BEN-E**: completed by non-US entities \u2014 more complex, specifies the entity’s FATCA category" },
    { icon:'🌍', texte:"**CRS self-certification**: tax residency declaration \u2014 mandatory for all new accounts since 2016" },
  ], aretenir:"These 4 forms are the core of i-Hub’s verification work. Knowing them = understanding what we are looking for and checking." },

  { id:12, emoji:'🔍', titre:"What i-Hub concretely checks", contenu:[
    { icon:'✅', texte:"**Form presence**: has the right form been provided for the type of final client?" },
    { icon:'✅', texte:"**Internal consistency**: is the information on the form consistent with itself (e.g. country of birth vs declared country of residence)?" },
    { icon:'✅', texte:"**External consistency**: does the form information match the other identity documents collected?" },
    { icon:'✅', texte:"**Visible indicia**: do elements visible in the file suggest undeclared US status or foreign residency?" },
  ], aretenir:"i-Hub verifies consistency \u2014 not absolute fiscal accuracy. This work is essential for the PSF to report correctly.", plusLoin:[
    { icon:'📌', texte:"The i-Hub **verification checklist** is defined in each PSF’s SLA \u2014 it may vary from one client to another" },
    { icon:'🚨', texte:"Any red flag detected must be **documented and reported** to the PSF, even if outside the SLA scope" },
    { icon:'👨‍⚖️', texte:"When in doubt about what to check, Compliance clarifies with the PSF contact before acting" },
  ]},

  { id:13, emoji:'🚨', titre:"When to flag an inconsistency to the PSF?", contenu:[
    { icon:'🔴', texte:"**US birthplace** on a W-8BEN (non-US form) \u2014 obvious contradiction to flag" },
    { icon:'🔴', texte:"**US address** or US phone number not mentioned in the tax documentation" },
    { icon:'🔴', texte:"**Missing TIN** without justification \u2014 or TIN format not matching the declared country" },
    { icon:'🔴', texte:"**Expired form**: W-8BEN dated more than 3 years ago without renewal" },
    { icon:'🔴', texte:"**Cross-document inconsistency**: French passport but CRS self-certification stating German residency with no explanation" },
  ], aretenir:"When something does not add up between documents, flag it to the PSF. Do not decide. Do not classify. Document and alert." },

  { id:14, emoji:'💰', titre:"The stakes: why this matters for i-Hub", contenu:[
    { icon:'⚖️', texte:"If i-Hub makes a verification error that contributes to a PSF’s FATCA/CRS breach, its **contractual liability** may be engaged" },
    { icon:'🔒', texte:"Final clients’ tax data is **highly confidential** \u2014 any leak may engage i-Hub’s liability (GDPR + professional secrecy)" },
    { icon:'💼', texte:"The quality of i-Hub’s verifications is a **commercial differentiator** \u2014 PSFs choose a reliable and rigorous subcontractor" },
    { icon:'👀', texte:"The CSSF monitors PSFs \u2014 and may extend its audits to subcontractors like i-Hub in the event of a PSF breach" },
  ], aretenir:"Doing verification work well protects i-Hub legally, preserves the PSF relationship and guarantees service quality." },

  { id:15, emoji:'👥', titre:"The 3 types of final clients to know", contenu:[
    { icon:'👤', texte:"**Non-US individual** outside Luxembourg \u2014 CRS may apply \u2014 self-certification + TIN to verify" },
    { icon:'🇺🇸', texte:"**US Person individual** \u2014 FATCA applies \u2014 W-9 to verify with TIN" },
    { icon:'🏢', texte:"**Entity** (company, fund, holding) \u2014 FATCA + CRS may apply depending on nature and shareholders \u2014 W-8BEN-E or entity self-certification" },
  ], aretenir:"Three types, three logics. For each, i-Hub verifies that the right form is present and consistent with the final client’s profile." },

  { id:16, emoji:'🔑', titre:"Professional secrecy and tax confidentiality", contenu:[
    { icon:'🔒', texte:"Final clients’ tax information (nationality, residency, TIN) is covered by **PSF professional secrecy**" },
    { icon:'🛡️', texte:"i-Hub, as subcontractor, is also subject to this **confidentiality obligation** \u2014 this data cannot be shared outside the contractual scope" },
    { icon:'💻', texte:"**GDPR** also applies: any processing of tax data must respect the principles of minimisation and security" },
    { icon:'📝', texte:"Verified data is transmitted to the PSF via **secure channels** as specified in the SLA" },
  ], aretenir:"The tax data i-Hub processes is among the most sensitive. Its protection is both a legal and contractual obligation." },

  { id:17, emoji:'🔄', titre:"Updates: an ongoing process", contenu:[
    { icon:'📅', texte:"Forms have a **validity period**: W-8BEN expires after 3 years, CRS self-certification must be renewed on change" },
    { icon:'🚨', texte:"Any **change in the final client’s situation** (relocation, marriage, new nationality) may change their tax status" },
    { icon:'🔔', texte:"i-Hub may receive from the PSF **requests for additional verification** when the PSF detects a change" },
    { icon:'📎', texte:"The quality of **tracking and traceability** of verifications is essential: each verification must be dated, documented, archived" },
  ], aretenir:"International taxation is not a one-off exercise. i-Hub must be ready to carry out additional verifications throughout the life of the file." },

  { id:18, emoji:'🎓', titre:"What you must remember from this module", contenu:[
    { icon:'🏆', texte:"**i-Hub verifies, the PSF reports** \u2014 this distinction is fundamental and never changes" },
    { icon:'📜', texte:"**The SLA defines the scope** \u2014 no more, no less. When in doubt, clarify with the PSF before acting" },
    { icon:'🚨', texte:"**Always flag red flags** \u2014 even outside scope, if something does not add up, document and alert the PSF" },
    { icon:'🔒', texte:"**Confidentiality is absolute** \u2014 final clients’ tax data never leaves the contractual framework" },
  ], aretenir:"4 golden rules: verify (not report), respect the SLA, flag red flags, protect data. Everything else flows from this.", plusLoin:[
    { icon:'📚', texte:"The following modules (FATCA, CRS, QI, forms) go deeper into each system \u2014 this module is the foundation to keep in mind" },
    { icon:'👨‍⚖️', texte:"For any question about i-Hub’s role in a specific case, the Compliance team is available" },
    { icon:'🔗', texte:"The FATCA/CRS/QI glossary is available in the specific modules of the International Taxation theme" },
  ]},
]

const MATCHING_FR = [
  { sigle: 'PSF déclarant', definition: 'Banque ou fonds qui reporte à l’ACD' },
  { sigle: 'i-Hub', definition: 'Vérifie la cohérence documentaire pour le PSF' },
  { sigle: 'Client final', definition: 'Personne ou entité dont le compte est géré par le PSF' },
  { sigle: 'SLA', definition: 'Contrat définissant le périmètre des vérifications d’i-Hub' },
  { sigle: 'ACD', definition: 'Autorité luxembourgeoise qui centralise les déclarations' },
  { sigle: 'FATCA', definition: 'Loi américaine visant les US Persons à l’étranger' },
  { sigle: 'CRS', definition: 'Standard OCDE basé sur la résidence fiscale' },
  { sigle: 'Red flag', definition: 'Incohérence documentaire à signaler au PSF' },
  { sigle: 'W-9', definition: 'Formulaire rempli par une US Person' },
  { sigle: 'Autocertification', definition: 'Déclaration de résidence fiscale (CRS)' },
]
const MATCHING_EN = [
  { sigle: 'Reporting PSF', definition: 'Bank or fund that reports to the ACD' },
  { sigle: 'i-Hub', definition: 'Verifies documentary consistency for the PSF' },
  { sigle: 'Final client', definition: 'Person or entity whose account is managed by the PSF' },
  { sigle: 'SLA', definition: 'Contract defining the scope of i-Hub’s verifications' },
  { sigle: 'ACD', definition: 'Luxembourg authority that centralises declarations' },
  { sigle: 'FATCA', definition: 'US law targeting US Persons abroad' },
  { sigle: 'CRS', definition: 'OECD standard based on tax residency' },
  { sigle: 'Red flag', definition: 'Documentary inconsistency to flag to the PSF' },
  { sigle: 'W-9', definition: 'Form completed by a US Person' },
  { sigle: 'Self-certification', definition: 'Tax residency declaration (CRS)' },
]

const VF_FR = [
  { texte: "i-Hub déclare directement à l’ACD luxembourgeoise", reponse: false, explication: "Non ! Ce sont les PSF (banques, fonds) qui déclarent à l’ACD. i-Hub vérifie les documents et transmet les données vérifiées au PSF." },
  { texte: "i-Hub est soumis à FATCA en tant qu’institution financière", reponse: false, explication: "Non ! i-Hub est un PSF de support, pas une institution financière déclarante. Il ne reçoit pas de dépôts et n’investit pas pour des tiers." },
  { texte: "Le SLA définit précisément ce qu’i-Hub vérifie pour chaque PSF", reponse: true, explication: "Exact ! Le SLA est le contrat qui délimite le périmètre des vérifications. Chaque PSF peut avoir des exigences différentes." },
  { texte: "Si i-Hub détecte un red flag hors périmètre SLA, il peut l’ignorer", reponse: false, explication: "Non ! Tout red flag visible doit être signalé au PSF, même s’il dépasse le périmètre contractuel. C’est une question de responsabilité." },
  { texte: "Un Américain résidant en France peut être soumis à la fois à FATCA et au CRS", reponse: true, explication: "Exact ! FATCA s’applique pour la nationalité américaine, CRS pour la résidence fiscale en France. Les deux s’appliquent simultanément." },
  { texte: "i-Hub classe les clients finaux des PSF selon leur catégorie FATCA", reponse: false, explication: "Non ! C’est le PSF qui classe ses clients finaux. i-Hub vérifie la cohérence des formulaires mais ne prend pas de décision de classification." },
  { texte: "Les données fiscales des clients finaux sont couvertes par le secret professionnel", reponse: true, explication: "Exact ! Ces données sont parmi les plus sensibles. Elles ne peuvent pas sortir du cadre contractuel SLA." },
  { texte: "Le client d’i-Hub, c’est le PSF. Le client final, c’est la personne dont i-Hub vérifie les documents", reponse: true, explication: "Exact ! Cette distinction est fondamentale. i-Hub travaille pour le PSF, pas directement pour le client final." },
  { texte: "i-Hub peut décider seul de la classification FATCA d’un client en cas d’urgence", reponse: false, explication: "Non ! En cas de doute, i-Hub signale au PSF. La décision de classification appartient toujours au PSF." },
  { texte: "CRS est basé sur la nationalité, FATCA sur la résidence fiscale", reponse: false, explication: "C’est l’inverse ! FATCA = nationalité américaine. CRS = résidence fiscale. Une confusion fréquente à éviter." },
]
const VF_EN = [
  { texte: "i-Hub reports directly to the Luxembourg ACD", reponse: false, explication: "No! PSFs (banks, funds) report to the ACD. i-Hub verifies documents and transmits verified data to the PSF." },
  { texte: "i-Hub is subject to FATCA as a financial institution", reponse: false, explication: "No! i-Hub is a support PSF, not a Reporting Financial Institution. It does not hold deposits or invest for third parties." },
  { texte: "The SLA precisely defines what i-Hub verifies for each PSF", reponse: true, explication: "Correct! The SLA is the contract that delimits the verification scope. Each PSF may have different requirements." },
  { texte: "If i-Hub detects a red flag outside the SLA scope, it can ignore it", reponse: false, explication: "No! Any visible red flag must be flagged to the PSF, even if it exceeds the contractual scope. It is a matter of responsibility." },
  { texte: "A US citizen living in France can be subject to both FATCA and CRS", reponse: true, explication: "Correct! FATCA applies for US nationality, CRS for tax residency in France. Both apply simultaneously." },
  { texte: "i-Hub classifies PSFs’ final clients according to their FATCA category", reponse: false, explication: "No! It is the PSF that classifies its final clients. i-Hub verifies form consistency but does not make classification decisions." },
  { texte: "Final clients’ tax data is covered by professional secrecy", reponse: true, explication: "Correct! This data is among the most sensitive. It cannot leave the SLA contractual framework." },
  { texte: "i-Hub’s client is the PSF. The final client is the person whose documents i-Hub checks", reponse: true, explication: "Correct! This distinction is fundamental. i-Hub works for the PSF, not directly for the final client." },
  { texte: "i-Hub can decide alone on the FATCA classification of a client in an emergency", reponse: false, explication: "No! When in doubt, i-Hub flags to the PSF. The classification decision always belongs to the PSF." },
  { texte: "CRS is based on nationality, FATCA on tax residency", reponse: false, explication: "That’s the wrong way round! FATCA = US nationality. CRS = tax residency. A common confusion to avoid." },
]

const CAS_FR = [
  { situation: "Un PSF vous envoie le dossier d’un client avec un W-8BEN (non-américain) mais le passeport indique une naissance à Chicago.", action: "Signaler l’incohérence au PSF \u2014 né aux USA + W-8BEN = red flag", options: ["Accepter le W-8BEN \u2014 le client a signé", "Signaler l’incohérence au PSF \u2014 né aux USA + W-8BEN = red flag", "Demander un W-9 directement au client final", "Classer comme US Person"], explication: "Né à Chicago + W-8BEN = contradiction flagrante. i-Hub signale au PSF. C’est au PSF de demander des clarifications au client final." },
  { situation: "Un PSF demande à i-Hub de déclarer lui-même les comptes américains à l’ACD car il manque de ressources.", action: "Refuser \u2014 la déclaration à l’ACD est la responsabilité exclusive du PSF", options: ["Accepter à titre exceptionnel", "Refuser \u2014 la déclaration à l’ACD est la responsabilité exclusive du PSF", "Transférer la demande à l’ACD directement", "Accepter si le SLA est modifié"], explication: "i-Hub ne peut pas déclarer à l’ACD à la place du PSF. Même avec un SLA modifié, cette responsabilité ne peut pas être déléguée à un PSF de support." },
  { situation: "Une vérification révèle qu’un W-8BEN date de 4 ans. Le SLA ne prévoit pas de vérification des dates.", action: "Signaler quand même au PSF \u2014 formulaire expiré = red flag à signaler", options: ["Ne rien faire \u2014 hors périmètre SLA", "Signaler quand même au PSF \u2014 formulaire expiré = red flag à signaler", "Renouveler le W-8BEN directement", "Clôturer le dossier"], explication: "Même hors SLA, un formulaire expiré est un red flag visible. i-Hub le signale au PSF qui décide de la suite." },
  { situation: "Un PSF demande à i-Hub de vérifier si le NIF d’un client français est fiscalement valide en France.", action: "Préciser que cette vérification dépasse le périmètre d’i-Hub", options: ["Vérifier sur le site des impôts français", "Accepter si prévu dans le SLA", "Préciser que cette vérification dépasse le périmètre d’i-Hub", "Ignorer la demande"], explication: "i-Hub vérifie la cohérence des formats \u2014 pas la validité fiscale auprès des administrations étrangères. C’est hors périmètre." },
  { situation: "Lors d’une vérification CRS, i-Hub constate que le NIF fourni par le client a un format incompatible avec le pays déclaré.", action: "Signaler l’incohérence de format au PSF", options: ["Accepter \u2014 le client a rempli le formulaire", "Signaler l’incohérence de format au PSF", "Corriger le NIF directement", "Contacter le client final"], explication: "Un format de NIF incompatible avec le pays est une incohérence à signaler. i-Hub ne corrige pas \u2014 il signale au PSF qui contacte le client." },
]
const CAS_EN = [
  { situation: "A PSF sends you a client file with a W-8BEN (non-US) but the passport shows a birthplace of Chicago.", action: "Flag the inconsistency to the PSF \u2014 born in US + W-8BEN = red flag", options: ["Accept the W-8BEN \u2014 the client signed it", "Flag the inconsistency to the PSF \u2014 born in US + W-8BEN = red flag", "Request a W-9 directly from the final client", "Classify as US Person"], explication: "Born in Chicago + W-8BEN = obvious contradiction. i-Hub flags to the PSF. It is up to the PSF to seek clarification from the final client." },
  { situation: "A PSF asks i-Hub to report US accounts to the ACD directly as it lacks resources.", action: "Refuse \u2014 ACD reporting is the exclusive responsibility of the PSF", options: ["Accept on an exceptional basis", "Refuse \u2014 ACD reporting is the exclusive responsibility of the PSF", "Forward the request to the ACD directly", "Accept if the SLA is amended"], explication: "i-Hub cannot report to the ACD on behalf of the PSF. Even with an amended SLA, this responsibility cannot be delegated to a support PSF." },
  { situation: "A verification reveals that a W-8BEN is 4 years old. The SLA does not include date verification.", action: "Flag to the PSF anyway \u2014 expired form = red flag to report", options: ["Do nothing \u2014 outside SLA scope", "Flag to the PSF anyway \u2014 expired form = red flag to report", "Renew the W-8BEN directly", "Close the file"], explication: "Even outside the SLA, an expired form is a visible red flag. i-Hub flags it to the PSF, who decides the next steps." },
  { situation: "A PSF asks i-Hub to verify whether a French client’s TIN is fiscally valid in France.", action: "Clarify that this verification is outside i-Hub’s scope", options: ["Check on the French tax authority website", "Accept if specified in the SLA", "Clarify that this verification is outside i-Hub’s scope", "Ignore the request"], explication: "i-Hub verifies format consistency \u2014 not fiscal validity with foreign administrations. This is outside scope." },
  { situation: "During a CRS verification, i-Hub notices that the TIN format provided by the client is incompatible with the declared country.", action: "Flag the format inconsistency to the PSF", options: ["Accept \u2014 the client completed the form", "Flag the format inconsistency to the PSF", "Correct the TIN directly", "Contact the final client"], explication: "A TIN format incompatible with the declared country is an inconsistency to flag. i-Hub does not correct \u2014 it flags to the PSF, who contacts the client." },
]

export default function ModuleFiscaliteGrandsPrincipes() {
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

  const [activeMatching, setActiveMatching] = useState(() => pickRandom(MATCHING_FR, 6))
  const [matchSelected, setMatchSelected] = useState<string|null>(null)
  const [matchPairs, setMatchPairs] = useState<Record<string,string>>({})
  const [matchError, setMatchError] = useState<string|null>(null)
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
    const bm = l==='fr'?MATCHING_FR:MATCHING_EN; const bv = l==='fr'?VF_FR:VF_EN; const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveMatching(pickRandom(bm,6)); setMatchPairs({}); setMatchSelected(null); setMatchError(null)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l) }
  function handleMatchSigle(sigle: string) { if (matchPairs[sigle]) return; setMatchSelected(sigle); setMatchError(null) }
  function handleMatchDef(def: string) {
    if (!matchSelected) return
    const correct = activeMatching.find(m => m.sigle===matchSelected)?.definition
    if (correct===def) { const np={...matchPairs,[matchSelected]:def}; setMatchPairs(np); setMatchSelected(null); if (Object.keys(np).length===activeMatching.length) setScore(s=>s+15) }
    else { setMatchError(lang==='fr'?`❌ "${def}" ne correspond pas à ${matchSelected}.`:`❌ "${def}" does not match ${matchSelected}.`); setMatchSelected(null) }
  }
  function repondreVF(rep: boolean) {
    if (vfRepondu!==null) return
    const correct=activeVF[vfIndex].reponse===rep; setVfRepondu(rep); setVfAnimation(correct?'correct':'wrong')
    if (correct) setVfScore(s=>s+1)
    setTimeout(() => { setVfAnimation(null); setVfRepondu(null); if (vfIndex+1<activeVF.length) { setVfIndex(i=>i+1) } else { const fs=correct?vfScore+1:vfScore; setScore(s=>s+fs*5); setPhase('quiz3') } }, 2200)
  }
  function repCas(opt: string) { if (casRepondu!==null) return; const correct=opt===activeCas[casIndex].action; setCasRepondu(opt); if (correct) setCasScore(s=>s+1) }
  function nextCas() { if (casIndex+1<activeCas.length) { setCasIndex(i=>i+1); setCasRepondu(null) } else { setScore(s=>s+casScore*7); setPhase('resultat') } }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.push('/')} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#ffffff',fontWeight:'700',fontSize:'16px'}}>🌐 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          <button onClick={()=>switchLang('fr')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='fr'?C:'transparent',color:'white',transition:'all 0.2s'}}>🇫🇷 FR</button>
          <button onClick={()=>switchLang('en')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='en'?C:'transparent',color:'white',transition:'all 0.2s'}}>🇬🇧 EN</button>
        </div>
        <span style={{background:'white',border:`1px solid ${C}`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🌐</div>
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
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer',boxShadow:`0 4px 20px ${C}50`}}>{t.start}</button>
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
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'200px'}}>
              {FICHES.map((_,i)=>(<div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>))}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',boxShadow:`0 8px 40px ${C}15`,border:`2px solid ${C}30`,overflow:'hidden',marginBottom:'20px'}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0,lineHeight:1.3}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
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
              {(fiche as any).plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen(o=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:`1.5px solid ${C}`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'}}>
                    <span>{t.goFurther}</span><span style={{transition:'transform 0.3s',transform:plusLoinOpen?'rotate(180deg)':'rotate(0deg)',display:'inline-block'}}>▾</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:`${C}08`,border:`1px solid ${C}25`,borderRadius:'0 0 10px 10px',padding:'16px',marginTop:'-4px',borderTop:'none'}}>
                      {((fiche as any).plusLoin as {icon:string,texte:string}[]).map((item,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:i<(fiche as any).plusLoin.length-1?`1px solid ${C}20`:'none'}}>
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
            {ficheIndex>0 && <button onClick={()=>{setFicheIndex(i=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontSize:'15px',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700',boxShadow:`0 4px 16px ${C}40`}}>
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
                {activeMatching.map(m=>{const ip=!!matchPairs[m.sigle],is=matchSelected===m.sigle;return(
                  <button key={m.sigle} onClick={()=>handleMatchSigle(m.sigle)} disabled={ip} style={{padding:'12px',borderRadius:'10px',fontSize:'13px',fontWeight:'700',cursor:ip?'default':'pointer',transition:'all 0.2s',background:ip?'#d1fae5':is?C:'white',color:ip?'#059669':is?'white':'#1f2937',border:ip?'1.5px solid #6ee7b7':is?`1.5px solid ${C}`:'1.5px solid #e5e7eb'}}>
                    {ip?'✓ ':''}{m.sigle}
                  </button>
                )})}
              </div>
            </div>
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>{t.definitions}</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {shuffle(activeMatching.map(m=>({definition:m.definition}))).map(m=>{const ip=Object.values(matchPairs).includes(m.definition);return(
                  <button key={m.definition} onClick={()=>handleMatchDef(m.definition)} disabled={ip||!matchSelected} style={{padding:'12px',borderRadius:'10px',fontSize:'13px',fontWeight:'500',cursor:(ip||!matchSelected)?'default':'pointer',transition:'all 0.2s',textAlign:'left',background:ip?'#d1fae5':matchSelected?'white':'#f9fafb',color:ip?'#059669':'#374151',border:ip?'1.5px solid #6ee7b7':'1.5px solid #e5e7eb',opacity:(!matchSelected&&!ip)?0.6:1}}>
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
          <div style={{background:C,height:'6px',width:`${(vfIndex/activeVF.length)*100}%`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'24px'}}>{t.quiz2label} — {vfIndex+1}/{activeVF.length}</span>
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
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
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
              {cas.options.map((opt,i)=>(
                <button key={i} onClick={()=>repCas(opt)} style={{padding:'16px 20px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left',transition:'all 0.15s'}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=`${C}08`}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ):(
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px'}}>
                {cas.options.map((opt,i)=>{const isC=opt===cas.action,isCh=opt===casRepondu;return(
                  <div key={i} style={{padding:'16px 20px',background:isC?'#d1fae5':isCh?'#fee2e2':'white',border:`1.5px solid ${isC?'#6ee7b7':isCh?'#fca5a5':'#e5e7eb'}`,borderRadius:'12px',fontSize:'14px',fontWeight:'600',color:isC?'#059669':isCh?'#dc2626':'#9ca3af'}}>
                    {isC?'✅ ':isCh?'❌ ':''}{opt}
                  </div>
                )})}
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
            <div style={{background:`linear-gradient(90deg,${C},#f87171)`,height:'12px',width:`${total}%`,borderRadius:'8px'}}/>
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
