import { createContext, useContext } from 'react';
import { QuizZoneContextType } from '@/types/quizZone.types';

const QuizZoneContext = createContext<QuizZoneContextType | null>(null);

export const useQuizZoneContext = () => {
    const context = useContext(QuizZoneContext);
    if (!context) {
        throw new Error('useQuizZoneContext must be used within QuizZoneProvider');
    }
    return context;
};

export default QuizZoneContext;
