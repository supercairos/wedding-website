import sha256 from 'crypto-js/sha256';

const SALT = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';
// const VALID_PASSWORDS = [
//     '058791b191fa522e0d06eae09e577aff3e460bb9e66c49a19e2701de1290e061',
//     'd5c8685db5d262a82e2fd75077d831891de087eea277922a9b432739f1417798',
//     '908b1d6def732d9fdd37e4ab2f56f66053f4fc43231bf2d4f772332151f21026',
//     '1c50dfb020a2496235f9c8f7155b43daac53811e4995c476915b8041680fd578',
//     'ad8d8482a82798d0db92191ca01b632322b24af9557b5b8d65028421a5e7528f',
// ];
const VALID_PASSWORDS = [
    'dc754951ec9542c22b9dcb69ab4b79ac3f4c633a8c376e2a7a19a796c79485e3'
];

(function () {
    // Add a body class once page has loaded
    // Used to add CSS transitions to elems
    // and avoids content shifting during page load
    window.addEventListener('load', () => {
        const input = document.getElementById('input-password');
        const button = document.getElementById('button-password');
        input.addEventListener('keydown', (e) => {
            if (['Enter', 'NumpadEnter'].includes(e.key)) {
                e.preventDefault();
                button.click();
            }
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (VALID_PASSWORDS.includes(sha256(SALT + input.value).toString())) {
                window.location.href = 'home.html';
                return;
            }

            alert('Le mot de passe est incorrect. Veuillez réessayer.');
        });
    });
})();