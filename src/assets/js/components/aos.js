import AOS from 'aos';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const options = {
      duration: 0,
      easing: 'ease-out-quad',
      once: true,
      startEvent: 'load',
      disable: 'mobile'
    };

    AOS.init(options);
  });
})();