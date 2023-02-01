/**
 * Created by SooMinKim on 2023-01-31
 */
'use strict'

import { Api } from './api.js';

const header = document.querySelector('header');

async function _getUser () {
    try {
        let url = '/api/user';

        let response = await new Api().get(url);

        return JSON.parse(response.body).data.user;
    } catch (e) {
        console.log(`\n : (Header._getUser) Failed to get user \n`, e);
        throw e;
    }
};

async function drawHeader () {
    let user = await _getUser();

    header.insertAdjacentHTML(
        'beforeend',
        `<header id="header" class="header fixed-top d-flex align-items-center">
            <div class="d-flex align-items-center justify-content-between">
            <a href="/dashboard" class="logo d-flex align-items-center">
                <img src="assets/img/logo.png" alt="">
                <span class="d-none d-lg-block">NiceInventory</span>
            </a>
            <i class="bi bi-list toggle-sidebar-btn"></i>
            </div><!-- End Logo -->
        
            <nav class="header-nav ms-auto">
            <ul class="d-flex align-items-center">
        
                <li class="nav-item dropdown pe-3">
        
                <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                    <span class="d-none d-md-block dropdown-toggle ps-2">${user[0].name}</span>
                </a><!-- End Profile Iamge Icon -->
        
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                    <li class="dropdown-header">
                    <h6>${user[0].name}</h6>
                    <span>${user[0].company_name}</span>
                    </li>
                    <li>
                    <hr class="dropdown-divider">
                    </li>
        
                    <li>
                    <a class="dropdown-item d-flex align-items-center" href="/profile">
                        <i class="bi bi-person"></i>
                        <span>My Profile</span>
                    </a>
                    </li>
                    <li>
                    <hr class="dropdown-divider">
                    </li>
        
                    <li>
                    <a class="dropdown-item d-flex align-items-center" href="/">
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                    </a>
                    </li>
        
                </ul><!-- End Profile Dropdown Items -->
                </li><!-- End Profile Nav -->
        
            </ul>
            </nav><!-- End Icons Navigation -->
        
        </header><!-- End Header -->
        `
    );
};

drawHeader();
