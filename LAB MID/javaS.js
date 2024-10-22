document.addEventListener('DOMContentLoaded', () => {
    const pic = document.getElementById('profile-pic');
    const hoverInfo = document.getElementById('hoverInfo');

    pic.addEventListener('mouseenter', () => {
        hoverInfo.style.display = 'block'; // Show the info on hover
    });

    pic.addEventListener('mouseleave', () => {
        hoverInfo.style.display = 'none'; // Hide the info when not hovering
    });
});

