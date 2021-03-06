# Template Project

Project setup
```
yarn
```

Install global packages if you need to
```
yarn global add @vue/cli-service vue-pwa-asset-generator nodemon purgecss
```

TODO: Move purgecss from a GLOBAL package to a local package in package.json
TODO: Cleanup packages in package.json

Serve frontend/backend for local development
```
./ngrok.exe http --host-header=rewrite --hostname=tundra.ngrok.io 9001
./ngrok.exe http --host-header=rewrite --hostname=fizz.ngrok.io   80
yarn run vue_local
yarn run api_local
```

Compile and minify for production, then serve frontend/backend for the dev environment
```
yarn run api_dev
yarn run vue_dev
```

Build commands
```
yarn run build_backend
yarn run build_frontend
purgecss --css .\dist\bootstrap-4.5.3.min.css --content .\dist\**\*.js --output .\dist\bootstrap-4.5.3.min.css
```

Test the production build (port 3000)
```
node ./server.js
```

Generate new PWA icons
```
vue-asset-generate -a icon.png -o img
vue-asset-generate -a public/favicon.png -o public/img/icons
vue-asset-generate -a src/public/favicon.png -o src/public/img/icons
```

Generate new PWA icons (a second option)
```
yarn run generate-icons
```

Customize configuration
```
https://cli.vuejs.org/config/
```

Blocked Packages
```
eslint: Stuck at version 6.8.0 until this is solved (version 7.32.0 won't work either)
https://github.com/eslint/eslint/issues/15175

sass-loader: Stuck at version 10.2.0 until this is resolved
https://github.com/webpack-contrib/sass-loader/issues/923
```

Run multiple frontends on a production server
```
yarn install -g serve # First make sure that "serve" is installed globally
serve -s dist --listen 8001
serve -s dist --listen 8002
serve -s dist --listen 8003
serve -s dist --listen 8004
serve -s dist --listen 8005
serve -s dist --listen 8006
serve -s dist --listen 8007
serve -s dist --listen 8008
```
