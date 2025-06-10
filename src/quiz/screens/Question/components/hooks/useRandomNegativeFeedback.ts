import { useEffect, useState } from "react";

const PHRASES = [
	"Das war's leider noch nicht ganz!",
	"Diese Antwort ist leider nicht die gesuchte.",
	"Schade, das war's noch nicht.",
	"Hmm, diese Antwort ist nicht die, die wir suchen.",
	"Das war leider nicht die richtige Lösung.",
	"Diese Antwort führt uns leider nicht zum Ziel.",
	"Leider falsch, aber gib nicht auf!",
	"Das stimmt leider nicht ganz überein.",
	"Die gesuchte Antwort war das leider nicht.",
	"Nicht ganz, versuch's noch einmal.",
	"Diese Eingabe war leider nicht korrekt.",
	"Leider kein Treffer dieses Mal.",
	"Das war leider nicht die Antwort, die wir erwartet haben.",
	"Diese Aussage ist leider nicht zutreffend.",
	"Unglücklicherweise nicht die korrekte Antwort.",
];
export const useRandomNegativeFeedback = () => {
	const [currentPhrase, setCurrentPhrase] = useState("");

	const getRandomPhrase = () => {
		const randomIndex = Math.floor(Math.random() * PHRASES.length);
		setCurrentPhrase(PHRASES[randomIndex]);
	};

	useEffect(() => {
		getRandomPhrase();
	}, []);

	return { currentPhrase, getRandomPhrase };
};
