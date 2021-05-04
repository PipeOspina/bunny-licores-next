import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export const Liquor = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <g>
                <rect fill="none" height="24" width="24" y="0" />
            </g>
            <g>
                <g>
                    <path d="M3,14c0,1.3,0.84,2.4,2,2.82V20H3v2h6v-2H7v-3.18C8.16,16.4,9,15.3,9,14V6H3V14z M5,8h2v3H5V8z M5,13h2v1 c0,0.55-0.45,1-1,1s-1-0.45-1-1V13z" />
                    <path d="M20.64,8.54l-0.96-0.32C19.27,8.08,19,7.7,19,7.27V3c0-0.55-0.45-1-1-1h-3c-0.55,0-1,0.45-1,1v4.28 c0,0.43-0.27,0.81-0.68,0.95l-0.96,0.32C11.55,8.83,11,9.59,11,10.45V20c0,1.1,0.9,2,2,2h7c1.1,0,2-0.9,2-2v-9.56 C22,9.58,21.45,8.82,20.64,8.54z M16,4h1v1h-1V4z M20,20h-7v-2h7V20z M20,16h-7v-2h7V16z M20,12h-7v-1.56l0.95-0.32 C15.18,9.72,16,8.57,16,7.28V7h1v0.28c0,1.29,0.82,2.44,2.05,2.85L20,10.44V12z" />
                </g>
            </g>
        </SvgIcon>
    );
};

export const SportsBar = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <rect fill="none" height="24" width="24" />
            <path d="M15,19H8l0-6.63c1.26-0.34,2.11-1.27,2.77-1.99C11.6,9.47,12.08,9,13,9l2,0V19z M10,2.02c-1.89,0-3.51,1.11-4.27,2.71 C4.15,5.26,3,6.74,3,8.5c0,1.86,1.28,3.41,3,3.86L6,21h11v-2h2c1.1,0,2-0.9,2-2v-6c0-1.1-0.9-2-2-2h-1.56C17.79,8.41,18,7.73,18,7 c0-2.21-1.79-4-4-4c-0.34,0-0.66,0.05-0.98,0.13C12.2,2.45,11.16,2.02,10,2.02L10,2.02z M7,10.5c-1.1,0-2-0.9-2-2 c0-0.85,0.55-1.6,1.37-1.88l0.8-0.27l0.36-0.76C8,4.62,8.94,4.02,10,4.02c0.79,0,1.39,0.35,1.74,0.65l0.78,0.65 c0,0,0.64-0.32,1.47-0.32c1.1,0,2,0.9,2,2c0,0-3,0-3,0C9.67,7,9.15,10.5,7,10.5C7,10.5,7,10.5,7,10.5L7,10.5z M17,17v-6h2v6H17 L17,17z" />
        </SvgIcon>
    );
};

export const LocalBar = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M14.77 9L12 12.11 9.23 9h5.54M21 3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9V3zM7.43 7L5.66 5h12.69l-1.78 2H7.43z" />
        </SvgIcon>
    );
};

export const WineBar = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <rect fill="none" height="24" width="24" />
            <path d="M6,3l0,6c0,2.97,2.16,5.43,5,5.91V19H8v2h8v-2h-3v-4.09c2.84-0.48,5-2.94,5-5.91V3H6z M12,13c-1.86,0-3.41-1.28-3.86-3h7.72 C15.41,11.72,13.86,13,12,13z M16,8H8l0-3h8L16,8z" />
        </SvgIcon>
    );
};
