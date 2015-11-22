
'use strict';

module.exports = {
	readdirWorker: function(path, list) {
		var that = this;

		// prerequisites
		this.fs   = require('fs');
		this.path = require('path');

		// normalize path
		path = this.path.normalize(path);

		// pause the queue
		this.pause(true);
		
		// make async call
		this.walkWorker(path, function(err, list) {
			// resume queue
			that.resume(list);
		});
	},
	walkWorker: function(path, callback, level) {
		var that = this,
			results = [],
			fs = this.fs,
			sep = '/';
		fs.readdir(path, function(err, list) {
			if (err) return callback(err);
			var pending = list.length;
			if (!pending) return callback(null, results);
			list.forEach(function(file) {
				file = path + sep + file;
				fs.stat(file, function(err, stat) {
					if (stat && stat.isDirectory()) {
						results.push(file);
						if (level === 1) {
							if (!--pending) callback(null, results);
							return;
						}
						that.walkWorker(file, function(err, res) {
							results = results.concat(res);
							if (!--pending) callback(null, results);
						});
					} else {
						results.push(file);
						if (!--pending) callback(null, results);
					}
				});
			});
		});
	}
};
