const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const MINUTE = 1000 * 60; // milliseconds
const SECOND = 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// see https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#child_processexeccommand-options-callback

async function run(cmd) {
    const { stdout } = await exec(cmd);
    return stdout;
}

module.exports.run = run;
module.exports.MINUTE = MINUTE;
module.exports.sleep = sleep;
module.exports.SECOND = SECOND;
