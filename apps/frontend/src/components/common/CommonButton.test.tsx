import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommonButton from './CommonButton';
import { Default, Fulfilled, CustomSize, ClickEvent } from './CommonButton.stories';

describe('CommonButton', () => {
    // Default 스토리 테스트
    it('renders Default story correctly', () => {
        render(<CommonButton {...Default.args} />);
        const button = screen.getByText('기본 버튼');

        expect(button).toBeInTheDocument();

        // 클릭 이벤트 테스트
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        fireEvent.click(button);
        expect(alertMock).toHaveBeenCalledWith('버튼이 클릭되었습니다!');
        alertMock.mockRestore();
    });

    // Fulfilled 스토리 테스트
    it('renders Fulfilled story correctly', () => {
        render(<CommonButton {...Fulfilled.args} />);
        const button = screen.getByText('활성화 버튼');

        expect(button).toBeInTheDocument();

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        fireEvent.click(button);
        expect(alertMock).toHaveBeenCalledWith('버튼이 클릭되었습니다!');
        alertMock.mockRestore();
    });

    // CustomSize 스토리 테스트
    it('renders CustomSize story with correct dimensions', () => {
        render(<CommonButton {...CustomSize.args} />);
        const button = screen.getByText('커스텀 크기 버튼');

        expect(button).toBeInTheDocument();
    });

    // ClickEvent 스토리 테스트
    it('handles ClickEvent story interactions correctly', () => {
        render(<CommonButton {...ClickEvent.args} />);
        const button = screen.getByText('클릭해보세요');

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        fireEvent.click(button);
        expect(alertMock).toHaveBeenCalledWith('버튼이 클릭되었습니다!');
        alertMock.mockRestore();
    });

    // 여러 스토리의 props 테스트
    it('renders correctly with different story props', () => {
        const { rerender } = render(<CommonButton {...Default.args} />);
        expect(screen.getByText('기본 버튼')).toBeInTheDocument();

        rerender(<CommonButton {...Fulfilled.args} />);
        expect(screen.getByText('활성화 버튼')).toBeInTheDocument();

        rerender(<CommonButton {...CustomSize.args} />);
        expect(screen.getByText('커스텀 크기 버튼')).toBeInTheDocument();

        rerender(<CommonButton {...ClickEvent.args} />);
        expect(screen.getByText('클릭해보세요')).toBeInTheDocument();
    });
});
