ng build web-console-core --prod
cd dist/web-console-core/
npm pack
mv web-console-core-0.0.5.tgz ../../../web-console-ui-kit/local_modules/web-console-core-0.0.5.tgz
cd ..
cd ..
