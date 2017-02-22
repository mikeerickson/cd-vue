<template id="form-it">
    <div class="form-it">
        <form class="form-it-form" @change="handleFormChange($event, fields, model)" @submit="handleFormSubmit($event, fields, model)">
            <div v-for="field in fields" class="form-group">
                <span v-html="formLabel(field)"></span>
                <span v-html="formInput(field, model)"></span>
            </div>
            <button>Submit</button>
        </form>
    </div>
</template>

<script id="form-it">

    let $        = require('jquery');
    let msg      = require('cd-messenger');
    let isTruthy = require('truthy');

    export default {
	  props: ['model', 'fields'],
      data() {
      	return {
          data: {},
          formFields: this.fields,
          formModel: this.model
        };
      },
      methods: {
        formLabel: (field) => {
					let obj = '';
					if ((field.type === 'select') || (field.type === 'text') || (field.type === 'date')) {
						obj += `<label for="${field.key}">${field.label}</label>`;
						if(field.type === 'select') {
							obj += '<br />';
                        }
					}
					return obj;
				},
	  	formInput: (field, data) => {
          return buildInput(field, data);
        },
        formValue: (key, data) => {
			return(getValue(key, data));
        },
        formValidation: () => {},
        handleFormChange: (evt, fields, model) => {
			let errors = formValidation(evt, fields, model);
			return handleFormErrors(errors);
        },
        handleFormSubmit: (evt, fields, model) => {
	  		evt.preventDefault();
	  		let errors = formValidation(evt, fields, model);
	  		if(errors.length > 0) {
	  			msg.error('Handle Errors Here');
	  			handleFormErrors(errors);
	  			return false;
            }
	  		msg.success('Handle Form Submit');
        },
      }
	};

	function buildInput(field, data) {
		let value = getValue(field.key, data);
        let obj   = '';
        switch(field.type) {
          case 'text':
            obj = `<input
                type="${field.type}"
                id="${field.key}"
                name="${field.key}"
                class="form-control"
                value="${value}" ${field.readonly ? 'readonly': ''}
                ${field.disabled ? 'disabled': ''}
                required="${field.required}"
            />`;
            break;
          case 'checkbox':
            obj = `<input
                type="${field.type}"
                id="${field.key}"
                name="${field.key}"
                class="form-check-input"
                ${(field.readonly || field.disabled) ? 'disabled' : ''}
                onClick="(this.checked ? this.value = true : this.value = false)"
                ${isTruthy(value) ? 'checked' : ''}
                value="${value}"
            /> <label for="${field.key}">${field.label}</label>`;
            break;
          case 'radio':
                let keys   = Object.keys(field.choices);
                let values = Object.values(field.choices);
                if (keys.length > 1) {
                    keys.forEach((choice, idx) => {
                        let checked  = (value.toLowerCase() === choice.toLowerCase()) ? 'checked' : '';
                        let disabled = field.disabled ? 'disabled' : '';
                        obj +=
                          `<input ${checked}
                              type="radio"
                              id="${field.key}"
                              ${checked}
                              ${disabled}
                              name="${field.key}"
                              value="${choice.toLowerCase()}" ${disabled}> ${values[idx]} &nbsp;
                          `;
                    });
                } else {
                    msg.error(`[${field.key}] Configuration Error (Invalid Choices)`);
                }
                break;
          case 'textarea':
            obj = `<label for="${field.key}">${field.label}</label> <br />
                 <textarea id="${field.key}" name="${field.key}" ${addAttributes(field.attrs)}>${value}</textarea>`;
            break;
          case 'select':
          	let options = '';
          	field.options.forEach((item) => {
          		options += `<option ${item.name === value ? 'selected' : ''} name=${item.name}>${item.value}</option>`;
            });
          	obj = `<select id="${field.key}" name="${field.key}">${options}</select>`;
          	break;
          default:
            obj = `<input
                type="${field.type}"
                id="${field.key}"
                name="${field.key}"
                class="form-control"
                value="${value}" ${field.readonly ? 'readonly': ''}
                ${field.disabled ? 'disabled': ''}
                required="${field.required}"
            />`;
            break;
        }
        obj += buildFieldError(field);
        return obj;
    }

    function getValue(key, data) {
        let result = data.find((field) => { return field.key == key; })
        return result ? result.value : '';
    }

    function addAttributes(attrs) {
		let result = '';
		let keys   = Object.keys(attrs);
		let values = Object.values(attrs);
		for(let i = 0; i < keys.length; i++) {
			result += ' ' + keys[i] + '=' + values[i];
        }
        return result;
    }

    function formValidation(evt, fields, model) {
		let event = evt;
		let form = evt.currentTarget;
		let errors = [];

		fields.forEach((input, idx, fields, model) => {
			let value = '';
			for(let i = 0; i < form.length; i++) {
				if(form[i].id === input.key) {
					value = form[i].value;
                }
            }
			let validators = input.validators;
			if(input.hasOwnProperty('validators')) {
                for(let i = 0; i < validators.length; i++) {
                	let validator = validators[i];
                    let errorMsg  = validator.hasOwnProperty('errorMsg') ? validator.errorMsg : '';
                	let result    = false;
                    let key       = Object.keys(validators[i])[0];
                    let rule      = validators[i][key].replace('model','value');

                    if(rule === 'isTruthy(value)') {
                    	result = isTruthy(value);
                    }
                    else {
                        result = eval(rule);
                    }

                    if(!result) {
                        errors.push({
                          key:      fields[idx].key,
                          rule:     rule,
                          actual:   value,
                          type:     fields[idx].type,
                          errorMsg: errorMsg
                        });
                        let node = $(`#${fields[idx].key}`);
                        if(node.type === 'checkbox') {
                        	node = $(`label[for="${fields[idx].key}"]`);
                        	if (node.hasClass('form-it-dirty')) {
                                node.addClass('form-it-clean-checkbox');
                                node.removeClass('form-it-error-checkbox');
                            }
                        } else {
                            if(node.hasClass('form-it-dirty') > 0) {
                                node.addClass('form-it-clean');
                                node.removeClass('form-it-error');
                            }
                        }
                    } else {
                        let errorBlock = $(`#error-${fields[idx].key}`);
						errorBlock.addClass('hide');
						let node = $(`#${fields[idx].key}`);
						if(fields[idx].type === 'checkbox') {
                            node = $(`label[for="${fields[idx].key}"]`);
						    node.removeClass('form-it-error-checkbox');
                            if(node.hasClass('form-it-dirty')) {
                                node.addClass('form-it-clean-checkbox');
                            }
                        } else {
                            node.removeClass('form-it-error');
							if(node.hasClass('form-it-dirty')) {
								node.addClass('form-it-clean');
                            }
                        }
                    }
                }
            }

        });
		return errors;
    }

    function handleFormErrors(errors) {

		// clear all errors, they will be recreated below
		errors.forEach((error) => {
            $(`#error-${error.key}`).html('');
        });

		errors.forEach((error) => {
			let id = error.key;
			if(error.type === 'checkbox') {
				let node = $(`label[for="${id}"]`);
                node.removeClass('form-it-clean-checkbox');
                node.addClass('form-it-error-checkbox');
                node.addClass('form-it-dirty');
            } else {
                let node = $(`#${id}`);
                node.removeClass('form-it-clean');
                node.addClass('form-it-error');
                node.addClass('form-it-dirty');
            }
			let errorBlock = $('#error-' + id);
			let errMsgs = errorBlock.html();
			errMsgs += `<div class=".form-it-error-item">✘ ${error.errorMsg} [Actual Value: ${error.actual}]</div>`;
            errorBlock.html(errMsgs);
			errorBlock.removeClass('hide');
        });

		return errors.length > 0;
    }

    function buildFieldError(field) {
		return (`
            <div class="form-it-error-block hide" id="error-${field.key}"></div>
        `);
    }

</script>

<style id="form-it">
    form.form-it-form .form-it-error {
        background: pink;
        border: 1px solid red;
    }
    form.form-it-form .form-it-error-block {
        margin-top: 3px;
        padding-left: 5px;
        padding-right: 5px;
        background: pink;
        border: 1px solid red;
        border-radius: 3px;
        font-size: .8em;
        color: red;
        font-weight: bold;
    }
    form.form-it-form .form-it-clean {
        background: lightgreen;
        border: 1px solid green;
    }
    form.form-it-form .form-it-error-checkbox {
        color: red;
    }
    form.form-it-form .form-it-clean-checkbox {
        color: black;
    }
    form.form-it-form .form-it-dirty.form-it-clean-checkbox {
        color: green;
    }
</style>