import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";


const weisskopfseeadler: QuestionBase = {
  id: 1,
  answer: "Weißkopfseeadler",
  title: "Der Nationalvogel",
  images: {
    imageUrl: require("./weisskopfseeadler.webp"),
    unsolvedImageUrl: require("./weisskopfseeadler_unsolved.webp"),
  },
  alternativeAnswers: ["Seeadler", "Bald Eagle"],
  funFact:
    "Er ist der Nationalvogel der USA seit 1782. Ausgewachsene Tiere können ihren Kopf dank einer extrem beweglichen Nackenwirbelsäule um bis zu 270 Grad drehen.",
  autoFreeHints: [
    {
      id: "ws_h1",
      type: HintType.AUTO_FREE,
      content: "Auffällig sind der strahlend weiße Kopf und der hellgelbe, kräftige Schnabel.",
      triggerAfterAttempts: 3
    },
    {
      id: "ws_h2",
      type: HintType.AUTO_FREE,
      content: "Dieser Greifvogel ernährt sich hauptsächlich von Fisch und lebt daher in der Nähe großer Gewässer.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "adler",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Gattung! Aber dieser Vogel hat ein viel helleres Gefieder. Den gesuchten erkennt man an seinem namensgebenden Merkmal.",
      title: "Steinadler",
      triggers: ["steinadler"]
    },
    {
      id: "geier",
      type: HintType.CONTEXTUAL,
      content: "Falscher Lebensstil! Der gesuchte ist ein aktiver Jäger und kein Aasfresser.",
      title: "Falsche Mahlzeit!",
      triggers: ["geier"]
    }
  ],
  customHints: [
    {
      id: "bau",
      type: HintType.CUSTOM,
      title: "Nestbau",
      content: "Er baut die größten Nester aller Vögel Nordamerikas, manchmal mit einem Gewicht von über zwei Tonnen.",
      cost: 1,
    }
  ]
};

const stinktier: QuestionBase = {
  id: 2,
  answer: "Stinktier",
  title: "Blume",
  images: {
    imageUrl: require("./stinktier.webp"),
    unsolvedImageUrl: require("./stinktier_unsolved.webp"),
  },
  alternativeAnswers: ["Skunk"],
  funFact:
    "Sein übel riechendes Sekret kann bis zu 6 Meter weit gesprüht werden und kann bei Angreifern vorübergehende Blindheit verursachen.",
  autoFreeHints: [
    {
      id: "stinktier_h1",
      type: HintType.AUTO_FREE,
      content: "Seine auffällige schwarz-weiße Fellzeichnung dient als Warnfarbe für potenzielle Feinde.",
      triggerAfterAttempts: 3
    },
    {
      id: "stinktier_h2",
      type: HintType.AUTO_FREE,
      content: "Es ist ein kleines Raubtier, das in Nord- und Mittelamerika beheimatet ist.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "dachs",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie! Aber dieser ist deutlich kompakter, lebt auch in Europa und hat keine solch drastische Verteidigungswaffe.",
      title: "Zu harmlos!",
      triggers: ["dachs"]
    },
    {
      id: "waschbaer",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Kleinbär! Aber der gesuchte ist nicht so geschickt mit den Pfoten und hat keine Ringelschwanz.",
      title: "Falscher Kleinbär!",
      triggers: ["waschbär"]
    }
  ],
  customHints: [
    {
      id: "graben",
      type: HintType.CUSTOM,
      title: "Körperteile",
      content: "Seine langen, gebogenen Krallen eignen sich hervorragend zum Graben nach Insekten und Kleintieren.",
      cost: 1,
    }
  ]
};

const klapperschlange: QuestionBase = {
  id: 3,
  answer: "Klapperschlange",
  title: "Die vibrierende Warnung",
  images: {
    imageUrl: require("./klapperschlange.webp"),
    unsolvedImageUrl: require("./klapperschlange_unsolved.webp"),
  },
  funFact:
    "Ihre namensgebende Rassel besteht aus ineinandergreifenden Keratin-Ringen (wie Fingernägel) und bekommt mit jeder Häutung einen neuen Ring.",
  autoFreeHints: [
    {
      id: "klapper_h1",
      type: HintType.AUTO_FREE,
      content: "Sie gehört zur Familie der Grubenottern und ist eine Giftschlange.",
      triggerAfterAttempts: 3
    },
    {
      id: "klapper_h2",
      type: HintType.AUTO_FREE,
      content: "Sie kann ihre Schwanzrassel bei Erregung bis zu 60 Mal pro Sekunde bewegen, um das charakteristische Geräusch zu erzeugen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "kobra",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Und dieser baut keinen Nackenschild auf, sondern warnt mit einem akustischen Signal.",
      title: "Falscher Alarm!",
      triggers: ["kobra"]
    },
    {
      id: "viper",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie! Aber der gesuchte hat einen deutlichen 'Apparat' am Schwanzende.",
      title: "Zu ruhig!",
      triggers: ["viper"]
    }
  ],
  customHints: [
    {
      id: "sinne",
      type: HintType.CUSTOM,
      title: "Sinne",
      content: "Sie besitzt Wärmesensoren ('Gruben') am Kopf, mit denen sie die Körperwärme ihrer Beute wahrnehmen kann.",
      cost: 1,
    }
  ]
};

const waschbaer: QuestionBase = {
  id: 4,
  answer: "Waschbär",
  title: "Der nächtliche Maskierte",
  images: {
    imageUrl: require("./waschbaer.webp"),
    unsolvedImageUrl: require("./waschbaer_unsolved.webp"),
  },
  funFact:
    "Er ist für seinen extrem ausgeprägten Tastsinn in den Vorderpfoten bekannt, der es ihm ermöglicht, Objekte in der Dunkelheit nur durch Berührung zu erkennen.",
  autoFreeHints: [
    {
      id: "wbaer_h1",
      type: HintType.AUTO_FREE,
      content: "Auffälliges Merkmal ist die schwarze 'Diebesmaske' um die Augen.",
      triggerAfterAttempts: 3
    },
    {
      id: "wbaer_h2",
      type: HintType.AUTO_FREE,
      content: "Sein Name kommt von der Gewohnheit, Nahrung vor dem Verzehr im Wasser 'einzutauchen' (zu 'waschen').",
      triggerAfterAttempts: 6
    },
    {
      id: "wbaer_h3",
      type: HintType.AUTO_FREE,
      content: "Er gehört zur Familie der Kleinbären und hat einen auffälligen, geringelten Schwanz.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "katze",
      type: HintType.CONTEXTUAL,
      content: "Falsche Familie! Der gesuchte ist ein Allesfresser mit sehr geschickten, fast handartigen Pfoten.",
      title: "Zu ungeschickt!",
      triggers: ["katze", "haustier"]
    },
    {
      id: "kleinbaer",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Kleinbär! Aber der gesuchte ist heute in Europa und Asien als Neozoon verbreitet.",
      title: "Falscher Kontinent!",
      triggers: ["marder"]
    }
  ],
  customHints: [
    {
      id: "stadt",
      type: HintType.CUSTOM,
      title: "Lebensraum",
      content: "Er ist ein Kulturfolger und lebt in Großstädten oft als 'Mülltonnenräuber'.",
      cost: 1,
    }
  ]
};

const grizzly: QuestionBase = {
  id: 5,
  answer: "Grizzly",
  title: "Der Silbertipp-Riese",
  images: {
    imageUrl: require("./grizzly.webp"),
  },
  alternativeAnswers: ["Graubär", "Grizzlybär", "Braunbär"],
  funFact:
    "Seinen Namen verdankt er den 'Grizzled' (grau- oder silberfarbenen) Haarspitzen auf seinem Fell, die ihm ein gesprenkeltes Aussehen verleihen.",
  autoFreeHints: [
    {
      id: "grizzly_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist eine große Unterart des Braunbären, bekannt für seine beeindruckende Schultermuskulatur (Buckel).",
      triggerAfterAttempts: 3
    },
    {
      id: "grizzly_h2",
      type: HintType.AUTO_FREE,
      content: "Obwohl er massiv ist, kann er kurzzeitig eine Geschwindigkeit von bis zu 55 km/h erreichen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "eisbaer",
      type: HintType.CONTEXTUAL,
      content: "Falsche Farbe und zu weit nördlich! Der gesuchte lebt in den Wäldern und Gebirgen im Landesinneren.",
      title: "Zu kalt!",
      triggers: ["eisbär"]
    },
    {
      id: "schwarzbaer",
      type: HintType.CONTEXTUAL,
      content: "Zu klein! Der gesuchte ist deutlich größer und hat eine charakteristische 'Buckel'-Form auf dem Rücken.",
      title: "Falscher Bär!",
      triggers: ["schwarzbär", "baribal"]
    }
  ],
  customHints: [
    {
      id: "winterschlaf",
      type: HintType.CUSTOM,
      title: "Winter",
      content: "Er hält keine echte Winterruhe, sondern eine tiefere Winterruhe, bei der er gelegentlich aufwachen und die Höhle verlassen kann.",
      cost: 1,
    }
  ]
};

const bison: QuestionBase = {
  id: 6,
  answer: "Bison",
  title: "Herr der Prärie",
  images: {
    imageUrl: require("./bison.webp"),
  },
  alternativeAnswers: ["Amerikanisches Bison", "Büffel", "Indianerbüffel"],
  funFact:
    "Er ist das größte Landsäugetier Nordamerikas. Sein dichtes Winterfell isoliert so gut, dass Schnee auf seinem Rücken nicht schmilzt.",
  autoFreeHints: [
    {
      id: "bison_h1",
      type: HintType.AUTO_FREE,
      content: "Typisch sind der massige Kopf, der hohe Buckel und die dicke Mähne an Kopf und Schultern.",
      triggerAfterAttempts: 3
    },
    {
      id: "bison_h2",
      type: HintType.AUTO_FREE,
      content: "Sie leben in großen Herden und ernähren sich als Wiederkäuer fast ausschließlich von Gras.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "kuh",
      type: HintType.CONTEXTUAL,
      content: "Verwandt, aber dieser ist wild, viel massiger und hat eine starke Behaarung am Kopf.",
      title: "Zu zahm!",
      triggers: ["rind", "kuh"]
    },
    {
      id: "yak",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Dieser ist in Zentralasien zu Hause.",
      title: "Zu asiatisch!",
      triggers: ["yak"]
    }
  ],
  customHints: [
    {
      id: "schnell",
      type: HintType.CUSTOM,
      title: "Fähigkeit",
      content: "Trotz seines Gewichts von fast einer Tonne kann er bis zu 50 km/h schnell rennen und gut schwimmen.",
      cost: 1,
    }
  ]
};

const kojote: QuestionBase = {
  id: 7,
  answer: "Kojote",
  title: "Der Präriewolf",
  images: {
    imageUrl: require("./kojote.webp"),
  },
  alternativeAnswers: ["Präriewolf", "Steppenwolf"],
  funFact:
    "Kojoten sind sehr anpassungsfähig und haben ihre Verbreitung in Nordamerika enorm ausgeweitet. Sie zeigen in städtischen Gebieten sogar ein 'Verständnis' für den Straßenverkehr.",
  autoFreeHints: [
    {
      id: "kojote_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein kleinerer, schlankerer Verwandter des Wolfs mit relativ großen Ohren und einer schmaleren Schnauze.",
      triggerAfterAttempts: 3
    },
    {
      id: "kojote_h2",
      type: HintType.AUTO_FREE,
      content: "Er jagt meist allein oder in kleinen Familiengruppen und ist bekannt für sein charakteristisches Heulen und Jaulen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "wolf",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Gattung! Aber der gesuchte ist viel kleiner, magerer und hat ein weniger festgelegtes Sozialverhalten.",
      title: "Zu groß!",
      triggers: ["wolf"]
    },
    {
      id: "fuchs",
      type: HintType.CONTEXTUAL,
      content: "Falsche Größe! Der gesuchte ist größer und hat keinen buschigen, dicken Schwanz wie dieser.",
      title: "Zu klein!",
      triggers: ["fuchs"]
    },
    {
      id: "schakal",
      type: HintType.CONTEXTUAL,
      content: "Sehr knapp, aber anderer Kontinent.",
      title: "Zu klein!",
      triggers: ["fuchs"]
    },
  ],
  customHints: [
    {
      id: "hybride",
      type: HintType.CUSTOM,
      title: "Nachwuchs",
      content: "Dieses Tier kann sich erfolgreich mit Haushunden paaren, wobei die Hybriden 'Coydogs' genannt werden.",
      cost: 1,
    }
  ]
};

const kanadagans: QuestionBase = {
  id: 8,
  answer: "Kanadagans",
  title: "V-Formation",
  images: {
    imageUrl: require("./kanadagans.webp"),
  },
  alternativeAnswers: ["Canada Goose"],
  funFact:
    "Kanadagänse bleiben ihrem Brutpartner oft ein Leben lang treu. Auf ihrem Zug fliegen sie in der berühmten V-Formation, was ihnen hilft, Energie zu sparen.",
  autoFreeHints: [
    {
      id: "kanada_h1",
      type: HintType.AUTO_FREE,
      content: "Ihr auffälligstes Kennzeichen ist der schwarze Hals und Kopf mit dem breiten, weißen 'Kinnband'.",
      triggerAfterAttempts: 3
    },
    {
      id: "kanada_h2",
      type: HintType.AUTO_FREE,
      content: "Obwohl sie ursprünglich aus Nordamerika stammen, sind sie mittlerweile in weiten Teilen Europas als eingebürgerte Art verbreitet.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "graugans",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie! Aber dieser ist deutlich grauer, hat keinen schwarzen Hals und kein weißes Kinnband.",
      title: "Zu grau!",
      triggers: ["graugans"]
    },
    {
      id: "schwan",
      type: HintType.CONTEXTUAL,
      content: "Falsche Größe und zu langer Hals! Der gesuchte hat einen kompakteren Körperbau.",
      title: "Zu elegant!",
      triggers: ["schwan"]
    }
  ],
  customHints: [
    {
      id: "ruf",
      type: HintType.CUSTOM,
      title: "Klang",
      content: "Ihr typischer Ruf ist ein lautes, trompetendes 'a-honk', besonders beim Flug in der Formation.",
      cost: 1,
    }
  ]
};

const nordamerikaTiere: QuestionBase[] = [
  weisskopfseeadler,
  stinktier,
  klapperschlange,
  waschbaer,
  grizzly,
  bison,
  kojote,
  kanadagans,
];

export const nordamerikaQuiz: Quiz = {
  id: "nordamerika",
  title: "Nordamerika",
  questions: nordamerikaTiere,
  titleImage: require("./bison.webp"),
  description: "Entdecke die Tierwelt Nordamerikas mit diesem Quiz.",
};