/** @type {import('next').NextConfig} */
const path = require('path');
const dotenv = require('dotenv');

module.exports = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });  
        return config;
    },


    env: process.env.NEXT_ENV === 'dev'
        ? dotenv
            .config({ path: path.join(__dirname, '.env.development.local')})
            .parsed || {}
        : process.env.NEXT_ENV === 'prod'
            ? dotenv
                .config({ path: path.join(__dirname, '.env.production.local')})
                .parsed || {}
            : {},
};
