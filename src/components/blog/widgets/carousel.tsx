import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Mousewheel, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import { CarouselItemType } from '@site/src/types';

import Image from '@theme/IdealImage';

import Link from '@docusaurus/Link';

import { isNil } from 'lodash-es';

import clsx from 'clsx';

import $styles from './carousel.module.css';

const CarouselItem: FC<CarouselItemType> = ({
    image,
    link,
    description,
    darkBg = true,
    target = '_self',
    title,
}) => {
    return (
        <Link itemProp="url" to={link} target={target} className={clsx('tw-panel', $styles.item)}>
            <Image img={image} />
            <div className={clsx($styles.wrapper, { [$styles.darkBg]: darkBg })}>
                <header>
                    {!isNil(title) && <h2 itemProp="headline">{title}</h2>}
                    {!isNil(description) && (
                        <div
                            className={$styles.description}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: description,
                            }}
                        />
                    )}
                </header>
            </div>
        </Link>
    );
};
export const Carousel: FC<{ data: CarouselItemType[] }> = ({ data }) => {
    return (
        <Swiper
            className={$styles.container}
            spaceBetween={50}
            loop
            keyboard={{
                enabled: true,
            }}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                waitForTransition: true,
                pauseOnMouseEnter: true,
            }}
            mousewheel
            pagination={{
                clickable: true,
            }}
            modules={[Mousewheel, Keyboard, Autoplay, Pagination]}
        >
            {data.map((item, i) => (
                <SwiperSlide key={i.toFixed()}>
                    <CarouselItem {...item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
