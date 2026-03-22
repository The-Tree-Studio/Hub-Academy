require("fs").mkdirSync("app/modules/fiscalite-grands-principes", { recursive: true });
require("fs").writeFileSync("app/modules/fiscalite-grands-principes/page.tsx", `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const UI = {
  fr: {
    title: 'Les grands principes',
    subtitle: 'Fiscalit\u00e9 internationale \u2014 Comprendre le cadre et le r\u00f4le d\u2019i-Hub',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:', learnItems: [
      'Pourquoi la fiscalit\u00e9 internationale concerne i-Hub',
      'Qui est soumis \u00e0 FATCA et CRS \u2014 et qui ne l\u2019est pas',
      'Le r\u00f4le exact d\u2019i-Hub\u00a0: v\u00e9rification, pas d\u00e9claration',
      'La diff\u00e9rence entre le PSF d\u00e9clarant et i-Hub sous-traitant',
      'Ce qu\u2019i-Hub v\u00e9rifie et ce qu\u2019il ne v\u00e9rifie pas (SLA)',
      'Pourquoi ces r\u00e8gles existent et ce qu\u2019elles changent concr\u00e8tement',
    ],
    fiches: '18 fiches', time: '~15 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    finBtn: '\u2713 Terminer le module', toRetain: '\u00c0 RETENIR', goFurther: '\ud83d\udd0d Aller plus loin',
    home: '\u2190 Accueil',
    resultTitle: 'Module termin\u00e9 \u2014 Le cadre est clair\u00a0!',
    resultSub: 'Vous avez parcouru les 18 fiches. Ce module est le socle de tous les autres modules Fiscalit\u00e9 Internationale.',
    backHome: '\u2190 Retour aux modules', restart: '\ud83d\udd04 Recommencer ce module',
  },
  en: {
    title: 'Key Principles',
    subtitle: 'International Taxation \u2014 Understanding the framework and i-Hub\u2019s role',
    learn: '\ud83d\udcda What you will learn:', learnItems: [
      'Why international taxation concerns i-Hub',
      'Who is subject to FATCA and CRS \u2014 and who is not',
      'i-Hub\u2019s exact role: verification, not reporting',
      'The difference between the reporting PSF and i-Hub as subcontractor',
      'What i-Hub checks and what it does not (SLA)',
      'Why these rules exist and what they concretely change',
    ],
    fiches: '18 cards', time: '~15 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    finBtn: '\u2713 Complete module', toRetain: 'KEY TAKEAWAY', goFurther: '\ud83d\udd0d Go further',
    home: '\u2190 Home',
    resultTitle: 'Module complete \u2014 The framework is clear!',
    resultSub: 'You have completed all 18 cards. This module is the foundation for all other International Taxation modules.',
    backHome: '\u2190 Back to modules', restart: '\ud83d\udd04 Restart this module',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83c\udf10', titre:"Pourquoi la fiscalit\u00e9 internationale nous concerne", contenu:[
    { icon:'\ud83c\udfe6', texte:"Les clients d\u2019i-Hub sont des **PSF luxembourgeois** (banques, fonds, assureurs) qui g\u00e8rent des comptes de clients finaux du monde entier" },
    { icon:'\ud83c\udf0d', texte:"Ces clients finaux peuvent \u00eatre **am\u00e9ricains** (FATCA) ou **r\u00e9sidents fiscaux \u00e9trangers** (CRS) \\u2014 ce qui cr\u00e9e des obligations de d\u00e9claration fiscale" },
    { icon:'\ud83d\udd0d', texte:"i-Hub **v\u00e9rifie l\u2019identit\u00e9 et la coh\u00e9rence documentaire** des clients finaux pour le compte des PSF \\u2014 y compris les formulaires fiscaux FATCA/CRS" },
    { icon:'\ud83d\udcdd', texte:"Sans comprendre ces r\u00e8gles, i-Hub ne peut pas faire correctement son travail de **v\u00e9rification** ni signaler les incoh\u00e9rences aux PSF" },
  ], aretenir:"La fiscalit\u00e9 internationale nous concerne parce que nos clients PSF y sont soumis. Notre r\u00f4le\u00a0: v\u00e9rifier et signaler. Pas d\u00e9clarer." },

  { id:2, emoji:'\ud83c\udfe6', titre:"Qui est vraiment soumis \u00e0 FATCA et CRS\u00a0?", contenu:[
    { icon:'\u2705', texte:"**Les PSF** (banques, fonds, assureurs) luxembourgeois \\u2014 ils sont les **Institutions Financi\u00e8res D\u00e9clarantes** et reportent \u00e0 l\u2019ACD" },
    { icon:'\u2705', texte:"**Les clients finaux des PSF** \\u2014 s\u2019ils sont am\u00e9ricains (FATCA) ou r\u00e9sidents fiscaux \u00e9trangers (CRS), leurs comptes sont d\u00e9clarables" },
    { icon:'\u274c', texte:"**i-Hub n\u2019est pas** une Institution Financi\u00e8re D\u00e9clarante \\u2014 il ne re\u00e7oit pas de d\u00e9p\u00f4ts, ne g\u00e8re pas de comptes et n\u2019investit pas pour le compte de tiers" },
    { icon:'\ud83d\udd17', texte:"i-Hub est un **PSF de support** \\u2014 sous-traitant des PSF, il ex\u00e9cute des t\u00e2ches de v\u00e9rification documentaire sur instruction" },
  ], aretenir:"PSF = d\u00e9clarant. Client final = d\u00e9clarable. i-Hub = v\u00e9rificateur. Ces trois r\u00f4les sont distincts et ne se m\u00e9langent pas." },

  { id:3, emoji:'\ud83d\udcc4', titre:"Le r\u00f4le exact d\u2019i-Hub dans le processus fiscal", contenu:[
    { icon:'\ud83d\udd0d', texte:"i-Hub **v\u00e9rifie la coh\u00e9rence** des formulaires fiscaux (W-9, W-8BEN, autocertifications CRS) fournis par les clients finaux des PSF" },
    { icon:'\ud83d\udea8', texte:"i-Hub **signale les incoh\u00e9rences** d\u00e9tect\u00e9es au PSF \\u2014 par exemple un W-8BEN rempli par quelqu\u2019un n\u00e9 aux USA, ou une adresse am\u00e9ricaine non signal\u00e9e" },
    { icon:'\ud83d\udcce', texte:"i-Hub **transmet les donn\u00e9es v\u00e9rifi\u00e9es** au PSF \\u2014 c\u2019est ensuite le PSF qui prend les d\u00e9cisions de classification et de d\u00e9claration" },
    { icon:'\ud83d\udeab', texte:"i-Hub **ne classe pas** les clients finaux, **ne d\u00e9clare pas** \u00e0 l\u2019ACD, **ne d\u00e9cide pas** de l\u2019action \u00e0 prendre en cas de doute" },
  ], aretenir:"V\u00e9rifier \u2260 D\u00e9clarer. Signaler \u2260 D\u00e9cider. i-Hub est les yeux du PSF sur le terrain \\u2014 pas son bras l\u00e9gal.", plusLoin:[
    { icon:'\ud83d\udcdd', texte:"Le p\u00e9rim\u00e8tre exact des v\u00e9rifications d\u2019i-Hub est **d\u00e9fini contractuellement** dans le SLA sign\u00e9 avec chaque PSF" },
    { icon:'\u26a0\ufe0f', texte:"Si une v\u00e9rification va au-del\u00e0 du SLA, i-Hub s\u2019expose \u00e0 un risque de **responsabilit\u00e9 \u00e9largie** non pr\u00e9vue au contrat" },
    { icon:'\ud83e\udd1d', texte:"En cas de doute sur le p\u00e9rim\u00e8tre, l\u2019\u00e9quipe Compliance d\u2019i-Hub et le contact PSF clarifient ensemble avant d\u2019agir" },
  ]},

  { id:4, emoji:'\ud83d\udcdc', titre:"Le SLA\u00a0: ce qu\u2019i-Hub v\u00e9rifie et ce qu\u2019il ne v\u00e9rifie pas", contenu:[
    { icon:'\u2705', texte:"**Ce qu\u2019i-Hub v\u00e9rifie** (exemples)\u00a0: pr\u00e9sence et coh\u00e9rence d\u2019un formulaire W-9 ou W-8BEN, indices d\u2019am\u00e9ricanit\u00e9 \u00e9vidents, concordance entre pays de r\u00e9sidence et NIF" },
    { icon:'\u274c', texte:"**Ce qu\u2019i-Hub ne v\u00e9rifie pas** (exemples)\u00a0: l\u2019exactitude fiscale du NIF, la conformit\u00e9 l\u00e9gale globale du client, la classification FATCA finale" },
    { icon:'\ud83d\udcdc', texte:"Chaque **SLA** avec un PSF d\u00e9finit pr\u00e9cis\u00e9ment la liste des points \u00e0 v\u00e9rifier et le format de restitution" },
    { icon:'\ud83d\udea8', texte:"En cas d\u2019anomalie hors p\u00e9rim\u00e8tre, i-Hub **signale quand m\u00eame** au PSF \\u2014 m\u00eame si ce n\u2019est pas contractuellement obligatoire" },
  ], aretenir:"Le SLA est la bible d\u2019i-Hub. Il d\u00e9finit exactement ce qui est attendu. Ni plus, ni moins \\u2014 mais avec le souci de signaler tout red flag visible." },

  { id:5, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:"FATCA\u00a0: pourquoi les \u00c9tats-Unis ont cr\u00e9\u00e9 cette loi", contenu:[
    { icon:'\ud83d\udcb0', texte:"Avant FATCA, de nombreux **contribuables am\u00e9ricains** cachaient leurs avoirs dans des banques \u00e9trang\u00e8res pour \u00e9chapper \u00e0 l\u2019imp\u00f4t am\u00e9ricain" },
    { icon:'\u26a1', texte:"En 2010, les USA ont adopt\u00e9 **FATCA** pour forcer les institutions financi\u00e8res mondiales \u00e0 identifier et d\u00e9clarer les comptes am\u00e9ricains \u00e0 l\u2019IRS" },
    { icon:'\ud83c\udf0d', texte:"La particularit\u00e9 am\u00e9ricaine\u00a0: les USA imposent leurs citoyens sur leur **revenu mondial**, m\u00eame s\u2019ils vivent \u00e0 l\u2019\u00e9tranger \\u2014 d\u2019o\u00f9 l\u2019importance d\u2019identifier toute US Person" },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:"Le Luxembourg a sign\u00e9 un **IGA Mod\u00e8le 1** avec les USA en 2014\u00a0: les PSF luxembourgeois reportent \u00e0 l\u2019ACD qui transmet \u00e0 l\u2019IRS" },
  ], aretenir:"FATCA existe parce que les USA taxent leurs citoyens partout dans le monde. Les PSF luxembourgeois doivent donc identifier les Am\u00e9ricains parmi leurs clients finaux." },

  { id:6, emoji:'\ud83c\udf0d', titre:"CRS\u00a0: pourquoi l\u2019OCDE a cr\u00e9\u00e9 ce standard", contenu:[
    { icon:'\ud83d\udcb8', texte:"L\u2019\u00e9vasion fiscale \u00e9tait mondiale\u00a0: des r\u00e9sidents de nombreux pays cachaient leurs avoirs dans des pays \u00e0 fiscalit\u00e9 favorable comme le Luxembourg" },
    { icon:'\ud83e\udd1d', texte:"En 2014, l\u2019**OCDE** a cr\u00e9\u00e9 le **CRS** pour instaurer un \u00e9change automatique d\u2019informations entre plus de 100 pays" },
    { icon:'\ud83c\udfe0', texte:"Contrairement \u00e0 FATCA, le CRS se base sur la **r\u00e9sidence fiscale** (o\u00f9 vit le client) et non sur la nationalit\u00e9" },
    { icon:'\ud83d\udce4', texte:"Concr\u00e8tement\u00a0: un r\u00e9sident fran\u00e7ais qui a un compte au Luxembourg \u2192 le PSF luxembourgeois d\u00e9clare les infos \u00e0 l\u2019ACD \u2192 l\u2019ACD transmet \u00e0 la DGFiP fran\u00e7aise" },
  ], aretenir:"CRS vise \u00e0 \u00e9liminer les paradis fiscaux en rendant transparents les comptes \u00e0 l\u2019\u00e9tranger. Les PSF luxembourgeois sont au c\u0153ur du dispositif." },

  { id:7, emoji:'\ud83e\udd1d', titre:"Les acteurs\u00a0: qui fait quoi dans la cha\u00eene", contenu:[
    { icon:'\ud83d\udc64', texte:"**Client final** du PSF\u00a0: remplit les formulaires (W-9, W-8BEN, autocertification CRS) et d\u00e9clare sa situation fiscale" },
    { icon:'\ud83c\udfe6', texte:"**PSF** (banque, fonds\u2026)\u00a0: collecte les formulaires, classe le client, d\u00e9clare \u00e0 l\u2019ACD sous sa propre responsabilit\u00e9" },
    { icon:'\ud83d\udd0d', texte:"**i-Hub** (PSF de support)\u00a0: v\u00e9rifie la coh\u00e9rence des formulaires pour le compte du PSF, dans le p\u00e9rim\u00e8tre du SLA" },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:"**ACD** (Luxembourg)\u00a0: re\u00e7oit les d\u00e9clarations des PSF et les transmet aux autorit\u00e9s fiscales des pays concern\u00e9s" },
  ], aretenir:"Client \u2192 PSF \u2192 ACD\u00a0: voil\u00e0 la cha\u00eene de d\u00e9claration. i-Hub est en amont du PSF, comme v\u00e9rificateur \\u2014 pas comme d\u00e9clarant.", plusLoin:[
    { icon:'\ud83c\udfdb\ufe0f', texte:"L\u2019**IRS** (USA) re\u00e7oit les d\u00e9clarations FATCA via l\u2019ACD \\u2014 pas directement des PSF" },
    { icon:'\ud83c\udf0d', texte:"Pour CRS\u00a0: l\u2019ACD transmet aux **autorit\u00e9s fiscales** du pays de r\u00e9sidence du client final (DGFiP France, Finanzamt Allemagne\u2026)" },
    { icon:'\ud83d\udd12', texte:"Toutes ces transmissions sont **chiffr\u00e9es et s\u00e9curis\u00e9es** \\u2014 les donn\u00e9es fiscales des clients sont confidentielles" },
  ]},

  { id:8, emoji:'\ud83d\udc64', titre:"Qui est un \u00ab\u00a0client final\u00a0\u00bb pour i-Hub\u00a0?", contenu:[
    { icon:'\ud83d\udc68\u200d\ud83d\udcbc', texte:"Les **personnes physiques** qui ont un compte aupr\u00e8s du PSF \\u2014 particuliers, dirigeants, actionnaires d\u2019une entit\u00e9 cliente" },
    { icon:'\ud83c\udfe2', texte:"Les **entit\u00e9s** (soci\u00e9t\u00e9s, fonds, fondations) dont le PSF g\u00e8re le compte ou les actifs" },
    { icon:'\ud83d\udd17', texte:"Les **b\u00e9n\u00e9ficiaires effectifs** (UBO) des entit\u00e9s \\u2014 leurs infos peuvent aussi figurer dans les formulaires FATCA/CRS" },
    { icon:'\u26a0\ufe0f', texte:"i-Hub v\u00e9rifie les informations **transmises par le PSF** \\u2014 il n\u2019est pas en contact direct avec le client final sauf exception pr\u00e9vue au SLA" },
  ], aretenir:"Le \u00ab\u00a0client\u00a0\u00bb d\u2019i-Hub, c\u2019est le PSF. Le \u00ab\u00a0client final\u00a0\u00bb, c\u2019est la personne ou entit\u00e9 dont i-Hub v\u00e9rifie les documents \\u2014 une distinction essentielle." },

  { id:9, emoji:'\ud83d\udcb1', titre:"FATCA et CRS\u00a0: les deux syst\u00e8mes en parall\u00e8le", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**FATCA**\u00a0: am\u00e9ricain, bas\u00e9 sur la **nationalit\u00e9/citoyennet\u00e9** \\u2014 toute US Person, o\u00f9 qu\u2019elle vive" },
    { icon:'\ud83c\udf0d', texte:"**CRS**\u00a0: multilat\u00e9ral OCDE, bas\u00e9 sur la **r\u00e9sidence fiscale** \\u2014 tout r\u00e9sident \u00e9tranger, quelle que soit sa nationalit\u00e9" },
    { icon:'\ud83d\udd04', texte:"Les deux s\u2019appliquent **en m\u00eame temps**\u00a0: un Am\u00e9ricain vivant en France est soumis \u00e0 FATCA (nationalit\u00e9) ET CRS (r\u00e9sidence France)" },
    { icon:'\ud83d\udcdd', texte:"Pour i-Hub\u00a0: les formulaires \u00e0 v\u00e9rifier sont diff\u00e9rents (W-9/W-8BEN pour FATCA, autocertification pour CRS) mais la logique est la m\u00eame" },
  ], aretenir:"FATCA et CRS coexistent. Un m\u00eame client final peut g\u00e9n\u00e9rer des obligations dans les deux syst\u00e8mes \\u2014 i-Hub v\u00e9rifie les deux." },

  { id:10, emoji:'\ud83d\udcb2', titre:"Le QI\u00a0: un 3\u00e8me syst\u00e8me li\u00e9 aux retenues am\u00e9ricaines", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**QI** = Qualified Intermediary \\u2014 statut optionnel pour les institutions financi\u00e8res \u00e9trang\u00e8res qui traitent des **revenus de source am\u00e9ricaine**" },
    { icon:'\ud83d\udcb0', texte:"Concerne les dividendes et int\u00e9r\u00eats d\u2019actions/obligations am\u00e9ricaines d\u00e9tenues par les clients finaux des PSF" },
    { icon:'\ud83d\udd17', texte:"Le statut QI permet d\u2019appliquer les **taux r\u00e9duits** des conventions fiscales USA/Luxembourg plut\u00f4t que la retenue standard de 30%" },
    { icon:'\ud83d\udc41\ufe0f', texte:"Pour i-Hub\u00a0: le QI est g\u00e9n\u00e9ralement g\u00e9r\u00e9 directement par les PSF \\u2014 i-Hub peut \u00eatre impliqu\u00e9 dans la v\u00e9rification des formulaires li\u00e9s si pr\u00e9vu au SLA" },
  ], aretenir:"Le QI est compl\u00e9mentaire \u00e0 FATCA. C\u2019est le PSF qui d\u00e9cide d\u2019avoir le statut QI et qui en assume les obligations \\u2014 pas i-Hub." },

  { id:11, emoji:'\ud83d\udccb', titre:"Les formulaires cl\u00e9s que v\u00e9rifie i-Hub", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**W-9**\u00a0: rempli par les US Persons \\u2014 certifie le statut am\u00e9ricain et le TIN (num\u00e9ro fiscal US)" },
    { icon:'\ud83d\udcdd', texte:"**W-8BEN**\u00a0: rempli par les non-US Persons (particuliers) \\u2014 certifie le statut non-am\u00e9ricain, valable 3 ans" },
    { icon:'\ud83c\udfe2', texte:"**W-8BEN-E**\u00a0: rempli par les entit\u00e9s non-am\u00e9ricaines \\u2014 plus complexe, pr\u00e9cise la cat\u00e9gorie FATCA de l\u2019entit\u00e9" },
    { icon:'\ud83c\udf0d', texte:"**Autocertification CRS**\u00a0: d\u00e9claration de r\u00e9sidence fiscale \\u2014 obligatoire pour tout nouveau compte depuis 2016" },
  ], aretenir:"Ces 4 formulaires sont le c\u0153ur du travail de v\u00e9rification d\u2019i-Hub. Les conna\u00eetre = comprendre ce qu\u2019on cherche et ce qu\u2019on v\u00e9rifie." },

  { id:12, emoji:'\ud83d\udd0d', titre:"Ce que v\u00e9rifie concr\u00e8tement i-Hub", contenu:[
    { icon:'\u2705', texte:"**Pr\u00e9sence du formulaire**\u00a0: le bon formulaire a-t-il bien \u00e9t\u00e9 fourni selon le type de client final\u00a0?" },
    { icon:'\u2705', texte:"**Coh\u00e9rence interne**\u00a0: les informations du formulaire sont-elles coh\u00e9rentes entre elles (ex\u00a0: pays de naissance vs pays de r\u00e9sidence d\u00e9clar\u00e9)\u00a0?" },
    { icon:'\u2705', texte:"**Coh\u00e9rence externe**\u00a0: les informations du formulaire concordent-elles avec les autres documents d\u2019identit\u00e9 collect\u00e9s\u00a0?" },
    { icon:'\u2705', texte:"**Indices visibles**\u00a0: des \u00e9l\u00e9ments visibles dans le dossier sugg\u00e8rent-ils une am\u00e9ricanit\u00e9 ou une r\u00e9sidence \u00e9trang\u00e8re non d\u00e9clar\u00e9e\u00a0?" },
  ], aretenir:"i-Hub v\u00e9rifie la coh\u00e9rence \\u2014 pas l\u2019exactitude fiscale absolue. Ce travail est essentiel pour que le PSF puisse d\u00e9clarer correctement.", plusLoin:[
    { icon:'\ud83d\udccc', texte:"La **check-list de v\u00e9rification** d\u2019i-Hub est d\u00e9finie dans le SLA de chaque PSF \\u2014 elle peut varier d\u2019un client \u00e0 l\u2019autre" },
    { icon:'\ud83d\udea8', texte:"Tout red flag d\u00e9tect\u00e9 doit \u00eatre **document\u00e9 et signal\u00e9** au PSF, m\u00eame s\u2019il est hors p\u00e9rim\u00e8tre SLA" },
    { icon:'\ud83d\udc68\u200d\u2696\ufe0f', texte:"En cas de doute sur ce qu\u2019il faut v\u00e9rifier, l\u2019\u00e9quipe Compliance clarifie avec le contact PSF avant d\u2019agir" },
  ]},

  { id:13, emoji:'\ud83d\udea8', titre:"Quand signaler une incoh\u00e9rence au PSF\u00a0?", contenu:[
    { icon:'\ud83d\udd34', texte:"**Naissance aux USA** sur un formulaire W-8BEN (non-US) \\u2014 contradiction \u00e9vidente \u00e0 signaler" },
    { icon:'\ud83d\udd34', texte:"**Adresse am\u00e9ricaine** ou num\u00e9ro de t\u00e9l\u00e9phone US non mentionn\u00e9 dans la documentation fiscale" },
    { icon:'\ud83d\udd34', texte:"**NIF manquant** sans justification \\u2014 ou NIF dont le format ne correspond pas au pays d\u00e9clar\u00e9" },
    { icon:'\ud83d\udd34', texte:"**Formulaire expir\u00e9**\u00a0: W-8BEN dat\u00e9 de plus de 3 ans sans renouvellement" },
    { icon:'\ud83d\udd34', texte:"**Incoh\u00e9rence entre documents**\u00a0: passeport fran\u00e7ais mais autocertification CRS indiquant r\u00e9sidence allemande sans explication" },
  ], aretenir:"Quand quelque chose ne colle pas entre les documents, on signale au PSF. On ne tranche pas. On ne classe pas. On documente et on alerte." },

  { id:14, emoji:'\ud83d\udcb0', titre:"Les enjeux\u00a0: pourquoi c\u2019est important pour i-Hub", contenu:[
    { icon:'\u2696\ufe0f', texte:"Si i-Hub fait une erreur de v\u00e9rification qui contribue \u00e0 un manquement FATCA/CRS du PSF, sa **responsabilit\u00e9 contractuelle** peut \u00eatre engag\u00e9e" },
    { icon:'\ud83d\udd12', texte:"Les donn\u00e9es fiscales des clients finaux sont **hautement confidentielles** \\u2014 toute fuite peut engager la responsabilit\u00e9 d\u2019i-Hub (RGPD + secret professionnel)" },
    { icon:'\ud83d\udcbc', texte:"La qualit\u00e9 des v\u00e9rifications d\u2019i-Hub est un **argument commercial** \\u2014 les PSF choisissent un sous-traitant fiable et rigoureux" },
    { icon:'\ud83d\udc40', texte:"La CSSF surveille les PSF \\u2014 et peut \u00e9tendre ses contr\u00f4les aux sous-traitants comme i-Hub en cas de manquement du PSF" },
  ], aretenir:"Bien faire son travail de v\u00e9rification prot\u00e8ge i-Hub l\u00e9galement, pr\u00e9serve la relation avec le PSF et garantit la qualit\u00e9 du service." },

  { id:15, emoji:'\ud83d\udc65', titre:"Les 3 types de clients finaux \u00e0 conna\u00eetre", contenu:[
    { icon:'\ud83d\udc64', texte:"**Personne physique non-US** en dehors du Luxembourg \\u2014 CRS peut s\u2019appliquer \\u2014 autocertification + NIF \u00e0 v\u00e9rifier" },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**Personne physique US Person** \\u2014 FATCA s\u2019applique \\u2014 W-9 \u00e0 v\u00e9rifier avec TIN" },
    { icon:'\ud83c\udfe2', texte:"**Entit\u00e9** (soci\u00e9t\u00e9, fonds, holding) \\u2014 FATCA + CRS peuvent s\u2019appliquer selon la nature et les actionnaires \\u2014 W-8BEN-E ou autocertification entit\u00e9" },
  ], aretenir:"Trois types, trois logiques. Pour chacun, i-Hub v\u00e9rifie que le bon formulaire est pr\u00e9sent et coh\u00e9rent avec le profil du client final." },

  { id:16, emoji:'\ud83d\udd11', titre:"Le secret professionnel et la confidentialit\u00e9 fiscale", contenu:[
    { icon:'\ud83d\udd12', texte:"Les informations fiscales des clients finaux (nationalit\u00e9, r\u00e9sidence, TIN) sont couvertes par le **secret professionnel PSF**" },
    { icon:'\ud83d\udee1\ufe0f', texte:"i-Hub, en tant que sous-traitant, est lui aussi soumis \u00e0 cette **obligation de confidentialit\u00e9** \\u2014 ces donn\u00e9es ne peuvent pas \u00eatre partag\u00e9es hors du p\u00e9rim\u00e8tre contractuel" },
    { icon:'\ud83d\udcbb', texte:"Le **RGPD** s\u2019applique \u00e9galement\u00a0: tout traitement de donn\u00e9es fiscales doit respecter les principes de minimisation et de s\u00e9curit\u00e9" },
    { icon:'\ud83d\udcdd', texte:"Les donn\u00e9es v\u00e9rifi\u00e9es par i-Hub sont transmises au PSF via des **canaux s\u00e9curis\u00e9s** pr\u00e9vus au SLA" },
  ], aretenir:"Les donn\u00e9es fiscales qu\u2019i-Hub traite sont parmi les plus sensibles. Leur protection est une obligation l\u00e9gale et contractuelle." },

  { id:17, emoji:'\ud83d\udd04', titre:"La mise \u00e0 jour\u00a0: un travail continu", contenu:[
    { icon:'\ud83d\udcc5', texte:"Les formulaires ont une **dur\u00e9e de validit\u00e9**\u00a0: le W-8BEN expire apr\u00e8s 3 ans, l\u2019autocertification CRS doit \u00eatre renouvel\u00e9e en cas de changement" },
    { icon:'\ud83d\udea8', texte:"Tout **changement de situation** du client final (d\u00e9m\u00e9nagement, mariage, nouvelle nationalit\u00e9) peut changer son statut fiscal" },
    { icon:'\ud83d\udd14', texte:"i-Hub peut recevoir du PSF des **demandes de v\u00e9rification compl\u00e9mentaire** lorsque le PSF d\u00e9tecte un changement" },
    { icon:'\ud83d\udcce', texte:"La qualit\u00e9 du **suivi et de la tra\u00e7abilit\u00e9** des v\u00e9rifications est essentielle\u00a0: chaque v\u00e9rification doit \u00eatre dat\u00e9e, document\u00e9e, archiv\u00e9e" },
  ], aretenir:"La fiscalit\u00e9 internationale n\u2019est pas un exercice ponctuel. i-Hub doit \u00eatre pr\u00eat \u00e0 effectuer des v\u00e9rifications compl\u00e9mentaires tout au long de la vie du dossier." },

  { id:18, emoji:'\ud83c\udf93', titre:"Ce que vous devez retenir de ce module", contenu:[
    { icon:'\ud83c\udfc6', texte:"**i-Hub v\u00e9rifie, le PSF d\u00e9clare** \\u2014 cette distinction est fondamentale et ne change jamais" },
    { icon:'\ud83d\udcdc', texte:"**Le SLA d\u00e9finit le p\u00e9rim\u00e8tre** \\u2014 ni plus, ni moins. En cas de doute, on clarifie avec le PSF avant d\u2019agir" },
    { icon:'\ud83d\udea8', texte:"**Tout red flag se signale** \\u2014 m\u00eame hors p\u00e9rim\u00e8tre, si quelque chose ne colle pas, on documente et on alerte le PSF" },
    { icon:'\ud83d\udd12', texte:"**La confidentialit\u00e9 est absolue** \\u2014 les donn\u00e9es fiscales des clients finaux ne sortent jamais du cadre contractuel" },
  ], aretenir:"4 r\u00e8gles d\u2019or\u00a0: v\u00e9rifier (pas d\u00e9clarer), respecter le SLA, signaler les red flags, prot\u00e9ger les donn\u00e9es. Tout le reste d\u00e9coule de l\u00e0.", plusLoin:[
    { icon:'\ud83d\udcda', texte:"Les modules suivants (FATCA, CRS, QI, formulaires) approfondissent chaque syst\u00e8me \\u2014 ce module est le socle \u00e0 garder en t\u00eate en permanence" },
    { icon:'\ud83d\udc68\u200d\u2696\ufe0f', texte:"En cas de question sur le r\u00f4le d\u2019i-Hub dans un cas concret, l\u2019\u00e9quipe Compliance est disponible" },
    { icon:'\ud83d\udd17', texte:"Le glossaire FATCA/CRS/QI est disponible dans les modules sp\u00e9cifiques de la th\u00e9matique Fiscalit\u00e9 Internationale" },
  ]},
]

const FICHES_EN = [
  { id:1, emoji:'\ud83c\udf10', titre:"Why international taxation concerns us", contenu:[
    { icon:'\ud83c\udfe6', texte:"i-Hub\u2019s clients are **Luxembourg PSFs** (banks, funds, insurers) that manage accounts for final clients from around the world" },
    { icon:'\ud83c\udf0d', texte:"These final clients may be **US nationals** (FATCA) or **foreign tax residents** (CRS) \\u2014 which creates tax reporting obligations" },
    { icon:'\ud83d\udd0d', texte:"i-Hub **verifies the identity and documentary consistency** of final clients on behalf of PSFs \\u2014 including FATCA/CRS tax forms" },
    { icon:'\ud83d\udcdd', texte:"Without understanding these rules, i-Hub cannot properly carry out its **verification** work or flag inconsistencies to PSFs" },
  ], aretenir:"International taxation concerns us because our PSF clients are subject to it. Our role: verify and flag. Not report." },

  { id:2, emoji:'\ud83c\udfe6', titre:"Who is actually subject to FATCA and CRS?", contenu:[
    { icon:'\u2705', texte:"**PSFs** (banks, funds, insurers) \\u2014 they are the **Reporting Financial Institutions** and report to the ACD" },
    { icon:'\u2705', texte:"**PSFs\u2019 final clients** \\u2014 if they are US nationals (FATCA) or foreign tax residents (CRS), their accounts are reportable" },
    { icon:'\u274c', texte:"**i-Hub is not** a Reporting Financial Institution \\u2014 it does not hold deposits, manage accounts or invest on behalf of third parties" },
    { icon:'\ud83d\udd17', texte:"i-Hub is a **support PSF** \\u2014 a PSF subcontractor that performs documentary verification tasks on instruction" },
  ], aretenir:"PSF = reporter. Final client = reportable. i-Hub = verifier. These three roles are distinct and do not overlap." },

  { id:3, emoji:'\ud83d\udcc4', titre:"i-Hub\u2019s exact role in the tax process", contenu:[
    { icon:'\ud83d\udd0d', texte:"i-Hub **verifies consistency** of tax forms (W-9, W-8BEN, CRS self-certifications) provided by PSFs\u2019 final clients" },
    { icon:'\ud83d\udea8', texte:"i-Hub **flags inconsistencies** to the PSF \\u2014 e.g. a W-8BEN filled by someone born in the US, or an unreported US address" },
    { icon:'\ud83d\udcce', texte:"i-Hub **transmits verified data** to the PSF \\u2014 the PSF then makes classification and reporting decisions" },
    { icon:'\ud83d\udeab', texte:"i-Hub does **not classify** final clients, does **not report** to the ACD, does **not decide** on action in doubtful cases" },
  ], aretenir:"Verify \u2260 Report. Flag \u2260 Decide. i-Hub is the PSF\u2019s eyes on the ground \\u2014 not its legal arm.", plusLoin:[
    { icon:'\ud83d\udcdd', texte:"The exact scope of i-Hub\u2019s verifications is **contractually defined** in the SLA signed with each PSF" },
    { icon:'\u26a0\ufe0f', texte:"Going beyond the SLA exposes i-Hub to **extended liability** not covered by the contract" },
    { icon:'\ud83e\udd1d', texte:"When in doubt about scope, i-Hub Compliance and the PSF contact clarify together before acting" },
  ]},

  { id:4, emoji:'\ud83d\udcdc', titre:"The SLA: what i-Hub checks and what it does not", contenu:[
    { icon:'\u2705', texte:"**What i-Hub checks** (examples): presence and consistency of a W-9 or W-8BEN, obvious US indicia, match between country of residence and TIN" },
    { icon:'\u274c', texte:"**What i-Hub does not check** (examples): fiscal accuracy of the TIN, overall legal compliance of the client, final FATCA classification" },
    { icon:'\ud83d\udcdc', texte:"Each **SLA** with a PSF precisely defines the list of items to verify and the reporting format" },
    { icon:'\ud83d\udea8', texte:"If an anomaly is outside scope, i-Hub **flags it anyway** \\u2014 even if not contractually required" },
  ], aretenir:"The SLA is i-Hub\u2019s bible. It defines exactly what is expected. No more, no less \\u2014 but always with the intent to flag any visible red flag." },

  { id:5, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:"FATCA: why the US created this law", contenu:[
    { icon:'\ud83d\udcb0', texte:"Before FATCA, many **US taxpayers** hid assets in foreign banks to avoid US taxation" },
    { icon:'\u26a1', texte:"In 2010, the US enacted **FATCA** to force global financial institutions to identify and report US accounts to the IRS" },
    { icon:'\ud83c\udf0d', texte:"The US specificity: the US taxes its citizens on their **worldwide income**, even if they live abroad \\u2014 hence the importance of identifying every US Person" },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:"Luxembourg signed a **Model 1 IGA** with the US in 2014: Luxembourg PSFs report to the ACD, which forwards to the IRS" },
  ], aretenir:"FATCA exists because the US taxes its citizens worldwide. Luxembourg PSFs must therefore identify Americans among their final clients." },

  { id:6, emoji:'\ud83c\udf0d', titre:"CRS: why the OECD created this standard", contenu:[
    { icon:'\ud83d\udcb8', texte:"Tax avoidance was global: residents of many countries hid assets in low-tax jurisdictions such as Luxembourg" },
    { icon:'\ud83e\udd1d', texte:"In 2014, the **OECD** created **CRS** to establish automatic information exchange between over 100 countries" },
    { icon:'\ud83c\udfe0', texte:"Unlike FATCA, CRS is based on **tax residency** (where the client lives), not nationality" },
    { icon:'\ud83d\udce4', texte:"Concretely: a French resident with a Luxembourg account \u2192 the Luxembourg PSF reports to the ACD \u2192 the ACD forwards to the French DGFiP" },
  ], aretenir:"CRS aims to eliminate tax havens by making foreign accounts transparent. Luxembourg PSFs are at the heart of the system." },

  { id:7, emoji:'\ud83e\udd1d', titre:"The actors: who does what in the chain", contenu:[
    { icon:'\ud83d\udc64', texte:"**PSF\u2019s final client**: completes the forms (W-9, W-8BEN, CRS self-certification) and declares their tax situation" },
    { icon:'\ud83c\udfe6', texte:"**PSF** (bank, fund\u2026): collects forms, classifies the client, reports to the ACD under its own responsibility" },
    { icon:'\ud83d\udd0d', texte:"**i-Hub** (support PSF): verifies consistency of forms on behalf of the PSF, within the SLA scope" },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:"**ACD** (Luxembourg): receives PSF declarations and forwards them to the relevant countries\u2019 tax authorities" },
  ], aretenir:"Final client \u2192 PSF \u2192 ACD: this is the reporting chain. i-Hub is upstream of the PSF, as verifier \\u2014 not reporter.", plusLoin:[
    { icon:'\ud83c\udfdb\ufe0f', texte:"The **IRS** (US) receives FATCA declarations via the ACD \\u2014 not directly from PSFs" },
    { icon:'\ud83c\udf0d', texte:"For CRS: the ACD forwards to the **tax authority** of the final client\u2019s country of residence" },
    { icon:'\ud83d\udd12', texte:"All these transmissions are **encrypted and secure** \\u2014 client tax data is confidential" },
  ]},

  { id:8, emoji:'\ud83d\udc64', titre:"Who is a \u2018final client\u2019 for i-Hub?", contenu:[
    { icon:'\ud83d\udc68\u200d\ud83d\udcbc', texte:"**Individuals** who hold an account with the PSF \\u2014 private clients, directors, shareholders of a client entity" },
    { icon:'\ud83c\udfe2', texte:"**Entities** (companies, funds, foundations) whose account or assets the PSF manages" },
    { icon:'\ud83d\udd17', texte:"**Beneficial owners** (UBOs) of entities \\u2014 their information may also appear in FATCA/CRS forms" },
    { icon:'\u26a0\ufe0f', texte:"i-Hub verifies information **transmitted by the PSF** \\u2014 it is not in direct contact with the final client unless specified in the SLA" },
  ], aretenir:"i-Hub\u2019s \u2018client\u2019 is the PSF. The \u2018final client\u2019 is the person or entity whose documents i-Hub checks \\u2014 an essential distinction." },

  { id:9, emoji:'\ud83d\udcb1', titre:"FATCA and CRS: two parallel systems", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**FATCA**: US-based, based on **nationality/citizenship** \\u2014 any US Person, wherever they live" },
    { icon:'\ud83c\udf0d', texte:"**CRS**: multilateral OECD, based on **tax residency** \\u2014 any foreign resident, regardless of nationality" },
    { icon:'\ud83d\udd04', texte:"Both apply **simultaneously**: a US citizen living in France is subject to FATCA (nationality) AND CRS (French residency)" },
    { icon:'\ud83d\udcdd', texte:"For i-Hub: the forms to verify differ (W-9/W-8BEN for FATCA, self-certification for CRS) but the logic is the same" },
  ], aretenir:"FATCA and CRS coexist. The same final client can trigger obligations under both systems \\u2014 i-Hub verifies both." },

  { id:10, emoji:'\ud83d\udcb2', titre:"QI: a 3rd system linked to US withholding", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**QI** = Qualified Intermediary \\u2014 optional status for foreign financial institutions dealing with **US-source income**" },
    { icon:'\ud83d\udcb0', texte:"Covers dividends and interest on US stocks/bonds held by PSFs\u2019 final clients" },
    { icon:'\ud83d\udd17', texte:"QI status allows applying **reduced rates** under US/Luxembourg tax treaties rather than the standard 30% withholding" },
    { icon:'\ud83d\udc41\ufe0f', texte:"For i-Hub: QI is generally managed directly by PSFs \\u2014 i-Hub may be involved in verifying related forms if specified in the SLA" },
  ], aretenir:"QI is complementary to FATCA. It is the PSF that decides to hold QI status and bears the obligations \\u2014 not i-Hub." },

  { id:11, emoji:'\ud83d\udccb', titre:"The key forms i-Hub verifies", contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**W-9**: completed by US Persons \\u2014 certifies US status and TIN (US tax number)" },
    { icon:'\ud83d\udcdd', texte:"**W-8BEN**: completed by non-US individuals \\u2014 certifies non-US status, valid 3 years" },
    { icon:'\ud83c\udfe2', texte:"**W-8BEN-E**: completed by non-US entities \\u2014 more complex, specifies the entity\u2019s FATCA category" },
    { icon:'\ud83c\udf0d', texte:"**CRS self-certification**: tax residency declaration \\u2014 mandatory for all new accounts since 2016" },
  ], aretenir:"These 4 forms are the core of i-Hub\u2019s verification work. Knowing them = understanding what we are looking for and checking." },

  { id:12, emoji:'\ud83d\udd0d', titre:"What i-Hub concretely checks", contenu:[
    { icon:'\u2705', texte:"**Form presence**: has the right form been provided for the type of final client?" },
    { icon:'\u2705', texte:"**Internal consistency**: is the information on the form consistent with itself (e.g. country of birth vs declared country of residence)?" },
    { icon:'\u2705', texte:"**External consistency**: does the form information match the other identity documents collected?" },
    { icon:'\u2705', texte:"**Visible indicia**: do elements visible in the file suggest undeclared US status or foreign residency?" },
  ], aretenir:"i-Hub verifies consistency \\u2014 not absolute fiscal accuracy. This work is essential for the PSF to report correctly.", plusLoin:[
    { icon:'\ud83d\udccc', texte:"The i-Hub **verification checklist** is defined in each PSF\u2019s SLA \\u2014 it may vary from one client to another" },
    { icon:'\ud83d\udea8', texte:"Any red flag detected must be **documented and reported** to the PSF, even if outside the SLA scope" },
    { icon:'\ud83d\udc68\u200d\u2696\ufe0f', texte:"When in doubt about what to check, Compliance clarifies with the PSF contact before acting" },
  ]},

  { id:13, emoji:'\ud83d\udea8', titre:"When to flag an inconsistency to the PSF?", contenu:[
    { icon:'\ud83d\udd34', texte:"**US birthplace** on a W-8BEN (non-US form) \\u2014 obvious contradiction to flag" },
    { icon:'\ud83d\udd34', texte:"**US address** or US phone number not mentioned in the tax documentation" },
    { icon:'\ud83d\udd34', texte:"**Missing TIN** without justification \\u2014 or TIN format not matching the declared country" },
    { icon:'\ud83d\udd34', texte:"**Expired form**: W-8BEN dated more than 3 years ago without renewal" },
    { icon:'\ud83d\udd34', texte:"**Cross-document inconsistency**: French passport but CRS self-certification stating German residency with no explanation" },
  ], aretenir:"When something does not add up between documents, flag it to the PSF. Do not decide. Do not classify. Document and alert." },

  { id:14, emoji:'\ud83d\udcb0', titre:"The stakes: why this matters for i-Hub", contenu:[
    { icon:'\u2696\ufe0f', texte:"If i-Hub makes a verification error that contributes to a PSF\u2019s FATCA/CRS breach, its **contractual liability** may be engaged" },
    { icon:'\ud83d\udd12', texte:"Final clients\u2019 tax data is **highly confidential** \\u2014 any leak may engage i-Hub\u2019s liability (GDPR + professional secrecy)" },
    { icon:'\ud83d\udcbc', texte:"The quality of i-Hub\u2019s verifications is a **commercial differentiator** \\u2014 PSFs choose a reliable and rigorous subcontractor" },
    { icon:'\ud83d\udc40', texte:"The CSSF monitors PSFs \\u2014 and may extend its audits to subcontractors like i-Hub in the event of a PSF breach" },
  ], aretenir:"Doing verification work well protects i-Hub legally, preserves the PSF relationship and guarantees service quality." },

  { id:15, emoji:'\ud83d\udc65', titre:"The 3 types of final clients to know", contenu:[
    { icon:'\ud83d\udc64', texte:"**Non-US individual** outside Luxembourg \\u2014 CRS may apply \\u2014 self-certification + TIN to verify" },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:"**US Person individual** \\u2014 FATCA applies \\u2014 W-9 to verify with TIN" },
    { icon:'\ud83c\udfe2', texte:"**Entity** (company, fund, holding) \\u2014 FATCA + CRS may apply depending on nature and shareholders \\u2014 W-8BEN-E or entity self-certification" },
  ], aretenir:"Three types, three logics. For each, i-Hub verifies that the right form is present and consistent with the final client\u2019s profile." },

  { id:16, emoji:'\ud83d\udd11', titre:"Professional secrecy and tax confidentiality", contenu:[
    { icon:'\ud83d\udd12', texte:"Final clients\u2019 tax information (nationality, residency, TIN) is covered by **PSF professional secrecy**" },
    { icon:'\ud83d\udee1\ufe0f', texte:"i-Hub, as subcontractor, is also subject to this **confidentiality obligation** \\u2014 this data cannot be shared outside the contractual scope" },
    { icon:'\ud83d\udcbb', texte:"**GDPR** also applies: any processing of tax data must respect the principles of minimisation and security" },
    { icon:'\ud83d\udcdd', texte:"Verified data is transmitted to the PSF via **secure channels** as specified in the SLA" },
  ], aretenir:"The tax data i-Hub processes is among the most sensitive. Its protection is both a legal and contractual obligation." },

  { id:17, emoji:'\ud83d\udd04', titre:"Updates: an ongoing process", contenu:[
    { icon:'\ud83d\udcc5', texte:"Forms have a **validity period**: W-8BEN expires after 3 years, CRS self-certification must be renewed on change" },
    { icon:'\ud83d\udea8', texte:"Any **change in the final client\u2019s situation** (relocation, marriage, new nationality) may change their tax status" },
    { icon:'\ud83d\udd14', texte:"i-Hub may receive from the PSF **requests for additional verification** when the PSF detects a change" },
    { icon:'\ud83d\udcce', texte:"The quality of **tracking and traceability** of verifications is essential: each verification must be dated, documented, archived" },
  ], aretenir:"International taxation is not a one-off exercise. i-Hub must be ready to carry out additional verifications throughout the life of the file." },

  { id:18, emoji:'\ud83c\udf93', titre:"What you must remember from this module", contenu:[
    { icon:'\ud83c\udfc6', texte:"**i-Hub verifies, the PSF reports** \\u2014 this distinction is fundamental and never changes" },
    { icon:'\ud83d\udcdc', texte:"**The SLA defines the scope** \\u2014 no more, no less. When in doubt, clarify with the PSF before acting" },
    { icon:'\ud83d\udea8', texte:"**Always flag red flags** \\u2014 even outside scope, if something does not add up, document and alert the PSF" },
    { icon:'\ud83d\udd12', texte:"**Confidentiality is absolute** \\u2014 final clients\u2019 tax data never leaves the contractual framework" },
  ], aretenir:"4 golden rules: verify (not report), respect the SLA, flag red flags, protect data. Everything else flows from this.", plusLoin:[
    { icon:'\ud83d\udcda', texte:"The following modules (FATCA, CRS, QI, forms) go deeper into each system \\u2014 this module is the foundation to keep in mind" },
    { icon:'\ud83d\udc68\u200d\u2696\ufe0f', texte:"For any question about i-Hub\u2019s role in a specific case, the Compliance team is available" },
    { icon:'\ud83d\udd17', texte:"The FATCA/CRS/QI glossary is available in the specific modules of the International Taxation theme" },
  ]},
]

const MATCHING_FR = [
  { sigle: 'PSF d\u00e9clarant', definition: 'Banque ou fonds qui reporte \u00e0 l\u2019ACD' },
  { sigle: 'i-Hub', definition: 'V\u00e9rifie la coh\u00e9rence documentaire pour le PSF' },
  { sigle: 'Client final', definition: 'Personne ou entit\u00e9 dont le compte est g\u00e9r\u00e9 par le PSF' },
  { sigle: 'SLA', definition: 'Contrat d\u00e9finissant le p\u00e9rim\u00e8tre des v\u00e9rifications d\u2019i-Hub' },
  { sigle: 'ACD', definition: 'Autorit\u00e9 luxembourgeoise qui centralise les d\u00e9clarations' },
  { sigle: 'FATCA', definition: 'Loi am\u00e9ricaine visant les US Persons \u00e0 l\u2019\u00e9tranger' },
  { sigle: 'CRS', definition: 'Standard OCDE bas\u00e9 sur la r\u00e9sidence fiscale' },
  { sigle: 'Red flag', definition: 'Incoh\u00e9rence documentaire \u00e0 signaler au PSF' },
  { sigle: 'W-9', definition: 'Formulaire rempli par une US Person' },
  { sigle: 'Autocertification', definition: 'D\u00e9claration de r\u00e9sidence fiscale (CRS)' },
]
const MATCHING_EN = [
  { sigle: 'Reporting PSF', definition: 'Bank or fund that reports to the ACD' },
  { sigle: 'i-Hub', definition: 'Verifies documentary consistency for the PSF' },
  { sigle: 'Final client', definition: 'Person or entity whose account is managed by the PSF' },
  { sigle: 'SLA', definition: 'Contract defining the scope of i-Hub\u2019s verifications' },
  { sigle: 'ACD', definition: 'Luxembourg authority that centralises declarations' },
  { sigle: 'FATCA', definition: 'US law targeting US Persons abroad' },
  { sigle: 'CRS', definition: 'OECD standard based on tax residency' },
  { sigle: 'Red flag', definition: 'Documentary inconsistency to flag to the PSF' },
  { sigle: 'W-9', definition: 'Form completed by a US Person' },
  { sigle: 'Self-certification', definition: 'Tax residency declaration (CRS)' },
]

const VF_FR = [
  { texte: "i-Hub d\u00e9clare directement \u00e0 l\u2019ACD luxembourgeoise", reponse: false, explication: "Non\u00a0! Ce sont les PSF (banques, fonds) qui d\u00e9clarent \u00e0 l\u2019ACD. i-Hub v\u00e9rifie les documents et transmet les donn\u00e9es v\u00e9rifi\u00e9es au PSF." },
  { texte: "i-Hub est soumis \u00e0 FATCA en tant qu\u2019institution financi\u00e8re", reponse: false, explication: "Non\u00a0! i-Hub est un PSF de support, pas une institution financi\u00e8re d\u00e9clarante. Il ne re\u00e7oit pas de d\u00e9p\u00f4ts et n\u2019investit pas pour des tiers." },
  { texte: "Le SLA d\u00e9finit pr\u00e9cis\u00e9ment ce qu\u2019i-Hub v\u00e9rifie pour chaque PSF", reponse: true, explication: "Exact\u00a0! Le SLA est le contrat qui d\u00e9limite le p\u00e9rim\u00e8tre des v\u00e9rifications. Chaque PSF peut avoir des exigences diff\u00e9rentes." },
  { texte: "Si i-Hub d\u00e9tecte un red flag hors p\u00e9rim\u00e8tre SLA, il peut l\u2019ignorer", reponse: false, explication: "Non\u00a0! Tout red flag visible doit \u00eatre signal\u00e9 au PSF, m\u00eame s\u2019il d\u00e9passe le p\u00e9rim\u00e8tre contractuel. C\u2019est une question de responsabilit\u00e9." },
  { texte: "Un Am\u00e9ricain r\u00e9sidant en France peut \u00eatre soumis \u00e0 la fois \u00e0 FATCA et au CRS", reponse: true, explication: "Exact\u00a0! FATCA s\u2019applique pour la nationalit\u00e9 am\u00e9ricaine, CRS pour la r\u00e9sidence fiscale en France. Les deux s\u2019appliquent simultan\u00e9ment." },
  { texte: "i-Hub classe les clients finaux des PSF selon leur cat\u00e9gorie FATCA", reponse: false, explication: "Non\u00a0! C\u2019est le PSF qui classe ses clients finaux. i-Hub v\u00e9rifie la coh\u00e9rence des formulaires mais ne prend pas de d\u00e9cision de classification." },
  { texte: "Les donn\u00e9es fiscales des clients finaux sont couvertes par le secret professionnel", reponse: true, explication: "Exact\u00a0! Ces donn\u00e9es sont parmi les plus sensibles. Elles ne peuvent pas sortir du cadre contractuel SLA." },
  { texte: "Le client d\u2019i-Hub, c\u2019est le PSF. Le client final, c\u2019est la personne dont i-Hub v\u00e9rifie les documents", reponse: true, explication: "Exact\u00a0! Cette distinction est fondamentale. i-Hub travaille pour le PSF, pas directement pour le client final." },
  { texte: "i-Hub peut d\u00e9cider seul de la classification FATCA d\u2019un client en cas d\u2019urgence", reponse: false, explication: "Non\u00a0! En cas de doute, i-Hub signale au PSF. La d\u00e9cision de classification appartient toujours au PSF." },
  { texte: "CRS est bas\u00e9 sur la nationalit\u00e9, FATCA sur la r\u00e9sidence fiscale", reponse: false, explication: "C\u2019est l\u2019inverse\u00a0! FATCA = nationalit\u00e9 am\u00e9ricaine. CRS = r\u00e9sidence fiscale. Une confusion fr\u00e9quente \u00e0 \u00e9viter." },
]
const VF_EN = [
  { texte: "i-Hub reports directly to the Luxembourg ACD", reponse: false, explication: "No! PSFs (banks, funds) report to the ACD. i-Hub verifies documents and transmits verified data to the PSF." },
  { texte: "i-Hub is subject to FATCA as a financial institution", reponse: false, explication: "No! i-Hub is a support PSF, not a Reporting Financial Institution. It does not hold deposits or invest for third parties." },
  { texte: "The SLA precisely defines what i-Hub verifies for each PSF", reponse: true, explication: "Correct! The SLA is the contract that delimits the verification scope. Each PSF may have different requirements." },
  { texte: "If i-Hub detects a red flag outside the SLA scope, it can ignore it", reponse: false, explication: "No! Any visible red flag must be flagged to the PSF, even if it exceeds the contractual scope. It is a matter of responsibility." },
  { texte: "A US citizen living in France can be subject to both FATCA and CRS", reponse: true, explication: "Correct! FATCA applies for US nationality, CRS for tax residency in France. Both apply simultaneously." },
  { texte: "i-Hub classifies PSFs\u2019 final clients according to their FATCA category", reponse: false, explication: "No! It is the PSF that classifies its final clients. i-Hub verifies form consistency but does not make classification decisions." },
  { texte: "Final clients\u2019 tax data is covered by professional secrecy", reponse: true, explication: "Correct! This data is among the most sensitive. It cannot leave the SLA contractual framework." },
  { texte: "i-Hub\u2019s client is the PSF. The final client is the person whose documents i-Hub checks", reponse: true, explication: "Correct! This distinction is fundamental. i-Hub works for the PSF, not directly for the final client." },
  { texte: "i-Hub can decide alone on the FATCA classification of a client in an emergency", reponse: false, explication: "No! When in doubt, i-Hub flags to the PSF. The classification decision always belongs to the PSF." },
  { texte: "CRS is based on nationality, FATCA on tax residency", reponse: false, explication: "That\u2019s the wrong way round! FATCA = US nationality. CRS = tax residency. A common confusion to avoid." },
]

const CAS_FR = [
  { situation: "Un PSF vous envoie le dossier d\u2019un client avec un W-8BEN (non-am\u00e9ricain) mais le passeport indique une naissance \u00e0 Chicago.", action: "Signaler l\u2019incoh\u00e9rence au PSF \\u2014 n\u00e9 aux USA + W-8BEN = red flag", options: ["Accepter le W-8BEN \\u2014 le client a sign\u00e9", "Signaler l\u2019incoh\u00e9rence au PSF \\u2014 n\u00e9 aux USA + W-8BEN = red flag", "Demander un W-9 directement au client final", "Classer comme US Person"], explication: "N\u00e9 \u00e0 Chicago + W-8BEN = contradiction flagrante. i-Hub signale au PSF. C\u2019est au PSF de demander des clarifications au client final." },
  { situation: "Un PSF demande \u00e0 i-Hub de d\u00e9clarer lui-m\u00eame les comptes am\u00e9ricains \u00e0 l\u2019ACD car il manque de ressources.", action: "Refuser \\u2014 la d\u00e9claration \u00e0 l\u2019ACD est la responsabilit\u00e9 exclusive du PSF", options: ["Accepter \u00e0 titre exceptionnel", "Refuser \\u2014 la d\u00e9claration \u00e0 l\u2019ACD est la responsabilit\u00e9 exclusive du PSF", "Transf\u00e9rer la demande \u00e0 l\u2019ACD directement", "Accepter si le SLA est modifi\u00e9"], explication: "i-Hub ne peut pas d\u00e9clarer \u00e0 l\u2019ACD \u00e0 la place du PSF. M\u00eame avec un SLA modifi\u00e9, cette responsabilit\u00e9 ne peut pas \u00eatre d\u00e9l\u00e9gu\u00e9e \u00e0 un PSF de support." },
  { situation: "Une v\u00e9rification r\u00e9v\u00e8le qu\u2019un W-8BEN date de 4 ans. Le SLA ne pr\u00e9voit pas de v\u00e9rification des dates.", action: "Signaler quand m\u00eame au PSF \\u2014 formulaire expir\u00e9 = red flag \u00e0 signaler", options: ["Ne rien faire \\u2014 hors p\u00e9rim\u00e8tre SLA", "Signaler quand m\u00eame au PSF \\u2014 formulaire expir\u00e9 = red flag \u00e0 signaler", "Renouveler le W-8BEN directement", "Cl\u00f4turer le dossier"], explication: "M\u00eame hors SLA, un formulaire expir\u00e9 est un red flag visible. i-Hub le signale au PSF qui d\u00e9cide de la suite." },
  { situation: "Un PSF demande \u00e0 i-Hub de v\u00e9rifier si le NIF d\u2019un client fran\u00e7ais est fiscalement valide en France.", action: "Pr\u00e9ciser que cette v\u00e9rification d\u00e9passe le p\u00e9rim\u00e8tre d\u2019i-Hub", options: ["V\u00e9rifier sur le site des imp\u00f4ts fran\u00e7ais", "Accepter si pr\u00e9vu dans le SLA", "Pr\u00e9ciser que cette v\u00e9rification d\u00e9passe le p\u00e9rim\u00e8tre d\u2019i-Hub", "Ignorer la demande"], explication: "i-Hub v\u00e9rifie la coh\u00e9rence des formats \\u2014 pas la validit\u00e9 fiscale aupr\u00e8s des administrations \u00e9trang\u00e8res. C\u2019est hors p\u00e9rim\u00e8tre." },
  { situation: "Lors d\u2019une v\u00e9rification CRS, i-Hub constate que le NIF fourni par le client a un format incompatible avec le pays d\u00e9clar\u00e9.", action: "Signaler l\u2019incoh\u00e9rence de format au PSF", options: ["Accepter \\u2014 le client a rempli le formulaire", "Signaler l\u2019incoh\u00e9rence de format au PSF", "Corriger le NIF directement", "Contacter le client final"], explication: "Un format de NIF incompatible avec le pays est une incoh\u00e9rence \u00e0 signaler. i-Hub ne corrige pas \\u2014 il signale au PSF qui contacte le client." },
]
const CAS_EN = [
  { situation: "A PSF sends you a client file with a W-8BEN (non-US) but the passport shows a birthplace of Chicago.", action: "Flag the inconsistency to the PSF \\u2014 born in US + W-8BEN = red flag", options: ["Accept the W-8BEN \\u2014 the client signed it", "Flag the inconsistency to the PSF \\u2014 born in US + W-8BEN = red flag", "Request a W-9 directly from the final client", "Classify as US Person"], explication: "Born in Chicago + W-8BEN = obvious contradiction. i-Hub flags to the PSF. It is up to the PSF to seek clarification from the final client." },
  { situation: "A PSF asks i-Hub to report US accounts to the ACD directly as it lacks resources.", action: "Refuse \\u2014 ACD reporting is the exclusive responsibility of the PSF", options: ["Accept on an exceptional basis", "Refuse \\u2014 ACD reporting is the exclusive responsibility of the PSF", "Forward the request to the ACD directly", "Accept if the SLA is amended"], explication: "i-Hub cannot report to the ACD on behalf of the PSF. Even with an amended SLA, this responsibility cannot be delegated to a support PSF." },
  { situation: "A verification reveals that a W-8BEN is 4 years old. The SLA does not include date verification.", action: "Flag to the PSF anyway \\u2014 expired form = red flag to report", options: ["Do nothing \\u2014 outside SLA scope", "Flag to the PSF anyway \\u2014 expired form = red flag to report", "Renew the W-8BEN directly", "Close the file"], explication: "Even outside the SLA, an expired form is a visible red flag. i-Hub flags it to the PSF, who decides the next steps." },
  { situation: "A PSF asks i-Hub to verify whether a French client\u2019s TIN is fiscally valid in France.", action: "Clarify that this verification is outside i-Hub\u2019s scope", options: ["Check on the French tax authority website", "Accept if specified in the SLA", "Clarify that this verification is outside i-Hub\u2019s scope", "Ignore the request"], explication: "i-Hub verifies format consistency \\u2014 not fiscal validity with foreign administrations. This is outside scope." },
  { situation: "During a CRS verification, i-Hub notices that the TIN format provided by the client is incompatible with the declared country.", action: "Flag the format inconsistency to the PSF", options: ["Accept \\u2014 the client completed the form", "Flag the format inconsistency to the PSF", "Correct the TIN directly", "Contact the final client"], explication: "A TIN format incompatible with the declared country is an inconsistency to flag. i-Hub does not correct \\u2014 it flags to the PSF, who contacts the client." },
]

export default function ModuleFiscaliteGrandsPrincipes() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN
  const C = '#e07b39'



  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setPlusLoinOpen(false) }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.push('/')} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#ffffff',fontWeight:'700',fontSize:'16px'}}>\ud83c\udf10 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          <button onClick={()=>switchLang('fr')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='fr'?C:'transparent',color:'white',transition:'all 0.2s'}}>\ud83c\uddeb\ud83c\uddf7 FR</button>
          <button onClick={()=>switchLang('en')} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang==='en'?C:'transparent',color:'white',transition:'all 0.2s'}}>\ud83c\uddec\ud83c\udde7 EN</button>
        </div>

      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>\ud83c\udf10</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'18px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'32px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=>(
            <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}>
              <span style={{color:C,fontWeight:'700'}}>\u2713</span>
              <span style={{color:'#4b5563',fontSize:'15px'}}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'32px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'\ud83d\udcd6'},{label:t.time,icon:'\u23f1\ufe0f'}].map((b,i)=>(
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
                <span style={{fontSize:'18px'}}>\ud83d\udca1</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
              {(fiche as any).plusLoin && (
                <div style={{marginTop:'12px'}}>
                  <button onClick={()=>setPlusLoinOpen(o=>!o)} style={{width:'100%',padding:'12px 16px',background:plusLoinOpen?C:'white',border:\`1.5px solid \${C}\`,borderRadius:'10px',color:plusLoinOpen?'white':C,cursor:'pointer',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'}}>
                    <span>{t.goFurther}</span><span style={{transition:'transform 0.3s',transform:plusLoinOpen?'rotate(180deg)':'rotate(0deg)',display:'inline-block'}}>\u25be</span>
                  </button>
                  {plusLoinOpen && (
                    <div style={{background:\`\${C}08\`,border:\`1px solid \${C}25\`,borderRadius:'0 0 10px 10px',padding:'16px',marginTop:'-4px',borderTop:'none'}}>
                      {((fiche as any).plusLoin as {icon:string,texte:string}[]).map((item,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:i<(fiche as any).plusLoin.length-1?\`1px solid \${C}20\`:'none'}}>
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
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('resultat')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700',boxShadow:\`0 4px 16px \${C}40\`}}>
              {ficheIndex<FICHES.length-1?\`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) \u2192\`:t.finBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'560px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'80px',marginBottom:'20px'}}>🎓</div>
        <h2 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',margin:'0 0 12px'}}>{t.resultTitle}</h2>
        <p style={{color:'#4b5563',fontSize:'16px',marginBottom:'32px',lineHeight:1.6}}>{t.resultSub}</p>
        <div style={{background:'white',borderRadius:'16px',padding:'28px',border:\`2px solid \${C}30\`,marginBottom:'24px',boxShadow:\`0 4px 20px \${C}10\`}}>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {[lang==='fr'?'i-Hub vérifie — le PSF déclare':'i-Hub verifies — the PSF reports',
              lang==='fr'?'Le SLA définit le périmètre':'The SLA defines the scope',
              lang==='fr'?'Tout red flag se signale':'Always flag red flags',
              lang==='fr'?'La confidentialité est absolue':'Confidentiality is absolute',
            ].map((rule,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',background:\`\${C}08\`,borderRadius:'10px',border:\`1px solid \${C}20\`}}>
                <span style={{color:C,fontWeight:'800',fontSize:'18px'}}>{i+1}</span>
                <span style={{fontSize:'15px',fontWeight:'600',color:'#374151'}}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
          <button onClick={()=>router.push('/')} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.backHome}</button>
          <button onClick={()=>{setFicheIndex(0);setPlusLoinOpen(false);setPhase('intro')}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
`, "utf8");