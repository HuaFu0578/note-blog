#!/bin/bash

pnpm build

npm version "${1:-patch}"

version=$(node -p "require('./package.json')?.version ??''")

git push origin HEAD

git push origin "v$version"
