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
childProcess.execSync("sh .copy.sh", { stdio: 'inherit' });
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
    for(let i = 0; i < htmlFiles.length; i++){
        let HTMLperiodStartIndex = htmlFiles[i].search('<video id="video-player-frame_html5_api" class="vjs-tech" preload="auto" poster="/images/video/vinheta-alura.png" src=".*">');
        HTMLperiodStartIndex = htmlFiles[i].indexOf('src="', HTMLperiodStartIndex);
        HTMLperiodStartIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex);
        let HTMLperiodEndIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex+1);
        videoLinks.push(htmlFiles[i].slice(HTMLperiodStartIndex+1, HTMLperiodEndIndex));
    }
    var option: any;
    var filename = "null ";
    var iStart = 0;
    var dirToSave = 'videos/';
    if(process.argv[3] == '--quiet') {
        option = true;        
    }
    else if(process.argv[3] == '--show'){
        console.log(videoLinks);
        finish();
    }
    else {
        option = readlineSync.keyInYN("Do you want to download them now?");
        filename = readlineSync.question("Enter a name for each file downloaded: ");
        dirToSave = readlineSync.question(`Enter the directory where I should save the videos: 
            - Remember, this directory must exist
            - For this, you should consider wd(working directory) as the actual location. The pwd output is equivalent to the place where you called node js/server.js
            - You can use .. to go up a level or / to access root dir
            - This directory string should end with a / (Ex: if you wanna save to the folder videos, you must enter videos/)`);
        iStart = Number(readlineSync.question("Enter the start index: "));
    }
    if(option == false) {
        finish();
    }
    childProcess.execSync(('mkdir -pv ' + dirToSave), { stdio: 'inherit' });
    for(let i = iStart; i < videoLinks.length; i++) {
        console.log("Downloading video " + (i+1));
        let execString = 'curl -L -b cookies.txt -o "' + dirToSave + filename + " " + (videoLinks.length-i) + '.mp4" -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36" "' + videoLinks[i] + '"';
        childProcess.execSync(execString, { stdio: 'inherit' });
    }
}
else {
    console.log("\nNo args or invalid args passed\n");
}

function finish(){
    console.log("\n-------------- Cleaning html/ and copying HTMLs to oldHTMLs/ --------------\n");
    childProcess.execSync("sh .finish.sh", { stdio: 'inherit' });
    console.log("\n-------------- Job done --------------\n");
    console.timeEnd('Total time');
    process.exit(0);
}
