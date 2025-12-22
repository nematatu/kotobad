import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
          extend: {
            fontFamily: {
              sans: ['sans-serif'],
            },
            boxShadow: {
              'soft': '0 4px 20px -2px rgba(255, 49, 49, 0.08)',
              'glow': '0 0 20px rgba(255, 49, 49, 0.2)',
              'card': '0 2px 10px rgba(0,0,0,0.03)',
              '3d': '20px 20px 60px rgba(0,0,0,0.1), -20px -20px 60px rgba(255,255,255,0.5)',
              'float': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            },
            animation: {
              'fade-in': 'fadeIn 0.3s ease-out forwards',
              'fade-in-fast': 'fadeIn 0.15s ease-out forwards',
              'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              'scale-up': 'scaleUp 0.2s ease-out both',
              'scale-up-fast': 'scaleUp 0.15s ease-out both',
              'slide-down': 'slideDown 0.2s ease-out both',
              'slide-up': 'slideUp 0.2s ease-out both',
              'float': 'float 6s ease-in-out infinite',
              'float-delayed': 'float 6s ease-in-out 3s infinite',
              'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              'marquee': 'marquee 60s linear infinite',
              'marquee-reverse': 'marqueeReverse 60s linear infinite',
              'blob': 'blob 7s infinite',
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
              },
              fadeInUp: {
                '0%': { opacity: '0', transform: 'translate3d(0, 10px, 0)' },
                '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
              },
              scaleUp: {
                '0%': { transform: 'scale(0.95)', opacity: '0' },
                '100%': { transform: 'scale(1)', opacity: '1' },
              },
              slideDown: {
                '0%': { transform: 'translateY(-10px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
              },
              slideUp: {
                '0%': { transform: 'translateY(10px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
              },
              float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-15px)' },
              },
              marquee: {
                '0%': { transform: 'translate3d(0, 0, 0)' },
                '100%': { transform: 'translate3d(-100%, 0, 0)' },
              },
              marqueeReverse: {
                '0%': { transform: 'translate3d(-100%, 0, 0)' },
                '100%': { transform: 'translate3d(0, 0, 0)' },
              },
              blob: {
                '0%': { transform: 'translate(0px, 0px) scale(1)' },
                '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                '100%': { transform: 'translate(0px, 0px) scale(1)' },
              }
            }
          }
    },
	plugins: [require("@tailwindcss/line-clamp")],
};
export default config;
