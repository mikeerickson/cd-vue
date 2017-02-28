<template>
  <div class="form-it">
    <form :id="id" class="form-it-form" @change="handleFormChange($event, fields)"
          @submit="handleFormSubmit($event, fields, model)">
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

  import $             from 'jquery';
  import msg           from 'cd-messenger';
  import isTruthy      from 'truthy';
  import swal          from 'sweetalert2';
  import FormItInput   from './FormItInput.vue';
  import itemValidator from 'validator';            // https://www.npmjs.com/package/validator

  export default {
    components: {
      FormItInput
    },
    name: 'form-it',
    props: ['id', 'model', 'fields', 'header', 'footer'],
    data() {
      return {
        formID: this.id,
        formData: [],
        formFields: this.fields,
        formModel: this.model
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
        let errors = formValidation(evt, fields, model);
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

  function validate(rule, value) {
  	let opts = '';
    let pos = rule.indexOf(':');
  	if (pos > 0) {
  		opts = rule.substr(pos + 1);
  		rule = rule.substr(0, pos);
    }

  	switch (rule) {
      case 'email':
        return itemValidator.isEmail(value);
      case 'required':
        return !itemValidator.isEmpty(value);
      case 'length':
        if (opts.length !== 0) {
          let [min, max] = opts.split(';');
          if (typeof max === 'undefined') {
            max = value.length;
          }
          return itemValidator.isLength(value, {min, max});
        }
        else {
          return true;
        }
      case 'value':
        return itemValidator.equals(opts, value);
    }
    return true;
  }

  function formValidation(evt, fields) {
    let event  = evt;
    let form   = evt.currentTarget;
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
          let rule      = validators[i][key].replace('model', 'value');
          let validRule = validator.hasOwnProperty('rule') ? validator.rule : '';

          if (validRule !== '') {
            result = validate(validRule, value);
          }
          else {
            if (rule === 'isTruthy(value)') {
              result = isTruthy(value);
            }
            else {
              result = eval(rule);
            }
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
              if (node.hasClass('form-it-input-dirty')) {
                node.addClass('form-it-input-clean-checkbox');
                node.removeClass('form-it-input-error-checkbox');
              }
            }
            else {
              if (node.hasClass('form-it-input-dirty') > 0) {
                node.addClass('form-it-input-clean');
                node.removeClass('form-it-input-error');
              }
            }
          }
          else {
            let errorBlock = $(`#error-${fields[idx].key}`);
            errorBlock.addClass('hide');
            let node = $(`#${fields[idx].key}`);
            if (fields[idx].type === 'checkbox') {
              node = $(`label[for="${fields[idx].key}"]`);
              node.removeClass('form-it-input-error-checkbox');
              if (node.hasClass('form-it-input-dirty')) {
                node.addClass('form-it-input-clean-checkbox');
              }
            }
            else {
              node.removeClass('form-it-input-error');
              if (node.hasClass('form-it-input-dirty')) {
                node.addClass('form-it-input-clean');
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
        node.removeClass('form-it-input-clean-checkbox');
        node.addClass('form-it-input-error-checkbox');
        node.addClass('form-it-input-dirty');
      }
      else {
        let node = $(`#${id}`);
        node.removeClass('form-it-input-clean');
        node.addClass('form-it-input-error');
        node.addClass('form-it-input-dirty');
      }
      let errorBlock = $('#error-' + id);
      let errMsgs = errorBlock.html();
      errMsgs += `<div>✘ ${error.errorMsg}</div>`;
      errorBlock.html(errMsgs);
      errorBlock.removeClass('hide');
    });

    return errors.length > 0;
  }

</script>

<style lang="sass">

  .form-it-form {
    border: 3px solid lightyellow;
    border-radius: 6px;
    padding: 10px; }

    textarea {
      overflow-y:scroll;
      height: 150px;
      resize:none;
  }

</style>
