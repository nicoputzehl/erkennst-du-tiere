import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const triceratops: QuestionBase = {
  id: 1,
  answer: "Triceratops",
  title: "Uhrzeit Nashorn",
  images: {
    imageUrl: require("./triceratops.webp"),
  },
  funFact: "...der Schädel eines ausgewachsenen Triceratops einer der größten aller Landtiere ist, die jemals gelebt haben, und bis zu 2,5 Meter lang werden konnte?",
  autoFreeHints: [
    {
      id: "triceratops_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Name bedeutet \"Dreihorngesicht\".",
      triggerAfterAttempts: 3
    },
    {
      id: "triceratops_h2",
      type: HintType.AUTO_FREE,
      content: "Dieses Tier hatte einen riesigen Knochenschild am Nacken, der bis zu 2,5 Meter lang werden konnte.",
      triggerAfterAttempts: 6
    },
    {
      id: "triceratops_h3",
      type: HintType.AUTO_FREE,
      content: "Es lebte in der späten Kreidezeit in Nordamerika und war ein Zeitgenosse des Tyrannosaurus Rex.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "protoceratops",
      type: HintType.CONTEXTUAL,
      content: "Ein entfernter Verwandter ohne die markanten langen Hörner. Der gesuchte war viel größer!",
      title: "Fast! Aber nicht \"der Erste\"",
      triggers: ["protoceratops"]
    },
    {
      id: "torosaurus",
      type: HintType.CONTEXTUAL,
      content: "Dieser Dino hatte Löcher im Nackenschild (Parietalfenster). Der gesuchte hatte einen soliden Schild.",
      title: "Verdammt nah!",
      triggers: ["torosaurus"]
    },
    {
      id: "styracosaurus",
      type: HintType.CONTEXTUAL,
      content: "Falsche Unterfamilie (Centrosaurinae). Dieser hatte eine markante \"Dornenkrone\" am Nackenschild.",
      title: "Falsche \"Horngesichter\"-Familie!",
      triggers: ["styracosaurus"]
    }
  ],
  customHints: [
    {
      id: "panzer",
      type: HintType.CUSTOM,
      title: "Verteidigung",
      content: "Es besitzt einen großen knöchernen Nackenschild (Halskrause) und drei Hörner im Gesicht, die zur Verteidigung dienten.",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Dieses Tier war ein Pflanzenfresser und nutzte einen scharfen Schnabel, um Blätter und Zweige abzuschneiden.",
      cost: 1,
    },
    {
      id: "name",
      type: HintType.CUSTOM,
      title: "Name",
      content: "Sein Name bedeutet wörtlich \"Dreihorn-Gesicht\".",
      cost: 1,
    },
    {
      id: "gruppe",
      type: HintType.CUSTOM,
      title: "Gruppe",
      content: "Es gehört zur Gruppe der Ceratopsidae, den \"Horngesichtern\".",
      cost: 1,
    }
  ]
};

const brachiosaurus: QuestionBase = {
  id: 2,
  answer: "Brachiosaurus",
  title: "Längster Hals",
  images: {
    imageUrl: require("./brachiosaurus.webp"),
  },
  alternativeAnswers: ["Armechse"],
  funFact: "...der Brachiosaurus aufgrund seines langen Halses und der Distanz zum Gehirn ein riesiges Herz (geschätzt bis zu 400 kg) besitzen musste, um das Blut zum Kopf pumpen zu können?",
  autoFreeHints: [
    {
      id: "brachiosaurus_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Name bedeutet \"Armechse\" und bezieht sich auf die Tatsache, dass seine Vorderbeine länger als seine Hinterbeine waren.",
      triggerAfterAttempts: 3
    },
    {
      id: "brachiosaurus_h2",
      type: HintType.AUTO_FREE,
      content: "Er lebte im Oberjura und war einer der größten landlebenden Tiere aller Zeiten.",
      triggerAfterAttempts: 6
    },
    {
      id: "brachiosaurus_h3",
      type: HintType.AUTO_FREE,
      content: "Er hatte einen sehr langen Hals und fraß Blätter von hohen Baumkronen – er wird oft mit einer Giraffe verglichen.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "diplodocus",
      type: HintType.CONTEXTUAL,
      content: "Dieser Dino hatte zwar auch einen langen Hals, aber der gesuchte hatte eine viel längere Schnauze und kürzere Vorderbeine.",
      title: "Nicht der Peitschenschwanz!",
      triggers: ["diplodocus"]
    },
    {
      id: "apatosaurus",
      type: HintType.CONTEXTUAL,
      content: "Enger Verwandter, aber die Vorder- und Hinterbeine waren fast gleich lang – der gesuchte war vorne deutlich höher.",
      title: "Der \"Donnerechse\" zu ähnlich!",
      triggers: ["apatosaurus", "brontosaurus"]
    },
    {
      id: "giraffatitan",
      type: HintType.CONTEXTUAL,
      content: "Sehr ähnliche Gattung, wurde früher fälschlicherweise als eine Art des Brachiosaurus angesehen. Heute als eigenständig betrachtet.",
      title: "Zu afrikanisch!",
      triggers: ["giraffatitan"]
    }
  ],
  customHints: [
    {
      id: "groesse",
      type: HintType.CUSTOM,
      title: "Größe",
      content: "Es war eines der größten und schwersten Tiere, die jemals auf der Erde gelebt haben, bekannt für seinen extrem langen Hals.",
      cost: 1,
    },
    {
      id: "arme",
      type: HintType.CUSTOM,
      title: "Name",
      content: "Sein Name bedeutet wörtlich \"Armechse\", da seine Vorderbeine deutlich länger als seine Hinterbeine waren, was ihm ein elefantenartiges, aber hohes Erscheinungsbild gab.",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Als Pflanzenfresser nutzte es seine enorme Höhe, um Blätter von den Spitzen hoher Bäume zu fressen.",
      cost: 1,
    },
    {
      id: "kopf",
      type: HintType.CUSTOM,
      title: "Kopfform",
      content: "Es besaß eine kuppelförmige Erhöhung auf dem Kopf, in der sich seine Nasenlöcher befanden.",
      cost: 1,
    }
  ]
};

const stegosaurus: QuestionBase = {
  id: 3,
  answer: "Stegosaurus",
  title: "Plattenechse",
  images: {
    imageUrl: require("./stegosaurus.webp"),
  },
  alternativeAnswers: ["Plattenechse"],
  funFact: "...der Stegosaurus trotz seiner enormen Größe (bis zu 9 Meter lang) eines der kleinsten Gehirne aller Dinosaurier besaß – nicht größer als eine Walnuss?",
  autoFreeHints: [
    {
      id: "stegosaurus_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist bekannt für seine großen, knöchernen Platten, die entlang seines Rückens in zwei Reihen verliefen.",
      triggerAfterAttempts: 3
    },
    {
      id: "stegosaurus_h2",
      type: HintType.AUTO_FREE,
      content: "Dieser Dino lebte im Oberjura und seine Vorderbeine waren deutlich kürzer als seine Hinterbeine.",
      triggerAfterAttempts: 6
    },
    {
      id: "stegosaurus_h3",
      type: HintType.AUTO_FREE,
      content: "Seine Hauptverteidigungswaffe war ein Schwanz mit vier langen, spitzen Stacheln, bekannt als \"Thagomizer\".",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "kentrosaurus",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Plattenechsen-Dino (Stegosaurier), aber viel kleiner und hatte die Stacheln fast über den gesamten Rücken und Schwanz verteilt.",
      title: "Der \"kleine Bruder\"!",
      triggers: ["kentrosaurus"]
    },
    {
      id: "ankylosaurus",
      type: HintType.CONTEXTUAL,
      content: "Falsche Gruppe! Dieser Dino war wie ein Panzer, aber hatte keine Platten auf dem Rücken, sondern eine große knöcherne Keule am Schwanzende.",
      title: "Der Panzerknacker!",
      triggers: ["ankylosaurus"]
    },
    {
      id: "hylaeosaurus",
      type: HintType.CONTEXTUAL,
      content: "Einer der ersten beschriebenen Dinos (ein früher Ankylosaurier), aber er hatte keine Platten und lebte in der Kreidezeit.",
      title: "Falsche Erdära!",
      triggers: ["hylaeosaurus"]
    }
  ],
  customHints: [
    {
      id: "platten",
      type: HintType.CUSTOM,
      title: "Rücken",
      content: "Sein auffälligstes Merkmal sind die zwei Reihen großer, knöcherner Platten, die entlang seines Rückens bis zum Schwanz verlaufen.",
      cost: 1,
    },
    {
      id: "schwanz",
      type: HintType.CUSTOM,
      title: "Verteidigung",
      content: "Er hatte vier lange, scharfe Stacheln am Ende seines Schwanzes, die als \"Thagomizer\" bekannt sind und zur Abwehr von Raubtieren dienten.",
      cost: 1,
    },
    {
      id: "gehirn",
      type: HintType.CUSTOM,
      title: "Gehirn",
      content: "Im Verhältnis zu seiner Körpergröße hatte er eines der kleinsten Gehirne aller Dinosaurier.",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Dieses Tier war ein langsamer, bodennah fressender Pflanzenfresser, der kleine Steine (Gastrolithen) schluckte, um die Nahrung im Magen zu zermahlen.",
      cost: 1,
    }
  ]
};

const velociraptor: QuestionBase = {
  id: 4,
  answer: "Velociraptor",
  title: "Der flinke Jäger",
  images: {
    imageUrl: require("./velociraptor.webp"),
  },
  alternativeAnswers: ["Dachechse", "Raptor"],
  funFact: "...der Velociraptor entgegen der Darstellung in Filmen tatsächlich nur etwa so groß wie ein Truthahn war und sein Körper mit Federn bedeckt war?",
  autoFreeHints: [
    {
      id: "velociraptor_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Name bedeutet \"schneller Räuber\".",
      triggerAfterAttempts: 3
    },
    {
      id: "velociraptor_h2",
      type: HintType.AUTO_FREE,
      content: "Er besaß eine charakteristische, große, sichelförmige Kralle an jeder seiner Hinterfüße, die als Waffe diente.",
      triggerAfterAttempts: 6
    },
    {
      id: "velociraptor_h3",
      type: HintType.AUTO_FREE,
      content: "Er lebte in der späten Kreidezeit und seine Fossilien wurden hauptsächlich in der Mongolei gefunden.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "deinonychus",
      type: HintType.CONTEXTUAL,
      content: "Dieser Verwandte sieht sehr ähnlich aus, aber war deutlich größer und ist der wahrscheinliche Vorlage für die Film-Raptoren.",
      title: "Verwechslungsgefahr!",
      triggers: ["deinonychus"]
    },
    {
      id: "utahraptor",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist zu klein! Dieser hatte die größte Sichelkralle aller Dromaeosaurier und war fast so groß wie ein Auto.",
      title: "Viel zu groß!",
      triggers: ["utahraptor"]
    },
    {
      id: "gallimimus",
      type: HintType.CONTEXTUAL,
      content: "Auch ein schneller, zweibeiniger Dino, aber er hatte keine Krallen und war ein Pflanzenfresser.",
      title: "Kein Räuber!",
      triggers: ["gallimimus"]
    }
  ],
  customHints: [
    {
      id: "klaue",
      type: HintType.CUSTOM,
      title: "Waffe",
      content: "Er besaß eine große, sichelförmige Kralle an jedem Hinterfuß, die er zum Aufschlitzen seiner Beute nutzte.",
      cost: 1,
    },
    {
      id: "name",
      type: HintType.CUSTOM,
      title: "Name",
      content: "Sein Name bedeutet auf Lateinisch \"schneller Räuber\" oder \"flinker Dieb\".",
      cost: 1,
    },
    {
      id: "federn",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Fossilien belegen, dass er – wie viele seiner Verwandten – Federn besaß, obwohl er nicht fliegen konnte.",
      cost: 1,
    },
    {
      id: "jagdt",
      type: HintType.CUSTOM,
      title: "Jagdverhalten",
      content: "Es wird angenommen, dass er ein intelligenter Jäger war, der wahrscheinlich in koordinierten Rudeln jagte.",
      cost: 1,
    }
  ]
};

const tyrannosaurus: QuestionBase = {
  id: 5,
  answer: "Tyrannosaurus",
  title: "König der Echsen",
  images: {
    imageUrl: require("./tyrannosaurus.webp"),
  },
  alternativeAnswers: ["T-Rex", "Tyrannosaurus Rex"],
  funFact: "...der T-Rex den stärksten Biss aller Landtiere hatte, der so kräftig war, dass er die Knochen seiner Beute zertrümmern konnte?",
  autoFreeHints: [
    {
      id: "tyrannosaurus_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Name bedeutet \"König der Tyrannenechsen\".",
      triggerAfterAttempts: 3
    },
    {
      id: "tyrannosaurus_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist berühmt für seine winzigen Vorderarme mit nur zwei Fingern, deren Funktion bis heute Rätsel aufgibt.",
      triggerAfterAttempts: 6
    },
    {
      id: "tyrannosaurus_h3",
      type: HintType.AUTO_FREE,
      content: "Er zählt zu den letzten und größten fleischfressenden Dinosauriern und starb am Ende der Kreidezeit aus.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "allosaurus",
      type: HintType.CONTEXTUAL,
      content: "Ein großer Raubsaurier, aber er lebte viel früher (im Jura) und hatte drei Finger an den Vorderarmen.",
      title: "Falsche Ära!",
      triggers: ["allosaurus"]
    },
    {
      id: "giganotosaurus",
      type: HintType.CONTEXTUAL,
      content: "Ein Rivale in der Größe, aber dieser lebte in Südamerika. Der gesuchte war auf Nordamerika beschränkt.",
      title: "Falscher Kontinent!",
      triggers: ["giganotosaurus"]
    },
    {
      id: "carnotaurus",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Raubsaurier, aber dieser ist durch die zwei Hörner über den Augen leicht zu erkennen.",
      title: "Zu viele Hörner!",
      triggers: ["carnotaurus"]
    }
  ],
  customHints: [
    {
      id: "name",
      type: HintType.CUSTOM,
      title: "Name",
      content: "Sein Name bedeutet \"König der Tyrannen-Echsen\".",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Es war der Spitzenprädator seiner Zeit, mit Zähnen, die darauf ausgelegt waren, Knochen zu zermahlen, was ihm den Ruf als \"König der Raubtiere\" einbrachte.",
      cost: 1,
    },
    {
      id: "arme",
      type: HintType.CUSTOM,
      title: "Körperteile",
      content: "Er hatte im Verhältnis zum Körper extrem kleine, aber muskulöse Vorderarme mit nur zwei Fingern.",
      cost: 1,
    },
    {
      id: "sinne",
      type: HintType.CUSTOM,
      title: "Sinne",
      content: "Er hatte einen ausgezeichneten Geruchssinn und ein sehr gutes räumliches Sehvermögen (binokulares Sehen), das dem eines modernen Adlers ähnelte.",
      cost: 1,
    }
  ]
};

const parasaurolophus: QuestionBase = {
  id: 6,
  answer: "Parasaurolophus",
  title: "Der Trompeter",
  images: {
    imageUrl: require("./parasaurolophus.webp"),
  },
  alternativeAnswers: ["Entenschnabel-Dinosaurier"],
  funFact: "...sein langer, röhrenförmiger Knochenkamm auf dem Kopf wahrscheinlich als Resonanzkörper diente, um laute, tiefe Töne zur Kommunikation zu erzeugen?",
  autoFreeHints: [
    {
      id: "parasaurolophus_h1",
      type: HintType.AUTO_FREE,
      content: "Er gehört zu den Hadrosauriern, oft als \"Entenschnabel-Dinosaurier\" bezeichnet.",
      triggerAfterAttempts: 3
    },
    {
      id: "parasaurolophus_h2",
      type: HintType.AUTO_FREE,
      content: "Sein auffälligstes Merkmal ist ein langer, nach hinten gerichteter Knochenkamm am Schädel.",
      triggerAfterAttempts: 6
    },
    {
      id: "parasaurolophus_h3",
      type: HintType.AUTO_FREE,
      content: "Er konnte sich wahrscheinlich sowohl auf zwei als auch auf vier Beinen fortbewegen (fakultativ biped).",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "corythosaurus",
      type: HintType.CONTEXTUAL,
      content: "Ein Hadrosaurier-Verwandter, dessen Kamm wie ein Helm oder ein Fächer geformt war, nicht wie eine lange Röhre.",
      title: "Falscher Kamm!",
      triggers: ["corythosaurus"]
    },
    {
      id: "edmontosaurus",
      type: HintType.CONTEXTUAL,
      content: "Auch ein Hadrosaurier, aber dieser hatte keinen Knochenkamm auf dem Kopf.",
      title: "Zu flacher Kopf!",
      triggers: ["edmontosaurus"]
    },
    {
      id: "lambeosaurus",
      type: HintType.CONTEXTUAL,
      content: "Dieser Hadrosaurier hat einen Kamm, der einer Axt oder einem Hut ähnelt, mit einem zusätzlichen Dorn hinten.",
      title: "Falsche Hutform!",
      triggers: ["lambeosaurus"]
    }
  ],
  customHints: [
    {
      id: "kamm",
      type: HintType.CUSTOM,
      title: "Kopf",
      content: "Sein auffälligstes Merkmal ist der lange, nach hinten ragende, hohle Knochenkamm auf seinem Kopf, der bis zu 1,8 Meter lang werden konnte.",
      cost: 1,
    },
    {
      id: "stimme",
      type: HintType.CUSTOM,
      title: "Geräusche",
      content: "Der Knochenkamm diente als Resonanzkörper, wodurch er tiefe, laute Geräusche erzeugen konnte, um Artgenossen zu rufen oder zu warnen.",
      cost: 1,
    },
    {
      id: "haltung",
      type: HintType.CUSTOM,
      title: "Fortbewegung",
      content: "Er war ein Hadrosaurier, der sich wahrscheinlich die meiste Zeit vierbeinig fortbewegte, aber auch auf zwei Beinen laufen konnte.",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Dieses Tier war ein Pflanzenfresser und besaß hunderte von Zähnen in seinem Kiefer, die als \"Zahnbatterie\" bekannt sind und ihm halfen, zähe Pflanzen zu zermahlen.",
      cost: 1,
    }
  ]
};

const pteosaurus: QuestionBase = {
  id: 7,
  answer: "Pteranodon",
  title: "Der zahnlose Flieger",
  images: {
    imageUrl: require("./pteranodon.webp"),
  },
  alternativeAnswers: ["Flugsaurier", "Pterodactylus"],
  funFact: "...Pterosaurier, obwohl sie oft als \"Flugsaurier\" bezeichnet werden, \"keine\" Dinosaurier waren, sondern zu einer eigenen Gruppe fliegender Reptilien gehörten?",
  autoFreeHints: [
    {
      id: "pteranodon_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser Flieger hatte keine Zähne und einen langen, knöchernen Kamm, der nach hinten ragte.",
      triggerAfterAttempts: 3
    },
    {
      id: "pteranodon_h2",
      type: HintType.AUTO_FREE,
      content: "Er konnte Spannweiten von bis zu 7 Metern erreichen und lebte in der Kreidezeit über dem Meer.",
      triggerAfterAttempts: 6
    },
    {
      id: "pteranodon_h3",
      type: HintType.AUTO_FREE,
      content: "Er gehörte zur Gruppe der Pterosaurier und benutzte seine Flügel, die von einem einzigen langen Finger getragen wurden, zum Gleiten über dem Wasser.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "pterodactylus",
      type: HintType.CONTEXTUAL,
      content: "Ein kleinerer Flugsaurier aus dem Jura. Der gesuchte lebte viel später und war viel größer.",
      title: "Zu klein und zu früh!",
      triggers: ["pterodactylus"]
    },
    {
      id: "quetzalcoatlus",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist nicht der Größte! Dieser war der größte bekannte Flieger aller Zeiten mit einer Spannweite wie ein Kleinbus.",
      title: "Der größte Gigant!",
      triggers: ["quetzalcoatlus"]
    },
    {
      id: "rhamphorhynchus",
      type: HintType.CONTEXTUAL,
      content: "Dieser frühe Flieger hatte Zähne und einen langen Schwanz mit einer rautenförmigen Flosse am Ende.",
      title: "Der mit dem Schwanzende!",
      triggers: ["rhamphorhynchus"]
    }
  ],
  customHints: [
    {
      id: "fluegel",
      type: HintType.CUSTOM,
      title: "Flügel",
      content: "Es war eines der größten Flugtiere aller Zeiten mit einer Flügelspannweite von über sieben Metern.",
      cost: 1,
    },
    {
      id: "name",
      type: HintType.CUSTOM,
      title: "Name",
      content: "Sein Name bedeutet \"Zahnloser Flügel\" und weist darauf hin, dass es keinen einzigen Zahn im Kiefer besaß.",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Nahrung",
      content: "Es lebte in Küstennähe und ernährte sich hauptsächlich von Fisch, den es aus dem Meer fing.",
      cost: 1,
    },
    {
      id: "kamm",
      type: HintType.CUSTOM,
      title: "Kopf",
      content: "Es besaß einen langen, spitzen Kamm auf der Rückseite des Kopfes, der wahrscheinlich der aerodynamischen Steuerung oder der sexuellen Zurschaustellung diente.",
      cost: 1,
    }
  ]
};

const ichthyosaurus: QuestionBase = {
  id: 8,
  answer: "Ichthyosaurus",
  title: "Die Fisch-Echse",
  images: {
    imageUrl: require("./ichthyosaurus.webp"),
  },
  alternativeAnswers: ["Fisch-Echse"],
  funFact: "...diese im Wasser lebenden Reptilien zum Atmen an die Oberfläche kommen mussten und man annimmt, dass sie ihre Jungen lebend zur Welt brachten?",
  autoFreeHints: [
    {
      id: "ichthyosaurus_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Name bedeutet \"Fisch-Echse\".",
      triggerAfterAttempts: 3
    },
    {
      id: "ichthyosaurus_h2",
      type: HintType.AUTO_FREE,
      content: "Er war ein Meeresreptil mit einem stromlinienförmigen Körper, der Delfinen ähnelte, und großen Augen.",
      triggerAfterAttempts: 6
    },
    {
      id: "ichthyosaurus_h3",
      type: HintType.AUTO_FREE,
      content: "Er lebte im Jura und war nicht nur ein guter Schwimmer, sondern auch einer der ersten Meeresreptilien, der entdeckt und beschrieben wurde.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "plesiosaurus",
      type: HintType.CONTEXTUAL,
      content: "Falsche Körperform! Dieser hatte einen sehr langen Hals und vier paddelförmige Flossen.",
      title: "Der \"Lange Hals\"!",
      triggers: ["plesiosaurus"]
    },
    {
      id: "mosasaurus",
      type: HintType.CONTEXTUAL,
      content: "Viel größer und lebte später (Kreidezeit). Dieser sah eher aus wie eine riesige Eidechse mit Flossen.",
      title: "Der späte Gigant!",
      triggers: ["mosasaurus"]
    },
    {
      id: "shonisaurus",
      type: HintType.CONTEXTUAL,
      content: "Das größte bekannte Ichthyosaurier-Exemplar, aber nicht die berühmteste Gattung. Der gesuchte war kleiner.",
      title: "Nicht ganz so groß!",
      triggers: ["shonisaurus"]
    }
  ],
  customHints: [
    {
      id: "name",
      type: HintType.CUSTOM,
      title: "Name",
      content: "Sein Name bedeutet wörtlich \"Fischechse\", da sein stromlinienförmiger Körperbau dem eines modernen Delphins ähnelte.",
      cost: 1,
    },
    {
      id: "flossen",
      type: HintType.CUSTOM,
      title: "Körperbau",
      content: "Es besaß vier paddelartige Flossen und eine halbmondförmige Schwanzflosse, die ihm zu hohen Geschwindigkeiten verhalf.",
      cost: 1,
    },
    {
      id: "geburt",
      type: HintType.CUSTOM,
      title: "Nachwuchs",
      content: "Fossilien belegen, dass dieses Reptil seine Jungen nicht an Land legte, sondern lebend im Wasser gebar.",
      cost: 1,
    },
    {
      id: "augen",
      type: HintType.CUSTOM,
      title: "Sehsinn",
      content: "Es hatte extrem große Augen, geschützt durch knöcherne Ringe (sklerotische Ringe), was auf Jagd in der Tiefe hindeutet.",
      cost: 1,
    }
  ]
};

const dinosaurier: QuestionBase[] = [
  triceratops,
  brachiosaurus,
  stegosaurus,
  velociraptor,
  tyrannosaurus,
  parasaurolophus,
  pteosaurus,
  ichthyosaurus,
];

export const dinosaurierQuiz: Quiz = {
  id: "dinosaurier",
  title: "Dinosaurier",
  questions: dinosaurier,
  titleImage: require("./tyrannosaurus.webp"),
  description: "Teste dein Wissen über die Giganten der Urzeit.",
};