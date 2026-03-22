const fs = require('fs');
const PINK = '#e91e8c';

fs.mkdirSync('app/modules/aml-kyc-nos-clients', { recursive: true });
fs.writeFileSync('app/modules/aml-kyc-nos-clients/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

const C = '${PINK}'

const UI = {
  fr: {
    title: 'AML/KYC pour nos clients PSF',
    subtitle: 'Les obligations r\u00e9glementaires d\u2019i-Hub vis-\u00e0-vis de ses propres clients',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Pourquoi i-Hub a ses propres obligations AML/CTF r\u00e9glementaires',
      'La diff\u00e9rence entre obligations contractuelles et r\u00e9glementaires',
      'Ce qu\u2019i-Hub doit surveiller sur ses propres clients PSF',
      'Comment la plateforme unique cr\u00e9e un risque d\u2019interf\u00e9rence',
      'Les contr\u00f4les AML que i-Hub applique \u00e0 ses propres clients',
      'La vigilance \u00e0 exercer lors de toute modification de la plateforme',
    ],
    fiches: '16 fiches', time: '\u223c15 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    toRetain: '\u00c0 RETENIR',
    home: '\u2190 Accueil',
    finTitle: 'Les 4 r\u00e8gles cl\u00e9s \u2014 AML/KYC de nos propres clients',
    finSub: '\u00c0 retenir absolument',
    backHome: '\u2190 Retour aux modules', restart: '\ud83d\udd04 Recommencer',
  },
  en: {
    title: 'AML/KYC for our PSF clients',
    subtitle: 'i-Hub\u2019s own regulatory AML/CTF obligations towards its clients',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'Why i-Hub has its own regulatory AML/CTF obligations',
      'The difference between contractual and regulatory obligations',
      'What i-Hub must monitor about its own PSF clients',
      'How the shared platform creates an interference risk',
      'The AML controls i-Hub applies to its own clients',
      'The vigilance required when modifying the platform',
    ],
    fiches: '16 cards', time: '\u223c15 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    toRetain: 'KEY TAKEAWAY',
    home: '\u2190 Home',
    finTitle: '4 Key Rules \u2014 AML/KYC of our own clients',
    finSub: 'Essential takeaways',
    backHome: '\u2190 Back to modules', restart: '\ud83d\udd04 Restart',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83c\udfe6', titre:'i-Hub a ses propres obligations AML \u2014 pas seulement contractuelles', contenu:[
    { icon:'\ud83d\udcdc', texte:'i-Hub est un **PSF de support** agr\u00e9\u00e9 par la CSSF \u2014 \u00e0 ce titre, il est soumis aux m\u00eames obligations AML/CTF r\u00e9glementaires que ses clients PSF' },
    { icon:'\ud83d\udd04', texte:'Double dimension\u00a0: i-Hub g\u00e8re les obligations **contractuelles** envers ses clients (SLA) ET ses propres obligations **r\u00e9glementaires** envers la CSSF' },
    { icon:'\u26a0\ufe0f', texte:'Ces deux dimensions sont ind\u00e9pendantes\u00a0: m\u00eame si un PSF client ne demande rien de sp\u00e9cifique dans son SLA, i-Hub a des obligations l\u00e9gales sur ses propres clients' },
    { icon:'\ud83d\udd0d', texte:'Concr\u00e8tement\u00a0: i-Hub doit faire du KYC sur ses propres clients PSF, les screener, les surveiller \u2014 tout comme un PSF le fait pour ses clients finaux' },
  ], aretenir:'i-Hub = PSF de support soumis \u00e0 la r\u00e9glementation AML. Ses obligations vis-\u00e0-vis de ses propres clients PSF sont r\u00e9glementaires, pas seulement contractuelles.' },

  { id:2, emoji:'\ud83d\udd04', titre:'Contractuel vs r\u00e9glementaire\u00a0: la diff\u00e9rence essentielle', contenu:[
    { icon:'\ud83d\udcdc', texte:'**Obligation contractuelle** (SLA)\u00a0: ce que i-Hub s\u2019engage \u00e0 faire pour son client PSF, d\u00e9fini dans le contrat \u2014 peut varier d\u2019un client \u00e0 l\u2019autre' },
    { icon:'\ud83c\udfe6', texte:'**Obligation r\u00e9glementaire** (CSSF/loi 2004)\u00a0: ce que i-Hub DOIT faire sur ses propres clients, impos\u00e9 par la loi \u2014 s\u2019applique \u00e0 tous les clients sans exception' },
    { icon:'\u26a0\ufe0f', texte:'Un client PSF peut demander z\u00e9ro service AML dans son SLA \u2014 i-Hub doit quand m\u00eame faire son propre KYC sur ce client et le monitorer' },
    { icon:'\ud83d\udccc', texte:'La CSSF peut auditer i-Hub sur la qualit\u00e9 de sa surveillance de ses propres clients \u2014 ind\u00e9pendamment de ce que les SLA pr\u00e9voient' },
  ], aretenir:'SLA = ce qu\u2019on fait pour le client. R\u00e8glementation = ce qu\u2019on fait sur le client. Les deux existent en parall\u00e8le et sont ind\u00e9pendants.' },

  { id:3, emoji:'\ud83d\udc64', titre:'KYC de nos propres clients PSF', contenu:[
    { icon:'\ud83d\udc64', texte:'i-Hub doit **identifier et v\u00e9rifier** l\u2019identit\u00e9 de chaque client PSF avant d\u2019entrer en relation avec lui' },
    { icon:'\ud83d\udcdc', texte:'Documents \u00e0 collecter\u00a0: statuts de la soci\u00e9t\u00e9 PSF, extrait de registre, identification des dirigeants, agrément CSSF (ou \u00e9quivalent)' },
    { icon:'\ud83d\udc64', texte:'Identification des **UBO** du PSF client\u00a0: qui d\u00e9tient le PSF ? Qui exerce le contr\u00f4le r\u00e9el ? Ces personnes physiques doivent \u00eatre identifi\u00e9es' },
    { icon:'\ud83d\udcb5', texte:'**Source des fonds**\u00a0: comprendre d\u2019o\u00f9 proviennent les honoraires et r\u00e9mun\u00e9rations que verse le PSF \u00e0 i-Hub' },
  ], aretenir:'i-Hub fait du KYC sur ses propres clients PSF\u00a0: statuts, dirigeants, UBO, agr\u00e9ment. Tout comme un PSF le fait pour ses propres clients finaux.' },

  { id:4, emoji:'\ud83d\udcca', titre:'Scoring de risque de nos propres clients', contenu:[
    { icon:'\ud83d\udcca', texte:'Chaque client PSF doit se voir attribuer un **niveau de risque AML** par i-Hub\u00a0: faible, moyen, \u00e9lev\u00e9' },
    { icon:'\ud83d\udd34', texte:'Facteurs augmentant le risque\u00a0: PSF actif dans des juridictions \u00e0 risque, clients finaux \u00e0 risque \u00e9lev\u00e9, structure actionnariale complexe, historique de probl\u00e8mes AML' },
    { icon:'\ud83d\udd04', texte:'Le scoring est **r\u00e9vis\u00e9 p\u00e9riodiquement** \u2014 un PSF qui change d\u2019actionnaire ou qui \u00e9tend ses activit\u00e9s peut voir son niveau de risque \u00e9voluer' },
    { icon:'\ud83d\udd0d', texte:'Le niveau de risque d\u2019un client PSF influence le niveau de surveillance que i-Hub exerce sur lui et la fr\u00e9quence de r\u00e9vision du dossier' },
  ], aretenir:'i-Hub score ses clients PSF comme les PSF scorent leurs clients finaux. Risque \u00e9lev\u00e9 = surveillance accrue. R\u00e9vision p\u00e9riodique obligatoire.' },

  { id:5, emoji:'\ud83c\udfaf', titre:'Name Screening de nos propres clients', contenu:[
    { icon:'\ud83c\udfaf', texte:'Les clients PSF et leurs dirigeants/UBO doivent \u00eatre **screen\u00e9s contre les listes de sanctions** (ONU, UE, OFAC) avant entr\u00e9e en relation et en continu' },
    { icon:'\ud83d\udd04', texte:'Le screening continu est particulièrement important\u00a0: un dirigeant d\u2019un PSF client peut \u00eatre sanctionn\u00e9 apr\u00e8s la signature du contrat' },
    { icon:'\ud83d\udea8', texte:'Un match confirm\u00e9 sur un client PSF = escalade imm\u00e9diate \u00e0 la direction d\u2019i-Hub + possible STR \u00e0 la CRF' },
    { icon:'\ud83d\udccc', texte:'i-Hub ne peut pas continuer \u00e0 travailler pour un PSF dont un dirigeant est sanctionn\u00e9 sans prendre de mesures imm\u00e9diates' },
  ], aretenir:'Screening des clients PSF + leurs dirigeants + leurs UBO. Continu. Match = escalade direction i-Hub + possible STR. Pas de d\u00e9lai.' },

  { id:6, emoji:'\ud83d\udcc8', titre:'Surveillance des transactions et honoraires', contenu:[
    { icon:'\ud83d\udcc8', texte:'i-Hub doit surveiller les **mouvements financiers** de ses clients PSF\u00a0: honoraires re\u00e7us, modalit\u00e9s de paiement, \u00e9volutions inhabituelles' },
    { icon:'\u26a0\ufe0f', texte:'Signaux d\u2019alerte\u00a0: paiements en esp\u00e8ces ou cryptomonnaies non justifi\u00e9s, virements depuis des pays \u00e0 risque, montants tr\u00e8s sup\u00e9rieurs aux contrats sign\u00e9s' },
    { icon:'\ud83d\udcb0', texte:'Un PSF client qui paie depuis un compte dans une juridiction \u00e0 risque non mentionne dans le KYC initial = anomalie \u00e0 signaler en interne' },
    { icon:'\ud83d\udcce', texte:'Ces observations sont document\u00e9es dans le dossier AML du client PSF et font l\u2019objet d\u2019une revue p\u00e9riodique' },
  ], aretenir:'Surveiller les honoraires re\u00e7us des PSF clients\u00a0: montant, provenance, modalit\u00e9s. Toute anomalie docum\u00e9t\u00e9e et examin\u00e9e.' },

  { id:7, emoji:'\ud83d\udd04', titre:'R\u00e9vision p\u00e9riodique des dossiers clients PSF', contenu:[
    { icon:'\ud83d\udd04', texte:'Les dossiers KYC des clients PSF doivent \u00eatre **r\u00e9vis\u00e9s r\u00e9guli\u00e8rement** \u2014 fr\u00e9quence selon le niveau de risque attribu\u00e9' },
    { icon:'\ud83d\udcc5', texte:'Changements qui d\u00e9clenchent une r\u00e9vision imm\u00e9diate\u00a0: changement de dirigeant, nouveau propri\u00e9taire du PSF, expansion vers de nouvelles activit\u00e9s ou juridictions' },
    { icon:'\ud83d\udcdd', texte:'La r\u00e9vision v\u00e9rifie\u00a0: documents toujours valides, dirigeants inchang\u00e9s, screening \u00e0 jour, profil de risque toujours ad\u00e9quat' },
    { icon:'\ud83d\udcbc', texte:'Un PSF qui ne r\u00e9pond pas aux demandes de mise \u00e0 jour de son dossier KYC = signal d\u2019alerte potentiel' },
  ], aretenir:'Dossiers PSF clients = KYC vivants, pas statiques. R\u00e9vision p\u00e9riodique obligatoire. Changement de dirigeant = r\u00e9vision imm\u00e9diate.' },

  { id:8, emoji:'\u26a0\ufe0f', titre:'La DDR pour nos clients PSF \u00e0 risque \u00e9lev\u00e9', contenu:[
    { icon:'\ud83d\udd34', texte:'Certains clients PSF n\u00e9cessitent une **Due Diligence Renforc\u00e9e** de la part d\u2019i-Hub\u00a0: PSF actif dans des pays \u00e0 risque, structure actionnariale complexe, dirigeant PPE' },
    { icon:'\ud83d\udcdc', texte:'En DDR\u00a0: documents suppl\u00e9mentaires sur les dirigeants, organigramme complet jusqu\u2019aux UBO, justification de la source des fonds du PSF' },
    { icon:'\ud83d\udea8', texte:'Un PSF client dont un UBO est une PPE = DDR automatique pour i-Hub, ind\u00e9pendamment du niveau de service pr\u00e9vu dans le SLA' },
    { icon:'\ud83d\udc4f', texte:'Cette DDR est en plus des obligations contractuelles \u2014 elle peut conduire i-Hub \u00e0 refuser ou \u00e0 mettre fin \u00e0 une relation client en cas de risque inacceptable' },
  ], aretenir:'DDR sur clients PSF \u00e0 risque \u00e9lev\u00e9\u00a0: PPE, pays \u00e0 risque, structures opaques. Ind\u00e9pendante du SLA. Peut aller jusqu\u2019au refus de la relation.' },

  { id:9, emoji:'\ud83d\udcbb', titre:'La plateforme unique\u00a0: une vigilance particuli\u00e8re', contenu:[
    { icon:'\ud83d\udcbb', texte:'La **m\u00eame plateforme** g\u00e8re \u00e0 la fois\u00a0: (1) les donn\u00e9es des clients finaux des PSF que i-Hub traite, et (2) les donn\u00e9es de surveillance AML des PSF clients eux-m\u00eames' },
    { icon:'\u26a0\ufe0f', texte:'Risque sp\u00e9cifique\u00a0: toute **modification de la plateforme** (mise \u00e0 jour, nouvelle fonctionnalit\u00e9, correction de bug) peut impacter les deux dimensions simultan\u00e9ment' },
    { icon:'\ud83d\udd0d', texte:'Exemple\u00a0: une modification d\u2019un filtre de screening peut \u00e0 la fois alt\u00e9rer les contr\u00f4les des clients finaux des PSF ET la surveillance des PSF eux-m\u00eames' },
    { icon:'\ud83d\udea8', texte:'Toute modification de la plateforme doit \u00eatre **test\u00e9e et valid\u00e9e** pour ses impacts sur les deux niveaux de surveillance avant mise en production' },
  ], aretenir:'Plateforme unique = double exposition. Modifier la plateforme peut impacter la surveillance r\u00e9glementaire d\u2019i-Hub sur ses propres clients. Tester les deux niveaux avant tout d\u00e9ploiement.' },

  { id:10, emoji:'\ud83d\udd27', titre:'Gestion des modifications de la plateforme', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Identifier l\u2019impact double**\u00a0: toute modification doit \u00eatre \u00e9valu\u00e9e pour son impact sur (a) les services fournis aux PSF et (b) la surveillance des PSF clients' },
    { icon:'2\ufe0f\u20e3', texte:'**Tester les deux niveaux**\u00a0: les tests de recette doivent couvrir les cas d\u2019usage des clients finaux ET les cas de surveillance des PSF clients' },
    { icon:'3\ufe0f\u20e3', texte:'**Documenter les changements**\u00a0: toute modification est trac\u00e9e avec son impact \u00e9valu\u00e9 sur la conformit\u00e9 AML des deux niveaux' },
    { icon:'4\ufe0f\u20e3', texte:'**Alerter la Compliance**\u00a0: tout doute sur l\u2019impact d\u2019une modification sur la surveillance r\u00e9glementaire = escalade imm\u00e9diate avant d\u00e9ploiement' },
  ], aretenir:'Modifier la plateforme = processus rigoureux. Double test. Documentation. Compliance alert\u00e9e avant tout d\u00e9ploiement impactant la surveillance.' },

  { id:11, emoji:'\ud83d\udc65', titre:'Les PPE parmi nos clients PSF', contenu:[
    { icon:'\ud83d\udc65', texte:'Si un dirigeant ou un UBO d\u2019un PSF client est une PPE, i-Hub doit appliquer une **DDR sur ce client** \u2014 pas seulement v\u00e9rifier les documents transmis pour les clients finaux' },
    { icon:'\ud83d\udd04', texte:'La surveillance PPE est **continue**\u00a0: un dirigeant devient PPE apr\u00e8s la signature du contrat si nommer \u00e0 une fonction politique \u2014 i-Hub doit le d\u00e9tecter' },
    { icon:'\ud83d\udcf0', texte:'Le monitoring des m\u00e9dias adverses sur les dirigeants de nos clients PSF est une obligation r\u00e9glementaire d\u2019i-Hub \u2014 pas seulement une option contractuelle' },
    { icon:'\ud83d\udea8', texte:'PPE d\u00e9tect\u00e9 parmi nos clients\u00a0: information imm\u00e9diate de la direction d\u2019i-Hub + d\u00e9clenchement DDR + examen de la relation contractuelle' },
  ], aretenir:'PPE parmi nos clients = DDR imm\u00e9diate. Monitoring continu des dirigeants des PSF clients. Obligation r\u00e9glementaire d\u2019i-Hub, pas optionnelle.' },

  { id:12, emoji:'\ud83c\udf0d', titre:'Les PSF clients dans des pays \u00e0 risque', contenu:[
    { icon:'\ud83c\udf0d', texte:'Un PSF client dont le si\u00e8ge social, les actionnaires ou l\u2019activit\u00e9 principale sont li\u00e9s \u00e0 un **pays \u00e0 risque GAFI** n\u00e9cessite une DDR de la part d\u2019i-Hub' },
    { icon:'\ud83d\udccc', texte:'Le fait que le PSF soit agr\u00e9\u00e9 par la CSSF ne dispense pas i-Hub de son propre KYC \u2014 l\u2019agr\u00e9ment CSSF r\u00e9duit le risque mais ne l\u2019\u00e9limine pas' },
    { icon:'\ud83d\udd04', texte:'Un PSF agr\u00e9\u00e9 dont les actionnaires changent et int\u00e8grent des int\u00e9r\u00eats d\u2019un pays \u00e0 risque = mise \u00e0 jour imm\u00e9diate du dossier KYC + recalcul du risque' },
    { icon:'\ud83d\udd0d', texte:'i-Hub surveille les \u00e9volutions de structure de ses clients PSF\u00a0: changement de propri\u00e9taire = \u00e9l\u00e9ment d\u00e9clencheur d\u2019une r\u00e9vision' },
  ], aretenir:'Agr\u00e9ment CSSF \u2260 dispense de KYC. i-Hub surveille les \u00e9volutions de structure de ses clients. Nouveau propri\u00e9taire \u00e0 risque = r\u00e9vision imm\u00e9diate.' },

  { id:13, emoji:'\ud83d\udea8', titre:'La d\u00e9claration de soup\u00e7on (STR) sur un client PSF', contenu:[
    { icon:'\ud83d\udea8', texte:'Si i-Hub d\u00e9tecte un soup\u00e7on de blanchiment ou de financement du terrorisme chez un **client PSF**, il a l\u2019obligation de d\u00e9clarer \u00e0 la CRF' },
    { icon:'\ud83d\uded1', texte:'L\u2019**interdiction de divulgation (tipping off)** s\u2019applique\u00a0: i-Hub ne peut pas informer le PSF qu\u2019une STR a \u00e9t\u00e9 faite \u00e0 son sujet' },
    { icon:'\ud83d\udcbc', texte:'Situation d\u00e9licate\u00a0: continuer \u00e0 travailler pour un PSF sur lequel une STR a \u00e9t\u00e9 d\u00e9pos\u00e9e \u2014 proc\u00e9dure interne \u00e0 suivre, direction i-Hub imm\u00e9diatement impliqu\u00e9e' },
    { icon:'\ud83d\udd12', texte:'La STR est un acte grave et confidentiel \u2014 jamais discut\u00e9e avec le client concern\u00e9, ni avec des coll\u00e8gues non habilit\u00e9s' },
  ], aretenir:'i-Hub peut faire une STR sur un de ses propres clients PSF. Tipping off interdit. Direction imm\u00e9diatement impliqu\u00e9e. Strict secret.' },

  { id:14, emoji:'\ud83d\udcce', titre:'Documentation et tra\u00e7abilit\u00e9 de la surveillance', contenu:[
    { icon:'\ud83d\udcce', texte:'Tout le processus KYC/AML d\u2019i-Hub sur ses propres clients PSF doit \u00eatre **document\u00e9 et archiv\u00e9**\u00a0: dossiers KYC, screenings, r\u00e9visions, incidents' },
    { icon:'\ud83d\udcbc', texte:'La CSSF peut demander \u00e0 auditer ces dossiers \u00e0 tout moment \u2014 i-Hub doit pouvoir d\u00e9montrer sa diligence r\u00e9glementaire' },
    { icon:'\ud83d\udcc5', texte:'Conservation minimale\u00a0: **5 ans** apr\u00e8s la fin de la relation avec le PSF client' },
    { icon:'\ud83d\udcbb', texte:'Ces dossiers sont s\u00e9par\u00e9s des dossiers des clients finaux des PSF \u2014 deux niveaux distincts dans la plateforme' },
  ], aretenir:'Dossiers KYC/AML des clients PSF\u00a0: archiv\u00e9s, auditables, s\u00e9par\u00e9s des clients finaux. 5 ans minimum apr\u00e8s fin de relation.' },

  { id:15, emoji:'\ud83d\udd12', titre:'S\u00e9paration des niveaux sur la plateforme', contenu:[
    { icon:'\ud83d\udd12', texte:'La plateforme doit maintenir une **s\u00e9paration claire** entre\u00a0: (a) les donn\u00e9es KYC des clients finaux des PSF et (b) les dossiers de surveillance AML des PSF clients eux-m\u00eames' },
    { icon:'\ud83d\udd0d', texte:'Un employ\u00e9 travaillant sur le dossier d\u2019un client final d\u2019un PSF ne doit pas avoir acc\u00e8s automatique au dossier AML interne du PSF lui-m\u00eame' },
    { icon:'\u26a0\ufe0f', texte:'Toute modification de la s\u00e9paration des niveaux (droits d\u2019acc\u00e8s, segmentation des donn\u00e9es) doit \u00eatre valid\u00e9e par la Compliance et la direction' },
    { icon:'\ud83d\udcc5', texte:'Les audits CSSF peuvent v\u00e9rifier cette s\u00e9paration \u2014 une confusion entre les deux niveaux serait une d\u00e9faillance grave' },
  ], aretenir:'Deux niveaux = deux espaces s\u00e9par\u00e9s sur la plateforme. La confusion entre clients finaux et clients PSF est une d\u00e9faillance grave.' },

  { id:16, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: les obligations AML d\u2019i-Hub sur ses propres clients', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**KYC complet** sur chaque client PSF\u00a0: statuts, dirigeants, UBO, agr\u00e9ment, scoring de risque' },
    { icon:'2\ufe0f\u20e3', texte:'**Screening continu** des PSF clients et de leurs dirigeants/UBO contre les listes de sanctions' },
    { icon:'3\ufe0f\u20e3', texte:'**Surveillance des mouvements financiers** (honoraires) et des \u00e9volutions de structure des PSF clients' },
    { icon:'4\ufe0f\u20e3', texte:'**Plateforme unique** = risque d\u2019interf\u00e9rence\u00a0: toute modification doit \u00eatre test\u00e9e sur les deux niveaux avant d\u00e9ploiement' },
    { icon:'5\ufe0f\u20e3', texte:'**STR possible** sur un client PSF si soup\u00e7on confirm\u00e9 \u2014 direction i-Hub imm\u00e9diatement impliqu\u00e9e, tipping off interdit' },
  ], aretenir:'i-Hub surveille ses clients PSF comme les PSF surveillent leurs clients finaux. M\u00eame r\u00e8glementation, m\u00eame rigueur, m\u00eame tra\u00e7abilit\u00e9.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83c\udfe6', titre:'i-Hub has its own AML obligations \u2014 not just contractual', contenu:[
    { icon:'\ud83d\udcdc', texte:'i-Hub is a **support PSF** approved by the CSSF \u2014 as such, it is subject to the same regulatory AML/CTF obligations as its PSF clients' },
    { icon:'\ud83d\udd04', texte:'Dual dimension: i-Hub manages **contractual** obligations to its clients (SLA) AND its own **regulatory** obligations to the CSSF' },
    { icon:'\u26a0\ufe0f', texte:'These two dimensions are independent: even if a PSF client requests nothing specific in its SLA, i-Hub has legal obligations regarding its own clients' },
    { icon:'\ud83d\udd0d', texte:'In practice: i-Hub must perform KYC on its own PSF clients, screen them, monitor them \u2014 just as a PSF does for its final clients' },
  ], aretenir:'i-Hub = regulated support PSF. Its obligations towards its own PSF clients are regulatory, not just contractual.' },
  { id:2, emoji:'\ud83d\udd04', titre:'Contractual vs regulatory: the essential difference', contenu:[
    { icon:'\ud83d\udcdc', texte:'**Contractual obligation** (SLA): what i-Hub commits to do for its PSF client, defined in the contract \u2014 may vary between clients' },
    { icon:'\ud83c\udfe6', texte:'**Regulatory obligation** (CSSF/2004 Law): what i-Hub MUST do regarding its own clients, imposed by law \u2014 applies to all clients without exception' },
    { icon:'\u26a0\ufe0f', texte:'A PSF client may request zero AML services in its SLA \u2014 i-Hub must still perform its own KYC on that client and monitor it' },
    { icon:'\ud83d\udccc', texte:'The CSSF can audit i-Hub on the quality of its surveillance of its own clients \u2014 independently of what the SLAs provide' },
  ], aretenir:'SLA = what we do for the client. Regulation = what we do regarding the client. Both exist in parallel and are independent.' },
  { id:3, emoji:'\ud83d\udc64', titre:'KYC of our own PSF clients', contenu:[
    { icon:'\ud83d\udc64', texte:'i-Hub must **identify and verify** the identity of each PSF client before entering into a relationship' },
    { icon:'\ud83d\udcdc', texte:'Documents to collect: PSF articles of association, register extract, director identification, CSSF licence (or equivalent)' },
    { icon:'\ud83d\udc64', texte:'Identification of PSF client **UBOs**: who owns the PSF? Who exercises real control? These individuals must be identified' },
    { icon:'\ud83d\udcb5', texte:'**Source of funds**: understand where the fees and remuneration paid by the PSF to i-Hub come from' },
  ], aretenir:'i-Hub performs KYC on its own PSF clients: articles, directors, UBOs, licence. Just as a PSF does for its own final clients.' },
  { id:4, emoji:'\ud83d\udcca', titre:'Risk scoring our own clients', contenu:[
    { icon:'\ud83d\udcca', texte:'Each PSF client must be assigned an **AML risk level** by i-Hub: low, medium, high' },
    { icon:'\ud83d\udd34', texte:'Risk-increasing factors: PSF active in high-risk jurisdictions, high-risk final clients, complex ownership structure, AML history' },
    { icon:'\ud83d\udd04', texte:'Scoring is **periodically reviewed** \u2014 a PSF that changes shareholder or expands activities may see its risk level change' },
    { icon:'\ud83d\udd0d', texte:'A PSF client\u2019s risk level influences the level of monitoring i-Hub exercises and the file review frequency' },
  ], aretenir:'i-Hub scores its PSF clients as PSFs score their final clients. High risk = enhanced monitoring. Periodic review mandatory.' },
  { id:5, emoji:'\ud83c\udfaf', titre:'Name Screening of our own clients', contenu:[
    { icon:'\ud83c\udfaf', texte:'PSF clients and their directors/UBOs must be **screened against sanctions lists** (UN, EU, OFAC) before onboarding and on an ongoing basis' },
    { icon:'\ud83d\udd04', texte:'Ongoing screening is particularly important: a PSF client director may be sanctioned after the contract is signed' },
    { icon:'\ud83d\udea8', texte:'Confirmed match on a PSF client = immediate escalation to i-Hub management + possible STR to the FIU' },
    { icon:'\ud83d\udccc', texte:'i-Hub cannot continue to work for a PSF whose director is sanctioned without taking immediate action' },
  ], aretenir:'Screen PSF clients + their directors + their UBOs. Ongoing. Match = escalate to i-Hub management + possible STR. No delay.' },
  { id:6, emoji:'\ud83d\udcc8', titre:'Transaction and fee monitoring', contenu:[
    { icon:'\ud83d\udcc8', texte:'i-Hub must monitor the **financial flows** of its PSF clients: fees received, payment methods, unusual changes' },
    { icon:'\u26a0\ufe0f', texte:'Alert signals: unjustified cash or cryptocurrency payments, transfers from high-risk countries, amounts far exceeding signed contracts' },
    { icon:'\ud83d\udcb0', texte:'A PSF client paying from an account in a high-risk jurisdiction not mentioned in initial KYC = internal anomaly to flag' },
    { icon:'\ud83d\udcce', texte:'These observations are documented in the PSF client\u2019s AML file and subject to periodic review' },
  ], aretenir:'Monitor fees received from PSF clients: amount, origin, method. Any anomaly documented and reviewed.' },
  { id:7, emoji:'\ud83d\udd04', titre:'Periodic review of PSF client files', contenu:[
    { icon:'\ud83d\udd04', texte:'PSF clients\u2019 KYC files must be **regularly reviewed** \u2014 frequency based on assigned risk level' },
    { icon:'\ud83d\udcc5', texte:'Changes triggering immediate review: change of director, new PSF owner, expansion into new activities or jurisdictions' },
    { icon:'\ud83d\udcdd', texte:'Review checks: documents still valid, directors unchanged, screening up to date, risk profile still adequate' },
    { icon:'\ud83d\udcbc', texte:'A PSF that does not respond to KYC update requests = potential alert signal' },
  ], aretenir:'PSF client files = living KYC, not static. Periodic review mandatory. Change of director = immediate review.' },
  { id:8, emoji:'\u26a0\ufe0f', titre:'EDD for high-risk PSF clients', contenu:[
    { icon:'\ud83d\udd34', texte:'Some PSF clients require **Enhanced Due Diligence** from i-Hub: PSF active in high-risk countries, complex ownership, PEP director' },
    { icon:'\ud83d\udcdc', texte:'In EDD: additional documents on directors, full org chart down to UBOs, justification of the PSF\u2019s source of funds' },
    { icon:'\ud83d\udea8', texte:'PSF client whose UBO is a PEP = automatic EDD for i-Hub, regardless of service level in the SLA' },
    { icon:'\ud83d\udc4f', texte:'This EDD is in addition to contractual obligations \u2014 it may lead i-Hub to refuse or terminate a client relationship in case of unacceptable risk' },
  ], aretenir:'EDD on high-risk PSF clients: PEP, high-risk countries, opaque structures. Independent of SLA. Can lead to refusal of relationship.' },
  { id:9, emoji:'\ud83d\udcbb', titre:'The shared platform: specific vigilance required', contenu:[
    { icon:'\ud83d\udcbb', texte:'The **same platform** manages: (1) final client data of PSFs that i-Hub processes, and (2) AML surveillance data of PSF clients themselves' },
    { icon:'\u26a0\ufe0f', texte:'Specific risk: any **platform modification** (update, new feature, bug fix) may impact both dimensions simultaneously' },
    { icon:'\ud83d\udd0d', texte:'Example: modifying a screening filter can both alter controls on PSFs\u2019 final clients AND surveillance of the PSFs themselves' },
    { icon:'\ud83d\udea8', texte:'Any platform modification must be **tested and validated** for its impact on both surveillance levels before production deployment' },
  ], aretenir:'Shared platform = double exposure. Modifying the platform can impact i-Hub\u2019s regulatory surveillance of its own clients. Test both levels before any deployment.' },
  { id:10, emoji:'\ud83d\udd27', titre:'Managing platform modifications', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Identify dual impact**: every modification must be assessed for impact on (a) services provided to PSFs and (b) surveillance of PSF clients' },
    { icon:'2\ufe0f\u20e3', texte:'**Test both levels**: acceptance tests must cover final client use cases AND PSF client surveillance use cases' },
    { icon:'3\ufe0f\u20e3', texte:'**Document changes**: every modification traced with assessed impact on AML compliance at both levels' },
    { icon:'4\ufe0f\u20e3', texte:'**Alert Compliance**: any doubt about a modification\u2019s impact on regulatory surveillance = immediate escalation before deployment' },
  ], aretenir:'Modifying the platform = rigorous process. Dual testing. Documentation. Compliance alerted before any deployment impacting surveillance.' },
  { id:11, emoji:'\ud83d\udc65', titre:'PEPs among our PSF clients', contenu:[
    { icon:'\ud83d\udc65', texte:'If a director or UBO of a PSF client is a PEP, i-Hub must apply **EDD on that client** \u2014 not just check documents transmitted for final clients' },
    { icon:'\ud83d\udd04', texte:'PEP monitoring is **ongoing**: a director becomes a PEP after contract signing if appointed to a political function \u2014 i-Hub must detect this' },
    { icon:'\ud83d\udcf0', texte:'Adverse media monitoring on our PSF clients\u2019 directors is a regulatory obligation of i-Hub \u2014 not just a contractual option' },
    { icon:'\ud83d\udea8', texte:'PEP detected among our clients: immediate notification to i-Hub management + EDD triggered + review of contractual relationship' },
  ], aretenir:'PEP among our clients = immediate EDD. Ongoing monitoring of PSF client directors. Regulatory obligation of i-Hub, not optional.' },
  { id:12, emoji:'\ud83c\udf0d', titre:'PSF clients in high-risk countries', contenu:[
    { icon:'\ud83c\udf0d', texte:'A PSF client whose registered office, shareholders or main activity are linked to a **FATF high-risk country** requires EDD from i-Hub' },
    { icon:'\ud83d\udccc', texte:'The fact that the PSF is approved by the CSSF does not exempt i-Hub from its own KYC \u2014 CSSF approval reduces risk but does not eliminate it' },
    { icon:'\ud83d\udd04', texte:'An approved PSF whose shareholders change and include interests from a high-risk country = immediate KYC file update + risk recalculation' },
    { icon:'\ud83d\udd0d', texte:'i-Hub monitors structural changes of its PSF clients: change of owner = triggering event for a review' },
  ], aretenir:'CSSF approval \u2260 exemption from KYC. i-Hub monitors structural changes of its clients. New high-risk owner = immediate review.' },
  { id:13, emoji:'\ud83d\udea8', titre:'Filing an STR on a PSF client', contenu:[
    { icon:'\ud83d\udea8', texte:'If i-Hub detects suspicion of money laundering or terrorist financing by a **PSF client**, it has an obligation to report to the FIU' },
    { icon:'\ud83d\uded1', texte:'The **tipping off prohibition** applies: i-Hub cannot inform the PSF that an STR has been filed regarding them' },
    { icon:'\ud83d\udcbc', texte:'Delicate situation: continuing to work for a PSF on which an STR has been filed \u2014 internal procedure to follow, i-Hub management immediately involved' },
    { icon:'\ud83d\udd12', texte:'An STR is a serious and confidential act \u2014 never discussed with the client concerned or with non-authorised colleagues' },
  ], aretenir:'i-Hub can file an STR on one of its own PSF clients. Tipping off prohibited. i-Hub management immediately involved. Strict secrecy.' },
  { id:14, emoji:'\ud83d\udcce', titre:'Documentation and traceability of surveillance', contenu:[
    { icon:'\ud83d\udcce', texte:'i-Hub\u2019s entire KYC/AML process on its own PSF clients must be **documented and archived**: KYC files, screenings, reviews, incidents' },
    { icon:'\ud83d\udcbc', texte:'The CSSF can request to audit these files at any time \u2014 i-Hub must be able to demonstrate its regulatory diligence' },
    { icon:'\ud83d\udcc5', texte:'Minimum retention: **5 years** after the end of the relationship with the PSF client' },
    { icon:'\ud83d\udcbb', texte:'These files are separate from the final client files of PSFs \u2014 two distinct levels on the platform' },
  ], aretenir:'KYC/AML files of PSF clients: archived, auditable, separate from final clients. 5 years minimum after end of relationship.' },
  { id:15, emoji:'\ud83d\udd12', titre:'Level separation on the platform', contenu:[
    { icon:'\ud83d\udd12', texte:'The platform must maintain a **clear separation** between: (a) final client KYC data processed on behalf of PSFs and (b) AML surveillance files of PSF clients themselves' },
    { icon:'\ud83d\udd0d', texte:'A staff member working on a PSF\u2019s final client file should not automatically have access to the PSF\u2019s own internal AML file' },
    { icon:'\u26a0\ufe0f', texte:'Any modification to level separation (access rights, data segmentation) must be validated by Compliance and management' },
    { icon:'\ud83d\udcc5', texte:'CSSF audits can verify this separation \u2014 confusion between the two levels would be a serious failure' },
  ], aretenir:'Two levels = two separate spaces on the platform. Confusion between final clients and PSF clients is a serious failure.' },
  { id:16, emoji:'\ud83c\udf93', titre:'Summary: i-Hub\u2019s AML obligations on its own clients', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Full KYC** on each PSF client: articles, directors, UBOs, licence, risk scoring' },
    { icon:'2\ufe0f\u20e3', texte:'**Ongoing screening** of PSF clients and their directors/UBOs against sanctions lists' },
    { icon:'3\ufe0f\u20e3', texte:'**Financial monitoring** (fees) and structural change surveillance of PSF clients' },
    { icon:'4\ufe0f\u20e3', texte:'**Shared platform** = interference risk: any modification must be tested on both levels before deployment' },
    { icon:'5\ufe0f\u20e3', texte:'**STR possible** on a PSF client if suspicion confirmed \u2014 i-Hub management immediately involved, tipping off prohibited' },
  ], aretenir:'i-Hub monitors its PSF clients as PSFs monitor their final clients. Same regulation, same rigour, same traceability.' },
]

const REGLES_OR = {
  fr: [
    { icon:'\ud83d\udcdc', titre:'1. Obligations r\u00e9glementaires \u2260 contractuelles', texte:'Le KYC/AML d\u2019i-Hub sur ses propres clients PSF est impos\u00e9 par la loi \u2014 pas par les SLA. Il s\u2019applique \u00e0 tous les clients sans exception.' },
    { icon:'\ud83d\udcbb', titre:'2. Plateforme unique = double vigilance', texte:'Toute modification de la plateforme doit \u00eatre test\u00e9e sur les deux niveaux (clients finaux ET surveillance des PSF clients) avant d\u00e9ploiement.' },
    { icon:'\ud83d\udd12', titre:'3. S\u00e9paration stricte des niveaux', texte:'Les donn\u00e9es KYC des clients finaux et les dossiers de surveillance des PSF clients sont deux espaces s\u00e9par\u00e9s. Toute confusion = d\u00e9faillance grave.' },
    { icon:'\ud83d\udea8', titre:'4. STR et escalade direction', texte:'Un soup\u00e7on sur un PSF client = escalade imm\u00e9diate \u00e0 la direction d\u2019i-Hub. STR possible. Tipping off interdit. Strict secret.' },
  ],
  en: [
    { icon:'\ud83d\udcdc', titre:'1. Regulatory \u2260 contractual obligations', texte:'i-Hub\u2019s KYC/AML on its own PSF clients is imposed by law \u2014 not by SLAs. It applies to all clients without exception.' },
    { icon:'\ud83d\udcbb', titre:'2. Shared platform = dual vigilance', texte:'Any platform modification must be tested on both levels (final clients AND PSF client surveillance) before deployment.' },
    { icon:'\ud83d\udd12', titre:'3. Strict level separation', texte:'Final client KYC data and PSF client surveillance files are two separate spaces. Any confusion = serious failure.' },
    { icon:'\ud83d\udea8', titre:'4. STR and management escalation', texte:'Suspicion on a PSF client = immediate escalation to i-Hub management. STR possible. Tipping off prohibited. Strict secrecy.' },
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
      <button onClick={() => router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
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
        <div style={{background:\`\${C}10\`,border:\`2px solid \${C}30\`,borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
          <p style={{margin:'0 0 8px',fontWeight:'800',color:C,fontSize:'14px'}}>⚠️ {lang==='fr'?'MODULE SPÉCIFIQUE i-Hub':'i-Hub SPECIFIC MODULE'}</p>
          <p style={{margin:0,fontSize:'14px',color:'#374151'}}>{lang==='fr'?'Ce module traite des obligations réglementaires d\'i-Hub en tant que PSF de support — pas des obligations envers les clients finaux des PSF.':'This module covers i-Hub\'s regulatory obligations as a support PSF — not obligations towards PSFs\' final clients.'}</p>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${progress}%\`,transition:'width 0.4s ease',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1} / {FICHES.length}</span>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i) => <div key={i} onClick={() => setFicheIndex(i)} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:\`2px solid \${C}30\`,boxShadow:\`0 8px 40px \${C}15\`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i) => (
                <div key={i} style={{display:'flex',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                </div>
              ))}
              <div style={{background:\`\${C}10\`,border:\`1px solid \${C}30\`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px'}}>
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
              {ficheIndex < FICHES.length-1 ? \`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) →\` : (lang==='fr'?'Terminer le module ✓':'Complete module ✓')}
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
            <div key={i} style={{background:'white',border:\`2px solid \${C}30\`,borderRadius:'16px',padding:'20px',display:'flex',gap:'16px',alignItems:'flex-start',textAlign:'left',boxShadow:\`0 4px 20px \${C}10\`}}>
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
`, 'utf8');
console.log('✅ AML/KYC pour nos clients écrit !');
