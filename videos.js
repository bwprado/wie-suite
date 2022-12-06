import wixData from "wix-data"
import { timeline } from "wix-animations"

let debounce

const animation = timeline()

/**
 * This method runs when the page loads
 *
 * @param {$w.Event} Event
 */
$w.onReady(() => {
  $w("#datasetVideos").onReady(() => {
    updateTotalCount($w("#datasetVideos"))
    $w("#rptVideos").onItemReady(repeaterData)
    $w("#boxLoadingMore").onViewportEnter(loadMore)
  })
  $w("#iptSearch").onInput(handleInput)

  $w("#btnClear").onClick(clearInput)
  $w("#btnShowDescription").onClick(handleShowDescription)
  $w("#ddCategoryFilter").onChange(() => filterVideos(""))
})

/**
 * This function shows or hides the description
 *
 * @param {$w.MouseEvent} event - The mouse event object
 */
function handleShowDescription(event) {
  let $item = $w.at(event.context)
  $item("#boxDescription").collapsed
    ? $item("#boxDescription").expand()
    : $item("#boxDescription").collapse()

  animation.add($item("#btnShowDescription"), {
    rotate: $item("#boxDescription").collapsed ? 0 : 180,
    duration: 200
  })

  animation.play()
}

/**
 * This function handles the input event of the search input
 *
 * @param {$w.KeyboardEvent} event
 */

function handleInput(event) {
  const search = event?.target?.value || ""
  const hasValue = search.length > 0

  showLoading(hasValue)
  showClearButton(hasValue)

  clearTimeout(debounce)
  debounce = setTimeout(() => filterVideos(search), 500)
}

/**
 * This function is called when the user types in the search input
 * and it filters the Videos Dataset
 *
 * @example
 *
 * filterVideos("cat")
 *
 * @param {string} value - The event object
 */
async function filterVideos(value) {
  const category = $w("#ddCategoryFilter").value
  const selectedCategory = category !== "all" ? category : null
  let filter = wixData
    .filter()
    .contains("title", value)
    .or(wixData.filter().contains("description", value))
    .or(wixData.filter().contains("cast", value))

  filter = selectedCategory
    ? filter.and(wixData.filter().contains("categories", selectedCategory))
    : filter

  await $w("#datasetVideos").setFilter(filter)

  showLoading(false)
  updateTotalCount($w("#datasetVideos"))
}

/**
 * This function shows or hides the clear button
 * @param {boolean} condition - The condition to show or hide the clear button
 */
function showClearButton(condition) {
  $w("#btnClear")[condition ? "show" : "hide"]()
}

/**
 * This function clears the search input
 */
function clearInput() {
  $w("#iptSearch").value = ""
  showClearButton(false)
  filterVideos("")
}

/**
 * This function shows or hides the loading indicator
 * @param {boolean} condition - The condition to show or hide the loading indicator
 */
async function showLoading(condition) {
  await $w("#imgLoading")[condition ? "show" : "hide"]()
  await $w("#iconSearch")[condition ? "hide" : "show"]()
}

/**
 * This function updates the total count of the results
 *
 * @param {$w.dataset} dataset
 */
function updateTotalCount(dataset) {
  dataset.onReady(() => {
    /** @type {number} count */
    const count = dataset.getTotalCount()
    $w("#txtResults").text = `(${count}) VIDEO${count > 1 ? "S" : ""}`
  })
}

/**
 * @typedef {Object} RepeaterData
 * @property {string} title
 * @property {string} description
 * @property {string} videoCast
 * @property {string} category
 * @property {string} url
 *
 * @param {$w.$w} $item
 * @param {RepeaterData} itemData - Object data of the item
 * @param {number} index - The index of the item
 */
function repeaterData($item, itemData, index) {
  $item("#txtTitle").text = itemData.title.toUpperCase()
}

/**
 * This function shows or hides the loading more indicator
 * @param {boolean} condition
 */
function showLoadingMore(condition) {
  $w("#boxLoadingMore")[condition ? "show" : "hide"]()
}

/**
 * This function loads more items when the user scrolls down
 */
function loadMore() {
  const hasReachedEnd =
    $w("#datasetVideos").getTotalCount() === $w("#rptVideos").data.length

  $w("#datasetVideos").hasNextPage() &&
    !hasReachedEnd &&
    $w("#datasetVideos").loadMore().then()
  showLoadingMore(!hasReachedEnd)
}
