import { loadPage } from "./router.js";
import { setActiveLink, setupThemeToggle } from "./ui.js";

function initRouter() {
    window.addEventListener("hashchange", () => {
        const page = location.hash.replace("#", "") || "home";
        setActiveLink(page);
        loadPage(page);
    });

    // First load
    const page = location.hash.replace("#", "") || "home";
    setActiveLink(page);
    loadPage(page);
}

setupThemeToggle();
initRouter();
