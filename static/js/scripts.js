const content_dir = 'contents/';
const config_file = 'config.yml';

// 更新 section_names 以匹配实际部分，并添加映射关系
const sections = [
    { id: 'home', file: 'Home.md' },
    { id: 'research', file: 'Research Experience.md' },
    { id: 'awards', file: 'Awards and Competitions.md' },
    { id: 'experience', file: 'Extra-Curricular Activities.md' },
    { id: 'publications', file: 'Publications.md' }
];

window.addEventListener('DOMContentLoaded', event => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Load YAML config
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString());
                }
            });
        })
        .catch(error => console.log('Error loading config.yml:', error));

    // Load Markdown files with Marked
    marked.use({ mangle: false, headerIds: false });
    sections.forEach(section => {
        fetch(content_dir + section.file)
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(section.id + '-md').innerHTML = html;
            })
            .then(() => {
                // Render MathJax after loading Markdown
                MathJax.typeset();
            })
            .catch(error => console.log(`Error loading ${section.file}:`, error));
    });
});
