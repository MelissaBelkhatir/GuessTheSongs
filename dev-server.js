import http from 'node:http';
import {readFile} from 'node:fs/promises';
import handler from './api/catalog.js';
const files={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/albums.js':'albums.js','/engine.js':'engine.js'};
const types={html:'text/html',css:'text/css',js:'text/javascript'};
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/api/catalog'){req.query=Object.fromEntries(url.searchParams);res.status=n=>{res.statusCode=n;return res};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data))};return handler(req,res)}const file=files[url.pathname];if(!file){res.writeHead(404);return res.end('Not found')}try{res.setHeader('Content-Type',types[file.split('.').at(-1)]+'; charset=utf-8');res.end(await readFile(new URL(file,import.meta.url)))}catch{res.writeHead(500);res.end('File unavailable')}}).listen(3000,()=>console.log('Album Recall: http://localhost:3000'));
