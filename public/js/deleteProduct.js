/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const deleteProductFun = async (productId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/products/${productId}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Product Deleted Successfully');
      window.setTimeout(() => {
        location.assign('/manage-products');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
