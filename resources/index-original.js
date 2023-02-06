import wixData from "wix-data"
import wixWindow from "wix-window"
import { session } from "wix-storage"
import { startCase, orderBy, uniqBy } from "lodash"

/** @type {{
 * scrollposition?:Number;
 * numResults?:Number;
 * filter?:wixData.WixDataFilter;
 * }} */
let savedState = {}

/** @typedef {any} - debounce placeholder */
let debounce

$w.onReady(async () => {
  $w("#lottieEmbed1").src = loadingicon
  // $w('#lottieEmbed1').speed =1.4;
  const filterCategories = filterData($w("#dynamicDataset"), "category")

  const cachedFilter = session.getItem("category")

  const cachedState = session.getItem("savedState") ?? null
  cachedState && (savedState = JSON.parse(cachedState))
  $w("#dynamicDataset").onReady(() => {
    cachedFilter && filterCategories(cachedFilter)
    $w("#dropdownCategories").value = cachedFilter || undefined
    $w("#input10").onInput(inputFilterDebounce)
    $w("#dropdownCategories").onChange(({ target }) =>
      filterCategories(target.value)
    )
    setTimeout(async () => {
      // const scrollposition = parseInt(getLastState('scrollpos'));
      // wixWindow.scrollBy(0,scrollposition);
      await loadPages()
      await text207_click()
      $w("#lottieEmbed1").hide("fade")
    }, 1500)

    if (savedState) {
      //
    }
  })

  // $w('#scrollManager').on('wixscroll', e => {
  //     console.log(e.detail.yposition);
  //     savedState.scrollposition = e.detail.yposition;
  // });
  //We don't necessarily need the scroll manager based on the previous code.

  $w("#viewResource").onClick((e) => {
    const scrollpos = e.pageY
    saveLastState("scrollpos", scrollpos)
    e.context
    saveLastState("clickContext", e.context)

    console.log(scrollpos)
    console.log(e.context)
  })

  const dropdownOptions = await getDropdownOptions()
  $w("#dropdownCategories").options = dropdownOptions || []

  //Next cache it.
})

/**
 * @param {String} key
 * @param {*} value
 * @returns boolean
 */
const saveLastState = (key, value) => {
  return session.setItem(key, JSON.stringify(value))
}

/**
 * @returns Object
 */
const getLastState = (key) => {
  return session.getItem(key) ? JSON.parse(session.getItem(key)) : null
}

export function button14_click(event) {
  $w("#input10").value = undefined
  $w("#dropdownCategories").value = undefined
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
  if (value === "all") return dataset.setFilter(wixData.filter())
  const filter = wixData.filter().contains(field, value)
  dataset.setFilter(filter)
  savedState.filter = filter
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

/**
 * Test function that allows for scrolling to the last position, in theory
 */
export function text207_click() {
  console.log(getLastState("clickContext"))
  const $item = $w.at(getLastState("clickContext"))

  $item("#text203").scrollTo()
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function testScrollPixels_click(event) {
  const scrollPos = getLastState("scrollpos")

  wixWindow.scrollBy(0, scrollPos)
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function loadMore(event) {
  // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
  // Add your code for this event here:

  console.log(event)
  saveLastState("numpages", $w("#dynamicDataset").getCurrentPageIndex())
}

/**
 *	Load the correct number of results once we've reached the page again
 */
export async function loadPages() {
  /**@type {Number} */
  const value = getLastState("numpages")
  //Option 1. Load More Loop. Pros are promise based results. Cons are 4 different calls
  for (let i = 1; i < value; i++) {
    await $w("#dynamicDataset").loadMore()
  }

  //OOC, What does loadPage() do?

  // $w('#dynamicDataset').loadPage(value);

  //Option 2. setPages Size = numpages * page size. Pros are one call, instantaneous. Cons breaks the page size value for good.
}

const loadingicon = {
  v: "5.5.7",
  meta: { g: "LottieFiles AE 0.1.20", a: "", k: "", d: "", tc: "" },
  fr: 24,
  ip: 0,
  op: 36,
  w: 150,
  h: 150,
  nm: "No 3",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 3,
      nm: "Null 4",
      sr: 1,
      ks: {
        o: { a: 0, k: 0, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.096], y: [1] },
              o: { x: [0.835], y: [0] },
              t: 0,
              s: [0]
            },
            { t: 36, s: [180] }
          ],
          ix: 10
        },
        p: { a: 0, k: [75, 75, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      ip: 0,
      op: 36,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Shape Layer 4",
      parent: 1,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: {
          a: 1,
          k: [
            {
              i: { x: 0.833, y: 1 },
              o: { x: 1, y: 0 },
              t: 0,
              s: [0, 0, 0],
              to: [-6.667, 0, 0],
              ti: [0, 0, 0]
            },
            {
              i: { x: 0.833, y: 1 },
              o: { x: 1, y: 0 },
              t: 16,
              s: [-40, 0, 0],
              to: [0, 0, 0],
              ti: [-6.667, 0, 0]
            },
            { t: 36, s: [0, 0, 0] }
          ],
          ix: 2
        },
        a: { a: 0, k: [-31.5, -1, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 1,
                k: [
                  {
                    i: { x: 0.833, y: 1 },
                    o: { x: 0.723, y: 0 },
                    t: 0,
                    s: [
                      {
                        i: [
                          [-14.23, 0],
                          [-4.502, -7.511],
                          [0, -4.836],
                          [1.945, -3.624],
                          [9.829, 0],
                          [0, 14.23]
                        ],
                        o: [
                          [9.394, 0],
                          [2.318, 3.867],
                          [0, 4.401],
                          [-4.344, 8.094],
                          [-14.23, 0],
                          [0, -14.23]
                        ],
                        v: [
                          [0, -25.766],
                          [22.116, -13.228],
                          [25.766, 0],
                          [22.718, 12.167],
                          [0, 25.766],
                          [-25.766, 0]
                        ],
                        c: true
                      }
                    ]
                  },
                  {
                    i: { x: 0.667, y: 1 },
                    o: { x: 0.167, y: 0 },
                    t: 16,
                    s: [
                      {
                        i: [
                          [-14.23, -0.016],
                          [-9.479, -5.839],
                          [0.133, -8.639],
                          [16.575, -6.255],
                          [13.948, -0.01],
                          [0, 14.23]
                        ],
                        o: [
                          [13.403, 0.015],
                          [8.961, 5.52],
                          [-0.141, 9.125],
                          [-10.444, 3.942],
                          [-14.23, 0.01],
                          [0, -14.23]
                        ],
                        v: [
                          [0, -25.766],
                          [29.604, -14.286],
                          [54.266, 0],
                          [27.925, 14.255],
                          [0, 25.766],
                          [-25.766, 0]
                        ],
                        c: true
                      }
                    ]
                  },
                  {
                    t: 24,
                    s: [
                      {
                        i: [
                          [-14.23, 0],
                          [-4.502, -7.511],
                          [0, -4.836],
                          [1.945, -3.624],
                          [9.829, 0],
                          [0, 14.23]
                        ],
                        o: [
                          [9.394, 0],
                          [2.318, 3.867],
                          [0, 4.401],
                          [-4.344, 8.094],
                          [-14.23, 0],
                          [0, -14.23]
                        ],
                        v: [
                          [0, -25.766],
                          [22.116, -13.228],
                          [25.766, 0],
                          [22.718, 12.167],
                          [0, 25.766],
                          [-25.766, 0]
                        ],
                        c: true
                      }
                    ]
                  }
                ],
                ix: 2
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.235294117647, 0.227450980392, 0.270588235294, 1],
                ix: 4
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [-31.5, -1], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 36,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Shape Layer 3",
      parent: 1,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: {
          a: 1,
          k: [
            {
              i: { x: 0.833, y: 1 },
              o: { x: 1, y: 0 },
              t: 0,
              s: [0, 0, 0],
              to: [6.667, 0, 0],
              ti: [0, 0, 0]
            },
            {
              i: { x: 0.833, y: 1 },
              o: { x: 1, y: 0 },
              t: 16,
              s: [40, 0, 0],
              to: [0, 0, 0],
              ti: [6.667, 0, 0]
            },
            { t: 36, s: [0, 0, 0] }
          ],
          ix: 2
        },
        a: { a: 0, k: [-31.5, -1, 0], ix: 1 },
        s: { a: 0, k: [-100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 1,
                k: [
                  {
                    i: { x: 0.833, y: 1 },
                    o: { x: 0.723, y: 0 },
                    t: 0,
                    s: [
                      {
                        i: [
                          [-14.23, 0],
                          [-4.502, -7.511],
                          [0, -4.836],
                          [1.945, -3.624],
                          [9.829, 0],
                          [0, 14.23]
                        ],
                        o: [
                          [9.394, 0],
                          [2.318, 3.867],
                          [0, 4.401],
                          [-4.344, 8.094],
                          [-14.23, 0],
                          [0, -14.23]
                        ],
                        v: [
                          [0, -25.766],
                          [22.116, -13.228],
                          [25.766, 0],
                          [22.718, 12.167],
                          [0, 25.766],
                          [-25.766, 0]
                        ],
                        c: true
                      }
                    ]
                  },
                  {
                    i: { x: 0.667, y: 1 },
                    o: { x: 0.167, y: 0 },
                    t: 16,
                    s: [
                      {
                        i: [
                          [-14.23, -0.016],
                          [-9.479, -5.839],
                          [0.133, -8.639],
                          [16.575, -6.255],
                          [13.948, -0.01],
                          [0, 14.23]
                        ],
                        o: [
                          [13.403, 0.015],
                          [8.961, 5.52],
                          [-0.141, 9.125],
                          [-10.444, 3.942],
                          [-14.23, 0.01],
                          [0, -14.23]
                        ],
                        v: [
                          [0, -25.766],
                          [29.604, -14.286],
                          [54.266, 0],
                          [27.925, 14.255],
                          [0, 25.766],
                          [-25.766, 0]
                        ],
                        c: true
                      }
                    ]
                  },
                  {
                    t: 24,
                    s: [
                      {
                        i: [
                          [-14.23, 0],
                          [-4.502, -7.511],
                          [0, -4.836],
                          [1.945, -3.624],
                          [9.829, 0],
                          [0, 14.23]
                        ],
                        o: [
                          [9.394, 0],
                          [2.318, 3.867],
                          [0, 4.401],
                          [-4.344, 8.094],
                          [-14.23, 0],
                          [0, -14.23]
                        ],
                        v: [
                          [0, -25.766],
                          [22.116, -13.228],
                          [25.766, 0],
                          [22.718, 12.167],
                          [0, 25.766],
                          [-25.766, 0]
                        ],
                        c: true
                      }
                    ]
                  }
                ],
                ix: 2
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.235294117647, 0.227450980392, 0.270588235294, 1],
                ix: 4
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [-31.5, -1], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 36,
      st: 0,
      bm: 0
    }
  ],
  markers: []
}

/**
 * This function returns an array of objects with label and value properties
 * to be used as dropdown options.
 *
 * @returns {Promise<Array | []>}
 */
const getDropdownOptions = async () => {
  const allCategories = {
    label: "All Categories",
    value: "all"
  }
  try {
    /** @type {{items: object[]}} */
    const categories = await wixData.query("ResourcesList").distinct("category")
    const options = categories.items.map((category) => ({
      label: startCase(category.toLowerCase()),
      value: category
    }))
    const sortedOptions = orderBy(options, "label")
    const uniqueOptions = uniqBy(sortedOptions, "label")
    return [allCategories, ...uniqueOptions]
  } catch (error) {
    console.log(error)
    return []
  }
}
