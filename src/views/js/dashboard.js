/**
 * Created by SooMinKim on 2023-01-28
 */
'use strict'

import { Api } from './api.js';
import { Base } from './base.js';

const product_table = document.querySelector('#product-table');
const addIconBtn = document.querySelector('#addIconBtn');

async function addAllElement () {};
function addAllEvents () {
    addIconBtn.addEventListener('click', displayAddForm);
};

// request api - get category
async function _getCategoryArr () {
    try {
        let url = '/api/product/category';

        let response = await new Api().get(url);

        return JSON.parse(response.body).data.category;
    } catch (e) {
        console.log(`\n : (Dashboard._getCategoryArr) Failed to get category array \n`, e);
        throw e;
    }
};

async function _getCategory (categoryArr) {
    try {
        let result = categoryArr.map((item) => 
            `<th scope="col" id="category-${item.id}">${item.name}</th>`)
            .join('');

        return result;
    } catch (e) {
        console.log(`\n : (Dashboard._getCategory) Failed to get category \n`, e);
        throw e;
    }
};

function _getAddForm (categoryArr) {
    try {
        let result = categoryArr.map((item) => 
            `<td><input type="text" id="input-${item.id}" class="form-control"></td>`)
            .join('');

        return result;
    } catch (e) {
        console.log(`\n : (Dashboard._getAddForm) Failed to get add form \n`, e);
        throw e;
    }
};

// draw product table
async function drawProductTable () {
    let categoryArr = await _getCategoryArr();
    let category = await _getCategory(categoryArr);
    let addForm = _getAddForm(categoryArr);

    product_table.insertAdjacentHTML(
        'beforeend',
        `<thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">이름</th>
            <th scope="col">수량</th>
            ${category}
            </tr>
        </thead>
        <tbody>
            <tr style="visibility: collapse;" id="addForm">
            <th scope="row"><i class="bi bi-check2-circle"></i></th>
            <td><input type="text" id="name" class="form-control"></td>
            <td><input type="text" id="amount" class="form-control"></td>
            ${addForm}
            </tr>
            <tr>
            <th scope="row">1</th>
            <td>Brandon Jacob</td>
            <td>Designer</td>
            <td>28</td>
            <td>2016-05-25</td>
            </tr>
            <tr>
            <th scope="row">2</th>
            <td>Bridie Kessler</td>
            <td>Developer</td>
            <td>35</td>
            <td>2014-12-05</td>
            </tr>
            <tr>
            <th scope="row">3</th>
            <td>Ashleigh Langosh</td>
            <td>Finance</td>
            <td>45</td>
            <td>2011-08-12</td>
            </tr>
            <tr>
            <th scope="row">4</th>
            <td>Angus Grady</td>
            <td>HR</td>
            <td>34</td>
            <td>2012-06-11</td>
            </tr>
            <tr>
            <th scope="row">5</th>
            <td>Raheem Lehner</td>
            <td>Dynamic Division Officer</td>
            <td>47</td>
            <td>2011-04-19</td>
            </tr>
        </tbody>`
    );
};

// display add form
function displayAddForm (event) {
    try {
        const addForm = document.querySelector('#addForm');

        if (addForm.style.visibility === 'collapse') {
            addForm.style.visibility = 'visible';
        } else {
            addForm.style.visibility = 'collapse';
        }
    } catch (e) {
        console.log(`\n : (Dashboard.displayAddForm) Failed to display add form \n`, e);
        alert(`문제가 발행하였습니다. 확인 후 다시 시도해 주세요.`);
        throw e;
    }
};

addAllElement();
addAllEvents();
drawProductTable();
