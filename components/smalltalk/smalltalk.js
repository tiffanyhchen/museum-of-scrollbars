//before we even start fix the annoying select-cursor bug in Chrome:
document.onselectstart = function (e) { e.preventDefault(); return false; };

//create handles for elements that were instantiated in the HTML markup:
var slider = document.getElementById('slider');
var track = document.getElementById('track');
var leftTrack = document.getElementsByClassName('smalltalkSideTrack')[0];
var rightTrack = document.getElementsByClassName('smalltalkSideTrack')[1];
console.log(leftTrack)
console.log(rightTrack)
var percentage = document.getElementById('percentage');
var contentBox = document.getElementsByClassName('contentBox')[0];
var boxHeight = 20;

//initial states variables, append to their elements:
document.mouseState = 'up';
slider.mouseState = 'up';
slider.viewpointTop = track.getBoundingClientRect().top;
slider.viewpointBottom = track.getBoundingClientRect().bottom
slider.lastMousePosY = slider.viewpointTop;
slider.proposedNewPosY = 0;
slider.percentage = 0;

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

//Slider mouse event functions:
slider.onmousedown = function (e) {
  slider.lastMousePosY = e.pageY;  //<-this is so that if you lift the mouse, move it and grab the slider again, it will not jump.
  slider.mouseState = 'down';
  document.mouseState = 'down';
};

slider.onmouseup = function (e) {
  slider.mouseState = 'up';
  document.mouseState = 'up';
};

slider.onclick = function(e) {
  slider.clicked = true 
}

// Side track event functions
leftTrack.onclick = function(e) {
  console.log("clicked left track")
  movePageUp();
}

rightTrack.onclick = function(e) {
  console.log("clicked right track")
  movePageDown();
}

//Helper function. Not strictly required, but will make the logic down the bottom
//easier to follow by simplifying nested parens. It will get an element's style, ie. 10px, and return just the 10 as an integer:
var getAtInt = function getAtInt(obj, attrib) {
  return parseInt(obj.style[attrib], 10);
};

function moveSlider(proposedNewPosY) {
  if (proposedNewPosY < slider.viewpointTop) {
    // console.log("put slider at top")
    slider.style.marginTop = '0px';
    proposedNewPosY = slider.viewpointTop
  } else if (proposedNewPosY > slider.viewpointBottom - getAtInt(slider,'height')){
    // console.log("put slider at bottom")
    slider.style.marginTop = getAtInt(track,'height') - getAtInt(slider,'height')
    proposedNewPosY = slider.viewpointBottom
  } else if (proposedNewPosY < slider.lastMousePosY) {
    // console.log("move slider up")
    // slider.style.marginTop = getAtInt(track, 'height') - getAtInt(slider, 'height') - 50 + 'px';
    slider.style.marginTop = proposedNewPosY - slider.viewpointTop + 'px';
  } else {
    // console.log("move slider down")
    slider.style.marginTop = proposedNewPosY - slider.viewpointTop + 'px';
  }
  // console.log("slider margin: "+slider.style.marginTop)

  slider.lastMousePosY = proposedNewPosY;
  // hook in target of slider action here: i.e. what the slider is sliding i.e. scroll some other div
  // for this example we will compute the slider's percentage and update the grey box:
  slider.percentage = ((parseInt(slider.style.marginTop, 10)) / (parseInt(track.style.height, 10) - parseInt(slider.style.height, 10)));

  // percentage.textContent = slider.percentage;  //.innerText will not work for Firefox
  updateContentBox(slider.percentage)
}

function updateContentBox(percentage) {
  console.log("Updating Scroll Box")
  //contentBox.scrollTop = contentBox.scrollHeight * percentage
  console.log(percentage)
  console.log(contentBox.scrollTop)
  contentBox.scrollTo(0,contentBox.scrollHeight * percentage)
}

document.onmousemove = function (e) {

  //Slider logic block. Any mouse movement on the document fires this handler.
  //The outermost if-statement checks to see if this (or potentially any other) slider
  //is being dragged. This is done by examining the state variables as set
  //above.

  //The first two of the inner if-comparisons check to make sure we only
  //drag the slider within the bounds of the track. If these conditions are 
  //met, the top of the slider to the newly proposed Y coordinate. This is
  //done by adding the vertical delta of the cursor location from the previous
  //loop through here. Then storing the current mouse Y coordinate for next time
  //here.
  if ((document.mouseState === 'down') && (slider.mouseState === 'down')) {
    console.log("dragging slider")
    slider.proposedNewPosY = e.pageY;
    moveSlider(slider.proposedNewPosY)
  }

  // place other slider logic block(s) here for more sliders on the page or for some other moving element:
  //if ((document.mouseState === 'down') && (someOtherSlider.mouseState === 'down')) {   .......
};

function movePageDown() {
  pageHeight = boxHeight
  moveSlider(Math.min(slider.lastMousePosY + pageHeight, slider.viewpointBottom - getAtInt(slider,'height')))
}

function movePageUp() {
  pageHeight = boxHeight
  moveSlider(Math.max(slider.lastMousePosY - pageHeight, slider.viewpointTop))
}

