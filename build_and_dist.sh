ng build web-console-core --prod
cd dist/web-console-core/
npm pack
mv web-console-core*.tgz ../../../
cd ../..
