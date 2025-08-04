import { HintType, type QuestionBase } from "@/src/quiz";


export const namibia: QuestionBase[] = [
	{
		id: 1,
		answer: "Leopard",
		title: "Ein sehr beliebtes Muster",
		funFact:
			"Leoparden Beute hochziehen können, die doppelt so schwer ist wie sie selbst - eine 90kg-Antilope 6 Meter hoch auf einen Baum!",
		images: {
			imageUrl: require("./img/leopard.jpg"),
			thumbnailUrl: require("./img/thumbnails/leopard.jpg"),
			unsolvedImageUrl: require("./img/leopard_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/leopard_unsolved.jpg"),
		},
		customHints: [
			{
				id: "habitat",
				type: HintType.CUSTOM,
				title: "Lebensraum",
				content: "Dieses Tier ist ein hervorragender Kletterer.",
				cost: 15,
			},
			{
				id: "color",
				type: HintType.CUSTOM,
				title: "Aussehen",
				content: "Hat ein goldgelbes Fell mit schwarzen Rosetten.",
				cost: 12,
			}
		],
		contextualHints: [{
			id: "jaguar",
			type: HintType.CONTEXTUAL,
			content: "Richtige Richtung! Aber lebt in Afrika, nicht Südamerika.",
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
				id: "tip_1",
				type: HintType.AUTO_FREE,
				content: "Diese gefleckte Großkatze ist fuer ihre Kletterfaehigkeiten bekannt.",
				triggerAfterAttempts: 2,
			}
		]

	},
	{
		id: 2,
		answer: "Flusspferd",
		title: "Schau mir ins Auge, kleines",
		alternativeAnswers: ["Nilpferd", "Hippopotamus"],
		funFact:
			"Flusspferde näher mit Walen  als mit anderen Landtieren verwandt sind - beide stammen von denselben urzeitlichen Meeresvorfahren ab.",
		images: {
			imageUrl: require("./img/nilpferd.jpg"),
			thumbnailUrl: require("./img/thumbnails/nilpferd.jpg"),
			unsolvedImageUrl: require("./img/nilpferd_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/nilpferd_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "fpferd",
				type: HintType.AUTO_FREE,
				content: "Ich bin ein großes Säugetier, das viel Zeit im Wasser verbringt...",
				triggerAfterAttempts: 2,
			}
		]
	},

	{
		id: 3,
		answer: "Flamingo",
		title: "Kein Stock.",
		funFact:
			"Flamingos werden nur durch bestimmte Algen und Krebstiere rosa - in Gefangenschaft verblassen sie ohne spezielle Nahrung wieder zu grau-weiß!",
		images: {
			imageUrl: require("./img/flamingo.jpg"),
			thumbnailUrl: require("./img/thumbnails/flamingo.jpg"),
			unsolvedImageUrl: require("./img/flamingo_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/flamingo_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "stelz",
				type: HintType.AUTO_FREE,
				content: "Ich bin ein Stelzvogel, bekannt für meine leuchtende Farbe und dass ich oft auf einem Bein stehe.",
				triggerAfterAttempts: 4
			}
		]
	},
	{
		id: 4,
		answer: "Löwe",
		title: "Erstmal strecken...",
		funFact:
			"Löwen die einzigen Katzen sind, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!",
		images: {
			imageUrl: require("./img/loewe.jpg"),
			thumbnailUrl: require("./img/thumbnails/loewe.jpg"),
			unsolvedImageUrl: require("./img/loewe_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/loewe_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "loew",
				type: HintType.AUTO_FREE,
				content: "Man nennt mich auch den König der Tiere.",
				triggerAfterAttempts: 4
			}
		]
	},
	{
		id: 5,
		answer: "Nashorn",
		title: "Ein Dickhäuter.",
		funFact:
			"Nashörner trotz ihrer massigen Erscheinung überraschend schlechte Augen haben, können aber dafür auf 50 km/h beschleunigen!",
		images: {
			imageUrl: require("./img/nashorn.jpg"),
			thumbnailUrl: require("./img/thumbnails/nashorn.jpg"),
			unsolvedImageUrl: require("./img/nashorn_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/nashorn_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "nashorn",
				type: HintType.AUTO_FREE,
				content: "Den Namensgebenden Teil meines Gesichts kann man nicht sehen.",
				triggerAfterAttempts: 6
			}
		]
	},
	{
		id: 6,
		answer: "Zebra",
		title: "Das ist leicht",
		funFact:
			"alle Zebras ein einzigartiges Streifenmuster haben - wie ein Fingerabdruck ist kein Zebra dem anderen gleich!",
		images: {
			imageUrl: require("./img/zebra.jpg"),
			thumbnailUrl: require("./img/thumbnails/zebra.jpg"),
			unsolvedImageUrl: require("./img/zebra_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/zebra_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "zebra",
				type: HintType.AUTO_FREE,
				content: "Ich bin mit Pferden verwandt.",
				triggerAfterAttempts: 6
			}
		]
	},
	{
		id: 7,
		answer: "Strauss",
		title: "Ein Vogel.",
		funFact:
			"Strauße nicht fliegen können, aber dafür mit bis zu 70 km/h rennen und dabei 4 Meter weite Schritte machen.",
		images: {
			imageUrl: require("./img/strauss.jpg"),
			thumbnailUrl: require("./img/thumbnails/strauss.jpg"),
			unsolvedImageUrl: require("./img/strauss_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/strauss_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "strauss",
				type: HintType.AUTO_FREE,
				content: "Nicht den Kopf in den Sand.",
				triggerAfterAttempts: 4
			}
		]
	},
	{
		id: 8,
		answer: "Elefant",
		title: "Nicht die Zebras im Hintergrund!",
		funFact:
			"Afrikanische Elefanten mit ihren Füßen Erdbeben spüren können, die hunderte Kilometer entfernt stattfinden - so kommunizieren Herden über weite Distanzen.",
		images: {
			imageUrl: require("./img/elefant.jpg"),
			thumbnailUrl: require("./img/thumbnails/elefant.jpg"),
			unsolvedImageUrl: require("./img/elefant_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/elefant_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "elefant",
				type: HintType.AUTO_FREE,
				content: "Tööörööö",
				triggerAfterAttempts: 3
			}
		]

	},
	{
		id: 9,
		answer: "Kap-Borstenhörnchen",
		title: "Wer könnte ich sein.",
		alternativeAnswers: ["Borstenhörnchen"],
		funFact:
			"Kap-Borstenhörnchen mit ihrem buschigen Schwanz wie mit einem Sonnenschirm wedeln, um sich vor der afrikanischen Hitze zu schützen!",
		images: {
			imageUrl: require("./img/kap-borstenhoernchen.jpg"),
			thumbnailUrl: require("./img/thumbnails/kap-borstenhoernchen.jpg"),
			unsolvedImageUrl: require("./img/kap-borstenhoernchen_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/kap-borstenhoernchen_unsolved.jpg"),
		},
		contextualHints: [
			{
				id: "erdmaennchen",
				type: HintType.CONTEXTUAL,
				title: "Könnte man meinen",
				content: "Die gesuchten Tieren bilden sogar manchmal WGs mit Erdmännchen.",
				triggers: ["Erdmännchen"]
			},
			{
				id: "hoernchen",
				type: HintType.CONTEXTUAL,
				title: "Fast...",
				content: "Hönrchen ist schonmal nicht schlecht.",
				triggers: ["Eichhörnchen", "Streifenhörnchen", "Hörnchen"]
			}
		]
	},
	{
		id: 10,
		answer: "Giraffe",
		title: "Hallo da unten",
		funFact:
			"Giraffen nur 7 Halswirbel haben - genau so viele wie Menschen, obwohl ihr Hals 2 Meter lang ist!",
		images: {
			imageUrl: require("./img/giraffe.jpg"),
			thumbnailUrl: require("./img/thumbnails/giraffe.jpg"),
			unsolvedImageUrl: require("./img/giraffe_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/giraffe_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "giraffe",
				type: HintType.AUTO_FREE,
				content: "Schwer zu erkennen. Aber versuch mal das Muster zu erkennen.",
				triggerAfterAttempts: 3
			},
			{
				id: "giraffe2",
				type: HintType.AUTO_FREE,
				content: "Die Zunge des gesuchten Tieres kann 45-50 Zentimeter lang werden und ist oft bläulich-violett gefärbt.",
				triggerAfterAttempts: 6
			},
		]
	},
	{
		id: 11,
		answer: "Warzenschwein",
		title: "Hakuna Matata!",
		funFact:
			"Warzenschweine bei Gefahr rückwärts in ihre Höhlen laufen, um mit den scharfen Hauern voran jeden Angreifer abzuwehren.",
		images: {
			imageUrl: require("./img/warzenschwein.jpg"),
			thumbnailUrl: require("./img/thumbnails/warzenschwein.jpg"),
			unsolvedImageUrl: require("./img/warzenschwein_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/warzenschwein_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "warzenschwein",
				type: HintType.AUTO_FREE,
				content: "Nicht Timon!",
				triggerAfterAttempts: 3
			}
		]
	},
	{
		id: 12,
		answer: "Gelbschnabeltoko",
		title: "Nashornvogel.",
		funFact:
			"der Gelbschnabeltoko eine clevere Partnerschaft mit Zwergmangusten eingeht? Der Vogel warnt die Mangusten vor Gefahren, während diese bei der Jagd Insekten und Beute für ihn aufscheuchen. Eine echte Teamarbeit in der Wildnis!",
		images: {
			imageUrl: require("./img/gelbschnabeltoko.jpg"),
			thumbnailUrl: require("./img/thumbnails/gelbschnabeltoko.jpg"),
			unsolvedImageUrl: require("./img/gelbschnabeltoko_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/gelbschnabeltoko_unsolved.jpg"),
		},
		autoFreeHints: [
			{
				id: "gelbschnabeltoko",
				type: HintType.AUTO_FREE,
				content: "Denk mal an die Farbe des Schnabels.",
				triggerAfterAttempts: 4
			},
			{
				id: "gelbschnabeltoko2",
				type: HintType.AUTO_FREE,
				content: "Sein Name verrät schon einiges über sein markantestes Merkmal.",
				triggerAfterAttempts: 7
			},
		]
	},
];
