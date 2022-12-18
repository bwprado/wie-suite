import wixData from "wix-data"

let debounce

/**
 * This function returns the options for the overlay animation
 *
 * @author Threed Software
 * @param {number} duration - The duration of the animation in milliseconds
 * @param {number} delay - The delay of the animation in milliseconds
 * @returns {{duration: number, delay: number}}
 */
const showOverlayOptions = (duration = 200, delay = 0) => ({
  duration,
  delay
})

/**
 * This method runs when the page loads
 *
 * @param {$w.Event} Event
 */
$w.onReady(() => {
  $w("#datasetVideos").onReady(() => {
    updateTotalCount($w("#datasetVideos"))
    $w("#boxLoadingMore").onViewportEnter(loadMore)
  })
  $w("#iptSearch").onInput(handleInput)

  $w("#btnClear").onClick(clearInput)
  $w("#ddCategoryFilter").onChange(() => filterVideos(""))

  /** Handle video player events */
  $w("#videoPlayer").onPlay(showOverlay).onEnded(showOverlay)

  $w("#boxOverlay").onClick(togglePlay)
})

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

/**
 * This function shows or hides the overlay
 *
 * @author Threed Software
 * @param {$w.MouseEvent} e - The event object
 */
async function showOverlay(e) {
  let $item = $w.at(e.context)
  $item("#boxOverlay")[e.target.isPlaying ? "hide" : "show"](
    "fade",
    showOverlayOptions()
  )
}

/**
 * This function toggles the play state of the video player
 *
 * @author Threed Software
 * @param {$w.MouseEvent} e
 */
function togglePlay(e) {
  let $item = $w.at(e.context)
  $item("#videoPlayer").togglePlay()
  $item("#boxOverlay").hide("fade", showOverlayOptions())
}
