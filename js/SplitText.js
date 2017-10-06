// splitText.dys.js
// jQuery plugin provides ability to split text into divs with CSS to maintain
// proper display and position of text, also providing "undo" via jQuery .clone()
// of content, saved in object (can be disabled). 
// Based, in-part, on SplitText by netgfx at https://github.com/netgfx/SplitText
// NOTE : the original content is saved in .data for retrieval. Be careful using .empty() as this will erase jQuery data as well
// NOTE : this splitText is not designed for GSAP animation, hence the use of span tags
//        instead of div tags in most cases (div.line being the notable exception)
 
(function($) {
  $.fn.splitText = function(options) {
    
    var element = $(this);
    var dataObj = {}; 
    var opts = {
      'type': 'lines',
      'undo':  true, // means save 
      'dataName': 'splittext-source'
    };

    if(options == null || options == undefined || options == '' || (options.type !== 'words' && options.type !== 'lines' && options.type !== 'letters' && options.type !== 'sentences')){
      options = opts;
    }
    
    options.dataName = 'splittext-source';
    if(options.undo !== false || options.undo != 'false') {
      options.undo = true;
      dataObj.source = element.clone();
    }
      
    element.each(function(index) {
      var thisElement = $(this);
      var elementParentId = String(Math.round(Math.random()*1000+42));
      thisElement
        .attr('data-id', elementParentId )
        .addClass('split-text');
    });

    splitBy(element, options.type);

    function splitBy(sourceElement, splitType) {
      if(!sourceElement.data('splittext-source')) {
        sourceElement.data('splittext-source', element.clone());
      }
      sourceElement.each(function() {
        var thisElement = $(this);
        if(!thisElement.data('splittext-source')) {
          thisElement.data('splittext-source', thisElement.clone());
        }
      });

      if(splitType=='lines'){
        sourceElement.each(function(index) {
          var thisElement = $(this);
          thisElement
            .addClass('split-lines')
            .addClass('split-words')
            .removeClass('split-sentences');

          var thisText = thisElement.text();
          var result = splitWords(thisText, thisElement);
          thisElement.html(result);
          var obj = splitLines_alt(thisElement, true);
          $.each(obj,function(index,value){
            var thisValue = value;
            if(isJquery(value.text)) { value.text = value.text.html(); }
            var thisLine = $("<span class='line' data-yval='"+value.top+"''>"+value.text+"</span>");
            thisLine.appendTo(thisElement);
            thisLine.children(':not(.word)').children('.word');
            thisLine.children('span.white-space').replaceWith(' ');
          });
        });
      }
      else if(splitType=='words'){
        sourceElement.each(function(index) {
          var thisElement = $(this);
          thisElement
            .addClass('split-words');
          var thisText = thisElement.text();
          var result = $.parseHTML(String(splitWords(thisText, thisElement)));
          thisElement.children().detach();
          thisElement.html(result);
        });
      }
      else if(splitType=='letters'){
        sourceElement.each(function(index) {
          var thisElement = $(this);
          thisElement
            .addClass('split-words')
            .addClass('split-letters');
          var thisText = thisElement.text();
          var wordsResult = splitWords(thisText, thisElement);
          thisElement.children().detach();
          thisElement.html(wordsResult);
          var lettersResult = splitLetters(thisElement);
          thisElement.contents().remove();
          thisElement.children().detach();
          thisElement.html(lettersResult);
        });
      }
      else if(splitType == 'sentences'){
        sourceElement.each(function(index) {
          var thisElement = $(this);
          thisElement
            .removeClass('split-lines')
            .addClass('split-words')
            .addClass('split-sentences');
          var thisText = thisElement.text();
          var wordResult = splitWords(thisText, thisElement);
          thisElement.children().detach();
          thisElement.html(wordResult);
          var allSentences = splitSentences(thisText, thisElement);
          thisElement.children().detach();
          $.each(allSentences, function(index, value) {
            var thisSentence = $(value);
            if(isJquery(value)) { thisSentence = $(value.html()); }
            thisSentence.appendTo(thisElement);
            thisElement.find('.white-space').replaceWith(' ');
            cleanUpContent(sourceElement);
          });
        });
      }
    }
    
    

    // START FUNCTIONS /////////////
    function splitLetters(thisElement){
      var wordsResult = thisElement.find('.word');
      wordsResult.each(function(index) {
        var thisWord = $(this);
        var thisText = thisWord.text();
        thisWord.data('splittext-source', thisWord.clone());
        
        var lettersArr = thisText.split("");
        var lettersResult;
        for(var i=0; i<lettersArr.length;i++) {
          if(!lettersArr[i].match(/\s\n\t\r/g) && lettersArr[i]!="") {
            lettersArr[i] = '<span class="letter">' + lettersArr[i] + '</span>';
          }
        }
        lettersResult = $(lettersArr.join(''));
        thisWord.contents().remove();
        // thisWord.children().detach();
        lettersResult.appendTo(thisWord);
      });
      return wordsResult;
    }
    


    function splitWords(userInput, thisElement){
      // var a = userInput.replace(/\n/g, " \n<br/> ").split(" ");
      // var a = userInput.replace(/\n/g, " \n ").replace(/(?:\b)(\-)\b\b/g, '- ').split(" ");
      var allContent = thisElement.html();
      var filterAllButSplitDash = allContent.replace(/(\b|\B)\s+(\b|\B)|(?:\s*<\/?\w[^<>]*>\s*?)|([^<>\s]+)|[\s ]+/igm, "\^\^$&\^\^");
      var cleanedFilter = filterAllButSplitDash.replace(/(\^\^\^\^)+/igm, '^^').replace(/((\t+|\s+)?(\n|\t))/igm, '');
      var splitContent = cleanedFilter.split('^^');
      $.each(splitContent, function(i,val) {
        if(val!="" && !val.match(/<[^>]+>/igm)) { // && !val.match(/(\s)/igm)) { // if NOT empty && NOT tag && NOT ' '
          
          if(!val.match(/[-]/igm) && !val.match(/ /igm)) { // if doesn't have '-'...
            splitContent[i] = val.replace(/.+/igm, '<span class="word">$&</span>');
          } 
          else if(val.match(/[-]/igm) && !val.match(/ /igm)) { // if DOES have '-'... (NOTE : splits the word after the '-')
            splitContent[i] = val.replace(/(\b\w+\b([-])?)/igm, '<span class="word">$&</span>');
          }
          else { //if(val.match(/ /igm)) {
            // splitContent[i] = val.replace(/ /igm, '<span class="white-space"> </span>');
            splitContent[i] = '<span class="white-space"> </span>';
          }
        }
      });
      var finalContent = splitContent.join('');
      return finalContent;
    }
    
    function splitLines_alt(thisElement, option) {
      var childrenOfElement = thisElement.children();
      var elementHeight_Array = [];
      childrenOfElement.each(function(index) {
        var thisChildElement = $(this);
        elementHeight_Array[index] = thisChildElement.offset().top;
      });
      var thisLine = $('<span class="line current"></span>');
      childrenOfElement.eq(0).before(thisLine);
      childrenOfElement.eq(0).appendTo(thisLine);
      for(var x=1; x<elementHeight_Array.length-1; x++) {
        if(elementHeight_Array[x-1] !== elementHeight_Array[x]) {
          if(childrenOfElement.eq(x-1).hasClass('white-space') || childrenOfElement.eq(x-1).hasClass('word') || childrenOfElement.eq(x-1).children('.word').length < 2) {
            $('.line.current').removeClass('current');
            thisLine = thisLine.clone();
            thisLine = $('<span class="line current"></span>');
            childrenOfElement.eq(x).before(thisLine);
            childrenOfElement.eq(x).appendTo(thisLine);
          } else { // [x-1] is pre-existing tag with more than one word, may need to be split down into 2 tags across the two lines
            var originalTag = childrenOfElement.eq(x-1);
            var originalTag_children = originalTag.children();
            var cloneTag    = originalTag.clone().empty();
            if(cloneTag.attr('id')) { cloneTag.attr('id', 'clone-of-' + cloneTag.attr('id')); }
            var originalTagHeights_Array = [];
            originalTag_children.each(function(index) {
              originalTagHeights_Array[index] = originalTag_children.eq(index).offset().top;
            });
            for(var z=originalTagHeights_Array.length-1; z > 0; z--) {
              if(originalTagHeights_Array[z] !== elementHeight_Array[x-1]) { // if child is lower than parent element
                var thisChild = originalTag_children.eq(z).detach(); // remove child and...
                thisChild.prependTo(cloneTag); // put into cloneTag
              } else {
                
                break;
              }

            }
            if(cloneTag.children().length !== 0) {
              thisLine.removeClass('current');
              thisLine = thisLine.clone();
              thisLine = $('<span class="line current"></span>');
              childrenOfElement.eq(x).before(thisLine);
              cloneTag.appendTo(thisLine);
              childrenOfElement.eq(x).appendTo(thisLine);
            }
          }

        } 
        else { childrenOfElement.eq(x).appendTo(thisLine); }
      }
      $('.line.current').removeClass('.current');
      // $('span.white-space').replaceWith(' ');
      cleanUpContent(thisElement);
    }

    function splitLines_new(thisElement, option) {
      var childrenOfElement = thisElement.children();
      var thisLine;
      if(thisElement.children().last('.line').hasClass('incomplete')) {
        thisLine = thisElement.children().last('.line.incomplete');
        thisLine.removeClass('incomplete');
      } else { thisLine = $('<span class="line"></span>'); }
      var nextLine = $('<span class="line incomplete"></span>');
      var allLines;
      childrenOfElement.each(function(index) {
        var childrenOfElement_index = index;
        if(childrenOfElement_index === 0) {
          thisLine = thisLine.clone();
          thisLine.empty();
          thisLine.prependTo(thisElement);
          var thisTag = $(this).detach();
          thisTag.appendTo(thisLine); // BUG > assumes that first tag is not longer than entire line of content
        }
        else if(childrenOfElement_index !== 0) { // ignore the first index
          var thisTag = $(this),
              thisTag_posY = thisTag.offset().top,
              lastTag = childrenOfElement.eq(childrenOfElement_index-1),
              lastTag_posY = lastTag.offset().top;
          if(thisTag.hasClass('word') && thisTag_posY == lastTag_posY) {
            thisTag = thisTag.detach();
            if(!thisLine.children().last().hasClass('no-space')) {
              thisLine.children().last().after(' ');
            }
            thisTag.appendTo(thisLine);
          } 
          else if(!thisTag.hasClass('word') && thisTag_posY == lastTag_posY) { // it is an html tag from original text, and words are wrapped within
            var wordsWithinTag = thisTag.children('.word');
            var proposedTag = thisTag.clone();
            proposedTag.empty();
            var nextLineProposedTag = proposedTag.clone();
            wordsWithinTag.each(function(index) {
              var wordWithinTag_index = index;
              var thisWordWithinTag = $(this);
              var thisWordWithinTag_posY = thisWordWithinTag.offset().top;
              thisWordWithinTag = thisWordWithinTag.detach();
              if(thisWordWithinTag_posY == lastTag_posY) { // if [span.word] is on same line, add tag to [div.line]
                if(wordWithinTag_index == 0) { // if index=0, add proposedTag to thisLine
                  proposedTag = proposedTag.detach();
                  proposedTag.appendTo(thisLine); 
                  proposedTag.before(' ');
                } 
                if(wordWithinTag_index < wordsWithinTag.length) {
                  proposedTag.children().last().after(' ');
                }
                thisWordWithinTag.appendTo(proposedTag); // add thisWordWithinTag to proposedTag
              } else { // if the [span.word] is not going to fit on thisLine
                if(!thisElement.last('.line').hasClass('incomplete')) { // if no div.line.incomplete, add nextLine
                  nextLine.appendTo(thisElement.last('.line'));
                  nextLineProposedTag.appendTo(nextLine);
                } 
                thisWordWithinTag = thisWordWithinTag.detach();
                thisWordWithinTag.appendTo(nextLineProposedTag);
              }
            });
          }
          else {
            // nextLine.appendTo(thisElement.children('.line').last());
            thisElement.children('.line').last().after(nextLine);
            // thisElement.children('.line').last().after(nextLine);
            nextLine.before(' ');
            thisLine = thisLine.clone(); // removes jQuery linkage -- better soln?
            thisLine = nextLine.removeClass('incomplete');
            nextLine = nextLine.clone(); // removes jQuery linkage -- better soln?
            thisTag = thisTag.detach();
            thisTag.appendTo(thisLine);
            nextLine = $('<span class="line incomplete"></span>');
          }
        }
      });


    }

    function splitLines(thisElement, option){
       
      var count = thisElement.children(".word").length;
      var lineAcc = [thisElement.children(".word:eq(0)").html()];
      var lineHTML = [thisElement.children(".word:eq(0)").html()];
      // var lineHTML_Array = [];
      var thisLine = $('<div></div>'); 
      var firstWord = thisElement.children(".word:eq(0)").clone();
      firstWord.appendTo(thisLine);
      var allLines = [];
      var textAcc = [];
      if(option === false || !option) { // return text without span.word elements
        for(var i=1; i<count; i++){
            var prevY = thisElement.children(":not(.letter):eq("+(i-1)+")").offset().top;
          if(thisElement.children(":not(.letter):eq("+i+")").offset().top==prevY){  // if it's on the same line...
            lineAcc.push(thisElement.children(":not(.letter):eq("+i+")").text());   // add text to line.
          } 
          else {                                                            // if it's on the next line...
            textAcc.push({text: lineAcc.join(" "), top: prevY});            // add current line to textAcc AND
            lineAcc = [thisElement.children(":not(.letter):eq("+i+")").text()];     // reset the content of lineACC, starting with current word's text         }
          }
        }
        textAcc.push({text: lineAcc.join(" "), top: thisElement.children(":not(.letter):last").offset().top});
        return textAcc;
      }
      else if(option === true) { // means keep the span.word and span.letter elements, span.sentence not included for now.
        for(var i=1; i<count; i++) {
          var lastTag   = thisElement.children(':not(.letter):eq('+(i-1)+')');
          var lastWord  = thisElement.children(":not(.letter):eq("+(i-1)+")");
          var thisTag   = thisElement.children(':not(.letter)');
          var thisWord  = thisElement.children(":not(.letter):eq("+i+")");
          
          var prevY = lastWord.offset().top;
          var thisY = thisWord.offset().top;
          if(thisY==prevY) { // if word is same vert position as current test...
            var thisWordinText = thisWord[0].outerHTML;
            // thisWordinText = ' ' + thisWordinText;
            // thisLine.last('.word:not(.no-space)').after(' ');
            $(thisWordinText).appendTo(thisLine); // add thisWord to thisLine_HTML
            var test = null;
          } 
          else {
            // thisLine.find('.word').after(' ');
            allLines.push({text: thisLine.clone(), top: prevY});
            thisLine.empty();
            $(thisWord[0].outerHTML).appendTo(thisLine);
          }
          
        }
        allLines.push({text: thisLine.clone(), top: thisElement.children(".word:last").offset().top});
        for(var z=0; z<allLines.length; z++) {
          // var thisText = allLines[z].text;
          allLines[z].text.find('.word:not(.no-space)').after(' ');

        }
        return allLines; // note: doesn't include .top data...
      }
      
       
    }
    

    // TASK --- you need to build the sentences from the words.
    //          practice doing this on the console to make sure jquery 
    //          approach is correct.
    function splitSentences(thisText, thisElement){
      var regExp = /[^\.\!\?]+(?!\.{3})[\.\!\?]{1,2}/g; // looks for '.' '?' '!', but '...' is no good
      // var words = splitWords(thisText, thisElement);
      var thisSentence = $('<div></div>');
      var allSentences = [];
      var words = thisElement.children();
      var flag = true;
      words.each(function(index) {
        var thisWord = $(this);
        var thisText = thisWord.text();
        if(flag == true) { // start a new sentence
          thisSentence.children().detach();
          $('<span class="sentence"></span>').appendTo(thisSentence);
        } 
        if(thisSentence.children().length == 0 && thisWord.hasClass('white-space')) {
          // do nothing
        } else {
          thisWord.appendTo(thisSentence.find('.sentence'));
        }
        if(!String(thisText).match(regExp)) { flag = false; } 
        else if(String(thisText).match(regExp) || index == words.length-1) { // end a sentence
          var spaceAfter = words.eq(index+1);
          if(spaceAfter.hasClass('white-space')) {
            spaceAfter.detach();
            spaceAfter.appendTo(thisSentence.find('.sentence'));
          }
          allSentences.push(thisSentence.html());
          flag = true;
        }
      });
      return allSentences;
    }
    
    function undoSplit(thisTarget, indexOption) {
      var element = $(thisTarget);
      if(indexOption === 0 || indexOption) {
        if(element.eq(indexOption).data('splittext-source')) {
          var thisElement = element.eq(indexOption);
          var sourceData = $.parseHTML(String(element.data('splittext-source').source[indexOption].innerHTML));
          thisElement.data('splittext-split', thisElement.children().detach());
          thisElement.html(sourceData);
        }
      }
      else if(element.data('splittext-source')) {
        element.each(function(index) {
          var thisElement = $(this);
          var sourceData = $.parseHTML(String(thisElement.data('splittext-source').source[index].innerHTML));
          thisElement.data('splittext-split', thisElement.children().detach());
          thisElement.html(sourceData);
        });
      }
    }

    $.fn.undoSplitBy = function(option) {
      var element = $(this);
      undoSplit(element, option);
    };

    $.fn.splitBy = function(option) { 
      var element = $(this);
      undoSplit(element);
      splitBy(element, option);
    };

    element.data(opts.dataName, dataObj);
    return this;
  };

  function cleanUpContent(thisTarget) {
    
  }
  
  function isJquery(sourceData) { if(sourceData instanceof jQuery) { return true; } else { return false; } }

})(jQuery); /// end of plugin ///



