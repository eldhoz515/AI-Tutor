import {Composition, getInputProps} from 'remotion';
import {AiTutor} from './AiTutor';
import {FPS, props} from './constants';
import {getDurationInFrames} from './utils';
import './style.css';

export const RemotionRoot: React.FC = () => {
	const props = getInputProps();

	const durationInFrames = getDurationInFrames(props.speechMarks.duration);
	return (
		<>
			<Composition
				id="AiTutor"
				component={AiTutor}
				width={1280}
				height={720}
				durationInFrames={durationInFrames}
				fps={FPS}
				defaultProps={props}
			/>
		</>
	);
};
