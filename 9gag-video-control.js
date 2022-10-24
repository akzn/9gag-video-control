// ==UserScript==
// @name     _Keep going button
// @include  http://YOUR_SERVER_1.COM/YOUR_PATH/*
// @include  http://YOUR_SERVER_2.COM/YOUR_PATH/*
// @match        https://9gag.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

//--- Add the button.
$("body").append (
    '<div class="gmPersistentButton">'
  + '<button id="gmAutoplayVideoBtn">Init failed!</button></div>'
);

//--- Define and init the matching control object:
var btnControl  = new PersistentButton (
  "gmAutoplayVideoBtn",        //-- HTML id
  "StopContinueBtn",      //-- Storage label
  ["Autoplay Video : Off", "Autoplay Video : On"],   //-- Text that the button cycles through
  [false, true]           //-- Matching values for the button's states
);

//--- Activate the button click-handler.
$("#gmAutoplayVideoBtn").click ( function () {
  var btnValue    = this.value;
  keepgoing       = btnValue
  btnControl.SetNextValue ();

  if (keepgoing == "true") {
      // CALL YOUR FUNCTION HERE.
  }
} );

//--- CSS styles to make it work and to improve appearance.
GM_addStyle ( (<><![CDATA[
  .gmPersistentButton {
      background:         var(--palette-primary);
      position:           fixed;
      bottom:                1em;
      right:              1em;
      z-index:            6666;
      border-radius:      18px;
  }
  .gmPersistentButton button {
      cursor:             pointer;
      background:         var(--palette-primary);
      color:               white;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: 0em;
      bottom:                1em;
      right:              1em;
      z-index:            6666;
      padding:            1em;
      border:             var(--palette-primary);
      border-radius:      18px;
      opacity:            0.8;
  }
  .gmPersistentButton:hover, .gmPersistentButton button:hover {
      background-color: var(--palette-primary-hover);
  }
]]></>).toString () );


//--- Button object
function PersistentButton (htmlID, setValName, textArry, valueArry) {
  //--- Initialize the button to last stored value or default.
  var buttonValue     = valueArry[0];
  fetchValue ();
  storeValue ();      //-- Store, in case it wasn't already.
  setButtonTextAndVal ();

  //--- DONE with init.  Set click and keyboard listeners externally.

  //***** Public functions:
  this.Reset          = function () {
      buttonValue     = valueArry[0];
      storeValue ();
      setButtonTextAndVal ();
  };

  this.SetNextValue   = function () {
      var numValues   = valueArry.length;
      var valIndex    = 0;

      for (var J = numValues - 1;  J >= 0;  --J) {
          if (buttonValue == valueArry[J]) {
              valIndex    = J;
              break;
          }
      }
      valIndex++;
      if (valIndex >= numValues)
          valIndex    = 0;

      buttonValue     = valueArry[valIndex];

      storeValue ();
      setButtonTextAndVal ();
  };


  //***** Private functions:
  function fetchValue () {
      buttonValue     = GM_getValue (setValName, buttonValue);
  }

  function storeValue () {
      GM_setValue (setValName, buttonValue);
  }

  function setButtonTextAndVal () {
      var buttonText  = "*ERROR!*";

      for (var J = valueArry.length - 1;  J >= 0;  --J) {
          if (buttonValue == valueArry[J]) {
              buttonText  = textArry[J];
              break;
          }
      }

      var theBtn      = document.getElementById (htmlID);
      if (theBtn) {
          theBtn.textContent  = buttonText;
          theBtn.setAttribute ("value", buttonValue);
      }
      else
          alert ('Missing persistent button with ID: ' + htmlID + '!');
  }
}