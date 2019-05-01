//before we even start fix the annoying select-cursor bug in Chrome:
document.onselectstart = function (e) { e.preventDefault(); return false; };

//create handles for elements that were instantiated in the HTML markup:
var track = document.getElementById('track');
var percentage = document.getElementById('percentage');
var contentBox = document.getElementsByClassName('contentBox')[0];
var boxHeight = 20;

//initial states variables, append to their elements:
document.mouseState = 'up';
track.viewpointTop = track.getBoundingClientRect().top;
track.viewpointBottom = track.getBoundingClientRect().bottom;
track.percentage = 0;
track.lastMousePosY = track.viewpointTop;

//We will need to access the top and height properties of the slider and track.
//Set them here initally rather than in CSS so that we can access them without getComputedStyle calls:
track.style.height = '300px';

//Rather than having mousedown and mouseup events add or remove handlers,
//we have them set states. We require two functions for document-wide events, and
//two functions for every slider added to the document. Here we have 4 functions and they
//are never removed or re-assigned.

//Document mouse event functions:
document.onmousedown = function () {
  document.mouseState = 'down';
};

document.onmouseup = function () {
  document.mouseState = 'up';
};

// Track mouse event functions

// Prevent right click menu from opening
track.addEventListener('contextmenu', event => event.preventDefault());

track.onmousedown = function(e) {
  if (e.button == 0) {
    track.style.cursor = "url('./assets/bravoCursorUp.png'), auto"
  } else if (e.button == 1) {
    track.style.cursor = "url('./assets/bravoCursorSide.png'), auto"
  }else if (e.button == 2) {
    track.style.cursor = "url('./assets/bravoCursorDown.png'), auto"
  }
}

track.onmouseup = function(e) {
  track.style.cursor = "url('./assets/bravoCursorNeutral.png'), auto"
  if (e.button == 0) {
    movePageDown()
  } else if (e.button == 1) {
    movePageToSpot(e.pageY)
  } else if (e.button == 2) {
    movePageUp()
  }
}

//Helper function. Not strictly required, but will make the logic down the bottom
//easier to follow by simplifying nested parens. It will get an element's style, ie. 10px, and return just the 10 as an integer:
var getAtInt = function getAtInt(obj, attrib) {
  return parseInt(obj.style[attrib], 10);
};

function movePage(proposedNewPosY) {
  if (proposedNewPosY <= track.viewpointTop) {
    proposedNewPosY = track.viewpointTop
  } else if (proposedNewPosY >= track.viewpointBottom){
    proposedNewPosY = track.viewpointBottom
  } 
  track.lastMousePosY = proposedNewPosY;
  // hook in target of slider action here: i.e. what the slider is sliding i.e. scroll some other div
  // for this example we will compute the slider's percentage and update the grey box:
  track.percentage = (proposedNewPosY-track.viewpointTop) / (parseInt(track.style.height));
  console.log("track percentage: "+track.percentage)
  // percentage.textContent = track.percentage;  //.innerText will not work for Firefox
  updateContentBox(track.percentage)
}

function updateContentBox(percentage) {
  console.log("Updating Scroll Box")
  console.log(percentage)
  console.log(contentBox.scrollTop)
  contentBox.scrollTo(0,contentBox.scrollHeight * percentage)
}

function movePageDown() {
  pageHeight = boxHeight
  movePage(Math.min(track.lastMousePosY + pageHeight, track.viewpointBottom))
}

function movePageUp() {
  pageHeight = boxHeight
  movePage(Math.max(track.lastMousePosY - pageHeight, track.viewpointTop))
}

function movePageToSpot(pageY) {
  track.percentage = pageY / (parseInt(track.style.height) + track.viewpointTop)
  console.log("track percentage: "+track.percentage)
  // percentage.textContent = track.percentage;  //.innerText will not work for Firefox
  updateContentBox(track.percentage)
}

