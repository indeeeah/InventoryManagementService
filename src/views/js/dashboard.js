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
    addIconBtn.addEventListener('click', _displayAddForm);
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

// display add form
function _displayAddForm () {
    try {
        const addForm = document.querySelector('#addForm');

        if (addForm.style.visibility === 'collapse') {
            addForm.style.visibility = 'visible';
        } else {
            addForm.style.visibility = 'collapse';
        }
    } catch (e) {
        console.log(`\n : (Dashboard._displayAddForm) Failed to display add form \n`, e);
        alert(`문제가 발행하였습니다. 확인 후 다시 시도해 주세요.`);
        throw e;
    }
};

// display add category form
function _displayAddCategoryForm () {
    try {
        const addCategoryForm = document.querySelector('#addCategoryForm');

        if (addCategoryForm.style.visibility === 'collapse') {
            addCategoryForm.style.visibility = 'visible';
        } else {
            addCategoryForm.style.visibility = 'collapse';
        }
    } catch (e) {
        console.log(`\n : (Dashboard._displayAddCategoryForm) Failed to display add category form \n`, e);
        alert(`문제가 발행하였습니다. 확인 후 다시 시도해 주세요.`);
        throw e;
    }
};

// add new category
async function _addNewCategory () {
    try {
        const newCategoryInput = document.querySelector('#newCategoryInput');
        
        if (newCategoryInput.value.length > 0) {
            let url = '/api/product/category';
            let params = {
                name: newCategoryInput.value
            };

            await new Api().post(url, params);

            window.location.replace('/dashboard');

            return;
        }
        alert(`카테고리 이름은 필수입니다.`);
    } catch (e) {
        console.log(`\n : (Dashboard._addNewCategory) Failed to add new category \n`, e);
        alert(`문제가 발행하였습니다. 확인 후 다시 시도해 주세요.`);
        throw e;
    }
};

// add new product
async function _addNewProduct (categoryArr) {
    try {
        const nameInput = document.querySelector('#nameInput');
        const amountInput = document.querySelector('#amountInput');

        if (nameInput.value.length > 0 && amountInput.value > 0) {
            let values = [];

            categoryArr.forEach((item) => {
                let id = `#input-${item.id}`;
                let input = document.querySelector(id);

                if (input.value.length > 0) {
                    values.push({
                        category_id: item.id,
                        value: input.value
                    });
                }
            });

            let url = '/api/product';
            let params = {
                name: nameInput.value,
                amount: amountInput.value,
                values: values
            };

            await new Api().post(url, params);
            
            window.location.replace('/dashboard');

            return;
        }
        alert(`제품 이름과 수량은 필수입니다.`);
    } catch (e) {
        console.log(`\n : (Dashboard._addNewProduct) Failed to add new product \n`, e);
        alert(`문제가 발행하였습니다. 확인 후 다시 시도해 주세요.`);
        throw e;
    }
};

// draw product table
async function drawProductTable () {
    let categoryArr = await _getCategoryArr();
    let category = await _getCategory(categoryArr);
    let addForm = _getAddForm(categoryArr);

    let productArr = await _getProductArr();

    product_table.insertAdjacentHTML(
        'beforeend',
        `<thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">이름</th>
                <th scope="col">수량</th>
                ${category}
                <th style="visibility: collapse;" id="addCategoryForm">
                    <input type="text" id="newCategoryInput" class="form-control">
                    <i id="addNewCategoryBtn" class="bi bi-check2-circle"></i>
                </th>
                <th scope="col"><i id="addCategoryBtn" class="bi bi-plus-lg"></i></th>
            </tr>
        </thead>
        <tbody>
            <tr style="visibility: collapse;" id="addForm">
                <th scope="row"><i id="addNewProductBtn" class="bi bi-check2-circle"></i></th>
                <td><input type="text" id="nameInput" class="form-control"></td>
                <td><input type="text" id="amountInput" class="form-control"></td>
                ${addForm}
            </tr>
            <tr>
                <th scope="row">1</th>
                <td>Brandon Jacob</td>
                <td>Designer</td>
            </tr>
        </tbody>`
    );

    const addCategoryBtn = document.querySelector('#addCategoryBtn');
    addCategoryBtn.addEventListener('click', _displayAddCategoryForm);

    const addNewCategoryBtn = document.querySelector('#addNewCategoryBtn');
    addNewCategoryBtn.addEventListener('click', _addNewCategory);

    const addNewProductBtn = document.querySelector('#addNewProductBtn');
    // addNewProductBtn.addEventListener('click', _addNewProduct(categoryArr));
    addNewProductBtn.addEventListener('click', async () => {
        await _addNewProduct(categoryArr);
    });
};

addAllElement();
addAllEvents();
drawProductTable();
