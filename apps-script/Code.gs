/** Docs Smart Edit – Executor v2.0 (real) */
function doPost(e){
  try{
    if(!e||!e.postData||!e.postData.contents) throw new Error('Missing body');
    var body = JSON.parse(e.postData.contents);
    var docId = body.docId, ops = body.ops||[], requestId = body.requestId;
    if(!docId || !Array.isArray(ops)) throw new Error('Invalid payload');
    var requests = [];
    for (var i=0;i<ops.length;i++){
      var op = ops[i];
      switch(op.type){
        case 'insertText': requests.push({insertText:{location:{index:op.locationIndex},text:op.text}}); break;
        case 'replaceText': requests.push({replaceAllText:{containsText:{text:op.find,matchCase:!!op.matchCase},replaceText:op.replace}}); break;
        case 'updateParagraphStyle': requests.push({updateParagraphStyle:{range:op.range, paragraphStyle:{alignment: op.style&&op.style.alignment || 'START', direction: op.style&&op.style.direction || 'RIGHT_TO_LEFT', lineSpacing: op.style&&op.style.lineSpacing || 1.15}, fields:'alignment,direction,lineSpacing'}}); break;
        case 'createBullets': requests.push({createParagraphBullets:{range:op.range, bulletPreset: op.preset||'BULLET_DISC_CIRCLE_SQUARE'}}); break;
        case 'insertTable': requests.push({insertTable:{location:{index:op.locationIndex}, rows:op.rows, columns:op.columns}}); break;
        case 'mergeTableCells': requests.push({mergeTableCells:{tableRange:{tableCellLocation:{tableStartLocation:{index:op.tableStartIndex}, rowIndex:op.row, columnIndex:op.column}, rowSpan:op.rowSpan, columnSpan:op.columnSpan}}}); break;
        case 'insertInlineImage': requests.push({insertInlineImage:{location:{index:op.locationIndex}, uri:'https://drive.google.com/uc?id='+op.fileId, objectSize:(op.width&&op.height)?{height:{magnitude:op.height,unit:'PT'},width:{magnitude:op.width,unit:'PT'}}:null}}); break;
        case 'deleteContentRange': requests.push({deleteContentRange:{range:op.range}}); break;
        case 'updateTextStyle': requests.push({updateTextStyle:{range:op.range, textStyle:op.style||{}, fields:Object.keys(op.style||{}).join(',')}}); break;
        default: throw new Error('Unsupported op: '+op.type);
      }
    }
    var resp = Docs.Documents.batchUpdate({requests:requests}, docId);
    return ContentService.createTextOutput(JSON.stringify({ok:true,requestId:requestId||Utilities.getUuid(), resp:resp})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err&&err.message||err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
