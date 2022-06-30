import React from 'react';

import type { Props } from '@theme/BlogTagsPostsPage';
import { BlogTagsPostsPage } from '@site/src/components/blog';
// Very simple pluralization: probably good enough for now

export default (props: Props) => <BlogTagsPostsPage {...props} />;
