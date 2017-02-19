const msg = require('cd-messenger');
const pkgInfo = require('../../package.json');

// application wide sass (each component may have their own sass as well)
// import '!style-loader!css-loader!sass-loader!../sass/app.scss';

new Vue({
	el: '#v-app',
	data: {
		appName: pkgInfo.appName,
        appVersion: pkgInfo.version
	},
	methods: {},
	computed: {},
	mounted: function () {
		msg.success(` === ${this.appName} Vue Ready === `);
	}
});
