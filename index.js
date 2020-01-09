const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs    = require('fs');
const path  = require('path');
const https = require('https');
const app = express();
app.use(cors());
app.listen(process.env.PORT, () => {
    console.log('Server Works !!! At port 4000');
});
app.get('/download', (req,res) => {
var URL = req.query.URL;
res.header('Content-Disposition', 'attachment; filename="video.mp4"');
ytdl(URL, {
    format: 'mp4'
    }).pipe(res);
});


app.get('/subtits', (req,res) => {
var id = req.query.URL;
    var lang = "en";
ytdl.getInfo(id, (err, info) => {
  if (err) throw err;
  const tracks = info
    .player_response.captions
    .playerCaptionsTracklistRenderer.captionTracks;
  if (tracks && tracks.length) {
    console.log('Found captions for',
      tracks.map(t => t.name.simpleText).join(', '));
    const track = tracks.find(t => t.languageCode === lang);
    if (track) {
      console.log('Retrieving captions:', track.name.simpleText);
      console.log('URL', track.baseUrl);
      const output = `${info.title}.${track.languageCode}.xml`;
      console.log('Saving to', output);
      https.get(track.baseUrl, (res) => {
          res.header('Content-Disposition', 'attachment; filename="subtits.xml"');
        res.pipe(res);
      });

    } else {
      console.log('Could not find captions for', lang);

    }
  } else {
    console.log('No captions found for this video');
  }

});
});
