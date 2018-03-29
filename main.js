var casper = require('casper').create();
var fs = require('fs');

if(fs.exists('./page_rendering/data.json') && fs.exists('./page_rendering/data.json')){
    var data = require('./page_rendering/data.json');
    var config = require('./page_rendering/config.json');
}else{
    casper.exit();
}
var urls = data.urls;
var viewportSizes = config.viewportSizes;

var links;

function getLinks() {
// Scrape the links from top-right nav of the website
    var links = document.querySelectorAll('ul.navigation li a');
    return Array.prototype.map.call(links, function (e) {
        return e.getAttribute('href')
    });
}

// Opens casperjs homepage
casper.start('http://casperjs.org/');

casper.then(function () {
    links = this.evaluate(getLinks);
});

casper.run(function () {
    for(var i in links) {
        console.log(links[i]);
    }
    //casper.exit();
});


var counter = 0;
casper.run(function(){
    casper.repeat(viewportSizes.length, function(){
        var viewportSize = viewportSizes[counter];
        casper.viewport(viewportSize, 1000).each(urls, function(self, item, index){
            self.thenOpen(item, function(){
                var title = this.getTitle();
                console.log(title);
                this.wait(2000, function(){
                    this.capture('./images/screenshot_'+index+'_'+viewportSize+'.png');
                });
            });
        });
        counter += 1;
    });
    //casper.done();
}); 

//casper.exit();