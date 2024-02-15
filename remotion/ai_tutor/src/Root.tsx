import {Composition, getInputProps} from 'remotion';
import {AiTutor} from './AiTutor';
import {FPS} from './constants';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	// const props = getInputProps();
	const props = {duration: 5, inputText: 'CPU = waiter.'};
	const durationInFrames = Math.ceil(props.duration * FPS);
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
