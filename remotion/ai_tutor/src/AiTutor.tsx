import {Easing} from 'remotion';
import {Audio, interpolate, staticFile} from 'remotion';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {bgmDuration, staging, voiceLocationPrefix} from './constants';
import {getDurationInFrames} from './utils';
import Subtitle from './Subtitle';
import {Fg} from './Fg';
import {Bg} from './Bg';

export const AiTutor = (props) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const scale = interpolate(
		frame,
		[durationInFrames - fps * 0.5, durationInFrames],
		[1, 0.7],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.19, 0.8, 0.29, 0.93),
		}
	);
	const opacity = interpolate(
		frame,
		[durationInFrames - fps * 0.5, durationInFrames],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.19, 0.8, 0.29, 0.93),
		}
	);
	return (
		<AbsoluteFill className="bg-black">
			<Audio
				src={
					staging
						? staticFile('voice.mp3')
						: `${voiceLocationPrefix}/${props.audioKey}.mp3`
				}
				startFrom={getDurationInFrames(props.speechMarks.start)}
				// volume={0.1}
			/>
			<Audio
				src={staticFile('bgm.mp3')}
				volume={0.01}
				startFrom={getDurationInFrames(props.speechMarks.start % bgmDuration)}
			/>
			<Bg format={props.format} />
			<AbsoluteFill style={{transform: `scale(${scale})`, opacity}}>
				<Fg format={props.format} from={0} width={100} height={100} />
			</AbsoluteFill>
			<Subtitle speechMarks={props.speechMarks.speechMarks} />
		</AbsoluteFill>
	);
};
