const content_dir = 'contents/';
const config_file = 'config.yml';

// 更新 sections 数组以匹配实际文件名
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
                } catch (e) {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString() + " Error: " + e);
                }
            });
        })
        .catch(error => console.log('Error loading config.yml:', error));

    // Load Markdown files with Marked
    marked.use({ mangle: false, headerIds: false });
    sections.forEach(section => {
        fetch(content_dir + section.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(markdown => {
                const html = marked.parse(markdown);
                const element = document.getElementById(section.id + '-md');
                if (element) {
                    element.innerHTML = html;
                } else {
                    console.error(`Element with id '${section.id}-md' not found`);
                }
            })
            .then(() => {
                // Render MathJax after loading Markdown
                MathJax.typeset();
            })
            .catch(error => console.error(`Error loading ${section.file}:`, error));
    });
});
