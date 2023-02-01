/**
 * Created by SooMinKim on 2023-01-31
 */
'use strict'

const footer = document.querySelector('footer');

function drawFooter () {
    footer.insertAdjacentHTML(
        'beforeend',
        `<div class="copyright">
            &copy; Copyright <strong><span>NiceInventory</span></strong>. All Rights Reserved
        </div>
        <div class="credits">
            <!-- All the links in the footer should remain intact. -->
            <!-- You can delete the links only if you purchased the pro version. -->
            <!-- Licensing information: https://bootstrapmade.com/license/ -->
            <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>`
    );
};

drawFooter();
