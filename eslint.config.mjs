import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
	{
		plugins: ["prettier"],
		parser: "@typescript-eslint/parser",
		rules: {
			"prettier/prettier": [
				"error",
				{ endOfLine: "auto", printWidth: 110 },
				{ usePrettierrc: true },
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true }],
		},
	},
];

export default eslintConfig;
