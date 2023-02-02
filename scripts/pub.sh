#!/bin/bash

pnpm build

version_tag="${1:-patch}"

standard_tags="major | minor | patch | premajor | preminor | prepatch | prerelease | from-git"

isStandardTag=$(node -p "\`$standard_tags\`?.split(/\s+\|\s+/)?.includes?.(\`$version_tag\`)")

if [ "$isStandardTag" != 'true' ]; then

    version_tag="--preid=$version_tag"

fi

echo "$version_tag"

npm version "$version_tag"

version=$(node -p "require('./package.json')?.version ??''")

git push origin HEAD

git push origin "v$version"
