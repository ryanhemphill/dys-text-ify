// test.js
var testText;
$(document).ready(function() {
	testText = $('#sample p');
	applySplitText();
	$('#undo-splittext').on('click', function() { undoSplitText(); });
	$('#redo-splittext').on('click', function() { redoSplitText(); });
});

function applySplitText() {
	testText.eq(0).splitText({ type: 'sentences'});
	testText.eq(1).splitText({ type: 'lines'});
	testText.eq(2).splitText({ type: 'words'});
	testText.eq(3).splitText({ type: 'letters'});
}

function redoSplitText() {
	testText.eq(0).splitBy('sentences');
	testText.eq(1).splitBy('lines');
	testText.eq(2).splitBy('words');
	testText.eq(3).splitBy('letters');
}

function undoSplitText() {
	testText.undoSplitBy();
}