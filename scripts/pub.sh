#!/bin/bash

pnpm build || exit 1

version_tag="${1:-patch}"

standard_tags="major | minor | patch | premajor | preminor | prepatch | prerelease | from-git"

isStandardTag=$(node -p "\`$standard_tags\`?.split(/\s+\|\s+/)?.includes?.(\`$version_tag\`)")

if [ "$isStandardTag" != 'true' ]; then

    npm version prerelease --preid="$version_tag"

else

    npm version "$version_tag"

fi

version=$(node -p "require('./package.json')?.version ??''")

git push origin HEAD

git push origin "v$version"
