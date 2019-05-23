import * as fs from "fs";
import * as childProcess from "child_process";
import * as readlineSync from "readline-sync";

console.time('Total time');

console.log("\n/// MEGABOT SORRIZO RONALDOTRON 4000 - 500 FOTO POR MINUTO ///\n");

console.log("\n-------------- Checking/creating oldHTMLs/ and html/ directories --------------\n");
childProcess.execSync('mkdir -pv html/', { stdio: 'inherit' });
childProcess.execSync('mkdir -pv oldHTMLs/', { stdio: 'inherit' });
childProcess.execSync('mkdir -pv futureHTMLs/', { stdio: 'inherit' });
console.log("OK.");

console.log("\n-------------- Cleaning and copying HTMLs to html/ --------------\n");
try {
    childProcess.execSync("sh .copy.sh", { stdio: 'inherit' });   
} catch (error) {
    
}
console.log("\n-------------- Getting HTMLs list --------------\n");
const lsHtmlDir = childProcess.execSync("ls html").toString("utf-8");
const htmlFilenames = lsHtmlDir.split("\n");
htmlFilenames.pop();
const $HTMLPATH = "html/";
console.log(htmlFilenames.length + " file(s) found in html directory");

let htmlFiles: string[] = [];

console.log("\n-------------- Reading HTMLs --------------\n");
for (let i = 0; i < htmlFilenames.length; i++) {
    let path = $HTMLPATH + htmlFilenames[i];
    console.log("Reading path[" + i + "]: " + path);
    htmlFiles.push(fs.readFileSync(path, 'utf-8'));
}

if(process.argv[2] == '--getpartlinks'){
    console.log("\n-------------- Finding part links --------------\n");
    let videoLinks: string[][] = [];
    let vidstringWatched = '<svg class="task-menu-nav-item-svg task-menu-nav-item-svg--done" aria-label="Atividade de Vídeo concluída">';
    let vidstring = '<svg class="task-menu-nav-item-svg " aria-label="Atividade de Vídeo não concluída">';
    for(let i = 0; i < htmlFiles.length; i++){
        let HTMLperiodStartIndex: number;
        let HTMLperiodEndIndex: number;
        let j = 0;
        let iVideoLinks: string[] = [];
        while(htmlFiles[i].search('<a href=".*" class="task-menu-nav-item-link task-menu-nav-item-link-VIDEO">') != -1){
            j++;
            HTMLperiodStartIndex = htmlFiles[i].search('<a href=".*" class="task-menu-nav-item-link task-menu-nav-item-link-VIDEO">');
            HTMLperiodStartIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex);
            HTMLperiodEndIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex+1);
            // console.log(j + " - " + htmlFiles[i].slice(HTMLperiodStartIndex+1, HTMLperiodEndIndex));
            iVideoLinks.push(htmlFiles[i].slice(HTMLperiodStartIndex+1, HTMLperiodEndIndex));
            htmlFiles[i] = htmlFiles[i].slice(HTMLperiodEndIndex);
        }
        j = 0;
        videoLinks.push(iVideoLinks);
    }
    
    for(let i = 0; i < videoLinks.length; i++){
        for(let j = 0; j < videoLinks[i].length; j++){
            let linkSlice = videoLinks[i][j].slice(0,8); // 8 é o numero de chars de /course/, para verificar no if, ver se a string começa com /course/
            let prevPath = "https://cursos.alura.com.br";
            if(linkSlice == "/course/") videoLinks[i][j] = prevPath + videoLinks[i][j];
        }
    }
    console.log(videoLinks);
}
else if(process.argv[2] == "--downloadvideos"){
    console.log("\n-------------- Finding video links --------------\n");
    var videoLinks: string[] = [];
    var errorCount: number = 0;
    for(let i = 0; i < htmlFiles.length; i++){
        let HTMLperiodStartIndex = htmlFiles[i].search('<video id="video-player-frame_html5_api" class="vjs-tech" preload="auto" poster="/images/video/vinheta-alura.png" src=".*">');
        if(HTMLperiodStartIndex == -1) {
            console.log(`FATAL ERROR - HTML[${i+1}] DOESNT HAVE A <video> TAG - SKIPPING THIS HTML`);
            videoLinks.push("");
            errorCount++;
            continue;
        }
        HTMLperiodStartIndex = htmlFiles[i].indexOf('src="', HTMLperiodStartIndex);
        HTMLperiodStartIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex);
        let HTMLperiodEndIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex+1);
        videoLinks.push(htmlFiles[i].slice(HTMLperiodStartIndex+1, HTMLperiodEndIndex));
    }
    var option: any;
    option = true;
    var filename = "null ";
    var iStart = 0;
    var dirToSave = 'videos/';
    var replaceFilename = false;
    var replaceDir = false;
    if(process.argv[3] == '--quiet') {
        option = true;        
    }
    else if(process.argv[3] == '--show'){
        console.log(videoLinks);
        finish();
    }
    else {
        let tempFilename = readlineSync.question("Enter a name for each file downloaded: ");
        if (tempFilename == "" || !tempFilename) replaceFilename = true;
        else {
            filename = tempFilename;
        }
        let tempDirToSave = readlineSync.question(`Enter the directory where I should save the videos: 
            - Remember, this directory must exist
            - For this, you should consider wd(working directory) as the actual location. The pwd output is equivalent to the place where you called node js/server.js
            - You can use .. to go up a level or / to access root dir
            - This directory string should end with a / (Ex: if you wanna save to the folder videos, you must enter videos/)\n`);
        if (tempDirToSave != "") dirToSave = tempDirToSave;
        else replaceDir = true;
        let tempiStart = Number(readlineSync.question("Enter the start index: "));
        if (tempiStart) iStart = tempiStart;
    }
    if(option == false) {
        finish();
    }
    for(let i = iStart; i < videoLinks.length; i++) {
        if(videoLinks[i] == "") {
            console.log("Downloading video " + (i+1));
            console.log("ERROR - THIS VIDEO DOES NOT HAVE A VALID LINK (PROBABLY THE HTML DID NOT HAVE A <video> TAG) - SKIPPING...");
            continue;
        }
        if(replaceFilename) {
            filename = getFilename(htmlFiles[i], i);
            if(replaceDir) dirToSave = getDirToSave(htmlFiles[i]);
            childProcess.execSync(('mkdir -pv "' + dirToSave + '"'), { stdio: 'inherit' });
            let execString = 'curl -L -b cookies.txt -o "' + dirToSave + filename + '.mp4" -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36" "' + videoLinks[i] + '"';
            console.log("Downloading video " + (i+1) + ' - ' + filename + ' to ' + dirToSave);
            continue;
            childProcess.execSync(execString, { stdio: 'inherit' });
        }
        
        else {
            if(replaceDir) dirToSave = getDirToSave(htmlFiles[i]);
            childProcess.execSync(('mkdir -pv "' + dirToSave + '"'), { stdio: 'inherit' });
            let execString = 'curl -L -b cookies.txt -o "' + dirToSave + filename + ' ' + i + '.mp4" -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36" "' + videoLinks[i] + '"';
            console.log("Downloading video " + (i+1) + ' - ' + filename + ' to ' + dirToSave);
            continue;
            childProcess.execSync(execString, { stdio: 'inherit' });
        }
        
    }
    finish();
}
else {
    console.log("\nNo args or invalid args passed\n");
}

function getDirToSave(html: string) {
    let startIndex = html.search('<h2 class="task-menu-header-info-title-text">');
    startIndex = html.indexOf('>', startIndex+1)+1;
    let endIndex = html.indexOf('<', startIndex);
    let stringFinal = html.slice(startIndex, endIndex);
    stringFinal = stringFinal + '/';
    return stringFinal;
}

function getFilename(html: string, i: number) {
    let startIndex = html.search('<title>');
    startIndex = html.indexOf('>', startIndex)+1;
    let endIndex = html.indexOf(' |', startIndex);
    let stringBuf = html.slice(startIndex, endIndex);
    let stringFinal = stringBuf.replace(/Atividade\ ([0-9]*)/, 'Atividade ' + (i+1));
    return stringFinal;
}

function finish(){
    console.log("\n-------------- Cleaning html/ and copying HTMLs to " + dirToSave + "/oldHTMLs/ --------------\n");
    try { 
        childProcess.execSync("mkdir -pv HTMLs", { stdio: 'inherit', cwd: dirToSave });
        childProcess.execSync('rsync -rvP *.html "../' + dirToSave + '/HTMLs"', { stdio: 'inherit', cwd: 'html' });
        childProcess.execSync('rm -rf *', { stdio: 'inherit', cwd: 'html' });   
    } catch (error) {
        
    }
    console.log("\n-------------- Job done --------------\n");
    if(errorCount) {
        console.log(`!! ${errorCount} error(s) happened during runtime - check output for more details !!\n`);
    }
    console.timeEnd('Total time');
    if(process.argv[3] == '--watch'){
        console.log('\nNow watching for file changes... (Press CTRL+C to exit)');
        var i = 0;
        var firstTime = true;
        if(process.argv[4] == '--git') setTimeout(gitPull, 5000);
        fs.watch('futureHTMLs', (event, filename) => {
            if(event == "change" && filename.search(/(.*).html/) != -1) {
                console.log(filename + ' created');
                let htmlWatchFile = fs.readFileSync('futureHTMLs/' + filename, 'utf-8');
                let watchVideoLink: string;
                let HTMLperiodStartIndex = htmlWatchFile.search('<video id="video-player-frame_html5_api" class="vjs-tech" preload="auto" poster="/images/video/vinheta-alura.png" src=".*">');
                if(HTMLperiodStartIndex == -1) {
                    if(process.argv[4] == '--git') {
                        console.log(`FATAL ERROR - HTML DOESNT HAVE A <video> TAG - SKIPPING THIS HTML`);
                    }
                    else {
                        console.log(`FATAL ERROR - HTML DOESNT HAVE A <video> TAG - SKIPPING AND DELETING THIS HTML`);
                        childProcess.execSync('rm -f futureHTMLs/' + filename, { stdio: 'inherit' });
                    }
                }
                else {
                    HTMLperiodStartIndex = htmlWatchFile.indexOf('src="', HTMLperiodStartIndex);
                    HTMLperiodStartIndex = htmlWatchFile.indexOf('"', HTMLperiodStartIndex);
                    let HTMLperiodEndIndex = htmlWatchFile.indexOf('"', HTMLperiodStartIndex+1);
                    watchVideoLink = htmlWatchFile.slice(HTMLperiodStartIndex+1, HTMLperiodEndIndex);
                    if(firstTime) {
                        dirToSave = getDirToSave(htmlWatchFile);
                        firstTime = false;
                    }
                    else if(getDirToSave(htmlWatchFile) != dirToSave) {
                        console.log('getDirToSave: ' + getDirToSave(htmlWatchFile));
                        console.log('dirToSave: ' + dirToSave);
                        i = 0;
                        dirToSave = getDirToSave(htmlWatchFile);
                    }
                    let vidFilename = getFilename(htmlWatchFile, i);
                    childProcess.execSync(('mkdir -pv "' + dirToSave + '"'), { stdio: 'inherit' });
                    let execString = 'curl -L -b cookies.txt -o "' + dirToSave + vidFilename + '.mp4" -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36" "' + watchVideoLink + '"';
                    console.log("Downloading video " + (i+1) + ' - ' + vidFilename + ' to ' + dirToSave);
                    childProcess.execSync(execString, { stdio: 'inherit' });
                    childProcess.execSync("mkdir -pv HTMLs", { stdio: 'inherit', cwd: dirToSave });
                    childProcess.execSync('cp -v "futureHTMLs/' + filename + '" "' + dirToSave + '/HTMLs"', { stdio: 'inherit' });
                    childProcess.execSync('rm -rfv */', { stdio: 'inherit', cwd: 'futureHTMLs' });
                    i++;

                }
            }
        
        });
    }
}

function gitPull() {
    console.log('updating with git repo...');
    childProcess.execSync('git pull', { stdio: 'inherit', cwd: 'futureHTMLs' });
    setTimeout(gitPull, 5000);
}