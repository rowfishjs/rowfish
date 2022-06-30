/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
// The `mass` prop defaults to 1
// eslint-disable-next-line import/no-extraneous-dependencies
import { EasingFunction } from '@react-spring/types';

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

const bounceOut: EasingFunction = (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    }
    if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    }
    if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    }
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

export const spring = {
    config: {
        default: { tension: 170, friction: 26 },
        gentle: { tension: 120, friction: 14 },
        wobbly: { tension: 180, friction: 12 },
        stiff: { tension: 210, friction: 20 },
        slow: { tension: 280, friction: 60 },
        molasses: { tension: 280, friction: 120 },
    } as const,
    POINTS: '22.5 35.25 8.68704657 42.5118994 11.3250859 27.1309497 0.150171867 16.2381006 15.5935233 13.9940503 22.5 0 29.4064767 13.9940503 44.8498281 16.2381006 33.6749141 27.1309497 36.3129534 42.5118994',
    NUM_TRANS: [
        {
            fig: 1,
            op: { range: [0.75, 1.0], output: [0, 1] },
            trans: { range: [0.75, 1.0], output: [-40, 0], extrapolate: 'clamp' },
        },
        {
            fig: 2,
            op: { range: [0.25, 0.5], output: [0, 1] },
            trans: { range: [0.25, 0.5], output: [-40, 0], extrapolate: 'clamp' },
        },
        {
            fig: 3,
            op: { range: [0.0, 0.25], output: [0, 1] },
            trans: { range: [0.0, 0.25], output: [-40, 0], extrapolate: 'clamp' },
        },
        {
            fig: 4,
            op: { range: [0.5, 0.75], output: [0, 1] },
            trans: { range: [0.5, 0.75], output: [-40, 0], extrapolate: 'clamp' },
        },
    ],
    easings: {
        linear: (x: any) => x,
        easeInQuad: (x: number) => x * x,
        easeOutQuad: (x: number) => 1 - (1 - x) * (1 - x),
        easeInOutQuad: (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2),
        easeInCubic: (x: number) => x * x * x,
        easeOutCubic: (x: number) => 1 - (1 - x) ** 3,
        easeInOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
        easeInQuart: (x: number) => x * x * x * x,
        easeOutQuart: (x: number) => 1 - (1 - x) ** 4,
        easeInOutQuart: (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - (-2 * x + 2) ** 4 / 2),
        easeInQuint: (x: number) => x * x * x * x * x,
        easeOutQuint: (x: number) => 1 - (1 - x) ** 5,
        easeInOutQuint: (x: number) =>
            x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2,
        easeInSine: (x: number) => 1 - Math.cos((x * Math.PI) / 2),
        easeOutSine: (x: number) => Math.sin((x * Math.PI) / 2),
        easeInOutSine: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
        easeInExpo: (x: number) => (x === 0 ? 0 : 2 ** (10 * x - 10)),
        easeOutExpo: (x: number) => (x === 1 ? 1 : 1 - 2 ** (-10 * x)),
        easeInOutExpo: (x: number) =>
            x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5
                ? 2 ** (20 * x - 10) / 2
                : (2 - 2 ** (-20 * x + 10)) / 2,
        easeInCirc: (x: number) => 1 - Math.sqrt(1 - x ** 2),
        easeOutCirc: (x: number) => Math.sqrt(1 - (x - 1) ** 2),
        easeInOutCirc: (x: number) =>
            x < 0.5
                ? (1 - Math.sqrt(1 - (2 * x) ** 2)) / 2
                : (Math.sqrt(1 - (-2 * x + 2) ** 2) + 1) / 2,
        easeInBack: (x: number) => c3 * x * x * x - c1 * x * x,
        easeOutBack: (x: number) => 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2,
        easeInOutBack: (x: number) =>
            x < 0.5
                ? ((2 * x) ** 2 * ((c2 + 1) * 2 * x - c2)) / 2
                : ((2 * x - 2) ** 2 * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2,
        easeInElastic: (x: number) =>
            x === 0 ? 0 : x === 1 ? 1 : -(2 ** (10 * x - 10)) * Math.sin((x * 10 - 10.75) * c4),
        easeOutElastic: (x: number) =>
            x === 0 ? 0 : x === 1 ? 1 : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1,
        easeInOutElastic: (x: number) =>
            x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5
                ? -(2 ** (20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (2 ** (-20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1,
        easeInBounce: (x: number) => 1 - bounceOut(1 - x),
        easeOutBounce: bounceOut,
        easeInOutBounce: (x: number) =>
            x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2,
    } as const,
};

export interface EasingDictionary {
    linear: (t: number) => number;
    easeInQuad: (t: number) => number;
    easeOutQuad: (t: number) => number;
    easeInOutQuad: (t: number) => number;
    easeInCubic: (t: number) => number;
    easeOutCubic: (t: number) => number;
    easeInOutCubic: (t: number) => number;
    easeInQuart: (t: number) => number;
    easeOutQuart: (t: number) => number;
    easeInOutQuart: (t: number) => number;
    easeInQuint: (t: number) => number;
    easeOutQuint: (t: number) => number;
    easeInOutQuint: (t: number) => number;
    easeInSine: (t: number) => number;
    easeOutSine: (t: number) => number;
    easeInOutSine: (t: number) => number;
    easeInExpo: (t: number) => number;
    easeOutExpo: (t: number) => number;
    easeInOutExpo: (t: number) => number;
    easeInCirc: (t: number) => number;
    easeOutCirc: (t: number) => number;
    easeInOutCirc: (t: number) => number;
    easeInBack: (t: number) => number;
    easeOutBack: (t: number) => number;
    easeInOutBack: (t: number) => number;
    easeInElastic: (t: number) => number;
    easeOutElastic: (t: number) => number;
    easeInOutElastic: (t: number) => number;
    easeInBounce: (t: number) => number;
    easeOutBounce: (t: number) => number;
    easeInOutBounce: (t: number) => number;
}
