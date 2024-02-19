export const staging = true;
export const FPS = 30;
export const voiceLocationPrefix =
	'https://ai-tutor-s3.s3.ap-south-1.amazonaws.com/voices';
export const subLength = 80;
export const imageAnimations = {
	s: [1.3, 1],
	tx: [100, 1],
	ntx: [100, 0],
	ty: [100, 0],
	nty: [100, 0],
	rx: [45, 0],
	ry: [45, 0],
	rz: [45, 0],
};
export const props = {
	speechMarks: {
		speechMarks: [
			{time: 25, value: 'This'},
			{time: 213, value: 'is'},
			{time: 306, value: 'where'},
			{time: 431, value: 'the'},
			{time: 504, value: 'workers'},
			{time: 1154, value: 'CPU'},
			{time: 1919, value: 'place'},
			{time: 2138, value: 'the'},
			{time: 2221, value: 'data'},
			{time: 2513, value: 'and'},
			{time: 2586, value: 'instructions'},
			{time: 3117, value: 'they'},
			{time: 3231, value: 'are'},
			{time: 3283, value: 'currently'},
			{time: 3554, value: 'working'},
			{time: 3867, value: 'on'},
		],
		duration: 4.628,
		start: 25.964,
	},
	audioKey: 'test',
	format: {
		operation: 'verb',
		content: [
			{
				operation: 'asset',
				expression: 'CPU',
				assetType: 'video',
				assetUrl:
					'https://player.vimeo.com/external/199432825.hd.mp4?s=c2a13de8faf1942afaaaa6070bb0743a845bfc0d&profile_id=119&oauth2_token_id=57447761',
				googleImage:
					'https://4.imimg.com/data4/YD/WW/MY-31969445/brand-new-cpu-sealed-pack.jpg',
			},
			{
				operation: 'asset',
				expression: 'data',
				assetType: 'video',
				assetUrl:
					'https://player.vimeo.com/external/368789132.hd.mp4?s=33600fce2f968c7b3778ec3439df7d655a6f7585&profile_id=172&oauth2_token_id=57447761',
				googleImage:
					'https://upload.wikimedia.org/wikipedia/commons/6/6d/Data_types_-_en.svg',
			},
		],
		verb: 'places',
	},
};
