import fs from "fs"

import videos from "./responses.json"

let allVideos = []
const data = Array.from(videos).map(({ items }) =>
  items
    .map(({ title, description, categories, media_extern_url }) => ({
      title,
      description,
      categories: [...categories],
      url: String(media_extern_url)
        .replace("//player.", "https://www.")
        .replace("video/", "")
    }))
    .filter(({ url }) => url !== "null")
    .forEach((item) => allVideos.push(item))
)

fs.writeFileSync("videos.json", JSON.stringify(allVideos))
