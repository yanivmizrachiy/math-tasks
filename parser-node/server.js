import express from "express";
import cors from "cors";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
const app = express();
app.use(cors());
app.use(express.json({limit:'1mb'}));
const ParseReq = z.object({ docId: z.string().min(1), text: z.string().min(1) });
function intentReplaceAll(t){ const m=t.match(/מצא.*?(.+?)\s+והחלף\s+ב\s+(.+)/); if(!m) return null; return [{type:'replaceText', find:m[1].trim(), replace:m[2].trim()}]; }
function intentInsertText(t){ const m=t.match(/הוסף\s*טקסט\s*'([^']+)'\s*במיקום\s*(\d+)/); if(!m) return null; return [{type:'insertText', locationIndex:parseInt(m[2],10), text:m[1]}]; }
const INTENTS=[intentReplaceAll,intentInsertText];
app.post('/parse',(req,res)=>{ try{ const {docId,text}=ParseReq.parse(req.body); const parts=String(text).split(/\s+וגם\s+/); const ops=[]; for(const p of parts){ let matched=false; for(const fn of INTENTS){ const out=fn(p.trim()); if(out){ out.forEach(o=>ops.push(o)); matched=true; break; } } if(!matched) return res.status(400).json({ok:false,error:'No intent matched', part:p}); } return res.json({ok:true, docId, requestId:uuidv4(), ops}); }catch(e){ return res.status(400).json({ok:false,error:e?.message||String(e)}); } });
app.get('/health',(_,res)=>res.json({ok:true}));
const PORT = process.env.PORT||8080; app.listen(PORT,()=>console.log('Parser listening on :'+PORT));
