const express       = require('express')
const cors          = require('cors')
const app           = express()
const FfmpegCommand = require('fluent-ffmpeg')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3554.0 Safari/537.36'

app.use(cors())

app.get('/', (req, res) => {
  const size    = req.query.size || '240x135'
  const ffmpeg  = (new FfmpegCommand())
    .input('https://iptv-production.up.railway.app/api/vidio?id=665')
    .inputOption(`-user_agent`, UA)
    .size(size)
    .aspect('16:9')
    .autopad()
    .videoCodec('mpeg1video')
    .videoBitrate('1000k')
    .audioCodec('mp2')
    .audioBitrate('128k')
    .outputFps(25)
    .toFormat('mpegts')

  res.writeHead(200, { 'Content-Type': 'video/mp2t' })
  res.setTimeout(0)
  req.on('close', () => {
    ffmpeg.kill()
  })

  ffmpeg.pipe(res)

  ffmpeg.on('error', (error) => {
    console.log('error:', error.message)
    res.end()
  })
})

app.listen(1811)
