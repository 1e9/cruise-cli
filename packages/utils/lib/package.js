import path from 'node:path';
import { sync } from 'pkg-dir';
import { pathExistsSync } from 'path-exists';
import npmInstall from 'npminstall';
export class Package {
  constructor(packageObj) {
    if (!packageObj) {
      console.log('请传入 packageObj');
    }
    const { targetPath, storeDir, packageName, packageVersion } = packageObj;
    this.root = targetPath;
    this.storeDir = storeDir;
    this.packageName = packageName;
    this.packageVersion = packageVersion;
  }
  exists() {
    if (this.storeDir) {
      // 验证版本package是否有新版
    } else {
      return pathExistsSync(this.root);
    }
  }
  install() {
    return npmInstall({
      root: this.root,
      storeDir: this.storeDir,
      registry: 'https://registry.npmjs.org',
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    });
  }
  update() {}
  get fileCachePath() {
    const [organization, pkgName] = this.formatPath(this.packageName).split('/');
    return path.resolve(this.storeDir, `_${organization}_${pkgName}@${this.packageVersion}@${organization}/${pkgName}`);
  }
  formatPath(sourcePath) {
    // eg: @cruise-cli-templates/vue => _@cruise-cli-templates_vue@0.0.0@@cruise-cli-templates
    const sep = path.sep;
    // macOS is '/'
    if (sep === '/') {
      return sourcePath;
    } else {
      return sourcePath.replace(/\\/g, '/');
    }
  }
  getRootPath() {
    const dir = sync(this.root);
    return dir || this.root;
  }
}
