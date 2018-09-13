// :name= Kansuji Converter
// :description=Converts CJK numbers to Arabic

var files = project.getProjectFiles();

for (var i = 0; i < files.size(); i++)
{
  var fi = files.get(i);

  for (var j = 0; j < fi.entries.size(); j++)
  {
    var ste = fi.entries.get(j);
    var target = convertKansuji(ste);

    if ( ste.getSrcText().equalsIgnoreCase(target) == false )
      {
        editor.gotoEntry(ste.entryNum());
        editor.replaceEditText(target);
    }
  }
}

function convertKansuji (ste) {
  var input = ste.getSrcText();
  var target = "";
  if (project.getTranslationInfo(ste).translation != null) {
    target = project.getTranslationInfo(ste).translation;
  }
  else {
    target = input;
  }
  
  var kansuji = /([一二三四五六七八九十百千万億兆]+)/g;
  var matches = input.match(kansuji);
  
  var output = [];
  if (matches != null) { 
    matches.forEach(function(m, i) {
      if (m.length == 1) {
        output[i] = m + " (skip)";
      }
      else {
        output[i] = getValue(m);
        target = target.replace(m, num2str(output[i]));
      }
    });
  }

  console.println("Found numbers in segment #" + ste.entryNum() + ": " + output.toString());
  return target;
}

function getValue (m) {
  var big = /([一二三四五六七八九十百千]*[万億兆]{1}|[一二三四五六七八九]?[十百千]{1}|[一二三四五六七八九]{1})/g;
  var value = 0;
 
  var big_matches = m.match(big);
  if (big_matches == null) { return 1; }
  big_matches.forEach(function(bm){
    if (bm.endsWith("兆")) {
      value += 1000000000000 * getMed(bm);
    }
    else if (bm.endsWith("億")){
      value += 100000000 * getMed(bm);
    }
    else if (bm.endsWith("万")){
      value += 10000 * getMed(bm);
    }
    else {
      value += getMed(bm);
    }
  });
  
  return value;
}

function getMed (bm) {
  var med = /([一二三四五六七八九]?[十百千]{1}|[一二三四五六七八九]{1})/g;
  var value = 0;
 
  var med_matches = bm.match(med);
  if (med_matches == null) { return 1; }
  med_matches.forEach(function(mm){
    if (mm.endsWith("千")) {
      value += 1000 * getSml(mm);
    }
    else if (mm.endsWith("百")){
      value += 100 * getSml(mm);
    }
    else if (mm.endsWith("十")){
      value += 10 * getSml(mm);
    }
    else {
      value += getSml(mm);
    }
  });
  return value;
}

function getSml (mm) {
  var sml = /([一二三四五六七八九])/g;
  var value = 0;
 
  var sml_matches = mm.match(sml);
  if (sml_matches == null) { return 1; }
  sml_matches.forEach(function(sm){
    switch (sm)
      {
        case "一":
          value = 1;
          break;

        case "二":
          value = 2;
          break;
        
        case "三":
          value = 3;
          break;

        case "四":
          value = 4;
          break;

        case "五":
          value = 5;
          break;
        
        case "六":
          value = 6;
          break;

        case "七":
          value = 7;
          break;

        case "八":
          value = 8;
          break;

        case "九":
          value = 9;
          break;
    }
  });  
  return value;
}

function num2str (num) {
  var numstr = num.toString();
  var re = /([0-9]+?)((?:[0-9]{3})+)(\.[0-9]+)?$/g;
  var re2 = /([0-9]{3})/g;
  var a = numstr.split(re).slice(1, 4);
  if (a[0] == undefined) { 
    return numstr;
  }
  var b = [a[0]]
  b = b.concat(a[1].match(re2))
  numstr = b.join(',')
  if (a[2] != undefined) {
    numstr  += a[2];
  }

  return numstr;
}