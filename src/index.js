const { copyFiles, gitUpdate } = require('./git');
const { MINUTE } = require('../utils/process');

async function updater(config) {

  try {

      console.log('Checking for Git updates...');

      let url = config.git.url;
      let branch = config.git.branch;
      let token = config.git.token;
      let clonepath = config.git.clonepath
      let user = config.git.user

      await gitUpdate(clonepath, url, branch, token, user);
      await copyFiles(config);
  } catch (e) {
      console.log('Error in updater :' + e);
      throw e;
  }
}

config = {
  git: {
    url: process.env.GIT_URL || "github.com/pratik-parikh01/cicd-helm.git",
    branch: process.env.GIT_BRANCH || "main",
    token: process.env.GIT_TOKEN || "crap",
    user: process.env.GIT_USER || "crap",
    clonepath: process.env.CLONE_SRC_PATH || "/tmp/here",
    destpath: process.env.CLONE_DEST_PATH || "/tmp/there"
  },
  update: {
    frequency: process.env.UPDATE_FREQUENCY || "1" // every "x" mins
  }
}
updater(config)

setInterval(async () => {
  try {
      console.log('periodic updation starting');
      await updater(config)
  } catch (e) {
    console.log('error in periodic updation : ', e);
      process.exit(1);
  }
}, MINUTE * config.update.frequency);
