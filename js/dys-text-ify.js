// dys-text-ify.js

function applyA11yAttributes() {
  var settingOpenButton = $('.a11y-setting-title:not(.locked-open)');
  var settingContainer = $('.a11y-setting-container:not(.locked-open)');

  settingOpenButton
    .attr('aria-expanded', 'false')
    .attr('aria-haspopup', 'true');
  settingContainer
    .attr('aria-hidden', 'true');
}

// START style applications


function lineStyleThis(targetContent, styleName) {
  if(!isJquery(targetContent))  { targetContent = $(targetContent); }
  if(!styleName && styleName !== false) { styleName = 'off'; }
    // if(targetContent.data(''))
  removeLineStyles();
  if(targetContent.hasClass('split-text')) {
    targetContent.undoSplitBy();
    targetContent
      .removeClass('split-text')
      .removeClass('split-lines')
      .removeClass('split-words');

  }
  if(styleName === 'off') {
    targetContent.parent().removeClass('dys-focus');
  } 
  else if(styleName == 'gradient') {
    targetContent.dystextify({ type:'lines'});
    targetContent
      .addClass('dys')
      .addClass('dys--line-gradient');
  } 
  else if(styleName == 'multicolor') { // function needs work
    targetContent.dystextify({ type: 'letters'});
    // [ TASK : create multicolor letters ]
  }
  
  function removeLineStyles() {
    targetContent.removeClass('dys--line-gradient')
  }
}

function fontFamilyThis(target, fontName) {
  if(!isJquery(target)) { target = $(target); }
  if(!fontName) { fontName = false; }


  // var targetText = new SplitText(target, { type: 'lines'});
  // targetText.isSplit = true;
  // targetText.revert();
  // if(target.data('dys') && target.data('dys').linesSplitText) {
  //   target.data('dys').linesSplitText.revert();
  // }

  if(target.hasClass('split-text')) {
    target.undoSplitBy();
  }
  removeFontFamily(); 
  if(fontName !== false) {
    if(fontName == 'dyslexie') {
      target.addClass('font-family--dyslexie');
    } else if(fontName == 'opendyslexic') {
      target.addClass('font-family--opendyslexic')
    } else if(fontName == 'lexiereadable') {
      target.addClass('font-family--lexiereadable')
    }
  }

  if(target.hasClass('split-lines')) {
    setTimeout(function() {
      target.splitText({ type: 'lines' });
    }, 1)
    
    // target.splitText({ type: 'lines' });
  } else if(target.hasClass('split-sentences')) {
    // target.splitBy('sentences');
  }
  // if(target.data('dys')) {
  //   if(target.data('dys').lettersSplitText.split('letters')) {
  //     target
  //       .data('dys').lettersSplitText.split('letters')
  //       .find('div')
  //         .addClass('letter');
  //   }
  //   if(target.data('dys').wordsSplitText.split('words')) {
  //     target
  //       .data('dys').lettersSplitText.split('words')
  //       .find('div:not(.letter)')
  //         .addClass('word');
  //   }
  //   if(target.data('dys').linesSplitText.split('words')) {
  //     target
  //       .data('dys').linesSplitText.split('lines')
  //       .find('div:not(.letter):not(.word)')
  //         .addClass('line');
  //   }
  //   // target.dystextify({ type: 'lines' });
  // }

  function removeFontFamily() {
    target
      .removeClass('font-family--opendyslexic')
      .removeClass('font-family--dyslexie')
      .removeClass('font-family--lexiereadable');
  }
}

function tintThis(target, color) {
  if(!isJquery(target)) { target = $(target); }
  if(!color) { color = false; }
  if(!Array.isArray(color)) { // is a preset
    removeTint(); // automatic requirement for color=='off'
    if     (color == 'tan')   { target.addClass('tint').addClass('tint--tan'); }
    else if(color == 'rose')  { target.addClass('tint').addClass('tint--rose'); }
    else if(color == 'blue')  { target.addClass('tint').addClass('tint--blue'); }
    else if(color == 'green') { target.addClass('tint').addClass('tint--green'); }
    else if(color == 'gray')  { target.addClass('tint').addClass('tint--gray'); }
  } else { // defined with rgb/rgba color (later)
    removeTint();
    target
      .addClass('tint')
      .addClass('tint--custom');
    // insert custom tint to target via styles
  }

  function removeTint() {
    target
      .removeClass('tint')
      .removeClass('tint--tan')
      .removeClass('tint--rose')
      .removeClass('tint--blue')
      .removeClass('tint--green')
      .removeClass('tint--gray')
      .removeClass('tint--custom');
  }
}


function focusThis(target, options) {

  if(target.hasClass('split-text')) { target.undoSplitBy(); }
  if(options !== false) {
    if(!options) {
      options = {};
      options['type'] = 'lines';
      options['size'] = 3;
    }
  } else { /* do nothing */ }
  
  removeFocusClasses();

  target.addClass('dys-focus');
  target.addClass('flagged');
  target
    .attr('data-focus-size', options.size)
    .attr('data-focus-type', options.type);
  // target.each(function() {
  //   $(this).attr('data-focus-size', options.size);
  //   $(this).attr('data-focus-type', options.type);
  // });

  
  applyFocusBehaviors(target, false);
  if(options.type == 'lines') {
    target.dystextify({ type: 'lines' });
    setTimeout(function() {
      target.find('.line').each(function(index) {
        if(index < options.size) { $(this).addClass('active'); } 
        else { return false; }
      });
    }, 5);
    applyFocusBehaviors(target);
  }

  if(options.type == 'sentences') {
    target.dystextify({ type: 'sentences' });
    setTimeout(function() {
      target.find('.sentence').each(function(index) {
        if(index < options.size) { $(this).addClass('active') } 
        else { return false; }
      });
    }, 5);
    applyFocusBehaviors(target);
  }

  function applyFocusBehaviors(target, options) {
    

    // key behaviors...
    var docListener = $(window);
    docListener
        .unbind('keyup')
        .unbind('keydown')
        .unbind('keypress');
    if(options === false) {
      // do nothing
    } else {
      
      docListener.bind('keydown', function(event) {
        if(event.keyCode == 37)       { moveFocus('left'); } 
        else if(event.keyCode == 39)  { moveFocus('right'); }
        function moveFocus(direction) {
          var currentActive = target.find('.line.active,.sentence.active');
          var allPossibleElements = target.find('.line,.sentence');
          if(direction == 'left') {
            var firstCurrentActive = currentActive.first();
            var firstIndexInTarget = allPossibleElements.index(firstCurrentActive);
            if(firstIndexInTarget != 0) {
              allPossibleElements.eq(firstIndexInTarget-1).addClass('active');
              currentActive.last().removeClass('active');
            } // else do nothing, you are at the beginning
          }
          else if(direction == 'right') {
            var lastCurrentActive = currentActive.last();
            var lastIndexInTarget = allPossibleElements.index(lastCurrentActive);
            if(lastIndexInTarget != allPossibleElements.length -1) {
              allPossibleElements.eq(lastIndexInTarget+1).addClass('active');
              currentActive.first().removeClass('active');
            } // else do nothing, you are at the beginning
          }
        }
      });
    }

    // mouse behaviors
    var allPossibleTargets, focusType;
    if(options !== false) { focusType = target.first().attr('data-focus-type');
    } else                { focusType = 'off'; }
    
    if(focusType      == 'lines')      { allPossibleTargets = target.find('.line'); } 
    else if(focusType == 'sentences')  { allPossibleTargets = target.find('.sentence'); }
    if(focusType !== false && focusType != 'off') {
      allPossibleTargets.bind('mouseenter', function() {
        var thisElement = $(this);
        var thisContainer = thisElement.parents('.dys');
        var activeElements = allPossibleTargets.filter('.active');
        var lastActiveElement = activeElements.last();

        var activeElements_length = Number(thisContainer.attr('data-focus-size'));
          
        if(thisElement != lastActiveElement) {
          var indexofThisElement = allPossibleTargets.index(thisElement);
          if(indexofThisElement+1-activeElements_length > 0) {
            allPossibleTargets.removeClass('active');
            for(var x=0; x < activeElements_length; x++) {
              var thisTarget = allPossibleTargets.eq(indexofThisElement-x);
              thisTarget.addClass('active');
            }
          } else {
            allPossibleTargets
              .removeClass('active')
              .each(function(index) {
                if(index < activeElements_length) {
                  $(this).addClass('active');
                } else { return false; }
              })

          }
        }
      });
    }
    



    

    
  }

  // tools
  function removeFocusClasses() {
    target
      .removeClass('dys-focus')
      .removeAttr('data-focus-type')
      .removeAttr('data-focus-size')
      .find('.line')
        .removeClass('active')
        .find('.word')
          .removeClass('active')
          .find('.letter')
            .removeClass('active');
  }



  
}

// END style applications

function applyA11ySettingsMenuBehaviors() {
  var parentContainer = $('#a11y-settings');
  var settingOpenButton = $('.a11y-setting-title:not(.locked-open)'),
      settingContainer  = $('.a11y-setting-container');
  settingOpenButton
    .on('click', function() {
      var thisButton = $(this);
      var thisContainer = thisButton.toggleClass('active').next();
      if(thisContainer.hasClass('a11y-settings-column')) {
        thisContainer = thisContainer.find('.a11y-setting-container');
      }
      thisContainer.toggleClass('active');
      // var thisContainer = thisButton.toggleClass('active').nextUntil(':not(.a11y-setting-container)').first().toggleClass('active');
      
      if(thisContainer.hasClass('active')) {
        thisButton.attr('aria-expanded', 'true');
        thisContainer.attr('aria-hidden', 'false');
        TweenLite.to(thisContainer, 0.35, {
          css: {
            'height': thisContainer.attr('data-height-open') + 'px'
            // 'height': '300px'
          },
          ease: Strong.easeInOut,
          onComplete: setHeightAuto,
          onCompleteParams: [ thisContainer, true ]
        });
        TweenLite.to(thisContainer.children(), 0.25, {
          css: {
            'opacity': '1'
            // 'height': '300px'
          },
          delay: 0.35,
          onComplete: setHeightAuto,
          onCompleteParams: [ thisContainer, true ]
        });
      } else {
        thisButton.attr('aria-expanded', 'false');
        thisContainer.attr('aria-hidden', 'true');
        setHeightAuto(thisContainer, false);
        TweenLite.to(thisContainer, 0.5, {
          css: {
            // 'height': thisContainer.attr('data-height-collapsed') + 'px'
            'height': '22px'
            // 'height': '10px'
          },
          ease: Strong.easeInOut,
          delay: 0.1
        });
        TweenLite.to(thisContainer.children(), 0.1, {
          css: {
            'opacity': '0'
            // 'height': '300px'
          }
        });
      }
      // self.next('.a11y-settings-container').toggleClass('active');
      
    });

  setDataHeight(settingContainer);
}

function setDataHeight(target) {
  if(!isJquery(target)) { target = $(target); }
  target.each(function() {
    var self = $(this);
    if(!self.hasClass('locked-open')) {
      self.addClass('active');
      self.addClass('open');
      self.attr('data-height-open', self.height() + 10);
      self.removeClass('active');
      self.removeClass('open');
      self.attr('data-height-collapsed', self.height());
    }
    
  }); 
} 

function setHeightAuto(target, state) {
  if(!isJquery(target)) { target = $(target); }
  if(state !== false) { state = true; }
  if(state == true) {
    target.addClass('open');
  } else {
    target.removeClass('open');
  } 
}

function buildA11ySettingsMenu(target) {
  if(!isJquery(target)) { target = $(target); }
  var settingsContainer = $('<div id="a11y-settings-container"></div>'),
      settingToggleBtn = $('<button id="a11y-menu-toggle-button" tabindex="0"><span class="icon-bgcolor"></span><span class="dys-icon access-icon"></span><span class="toggle-title">Access<span class="toggle-caret caret-down"></span></span></button>'),
      settingsWrapper = $('<div id="a11y-settings"></div>');
}

$.fn.dystextify = function(options) {
  if(!options) { options = { depth: 'lines', focus: false, blackout: false }; } // if necessary, convert to Object
  if(options == 'revert') { console.log('apply revert for SplitText')}
  if(options.focus !== true) { options.focus = false; }

  var dysObj = this;
  var dys = {};

  var dysTarget = $(this);
  // dysObj.data('dys', {});
  dys.depth = options.type;
  dys.focus = options.focus;
  dys.originalContent = dysObj.clone();
  dysObj.addClass('dys');
  if(options.blackout == true) {
    dys.blackout = true;
    dysObj.addClass('dys-blackout');
  }
  if(dys.focus == true) { dysObj.addClass('dys-focus'); }
  if(dys.depth == 'sentences') {
    dysTarget.splitText({ type: 'sentences' });
  }
  if(dys.depth == 'lines') {
    // dys.linesSplitText = new SplitText(dysObj, {type:"lines"});
    dysTarget.splitText({ type: 'lines' });
    // dys.lines = dysObj.find('div').addClass('line');
    if(dys.focus === true) { 
      if(dys.depth == 'lines') { 
        dys.lines.attr('tabindex', '0'); 
      }
      dys.lines.first().addClass('active');
    } 
  } if(dys.depth == 'words') { // || dys.depth == 'letters') {
    // dys.wordsSplitText = new SplitText(dysObj, {type: "words"});
    // dys.words = dysObj.find('div:not(.line)').addClass('word');
    dysTarget.splitText('words');
    if(dys.focus === true ) {
      if(dys.depth == 'words') { 
        dys.words.attr('tabindex', '0');
      } 
      dys.words.first().focus();
    }
  } if(dys.depth == 'letters') {
    dys.lettersObj = new SplitText(dysObj, {type: "letters"});
    dys.letters = dysObj.find('div:not(.line)').addClass('letter');
  }

  if(dys.focus === true) {
    if(dys.depth == 'lines') {
      dys.lines.on('keydown', function(event) {
        var thisLine = $(this),
            thisLine_index = dys.lines.index(thisLine);

        if((event.keyCode == 37 || event.keyCode == 38) && thisLine_index > 0) { // left || up
          var prevLine = dys.lines.eq(thisLine_index-1);
          prevLine.trigger('focus');
        } else if((event.keyCode == 39 || event.keyCode == 40) && thisLine_index < dys.lines.length ) { // right || down
          var nextLine = dys.lines.eq(thisLine_index+1);
          nextLine.trigger('focus');
        }
      });  
    }
    if(dys.depth == 'lines') {
      dys.lines.on('keyup', function(event) {
        var thisLine = $(this),
            thisLine_index = dys.lines.eq(thisLine);
        if((event.keyCode == 37 || event.keyCode == 38) && thisLine_index > 0) {
          var prevLine = dys.lines.eq(thisLine_index-1);
          prevLine.trigger('focus');
        } else if((event.keyCode == 39 || event.keyCode == 40) && thisLine_index < dysObj.data('dys').lines.length) {
          var nextLine = dys.lines.eq(thisLine_index+1);
          nextLine.trigger('focus');
        }
      })
      .on('focus', function() {
        var thisLine = $(this);
        dys.lines.not(thisLine).removeClass('active');
        thisLine.addClass('active');
      })
      .on('mouseover', function() {
        var thisLine = $(this);
        thisLine.trigger('focus');
      });
    }
    if(dys.depth == 'words') {
      dys.words
        .on('keydown', function(event) {
          var thisWord = $(this);
          
          if(     event.keyCode == 37) { // left
            var thisWord_index = dys.words.index(thisWord);
            if(thisWord_index > 0 && thisWord_index != -1) {
              var prevWord = dys.words.eq(thisWord_index-1);
              prevWord.trigger('focus');
            } 
          } 
          
          else if(event.keyCode == 38) { // up
            var thisLine = thisWord.parents('.line'),
                thisLine_index = dys.lines.index(thisLine),
                wordIndexOfThisLine = thisLine.find('.word').index(thisWord);
            if(thisLine_index > 0) {
              var prevWord = dys.lines.eq(thisLine_index-1).find('.word').eq(wordIndexOfThisLine);
              if(prevWord.length) { prevWord.trigger('focus'); } 
              else { 
                var prevLine = dys.lines.eq(thisLine_index-1);
                prevWord = prevLine.find('.word').last();
                prevWord.trigger('focus');
              }
              // prevWord.trigger('focus');
            }
          } 
          
          else if(event.keyCode == 39) { // right
            var thisWord_index = dys.words.index(thisWord);
            if(thisWord_index < dys.words.length && thisWord != -1) {
              var nextWord = dys.words.eq(thisWord_index+1);
              nextWord.trigger('focus');
            } 
          }

          else if(event.keyCode == 40) { // down
            var thisLine = thisWord.parents('.line'),
                thisLine_index = dys.lines.index(thisLine),
                wordIndexOfThisLine = thisLine.find('.word').index(thisWord);
            if(thisLine_index < dys.lines.length-1) {
              var nextWord = dys.lines.eq(thisLine_index+1).find('.word').eq(wordIndexOfThisLine);
              if(nextWord.length) { nextWord.trigger('focus'); } 
              else { 
                var nextLine = dys.lines.eq(thisLine_index+1);
                nextWord = nextLine.find('.word').last();
                nextWord.trigger('focus');
              }
              
            }
          }

        })
        .on('focus', function() {
          var thisWord = $(this);
          var thisLine = thisWord.parents('.line').addClass('active');
          dys.lines.not(thisLine).removeClass('active');
        })
        .on('mouseover', function() { $(this).trigger('focus') });  
    }
  }


  // var dys = {};
  // var dysData = {};
  // var dysFunc = {};

  // dysObj.dys = dys;
  // dysObj.dys.data = dysData;
  dysObj.data('dys', dys);
  return dysObj;
};  

// START Tools

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 
function isJquery(sourceData) { if(sourceData instanceof jQuery) { return true; } else { return false; } }
function isNull(thisVal)      { if(!!thisVal) { return true;} else { return false; } }
function executeFunctionByName(functionName, arguments, context) {
  var args;
  // format cleanup required, even if argument is Array, must be in another Array to get accepted
  if(arguments !== null && (typeof arguments === 'object' || typeof arguments === 'string' )) args = [ arguments ];

  var namespaces = functionName.split(".");
    var func = namespaces.pop();

    if(!context) context = window;
    else { for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
  }}
    return context[func].apply(context, args);
}

// END Tools