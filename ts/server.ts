import * as fs from "fs";
import * as childProcess from "child_process";

console.time('Total time');
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

console.log("\n-------------- Finding video links --------------\n");
let videoLinks: string[] = [];
let vidstringWatched = '<svg class="task-menu-nav-item-svg task-menu-nav-item-svg--done" aria-label="Atividade de Vídeo concluída">';
let vidstring = '<svg class="task-menu-nav-item-svg " aria-label="Atividade de Vídeo não concluída">';
for(let i = 0; i < htmlFiles.length; i++){
    console.log('Aula ' + i);
    let HTMLperiodStartIndex: number;
    let HTMLperiodEndIndex: number;
    let j = 0;
    while(htmlFiles[i].search('<a href=".*" class="task-menu-nav-item-link task-menu-nav-item-link-VIDEO">') != -1){
        j++;
        HTMLperiodStartIndex = htmlFiles[i].search('<a href=".*" class="task-menu-nav-item-link task-menu-nav-item-link-VIDEO">');
        HTMLperiodStartIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex);
        HTMLperiodEndIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex+1);
        console.log(j + " - " + htmlFiles[i].slice(HTMLperiodStartIndex+1, HTMLperiodEndIndex));
        htmlFiles[i] = htmlFiles[i].slice(HTMLperiodEndIndex);
    }
    j = 0;
}

console.log("\n-------------- Job done --------------\n");
console.timeEnd('Total time');