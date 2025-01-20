import QuizZoneInProgress from '@/blocks/QuizZone/QuizZoneInProgress';
import QuizZoneLoading from '@/blocks/QuizZone/QuizZoneLoading';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';
import ChatBox from '@/components/common/ChatBox';
import { useQuizZoneContext } from '../model/QuizZoneContext';
import { useParams } from 'react-router-dom';

const QuizZoneContent = () => {
    const { quizZoneId } = useParams();
    const { quizZoneState, startQuiz, submitQuiz, playQuiz, exitQuiz, sendChat } =
        useQuizZoneContext();

    const shouldShowChat = () => {
        if (!quizZoneState.currentPlayer?.id || !quizZoneState.stage) {
            return false;
        }

        const isPlaying =
            quizZoneState.currentPlayer.state === 'PLAY' && quizZoneState.stage === 'IN_PROGRESS';
        const isSinglePlayer = quizZoneState.players?.length === 1;

        return !isPlaying && !isSinglePlayer;
    };

    const renderQuizZone = () => {
        switch (quizZoneState.stage) {
            case 'LOBBY':
                return (
                    <QuizZoneLobby
                        quizZoneState={quizZoneState}
                        quizZoneId={quizZoneId ?? ''}
                        maxPlayers={quizZoneState.maxPlayers ?? 0}
                        startQuiz={startQuiz}
                        exitQuiz={exitQuiz}
                        sendChat={sendChat}
                    />
                );
            case 'IN_PROGRESS':
                return (
                    <QuizZoneInProgress
                        quizZoneState={quizZoneState}
                        submitAnswer={submitQuiz}
                        playQuiz={playQuiz}
                    />
                );
            case 'RESULT':
                if (!quizZoneState.endSocketTime) {
                    return <QuizZoneLoading />;
                }
                return <QuizZoneResult quizZoneState={quizZoneState} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] justify-center p-4 mt-16">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center w-full">
                <div className="w-full lg:h-[80vh] lg:flex">{renderQuizZone()}</div>
                {shouldShowChat() && (
                    <ChatBox
                        chatMessages={quizZoneState.chatMessages ?? []}
                        clientId={quizZoneState.currentPlayer.id}
                        nickname={quizZoneState.currentPlayer.nickname}
                        sendHandler={sendChat}
                        className="lg:h-[80vh] lg:max-h-[80vh] max-h-[60vh] flex flex-col w-full lg:w-[24rem]"
                        disabled={quizZoneState.isQuizZoneEnd ?? false}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizZoneContent;
