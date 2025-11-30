import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const stachelschwein: QuestionBase = {
	id: 1,
	answer: "Stachelschwein",
	funFact:
		"...Stachelschweine, wenn sie sich bedroht fühlen, ihre Stacheln aufstellen und mit ihnen rasselnde Geräusche erzeugen können, indem sie spezielle, hohle Rasselstacheln am Schwanz vibrieren lassen, um Fressfeinde abzuschrecken?",
	title: "Nicht anfassen.",
	images: {
		imageUrl: require("./stachelschwein.webp"),
	},
	wikipediaName: "Stachelschweine",
	contextualHints: [
		{
			id: "igel",
			triggers: ["igel"],
			content: "Fast...",
			title: "Die Richtung stimmt",
			type: HintType.CONTEXTUAL,
		},
	],
};

// const kaiserpinguin: QuestionBase = {
//  id: 2,
//  answer: "Kaiserpinguin",
//  funFact: "Kaiserpinguine bis zu 20 Minuten lang unter Wasser bleiben und dabei Tiefen von über 500 Metern erreichen können, um Nahrung zu jagen? Das macht sie zu wahren Tauchmeistern unter den Vögeln!",
//  title: "Royal",
//  images: {
//    imageUrl: require("./kaiserpinguin.webp"),
//  },
//  contextualHints: [
//    {
//      id: "pinguin",
//      triggers: ["pinguin"],
//      content: "Etwas genauer wird gesucht.",
//      title: "Nicht falsch",
//      type: HintType.CONTEXTUAL
//    },
//    {
//      id: "koeningspinguin",
//      triggers: ["königspinguin", "königs-pinguin"],
//      content: "Schon royal. Aber irgendwie ... mehr",
//      title: "Ganz kanpp...",
//      type: HintType.CONTEXTUAL
//    },
//  ]
// };

const klapperschlange: QuestionBase = {
	id: 3,
	title: "Giftig",
	answer: "Klapperschlange",
	funFact:
		"...das charakteristische Rasseln einer Klapperschlange nicht durch das Schütteln des Schwanzes selbst, sondern durch trockene, hohle Hornringe am Schwanzende erzeugt wird und man ihr Alter nicht einfach an der Anzahl der Ringe ablesen kann, weil alte Ringe abbrechen können?",
	images: {
		imageUrl: require("./klapperschlange.webp"),
	},
	wikipediaName: "Klapperschlangen",
};

const buntspecht: QuestionBase = {
	id: 4,
	answer: "Buntspecht",
	title: "Klopf, klopf.",
	funFact:
		"...Buntspechte bis zu 12.000 Mal pro Tag mit dem Kopf gegen Baumstämme hämmern können, ohne dabei Gehirnerschütterungen zu bekommen, weil ihr Schädel speziell gebaut ist, um diese enormen Kräfte abzufedern?",
	alternativeAnswers: ["Specht"],
	images: {
		imageUrl: require("./buntspecht.webp"),
	},
};

const narwal: QuestionBase = {
	id: 5,
	answer: "Narwal",
	title: "Meersebewohner",
	funFact:
		'...der charakteristische "Stoßzahn" des Narwals eigentlich ein extrem langer, aus dem Kiefer herauswachsender Zahn ist, der bis zu 3 Meter lang werden kann und als hochsensibles Organ zur Orientierung und Nahrungssuche dient?',
	images: {
		imageUrl: require("./narwal.webp"),
	},
	contextualHints: [
		{
			id: "igel",
			triggers: ["igel"],
			content: "Aber auch ein Säugetier",
			title: "Leider nicht.",
			type: HintType.CONTEXTUAL,
		},
	],
	autoFreeHints: [
		{
			id: "fisch",
			content: "KEIN Fisch",
			type: HintType.AUTO_FREE,
			triggerAfterAttempts: 5,
		},
	],
};

const zitteraal: QuestionBase = {
	id: 6,
	answer: "Zitteraal",
	title: "Erdung ist wichtig.",
	funFact:
		"...der Zitteraal elektrische Schläge von bis zu 600 Volt und 1 Ampere erzeugen kann, was ausreicht, um ein Pferd bewusstlos zu machen oder einen Menschen zu betäuben, und er dies zur Verteidigung sowie zur Jagd nutzt, indem er Beute lähmt?",
	images: {
		imageUrl: require("./zitteraal.webp"),
	},
	wikipediaName: "Zitteraale",
	autoFreeHints: [
		{
			id: "fisch",
			content: "KEIN Fisch",
			title: "Kleiner Tipp",
			type: HintType.AUTO_FREE,
			triggerAfterAttempts: 3,
		},
		{
			id: "fisch",
			content:
				"Der Wurm soll an ein Hinweise für die Körperform des gesuchten Tieres sein.",
			title: "Ok, noch ein Tipp.",
			type: HintType.AUTO_FREE,
			triggerAfterAttempts: 5,
		},
	],
};

const wuestenrennmaus: QuestionBase = {
	id: 7,
	title: '"Arschschnell!"',
	answer: "Wüstenrennmaus",

	funFact:
		"...Wüstenrennmäuse ihren Wasserbedarf fast ausschließlich über die Nahrung decken und kaum trinken müssen, da sie perfekt an das Leben in trockenen Gebieten angepasst sind und extrem wenig Urin produzieren, um Wasser zu sparen?",
	images: {
		imageUrl: require("./wuestenrennmaus.webp"),
	},
	wikipediaName: "Rennmäuse",
	contextualHints: [
		{
			id: "rennmaus",
			triggers: ["rennmaus"],
			content: "Aber WO rennt sie?",
			title: "Gleich gelöst.",
			type: HintType.CONTEXTUAL,
		},
		{
			id: "maus",
			triggers: ["maus"],
			content: "WO und WIE?",
			title: "Nicht falsch,",
			type: HintType.CONTEXTUAL,
		},
	],
};

const okapi: QuestionBase = {
	id: 8,
	title: "Regenwaldbewohner:in",
	answer: "Okapi",
	funFact:
		"...die Zunge eines Okapis so lang ist (bis zu 30 Zentimeter), dass es sich damit sogar die Ohren putzen kann und diese perfekt dafür geeignet ist, Blätter und Knospen von Bäumen zu zupfen?",
	alternativeAnswers: ["Waldgiraffe", "Kurzhalsgiraffe"],
	images: {
		imageUrl: require("./okapi.webp"),
	},
};

const beutelteufel: QuestionBase = {
	id: 9,
	answer: "Beutelteufel",
	title: "Taz",
	funFact:
		"...der Beutelteufel ein so starkes Gebiss hat, dass er Knochen mit Leichtigkeit zermahlen kann und er im Verhältnis zu seiner Körpergröße sogar die stärkste Beißkraft aller Säugetiere besitzt?",
	alternativeAnswers: ["Tasmanischer Teufel"],
	images: {
		imageUrl: require("./tasmanischer-teufel.webp"),
	},
};

const emojiAnimals: QuestionBase[] = [
	klapperschlange,
	stachelschwein,
	buntspecht,
	narwal,
	zitteraal,
	wuestenrennmaus,
	okapi,
	beutelteufel,
];

export const emojiAnimalsQuiz: Quiz = {
	id: "emojis",
	title: "Emojis",
	questions: emojiAnimals,
	titleImage: require("./emoji_title.png"),
	description: "Ein Tier, mehrere Emojis.",
};
