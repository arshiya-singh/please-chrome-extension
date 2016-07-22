// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.

var keywords = ["show me", "get news about", "get recipes for", "shop for", "talk to", "find house at", "tell me"];
var index;

chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    //console.log('inputChanged: ' + text);
    var found = 0;
    index = 0;
    while (found == 0 && index <= keywords.length) {
      if (text.indexOf(keywords[index]) > -1) {
        found = 1;
      } else {
        index++;
      }
    }

    if (found == 1) {
      switch(index) {
        case 0:
          suggest([
            {content: "https://www.facebook.com", description: "People"}]);
          break;

        case 1:
          suggest([
            {content: "http://edition.cnn.com/politics", description: "Politics"},
            {content: "http://edition.cnn.com/regions", description: "World"},
            {content: "http://money.cnn.com/INTERNATIONAL/", description: "Money"}]);
          break;

        case 2:
          suggest([
            {content: "http://allrecipes.com/search/results/?wt=pasta&sort=re", description: "Pasta"},
            {content: "http://allrecipes.com/search/results/?wt=soup&sort=re", description: "Soups"},
            {content: "http://allrecipes.com/search/results/?wt=steak&sort=re", description: "Steak"}]);
          break;

        case 3:
          suggest([
            {content: "https://www.amazon.com/s/ref=topnav_storetab_sl?ie=UTF8&bbn=10445813011&rh=i%3Afashion-brands%2Cn%3A7141123011%2Cn%3A10445813011", description: "Clothes"},
            {content: "https://www.amazon.com/electronics-store/b/ref=nav_shopall_elec_hub?ie=UTF8&node=172282", description: "Electronics"}]);
          break;

        case 4:
          break;

        case 5:
          break;

        case 6:
          break;
        }
    }
  });



// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    //console.log('inputEntered: ' + text);
    switch (index) {
      case 0:
        break;

      case 1:
        if (text.indexOf("http") > -1) {
          chrome.tabs.update({url: text});
        } else {
          var append = correct(text, 15);
          chrome.tabs.update({url : "http://edition.cnn.com/search/?text=" + append});

        }
        break;

      case 2:
        if (text.indexOf("http") > -1) {
          chrome.tabs.update({url: text});
        } else {
          var append = correct(text, 16);
          chrome.tabs.update({url: "http://allrecipes.com/search/results/?wt=" + append + "&sort=re"});
        }
        break;

      case 3:
        if (text.indexOf("http") > -1) {
          chrome.tabs.update({url: text});
        } else {
          var append = correct(text, 9);
          chrome.tabs.update({url: "https://www.amazon.com/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=" + append});
        }
        break;

      case 4:
        if (text.indexOf("http") > -1) {
          chrome.tabs.update({url: text});
        } else {
          var append = correct(text, 8);
          chrome.tabs.update({url: "https://www.facebook.com"});
        }
        break;

      case 5:
        if (text.indexOf("http") > -1) {
          chrome.tabs.update({url: text});
        } else {
          var append = correct(text, 14);
          chrome.tabs.update({url: "https://www.google.com/maps/search/" + append});
        }
        break;

      case 6:

        var append = correct(text, 8);
        chrome.tabs.update({url: "https://www.google.com/search?q=" + append + "&ie=utf-8&oe=utf-8"});
    }

  });


chrome.browserAction.onClicked.addListener(function() {
   chrome.tabs.update({url: "pleaseKeywords.html"});
});

function correct(text, offset) {
  var append = text.substring(offset);
  append = append.replace(/,|\./g, "");
  append = append.replace(/ /g, "+");
  return append;
}