import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const koala: QuestionBase = {
  id: 1,
  answer: "Koala",
  title: "Der Eukalyptus-Schläfer",
  images: {
    imageUrl: require("./koala.webp"),
    unsolvedImageUrl: require("./koala_unsolved.webp"),
  },
  alternativeAnswers: ["Beutelbär", "Koalabär"],
  funFact: "der Koala bis zu 20 Stunden am Tag schläft, weil Eukalyptusblätter sehr faserig und giftig sind und ihre Verdauung enorme Energie kostet?",
  autoFreeHints: [
    {
      id: "koala_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Name stammt aus einer Aborigine-Sprache und bedeutet sinngemäß \"trinkt nicht\" (obwohl sie Wasser trinken, wenn nötig).",
      triggerAfterAttempts: 3
    },
    {
      id: "koala_h2",
      type: HintType.AUTO_FREE,
      content: "Trotz seines Aussehens ist er kein Bär, sondern ein Beuteltier.",
      triggerAfterAttempts: 6
    },
    {
      id: "koala_h3",
      type: HintType.AUTO_FREE,
      content: "Wie menschliche Fingerabdrücke sind auch seine Fingerabdrücke einzigartig.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "wombat",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Beuteltier, aber der gesuchte verbringt sein ganzes Leben in Bäumen und ist kein Bodenbewohner.",
      title: "Falsche Höhe!",
      triggers: ["wombat"]
    },
    {
      id: "faultier",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Dieses Tier lebt in Südamerika und hängt kopfunter.",
      title: "Falsche Art!",
      triggers: ["faultier"]
    }
  ],
  customHints: [
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Es ernährt sich fast ausschließlich von den Blättern weniger Eukalyptusarten.",
      cost: 1,
    },
    {
      id: "nachwuchs",
      type: HintType.CUSTOM,
      title: "Junge",
      content: "Das Neugeborene (\"Joey\") verbringt die ersten sechs Monate im Beutel der Mutter.",
      cost: 1,
    }
  ]
};

const kaenguru: QuestionBase = {
  id: 2,
  answer: "Känguru",
  title: "Der Springer",
  images: {
    imageUrl: require("./kaenguru.webp"),
    unsolvedImageUrl: require("./kaenguru_unsolved.webp"),
  },
  funFact: "Kängurus sich nicht rückwärts bewegen können, weil ihre Muskulatur und ihr langer, massiver Schwanz das verhindert?",
  autoFreeHints: [
    {
      id: "kaenguru_h1",
      type: HintType.AUTO_FREE,
      content: "Die Weibchen tragen ihre Jungen in einem Beutel am Bauch.",
      triggerAfterAttempts: 3
    },
    {
      id: "kaenguru_h2",
      type: HintType.AUTO_FREE,
      content: "Sie bewegen sich primär durch kräftiges Hüpfen mit den Hinterbeinen fort.",
      triggerAfterAttempts: 6
    },
    {
      id: "kaenguru_h3",
      type: HintType.AUTO_FREE,
      content: "Der Schwanz dient als wichtiges Stützbein und zur Balance beim Springen.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "wallaby",
      type: HintType.CONTEXTUAL,
      content: "Vorsicht! Der gesuchte ist viel größer und massiver. Sein Verwandter ist eine kleinere Ausgabe.",
      title: "Zu klein!",
      triggers: ["wallaby"]
    },
    {
      id: "hase",
      type: HintType.CONTEXTUAL,
      content: "Falsche Klasse! Das gesuchte ist ein Beuteltier. Seine Hinterbeine sind extrem viel länger als die Vorderbeine.",
      title: "Falscher Springer!",
      triggers: ["hase"]
    }
  ],
  customHints: [
    {
      id: "geschwindigkeit",
      type: HintType.CUSTOM,
      title: "Fähigkeit",
      content: "Es kann Geschwindigkeiten von über 50 km/h erreichen und Sprünge von bis zu 9 Metern Länge machen.",
      cost: 1,
    },
    {
      id: "gruppe",
      type: HintType.CUSTOM,
      title: "Sozialleben",
      content: "Kängurus leben in Gruppen, die \"Mobs\" genannt werden.",
      cost: 1,
    }
  ]
};

const quokka: QuestionBase = {
  id: 3,
  answer: "Quokka",
  title: "Das glücklichste Tier",
  images: {
    imageUrl: require("./quokka.webp"),
  },
  alternativeAnswers: ["Kurzschwanzkänguru"],
  funFact: "das Quokka für sein scheinbar \"lächelndes\" Gesicht berühmt ist, was es zu einem der beliebtesten Fotomotive der Welt macht?",
  autoFreeHints: [
    {
      id: "quokka_h1",
      type: HintType.AUTO_FREE,
      content: "Es ist ein kleines Beuteltier aus der Familie der Kängurus, nur etwa so groß wie eine Hauskatze.",
      triggerAfterAttempts: 3
    },
    {
      id: "quokka_h2",
      type: HintType.AUTO_FREE,
      content: "Es ist hauptsächlich auf den Inseln Rottnest Island und Bald Island in Westaustralien zu finden.",
      triggerAfterAttempts: 6
    },
    {
      id: "quokka_h3",
      type: HintType.AUTO_FREE,
      content: "Es hat ein dichtes, graubraunes Fell und einen verhältnismäßig kurzen, dicken Schwanz.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "kaenguru",
      type: HintType.CONTEXTUAL,
      content: "Zu groß! Der gesuchte ist ein Zwerg unter den Känguru-Verwandten.",
      title: "Falsche Größe!",
      triggers: ["känguru"]
    },
    {
      id: "ratte",
      type: HintType.CONTEXTUAL,
      content: "Falsche Klasse! Das gesuchte Tier ist ein Beuteltier und lebt in Australien.",
      title: "Kein Nagetier!",
      triggers: ["ratte"]
    }
  ],
  customHints: [
    {
      id: "schutz",
      type: HintType.CUSTOM,
      title: "Gesetz",
      content: "Es ist strengstens verboten, diese Tiere auf Rottnest Island zu füttern oder zu berühren.",
      cost: 1,
    },
    {
      id: "hüpfen",
      type: HintType.CUSTOM,
      title: "Bewegung",
      content: "Obwohl es wie ein Känguru hüpft, kann es auch auf allen Vieren klettern.",
      cost: 1,
    }
  ]
};

const wombat: QuestionBase = {
  id: 4,
  answer: "Wombat",
  title: "Der Baumeister",
  images: {
    imageUrl: require("./wombat.webp"),
  },
  funFact: "der Wombat das einzige Tier der Welt ist, das \"würfelförmigen Kot\" produziert, um damit Markierungen auf erhöhten Steinen zu stapeln?",
  autoFreeHints: [
    {
      id: "wombat_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein stämmiges, bärenähnliches Beuteltier mit kurzen Beinen und einem großen Kopf.",
      triggerAfterAttempts: 3
    },
    {
      id: "wombat_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist ein Meister im Graben und baut ausgedehnte Tunnelsysteme.",
      triggerAfterAttempts: 6
    },
    {
      id: "wombat_h3",
      type: HintType.AUTO_FREE,
      content: "Sein Beutel ist nach hinten geöffnet, damit beim Graben keine Erde hineinfällt.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "koala",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Beuteltier, aber der gesuchte ist ein reiner Bodenbewohner und hat keine großen Ohren.",
      title: "Falscher Baum!",
      triggers: ["koala"]
    },
    {
      id: "bär",
      type: HintType.CONTEXTUAL,
      content: "Vorsicht! Obwohl es bärenähnlich aussieht, ist es ein australisches Beuteltier, kein Plazentatier.",
      title: "Kein echter Bär!",
      triggers: ["bär"]
    }
  ],
  customHints: [
    {
      id: "verteidigung",
      type: HintType.CUSTOM,
      title: "Verteidigung",
      content: "Seine Verteidigungsstrategie ist es, mit seinem knochenharten Hinterteil den Tunneleingang zu blockieren.",
      cost: 1,
    },
    {
      id: "aktiv",
      type: HintType.CUSTOM,
      title: "Aktivität",
      content: "Es ist hauptsächlich dämmerungs- und nachtaktiv.",
      cost: 1,
    }
  ]
};

const dingo: QuestionBase = {
  id: 5,
  answer: "Dingo",
  title: "Der wilde Hund",
  images: {
    imageUrl: require("./dingo.webp"),
  },
  funFact: "Dingos nicht wie Haushunde bellen, sondern hauptsächlich durch \"Heulen\" kommunizieren?",
  autoFreeHints: [
    {
      id: "dingo_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist die größte fleischfressende Landraubtierart Australiens und gilt als wilder Hund.",
      triggerAfterAttempts: 3
    },
    {
      id: "dingo_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist oft an seinem meist sandfarbenen bis rötlichen Fell und der schlanken, athletischen Statur zu erkennen.",
      triggerAfterAttempts: 6
    },
    {
      id: "dingo_h3",
      type: HintType.AUTO_FREE,
      content: "Die Tiere leben hauptsächlich in kleinen Rudeln und jagen Beutetiere wie Kängurus und Wallabys.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "wolf",
      type: HintType.CONTEXTUAL,
      content: "Verwandt, aber der gesuchte ist kleiner und viel heller im Fell. Er ist das Top-Raubtier auf seinem Kontinent.",
      title: "Falscher Kontinent!",
      triggers: ["wolf"]
    },
    {
      id: "rotfuchs",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Hundeartiger, aber dieser ist viel kleiner, hat eine weiße Schwanzspitze und ist ein europäisches Raubtier.",
      title: "Zu klein!",
      triggers: ["rotfuchs", "fuchs"]
    }
  ],
  customHints: [
    {
      id: "gefaehrdet",
      type: HintType.CUSTOM,
      title: "Status",
      content: "Der Bestand dieser Art ist durch die Vermischung mit Haushunden stark gefährdet.",
      cost: 1,
    },
    {
      id: "zaun",
      type: HintType.CUSTOM,
      title: "Infrastruktur",
      content: "Zum Schutz von Nutztieren wurde eine über 5600 km lange Barriere errichtet, die seinen Lebensraum begrenzt.",
      cost: 1,
    }
  ]
};

const emu: QuestionBase = {
  id: 6,
  answer: "Emu",
  title: "Der Laufvogel",
  images: {
    imageUrl: require("./emu.webp"),
  },
  alternativeAnswers: ["Großer Emu"],
  funFact: "der Emu der \"zweitgrößte\" lebende Vogel der Welt (nach dem Strauß) ist und im Sprint Geschwindigkeiten von bis zu 50 km/h erreichen kann?",
  autoFreeHints: [
    {
      id: "emu_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein flugunfähiger Laufvogel mit kräftigen Beinen und einem zotteligen Gefieder.",
      triggerAfterAttempts: 3
    },
    {
      id: "emu_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist auf dem Wappen Australiens zusammen mit dem Känguru abgebildet.",
      triggerAfterAttempts: 6
    },
    {
      id: "emu_h3",
      type: HintType.AUTO_FREE,
      content: "Ungewöhnlich für Vögel: Der Hahn brütet die Eier aus und zieht die Küken alleine auf.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "strauss",
      type: HintType.CONTEXTUAL,
      content: "Zu groß! Und dieser lebt in Afrika. Der gesuchte ist in Australien heimisch.",
      title: "Falscher Kontinent!",
      triggers: ["strauss"]
    },
    {
      id: "kasuar",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Laufvogel, aber dieser trägt einen auffälligen, knöchernen Helm auf dem Kopf und leuchtend blaues Gefieder am Hals.",
      title: "Zu bunt!",
      triggers: ["kasuar"]
    }
  ],
  customHints: [
    {
      id: "trinken",
      type: HintType.CUSTOM,
      title: "Überleben",
      content: "Er kann wochenlang ohne Wasser auskommen, wenn es nötig ist.",
      cost: 1,
    },
    {
      id: "sprung",
      type: HintType.CUSTOM,
      title: "Bewegung",
      content: "Mit seinen starken Beinen kann er Zäune von fast zwei Metern Höhe überspringen.",
      cost: 1,
    }
  ]
};

const wallaby: QuestionBase = {
  id: 7,
  answer: "Wallaby",
  title: "Der kleine Springer",
  images: {
    imageUrl: require("./wallaby.webp"),
  },
  funFact: "der Name \"Wallaby\" ein Sammelbegriff für jede Känguruart ist, die \"deutlich kleiner\" als die großen Kängurus ist, und keine biologische Klassifikation darstellt?",
  autoFreeHints: [
    {
      id: "wallaby_h1",
      type: HintType.AUTO_FREE,
      content: "Ähnlich wie sein großer Verwandter nutzt es seine kräftigen Hinterbeine zum Hüpfen.",
      triggerAfterAttempts: 3
    },
    {
      id: "wallaby_h2",
      type: HintType.AUTO_FREE,
      content: "Es ist ein Beuteltier und kommt in verschiedenen Unterarten vor, z.B. das Felsen- oder das Busch-Wallaby.",
      triggerAfterAttempts: 6
    },
    {
      id: "wallaby_h3",
      type: HintType.AUTO_FREE,
      content: "Im Gegensatz zu den großen Kängurus sind seine Füße oft proportional kürzer und breiter.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "kaenguru",
      type: HintType.CONTEXTUAL,
      content: "Zu groß! Der gesuchte ist ein Zwerg unter den australischen Springern.",
      title: "Zu massiv!",
      triggers: ["känguru"]
    },
    {
      id: "quokka",
      type: HintType.CONTEXTUAL,
      content: "Zu klein! Der gesuchte ist deutlich größer und hat eine längere Schnauze.",
      title: "Falsche Größe!",
      triggers: ["quokka"]
    }
  ],
  customHints: [
    {
      id: "schwanz",
      type: HintType.CUSTOM,
      title: "Körperteile",
      content: "Der Schwanz ist lang, muskulös und wird als Balancehilfe beim Springen genutzt.",
      cost: 1,
    },
    {
      id: "leben",
      type: HintType.CUSTOM,
      title: "Lebensraum",
      content: "Viele Arten bevorzugen dichtere, felsige oder bewaldete Gebiete, nicht die offenen Ebenen.",
      cost: 1,
    }
  ]
};

const kookaburra: QuestionBase = {
  id: 8,
  answer: "Kookaburra",
  title: "Der lachende Vogel",
  images: {
    imageUrl: require("./kookaburra.webp"),
  },
  alternativeAnswers: ["Jägerliest", "Lachender Hans"],
  funFact: "sein charakteristischer Ruf wie lautes, hysterisches menschliches \"Lachen\" klingt, weshalb er auch \"Lachender Hans\" genannt wird?",
  autoFreeHints: [
    {
      id: "kookaburra_h1",
      type: HintType.AUTO_FREE,
      content: "Er gehört zur Familie der Eisvögel, obwohl er kaum Fische frisst und nicht am Wasser lebt.",
      triggerAfterAttempts: 3
    },
    {
      id: "kookaburra_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist ein kräftiger, großer Vogel mit einem markanten, dicken Schnabel.",
      triggerAfterAttempts: 6
    },
    {
      id: "kookaburra_h3",
      type: HintType.AUTO_FREE,
      content: "Sein lautes Lachen dient morgens und abends der Revierabgrenzung.",
      triggerAfterAttempts: 9
    }
  ],
  contextualHints: [
    {
      id: "eule",
      type: HintType.CONTEXTUAL,
      content: "Falscher Jäger! Der gesuchte ist tagaktiv und hat keinen lautlosen Flug.",
      title: "Keine Nachtjägerin!",
      triggers: ["eule"]
    },
    {
      id: "papagei",
      type: HintType.CONTEXTUAL,
      content: "Zu bunt! Der gesuchte ist ein Jäger mit unscheinbarem Gefieder und einem starken, geraden Schnabel.",
      title: "Zu farbenfroh!",
      triggers: ["kakadu", "papagei"]
    }
  ],
  customHints: [
    {
      id: "beute",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Seine Beute besteht hauptsächlich aus kleinen Säugetieren, Insekten und kleinen Schlangen.",
      cost: 1,
    },
    {
      id: "familie",
      type: HintType.CUSTOM,
      title: "Sozialleben",
      content: "Er lebt in kleinen Familiengruppen, die sich gegenseitig bei der Aufzucht der Jungen helfen.",
      cost: 1,
    }
  ]
};


const tiereAustraliens: QuestionBase[] = [
  koala,
  kaenguru,
  quokka,
  wombat,
  dingo,
  emu,
  wallaby,
  kookaburra,
];

export const australienQuiz: Quiz = {
  id: "australien",
  title: "Australien",
  questions: tiereAustraliens,
  titleImage: require("./kaenguru.webp"),
  description: "Land der Beuteltiere. Die gefährlichste und einzigartigste Tierwelt.",
};