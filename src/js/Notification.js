export default {
    template: '<div><h1>{{ message | capitalize }}</h1></div>',
    // template: '<div>{{ notification }}</div>',

    props: ['message'],

    filters: {
        capitalize(message) {
            return message.toUpperCase();
        }
    },

    methods: {
        capitalize(message) {
            return mesasge.toUpperCase();
        }
    },

    computed: {
        notification() {
            return this.message.toUpperCase();
        }
    }

    // data() {
    //     return {
    //         message: 'Hello World'
    //     };
    // }
}