'use strict';
/**
 * fis-conf.js
 * @version : 1.0
 * @功能说明 : fis3配置
 */

var configFile = require('./config.json'),
    config = null,
    urlRoot = null;

if(process.argv.indexOf('prod') == -1){
    process.env.NODE_ENV = 'dev';
    config = configFile.dev;
}else {
    process.env.NODE_ENV = 'prod';
    config = configFile.prod;
}
urlRoot = config.ROOT?'/'+config.ROOT:'';

fis.set('base.urlRoot', urlRoot);
fis.set('base.port',config.PORT);
fis.set('base.root', config.ROOT);
fis.set('base.static',config.ROOT + '/public');
fis.set('new date', Date.now());

fis.match('*',{
    release: '${base.root}/$0',
});
fis.match(/^\/components\/([^\/]+)\/(.*)(\.scss|js)$/,{
    release: false
});
fis.match('libs/**',{
    release: false
});
fis.match(/^\/libs\/((jquery\.min|common|statistics)\.js)$/,{
    release: '${base.static}/$1',
    preprocessor: fis.plugin('browserify'),
    url:'${base.urlRoot}/$1'
});
fis.match(/^\/assets\/(.*)$/,{
    release: '${base.static}/$1',
    url:'${base.urlRoot}/$1'
});
fis.match(/^\/assets\/scss\/(.*)$/,{
    release: false
});
fis.match(/^\/assets\/scss\/((.*)\.htc)$/, {
    release: '${base.static}/$1'
});
fis.match(/^\/views\/([^\/]+)\/(.*)$/,{
    release: '${base.static}/$2',
    preprocessor: fis.plugin('browserify'),
    url:'${base.urlRoot}/$2'
});
fis.match(/^\/views\/([^\/]+)\/\1.handlebars$/,{
    release: '${base.root}/views/$1'
});
fis.match(/^\/views\/layouts\/(([^\/]+)\/)*(.*)\.handlebars$/,{
    release: '${base.root}/views/layouts/$3'
});

// prod 模式下进行压缩优化

fis.media('prod').match(/^\/views\/([^\/]+)\/(.*)\.js$/, {
    query: '?=t' + fis.get('new date'),
    optimizer: fis.plugin('uglify-js')
});
fis.media('prod').match('*.{css,less,scss,sass}', {
    query: '?=t' + fis.get('new date'),
    optimizer: fis.plugin('clean-css')
});
fis.media('prod').match('*.png', {
    optimizer: fis.plugin('png-compressor',{type: 'pngquant'})
});
