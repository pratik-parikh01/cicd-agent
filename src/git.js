const { run } = require('../utils/process.js');
const fse = require('fs-extra');
const path = require('path');

async function gitUpdate(clonepath, url, branch, token, user) {

  let repoPath = clonepath;

  if (fse.existsSync(repoPath)) {
      await pull(clonepath, url, branch, token, user);
  }else{
      console.log(`cloning the repo from url ${url}, ${branch} to ${repoPath}`);
      await clone(clonepath, url, branch, token, user);
  }   
}

async function pull(clonepath,url, branch, token, user){
  let dir = clonepath
  let original_dir = process.cwd();
  
  process.chdir(dir);

  console.log(`git pull ${url} ${branch}`);
  let pullUrl = `https://${user}:${token}@${url}`;

  await run(`git pull ${pullUrl} ${branch}`);

  let commitHash = await run('git rev-parse HEAD');
  console.log(`Latest commit hash -> ${commitHash}`);
  process.chdir(original_dir);
}

async function clone(clonepath ,url, branch, token, user){
  let dir = clonepath

  console.log(`git clone -b ${branch} --single-branch ${url} ${dir}`);
  let cloneUrl = `https://${user}:${token}@${url}`;

  await run(`git clone -b ${branch} --single-branch ${cloneUrl} ${dir}`);

  let commitHash = await run(`cd ${dir} 2> /dev/null && git rev-parse HEAD`);
  console.log(`Latest commit hash -> ${commitHash}`);
}

async function copyFiles(config) {
  console.log('Copying files');
  let src = config.git.clonepath;
  let dest = config.git.destpath;

  // this will throw exception if src is not present
  try {
    srcInfo = await fse.statSync(src);

    fse.mkdirSync(path.join(dest, 'templates'), {
      recursive: true,
      mode: srcInfo.mode,
  });

  let srcPath = path.join(src, 'Chart.yaml');
  let destPath = path.join(dest, 'Chart.yaml');

  fse.copyFileSync(srcPath, destPath);

  srcPath = path.join(src, 'values.yaml');
  destPath = path.join(dest, 'values.yaml');

  fse.copyFileSync(srcPath, destPath);

  let files = fse.readdirSync(path.join(src, 'templates'), {
      withFileTypes: true,
  });

  for (let file of files) {
      let componentName = file.name;
      let srcPath = path.join(src, 'templates', componentName);
      let destPath = path.join(dest, 'templates', componentName);

      if (file.isDirectory()) {
        fse.mkdirSync(destPath, {
          recursive: true,
      });
      }
      

      fse.copySync(srcPath, destPath);
  }

  console.log('File copy complete');

  } catch (e) {
    throw new Error(`${src} does not exist, error form copyFiles ${e}`)
  }
}

module.exports.gitUpdate = gitUpdate;
module.exports.copyFiles = copyFiles;
