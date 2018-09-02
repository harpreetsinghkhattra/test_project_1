import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { enableProdMode } from '@angular/core';

import * as router from './server/routes/task';
import { Index } from './server/socket/index';

enableProdMode();

const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('*.*', express.static(join(DIST_FOLDER, 'isshanvi')));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'isshanvi'));

app.use('/api', router);

app.get('*', (req, res) => {
    res.render('index', { req });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`)
    const io = require('socket.io')(server, { serveClient: false });
    const socket = new Index(io);
    socket.init();
});
