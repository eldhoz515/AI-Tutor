import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const AiTutor = (props) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	return <AbsoluteFill></AbsoluteFill>;
};
