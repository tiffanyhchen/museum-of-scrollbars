//before we even start fix the annoying select-cursor bug in Chrome:
document.onselectstart = function (e) { e.preventDefault(); return false; };

//create handles for elements that were instantiated in the HTML markup:
var slider = document.getElementById('slider');
var track = document.getElementById('track');
var percentage = document.getElementById('percentage');
var upBtn = document.getElementById('upBtn');
var downBtn = document.getElementById('downBtn');
var upPageBtn = document.getElementById('upPageBtn')
var downPageBtn = document.getElementById('downPageBtn')
var contentBox = document.getElementsByClassName('contentBox')[0];
var boxHeight = 90;

//initial states variables, append to their elements:
document.mouseState = 'up';
slider.mouseState = 'up';
slider.viewpointTop = track.getBoundingClientRect().top;
slider.viewpointBottom = track.getBoundingClientRect().bottom
slider.lastMousePosY = slider.viewpointTop;
console.log(slider.lastMousePosY)
console.log(contentBox.scrollHeight)
slider.proposedNewPosY = 0;
slider.percentage = 0;

track.viewpointTop = track.getBoundingClientRect().top;
track.viewpointBottom = track.getBoundingClientRect().bottom;
track.percentage = 0;
track.lastMousePosY = track.viewpointTop;

//We will need to access the top and height properties of the slider and track.
//Set them here initally rather than in CSS so that we can access them without getComputedStyle calls:
slider.style.margintop = '0px';
slider.style.height = '50px';
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
  slider.mouseState = 'up';
};

// Button mouse event functions
upBtn.onclick = function(e) {
  console.log("up button clicked")
  pageHeight = 20
  moveSlider(Math.max(slider.lastMousePosY - pageHeight, slider.viewpointTop))}

downBtn.onclick = function(e) {
  console.log("down button clicked")
  pageHeight = 20
  moveSlider(Math.min(slider.lastMousePosY + pageHeight, slider.viewpointBottom - getAtInt(slider,'height')))
}

// upBtn.onmousedown = function(e) {
//   document.getElementsByClassName('macintoshArrow')[0].src = "../../assets/arrowUpFilled.png"
// }

// upBtn.onmouseup = function(e) {
//   document.getElementsByClassName('macintoshArrow')[0].src = "../../assets/arrowUp.png"
// }

// downBtn.onmousedown = function(e) {
//   document.getElementsByClassName('macintoshArrow')[1].src = "../../assets/arrowDownFilled.png"
// }

// downBtn.onmouseup = function(e) {
//   document.getElementsByClassName('macintoshArrow')[1].src = "../../assets/arrowDown.png"
// }

upPageBtn.onclick = function(e) {
  console.log("up page button pressed")
  movePageUp(); 
}

downPageBtn.onclick = function(e) {
  movePageDown();
}

upPageBtn.onmousedown = function() {
  upPageBtn.style.filter = "invert(1)"
}

upPageBtn.onmouseup = function() {
  upPageBtn.style.filter = "invert(0)"
}

downPageBtn.onmousedown = function() {
  downPageBtn.style.filter = "invert(1)"
}

downPageBtn.onmouseup = function() {
  downPageBtn.style.filter = "invert(0)"
}

upBtn.onmousedown = function() {
  upBtn.style.filter = "invert(1)"
}

upBtn.onmouseup = function() {
  upBtn.style.filter = "invert(0)"
}

downBtn.onmousedown = function() {
  downBtn.style.filter = "invert(1)"
}

downBtn.onmouseup = function() {
  downBtn.style.filter = "invert(0)"
}

//Helper function. Not strictly required, but will make the logic down the bottom
//easier to follow by simplifying nested parens. It will get an element's style, ie. 10px, and return just the 10 as an integer:
var getAtInt = function getAtInt(obj, attrib) {
  return parseInt(obj.style[attrib], 10);
};

function moveSlider(proposedNewPosY) {
  if (proposedNewPosY < slider.viewpointTop) {
    console.log("put slider at top")
    slider.style.marginTop = '0px';
    proposedNewPosY = slider.viewpointTop
  } else if (proposedNewPosY > slider.viewpointBottom - getAtInt(slider,'height')){
    console.log("put slider at bottom")
    slider.style.marginTop = getAtInt(track,'height') - getAtInt(slider,'height')
    proposedNewPosY = slider.viewpointBottom
  } else if (proposedNewPosY < slider.lastMousePosY) {
    console.log("move slider up")
    // slider.style.marginTop = getAtInt(track, 'height') - getAtInt(slider, 'height') - 50 + 'px';
    slider.style.marginTop = proposedNewPosY - slider.viewpointTop + 'px';
  } else {
    console.log("move slider down")
    slider.style.marginTop = proposedNewPosY - slider.viewpointTop + 'px';
  }

  slider.lastMousePosY = proposedNewPosY;
  // hook in target of slider action here: i.e. what the slider is sliding i.e. scroll some other div
  // for this example we will compute the slider's percentage and update the grey box:
  slider.percentage = ((parseInt(slider.style.marginTop, 10)) / (parseInt(track.style.height, 10) - parseInt(slider.style.height, 10)));

  percentage.textContent = slider.percentage;  //.innerText will not work for Firefox
  updateContentBox(slider.percentage)
}

function updateContentBox(percentage) {
  console.log("Updating Scroll Box")
  //contentBox.scrollTop = contentBox.scrollHeight * percentage
  console.log(percentage)
  console.log(contentBox.scrollTop)
  contentBox.scrollTo(0,contentBox.scrollHeight * percentage)
}

// Track mouse event functions:
track.onclick = function (e) {
  movePageToSpot(e.pageY)
}

track.onmouseenter = function(e) {
  slider.style.display = "inline";
}

track.onmouseleave = function(e) {
  slider.style.display = "none";
}

function movePagefull(e) {
  console.log(slider.lastMousePosY)
  console.log(e.pageY)
  if (e.pageY > slider.lastMousePosY) {
    movePageDown()
  } else {
    movePageUp()
  }
}

function movePageDown() {
  pageHeight = boxHeight
  moveSlider(Math.min(slider.lastMousePosY + pageHeight, slider.viewpointBottom - getAtInt(slider,'height')))
}

function movePageUp() {
  pageHeight = boxHeight
  moveSlider(Math.max(slider.lastMousePosY - pageHeight, slider.viewpointTop))
}

function movePageToSpot(pageY) {
  track.percentage = pageY / (parseInt(track.style.height) + track.viewpointTop)
  console.log("track percentage: "+track.percentage)
  console.log("newposy: "+getAtInt(track, 'height') * track.percentage)
  percentage.textContent = track.percentage;  //.innerText will not work for Firefox
  newY = track.percentage * (parseInt(track.style.height, 10) - parseInt(slider.style.height, 10)) + slider.viewpointTop
  console.log("new y: "+newY)
  moveSlider(newY)
  // updateContentBox(track.percentage)
  // console.log(slider.lastMousePosY)
  // console.log(contentBox.scrollHeight)
  // slider.style.marginTop = (track.viewpointTop * track.percentage)+ 'px';
}

