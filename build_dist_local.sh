ng build --prod web-console-core
cd dist/web-console-core
npm pack
cd ../..
cp ./dist/web-console-core/*.tgz ../local_dist/
