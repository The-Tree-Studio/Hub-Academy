const fs = require('fs');
const ORANGE = '#e07b39';

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────
function q(s) { return s; } // placeholder for readability

// ─── MODULE: FATCA vs CRS vs QI ──────────────────────────────────────────────
fs.mkdirSync('app/modules/fatca-crs-qi-differences', { recursive: true });
fs.writeFileSync('app/modules/fatca-crs-qi-differences/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${ORANGE}'

const UI = {
  fr: {
    title: 'FATCA vs CRS vs QI',
    subtitle: 'Trois dispositifs fiscaux \u2014 un seul r\u00f4le pour i-Hub\u00a0: v\u00e9rifier',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Les diff\u00e9rences fondamentales entre FATCA, CRS et QI',
      'Qui est vis\u00e9 par chaque dispositif (nationalit\u00e9 vs r\u00e9sidence)',
      'Le r\u00f4le des PSF dans chaque syst\u00e8me \u2014 et celui d\u2019i-Hub',
      'Quand les trois s\u2019appliquent simultan\u00e9ment au m\u00eame client final',
      'Les formulaires \u00e0 v\u00e9rifier selon le dispositif',
      'Les pi\u00e8ges les plus fr\u00e9quents lors des v\u00e9rifications',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: 'C\u2019est parti\u00a0! \ud83d\ude80', prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR', goFurther: '\ud83d\udd0d Aller plus loin',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 TABLEAU COMPARATIF', q1title: '\ud83d\udcca FATCA, CRS ou QI\u00a0?',
    q1sub: 'Pour chaque caract\u00e9ristique, quel dispositif s\u2019applique\u00a0?',
    q2label: 'QUIZ 2/3 \u00b7 VRAI OU FAUX', q2title: '\u2705 Vrai ou Faux',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q3label: 'QUIZ 3/3 \u00b7 CAS CLIENT', q3title: '\ud83d\udc64 Quel dispositif s\u2019applique\u00a0?',
    q3sub: 'Lisez le profil du client final \u2014 quels dispositifs le PSF doit-il appliquer\u00a0?',
    resultTitle: 'Module termin\u00e9 \u2014 FATCA, CRS et QI n\u2019ont plus de secrets\u00a0!',
    backHome: '\u2190 Retour aux modules', restart: '\ud83d\udd04 Recommencer',
    pts_gained: 'points gagn\u00e9s', medal_gold: 'Expert comparatif\u00a0!',
    medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Dernier quiz \u2192',
    validate: 'Valider',
  },
  en: {
    title: 'FATCA vs CRS vs QI',
    subtitle: 'Three tax frameworks \u2014 one role for i-Hub: verify',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'The fundamental differences between FATCA, CRS and QI',
      'Who is targeted by each framework (nationality vs residency)',
      'The role of PSFs in each system \u2014 and that of i-Hub',
      'When all three apply simultaneously to the same final client',
      'Which forms to verify depending on the framework',
      'The most common pitfalls during verifications',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '\ud83d\udd0d Go further',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 COMPARISON TABLE', q1title: '\ud83d\udcca FATCA, CRS or QI?',
    q1sub: 'For each characteristic, which framework applies?',
    q2label: 'QUIZ 2/3 \u00b7 TRUE OR FALSE', q2title: '\u2705 True or False',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q3label: 'QUIZ 3/3 \u00b7 CLIENT CASE', q3title: '\ud83d\udc64 Which framework applies?',
    q3sub: 'Read the final client profile \u2014 which frameworks must the PSF apply?',
    resultTitle: 'Module complete \u2014 FATCA, CRS and QI hold no more secrets!',
    backHome: '\u2190 Back to modules', restart: '\ud83d\udd04 Restart',
    pts_gained: 'points earned', medal_gold: 'Comparison Expert!',
    medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Last quiz \u2192',
    validate: 'Validate',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udd2d', titre:'Vue d\u2019ensemble\u00a0: trois dispositifs, une m\u00eame logique', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA** (2010) \u2014 am\u00e9ricain, cible les **US Persons** o\u00f9 qu\u2019elles soient dans le monde' },
    { icon:'\ud83c\udf0d', texte:'**CRS** (2014) \u2014 OCDE, cible les **r\u00e9sidents fiscaux \u00e9trangers** dans 100+ pays' },
    { icon:'\ud83d\udcb0', texte:'**QI** \u2014 am\u00e9ricain, r\u00e9git la **retenue \u00e0 la source** sur les revenus de source US' },
    { icon:'\ud83d\udd0d', texte:'Pour i-Hub\u00a0: trois dispositifs, un seul r\u00f4le \u2014 **v\u00e9rifier la coh\u00e9rence documentaire** pour le compte des PSF' },
  ], aretenir:'FATCA = nationalit\u00e9 US. CRS = r\u00e9sidence \u00e9trang\u00e8re. QI = revenus US. Les PSF g\u00e8rent les trois. i-Hub v\u00e9rifie les documents.' },

  { id:2, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:'FATCA en 5 points cl\u00e9s', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Origine**\u00a0: loi am\u00e9ricaine de 2010, IGA Mod\u00e8le 1 sign\u00e9 par le Luxembourg en 2014' },
    { icon:'2\ufe0f\u20e3', texte:'**Cible**\u00a0: toute **US Person** (citoyens US, r\u00e9sidents permanents, soci\u00e9t\u00e9s US) o\u00f9 qu\u2019elles vivent' },
    { icon:'3\ufe0f\u20e3', texte:'**Formulaires**\u00a0: W-9 (US Person) ou W-8BEN/W-8BEN-E (non-US Person)' },
    { icon:'4\ufe0f\u20e3', texte:'**Qui d\u00e9clare**\u00a0: les **PSF** luxembourgeois \u00e0 l\u2019ACD, qui transmet \u00e0 l\u2019IRS' },
    { icon:'5\ufe0f\u20e3', texte:'**R\u00f4le d\u2019i-Hub**\u00a0: v\u00e9rifier que le bon formulaire W est pr\u00e9sent et coh\u00e9rent avec le profil du client final' },
  ], aretenir:'FATCA vise qui vous \u00eates (nationalit\u00e9). Un Luxembourgeois n\u00e9 \u00e0 New York reste soumis \u00e0 FATCA m\u00eame s\u2019il n\u2019a jamais v\u00e9cu aux USA.' },

  { id:3, emoji:'\ud83c\udf0d', titre:'CRS en 5 points cl\u00e9s', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Origine**\u00a0: standard OCDE de 2014, transpos\u00e9 au Luxembourg par la loi du 18 d\u00e9cembre 2015' },
    { icon:'2\ufe0f\u20e3', texte:'**Cible**\u00a0: tout **r\u00e9sident fiscal \u00e9tranger** \u2014 ind\u00e9pendamment de sa nationalit\u00e9' },
    { icon:'3\ufe0f\u20e3', texte:'**Formulaires**\u00a0: **autocertification** de r\u00e9sidence fiscale + NIF pour chaque pays de r\u00e9sidence' },
    { icon:'4\ufe0f\u20e3', texte:'**Qui d\u00e9clare**\u00a0: les **PSF** \u00e0 l\u2019ACD, qui transmet aux autorit\u00e9s fiscales des pays de r\u00e9sidence' },
    { icon:'5\ufe0f\u20e3', texte:'**R\u00f4le d\u2019i-Hub**\u00a0: v\u00e9rifier la coh\u00e9rence de l\u2019autocertification et la pr\u00e9sence du NIF pour chaque r\u00e9sidence d\u00e9clar\u00e9e' },
  ], aretenir:'CRS vise o\u00f9 vous vivez (r\u00e9sidence). Un Fran\u00e7ais vivant en Suisse est CRS-d\u00e9clarable pour la Suisse, pas pour la France.' },

  { id:4, emoji:'\ud83d\udcb2', titre:'QI en 5 points cl\u00e9s', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Origine**\u00a0: programme IRS am\u00e9ricain optionnel, compl\u00e9mentaire \u00e0 FATCA' },
    { icon:'2\ufe0f\u20e3', texte:'**Cible**\u00a0: les revenus de **source am\u00e9ricaine** (dividendes, int\u00e9r\u00eats sur titres US) re\u00e7us par les clients finaux des PSF' },
    { icon:'3\ufe0f\u20e3', texte:'**Enjeu**\u00a0: appliquer le bon taux de retenue \u00e0 la source (0%, 15%, 30%) selon le statut du b\u00e9n\u00e9ficiaire' },
    { icon:'4\ufe0f\u20e3', texte:'**Qui est QI**\u00a0: le **PSF** lui-m\u00eame, s\u2019il a sign\u00e9 un accord QI avec l\u2019IRS \u2014 pas i-Hub' },
    { icon:'5\ufe0f\u20e3', texte:'**R\u00f4le d\u2019i-Hub**\u00a0: v\u00e9rifier les formulaires W li\u00e9s au QI si pr\u00e9vu au SLA \u2014 la responsabilit\u00e9 QI reste celle du PSF' },
  ], aretenir:'QI = comment taxer les revenus US. C\u2019est une responsabilit\u00e9 du PSF. i-Hub peut v\u00e9rifier les formulaires associ\u00e9s si le SLA le pr\u00e9voit.' },

  { id:5, emoji:'\ud83d\udd04', titre:'FATCA vs CRS\u00a0: la diff\u00e9rence fondamentale', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA** \u2192 crit\u00e8re de **nationalit\u00e9/citoyennet\u00e9** \u2014 vise les US Persons o\u00f9 qu\u2019elles soient' },
    { icon:'\ud83c\udf0d', texte:'**CRS** \u2192 crit\u00e8re de **r\u00e9sidence fiscale** \u2014 vise les r\u00e9sidents \u00e9trangers quelle que soit leur nationalit\u00e9' },
    { icon:'\ud83d\udd04', texte:'Un client final peut \u00eatre soumis aux **deux**\u00a0: Am\u00e9ricain vivant en France \u2192 FATCA (nationalit\u00e9 US) ET CRS (r\u00e9sidence France)' },
    { icon:'\ud83d\udcdd', texte:'Pour i-Hub\u00a0: v\u00e9rifier **les deux** formulaires si n\u00e9cessaire \u2014 W-9 ou W-8 pour FATCA + autocertification pour CRS' },
  ], aretenir:'Un client final peut g\u00e9n\u00e9rer des obligations FATCA ET CRS simultan\u00e9ment. i-Hub doit v\u00e9rifier les deux types de documents.' },

  { id:6, emoji:'\ud83d\udc64', titre:'Trois profils de clients finaux', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**US Person r\u00e9sidente aux USA**\u00a0: FATCA uniquement \u2014 W-9 \u00e0 v\u00e9rifier, pas de CRS (les USA ne participent pas)' },
    { icon:'\ud83d\udd04', texte:'**US Person r\u00e9sidente en France**\u00a0: FATCA (nationalit\u00e9 US) ET CRS (r\u00e9sidence France) \u2014 W-9 + autocertification CRS' },
    { icon:'\ud83c\udf0d', texte:'**Non-US r\u00e9sident en Allemagne**\u00a0: CRS uniquement (r\u00e9sidence \u00e9trang\u00e8re) \u2014 W-8BEN + autocertification CRS' },
  ], aretenir:'La combinaison FATCA + CRS d\u00e9pend du profil du client final. i-Hub v\u00e9rifie les documents correspondants selon le cas.' },

  { id:7, emoji:'\ud83d\udccb', titre:'Les formulaires W\u00a0: qui remplit quoi', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**W-9**\u00a0: rempli par le client final **US Person** \u2014 certifie son statut am\u00e9ricain et son TIN' },
    { icon:'\ud83d\udcdd', texte:'**W-8BEN**\u00a0: rempli par le client final **particulier non-US** \u2014 certifie le statut non-am\u00e9ricain (valable 3 ans)' },
    { icon:'\ud83c\udfe2', texte:'**W-8BEN-E**\u00a0: rempli par une **entit\u00e9 non-US** \u2014 pr\u00e9cise la cat\u00e9gorie FATCA (NFFE active, passive, IFE\u2026)' },
    { icon:'\ud83c\udf0d', texte:'**Autocertification CRS**\u00a0: remplie par tout client final \u2014 d\u00e9clare la r\u00e9sidence fiscale et le NIF' },
  ], aretenir:'W-9/W-8 = FATCA. Autocertification = CRS. Un client final peut avoir besoin des deux. i-Hub v\u00e9rifie leur pr\u00e9sence et coh\u00e9rence.' },

  { id:8, emoji:'\ud83c\udf1f', titre:'Quand QI, FATCA et CRS se cumulent', contenu:[
    { icon:'\ud83c\udfe6', texte:'Un PSF peut \u00eatre QI ET g\u00e9rer des obligations FATCA ET CRS sur le m\u00eame client final' },
    { icon:'\ud83d\udcb0', texte:'Exemple\u00a0: client final am\u00e9ricain (FATCA) r\u00e9sident en Suisse (CRS) d\u00e9tenant des actions Apple (QI pour les dividendes US)' },
    { icon:'\ud83d\udcdd', texte:'Dans ce cas\u00a0: W-9 (FATCA) + autocertification CRS + formulaires QI \u2014 tous \u00e0 v\u00e9rifier par i-Hub si pr\u00e9vu au SLA' },
    { icon:'\ud83d\uded1', texte:'Ce cas complexe doit \u00eatre valid\u00e9 par la **Compliance i-Hub** avant transmission au PSF' },
  ], aretenir:'FATCA + CRS + QI peuvent s\u2019appliquer simultan\u00e9ment. Plus c\u2019est complexe, plus le recours \u00e0 la Compliance i-Hub est n\u00e9cessaire.' },

  { id:9, emoji:'\ud83c\uddf1\ud83c\uddfa', titre:'Le r\u00f4le de l\u2019ACD dans les trois dispositifs', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA**\u00a0: les PSF d\u00e9clarent \u00e0 l\u2019ACD, qui transmet \u00e0 l\u2019**IRS** am\u00e9ricain (via IGA Mod\u00e8le 1)' },
    { icon:'\ud83c\udf0d', texte:'**CRS**\u00a0: les PSF d\u00e9clarent \u00e0 l\u2019ACD, qui transmet aux **autorit\u00e9s fiscales** des pays de r\u00e9sidence des clients finaux' },
    { icon:'\ud83d\udcb2', texte:'**QI**\u00a0: le PSF g\u00e8re les retenues directement avec les d\u00e9positaires US \u2014 l\u2019ACD n\u2019est pas au centre du dispositif QI' },
    { icon:'\ud83d\udd0d', texte:'i-Hub n\u2019est jamais en contact avec l\u2019ACD \u2014 il fournit les donn\u00e9es v\u00e9rifi\u00e9es **au PSF** qui d\u00e9clare' },
  ], aretenir:'Dans les trois dispositifs, la d\u00e9claration appartient au PSF. i-Hub est en amont, comme v\u00e9rificateur documentaire.' },

  { id:10, emoji:'\u26a0\ufe0f', titre:'Les USA ne participent pas au CRS', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Les \u00c9tats-Unis ont **refus\u00e9 de rejoindre le CRS** \u2014 ils ont leur propre syst\u00e8me (FATCA) qu\u2019ils imposent au monde entier' },
    { icon:'\ud83d\udea8', texte:'Cons\u00e9quence\u00a0: un client final am\u00e9ricain r\u00e9sident aux USA n\u2019est soumis qu\u2019\u00e0 FATCA, pas au CRS' },
    { icon:'\ud83d\udd04', texte:'Mais un client final non-am\u00e9ricain ayant des actifs aux USA peut avoir des obligations QI (retenue sur dividendes US)' },
    { icon:'\ud83d\udcdd', texte:'Pour i-Hub\u00a0: v\u00e9rifier le formulaire W-8 suffit pour un non-US \u2014 pas besoin d\u2019autocertification CRS pour les USA' },
  ], aretenir:'USA = FATCA seulement. Pas de CRS. Les autres pays = CRS. Cette asymm\u00e9trie est source de confusion \u2014 ne pas l\u2019oublier.' },

  { id:11, emoji:'\ud83c\udfc6', titre:'FATCA\u00a0: les indices d\u2019am\u00e9ricanit\u00e9 \u00e0 conna\u00eetre', contenu:[
    { icon:'\ud83d\udd34', texte:'Lieu de naissance aux USA, adresse am\u00e9ricaine, num\u00e9ro de t\u00e9l\u00e9phone US' },
    { icon:'\ud83d\udd34', texte:'Ordre de virement permanent vers un compte am\u00e9ricain, procuration donn\u00e9e \u00e0 une personne avec adresse US' },
    { icon:'\ud83d\udccc', texte:'Chaque indice d\u00e9tect\u00e9 par i-Hub doit \u00eatre **signal\u00e9 au PSF** \u2014 c\u2019est au PSF de demander des clarifications au client final' },
    { icon:'\ud83d\udeab', texte:'i-Hub ne conclut pas seul \u2014 il **signale et documente**, le PSF d\u00e9cide de la classification finale' },
  ], aretenir:'Un seul indice d\u2019am\u00e9ricanit\u00e9 visible = signal au PSF. i-Hub ne classe pas \u2014 il alerte.' },

  { id:12, emoji:'\ud83c\udf0d', titre:'CRS\u00a0: les indices de r\u00e9sidence \u00e9trang\u00e8re', contenu:[
    { icon:'\ud83d\udd34', texte:'Adresse \u00e9trang\u00e8re dans le dossier, num\u00e9ro de t\u00e9l\u00e9phone \u00e9tranger, virements vers un compte \u00e9tranger' },
    { icon:'\ud83d\udd34', texte:'Autocertification indiquant une r\u00e9sidence incompatible avec les autres documents d\u2019identit\u00e9' },
    { icon:'\ud83d\udd34', texte:'NIF absent ou de format incompatible avec le pays de r\u00e9sidence d\u00e9clar\u00e9' },
    { icon:'\ud83d\udccc', texte:'Tout indice visible doit \u00eatre **signal\u00e9 au PSF** qui sollicite des justificatifs aupr\u00e8s du client final' },
  ], aretenir:'Les indices CRS sont visuels et documentaires. i-Hub les d\u00e9tecte lors de la v\u00e9rification et les signale au PSF.' },

  { id:13, emoji:'\ud83d\udcb0', titre:'QI\u00a0: la retenue \u00e0 la source en pratique', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Sans statut QI\u00a0: retenue de **30%** sur tous les revenus de source US pour les non-US' },
    { icon:'\u2b07\ufe0f', texte:'Avec statut QI\u00a0: taux r\u00e9duit selon la **convention fiscale** entre le pays du client final et les USA (souvent 0% ou 15%)' },
    { icon:'\ud83d\udccb', texte:'Le PSF QI doit identifier le statut fiscal de chaque client final pour appliquer le bon taux' },
    { icon:'\ud83d\udd0d', texte:'i-Hub v\u00e9rifie les formulaires W associ\u00e9s (W-8BEN, W-8BEN-E) si le SLA le pr\u00e9voit pour les clients d\u00e9tenant des titres US' },
  ], aretenir:'QI = optimiser la retenue fiscale US. C\u2019est une responsabilit\u00e9 du PSF. i-Hub v\u00e9rifie les formulaires si pr\u00e9vu au SLA.' },

  { id:14, emoji:'\ud83d\uddc2\ufe0f', titre:'Tableau de bord\u00a0: qui fait quoi', contenu:[
    { icon:'\ud83d\udc64', texte:'**Client final**\u00a0: remplit les formulaires (W-9, W-8, autocertification) et d\u00e9clare sa situation au PSF' },
    { icon:'\ud83c\udfe6', texte:'**PSF**\u00a0: collecte, classe, d\u00e9clare \u00e0 l\u2019ACD (FATCA+CRS) ou g\u00e8re les retenues QI \u2014 responsabilit\u00e9 l\u00e9gale' },
    { icon:'\ud83d\udd0d', texte:'**i-Hub**\u00a0: v\u00e9rifie la coh\u00e9rence des formulaires pour le compte du PSF, dans le p\u00e9rim\u00e8tre du SLA' },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:'**ACD**\u00a0: re\u00e7oit les d\u00e9clarations FATCA+CRS des PSF et les transmet aux autorit\u00e9s comp\u00e9tentes' },
  ], aretenir:'Client final \u2192 PSF \u2192 ACD/IRS. i-Hub est entre le client final et le PSF, comme v\u00e9rificateur. Jamais dans la cha\u00eene de d\u00e9claration.' },

  { id:15, emoji:'\ud83e\udd14', titre:'Les erreurs les plus fr\u00e9quentes', contenu:[
    { icon:'\u274c', texte:'Confondre **nationalit\u00e9 et r\u00e9sidence** \u2014 un Fran\u00e7ais vivant au Luxembourg n\u2019est pas d\u00e9clarable en France sous CRS' },
    { icon:'\u274c', texte:'Ignorer qu\u2019un client final peut \u00eatre soumis aux **deux dispositifs** (FATCA + CRS) simultan\u00e9ment' },
    { icon:'\u274c', texte:'Accepter un W-8BEN sans v\u00e9rifier les **indices d\u2019am\u00e9ricanit\u00e9** visibles dans le dossier' },
    { icon:'\u274c', texte:'Croire qu\u2019un formulaire sign\u00e9 suffit \u2014 i-Hub doit toujours v\u00e9rifier la **coh\u00e9rence** avec les autres documents' },
  ], aretenir:'Les erreurs naissent souvent de la confusion nationalit\u00e9/r\u00e9sidence et du manque de v\u00e9rification crois\u00e9e des documents.' },

  { id:16, emoji:'\ud83d\udcc5', titre:'Les \u00e9ch\u00e9ances cl\u00e9s', contenu:[
    { icon:'\ud83d\udccb', texte:'**FATCA et CRS**\u00a0: d\u00e9claration annuelle du PSF \u00e0 l\u2019ACD avant le **30 juin** de l\u2019ann\u00e9e suivante' },
    { icon:'\ud83d\udcdd', texte:'**W-8BEN**\u00a0: valable **3 ans** \u2014 i-Hub signale les formulaires expir\u00e9s d\u00e9tect\u00e9s lors de ses v\u00e9rifications' },
    { icon:'\ud83d\udd04', texte:'**Autocertification CRS**\u00a0: \u00e0 renouveler si changement de circonstances du client final dans les **90 jours**' },
    { icon:'\ud83c\uddf9\ud83c\udde9', texte:'**Dividendes US (QI)**\u00a0: retenue appliqu\u00e9e lors de chaque versement \u2014 pas de d\u00e9lai annuel' },
  ], aretenir:'30 juin = d\u00e9claration FATCA+CRS. 3 ans = validit\u00e9 W-8BEN. 90 jours = renouvellement autocertification. Ces d\u00e9lais s\u2019appliquent aux PSF.' },

  { id:17, emoji:'\ud83d\udd12', titre:'Conservation et confidentialit\u00e9', contenu:[
    { icon:'\ud83d\udcc5', texte:'Tous les formulaires (W-9, W-8, autocertifications) doivent \u00eatre conserv\u00e9s **au moins 5 ans** apr\u00e8s la fin de la relation' },
    { icon:'\ud83d\udd12', texte:'Ces donn\u00e9es sont couvertes par le **secret professionnel PSF** et le **RGPD** \u2014 strictement confidentielles' },
    { icon:'\ud83d\udce4', texte:'i-Hub transmet les donn\u00e9es v\u00e9rifi\u00e9es au PSF via des **canaux s\u00e9curis\u00e9s** pr\u00e9vus au SLA \u2014 jamais \u00e0 l\u2019ACD ou \u00e0 l\u2019IRS' },
    { icon:'\ud83d\udcbb', texte:'i-Hub doit \u00e9galement archiver ses propres **rapports de v\u00e9rification** pour prouver sa diligence en cas de contr\u00f4le' },
  ], aretenir:'i-Hub ne transmet qu\u2019au PSF. Jamais \u00e0 l\u2019ACD, jamais \u00e0 l\u2019IRS. Les donn\u00e9es fiscales sont parmi les plus sensibles.' },

  { id:18, emoji:'\ud83d\udea8', titre:'Quand alerter la Compliance i-Hub', contenu:[
    { icon:'\ud83d\udd34', texte:'Client final soumis \u00e0 **FATCA + CRS + QI** simultan\u00e9ment \u2014 cas complexe \u00e0 valider' },
    { icon:'\ud83d\udd34', texte:'Indices contradictoires entre les formulaires FATCA et l\u2019autocertification CRS du m\u00eame client final' },
    { icon:'\ud83d\udd34', texte:'Formulaires W **incomplets ou incoh\u00e9rents** sans justification claire' },
    { icon:'\ud83d\udd34', texte:'Demande du PSF d\u2019aller **au-del\u00e0 du SLA** \u2014 toujours clarifier le p\u00e9rim\u00e8tre avant d\u2019agir' },
  ], aretenir:'Tout cas complexe ou ambigu doit passer par la Compliance i-Hub avant d\u2019\u00eatre transmis au PSF. Ne jamais trancher seul.' },

  { id:19, emoji:'\ud83c\udf93', titre:'Ce que i-Hub doit conna\u00eetre parfaitement', contenu:[
    { icon:'\ud83d\udcda', texte:'**Les formulaires**\u00a0: W-9, W-8BEN, W-8BEN-E, autocertification CRS \u2014 savoir ce que chacun certifie' },
    { icon:'\ud83d\udd0d', texte:'**Les indices**\u00a0: am\u00e9ricanit\u00e9 (FATCA) et r\u00e9sidence \u00e9trang\u00e8re (CRS) \u2014 savoir les d\u00e9tecter visuellement' },
    { icon:'\ud83d\udea8', texte:'**Les red flags**\u00a0: incoh\u00e9rences entre formulaires, formulaires expir\u00e9s, NIF incompatibles' },
    { icon:'\ud83d\udcdc', texte:'**Son p\u00e9rim\u00e8tre**\u00a0: ce que le SLA lui demande de v\u00e9rifier et ce qui reste de la responsabilit\u00e9 du PSF' },
  ], aretenir:'Conna\u00eetre les formulaires + d\u00e9tecter les indices + respecter le SLA = les trois piliers du travail de v\u00e9rification i-Hub.' },

  { id:20, emoji:'\ud83d\udca1', titre:'R\u00e9sum\u00e9\u00a0: FATCA vs CRS vs QI en un coup d\u2019\u0153il', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA**\u00a0: nationalit\u00e9 US \u2192 W-9 ou W-8 \u2192 PSF d\u00e9clare \u00e0 ACD \u2192 ACD transmet \u00e0 IRS' },
    { icon:'\ud83c\udf0d', texte:'**CRS**\u00a0: r\u00e9sidence \u00e9trang\u00e8re \u2192 autocertification + NIF \u2192 PSF d\u00e9clare \u00e0 ACD \u2192 ACD transmet au pays de r\u00e9sidence' },
    { icon:'\ud83d\udcb0', texte:'**QI**\u00a0: revenus US \u2192 formulaires W \u2192 PSF applique la bonne retenue \u2192 reversement \u00e0 l\u2019IRS' },
    { icon:'\ud83d\udd0d', texte:'**i-Hub dans les trois cas**\u00a0: v\u00e9rifie les formulaires, signale les incoh\u00e9rences au PSF, documente \u2014 jamais d\u00e9clarant' },
  ], aretenir:'Trois dispositifs, un seul r\u00f4le pour i-Hub\u00a0: v\u00e9rifier et signaler. Le PSF d\u00e9clare et assume la responsabilit\u00e9 l\u00e9gale.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udd2d', titre:'Overview: three frameworks, one logic', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA** (2010) \u2014 US, targets **US Persons** wherever they are in the world' },
    { icon:'\ud83c\udf0d', texte:'**CRS** (2014) \u2014 OECD, targets **foreign tax residents** across 100+ countries' },
    { icon:'\ud83d\udcb0', texte:'**QI** \u2014 US, governs **withholding tax** on US-source income' },
    { icon:'\ud83d\udd0d', texte:'For i-Hub: three frameworks, one role \u2014 **verify documentary consistency** on behalf of PSFs' },
  ], aretenir:'FATCA = US nationality. CRS = foreign residency. QI = US income. PSFs manage all three. i-Hub verifies the documents.' },
  { id:2, emoji:'\ud83c\uddfa\ud83c\uddf8', titre:'FATCA in 5 key points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Origin**: US law of 2010, Model 1 IGA signed by Luxembourg in 2014' },
    { icon:'2\ufe0f\u20e3', texte:'**Target**: any **US Person** (US citizens, permanent residents, US entities) wherever they live' },
    { icon:'3\ufe0f\u20e3', texte:'**Forms**: W-9 (US Person) or W-8BEN/W-8BEN-E (non-US Person)' },
    { icon:'4\ufe0f\u20e3', texte:'**Who reports**: **PSFs** to the ACD, which forwards to the IRS' },
    { icon:'5\ufe0f\u20e3', texte:'**i-Hub\u2019s role**: verify that the correct W form is present and consistent with the final client\u2019s profile' },
  ], aretenir:'FATCA targets who you are (nationality). A Luxembourger born in New York remains subject to FATCA even if they never lived in the US.' },
  { id:3, emoji:'\ud83c\udf0d', titre:'CRS in 5 key points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Origin**: OECD standard of 2014, transposed in Luxembourg by the Law of 18 December 2015' },
    { icon:'2\ufe0f\u20e3', texte:'**Target**: any **foreign tax resident** \u2014 regardless of nationality' },
    { icon:'3\ufe0f\u20e3', texte:'**Forms**: **self-certification** of tax residency + TIN for each country of residence' },
    { icon:'4\ufe0f\u20e3', texte:'**Who reports**: **PSFs** to the ACD, which forwards to the tax authorities of the countries of residence' },
    { icon:'5\ufe0f\u20e3', texte:'**i-Hub\u2019s role**: verify consistency of the self-certification and presence of the TIN for each declared residency' },
  ], aretenir:'CRS targets where you live (residency). A French national living in Switzerland is CRS-reportable for Switzerland, not France.' },
  { id:4, emoji:'\ud83d\udcb2', titre:'QI in 5 key points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Origin**: optional IRS programme, complementary to FATCA' },
    { icon:'2\ufe0f\u20e3', texte:'**Target**: **US-source income** (dividends, interest on US securities) received by PSFs\u2019 final clients' },
    { icon:'3\ufe0f\u20e3', texte:'**Issue**: applying the correct withholding rate (0%, 15%, 30%) based on the beneficiary\u2019s status' },
    { icon:'4\ufe0f\u20e3', texte:'**Who is QI**: the **PSF** itself, if it has signed a QI agreement with the IRS \u2014 not i-Hub' },
    { icon:'5\ufe0f\u20e3', texte:'**i-Hub\u2019s role**: verify QI-related W forms if specified in the SLA \u2014 QI responsibility remains with the PSF' },
  ], aretenir:'QI = how to tax US income. It is a PSF responsibility. i-Hub may verify associated forms if the SLA provides for it.' },
  { id:5, emoji:'\ud83d\udd04', titre:'FATCA vs CRS: the fundamental difference', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA** \u2192 **nationality/citizenship** criterion \u2014 targets US Persons wherever they are' },
    { icon:'\ud83c\udf0d', texte:'**CRS** \u2192 **tax residency** criterion \u2014 targets foreign residents regardless of nationality' },
    { icon:'\ud83d\udd04', texte:'A final client can be subject to **both**: US national living in France \u2192 FATCA (US nationality) AND CRS (French residency)' },
    { icon:'\ud83d\udcdd', texte:'For i-Hub: verify **both** form types if necessary \u2014 W-9 or W-8 for FATCA + self-certification for CRS' },
  ], aretenir:'A final client can generate FATCA AND CRS obligations simultaneously. i-Hub must verify both types of documents.' },
  { id:6, emoji:'\ud83d\udc64', titre:'Three final client profiles', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**US Person resident in the US**: FATCA only \u2014 W-9 to verify, no CRS (US does not participate)' },
    { icon:'\ud83d\udd04', texte:'**US Person resident in France**: FATCA (US nationality) AND CRS (French residency) \u2014 W-9 + CRS self-certification' },
    { icon:'\ud83c\udf0d', texte:'**Non-US resident in Germany**: CRS only (foreign residency) \u2014 W-8BEN + CRS self-certification' },
  ], aretenir:'The FATCA + CRS combination depends on the final client\u2019s profile. i-Hub verifies the corresponding documents for each case.' },
  { id:7, emoji:'\ud83d\udccb', titre:'W forms: who fills what', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**W-9**: completed by **US Person** final client \u2014 certifies US status and TIN' },
    { icon:'\ud83d\udcdd', texte:'**W-8BEN**: completed by **non-US individual** final client \u2014 certifies non-US status (valid 3 years)' },
    { icon:'\ud83c\udfe2', texte:'**W-8BEN-E**: completed by a **non-US entity** \u2014 specifies FATCA category (active NFFE, passive, FFI\u2026)' },
    { icon:'\ud83c\udf0d', texte:'**CRS self-certification**: completed by any final client \u2014 declares tax residency and TIN' },
  ], aretenir:'W-9/W-8 = FATCA. Self-certification = CRS. A final client may need both. i-Hub verifies their presence and consistency.' },
  { id:8, emoji:'\ud83c\udf1f', titre:'When QI, FATCA and CRS all apply', contenu:[
    { icon:'\ud83c\udfe6', texte:'A PSF can be QI AND manage FATCA AND CRS obligations for the same final client' },
    { icon:'\ud83d\udcb0', texte:'Example: US final client (FATCA) resident in Switzerland (CRS) holding Apple shares (QI for US dividends)' },
    { icon:'\ud83d\udcdd', texte:'In this case: W-9 (FATCA) + CRS self-certification + QI forms \u2014 all to be verified by i-Hub if in SLA scope' },
    { icon:'\ud83d\uded1', texte:'This complex case must be validated by **i-Hub Compliance** before transmission to the PSF' },
  ], aretenir:'FATCA + CRS + QI can apply simultaneously. The more complex the case, the more i-Hub Compliance involvement is needed.' },
  { id:9, emoji:'\ud83c\uddf1\ud83c\uddfa', titre:'The ACD\u2019s role in all three frameworks', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA**: PSFs report to the ACD, which forwards to the **IRS** (via Model 1 IGA)' },
    { icon:'\ud83c\udf0d', texte:'**CRS**: PSFs report to the ACD, which forwards to the **tax authorities** of final clients\u2019 countries of residence' },
    { icon:'\ud83d\udcb2', texte:'**QI**: the PSF manages withholding directly with US depositaries \u2014 the ACD is not central to QI' },
    { icon:'\ud83d\udd0d', texte:'i-Hub is never in contact with the ACD \u2014 it provides verified data **to the PSF** which then reports' },
  ], aretenir:'In all three frameworks, reporting belongs to the PSF. i-Hub is upstream, as a documentary verifier.' },
  { id:10, emoji:'\u26a0\ufe0f', titre:'The US does not participate in CRS', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'The United States **refused to join CRS** \u2014 they have their own system (FATCA) which they impose on the world' },
    { icon:'\ud83d\udea8', texte:'Consequence: a US final client resident in the US is subject to FATCA only, not CRS' },
    { icon:'\ud83d\udd04', texte:'But a non-US final client holding US assets may have QI obligations (withholding on US dividends)' },
    { icon:'\ud83d\udcdd', texte:'For i-Hub: verifying W-8 is sufficient for a non-US person \u2014 no CRS self-certification needed for the US' },
  ], aretenir:'US = FATCA only. No CRS. Other countries = CRS. This asymmetry is a frequent source of confusion \u2014 do not forget it.' },
  { id:11, emoji:'\ud83c\udfc6', titre:'FATCA: US indicia to know', contenu:[
    { icon:'\ud83d\udd34', texte:'US birthplace, US address, US phone number' },
    { icon:'\ud83d\udd34', texte:'Standing transfer to a US account, power of attorney to a person with a US address' },
    { icon:'\ud83d\udccc', texte:'Each indicium detected by i-Hub must be **flagged to the PSF** \u2014 it is up to the PSF to seek clarification from the final client' },
    { icon:'\ud83d\udeab', texte:'i-Hub does not conclude alone \u2014 it **flags and documents**, the PSF makes the final classification decision' },
  ], aretenir:'A single visible US indicium = flag to PSF. i-Hub does not classify \u2014 it alerts.' },
  { id:12, emoji:'\ud83c\udf0d', titre:'CRS: foreign residency indicia', contenu:[
    { icon:'\ud83d\udd34', texte:'Foreign address in the file, foreign phone number, transfers to a foreign account' },
    { icon:'\ud83d\udd34', texte:'Self-certification indicating a residency incompatible with other identity documents' },
    { icon:'\ud83d\udd34', texte:'Missing TIN or TIN format incompatible with the declared country of residence' },
    { icon:'\ud83d\udccc', texte:'Any visible indicium must be **flagged to the PSF** which seeks supporting documents from the final client' },
  ], aretenir:'CRS indicia are visual and documentary. i-Hub detects them during verification and flags them to the PSF.' },
  { id:13, emoji:'\ud83d\udcb0', titre:'QI: withholding tax in practice', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'Without QI status: **30% withholding** on all US-source income for non-US persons' },
    { icon:'\u2b07\ufe0f', texte:'With QI status: reduced rate under the **tax treaty** between the final client\u2019s country and the US (often 0% or 15%)' },
    { icon:'\ud83d\udccb', texte:'The QI PSF must identify each final client\u2019s tax status to apply the correct rate' },
    { icon:'\ud83d\udd0d', texte:'i-Hub verifies associated W forms (W-8BEN, W-8BEN-E) if the SLA provides for it for clients holding US securities' },
  ], aretenir:'QI = optimising US tax withholding. It is a PSF responsibility. i-Hub verifies the forms if specified in the SLA.' },
  { id:14, emoji:'\ud83d\uddc2\ufe0f', titre:'Dashboard: who does what', contenu:[
    { icon:'\ud83d\udc64', texte:'**Final client**: completes forms (W-9, W-8, self-certification) and declares their situation to the PSF' },
    { icon:'\ud83c\udfe6', texte:'**PSF**: collects, classifies, reports to ACD (FATCA+CRS) or manages QI withholding \u2014 legal responsibility' },
    { icon:'\ud83d\udd0d', texte:'**i-Hub**: verifies form consistency on behalf of the PSF, within the SLA scope' },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:'**ACD**: receives FATCA+CRS declarations from PSFs and forwards them to the relevant authorities' },
  ], aretenir:'Final client \u2192 PSF \u2192 ACD/IRS. i-Hub is between the final client and the PSF, as verifier. Never in the reporting chain.' },
  { id:15, emoji:'\ud83e\udd14', titre:'The most common mistakes', contenu:[
    { icon:'\u274c', texte:'Confusing **nationality and residency** \u2014 a French national living in Luxembourg is not CRS-reportable to France' },
    { icon:'\u274c', texte:'Missing that a final client may be subject to **both frameworks** (FATCA + CRS) simultaneously' },
    { icon:'\u274c', texte:'Accepting a W-8BEN without checking for **visible US indicia** in the file' },
    { icon:'\u274c', texte:'Believing a signed form is sufficient \u2014 i-Hub must always verify **consistency** with other documents' },
  ], aretenir:'Mistakes often arise from confusing nationality/residency and lack of cross-document verification.' },
  { id:16, emoji:'\ud83d\udcc5', titre:'Key deadlines', contenu:[
    { icon:'\ud83d\udccb', texte:'**FATCA and CRS**: annual PSF declaration to the ACD before **30 June** of the following year' },
    { icon:'\ud83d\udcdd', texte:'**W-8BEN**: valid **3 years** \u2014 i-Hub flags expired forms detected during its verifications' },
    { icon:'\ud83d\udd04', texte:'**CRS self-certification**: to be renewed on change of circumstances within **90 days**' },
    { icon:'\ud83c\uddf9\ud83c\udde9', texte:'**US dividends (QI)**: withholding applied at each payment \u2014 no annual deadline' },
  ], aretenir:'30 June = FATCA+CRS reporting. 3 years = W-8BEN validity. 90 days = self-certification renewal. These deadlines apply to PSFs.' },
  { id:17, emoji:'\ud83d\udd12', titre:'Retention and confidentiality', contenu:[
    { icon:'\ud83d\udcc5', texte:'All forms (W-9, W-8, self-certifications) must be retained for **at least 5 years** after end of relationship' },
    { icon:'\ud83d\udd12', texte:'This data is covered by **PSF professional secrecy** and **GDPR** \u2014 strictly confidential' },
    { icon:'\ud83d\udce4', texte:'i-Hub transmits verified data to the PSF via **secure channels** per the SLA \u2014 never to the ACD or IRS' },
    { icon:'\ud83d\udcbb', texte:'i-Hub must also archive its own **verification reports** to demonstrate diligence in case of audit' },
  ], aretenir:'i-Hub only transmits to the PSF. Never to the ACD, never to the IRS. Tax data is among the most sensitive.' },
  { id:18, emoji:'\ud83d\udea8', titre:'When to alert i-Hub Compliance', contenu:[
    { icon:'\ud83d\udd34', texte:'Final client subject to **FATCA + CRS + QI** simultaneously \u2014 complex case to validate' },
    { icon:'\ud83d\udd34', texte:'Contradictory indicia between FATCA forms and the CRS self-certification of the same final client' },
    { icon:'\ud83d\udd34', texte:'**Incomplete or inconsistent** W forms without clear justification' },
    { icon:'\ud83d\udd34', texte:'PSF request to go **beyond the SLA** \u2014 always clarify scope before acting' },
  ], aretenir:'Any complex or ambiguous case must go through i-Hub Compliance before being transmitted to the PSF. Never decide alone.' },
  { id:19, emoji:'\ud83c\udf93', titre:'What i-Hub must know perfectly', contenu:[
    { icon:'\ud83d\udcda', texte:'**The forms**: W-9, W-8BEN, W-8BEN-E, CRS self-certification \u2014 knowing what each certifies' },
    { icon:'\ud83d\udd0d', texte:'**The indicia**: US status (FATCA) and foreign residency (CRS) \u2014 knowing how to detect them visually' },
    { icon:'\ud83d\udea8', texte:'**Red flags**: inconsistencies between forms, expired forms, incompatible TINs' },
    { icon:'\ud83d\udcdc', texte:'**Its scope**: what the SLA asks it to verify and what remains the PSF\u2019s responsibility' },
  ], aretenir:'Know the forms + detect indicia + respect the SLA = the three pillars of i-Hub\u2019s verification work.' },
  { id:20, emoji:'\ud83d\udca1', titre:'Summary: FATCA vs CRS vs QI at a glance', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**FATCA**: US nationality \u2192 W-9 or W-8 \u2192 PSF reports to ACD \u2192 ACD forwards to IRS' },
    { icon:'\ud83c\udf0d', texte:'**CRS**: foreign residency \u2192 self-cert + TIN \u2192 PSF reports to ACD \u2192 ACD forwards to country of residence' },
    { icon:'\ud83d\udcb0', texte:'**QI**: US income \u2192 W forms \u2192 PSF applies correct withholding \u2192 remits to IRS' },
    { icon:'\ud83d\udd0d', texte:'**i-Hub in all three**: verifies forms, flags inconsistencies to PSF, documents \u2014 never the reporter' },
  ], aretenir:'Three frameworks, one role for i-Hub: verify and flag. The PSF reports and bears legal responsibility.' },
]

const VF_FR = [
  { texte:'FATCA se base sur la nationalit\u00e9 am\u00e9ricaine', reponse:true, explication:'Exact\u00a0! FATCA cible les US Persons o\u00f9 qu\u2019elles vivent \u2014 crit\u00e8re de nationalit\u00e9.' },
  { texte:'CRS se base sur la nationalit\u00e9 du client final', reponse:false, explication:'Non\u00a0! CRS se base sur la r\u00e9sidence fiscale, pas la nationalit\u00e9.' },
  { texte:'Les USA participent au CRS comme les autres pays', reponse:false, explication:'Non\u00a0! Les USA ont refus\u00e9 de rejoindre le CRS. Ils ont FATCA \u00e0 la place.' },
  { texte:'Un client final peut \u00eatre soumis \u00e0 FATCA et CRS simultan\u00e9ment', reponse:true, explication:'Exact\u00a0! Un Am\u00e9ricain r\u00e9sident en France est soumis aux deux.' },
  { texte:'i-Hub d\u00e9clare les donn\u00e9es FATCA \u00e0 l\u2019ACD', reponse:false, explication:'Non\u00a0! Ce sont les PSF qui d\u00e9clarent \u00e0 l\u2019ACD. i-Hub v\u00e9rifie les documents.' },
  { texte:'Le W-9 est rempli par les US Persons', reponse:true, explication:'Exact\u00a0! Le W-9 certifie le statut am\u00e9ricain et le TIN.' },
  { texte:'Le QI est un syst\u00e8me de d\u00e9claration des comptes', reponse:false, explication:'Non\u00a0! QI concerne la retenue \u00e0 la source sur les revenus de source US, pas la d\u00e9claration de comptes.' },
  { texte:'i-Hub peut classifier un client final comme US Person sans en informer le PSF', reponse:false, explication:'Non\u00a0! i-Hub signale et documente \u2014 la classification appartient toujours au PSF.' },
  { texte:'Un Fran\u00e7ais vivant au Luxembourg est d\u00e9clarable CRS pour la France', reponse:false, explication:'Non\u00a0! CRS = r\u00e9sidence. Un Fran\u00e7ais r\u00e9sident au Luxembourg est d\u00e9clarable pour le Luxembourg, pas pour la France.' },
  { texte:'Le W-8BEN est valable 3 ans', reponse:true, explication:'Exact\u00a0! Toute date d\u2019expiration doit \u00eatre v\u00e9rifi\u00e9e lors des contr\u00f4les i-Hub.' },
]
const VF_EN = [
  { texte:'FATCA is based on US nationality', reponse:true, explication:'Correct! FATCA targets US Persons wherever they live \u2014 nationality criterion.' },
  { texte:'CRS is based on the final client\u2019s nationality', reponse:false, explication:'No! CRS is based on tax residency, not nationality.' },
  { texte:'The US participates in CRS like other countries', reponse:false, explication:'No! The US refused to join CRS. They have FATCA instead.' },
  { texte:'A final client can be subject to both FATCA and CRS simultaneously', reponse:true, explication:'Correct! A US national resident in France is subject to both.' },
  { texte:'i-Hub reports FATCA data to the ACD', reponse:false, explication:'No! PSFs report to the ACD. i-Hub verifies the documents.' },
  { texte:'The W-9 is completed by US Persons', reponse:true, explication:'Correct! The W-9 certifies US status and TIN.' },
  { texte:'QI is a system for reporting accounts', reponse:false, explication:'No! QI concerns withholding on US-source income, not account reporting.' },
  { texte:'i-Hub can classify a final client as a US Person without informing the PSF', reponse:false, explication:'No! i-Hub flags and documents \u2014 classification always belongs to the PSF.' },
  { texte:'A French national living in Luxembourg is CRS-reportable to France', reponse:false, explication:'No! CRS = residency. A French national resident in Luxembourg is reportable to Luxembourg, not France.' },
  { texte:'The W-8BEN is valid for 3 years', reponse:true, explication:'Correct! Any expiry date must be checked during i-Hub verifications.' },
]

const CAS_FR = [
  { profil:'Client final\u00a0: Mme Chen, citoyenne am\u00e9ricaine et fran\u00e7aise, r\u00e9sidente \u00e0 Paris. D\u00e9tient des actions Apple.', dispositifs:'FATCA + CRS + QI (potentiellement)', explication:'Am\u00e9ricaine = FATCA (W-9). R\u00e9sidente France = CRS (autocertification). Actions Apple = revenus US potentiels soumis \u00e0 QI.' },
  { profil:'Client final\u00a0: M. M\u00fcller, Allemand r\u00e9sident en Allemagne. Pas d\u2019actifs am\u00e9ricains.', dispositifs:'CRS uniquement', explication:'Non-am\u00e9ricain = pas de FATCA. R\u00e9sident \u00e9tranger = CRS. Pas d\u2019actifs US = QI non pertinent.' },
  { profil:'Client final\u00a0: Soci\u00e9t\u00e9 luxembourgeoise dont l\u2019actionnaire principal (60%) est am\u00e9ricain.', dispositifs:'FATCA (NFFE passive \u2014 UBO am\u00e9ricain \u00e0 signaler)', explication:'Entit\u00e9 LU = pas CRS pour l\u2019entit\u00e9. Mais actionnaire US \u00e0 60% = FATCA (NFFE passive). i-Hub signale au PSF.' },
  { profil:'Client final\u00a0: M. Tanaka, Japonais r\u00e9sident aux USA (Green Card).', dispositifs:'FATCA uniquement (les USA ne participent pas au CRS)', explication:'Green Card = US Person = FATCA (W-9). R\u00e9sident aux USA = pas de CRS (les USA ne participent pas).' },
  { profil:'Client final\u00a0: Fonds d\u2019investissement belge, IFE participant au CRS.', dispositifs:'CRS (entit\u00e9 \u00e9trang\u00e8re) + FATCA (W-8BEN-E avec GIIN)', explication:'IFE participante = W-8BEN-E avec GIIN pour FATCA. Entit\u00e9 belge = CRS. i-Hub v\u00e9rifie les deux formulaires.' },
]
const CAS_EN = [
  { profil:'Final client: Ms Chen, US and French citizen, resident in Paris. Holds Apple shares.', dispositifs:'FATCA + CRS + QI (potentially)', explication:'US national = FATCA (W-9). French resident = CRS (self-cert). Apple shares = potential US income subject to QI.' },
  { profil:'Final client: Mr M\u00fcller, German national resident in Germany. No US assets.', dispositifs:'CRS only', explication:'Non-US = no FATCA. Foreign resident = CRS. No US assets = QI not relevant.' },
  { profil:'Final client: Luxembourg company whose main shareholder (60%) is American.', dispositifs:'FATCA (passive NFFE \u2014 US UBO to flag)', explication:'LU entity = no CRS for entity. But 60% US shareholder = FATCA (passive NFFE). i-Hub flags to PSF.' },
  { profil:'Final client: Mr Tanaka, Japanese national resident in the US (Green Card).', dispositifs:'FATCA only (US does not participate in CRS)', explication:'Green Card = US Person = FATCA (W-9). US resident = no CRS (US not in CRS).' },
  { profil:'Final client: Belgian investment fund, FFI participating in CRS.', dispositifs:'CRS (foreign entity) + FATCA (W-8BEN-E with GIIN)', explication:'Participating FFI = W-8BEN-E with GIIN for FATCA. Belgian entity = CRS. i-Hub verifies both forms.' },
]

export default function ModuleFatcaCrsQi() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [plusLoinOpen, setPlusLoinOpen] = useState(false)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeVF, setActiveVF] = useState(() => pickRandom(VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnimation, setVfAnimation] = useState<'correct'|'wrong'|null>(null)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRevealed, setCasRevealed] = useState(false)
  const [casScore, setCasScore] = useState(0)

  // Quiz 1: comparison table - which framework?
  const features_fr = [
    { q:'Base sur la nationalit\u00e9 am\u00e9ricaine', a:'FATCA' },
    { q:'Base sur la r\u00e9sidence fiscale', a:'CRS' },
    { q:'Concerne les revenus de source US', a:'QI' },
    { q:'Cr\u00e9\u00e9 par l\u2019OCDE', a:'CRS' },
    { q:'Cr\u00e9\u00e9 par les \u00c9tats-Unis en 2010', a:'FATCA' },
    { q:'Formulaire W-9 ou W-8', a:'FATCA' },
    { q:'Autocertification + NIF', a:'CRS' },
    { q:'Retenue \u00e0 la source 0% \u00e0 30%', a:'QI' },
    { q:'Plus de 100 pays participants', a:'CRS' },
    { q:'IGA Mod\u00e8le 1 sign\u00e9 par le Luxembourg', a:'FATCA' },
  ]
  const features_en = [
    { q:'Based on US nationality', a:'FATCA' },
    { q:'Based on tax residency', a:'CRS' },
    { q:'Concerns US-source income', a:'QI' },
    { q:'Created by the OECD', a:'CRS' },
    { q:'Created by the US in 2010', a:'FATCA' },
    { q:'W-9 or W-8 form', a:'FATCA' },
    { q:'Self-certification + TIN', a:'CRS' },
    { q:'0% to 30% withholding tax', a:'QI' },
    { q:'Over 100 participating countries', a:'CRS' },
    { q:'Model 1 IGA signed by Luxembourg', a:'FATCA' },
  ]
  const [activeFeatures] = useState(() => pickRandom(features_fr, 6))
  const [q1Answers, setQ1Answers] = useState<Record<number,string>>({})
  const [q1Submitted, setQ1Submitted] = useState(false)

  function initQuizzes(l: 'fr'|'en') {
    const bv = l==='fr'?VF_FR:VF_EN; const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnimation(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRevealed(false)
    setQ1Answers({}); setQ1Submitted(false)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); setPlusLoinOpen(false); initQuizzes(l) }

  function submitQ1() {
    const features = lang==='fr'?features_fr:features_en
    let correct = 0
    activeFeatures.forEach((_,i) => { if (q1Answers[i] === activeFeatures[i].a) correct++ })
    setScore(s=>s+correct*3); setQ1Submitted(true)
  }

  function repondreVF(rep: boolean) {
    if (vfRepondu!==null) return
    const correct=activeVF[vfIndex].reponse===rep; setVfRepondu(rep); setVfAnimation(correct?'correct':'wrong')
    if (correct) setVfScore(s=>s+1)
    setTimeout(() => { setVfAnimation(null); setVfRepondu(null); if (vfIndex+1<activeVF.length) { setVfIndex(i=>i+1) } else { setScore(s=>s+(correct?vfScore+1:vfScore)*5); setPhase('quiz3') } }, 2200)
  }

  function nextCas() { if (casIndex+1<activeCas.length) { setCasIndex(i=>i+1); setCasRevealed(false) } else { setScore(s=>s+casScore*5); setPhase('resultat') } }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={()=>router.push('/')} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>\ud83d\udd2d {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l=><button key={l} onClick={()=>switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'\ud83c\uddeb\ud83c\uddf7 FR':'\ud83c\uddec\ud83c\udde7 EN'}</button>)}
        </div>
        <span style={{background:'white',border:\`1px solid \${C}\`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>\u2b50 {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>\ud83d\udd2d</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=><div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>\u2713</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'\ud83d\udcd6'},{label:t.quiz,icon:'\ud83c\udfae'},{label:t.time,icon:'\u23f1\ufe0f'}].map((b,i)=><div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
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
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i)=><div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:\`2px solid \${C}30\`,boxShadow:\`0 8px 40px \${C}15\`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'12px',padding:'12px 0',borderBottom:i<fiche.contenu.length-1?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:'22px',minWidth:'30px',textAlign:'center'}}>{item.icon}</span>
                  <p style={{margin:0,fontSize:'15px',lineHeight:1.6,color:'#374151'}} dangerouslySetInnerHTML={{__html:item.texte.replace(/\\*\\*(.*?)\\*\\*/g,\`<strong style="color:\${C}">$1</strong>\`)}}/>
                </div>
              ))}
              <div style={{background:\`\${C}10\`,border:\`1px solid \${C}30\`,borderRadius:'12px',padding:'14px',marginTop:'14px',display:'flex',gap:'10px'}}>
                <span>\ud83d\udca1</span>
                <div>
                  <p style={{margin:'0 0 4px',fontSize:'11px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{t.toRetain}</p>
                  <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>{fiche.aretenir}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            {ficheIndex>0&&<button onClick={()=>{setFicheIndex(i=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex<FICHES.length-1?\`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) \u2192\`:t.quizBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase==='quiz1') {
    const features = lang==='fr'?features_fr:features_en
    const options = ['FATCA','CRS','QI']
    return (
      <div style={base}><NavBar/>
        <div style={{maxWidth:'700px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q1label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.q1title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q1sub}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px'}}>
            {activeFeatures.map((f,i)=>(
              <div key={i} style={{background:q1Submitted?(q1Answers[i]===f.a?'#f0fdf4':'#fff1f1'):'white',borderRadius:'12px',padding:'14px 16px',border:\`1.5px solid \${q1Submitted?(q1Answers[i]===f.a?'#6ee7b7':'#fca5a5'):'#e5e7eb'}\`,display:'flex',alignItems:'center',gap:'12px'}}>
                <span style={{flex:1,fontSize:'14px',fontWeight:'600',color:'#374151'}}>{f.q}</span>
                <div style={{display:'flex',gap:'6px'}}>
                  {options.map(opt=>(
                    <button key={opt} onClick={()=>!q1Submitted&&setQ1Answers(a=>({...a,[i]:opt}))}
                      style={{padding:'6px 14px',borderRadius:'8px',border:'none',cursor:q1Submitted?'default':'pointer',fontSize:'12px',fontWeight:'700',
                        background:q1Submitted?(opt===f.a?'#059669':opt===q1Answers[i]?'#dc2626':'#e5e7eb'):(q1Answers[i]===opt?C:'#f3f4f6'),
                        color:q1Submitted?(opt===f.a||opt===q1Answers[i]?'white':'#9ca3af'):(q1Answers[i]===opt?'white':'#374151')}}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!q1Submitted?(
            <button onClick={submitQ1} disabled={Object.keys(q1Answers).length<activeFeatures.length}
              style={{width:'100%',padding:'16px',background:Object.keys(q1Answers).length<activeFeatures.length?'#e5e7eb':C,border:'none',borderRadius:'12px',color:Object.keys(q1Answers).length<activeFeatures.length?'#9ca3af':'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>
              {t.validate} ({Object.keys(q1Answers).length}/{activeFeatures.length})
            </button>
          ):(
            <button onClick={()=>setPhase('quiz2')} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.next2}</button>
          )}
        </div>
      </div>
    )
  }

  if (phase==='quiz2') {
    const q=activeVF[vfIndex]
    return (
      <div style={{...base,background:vfAnimation==='correct'?'#d1fae5':vfAnimation==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar/>
        <div style={{background:vfAnimation==='correct'?'#6ee7b7':vfAnimation==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:\`\${(vfIndex/activeVF.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q2label} \u2014 {vfIndex+1}/{activeVF.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q2title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'18px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
          </div>
          {vfRepondu===null?(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={()=>repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={()=>repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.false}</button>
            </div>
          ):(
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'\ud83c\udf89':'\ud83d\ude05'}</p>
              <p style={{fontWeight:'800',color:vfAnimation==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{vfAnimation==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{q.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(casIndex/activeCas.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} \u2014 {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:\`2px solid \${C}30\`,marginBottom:'16px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>\ud83d\udc64 {cas.profil}</p>
          </div>
          {!casRevealed?(
            <button onClick={()=>{setCasRevealed(true);setCasScore(s=>s+1)}} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
              {lang==='fr'?'\ud83d\udd0d R\u00e9v\u00e9ler la r\u00e9ponse':'\ud83d\udd0d Reveal answer'}
            </button>
          ):(
            <div>
              <div style={{background:\`\${C}10\`,border:\`2px solid \${C}40\`,borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{lang==='fr'?'Dispositifs applicables':'Applicable frameworks'}</p>
                <p style={{margin:'0 0 12px',fontSize:'18px',fontWeight:'800',color:'#1f2937'}}>{cas.dispositifs}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>\ud83d\udca1 {cas.explication}</p>
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',fontSize:'13px',color:'#059669',fontWeight:'600'}}>
                {lang==='fr'?'\u2139\ufe0f Dans tous les cas\u00a0: i-Hub v\u00e9rifie les formulaires et signale au PSF. Le PSF d\u00e9clare.':'\u2139\ufe0f In all cases: i-Hub verifies forms and flags to the PSF. The PSF reports.'}
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
        <h2 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{msg}</h2>
        <p style={{color:'#4b5563',marginBottom:'32px'}}>{t.resultTitle}</p>
        <div style={{background:'white',borderRadius:'20px',padding:'28px',marginBottom:'24px'}}>
          <div style={{fontSize:'52px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'22px'}}>/100</span></div>
          <p style={{color:'#6b7280',margin:'0 0 16px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#f3f4f6',borderRadius:'8px',height:'10px',overflow:'hidden'}}>
            <div style={{background:\`linear-gradient(90deg,\${C},#f59e0b)\`,height:'10px',width:\`\${total}%\`,borderRadius:'8px'}}/>
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
`, 'utf8');
console.log('✅ FATCA vs CRS vs QI écrit !');
