import Handlebar from 'handlebars';
import Swiper from 'swiper';
import PayPal from 'paypal';
import Axios from 'axios';

const BASE_URL = 'https://wedding-backend-a3ooop2qhq-od.a.run.app';

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
                env: 'sandbox',
                hosted_button_id: 'SG6MGCRSJQ9CW',
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
                    // Compile the template
                    const html = itemCardTemplate({
                        is_sold_out: item.raised >= item.price,
                        ...item
                    });

                    // Create a div element
                    var div = document.createElement('div');
                    div.addEventListener('click', onPaypalClick(item));
                    div.classList.add('swiper-slide', 'd-flex', 'h-auto');
                    div.id = `wishlist-item-${item.id}`;
                    div.innerHTML += html;

                    // Append the div element to the wrapper
                    wishlistWrapper.appendChild(div);
                });

                // Initialize the swiper
                var swiper = new Swiper(this.document.getElementById("wishlist-carousel-scrollbar"), {
                    spaceBetween: 25,
                    autoHeight: true, //enable auto height
                    cssMode: true,
                    roundLengths: true,
                    scrollbar: {
                        el: ".swiper-scrollbar",
                        hide: false,
                        draggable: true
                    },
                    navigation: {
                        "nextEl": ".swiper-next",
                        "prevEl": ".swiper-prev"
                    },
                    breakpoints: {
                        576: {
                            "slidesPerView": 1
                        },
                        768: {
                            "slidesPerView": 2
                        },
                        992: {
                            "slidesPerView": 3
                        }
                    }
                });

            })
            .catch((err) => {
                console.log(err);
                wishlistWrapper.innerHTML = 'Error loading items';
            });
    });
})();