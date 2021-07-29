import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import dsv from "@rollup/plugin-dsv";
import cleaner from "rollup-plugin-cleaner";
import replaceHtmlVars from "rollup-plugin-replace-html-vars";
import { v4 as uuid } from "uuid";
import sveltePreprocess from "svelte-preprocess";
import babel from "rollup-plugin-babel";
import dotenv from "dotenv";

dotenv.config();
const production = !process.env.ROLLUP_WATCH;

const hash = uuid();

export default {
	input: "src/main.js",
	preserveEntrySignatures: false,
	output: {
		sourcemap: !production,
		format: "iife",
		name: "app",
		file: production
			? `public/build/bundle-${hash}.js`
			: "public/build/bundle.js",
	},
	plugins: [
		production &&
			cleaner({
				targets: ["./public/build/"],
			}),
		replaceHtmlVars({
			files: "public/index.html",
			from: [
				/(squareupsandbox|squareup)/g,
				"GOOGLE",
				/(?<=build\/)bundle(?:-.*)?(?=\.(css|js))/g,
			],
			to: [
				process.env.SQUARE_ENV == "Production" ? "squareup" : "squareupsandbox",
				process.env.GOOGLE,
				production ? `bundle-${hash}` : "bundle",
			],
		}),
		svelte({
			preprocess: sveltePreprocess({
				sourceMap: !production,
				defaults: { style: "sass" },
				sass: {
					prependData: `@import 'src/styles.sass'`,
				},
				postcss: {
					plugins: [require("autoprefixer")()],
				},
				replace: [["SQUARE_APP", process.env.SQUARE_APP]],
			}),
			dev: !production,
			css: css =>
				css.write(
					production ? `bundle-${hash}.css` : "bundle.css",
					!production
				),
			onwarn: (warning, handler) => {
				if (warning.code.includes("a11y")) return;
				handler(warning);
			},
		}),
		dsv({
			processRow: row => {
				Object.keys(row).forEach(key => {
					var value = row[key];
					row[key] = isNaN(+value) ? value : +value;
				});
				return Object.values(row);
			},
		}),
		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs(),
		production &&
			babel({
				extensions: [".js", ".mjs", ".html", ".svelte"],
				runtimeHelpers: true,
				exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],
				presets: [
					[
						"@babel/preset-env",
						{
							useBuiltIns: "entry",
							corejs: 3,
						},
					],
				],
				plugins: [
					"@babel/plugin-syntax-dynamic-import",
					"@babel/plugin-proposal-optional-chaining",
					"@babel/plugin-proposal-object-rest-spread",
				],
			}),
		!production && serve(),
		!production && livereload("public"),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

function serve() {
	let server;
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);
			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}
