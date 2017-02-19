import Vue          from 'vue/dist/vue.js';
import test         from 'ava';
import Notification from '../src/js/Notification';

// test('it should contain data message', t => {
//     t.is(Notification.data().message, 'Hello World');
// });

// test('it should render message', t => {
//     let n = new Vue(Notification).$mount();
//     t.is(n.$el.innerHTML, 'Hello World');
// });

test('it should render message using props', t => {
    let NotificationEx  = Vue.extend(Notification);
    let vm = new NotificationEx({propsData: {
        message: 'Foobar'
    }}).$mount();
    t.is(vm.$el.textContent, 'FOOBAR');  // see test below where filter added
});

test('it should capitalize mesasge', t => {
    let NotificationEx  = Vue.extend(Notification);
    let vm = new NotificationEx({propsData: {
        message: 'capitalize'
    }}).$mount();
    t.is(vm.$el.textContent, 'CAPITALIZE');
});

test('it computes the notification', t => {
    let NotificationEx  = Vue.extend(Notification);
    let vm = new NotificationEx({propsData: {
        message: 'foobar'
    }}).$mount();

    t.is(vm.notification, 'FOOBAR');
})