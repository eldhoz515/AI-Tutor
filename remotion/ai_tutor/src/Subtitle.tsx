import {Easing} from 'remotion';
import {Sequence, Series, interpolate, useCurrentFrame} from 'remotion';
import {getDurationInFrames} from './utils';
export const Subtitle = ({speechMarks}) => {
	const frame = useCurrentFrame();
	return (
		<Sequence from={getDurationInFrames((speechMarks[0]?.time || 0) / 1000)}>
			<Series>
				{speechMarks.map((speechMark, i) => {
					const subDuration = getDurationInFrames(
						((speechMarks[i + 1]?.time || speechMark.time + 1000) -
							speechMark.time) /
							1000
					);
					const start = getDurationInFrames(speechMark.time / 1000);
					const scaleY = interpolate(
						frame,
						[start, start + subDuration],
						[1, 0.7],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.19, 0.8, 0.29, 0.93),
						}
					);
					const scaleX = interpolate(
						frame,
						[start, start + subDuration],
						[1.2, 0.7],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.19, 0.8, 0.29, 0.93),
						}
					);
					return (
						<Series.Sequence durationInFrames={subDuration}>
							<div
								className="text-9xl font-bold h-fit mb-5 mt-auto w-full text-center"
								style={{transform: `scale(${scaleX},${scaleY})`}}
							>
								{speechMark.value}
							</div>
						</Series.Sequence>
					);
				})}
			</Series>
		</Sequence>
	);
};
