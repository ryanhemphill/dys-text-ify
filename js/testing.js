// testing.js
var textTarget;

$(document).ready(function() {
  // textTarget = $('#wrapper p').dystextify({ focus: true, depth: 'words', blackout: true });
  // textTarget = $('#wrapper p').dystextify({ focus: true, depth: 'lines' });
  applyA11ySettingsMenuBehaviors();
  applyA11yAttributes();

  setupA11ySettingFunctions();

});


function setupA11ySettingFunctions() {

  // font-family
  var fontFamily_radioButtons = $('[name="font-family"]');
  fontFamily_radioButtons.on('click', function() {
    var thisButton = $(this);
    var sampleArea = $('#a11y-sample-area p');
    if(thisButton.attr('id') == 'font-family-off') {
      fontFamilyThis(sampleArea);
    }
    else if(thisButton.attr('id') == 'font-family-dyslexie') {
      fontFamilyThis(sampleArea, 'dyslexie');
    }
    else if(thisButton.attr('id') == 'font-family-opendyslexic') {
      fontFamilyThis(sampleArea, 'opendyslexic');
    }
    else if(thisButton.attr('id') == 'font-family-lexiereadable') {
      fontFamilyThis(sampleArea, 'lexiereadable');
    }
  });

  // tinting
  var tinting_radioButtons = $('[name="font-color"]');
  tinting_radioButtons.on('click', function() {
    var thisButton = $(this);
    var sampleArea = $('#a11y-sample-area p').parent();
    if(thisButton.attr('id') == 'font-color-off') {
      tintThis(sampleArea);
    }
    else if(thisButton.attr('id') == 'font-color-tan') {
      tintThis(sampleArea, 'tan');
    }
    else if(thisButton.attr('id') == 'font-color-rose') {
      tintThis(sampleArea, 'rose');
    }
    else if(thisButton.attr('id') == 'font-color-blue') {
      tintThis(sampleArea, 'blue');
    }
    else if(thisButton.attr('id') == 'font-color-green') {
      tintThis(sampleArea, 'green');
    }
    else if(thisButton.attr('id') == 'font-color-gray') {
      tintThis(sampleArea, 'gray');
    }
  });

  // line-style
  var lineStyle_radioButtons = $('[name="line-style"]');
  lineStyle_radioButtons.on('click', function() {
    var thisButton = $(this);
    var sampleArea = $('#a11y-sample-area p');
    if(thisButton.attr('id') == 'line-style-off') {
      lineStyleThis(sampleArea);
    }
    else if(thisButton.attr('id') == 'line-style-gradient') {
      lineStyleThis(sampleArea, 'gradient');
    }
    else if(thisButton.attr('id') == 'line-style-multicolor') {
      lineStyleThis(sampleArea, 'multicolor');
    }
  });


  var focusControl_radioButtons = $('[name="focus"]');
  focusControl_radioButtons.on('click', function() {
    var thisButton = $(this);
    var sampleArea = $('#a11y-sample-area p');

    if(thisButton.attr('id') == 'focus-off') {
      focusThis(sampleArea, false);
      sampleArea.removeClass('dys-focus');
    }
    if(thisButton.attr('id') == 'focus-1-line') {
      focusThis(sampleArea, { type: 'lines', size: 1 });
    }
    if(thisButton.attr('id') == 'focus-3-lines') {
      focusThis(sampleArea, { type: 'lines', size: 3 });
    }
    if(thisButton.attr('id') == 'focus-1-sentence') {
      focusThis(sampleArea, { type: 'sentences', size: 1 });
    }
    if(thisButton.attr('id') == 'focus-3-sentences') {
      focusThis(sampleArea, { type: 'sentences', size: 3 });
    }
  });
}
