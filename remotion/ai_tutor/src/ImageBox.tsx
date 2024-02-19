import {useVideoConfig} from 'remotion';
import {Easing} from 'remotion';
import {useRef, useState} from 'react';
import {Img, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {imageAnimations} from './constants';

export const ImageBox = ({format, from, width, height, animation}) => {
	const [dimensions, setDimensions] = useState({width: 0, height: 0});
	const ref = useRef(null);
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const opacity = interpolate(frame, [from, from + fps], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.15, 0.67, 0.54, 0.7),
	});
	const interpolateOutput = interpolate(
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
			transform = `translateX(${interpolateOutput}px)`;
			break;
		case 'ty':
			transform = `translateY(${interpolateOutput}px)`;
			break;
		case 'ntx':
			transform = `translateX(-${interpolateOutput}px)`;
			break;
		case 'nty':
			transform = `translateY(-${interpolateOutput}px)`;
			break;
		case 's':
			transform = `scale(${interpolateOutput})`;
			break;
		case 'rx':
			transform = `rotateX(${interpolateOutput}deg)`;
			break;
		case 'ry':
			transform = `rotateY(${interpolateOutput}deg)`;
			break;
		case 'rz':
			transform = `rotateZ(${interpolateOutput}deg)`;
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
		console.log(maxHeight, maxWidth);

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
	return (
		<Sequence from={from} layout="none">
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
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl"
							style={{
								width: dimensions.width,
								height: dimensions.height,
							}}
							onLoad={handleImageLoad}
						/>
						<div
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl"
							style={{
								width: dimensions.width,
								height: dimensions.height,
								boxShadow: ' 0 0 8px 8px black inset',
							}}
						/>
					</>
				)}
				<div className="absolute bottom-0 text-center w-full text-5xl">
					{format.expression}
				</div>
			</div>
		</Sequence>
	);
};
