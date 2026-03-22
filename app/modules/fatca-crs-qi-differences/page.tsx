'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '#e07b39'

const UI = {
  fr: {
    title: 'FATCA vs CRS vs QI',
    subtitle: 'Trois dispositifs fiscaux — un seul rôle pour i-Hub : vérifier',
    learn: '📚 Ce que vous allez apprendre :',
    learnItems: [
      'Les différences fondamentales entre FATCA, CRS et QI',
      'Qui est visé par chaque dispositif (nationalité vs résidence)',
      'Le rôle des PSF dans chaque système — et celui d’i-Hub',
      'Quand les trois s’appliquent simultanément au même client final',
      'Les formulaires à vérifier selon le dispositif',
      'Les pièges les plus fréquents lors des vérifications',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '∼20 min',
    start: 'C’est parti ! 🚀', prev: '← Précédent', next: 'Fiche suivante',
    quizBtn: '🎮 Passer aux quiz !', toRetain: 'À RETENIR', goFurther: '🔍 Aller plus loin',
    home: '← Accueil', pts: '🪙',
    q1label: 'QUIZ 1/3 · TABLEAU COMPARATIF', q1title: '📊 FATCA, CRS ou QI ?',
    q1sub: 'Pour chaque caractéristique, quel dispositif s’applique ?',
    q2label: 'QUIZ 2/3 · VRAI OU FAUX', q2title: '✅ Vrai ou Faux',
    true: '✅ VRAI', false: '❌ FAUX', correct: 'Bravo !', wrong: 'Pas tout à fait…',
    q3label: 'QUIZ 3/3 · CAS CLIENT', q3title: '👤 Quel dispositif s’applique ?',
    q3sub: 'Lisez le profil du client final — quels dispositifs le PSF doit-il appliquer ?',
    resultTitle: 'Module terminé — FATCA, CRS et QI n’ont plus de secrets !',
    backHome: '← Retour aux modules', restart: '🔄 Recommencer',
    pts_gained: 'points gagnés', medal_gold: 'Expert comparatif !',
    medal_silver: 'Bon résultat !', medal_bronze: 'Relisez les fiches !',
    score: 'Score', next2: 'Quiz suivant →', last: 'Dernier quiz →',
    validate: 'Valider',
  },
  en: {
    title: 'FATCA vs CRS vs QI',
    subtitle: 'Three tax frameworks — one role for i-Hub: verify',
    learn: '📚 What you will learn:',
    learnItems: [
      'The fundamental differences between FATCA, CRS and QI',
      'Who is targeted by each framework (nationality vs residency)',
      'The role of PSFs in each system — and that of i-Hub',
      'When all three apply simultaneously to the same final client',
      'Which forms to verify depending on the framework',
      'The most common pitfalls during verifications',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '∼20 min',
    start: "Let’s go! 🚀", prev: '← Previous', next: 'Next card',
    quizBtn: '🎮 Go to quizzes!', toRetain: 'KEY TAKEAWAY', goFurther: '🔍 Go further',
    home: '← Home', pts: '🪙',
    q1label: 'QUIZ 1/3 · COMPARISON TABLE', q1title: '📊 FATCA, CRS or QI?',
    q1sub: 'For each characteristic, which framework applies?',
    q2label: 'QUIZ 2/3 · TRUE OR FALSE', q2title: '✅ True or False',
    true: '✅ TRUE', false: '❌ FALSE', correct: 'Well done!', wrong: 'Not quite…',
    q3label: 'QUIZ 3/3 · CLIENT CASE', q3title: '👤 Which framework applies?',
    q3sub: 'Read the final client profile — which frameworks must the PSF apply?',
    resultTitle: 'Module complete — FATCA, CRS and QI hold no more secrets!',
    backHome: '← Back to modules', restart: '🔄 Restart',
    pts_gained: 'points earned', medal_gold: 'Comparison Expert!',
    medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz →', last: 'Last quiz →',
    validate: 'Validate',
  },
}

const FICHES_FR = [
  { id:1, emoji:'🔭', titre:'Vue d’ensemble : trois dispositifs, une même logique', contenu:[
    { icon:'🇺🇸', texte:'**FATCA** (2010) — américain, cible les **US Persons** où qu’elles soient dans le monde' },
    { icon:'🌍', texte:'**CRS** (2014) — OCDE, cible les **résidents fiscaux étrangers** dans 100+ pays' },
    { icon:'💰', texte:'**QI** — américain, régit la **retenue à la source** sur les revenus de source US' },
    { icon:'🔍', texte:'Pour i-Hub : trois dispositifs, un seul rôle — **vérifier la cohérence documentaire** pour le compte des PSF' },
  ], aretenir:'FATCA = nationalité US. CRS = résidence étrangère. QI = revenus US. Les PSF gèrent les trois. i-Hub vérifie les documents.' },

  { id:2, emoji:'🇺🇸', titre:'FATCA en 5 points clés', contenu:[
    { icon:'1️⃣', texte:'**Origine** : loi américaine de 2010, IGA Modèle 1 signé par le Luxembourg en 2014' },
    { icon:'2️⃣', texte:'**Cible** : toute **US Person** (citoyens US, résidents permanents, sociétés US) où qu’elles vivent' },
    { icon:'3️⃣', texte:'**Formulaires** : W-9 (US Person) ou W-8BEN/W-8BEN-E (non-US Person)' },
    { icon:'4️⃣', texte:'**Qui déclare** : les **PSF** luxembourgeois à l’ACD, qui transmet à l’IRS' },
    { icon:'5️⃣', texte:'**Rôle d’i-Hub** : vérifier que le bon formulaire W est présent et cohérent avec le profil du client final' },
  ], aretenir:'FATCA vise qui vous êtes (nationalité). Un Luxembourgeois né à New York reste soumis à FATCA même s’il n’a jamais vécu aux USA.' },

  { id:3, emoji:'🌍', titre:'CRS en 5 points clés', contenu:[
    { icon:'1️⃣', texte:'**Origine** : standard OCDE de 2014, transposé au Luxembourg par la loi du 18 décembre 2015' },
    { icon:'2️⃣', texte:'**Cible** : tout **résident fiscal étranger** — indépendamment de sa nationalité' },
    { icon:'3️⃣', texte:'**Formulaires** : **autocertification** de résidence fiscale + NIF pour chaque pays de résidence' },
    { icon:'4️⃣', texte:'**Qui déclare** : les **PSF** à l’ACD, qui transmet aux autorités fiscales des pays de résidence' },
    { icon:'5️⃣', texte:'**Rôle d’i-Hub** : vérifier la cohérence de l’autocertification et la présence du NIF pour chaque résidence déclarée' },
  ], aretenir:'CRS vise où vous vivez (résidence). Un Français vivant en Suisse est CRS-déclarable pour la Suisse, pas pour la France.' },

  { id:4, emoji:'💲', titre:'QI en 5 points clés', contenu:[
    { icon:'1️⃣', texte:'**Origine** : programme IRS américain optionnel, complémentaire à FATCA' },
    { icon:'2️⃣', texte:'**Cible** : les revenus de **source américaine** (dividendes, intérêts sur titres US) reçus par les clients finaux des PSF' },
    { icon:'3️⃣', texte:'**Enjeu** : appliquer le bon taux de retenue à la source (0%, 15%, 30%) selon le statut du bénéficiaire' },
    { icon:'4️⃣', texte:'**Qui est QI** : le **PSF** lui-même, s’il a signé un accord QI avec l’IRS — pas i-Hub' },
    { icon:'5️⃣', texte:'**Rôle d’i-Hub** : vérifier les formulaires W liés au QI si prévu au SLA — la responsabilité QI reste celle du PSF' },
  ], aretenir:'QI = comment taxer les revenus US. C’est une responsabilité du PSF. i-Hub peut vérifier les formulaires associés si le SLA le prévoit.' },

  { id:5, emoji:'🔄', titre:'FATCA vs CRS : la différence fondamentale', contenu:[
    { icon:'🇺🇸', texte:'**FATCA** → critère de **nationalité/citoyenneté** — vise les US Persons où qu’elles soient' },
    { icon:'🌍', texte:'**CRS** → critère de **résidence fiscale** — vise les résidents étrangers quelle que soit leur nationalité' },
    { icon:'🔄', texte:'Un client final peut être soumis aux **deux** : Américain vivant en France → FATCA (nationalité US) ET CRS (résidence France)' },
    { icon:'📝', texte:'Pour i-Hub : vérifier **les deux** formulaires si nécessaire — W-9 ou W-8 pour FATCA + autocertification pour CRS' },
  ], aretenir:'Un client final peut générer des obligations FATCA ET CRS simultanément. i-Hub doit vérifier les deux types de documents.' },

  { id:6, emoji:'👤', titre:'Trois profils de clients finaux', contenu:[
    { icon:'🇺🇸', texte:'**US Person résidente aux USA** : FATCA uniquement — W-9 à vérifier, pas de CRS (les USA ne participent pas)' },
    { icon:'🔄', texte:'**US Person résidente en France** : FATCA (nationalité US) ET CRS (résidence France) — W-9 + autocertification CRS' },
    { icon:'🌍', texte:'**Non-US résident en Allemagne** : CRS uniquement (résidence étrangère) — W-8BEN + autocertification CRS' },
  ], aretenir:'La combinaison FATCA + CRS dépend du profil du client final. i-Hub vérifie les documents correspondants selon le cas.' },

  { id:7, emoji:'📋', titre:'Les formulaires W : qui remplit quoi', contenu:[
    { icon:'🇺🇸', texte:'**W-9** : rempli par le client final **US Person** — certifie son statut américain et son TIN' },
    { icon:'📝', texte:'**W-8BEN** : rempli par le client final **particulier non-US** — certifie le statut non-américain (valable 3 ans)' },
    { icon:'🏢', texte:'**W-8BEN-E** : rempli par une **entité non-US** — précise la catégorie FATCA (NFFE active, passive, IFE…)' },
    { icon:'🌍', texte:'**Autocertification CRS** : remplie par tout client final — déclare la résidence fiscale et le NIF' },
  ], aretenir:'W-9/W-8 = FATCA. Autocertification = CRS. Un client final peut avoir besoin des deux. i-Hub vérifie leur présence et cohérence.' },

  { id:8, emoji:'🌟', titre:'Quand QI, FATCA et CRS se cumulent', contenu:[
    { icon:'🏦', texte:'Un PSF peut être QI ET gérer des obligations FATCA ET CRS sur le même client final' },
    { icon:'💰', texte:'Exemple : client final américain (FATCA) résident en Suisse (CRS) détenant des actions Apple (QI pour les dividendes US)' },
    { icon:'📝', texte:'Dans ce cas : W-9 (FATCA) + autocertification CRS + formulaires QI — tous à vérifier par i-Hub si prévu au SLA' },
    { icon:'🛑', texte:'Ce cas complexe doit être validé par la **Compliance i-Hub** avant transmission au PSF' },
  ], aretenir:'FATCA + CRS + QI peuvent s’appliquer simultanément. Plus c’est complexe, plus le recours à la Compliance i-Hub est nécessaire.' },

  { id:9, emoji:'🇱🇺', titre:'Le rôle de l’ACD dans les trois dispositifs', contenu:[
    { icon:'🇺🇸', texte:'**FATCA** : les PSF déclarent à l’ACD, qui transmet à l’**IRS** américain (via IGA Modèle 1)' },
    { icon:'🌍', texte:'**CRS** : les PSF déclarent à l’ACD, qui transmet aux **autorités fiscales** des pays de résidence des clients finaux' },
    { icon:'💲', texte:'**QI** : le PSF gère les retenues directement avec les dépositaires US — l’ACD n’est pas au centre du dispositif QI' },
    { icon:'🔍', texte:'i-Hub n’est jamais en contact avec l’ACD — il fournit les données vérifiées **au PSF** qui déclare' },
  ], aretenir:'Dans les trois dispositifs, la déclaration appartient au PSF. i-Hub est en amont, comme vérificateur documentaire.' },

  { id:10, emoji:'⚠️', titre:'Les USA ne participent pas au CRS', contenu:[
    { icon:'🇺🇸', texte:'Les États-Unis ont **refusé de rejoindre le CRS** — ils ont leur propre système (FATCA) qu’ils imposent au monde entier' },
    { icon:'🚨', texte:'Conséquence : un client final américain résident aux USA n’est soumis qu’à FATCA, pas au CRS' },
    { icon:'🔄', texte:'Mais un client final non-américain ayant des actifs aux USA peut avoir des obligations QI (retenue sur dividendes US)' },
    { icon:'📝', texte:'Pour i-Hub : vérifier le formulaire W-8 suffit pour un non-US — pas besoin d’autocertification CRS pour les USA' },
  ], aretenir:'USA = FATCA seulement. Pas de CRS. Les autres pays = CRS. Cette asymmétrie est source de confusion — ne pas l’oublier.' },

  { id:11, emoji:'🏆', titre:'FATCA : les indices d’américanité à connaître', contenu:[
    { icon:'🔴', texte:'Lieu de naissance aux USA, adresse américaine, numéro de téléphone US' },
    { icon:'🔴', texte:'Ordre de virement permanent vers un compte américain, procuration donnée à une personne avec adresse US' },
    { icon:'📌', texte:'Chaque indice détecté par i-Hub doit être **signalé au PSF** — c’est au PSF de demander des clarifications au client final' },
    { icon:'🚫', texte:'i-Hub ne conclut pas seul — il **signale et documente**, le PSF décide de la classification finale' },
  ], aretenir:'Un seul indice d’américanité visible = signal au PSF. i-Hub ne classe pas — il alerte.' },

  { id:12, emoji:'🌍', titre:'CRS : les indices de résidence étrangère', contenu:[
    { icon:'🔴', texte:'Adresse étrangère dans le dossier, numéro de téléphone étranger, virements vers un compte étranger' },
    { icon:'🔴', texte:'Autocertification indiquant une résidence incompatible avec les autres documents d’identité' },
    { icon:'🔴', texte:'NIF absent ou de format incompatible avec le pays de résidence déclaré' },
    { icon:'📌', texte:'Tout indice visible doit être **signalé au PSF** qui sollicite des justificatifs auprès du client final' },
  ], aretenir:'Les indices CRS sont visuels et documentaires. i-Hub les détecte lors de la vérification et les signale au PSF.' },

  { id:13, emoji:'💰', titre:'QI : la retenue à la source en pratique', contenu:[
    { icon:'🇺🇸', texte:'Sans statut QI : retenue de **30%** sur tous les revenus de source US pour les non-US' },
    { icon:'⬇️', texte:'Avec statut QI : taux réduit selon la **convention fiscale** entre le pays du client final et les USA (souvent 0% ou 15%)' },
    { icon:'📋', texte:'Le PSF QI doit identifier le statut fiscal de chaque client final pour appliquer le bon taux' },
    { icon:'🔍', texte:'i-Hub vérifie les formulaires W associés (W-8BEN, W-8BEN-E) si le SLA le prévoit pour les clients détenant des titres US' },
  ], aretenir:'QI = optimiser la retenue fiscale US. C’est une responsabilité du PSF. i-Hub vérifie les formulaires si prévu au SLA.' },

  { id:14, emoji:'🗂️', titre:'Tableau de bord : qui fait quoi', contenu:[
    { icon:'👤', texte:'**Client final** : remplit les formulaires (W-9, W-8, autocertification) et déclare sa situation au PSF' },
    { icon:'🏦', texte:'**PSF** : collecte, classe, déclare à l’ACD (FATCA+CRS) ou gère les retenues QI — responsabilité légale' },
    { icon:'🔍', texte:'**i-Hub** : vérifie la cohérence des formulaires pour le compte du PSF, dans le périmètre du SLA' },
    { icon:'🇱🇺', texte:'**ACD** : reçoit les déclarations FATCA+CRS des PSF et les transmet aux autorités compétentes' },
  ], aretenir:'Client final → PSF → ACD/IRS. i-Hub est entre le client final et le PSF, comme vérificateur. Jamais dans la chaîne de déclaration.' },

  { id:15, emoji:'🤔', titre:'Les erreurs les plus fréquentes', contenu:[
    { icon:'❌', texte:'Confondre **nationalité et résidence** — un Français vivant au Luxembourg n’est pas déclarable en France sous CRS' },
    { icon:'❌', texte:'Ignorer qu’un client final peut être soumis aux **deux dispositifs** (FATCA + CRS) simultanément' },
    { icon:'❌', texte:'Accepter un W-8BEN sans vérifier les **indices d’américanité** visibles dans le dossier' },
    { icon:'❌', texte:'Croire qu’un formulaire signé suffit — i-Hub doit toujours vérifier la **cohérence** avec les autres documents' },
  ], aretenir:'Les erreurs naissent souvent de la confusion nationalité/résidence et du manque de vérification croisée des documents.' },

  { id:16, emoji:'📅', titre:'Les échéances clés', contenu:[
    { icon:'📋', texte:'**FATCA et CRS** : déclaration annuelle du PSF à l’ACD avant le **30 juin** de l’année suivante' },
    { icon:'📝', texte:'**W-8BEN** : valable **3 ans** — i-Hub signale les formulaires expirés détectés lors de ses vérifications' },
    { icon:'🔄', texte:'**Autocertification CRS** : à renouveler si changement de circonstances du client final dans les **90 jours**' },
    { icon:'🇹🇩', texte:'**Dividendes US (QI)** : retenue appliquée lors de chaque versement — pas de délai annuel' },
  ], aretenir:'30 juin = déclaration FATCA+CRS. 3 ans = validité W-8BEN. 90 jours = renouvellement autocertification. Ces délais s’appliquent aux PSF.' },

  { id:17, emoji:'🔒', titre:'Conservation et confidentialité', contenu:[
    { icon:'📅', texte:'Tous les formulaires (W-9, W-8, autocertifications) doivent être conservés **au moins 5 ans** après la fin de la relation' },
    { icon:'🔒', texte:'Ces données sont couvertes par le **secret professionnel PSF** et le **RGPD** — strictement confidentielles' },
    { icon:'📤', texte:'i-Hub transmet les données vérifiées au PSF via des **canaux sécurisés** prévus au SLA — jamais à l’ACD ou à l’IRS' },
    { icon:'💻', texte:'i-Hub doit également archiver ses propres **rapports de vérification** pour prouver sa diligence en cas de contrôle' },
  ], aretenir:'i-Hub ne transmet qu’au PSF. Jamais à l’ACD, jamais à l’IRS. Les données fiscales sont parmi les plus sensibles.' },

  { id:18, emoji:'🚨', titre:'Quand alerter la Compliance i-Hub', contenu:[
    { icon:'🔴', texte:'Client final soumis à **FATCA + CRS + QI** simultanément — cas complexe à valider' },
    { icon:'🔴', texte:'Indices contradictoires entre les formulaires FATCA et l’autocertification CRS du même client final' },
    { icon:'🔴', texte:'Formulaires W **incomplets ou incohérents** sans justification claire' },
    { icon:'🔴', texte:'Demande du PSF d’aller **au-delà du SLA** — toujours clarifier le périmètre avant d’agir' },
  ], aretenir:'Tout cas complexe ou ambigu doit passer par la Compliance i-Hub avant d’être transmis au PSF. Ne jamais trancher seul.' },

  { id:19, emoji:'🎓', titre:'Ce que i-Hub doit connaître parfaitement', contenu:[
    { icon:'📚', texte:'**Les formulaires** : W-9, W-8BEN, W-8BEN-E, autocertification CRS — savoir ce que chacun certifie' },
    { icon:'🔍', texte:'**Les indices** : américanité (FATCA) et résidence étrangère (CRS) — savoir les détecter visuellement' },
    { icon:'🚨', texte:'**Les red flags** : incohérences entre formulaires, formulaires expirés, NIF incompatibles' },
    { icon:'📜', texte:'**Son périmètre** : ce que le SLA lui demande de vérifier et ce qui reste de la responsabilité du PSF' },
  ], aretenir:'Connaître les formulaires + détecter les indices + respecter le SLA = les trois piliers du travail de vérification i-Hub.' },

  { id:20, emoji:'💡', titre:'Résumé : FATCA vs CRS vs QI en un coup d’œil', contenu:[
    { icon:'🇺🇸', texte:'**FATCA** : nationalité US → W-9 ou W-8 → PSF déclare à ACD → ACD transmet à IRS' },
    { icon:'🌍', texte:'**CRS** : résidence étrangère → autocertification + NIF → PSF déclare à ACD → ACD transmet au pays de résidence' },
    { icon:'💰', texte:'**QI** : revenus US → formulaires W → PSF applique la bonne retenue → reversement à l’IRS' },
    { icon:'🔍', texte:'**i-Hub dans les trois cas** : vérifie les formulaires, signale les incohérences au PSF, documente — jamais déclarant' },
  ], aretenir:'Trois dispositifs, un seul rôle pour i-Hub : vérifier et signaler. Le PSF déclare et assume la responsabilité légale.' },
]

const FICHES_EN = [
  { id:1, emoji:'🔭', titre:'Overview: three frameworks, one logic', contenu:[
    { icon:'🇺🇸', texte:'**FATCA** (2010) — US, targets **US Persons** wherever they are in the world' },
    { icon:'🌍', texte:'**CRS** (2014) — OECD, targets **foreign tax residents** across 100+ countries' },
    { icon:'💰', texte:'**QI** — US, governs **withholding tax** on US-source income' },
    { icon:'🔍', texte:'For i-Hub: three frameworks, one role — **verify documentary consistency** on behalf of PSFs' },
  ], aretenir:'FATCA = US nationality. CRS = foreign residency. QI = US income. PSFs manage all three. i-Hub verifies the documents.' },
  { id:2, emoji:'🇺🇸', titre:'FATCA in 5 key points', contenu:[
    { icon:'1️⃣', texte:'**Origin**: US law of 2010, Model 1 IGA signed by Luxembourg in 2014' },
    { icon:'2️⃣', texte:'**Target**: any **US Person** (US citizens, permanent residents, US entities) wherever they live' },
    { icon:'3️⃣', texte:'**Forms**: W-9 (US Person) or W-8BEN/W-8BEN-E (non-US Person)' },
    { icon:'4️⃣', texte:'**Who reports**: **PSFs** to the ACD, which forwards to the IRS' },
    { icon:'5️⃣', texte:'**i-Hub’s role**: verify that the correct W form is present and consistent with the final client’s profile' },
  ], aretenir:'FATCA targets who you are (nationality). A Luxembourger born in New York remains subject to FATCA even if they never lived in the US.' },
  { id:3, emoji:'🌍', titre:'CRS in 5 key points', contenu:[
    { icon:'1️⃣', texte:'**Origin**: OECD standard of 2014, transposed in Luxembourg by the Law of 18 December 2015' },
    { icon:'2️⃣', texte:'**Target**: any **foreign tax resident** — regardless of nationality' },
    { icon:'3️⃣', texte:'**Forms**: **self-certification** of tax residency + TIN for each country of residence' },
    { icon:'4️⃣', texte:'**Who reports**: **PSFs** to the ACD, which forwards to the tax authorities of the countries of residence' },
    { icon:'5️⃣', texte:'**i-Hub’s role**: verify consistency of the self-certification and presence of the TIN for each declared residency' },
  ], aretenir:'CRS targets where you live (residency). A French national living in Switzerland is CRS-reportable for Switzerland, not France.' },
  { id:4, emoji:'💲', titre:'QI in 5 key points', contenu:[
    { icon:'1️⃣', texte:'**Origin**: optional IRS programme, complementary to FATCA' },
    { icon:'2️⃣', texte:'**Target**: **US-source income** (dividends, interest on US securities) received by PSFs’ final clients' },
    { icon:'3️⃣', texte:'**Issue**: applying the correct withholding rate (0%, 15%, 30%) based on the beneficiary’s status' },
    { icon:'4️⃣', texte:'**Who is QI**: the **PSF** itself, if it has signed a QI agreement with the IRS — not i-Hub' },
    { icon:'5️⃣', texte:'**i-Hub’s role**: verify QI-related W forms if specified in the SLA — QI responsibility remains with the PSF' },
  ], aretenir:'QI = how to tax US income. It is a PSF responsibility. i-Hub may verify associated forms if the SLA provides for it.' },
  { id:5, emoji:'🔄', titre:'FATCA vs CRS: the fundamental difference', contenu:[
    { icon:'🇺🇸', texte:'**FATCA** → **nationality/citizenship** criterion — targets US Persons wherever they are' },
    { icon:'🌍', texte:'**CRS** → **tax residency** criterion — targets foreign residents regardless of nationality' },
    { icon:'🔄', texte:'A final client can be subject to **both**: US national living in France → FATCA (US nationality) AND CRS (French residency)' },
    { icon:'📝', texte:'For i-Hub: verify **both** form types if necessary — W-9 or W-8 for FATCA + self-certification for CRS' },
  ], aretenir:'A final client can generate FATCA AND CRS obligations simultaneously. i-Hub must verify both types of documents.' },
  { id:6, emoji:'👤', titre:'Three final client profiles', contenu:[
    { icon:'🇺🇸', texte:'**US Person resident in the US**: FATCA only — W-9 to verify, no CRS (US does not participate)' },
    { icon:'🔄', texte:'**US Person resident in France**: FATCA (US nationality) AND CRS (French residency) — W-9 + CRS self-certification' },
    { icon:'🌍', texte:'**Non-US resident in Germany**: CRS only (foreign residency) — W-8BEN + CRS self-certification' },
  ], aretenir:'The FATCA + CRS combination depends on the final client’s profile. i-Hub verifies the corresponding documents for each case.' },
  { id:7, emoji:'📋', titre:'W forms: who fills what', contenu:[
    { icon:'🇺🇸', texte:'**W-9**: completed by **US Person** final client — certifies US status and TIN' },
    { icon:'📝', texte:'**W-8BEN**: completed by **non-US individual** final client — certifies non-US status (valid 3 years)' },
    { icon:'🏢', texte:'**W-8BEN-E**: completed by a **non-US entity** — specifies FATCA category (active NFFE, passive, FFI…)' },
    { icon:'🌍', texte:'**CRS self-certification**: completed by any final client — declares tax residency and TIN' },
  ], aretenir:'W-9/W-8 = FATCA. Self-certification = CRS. A final client may need both. i-Hub verifies their presence and consistency.' },
  { id:8, emoji:'🌟', titre:'When QI, FATCA and CRS all apply', contenu:[
    { icon:'🏦', texte:'A PSF can be QI AND manage FATCA AND CRS obligations for the same final client' },
    { icon:'💰', texte:'Example: US final client (FATCA) resident in Switzerland (CRS) holding Apple shares (QI for US dividends)' },
    { icon:'📝', texte:'In this case: W-9 (FATCA) + CRS self-certification + QI forms — all to be verified by i-Hub if in SLA scope' },
    { icon:'🛑', texte:'This complex case must be validated by **i-Hub Compliance** before transmission to the PSF' },
  ], aretenir:'FATCA + CRS + QI can apply simultaneously. The more complex the case, the more i-Hub Compliance involvement is needed.' },
  { id:9, emoji:'🇱🇺', titre:'The ACD’s role in all three frameworks', contenu:[
    { icon:'🇺🇸', texte:'**FATCA**: PSFs report to the ACD, which forwards to the **IRS** (via Model 1 IGA)' },
    { icon:'🌍', texte:'**CRS**: PSFs report to the ACD, which forwards to the **tax authorities** of final clients’ countries of residence' },
    { icon:'💲', texte:'**QI**: the PSF manages withholding directly with US depositaries — the ACD is not central to QI' },
    { icon:'🔍', texte:'i-Hub is never in contact with the ACD — it provides verified data **to the PSF** which then reports' },
  ], aretenir:'In all three frameworks, reporting belongs to the PSF. i-Hub is upstream, as a documentary verifier.' },
  { id:10, emoji:'⚠️', titre:'The US does not participate in CRS', contenu:[
    { icon:'🇺🇸', texte:'The United States **refused to join CRS** — they have their own system (FATCA) which they impose on the world' },
    { icon:'🚨', texte:'Consequence: a US final client resident in the US is subject to FATCA only, not CRS' },
    { icon:'🔄', texte:'But a non-US final client holding US assets may have QI obligations (withholding on US dividends)' },
    { icon:'📝', texte:'For i-Hub: verifying W-8 is sufficient for a non-US person — no CRS self-certification needed for the US' },
  ], aretenir:'US = FATCA only. No CRS. Other countries = CRS. This asymmetry is a frequent source of confusion — do not forget it.' },
  { id:11, emoji:'🏆', titre:'FATCA: US indicia to know', contenu:[
    { icon:'🔴', texte:'US birthplace, US address, US phone number' },
    { icon:'🔴', texte:'Standing transfer to a US account, power of attorney to a person with a US address' },
    { icon:'📌', texte:'Each indicium detected by i-Hub must be **flagged to the PSF** — it is up to the PSF to seek clarification from the final client' },
    { icon:'🚫', texte:'i-Hub does not conclude alone — it **flags and documents**, the PSF makes the final classification decision' },
  ], aretenir:'A single visible US indicium = flag to PSF. i-Hub does not classify — it alerts.' },
  { id:12, emoji:'🌍', titre:'CRS: foreign residency indicia', contenu:[
    { icon:'🔴', texte:'Foreign address in the file, foreign phone number, transfers to a foreign account' },
    { icon:'🔴', texte:'Self-certification indicating a residency incompatible with other identity documents' },
    { icon:'🔴', texte:'Missing TIN or TIN format incompatible with the declared country of residence' },
    { icon:'📌', texte:'Any visible indicium must be **flagged to the PSF** which seeks supporting documents from the final client' },
  ], aretenir:'CRS indicia are visual and documentary. i-Hub detects them during verification and flags them to the PSF.' },
  { id:13, emoji:'💰', titre:'QI: withholding tax in practice', contenu:[
    { icon:'🇺🇸', texte:'Without QI status: **30% withholding** on all US-source income for non-US persons' },
    { icon:'⬇️', texte:'With QI status: reduced rate under the **tax treaty** between the final client’s country and the US (often 0% or 15%)' },
    { icon:'📋', texte:'The QI PSF must identify each final client’s tax status to apply the correct rate' },
    { icon:'🔍', texte:'i-Hub verifies associated W forms (W-8BEN, W-8BEN-E) if the SLA provides for it for clients holding US securities' },
  ], aretenir:'QI = optimising US tax withholding. It is a PSF responsibility. i-Hub verifies the forms if specified in the SLA.' },
  { id:14, emoji:'🗂️', titre:'Dashboard: who does what', contenu:[
    { icon:'👤', texte:'**Final client**: completes forms (W-9, W-8, self-certification) and declares their situation to the PSF' },
    { icon:'🏦', texte:'**PSF**: collects, classifies, reports to ACD (FATCA+CRS) or manages QI withholding — legal responsibility' },
    { icon:'🔍', texte:'**i-Hub**: verifies form consistency on behalf of the PSF, within the SLA scope' },
    { icon:'🇱🇺', texte:'**ACD**: receives FATCA+CRS declarations from PSFs and forwards them to the relevant authorities' },
  ], aretenir:'Final client → PSF → ACD/IRS. i-Hub is between the final client and the PSF, as verifier. Never in the reporting chain.' },
  { id:15, emoji:'🤔', titre:'The most common mistakes', contenu:[
    { icon:'❌', texte:'Confusing **nationality and residency** — a French national living in Luxembourg is not CRS-reportable to France' },
    { icon:'❌', texte:'Missing that a final client may be subject to **both frameworks** (FATCA + CRS) simultaneously' },
    { icon:'❌', texte:'Accepting a W-8BEN without checking for **visible US indicia** in the file' },
    { icon:'❌', texte:'Believing a signed form is sufficient — i-Hub must always verify **consistency** with other documents' },
  ], aretenir:'Mistakes often arise from confusing nationality/residency and lack of cross-document verification.' },
  { id:16, emoji:'📅', titre:'Key deadlines', contenu:[
    { icon:'📋', texte:'**FATCA and CRS**: annual PSF declaration to the ACD before **30 June** of the following year' },
    { icon:'📝', texte:'**W-8BEN**: valid **3 years** — i-Hub flags expired forms detected during its verifications' },
    { icon:'🔄', texte:'**CRS self-certification**: to be renewed on change of circumstances within **90 days**' },
    { icon:'🇹🇩', texte:'**US dividends (QI)**: withholding applied at each payment — no annual deadline' },
  ], aretenir:'30 June = FATCA+CRS reporting. 3 years = W-8BEN validity. 90 days = self-certification renewal. These deadlines apply to PSFs.' },
  { id:17, emoji:'🔒', titre:'Retention and confidentiality', contenu:[
    { icon:'📅', texte:'All forms (W-9, W-8, self-certifications) must be retained for **at least 5 years** after end of relationship' },
    { icon:'🔒', texte:'This data is covered by **PSF professional secrecy** and **GDPR** — strictly confidential' },
    { icon:'📤', texte:'i-Hub transmits verified data to the PSF via **secure channels** per the SLA — never to the ACD or IRS' },
    { icon:'💻', texte:'i-Hub must also archive its own **verification reports** to demonstrate diligence in case of audit' },
  ], aretenir:'i-Hub only transmits to the PSF. Never to the ACD, never to the IRS. Tax data is among the most sensitive.' },
  { id:18, emoji:'🚨', titre:'When to alert i-Hub Compliance', contenu:[
    { icon:'🔴', texte:'Final client subject to **FATCA + CRS + QI** simultaneously — complex case to validate' },
    { icon:'🔴', texte:'Contradictory indicia between FATCA forms and the CRS self-certification of the same final client' },
    { icon:'🔴', texte:'**Incomplete or inconsistent** W forms without clear justification' },
    { icon:'🔴', texte:'PSF request to go **beyond the SLA** — always clarify scope before acting' },
  ], aretenir:'Any complex or ambiguous case must go through i-Hub Compliance before being transmitted to the PSF. Never decide alone.' },
  { id:19, emoji:'🎓', titre:'What i-Hub must know perfectly', contenu:[
    { icon:'📚', texte:'**The forms**: W-9, W-8BEN, W-8BEN-E, CRS self-certification — knowing what each certifies' },
    { icon:'🔍', texte:'**The indicia**: US status (FATCA) and foreign residency (CRS) — knowing how to detect them visually' },
    { icon:'🚨', texte:'**Red flags**: inconsistencies between forms, expired forms, incompatible TINs' },
    { icon:'📜', texte:'**Its scope**: what the SLA asks it to verify and what remains the PSF’s responsibility' },
  ], aretenir:'Know the forms + detect indicia + respect the SLA = the three pillars of i-Hub’s verification work.' },
  { id:20, emoji:'💡', titre:'Summary: FATCA vs CRS vs QI at a glance', contenu:[
    { icon:'🇺🇸', texte:'**FATCA**: US nationality → W-9 or W-8 → PSF reports to ACD → ACD forwards to IRS' },
    { icon:'🌍', texte:'**CRS**: foreign residency → self-cert + TIN → PSF reports to ACD → ACD forwards to country of residence' },
    { icon:'💰', texte:'**QI**: US income → W forms → PSF applies correct withholding → remits to IRS' },
    { icon:'🔍', texte:'**i-Hub in all three**: verifies forms, flags inconsistencies to PSF, documents — never the reporter' },
  ], aretenir:'Three frameworks, one role for i-Hub: verify and flag. The PSF reports and bears legal responsibility.' },
]

const VF_FR = [
  { texte:'FATCA se base sur la nationalité américaine', reponse:true, explication:'Exact ! FATCA cible les US Persons où qu’elles vivent — critère de nationalité.' },
  { texte:'CRS se base sur la nationalité du client final', reponse:false, explication:'Non ! CRS se base sur la résidence fiscale, pas la nationalité.' },
  { texte:'Les USA participent au CRS comme les autres pays', reponse:false, explication:'Non ! Les USA ont refusé de rejoindre le CRS. Ils ont FATCA à la place.' },
  { texte:'Un client final peut être soumis à FATCA et CRS simultanément', reponse:true, explication:'Exact ! Un Américain résident en France est soumis aux deux.' },
  { texte:'i-Hub déclare les données FATCA à l’ACD', reponse:false, explication:'Non ! Ce sont les PSF qui déclarent à l’ACD. i-Hub vérifie les documents.' },
  { texte:'Le W-9 est rempli par les US Persons', reponse:true, explication:'Exact ! Le W-9 certifie le statut américain et le TIN.' },
  { texte:'Le QI est un système de déclaration des comptes', reponse:false, explication:'Non ! QI concerne la retenue à la source sur les revenus de source US, pas la déclaration de comptes.' },
  { texte:'i-Hub peut classifier un client final comme US Person sans en informer le PSF', reponse:false, explication:'Non ! i-Hub signale et documente — la classification appartient toujours au PSF.' },
  { texte:'Un Français vivant au Luxembourg est déclarable CRS pour la France', reponse:false, explication:'Non ! CRS = résidence. Un Français résident au Luxembourg est déclarable pour le Luxembourg, pas pour la France.' },
  { texte:'Le W-8BEN est valable 3 ans', reponse:true, explication:'Exact ! Toute date d’expiration doit être vérifiée lors des contrôles i-Hub.' },
]
const VF_EN = [
  { texte:'FATCA is based on US nationality', reponse:true, explication:'Correct! FATCA targets US Persons wherever they live — nationality criterion.' },
  { texte:'CRS is based on the final client’s nationality', reponse:false, explication:'No! CRS is based on tax residency, not nationality.' },
  { texte:'The US participates in CRS like other countries', reponse:false, explication:'No! The US refused to join CRS. They have FATCA instead.' },
  { texte:'A final client can be subject to both FATCA and CRS simultaneously', reponse:true, explication:'Correct! A US national resident in France is subject to both.' },
  { texte:'i-Hub reports FATCA data to the ACD', reponse:false, explication:'No! PSFs report to the ACD. i-Hub verifies the documents.' },
  { texte:'The W-9 is completed by US Persons', reponse:true, explication:'Correct! The W-9 certifies US status and TIN.' },
  { texte:'QI is a system for reporting accounts', reponse:false, explication:'No! QI concerns withholding on US-source income, not account reporting.' },
  { texte:'i-Hub can classify a final client as a US Person without informing the PSF', reponse:false, explication:'No! i-Hub flags and documents — classification always belongs to the PSF.' },
  { texte:'A French national living in Luxembourg is CRS-reportable to France', reponse:false, explication:'No! CRS = residency. A French national resident in Luxembourg is reportable to Luxembourg, not France.' },
  { texte:'The W-8BEN is valid for 3 years', reponse:true, explication:'Correct! Any expiry date must be checked during i-Hub verifications.' },
]

const CAS_FR = [
  { profil:'Client final : Mme Chen, citoyenne américaine et française, résidente à Paris. Détient des actions Apple.', dispositifs:'FATCA + CRS + QI (potentiellement)', explication:'Américaine = FATCA (W-9). Résidente France = CRS (autocertification). Actions Apple = revenus US potentiels soumis à QI.' },
  { profil:'Client final : M. Müller, Allemand résident en Allemagne. Pas d’actifs américains.', dispositifs:'CRS uniquement', explication:'Non-américain = pas de FATCA. Résident étranger = CRS. Pas d’actifs US = QI non pertinent.' },
  { profil:'Client final : Société luxembourgeoise dont l’actionnaire principal (60%) est américain.', dispositifs:'FATCA (NFFE passive — UBO américain à signaler)', explication:'Entité LU = pas CRS pour l’entité. Mais actionnaire US à 60% = FATCA (NFFE passive). i-Hub signale au PSF.' },
  { profil:'Client final : M. Tanaka, Japonais résident aux USA (Green Card).', dispositifs:'FATCA uniquement (les USA ne participent pas au CRS)', explication:'Green Card = US Person = FATCA (W-9). Résident aux USA = pas de CRS (les USA ne participent pas).' },
  { profil:'Client final : Fonds d’investissement belge, IFE participant au CRS.', dispositifs:'CRS (entité étrangère) + FATCA (W-8BEN-E avec GIIN)', explication:'IFE participante = W-8BEN-E avec GIIN pour FATCA. Entité belge = CRS. i-Hub vérifie les deux formulaires.' },
]
const CAS_EN = [
  { profil:'Final client: Ms Chen, US and French citizen, resident in Paris. Holds Apple shares.', dispositifs:'FATCA + CRS + QI (potentially)', explication:'US national = FATCA (W-9). French resident = CRS (self-cert). Apple shares = potential US income subject to QI.' },
  { profil:'Final client: Mr Müller, German national resident in Germany. No US assets.', dispositifs:'CRS only', explication:'Non-US = no FATCA. Foreign resident = CRS. No US assets = QI not relevant.' },
  { profil:'Final client: Luxembourg company whose main shareholder (60%) is American.', dispositifs:'FATCA (passive NFFE — US UBO to flag)', explication:'LU entity = no CRS for entity. But 60% US shareholder = FATCA (passive NFFE). i-Hub flags to PSF.' },
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
    { q:'Base sur la nationalité américaine', a:'FATCA' },
    { q:'Base sur la résidence fiscale', a:'CRS' },
    { q:'Concerne les revenus de source US', a:'QI' },
    { q:'Créé par l’OCDE', a:'CRS' },
    { q:'Créé par les États-Unis en 2010', a:'FATCA' },
    { q:'Formulaire W-9 ou W-8', a:'FATCA' },
    { q:'Autocertification + NIF', a:'CRS' },
    { q:'Retenue à la source 0% à 30%', a:'QI' },
    { q:'Plus de 100 pays participants', a:'CRS' },
    { q:'IGA Modèle 1 signé par le Luxembourg', a:'FATCA' },
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
      <button onClick={()=>router.push('/')} style={{background:'none',border:`1px solid ${C}`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🔭 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l=><button key={l} onClick={()=>switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
        </div>
        <span style={{background:'white',border:`1px solid ${C}`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase==='intro') return (
    <div style={base}><NavBar/>
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🔭</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i)=><div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>✓</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.quiz,icon:'🎮'},{label:t.time,icon:'⏱️'}].map((b,i)=><div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={()=>setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
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
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'220px'}}>
              {FICHES.map((_,i)=><div key={i} onClick={()=>{setFicheIndex(i);setPlusLoinOpen(false)}} style={{width:'8px',height:'8px',borderRadius:'50%',background:i===ficheIndex?C:i<ficheIndex?C+'60':'#d1d5db',cursor:'pointer'}}/>)}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'20px',border:`2px solid ${C}30`,boxShadow:`0 8px 40px ${C}15`}}>
            <div style={{background:C,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'10px'}}>{fiche.emoji}</div>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:'800',margin:0}}>{fiche.titre}</h2>
            </div>
            <div style={{padding:'20px'}}>
              {fiche.contenu.map((item,i)=>(
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
            {ficheIndex>0&&<button onClick={()=>{setFicheIndex(i=>i-1);setPlusLoinOpen(false)}} style={{flex:1,padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:'#6b7280',cursor:'pointer',fontWeight:'600'}}>{t.prev}</button>}
            <button onClick={()=>ficheIndex<FICHES.length-1?(setFicheIndex(i=>i+1),setPlusLoinOpen(false)):setPhase('quiz1')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex<FICHES.length-1?`${t.next} (${ficheIndex+2}/${FICHES.length}) →`:t.quizBtn}
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
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q1label}</span>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{t.q1title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q1sub}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px'}}>
            {activeFeatures.map((f,i)=>(
              <div key={i} style={{background:'white',borderRadius:'12px',padding:'14px 16px',border:`1.5px solid ${q1Submitted?(q1Answers[i]===f.a?'#6ee7b7':'#fca5a5'):'#e5e7eb'}`,display:'flex',alignItems:'center',gap:'12px',background:q1Submitted?(q1Answers[i]===f.a?'#f0fdf4':'#fff1f1'):'white'}}>
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
          <div style={{background:C,height:'6px',width:`${(vfIndex/activeVF.length)*100}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q2label} — {vfIndex+1}/{activeVF.length}</span>
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
            <div style={{background:vfAnimation==='correct'?'#d1fae5':'#fee2e2',border:`2px solid ${vfAnimation==='correct'?'#6ee7b7':'#fca5a5'}`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnimation==='correct'?'🎉':'😅'}</p>
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
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:`${(casIndex/activeCas.length)*100}%`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:`${C}15`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:'0 0 6px'}}>{t.q3title}</h2>
            <p style={{color:'#6b7280',fontSize:'14px',margin:0}}>{t.q3sub}</p>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'24px',border:`2px solid ${C}30`,marginBottom:'16px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>👤 {cas.profil}</p>
          </div>
          {!casRevealed?(
            <button onClick={()=>{setCasRevealed(true);setCasScore(s=>s+1)}} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
              {lang==='fr'?'🔍 Révéler la réponse':'🔍 Reveal answer'}
            </button>
          ):(
            <div>
              <div style={{background:`${C}10`,border:`2px solid ${C}40`,borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
                <p style={{margin:'0 0 8px',fontSize:'12px',fontWeight:'700',color:C,textTransform:'uppercase',letterSpacing:'1px'}}>{lang==='fr'?'Dispositifs applicables':'Applicable frameworks'}</p>
                <p style={{margin:'0 0 12px',fontSize:'18px',fontWeight:'800',color:'#1f2937'}}>{cas.dispositifs}</p>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>💡 {cas.explication}</p>
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',fontSize:'13px',color:'#059669',fontWeight:'600'}}>
                {lang==='fr'?'ℹ️ Dans tous les cas : i-Hub vérifie les formulaires et signale au PSF. Le PSF déclare.':'ℹ️ In all cases: i-Hub verifies forms and flags to the PSF. The PSF reports.'}
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
        <h2 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',margin:'0 0 8px'}}>{msg}</h2>
        <p style={{color:'#4b5563',marginBottom:'32px'}}>{t.resultTitle}</p>
        <div style={{background:'white',borderRadius:'20px',padding:'28px',marginBottom:'24px'}}>
          <div style={{fontSize:'52px',fontWeight:'800',color:C,marginBottom:'4px'}}>{total}<span style={{fontSize:'22px'}}>/100</span></div>
          <p style={{color:'#6b7280',margin:'0 0 16px',fontSize:'14px'}}>{t.score}</p>
          <div style={{background:'#f3f4f6',borderRadius:'8px',height:'10px',overflow:'hidden'}}>
            <div style={{background:`linear-gradient(90deg,${C},#f59e0b)`,height:'10px',width:`${total}%`,borderRadius:'8px'}}/>
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
