import React, { FC } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/DocPaginator';

import { Paginator } from './base';

export const DocPaginator: FC<Props> = (props) => {
    const { previous, next } = props;

    return (
        <Paginator
            nextItem={previous}
            prevItem={next}
            aria={translate({
                id: 'theme.docs.paginator.navAriaLabel',
                message: 'Docs pages navigation',
                description: 'The ARIA label for the docs pagination',
            })}
            titleContent
            info={{
                next: (
                    <Translate
                        id="theme.docs.paginator.previous"
                        description="The label used to navigate to the previous doc"
                    >
                        Previous
                    </Translate>
                ),
                prev: (
                    <Translate
                        id="theme.docs.paginator.next"
                        description="The label used to navigate to the next doc"
                    >
                        Next
                    </Translate>
                ),
            }}
        />
    );
};
