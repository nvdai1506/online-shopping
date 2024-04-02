///////////////////////////////////////////////////////////
// Smooth scrolling animation
const myTimeout = setTimeout(scrollToTop, 2000);

function scrollToTop() {
  let allLinks = document.querySelectorAll('a');
  allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      // console.log('click');
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });
}
// scrollToTop(allLinks);
// allLinks.forEach(function (link) {
//   console.log('click');

//   link.addEventListener("click", function (e) {
//     console.log('click');
//     e.preventDefault();
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   });
// });

