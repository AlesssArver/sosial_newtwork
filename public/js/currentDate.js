var today = new Date();
var day = String(today.getDate()).padStart(2, '0');
var mounth = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var year = today.getFullYear();

today = day + '.' + mounth + '.' + year;

const footerDate = document.querySelector('.footer-date')
footerDate.innerHTML = today