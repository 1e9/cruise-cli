import { exec, spawn, fork } from 'child_process';
import path from 'path';

// exec('npm i', { cwd: path.resolve('./')}, console.log)

// const child = spawn('yarn', { cwd: path.resolve('./') })
// child.stdout.on('data', res=> console.log(res.toString()));
// child.stderr.on('data', res => console.log(res.toString()))
const child = fork('test.js', { cwd: path.resolve('./')});

child.on('message', ({ connected }) => {
    if(connected) child.send('from parent', console.log);
});