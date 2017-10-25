
var qure = require('qure'),
	qureFs = require('qure-fs'),
	fs = require('fs'),
	path = require('path'),
	dir = path.join(__dirname, './black_lowres');

// get brands list
qure.declare(qureFs)
	.run('readdir', dir)
	.then(function(list) {
		
		list.map(function(filename) {
			var new_name = filename.replace(/.jpg-83%/, '.jpg');
			if (filename.indexOf('-83%') === -1) return;
			fs.renameSync(filename, new_name);
		});

	});
	