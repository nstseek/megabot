import * as fs from 'fs';
import * as childProcess from 'child_process';

fs.watch('futureHTMLs', (event, filename) => {
    console.log('event: ' + event);
    console.log('filename: ' + filename + '\n');

});