import wixData from "wix-data"
import { session } from "wix-storage"

/** @typedef {any} - debounce placeholder */
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

  $w("#dropdown1").options = addOptions($w("#dropdown1").options)
})

export function button14_click(event) {
  $w("#input10").value = undefined
  $w("#dropdown1").value = undefined
  session.setItem("category", undefined)
  $w("#dynamicDataset").setFilter(wixData.filter())
}

/**
 * This function is used to filter a dataset by a field
 *
 * @author Threed Software
 * @param {$w.dataset} dataset - Dataset to filter
 * @param {string} field - Field to filter by
 * @returns {function} - Function to be used as a callback that receives the value to filter by
 */
export const filterData = (dataset, field) => (value) => {
  session.setItem(field, value)
  dataset.setFilter(wixData.filter().contains(field, value))
}

/**
 * This function is used to debounce the input filter function
 *
 * @author Threed Software
 * @param {$w.Event} event - Event object
 * @property {object} event.target.value - Value of the input
 */
export const inputFilterDebounce = ({ target }) => {
  const filterResources = filterData($w("#dynamicDataset"), "ResourcesList")
  if (debounce) {
    clearTimeout(debounce)
  }
  debounce = setTimeout(() => {
    filterResources(target.value)
  }, 500)
}

const addOptions = (options) => {
  const allCategories = {
    label: "All Categories",
    value: "all"
  }
  return [allCategories, ...options]
}
