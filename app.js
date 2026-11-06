/* =========================================================================
   ARCHIVES — MÉMOIRES DE CULTURE POP
   Application : routage, recherche, filtres, favoris, galeries, visionneuse.
   ========================================================================= */

'use strict';

/* -------------------------------------------------------------------------
   Icônes
   ------------------------------------------------------------------------- */

const SVG = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m12 3.6 2.5 5.3 5.8.8-4.2 4.1 1 5.8-5.1-2.8-5.1 2.8 1-5.8L3.7 9.7l5.8-.8Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 5 8 12l7 7"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 5 7 7-7 7"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8V3h10v5"/><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 16h10v5H7z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="8.5" r="1.5"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5"/></svg>'
};

/* -------------------------------------------------------------------------
   Images documentaires
   ------------------------------------------------------------------------- */

const EXT = ['png', 'webp', 'jpg', 'jpeg'];

function asset(base, exts = EXT) {
  return exts.map((e) => `assets/${base}.${e}`);
}

const IMAGES = {
  okinawaAffiche: {
    id: 'okinawaAffiche',
    files: asset('okinawa-affiche', ['png', 'webp', 'jpg']),
    title: 'Affiche japonaise originale',
    caption: 'Affiche japonaise de sortie — Bakuto gaijin butai (Tōei, 1971).',
    credit: 'Document : affiche promotionnelle, collection privée.',
    portrait: true
  },
  okinawaGalerie: {
    id: 'okinawaGalerie',
    files: asset('okinawa-galerie'),
    title: 'Photogrammes du film',
    caption: 'Deux plans de Guerre des gangs à Okinawa — capture d’écran fournie par le lecteur (© Tōei, 1971).',
    credit: 'Capture d’écran de deux plans du film, non un document d’édition.'
  },
  kafkaFr: {
    id: 'kafkaFr',
    files: asset('kafka-couverture-fr'),
    title: 'Couverture de l’édition française',
    caption: 'Couverture de l’édition française — Belfond, 2006, traduction Corinne Atlan.',
    credit: 'Capture d’écran fournie par le lecteur ; document : couverture éditeur.'
  },
  kafkaJp: {
    id: 'kafkaJp',
    files: asset('kafka-galerie'),
    title: 'Édition japonaise',
    caption: 'Photographie de l’édition japonaise — Umibe no Kafuka, volume 1 (2002).',
    credit: 'Photographie documentaire ; document : édition originale.'
  },
  kafkaLibrairie: {
    id: 'kafkaLibrairie',
    files: asset('kafka-librairie'),
    title: 'Bibliothèque japonaise',
    caption: 'Intérieur d’une bibliothèque au Japon — décorations marines suspendues au plafond.',
    credit: 'Photographie documentaire, sans lien de production avec l’œuvre.'
  },
  kafkaForet: {
    id: 'kafkaForet',
    files: asset('kafka-foret'),
    title: 'Forêt et lanternes',
    caption: 'Chemin forestier bordé de lanternes de pierre — le motif du bois sacré.',
    credit: 'Photographie documentaire, sans lien de production avec l’œuvre.'
  },
  crowsManga: {
    id: 'crowsManga',
    files: asset('crows-manga'),
    title: 'Couverture du manga Crows',
    caption: 'Couverture du manga Crows de Hiroshi Takahashi (Akita Shoten, 1990-1998).',
    credit: 'Document : couverture manga.',
    portrait: true
  },
  crowsJaquette: {
    id: 'crowsJaquette',
    files: asset('crows-jaquette-galerie'),
    title: 'Jaquette / photographie du jeu Saturn',
    caption: 'Jaquette ou photographie de l’édition japonaise Saturn — Crows: The Battle Action (Athena, 1997).',
    credit: 'Document : édition commerciale japonaise.'
  },
  riverCity: {
    id: 'riverCity',
    files: asset('river-city-influences'),
    title: 'River City H.S. — capture de référence',
    caption: 'Capture issue d’un jeu de la série River City / Kunio-kun (Technōs), utilisée comme référence comparative du beat’em up scolaire à défilement horizontal.',
    credit: 'Cette image ne provient pas de Crows et n’est pas une capture du jeu Saturn.',
    warning: 'Document extérieur à Crows — ne jamais la présenter comme une capture du jeu Saturn.'
  }
};

/* Résolution des fichiers : essaie chaque extension, mémorise le résultat. */
const resolvedCache = new Map();

function resolveImage(slot) {
  if (resolvedCache.has(slot.id)) return resolvedCache.get(slot.id);

  const promise = new Promise((resolve) => {
    let i = 0;
    const probe = () => {
      if (i >= slot.files.length) { resolve(null); return; }
      const url = slot.files[i++];
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = probe;
      img.src = url;
    };
    probe();
  });

  resolvedCache.set(slot.id, promise);
  return promise;
}

function placeholderMarkup(slot, compact) {
  return `<div class="ph">
    ${SVG.image}
    <span class="ph-label">Document manquant</span>
    <span class="ph-file">${slot.files[0]}</span>
    ${compact ? '' : '<span class="ph-note">Déposez le fichier dans /assets</span>'}
  </div>`;
}

/* Crée un conteneur média avec sa légende (ou non). */
function mediaMarkup(slot, opts = {}) {
  const cls = ['media-shell'];
  if (opts.portrait || slot.portrait) cls.push('portrait');
  return `<div class="${cls.join(' ')}" data-slot="${slot.id}">${placeholderMarkup(slot, true)}</div>`;
}

function mountMedia(container) {
  const slot = IMAGES[container.dataset.slot];
  if (!slot) return;

  resolveImage(slot).then((url) => {
    if (!url) return;
    const img = document.createElement('img');
    img.alt = slot.caption;
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = url;
    img.addEventListener('load', () => {
      img.classList.add('is-loaded');
      container.classList.remove('is-missing');
      const ph = container.querySelector('.ph');
      if (ph) ph.remove();
    });
    container.prepend(img);
  });
}

function hydrateMedia(root) {
  root.querySelectorAll('.media-shell[data-slot]').forEach((el) => {
    if (!el.dataset.mounted) {
      el.dataset.mounted = '1';
      mountMedia(el);
    }
  });
}

/* -------------------------------------------------------------------------
   Contenus documentaires
   ------------------------------------------------------------------------- */

const WORKS = [
  {
    id: 'guerre-des-gangs-okinawa',
    route: 'cinema/guerre-des-gangs-okinawa',
    category: 'cinema',
    categoryLabel: 'Cinéma',
    jp: '映画',
    title: 'Guerre des gangs à Okinawa',
    original: '博徒外人部隊 — Bakuto gaijin butai',
    year: '1971',
    kicker: 'Yakuza eiga',
    summary: 'Un oyabun sort de dix ans de prison et tente de refonder son clan sur une île sous administration américaine. Fukasaku filme la fin d’un monde plutôt que sa gloire.',
    cover: 'okinawaAffiche',
    keywords: 'kinji fukasaku toei yakuza okinawa 1971 koji tsuruta noboru ando japon',
    meta: [
      ['Réalisation', 'Kinji Fukasaku'],
      ['Année', '1971'],
      ['Durée', '93 minutes'],
      ['Production', 'Tōei'],
      ['Format', 'Couleur · 2.35 · 35 mm']
    ],
    sections: [
      {
        id: 'identification',
        title: 'Identification',
        blocks: [
          { table: [
            ['Titre français', 'Guerre des gangs à Okinawa'],
            ['Titre original', '博徒外人部隊 (Bakuto gaijin butai) — littéralement « la légion étrangère des joueurs »'],
            ['Réalisation', 'Kinji Fukasaku'],
            ['Scénario', 'Kinji Fukasaku, Norio Koonami, Hiroo Matsuda (graphie de la fiche Wikipédia)'],
            ['Photographie', 'Hanjirō Nakasawa'],
            ['Musique', 'Tsuneo Yamashita'],
            ['Montage', 'Kinji Fukasaku'],
            ['Production', 'Tōei (Tokyo)'],
            ['Année de sortie', '1971 (Japon)'],
            ['Durée', '93 minutes'],
            ['Format', 'Couleur — 2.35 — 35 mm — mono'],
            ['Genre', 'Yakuza eiga, drame criminel'],
            ['Interprètes', 'Kōji Tsuruta, Noboru Andō, Kenji Imai, Tomisaburō Wakayama']
          ] },
          { p: 'Le film appartient à la grande décennie du yakuza eiga, quand la Tōei produisait à cadence industrielle des chroniques de gangsters ancrées dans le Japon d’après-guerre. Il précède de deux ans <em>Combat sans code d’honneur</em>, qui imposera Fukasaku comme le chroniqueur brutal de la fin des utopies criminelles.' }
        ]
      },
      {
        id: 'contexte-historique',
        title: 'Contexte historique et politique',
        blocks: [
          { p: 'En 1971, Okinawa n’est pas encore redevenue japonaise. L’archipel est placé depuis 1945 sous administration civile américaine ; l’accord de rétrocession est signé cette année-là et n’entrera en vigueur qu’en mai 1972. L’île est donc, au moment du tournage, une marge juridique, économique et militaire — un territoire où le yen, le dollar et la loi se superposent.' },
          { p: 'Le Japon de 1971 sort à peine des grandes luttes étudiantes et des débats sur la sécurité nationale. La criminalité organisée y est un acteur économique banalisé, imbriqué dans l’immobilier, la construction et les quartiers de nuit. Fukasaku, né en 1930, a connu la fin de la guerre adolescent : son cinéma portera constamment la mémoire d’un pays où les institutions ont failli.' },
          { p: 'Le titre original dit l’essentiel : <em>bakuto</em> (joueur professionnel), <em>gaijin</em> (étranger), <em>butai</em> (brigade). Une troupe d’étrangers sur leur propre sol — la formule résume la position des yakuza d’Okinawa comme celle des Japonais revenus d’ailleurs.' }
        ]
      },
      {
        id: 'okinawa-presence-americaine',
        title: 'Okinawa et la présence américaine',
        blocks: [
          { p: 'Le film fait d’Okinawa un personnage : chaleur, poussière, routes neuves, enseignes en deux langues, bases derrière les grillages. La présence américaine n’y est pas un décor exotique mais une structure économique — emplois, terrains, trafics, prostitution, circuits de redistribution.' },
          { p: 'Cette géographie permet à Fukasaku d’opposer deux temporalités : le Japon continental, avec ses clans installés et ses notables, et une île où tout reste à prendre. Le récit de reconquête devient dès lors une fable sur la colonisation intérieure, où les gangs venus du Nord traitent Okinawa comme un marché.' },
          { callout: {
            tag: 'Précaution',
            text: 'Les lieux de tournage exacts et le degré d’implication des autorités locales ne sont pas documentés dans cette fiche. À vérifier sur les archives de la Tōei et la presse japonaise de 1971.'
          } }
        ]
      },
      {
        id: 'direction-artistique',
        title: 'Direction artistique et style visuel',
        blocks: [
          { p: 'La palette est celle du Tōei de l’époque, poussée vers le minéral : ocres, bruns de terre, verts de végétation, blancs surexposés des chemises, et un rouge de sang qui sert de seule saturation franche. Les costumes noirs des hommes de main y découpent des silhouettes d’encre.' },
          { p: 'L’affiche japonaise condense ce programme : un aplomb rouge sang détoure les corps, les visages sont serrés au plus près, le titre s’inscrit en calligraphie épaisse. Rien de décoratif — le graphisme annonce une violence de contact.' },
          { p: 'Les intérieurs sont traités comme des boîtes : tatamis, cloisons coulissantes, ampoules nues. Dehors, la lumière d’Okinawa écrase les contrastes et transforme les costumes en taches sombres. Ce contraste dedans/dehors structure toute la mise en scène.' },
          { p: 'Influences : le film noir américain pour les cadrages et les visages, le documentaire d’après-guerre pour la texture, et la tradition du <em>yakuza eiga</em> pour les codes vestimentaires. Fukasaku retient surtout la leçon du cinéma de guerre : les groupes, pas les héros.' }
        ]
      },
      {
        id: 'photographie-mise-en-scene',
        title: 'Photographie et mise en scène',
        blocks: [
          { p: 'Hanjirō Nakasawa compose en 2.35 avec une prédilection pour les plans larges où les corps occupent les bords du cadre, laissant un vide au centre. Ce vide est dramatique : il est l’espace de la négociation, puis celui de la déflagration.' },
          { p: 'Fukasaku assure lui-même le montage. Cette position lui permet des ruptures abruptes : ellipses sèches, raccords dans le mouvement, scènes de repas coupées au milieu d’une phrase. Le récit avance par blocs, sans transition narrative.' },
          { p: 'La caméra reste souvent au niveau des épaules, à hauteur d’homme assis. Les plongées sont rares ; les contre-plongées réservées aux figures d’autorité. Cette grammaire simple rend la violence lisible, presque administrative.' },
          { p: 'À observer : la manière dont les groupes entrent dans le cadre. Presque toujours en masse, par le fond ou latéralement, jamais un par un. La mise en scène pense en factions avant de penser en individus.' }
        ]
      },
      {
        id: 'narration',
        title: 'Narration',
        blocks: [
          { p: 'Gunji Sadao, oyabun du clan Hamamura, sort de prison après dix ans. Le clan Daitō règne désormais sur Yokohama. Avec Ozaki et Samejima, derniers survivants, il gagne Okinawa pour y refonder sa maison — et s’y heurte aux gangs déjà en place.' },
          { p: 'La structure est celle d’une reconquête qui se retourne en dépossession. Chaque victoire ouvre une dette ; chaque alliance produit un ennemi futur. Le film épouse cette usure jusqu’au constat amer : on ne refonde pas un clan, on prolonge sa disparition.' },
          { p: 'Le rythme procède par cycles : conciliabules, repas, serments, puis éclat de violence expéditive. Cette alternance de compression et de décharge deviendra la signature de Fukasaku.' }
        ]
      },
      {
        id: 'personnages',
        title: 'Personnages',
        blocks: [
          { ul: [
            '<strong>Gunji</strong> (Kōji Tsuruta) — l’oyabun revenu du pénitencier. Homme d’honneur dans un monde qui n’en veut plus ; sa droiture est une forme de retard historique.',
            '<strong>Shark</strong> (Noboru Andō) — figure de la génération suivante, plus pragmatique, plus dangereuse. Andō, ancien yakuza réel devenu acteur, apporte au rôle une crédibilité physique que la mise en scène exploite.',
            '<strong>Mad Dog Jiro</strong> (Kenji Imai) — la violence pure, sans calcul, qui déborde les stratégies des anciens.',
            '<strong>Yonabaru</strong> (Tomisaburō Wakayama) — l’interlocuteur okinawais, représentant d’un pouvoir local qui négocie sa survie entre deux occupations.'
          ] },
          { p: 'Fukasaku ne construit pas de psychologie individuelle : il distribue des positions. Chaque personnage est défini par sa place dans une chaîne d’obligations, et c’est la pression exercée sur cette place qui produit le drame.' }
        ]
      },
      {
        id: 'themes',
        title: 'Thèmes',
        blocks: [
          { ul: [
            'L’honneur comme valeur résiduelle : ce qui reste quand les structures qui le rendaient utile ont disparu.',
            'Le territoire : Okinawa comme marché à conquérir, avec sa population traitée en décor par les clans du continent.',
            'La masculinité vieillissante : des hommes qui ne savent faire que la guerre et découvrent qu’on ne les attend plus.',
            'La violence comme héritage : elle se transmet, elle ne se choisit pas.',
            'Le rapport colonial intérieur entre centre et périphérie, entre Tokyo/Yokohama et l’archipel.'
          ] },
          { p: 'Le film est moins un éloge du gangstérisme qu’une chronique de liquidation. Ce qui intéresse Fukasaku, c’est le moment où les codes cessent de protéger ceux qui les respectent.' }
        ]
      },
      {
        id: 'reception',
        title: 'Réception et critique',
        blocks: [
          { p: 'Le film s’inscrit dans la production courante de la Tōei et connaît une carrière commerciale normale avant de devenir, avec le temps, une référence de cinéphiles. Sa redécouverte en Occident doit beaucoup à l’aura de Fukasaku et à l’édition vidéo.' },
          { p: '<em>Sonatine, mélodie mortelle</em> (Takeshi Kitano, 1993) est régulièrement cité comme héritier direct de ce film — parenté de climat plus que de plagiat, d’autant que Kitano hérita de la réalisation de <em>Violent Cop</em> après le désistement de Fukasaku.' },
          { p: 'En France, l’édition DVD de la collection « Les Introuvables » a contribué à installer le titre dans les rayonnages des amateurs de yakuza eiga. La critique récente insiste sur la continuité avec la tétralogie <em>Combat sans code d’honneur</em> : même méthode, même désenchantement.' },
          { callout: {
            tag: 'À vérifier',
            text: 'Les chiffres de fréquentation japonaise et les coupures éventuelles des éditions internationales ne sont pas renseignés ici.'
          } }
        ]
      },
      {
        id: 'pistes',
        title: 'Pistes d’observation',
        blocks: [
          { ol: [
            'Compter les entrées de groupe : qui entre en premier, qui reste au fond du cadre ?',
            'Repérer les trois couleurs dominantes et leur répartition entre intérieurs et extérieurs.',
            'Comparer la scène de repas initiale et la dernière scène de table : même rituel, sens inversé.',
            'Écouter le mono : les ambiances sont souvent plus fortes que la musique.',
            'Observer la place des femmes — quasi absentes, sauf comme enjeu ou comme décor.',
            'Mettre en regard avec <em>Combat sans code d’honneur</em> (1973) pour mesurer ce que Fukasaku durcit en deux ans.'
          ] }
        ]
      },
      {
        id: 'sources',
        title: 'Sources et références',
        blocks: [
          { ul: [
            'Wikipédia (fr), « Guerre des gangs à Okinawa », consulté en novembre 2026.',
            'Wikipédia (ja), fiche de Kinji Fukasaku et filmographie Tōei.',
            'Base de données IMDb / TMDb : fiche technique et distribution.',
            'Sancho Asia : notice de présentation du film.',
            'Édition vidéo française, collection « Les Introuvables ».'
          ] },
          { p: '<em>Les dates, la durée et l’équipe technique sont recoupées sur la fiche Wikipédia ; les interprétations esthétiques relèvent de l’analyse et sont signalées comme telles.</em>' }
        ]
      }
    ],
    gallery: ['okinawaAffiche', 'okinawaGalerie']
  },

  {
    id: 'kafka-sur-le-rivage',
    route: 'litterature/kafka-sur-le-rivage',
    category: 'litterature',
    categoryLabel: 'Littérature',
    jp: '文学',
    title: 'Kafka sur le rivage',
    original: '海辺のカフカ — Umibe no Kafuka',
    year: '2002',
    kicker: 'Roman',
    summary: 'Deux fugues parallèles, une bibliothèque, une prophétie œdipienne et un chat qui parle : Murakami construit un roman à relire, où chaque symbole contient sa propre clé.',
    cover: 'kafkaFr',
    keywords: 'haruki murakami kafka umibe kafuka japon roman 2002 belfond corinne atlan',
    meta: [
      ['Auteur', 'Haruki Murakami'],
      ['Parution', '2002 (Japon)'],
      ['Traduction', 'Corinne Atlan'],
      ['Édition française', 'Belfond, 2006'],
      ['Genre', 'Roman · réalisme magique']
    ],
    sections: [
      {
        id: 'identification-editions',
        title: 'Identification et éditions',
        blocks: [
          { table: [
            ['Titre original', '海辺のカフカ (Umibe no Kafuka)'],
            ['Auteur', 'Haruki Murakami (né en 1949)'],
            ['Publication originale', '2002, Japon'],
            ['Traduction française', 'Corinne Atlan'],
            ['Édition française', 'Belfond, 2006'],
            ['Genre', 'Roman — réalisme magique, fantastique contemporain'],
            ['Distinction', 'Prix World Fantasy (roman), 2006'],
            ['Adaptations', 'Théâtre (Frank Galati, 2009) ; feuilleton radiophonique France Culture (2011)']
          ] },
          { p: 'Dixième roman de Murakami, <em>Kafka sur le rivage</em> paraît trois ans après <em>Les Amants du Spoutnik</em> et quatre ans après <em>Underground</em>, son enquête sur l’attentat au gaz sarin de 1995. Ce voisinage compte : le livre hérite d’une réflexion sur la violence souterraine de la société japonaise.' },
          { p: 'Le titre français conserve le nom du héros, Kafka Tamura, pseudonyme choisi par un adolescent de quinze ans. En tchèque, <em>kafka</em> signifie « corbeau » — le roman ne cessera de jouer sur cette double appartenance, littéraire et animale.' }
        ]
      },
      {
        id: 'contexte-litteraire',
        title: 'Contexte littéraire',
        blocks: [
          { p: 'Murakami publie depuis 1979 et occupe une position singulière : écrivain japonais traduit dans le monde entier, nourri de culture américaine (jazz, rock, cinéma, roman policier), souvent discuté pour son style « traduisible » et son cosmopolitanisme.' },
          { p: 'Dans le paysage japonais, le roman dialogue avec Sōseki (dont Kafka lit <em>Les Coquelicots</em> et <em>Le Mineur</em>) et avec Kenzaburō Ōe, dont <em>M/T et l’histoire des merveilles de la forêt</em> a pu inspirer la forêt-refuge. Murakami revendique pourtant moins une filiation qu’une déconstruction du système romanesque, à la manière dont Kafka avait fracturé le sien.' },
          { p: 'Le livre s’inscrit aussi dans un moment de mondialisation éditoriale : best-seller international, il est discuté dans la presse française comme une « fable » ou une « allégorie », catégories qui disent autant l’horizon d’attente des critiques que le contenu du roman.' }
        ]
      },
      {
        id: 'style-atmosphere',
        title: 'Style et atmosphère',
        blocks: [
          { p: 'La prose de Murakami est d’apparence plate : phrases courtes, précisions domestiques, énumérations de gestes et d’objets. Cette neutralité fabrique un réel très net, dans lequel l’étrange peut s’insérer sans effraction.' },
          { p: 'Le narrateur de Kafka emploie le pronom <em>boku</em>, forme familière qui installe d’emblée une intimité avec le lecteur. Nakata, lui, parle de lui à la troisième personne et ne sait plus lire : deux voix, deux rapports au langage, deux vitesses de conscience.' },
          { p: 'L’atmosphère est celle d’une lumière de bord de mer, de bibliothèques en bois, de chambres d’hôtel anonymes. Les scènes oniriques y gagnent une netteté presque photographique — ce que la critique Martine Laval appelle « la précision des rêves ».' }
        ]
      },
      {
        id: 'construction-narrative',
        title: 'Construction narrative',
        blocks: [
          { p: 'Le récit alterne deux lignes. Les chapitres impairs suivent Kafka, en narration autodiégétique ; les chapitres pairs suivent Nakata, en focalisation externe. Les deux trajectoires convergent vers la bibliothèque de Takamatsu.' },
          { p: 'Murakami insère des documents : rapports « top secret » du Military Intelligence Service sur l’incident de 1944, lettre d’une ancienne institutrice, intermède entre les chapitres 46 et 47. Ces pièces administratives ne résolvent rien : elles donnent à l’étrange une épaisseur d’archive.' },
          { p: 'La structure est circulaire plutôt que linéaire. Le prologue installe un dialogue avec le « garçon nommé Corbeau » ; la fin renvoie le héros au seuil. Entre les deux, le roman accumule des motifs qui se répondent — chanson, tableau, pierre, forêt — sans jamais fournir de mode d’emploi.' }
        ]
      },
      {
        id: 'personnages',
        title: 'Personnages',
        blocks: [
          { ul: [
            '<strong>Kafka Tamura</strong> — quinze ans, fuit Tokyo et la prophétie paternelle. Son prénom est une invention ; sa quête est celle d’une mère et d’une sœur perdues.',
            '<strong>Satoru Nakata</strong> — vieillard amnésique, analphabète, capable de parler aux chats. Son handicap est la séquelle d’un événement survenu pendant la guerre.',
            '<strong>Oshima</strong> — bibliothécaire, mentor de Kafka, homme transgenre. Il introduit dans le récit la tragédie grecque et le mythe de l’androgyne.',
            '<strong>Mademoiselle Saeki</strong> — directrice de la bibliothèque, compositrice d’une chanson intitulée « Kafka sur le rivage », figure maternelle et amoureuse.',
            '<strong>Sakura</strong> — jeune femme rencontrée sur la route, sœur possible.',
            '<strong>Le garçon nommé Corbeau</strong> — double ailé de Kafka, interlocuteur du prologue.',
            '<strong>Johnnie Walker</strong> — figure de la violence sacrificielle, rencontre décisive pour Nakata.'
          ] },
          { p: 'Les personnages sont moins des psychologies que des fonctions : chacun incarne une manière de traverser la perte. Leur force vient de leur solitude, jamais totalement levée, même lorsque les liens se tissent.' }
        ]
      },
      {
        id: 'symbolisme',
        title: 'Symbolisme',
        blocks: [
          { p: 'Le roman fonctionne par résonances plutôt que par clés. La chanson « Kafka sur le rivage », composée par Saeki trente ans plus tôt, annonce des éléments de l’intrigue et constitue à la fois l’énigme et sa propre solution. Le tableau du même nom figure la scène du refrain — un homme au bord de la mer, un transat, une ombre de sphinx.' },
          { ul: [
            'La mer et le rivage : seuil entre deux mondes, lieu de l’attente et de la séparation.',
            'La forêt : refuge et épreuve initiatique, écho du village de Kenzaburō Ōe.',
            'Les chats : passeurs de langage, comiques et inquiétants.',
            'La pierre d’entrée : objet rituel qui ouvre une porte entre les mondes.',
            'La musique : Beethoven et le jazz, obsessions sonores du roman.',
            'Le corbeau : nom tchèque de Kafka, double du héros, figure de la lucidité.'
          ] },
          { p: 'Le symbolisme n’est jamais fermé : Murakami donne aux images assez de précision pour être reconnaissables et assez d’ouverture pour que chaque lecteur y projette sa propre interprétation.' }
        ]
      },
      {
        id: 'themes',
        title: 'Thèmes',
        blocks: [
          { p: 'Le mythe d’Œdipe fournit l’armature : un père qui maudit, un fils qui fuit, une mère et une sœur possibles dans chaque femme rencontrée. Mais Murakami déplace la question : Kafka connaît le mythe, il en est obsédé, et c’est précisément cette connaissance qui rend la prophétie agissante.' },
          { p: 'À cela s’ajoutent la responsabilité née de l’imagination (formule empruntée à Yeats et discutée via Hannah Arendt), la mémoire de la guerre, la violence de la société japonaise, la construction de genre (Oshima), la solitude adolescente et le passage à l’âge adulte.' },
          { p: 'Le roman ne tranche pas entre rêve et réel : il maintient les deux régimes en coexistence, ce qui est aussi une position éthique — refuser la simplification du monde.' }
        ]
      },
      {
        id: 'reception-critique',
        title: 'Réception critique',
        blocks: [
          { p: 'À sa sortie française, en 2006, la critique est frappée d’une étonnante convergence : le livre est présenté comme une fable, une allégorie ou une métaphore, sans que les recenseurs proposent d’interprétation stabilisée.' },
          { p: 'René de Ceccatty, dans <em>Le Monde</em>, y voit au contraire une « démonstration » appuyée, reprochant à Murakami ses résumés fréquents et ses explications en forme de questions-réponses entre Oshima et Kafka. D’autres, comme André Clavel ou Claude Leblanc, insistent sur le caractère à la fois très japonais (animisme, monde double, fantômes) et très occidental (références littéraires, tragédie antique) du roman.' },
          { p: 'Le prix World Fantasy (roman) en 2006 consacre la porosité du livre aux genres de l’imaginaire. Les adaptations scéniques et radiophoniques — Frank Galati en 2009, France Culture en 2011 — confirment sa théâtralité : peu de décors, beaucoup de voix.' },
          { callout: {
            tag: 'Débat',
            text: 'La critique française s’est divisée sur la part didactique du roman : chef-d’œuvre d’ouverture ou machine à expliquer ? Les deux lectures coexistent dans les comptes rendus de 2006.'
          } }
        ]
      },
      {
        id: 'pistes-lecture',
        title: 'Pistes de lecture',
        blocks: [
          { ol: [
            'Lire le roman une seconde fois en notant les motifs qui apparaissent avant leur « explication ».',
            'Suivre la chanson et le tableau comme deux versions d’une même scène : qui regarde qui ?',
            'Comparer les deux voix narratives : que sait Nakata que Kafka ignore, et inversement ?',
            'Repérer les scènes de repas : elles scandent les transitions entre les mondes.',
            'Tenir une liste des animaux — chats, corbeaux, poissons — et de leurs fonctions.',
            'Mettre en regard le mythe d’Œdipe et la manière dont Murakami le déplace vers la question de l’imagination.'
          ] }
        ]
      },
      {
        id: 'sources',
        title: 'Sources et références',
        blocks: [
          { ul: [
            'Wikipédia (fr), « Kafka sur le rivage », consulté en novembre 2026.',
            'Haruki Murakami, « Questions for Murakami about Kafka on the Shore », harukimurakami.com.',
            'Anne-Sophie Trottier, <em>Les empreintes du mythe d’Œdipe dans Kafka sur le rivage d’Haruki Murakami et Les Gommes d’Alain Robbe-Grillet</em>, mémoire de maîtrise, Université Laval, 2018.',
            'René de Ceccatty, « Une démonstration de Murakami », <em>Le Monde</em>, 13 janvier 2006.',
            'André Clavel, « La damnation de Kafka », <em>L’Express</em>, 26 janvier 2006.'
          ] },
          { p: '<em>Les informations éditoriales (Belfond, 2006, traduction Corinne Atlan) sont vérifiées ; les citations critiques sont référencées et attribuées.</em>' }
        ]
      }
    ],
    gallery: ['kafkaFr', 'kafkaJp', 'kafkaLibrairie', 'kafkaForet']
  },

  {
    id: 'crows-battle-action',
    route: 'retro-gaming/crows-battle-action',
    category: 'retro-gaming',
    categoryLabel: 'Rétro-gaming',
    jp: '遊戯',
    title: 'Crows: The Battle Action',
    original: 'クローズ THE BATTLE ACTION FOR SEGA SATURN',
    year: '1997',
    kicker: 'Beat’em up · Sega Saturn',
    summary: 'Adaptation du manga yankī de Hiroshi Takahashi sur une Saturn en fin de vie : un objet japonais confidentiel, à documenter autant qu’à jouer.',
    cover: 'crowsManga',
    keywords: 'crows athena sega saturn 1997 beat them all beat em up hiroshi takahashi suzuran bouya',
    meta: [
      ['Développeur / éditeur', 'Athena'],
      ['Plateforme', 'Sega Saturn'],
      ['Date japonaise', '18 décembre 1997'],
      ['Référence', 'T-16806G'],
      ['Genre', 'Beat’em up']
    ],
    sections: [
      {
        id: 'identification',
        title: 'Identification',
        blocks: [
          { table: [
            ['Titre', 'Crows: The Battle Action for Sega Saturn'],
            ['Titre japonais', 'クローズ THE BATTLE ACTION FOR SEGA SATURN'],
            ['Développeur / éditeur', 'Athena'],
            ['Plateforme', 'Sega Saturn (Japon uniquement)'],
            ['Date de sortie', '18 décembre 1997'],
            ['Référence produit', 'T-16806G'],
            ['Support', 'CD-ROM'],
            ['Genre', 'Beat’em up'],
            ['Licence', 'Crows, manga de Hiroshi Takahashi (Akita Shoten, 1990-1998)']
          ] },
          { p: 'Le jeu adapte <em>Crows</em>, manga de bagarre lycéenne publié dans <em>Monthly Shōnen Champion</em> de 1990 à 1998, en 26 volumes. Il s’agit d’une production japonaise, jamais exportée officiellement, ce qui explique la rareté de la documentation en langues occidentales.' }
        ]
      },
      {
        id: 'contexte-sortie',
        title: 'Contexte de sortie',
        blocks: [
          { p: 'Décembre 1997 : la Saturn achève sa carrière commerciale, distancée par la PlayStation et la Nintendo 64. Le marché japonais reste néanmoins dense en adaptations de licences, et les éditeurs continuent d’alimenter un public fidèle de joueurs d’arcade et de mangas.' },
          { p: 'Athena est un studio japonais connu pour ses jeux de tir et son outil de création <em>Dezaemon</em>. L’adaptation d’un manga à succès relève pour lui d’un travail de commande : transposer des bagarres dessinées en systèmes de combat.' },
          { p: 'Le manga connaît alors une véritable circulation transmédia : OVA en deux épisodes chez Knack Productions en 1994, puis, bien plus tard, trilogie de films live <em>Crows Zero</em> (Takashi Miike, 2007), <em>Crows Zero 2</em> (2009) et <em>Crows Explode</em> (Toshiaki Toyoda, 2014). Un jeu PlayStation 4, <em>Crows: Burning Edge</em>, paraîtra en 2016.' }
        ]
      },
      {
        id: 'univers-manga',
        title: 'Univers du manga',
        blocks: [
          { p: 'Le lycée Suzuran, établissement réputé pour ses délinquants, sert de théâtre à une guerre de territoires entre établissements rivaux. Les élèves y portent le <em>gakuran</em> noir, uniforme qui devient l’emblème du groupe — les « corbeaux » du titre.' },
          { p: 'Harumichi Bōya, personnage central, refuse le leadership tout en s’imposant par sa force. Autour de lui : Yasuda, Kirishima, Bandō, Rindaman, puis les clans extérieurs (Kurotaki, Hōsen). La série privilégie les affrontements collectifs et une camaraderie virile traversée d’humour.' },
          { p: 'Le jeu hérite de cette structure : une hiérarchie d’adversaires à gravir, des groupes à identifier, des figures de boss. La fidélité au manga se joue moins dans l’intrigue que dans la reconnaissance des silhouettes.' }
        ]
      },
      {
        id: 'direction-artistique',
        title: 'Direction artistique',
        blocks: [
          { p: 'Le matériau d’origine impose sa palette : uniformes noirs, chemises blanches, cheveux décolorés, béton des toits et des couloirs. Le trait de Takahashi, épais et contrasté, privilégie les visages déformés par l’effort et les corps massifs.' },
          { p: 'L’adaptation doit traduire cette lisibilité graphique dans un jeu : silhouettes immédiatement identifiables, décors sobres pour laisser lire les échanges, interface discrète. Les contraintes de la Saturn — résolution et mémoire texture — orientent nécessairement le rendu.' },
          { callout: {
            tag: 'Incertitude',
            text: 'Le traitement visuel exact (sprites 2D, polygones 3D ou mélange des deux) n’est pas confirmé par une source consultée à ce jour. À documenter directement sur le jeu ou le manuel japonais.'
          } }
        ]
      },
      {
        id: 'graphismes-animations',
        title: 'Graphismes et animations',
        blocks: [
          { p: 'À la fin de 1997, les beat’em up japonais oscillent entre sprites richement animés et premières 3D polygonales. La Saturn, réputée pour sa 2D, accueille les deux approches selon les studios.' },
          { p: 'Pour <em>Crows</em>, les sources disponibles ne permettent pas de trancher. Cette fiche signale donc l’absence de documentation visuelle fiable plutôt que de décrire un rendu non vérifié.' },
          { p: 'Ce qu’il faut observer si l’on a le jeu : la résolution interne, le nombre d’images d’animation par coup, la gestion des collisions, la fréquence des ralentissements lors des mêlées, et la présence éventuelle d’effets de transparence.' },
          { callout: {
            tag: 'Emplacement documentaire',
            text: 'La jaquette et les captures du jeu manquent encore dans /assets. Aucune reproduction n’a été fabriquée : les emplacements restent vides jusqu’à l’ajout des documents.'
          } }
        ]
      },
      {
        id: 'gameplay',
        title: 'Gameplay et commandes',
        blocks: [
          { p: 'Le genre de référence est le beat’em up à défilement : progression vers la droite, vagues d’adversaires, alternance de coups simples, de projections et de coups spéciaux, affrontements de boss en fin de stage.' },
          { p: 'La déclinaison « scolaire » du genre ajoute une lecture de foule : plusieurs adversaires en cercle, gestion des distances, priorité donnée à l’esquive et au replacement. C’est là que l’univers de Takahashi trouve sa traduction mécanique la plus juste.' },
          { callout: {
            tag: 'À vérifier avant publication',
            text: 'Les commandes précises, les jauges, les armes ramassables et les personnages déblocables ne sont pas documentés de façon fiable dans les sources consultées. Cette fiche ne les invente pas : elle indique les points à confirmer sur le manuel japonais (référence T-16806G) ou sur une session de jeu.'
          } },
          { ul: [
            'Nombre de boutons réellement utilisés et configuration de la manette Saturn.',
            'Existence d’un mode deux joueurs et d’un mode versus.',
            'Présence de jauges de vie, de furie ou de combo.',
            'Liste des personnages jouables et conditions de déblocage.'
          ] }
        ]
      },
      {
        id: 'personnages',
        title: 'Personnages',
        blocks: [
          { p: 'Le manga fournit un vivier de figures : Harumichi Bōya, le héros nonchalant ; Yasuda, l’ami frêle ; Kirishima, le rival devenu allié ; Bandō, le boss brutal ; Rindaman, le solitaire invincible ; et les chefs des clans extérieurs.' },
          { p: 'La question ouverte est celle du casting jouable : le jeu suit-il uniquement Bōya, ou propose-t-il plusieurs protagonistes ? Les sources consultées ne le confirment pas.' },
          { callout: {
            tag: 'Incertitude',
            text: 'Le roster jouable, les apparitions de personnages secondaires et les éventuels combattants originaux créés pour le jeu restent à vérifier.'
          } }
        ]
      },
      {
        id: 'modes-jeu',
        title: 'Modes de jeu',
        blocks: [
          { p: 'Un beat’em up de cette période propose généralement un mode histoire solo, parfois un mode deux joueurs coopératif, et parfois un mode versus. Pour <em>Crows: The Battle Action</em>, ces éléments ne sont pas attestés par une source fiable à ce jour.' },
          { p: 'Cette absence de documentation est en soi un fait : elle situe le jeu dans la catégorie des productions Saturn tardives, peu couvertes par la presse spécialisée occidentale de l’époque.' },
          { callout: {
            tag: 'Méthode',
            text: 'Toute information ajoutée ultérieurement devra être sourcée (manuel, magazine japonais de 1997, capture vérifiée) et datée dans la section Sources.'
          } }
        ]
      },
      {
        id: 'reception',
        title: 'Réception',
        blocks: [
          { p: 'La couverture occidentale du jeu est rare. À la date de rédaction de cette fiche, la page dédiée sur Sega Retro n’était pas disponible, et les bases de données généralistes ne fournissent que des informations minimales.' },
          { p: 'Le titre circule surtout auprès des collectionneurs de Saturn japonaise et des amateurs de beat’em up méconnus. Sa valeur tient à la conjonction d’une licence populaire au Japon et d’une sortie tardive sur une machine en fin de cycle.' },
          { p: 'Il ne faut donc pas confondre rareté documentaire et qualité : l’absence de critique ne préjuge ni du plaisir de jeu ni de sa qualité technique.' }
        ]
      },
      {
        id: 'influences',
        title: 'Influences et parentés vidéoludiques',
        special: true,
        blocks: [
          { p: 'Le beat’em up scolaire à défilement horizontal possède une lignée identifiable, dont la série <em>Kunio-kun</em> de Technōs est l’un des jalons. <em>Downtown Nekketsu Monogatari</em> (1989), connu en Occident sous le titre <em>River City Ransom</em>, fixe plusieurs conventions du genre : lycée, bandes rivales, défilement latéral, coopération à deux, humour et progression par statistiques.' },
          { p: 'La comparaison avec <em>Crows</em> est éclairante mais asymétrique. Les deux œuvres partagent un cadre scolaire et une violence de bandes ; elles divergent par le ton — comique et cartoonesque chez Technōs, dramatique et hiérarchique chez Takahashi — et par l’époque : 1989 pour l’un, 1997 pour l’autre.' },
          { gallery: ['riverCity'], single: true },
          { callout: {
            tag: 'Avertissement documentaire',
            warn: true,
            text: 'L’image ci-dessus provient d’un jeu de la série River City / Kunio-kun. Elle ne provient pas de Crows et ne doit jamais être présentée comme une capture du jeu Sega Saturn. Elle sert uniquement de référence comparative pour situer le beat’em up scolaire à défilement horizontal.'
          } },
          { p: 'Ce qui circule d’un jeu à l’autre : la lecture de la foule, la gestion de l’espace latéral, la coopération. Ce qui ne circule pas : la culture du <em>yankī</em>, la hiérarchie des clans et la gravité du manga de Takahashi.' }
        ]
      },
      {
        id: 'pistes',
        title: 'Pistes d’observation',
        blocks: [
          { ol: [
            'Comparer une planche du manga et une séquence de jeu : quels traits graphiques survivent à la conversion ?',
            'Mesurer la vitesse de défilement et la densité des vagues d’adversaires.',
            'Observer la gestion du cadre : la caméra suit-elle le joueur ou impose-t-elle des arènes fermées ?',
            'Écouter la bande-son : reprises, thèmes originaux, qualité de l’échantillonnage.',
            'Vérifier la présence d’un mode deux joueurs et sa stabilité.',
            'Documenter le manuel japonais : commandes, modes, crédits.'
          ] }
        ]
      },
      {
        id: 'sources',
        title: 'Sources et références',
        blocks: [
          { ul: [
            'Wikipédia (en), « Crows (manga) », section Video games — Saturn, consulté en novembre 2026.',
            'Wikipédia (fr), « Crows (manga) », consulté en novembre 2026.',
            'Wikipédia (ja), filmographie et ludographie liées à Crows.',
            'Hardcore Gaming 101, notice « Crows: The Battle Action for SegaSaturn » (référence citée, page en maintenance lors de la consultation).',
            'Données produit : référence japonaise T-16806G, date du 18 décembre 1997 (fournies pour cette fiche).'
          ] },
          { p: '<em>Les incertitudes sont explicitement signalées dans les sections concernées. Aucune commande, jauge ou liste de personnages jouables n’a été inventée.</em>' }
        ]
      }
    ],
    gallery: ['crowsManga', 'crowsJaquette']
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'cinema', label: 'Cinéma' },
  { id: 'litterature', label: 'Littérature' },
  { id: 'retro-gaming', label: 'Rétro-gaming' }
];

/* Galeries documentaires : la fiche influences est rattachée à Crows. */
const GALLERIES = {
  'guerre-des-gangs-okinawa': ['okinawaAffiche', 'okinawaGalerie'],
  'kafka-sur-le-rivage': ['kafkaFr', 'kafkaJp', 'kafkaLibrairie', 'kafkaForet'],
  'crows-battle-action': ['crowsManga', 'crowsJaquette', 'riverCity']
};

const DOC_GALLERY_ORDER = [
  'okinawaAffiche', 'okinawaGalerie',
  'kafkaFr', 'kafkaJp', 'kafkaLibrairie', 'kafkaForet',
  'crowsManga', 'crowsJaquette', 'riverCity'
];

/* -------------------------------------------------------------------------
   État
   ------------------------------------------------------------------------- */

const FAV_KEY = 'archives.favorites.v1';
const state = {
  query: '',
  filter: 'all',
  favorites: loadFavorites(),
  homeScroll: 0
};

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites() {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(state.favorites)); } catch (e) { /* stockage indisponible */ }
}

function isFav(id) { return state.favorites.includes(id); }

function toggleFav(id) {
  const i = state.favorites.indexOf(id);
  if (i >= 0) state.favorites.splice(i, 1);
  else state.favorites.push(id);
  saveFavorites();
  syncFavButtons();
  applyFilters();
  if (!isHomeVisible()) renderWorkNavFav();
  toast(i >= 0 ? 'Retiré des favoris' : 'Ajouté aux favoris');
}

/* -------------------------------------------------------------------------
   Utilitaires
   ------------------------------------------------------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function normalize(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function esc(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function workByRoute(route) { return WORKS.find((w) => w.route === route); }

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('is-on'), 2200);
}

/* -------------------------------------------------------------------------
   Accueil
   ------------------------------------------------------------------------- */

function cardMarkup(work, index) {
  return `<article class="card" data-work="${work.id}" data-cat="${work.category}">
    <div class="card-media media-shell" data-slot="${work.cover}">${placeholderMarkup(IMAGES[work.cover], true)}<span class="card-cat">${work.categoryLabel}</span></div>
    <span class="card-index">${String(index + 1).padStart(2, '0')}</span>
    <button class="card-fav" data-fav="${work.id}" aria-pressed="false" aria-label="Ajouter « ${esc(work.title)} » aux favoris">${SVG.star}</button>
    <div class="card-body">
      <p class="card-original">${esc(work.original.split('—')[0].trim())}</p>
      <h3 class="card-title"><a href="#/${work.route}">${esc(work.title)}</a></h3>
      <p class="card-line">${esc(work.summary)}</p>
      <div class="card-foot">
        <span class="card-year">${esc(work.year)}</span>
        <span class="card-cta">Consulter <span>→</span></span>
      </div>
    </div>
  </article>`;
}

function buildHome() {
  const cards = $('#cards');
  cards.innerHTML = WORKS.map(cardMarkup).join('');

  const chips = $('#filters');
  chips.innerHTML = CATEGORIES.map((c) => {
    const n = c.id === 'all' ? WORKS.length : c.id === 'fav' ? state.favorites.length : WORKS.filter((w) => w.category === c.id).length;
    return `<button class="chip ${c.id === 'all' ? 'is-active' : ''}" data-filter="${c.id}">${c.label}<span class="n">${n}</span></button>`;
  }).join('') + `<button class="chip" data-filter="fav">Favoris<span class="n" id="favCount">${state.favorites.length}</span></button>`;

  const strip = DOC_GALLERY_ORDER.slice(0, 4).map((id) => {
    const img = IMAGES[id];
    return `<figure class="strip-item media-shell" data-slot="${id}">${placeholderMarkup(img, true)}<figcaption>${esc(img.title)}</figcaption></figure>`;
  }).join('');
  $('#stripGrid').innerHTML = strip;

  hydrateMedia(document);
  syncFavButtons();
}

function syncFavButtons() {
  $$('[data-fav]').forEach((btn) => {
    const id = btn.dataset.fav;
    const on = isFav(id);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    const isWorkBtn = btn.classList.contains('btn-ghost');
    btn.setAttribute('aria-label', isWorkBtn
      ? (on ? 'Favori : retirer cette fiche' : 'Favori : ajouter cette fiche')
      : (on ? 'Retirer des favoris' : 'Ajouter aux favoris'));
  });

  const counter = $('#favCount');
  if (counter) counter.textContent = state.favorites.length;

  const navCount = $('#navFavCount');
  if (navCount) {
    navCount.textContent = state.favorites.length;
    navCount.hidden = state.favorites.length === 0;
  }
}

function setFilter(filter) {
  state.filter = filter;
  $$('#filters .chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === filter));
  applyFilters();
}

function applyFilters() {
  const q = normalize(state.query);
  let visible = 0;

  $$('#cards .card').forEach((card) => {
    const work = WORKS.find((w) => w.id === card.dataset.work);
    const hay = normalize([work.title, work.original, work.summary, work.keywords, work.categoryLabel, work.year].join(' '));
    const matchQ = !q || hay.includes(q);
    const matchF = state.filter === 'all' ? true : state.filter === 'fav' ? isFav(work.id) : work.category === state.filter;
    const show = matchQ && matchF;
    card.hidden = !show;
    if (show) visible += 1;
  });

  const empty = $('#empty');
  empty.hidden = visible !== 0;
  if (!visible) {
    empty.innerHTML = `<strong>Aucun document ne correspond</strong>Modifiez la recherche ou le filtre de catégorie.`;
  }

  $('#resultCount').textContent = `${visible} œuvre${visible > 1 ? 's' : ''}${state.query ? ' · recherche' : ''}`;
}

/* -------------------------------------------------------------------------
   Fiche œuvre
   ------------------------------------------------------------------------- */

function sectionMarkup(section, index) {
  const num = String(index + 1).padStart(2, '0');
  const body = section.blocks.map(renderBlock).join('');
  return `<section class="work-section ${section.special ? 'is-special' : ''}" id="sec-${section.id}">
    <header>
      <span class="sec-num">${num}</span>
      <h2>${esc(section.title)}</h2>
    </header>
    <div class="prose">${body}</div>
  </section>`;
}

function renderBlock(block) {
  if (block.p !== undefined) return `<p>${block.p}</p>`;
  if (block.h) return `<h3>${esc(block.h)}</h3>`;
  if (block.ul) return `<ul>${block.ul.map((li) => `<li>${li}</li>`).join('')}</ul>`;
  if (block.ol) return `<ol>${block.ol.map((li) => `<li>${li}</li>`).join('')}</ol>`;
  if (block.table) {
    return `<table class="table"><tbody>${block.table.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${v}</td></tr>`).join('')}</tbody></table>`;
  }
  if (block.quote) {
    return `<blockquote>${block.quote[0]}${block.quote[1] ? `<cite>${esc(block.quote[1])}</cite>` : ''}</blockquote>`;
  }
  if (block.callout) {
    return `<div class="callout ${block.callout.warn ? 'is-warn' : ''}">
      <span class="tag">${esc(block.callout.tag || 'Note')}</span>
      <p>${block.callout.text}</p>
    </div>`;
  }
  if (block.gallery) {
    return `<div class="gallery ${block.single ? 'is-single' : ''}">${block.gallery.map((id, i) => galleryItemMarkup(id, i, true)).join('')}</div>`;
  }
  return '';
}

function galleryItemMarkup(slotId, index, inWork) {
  const img = IMAGES[slotId];
  return `<figure class="gal-item">
    <button class="gal-btn" data-gallery="${inWork ? 'work' : 'doc'}" data-slot-id="${slotId}">
      <div class="gal-media ${img.portrait ? 'portrait' : ''} media-shell" data-slot="${slotId}">${placeholderMarkup(img, true)}</div>
      <span class="zoom-hint">Agrandir</span>
      <div class="gal-cap"><span>${esc(img.caption)}</span><em>${esc(img.title)}</em></div>
    </button>
  </figure>`;
}

function renderWork(work) {
  const host = $('#workContent');
  const sections = work.sections.map(sectionMarkup).join('');
  const gallery = work.gallery.map((id) => galleryItemMarkup(id, 0, true)).join('');

  host.innerHTML = `
    <div class="work-topbar">
      <a class="back-link" href="#/"><span>${SVG.arrowLeft}</span>Retour à la collection</a>
      <div class="work-actions">
        <button class="btn-ghost" id="favWork" data-fav="${work.id}" aria-label="Ajouter cette fiche aux favoris">${SVG.star}<span>Favori</span></button>
        <button class="btn-ghost" id="printWork" aria-label="Imprimer cette fiche">${SVG.printer}<span>Imprimer</span></button>
      </div>
    </div>

    <header class="work-hero">
      <div>
        <span class="work-cat">${work.categoryLabel} · ${esc(work.kicker)}</span>
        <h1 class="work-title">${esc(work.title)}</h1>
        <p class="work-original">${esc(work.original)}</p>
        <p class="work-summary">${esc(work.summary)}</p>
      </div>
      <div class="work-meta">
        <dl>${work.meta.map(([k, v]) => `<div class="meta-row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </header>

    <div class="work-layout">
      <nav class="work-nav" aria-label="Sommaire de la fiche">
        <span class="eyebrow">Sommaire</span>
        <ol>${work.sections.map((s, i) => `<li><a href="#sec-${s.id}" data-sec="${s.id}">${esc(s.title)}</a></li>`).join('')}</ol>
      </nav>
      <div class="work-content">${sections}</div>
    </div>

    <div class="work-section" id="sec-galerie">
      <header><span class="sec-num">${String(work.sections.length + 1).padStart(2, '0')}</span><h2>Galerie documentaire</h2></header>
      <div class="prose"><p>Documents conservés localement. Cliquez sur une image pour l’ouvrir en plein écran.</p></div>
      <div class="gallery">${gallery}</div>
    </div>
  `;

  hydrateMedia(host);
  syncFavButtons();
  bindWork(work);
}

function bindWork(work) {
  const favBtn = $('#favWork');
  if (favBtn) favBtn.addEventListener('click', () => toggleFav(work.id));

  const printBtn = $('#printWork');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // Sommaire : surlignage à la lecture
  const links = $$('.work-nav a');
  if (links.length && 'IntersectionObserver' in window) {
    const map = new Map(links.map((a) => [a.dataset.sec, a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove('is-current'));
          const link = map.get(entry.target.id.replace('sec-', ''));
          if (link) link.classList.add('is-current');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    $$('.work-section[id^="sec-"]').forEach((sec) => obs.observe(sec));
    work._observer = obs;
  }
}

function renderWorkNavFav() {
  const btn = $('#favWork');
  if (!btn) return;
  const on = isFav(btn.dataset.fav);
  btn.classList.toggle('is-on', on);
}

/* -------------------------------------------------------------------------
   Galerie documentaire (index)
   ------------------------------------------------------------------------- */

function renderDocGallery() {
  const host = $('#docGallery');
  const items = DOC_GALLERY_ORDER.map((id) => {
    const img = IMAGES[id];
    const owner = WORKS.find((w) => w.gallery.includes(id) || w.sections.some((s) => s.blocks.some((b) => b.gallery && b.gallery.includes(id))));
    return `<figure class="gal-item">
      <button class="gal-btn" data-gallery="doc" data-slot-id="${id}">
        <div class="gal-media ${img.portrait ? 'portrait' : ''} media-shell" data-slot="${id}">${placeholderMarkup(img, true)}</div>
        <span class="zoom-hint">Agrandir</span>
        <div class="gal-cap"><span>${esc(img.caption)}</span><em>${esc(img.title)}</em></div>
      </button>
      ${owner ? `<figcaption class="gal-owner"><a href="#/${owner.route}">Voir la fiche · ${esc(owner.title)}</a></figcaption>` : ''}
    </figure>`;
  }).join('');
  host.innerHTML = items;
  hydrateMedia(host);
}

/* -------------------------------------------------------------------------
   Visionneuse
   ------------------------------------------------------------------------- */

const lb = {
  el: null,
  items: [],
  index: 0,
  lastFocus: null
};

function galleryIdsFor(element) {
  if (element.dataset.gallery === 'doc') return DOC_GALLERY_ORDER;
  const work = workFromElement(element);
  return work ? GALLERIES[work.id] : DOC_GALLERY_ORDER;
}

function workFromElement(el) {
  const section = el.closest('#view-work');
  const workId = section && section.dataset.workId;
  return WORKS.find((w) => w.id === workId) || null;
}

function openLightbox(slotId, trigger) {
  const ids = galleryIdsFor(trigger);
  lb.items = ids;
  lb.index = Math.max(0, ids.indexOf(slotId));
  lb.lastFocus = trigger;
  clearTimeout(lb.hideTimer);
  lb.el.hidden = false;
  requestAnimationFrame(() => lb.el.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
  paintLightbox();
  $('#lbClose').focus();
}

function closeLightbox() {
  lb.el.classList.remove('is-open');
  document.body.style.overflow = '';
  clearTimeout(lb.hideTimer);
  lb.hideTimer = setTimeout(() => { lb.el.hidden = true; }, 280);
  if (lb.lastFocus && lb.lastFocus.isConnected) lb.lastFocus.focus();
}

async function paintLightbox() {
  const id = lb.items[lb.index];
  const img = IMAGES[id];
  const stage = $('#lbMedia');
  const token = (paintLightbox._token || 0) + 1;
  paintLightbox._token = token;
  const url = await resolveImage(img);
  if (token !== paintLightbox._token) return;

  stage.innerHTML = '';

  if (url) {
    const el = document.createElement('img');
    el.src = url;
    el.alt = img.caption;
    stage.appendChild(el);
  } else {
    stage.innerHTML = `<div class="ph">${SVG.image}<span class="ph-label">Document manquant</span><span class="ph-file">${img.files[0]}</span><span class="ph-note">Déposez le fichier dans /assets</span></div>`;
  }

  $('#lbCount').textContent = `${String(lb.index + 1).padStart(2, '0')} / ${String(lb.items.length).padStart(2, '0')}`;
  $('#lbTitle').textContent = img.title;
  $('#lbMeta').textContent = img.caption;
  const warn = $('#lbWarning');
  if (img.warning) { warn.textContent = img.warning; warn.hidden = false; }
  else { warn.hidden = true; }

  $('#lbPrev').disabled = false;
  $('#lbNext').disabled = false;

  const work = WORKS.find((w) => GALLERIES[w.id] && GALLERIES[w.id].includes(id));

  const returnLink = $('#lbReturn');
  if (work) {
    returnLink.href = `#/${work.route}`;
    returnLink.hidden = false;
  } else {
    returnLink.hidden = true;
  }
}

function stepLightbox(dir) {
  if (!lb.items.length) return;
  lb.index = (lb.index + dir + lb.items.length) % lb.items.length;
  paintLightbox();
}

/* -------------------------------------------------------------------------
   Routage
   ------------------------------------------------------------------------- */

function showView(id) {
  $$('.view').forEach((v) => { v.hidden = v.id !== id; });
}

function isHomeVisible() {
  return !$('#view-home').hidden;
}

function router() {
  const hash = location.hash.replace(/^#\/?/, '');
  const path = hash.split('?')[0];

  if (lb.el && !lb.el.hidden) closeLightbox();

  $('#lbReturn').setAttribute('href', '#/');

  if (path.startsWith('galerie')) {
    showView('view-gallery');
    renderDocGallery();
    window.scrollTo(0, 0);
    setActiveNav('gallery');
    document.title = 'Galerie documentaire — Archives';
    return;
  }

  const work = path ? workByRoute(path) : null;

  if (work) {
    if (isHomeVisible()) state.homeScroll = window.scrollY;
    showView('view-work');
    $('#view-work').dataset.workId = work.id;
    renderWork(work);
    window.scrollTo(0, 0);
    document.title = `${work.title} — Archives`;
    setActiveNav(work.category);
    return;
  }

  showView('view-home');
  applyFilters();
  setActiveNav('home');
  document.title = 'Archives — Mémoires de culture pop';
  if (state.homeScroll) {
    requestAnimationFrame(() => window.scrollTo(0, state.homeScroll));
  }
}

function setActiveNav(key) {
  $$('.nav a').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === key));
}

/* -------------------------------------------------------------------------
   Événements
   ------------------------------------------------------------------------- */

function bindEvents() {
  // Recherche
  const input = $('#search');
  input.addEventListener('input', () => {
    state.query = input.value.trim();
    $('.search').classList.toggle('has-value', state.query.length > 0);
    applyFilters();
  });

  $('#searchClear').addEventListener('click', () => {
    input.value = '';
    state.query = '';
    $('.search').classList.remove('has-value');
    applyFilters();
    input.focus();
  });

  // Filtres
  $('#filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    setFilter(chip.dataset.filter);
  });

  // Lien « Favoris » de l'en-tête
  $$('.nav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (a.dataset.nav !== 'favs') return;
      e.preventDefault();
      if (!isHomeVisible()) location.hash = '#/';
      setFilter('fav');
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    });
  });

  // Favoris (cartes + fiches)
  document.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      e.preventDefault();
      e.stopPropagation();
      toggleFav(fav.dataset.fav);
      return;
    }

    const gal = e.target.closest('.gal-btn');
    if (gal) {
      e.preventDefault();
      openLightbox(gal.dataset.slotId, gal);
    }
  });

  // Visionneuse
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbReturn').addEventListener('click', () => closeLightbox());
  $('#lbPrev').addEventListener('click', () => stepLightbox(-1));
  $('#lbNext').addEventListener('click', () => stepLightbox(1));

  lb.el = $('#lightbox');
  lb.el.addEventListener('click', (e) => {
    if (e.target === lb.el || e.target.id === 'lbStage' || e.target.id === 'lbMedia') closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lb.el.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepLightbox(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); }
    if (e.key === 'Tab') {
      const focusables = $$('a[href], button:not([disabled])', lb.el).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Navigation
  window.addEventListener('hashchange', router);

  // Recherche globale au clavier (/ ou Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement !== input)) {
      if (!isHomeVisible()) { location.hash = '#/'; }
      e.preventDefault();
      setTimeout(() => input.focus(), 60);
    }
  });
}

/* -------------------------------------------------------------------------
   Démarrage
   ------------------------------------------------------------------------- */

function init() {
  buildHome();
  bindEvents();
  router();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
