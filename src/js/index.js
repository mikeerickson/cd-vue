const Vue     = require('vue');
const msg     = require('cd-messenger');
const pkgInfo = require('../../package.json');

// application wide sass (each component may have their own sass as well)
// import '!style-loader!css-loader!sass-loader!../sass/app.scss';
Vue.component('form-it', require('./components/FormIt.vue'));

let states = [
		{name: 'az', value: 'AZ'},
		{name: 'ca', value: 'CA'},
		{name: 'ny', value: 'NY'},
	];

new Vue({
	el: '#v-app',
	data: {
		appName:    pkgInfo.appName,
    appVersion: pkgInfo.version,
    states:     states,
    header: [
			{type: 'html', value: '<h3>Form Header Value</h3>'},
			{type: 'button', label: 'Submit'},
			{type: 'html', value: '<br /><br />'}
		],
    footer: [
    	{type: 'button', label: 'Submit'}
		],
    fields: [
			{key: 'fname', type: 'text', label: 'First Name', required: true, validators: [
				{length: "value.length > 3", errorMsg: "First Name must be at least 3 characters"},
				{value: "value === 'Brady'", errorMsg: "First Name must be Brady"}
			]},
			{key: 'lname', type: 'text', label: 'Last Name', validators: [
				{value: "value === 'Erickson'", errorMsg: "Last Name must be Erickson"}
			]},
			{key: 'dob', type: 'date', label: 'DOB'},
			{key: 'state', type: 'select', label: 'State', options: states, validators: [
				{value: "value === 'CA'"}
			]},
			{key: 'gender', type: 'radio', label: 'Gender', choices: {male: 'Male', female: 'Female'}, validators: [
				{value: "value !== ''"}
			]},
			{key: 'married', type: 'checkbox', label: 'Married', validators: [
				{value: "isTruthy(value)"}
			]},
			{key: 'bio', type: 'textarea', label: 'Biography', attrs: {rows: 5, cols: 65}, validators: [
				{length: "value.length > 10"}
			]}
		],
    model: [
      {key: 'fname', value: 'Brady'},
      {key: 'lname', value: 'Erickson'},
      {key: 'dob', value: '1993-02-28'},
      {key: 'bio', value: 'now is the time for all good men to come the aid of their country and fight, fight for the right to win!  Impeach Trump!'},
      {key: 'state', value: 'ca'},
      {key: 'gender', value: 'male'},
      {key: 'married', value: true}
    ]
  },
	methods: {},
	computed: {},
	mounted: function () {
		msg.success(` === ${this.appName} Vue Ready === `);
	}
});
