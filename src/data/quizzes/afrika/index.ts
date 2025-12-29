import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const afrikanischer_elefant: QuestionBase = {
  id: 1,
  answer: "Elefant",
  title: "Landriese",
  funFact:
    "afrikanische Elefanten mit ihren Füßen Erdbeben spüren können, die hunderte Kilometer entfernt stattfinden, um so über weite Distanzen zu kommunizieren?",
  images: {
    imageUrl: require("./afrikanischer-elefant.webp"),
    unsolvedImageUrl: require("./afrikanischer-elefant_unsolved.webp"),
  },
  alternativeAnswers: ["Afrikanischer Elefant"],
  autoFreeHints: [
    {
      id: "elefant_h1",
      type: HintType.AUTO_FREE,
      content: "Tööörööö",
      triggerAfterAttempts: 3
    },
    {
      id: "elefant_h2",
      type: HintType.AUTO_FREE,
      content: "Sowohl Männchen als auch Weibchen tragen Stoßzähne, die aus Elfenbein bestehen.",
      triggerAfterAttempts: 6
    },
    {
      id: "elefant_h3",
      type: HintType.AUTO_FREE,
      content: "Ich bin das größte Landsäugetier der Welt.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "asien",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Und die Ohren des gesuchten Tieres sind viel größer und ähneln der Form des afrikanischen Kontinents.",
      title: "Asiatischer Elefant",
      triggers: ["asiatischer elefant", "indischer elefant"]
    },
    {
      id: "mammut",
      type: HintType.CONTEXTUAL,
      content: "Viel zu alt! Der gesuchte lebt heute noch und hat kein dichtes, langes Fell.",
      title: "Zu kalt!",
      triggers: ["mammut"]
    }
  ],
  customHints: [
    {
      id: "ohren",
      type: HintType.CUSTOM,
      title: "Körperteile",
      content: "Seine großen Ohren dienen als effektive \"Klimaanlage\" zur Abkühlung in der Hitze.",
    
    },
    {
      id: "nase",
      type: HintType.CUSTOM,
      title: "Nase",
      content: "Die \"Nase\" dieses Tieres endet in zwei Greiffingern (Lippenfortsätzen).",
    
    }
  ]
};

const flusspferd: QuestionBase = {
  id: 2,
  answer: "Flusspferd",
  title: "Schwimmläufer",
  images: {
    imageUrl: require("./flusspferd.webp"),
    unsolvedImageUrl: require("./flusspferd_unsolved.webp"),
  },
  alternativeAnswers: ["Nilpferd", "Hippo", "Hippopotamus"],
  funFact:
    "Flusspferde näher mit Walen als mit anderen Landtieren verwandt sind, weil beide von denselben urzeitlichen Meeresvorfahren abstammen?",
  autoFreeHints: [
    {
      id: "fpferd_h1",
      type: HintType.AUTO_FREE,
      content: "Ich bin ein großes Säugetier, das viel Zeit im Wasser verbringt...",
      triggerAfterAttempts: 2,
    },
    {
      id: "fpferd_h2",
      type: HintType.AUTO_FREE,
      content: "Es sondert ein rötliches, öliges Sekret ab, das es vor Sonnenbrand schützt und manchmal fälschlicherweise als \"Blutschweiß\" bezeichnet wird.",
      triggerAfterAttempts: 5,
    },
    {
      id: "fpferd_h3",
      type: HintType.AUTO_FREE,
      content: "Trotz seiner plumpen Erscheinung ist es eines der gefährlichsten Tiere Afrikas.",
      triggerAfterAttempts: 8,
    },
  ],
  contextualHints: [
    {
      id: "schwein",
      type: HintType.CONTEXTUAL,
      content: "Zu klein! Obwohl es zur Ordnung der Paarhufer gehört, ist der gesuchte Dino-ähnliche Gigant.",
      title: "Falsche Größe!",
      triggers: ["schwein", "warzenschwein"]
    },
    {
      id: "nashorn",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Dickhäuter, aber das gesuchte Tier ist ein exzellenter Schwimmer und verbringt den Tag im Wasser.",
      title: "Zu Land-gebunden!",
      triggers: ["nashorn"]
    }
  ],
  customHints: [
    {
      id: "augen",
      type: HintType.CUSTOM,
      title: "Anpassung",
      content: "Die Augen, Ohren und Nasenlöcher liegen so hoch, dass es fast vollständig unter Wasser versteckt bleiben kann.",
    
    },
    {
      id: "aktiv",
      type: HintType.CUSTOM,
      title: "Aktivität",
      content: "Es kommt erst in der Dämmerung aus dem Wasser, um an Land zu grasen.",
    
    }
  ]
};

const gepard: QuestionBase = {
  id: 3,
  answer: "Gepard",
  title: "Der Sprinter",
  images: {
    imageUrl: require("./gepard.webp"),
    unsolvedImageUrl: require("./gepard_unsolved.webp"),
  },
  alternativeAnswers: ["Cheetah"],
  funFact: "der Gepard das schnellste Landtier der Welt ist und in weniger als drei Sekunden von null auf über 100 km/h beschleunigen kann?",
  autoFreeHints: [
    {
      id: "gepard_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Körper ist extrem schlank und stromlinienförmig, gebaut für kurze, schnelle Jagden.",
      triggerAfterAttempts: 3
    },
    {
      id: "gepard_h2",
      type: HintType.AUTO_FREE,
      content: "Auffällig sind die schwarzen \"Tränenstreifen\", die von den Augenwinkeln zu den Mundwinkeln verlaufen.",
      triggerAfterAttempts: 6
    },
    {
      id: "gepard_h3",
      type: HintType.AUTO_FREE,
      content: "Als einzige Katze kann er seine Krallen nicht vollständig einziehen, was ihm Traktion beim Laufen gibt.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "leopard",
      type: HintType.CONTEXTUAL,
      content: "Auch gefleckt, aber der gesuchte hat dicke, runde Flecken (keine Rosetten) und ist nicht gut im Klettern.",
      title: "Zu langsam!",
      triggers: ["leopard"]
    },
    {
      id: "serval",
      type: HintType.CONTEXTUAL,
      content: "Ein kleinerer, schlankerer Jäger mit sehr großen Ohren.",
      title: "Zu große Ohren!",
      triggers: ["serval"]
    }
  ],
  customHints: [
    {
      id: "schwanz",
      type: HintType.CUSTOM,
      title: "Körperteile",
      content: "Sein langer Schwanz dient als Steuerruder und Balancierhilfe bei den schnellen Kurven der Jagd.",
    
    },
    {
      id: "geräusch",
      type: HintType.CUSTOM,
      title: "Klang",
      content: "Er kann nicht brüllen, sondern nur miauen, schnurren oder zwitschern.",
    
    }
  ]
};

const giraffe: QuestionBase = {
  id: 4,
  answer: "Giraffe",
  title: "Hallo da unten",
  funFact:
    "Giraffen genau wie Menschen nur sieben Halswirbel haben, obwohl ihr Hals bis zu zwei Meter lang ist?",
  images: {
    imageUrl: require("./giraffe.webp"),
    unsolvedImageUrl: require("./giraffe_unsolved.webp"),
  },
  autoFreeHints: [
    {
      id: "giraffe_h1",
      type: HintType.AUTO_FREE,
      content: "Schwer zu erkennen. Aber versuch mal das Muster zu erkennen.",
      triggerAfterAttempts: 3
    },
    {
      id: "giraffe_h2",
      type: HintType.AUTO_FREE,
      content: "Die Zunge des gesuchten Tieres kann 45-50 Zentimeter lang werden und ist oft bläulich-violett gefärbt.",
      triggerAfterAttempts: 6
    },
    {
      id: "giraffe_h3",
      type: HintType.AUTO_FREE,
      content: "Männchen und Weibchen tragen kurze, behaarte, knöcherne Hörner, die als Ossicones bezeichnet werden.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "okapi",
      type: HintType.CONTEXTUAL,
      content: "Dieser Verwandte hat auch Ossicones, aber einen viel kürzeren Hals und Zebrastreifen an den Beinen.",
      title: "Zu kurz!",
      triggers: ["okapi"]
    },
    {
      id: "antilope",
      type: HintType.CONTEXTUAL,
      content: "Falsche Gruppe! Der gesuchte ist der höchste Wiederkäuer der Welt.",
      title: "Zu niedrig!",
      triggers: ["kudu", "antilope"]
    }
  ],
  customHints: [
    {
      id: "schlaf",
      type: HintType.CUSTOM,
      title: "Schlafgewohnheit",
      content: "Es schläft pro Tag nur sehr kurz, oft nur 30 Minuten, und meistens im Stehen.",
    
    },
    {
      id: "blut",
      type: HintType.CUSTOM,
      title: "Körperfunktionen",
      content: "Dieses Tier hat ein komplexes Blutdruckregulierungssystem, um Blut zum Kopf und zurück zu pumpen.",
    
    }
  ]
};

const leopard: QuestionBase = {
  id: 5,
  answer: "Leopard",
  title: "Ein sehr beliebtes Muster",
  funFact:
    "Leoparden Beute, die doppelt so schwer ist wie sie selbst, zum Schutz vor Aasfressern bis zu sechs Meter hoch auf einen Baum ziehen können?",
  images: {
    imageUrl: require("./leopard.webp"),
    unsolvedImageUrl: require("./leopard_unsolved.webp"),
  },
  customHints: [
    {
      id: "habitat",
      type: HintType.CUSTOM,
      title: "Lebensraum",
      content: "Dieses Tier ist ein hervorragender Kletterer.",
    
    },
    {
      id: "color",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Hat ein goldgelbes Fell mit schwarzen Rosetten.",
    
    }
  ],
  contextualHints: [{
    id: "jaguar",
    type: HintType.CONTEXTUAL,
    content: "Richtige Richtung! Aber lebt in Afrika, nicht Südamerika.",
    title: "Falscher Kontinent!",
    triggers: ["jaguar"]
  }
    , {
    id: "gepard",
    type: HintType.CONTEXTUAL,
    content: "Auch gefleckt, aber diese Katze kann sehr gut klettern!",
    title: "Nicht ganz so schnell!",
    triggers: ["gepard", "cheetah"]
  }
  ],
  autoFreeHints: [
    {
      id: "leopard_h1",
      type: HintType.AUTO_FREE,
      content: "Diese gefleckte Großkatze ist fuer ihre Kletterfaehigkeiten bekannt.",
      triggerAfterAttempts: 2,
    },
    {
      id: "leopard_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist die kleinste der vier Großkatzen, die brüllen können (Löwe, Tiger, Jaguar, Leopard).",
      triggerAfterAttempts: 5,
    }
  ]
};

const loewe: QuestionBase = {
  id: 6,
  answer: "Löwe",
  title: "König der Tiere",
  funFact: "Löwen die einzigen Katzen sind, die in Rudeln leben, während alle anderen Großkatzen Einzelgänger sind?",
  images: {
    imageUrl: require("./loewe.webp"),
    unsolvedImageUrl: require("./loewe_unsolved.webp"),
  },
  autoFreeHints: [
    {
      id: "loewe_h1",
      type: HintType.AUTO_FREE,
      content: "Man nennt mich auch den König der Tiere.",
      triggerAfterAttempts: 4
    },
    {
      id: "loewe_h2",
      type: HintType.AUTO_FREE,
      content: "Das Männchen hat eine auffällige, dicke Mähne, die bei den Weibchen fehlt.",
      triggerAfterAttempts: 7
    },
    {
      id: "loewe_h3",
      type: HintType.AUTO_FREE,
      content: "Der Großteil der Jagd im Rudel wird von den Weibchen durchgeführt.",
      triggerAfterAttempts: 10
    },
  ],
  contextualHints: [
    {
      id: "tiger",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Und dieser ist gestreift, nicht einfarbig und mit Mähne.",
      title: "Zu asiatisch!",
      triggers: ["tiger"]
    },
    {
      id: "puma",
      type: HintType.CONTEXTUAL,
      content: "Auch eine große, einfarbige Katze, aber ohne Mähne und lebt in Amerika.",
      title: "Falscher Kontinent!",
      triggers: ["puma", "cougar"]
    }
  ],
  customHints: [
    {
      id: "aktiv",
      type: HintType.CUSTOM,
      title: "Verhalten",
      content: "Dieses Raubtier verbringt bis zu 20 Stunden am Tag mit Ruhen oder Schlafen.",
    
    },
    {
      id: "revier",
      type: HintType.CUSTOM,
      title: "Kommunikation",
      content: "Sein tiefes Brüllen kann kilometerweit zu hören sein und dient der Markierung des Reviers.",
    
    }
  ]
};

const nashorn: QuestionBase = {
  id: 7,
  answer: "Nashorn",
  title: "Der Dickhäuter",
  images: {
    imageUrl: require("./nashorn.webp"),
    unsolvedImageUrl: require("./nashorn_unsolved.webp"),
  },
  alternativeAnswers: ["Breitmaulnashorn", "Spitzmaulnashorn"],
  funFact:
    "das Horn des Nashorns nicht aus Knochen, sondern aus Keratin besteht, also aus demselben Material wie unsere Haare und Fingernägel?",
  autoFreeHints: [
    {
      id: "nashorn_h1",
      type: HintType.AUTO_FREE,
      content: "Den Namensgebenden Teil meines Gesichts kann man nicht sehen.",
      triggerAfterAttempts: 6
    },
    {
      id: "nashorn_h2",
      type: HintType.AUTO_FREE,
      content: "Ich bin nach dem Elefanten das zweitgrößte Landsäugetier Afrikas.",
      triggerAfterAttempts: 9
    },
    {
      id: "nashorn_h3",
      type: HintType.AUTO_FREE,
      content: "Obwohl es sehr massiv ist, kann es kurzzeitig eine Geschwindigkeit von über 50 km/h erreichen.",
      triggerAfterAttempts: 12
    },
  ],
  contextualHints: [
    {
      id: "indien",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Und die asiatischen Verwandten haben oft nur ein Horn.",
      title: "Falsche Art!",
      triggers: ["panzernashorn"]
    },
    {
      id: "flusspferd",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Dickhäuter, aber das gesuchte Tier ist ein reiner Landbewohner und kein exzellenter Schwimmer.",
      title: "Zu viel Wasser!",
      triggers: ["flusspferd", "nilpferd"]
    }
  ],
  customHints: [
    {
      id: "haut",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Die dicke, graue Haut wird oft von Schlammbädern bedeckt, die als Sonnenschutz dienen.",
    
    },
    {
      id: "augen",
      type: HintType.CUSTOM,
      title: "Sinne",
      content: "Es hat einen sehr schlechten Sehsinn, der durch seinen exzellenten Geruchssinn ausgeglichen wird.",
    
    }
  ]
};

const zebra: QuestionBase = {
  id: 8,
  answer: "Zebra",
  title: "Das ist leicht",
  funFact:
    "jedes Zebra ein einzigartiges Streifenmuster besitzt und kein Zebra dem anderen gleicht, ähnlich wie bei einem menschlichen Fingerabdruck?",
  images: {
    imageUrl: require("./zebra.webp"),
    unsolvedImageUrl: require("./zebra_unsolved.webp"),
  },
  autoFreeHints: [
    {
      id: "zebra_h1",
      type: HintType.AUTO_FREE,
      content: "Ich bin mit Pferden verwandt.",
      triggerAfterAttempts: 6
    },
    {
      id: "zebra_h2",
      type: HintType.AUTO_FREE,
      content: "Man geht davon aus, dass die Streifen Raubtiere verwirren und Insektenstiche reduzieren.",
      triggerAfterAttempts: 9
    },
    {
      id: "zebra_h3",
      type: HintType.AUTO_FREE,
      content: "Sie leben in großen Herden in der Savanne und unternehmen lange Wanderungen.",
      triggerAfterAttempts: 12
    },
  ],
  contextualHints: [
    {
      id: "pferd",
      type: HintType.CONTEXTUAL,
      content: "Zu einfarbig! Der gesuchte ist für sein auffälliges Schwarz-Weiß-Muster bekannt.",
      title: "Zu zahm!",
      triggers: ["pferd"]
    },
    {
      id: "esel",
      type: HintType.CONTEXTUAL,
      content: "Dieser Verwandte ist meist grau und hat nur Streifen an den Beinen.",
      title: "Zu grau!",
      triggers: ["esel"]
    }
  ],
  customHints: [
    {
      id: "fell",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Wissenschaftlich gesehen sind sie wahrscheinlich schwarz mit weißen Streifen, nicht umgekehrt.",
    
    },
    {
      id: "ruf",
      type: HintType.CUSTOM,
      title: "Klang",
      content: "Anstatt zu wiehern, geben sie ein lautes, bellendes Geräusch von sich.",
    
    }
  ]
};

const tiereAfrikas: QuestionBase[] = [
  afrikanischer_elefant,
  flusspferd,
  gepard,
  giraffe,
  leopard,
  loewe,
  nashorn,
  zebra,
];

export const afrikaQuiz: Quiz = {
  id: "afrika",
  title: "Afrika",
  questions: tiereAfrikas,
  titleImage: require("./loewe.webp"),
  description: "Big Five. Die wilde Hitze der Savanne.",
};