#!/usr/bin/env bash

ng build --env=dev-comfash

rm -rf ../comfash-be/web/dist

cp -r ./dist ../comfash-be/web/

echo "deployment complete" 

