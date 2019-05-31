import * as fs from 'fs';
import * as childProcess from 'child_process';

var counter = 1;
var lastFilename: string;
childProcess.execSync(`mkdir -pv watchDir`, { stdio: `inherit` });
fs.watch(`watchDir`, (event, filename) => {
    if(event == `change` && filename.search(/(.*).html/) != -1 && filename != lastFilename){
        lastFilename = filename;
        console.log(`${filename} added`);
        let counterString: string;
        if (counter < 10) counterString = `00${counter}`;
        else if (counter < 100 && counter >= 10) counterString = `0${counter}`;
        else counterString = `${counter}`;
        try {
            childProcess.execSync(`mv -v "${filename}" ${counterString}.html`, { stdio: 'inherit', cwd: 'watchDir' });
            childProcess.execSync(`cp -v ${counterString}.html ../futureHTMLs/`, { stdio: 'inherit', cwd: 'watchDir' });
            childProcess.execSync(`rm -vf ${counterString}.html`, { stdio: 'inherit', cwd: 'watchDir' });
        } catch (error) {
            
        }
        counter++;
    }
});
console.log(`Listening for changes on ./watchDir/...`);