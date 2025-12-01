import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const eisbaer: QuestionBase = {
  id: 1,
  answer: "Eisbär",
  title: "Der weiße Riese der Arktis",
  images: {
    imageUrl: require("./eisbaer.webp"),
    unsolvedImageUrl: require("./eisbaer_unsolved.webp"),
  },
  alternativeAnswers: ["Polarbär"],
  funFact:
    "...das Fell des Eisbären zwar weiß erscheint, die einzelnen Haare jedoch transparent und hohl sind und seine Haut darunter schwarz ist, um Sonnenwärme besser aufzunehmen?",
  autoFreeHints: [
    {
      id: "eisbaer_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist das größte Landraubtier der Welt und lebt ausschließlich in der Arktis (Nordpol).",
      triggerAfterAttempts: 3
    },
    {
      id: "eisbaer_h2",
      type: HintType.AUTO_FREE,
      content: "Seine Hauptnahrung sind Robben, die er am Packeisrand jagt.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "braunbaer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Farbe und falscher Lebensraum! Der gesuchte ist viel besser an das Meereis angepasst.",
      title: "Kein Kodiak!",
      triggers: ["braunbär", "kodiakbär"]
    },
    {
      id: "wal_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ganz andere Ordnung! Der gesuchte ist ein Landraubtier.",
      title: "Kein Wal!",
      triggers: ["wal", "orca"]
    }
  ],
  customHints: [
    {
      id: "eisbaer_schwimmen",
      type: HintType.CUSTOM,
      title: "Tatzen und Schwimmen",
      content: "Seine riesigen, schaufelförmigen Vorderpfoten sind sein \"Motor\" beim Schwimmen und helfen, sein Gewicht auf dem Eis zu verteilen.",
      cost: 1,
    }
  ]
};

const walross: QuestionBase = {
  id: 2,
  answer: "Walross",
  title: "Der Robbenartige mit den Hauern",
  images: {
    imageUrl: require("./walross.webp"),
    unsolvedImageUrl: require("./walross_unsolved.webp"),
  },
  funFact:
    "...die Stoßzähne (Hauer) bei Walrossen sowohl von Männchen als auch Weibchen getragen werden und dazu dienen, sich auf dem Eis hochzuziehen, Löcher zu schneiden und Muscheln vom Meeresboden zu scharren?",
  autoFreeHints: [
    {
      id: "walross_h1",
      type: HintType.AUTO_FREE,
      content: "Er gehört zur Familie der Robben und kann bis zu 3,7 Meter lang und über 1200 Kilogramm schwer werden.",
      triggerAfterAttempts: 3
    },
    {
      id: "walross_h2",
      type: HintType.AUTO_FREE,
      content: "Seine Hauptnahrung besteht aus Muscheln, die er mit seinen steifen Schnurrhaaren (Vibrissen) am Meeresboden aufspürt.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "robbe_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte hat riesige Stoßzähne und ist viel massiger.",
      title: "Keine Robbe!",
      triggers: ["robbe", "seehund"]
    },
    {
      id: "seekuh_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Ordnung! Der gesuchte lebt in kalten Meeren und hat große Hauer.",
      title: "Keine Seekuh!",
      triggers: ["seekuh", "manati"]
    }
  ],
  customHints: [
    {
      id: "walross_herde",
      type: HintType.CUSTOM,
      title: "Sozialverhalten",
      content: "Er hält sich in riesigen Herden (bis zu hundert Tiere) am Packeisrand oder an felsigen Inseln auf.",
      cost: 1,
    }
  ]
};

const papageientaucher: QuestionBase = {
  id: 3,
  answer: "Papageientaucher",
  title: "Der Clown der Nordmeere",
  images: {
    imageUrl: require("./papageientaucher.webp"),
  },
  alternativeAnswers: ["Puffin"],
  funFact:
    "...der leuchtend bunte, dreieckige Schnabel (rot, gelb, orange) des Papageientauchers nur während der Brutzeit sichtbar ist und er den Rest des Jahres unscheinbarer aussieht?",
  autoFreeHints: [
    {
      id: "papageientaucher_h1",
      type: HintType.AUTO_FREE,
      content: "Er gehört zu den Alkenvögeln und wird wegen seines Aussehens auch \"See-Papagei\" genannt. Manchmal wird er auch mit kleinen Pinguinen verwechselt.",
      triggerAfterAttempts: 3
    },
    {
      id: "papageientaucher_h2",
      type: HintType.AUTO_FREE,
      content: "Er kann dank einer speziellen Gelenkstruktur im Schnabel mehrere kleine Fische (bis zu 61!) gleichzeitig quer transportieren.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "pinguin_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Hemisphäre! Der gesuchte lebt im Norden und kann fliegen.",
      title: "Kein Pinguin!",
      triggers: ["pinguin"]
    },
    {
      id: "möwe_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ganz anderer Lebensstil! Der gesuchte taucht tief für seine Nahrung und ist zur Brutzeit sehr farbenfroh.",
      title: "Keine Möwe!",
      triggers: ["möwe", "alk"]
    }
  ],
  customHints: [
    {
      id: "papageientaucher_nest",
      type: HintType.CUSTOM,
      title: "Nistverhalten",
      content: "Zum Brüten gräbt er Höhlen in Erde und Torf an steilen Küstenklippen. Ein Pärchen bleibt meist ein Leben lang zusammen.",
      cost: 1,
    }
  ]
};

const schneeeule: QuestionBase = {
  id: 4,
  answer: "Schneeeule",
  title: "Hedwig",
  images: {
    imageUrl: require("./schneeeule.webp"),
  },
  funFact:
    "...die männlichen Tiere fast reinweiß sind, während die Weibchen dunkle Querstreifen und eine Wellenzeichnung im Gefieder haben?",
  autoFreeHints: [
    {
      id: "schneeeule_h1",
      type: HintType.AUTO_FREE,
      content: "Sie ist eine der größten Eulenarten der Welt und die einzige, die fast reinweiß ist.",
      triggerAfterAttempts: 3
    },
    {
      id: "schneeeule_h2",
      type: HintType.AUTO_FREE,
      content: "Sie ist tagaktiv und jagt ihre Hauptbeute, die Lemminge, vom Boden oder von kleinen Erhöhungen aus.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "adler_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Ordnung! Der gesuchte kann seinen Kopf bis zu 180 Grad drehen und ist fast reinweiß.",
      title: "Kein Adler!",
      triggers: ["adler", "falke"]
    },
    {
      id: "schneehuhn_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Raubvogel (Eule), kein Huhn.",
      title: "Falsche Vogelfamilie!",
      triggers: ["schneehuhn"]
    },
    {
      id: "genauer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Aber die Lösung ist etwas genauer.",
      title: "Nicht falsch",
      triggers: ["eule"]
    }
  ],
  customHints: [
    {
      id: "schneeeule_füsse",
      type: HintType.CUSTOM,
      title: "Schneeschuhe",
      content: "Sie hat auffallend große, dicke, behaarte Füße, die wie Schneeschuhe wirken und sie vor dem Einsinken im Schnee schützen.",
      cost: 1,
    }
  ]
};

const polarfuchs: QuestionBase = {
  id: 5,
  answer: "Polarfuchs",
  title: "Schlau im Eis",
  images: {
    imageUrl: require("./polarfuchs.webp"),
  },
  alternativeAnswers: ["Schneefuchs", "Eisfuchs"],
  funFact:
    "...ein Tier das wärmste Fell aller Säugetiere besitzt, extreme Temperaturen bis zu -50 °C überleben kann und sein Fell im Winter strahlend weiß ist?",
  autoFreeHints: [
    {
      id: "polarfuchs_h1",
      type: HintType.AUTO_FREE,
      content: "Er folgt oft Eisbären, um Reste von deren Robbenbeute zu fressen.",
      triggerAfterAttempts: 3
    },
    {
      id: "polarfuchs_h2",
      type: HintType.AUTO_FREE,
      content: "Er kann seine Beute (Lemminge, Mäuse) dank seines ausgezeichneten Gehörs auch unter einer dicken Schneedecke ausmachen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "wolf_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte ist viel kleiner und ändert im Sommer seine Fellfarbe.",
      title: "Zu groß!",
      triggers: ["wolf", "polarwolf"]
    },
    {
      id: "hase_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Raubtier und jagt seine Beute.",
      title: "Kein Hase!",
      triggers: ["hase", "schneehase"]
    }, {
      id: "genauer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Aber die Lösung ist etwas genauer.",
      title: "Nicht falsch",
      triggers: ["fuchs"]
    }
  ],
  customHints: [
    {
      id: "polarfuchs_bedrohung",
      type: HintType.CUSTOM,
      title: "Bedrohung",
      content: "Neben der Klimaerwärmung wird er durch den Rotfuchs bedroht, der wegen der milderen Winter in seine Lebensräume vordringt.",
      cost: 1,
    }
  ]
};

const rentier: QuestionBase = {
  id: 6,
  answer: "Rentier",
  title: "Der Meisterwanderer",
  images: {
    imageUrl: require("./rentier.webp"),
  },
  alternativeAnswers: ["Ren"],
  funFact:
    "...diese Hirschart die einzige ist, bei der sowohl männliche als auch weibliche Tiere ein Geweih tragen und sie die weitesten Strecken aller Landsäugetiere zurücklegt (bis zu 5000 km pro Jahr)?",
  autoFreeHints: [
    {
      id: "rentier_h1",
      type: HintType.AUTO_FREE,
      content: "Seine Hufe sind breit und scharfkantig. Sie dienen als \"Schneeschuhe\" und \"Schaufeln\", um unter dem Schnee nach Flechten und Moos zu graben.",
      triggerAfterAttempts: 3
    },
    {
      id: "rentier_h2",
      type: HintType.AUTO_FREE,
      content: "Die Tiere können ultraviolettes Licht sehen, was ihnen hilft, Feinde im blendenden Schnee besser zu erkennen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "elch_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte lebt in riesigen Herden und hat im Verhältnis zum Körper das größte Geweih.",
      title: "Kein Elch!",
      triggers: ["elch", "hirsch"]
    },
    {
      id: "schaf_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Hirsch und hat ein verzweigtes Geweih, kein einfaches Horn.",
      title: "Kein Schaf!",
      triggers: ["schaf", "ziege"]
    }
  ],
  customHints: [
    {
      id: "rentier_geräusche",
      type: HintType.CUSTOM,
      title: "Geh-Geräusche",
      content: "Beim Gehen machen diese Tiere charakteristische Klickgeräusche. Diese stammen von einer Sehne in den Hinterbeinen.",
      cost: 1,
    }
  ]
};

const polarwolf: QuestionBase = {
  id: 7,
  answer: "Polarwolf",
  title: "Überlebenskünstler",
  images: {
    imageUrl: require("./polarwolf.webp"),
  },
  alternativeAnswers: ["Weißwolf", "Arktischer Wolf"],
  funFact:
    "...dieses Tier in den rauesten Regionen der Arktis lebt, in Rudeln von bis zu 30 Tieren Rentiere und Moschusochsen jagt und ein sehr dichtes Unterfell besitzt?",
  autoFreeHints: [
    {
      id: "polarwolf_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist eine Unterart des Wolfs und hat eine kürzere Schnauze, kürzere Beine und kleinere Ohren, um die Wärme besser zu speichern.",
      triggerAfterAttempts: 3
    },
    {
      id: "polarwolf_h2",
      type: HintType.AUTO_FREE,
      content: "Sein Lebensraum ist die kanadische Arktis und Grönland, wo er im Rudel über riesige Jagdgebiete von über 1300 km² streift.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "husky_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Wildtier und jagt Rentiere; er ist kein Schlittenhund.",
      title: "Kein Schlittenhund!",
      triggers: ["husky", "malamut"]
    },
    {
      id: "polarfuchs_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte ist viel größer und bleibt das ganze Jahr weiß.",
      title: "Zu klein!",
      triggers: ["polarfuchs"]
    },    {
      id: "genauer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Aber die Lösung ist etwas genauer.",
      title: "Nicht falsch",
      triggers: ["wolf"]
    }
  ],
  customHints: [
    {
      id: "polarwolf_welpen",
      type: HintType.CUSTOM,
      title: "Nachwuchs",
      content: "Innerhalb eines Rudels dürfen sich nur das Alpha-Männchen und das Alpha-Weibchen paaren. Alle anderen Mitglieder helfen bei der Aufzucht der Welpen.",
      cost: 1,
    }
  ]
};

const schneehase: QuestionBase = {
  id: 8,
  answer: "Schneehase",
  title: "Der flinke Haken-Schlager",
  images: {
    imageUrl: require("./schneehase.webp"),
  },
  funFact:
    "...dieser Hase der einzige ist, dessen Fell sich im Winter komplett weiß färbt, während nur die Spitzen seiner Ohren schwarz bleiben, und er im Sommer graubraun ist?",
  autoFreeHints: [
    {
      id: "schneehase_h1",
      type: HintType.AUTO_FREE,
      content: "Seine Hinterpfoten sind stark behaart und sehr spreizbar – eine perfekte \"Schneeschuh-Funktion\".",
      triggerAfterAttempts: 3
    },
    {
      id: "schneehase_h2",
      type: HintType.AUTO_FREE,
      content: "Im Gegensatz zum Feldhasen lebt er nicht nur als Einzelgänger, sondern manchmal auch in größeren Gruppen von bis zu hundert Tieren.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "kaninchen_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Gattung! Der gesuchte ist größer, hat längere Ohren und ist ein reiner Oberflächenbewohner.",
      title: "Kein Kaninchen!",
      triggers: ["kaninchen"]
    },
    {
      id: "feldhase_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist runder, hat im Verhältnis kleinere Ohren und wechselt komplett seine Fellfarbe.",
      title: "Falsche Tarnung!",
      triggers: ["feldhase", "hase"]
    }
  ],
  customHints: [
    {
      id: "schneehase_kot",
      type: HintType.CUSTOM,
      title: "Vitamine",
      content: "Um alle Nährstoffe aufzunehmen (insbesondere Vitamin B), frisst er seinen eigenen, weichen Kot (Caecotrophie).",
      cost: 1,
    }
  ]
};

const arktis: QuestionBase[] = [
  eisbaer,
  walross,
  papageientaucher,
  schneeeule,
  polarfuchs,
  rentier,
  polarwolf,
  schneehase
]

export const arktisQuiz: Quiz = {
  id: "arktis",
  title: "Arktis",
  questions: arktis,
  titleImage: require("./eisbaer.webp"),
  description: "Diese Tiere mögen es gerne kalt."
};