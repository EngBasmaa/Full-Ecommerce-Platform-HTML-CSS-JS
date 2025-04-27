function setupManualSwiper() {
  const swiperWrapper = document.getElementById("related-products-swiper");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentTranslate = 0;
  const slideWidth = swiperWrapper.querySelector(".swiper-slide")?.offsetWidth || 300; // عرض السلايد الواحد
  const maxTranslate = -(swiperWrapper.scrollWidth - swiperWrapper.parentElement.offsetWidth); // الحد الأقصى للحركة
  let direction = -1; // يبدأ التحرك للأمام (اليمين)

  prevBtn.addEventListener("click", () => {
    currentTranslate += slideWidth;
    if (currentTranslate > 0) {
      currentTranslate = 0; // مايتحركش أكتر من أول سلايد
    }
    swiperWrapper.style.transform = `translateX(${currentTranslate}px)`;
  });

  nextBtn.addEventListener("click", () => {
    currentTranslate -= slideWidth;
    if (currentTranslate < maxTranslate) {
      currentTranslate = maxTranslate; // مايتحركش أكتر من آخر سلايد
    }
    swiperWrapper.style.transform = `translateX(${currentTranslate}px)`;
  });

  // شوية تنسيقات مبدئية
  swiperWrapper.style.display = "flex";
  swiperWrapper.style.transition = "transform 0.3s ease-in-out";

  // حركة تلقائية للسلايدر كل ثانية
  setInterval(() => {
    // حرك السوايبر للأمام أو الخلف بناءً على الاتجاه
    currentTranslate += direction * slideWidth;

    // إذا وصلنا لآخر سلايد، عكس الاتجاه
    if (currentTranslate <= maxTranslate || currentTranslate >= 0) {
      direction *= -1; // عكس الاتجاه
    }

    swiperWrapper.style.transform = `translateX(${currentTranslate}px)`;
  }, 1000); // 1000 ملي ثانية = ثانية واحدة
}
