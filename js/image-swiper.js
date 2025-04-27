document.addEventListener("DOMContentLoaded", function() {
  const swiper = document.getElementById("imageSwiper");
  const items = swiper.querySelectorAll(".carousel-item");
  let activeIndex = 0;

  function showSlide(index) {
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Manually handle the "next" and "prev" button clicks
  document
    .querySelector(".carousel-control-next")
    .addEventListener("click", function() {
      activeIndex = (activeIndex + 1) % items.length;
      showSlide(activeIndex);
    });

  document
    .querySelector(".carousel-control-prev")
    .addEventListener("click", function() {
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      showSlide(activeIndex);
    });

  // Optionally, set up auto slide every 5 seconds
  setInterval(function() {
    activeIndex = (activeIndex + 1) % items.length;
    showSlide(activeIndex);
  }, 5000); // Change slide every 5 seconds
});
