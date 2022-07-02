/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useSpring, useTransition, animated, Spring } from '@react-spring/web';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

import * as lives from '@site/data/demo/lives';
// Add react-live imports you need here
const ReactLiveScope = {
    React,
    useSpring,
    useTransition,
    animated,
    Spring,
    Parallax,
    ParallaxLayer,
    ...React,
    ...lives,
} as any;

export default ReactLiveScope;
