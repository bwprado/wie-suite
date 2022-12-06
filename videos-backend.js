import wixData from "wix-data"
import response from "public/videos.json"

export const listVideos = async () => {
  const { items: videos } = await wixData.query("Videos").limit(500).find()
  return videos
}

export const addVideosToColletion = async () => {
  await wixData.bulkInsert("Videos", response)
}
