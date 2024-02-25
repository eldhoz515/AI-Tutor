import {Easing, useVideoConfig} from 'remotion';
import {Sequence, interpolate, useCurrentFrame} from 'remotion';
import {getDurationInFrames} from './utils';

const Subtitle = ({speechMark}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const scaleY = interpolate(frame, [0, durationInFrames], [1, 0.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.19, 0.8, 0.29, 0.93),
	});
	const scaleX = interpolate(frame, [0, durationInFrames], [1.2, 0.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.19, 0.8, 0.29, 0.93),
	});

	return (
		<div
			className="text-7xl font-bold h-fit mb-5 mt-auto w-full text-center"
			style={{
				transform: `scale(${scaleX},${scaleY})`,
			}}
		>
			{speechMark.value}
		</div>
	);
};

const SubtitleContainer = ({speechMarks}) => {
	return (
		<Sequence>
			{speechMarks.map((speechMark, i) => {
				const subDuration = getDurationInFrames(
					((speechMarks[i + 1]?.time || speechMark.time + 1000) -
						speechMark.time) /
						1000
				);
				const start = getDurationInFrames(speechMark.time / 1000);

				return (
					<Sequence from={start} durationInFrames={subDuration}>
						<Subtitle speechMark={speechMark} />
					</Sequence>
				);
			})}
		</Sequence>
	);
};

export default SubtitleContainer;
