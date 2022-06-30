import React, { FC } from 'react';

import { NavbarContent } from './content';
import { NavbarLayout } from './layout';

export const Navbar: FC<{ containerNav?: boolean }> = ({ containerNav }) => (
    <NavbarLayout>
        <NavbarContent containerNav={containerNav} />
    </NavbarLayout>
);
