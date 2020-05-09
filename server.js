const express = require('express');
const path = require('path');
const nomeApp = process.env.npm_package_name;
const app = express();
 
app.use(express.static(`${__dirname}/dist/${nomeApp}`));
 
app.get('/*', (req, res) => {
res.sendFile(path.join(`${__dirname}/dist/${nomeApp}/index.html`));
});
 
app.listen(process.env.PORT || 8080);



// const express = require('express');
// const app = express();
// const path = require('path');

// app.use(express.static(__dirname + '/dist'));
// app.listen(process.env.PORT || 8080);
// app.get('/*', function(req, res){
//     res.sendFile(path.join(__dirname + 'dist/index.html'));
// })

// console.log('Ouvindo console');