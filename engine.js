export const normalize = text => text.toLowerCase().replace(/\s*[\[(](?:feat\.?|ft\.?|featuring)\s+.*?[\])]/gi, '').normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '');
export const duration = seconds => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
export function matching(tracks, guess, found) { const key=normalize(guess); return key ? tracks.flatMap((song,i)=>normalize(song)===key&&!found.has(i)?[i]:[]) : []; }
export function newRecord(history, seconds, date = new Date().toISOString()) { return history.length && seconds >= history.at(-1).seconds ? null : [...history,{seconds,date}]; }
