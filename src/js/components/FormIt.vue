<template>
    <div class="form-it">
        <form :id="id" class="form-it-form" @change="handleFormChange($event, fields)" @submit="handleFormSubmit($event, fields, model)">
            <div v-for="item in header" class="form-it-footer">
                <span v-html="formObject(item)"></span>
            </div>


            <div v-for="field in fields" class="form-group">
                <form-it-input :field="field" :model="formModel">This is transclude (aka slot)</form-it-input>
                <!--<span v-html="formLabel(field)"></span>-->
                <!--<span v-html="formInput(field, model)"></span>-->
            </div>
            <div v-for="item in footer" class="form-it-footer">
                <span v-html="formObject(item)"></span>
            </div>
        </form>
    </div>
</template>

<script>

    import $           from 'jquery';
    import msg         from 'cd-messenger';
    import isTruthy    from 'truthy';
    import swal        from 'sweetalert2';
    import FormItInput from './FormItInput.vue';

    export default {
      components: {
      	FormItInput
      },
      name: "form-it",
      props: ['id', 'model', 'fields', 'header', 'footer'],
      data() {
        return {
          formID:     this.id,
          formData:   [],
          formFields: this.fields,
          formModel:  this.model
        };
      },
      methods: {
        formObject: (item) => {
            let obj = '';
            switch (item.type) {
              case 'html':
                obj = item.value;
                break;
              case 'button':
                obj = '<' + item.type + '>' + item.label + '</' + item.type + '>';
                break;
            }
            return obj;
        },
        buildFieldError: (item) => {
        	return _buildFieldError(item);
        },
        handleFormChange: function (evt, fields) {
			this.formData = updateFormData();
			let errors = formValidation(evt, fields);
			if (errors.length > 0) {
			    this.formData = this.formData.concat({errors});
            }
			return handleFormErrors(errors);
        },
        handleFormSubmit: function (evt, fields, model) {
            evt.preventDefault();

            this.formData = updateFormData();
            let errors    = formValidation(evt, fields, model);
            if (errors.length > 0) {
                this.formData = this.formData.concat({errors});
                handleFormErrors(errors);
                errorDialog(`Form contains ${errors.length} ${errors.length > 1 ? 'errors' : 'error'}`);
                return false;
            }

//            successDialog('Form Validation Passed');
            msg.success('Handle Form Submit');

        }
      }
	};

    function updateFormData(form = null) {
    	let formData = (form) ? form.target : document.querySelectorAll('.form-it-form')[0];
        let data = [];
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].id !== '') {
                data.push(
                	{
                      id: formData[i].id,
                      value: formData[i].value,
                      required: formData[i].required
                	}
                );
            }
        }

        let resultData = [];
        resultData.push({form: {id: formData.id}});
        resultData.push({data: data});

        return resultData;
    }

    function errorDialog(msg, options = {icon: true}) {
        swal({
            title: 'Error!',
            width: 300,
            type: options.icon ? 'error' : '',
            text: msg,
            confirmButtonText: 'Abort'
        });
    }

    function successDialog(msg, options = {icon: true}) {
        swal({
            title: 'Success!',
            width: 300,
            text: msg,
            type: options.icon ? 'success' : '',
            confirmButtonText: 'OK'
        });
    }

    function formValidation(evt, fields) {
		let event = evt;
		let form = evt.currentTarget;
		let errors = [];

		fields.forEach((input, idx, fields) => {
			let value = '';
			for (let i = 0; i < form.length; i++) {
				if (form[i].id === input.key) {
					value = form[i].value;
                }
            }
			let validators = input.validators;
			if (input.hasOwnProperty('validators')) {
                for (let i = 0; i < validators.length; i++) {
                    let validator = validators[i];
                    let errorMsg  = validator.hasOwnProperty('errorMsg') ? validator.errorMsg : '';
                    let result    = false;
                    let key       = Object.keys(validators[i])[0];
                    let rule      = validators[i][key].replace('model','value');

                    if (rule === 'isTruthy(value)') {
                        result = isTruthy(value);
                    }
                    else {
                        result = eval(rule);
                    }

                    if (!result) {
                        errors.push({
                          key:      fields[idx].key,
                          rule:     rule,
                          actual:   value,
                          type:     fields[idx].type,
                          errorMsg: errorMsg
                        });
                        let node = $(`#${fields[idx].key}`);
                        if (node.type === 'checkbox') {
                            node = $(`label[for="${fields[idx].key}"]`);
                            if (node.hasClass('form-it-dirty')) {
                                node.addClass('form-it-clean-checkbox');
                                node.removeClass('form-it-error-checkbox');
                            }
                        }
                        else {
                            if (node.hasClass('form-it-dirty') > 0) {
                                node.addClass('form-it-clean');
                                node.removeClass('form-it-error');
                            }
                        }
                    }
                    else {
                        let errorBlock = $(`#error-${fields[idx].key}`);
						errorBlock.addClass('hide');
						let node = $(`#${fields[idx].key}`);
						if (fields[idx].type === 'checkbox') {
                            node = $(`label[for="${fields[idx].key}"]`);
                            node.removeClass('form-it-error-checkbox');
                            if (node.hasClass('form-it-dirty')) {
                                node.addClass('form-it-clean-checkbox');
                            }
                        }
                        else {
                            node.removeClass('form-it-error');
							if (node.hasClass('form-it-dirty')) {
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
			if (error.type === 'checkbox') {
				let node = $(`label[for="${id}"]`);
                node.removeClass('form-it-clean-checkbox');
                node.addClass('form-it-error-checkbox');
                node.addClass('form-it-dirty');
            }
            else {
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

    function _buildFieldError(field) {
		return (`
            <div class="form-it-error-block" id="error-${field.key}"></div>
        `);
    }

</script>

<style >
    form.form-it-form .form-it-error {
        background: pink;
        border: 1px solid red;
    }

    .form-it-error-block {
        margin-top: 5px;
        padding: 10px 5px 10px 10px;
        background: pink;
        border: 1px solid red;
        border-radius: 3px;
        font-size: .8em;
        color: red;
        font-weight: bold;
    }

    .form-it-form .form-it-clean {
        background: lightgreen;
        border: 1px solid green;
    }
    .form-it-form .form-it-error-checkbox {
        color: red;
    }
    .form-it-form .form-it-clean-checkbox {
        color: black;
    }
    .form-it-form .form-it-dirty.form-it-clean-checkbox {
        color: green;
    }
    .form-it-form {
        border: 3px solid lightyellow;
        border-radius: 6px;
        padding: 10px;
    }
    textarea {
        overflow-y: scroll;
        height: 150px;
        width: 650px;
        resize: none;
    }

</style>