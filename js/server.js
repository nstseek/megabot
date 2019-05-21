"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var childProcess = require("child_process");
console.time('Total time');
console.log("\n-------------- Getting HTMLs list --------------\n");
var lsHtmlDir = childProcess.execSync("ls html").toString("utf-8");
var htmlFilenames = lsHtmlDir.split("\n");
htmlFilenames.pop();
var $HTMLPATH = "html/";
console.log(htmlFilenames.length + " file(s) found in html directory");
var htmlFiles = [];
console.log("\n-------------- Reading HTMLs --------------\n");
for (var i = 0; i < htmlFilenames.length; i++) {
    var path = $HTMLPATH + htmlFilenames[i];
    console.log("Reading path[" + i + "]: " + path);
    htmlFiles.push(fs.readFileSync(path, 'utf-8'));
}
console.log("\n-------------- Finding video links --------------\n");
var videoLinks = [];
var vidstringWatched = '<svg class="task-menu-nav-item-svg task-menu-nav-item-svg--done" aria-label="Atividade de Vídeo concluída">';
var vidstring = '<svg class="task-menu-nav-item-svg " aria-label="Atividade de Vídeo não concluída">';
for (var i = 0; i < htmlFiles.length; i++) {
    console.log('Aula ' + i);
    var HTMLperiodStartIndex = void 0;
    var HTMLperiodEndIndex = void 0;
    var j = 0;
    while (htmlFiles[i].search('<a href=".*" class="task-menu-nav-item-link task-menu-nav-item-link-VIDEO">') != -1) {
        j++;
        HTMLperiodStartIndex = htmlFiles[i].search('<a href=".*" class="task-menu-nav-item-link task-menu-nav-item-link-VIDEO">');
        HTMLperiodStartIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex);
        HTMLperiodEndIndex = htmlFiles[i].indexOf('"', HTMLperiodStartIndex + 1);
        console.log(j + " - " + htmlFiles[i].slice(HTMLperiodStartIndex + 1, HTMLperiodEndIndex));
        htmlFiles[i] = htmlFiles[i].slice(HTMLperiodEndIndex);
    }
    j = 0;
}
console.log("\n-------------- Job done --------------\n");
console.timeEnd('Total time');
