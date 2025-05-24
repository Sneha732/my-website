document.addEventListener("DOMContentLoaded", () => {
  const navbarPlaceholder = document.getElementById("navbar-container");

  if (!navbarPlaceholder) {
    console.error("Navbar container not found");
    return;
  }

  // Load navbar first
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      navbarPlaceholder.innerHTML = data;

      // Wait until navbar is injected before setting up related events
      initNavbarDependentFeatures();
       initSupportToggle();
  initDropdownToggle();
    })
    .catch((error) => console.error("Error loading navbar:", error));

  // Independent features that don't rely on the navbar
  initCarousel();
 
});

function initNavbarDependentFeatures() {
  console.log("initNavbarDependentFeatures is running...");
  const loginBtn = document.querySelector(".login-btn");
  const registerBtn = document.querySelector(".register-btn");

  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  if (!loginModal || !registerModal) return;

  const loginClose = loginModal.querySelector(".close");
  const registerClose = registerModal.querySelector(".register-close");

  const innerRegisterBtn = loginModal.querySelector(".inner-register-btn");
  const innerLoginBtn = registerModal.querySelector(".inner-login-btn");

  const switchToRegisterLink = document.getElementById("switchToRegister");
  const switchToLoginLink = document.getElementById("switchToLogin");

  if (loginBtn) loginBtn.addEventListener("click", showLoginModal);
  if (registerBtn) registerBtn.addEventListener("click", showRegisterModal);

  innerRegisterBtn?.addEventListener("click", showRegisterModal);
  innerLoginBtn?.addEventListener("click", showLoginModal);

  loginClose?.addEventListener(
    "click",
    () => (loginModal.style.display = "none")
  );
  registerClose?.addEventListener(
    "click",
    () => (registerModal.style.display = "none")
  );

  switchToRegisterLink?.addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterModal();
  });

  switchToLoginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginModal();
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
    if (e.target === registerModal) registerModal.style.display = "none";
  });

 function showLoginModal() {
  registerModal.style.display = "none";
  loginModal.style.display = "block";

  // Target buttons inside login modal
  const loginBtn = loginModal.querySelector(".inner-login-btn");
  const registerBtn = loginModal.querySelector(".inner-register-btn");

  loginBtn?.classList.add("active");
  registerBtn?.classList.remove("active");
}

function showRegisterModal() {
  loginModal.style.display = "none";
  registerModal.style.display = "block";

  // Target buttons inside register modal
  const registerBtn = registerModal.querySelector(".inner-register-btn");
  const loginBtn = registerModal.querySelector(".inner-login-btn");

  registerBtn?.classList.add("active");
  loginBtn?.classList.remove("active");
}


  
  // Scrollable Nav (if included in navbar.html)
  const scrollNavTrack = document.getElementById("scrollNavTrack");
  const scrollLeftBtn = document.getElementById("scrollLeft");
  const scrollRightBtn = document.getElementById("scrollRight");

  if (scrollNavTrack && scrollLeftBtn && scrollRightBtn) {
    let isCloned = false;
    const cloneNavItems = () => {
      const items = scrollNavTrack.querySelectorAll(".nav-items");
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        scrollNavTrack.appendChild(clone);
      });
    };
    scrollLeftBtn.addEventListener("click", () => {
      scrollNavTrack.scrollBy({ left: -300, behavior: "smooth" });
    });
    scrollRightBtn.addEventListener("click", () => {
      const maxScrollLeft =
        scrollNavTrack.scrollWidth - scrollNavTrack.clientWidth;
      if (!isCloned && scrollNavTrack.scrollLeft >= maxScrollLeft - 10) {
        cloneNavItems();
        isCloned = true;
      }
      scrollNavTrack.scrollBy({ left: 300, behavior: "smooth" });
    });
  }
}

function initCarousel() {
  document.querySelectorAll(".gallery-container").forEach((container) => {
    const track = container.querySelector(".image-track");
    const prevBtn = container.querySelector(".prevBtn");
    const nextBtn = container.querySelector(".nextBtn");
    let currentIndex = 0;

    const originalImages = Array.from(track.children).slice(0, 12);
    for (let i = 0; i < 4; i++) {
      const clone = originalImages[i].cloneNode(true);
      track.appendChild(clone);
    }

    function getImagesPerPage() {
      const width = window.innerWidth;
      if (width <= 479) return 2;
      if (width <= 767) return 3;
      return 4;
    }

    function updateTrackPosition(animate = true) {
      const imagesPerPage = getImagesPerPage();
      const images = Array.from(track.children);
      const targetIndex = currentIndex * imagesPerPage;
      if (!images[targetIndex]) return;
      const targetOffset = images[targetIndex].offsetLeft;
      track.style.transition = animate ? "transform 0.5s ease" : "none";
      track.style.transform = `translateX(-${targetOffset}px)`;
    }

    nextBtn?.addEventListener("click", () => {
      const imagesPerPage = getImagesPerPage();
      const totalPages = Math.ceil(track.children.length / imagesPerPage);
      currentIndex++;
      updateTrackPosition(true);
      if (currentIndex >= totalPages - 1) {
        setTimeout(() => {
          currentIndex = 0;
          updateTrackPosition(false);
        }, 500);
      }
    });

    prevBtn?.addEventListener("click", () => {
      const imagesPerPage = getImagesPerPage();
      const totalPages = Math.ceil(track.children.length / imagesPerPage);
      if (currentIndex === 0) {
        currentIndex = totalPages - 2;
        updateTrackPosition(false);
        setTimeout(() => {
          updateTrackPosition(true);
          currentIndex--;
        }, 20);
      } else {
        currentIndex--;
        updateTrackPosition(true);
      }
    });

    window.addEventListener("resize", () => updateTrackPosition(false));
    window.addEventListener("load", () => updateTrackPosition(false));
  });
}

function initSupportToggle() {
  const toggleBtn = document.getElementById("dropdownToggle");
  const supportInfo = document.getElementById("supportInfo");
  const chatBtn = document.getElementById("chatBtn");
  const phoneBtn = document.getElementById("phoneBtn");
  const svg = toggleBtn?.querySelector("svg");

  const email = "support@example.com";
  const phone = "+123-456-7890";

  const renderSupportRow = (label, value) => `
      <div class="support-row">
        <span>${label}</span>
        <span>${value}</span>
      </div>
    `;

  toggleBtn?.addEventListener("click", () => {
    const showingBoth =
      supportInfo.innerHTML.includes(email) &&
      supportInfo.innerHTML.includes(phone);
    if (showingBoth) {
      supportInfo.innerHTML = "";
      svg?.classList.remove("rotate");
    } else {
      supportInfo.innerHTML = `
          ${renderSupportRow("Technical Support", email)}
          ${renderSupportRow("Technical Support", phone)}
        `;
      svg?.classList.add("rotate");
    }
  });

  chatBtn?.addEventListener("click", () => {
    supportInfo.innerHTML = renderSupportRow("Technical Support", email);
    svg?.classList.remove("rotate");
  });

  phoneBtn?.addEventListener("click", () => {
    supportInfo.innerHTML = renderSupportRow("Technical Support", phone);
    svg?.classList.remove("rotate");
  });
}

function initDropdownToggle() {
  const menuDropdownToggle = document.getElementById("menuDropdownToggle");
  const dropdownContent = document.getElementById("dropdownContent");
  menuDropdownToggle?.addEventListener("click", () => {
    dropdownContent?.classList.toggle("show");
  });
}
