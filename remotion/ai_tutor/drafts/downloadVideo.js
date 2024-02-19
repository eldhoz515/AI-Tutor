import {downloadMedia} from '@remotion/lambda';
import dotenv from 'dotenv';
import renderIds from '../../../sample_data/renders.json' assert {type: 'json'};
dotenv.config();

const downloadVideo = async (renderId, i) => {
	try {
		const {outputPath, sizeInBytes} = await downloadMedia({
			bucketName: process.env.bucketName,
			region: process.env.region,
			renderId: renderId,
			outPath: `../renders/${i}.mp4`,
			onProgress: ({totalSize, downloaded, percent}) => {
				console.log(
					`Download progress: ${totalSize}/${downloaded} bytes (${(
						percent * 100
					).toFixed(0)}%)`
				);
			},
		});

		console.log(outputPath);
		console.log(sizeInBytes);
	} catch (e) {
		console.log(e);
	}
};
renderIds.forEach((renderId, i) => {
	downloadVideo(renderId, i);
});
