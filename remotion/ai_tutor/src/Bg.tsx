import {Easing} from 'remotion';
import {useCallback, useEffect, useState} from 'react';
import {
	AbsoluteFill,
	Series,
	Video,
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
	const {durationInFrames, fps} = useVideoConfig();
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
						[0.02, 0.2, 0.02],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(.93,.26,.65,.58),
						}
					);
					return (
						<Series.Sequence durationInFrames={subDuration}>
							<div style={{opacity}}>
								<Video muted src={staging ? staticFile('bg.mp4') : bgUrl} />
							</div>
						</Series.Sequence>
					);
				})}
			</Series>
		</AbsoluteFill>
	);
};
