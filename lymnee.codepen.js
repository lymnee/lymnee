if (typeof cssAfter === 'undefined') {

    var cssAfter;
    
}

if (typeof cssBefore === 'undefined') {

    var cssBefore;
    
}

if (typeof prefixDataAttributes === 'undefined') {

    var prefixDataAttributes = 'data-ym-';

}

function removeDuplicateEntries(arrayNodes) {

  let stringArray = arrayNodes.map(JSON.stringify);

  let uniqueStringArray = new Set(stringArray);

  return Array.from(uniqueStringArray, JSON.parse);

}

/*
    * https://github.com/sindresorhus/html-tags/blob/master/html-tags.json
*/

const htmlTags = [
	'a',
	'abbr',
	'address',
	'area',
	'article',
	'aside',
	'audio',
	'b',
	'base',
	'bdi',
	'bdo',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'data',
	'datalist',
	'dd',
	'del',
	'details',
	'dfn',
	'dialog',
	'div',
	'dl',
	'dt',
	'em',
	'embed',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	/*'head',*/
	'header',
	'hgroup',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'kbd',
	'label',
	'legend',
	'li',
	/*'link',*/
	'main',
	'map',
	'mark',
	'math',
	'menu',
	'menuitem',
	/*'meta',*/
	'meter',
	'nav',
	/*'noscript',*/
	'object',
	'ol',
	'optgroup',
	'option',
	'output',
	'p',
	'param',
	'picture',
	'pre',
	'progress',
	'q',
	'rb',
	'rp',
	'rt',
	'rtc',
	'ruby',
	's',
	'samp',
	/*'script',*/
	'section',
	'select',
	'slot',
	'small',
	'source',
	'span',
	'strong',
	/*'style',*/
	'sub',
	'summary',
	'sup',
	'svg',
	'table',
	'tbody',
	'td',
	'template',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	/*'title',*/
	'tr',
	'track',
	'u',
	'ul',
	'var',
	'video',
	'wbr'
];

var styles = [];

var cssOutput = '';

var nodesYmNames = [];

var nodesYmValues = [];

var nodesYmReset = [];

var nodesYmNamesAndValues = [];


var tags = document.evaluate('//*[starts-with(name(@*), "' +  prefixDataAttributes.slice(0, -1) + '")]', document, null, XPathResult.ANY_TYPE, null);

var thisNode = tags.iterateNext();

while (thisNode) {

	if (htmlTags.includes(thisNode.nodeName.toLowerCase())) {

		if (!nodesYmReset.includes(thisNode.nodeName.toLowerCase())) {

			nodesYmReset.push(thisNode.nodeName.toLowerCase());

		}

	}

	thisNode = tags.iterateNext(); 

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

    if (a[0] > b[0]) return  1;

    if (a[0] < b[0]) return -1;

    if (a[2] > b[2]) return  1;

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

        style.value = rulePseudoElement[0].trim();

        style.selector = nodeYmNameAndValue[0] + '=' + '"' + nodeYmNameAndValue[1] + '"';

        style.property = nodeYmNameAndValue[0];

        styles.push(style);

    });

});

if (nodesYmReset.length) {

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

styles.forEach(function (style) {

    if (style.support !== null) {

        cssOutput += '@';

        cssOutput += 'supports';

        cssOutput += '(';

        cssOutput += style.support;

        cssOutput += ')';

        cssOutput += '{';

    }

    if (style.media !== null) {

        cssOutput += '@';

        cssOutput += style.media;

        cssOutput += '{';

    }

    if (style.contextualSelector !== null) {

        cssOutput += '.';

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

    if (style.pseudoElement !== null) {

        cssOutput += '::';

        cssOutput += style.pseudoElement;

    }

    cssOutput += '{';

    cssOutput += style.property.replace(prefixDataAttributes, '');

    cssOutput += ':';

    cssOutput += style.value;

    cssOutput += '}';

    if (style.media !== null) {

        cssOutput += '}';

    }

    if (style.support !== null) {

        cssOutput += '}';

    }

});

document.addEventListener('DOMContentLoaded', (event) => {

	var style = document.createElement('style');
	
	if (!!cssBefore) {

		style.innerHTML += cssBefore;

	}

	style.innerHTML += cssOutput;
	
	if (!!cssAfter) {

		style.innerHTML += cssAfter;

	}

    var head = document.getElementsByTagName('head')[0];

    head.appendChild(style);

});
