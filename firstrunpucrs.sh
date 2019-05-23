export PATH=$PATH:$HOME/DriveH/software/node-v10.15.3-linux-x64/bin:$HOME/DriveH/software/node-v10.15.3-linux-x64/lib
npm install
npm run compile
node js/server.js --downloadvideos 2>&1 | tee log.txt
