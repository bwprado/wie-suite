import wixData from "wix-data"
import { session } from "wix-storage"

let debounce

$w.onReady(() => {
  const filterCategories = filterData($w("#dynamicDataset"), "category")

  const cachedFilter = session.getItem("category")

  $w("#dynamicDataset").onReady(() => {
    cachedFilter && filterCategories(cachedFilter)
    $w("#dropdown1").value = cachedFilter || undefined
    $w("#input10").onInput(inputFilterDebounce)
    $w("#dropdown1").onChange(({ target }) => filterCategories(target.value))
  })
})

export function button14_click(event) {
  $w("#input10").value = undefined
  $w("#dropdown1").value = undefined
  session.setItem("category", undefined)
  $w("#dynamicDataset").setFilter(wixData.filter())
}

export const filterData = (dataset, field) => (value) => {
  session.setItem(field, value)
  dataset.setFilter(wixData.filter().contains(field, value))
}

export const inputFilterDebounce = ({ target }) => {
  const filterResources = filterData($w("#dynamicDataset"), "ResourcesList")
  if (debounce) {
    clearTimeout(debounce)
  }
  debounce = setTimeout(() => {
    filterResources(target.value)
  }, 500)
}
