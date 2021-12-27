// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  var temp = title[0].toLowerCase() + title.substr(1)
  const hasKey = this.$te('route.' + temp)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + temp)

    return translatedTitle
  }
  return title
}
