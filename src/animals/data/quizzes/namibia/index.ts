import type { QuestionBase } from "@/src/quiz";
import {
	createAutoFreeHint,
	createContextualHint,
	createCustomHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "@/src/quiz/domain/hints/factories";

export const namibia: QuestionBase[] = [
	{
		id: 1,
		answer: "Leopard",
		funFact:
			"Leoparden können Beute hochziehen, die doppelt so schwer ist wie sie selbst - eine 90kg-Antilope 6 Meter hoch auf einen Baum!",
		images: {
			imageUrl: require("./img/leopard.jpg"),
			thumbnailUrl: require("./img/thumbnails/leopard.jpg"),
			unsolvedImageUrl: require("./img/leopard_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/leopard_unsolved.jpg"),
		},
		hints: [
			// Basic Hints (immer verfügbar)
			createLetterCountHint(1), // 5 Punkte
			createFirstLetterHint(1), // 10 Punkte

			// Custom Hints (verschiedene Schwierigkeiten)
			createCustomHint(
				1,
				"Lebensraum",
				"Dieses Tier ist ein hervorragender Kletterer.",
				15,
			),
			createCustomHint(
				1,
				"Aussehen",
				"Hat ein goldgelbes Fell mit schwarzen Rosetten.",
				12,
			),

			// Contextual Hints (kostenlos bei Verwechslungen) - FIXED
			createContextualHint(
				1,
				["jaguar"],
				"Richtige Richtung! Aber lebt in Afrika, nicht Südamerika.",
			),
			createContextualHint(
				1,
				["gepard", "cheetah"],
				"Auch gefleckt, aber diese Katze kann sehr gut klettern!",
				"Nicht ganz so schnell!"
			),
			createContextualHint(
				1,
				["löwe", "loewe", "lion"],
				"Falsche Großkatze - das gesuchte Tier hat Flecken!",
			),
			createContextualHint(
				1,
				["tiger"],
				"Falsche Großkatze - das gesuchte Tier lebt in Afrika!",
			),

			// Auto-Free Hint (nach 5 falschen Versuchen)
			createAutoFreeHint(
				1,
				"Diese gefleckte Großkatze ist für ihre Kletterfähigkeiten bekannt.",
			),
		],
	},
	{
		id: 2,
		answer: "Flusspferd",
		alternativeAnswers: ["Nilpferd", "Hippopotamus"],
		funFact:
			"Flusspferde sind näher mit Walen verwandt als mit anderen Landtieren - beide stammen von denselben urzeitlichen Meeresvorfahren ab.",
		images: {
			imageUrl: require("./img/nilpferd.jpg"),
			thumbnailUrl: require("./img/thumbnails/nilpferd.jpg"),
			unsolvedImageUrl: require("./img/nilpferd_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/nilpferd_unsolved.jpg"),
		},
		hints: [
			createAutoFreeHint(
				2,
				"Manchmal wird ein Flusspferd auch Nilpferd genannt.",
			),
			createContextualHint(2, ["nico"], "😳"),
		],
	},

	{
		id: 3,
		answer: "Flamingo",
		funFact:
			"Flamingos werden nur durch bestimmte Algen und Krebstiere rosa - in Gefangenschaft verblassen sie ohne spezielle Nahrung wieder zu grau-weiß!",
		images: {
			imageUrl: require("./img/flamingo.jpg"),
			thumbnailUrl: require("./img/thumbnails/flamingo.jpg"),
			unsolvedImageUrl: require("./img/flamingo_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/flamingo_unsolved.jpg"),
		},
	},
	{
		id: 4,
		answer: "Löwe",
		funFact:
			"Löwen sind die einzigen Katzen, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!Löwen sind die einzigen Katzen, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!",
		images: {
			imageUrl: require("./img/loewe.jpg"),
			thumbnailUrl: require("./img/thumbnails/loewe.jpg"),
			unsolvedImageUrl: require("./img/loewe_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/loewe_unsolved.jpg"),
		},
	},
	{
		id: 5,
		answer: "Oryxantilope",
		alternativeAnswers: ["Oryx"],
		funFact:
			"Oryxantilopen können monatelang ohne Wasser überleben und ihren Wasserbedarf komplett aus der Nahrung decken, selbst in der Sahara.",
		images: {
			imageUrl: require("./img/oryxantilope.jpg"),
			thumbnailUrl: require("./img/thumbnails/oryxantilope.jpg"),
			unsolvedImageUrl: require("./img/oryxantilope_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/oryxantilope_unsolved.jpg"),
		},
	},
	{
		id: 6,
		answer: "Nashorn",
		funFact:
			"Nashörner haben trotz ihrer massigen Erscheinung überraschend schlechte Augen, können aber dafür auf 50 km/h beschleunigen!",
		images: {
			imageUrl: require("./img/nashorn.jpg"),
			thumbnailUrl: require("./img/thumbnails/nashorn.jpg"),
			unsolvedImageUrl: require("./img/nashorn_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/nashorn_unsolved.jpg"),
		},
	},
	{
		id: 7,
		answer: "Zebra",
		funFact:
			"Zebras haben alle ein einzigartiges Streifenmuster - wie ein Fingerabdruck ist kein Zebra dem anderen gleich!",
		images: {
			imageUrl: require("./img/zebra.jpg"),
			thumbnailUrl: require("./img/thumbnails/zebra.jpg"),
			unsolvedImageUrl: require("./img/zebra_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/zebra_unsolved.jpg"),
		},
	},
	{
		id: 8,
		answer: "Strauss",
		funFact:
			"Strauße können nicht fliegen, aber dafür mit bis zu 70 km/h rennen und dabei 4 Meter weite Schritte machen.",
		images: {
			imageUrl: require("./img/strauss.jpg"),
			thumbnailUrl: require("./img/thumbnails/strauss.jpg"),
			unsolvedImageUrl: require("./img/strauss_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/strauss_unsolved.jpg"),
		},
	},
	{
		id: 9,
		answer: "Südafrikanischer-Seebär",
		alternativeAnswers: ["Seebär"],
		funFact:
			"Südafrikanische Seebären können ihre Hinterflossen nach vorne drehen und dadurch als einzige Robbenart richtig 'laufen' statt nur robben.",
		images: {
			imageUrl: require("./img/suedafrikanischer-seebaer.jpg"),
			thumbnailUrl: require("./img/thumbnails/suedafrikanischer-seebaer.jpg"),
			unsolvedImageUrl: require("./img/suedafrikanischer-seebaer_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/suedafrikanischer-seebaer_unsolved.jpg"),
		},
	},
	{
		id: 10,
		answer: "Elefant",
		funFact:
			"Afrikanische Elefanten können mit ihren Füßen Erdbeben spüren, die hunderte Kilometer entfernt stattfinden - so kommunizieren Herden über weite Distanzen.",
		images: {
			imageUrl: require("./img/elefant.jpg"),
			thumbnailUrl: require("./img/thumbnails/elefant.jpg"),
			unsolvedImageUrl: require("./img/elefant_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/elefant_unsolved.jpg"),
		},
	},
	{
		id: 11,
		answer: "Steenbock",
		alternativeAnswers: ["Steinböckchen", "Steinbock"],
		funFact:
			"Steinböcke sind so kleine Antilopen, dass sie sich bei Gefahr regungslos hinlegen und dank ihrer braunen Farbe praktisch unsichtbar werden.",
		images: {
			imageUrl: require("./img/steenbock.jpg"),
			thumbnailUrl: require("./img/thumbnails/steenbock.jpg"),
			unsolvedImageUrl: require("./img/steenbock_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/steenbock_unsolved.jpg"),
		},
	},
	{
		id: 12,
		answer: "Kap-Borstenhörnchen",
		alternativeAnswers: ["Borstenhörnchen"],
		funFact:
			"Kap-Borstenhörnchen wedeln mit ihrem buschigen Schwanz wie mit einem Sonnenschirm, um sich vor der afrikanischen Hitze zu schützen!",
		images: {
			imageUrl: require("./img/kap-borstenhoernchen.jpg"),
			thumbnailUrl: require("./img/thumbnails/kap-borstenhoernchen.jpg"),
			unsolvedImageUrl: require("./img/kap-borstenhoernchen_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/kap-borstenhoernchen_unsolved.jpg"),
		},
	},
	{
		id: 13,
		answer: "Giraffe",
		funFact:
			"Giraffen haben nur 7 Halswirbel - genau so viele wie Menschen, obwohl ihr Hals 2 Meter lang ist!",
		images: {
			imageUrl: require("./img/giraffe.jpg"),
			thumbnailUrl: require("./img/thumbnails/giraffe.jpg"),
			unsolvedImageUrl: require("./img/giraffe_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/giraffe_unsolved.jpg"),
		},
	},
	{
		id: 14,
		answer: "Warzenschwein",
		funFact:
			"Warzenschweine laufen bei Gefahr rückwärts in ihre Höhlen, um mit den scharfen Hauern voran jeden Angreifer abzuwehren.",
		images: {
			imageUrl: require("./img/warzenschwein.jpg"),
			thumbnailUrl: require("./img/thumbnails/warzenschwein.jpg"),
			unsolvedImageUrl: require("./img/warzenschwein_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/warzenschwein_unsolved.jpg"),
		},
	},
	{
		id: 15,
		answer: "Gelbschnabeltoko",
		funFact:
			"Gelbschnabeltokos sind die einzigen Vögel, die sich während der Brutzeit komplett in Baumhöhlen einmauern - nur ein kleiner Spalt bleibt zum Füttern offen.",
		images: {
			imageUrl: require("./img/gelbschnabeltoko.jpg"),
			thumbnailUrl: require("./img/thumbnails/gelbschnabeltoko.jpg"),
			unsolvedImageUrl: require("./img/gelbschnabeltoko_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/gelbschnabeltoko_unsolved.jpg"),
		},
	},
];
