import path from 'node:path';
import { sync } from 'pkg-dir';
import { pathExistsSync } from 'path-exists';
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
    if (this.storeDir) {
      // 验证版本package是否有新版
    } else {
      return pathExistsSync(this.targetPath);
    }
  }
  install() {
    return npmInstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: 'https://registry.npmjs.org',
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    });
  }
  update() {}
  getRootPath() {
    const dir = sync(this.targetPath);
    return dir || this.targetPath;
  }
}
