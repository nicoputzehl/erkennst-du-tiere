import { ContentQuestionFactory, MultipleChoiceQuestionFactory } from '../../core/content/ContentQuestionFactory';
import { AnimalKey, QuestionWithAnimal, MultipleChoiceQuestionWithAnimal } from '../types';
import { animalContentProvider } from './AnimalContentProvider';
import { Question, MultipleChoiceQuestion } from '../../quiz/types';
import { animalContentHandler, animalMultipleChoiceContentHandler } from './AnimalContentaHandlerAdapter';

/**
 * Adapter, der aus dem QuestionWithAnimal-Typ ContentQuestion macht
 */
const adaptAnimalQuestions = (questions: QuestionWithAnimal[]): { id: number; imageUrl: string; thumbnailUrl?: string; contentKey: string }[] => {
  return questions.map(q => {
    console.log(`[adaptAnimalQuestions] Processing question ${q.id}, ${q.animal}, thumbnailUrl:`, q.thumbnailUrl);
    return {
      id: q.id,
      imageUrl: q.imageUrl,
      thumbnailUrl: q.thumbnailUrl,
      contentKey: q.animal
    };
  });
};

/**
 * Erstellt normale Text-Fragen aus Tier-Definitionen
 */
export const createQuestionsFromAnimals = (questions: QuestionWithAnimal[]): Question[] => {
  const factory = new ContentQuestionFactory<AnimalKey>(
    animalContentHandler,
    animalContentProvider
  );

  return factory.createQuestionsFromContent(adaptAnimalQuestions(questions));
};

/**
 * Erstellt Multiple-Choice-Fragen aus Tier-Definitionen
 */
export const createMultipleChoiceQuestionsFromAnimals = (
  questions: MultipleChoiceQuestionWithAnimal[],
  choiceCount: number = 4
): MultipleChoiceQuestion[] => {
  const factory = new MultipleChoiceQuestionFactory<AnimalKey>(
    animalMultipleChoiceContentHandler,
    animalContentProvider
  );

  // Adapter für MultipleChoiceQuestionWithAnimal -> ContentMultipleChoiceQuestion
  const adaptedQuestions = questions.map(q => {
    console.log(`[createMultipleChoiceQuestionsFromAnimals] Processing question ${q.id} ${q.animal}, thumbnailUrl:`, q.thumbnailUrl);
    return {

      id: q.id,
      imageUrl: q.imageUrl,
      thumbnailUrl: q.thumbnailUrl,
      contentKey: q.animal,
      choices: q.choices
    }
  });

  return factory.createMultipleChoiceQuestionsFromContent(adaptedQuestions, choiceCount);
};