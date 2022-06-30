import React, { FC, type ReactNode } from 'react';
import type { Props as NavbarItemConfig } from '@theme/NavbarItem';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import { splitNavbarItems, useNavbarMobileSidebar, useThemeConfig } from '@docusaurus/theme-common';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';

import clsx from 'clsx';

import NavbarLogo from '@theme/Navbar/Logo';

import styles from './content.module.css';

interface LayoutProps {
    left: ReactNode;
    right: ReactNode;
    containerNav?: boolean;
}
function useNavbarItems() {
    // TODO temporary casting until ThemeConfig type is improved
    return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({ items }: { items: NavbarItemConfig[] }): JSX.Element {
    return (
        <>
            {items.map((item, i) => (
                <NavbarItem {...item} key={i.toFixed()} />
            ))}
        </>
    );
}

function NavbarContentLayout({ left, right, containerNav }: LayoutProps) {
    return (
        <div className={clsx('navbar__inner', { container: containerNav })}>
            <div className="navbar__items">{left}</div>
            <div className="navbar__items navbar__items--right">{right}</div>
        </div>
    );
}

export const NavbarContent: FC<{ containerNav?: boolean }> = ({ containerNav }) => {
    const mobileSidebar = useNavbarMobileSidebar();

    const items = useNavbarItems();
    const [leftItems, rightItems] = splitNavbarItems(items);

    const autoAddSearchBar = !items.some((item) => item.type === 'search');

    return (
        <NavbarContentLayout
            containerNav={containerNav}
            left={
                // TODO stop hardcoding items?
                <>
                    {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
                    <NavbarLogo />
                    <NavbarItems items={leftItems} />
                </>
            }
            right={
                // TODO stop hardcoding items?
                // Ask the user to add the respective navbar items => more flexible
                <>
                    <NavbarItems items={rightItems} />
                    <NavbarColorModeToggle className={clsx(styles.colorToggle)} />
                    {autoAddSearchBar && <SearchBar />}
                </>
            }
        />
    );
};
