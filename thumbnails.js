import wixData from "wix-data"
import { mediaManager } from "wix-media-backend"

export const findThumbnailAndInsert = async () => {
  const files = await mediaManager.listFiles(
    { parentFolderId: "63947d1a16104e48839dd3a7bea668c1" },
    null,
    { limit: 100 }
  )

  const thumbs = files.map(({ originalFileName, fileUrl }) => ({
    tags: originalFileName.toLowerCase().split(""),
    fileUrl
  }))

  const { items: videos } = await wixData.query("Videos").limit(1000).find()

  const videosWithThumbs = videos.map(({ description }) => {
    const thumb = thumbs.find(({ tags }) =>
      tags.some((tag) => description.toLowerCase().includes(tag))
    )
    return {
      description,
      thumb: thumb ? thumb.fileUrl : ""
    }
  })

  console.log(videosWithThumbs)
}

export const addVideoCasting = async () => {
  const { items: videos } = await wixData.query("Videos").limit(1000).find()

  const casting = videos.map(({ title }) => {})
}
