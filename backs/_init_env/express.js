const express = require('express');
const expressServ = express();
expressServ.use(express.static('./public'));
expressServ.use(express.json());
const port = 3010; // express listener port

const startServ = () => {
    expressServ.listen(port, () => {
        console.log(`Accelerator app is now started and listen on port ${port}`)
    })
}

module.exports.expressServ = expressServ
module.exports.startServ = startServ