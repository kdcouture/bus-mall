/*
Kevin Couture
Jun 17th, 2019
Bus-Mall lab
Codefellows 201d57
*/

'use strict';

// Globals
var totalClicks = 0;
var imgCount = 3;

// Array of images.
var imgArr = ['./img/bag.jpg','./img/banana.jpg','./img/bathroom.jpg','./img/boots.jpg','./img/breakfast.jpg','./img/bubblegum.jpg','./img/chair.jpg','./img/cthulhu.jpg','./img/dog-duck.jpg','./img/dragon.jpg','./img/pen.jpg','./img/pet-sweep.jpg','./img/scissors.jpg','./img/shark.jpg','./img/sweep.png','./img/tauntaun.jpg','./img/unicorn.jpg','./img/usb.gif','./img/water-can.jpg','./img/wine-glass.jpg'];

// Array of image objects.
var imgObjArr = [];

// Array holds the last 3 image id's that were in the selection last.
var prevThree = ['', '', ''];

// img Constructor
var ImgObj = function(inName, inURL, inID){
  this.name = inName;
  this.url = inURL;
  this.id = inID;
  this.clickCount = 0;
  this.viewCount = 0;
};

// Currently a test function that will generate 3 new images.
function handleVoteClick(){
  genImages(3);
}

function handleImgClick(event) {
  var trgEleSrc = event.target.src;
  for(var imgIdx = 0; imgIdx < prevThree.length; imgIdx++) {
    imgObjArr[prevThree[imgIdx]].viewCount++;
  }
  findImg(trgEleSrc.substring(trgEleSrc.indexOf('/img')));
  if(totalClicks >= 4) {
    removeEventLists();
    genResultList();
  }
  else {
    genImages(3);
  }
  totalClicks++;
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

document.getElementById('img0').addEventListener('click', handleImgClick);
document.getElementById('img1').addEventListener('click', handleImgClick);
document.getElementById('img2').addEventListener('click', handleImgClick);

function genResultList() {
  var ulEle, liEle;
  ulEle = document.getElementById('resList');
  for(var i = 0; i < imgObjArr.length; i++) {
    liEle = document.createElement('li');
    liEle.textContent = 'Name: ' + imgObjArr[i].name + ' | Click Count : ' + imgObjArr[i].clickCount + ' | View Count : ' + imgObjArr[i].viewCount + ' | Percent click/view : ' + (100*(imgObjArr[i].clickCount/imgObjArr[i].viewCount)).toFixed(2);
    ulEle.appendChild(liEle);
  }
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

// Function Calls

// Create a few test img objects.
// for(var t = 0; t < imgArr.length; t++) {
  for(var t = 0; t < 6; t++) {
  var tempImgObj = new ImgObj(t, imgArr[t], t);
  imgObjArr.push(tempImgObj);
}

// Start with 3 imgages preloaded.
genImages(imgCount);
