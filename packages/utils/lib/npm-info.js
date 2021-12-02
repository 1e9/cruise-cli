import axios from 'axios';

export async function getNpmInfo(pkgName = '@cruise-cli/core', origin = 'npm.taobao') {
  const { data, status } = await axios.get(`https://registry.${origin}.org/${pkgName}`);
  return status === 200 ? data : {};
}

const data = await getNpmInfo();

export const latestVersion = data?.['dist-tags']?.latest;
