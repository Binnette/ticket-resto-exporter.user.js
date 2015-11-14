// ==UserScript==
// @name ticket-resto-exporter.user.js
// @namespace https://github.com/Binnette/ticket-resto-exporter.user.js
// @description Add a button to export transactions to compatible Homebank csv file
// @match https://www.myedenred.fr/Card/Transaction*
// @version 1.0
// ==/UserScript==

/*
Copyright 2015 Binnette (binnette@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function getFilename() {
  var date = new Date();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : '' + m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : '' + d;
  return date.getFullYear() + '-' + m  + '-' + d + '_ExportCarteTicketResto.csv';
}

function createFile(csv) {
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', getFilename());
  link.click();
}

function trimString(string){
  string = string.replace(/[\n\r]/g, ''); // remove line break
  string = string.replace(';', ''); // remove semicolon
  string = string.replace(/\s\s+/g, ' '); // remove multiple spaces
  string = string.trim(); // trim spaces
  return string;
}

function trimDate(date){
  return trimString(date).replace('/', '-');
}

function trimAmount(amount){
  return trimString(amount).replace(/\s/g, '').replace('+','').replace('€','');
}

function parseResult(data){
  var div = document.createElement("div");
  div.innerHTML = data;
  var d = div.querySelectorAll("tr");
  var csv = [], i, date, memo, info, amnt;
  for (i = 0; i < d.length; i++) {
    date = trimDate  (d[i].querySelectorAll("td")[1].textContent);
    memo = trimString(d[i].querySelectorAll("td")[2].textContent);
    info = trimString(d[i].querySelectorAll("td")[3].textContent);
    amnt = trimAmount(d[i].querySelectorAll("td")[4].textContent);
    csv.push(date + ';6;' + info + ';;' + memo + ';' + amnt + ';;');
  }
  return csv;
}

function parseResults(debit, credit){
  var csv = [];
  csv.push("date;paymode;info;payee;memo;amount;category;tags");
  var deb = parseResult(debit);
  var cre = parseResult(credit);
  csv = csv.concat(deb, cre);
  createFile(csv.join('\n'));
}

function serialize(obj) {
  return Object.keys(obj).reduce(function(a,k){
    a.push(k+'='+encodeURIComponent(obj[k]).replace(/%20/g, "+"));
    return a;
  },[]).join('&');
}

function getXHR(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback();
    }
  };
  return xhr;
}

function buttonExportClick(e){
  // disable button
  var btn = document.getElementById("treusjs-btn-export");
  var span = document.getElementById("treusjs-span-encours");
  btn.style.display = "none";
  span.style.display = "inline";
  // init parameters
  var params = {
    command: 'Charger les 10 transactions suivantes',
    ErfBenId: document.getElementById("ErfBenId").value, // id on 7 digits
    ProductCode: document.getElementById("ProductCode").value, // id on 3 digits
    PageNum: 1000, // number on transaction page to load
    OperationType: 'Debit'
    //,SortBy: 'DateOperation'
    //,failed: 'False'
  };
  // Get transactions
  var url = '/Card/TransactionSet';
  var xhr = getXHR(url, function() {
    var debit = xhr.responseText;
    var xhr2 = getXHR(url, function() {
      var credit = xhr2.responseText;
      parseResults(debit, credit);
        span.style.display = "none";
        btn.style.display = "inline";
    });
    params.OperationType = 'Credit';
    xhr2.send(serialize(params));
  });
  xhr.send(serialize(params));
  return false;
}

// Create a 'Export' button next to 'OK' button
function initUi(){
  var form = document.querySelector("#tab-debit form");
  if (!form) return;
  var filters = form.querySelector(".fl-r");
  if (!filters) return;
  var ok = filters.querySelector("input[type=submit]");
  // btn 'Export'
  var btn = document.createElement("a");
  btn.id = "treusjs-btn-export";
  btn.innerText = "Export";
  btn.className = ok.className;
  btn.onclick = buttonExportClick;
  filters.appendChild(btn);
  // badge 'En cours'
  var span = document.createElement("span");
  span.id = "treusjs-span-encours";
  span.innerText = "En cours";
  span.className = "badge";
  span.style.display = "none";
  span.style.marginLeft="2px";
  filters.appendChild(span);
}

initUi();
