<template>
    <div class="form-it-input form-group">
        <span v-html="formLabel(field)"></span>
        <span v-html="formInput(field, model)"></span>
    </div>
</template>

<script>
    import isTruthy from 'truthy';
    import msg      from 'cd-messenger';

    export default {
      name: 'form-it-input',
      props: ['field','model'],
      data: function () {
      	return {

        }
      },
      methods: {
        formLabel: (field) => {
        	return _buildLabel(field);
        },
        formInput: (field, data) => {
        	return _buildInput(field, data);
        }
      },

    };

    /* ==================================================================
     * COMPONENT PRIVATE METHODS
     * ================================================================== */

    function _addAttributes(attrs = null) {
        let result = '';
    	if (attrs) {
            let keys   = Object.keys(attrs);
            let values = Object.values(attrs);
            for (let i = 0; i < keys.length; i++) {
                result += ' ' + keys[i] + '=' + values[i];
            }
        }
        return result;
    }

    function _getValue(key, data) {
        let result = data.find((field) => { return field.key === key; });
        return result ? result.value : '';
    }

    function _buildLabel(field) {
        let obj = '';
        if ((field.type === 'select') || (field.type === 'text') || (field.type === 'date')) {
            obj += `<label for="${field.key}">${field.label}</label>`;
            if (field.type === 'select') {
                obj += '<br />';
            }
        }
        return obj;
    }

    function _buildInput(field, data) {
        let value = _getValue(field.key, data);
        let obj   = '';
        switch (field.type) {
            case 'text':
                obj = `
                    <input
                        type="${field.type}"
                        id="${field.key}"
                        name="${field.key}"
                        class="form-control"
                        value="${value}" ${field.readonly ? 'readonly' : ''}
                        ${field.disabled ? 'disabled' : ''}
                        required="${field.required}"
                    />
                `;
                break;
            case 'checkbox':
                obj = `
                    <input
                        type="${field.type}"
                        id="${field.key}"
                        name="${field.key}"
                        class="form-check-input"
                        ${(field.readonly || field.disabled) ? 'disabled' : ''}
                        onClick="(this.checked ? this.value = true : this.value = false)"
                        ${isTruthy(value) ? 'checked' : ''}
                        value="${value}"
                    /> <label for="${field.key}">${field.label}</label>
                `;
                break;
            case 'radio':
                let keys   = Object.keys(field.choices);
                let values = Object.values(field.choices);
                if (keys.length > 0) {
                	keys.forEach((choice, idx) => {
                        let checked  = (value.toLowerCase() === choice.toLowerCase()) ? 'checked' : '';
						let disabled = field.disabled ? 'disabled' : '';
						obj += `
						    <input
						        type="radio"
						        id="${field.key}"
						        ${disabled}
						        name="${field.key}"
                                value="${choice.toLowerCase()}" ${disabled}> ${values[idx]}
						`;
                    });
                }
            	break;
            case 'textarea':
            	obj = `
            	    <label for="${field.key}">${field.label}</label> <br />
            	    <textarea id="${field.key}" name="${field.key}" ${_addAttributes(field.attrs)}>${value}</textarea>
            	`;
                break;
            case 'select':
                let options = '';
                field.options.forEach((item) => {
                    options += `<option ${item.name === value ? 'selected' : ''} value="${item.name}">${item.value}</option>`;
                });
                obj = `
                    <select id="${field.key}" name="${field.key}">${options}</select>
                `;
                break;
            case 'date':
                obj = `
                    <input
                        type="${field.type}"
                        id="${field.key}"
                        name="${field.key}"
                        class="form-control"
                        value="${value}" ${field.readonly ? 'readonly' : ''}
                        ${field.disabled ? 'disabled' : ''}
                        required="${field.required}"
                    />
                `;
          	    break;
            default:
            	msg.error(`Unsupported Field Type: ${field.type}`)
                break;
        }

        obj += _buildFieldError(field);
        return obj;
    }

    function _buildFieldError(field) {
    	let obj = `
    	    <div class="form-it-error-block hide" id="error-${field.key}"></div>
    	`;
    	return obj;
    }

</script>

<style lang="sass">
    .form-it-input {

    }

    .form-it-error-block {
        margin-top: 5px;
        padding: 10px 5px 10px 10px;
        background: lighten(pink, 5%);
        border: 1px solid red;
        border-radius: 3px;
        font-size: .8em;
        color: red;
        font-weight: bold;
    }

    .form-it-input-error-checkbox {
        color: lighten(red, 5%);
    }

    .form-it-input-clean {
        background: lighten(lightgreen, 15%);
        border: 1px solid green;
    }

    .form-it-input-error {
        background: lighten(pink, 5%);
        border: 1px solid red;
    }

    .form-it-input-clean-checkbox {
        color: green;
    }

</style>
