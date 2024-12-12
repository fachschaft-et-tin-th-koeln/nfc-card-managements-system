/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
	mode: "jit",
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				white: colors.white,
				gray: colors.gray,
				green: colors.green,
				blue: colors.blue,
				red: colors.red,
				yellow: colors.yellow,
				purple: colors.purple,
			},
			fontFamily: {
				barlow: ["Barlow Condensed", "sans-serif"],
				writers: ["kb-writers-block"],
				bowlby: ["bowlby-one-sc"],
				cute: ["Cute Be Special"],
			},
			backgroundImage: {
				christmas: "url('@/assets/christmas-bg.jpg')", // Verwende den Alias für den Vue-Assets-Ordner
				"gradient-to-r": "linear-gradient(to right, #4facfe, #00f2fe)",
			},
		},
	},
	plugins: [],
};
