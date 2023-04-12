import sha256 from 'crypto-js/sha256';

const SALT = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';

(function () {
    // Add a body class once page has loaded
    // Used to add CSS transitions to elems
    // and avoids content shifting during page load
    window.addEventListener('load', function () {
        const input = document.getElementById('input-password');
        const button = document.getElementById('button-password');
        button.addEventListener('keydown', function (e) {
            console.log(e.key)
            if (['Enter', 'NumpadEnter'].includes(e.key)) {
                e.preventDefault();
                button.click();
            }
        });
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (sha256(SALT + input.value).toString() === '058791b191fa522e0d06eae09e577aff3e460bb9e66c49a19e2701de1290e061') {
                window.location.href = '/home.html';
                return;
            }

            alert('Incorrect password');
        });
    });
})();