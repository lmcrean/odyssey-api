interface LintStagedConfig {
  [key: string]: string | string[];
}

const config: LintStagedConfig = {
  '*.ts': 'eslint --fix',
  '*.tsx': 'eslint --fix',
  '*.{ts,tsx,js,jsx,json,css,md}': 'prettier --write'
};

export default config; 