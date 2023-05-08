import Handlebar from 'handlebars';
import PayPal from 'paypal';
import Axios from 'axios';

import { BASE_URL } from '../constants';

(function () {
    // Add a body class once page has loaded
    // Used to add CSS transitions to elems
    // and avoids content shifting during page load
    window.addEventListener('load', function () {
        const wishlistWrapper = document.getElementById("wishlist-item-wrapper");
        const itemCardTemplate = Handlebar.compile(
            document.getElementById('item-card-template').innerHTML
        );

        let launchFireworks = () => {
            const fireworks = document.getElementById('fireworks');
            fireworks.classList.add('active');
            setTimeout(() => {
                fireworks.classList.remove('active');
            }, 5000);
        }

        let onPaypalComplete = (item) => (params) => {
            console.log(params);
            const amount = parseFloat(params.amt);

            // Update the item
            item.raised += amount;
            if (item.raised >= item.price) {
                launchFireworks();
            }

            // Update the UI
            const htmlItem = document.getElementById(`wishlist-item-${item.id}`);

            const soldout = item.raised >= item.price;
            htmlItem.innerHTML = itemCardTemplate({ soldout, item });

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
                env: item.paypal_env,
                hosted_button_id: item.paypal_id,
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
                    const soldout = item.raised >= item.price && item.price > 0;
                    // Compile the template
                    const html = itemCardTemplate({
                        soldout,
                        ...item
                    });

                    var div = document.createElement('div');
                    div.classList.add('col');
                    div.id = `wishlist-item-${item.id}`;
                    div.innerHTML += html;

                    if (typeof item.paypal_id === 'string' || item.paypal_id instanceof String) {
                        if (item.paypal_id.length > 0) {
                            // Create a div element
                            if (soldout) {
                                div.classList.add('item-sold-out');
                            } else {
                                div.addEventListener('click', onPaypalClick(item));
                            }
                        }
                    }

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