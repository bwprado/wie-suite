import wixData from "wix-data"
$w.onReady(function () {
  $w("#input10").onKeyPress(function () {
    wixData
      .query("ResourcesList")
      .contains("companyName", $w("#input10").value)
      .find()
      .then((res) => {
        $w("#listRepeater").data = res.items
      })
  })

  $w("#dropdown1").onChange(function () {
    wixData
      .query("ResourcesList")
      .contains("category", $w("#dropdown1").value)
      .find()
      .then((res) => {
        $w("#listRepeater").data = res.items
      })
  })
})

export function button14_click(event) {
  $w("#input10").value = undefined
  $w("#dropdown1").value = undefined
  $w("#dynamicDataset").setFilter(wixData.filter())
}
