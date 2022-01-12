import path from 'node:path';
import { sync } from 'pkg-dir';
import npmInstall from 'npminstall';
export default class Package {
  constructor(packageObj) {
    if (!packageObj) {
      console.log('请传入 packageObj');
    }
    const { targetPath, storeDir, packageName, packageVersion } = packageObj;
    this.targetPath = targetPath;
    this.storeDir = storeDir;
    this.packageName = packageName;
    this.packageVersion = packageVersion;
  }
  exists() {
    console.log('Exists');
  }
  install() {
    npmInstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: 'https://registry.npmjs.org',
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    });
  }
  update() {}
  getRootPath() {
    const dir = sync(this.targetPath);
    console.log(this.targetPath, '=========', dir);
  }
}
