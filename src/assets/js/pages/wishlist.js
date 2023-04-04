import Handlebar from 'handlebars';
import Swiper from 'swiper';
import PayPal from 'paypal';
import Axios from 'axios';

import { BASE_URL } from '../constants';

const PAYPAL_BUTTON_ID = 'SG6MGCRSJQ9CW';
const PAYPAL_ENV = 'sandbox';

(function () {
    // Add a body class once page has loaded
    // Used to add CSS transitions to elems
    // and avoids content shifting during page load
    window.addEventListener('load', function () {
        const wishlistWrapper = document.getElementById("wishlist-item-wrapper");
        const itemCardTemplate = Handlebar.compile(
            document.getElementById('item-card-template').innerHTML
        );

        let onPaypalComplete = (item) => (params) => {
            console.log(params);
            const amount = parseFloat(params.amt);

            // Update the item
            item.raised += amount;

            // Update the UI
            const htmlItem = document.getElementById(`wishlist-item-${item.id}`);
            htmlItem.innerHTML = itemCardTemplate(item);

            // Update the database
            Axios.post(`${BASE_URL}/items/${item.id}/transactions`, {
                amount,
                paypal_tx_id: params.tx,
            }
            ).then(({ data }) => {
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        }

        let onPaypalClick = (item) => () => {
            PayPal.Donation.Checkout({
                env: PAYPAL_ENV,
                hosted_button_id: PAYPAL_BUTTON_ID,
                onComplete: onPaypalComplete(item),
            }).renderTo(window.parent);
        }

        // Get the wishlist items
        Axios.get(`${BASE_URL}/items`)
            .then(({ data }) => {
                // Clear the wrapper
                wishlistWrapper.innerHTML = '';

                // Loop through the items
                data.forEach((item) => {
                    const soldout = item.raised >= item.price;
                    // Compile the template
                    const html = itemCardTemplate({
                        soldout,
                        ...item
                    });

                    // Create a div element
                    var div = document.createElement('div');
                    if (soldout) {
                        div.classList.add('item-sold-out');
                    } else {
                        div.addEventListener('click', onPaypalClick(item));
                    }
                    div.classList.add('col');
                    div.id = `wishlist-item-${item.id}`;
                    div.innerHTML += html;

                    // Append the div element to the wrapper
                    wishlistWrapper.appendChild(div);
                });
            })
            .catch((err) => {
                console.log(err);
                wishlistWrapper.innerHTML = 'Error loading items';
            });
    });
})();