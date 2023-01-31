/**
 * Created by SooMinKim on 2023-01-28
 */
'use strict'

import { Api } from './api.js';
import { Base } from './base.js';

const product_table = document.querySelector('#product-table');
const addIconBtn = document.querySelector('#addIconBtn');
const product_modal = document.querySelector('#product-modal');

async function addAllElement () {};
function addAllEvents () {
    addIconBtn.addEventListener('click', _displayAddForm);
};

let categoryArr = {};

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

// request api - get product
async function _getProductArr () {
    try {
        let url = '/api/product';

        let response = await new Api().get(url);

        return JSON.parse(response.body).data;
    } catch (e) {
        console.log(`\n : (Dashboard._getProductArr) Failed to get product array \n`, e);
        throw e;
    }
};

function _getProductValues (arr) {
    try {
        let result = arr.map((item) => 
            `<td>${item.product_category_value}</td>`)
            .join('');
        
        return result;
    } catch (e) {
        console.log(`\n : (Dashboard._getProductValues) Failed to get product values \n`, e);
        throw e;
    }
};

function _getProduct (productArr) {
    try {
        let result = productArr.map((item, index) => 
            `<tr>
                <th scope="row">${index + 1}</th>
                <td>${item.product_name}</td>
                <td>${item.product_amount}<i id="up-${item.product_id}" class="bi bi-caret-up upBtn" style="float: right;"></i><i id="down-${item.product_id}" class="bi bi-caret-down downBtn" style="float: right;"></i></td>
                ${_getProductValues(item.product_values)}
                <td></td>
                <td><i id="modalBtn-${item.product_id}" class="bi bi-dot" data-bs-toggle="modal" data-bs-target="#product-modal"></i></td>
            </tr>`)
            .join('');

        return result;
    } catch (e) {
        console.log(`\n : (Dashboard._getProduct) Failed to get product \n`, e);
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

async function _updateProduct (categoryArr) {
    try {

        const productId = document.querySelector('#productId');
        const productNameInput = document.querySelector('#productName');
        const productAmountInput = document.querySelector('#productAmount');

        if (productNameInput.value.length > 0 && productAmountInput.value > 0) {
            let values = [];

            categoryArr.forEach((item) => {
                let id = `#product-${item.id}`;
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
                id: productId.value,
                name: productNameInput.value,
                amount: productAmountInput.value,
                values: values
            };

            await new Api().put(url, params);
            
            window.location.replace('/dashboard');

            console.log('params ; ', params);
            return;
        }
        alert(`제품 이름과 수량은 필수입니다.`);
    } catch (e) {
        console.log(`\n : (Dashboard._updateProduct) Failed to update product \n`, e);
        alert(`문제가 발행하였습니다. 확인 후 다시 시도해 주세요.`);
        throw e;
    }
};

async function _upProductAmount (id, amount) {
    try {
        let url = '/api/product';
        let params = {
            id: id,
            amount: amount + 1
        };

        await new Api().put(url, params);

        window.location.replace('/dashboard');
    } catch (e) {
        console.log(`\n : (Dashboard._upProductAmount) Failed to up product amount \n`, e);
        throw e;
    }
};

async function _downProductAmount (id, amount) {
    try {
        if (amount > 0) {
            let url = '/api/product';
            let params = {
                id: id,
                amount: amount - 1
            };
    
            await new Api().put(url, params);
    
            window.location.replace('/dashboard');
        } else {
            alert(`0 이하의 수로는 조정할 수 없습니다.`);
        }
    } catch (e) {
        console.log(`\n : (Dashboard._downProductAmount) Failed to down product amount \n`, e);
        throw e;
    }
};

function _getValues (item) {
    try {
        let result = item.product_values.map((element) => 
            `<div class="col-md-6">
                <label for="product-${element.product_category_id}" class="form-label">${element.product_category_name}</label>
                <input type="text" class="form-control" id="product-${element.product_category_id}" value="${element.product_category_value}">
            </div>`)
            .join('');
        
        return result;
    } catch (e) {
        console.log(`\n : (Dashboard._getValues) Failed to get values \n`, e);
        throw e;
    }
};

async function _displayModalForm (item) {
    try {
        const modal_header = document.getElementById('modal-header');
        modal_header.innerHTML = `
            <h5 class="modal-title">${item.product_name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        `;

        let values = _getValues(item);

        const modal_body = document.getElementById('modal-body');
        modal_body.innerHTML = `
            <form class="row g-3">
                <div class="col-md-6">
                    <label for="productId" class="form-label">ID</label>
                    <input type="text" class="form-control" id="productId" value="${item.product_id}" readonly>
                </div>
                <div class="col-md-6">
                    <label for="productName" class="form-label">이름</label>
                    <input type="text" class="form-control" id="productName" value="${item.product_name}">
                </div>
                <div class="col-md-6">
                    <label for="productAmount" class="form-label">수량</label>
                    <input type="text" class="form-control" id="productAmount" value="${item.product_amount}">
                </div>
                ${values}
                <div class="text-center">
                    <button type="button" id="updateProductBtn" class="btn btn-primary">Submit</button>
                </div>
            </form>
        `;

        const updateProductBtn = document.querySelector('#updateProductBtn');
        updateProductBtn.addEventListener('click', async () => {
            await _updateProduct(categoryArr);
        });
    } catch (e) {
        console.log(`\n : (Dashboard._displayModalForm) Failed to display modal form \n`, e);
        throw e;
    }
};

async function _modifyAmount (productArr) {
    try {
        productArr.map((item) => {
            let upBtn = document.querySelector(`#up-${item.product_id}`);
            upBtn.addEventListener('click', async () => {
                await _upProductAmount(item.product_id, item.product_amount);
            });

            let downBtn = document.querySelector(`#down-${item.product_id}`);
            downBtn.addEventListener('click', async () => {
                await _downProductAmount(item.product_id, item.product_amount);
            });

            let modalBtn = document.querySelector(`#modalBtn-${item.product_id}`);
            modalBtn.addEventListener('click', async () => {
                await _displayModalForm(item);
            });
        });
    } catch (e) {
        console.log(`\n : (Dashboard._modifyAmount) Failed to modifiy amount \n`, e);
        throw e;
    }
};

// draw component
async function drawComponent () {
    categoryArr = await _getCategoryArr();
    let category = await _getCategory(categoryArr);
    let addForm = _getAddForm(categoryArr);

    let productArr = await _getProductArr();
    let product = _getProduct(productArr);

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
            ${product}
        </tbody>`
    );

    product_modal.insertAdjacentHTML(
        'beforeend',
        `<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" id="modal-header"></div>
                <div class="modal-body" id="modal-body"></div>
            </div>
        </div>`
    );

    const addCategoryBtn = document.querySelector('#addCategoryBtn');
    addCategoryBtn.addEventListener('click', _displayAddCategoryForm);

    const addNewCategoryBtn = document.querySelector('#addNewCategoryBtn');
    addNewCategoryBtn.addEventListener('click', _addNewCategory);

    const addNewProductBtn = document.querySelector('#addNewProductBtn');
    addNewProductBtn.addEventListener('click', async () => {
        await _addNewProduct(categoryArr);
    });

    await _modifyAmount(productArr);
};

addAllElement();
addAllEvents();
drawComponent();
