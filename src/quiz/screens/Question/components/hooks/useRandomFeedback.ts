import { useCallback, useEffect, useState } from "react";

const NEGATIVE_PHRASES = [
	"Uff, da hat's noch nicht ganz gefunkt! Kopf hoch!",
	"Ähm, diese Antwort wollte wohl noch nicht so ganz mit uns tanzen. Weiter geht's!",
	"Schade Marmelade, das war noch kein Volltreffer. Aber wir kriegen das hin!",
	"Hmm, da hat der Gedankenblitz wohl einen kleinen Umweg genommen. Versuch's nochmal!",
	"Leider ein kleiner Stolperstein! Aber wer fällt, steht auch wieder auf, oder?",
	"Diese Antwort hat uns leider nicht zum Ziel gebracht. Aber die Reise geht weiter!",
	"Puh, da war der Zielschuss noch nicht ganz platziert. Aber du bist nah dran!",
	"Nicht ganz im Schwarzen, aber du bist schon auf der richtigen Spur! Dranbleiben!",
	"Da hat sich wohl ein kleiner Frechdachs eingeschlichen. Aber wir schnappen ihn noch!",
	"Nicht 100%ig, aber hey, Übung macht den Meister! Auf ein Neues!",
	"Ups, da hat's noch nicht 'Klick!' gemacht. Aber dein Gehirn ist am Werk!",
	"Leider kein goldener Treffer dieses Mal. Aber das nächste Mal sitzt er!",
	"Diese Antwort hat uns leider nicht vom Hocker gerissen. Aber wir sind gespannt auf die nächste!",
	"Da war der Wurm drin! Aber keine Sorge, wir fischen ihn raus!",
	"Ein kleiner Ausrutscher! Aber die besten Entdeckungen passieren manchmal, wenn man vom Weg abkommt. 😉",
];

const POSITIVE_PHRASES = [
	"Jaaaaa! Volltreffer! Du bist ein Genie!",
	"Boom! Exzellent! Das war ja mal eine Punktlandung!",
	"Absolut richtig! Mein innerer Nerd jubelt gerade! 🎉",
	"Wow! Perfekt! Du hast das Rätsel geknackt!",
	"Unglaublich! Genau das war's! Du bist einfach spitze!",
	"Treffer, Versenkt! Dein Wissen ist beeindruckend!",
	"Bingo! Einfach fantastisch! Weiter so!",
	"Genau mein Humor... äh, ich meine: Genau richtig! 😁",
	"Chapeau! Das war meisterhaft gelöst!",
	"Du hast den Code geknackt! Großartig gemacht!",
	"Einwandfrei! Da gibt's nichts zu rütteln!",
	"Meisterhaft! Du bist auf dem Weg zum Quiz-Gott!",
	"Das sitzt wie angegossen! Super!",
	"Tadaaa! Richtig! Lass die Konfettikanonen steigen!",
	"Du bist der Hammer! Exakt die richtige Antwort!",
];

export const useRandomFeedback = (correct: boolean) => {
	const [currentPhrase, setCurrentPhrase] = useState("");

	const getRandomPhrase = useCallback(() => {
		let phrasesToUse: string[];
		if (correct) {
			phrasesToUse = POSITIVE_PHRASES;
		} else {
			phrasesToUse = NEGATIVE_PHRASES;
		}
		const randomIndex = Math.floor(Math.random() * phrasesToUse.length);
		setCurrentPhrase(phrasesToUse[randomIndex]);
	}, [correct]);

	useEffect(() => {
		getRandomPhrase();
	}, [getRandomPhrase]);

	return { currentPhrase, getRandomPhrase };
};
