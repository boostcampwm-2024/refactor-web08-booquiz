// features/QuizZone/model/provider/QuizZoneProvider.tsx
import { ReactNode, useState, useEffect, useMemo } from 'react';
import { requestQuizZone } from '@/utils/requests';
import { useAsyncError } from '@/hook/useAsyncError';
import useQuizZone from '@/hook/quizZone/useQuizZone';
import QuizZoneContext from './QuizZoneContext';

interface QuizZoneProviderProps {
    children: ReactNode;
    quizZoneId: string;
    onReconnect: () => void;
    onClose: () => void;
}

export const QuizZoneProvider = ({
    children,
    quizZoneId,
    onReconnect,
    onClose,
}: QuizZoneProviderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const throwError = useAsyncError();

    const { initQuizZoneData, quizZoneState, submitQuiz, startQuiz, playQuiz, exitQuiz, sendChat } =
        useQuizZone(quizZoneId, onReconnect, onClose);

    const initQuizZone = async () => {
        try {
            setIsLoading(true);
            const quizZone = await requestQuizZone(quizZoneId);
            const now = new Date().getTime();
            await initQuizZoneData(quizZone, now);
            setIsLoading(false);
        } catch (error) {
            throwError(error);
        }
    };

    useEffect(() => {
        initQuizZone();
    }, []);

    const value = useMemo(
        () => ({
            quizZoneState,
            submitQuiz,
            startQuiz,
            playQuiz,
            exitQuiz,
            sendChat,
        }),
        [quizZoneState, submitQuiz, startQuiz, playQuiz, exitQuiz, sendChat],
    );

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">로딩 중...</div>
            ) : (
                <QuizZoneContext.Provider value={value}>{children}</QuizZoneContext.Provider>
            )}
        </>
    );
};
