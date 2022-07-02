const path = require('path');

const configure = require('../data/config');
/** @type {import('@docusaurus/types').PresetConfig[]} */
module.exports = [
    [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
            docs: {
                breadcrumbs: false,
                routeBasePath: configure.docs.route,
                path: configure.docs.path,
                sidebarPath: require.resolve(path.resolve(__dirname, './sidebars.js')),
            },
            blog: false,
            theme: {
                customCss: path.resolve(__dirname, '../src/styles/index.css'),
            },
        }),
    ],
];
