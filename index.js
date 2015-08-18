var through = require("through2"),
	gutil = require("gulp-util");
	_ = require("lodash");

module.exports = function (param) {
	"use strict";

	param = param || {};

	if (!param) {
		throw new gutil.PluginError("gulp-clean-json", "No param supplied");
	}

	function cleanJson(file, enc, callback) {
		/*jshint validthis:true*/

		// Do nothing if no contents
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {

			// accepting streams is optional
			this.emit("error",
				new gutil.PluginError("gulp-clean-json", "Stream content is not supported"));
			return callback();
		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {

			var content = JSON.parse(String(file.contents));

			var removeEmpty = function filter(obj) {
		    _.each(obj,function(value, key){
		    	if (value === "" || _.isNull(value) || _.isEmpty(value)) {
		    		delete obj[key];
		    	} else if (_.isPlainObject(value)) {
		    		filter(value);
		    	} else if (_.isArray(value)) {
		    		_.each(value, function(arrayElement){
		    			filter(arrayElement);
		    		})
		    	}
		    });
			}

			removeEmpty(content);
			removeEmpty(content);

			file.contents = new Buffer(JSON.stringify(content, null, 2));

			this.push(file);

		}
		return callback();
	}

	return through.obj(cleanJson);
};
