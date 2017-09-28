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
      lineStyleThis(sampleArea, 'off');
      // activate sentence radio-buttons in focus settings
      $('#focus-1-sentence').removeAttr('disabled');
      $('#focus-3-sentences').removeAttr('disabled');
    }
    else if(thisButton.attr('id') == 'line-style-gradient') {
      lineStyleThis(sampleArea, 'gradient');
      // DE-activate sentence radio-buttons in focus settings
      $('#focus-1-sentence').attr('disabled', '');
      $('#focus-3-sentences').attr('disabled', '');
    }
    else if(thisButton.attr('id') == 'line-style-multicolor') {
      lineStyleThis(sampleArea, 'multicolor');
      // DE-activate sentence radio-buttons in focus settings
      $('#focus-1-sentence').attr('disabled', '');
      $('#focus-3-sentences').attr('disabled', '');
    }
  });

  var focusToggleButton = $('#focus-toggle-button');
  focusToggleButton.on('click', function() {
    var self = $(this), 
        selfToggleState = self.attr('aria-pressed'),
        targetSample = $('.dys'),
        targetNum = targetSample.attr('data-focus-size');
    if(selfToggleState == 'false') {
      targetSample
        .addClass('dys-focus')
        .find('.active').removeClass('active');
      targetSample
        .find('.line,.sentence')
          .each(function(index) {
            if(index < targetNum) {
              $(this).addClass('active');
            } else { return false; }
          });
      self
        .text('Disable Focus Mode')
        .attr('aria-pressed', 'true');
    } 
    else if(selfToggleState == 'true') {
      targetSample
        .removeClass('dys-focus')
        .find('.active').removeClass('active');
      self
        .text('Apply Focus Mode')
        .attr('aria-pressed', 'false');
    }
  });

  var focusControl_radioButtons = $('[name="focus"]');
  focusControl_radioButtons.on('click', function() {
    var thisButton = $(this);
    var sampleArea = $('#a11y-sample-area p');

    if(thisButton.attr('id') == 'focus-off') {
      focusThis(sampleArea, false);
      sampleArea.removeClass('dys-focus');
      $('#line-style-gradient').removeAttr('disabled');
      focusToggleButton.attr('aria-hidden', 'true');
    } else {
      focusToggleButton.attr('aria-hidden', 'false');
    }
    if(thisButton.attr('id') == 'focus-1-line') {
      focusThis(sampleArea, { type: 'lines', size: 1 });
      $('#line-style-gradient').removeAttr('disabled');
      $('#line-style-gradient').removeAttr('aria-disabled');
    }
    if(thisButton.attr('id') == 'focus-3-lines') {
      focusThis(sampleArea, { type: 'lines', size: 3 });
      $('#line-style-gradient').removeAttr('disabled');
    }
    if(thisButton.attr('id') == 'focus-1-sentence') {
      focusThis(sampleArea, { type: 'sentences', size: 1 });
      $('#line-style-gradient').attr('disabled', '');
    }
    if(thisButton.attr('id') == 'focus-3-sentences') {
      focusThis(sampleArea, { type: 'sentences', size: 3 });
      $('#line-style-gradient').attr('disabled', '');
    }
  });


}
