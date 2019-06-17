/*

*/

'use strict';

// Array of images
var imgArr = ['./img/bag.jpg','./img/banana.jpg','./img/bathroom.jpg','./img/boots.jpg','./img/breakfast.jpg','./img/bubblegum.jpg','./img/chair.jpg','./img/cthulhu.jpg','./img/dog-duck.jpg','./img/dragon.jpg','./img/pen.jpg','./img/pet-sweep.jpg','./img/scissors.jpg','./img/shark.jpg','./img/sweep.png','./img/tauntaun.jpg','./img/unicorn.jpg','./img/usb.gif','./img/water-can.jpg','./img/wine-glass.jpg'];

// Array of image objects;
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

function handleVoteClick(){
  genImages(3);
}

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

// Create a few test img objects
for(var t = 0; t < 6; t++) {
  var tempImgObj = new ImgObj(t, imgArr[t], t);
  imgObjArr.push(tempImgObj);
}

genImages(3);
