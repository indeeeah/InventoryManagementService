/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

import { Api } from './api.js';
import { Base } from './base.js';

const nameInput = document.querySelector('#yourName');
const emailInput = document.querySelector('#yourEmail');
const companyInput = document.querySelector('#yourCompany');
const passwordInput = document.querySelector('#yourPassword');
const registerBtn = document.querySelector('#registerBtn');

async function addAllElement () {};
function addAllEvents () {
    registerBtn.addEventListener('click', register);
};

// request api
async function _register () {
    try {
        let url = '/api/user';
        let params = {
            name: nameInput.value,
            email: emailInput.value,
            company: companyInput.value,
            password: passwordInput.value,
        };

        await new Api().post(url, params);
    } catch (e) {
        console.log(`\n : (Register._register) Failed to register \n`, e);
        throw e;
    }
};

// register
async function register (event) {
    try {
        event.preventDefault();

        await _register();

        alert(`정상적으로 회원가입되었습니다.`);

        window.location.replace('/');
    } catch (e) {
        console.log(`\n : (Register.register) Failed to register \n`, e);
        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요. \n${new Base().getErrorMsg(e.message)}`);
        throw e;
    }
};

addAllElement();
addAllEvents();
