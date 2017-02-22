export default {
    template:
        `<div>
            <h1 ref="h1">{{ notification }}</h1>
            <button ref="button" v-on:click="counter+=1">Add 1</button>
        </div>`,

    props: ['message'],

    data() {
        return {
            counter: 0
        };
  },

  computed: {
    notification() {
      return this.message.toUpperCase();
    }
  }

};
