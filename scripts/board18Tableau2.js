/* 
 * The board18Market2 file contains startup functions 
 * 
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* Function makeTrays() initializes all of the tray objects.
 * It calls the TokenSheet constructor for each mtok sheet.   
 * It also adds the trayNumb to each new tray object.
 * Finally it initializes BD18.curTrayNumb to 0 and 
 * BD18.trayCount to the number of tray objects.
 */
function makeTrays() {
  var sheets = BD18.bx.tray;
  var i=0;
  var images = BD18.tsImages;
  for (var ix=0;ix<sheets.length;ix++) {
    if(sheets[ix].type === 'tcrd') {
      BD18.trays[i] = new CardSheet(images[ix],sheets[ix]);
      BD18.trays[i].trayNumb = i;
      i++;
    }
  }
  BD18.curTrayNumb = 0;
  BD18.trayCount = i;
  registerTrayMenu();
}

/* This function initializes the BD18.marketTokens array.
 * It calls the MarketToken constructor for each token in 
 * BD18.gm.mktTks array and adds the new object to the
 * BD18.marketTokens array.
 */
function makeTabCardList(){
  BD18.tableauCards = [];
  if (BD18.gm.tabCrds.length === 0) return;
  var card,sn,ix,flip,stack,bx,by;
  for(var i=0;i<BD18.gm.tabCrds.length;i++) {
    sn = BD18.gm.tabCrds[i].sheetNumber;
    ix = BD18.gm.tabCrds[i].cardNumber;
    flip = BD18.gm.tabCrds[i].flip;
    stack = (typeof BD18.gm.tabCrds[i].stack!=='undefined')
             ? BD18.gm.tabCrds[i].stack : 0;
    bx = BD18.gm.tabCrds[i].xCoord;
    by = BD18.gm.tabCrds[i].yCoord;
    card = new TableauCard(sn,ix,flip,stack,bx,by);
    BD18.tableauCard.push(card);
  }
}

/*
 * Function trayCanvasApp calls the trays.place() 
 * method for the current token sheet object.  
 * This sets up the tray Canvas. 
 */

function trayCanvasApp() {
  BD18.trays[BD18.curTrayNumb].place(null);
}

/* Function mainCanvasApp calls the stockMarket.place() method.
 * This sets up the main Canvas.  
 */
function mainCanvasApp(){
  BD18.Tableau.place();
}

/* Function toknCanvasApp places all existing tokens 
 * on the stock market using the BD18.marketTokens array.
 * 
 */
function cardCanvasApp(keepBoxSelect){
  BD18.Tableau.clear2(keepBoxSelect);
  if (BD18.tableauCards.length === 0) {
    return;
  }
  var card;
  for(var i=0;i<BD18.tableauCards.length;i++) {
    if (!(i in BD18.tableauCards)) {
      continue;
    }
    card = BD18.tableauCards[i];
    card.place();
  }
}

/* Function CanvasApp initializes all canvases.
 * It then calls trayCanvasApp and mainCanvasApp.
 */
function canvasApp()
{
  var hh = parseInt(BD18.tableau.height, 10);
  var ww = parseInt(BD18.tableau.width, 10);
  $('#content').css('height', hh); 
  $('#content').css('width', ww);     
  $('#canvas1').prop('height', hh); 
  $('#canvas1').prop('width', ww); 
  $('#canvas2').prop('height', hh); 
  $('#canvas2').prop('width', ww); 
  BD18.canvas0 = document.getElementById('canvas0');
  if (!BD18.canvas0 || !BD18.canvas0.getContext) {
    return;
  }
  BD18.context0 = BD18.canvas0.getContext('2d');
  if (!BD18.context0) {
    return;
  }
  BD18.canvas1 = document.getElementById('canvas1');
  if (!BD18.canvas1 || !BD18.canvas1.getContext) {
    return;
  }
  BD18.context1 = BD18.canvas1.getContext('2d');
  if (!BD18.context1) {
    return;
  }
  BD18.canvas2 = document.getElementById('canvas2');
  if (!BD18.canvas2 || !BD18.canvas2.getContext) {
    return;
  }
  BD18.context2 = BD18.canvas2.getContext('2d');
  if (!BD18.context2) {
    return;
  }
  trayCanvasApp();
  mainCanvasApp();
  cardCanvasApp();
}
  
/* Startup Event Handler and Callback Functions.  */

/* This function is an event handler for the game box images.
 * It calls makeTrays, makeBdTileList, canvasApp and 
 * delayCheckForUpdate after all itemLoaded events have occured.
 */
function itemLoaded(event) {
  BD18.loadCount--;
  if (BD18.doneWithLoad === true && BD18.loadCount <= 0) {
    BD18.tableau = new Tableau(BD18.mktImage,BD18.bx.market);
    makeTrays();
    makeTabCardList();
    canvasApp();
    delayCheckForUpdate();
  }
}

/* The loadLinks function is called by the <li> statements
 * which are created by the loadLinks function below.
 */
function doLink(linkURL) {
  $('#mainmenu').hide();
  window.open(linkURL);
}

/* The loadLinks function is called by loadBox and getLinks
 * functions to add box and game links to the "Useful Links" sub-menu
 * The newLinks parameter is an array formatted as follows:
 *     [
 *       {
 *         "link_name":"aaaaaa",
 *         "link_url":"bbbbbbb",
 *         "act_date":"mm/dd/yyyy" [optional]
 *       },
 *       . . . . more links . . . . . 
 *     ]
 */
function loadLinks(newLinks) {
  var linkHTML = '';
  var tempLnk = '';
  $.each(newLinks,function(index,linkItem) {
    tempLnk = "'" + linkItem.link_url + "'";
    linkHTML+= '<li onclick="doLink(';
    linkHTML+= tempLnk + ');">';
    linkHTML+= linkItem.link_name + '</li>';
  }); // end of each
  $('#linkMenu').append(linkHTML);
}

/* The loadBox function is a callback function for
 * the gameBox.php getJSON function.
 * It loads all the game and game box links.
 * It loads all the game box images. 
 */
function loadBox(box) {
  BD18.bx = null;
  BD18.bx = box;
  if (typeof(box.links) !== 'undefined' && box.links.length > 0) {
    loadLinks(box.links);
  }
  $.getJSON("php/linkGet.php", 'gameid='+BD18.gameID,function(data) {
    if (data.stat === "success" && typeof(data.links) !== 'undefined' 
        && data.links.length > 0) { loadLinks(data.links); }
  });
  var tableau = BD18.bx.tableau;
  var sheets = BD18.bx.tray;
  BD18.tabImage = new Image();
  BD18.tabImage.src = tableau.imgLoc;
  BD18.tabImage.onload = itemLoaded; 
  BD18.loadCount++ ;
  BD18.tsImages = [];
  var ttt = sheets.length;
  for(var i=0; i<ttt; i++) {
    BD18.tsImages[i] = new Image();
    BD18.tsImages[i].src = sheets[i].imgLoc;
    BD18.tsImages[i].onload = itemLoaded;
    BD18.loadCount++;
  }
  BD18.doneWithLoad = true;
  itemLoaded(); // Just in case onloads are very fast.
}

/* The loadSession function is a callback function for
 * the gameSession.php getJSON function. It finds and
 * loads the game box file.
 */
function loadSession(session) {
  BD18.gm = null;
  BD18.gm = session;
  if( !BD18.doneWithLoad ){
	BD18.history = [JSON.stringify(BD18.gm)];
	BD18.historyPosition = 0;
	var boxstring = 'box=';
	boxstring = boxstring + BD18.gm.boxID;
	$.getJSON("php/gameBox.php", boxstring, loadBox)
	    .error(function() { 
		    var msg = "Error loading game box file. \n";
		    msg = msg + "This is probably due to a game box format error.";
		    alert(msg); 
	    });
  } else {
	itemLoaded();
  }
}

