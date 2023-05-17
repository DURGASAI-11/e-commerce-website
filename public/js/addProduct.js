/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const addProductForm = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/products',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Product Successfully created');
      window.setTimeout(() => {
        location.assign('/manage-products');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
