import {beforeEach, describe, it} from 'mocha';
import {assert}                   from 'chai';
import {boot}                     from './VueBootstrap';
import Notification               from '../src/js/Notification2';

let sut;

beforeEach(function () {
    let props = { propsData: { message: 'Foobar' } };
    sut = boot(Notification, props);
});

describe('Vue Notification Component', () => {
    it('it renders a notification message in capitals', () => {
        assert.equal(sut.textContent('h1'), 'FOOBAR');
    });

    it('it adds 1 to the counter', () => {
        assert.equal(sut.vm.counter, 0);
        sut.click('button');
        sut.click('button');
        assert.equal(sut.vm.counter, 2);
    });
});
