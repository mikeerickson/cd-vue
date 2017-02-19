const msg = require('cd-messenger');

new Vue({
	el: 'v-app',
	methods: {},
	computed: {},
	mounted: function() {
		msg.success('Vue Ready!');
	}
});