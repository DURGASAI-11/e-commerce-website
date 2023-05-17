/*eslint-disable*/
// import axios from 'axios';
// import { showAlert } from './alert';
// import { Stripe } from '@stripe/stripe-js';

// const stripe = await Stripe(
//   'pk_test_51MderHSJQWZqP5L8Ss4iCbP3J2RU4AeGoXi2FILeFHXti07Za8pfKtmj79eviHEnE5K8ErLqWMT6xNiuqBOCLjNJ0078LnQIar'
// );
// export const bookProduct = async (productID) => {
//   try {
//     //1) Get checkout session from endpoint from API
//     const session = await axios(
//       `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${productID}`
//     );
//     console.log(session);
//     //2) Create checkout form  + charge credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };
import axios from 'axios';
import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';

export const bookProduct = async (productId) => {
  const stripe = await loadStripe(
    'pk_test_51MderHSJQWZqP5L8Ss4iCbP3J2RU4AeGoXi2FILeFHXti07Za8pfKtmj79eviHEnE5K8ErLqWMT6xNiuqBOCLjNJ0078LnQIar'
  );

  try {
    // 1. Get checkout session from API
    const {
      data: { session },
    } = await axios(`/api/v1/bookings/checkout-session/${productId}`);

    // 2. Redirect to Stripe checkout page
    console.log('i came here to redirect');
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    showAlert('error', 'An error occurred during the booking process.');
  }
};
