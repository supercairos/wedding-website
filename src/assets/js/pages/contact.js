import Axios from 'axios';

const BASE_URL = 'https://wedding-backend-a3ooop2qhq-od.a.run.app';

(function () {
    // Add a body class once page has loaded
    // Used to add CSS transitions to elems
    // and avoids content shifting during page load
    window.addEventListener('load', function () {
        const form = document.getElementById('contact-form');
        const button = document.getElementById('contact-submit');
        const success = document.getElementById('contact-success');
        const error = document.getElementById('contact-error');
        form.addEventListener('submit', function (e) {
            if (!e.preventDefault) {
                return;
            }
            e.preventDefault();

            // Setup styles
            button.readOnly = true;
            button.classList.add('disabled');
            success.style.display = 'none';
            error.style.display = 'none';


            // Serialize the form data
            const data = {};
            const formData = new FormData(e.currentTarget);
            for (const [key, value] of formData.entries()) {
                if (!value) {
                    continue;
                }

                if (key.includes('.')) {
                    const [parent, child] = key.split('.');
                    if (!data[parent]) {
                        data[parent] = {};
                    }
                    data[parent][child] = value;
                    continue;
                }

                data[key] = value;
            }

            // Send the data
            Axios.post(
                `${BASE_URL}/email`,
                data
            ).then(({ data }) => {
                console.log(data);
                success.style.display = 'block';
            }).catch((err) => {
                console.log(err);
                button.readOnly = false;
                error.style.display = 'block';
            });
        });
    });
})();