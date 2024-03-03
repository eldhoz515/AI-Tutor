import {staticFile, useVideoConfig} from 'remotion';
import {Easing} from 'remotion';
import {useRef, useState} from 'react';
import {Img, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {imageAnimations} from './constants';
import {BrushStroke} from './BrushStroke';

export const ImageBox = ({
	format,
	from,
	width,
	height,
	animation,
	textColor,
}) => {
	const [dimensions, setDimensions] = useState({width: 0, height: 0});
	const ref = useRef(null);
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const end = Math.min(durationInFrames, from + fps);
	const opacity = interpolate(frame, [from, end], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.15, 0.67, 0.54, 0.7),
	});
	const imageTransformInterpolate = interpolate(
		frame,
		[from, from + 10],
		imageAnimations[animation],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.41, 0.58, 0.41, 0.75),
		}
	);
	let transform = '';
	switch (animation) {
		case 'tx':
			transform = `translateX(${imageTransformInterpolate}px)`;
			break;
		case 'ty':
			transform = `translateY(${imageTransformInterpolate}px)`;
			break;
		case 'ntx':
			transform = `translateX(-${imageTransformInterpolate}px)`;
			break;
		case 'nty':
			transform = `translateY(-${imageTransformInterpolate}px)`;
			break;
		case 's':
			transform = `scale(${imageTransformInterpolate})`;
			break;
		case 'rx':
			transform = `rotateX(${imageTransformInterpolate}deg)`;
			break;
		case 'ry':
			transform = `rotateY(${imageTransformInterpolate}deg)`;
			break;
		case 'rz':
			transform = `rotateZ(${imageTransformInterpolate}deg)`;
			break;
		default:
			transform = '';
			break;
	}

	const handleImageLoad = (event) => {
		const {naturalWidth, naturalHeight} = event.target;
		const aspectRatio = naturalWidth / naturalHeight;
		const maxWidth = ref.current.clientWidth;
		const maxHeight = ref.current.clientHeight;

		let newWidth = naturalWidth;
		let newHeight = naturalHeight;

		if (newWidth > maxWidth) {
			newWidth = maxWidth;
			newHeight = newWidth / aspectRatio;
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight;
			newWidth = newHeight * aspectRatio;
		}

		setDimensions({width: newWidth, height: newHeight});
	};
	const textStrokeInterpolate = interpolate(frame, [from + 10, end], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.61, 0.14, 0.83, 0.69),
	});
	const textInterpolate = interpolate(frame, [end - 3, end], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.41, 0.58, 0.41, 0.75),
	});
	return (
		<div
			ref={ref}
			className=" relative"
			style={{
				width: `${width}%`,
				height: `${height}%`,
				opacity,
				transform,
			}}
		>
			{ref && (
				<>
					<Img
						src={format.googleImage}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl -z-3"
						style={{
							width: dimensions.width,
							height: dimensions.height,
						}}
						onLoad={handleImageLoad}
						onError={() => {}}
					/>
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl -z-2"
						style={{
							width: dimensions.width,
							height: dimensions.height,
							boxShadow: ' 0 0 8px 8px black inset',
						}}
					/>
				</>
			)}
			<div className="relative m-auto top-[85%] text-5xl font-bold w-fit text-center z-0">
				<div className="absolute min-w-[300px] w-[150%] top-full -translate-y-[80%] left-1/2 -translate-x-1/2 -z-10">
					<BrushStroke
						id={format.expression.replace(/\s/g, '')}
						fill={textColor}
						offset={textStrokeInterpolate}
					/>
				</div>
				<span
					className="block z-0"
					style={{opacity: textInterpolate, color: textColor}}
				>
					{format.expression}
				</span>
			</div>
		</div>
	);
};
