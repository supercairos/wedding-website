
const deadline = (date) => {
    const deadline = new Date(date);
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
}

(function () {
    // Add a body class once page has loaded
    // Used to add CSS transitions to elems
    // and avoids content shifting during page load
    window.addEventListener('load', () => {
        const items = document.querySelectorAll('[data-date]');
        items.forEach((item) => {
            item.innerHTML = `J&ndash;${deadline(item.dataset.date)}`;
        });
    });
})();