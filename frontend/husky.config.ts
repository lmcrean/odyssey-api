interface HuskyConfig {
  hooks: {
    [key: string]: string;
  };
}

const config: HuskyConfig = {
  hooks: {
    'pre-commit': 'echo "pre-commit hook"',
    'pre-push': 'echo "pre-push hook"'
  }
};

export default config; 