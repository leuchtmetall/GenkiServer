// TODO Breadcrumbs
// TODO config zeroconf port
// TODO authorization
// TODO do something after video stop w/ repeat off

// TODO split view
// TODO error messages if no data from server nor from cache (AUDIO, SLIDES, FLASHCARDS, VIDEO)
// TODO try configured server if none found through autodiscovery, also on timeout
// TODO proper timeout if no route to host while browsing
// TODO reset server ip on continuous timeouts
// TODO Video controls: full rewind, etc.
// TODO Flashcard Thumbnails show right/wrong in thumbnails

// TODO updater: https://stackoverflow.com/questions/9045837/android-application-self-update
// TODO display websites as content kind
// TODO 複数のサーバーが見つかったら
// TODO content display thumbnails

// TODO check loading animation in folder fragment
// TODO flashcards with (video?)
// TODO use external memory if available



-- ミーティング --
server user: server
server pw:   content194?

Fire TV PIN: 2403


-----------

start:
set DEBUG=myapp:* & npm start
set DEBUG=myapp:* & nodemon ./bin/www
set DEBUG=myapp:* & bin/supervisor ./bin/www

set DEBUG=myapp:* & supervisor ./www

npm install -g mocha




---------
- Links -
---------

Icon:
https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=clipart&foreground.space.trim=1&foreground.space.pad=0.2&foreground.clipart=res%2Fclipart%2Ficons%2Fav_play_circle_outline.svg&foreColor=f44336%2C100&crop=0&backgroundShape=square&backColor=fff%2C100&effects=shadow


Node.js
https://github.com/maxogden/art-of-node#callbacks
https://github.com/nodejs/LTS

Node.js Modules
http://www.sitepoint.com/understanding-module-exports-exports-node-js/
http://howtonode.org/creating-custom-modules

Node.js Libs
https://github.com/paulmillr/chokidar
https://github.com/caolan/async
https://github.com/isaacs/node-touch
https://github.com/petruisfan/node-supervisor
https://www.npmjs.com/package/fs-extra
https://www.npmjs.com/package/bonjour
https://www.npmjs.com/package/forever
https://mochajs.org/

Electron
http://electron.atom.io/docs/latest/tutorial/quick-start/

Express.js
http://expressjs.com/ja/api.html#res.redirect
http://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
http://expressjs.com/en/starter/generator.html
https://github.com/jeresig/i18n-node-2

Bootstrap
http://plugins.krajee.com/file-input#usage-modes
http://qiita.com/oukayuka/items/14bfdcb6b5411a2b4b7c
http://qiita.com/nakahashi/items/15c016ff8beacd014fe4

Android
https://developer.android.com/guide/components/services.html#Lifecycle
https://developer.android.com/training/connect-devices-wirelessly/nsd.html
https://developer.android.com/reference/android/content/Context.html#getDir(java.lang.String, int)
https://developer.android.com/reference/java/net/HttpURLConnection.html
https://developer.android.com/reference/android/os/AsyncTask.html
https://developer.android.com/intl/ja/guide/appendix/media-formats.html
https://developer.android.com/intl/ja/reference/android/app/job/JobScheduler.html

Video
https://stackoverflow.com/questions/6040226/how-to-play-a-video-file-in-android
https://stackoverflow.com/questions/22073970/how-to-embed-vlc-media-player-to-my-android-app
https://bitbucket.org/edwardcw/libvlc-android-sample/src/ae8dd1ab984f?at=master
https://github.com/videolan/vlc
https://stackoverflow.com/questions/25665976/libvlc-android-seek-and-forward
https://stackoverflow.com/questions/30941173/create-a-videoplayer-with-the-libvlc-for-android
https://github.com/gareoke/VLCPlayer
https://stackoverflow.com/questions/32367976/libvlc-fails-to-show-subtitles-for-streamed-video

https://stackoverflow.com/questions/4178168/how-to-programmatically-move-copy-and-delete-files-and-directories-on-sd
https://docs.oracle.com/javase/tutorial/essential/io/move.html
http://nanohttpd.org/
https://github.com/NanoHttpd/nanohttpd
https://inloop.github.io/svg2android/

Local
http://en.localhost:3000/data/test.txt
http://ja.localhost:3000/display/
http://android.local:8080/contentPing
http://android.local:8080/currentFilename

