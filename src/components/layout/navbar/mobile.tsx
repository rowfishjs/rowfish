import React, { FC } from 'react';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';

import { useLockBodyScroll, useNavbarMobileSidebar } from '@docusaurus/theme-common';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

import NavbarLogo from '@theme/Navbar/Logo';
import CloseIcon from '@ricons/material/CloseFilled';

function CloseButton() {
    const mobileSidebar = useNavbarMobileSidebar();
    return (
        <span className="tw-mt-[0.22rem] tw-text-xl" onClick={() => mobileSidebar.toggle()}>
            <span className="xicon">
                <CloseIcon />
            </span>
        </span>
    );
}
export const NavbarMobileSidebarHeader: FC = () => (
    <div className="navbar-sidebar__brand">
        <NavbarLogo />
        <CloseButton />
    </div>
);

export const NavbarMobileSidebar: FC = () => {
    const mobileSidebar = useNavbarMobileSidebar();
    useLockBodyScroll(mobileSidebar.shown);

    if (!mobileSidebar.shouldRender) {
        return null;
    }

    return (
        <NavbarMobileSidebarLayout
            header={<NavbarMobileSidebarHeader />}
            primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
            secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
        />
    );
};
