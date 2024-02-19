/* eslint-disable no-case-declarations */
import {Img, useVideoConfig} from 'remotion';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ImageBox} from './ImageBox';
import {imageAnimations, subLength} from './constants';
import {Operator} from './Operator';
import {getRandom, getRandomColor} from './utils';

export const Fg = ({format, from, width, height}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	switch (format.operation) {
		case '=':
		case '+':
		case '&':
		case '->':
		case 'verb':
			const showAsRow = ['=', 'verb'].includes(format.operation);
			const contentLength = format.content.length;
			const subWidth = showAsRow ? 100 / contentLength - 5 : subLength;
			const subHeight = showAsRow ? subLength : 90 / contentLength - 5;
			return (
				<div
					className={` h-full flex ${
						showAsRow ? 'flex-row' : 'flex-col'
					} justify-between items-center p-[3%]`}
					style={{width: `${width}%`, height: `${height}%`}}
				>
					{format.content.map((subFormat, i) => {
						return (
							<>
								<Fg
									format={subFormat}
									from={
										from +
										Math.ceil(((durationInFrames - from) * i) / contentLength)
									}
									width={subWidth}
									height={subHeight}
								/>
								{i < contentLength - 1 && (
									<Operator
										format={format}
										from={
											from +
											Math.ceil(
												((durationInFrames - from) * (i + 1 / 2)) /
													contentLength
											)
										}
										textColor={getRandomColor(
											format.operation === 'verb'
												? format.verb
												: format.operation
										)}
									/>
								)}
							</>
						);
					})}
				</div>
			);

		case 'asset':
			return (
				<ImageBox
					format={format}
					width={width}
					height={height}
					from={from}
					animation={getRandom(format.expression, Object.keys(imageAnimations))}
					textColor={getRandomColor(format.expression)}
				/>
			);
		default:
			return null;
	}
};
