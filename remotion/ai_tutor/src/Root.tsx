import {Composition, getInputProps} from 'remotion';
import {AiTutor} from './AiTutor';
import {FPS, props} from './constants';
import {getDurationInFrames} from './utils';
import './style.css';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	// const props = getInputProps();

	const durationInFrames = getDurationInFrames(props.speechMarks.duration);
	return (
		<>
			<Composition
				id="AiTutor"
				component={AiTutor}
				width={1920}
				height={1080}
				durationInFrames={durationInFrames}
				fps={FPS}
				defaultProps={props}
			/>
		</>
	);
};
