import {QUIZ_TYPE} from "../constants";

export interface QuizDetailsResponseDto {
  question: string;
  answer: string;
  playTime: number;
  quizType: QUIZ_TYPE;
}