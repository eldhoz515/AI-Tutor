import {FPS} from './constants';
import {random} from 'remotion';
export const getDurationInFrames = (duration) => {
	return Math.ceil(duration * FPS);
};

export const getRandom = (id, arr) => {
	const idx = Math.floor(random(id) * arr.length);
	return arr[idx];
};

export const getRandomColor = (id) => {
	return '#' + (((1 << 24) * random(id)) | 0).toString(16).padStart(6, '0');
};
