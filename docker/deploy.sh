#!/bin/bash

cd ..
rm -rf dist

# Update npm packages
npm install || exit 1

# Run tests and build libraries and application
ng test stasis && ng build stasis --prod || exit 1
ng test && ng build --prod || exit 1

# Build docker image
mv dist/carrot-control-panel docker/dist
cp proxy.conf.json docker/dist/
cd docker

docker build -t metabolomics/carrot-control-panel . || exit 1
rm -rf dist

# Deploy image
docker push metabolomics/carrot-control-panel
