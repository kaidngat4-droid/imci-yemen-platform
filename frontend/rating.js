// نظام التقييم
const IMCI_Rating = {
    create(containerId, maxStars = 5, initial = 0, readonly = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= maxStars; i++) {
            const star = document.createElement('span');
            star.textContent = i <= initial ? '⭐' : '☆';
            star.style.cssText = 'font-size:24px;cursor:' + (readonly ? 'default' : 'pointer') + ';margin:2px;';
            if (!readonly) {
                star.onclick = () => {
                    container.querySelectorAll('span').forEach((s, j) => {
                        s.textContent = j < i ? '⭐' : '☆';
                    });
                    container.setAttribute('data-rating', i);
                };
            }
            container.appendChild(star);
        }
    },
    get(containerId) {
        return document.getElementById(containerId)?.getAttribute('data-rating') || 0;
    }
};
