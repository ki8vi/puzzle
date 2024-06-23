const execSync = require('child_process').execSync;

const regex = /^(feat|fix|chore|docs|init|refactor)\/[A-Z]{3}-PZ-\d{2}_\w+$/;
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

if (!regex.test(branchName)) {
  console.error('Invalid branch name');
  process.exit(1);
}
