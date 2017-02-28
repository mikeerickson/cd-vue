const Vue     = require('vue');
const msg     = require('cd-messenger');
const pkgInfo = require('../../package.json');

// application wide sass (each component may have their own sass as well)
// import '!style-loader!css-loader!sass-loader!../sass/app.scss';

Vue.component('form-it', require('./components/FormIt.vue'));

const states = require('../../data/us-states.json');

new Vue({
	el: '#v-app',
	data: {
		appName:    pkgInfo.appName,
    appVersion: pkgInfo.version,
    states:     states,
    formID: 'testForm',
    header: [
			{type: 'html', value: '<h3>Form Header Value</h3>'},
			{type: 'button', label: 'Submit'},
			{type: 'html', value: '<br /><br />'}
		],
    footer: [
			{type: 'button', label: 'Submit'}
		],
    fields: [
			{key: 'fname', type: 'text', label: 'First Name', validators: [
				{rule: 'required', errorMsg: 'First Name is required'},
				{rule: 'length:3', errorMsg: 'First Name must be at least 3 characters'},
				{rule: 'value:Brady', errorMsg: 'First Name must be Brady'}
			]},
			{key: 'lname', type: 'text', label: 'Last Name', validators: [
				{rule: 'value:Erickson', errorMsg: 'Last Name must be Erickson'}
			]},
      {key: 'email', type: 'email', label: 'EMail', validators: [
        {rule: 'required', errorMsg: 'E-Mail Address Required'},
        {rule: 'email', errorMsg: 'Invalid E-Mail'}
      ]},
			{key: 'dob', type: 'date', label: 'DOB'},
			{key: 'state', type: 'select', label: 'State', options: states, validators: [
				{rule: 'value:CA', errorMsg: 'State must be CA - California'}
			]},
			{key: 'gender', type: 'radio', label: 'Gender', choices: {male: 'Male', female: 'Female'}, validators: [
				{rule: 'length:1'}
			]},
			{key: 'married', type: 'checkbox', label: 'Married', validators: [
				{value: 'isTruthy(value)', errorMsg: 'Must Be Married'}
			]},
			{key: 'bio', type: 'textarea', label: 'Biography', attrs: {rows: 5, cols: 50}, validators: [
				{rule: 'length:10', errorMsg: 'Biography must be at least 10 characters'}
			]}
		],
    model: [
      {key: 'fname', value: 'Brady'},
      {key: 'lname', value: 'Erickson'},
      {key: 'email', value: 'brady.erickson@mac.com'},
      {key: 'dob', value: '1993-02-28'},
      {key: 'bio', value: 'now is the time for all good men to come the aid of their country and fight, fight for the right to win!  Impeach Trump!'},
      {key: 'state', value: 'CA'},
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
