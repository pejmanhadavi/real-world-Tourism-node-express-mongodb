const gm = require('gm').subClass({imageMagick: true});

exports.resizeImage = imageName => {
	gm('./public/uploads/'+imageName)
		.thumb(250,250 ,'./public/uploads/'+imageName, 60,  err => {
			if (err)
				console.log(err);
			console.log('done');
		});
};