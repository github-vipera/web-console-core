rm web-console-core-*.tgz
ng build --prod web-console-core
npm pack ./dist/web-console-core
