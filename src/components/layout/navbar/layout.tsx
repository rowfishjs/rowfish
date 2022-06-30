import React, { FC, type ComponentProps } from 'react';
import clsx from 'clsx';

import {
    useThemeConfig,
    useHideableNavbar,
    useNavbarMobileSidebar,
} from '@docusaurus/theme-common';

import { NavbarMobileSidebar } from './mobile';

import styles from './layout.module.css';

function NavbarBackdrop(props: ComponentProps<'div'>) {
    return (
        <div
            role="presentation"
            {...props}
            className={clsx('navbar-sidebar__backdrop', props.className)}
        />
    );
}
export const NavbarLayout: FC = ({ children }) => {
    const {
        navbar: { hideOnScroll, style },
    } = useThemeConfig();
    const mobileSidebar = useNavbarMobileSidebar();
    const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);
    return (
        <nav
            ref={navbarRef}
            className={clsx(
                'navbar',
                'navbar--fixed-top',
                hideOnScroll && [styles.navbarHideable, !isNavbarVisible && styles.navbarHidden],
                {
                    'navbar--dark': style === 'dark',
                    'navbar--primary': style === 'primary',
                    'navbar-sidebar--show': mobileSidebar.shown,
                    'tw-backdrop-blur-sm': !mobileSidebar.shown,
                },
            )}
        >
            {children}
            <NavbarBackdrop onClick={mobileSidebar.toggle} />
            <NavbarMobileSidebar />
        </nav>
    );
};
