const fs = require('fs');
const PINK = '#e91e8c';

fs.mkdirSync('app/modules/aml-name-screening', { recursive: true });
fs.writeFileSync('app/modules/aml-name-screening/page.tsx', `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLang, setLang as saveLang } from '@/lib/lang'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pickRandom<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

const C = '${PINK}'

const UI = {
  fr: {
    title: 'Name Screening',
    subtitle: 'Cr\u00e9ibler les noms contre les listes de sanctions \u2014 le r\u00f4le pr\u00e9cis d\u2019i-Hub',
    learn: '\ud83d\udcda Ce que vous allez apprendre\u00a0:',
    learnItems: [
      'Ce qu\u2019est le Name Screening et pourquoi il existe',
      'Les principales listes de sanctions (ONU, UE, OFAC\u2026)',
      'La diff\u00e9rence entre un vrai match et un faux positif',
      'Le processus de screening\u00a0: comment \u00e7a marche',
      'Ce que fait i-Hub en cas de match',
      'L\u2019importance de l\u2019exactitude de la saisie des noms',
    ],
    fiches: '20 fiches', quiz: '3 quiz', time: '\u223c20 min',
    start: "C\u2019est parti\u00a0! \ud83d\ude80", prev: '\u2190 Pr\u00e9c\u00e9dent', next: 'Fiche suivante',
    quizBtn: '\ud83c\udfae Passer aux quiz\u00a0!', toRetain: '\u00c0 RETENIR',
    home: '\u2190 Accueil', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 VRAI MATCH OU FAUX POSITIF\u00a0?',
    q1title: '\ud83d\udd0d Ce r\u00e9sultat est-il un vrai match ou un faux positif\u00a0?',
    match: '\ud83d\udea8 Vrai match \u2014 Escalader', fp: '\ud83d\udfe2 Faux positif \u2014 Documenter',
    q2label: 'QUIZ 2/3 \u00b7 VRAI OU FAUX', q2title: '\u2705 Vrai ou Faux \u2014 Name Screening',
    true: '\u2705 VRAI', false: '\u274c FAUX', correct: 'Bravo\u00a0!', wrong: 'Pas tout \u00e0 fait\u2026',
    q3label: 'QUIZ 3/3 \u00b7 CAS PRATIQUES', q3title: '\ud83e\udd14 Quelle est la bonne action\u00a0?',
    resultTitle: 'Module Name Screening termin\u00e9 \u2014 Vous g\u00e9rez les listes de sanctions\u00a0!',
    backHome: '\u2190 Retour', restart: '\ud83d\udd04 Recommencer',
    medal_gold: 'Expert Screening\u00a0!', medal_silver: 'Bon r\u00e9sultat\u00a0!', medal_bronze: 'Relisez les fiches\u00a0!',
    score: 'Score', next2: 'Quiz suivant \u2192', last: 'Terminer \u2192',
  },
  en: {
    title: 'Name Screening',
    subtitle: 'Screening names against sanctions lists \u2014 i-Hub\u2019s precise role',
    learn: '\ud83d\udcda What you will learn:',
    learnItems: [
      'What Name Screening is and why it exists',
      'The main sanctions lists (UN, EU, OFAC\u2026)',
      'The difference between a true match and a false positive',
      'The screening process: how it works',
      'What i-Hub does in case of a match',
      'The importance of accurate name entry',
    ],
    fiches: '20 cards', quiz: '3 quizzes', time: '\u223c20 min',
    start: "Let\u2019s go! \ud83d\ude80", prev: '\u2190 Previous', next: 'Next card',
    quizBtn: '\ud83c\udfae Go to quizzes!', toRetain: 'KEY TAKEAWAY',
    home: '\u2190 Home', pts: '\ud83e\ude99',
    q1label: 'QUIZ 1/3 \u00b7 TRUE MATCH OR FALSE POSITIVE?',
    q1title: '\ud83d\udd0d Is this result a true match or a false positive?',
    match: '\ud83d\udea8 True match \u2014 Escalate', fp: '\ud83d\udfe2 False positive \u2014 Document',
    q2label: 'QUIZ 2/3 \u00b7 TRUE OR FALSE', q2title: '\u2705 True or False \u2014 Name Screening',
    true: '\u2705 TRUE', false: '\u274c FALSE', correct: 'Well done!', wrong: 'Not quite\u2026',
    q3label: 'QUIZ 3/3 \u00b7 CASE STUDIES', q3title: '\ud83e\udd14 What is the correct action?',
    resultTitle: 'Name Screening module complete \u2014 You handle sanctions lists!',
    backHome: '\u2190 Back', restart: '\ud83d\udd04 Restart',
    medal_gold: 'Screening Expert!', medal_silver: 'Good result!', medal_bronze: 'Review the cards!',
    score: 'Score', next2: 'Next quiz \u2192', last: 'Finish \u2192',
  },
}

const FICHES_FR = [
  { id:1, emoji:'\ud83d\udd0d', titre:'C\u2019est quoi le Name Screening\u00a0?', contenu:[
    { icon:'\ud83d\udd0d', texte:'Le **Name Screening** consiste \u00e0 v\u00e9rifier les noms des clients finaux contre des **listes de sanctions, de personnes interdites ou \u00e0 risque** publi\u00e9es par les autorit\u00e9s internationales' },
    { icon:'\ud83c\udfaf', texte:'Objectif\u00a0: d\u00e9tecter si un client final est une personne sanction\u00e9e, un terroriste d\u00e9sign\u00e9, un trafiquant identifi\u00e9 ou une entit\u00e9 interdite' },
    { icon:'\ud83c\udfe6', texte:'C\u2019est une obligation l\u00e9gale des **PSF** \u2014 le screening est r\u00e9alis\u00e9 sur instruction du PSF, dans le cadre du SLA avec i-Hub' },
    { icon:'\ud83d\udd04', texte:'Le screening est effectu\u00e9 \u00e0 l\u2019**entr\u00e9e en relation** et **en continu** tout au long de la relation client' },
  ], aretenir:'Name Screening = v\u00e9rifier les noms contre les listes de sanctions. Obligation du PSF. i-Hub ex\u00e9cute sur instruction, dans le cadre du SLA.' },

  { id:2, emoji:'\ud83d\udcdc', titre:'Les principales listes de sanctions', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf3', texte:'**ONU**\u00a0: Comit\u00e9 des sanctions du Conseil de s\u00e9curit\u00e9 \u2014 liste la plus universelle, s\u2019impose \u00e0 tous les \u00c9tats membres' },
    { icon:'\ud83c\uddea\ud83c\uddfa', texte:'**UE** (R\u00e8glement CE)\u00a0: sanctionne des individus, entit\u00e9s et pays \u2014 mise \u00e0 jour fr\u00e9quente, consultable sur EUR-Lex' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**OFAC** (Office of Foreign Assets Control)\u00a0: liste am\u00e9ricaine \u2014 SDN List (Specially Designated Nationals) \u2014 impact mondial via le dollar' },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:'**CSSF / Luxembourg**\u00a0: le PSF doit contr\u00f4ler contre toutes ces listes \u2014 i-Hub utilise les outils de screening du PSF ou les siens selon le SLA' },
  ], aretenir:'4 listes cl\u00e9s\u00a0: ONU, UE, OFAC, et listes nationales. Le PSF est responsable de couvrir toutes les listes applicables.' },

  { id:3, emoji:'\ud83d\udcca', titre:'Comment fonctionne le screening', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Saisie**\u00a0: le nom du client final est entr\u00e9 dans l\u2019outil de screening \u2014 exactitude critique (Rue \u2260 Avenue, Jean \u2260 Jeanne)' },
    { icon:'2\ufe0f\u20e3', texte:'**Comparaison**\u00a0: l\u2019outil compare le nom saisi contre les milliers d\u2019entr\u00e9es dans les listes de sanctions' },
    { icon:'3\ufe0f\u20e3', texte:'**R\u00e9sultat**\u00a0: l\u2019outil retourne les correspondances potentielles avec un **score de similarit\u00e9** (ex\u00a0: 85% match)' },
    { icon:'4\ufe0f\u20e3', texte:'**Analyse humaine**\u00a0: un collaborateur i-Hub analyse chaque r\u00e9sultat pour d\u00e9terminer si c\u2019est un vrai match ou un faux positif' },
  ], aretenir:'Saisir \u2192 Comparer \u2192 Analyser. L\u2019outil fait la recherche, l\u2019humain fait l\u2019analyse. L\u2019exactitude de la saisie est d\u00e9terminante.' },

  { id:4, emoji:'\u26a0\ufe0f', titre:'Le vrai match vs le faux positif', contenu:[
    { icon:'\ud83d\udea8', texte:'**Vrai match**\u00a0: les informations correspondent r\u00e9ellement \u00e0 la personne sanction\u00e9e \u2014 m\u00eame nom, m\u00eame date de naissance, m\u00eame nationalit\u00e9' },
    { icon:'\ud83d\udfe2', texte:'**Faux positif**\u00a0: le nom ressemble \u00e0 celui d\u2019une personne sanction\u00e9e mais c\u2019est une personne diff\u00e9rente \u2014 homonymie fr\u00e9quente' },
    { icon:'\ud83d\udcca', texte:'Les outils de screening g\u00e9n\u00e8rent beaucoup de **faux positifs** \u2014 Mohamed Ali par exemple peut correspondre \u00e0 des milliers de personnes' },
    { icon:'\ud83d\udccc', texte:'L\u2019analyse humaine est indispensable \u2014 un faux positif non g\u00e9r\u00e9 peut bloquer un client l\u00e9gitime, un vrai match non d\u00e9tect\u00e9 peut exposer le PSF' },
  ], aretenir:'Vrai match = m\u00eames identifiants confirm\u00e9s. Faux positif = ressemblance de nom sans correspondance r\u00e9elle. L\u2019analyse humaine tranche.' },

  { id:5, emoji:'\ud83d\udd0d', titre:'Comment analyser un r\u00e9sultat de screening', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Comparer les identifiants cl\u00e9s**\u00a0: date de naissance, nationalit\u00e9, adresse, num\u00e9ro de passeport \u2014 correspondent-ils \u00e0 la personne sur la liste\u00a0?' },
    { icon:'2\ufe0f\u20e3', texte:'**V\u00e9rifier la sp\u00e9cificit\u00e9 du nom**\u00a0: un nom tr\u00e8s commun (Mohamed, Jean Martin) = forte probabilit\u00e9 de faux positif' },
    { icon:'3\ufe0f\u20e3', texte:'**Consulter la notice de la liste**\u00a0: chaque entr\u00e9e dans une liste de sanctions comporte des informations de d\u00e9sambigua\u00efisation' },
    { icon:'4\ufe0f\u20e3', texte:'**Documenter la conclusion**\u00a0: faux positif document\u00e9 avec justification, ou vrai match escalad\u00e9 imm\u00e9diatement au PSF' },
  ], aretenir:'Analyser = comparer les identifiants + v\u00e9rifier la notice + documenter. Faux positif = justifier. Vrai match = escalader.' },

  { id:6, emoji:'\ud83d\udea8', titre:'Que fait i-Hub en cas de vrai match\u00a0?', contenu:[
    { icon:'\ud83d\udea8', texte:'Un vrai match (ou un match non \u00e9cart\u00e9) est **imm\u00e9diatement escalad\u00e9 au PSF** \u2014 pas d\u2019attente, pas de d\u00e9lai' },
    { icon:'\ud83d\uded1', texte:'i-Hub **ne d\u00e9cide pas** de la suite \u2014 c\u2019est le PSF qui d\u00e9cide de geler le compte, refuser la relation ou d\u00e9clarer \u00e0 la CRF' },
    { icon:'\ud83d\udcce', texte:'Le rapport transmis au PSF contient\u00a0: le nom cribl\u00e9, la liste concern\u00e9e, le score de correspondance, les informations comparatives' },
    { icon:'\ud83d\udcc5', texte:'i-Hub archive le r\u00e9sultat de l\u2019analyse \u2014 qu\u2019il s\u2019agisse d\u2019un vrai match ou d\u2019un faux positif document\u00e9' },
  ], aretenir:'Vrai match = escalade imm\u00e9diate au PSF. i-Hub ne g\u00e8le pas, ne d\u00e9clare pas. Il signale et archive. Le PSF d\u00e9cide.' },

  { id:7, emoji:'\ud83d\udfe2', titre:'Que fait i-Hub en cas de faux positif\u00a0?', contenu:[
    { icon:'\ud83d\udfe2', texte:'Un faux positif est **document\u00e9 et archiv\u00e9** \u2014 avec la justification pr\u00e9cise (date de naissance diff\u00e9rente, nationalit\u00e9 diff\u00e9rente\u2026)' },
    { icon:'\ud83d\udcdd', texte:'La documentation doit \u00eatre **suffisamment d\u00e9taill\u00e9e** pour qu\u2019un contr\u00f4leur puisse comprendre pourquoi le match a \u00e9t\u00e9 \u00e9cart\u00e9' },
    { icon:'\u26a0\ufe0f', texte:'Un faux positif \u00e9cart\u00e9 sans justification suffisante peut \u00eatre consid\u00e9r\u00e9 comme une **n\u00e9gligence** en cas de contr\u00f4le CSSF' },
    { icon:'\ud83d\udccc', texte:'Le PSF peut \u00eatre inform\u00e9 du faux positif selon les proc\u00e9dures du SLA \u2014 m\u00eame si ce n\u2019est pas un vrai match' },
  ], aretenir:'Faux positif = documenter la justification pr\u00e9cise. Pas d\u2019\u00e9cart sans raison \u00e9crite. Le dossier de screening doit \u00eatre tra\u00e7able.' },

  { id:8, emoji:'\ud83d\udcdd', titre:'L\u2019importance absolue de l\u2019exactitude des noms', contenu:[
    { icon:'\ud83d\udccc', texte:'Un nom mal saisi = un screening incomplet = risque de passer \u00e0 c\u00f4t\u00e9 d\u2019un vrai match' },
    { icon:'\u26a0\ufe0f', texte:'Exemples d\u2019erreurs critiques\u00a0: \u00ab\u00a0Jean-Marc\u00a0\u00bb saisi \u00ab\u00a0Jean Marc\u00a0\u00bb (sans trait d\u2019union), ou \u00ab\u00a0Al-Rashid\u00a0\u00bb saisi \u00ab\u00a0AlRashid\u00a0\u00bb' },
    { icon:'\ud83d\udd04', texte:'Il faut screener **toutes les variantes du nom**\u00a0: nom de naissance, nom marital, alias connus, translitt\u00e9rations' },
    { icon:'\ud83d\udd0d', texte:'i-Hub saisit les noms **exactement comme ils figurent sur les documents officiels** \u2014 sans approximation ni simplification' },
  ], aretenir:'Exactitude = s\u00e9curit\u00e9. Un nom mal saisi rate un match. Toutes les variantes du nom sont screen\u00e9es. Copier les documents officiels.' },

  { id:9, emoji:'\ud83c\udf0d', titre:'Les listes de sanctions\u00a0: ce qu\u2019elles contiennent', contenu:[
    { icon:'\ud83d\udc64', texte:'**Personnes physiques**\u00a0: individus sanction\u00e9s, terroristes d\u00e9sign\u00e9s, trafiquants, proliferateurs d\u2019armes' },
    { icon:'\ud83c\udfe2', texte:'**Entit\u00e9s**\u00a0: soci\u00e9t\u00e9s, organisations, gouvernements, navires \u2014 toute entit\u00e9 d\u00e9sign\u00e9e comme sanctionn\u00e9e' },
    { icon:'\ud83c\udf0d', texte:'**Pays**\u00a0: certains pays font l\u2019objet de sanctions g\u00e9n\u00e9rales (ex\u00a0: Iran, Russie, Cor\u00e9e du Nord) ou sectorielles' },
    { icon:'\ud83d\udd04', texte:'Les listes sont **mises \u00e0 jour tr\u00e8s r\u00e9guli\u00e8rement** \u2014 une personne peut \u00eatre ajout\u00e9e ou retir\u00e9e \u00e0 tout moment' },
  ], aretenir:'Listes = personnes, entit\u00e9s, pays. Mises \u00e0 jour constantes. Le screening doit utiliser les listes \u00e0 jour du jour du contr\u00f4le.' },

  { id:10, emoji:'\ud83d\udcca', titre:'Le score de similarit\u00e9', contenu:[
    { icon:'\ud83d\udcca', texte:'Les outils de screening retournent un **score de similarit\u00e9** (ex\u00a0: 70%, 85%, 100%) entre le nom saisi et les entr\u00e9es des listes' },
    { icon:'\ud83d\udd34', texte:'Un score de **100%** (match exact) ne signifie pas automatiquement un vrai match \u2014 des homonymes peuvent exister' },
    { icon:'\ud83d\udfe1', texte:'Un score de **70-80%** peut \u00eatre un vrai match si le nom est rare, ou un faux positif si le nom est tr\u00e8s commun' },
    { icon:'\ud83d\udccc', texte:'Le seuil de d\u00e9clenchement d\u2019une alerte est d\u00e9fini par le PSF dans sa politique de screening \u2014 i-Hub applique ce seuil' },
  ], aretenir:'Score \u00e9lev\u00e9 \u2260 vrai match automatique. Le score d\u00e9clenche l\u2019analyse, pas la conclusion. L\u2019humain analyse chaque alerte.' },

  { id:11, emoji:'\ud83d\udd04', titre:'Le screening continu', contenu:[
    { icon:'\ud83d\udd04', texte:'Le screening ne se fait pas qu\u2019\u00e0 l\u2019entr\u00e9e en relation \u2014 les clients existants doivent \u00eatre **recribl\u00e9s r\u00e9guli\u00e8rement**' },
    { icon:'\ud83d\udcc5', texte:'Pourquoi\u00a0: une personne peut \u00eatre ajout\u00e9e \u00e0 une liste de sanctions apr\u00e8s avoir ouvert son compte \u2014 le PSF doit le d\u00e9tecter' },
    { icon:'\ud83d\udce2', texte:'Tout **\u00e9v\u00e9nement d\u00e9clencheur** (mise \u00e0 jour des listes, alerte m\u00e9dias, changement de statut) peut d\u00e9clencher un re-screening' },
    { icon:'\ud83d\udd0d', texte:'i-Hub peut \u00eatre mandat\u00e9 pour des screenings p\u00e9riodiques ou \u00e0 la demande \u2014 toujours sur instruction du PSF' },
  ], aretenir:'Screening = ponctuel ET continu. Les listes changent, les clients peuvent \u00eatre ajout\u00e9s. Re-screening p\u00e9riodique obligatoire.' },

  { id:12, emoji:'\ud83d\udc64', titre:'Les alias et variantes de noms', contenu:[
    { icon:'\ud83d\udc64', texte:'Une personne sanctionn\u00e9e peut avoir plusieurs **alias** (noms utilis\u00e9s, noms d\u2019emprunt, surnoms) list\u00e9s dans les listes' },
    { icon:'\ud83d\udd04', texte:'La translitt\u00e9ration d\u2019un nom arabe, cyrillique ou chinois peut g\u00e9n\u00e9rer plusieurs variantes \u00e9crites en alphabet latin' },
    { icon:'\ud83d\udcdd', texte:'Il faut screener\u00a0: le **nom complet**, le **nom de jeune fille** si diff\u00e9rent, les **alias** connus mentionn\u00e9s dans le dossier' },
    { icon:'\ud83d\udd0d', texte:'i-Hub screene toutes les variantes pr\u00e9sentes dans le dossier \u2014 et signale au PSF si le nombre d\u2019alias est inhabituel' },
  ], aretenir:'Screener toutes les variantes\u00a0: nom complet, nom de naissance, alias connus. Un alias non screen\u00e9 peut masquer un vrai match.' },

  { id:13, emoji:'\ud83c\udfe2', titre:'Le screening des entit\u00e9s', contenu:[
    { icon:'\ud83c\udfe2', texte:'Le screening s\u2019applique aussi aux **entit\u00e9s** (soci\u00e9t\u00e9s, fonds, associations) \u2014 pas seulement aux personnes physiques' },
    { icon:'\ud83d\udc64', texte:'Il faut screener l\u2019entit\u00e9 elle-m\u00eame ET ses **dirigeants, actionnaires et UBO** \u2014 une entit\u00e9 non sanctionn\u00e9e peut avoir un dirigeant sanctionn\u00e9' },
    { icon:'\ud83d\udccc', texte:'Les entit\u00e9s peuvent \u00eatre sanctionn\u00e9es directement (dans la liste) ou indirectement (contr\u00f4l\u00e9es par une personne sanctionn\u00e9e)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub screene l\u2019entit\u00e9 + ses dirigeants + ses UBO si pr\u00e9vu dans le SLA \u2014 r\u00e9sultat transmis au PSF' },
  ], aretenir:'Screening entit\u00e9 = l\u2019entit\u00e9 + ses dirigeants + ses UBO. Une entit\u00e9 propre peut avoir un dirigeant sanctionn\u00e9.' },

  { id:14, emoji:'\ud83d\udcc5', titre:'Fr\u00e9quence et timing du screening', contenu:[
    { icon:'\ud83c\udf1f', texte:'**\u00c0 l\u2019entr\u00e9e en relation**\u00a0: screening obligatoire avant tout engagement \u2014 pas d\u2019ouverture sans r\u00e9sultat de screening' },
    { icon:'\ud83d\udd04', texte:'**P\u00e9riodiquement**\u00a0: fr\u00e9quence d\u00e9finie par le PSF selon le risque du client (mensuel pour les hauts risques, trimestriel ou annuel sinon)' },
    { icon:'\ud83d\udce2', texte:'**\u00c0 la demande**\u00a0: lors d\u2019un \u00e9v\u00e9nement (mise \u00e0 jour de liste, alerte externe, transaction inhabituelle)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub applique le calendrier de screening d\u00e9fini dans le SLA \u2014 et signale au PSF si une liste importante a \u00e9t\u00e9 mise \u00e0 jour' },
  ], aretenir:'Screening\u00a0: entr\u00e9e + p\u00e9riodique + \u00e0 la demande. Fr\u00e9quence d\u00e9finie par le PSF. i-Hub applique le calendrier du SLA.' },

  { id:15, emoji:'\ud83d\udcbb', titre:'Les outils de screening', contenu:[
    { icon:'\ud83d\udcbb', texte:'Des outils sp\u00e9cialis\u00e9s (Dow Jones, World-Check, ACAMS\u2026) agr\u00e8gent les listes de sanctions mondiales et permettent le screening automatis\u00e9' },
    { icon:'\ud83d\udd0d', texte:'Ces outils font la **recherche automatique** \u2014 mais l\u2019**analyse des r\u00e9sultats** reste humaine, r\u00e9alis\u00e9e par i-Hub' },
    { icon:'\ud83d\udcdc', texte:'Le PSF choisit l\u2019outil et d\u00e9finit les param\u00e8tres (seuils, listes \u00e0 couvrir) \u2014 i-Hub utilise les outils mis \u00e0 disposition ou les siens selon le SLA' },
    { icon:'\u23f0', texte:'Les outils doivent \u00eatre **mis \u00e0 jour r\u00e9guli\u00e8rement** pour couvrir les derni\u00e8res mises \u00e0 jour des listes \u2014 responsabilit\u00e9 du PSF ou d\u2019i-Hub selon le SLA' },
  ], aretenir:'Outil = recherche automatique. Humain = analyse des r\u00e9sultats. Les deux sont n\u00e9cessaires. L\u2019outil ne remplace pas le jugement.' },

  { id:16, emoji:'\u26a0\ufe0f', titre:'Sanctions et gel des avoirs', contenu:[
    { icon:'\u26a0\ufe0f', texte:'Transacter avec une personne ou entit\u00e9 sanctionn\u00e9e peut constituer une **violation des sanctions** \u2014 infraction p\u00e9nale grave' },
    { icon:'\ud83d\udd12', texte:'En cas de match confirm\u00e9, le PSF a l\u2019obligation de **geler les avoirs** imm\u00e9diatement et de notifier les autorit\u00e9s comp\u00e9tentes' },
    { icon:'\ud83d\udcb0', texte:'Les amendes pour violation de sanctions peuvent atteindre des **milliards de dollars** \u2014 plusieurs grandes banques ont \u00e9t\u00e9 condamn\u00e9es' },
    { icon:'\ud83d\udd0d', texte:'C\u2019est pourquoi l\u2019escalade imm\u00e9diate par i-Hub en cas de match est non-n\u00e9gociable \u2014 le d\u00e9lai peut co\u00fbter cher au PSF' },
  ], aretenir:'Violation de sanctions = infraction p\u00e9nale + gel imm\u00e9diat. Escalade imm\u00e9diate en cas de match est non-n\u00e9gociable.' },

  { id:17, emoji:'\ud83d\udcce', titre:'La documentation du screening', contenu:[
    { icon:'\ud83d\udcce', texte:'Chaque screening r\u00e9alis\u00e9 doit \u00eatre **document\u00e9 et archiv\u00e9**\u00a0: date, nom(s) cribl\u00e9(s), liste(s) utilis\u00e9e(s), r\u00e9sultat(s), analyse' },
    { icon:'\ud83d\udfe2', texte:'Pour un faux positif\u00a0: noter pr\u00e9cis\u00e9ment pourquoi le match a \u00e9t\u00e9 \u00e9cart\u00e9 (date de naissance diff\u00e9rente, nationalit\u00e9 diff\u00e9rente\u2026)' },
    { icon:'\ud83d\udea8', texte:'Pour un vrai match\u00a0: noter l\u2019heure et la date de l\u2019escalade au PSF, la personne contact\u00e9e, les informations transmises' },
    { icon:'\ud83d\udcbc', texte:'Cette documentation est la preuve de diligence d\u2019i-Hub \u2014 elle doit r\u00e9sister \u00e0 un audit CSSF ou une enqu\u00eate judiciaire' },
  ], aretenir:'Documentation screening = preuve de diligence. Faux positif\u00a0: justification \u00e9crite. Vrai match\u00a0: heure et personne contact\u00e9e au PSF.' },

  { id:18, emoji:'\ud83e\udd14', titre:'Les cas limites\u00a0: quand \u00e9scalader', contenu:[
    { icon:'\ud83d\udd34', texte:'**Doute impossible \u00e0 lever**\u00a0: les informations disponibles ne permettent pas de conclure faux positif avec certitude \u2192 escalader' },
    { icon:'\ud83d\udd34', texte:'**Match partiel sur nom rare**\u00a0: le pr\u00e9nom diff\u00e8re mais le nom de famille est identique et tr\u00e8s rare \u2192 escalader au PSF' },
    { icon:'\ud83d\udd34', texte:'**Informations manquantes**\u00a0: pas assez d\u2019identifiants pour confirmer ou \u00e9carter \u2192 escalader et demander plus d\u2019informations via le PSF' },
    { icon:'\ud83d\udccc', texte:'R\u00e8gle\u00a0: en cas de doute, on escalade. Escalader \u00e0 tort est moins grave qu\u2019ignorer un vrai match.' },
  ], aretenir:'En cas de doute = escalade. Il vaut mieux escalader \u00e0 tort que rater un vrai match. Le PSF a les moyens de trancher.' },

  { id:19, emoji:'\ud83d\udca1', titre:'Screening et exactitude de la saisie\u00a0: le lien crucial', contenu:[
    { icon:'\ud83d\udccc', texte:'Un nom mal saisi peut g\u00e9n\u00e9rer un **faux n\u00e9gatif** (match r\u00e9el non d\u00e9tect\u00e9) \u2014 pire qu\u2019un faux positif' },
    { icon:'\ud83d\udcdd', texte:'Exemple\u00a0: \u00ab\u00a0Qadafi\u00a0\u00bb saisi \u00ab\u00a0Kadhafi\u00a0\u00bb peut ne pas matcher \u00ab\u00a0Gaddafi\u00a0\u00bb dans la liste \u2014 toutes les translitt\u00e9rations doivent \u00eatre test\u00e9es' },
    { icon:'\ud83d\udd04', texte:'Les bons outils g\u00e8rent les variantes orthographiques automatiquement \u2014 mais une saisie exacte reste la base' },
    { icon:'\ud83d\uded1', texte:'Une saisie approximative qui laisse passer un sanctionn\u00e9 peut engager la **responsabilit\u00e9 d\u2019i-Hub** contractuellement' },
  ], aretenir:'Saisie exacte = base du screening. Faux n\u00e9gatif (match rat\u00e9) = risque maximal. Toujours copier depuis le document officiel.' },

  { id:20, emoji:'\ud83c\udf93', titre:'R\u00e9sum\u00e9\u00a0: Name Screening en 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Screening** = v\u00e9rifier noms vs listes de sanctions \u2014 ONU, UE, OFAC, listes nationales' },
    { icon:'2\ufe0f\u20e3', texte:'**Exactitude** = obligation absolue de la saisie \u2014 toutes les variantes du nom, copie exacte des documents' },
    { icon:'3\ufe0f\u20e3', texte:'**Analyse** = l\u2019outil cherche, l\u2019humain analyse \u2014 vrai match vs faux positif, documentation dans tous les cas' },
    { icon:'4\ufe0f\u20e3', texte:'**Vrai match** = escalade imm\u00e9diate et non-n\u00e9gociable au PSF \u2014 jamais de d\u00e9lai' },
    { icon:'5\ufe0f\u20e3', texte:'**Doute** = escalade. Faux positif = documentation pr\u00e9cise. Tout est archiv\u00e9 pour la tra\u00e7abilit\u00e9.' },
  ], aretenir:'Screening\u00a0: saisir exactement, analyser humainement, escalader les matchs, documenter tout. Le PSF d\u00e9cide des suites.' },
]

const FICHES_EN = [
  { id:1, emoji:'\ud83d\udd0d', titre:'What is Name Screening?', contenu:[
    { icon:'\ud83d\udd0d', texte:'**Name Screening** involves checking the names of final clients against **sanctions lists, prohibited or risk persons lists** published by international authorities' },
    { icon:'\ud83c\udfaf', texte:'Goal: detect whether a final client is a sanctioned person, designated terrorist, identified trafficker or prohibited entity' },
    { icon:'\ud83c\udfe6', texte:'It is a legal obligation of **PSFs** \u2014 screening is performed on the PSF\u2019s instruction, within the SLA with i-Hub' },
    { icon:'\ud83d\udd04', texte:'Screening is performed at **onboarding** and **on an ongoing basis** throughout the client relationship' },
  ], aretenir:'Name Screening = check names against sanctions lists. PSF obligation. i-Hub executes on instruction, within SLA.' },
  { id:2, emoji:'\ud83d\udcdc', titre:'The main sanctions lists', contenu:[
    { icon:'\ud83c\uddfa\ud83c\uddf3', texte:'**UN**: Security Council sanctions committee \u2014 most universal list, binding on all member states' },
    { icon:'\ud83c\uddea\ud83c\uddfa', texte:'**EU** (EC Regulation): sanctions individuals, entities and countries \u2014 frequently updated, searchable on EUR-Lex' },
    { icon:'\ud83c\uddfa\ud83c\uddf8', texte:'**OFAC** (Office of Foreign Assets Control): US list \u2014 SDN List (Specially Designated Nationals) \u2014 global impact via the dollar' },
    { icon:'\ud83c\uddf1\ud83c\uddfa', texte:'**CSSF / Luxembourg**: PSF must screen against all applicable lists \u2014 i-Hub uses PSF or own screening tools per SLA' },
  ], aretenir:'4 key lists: UN, EU, OFAC, national lists. PSF is responsible for covering all applicable lists.' },
  { id:3, emoji:'\ud83d\udcca', titre:'How screening works', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Entry**: final client name entered into screening tool \u2014 accuracy critical (Street \u2260 Avenue, John \u2260 Joan)' },
    { icon:'2\ufe0f\u20e3', texte:'**Comparison**: tool compares entered name against thousands of entries in sanctions lists' },
    { icon:'3\ufe0f\u20e3', texte:'**Result**: tool returns potential matches with a **similarity score** (e.g. 85% match)' },
    { icon:'4\ufe0f\u20e3', texte:'**Human analysis**: an i-Hub team member analyses each result to determine if it is a true match or false positive' },
  ], aretenir:'Enter \u2192 Compare \u2192 Analyse. The tool searches, the human analyses. Entry accuracy is decisive.' },
  { id:4, emoji:'\u26a0\ufe0f', titre:'True match vs false positive', contenu:[
    { icon:'\ud83d\udea8', texte:'**True match**: information genuinely matches the sanctioned person \u2014 same name, same date of birth, same nationality' },
    { icon:'\ud83d\udfe2', texte:'**False positive**: name resembles a sanctioned person but is a different person \u2014 common homonymy' },
    { icon:'\ud83d\udcca', texte:'Screening tools generate many **false positives** \u2014 Mohamed Ali for example may match thousands of people' },
    { icon:'\ud83d\udccc', texte:'Human analysis is essential \u2014 an unhandled false positive may block a legitimate client, an undetected true match may expose the PSF' },
  ], aretenir:'True match = same confirmed identifiers. False positive = name resemblance without real match. Human analysis decides.' },
  { id:5, emoji:'\ud83d\udd0d', titre:'How to analyse a screening result', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Compare key identifiers**: date of birth, nationality, address, passport number \u2014 do they match the listed person?' },
    { icon:'2\ufe0f\u20e3', texte:'**Check name specificity**: a very common name (Mohamed, Jean Martin) = high probability of false positive' },
    { icon:'3\ufe0f\u20e3', texte:'**Consult the list entry**: each sanctions list entry contains disambiguation information' },
    { icon:'4\ufe0f\u20e3', texte:'**Document the conclusion**: false positive documented with justification, or true match immediately escalated to PSF' },
  ], aretenir:'Analyse = compare identifiers + check entry + document. False positive = justify. True match = escalate.' },
  { id:6, emoji:'\ud83d\udea8', titre:'What i-Hub does in case of a true match', contenu:[
    { icon:'\ud83d\udea8', texte:'A true match (or an uncleared match) is **immediately escalated to the PSF** \u2014 no waiting, no delay' },
    { icon:'\ud83d\uded1', texte:'i-Hub **does not decide** on follow-up \u2014 the PSF decides to freeze the account, refuse the relationship or report to FIU' },
    { icon:'\ud83d\udcce', texte:'Report transmitted to PSF contains: screened name, relevant list, match score, comparative information' },
    { icon:'\ud83d\udcc5', texte:'i-Hub archives the analysis result \u2014 whether a true match or documented false positive' },
  ], aretenir:'True match = immediate escalation to PSF. i-Hub does not freeze, does not report. It flags and archives. PSF decides.' },
  { id:7, emoji:'\ud83d\udfe2', titre:'What i-Hub does in case of a false positive', contenu:[
    { icon:'\ud83d\udfe2', texte:'A false positive is **documented and archived** \u2014 with precise justification (different date of birth, different nationality\u2026)' },
    { icon:'\ud83d\udcdd', texte:'Documentation must be **sufficiently detailed** for an auditor to understand why the match was dismissed' },
    { icon:'\u26a0\ufe0f', texte:'A false positive dismissed without sufficient justification may be considered **negligence** in a CSSF audit' },
    { icon:'\ud83d\udccc', texte:'The PSF may be notified of the false positive per SLA procedures \u2014 even if it is not a true match' },
  ], aretenir:'False positive = document precise justification. No dismissal without written reason. Screening file must be traceable.' },
  { id:8, emoji:'\ud83d\udcdd', titre:'The absolute importance of accurate name entry', contenu:[
    { icon:'\ud83d\udccc', texte:'A misspelled name = incomplete screening = risk of missing a true match' },
    { icon:'\u26a0\ufe0f', texte:'Critical error examples: \u201cJean-Marc\u201d entered as \u201cJean Marc\u201d (without hyphen), or \u201cAl-Rashid\u201d as \u201cAlRashid\u201d' },
    { icon:'\ud83d\udd04', texte:'All **name variants** must be screened: birth name, married name, known aliases, transliterations' },
    { icon:'\ud83d\udd0d', texte:'i-Hub enters names **exactly as they appear on official documents** \u2014 no approximation or simplification' },
  ], aretenir:'Accuracy = security. A misspelled name misses a match. All name variants are screened. Copy from official documents.' },
  { id:9, emoji:'\ud83c\udf0d', titre:'Sanctions lists: what they contain', contenu:[
    { icon:'\ud83d\udc64', texte:'**Individuals**: sanctioned persons, designated terrorists, identified traffickers, weapons proliferators' },
    { icon:'\ud83c\udfe2', texte:'**Entities**: companies, organisations, governments, vessels \u2014 any entity designated as sanctioned' },
    { icon:'\ud83c\udf0d', texte:'**Countries**: some countries are subject to general (e.g. Iran, Russia, North Korea) or sectoral sanctions' },
    { icon:'\ud83d\udd04', texte:'Lists are **updated very frequently** \u2014 a person can be added or removed at any time' },
  ], aretenir:'Lists = individuals, entities, countries. Constantly updated. Screening must use lists current on the day of the check.' },
  { id:10, emoji:'\ud83d\udcca', titre:'The similarity score', contenu:[
    { icon:'\ud83d\udcca', texte:'Screening tools return a **similarity score** (e.g. 70%, 85%, 100%) between the entered name and list entries' },
    { icon:'\ud83d\udd34', texte:'A score of **100%** (exact match) does not automatically mean a true match \u2014 homonyms may exist' },
    { icon:'\ud83d\udfe1', texte:'A score of **70-80%** may be a true match if the name is rare, or a false positive if the name is very common' },
    { icon:'\ud83d\udccc', texte:'The alert threshold is set by the PSF in its screening policy \u2014 i-Hub applies this threshold' },
  ], aretenir:'High score \u2260 automatic true match. Score triggers analysis, not conclusion. Human analyses every alert.' },
  { id:11, emoji:'\ud83d\udd04', titre:'Ongoing screening', contenu:[
    { icon:'\ud83d\udd04', texte:'Screening is not only done at onboarding \u2014 existing clients must be **re-screened regularly**' },
    { icon:'\ud83d\udcc5', texte:'Why: a person can be added to a sanctions list after opening their account \u2014 the PSF must detect this' },
    { icon:'\ud83d\udce2', texte:'Any **triggering event** (list update, external alert, unusual transaction) can trigger a re-screening' },
    { icon:'\ud83d\udd0d', texte:'i-Hub may be mandated for periodic or on-demand screenings \u2014 always on PSF instruction' },
  ], aretenir:'Screening = periodic AND ongoing. Lists change, clients can be added. Periodic re-screening mandatory.' },
  { id:12, emoji:'\ud83d\udc64', titre:'Aliases and name variants', contenu:[
    { icon:'\ud83d\udc64', texte:'A sanctioned person may have several **aliases** (used names, assumed names, nicknames) listed in the sanctions entries' },
    { icon:'\ud83d\udd04', texte:'Transliteration of an Arabic, Cyrillic or Chinese name can generate several written variants in the Latin alphabet' },
    { icon:'\ud83d\udcdd', texte:'Must screen: **full name**, **maiden name** if different, **known aliases** mentioned in the file' },
    { icon:'\ud83d\udd0d', texte:'i-Hub screens all variants present in the file \u2014 and flags to PSF if the number of aliases is unusual' },
  ], aretenir:'Screen all variants: full name, birth name, known aliases. An unscreened alias may hide a true match.' },
  { id:13, emoji:'\ud83c\udfe2', titre:'Entity screening', contenu:[
    { icon:'\ud83c\udfe2', texte:'Screening also applies to **entities** (companies, funds, associations) \u2014 not only individuals' },
    { icon:'\ud83d\udc64', texte:'The entity itself AND its **directors, shareholders and UBOs** must be screened \u2014 an unsanctioned entity may have a sanctioned director' },
    { icon:'\ud83d\udccc', texte:'Entities can be sanctioned directly (listed) or indirectly (controlled by a sanctioned person)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub screens entity + directors + UBOs if specified in SLA \u2014 result transmitted to PSF' },
  ], aretenir:'Entity screening = entity + directors + UBOs. A clean entity may have a sanctioned director.' },
  { id:14, emoji:'\ud83d\udcc5', titre:'Screening frequency and timing', contenu:[
    { icon:'\ud83c\udf1f', texte:'**At onboarding**: mandatory screening before any commitment \u2014 no opening without screening result' },
    { icon:'\ud83d\udd04', texte:'**Periodically**: frequency set by PSF per client risk (monthly for high risk, quarterly or annual otherwise)' },
    { icon:'\ud83d\udce2', texte:'**On demand**: during an event (list update, external alert, unusual transaction)' },
    { icon:'\ud83d\udd0d', texte:'i-Hub applies the screening schedule defined in the SLA \u2014 and flags to PSF if a major list has been updated' },
  ], aretenir:'Screening: onboarding + periodic + on demand. Frequency set by PSF. i-Hub applies SLA schedule.' },
  { id:15, emoji:'\ud83d\udcbb', titre:'Screening tools', contenu:[
    { icon:'\ud83d\udcbb', texte:'Specialist tools (Dow Jones, World-Check, ACAMS\u2026) aggregate global sanctions lists and enable automated screening' },
    { icon:'\ud83d\udd0d', texte:'These tools perform the **automated search** \u2014 but **analysing results** remains human, performed by i-Hub' },
    { icon:'\ud83d\udcdc', texte:'PSF chooses tool and sets parameters (thresholds, lists to cover) \u2014 i-Hub uses tools provided or its own per SLA' },
    { icon:'\u23f0', texte:'Tools must be **regularly updated** to cover latest list changes \u2014 PSF or i-Hub responsibility per SLA' },
  ], aretenir:'Tool = automated search. Human = result analysis. Both are necessary. The tool does not replace judgement.' },
  { id:16, emoji:'\u26a0\ufe0f', titre:'Sanctions and asset freezing', contenu:[
    { icon:'\u26a0\ufe0f', texte:'Transacting with a sanctioned person or entity may constitute a **sanctions violation** \u2014 serious criminal offence' },
    { icon:'\ud83d\udd12', texte:'On a confirmed match, PSF has an obligation to **freeze assets** immediately and notify competent authorities' },
    { icon:'\ud83d\udcb0', texte:'Fines for sanctions violations can reach **billions of dollars** \u2014 several major banks have been convicted' },
    { icon:'\ud83d\udd0d', texte:'This is why immediate escalation by i-Hub on a match is non-negotiable \u2014 delay can be very costly for the PSF' },
  ], aretenir:'Sanctions violation = criminal offence + immediate freeze. Immediate escalation on match is non-negotiable.' },
  { id:17, emoji:'\ud83d\udcce', titre:'Screening documentation', contenu:[
    { icon:'\ud83d\udcce', texte:'Every screening performed must be **documented and archived**: date, screened name(s), list(s) used, result(s), analysis' },
    { icon:'\ud83d\udfe2', texte:'For a false positive: note precisely why the match was dismissed (different date of birth, different nationality\u2026)' },
    { icon:'\ud83d\udea8', texte:'For a true match: note the time and date of escalation to PSF, person contacted, information transmitted' },
    { icon:'\ud83d\udcbc', texte:'This documentation is i-Hub\u2019s proof of diligence \u2014 it must withstand a CSSF audit or judicial investigation' },
  ], aretenir:'Screening documentation = proof of diligence. False positive: written justification. True match: time and PSF contact noted.' },
  { id:18, emoji:'\ud83e\udd14', titre:'Borderline cases: when to escalate', contenu:[
    { icon:'\ud83d\udd34', texte:'**Unresolvable doubt**: available information does not allow concluding false positive with certainty \u2192 escalate' },
    { icon:'\ud83d\udd34', texte:'**Partial match on rare name**: first name differs but family name is identical and very rare \u2192 escalate to PSF' },
    { icon:'\ud83d\udd34', texte:'**Missing information**: not enough identifiers to confirm or dismiss \u2192 escalate and request more info via PSF' },
    { icon:'\ud83d\udccc', texte:'Rule: when in doubt, escalate. Escalating wrongly is less serious than missing a true match.' },
  ], aretenir:'When in doubt = escalate. Better to escalate wrongly than miss a true match. The PSF has means to decide.' },
  { id:19, emoji:'\ud83d\udca1', titre:'Screening and name entry accuracy: the crucial link', contenu:[
    { icon:'\ud83d\udccc', texte:'A misspelled name can generate a **false negative** (real match not detected) \u2014 worse than a false positive' },
    { icon:'\ud83d\udcdd', texte:'Example: \u201cQadafi\u201d entered as \u201cKadhafi\u201d may not match \u201cGaddafi\u201d on the list \u2014 all transliterations must be tested' },
    { icon:'\ud83d\udd04', texte:'Good tools handle spelling variants automatically \u2014 but accurate entry remains the foundation' },
    { icon:'\ud83d\uded1', texte:'Approximate entry that lets a sanctioned person through may engage **i-Hub\u2019s contractual liability**' },
  ], aretenir:'Accurate entry = basis of screening. False negative (missed match) = maximum risk. Always copy from official document.' },
  { id:20, emoji:'\ud83c\udf93', titre:'Summary: Name Screening in 5 points', contenu:[
    { icon:'1\ufe0f\u20e3', texte:'**Screening** = check names vs sanctions lists \u2014 UN, EU, OFAC, national lists' },
    { icon:'2\ufe0f\u20e3', texte:'**Accuracy** = absolute obligation in entry \u2014 all name variants, exact copy from documents' },
    { icon:'3\ufe0f\u20e3', texte:'**Analysis** = tool searches, human analyses \u2014 true match vs false positive, documented in all cases' },
    { icon:'4\ufe0f\u20e3', texte:'**True match** = immediate and non-negotiable escalation to PSF \u2014 never any delay' },
    { icon:'5\ufe0f\u20e3', texte:'**Doubt** = escalate. False positive = precise documentation. Everything archived for traceability.' },
  ], aretenir:'Screening: enter accurately, analyse humanly, escalate matches, document everything. PSF decides follow-up.' },
]

const MATCH_FR = [
  { result:'Nom cribl\u00e9\u00a0: "Mohamed Al-Farsi", n\u00e9 le 12/03/1975, nationalit\u00e9 irakienne. Liste\u00a0: "Mohamed Al-Farsi, n\u00e9 le 12/03/1975, nationalit\u00e9 irakienne, d\u00e9sign\u00e9 ONU 2019"', isMatch:true, explication:'M\u00eame nom, m\u00eame date de naissance, m\u00eame nationalit\u00e9 = vrai match. Escalade imm\u00e9diate au PSF.' },
  { result:'Nom cribl\u00e9\u00a0: "Jean Dupont", n\u00e9 le 05/07/1982, fran\u00e7ais. Liste\u00a0: "Jean Dupont, n\u00e9 le 05/07/1956, syrien, d\u00e9sign\u00e9 UE 2021"', isMatch:false, explication:'M\u00eame nom mais date de naissance diff\u00e9rente (26 ans d\u2019\u00e9cart) et nationalit\u00e9 diff\u00e9rente. Faux positif \u00e0 documenter.' },
  { result:'Nom cribl\u00e9\u00a0: "Vladimir Petrov", n\u00e9 le 22/11/1968, russe. Liste\u00a0: "Vladimir Petrov", n\u00e9 le 22/11/1968, aucune autre info disponible"', isMatch:true, explication:'M\u00eame nom, m\u00eame date de naissance. M\u00eame si peu d\u2019infos\u00a0: impossible d\u2019\u00e9carter avec certitude. Escalader au PSF.' },
  { result:'Nom cribl\u00e9\u00a0: "Ahmed Hassan", n\u00e9 le 01/01/1990, marocain. Liste\u00a0: "Ahmed Hassan" (pr\u00e9nom identique, patronyme tr\u00e8s commun, pas de date de naissance)'  , isMatch:false, explication:'Nom tr\u00e8s commun + aucun identifiant suppl\u00e9mentaire confirmant la correspondance. Faux positif \u00e0 documenter avec justification.' },
  { result:'Nom cribl\u00e9\u00a0: "Olga Kovalenko", n\u00e9e le 14/06/1979, ukrainienne. Liste\u00a0: "Olga Kovalenko, n\u00e9e le 14/06/1979, nationalit\u00e9 russe"', isMatch:false, explication:'M\u00eame nom et date de naissance mais nationalit\u00e9 diff\u00e9rente. Faux positif probable \u2014 documenter la diff\u00e9rence de nationalit\u00e9. Si doute persistant, escalader.' },
  { result:'Nom cribl\u00e9\u00a0: "Kim Sung Jin", n\u00e9 le 30/09/1971, cor\u00e9en du Nord. Liste\u00a0: "Kim Sung Jin, n\u00e9 le 30/09/1971, cor\u00e9en du Nord, sanctionn\u00e9 OFAC"', isMatch:true, explication:'Tous les identifiants correspondent. Vrai match. Escalade imm\u00e9diate et non-n\u00e9gociable au PSF.' },
]
const MATCH_EN = [
  { result:'Screened name: "Mohamed Al-Farsi", born 12/03/1975, Iraqi nationality. List: "Mohamed Al-Farsi, born 12/03/1975, Iraqi nationality, UN designated 2019"', isMatch:true, explication:'Same name, same date of birth, same nationality = true match. Immediate escalation to PSF.' },
  { result:'Screened name: "Jean Dupont", born 05/07/1982, French. List: "Jean Dupont, born 05/07/1956, Syrian, EU designated 2021"', isMatch:false, explication:'Same name but different date of birth (26-year gap) and different nationality. False positive to document.' },
  { result:'Screened name: "Vladimir Petrov", born 22/11/1968, Russian. List: "Vladimir Petrov", born 22/11/1968, no other info available"', isMatch:true, explication:'Same name, same date of birth. Even with limited info: cannot dismiss with certainty. Escalate to PSF.' },
  { result:'Screened name: "Ahmed Hassan", born 01/01/1990, Moroccan. List: "Ahmed Hassan" (same first name, very common surname, no date of birth)', isMatch:false, explication:'Very common name + no additional confirming identifier. False positive to document with justification.' },
  { result:'Screened name: "Olga Kovalenko", born 14/06/1979, Ukrainian. List: "Olga Kovalenko, born 14/06/1979, Russian nationality"', isMatch:false, explication:'Same name and date of birth but different nationality. Probable false positive \u2014 document the nationality difference. If doubt persists, escalate.' },
  { result:'Screened name: "Kim Sung Jin", born 30/09/1971, North Korean. List: "Kim Sung Jin, born 30/09/1971, North Korean, OFAC sanctioned"', isMatch:true, explication:'All identifiers match. True match. Immediate and non-negotiable escalation to PSF.' },
]

const VF_FR = [
  { texte:'Un score de 100% dans un outil de screening garantit que c\u2019est un vrai match', reponse:false, explication:'Non\u00a0! Un score \u00e9lev\u00e9 d\u00e9clenche une analyse, pas une conclusion. Des homonymes parfaits existent. L\u2019humain doit analyser.' },
  { texte:'i-Hub doit escalader imm\u00e9diatement au PSF tout match qu\u2019il ne peut pas \u00e9carter avec certitude', reponse:true, explication:'Exact\u00a0! En cas de doute non r\u00e9solu, escalader est la seule option. Mieux vaut escalader \u00e0 tort que rater un vrai match.' },
  { texte:'Un faux positif \u00e9cart\u00e9 sans documentation \u00e9crite est acceptable', reponse:false, explication:'Non\u00a0! Tout faux positif doit \u00eatre document\u00e9 avec justification pr\u00e9cise. Un \u00e9cart non document\u00e9 peut \u00eatre consid\u00e9r\u00e9 comme une n\u00e9gligence.' },
  { texte:'Le screening des entit\u00e9s inclut aussi leurs dirigeants et UBO', reponse:true, explication:'Exact\u00a0! Une entit\u00e9 non sanctionn\u00e9e peut avoir un dirigeant sanctionn\u00e9. Tous doivent \u00eatre screen\u00e9s.' },
  { texte:'Le screening est uniquement r\u00e9alis\u00e9 \u00e0 l\u2019entr\u00e9e en relation', reponse:false, explication:'Non\u00a0! Le screening est aussi continu \u2014 les clients existants doivent \u00eatre recribl\u00e9s r\u00e9guli\u00e8rement car les listes \u00e9voluent.' },
  { texte:'Un nom mal saisi peut g\u00e9n\u00e9rer un faux n\u00e9gatif plus dangereux qu\u2019un faux positif', reponse:true, explication:'Exact\u00a0! Un faux n\u00e9gatif (match r\u00e9el non d\u00e9tect\u00e9) expose le PSF \u00e0 une violation de sanctions. Plus dangereux qu\u2019un faux positif.' },
]
const VF_EN = [
  { texte:'A 100% score in a screening tool guarantees a true match', reponse:false, explication:'No! A high score triggers analysis, not a conclusion. Perfect homonyms exist. The human must analyse.' },
  { texte:'i-Hub must immediately escalate to PSF any match it cannot dismiss with certainty', reponse:true, explication:'Correct! When doubt cannot be resolved, escalation is the only option. Better to escalate wrongly than miss a true match.' },
  { texte:'A false positive dismissed without written documentation is acceptable', reponse:false, explication:'No! Every false positive must be documented with precise justification. An undocumented dismissal may be considered negligence.' },
  { texte:'Entity screening also includes their directors and UBOs', reponse:true, explication:'Correct! An unsanctioned entity may have a sanctioned director. All must be screened.' },
  { texte:'Screening is only performed at onboarding', reponse:false, explication:'No! Screening is also ongoing \u2014 existing clients must be re-screened regularly as lists evolve.' },
  { texte:'A misspelled name can generate a false negative more dangerous than a false positive', reponse:true, explication:'Correct! A false negative (real match not detected) exposes the PSF to a sanctions violation. More dangerous than a false positive.' },
]

const CAS_FR = [
  { situation:'Le PSF demande \u00e0 i-Hub de screener "Mohammed Ben Ali", n\u00e9 le 15/04/1985, tunisien. L\u2019outil retourne 5 correspondances. L\u2019une a le m\u00eame nom et date de naissance mais nationalit\u00e9 syrienne.', action:'Escalader au PSF\u00a0: match sur nom et date de naissance, nationalit\u00e9 diff\u00e9rente \u2014 doute non \u00e9cart\u00e9 avec certitude', options:['Accepter \u2014 nationalit\u00e9 diff\u00e9rente = faux positif certain','Escalader au PSF\u00a0: match sur nom et date de naissance, nationalit\u00e9 diff\u00e9rente \u2014 doute non \u00e9cart\u00e9 avec certitude','Ignorer \u2014 trop de correspondances pour une d\u00e9cision','Demander directement au client final'], explication:'Nom + date de naissance identiques m\u00eame si nationalit\u00e9 diff\u00e8re\u00a0: le doute ne peut pas \u00eatre \u00e9cart\u00e9 avec certitude. Escalade au PSF.' },
  { situation:'Screening d\u2019une soci\u00e9t\u00e9 luxembourgeoise. L\u2019entit\u00e9 n\u2019est pas dans les listes. Mais un des dirigeants est sanctionn\u00e9 par l\u2019OFAC.', action:'Escalader au PSF\u00a0: dirigeant de l\u2019entit\u00e9 sanctionn\u00e9 OFAC', options:['Accepter \u2014 la soci\u00e9t\u00e9 elle-m\u00eame n\u2019est pas list\u00e9e','Escalader au PSF\u00a0: dirigeant de l\u2019entit\u00e9 sanctionn\u00e9 OFAC','Informer directement le dirigeant','Ignorer \u2014 hors p\u00e9rim\u00e8tre SLA si non demand\u00e9'], explication:'Un dirigeant sanctionn\u00e9 = vrai match \u00e0 escalader m\u00eame si l\u2019entit\u00e9 ne l\u2019est pas. L\u2019entit\u00e9 peut \u00eatre contr\u00f4l\u00e9e par un sanctionn\u00e9.' },
  { situation:'Screening de "Marie Durand", fran\u00e7aise, n\u00e9e le 03/02/1991. Aucun match dans les listes ONU, UE, OFAC. Pas d\u2019alerte.', action:'Documenter le r\u00e9sultat n\u00e9gatif et archiver', options:['Ne pas archiver \u2014 pas de r\u00e9sultat = pas de documentation n\u00e9cessaire','Documenter le r\u00e9sultat n\u00e9gatif et archiver','Recommencer le screening dans 1 heure par s\u00e9curit\u00e9','Signaler au PSF que le screening est n\u00e9gatif'], explication:'M\u00eame un r\u00e9sultat n\u00e9gatif doit \u00eatre document\u00e9 et archiv\u00e9\u00a0: date, listes utilis\u00e9es, r\u00e9sultat. C\u2019est la tra\u00e7abilit\u00e9 de la diligence d\u2019i-Hub.' },
]
const CAS_EN = [
  { situation:'PSF asks i-Hub to screen "Mohammed Ben Ali", born 15/04/1985, Tunisian. Tool returns 5 matches. One has same name and date of birth but Syrian nationality.', action:'Escalate to PSF: match on name and date of birth, different nationality \u2014 doubt cannot be dismissed with certainty', options:['Accept \u2014 different nationality = certain false positive','Escalate to PSF: match on name and date of birth, different nationality \u2014 doubt cannot be dismissed with certainty','Ignore \u2014 too many matches for a decision','Ask the final client directly'], explication:'Name + date of birth identical even if nationality differs: doubt cannot be dismissed with certainty. Escalate to PSF.' },
  { situation:'Screening of a Luxembourg company. The entity is not on any list. But one of the directors is sanctioned by OFAC.', action:'Escalate to PSF: entity director OFAC sanctioned', options:['Accept \u2014 the company itself is not listed','Escalate to PSF: entity director OFAC sanctioned','Inform the director directly','Ignore \u2014 outside SLA scope if not requested'], explication:'A sanctioned director = true match to escalate even if the entity is not. The entity may be controlled by a sanctioned person.' },
  { situation:'Screening of "Marie Durand", French, born 03/02/1991. No match in UN, EU, OFAC lists. No alert.', action:'Document negative result and archive', options:['Do not archive \u2014 no result = no documentation needed','Document negative result and archive','Restart screening in 1 hour for safety','Notify PSF that screening is negative'], explication:'Even a negative result must be documented and archived: date, lists used, result. This is the traceability of i-Hub\u2019s diligence.' },
]

export default function ModuleNameScreening() {
  const router = useRouter()
  const [lang, setLang] = useState<'fr'|'en'>('fr')
  useEffect(() => { setLang(getLang()) }, [])
  const [phase, setPhase] = useState<'intro'|'fiches'|'quiz1'|'quiz2'|'quiz3'|'resultat'>('intro')
  const [ficheIndex, setFicheIndex] = useState(0)
  const [score, setScore] = useState(0)
  const t = UI[lang]
  const FICHES = lang === 'fr' ? FICHES_FR : FICHES_EN

  const [activeMatch, setActiveMatch] = useState(() => pickRandom(MATCH_FR, 5))
  const [matchIndex, setMatchIndex] = useState(0)
  const [matchAnswer, setMatchAnswer] = useState<boolean|null>(null)
  const [matchScore, setMatchScore] = useState(0)
  const [matchAnim, setMatchAnim] = useState<'correct'|'wrong'|null>(null)

  const [activeVF, setActiveVF] = useState(() => pickRandom(VF_FR, 6))
  const [vfIndex, setVfIndex] = useState(0)
  const [vfRepondu, setVfRepondu] = useState<boolean|null>(null)
  const [vfScore, setVfScore] = useState(0)
  const [vfAnim, setVfAnim] = useState<'correct'|'wrong'|null>(null)

  const [activeCas, setActiveCas] = useState(() => pickRandom(CAS_FR, 3))
  const [casIndex, setCasIndex] = useState(0)
  const [casRepondu, setCasRepondu] = useState<string|null>(null)
  const [casScore, setCasScore] = useState(0)

  function initQuizzes(l: 'fr'|'en') {
    const bm = l==='fr'?MATCH_FR:MATCH_EN
    const bv = l==='fr'?VF_FR:VF_EN
    const bc = l==='fr'?CAS_FR:CAS_EN
    setActiveMatch(pickRandom(bm,5)); setMatchIndex(0); setMatchScore(0); setMatchAnswer(null); setMatchAnim(null)
    setActiveVF(pickRandom(bv,6)); setVfIndex(0); setVfScore(0); setVfRepondu(null); setVfAnim(null)
    setActiveCas(pickRandom(bc,3)); setCasIndex(0); setCasScore(0); setCasRepondu(null)
  }
  function switchLang(l: 'fr'|'en') { saveLang(l); setLang(l); setPhase('intro'); setFicheIndex(0); setScore(0); initQuizzes(l) }

  function repMatch(rep: boolean) {
    if (matchAnswer !== null) return
    const correct = activeMatch[matchIndex].isMatch === rep
    setMatchAnswer(rep); setMatchAnim(correct ? 'correct' : 'wrong')
    if (correct) setMatchScore(s => s + 1)
    setTimeout(() => {
      setMatchAnim(null); setMatchAnswer(null)
      if (matchIndex + 1 < activeMatch.length) { setMatchIndex(i => i + 1) }
      else { setScore(s => s + (correct ? matchScore + 1 : matchScore) * 6); setPhase('quiz2') }
    }, 2500)
  }

  function repondreVF(rep: boolean) {
    if (vfRepondu !== null) return
    const correct = activeVF[vfIndex].reponse === rep
    setVfRepondu(rep); setVfAnim(correct ? 'correct' : 'wrong')
    if (correct) setVfScore(s => s + 1)
    setTimeout(() => {
      setVfAnim(null); setVfRepondu(null)
      if (vfIndex + 1 < activeVF.length) { setVfIndex(i => i + 1) }
      else { setScore(s => s + (correct ? vfScore + 1 : vfScore) * 5); setPhase('quiz3') }
    }, 2200)
  }

  function repCas(opt: string) { if (casRepondu !== null) return; const correct = opt === activeCas[casIndex].action; setCasRepondu(opt); if (correct) setCasScore(s => s + 1) }
  function nextCas() { if (casIndex + 1 < activeCas.length) { setCasIndex(i => i + 1); setCasRepondu(null) } else { setScore(s => s + casScore * 7); setPhase('resultat') } }

  const base: React.CSSProperties = { minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',system-ui,sans-serif", color:'#1f2937' }
  const NavBar = () => (
    <div style={{background:'#6b7280',padding:'12px 24px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      <button onClick={() => router.back()} style={{background:'none',border:\`1px solid \${C}\`,borderRadius:'8px',padding:'6px 12px',color:C,cursor:'pointer',fontSize:'14px'}}>{t.home}</button>
      <span style={{color:'#fff',fontWeight:'700',fontSize:'16px'}}>🎯 {t.title}</span>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'2px',gap:'2px'}}>
          {(['fr','en'] as const).map(l => <button key={l} onClick={() => switchLang(l)} style={{padding:'4px 10px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'700',background:lang===l?C:'transparent',color:'white'}}>{l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</button>)}
        </div>
        <span style={{background:'white',border:\`1px solid \${C}\`,borderRadius:'20px',padding:'4px 14px',fontSize:'13px',color:C,fontWeight:'600'}}>⭐ {score} {t.pts}</span>
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div style={base}><NavBar />
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>🎯</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',color:'#1f2937',marginBottom:'12px'}}>{t.title}</h1>
        <p style={{fontSize:'16px',color:'#4b5563',marginBottom:'32px'}}>{t.subtitle}</p>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left'}}>
          <p style={{margin:'0 0 16px',fontWeight:'700',color:C}}>{t.learn}</p>
          {t.learnItems.map((item,i) => <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:i<t.learnItems.length-1?'1px solid #f3f4f6':'none'}}><span style={{color:C,fontWeight:'700'}}>✓</span><span style={{color:'#4b5563',fontSize:'14px'}}>{item}</span></div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
          {[{label:t.fiches,icon:'📖'},{label:t.quiz,icon:'🎮'},{label:t.time,icon:'⏱️'}].map((b,i) => <div key={i} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'10px 20px',fontSize:'14px',color:'#4b5563',display:'flex',alignItems:'center',gap:'6px'}}>{b.icon} {b.label}</div>)}
        </div>
        <button onClick={() => setPhase('fiches')} style={{background:C,color:'white',border:'none',borderRadius:'12px',padding:'16px 48px',fontSize:'18px',fontWeight:'700',cursor:'pointer'}}>{t.start}</button>
      </div>
    </div>
  )

  if (phase === 'fiches') {
    const fiche = FICHES[ficheIndex]; const progress = ((ficheIndex+1)/FICHES.length)*100
    return (
      <div style={base}><NavBar />
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${progress}%\`,transition:'width 0.4s',borderRadius:'0 4px 4px 0'}}/></div>
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <span style={{fontSize:'13px',color:'#6b7280',fontWeight:'600'}}>{lang==='fr'?'FICHE':'CARD'} {ficheIndex+1}/{FICHES.length}</span>
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
            <button onClick={() => ficheIndex < FICHES.length-1 ? setFicheIndex(i => i+1) : setPhase('quiz1')} style={{flex:2,padding:'14px',background:C,border:'none',borderRadius:'12px',color:'white',cursor:'pointer',fontSize:'16px',fontWeight:'700'}}>
              {ficheIndex < FICHES.length-1 ? \`\${t.next} (\${ficheIndex+2}/\${FICHES.length}) →\` : t.quizBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz1') {
    const a = activeMatch[matchIndex]
    return (
      <div style={{...base,background:matchAnim==='correct'?'#d1fae5':matchAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:matchAnim==='correct'?'#6ee7b7':matchAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:\`\${(matchIndex/activeMatch.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'640px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'16px'}}>{t.q1label} — {matchIndex+1}/{activeMatch.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q1title}</h2>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',textAlign:'left'}}>
            <p style={{fontSize:'14px',fontWeight:'600',color:'#374151',lineHeight:1.7,margin:0}}>🎯 {a.result}</p>
          </div>
          {matchAnswer === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repMatch(true)} style={{padding:'18px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'13px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.match}</button>
              <button onClick={() => repMatch(false)} style={{padding:'18px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'13px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.fp}</button>
            </div>
          ) : (
            <div style={{background:matchAnim==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${matchAnim==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{matchAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:matchAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{matchAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{a.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeMatch.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=matchIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz2') {
    const q = activeVF[vfIndex]
    return (
      <div style={{...base,background:vfAnim==='correct'?'#d1fae5':vfAnim==='wrong'?'#fee2e2':'#f3f4f6',transition:'background 0.3s'}}><NavBar />
        <div style={{background:vfAnim==='correct'?'#6ee7b7':vfAnim==='wrong'?'#fca5a5':'#e5e7eb',height:'6px'}}>
          <div style={{background:C,height:'6px',width:\`\${(vfIndex/activeVF.length)*100}%\`,transition:'width 0.4s'}}/>
        </div>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'40px 24px',textAlign:'center'}}>
          <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'20px'}}>{t.q2label} — {vfIndex+1}/{activeVF.length}</span>
          <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',marginBottom:'20px'}}>{t.q2title}</h2>
          <div style={{background:'white',borderRadius:'20px',padding:'28px',boxShadow:'0 8px 32px rgba(0,0,0,0.08)',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80px'}}>
            <p style={{fontSize:'17px',fontWeight:'600',color:'#1f2937',lineHeight:1.5,margin:0}}>{q.texte}</p>
          </div>
          {vfRepondu === null ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <button onClick={() => repondreVF(true)} style={{padding:'20px',background:'#d1fae5',border:'2px solid #6ee7b7',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#059669',cursor:'pointer'}}>{t.true}</button>
              <button onClick={() => repondreVF(false)} style={{padding:'20px',background:'#fee2e2',border:'2px solid #fca5a5',borderRadius:'16px',fontSize:'20px',fontWeight:'800',color:'#ef4444',cursor:'pointer'}}>{t.false}</button>
            </div>
          ) : (
            <div style={{background:vfAnim==='correct'?'#d1fae5':'#fee2e2',border:\`2px solid \${vfAnim==='correct'?'#6ee7b7':'#fca5a5'}\`,borderRadius:'16px',padding:'20px'}}>
              <p style={{fontSize:'28px',margin:'0 0 8px'}}>{vfAnim==='correct'?'🎉':'😅'}</p>
              <p style={{fontWeight:'800',color:vfAnim==='correct'?'#059669':'#ef4444',fontSize:'18px',margin:'0 0 8px'}}>{vfAnim==='correct'?t.correct:t.wrong}</p>
              <p style={{color:'#374151',fontSize:'14px',margin:0,fontStyle:'italic'}}>{q.explication}</p>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
            {activeVF.map((_,i) => <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:i<=vfIndex?C:'#e5e7eb'}}/>)}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'quiz3') {
    const cas = activeCas[casIndex]
    return (
      <div style={base}><NavBar />
        <div style={{background:'#e5e7eb',height:'6px'}}><div style={{background:C,height:'6px',width:\`\${(casIndex/activeCas.length)*100}%\`}}/></div>
        <div style={{maxWidth:'620px',margin:'0 auto',padding:'40px 24px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <span style={{background:\`\${C}15\`,color:C,borderRadius:'20px',padding:'6px 16px',fontSize:'13px',fontWeight:'700',display:'inline-block',marginBottom:'12px'}}>{t.q3label} — {casIndex+1}/{activeCas.length}</span>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1f2937',margin:0}}>{t.q3title}</h2>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'20px',border:\`2px solid \${C}30\`,marginBottom:'20px'}}>
            <p style={{fontSize:'15px',fontWeight:'600',color:'#374151',lineHeight:1.6,margin:0}}>🎯 {cas.situation}</p>
          </div>
          {casRepondu === null ? (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {cas.options.map((opt,i) => (
                <button key={i} onClick={() => repCas(opt)} style={{padding:'14px 18px',background:'white',border:'1.5px solid #e5e7eb',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#374151',textAlign:'left'}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C;(e.currentTarget as HTMLElement).style.background=\`\${C}08\`}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e5e7eb';(e.currentTarget as HTMLElement).style.background='white'}}>
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>
                {cas.options.map((opt,i) => { const isC=opt===cas.action,isCh=opt===casRepondu; return (
                  <div key={i} style={{padding:'12px 16px',background:isC?'#d1fae5':isCh?'#fee2e2':'white',border:\`1.5px solid \${isC?'#6ee7b7':isCh?'#fca5a5':'#e5e7eb'}\`,borderRadius:'10px',fontSize:'14px',fontWeight:'600',color:isC?'#059669':isCh?'#ef4444':'#9ca3af'}}>
                    {isC?'✅ ':isCh?'❌ ':''}{opt}
                  </div>
                )})}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #6ee7b7',borderRadius:'12px',padding:'14px',marginBottom:'14px'}}>
                <p style={{margin:0,fontSize:'14px',color:'#374151',fontStyle:'italic'}}>💡 {cas.explication}</p>
              </div>
              <button onClick={nextCas} style={{width:'100%',padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
                {casIndex < activeCas.length-1 ? t.next2 : t.last}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const total=Math.min(100,score), medal=total>=80?'🥇':total>=50?'🥈':'🥉', msg=total>=80?t.medal_gold:total>=50?t.medal_silver:t.medal_bronze
  return (
    <div style={base}><NavBar />
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
          <button onClick={() => router.back()} style={{padding:'16px',background:C,border:'none',borderRadius:'12px',color:'white',fontSize:'17px',fontWeight:'700',cursor:'pointer'}}>{t.backHome}</button>
          <button onClick={() => {initQuizzes(lang);setScore(0);setPhase('intro')}} style={{padding:'14px',background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',color:C,fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>{t.restart}</button>
        </div>
      </div>
    </div>
  )
}
`, 'utf8');
console.log('✅ Name Screening écrit !');
