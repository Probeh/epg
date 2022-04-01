const dayjs = require('dayjs')

module.exports = {
  site: 'guidatv.sky.it',
  days: 7,
  url: function ({ date, channel }) {
    const [env, id] = channel.site_id.split('#')
    return `https://apid.sky.it/gtv/v1/events?from=${date.format('YYYY-MM-DD')}T00:00:00Z&to=${date
      .add(1, 'd')
      .format('YYYY-MM-DD')}T00:00:00Z&pageSize=999&pageNum=0&env=${env}&channels=${id}`
  },
  parser: function ({ content }) {
    const programs = []
    const data = JSON.parse(content)
    const items = data.events
    if (!items.length) return programs
    items.forEach(item => {
      programs.push({
        title: item.eventTitle,
        description: item.eventSynopsis,
        category: item.content.genre.name,
        season: item.content.seasonNumber || null,
        episode: item.content.episodeNumber || null,
        start: parseStart(item),
        stop: parseStop(item),
        icon: parseIcon(item)
      })
    })

    return programs
  }
}

function parseStart(item) {
  return item.starttime ? dayjs(item.starttime) : null
}

function parseStop(item) {
  return item.endtime ? dayjs(item.endtime) : null
}

function parseIcon(item) {
  const cover = item.content.imagesMap ? item.content.imagesMap.find(i => i.key === 'cover') : null

  return cover && cover.img && cover.img.url ? `https://guidatv.sky.it${cover.img.url}` : null
}
