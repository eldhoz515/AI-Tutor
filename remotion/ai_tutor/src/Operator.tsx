import {Sequence} from 'remotion';

export const Operator = ({format, from}) => {
	if (format.operation == 'verb') {
		return (
			<Sequence from={from} layout="none">
				<div className="text-7xl">{format.verb}</div>
			</Sequence>
		);
	}
	return (
		<Sequence from={from} layout="none">
			<div className="text-7xl">{format.operation}</div>
		</Sequence>
	);
};
