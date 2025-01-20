// features/QuizZone/ui/QuizZonePage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary';
import { useAsyncError } from '@/hook/useAsyncError';
import { AlertDialog } from '@/components/ui/alert-dialog';
import CustomAlertDialogContent from '@/components/common/CustomAlertDialogContent';
import { QuizZoneProvider } from '../model/QuizZoneProvider';
import QuizZoneContent from './QuizZoneContent';

const QuizZonePage = () => {
    const navigate = useNavigate();
    const { quizZoneId } = useParams();
    const [isDisconnection, setIsDisconnection] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const throwError = useAsyncError();

    if (!quizZoneId) {
        throwError(new Error('접속하려는 퀴즈존의 입장 코드를 확인하세요.'));
        return null;
    }

    return (
        <AsyncBoundary
            pending={
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2563eb]" />
                </div>
            }
            handleError={(error: any) => {
                console.error('QuizZone Error:', error);
            }}
            onReset={() => navigate('/')}
        >
            <QuizZoneProvider
                quizZoneId={quizZoneId}
                onReconnect={() => setIsDisconnection(true)}
                onClose={() => setIsClose(true)}
            >
                <QuizZoneContent />
                <AlertDialog open={isDisconnection}>
                    <CustomAlertDialogContent
                        title={'퀴즈존 입장'}
                        description={'서버와의 연결이 끊어졌습니다. 다시 연결하시겠습니까?'}
                        type={'error'}
                        confirmText={'다시 연결하기'}
                        cancelText={'나가기'}
                        handleCancel={() => navigate('/')}
                        handleConfirm={() => {
                            setIsDisconnection(false);
                            // Provider will handle reconnection
                        }}
                    />
                </AlertDialog>
                <AlertDialog open={isClose}>
                    <CustomAlertDialogContent
                        title={'퀴즈존 종료'}
                        description={'방장이 퀴즈존을 떠나 퀴즈존이 삭제되었습니다.'}
                        type={'info'}
                        cancelText={'취소'}
                        handleCancel={() => setIsClose(false)}
                        confirmText={'나가기'}
                        handleConfirm={() => navigate('/')}
                    />
                </AlertDialog>
            </QuizZoneProvider>
        </AsyncBoundary>
    );
};

export default QuizZonePage;
