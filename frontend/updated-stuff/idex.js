const toggleSwitch = document.querySelector('#darkModeToggle');

// Add event listener for the dark mode toggle
toggleSwitch.addEventListener('change', switchTheme, false);

function switchTheme() {
    if (toggleSwitch.checked) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}