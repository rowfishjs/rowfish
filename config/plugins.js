/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */

const BlogPlugin = require('@docusaurus/plugin-content-blog').default;
const DefaultBlogOptions = require('@docusaurus/plugin-content-blog/lib/options').DEFAULT_OPTIONS;

const configure = require('../data/config');

module.exports = [
    '@docusaurus/theme-live-codeblock',
    'docusaurus-plugin-less',
    '@docusaurus/plugin-ideal-image',
    async function blogPluginEnhanced(context, options) {
        const blogPluginInstance = await BlogPlugin(context, {
            ...DefaultBlogOptions,
            ...options,
            ...configure.blog,
        });

        return {
            ...blogPluginInstance,
            async contentLoaded(...contentLoadedArgs) {
                await blogPluginInstance.contentLoaded(...contentLoadedArgs);
                const { actions, content } = contentLoadedArgs[0];
                const { setGlobalData } = actions;
                const { blogTags } = content;
                setGlobalData({
                    tags: blogTags,
                    route: configure.blog.routeBasePath,
                    title: configure.site.tagline,
                });
            },
        };
    },
    function tailwind() {
        return {
            name: 'postcss-tailwindcss-loader',
            configurePostCss(postcssOptions) {
                postcssOptions.plugins = {
                    'postcss-import': {},
                    'postcss-nesting': {},
                    'tailwindcss/nesting': {},
                    tailwindcss: {},
                    autoprefixer: {},
                    'postcss-mixins': {},
                };
                return postcssOptions;
            },
        };
    },
];
