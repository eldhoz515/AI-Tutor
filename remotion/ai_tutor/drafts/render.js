import {renderMediaOnLambda} from '@remotion/lambda/client';
import dotenv from 'dotenv';
dotenv.config();

const props = {
	speechMarks: {
		speechMarks: [
			{time: 25, value: 'Storage'},
			{time: 719, value: 'Hard'},
			{time: 969, value: 'Drive'},
			{time: 1250, value: 'or'},
			{time: 1385, value: 'SSD'},
			{time: 2160, value: 'The'},
			{time: 2254, value: 'storage'},
			{time: 2660, value: 'in'},
			{time: 2712, value: 'a'},
			{time: 2754, value: 'computer'},
			{time: 3160, value: 'is'},
			{time: 3223, value: 'similar'},
			{time: 3546, value: 'to'},
			{time: 3650, value: 'the'},
			{time: 3723, value: 'filing'},
			{time: 4066, value: 'cabinets'},
			{time: 4483, value: 'or'},
			{time: 4556, value: 'storage'},
			{time: 4900, value: 'units'},
			{time: 5160, value: 'in'},
			{time: 5212, value: 'an'},
			{time: 5275, value: 'office'},
		],
		duration: 6.14,
		start: 34.766,
	},
	audioKey: 'test',
	format: {
		operation: '=',
		content: [
			{
				operation: 'asset',
				expression: 'Storage',
				assetType: 'video',
				assetUrl:
					'https://player.vimeo.com/external/365676668.hd.mp4?s=7cddfb398ff807b75b5e4b32b8533c6917ccd1a3&profile_id=170&oauth2_token_id=57447761',
				googleImage:
					'https://spacevalet.in/wp-content/uploads/2023/10/storage-solutions-Bangalore.png',
			},
			{
				operation: 'asset',
				expression: 'filing cabinets',
				assetType: 'video',
				assetUrl:
					'https://player.vimeo.com/external/381327124.hd.mp4?s=005337dbfc67ac11961c98dd09b31a6a2c868af9&profile_id=175&oauth2_token_id=57447761',
				googleImage:
					'https://5.imimg.com/data5/SELLER/Default/2023/9/345729310/MD/AB/IA/182872199/office-file-cabinet-500x500.jpg',
			},
		],
	},
};

const response = await renderMediaOnLambda({
	region: process.env.region,
	functionName: process.env.functionName,
	composition: 'AiTutor',
	serveUrl: process.env.serveUrl,
	codec: 'h264',
	inputProps: props,
});

console.log(response);
