/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const UserSignUp = async (
  userName,
  email,
  phone,
  password,
  passwordConfirm,
  address
) => {
  try {
    if (phone.length > 10 || phone.length < 10) {
      return showAlert('error', 'please Enter 10 digits mobile number');
    }
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name: userName,
        email: email,
        phone: phone,
        password: password,
        passwordConfirm: passwordConfirm,
        address: address,
      },
    });

    if (res.data.status == 'success') {
      showAlert('success', 'Account Created Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
