#!/bin/bash

pnpm build

npm version "${1:-patch}"
