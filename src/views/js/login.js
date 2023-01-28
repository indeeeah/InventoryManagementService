/**
 * Created by SooMinKim on 2023-01-27
 */
'use strict'

import { Api } from './api.js';
import { Base } from './base.js';

const emailInput = document.querySelector('#yourEmail');
const passwordInput = document.querySelector('#yourPassword');
const loginBtn = document.querySelector('#loginBtn');

async function addAllElement () {};
function addAllEvents () {
    loginBtn.addEventListener('click', login);
};

// login api
async function _login () {
    try {
        let url = '/api/user/login';
        let params = {
            email: emailInput.value,
            password: passwordInput.value
        };

        return await new Api().post(url, params);
    } catch (e) {
        console.log(`\n : (Login._login) Failed to login \n`, e);
        throw e;
    }
};

function _setToken (item) {
    try {
        let token = JSON.parse(item.body).data;

        localStorage.setItem('token', token);
    } catch (e) {
        console.log(`\n : (Login._setToken) Failed to set token \n`, e);
        throw e;
    }
};

// login
async function login (event) {
    try {
        event.preventDefault();

        let result = await _login();

        _setToken(result);

        alert(`정상적으로 로그인되었습니다.`);

        window.location.replace('/dashboard');
    } catch (e) {
        console.log(`\n : (Login.login) Failed to login \n`, e);
        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요. \n${new Base().getErrorMsg(e.message)}`);
        throw e;
    }
};

addAllElement();
addAllEvents();
