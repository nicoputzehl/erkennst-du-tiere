import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const alpaka: QuestionBase = {
  id: 1,
  answer: "Alpaka",
  title: "Woll-Spezialist",
  funFact:
    "dieses domestizierte Tier hauptsächlich wegen seiner extrem weichen, \"hypoallergenen Wolle\" gezüchtet wurde und nicht primär als Lasttier?",
  autoFreeHints: [
    {
      id: "alpaka_h1",
      type: HintType.AUTO_FREE,
      content: "Es gehört zur Familie der Kamele (Neuweltkameliden) und stammt aus den Anden in Peru, Bolivien und Chile.",
      triggerAfterAttempts: 3
    },
    {
      id: "alpaka_h2",
      type: HintType.AUTO_FREE,
      content: "Es ist kleiner und leichter als sein naher Verwandter, das Lama, und hat ein flauschigeres Gesicht.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "lama_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gute Richtung, aber der gesuchte wird eher für seine feine Faser als für seine Lastenträger-Fähigkeiten geschätzt.",
      title: "Zu groß!",
      triggers: ["lama"]
    },
    {
      id: "vicunja_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gute Richtung, aber der gesuchte ist domestiziert, nicht wildlebend.",
      title: "Zu wild!",
      triggers: ["vicunja", "guanako"]
    }
  ],
  customHints: [
    {
      id: "spucken",
      type: HintType.CUSTOM,
      title: "Spucken",
      content: "Wie seine Verwandten spuckt es, allerdings meistens nur untereinander, um Rangordnungen festzulegen oder Futterneid zu zeigen.",

    }
  ]
};

const piranha: QuestionBase = {
  id: 2,
  answer: "Piranha",
  title: "Scharfer Räuber",
  wikipediaName: "Piranhas",
  funFact:
    "trotz ihres furchteinflößenden Rufs viele Piranha-Arten Allesfresser oder reine Pflanzenfresser sind und ihr schlechter Ruf oft auf übertriebenen Geschichten basiert?",
  autoFreeHints: [
    {
      id: "piranha_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser Fisch lebt in den Süßwässern des Amazonasbeckens.",
      triggerAfterAttempts: 3
    },
    {
      id: "piranha_h2",
      type: HintType.AUTO_FREE,
      content: "Sie sind bekannt für ihre messerscharfen, dreieckigen Zähne und kommen meist in großen Schwärmen vor.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "hai_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Umgebung! Der gesuchte lebt nicht im Meer, sondern in Flüssen.",
      title: "Süßwasserfisch!",
      triggers: ["hai", "wels"]
    },
    {
      id: "krokodil_trigger",
      type: HintType.CONTEXTUAL,
      content: "Das gesuchte Tier ist viel kleiner und ist selbst Beute von Kaimanen und Anakondas.",
      title: "Zu groß!",
      triggers: ["kaiman", "krokodil"]
    }
  ],
  customHints: [
    {
      id: "saubermann",
      type: HintType.CUSTOM,
      title: "Die Aufgabe",
      content: "Sie fungieren als eine Art \"Gesundheitspolizei\", indem sie Aas und kranke Tiere fressen und so die Ausbreitung von Krankheiten in den Flüssen verhindern.",

    }
  ]
};

const jaguar: QuestionBase = {
  id: 3,
  answer: "Jaguar",
  title: "Größte Katze",
  funFact:
    "sein Name von einem indigenen Wort kommt, das \"der, der im Fliegen tötet\" bedeutet, und er das stärkste Gebiss aller Großkatzen hat, mit dem er sogar Schildkrötenpanzer knacken kann?",
  autoFreeHints: [
    {
      id: "jaguar_h1",
      type: HintType.AUTO_FREE,
      content: "Es ist die drittgrößte Katze der Welt und die einzige Großkatze, die in den Amerikas lebt.",
      triggerAfterAttempts: 3
    },
    {
      id: "jaguar_h2",
      type: HintType.AUTO_FREE,
      content: "Er liebt Wasser, ist ein hervorragender Schwimmer und jagt oft Fische, Schildkröten und Kaimane in Flüssen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "leopard_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Der gesuchte hat außerdem Rosetten mit einem oder mehreren schwarzen Punkten in der Mitte.",
      title: "Afrika!",
      triggers: ["leopard", "gepard"]
    },
    {
      id: "puma_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleicher Kontinent, aber der gesuchte ist gefleckt, nicht einfarbig.",
      title: "Falsche Farbe!",
      triggers: ["puma"]
    }
  ],
  customHints: [
    {
      id: "gebiss",
      type: HintType.CUSTOM,
      title: "Tötungsmethode",
      content: "Im Gegensatz zu anderen Großkatzen tötet er seine Beute oft durch einen Biss in den Schädel.",

    }
  ]
};

const lama: QuestionBase = {
  id: 4,
  answer: "Lama",
  title: "Anden-Lasttier",
  wikipediaName: "Lama_(Kamel)",
  funFact:
    "das Lama in den Anden domestiziert wurde und seit Jahrtausenden als wichtiges Lasttier für die Inka und ihre Nachfahren dient?",
  autoFreeHints: [
    {
      id: "lama_h1",
      type: HintType.AUTO_FREE,
      content: "Es ist ein großer Kamelide (Neuweltkamelide) und kann bis zu 30 kg Last tragen.",
      triggerAfterAttempts: 3
    },
    {
      id: "lama_h2",
      type: HintType.AUTO_FREE,
      content: "Seine Ohren sind lang und leicht nach innen gebogen (\"Bananenohren\"), was es von seinem kleineren Verwandten unterscheidet.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "alpaka_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Gute Richtung, aber der gesuchte ist größer und wird hauptsächlich als Lasttier und für Fleisch verwendet.",
      title: "Zu klein!",
      triggers: ["alpaka"]
    },
    {
      id: "kamel_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Der gesuchte hat keine Höcker.",
      title: "Zu viele Höcker!",
      triggers: ["kamel", "dromedar"]
    }
  ],
  customHints: [
    {
      id: "beleidigt",
      type: HintType.CUSTOM,
      title: "Spuck-Alarm",
      content: "Wenn es überladen ist oder sich bedroht fühlt, drückt es seine Unzufriedenheit durch Spucken von halbverdautem Mageninhalt aus.",

    }
  ]
};

const capybara: QuestionBase = {
  id: 5,
  answer: "Capybara",
  title: "Riesennagetier",
  alternativeAnswers: ["Wasserschwein"],
  funFact:
    "das Capybara das größte Nagetier der Welt ist und sein Name in der Tupi-Sprache der Ureinwohner \"Herr der Gräser\" bedeutet?",
  autoFreeHints: [
    {
      id: "capybara_h1",
      type: HintType.AUTO_FREE,
      content: "Es ist ein sehr soziales, halb-aquatisches Tier und lebt in Gruppen in der Nähe von Gewässern.",
      triggerAfterAttempts: 3
    },
    {
      id: "capybara_h2",
      type: HintType.AUTO_FREE,
      content: "Es wird oft liebevoll als \"Gras-Pferd\" bezeichnet und ist dafür bekannt, mit fast allen anderen Tierarten friedlich zu koexistieren.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "meerschweinchen_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Verwandtschaft, aber der gesuchte ist um ein Vielfaches größer!",
      title: "Zu klein!",
      triggers: ["meerschweinchen"]
    },
    {
      id: "nilpferd_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Der gesuchte ist ein Nagetier, kein Dickhäuter.",
      title: "Afrika!",
      triggers: ["nilpferd"]
    }
  ],
  customHints: [
    {
      id: "taucher",
      type: HintType.CUSTOM,
      title: "Unterwasser",
      content: "Um Raubtieren (wie dem Jaguar oder der Anakonda) zu entkommen, kann es bis zu 5 Minuten unter Wasser bleiben.",

    }
  ]
};

const kondor: QuestionBase = {
  id: 6,
  answer: "Kondor",
  title: "König der Anden",
  alternativeAnswers: ["Andenkondor", "Kondor"],
  funFact:
    "der Kondor mit über 3 Metern die größte Flügelspannweite aller Landvögel der Welt hat und die Thermik nutzt, um in großen Höhen zu gleiten?",
  autoFreeHints: [
    {
      id: "kondor_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser Aasfresser lebt in den Anden und an der pazifischen Küste Südamerikas.",
      triggerAfterAttempts: 3
    },
    {
      id: "kondor_h2",
      type: HintType.AUTO_FREE,
      content: "Sein fast kahler Kopf dient der Hygiene beim Fressen von Aas. Das Männchen trägt zudem einen markanten Kamm auf dem Kopf.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "adler_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Ernährung! Der gesuchte ist ein reiner Aasfresser und kein aktiver Jäger.",
      title: "Kein Jäger!",
      triggers: ["adler", "falke"]
    },
    {
      id: "geier_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Funktion! Aber der gesuchte ist die größte und schwerste Art dieser Gruppe.",
      title: "Zu klein!",
      triggers: ["geier"]
    }
  ],
  customHints: [
    {
      id: "wappen",
      type: HintType.CUSTOM,
      title: "Nationales Symbol",
      content: "Er ist das Nationalsymbol mehrerer Andenländer, darunter Kolumbien, Ecuador, Bolivien und Chile.",

    }
  ]
};

const nandu: QuestionBase = {
  id: 7,
  answer: "Nandu",
  title: "Der Laufvogel der Pampa",
  alternativeAnswers: ["Großer Nandu"],
  funFact:
    "obwohl der Nandu flugunfähig ist, er die größten Flügel aller Laufvögel besitzt, die er zur Balance und als Ruder beim schnellen Laufen (bis zu 60 km/h) nutzt?",
  autoFreeHints: [
    {
      id: "nandu_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist der größte Vogel des amerikanischen Kontinents und lebt in den offenen Graslandschaften (Pampas).",
      triggerAfterAttempts: 3
    },
    {
      id: "nandu_h2",
      type: HintType.AUTO_FREE,
      content: "Der Hahn ist der alleinerziehende Vater: Er baut das Nest, brütet die Eier (von bis zu 12 Hennen) aus und zieht die Küken auf.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "strauss_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Der gesuchte ist kleiner als sein afrikanisches Gegenstück.",
      title: "Afrika!",
      triggers: ["strauß"]
    },
    {
      id: "emu_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Der gesuchte hat drei Zehen und stammt aus Südamerika.",
      title: "Australien!",
      triggers: ["emu"]
    }
  ],
  customHints: [
    {
      id: "verteidigung",
      type: HintType.CUSTOM,
      title: "Abwehrmechanismus",
      content: "Zur Verteidigung oder zum Kampf tritt er nach vorne oder rennt im Zickzack-Muster davon.",

    }
  ]
};

const schopfkarakara: QuestionBase = {
  id: 8,
  answer: "Schopfkarakara",
  title: "Aasvogel",
  funFact:
    "der Schopfkarakara mehr Zeit zu Fuß am Boden verbringt als andere Greifvögel, manchmal als \"wandernder Falke\" bezeichnet wird und sowohl Aasfresser als auch aktiver Jäger ist?",
  autoFreeHints: [
    {
      id: "sk_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser Greifvogel ist durch seinen ausgeprägten, dunklen Federschopf und sein schwarz-weißes Gefieder gekennzeichnet.",
      triggerAfterAttempts: 3
    },
    {
      id: "sk_h2",
      type: HintType.AUTO_FREE,
      content: "Sein gelb-orangefarbenes bis rötliches Gesicht ist unbefiedert und wechselt die Farbe je nach Erregungszustand.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "falke_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie (Falkenartige), aber der gesuchte ist viel größer und robuster, und frisst hauptsächlich Aas.",
      title: "Zu klein!",
      triggers: ["falke"]
    },
    {
      id: "geier_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte jagt auch aktiv kleine Beute, nicht nur Aas.",
      title: "Ein Jäger?",
      triggers: ["geier"]
    }
  ],
  customHints: [
    {
      id: "futter",
      type: HintType.CUSTOM,
      title: "Nahrungsbeschaffung",
      content: "Er folgt oft dem Puma und anderen Großkatzen in der Hoffnung, von deren Beuteresten zu profitieren.",

    }
  ]
};

const tiereDerAnden: QuestionBase[] = [
  lama,
  alpaka,
  capybara,
  nandu,
  piranha,
  jaguar,
  kondor,
  schopfkarakara,
];

export const suedamerikaQuiz: Quiz = {
  id: "suedamerika",
  title: "Südamerika",
  questions: tiereDerAnden,
  titleImage: require("./alpaka.webp"),
  description: "Regenwald, Anden, Amazonas. Der farbenfrohe und wilde Kontinent.",
};