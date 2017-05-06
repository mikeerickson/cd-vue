import Vue from 'vue/dist/vue';

export function boot(VueComponent, opts = {}) {

    let component  = Vue.extend(VueComponent);
    let vm         = new component(opts).$mount();

    return {
        vm,
        click: (referencedElement, multiple = 1) => {
            for (let i = 0; i < multiple; i++) {
                vm.$refs[referencedElement].click();
            }
        },
        textContent: (referencedElement) => {
            return vm.$refs[referencedElement].textContent;
        }
    };
}
