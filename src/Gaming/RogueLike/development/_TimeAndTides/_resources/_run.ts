import {
  readableStreamFromReader,
  writableStreamFromWriter,
} from 'https://deno.land/std@0.129.0/streams/conversion.ts';
import { mergeReadableStreams } from 'https://deno.land/std@0.129.0/streams/merge.ts';
import { relative } from "https://deno.land/std@0.129.0/path/mod.ts";

let runCmd, runCwd
switch(Deno.args[0]) {
  case 'module':
    runCwd = '../Browser/Application/scripts/_modules'
    const dest = relative(runCwd,'../Browser/Network/_assets/js/_v1')
    const moduleScript = `${Deno.args[1].replace(/-/g,'/')}.ts`
    const destScript = `${dest}/${Deno.args[1]}.js`
    runCmd = `deno bundle -c deno.jsonc ${moduleScript} ${destScript}`
    break
  default :
    runCmd = 'deno run --allow-net --allow-read --allow-write app.ts'
    runCwd = '../Browser/Network'
}


// create the file to attach the process to
const file = await Deno.open('./process_output.txt', {
  read: true,
  write: true,
  create: true,
});
const fileWriter = await writableStreamFromWriter(file);

// start the process
const process = Deno.run({
  cmd: runCmd.split(' '),
  cwd: runCwd,
  stdout: "piped",
  stderr: "piped",
});

// example of combining stdout and stderr while sending to a file
const stdout = readableStreamFromReader(process.stdout);
const stderr = readableStreamFromReader(process.stderr);
const joined = mergeReadableStreams(stdout, stderr);
// returns a promise that resolves when the process is killed/closed
joined.pipeTo(fileWriter).then(() => console.log('process killed/closed'));

// manually stop process
// setTimeout(async () => {
//   process.kill('SIGINT');
// }, 100);