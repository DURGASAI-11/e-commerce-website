console.log('hi this from parcel');
/*eslint-disable */

import '@babel/polyfill';
// import { signup } from '../../controllers/authController';
import { UserSignUp } from './signUp';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookProduct } from './stripe';
import { userReviewForm } from './reviewForm'; //r
import { deleteUserFromDb } from './deleteUser';
import { addProductForm } from './addProduct';
import { updateProductInDb } from './updateProduct';
import { deleteProductFun } from './deleteProduct';

//DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--signup');
const reviewFormData = document.querySelector('.form--review');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const productDataForm = document.querySelector('.form-product-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-product');
const reviewBtn1 = document.getElementById('review-product'); //r
const btnAddProduct = document.getElementById('btn-add-product');
const btnUpdateProduct = document.getElementById('btn-update-product');
const deleteProduct = document.querySelectorAll('.delete-product');
const deleteUser = document.querySelectorAll('.delete-user'); //r

//values

//DELEGATION

if (signUpForm)
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const address = document.getElementById('address').value;

    console.log('this is from signup form');
    UserSignUp(userName, email, phone, password, passwordConfirm, address);
  });
if (reviewBtn1)
  reviewBtn1.addEventListener('click', (el) => {
    console.log('this is from formData');
    const { productId } = el.target.dataset;
    console.log(productId);
    if (reviewFormData)
      reviewFormData.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--processing').textContent =
          'Processing...';
        const reviewText = document.getElementById('review-text').value;
        const reviewStars = document.getElementById('review-stars').value;
        await userReviewForm(reviewText, reviewStars, productId);
        document.getElementById('review-text').value = '';
        document.getElementById('review-stars').value = '';
      });
  });

if (btnAddProduct)
  btnAddProduct.addEventListener('click', (e) => {
    console.log('btnAddProduct');
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('newProductName').value);
    form.append('price', document.getElementById('newProductPrice').value);
    form.append('unit', document.getElementById('newProductUnit').value);
    form.append('summary', document.getElementById('newProductSummary').value);
    form.append(
      'description',
      document.getElementById('newProductDescription').value
    );
    form.append('slug', document.getElementById('newProductSlug').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    form.append('images', document.getElementById('photo1').files[0]);
    form.append('images', document.getElementById('photo2').files[0]);
    form.append('images', document.getElementById('photo3').files[0]);

    addProductForm(form);
  });

if (btnUpdateProduct)
  btnUpdateProduct.addEventListener('click', (el) => {
    console.log('this is from update product Data');
    const { productId } = el.target.dataset;
    console.log(productId);
    if (productDataForm)
      productDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        const imageCoverInput = document.getElementById('imageCoverUpdate');
        const photo1Input = document.getElementById('photo1Update');
        const photo2Input = document.getElementById('photo2Update');
        const photo3Input = document.getElementById('photo3Update');
        form.append('name', document.getElementById('updateProductName').value);

        form.append(
          'price',
          document.getElementById('updateProductPrice').value
        );
        form.append('unit', document.getElementById('updateProductUnit').value);

        form.append(
          'summary',
          document.getElementById('updateProductSummary').value
        );
        form.append(
          'description',
          document.getElementById('updateProductDescription').value
        );
        form.append('slug', document.getElementById('updateProductSlug').value);

        if (imageCoverInput.files[0]) {
          console.log(imageCoverInput.files.length);
          form.append('imageCover', imageCoverInput.files[0]);
        }

        if (photo1Input.files[0]) {
          console.log(photo1Input.files.length);
          form.append('images', photo1Input.files[0]);
        }

        if (photo2Input.files[0]) {
          console.log(photo2Input.files.length);
          form.append('images', photo2Input.files[0]);
        }

        if (photo3Input.files[0]) {
          console.log(photo3Input.files.length);
          form.append('images', photo3Input.files[0]);
        }
        updateProductInDb(form, productId);
      });
  });

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('hi');
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('address', document.getElementById('address').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form + 'hi');
    //console.log('this is from index update method');
    updateSettings(form, 'data');
  });

if (deleteUser)
  deleteUser.forEach((button1) => {
    button1.addEventListener('click', (e) => {
      const { userId } = e.target.dataset;
      deleteUserFromDb(userId);
    });
  });

if (deleteProduct)
  deleteProduct.forEach((button1) => {
    button1.addEventListener('click', (e) => {
      const { productId } = e.target.dataset;
      deleteProductFun(productId);
    });
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing.....';
    const { productId } = e.target.dataset;
    bookProduct(productId);
  });

// if (reviewBtn)
//   reviewBtn.addEventListener('click', (e) => {
//     e.target.textContent = 'Processing.....';
//     const { productId } = e.target.dataset;
//     SecureReviewRoute(productId);
//   });
