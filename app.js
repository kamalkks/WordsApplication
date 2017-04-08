const uri="http://www.dictionaryapi.com/api/v1/references/collegiate/xml/";
const app_key='97e64fa9-deca-4bed-9488-85440cf8be78'
// word = "beautiful"

let data = null;


function ButtonClick(){
 getWordDetails(document.getElementById('word').value);
}



function getWordDetails(word){
 let  visual = document.getElementById('display');
  visual.innerHTML  = "";
  let info = new XMLHttpRequest();
  info.open("GET", `${uri}${word}?key=${app_key}`);


  info.responseType = 'document';

  
  info.overrideMimeType('text/xml');

  info.onload = function () {
    if (info.readyState === info.DONE) {
      if (info.status === 200) {
        

       let json = xmlToJson(info.responseXML);
       let html = getOutputHTML(json);
        visual.appendChild(html);

      }
    }
  };


  info.send();


}

function getOutputHTML(json){
  let visual = document.createElement("div");
 let entries = json.entry_list.entry;

  for(let entry_index in entries){
   let entry = entries[entry_index];
    if(entry.pt && entry.pt.sc){
        let syn = entry.pt.sc;
    }

  let  pronounce = entry.hw;
  let  type = entry.fl;

  let  usages = entry.uro;

    if (entry.def){

      dts = entry.def.dt;
    }
   let lastMeaning = ""
    let meaning
    for(let dt_index in dts){
      dt = dts[dt_index];
      if(dt["#text"]){
           meaning = dt["#text"].toString();
      }
      if(meaning){
        meaning = meaning.replace(":", "")
        meaning = meaning.replace(",", "")
        meaning = meaning.trim();
        if (meaning != "" & lastMeaning != meaning){
          lastMeaning = meaning;
          visual.appendChild(getKeyValDiv("Meaning ", meaning.replace(":", "")));
        }

      }

    }

    for(let usage_index in usages){
     let usage = usages[usage_index];
      visual.appendChild(getKeyValDiv("Usage as "+usage.fl, usage.ure));
    }
let syn
    if (syn)
      visual.appendChild(getKeyValDiv("Synonym ", syn.join(", ")));
    visual.appendChild(getKeyValDiv("Pronounce ", pronounce));
    visual.appendChild(getKeyValDiv("Type ", type));

    break;
  }
  return visual;
}


function getKeyValDiv(key, value){
 let div = document.createElement("div");
let  text =  `${key}: ${value}`;
  div.textContent = text;
  return div;
}

function xmlToJson(xml) {

  
  let collect = {};

  if (xml.nodeType == 1) { 
    
    if (xml.attributes.length > 0) {
    collect["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        let attribute = xml.attributes.item(j);
        collect["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { 
    collect = xml.nodeValue;
  }

 
  if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
    collect = xml.childNodes[0].nodeValue;
  }
  else if (xml.hasChildNodes()) {
    for(let k = 0; k < xml.childNodes.length; k++) {
      let conv = xml.childNodes.item(k);
      let nodeName = conv.nodeName;
      if (typeof(collect[nodeName]) == "undefined") {
        collect[nodeName] = xmlToJson(conv);
      } else {
        if (typeof(collect[nodeName].push) == "undefined") {
          let old = collect[nodeName];
          collect[nodeName] = [];
          collect[nodeName].push(old);
        }
        collect[nodeName].push(xmlToJson(conv));
      }
    }
  }
  return collect;
}