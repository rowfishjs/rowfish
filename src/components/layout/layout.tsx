import React, { FC, useCallback, useEffect } from 'react';
import LayoutProviders from '@theme/LayoutProviders';

import {
    PageMetadata,
    ThemeClassNames,
    useColorMode,
    useKeyboardNavigation,
} from '@docusaurus/theme-common';

import clsx from 'clsx';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';

import ErrorBoundary from '@docusaurus/ErrorBoundary';

import ErrorPageContent from '@theme/ErrorPageContent';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import { LayoutProps } from './types';
import { Navbar } from './navbar';
import { Footer } from './footer';
import './layout.css';

const useThemeListener = () => {
    const { colorMode } = useColorMode();
    const html = ExecutionEnvironment.canUseDOM ? document.documentElement : null;
    const observer = ExecutionEnvironment.canUseDOM
        ? new MutationObserver((mutation) => {
              const className = (mutation[0].target as any).className as string;
              if (
                  (className.includes('tw-dark') && colorMode !== 'dark') ||
                  (!className.includes('tw-dark') && colorMode === 'dark')
              ) {
                  changeDarkMode(colorMode === 'dark');
              }
          })
        : null;
    const changeDarkMode = useCallback((isDark: boolean) => {
        if (!ExecutionEnvironment.canUseDOM) return;
        isDark ? html!.classList.add('tw-dark') : html!.classList.remove('tw-dark');
    }, []);

    useEffect(() => {
        if (ExecutionEnvironment.canUseDOM) {
            observer!.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });
            changeDarkMode(colorMode === 'dark');
        }
        return () => {
            if (ExecutionEnvironment.canUseDOM) {
                observer!.disconnect();
                html!.classList.remove('tw-dark');
                html!.classList.remove('home');
            }
        };
    }, [colorMode]);
};
const DarkModeMonitor: FC = ({ children }) => {
    useThemeListener();
    return <>{children}</>;
};

const baseClasses = [
    'tw-bg-fixed',
    'tw-bg-no-repeat',
    'tw-bg-center',
    'tw-bg-cover',
    'tw-flex-auto',
    'tw-flex-col',
    'tw-flex',
];
export const Layout: FC<LayoutProps> = ({
    containerNav,
    footer,
    className,
    footerClass,
    ...props
}) => {
    const { children, wrapperClassName, title, description } = props;
    useKeyboardNavigation();
    return (
        <LayoutProviders>
            <DarkModeMonitor>
                <div id="main-layout" className={clsx(baseClasses, className)}>
                    <PageMetadata title={title} description={description} />

                    <SkipToContent />
                    <AnnouncementBar />
                    <Navbar containerNav={containerNav} />

                    <div className={clsx(ThemeClassNames.wrapper.main, wrapperClassName)}>
                        <ErrorBoundary fallback={ErrorPageContent}>
                            {children}
                            {footer && <Footer className={footerClass} />}
                        </ErrorBoundary>
                    </div>
                </div>
            </DarkModeMonitor>
        </LayoutProviders>
    );
};
