import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {Easing} from 'remotion';
import {interpolate} from 'remotion';
import {Circle} from './Circle';

export const Operator = ({format, from, textColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const textStrokeInterpolate = interpolate(
		frame,
		[from + 10, from + fps],
		[0, 100],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.61, 0.14, 0.83, 0.69),
		}
	);
	const textInterpolate = interpolate(
		frame,
		[from + fps - 3, from + fps],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.41, 0.58, 0.41, 0.75),
		}
	);
	const opacity = interpolate(frame, [from, from + fps], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.15, 0.67, 0.54, 0.7),
	});
	if (format.operation === 'verb') {
		return (
			<div style={{opacity}} className="text-4xl text-center font-bold relative w-fit">
				<div className="absolute w-[250%] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10">
					<Circle
						fill={textColor}
						offset={textStrokeInterpolate}
						id={format.verb.replace(/\s/g, '')}
					/>
				</div>
				<div className="absolute w-fit z-10">
					<span style={{opacity: textInterpolate, color: textColor}}>
						{format.verb}
					</span>
				</div>
				<span className='opacity-0'>
					{format.verb}
				</span>
			</div>
		);
	}
	return null;
};
