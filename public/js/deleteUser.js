/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const deleteUserFromDb = async (userId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/users/${userId}`,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User Successfully Deleted');
      window.setTimeout(() => {
        location.assign('/manage-user');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
