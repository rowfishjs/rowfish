/* eslint-disable global-require */
// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    prefix: 'tw-',
    darkMode: 'class',
    content: ['./config/**/*.js', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '480px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1400px',
        },
        extend: {
            fontFamily: {
                sans: 'var(--ifm-font-family-base)',
                firacode: 'var(--font-family-firacode)',
                kaiti: 'var(--font-family-kaiti)',
            },
            colors: {
                'font-color': 'var(--ifm-font-color-base)',
                'link-color': 'var(--ifm-link-color)',
                'link-hover-color': 'var(--ifm-link-hover-color)',
                primary: 'var(--ifm-color-primary)',
                'primary-light': 'var(--ifm-color-primary-light)',
                'primary-lighter': 'var(--ifm-color-primary-lighter)',
                'primary-lightest': 'var(--ifm-color-primary-lightest)',
                'primary-dark': 'var(--ifm-color-primary-dark)',
                'primary-darker': 'var(--ifm-color-primary-darker)',
                'primary-darkest': 'var(--ifm-color-primary-darkest)',
            },
            boxShadow: {
                nysm: '0 0 2px 0 rgb(0 0 0 / 0.05)',
                ny: '0 0 3px 0 rgb(0 0 0 / 0.1), 0 0 2px - 1px rgb(0 0 0 / 0.1)',
                nymd: '0 0 6px -1px rgb(0 0 0 / 0.1), 0 0 4px -2px rgb(0 0 0 / 0.1)',
                nylg: '0 0 15px -3px rgb(0 0 0 / 0.1), 0 0 6px -4px rgb(0 0 0 / 0.1)',
                spread: '0 5px 40px rgb(0 0 0 / 0.1)',
            },
        },
    },
    // 自定义样式请通过 src/styles/tailwind中的样式实现,不建议通过插件添加
    plugins: [require('@tailwindcss/line-clamp')],
};
