document.addEventListener("DOMContentLoaded", function() {
  const goToTopButton = document.getElementById("go-to-top");

  // Show the button when the user scrolls down 100px from the top
  window.onscroll = function() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      goToTopButton.style.display = "block";
    } else {
      goToTopButton.style.display = "none";
    }
  };

  // When the user clicks on the button, scroll to the top of the page
  goToTopButton.onclick = function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});
