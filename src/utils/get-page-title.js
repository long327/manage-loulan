import defaultSettings from '@/settings'

const title = defaultSettings.title //|| '社交媒体运营管理平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
