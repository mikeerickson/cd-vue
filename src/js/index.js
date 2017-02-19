const msg = require('cd-messenger');

new Vue({
	el: '#v-app',
	data: {},
	methods: {},
	computed: {},
	mounted: () => {
		msg.success('Vue Ready!');
	}
});