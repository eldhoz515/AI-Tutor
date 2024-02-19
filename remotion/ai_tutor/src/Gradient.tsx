export const Gradient = ({fill, offset, id}) => {
	return (
		<linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="100%">
			<stop offset="0%" style={{stopColor: fill}} />
			<stop offset={`${offset}%`} style={{stopColor: 'black'}} />
		</linearGradient>
	);
};