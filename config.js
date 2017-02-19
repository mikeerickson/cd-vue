/*global module*/

const config = {
	path: {
		entry:   './src/js/index.js',
		public:  './public',
    output:  './public',
    sass:    './src/sass/**/*.scss',
    scripts: './src/js/**/*.js',
    tests:   './test/**/*.test.js',
    specs:   './specs/**/*Spec.js'
	}
};

module.exports = config;
