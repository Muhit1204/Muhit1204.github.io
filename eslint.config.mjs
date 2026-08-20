import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

// ESLint 9 flat config, replacing the old .eslintrc.json ("extends": "next").
// eslint-config-next 16 ships flat-config arrays, so its entries spread in directly.
const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'next-env.d.ts',
      'tsconfig.tsbuildinfo',
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
