const app = document.getElementById("app");

async function loadPage(page) {
    const res = await fetch(`sections/${page}.html`);
    const html = await res.text();
    app.innerHTML = html;
    window.scrollTo(0, 0);
    animatePage();
}

function animatePage() {
    app.classList.add("fade-in");
    setTimeout(() => app.classList.remove("fade-in"), 500);
}

export { loadPage };
