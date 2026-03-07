/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const featureName = process.argv[2];

if (!featureName) {
  console.error(
    "Please provide a feature name. Example: bun run generate:feature my-feature",
  );
  process.exit(1);
}

const targetDir = path.join(__dirname, "features", featureName);

if (fs.existsSync(targetDir)) {
  console.error(`Feature directory ${featureName} already exists!`);
  process.exit(1);
}

const directories = [
  "components",
  "hooks",
  "services",
  "mocks",
  "constants",
  "types",
];

console.log(`Creating Feature-Sliced architecture for: ${featureName}...`);

fs.mkdirSync(targetDir, { recursive: true });

directories.forEach((dir) => {
  const fullPath = path.join(targetDir, dir);
  fs.mkdirSync(fullPath);

  // Create an initial index.ts file to keep the folders tracked in git
  fs.writeFileSync(
    path.join(fullPath, "index.ts"),
    "// Export your feature files here\n",
  );
  console.log(`Created: ${fullPath}`);
});

console.log(
  `\n✅ Feature ${featureName} created successfully at features/${featureName}`,
);
