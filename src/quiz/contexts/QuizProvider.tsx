import React, { ReactNode, useEffect, useRef } from 'react';
import { useQuizStore } from '../store/Quiz.store'; // Angepasster Importpfad

import { animalQuizConfigs } from '@/src/animals/quizzes'; // Importiere deine Quiz-Konfigurationen
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { initializeAllQuizzes, registerQuizzes } from '../initialization/registerQuizzes';

interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const hasStoreHydrated = useQuizStore.persist.hasHydrated();
  const isQuizDataLoadedInStore = useQuizStore(state => state.isQuizDataLoaded);
  const setQuizDataLoaded = useQuizStore(state => state.setQuizDataLoaded);
  const quizStatesRecord = useQuizStore(state => state.quizStates); 

  // Verwende Refs, um sicherzustellen, dass die Registrierungs- und Initialisierungslogik
  // nur einmal pro App-Lebenszyklus ausgeführt wird.
  const hasRegisteredQuizzesRef = useRef(false);
  const hasInitializedStatesRef = useRef(false);

  // Effekt zur Registrierung statischer Quiz-Daten
  useEffect(() => {
    let isMounted = true;

    // Nur fortfahren, wenn der Store hydriert ist UND Quizzes noch nicht registriert/geladen wurden
    if (!hasStoreHydrated || hasRegisteredQuizzesRef.current || isQuizDataLoadedInStore) {
      console.log(`[QuizProvider-Effect1] Skipping registration. Hydrated: ${hasStoreHydrated}, RegisteredRef: ${hasRegisteredQuizzesRef.current}, DataLoadedInStore: ${isQuizDataLoadedInStore}`);
      return;
    }

    console.log('[QuizProvider-Effect1] Attempting to register quiz configs...');
    console.log('[QuizProvider-Effect1] Quizzes in store BEFORE registerQuizzes:', Object.keys(useQuizStore.getState().quizzes).length);
    console.log('[QuizProvider-Effect1] QuizConfigs in store BEFORE registerQuizzes:', Object.keys(useQuizStore.getState().quizConfigs).length);

    // Führe die Registrierung aus. Da der Fehler behoben ist, sollte dies den Store korrekt aktualisieren.
    registerQuizzes(animalQuizConfigs); 

    // Überprüfe den Store-Zustand direkt nach der Registrierung.
    const currentQuizzesInStore = useQuizStore.getState().quizzes;
    console.log('[QuizProvider-Effect1] Quizzes in store AFTER registerQuizzes:', Object.keys(currentQuizzesInStore).length);
    console.log('[QuizProvider-Effect1] QuizConfigs in store AFTER registerQuizzes:', Object.keys(useQuizStore.getState().quizConfigs).length);

    if (Object.keys(currentQuizzesInStore).length > 0) {
      console.log('[QuizProvider-Effect1] Quiz configs successfully registered. Setting isQuizDataLoaded to true.');
      if (isMounted) {
        setQuizDataLoaded(true); // Setze das Flag im Store
        hasRegisteredQuizzesRef.current = true; // Markiere als global registriert
      }
    } else {
      // Diese Warnung sollte jetzt idealerweise nicht mehr erscheinen,
      // da `registerQuizzes` die korrekte Store-Instanz aktualisiert.
      console.warn('[QuizProvider-Effect1] Quiz configs registered, but quizzes object in store is still empty. Please check `registerQuizzes` implementation.');
    }

    return () => {
      isMounted = false;
    };
  }, [hasStoreHydrated, isQuizDataLoadedInStore, setQuizDataLoaded]); // Abhängigkeiten

  // Effekt zur Initialisierung benutzerspezifischer Quiz-Zustände (asynchron)
  useEffect(() => {
    let isMounted = true;

    // Prüfe, ob Quiz-Zustände bereits initialisiert sind, indem du den `quizStatesRecord` des Stores überprüfst.
    const areQuizStatesInitializedInStore = Object.keys(quizStatesRecord).length > 0;

    // Nur fortfahren, wenn Quiz-Daten geladen sind UND Zustände noch nicht initialisiert wurden
    if (!isQuizDataLoadedInStore || hasInitializedStatesRef.current || areQuizStatesInitializedInStore) {
      console.log(`[QuizProvider-Effect2] Skipping state initialization. DataLoaded: ${isQuizDataLoadedInStore}, InitializedRef: ${hasInitializedStatesRef.current}, StatesInStore: ${areQuizStatesInitializedInStore}`);
      return;
    }

    const initializeStates = async () => {
      console.log('[QuizProvider-Effect2] Initializing all quiz states...');
      await initializeAllQuizzes(); // Dies aktualisiert die `quizStates` des Stores
      if (isMounted) {
        hasInitializedStatesRef.current = true; // Markiere als global initialisiert
        console.log('[QuizProvider-Effect2] All quiz states initialized.');
      }
    };

    initializeStates();

    return () => {
      isMounted = false;
    };
  }, [isQuizDataLoadedInStore, quizStatesRecord]); // Abhängigkeiten

  // Bestimme, ob die gesamte App bereit ist, Kind-Komponenten zu rendern
  // Die App ist bereit, wenn der Store hydriert ist, statische Quiz-Daten geladen sind UND benutzerspezifische Quiz-Zustände initialisiert sind.
  const isAppReady = hasStoreHydrated && isQuizDataLoadedInStore && Object.keys(quizStatesRecord).length > 0;

  if (!isAppReady) {
    console.log(`[QuizProvider] App not ready. Hydrated: ${hasStoreHydrated}, Data Loaded: ${isQuizDataLoadedInStore}, States Initialized: ${Object.keys(quizStatesRecord).length > 0}`);
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>App wird geladen...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});