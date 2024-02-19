import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {Easing} from 'remotion';
import {interpolate} from 'remotion';
import {Arrow} from './Arrow';

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
		[0, 0.3],
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
			<div style={{opacity}} className="text-4xl font-bold relative w-fit">
				<div className="absolute min-w-[300px] w-[200%] top-full -translate-y-[43%] left-1/2 -translate-x-[30%] -z-10">
					<Arrow
						fill={textColor}
						offset={textStrokeInterpolate}
						id={format.verb.replace(/\s/g, '')}
					/>
				</div>
				<span style={{opacity: textInterpolate, color: textColor}}>
					{format.verb}
				</span>
			</div>
		);
	}
	return null;
};
