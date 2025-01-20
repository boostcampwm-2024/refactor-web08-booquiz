import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContentBox from './ContentBox';
import type { ContentBoxProps } from './ContentBox';
import { Default, WithMultipleChildren, WithLongContent } from './ContentBox.stories';

describe('ContentBox', () => {
    // 기본 스토리 렌더링 테스트
    it('기본 스토리가 올바르게 렌더링되는지 확인', () => {
        const { container } = render(<ContentBox {...(Default.args as ContentBoxProps)} />);

        // 기본 내용이 렌더링되었는지 확인
        const content = screen.getByText('이것은 ContentBox 안에 있는 기본 내용입니다.');
        expect(content).toBeInTheDocument();

        // Tailwind 기본 클래스들이 적용되었는지 확인
        const contentBox = container.firstChild as HTMLElement;
        expect(contentBox).toHaveClass(
            'p-4',
            'box-border',
            'rounded-[10px]',
            'border-2',
            'border-gray-200',
            'flex',
            'flex-col',
        );
    });

    // 여러 자식 요소 렌더링 테스트
    it('여러 자식 요소들이 올바르게 렌더링되는지 확인', () => {
        const { container } = render(
            <ContentBox {...(WithMultipleChildren.args as ContentBoxProps)} />,
        );

        // 모든 자식 요소들이 존재하는지 확인
        expect(screen.getByText('ContentBox 제목')).toBeInTheDocument();
        expect(
            screen.getByText('여러 자식 요소를 포함한 ContentBox 예시입니다.'),
        ).toBeInTheDocument();
        expect(screen.getByText('버튼')).toBeInTheDocument();

        // flex-col 클래스로 수직 정렬이 적용되었는지 확인
        const contentBox = container.firstChild as HTMLElement;
        expect(contentBox).toHaveClass('flex-col');
    });

    // 사용자 정의 className 테스트
    it('사용자 정의 className이 올바르게 적용되는지 확인', () => {
        const customClass = 'custom-class';
        const { container } = render(
            <ContentBox className={customClass}>
                <p>테스트 내용</p>
            </ContentBox>,
        );

        const contentBox = container.firstChild as HTMLElement;
        // 기본 클래스와 사용자 정의 클래스가 모두 적용되었는지 확인
        expect(contentBox).toHaveClass(
            'p-4',
            'box-border',
            'rounded-[10px]',
            'border-2',
            'border-gray-200',
            'flex',
            'flex-col',
            customClass,
        );
    });

    // 긴 내용 렌더링 테스트
    it('긴 내용이 올바르게 렌더링되는지 확인', () => {
        const { container } = render(<ContentBox {...(WithLongContent.args as ContentBoxProps)} />);

        // 긴 내용이 렌더링되었는지 확인
        const longContent = screen.getByText(/이것은 긴 내용을 가진 ContentBox 예시입니다/);
        expect(longContent).toBeInTheDocument();

        // 컨테이너 스타일이 올바르게 적용되었는지 확인
        const contentBox = container.firstChild as HTMLElement;
        expect(contentBox).toHaveClass('flex', 'flex-col');
    });

    // children prop이 없을 때의 렌더링 테스트
    it('children prop이 없을 때 빈 div가 렌더링되는지 확인', () => {
        // @ts-expect-error - 런타임 동작 테스트를 위해 잘못된 props 전달
        const { container } = render(<ContentBox />);
        const contentBox = container.firstChild as HTMLElement;
        expect(contentBox).toBeInTheDocument();
        expect(contentBox.children.length).toBe(0);
    });

    // 문서 예제 코드 테스트
    it('문서의 예제 코드가 올바르게 렌더링되는지 확인', () => {
        const { container } = render(
            <ContentBox>
                <p>이것은 ContentBox 안에 있는 내용입니다.</p>
            </ContentBox>,
        );

        expect(screen.getByText('이것은 ContentBox 안에 있는 내용입니다.')).toBeInTheDocument();
        const contentBox = container.firstChild as HTMLElement;
        expect(contentBox).toHaveClass(
            'p-4',
            'box-border',
            'rounded-[10px]',
            'border-2',
            'border-gray-200',
            'flex',
            'flex-col',
        );
    });

    // 반환 타입 테스트
    it('JSX.Element 타입이 올바르게 반환되는지 확인', () => {
        const result = render(
            <ContentBox>
                <p>테스트</p>
            </ContentBox>,
        );
        expect(result.container.firstChild).toBeInstanceOf(HTMLElement);
    });
});
