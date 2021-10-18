
import React, { useEffect } from 'react';
import css from './FullImage.module.css';
import Image from 'next/image';

interface FullImageProps {
	image: string;
	isOpen: boolean;
	setOpen: (newValue: boolean) => void;
}

export default function FullImage({ isOpen, setOpen, image }: FullImageProps) {
	const closeOnKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') setOpen(!isOpen);
	};

	useEffect(() => {
		window.addEventListener('keydown', closeOnKeyDown);
		return () => window.removeEventListener('keydown', closeOnKeyDown);
	}, []);

	return isOpen ? (
		<div className={css.Overlay} onClick={() => setOpen(!isOpen)}>
			<Image 
				src={image}
				layout='fill'
				objectFit='contain'
				onClick={e => e.stopPropagation()}
				className={css.FullImage}
				alt='Картинка в полный экран'
			/>
		</div>
	) : null;
}