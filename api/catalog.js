const endpoint='https://itunes.apple.com/';
async function lookup(path,params){const response=await fetch(endpoint+path+'?'+new URLSearchParams(params),{signal:AbortSignal.timeout(6500)});if(!response.ok)throw Error('Catalog error');return (await response.json()).results||[];}
function info(a){return {id:String(a.collectionId),name:a.collectionName,artist:a.artistName,count:a.trackCount,artwork_url:a.artworkUrl100?.replace('100x100bb','600x600bb')};}
export default async function handler(req,res){
 const {mode,id,q}=req.query;
 if(req.method!=='GET')return res.status(405).json({error:'GET only'});
 if(!['search','album','cover'].includes(mode)|| (mode==='search' ? typeof q!=='string'||!q.trim()||q.length>180 : typeof id!=='string'||!/^\d{1,20}$/.test(id)))return res.status(400).json({error:'Invalid request'});
 try{
  if(mode==='search'){
   const items=await lookup('search',{term:q,entity:'album',limit:40,country:'US'});
   res.setHeader('Cache-Control','s-maxage=3600');return res.json(items.filter(a=>a.collectionId&&a.collectionName).map(info));
  }
  for(const country of ['US','FR']){
   try{
    const items=await lookup('lookup',{id,country,...(mode==='album'?{entity:'song',limit:200}:{})});
    const a=items.find(x=>x.wrapperType==='collection'&&String(x.collectionId)===id);
    if(!a)continue;
    if(mode==='cover'&&a.artworkUrl100){res.setHeader('Cache-Control','s-maxage=86400');return res.json({url:info(a).artwork_url});}
    if(mode==='album'){
     const tracks=items.filter(t=>t.wrapperType==='track'&&t.kind==='song'&&t.trackName).sort((a,b)=>(a.discNumber||1)-(b.discNumber||1)||a.trackNumber-b.trackNumber).map(t=>t.trackName);
     if(tracks.length){res.setHeader('Cache-Control','s-maxage=3600');return res.json({...info(a),tracks});}
    }
   }catch{}
  }
  if(mode==='cover'){
   const response=await fetch('https://music.apple.com/us/album/'+id,{signal:AbortSignal.timeout(6500),headers:{'User-Agent':'Mozilla/5.0'}});
   if(response.ok){const html=await response.text();const tag=html.match(/<meta\b[^>]*\bproperty=["']og:image["'][^>]*>/i)?.[0];const url=tag?.match(/\bcontent=["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g,'&');if(url&&/^https:\/\/[^/]+\.mzstatic\.com\//i.test(url)){res.setHeader('Cache-Control','s-maxage=86400');return res.json({url});}}
  }
  return res.status(404).json({error:'Album unavailable'});
 }catch{return res.status(502).json({error:'Catalog unavailable'});}
}
