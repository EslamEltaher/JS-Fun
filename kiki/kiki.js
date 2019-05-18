function sing(lyrics) {
    var i = 0;
    var lyricsLength = lyrics.length;

    setInterval(function(){
        i = i >= lyricsLength ? 0 : i;
        var currentSentence = lyrics[i];

        sing.singingStrategy(currentSentence);

        i++;
    }, 1000);
}


FadingSingingStrategy = function(element, fadeOutTime) {
    var stepSize_ms = 200;
    var n_steps = Math.floor(fadeOutTime / stepSize_ms);
    
    return function(currentSentence){
        
        element.innerHTML = currentSentence;
        element.style.opacity = 1;
        
        var currentStep = 0;

        var interval = setInterval(function() {
            var opacity = parseFloat(element.style.opacity);
            element.style.opacity = opacity - 1 / n_steps;

            currentStep++;

            if(currentStep >= n_steps) {
                clearInterval(interval);
                currentStep = 0;
            }
        }, stepSize_ms);
    }
}

// sing.singingStrategy = console.log;
sing.singingStrategy = FadingSingingStrategy(document.getElementById('singingElement'),1100);


var kiki = [
    'kiki',
    'do u love me',
    'r u ridin',
    'say you\'ll never ever leave',
    'from beside me',
    'cause i want ya',
    'and i need ya',
    'and i\'m down for you always',
]
// sing(kiki);