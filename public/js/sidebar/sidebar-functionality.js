document.addEventListener('DOMContentLoaded', function () {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    function saveState(key, value) {
        localStorage.setItem(key, value);
    }

    function loadState(key) {
        return localStorage.getItem(key);
    }

    function toggleSubmenu(item, save = true) {
        const submenu = item.querySelector('.submenu');
        if (submenu) {
            item.classList.toggle('active');
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            if (save) {
                saveState(`submenu_${item.querySelector('a').getAttribute('href')}`, item.classList.contains('active'));
            }
        }
    }

    function setActiveItem(link) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const parentItem = link.closest('.sidebar-item');
        if (parentItem && parentItem.classList.contains('has-sub')) {
            sidebarItems.forEach(item => item.classList.remove('active'));
            parentItem.classList.add('active');
        }

        saveState('activeLink', link.getAttribute('href'));
    }

    // Restore submenu states
    sidebarItems.forEach(item => {
        if (item.classList.contains('has-sub')) {
            const link = item.querySelector('a');
            const isActive = loadState(`submenu_${link.getAttribute('href')}`) === 'true';
            if (isActive) {
                toggleSubmenu(item, false);
            }
        }
    });

    // Restore active item
    const activeLink = loadState('activeLink') || '/dashboard';
    const activeLinkElement = document.querySelector(`.sidebar-link[href="${activeLink}"]`);
    if (activeLinkElement) {
        setActiveItem(activeLinkElement);
        const parentItem = activeLinkElement.closest('.sidebar-item.has-sub');
        if (parentItem) {
            toggleSubmenu(parentItem, false);
        }
    }

    // Add click event listeners
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const parentItem = link.closest('.sidebar-item.has-sub');
            if (parentItem) {
                e.preventDefault();
                toggleSubmenu(parentItem);
            }
            setActiveItem(link);
        });
    });

    // Handle initial page load
    const currentPath = window.location.pathname;
    const currentLinkElement = document.querySelector(`.sidebar-link[href="${currentPath}"]`);
    if (currentLinkElement) {
        setActiveItem(currentLinkElement);
        const parentItem = currentLinkElement.closest('.sidebar-item.has-sub');
        if (parentItem) {
            toggleSubmenu(parentItem, false);
        }
    }
});