let scrollingInterval = null;

export function toggleScrolling() {
    const scrollingButton = document.getElementById('scrollingButton');
    const songContent = document.getElementById('songContent');

    if (!songContent) return;

    if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
        scrollingButton.textContent = '▶';
    } else {
        scrollingButton.textContent = '■';
        scrollingInterval = setInterval(() => {
            songContent.scrollBy(0, 1);
            if (songContent.scrollTop + songContent.clientHeight >= songContent.scrollHeight) {
                clearInterval(scrollingInterval);
                scrollingInterval = null;
                scrollingButton.textContent = '▶';
            }
        }, 50);
    }
}

export function initializeScrollingButton() {
    const scrollingButton = document.getElementById('scrollingButton');
    scrollingButton.style.display = 'none';
}

export function watchContentHeight() {
    const songContent = document.getElementById('songContent');
    const scrollingButton = document.getElementById('scrollingButton');

    new ResizeObserver(() => {
        if (songContent.scrollHeight > songContent.clientHeight) {
            scrollingButton.style.display = 'inline-block';
        } else {
            scrollingButton.style.display = 'none';
        }
    }).observe(songContent);
}

export function stopScrolling() {
    if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
        const scrollingButton = document.getElementById('scrollingButton');
        scrollingButton.textContent = '▶';
    }
}
