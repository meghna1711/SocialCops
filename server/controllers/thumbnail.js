import gm from 'gm';
import request from 'request';
import fs from 'fs';
import path from 'path';

export default (req, res) => {
    let imageUrl = req.body.url;

    if (!imageUrl) return res.send('400', 'Invalid Request. Missing Image Url');

    // "!" is used to update image without maintaining aspect ratio
    gm(request(imageUrl))
        .resize('50', '50', "!")
        .stream((err, stdout, stderr) => {
            if (err) return res.send(500, err);
            let imageType = imageUrl.replace(/(.*)\.(\w*)/, '$2');
            res.setHeader('Content-Type', 'image/' + imageType);
            stdout.pipe(res);
        });
}