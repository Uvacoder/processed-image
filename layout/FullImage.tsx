
import React, { MouseEvent, useEffect, useState } from 'react';
import css from './FullImage.module.css';
import Image from 'next/image';
import { useDrag } from 'react-use-gesture';
import type { FullScreenView } from '../types';
import BackArrow from '../public/upwards.svg'; 
import cx from 'classnames';

interface FullImageProps extends FullScreenView {
	setOpen: (newValue: boolean) => void;
}

function useSwipe(
  actions = {
    onUp: () => {},
    onDown: () => {},
    onLeft: () => {},
    onRight: () => {}
  },
  threshold = 0.3
) {
  return useDrag(({ last, vxvy: [vx, vy] }) => {
    if (Math.abs(vx) > Math.abs(vy)) {
      if (vx < -threshold && last) {
        actions.onLeft();
      } else if (vx > threshold && last) {
        actions.onRight();
      }
    } else {
      if (vy < -threshold && last) {
        actions.onUp();
      } else if (vy > threshold && last) {
        actions.onDown();
      }
    }
  });
}

export default function FullImage({ isOpen, setOpen, image, images }: FullImageProps) {
	const [viewed, setViewed] = useState({ image, index: images?.findIndex(i => i === image) || 0 });

	const closeOnKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') setOpen(!isOpen);
	};

	const switchNextImage = (type: 'left' | 'right', e?: MouseEvent<HTMLButtonElement>) => {
		e?.stopPropagation();
		if (!images?.length) return;
		const nextIndex = (
			type === 'left' && viewed.index - 1 <= 0 ? images.length - 1 : 
			type === 'right' && viewed.index + 1 >= images.length ? viewed.index + 1 :
			type === 'right' ? viewed.index + 1 :
			type === 'left' ? viewed.index - 1 : viewed.index
		);
		setViewed({ image: images[nextIndex], index: nextIndex });
	};

	const bind = useSwipe({ 
		onLeft: () => switchNextImage('right'), 
		onRight: () => switchNextImage('left'),
		onUp: () => {},
		onDown: () => {}
	});

	useEffect(() => {
		window.addEventListener('keydown', closeOnKeyDown);
		return () => window.removeEventListener('keydown', closeOnKeyDown);
	}, []);

	return isOpen ? (
		<div className={css.Overlay} onClick={() => setOpen(!isOpen)}>
			<button 
				onClick={e => switchNextImage('left', e)} 
				className={cx(css.Overlay__Arrows, {
					[css.ArrowHidden]: images && images.length > 0 && viewed.index - 1 <= 0
				})}>
				<BackArrow className={css.ArrowBack} width={36} height={36} />
			</button>
			<Image 
				src={viewed.image}
				layout='fill'
				objectFit='contain'
				onClick={e => e.stopPropagation()}
				className={css.FullImage}
				alt='Картинка в полный экран'
				{ ...(images && images.length && bind()) }
			/>
			<button
				onClick={e => switchNextImage('right', e)} 
				className={cx(css.Overlay__Arrows, {
					[css.ArrowHidden]: images && images.length > 0 && viewed.index + 1 >= images.length
				})}>
				<BackArrow className={css.ArrowForward} width={36} height={36} />
			</button>
		</div>
	) : null;
}