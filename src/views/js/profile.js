/**
 * Created by SooMinKim on 2023-01-31
 */
'use strict'

import { Api } from './api.js';
import { Base } from './base.js';

const user_info_card = document.querySelector('#user-info-card');
const emailInput = document.querySelector('#emailInput');
const curPasswordInput = document.querySelector('#curPasswordInput');
const newPasswordInput = document.querySelector('#newPasswordInput');
const renewPasswordInput = document.querySelector('#renewPasswordInput');
const changePasswordBtn = document.querySelector('#changePasswordBtn');

async function addAllElement () {};
function addAllEvents () {
    changePasswordBtn.addEventListener('click', changePassword);
};

let user = {};

async function _getUser () {
    try {
        let url = '/api/user';

        let response = await new Api().get(url);

        return JSON.parse(response.body).data.user;
    } catch (e) {
        console.log(`\n : (Profile._getUser) Failed to get user \n`, e);
        throw e;
    }
};

// login api
async function _login () {
    try {
        let url = '/api/user/login';
        let params = {
            email: emailInput.value,
            password: curPasswordInput.value
        };

        return await new Api().post(url, params);
    } catch (e) {
        console.log(`\n : (Profile._login) Failed to login \n`, e);
        throw e;
    }
};

// login api
async function _changePassword () {
    try {
        let url = '/api/user';
        let params = {
            password: newPasswordInput.value
        };

        return await new Api().put(url, params);
    } catch (e) {
        console.log(`\n : (Profile._changePassword) Failed to change password \n`, e);
        throw e;
    }
};

async function changePassword (event) {
    try {
        event.preventDefault();

        if (user[0].email === emailInput.value) {
            await _login();
    
            if (newPasswordInput.value === renewPasswordInput.value) {
                await _changePassword();
    
                alert(`정상적으로 비밀번호가 변경되었습니다. \n다시 로그인 해주십시오.`);
        
                window.location.replace('/');

                return ;
            }
            alert(`비밀번호가 다릅니다. \n확인 후 다시 시도해 주세요.`);

            return ;
        }
        alert(`이메일이 다릅니다. \n확인 후 다시 시도해 주세요.`);

        return ;
    } catch (e) {
        console.log(`\n : (Profile.changePassword) Failed to change password \n`, e);
        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요. \n${new Base().getErrorMsg(e.message)}`);
        throw e;
    }
};

async function drawUserInfoCard () {
    user = await _getUser();

    user_info_card.insertAdjacentHTML(
        'beforeend',
        `<div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <h2>${user[0].name}</h2>
            <h3>${user[0].company_name}</h3>
        </div>`
    );
};

addAllElement();
addAllEvents();
drawUserInfoCard();
