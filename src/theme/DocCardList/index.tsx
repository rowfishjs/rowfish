import React from 'react';
import { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import { DocCardList } from '@site/src/components/card/doc/list';

export default (props: { items: PropSidebarItem[] }) => <DocCardList {...props} />;
