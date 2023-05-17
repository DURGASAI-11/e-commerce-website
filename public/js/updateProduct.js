/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const updateProductInDb = async (data, productId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/products/${productId}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Details Updated Successfully');
      window.setTimeout(() => {
        location.assign(`/manage-products`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
