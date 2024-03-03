import {Easing, OffthreadVideo} from 'remotion';
import {useEffect, useState} from 'react';
import {
	AbsoluteFill,
	Series,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {staging} from './constants';

function getBgUrls(obj) {
	const bgUrls = [];
	for (const key in obj) {
		if (key === 'assetUrl') {
			bgUrls.push(obj[key]);
		} else if (typeof obj[key] === 'object') {
			bgUrls.push(...getBgUrls(obj[key]));
		}
	}
	return bgUrls;
}

export const Bg = ({format}) => {
	const frame = useCurrentFrame();
	const [bgUrls, setBgUrls] = useState([]);
	const {durationInFrames} = useVideoConfig();
	useEffect(() => {
		setBgUrls(getBgUrls(format));
	}, [format]);
	return (
		<AbsoluteFill>
			<Series>
				{bgUrls.map((bgUrl, i) => {
					const subDuration = Math.ceil(durationInFrames / bgUrls.length);
					const opacity = interpolate(
						frame,
						[subDuration * i, subDuration * (i + 0.5), subDuration * (i + 1)],
						[0.1, 0.5, 0.1],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.93, 0.26, 0.65, 0.58),
						}
					);
					return (
						<Series.Sequence durationInFrames={subDuration}>
							<div className="w-full h-full" style={{opacity}}>
								<OffthreadVideo
									muted
									className="w-full h-full object-cover"
									src={staging ? staticFile('bg.mp4') : bgUrl}
									onError={() => {}}
								/>
							</div>
						</Series.Sequence>
					);
				})}
			</Series>
		</AbsoluteFill>
	);
};
