if (typeof cssAfter === 'undefined') {

    var cssAfter;
    
}

if (typeof cssBefore === 'undefined') {

    var cssBefore;
    
}

if (typeof prefixDataAttributes === 'undefined') {

    var prefixDataAttributes = 'data-ym-';

}

if (typeof reset === 'undefined') {

    var reset = 'all';

}

if (typeof uncompress === 'undefined') {

    var uncompress = true;

}

function removeDuplicateEntries(arrayNodes) {

    let stringArray = arrayNodes.map(JSON.stringify);

    let uniqueStringArray = new Set(stringArray);

    return Array.from(uniqueStringArray, JSON.parse);

}

/*
   * https://github.com/sindresorhus/html-tags/blob/master/html-tags.json
*/

const htmlImmutablesTags = ['head', 'link', 'meta', 'noscript', 'script', 'style', 'title'];

var styles = [];

var cssOutput = '';

var nodesYmNames = [];

var nodesYmValues = [];

var nodesYmReset = [];

var nodesYmNamesAndValues = [];

if (reset === 'lymnee') {

    var tags = document.evaluate('//*[starts-with(name(@*), "' +  prefixDataAttributes.slice(0, -1) + '")]', document, null, XPathResult.ANY_TYPE, null);
    
    var thisNode = tags.iterateNext();
   
    while (thisNode) {

        if (!nodesYmReset.includes(thisNode.nodeName.toLowerCase())) {

            nodesYmReset.push(thisNode.nodeName.toLowerCase());

        }

        thisNode = tags.iterateNext(); 

    }

}

if (reset === 'all') {

    var tags = document.evaluate('//*', document, null, XPathResult.ANY_TYPE, null);

    var thisNode = tags.iterateNext();
   
    while (thisNode) {

        if (!htmlImmutablesTags.includes(thisNode.nodeName.toLowerCase())) {

            if (!nodesYmReset.includes(thisNode.nodeName.toLowerCase())) {

               nodesYmReset.push(thisNode.nodeName.toLowerCase());

            }

        }

        thisNode = tags.iterateNext(); 
    
    }

}

var nodesYm = document.evaluate('//@*[starts-with(name(), "' +  prefixDataAttributes.slice(0, -1) + '")]', document, null, XPathResult.ANY_TYPE, null);

var thisNode = nodesYm.iterateNext();
   
while (thisNode) {

    nodesYmNames.push(thisNode.nodeName);

    nodesYmValues.push(thisNode.nodeValue);

    thisNode = nodesYm.iterateNext(); 

}

nodesYmNamesAndValues = nodesYmNames.map((el, i) => {

    return [nodesYmNames[i], nodesYmValues[i]];

});

nodesYmReset.sort();

nodesYmNamesAndValues = removeDuplicateEntries(nodesYmNamesAndValues);

nodesYmNamesAndValues.sort((a, b) => a[1].localeCompare(b[1]));

nodesYmNamesAndValues.sort(function (a,b) {

    if (a[0] > b[0]) return 1;

    if (a[0] < b[0]) return -1;

    if (a[2] > b[2]) return 1;

    if (a[2] < b[2]) return -1;

    return 0;

});

var styles = [];

nodesYmNamesAndValues.forEach(function (nodeYmNameAndValue) {

   var rules = nodeYmNameAndValue[1].split(' || ');

   rules.forEach(function (rule) {

       let style = [];

       style.contextualSelector = null;
       
       style.media = null;
       
       style.pseudoClasses = null;

       style.pseudoElement = null;
   
       style.support = null;

       let ruleSupport = rule.split(' !! ');
   
       if (ruleSupport[1]) {
       
           style.support = ruleSupport[1].trim();
           
       }

       let ruleContextualSelector = ruleSupport[0].split(' && ');
   
       if (ruleContextualSelector[1]) {
       
           style.contextualSelector = ruleContextualSelector[1].trim();
           
       }

       ruleMedia = ruleContextualSelector[0].split('@');

       if (ruleMedia[1]) {
       
           style.media = ruleMedia[1].trim();
           
       }

       rulePseudoElement = ruleMedia[0].split('::');

        if (rulePseudoElement[1]) {
       
            style.pseudoElement = rulePseudoElement[1].trim();
       
        }
       
        rulePseudoClasses = rulePseudoElement[0].split(':');
       
        if (rulePseudoClasses[1]) {
           
            style.pseudoClasses = [];
           
            rulePseudoElement[0].replace(rulePseudoClasses[0] + ':', '').split(':').forEach(function(pseudoClass) {
   
                style.pseudoClasses.push(pseudoClass);
   
            });
           
        }

        style.value = rulePseudoClasses[0].trim();

        style.selector = nodeYmNameAndValue[0] + '=' + '"' + nodeYmNameAndValue[1] + '"';

        style.property = nodeYmNameAndValue[0];

        styles.push(style);

   });

});

if (nodesYmReset.length) {

    if (uncompress) {

        nodesYmReset.forEach(function (nodeYmReset, index) {

            cssOutput += nodeYmReset;
     
            if (index !== nodesYmReset.length - 1) {
     
                cssOutput += ',';
     
                cssOutput += '\n';
     
            } else {
     
                /* Last element */
     
                cssOutput += ' ';
     
            }
     
        });
     
        cssOutput += '{';

        cssOutput += '\n';
     
        cssOutput += '\t';
 
        cssOutput += 'all: unset';
 
        cssOutput += '\n';
        
        cssOutput += '}';
     
        cssOutput += '\n';
     
    } else {

        nodesYmReset.forEach(function (nodeYmReset, index) {

            cssOutput += nodeYmReset;
     
            if (index !== nodesYmReset.length - 1) {
     
                cssOutput += ',';
     
            }
     
        });
     
        cssOutput += '{';

        cssOutput += 'all:unset';
        
        cssOutput += '}';

    }

}

styles.forEach(function (style) {

    var nesting = 0;

    if (uncompress) {

        if (style.support !== null) {

            cssOutput += '@';
     
            cssOutput += 'supports';
     
            cssOutput += ' ';
     
            cssOutput += '(';
     
            cssOutput += style.support;
     
            cssOutput += ')';
     
            cssOutput += ' ';
        
            cssOutput += '{';

            cssOutput += '\n';
    
            cssOutput += '\t'.repeat(++nesting);
     
        }
     
        if (style.media !== null) {
     
            cssOutput += '@';
     
            cssOutput += style.media;

            cssOutput += ' ';
     
            cssOutput += '{';

            cssOutput += '\n';
     
            cssOutput += '\t'.repeat(++nesting);
     
        }
     
        if (style.contextualSelector !== null) {
     
            cssOutput += style.contextualSelector;
     
            cssOutput += ' ';
     
            cssOutput += '[';
     
            cssOutput += style.selector;
     
            cssOutput += ']';
     
        } else {
     
            cssOutput += '[';

            cssOutput += style.selector;

            cssOutput += ']';
     
        }

        if (style.pseudoClasses !== null) {

            style.pseudoClasses.forEach(function(pseudoClass) {

                cssOutput += ':';

                if (pseudoClass.substring(0, 3) === 'not') {

                    cssOutput += ' ';
                
                }

                cssOutput += pseudoClass;

            });

        }
            
        if (style.pseudoElement !== null) {

            cssOutput += '::';

            cssOutput += style.pseudoElement;

        }

        cssOutput += ' ';

        cssOutput += '{';

        cssOutput += '\n';

        cssOutput += '\t'.repeat(++nesting);

        cssOutput += style.property.replace(prefixDataAttributes, '');

        cssOutput += ':';

        cssOutput += ' ';

        cssOutput += style.value;

        cssOutput += '\n';

        while (nesting--) {

            cssOutput += '\t'.repeat(nesting);

            cssOutput += '}';

            cssOutput += '\n';

        }

    } else {

        if (style.support !== null) {

            cssOutput += '@';
     
            cssOutput += 'supports';
     
            cssOutput += '(';
     
            cssOutput += style.support;
     
            cssOutput += ')';
     
            cssOutput += '{';

            nesting++;
     
        }
     
        if (style.media !== null) {
     
            cssOutput += '@';
     
            cssOutput += style.media;
     
            cssOutput += '{';

            nesting++;
     
        }
     
        if (style.contextualSelector !== null) {
     
            cssOutput += style.contextualSelector;

            cssOutput += '[';
     
            cssOutput += style.selector;
     
            cssOutput += ']';
     
        } else {
     
            cssOutput += '[';
     
            cssOutput += style.selector;
     
            cssOutput += ']';
     
        }
        
        if (style.pseudoClasses !== null) {
            
            style.pseudoClasses.forEach(function(pseudoClass) {
                
                cssOutput += ':';

                if (pseudoClass === 'not') {

                    cssOutput += ' ';
               
                }
                
                cssOutput += pseudoClass;
                
            });
     
        }
     
        if (style.pseudoElement !== null) {
     
            cssOutput += '::';
     
            cssOutput += style.pseudoElement;
     
        }
     
        cssOutput += '{';

        nesting++;

        cssOutput += style.property.replace(prefixDataAttributes, '');
     
        cssOutput += ':';
     
        cssOutput += style.value;

        while (nesting--) {

            cssOutput += '}';
        
        }

    }

});

if (uncompress) {

    console.clear();

    console.log('%c\u003D' + ' ' + '%cLymnee', 'color: #ff0000;', 'color: #000000');

    console.log('Output');

    console.log('%c\u003D\u003D\u003D\u003D\u003D', 'color: #ff0000');

    console.log(cssOutput);

}

document.addEventListener('DOMContentLoaded', () => {

    var style = document.createElement('style');
	
    if (!!cssBefore) {

        if (uncompress) {

            style.innerHTML += '/*** > Css Before ***/';

            style.innerHTML += '\n';

            style.innerHTML += cssBefore;

            style.innerHTML += '\n';

            style.innerHTML += '/*** < Css Before ***/';

            style.innerHTML += '\n';

        } else {

            style.innerHTML += cssBefore.trim();

        }

	}

	style.innerHTML += cssOutput;
	
	if (!!cssAfter) {

        if (uncompress) {

            style.innerHTML += '/*** > Css After ***/';

            style.innerHTML += '\n';

            style.innerHTML += cssAfter;

            style.innerHTML += '\n';

            style.innerHTML += '/*** < Css After ***/';

            style.innerHTML += '\n';

        } else {

		    style.innerHTML += cssAfter.trim();

        }

	}

    var head = document.getElementsByTagName('head')[0];

    head.appendChild(style);

});
