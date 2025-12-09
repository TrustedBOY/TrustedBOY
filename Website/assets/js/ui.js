function setActiveLink(page) {
    document.querySelectorAll("nav a").forEach(a => {
        a.classList.toggle("active", a.dataset.page === page);
    });
}

function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    btn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        btn.textContent = document.body.classList.contains("light-theme") 
            ? "☀️" 
            : "🌙";
    });
}

export { setActiveLink, setupThemeToggle };
