const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

const configure = require('../data/config');

module.exports = {
    liveCodeBlock: {
        playgroundPosition: 'bottom',
    },
    docs: {
        sidebar: {
            hideable: true,
            autoCollapseCategories: true,
        },
    },
    navbar: {
        hideOnScroll: true,
        // title: configure.site.title,
        logo: configure.site.logo,
        items: configure.navbarItems,
    },
    footer: {
        copyright: configure.site.copyright,
    },
    prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
    },
};
