/*
Kevin Couture
Jun 17th, 2019
Bus-Mall lab
Codefellows 201d57
*/

'use strict';

// import Chart from 'chart.js';
// var Chart = require('chart.js');

// img Constructor
var ImgObj = function(inURL, inID){
  this.name = imgNameRip(inURL);
  this.url = inURL;
  this.id = inID;
  this.clickCount = 0;
  this.viewCount = 0;
};

var ImgObjLocal = function(name, url, id, clicks, views) {
  this.name = name;
  this.url = url;
  this.id = id;
  this.clickCount = clicks;
  this.viewCount = views;
};

// Chart creation.
var ctx = document.getElementById('chart').getContext('2d');
// eslint-disable-next-line no-undef
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: '% of Clicks per Views',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Attach listeners
document.getElementById('img0').addEventListener('click', handleImgClick);
document.getElementById('img1').addEventListener('click', handleImgClick);
document.getElementById('img2').addEventListener('click', handleImgClick);

// Globals
var totalClicks = 0;
var imgCount = 3;
var maxVoteCount = 25;
var localStorageExists = check_html5_storage();


// Array of images.
var imgArr = ['./img/bag.jpg','./img/banana.jpg','./img/bathroom.jpg','./img/boots.jpg','./img/breakfast.jpg','./img/bubblegum.jpg','./img/chair.jpg','./img/cthulhu.jpg','./img/dog-duck.jpg','./img/dragon.jpg','./img/pen.jpg','./img/pet-sweep.jpg','./img/scissors.jpg','./img/shark.jpg','./img/sweep.png','./img/tauntaun.jpg','./img/unicorn.jpg','./img/usb.gif','./img/water-can.jpg','./img/wine-glass.jpg'];

// Array of image objects.
var imgObjArr = [];
// Pull data from local storage if exists
if (localStorageExists && localStorage.getItem('imgObjArr') !== null) {
  imgObjArr = pullImgObjArr();
  totalClicks = parseInt(localStorage['totalClicks']);
  if(totalClicks >= (maxVoteCount-1)) {
    removeEventLists();
    genResultList();
  }
}
else {
  createImgObjArray();
}

// Array holds the last 3 image id's that were in the selection last.
var prevThree = ['', '', ''];

//
// Functions
//

// Checks for local storage
function check_html5_storage() {
  try {
    return ('localStorage' in window && window['localStorage'] !== null);
  } catch (e) {
    return false;
  }
}

// Create a blank salte imgObjArr
function createImgObjArray() {
  // Create a few test img objects.
  for(var t = 0; t < imgArr.length; t++) {
    var tempImgObj = new ImgObj(imgArr[t], t);
    imgObjArr.push(tempImgObj);
  }
}

function imgNameRip(inURL) {
  return inURL.substring(6,inURL.indexOf('.',7));
}

// Currently a test function that will generate 3 new images.
// eslint-disable-next-line no-unused-vars
function handleVoteClick(){
  localStorage.clear();
  imgObjArr = [];
  createImgObjArray();
  genResultList();
}

function handleImgClick(event) {
  var trgEleSrc = event.target.src;
  for(var imgIdx = 0; imgIdx < prevThree.length; imgIdx++) {
    imgObjArr[prevThree[imgIdx]].viewCount++;
  }
  findImg(trgEleSrc.substring(trgEleSrc.indexOf('/img')));
  if(totalClicks >= (maxVoteCount-1)) {
    removeEventLists();
    genResultList();
  }
  else {
    genImages(3);
  }
  totalClicks++;
  storeData();
}

function findImg(trgEleSrc) {
  for(var i = 0; i < imgObjArr.length; i++) {
    if(imgObjArr[i].url.includes(trgEleSrc)) {
      imgObjArr[i].clickCount++;
      break;
    }
  }
}

function removeEventLists() {
  var tempStr = '';
  for (var i = 0; i < imgCount; i++) {
    tempStr = 'img' + i;
    document.getElementById(tempStr).removeEventListener('click', handleImgClick);
  }
}

// Creates a string form of our data for a single imgObj.
function imgObjToStr(imgObj) {
  return '{name:' + imgObj.name + ',url:' + imgObj.url + ',id:' + imgObj.id + ',clickCount:' + imgObj.clickCount + ',viewCount:' + imgObj.viewCount + ',}';
}

// Store all data
function storeData() {
  storeImgObjArr();
  localStorage.setItem('totalClicks', totalClicks);
}

// Creates imgObj from our localstorage data string
function strToImgObjArr(dataStr){
  var name, url, id, clicks, views, commaCounter = 0, colonCounter = 0;

  name = (dataStr.substring(dataStr.indexOf(':')+1,dataStr.indexOf(',',1)));

  commaCounter = dataStr.indexOf(',',commaCounter+1);
  colonCounter = dataStr.indexOf(':',commaCounter+1);

  url = dataStr.substring(dataStr.indexOf(':',colonCounter)+1,dataStr.indexOf(',',commaCounter+1));

  commaCounter = dataStr.indexOf(',',commaCounter+1);
  colonCounter = dataStr.indexOf(':',commaCounter+1);

  id = (dataStr.substring(dataStr.indexOf(':',colonCounter)+1,dataStr.indexOf(',',commaCounter+1)));

  commaCounter = dataStr.indexOf(',',commaCounter+1);
  colonCounter = dataStr.indexOf(':',commaCounter+1);

  clicks = parseInt(dataStr.substring(dataStr.indexOf(':',colonCounter)+1,dataStr.indexOf(',',commaCounter+1)));

  commaCounter = dataStr.indexOf(',',commaCounter+1);
  colonCounter = dataStr.indexOf(':',commaCounter+1);

  views = parseInt(dataStr.substring(dataStr.indexOf(':',colonCounter)+1,dataStr.indexOf(',',commaCounter+1)));

  var retImgObj = new ImgObjLocal(name, url, id, clicks, views);
  return retImgObj;
}

// Pulls all imgObjs from local storage
function pullImgObjArr() {
  var localImgObjArr = localStorage['imgObjArr'].split('}');
  var tempImgArr = [];
  for(var i = 0; i < (localImgObjArr.length-1); i++) {
    tempImgArr.push(strToImgObjArr(localImgObjArr[i]));
  }
  return tempImgArr;
}

// Stores all imgObj in the imgObjArr
function storeImgObjArr(){
  var imgStoreArr = [];
  for(var i = 0; i < imgObjArr.length; i++) {
    imgStoreArr.push(imgObjToStr(imgObjArr[i]));
  }
  localStorage.setItem('imgObjArr', imgStoreArr);
}

function genResultList() {
  var ulEle, liEle;
  ulEle = document.getElementById('resList');
  ulEle.innerHTML = '';
  for(var i = 0; i < imgObjArr.length; i++) {
    liEle = document.createElement('li');
    liEle.textContent = 'Name: ' + imgObjArr[i].name + ' | Click Count : ' + imgObjArr[i].clickCount + ' | View Count : ' + imgObjArr[i].viewCount + ' | Percent click/view : ' + (100*(imgObjArr[i].clickCount/imgObjArr[i].viewCount)).toFixed(2);
    ulEle.appendChild(liEle);
  }
  genChart();
}

/*
@func genImages
@param count - an integer count of the number of images to generate (locked in at 3 currently)
@ret VOID
@desc This function will genereate and place count number of random images (testing 3 unless stretch goal can be met) and displays the images on one of the designated areas.
*/
function genImages(count) {
  var tempIdStr = '';
  var tempEle;
  var nextImg;
  var nextThree = ['','',''];

  for(var i = 0; i < count; i++) {
    tempIdStr = 'img' + i;
    tempEle = document.getElementById(tempIdStr);
    nextImg = imgObjArr[ Math.floor(Math.random()*imgObjArr.length) ];
    while (prevThree.includes(nextImg.id) || nextThree.includes(nextImg.id)) {
      nextImg = imgObjArr[ Math.floor(Math.random()*imgObjArr.length) ];
    }
    nextThree[i] = nextImg.id;
    tempEle.src = nextImg.url;
  }
  prevThree = nextThree;
}

// Generate function for the chart.
function genChart() {
  var colorStr = '';
  var r,g,b;
  // Clear chart valuse
  myChart.config.data.labels = [];
  myChart.config.data.datasets[0].data = [];
  myChart.config.data.datasets[0].backgroundColor = [];
  myChart.config.data.datasets[0].borderColor = [];

  for(var c = 0; c < imgObjArr.length; c++) {
    myChart.config.data.labels.push(imgObjArr[c].name);
    myChart.config.data.datasets[0].data.push((100*(imgObjArr[c].clickCount/imgObjArr[c].viewCount)).toFixed(2));

    r = Math.random()*255;
    g = Math.random()*255;
    b = Math.random()*255;

    colorStr = 'rgba(' + r + ',' + g + ',' + b + ', .2)';
    myChart.config.data.datasets[0].backgroundColor.push(colorStr);
    colorStr = 'rgba(' + r + ',' + g + ',' + b + ', 1)';
    myChart.config.data.datasets[0].borderColor.push(colorStr);
  }
  myChart.update();
}

// Function Calls

// Start with 3 imgages preloaded.
genImages(imgCount);
