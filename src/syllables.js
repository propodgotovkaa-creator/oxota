export const ALPHABET = [...'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'];
export const VOWELS = [...'АЕЁИОУЫЭЮЯ'];
export const CONSONANTS = [...'БВГДЖЗЙКЛМНПРСТФХЦЧШЩ'];
const forbidden = new Set(['ЖЫ','ШЫ','ЧЫ','ЩЫ','ЖЯ','ШЯ','ЧЯ','ЩЯ','ЖЮ','ШЮ','ЧЮ','ЩЮ','ЦЯ','ЦЮ']);
export function combinations(letters, mode = 'mixed') {
  const selected = new Set(letters), result = [];
  for (const c of CONSONANTS.filter(x => selected.has(x))) {
    for (const v of VOWELS.filter(x => selected.has(x))) {
      if (mode !== 'closed' && c !== 'Й' && !forbidden.has(c+v)) result.push(c+v);
      if (mode !== 'open') result.push(v+c);
    }
  }
  return result;
}
export function shuffle(items, random = Math.random) {
  const out = [...items];
  for (let i=out.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
  return out;
}
export function distribute(items, random = Math.random) {
  if (!items.length) throw new Error('Выберите хотя бы одну гласную и одну согласную, образующие слог.');
  const deck = shuffle(items,random);
  if(deck.length<4) return Array.from({length:4},(_,i)=>[deck[i%deck.length]]);
  const groups=[]; let cursor=0;
  for(let i=0;i<4;i++) {const size=Math.floor(deck.length/4)+(i<deck.length%4?1:0);groups.push(deck.slice(cursor,cursor+size));cursor+=size;}
  return groups;
}
export const paginate = (items, size=12) => Array.from({length:Math.ceil(items.length/size)},(_,i)=>items.slice(i*size,(i+1)*size));
