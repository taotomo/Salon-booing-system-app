import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StarRating from './StarRating';

describe('StarRating', () => {
    it('評価を読み上げ用テキストとして表示する', () => {
        render(<StarRating rating={4.5} />);

        expect(screen.getByRole('img', { name: '評価 4.5 / 5' })).toBeInTheDocument();
    });

    it('星は常に5個表示される', () => {
        render(<StarRating rating={3} />);

        expect(screen.getAllByRole('button')).toHaveLength(5);
    });

    it('onChangeを渡さない場合は星をクリックしても押せない（disabled）', () => {
        render(<StarRating rating={3} />);

        const firstStar = screen.getAllByRole('button')[0];
        expect(firstStar).toBeDisabled();
    });

    it('onChangeを渡した場合、星をクリックするとその星の数が渡される', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();
        render(<StarRating rating={0} onChange={handleChange} />);

        const stars = screen.getAllByRole('button');
        await user.click(stars[3]); // 4番目の星（★4つ分）をクリック

        expect(handleChange).toHaveBeenCalledWith(4);
    });
});
