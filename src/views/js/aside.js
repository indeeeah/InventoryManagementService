/**
 * Created by SooMinKim on 2023-01-31
 */
'use strict'

const aside = document.querySelector('aside');

function drawAside () {
    aside.insertAdjacentHTML(
        'beforeend',
        `<aside id="sidebar" class="sidebar">

            <ul class="sidebar-nav" id="sidebar-nav">
        
            <li class="nav-item">
                <a class="nav-link collapsed" href="/dashboard">
                <i class="bi bi-grid"></i>
                <span>Dashboard</span>
                </a>
            </li><!-- End Dashboard Nav -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="/">
                <i class="bi bi-box-arrow-in-right"></i>
                <span>Logout</span>
                </a>
            </li><!-- End Login Page Nav -->
            </ul>
        
        </aside>`
    );
};

drawAside();
