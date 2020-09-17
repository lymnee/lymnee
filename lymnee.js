/* Quality tool, http://jshint.com/ */


/* 

    Examples

    node lymnee.js cssNameFile=style includeExtensions=html,js excludeDirectories=node_modules,bar excludeFiles=lymnee-index-1.html,lymnee-index-2.html path=current uncompress=true

    node lymnee.js cssNameFile=style excludeDirectories=/home/admin/web/foo.com/public_html/bar excludeFiles=lymnee-index-1.html includeExtensions=html,php path=current prefixDataAttributes=data-some reset=all uncompress=false

*/

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

var glob = require('glob');

var fs = require('fs');

var validateFile = require('csstree-validator').validateFile;

var reporter = require('csstree-validator').reporters.console;

var xpath = require('xpath');

var dom = require('xmldom').DOMParser;

var styles = [];

var cssOutput = '';

var nodesYmNames = [];

var nodesYmValues = [];

var nodesYmReset = [];

var nodesYmNamesAndValues = [];

const args = process.argv

.slice(2)

.map(arg => arg.split('='))

.reduce(
    
    (
        args, [value, key]) => {

            args[value] = key.replace(/\s*,\s*/g, ',');

            return args;

        }, 
    
    {}

);

var path = process.cwd();

if (args.path) {

    if (args.path !== 'current') {

        path = args.path;

    }

}

var cssFile = path + '/lymnee.css';

if (args.cssFile) {

    cssFile = path + '/' + args.cssFile;

    cssFile += '.css';

}

var prefixDataAttributes = 'data-ym-';

if (args.prefixDataAttributes) {

    prefixDataAttributes = args.prefixDataAttributes;

    prefixDataAttributes += '-';

}

var uncompress = true;

if (args.uncompress === 'false') {

    uncompress = false;

}

var ignoreItems = [];

if (args.excludeFiles) {

    if (args.excludeFiles.includes(',')) {

        excludeFilesEntries = args.excludeFiles.split(',');

        excludeFilesEntries.forEach(function (excludeFileEntry) { 

            ignoreItems.push(excludeFileEntry);

        });

    } else {

        ignoreItems.push(args.excludeFiles);

    }

}

if (args.excludeDirectories) {

    if (args.excludeDirectories.includes(',')) {

        excludeDirectoriesEntries = args.excludeDirectories.split(',');

        excludeDirectoriesEntries.forEach(function (excludeDirectoriesEntry) {
            
            let excludeDirectoryDetail = '**/';

            excludeDirectoryDetail += excludeDirectoriesEntry;

            excludeDirectoryDetail += '/**';

            ignoreItems.push(excludeDirectoryDetail);

        });

    } else {
            
        let excludeDirectoryDetail = '**/';

        excludeDirectoryDetail += args.excludeDirectories;

        excludeDirectoryDetail += '/**';

        ignoreItems.push(excludeDirectoryDetail);  

    }  

}

var options = {

    cwd: path,

    ignore: ignoreItems

}

var files = [];

if (args.includeExtensions) {

    if (args.includeExtensions.includes(',')) {

        files = glob.sync(path + '**/*.{' + args.includeExtensions + '}', options);

    } else {

        files = glob.sync(path + '**/*.' + args.includeExtensions, options);
    
    }

} else {

    files = glob.sync(path + '**/*.html', options);

}

files.forEach(function (file) { 

    var data = fs.readFileSync(file, { encoding : 'UTF-8' });
    
    /* var doc = new dom().parseFromString(data); */

    /* We hide errors and warnings, like "[xmldom warning] unclosed xml attribute": cf. https://stackoverflow.com/questions/56213117/how-to-silent-all-the-warning-messages-of-xml-dom-in-node-js */

    var doc = new dom({
        
        locator: {},
        
        errorHandler: { warning : function (w) { }, 
        
        error: function (e) { }, 
        
        fatalError: function (e) { console.error(e) } }
    
    }).parseFromString(data);

    if (args.reset === 'lymnee') {

        var tags = xpath.select('//*[starts-with(name(@*), "' +  prefixDataAttributes.slice(0, -1) + '")]', doc);

        tags.forEach(function (tag) {

            if (!nodesYmReset.includes(tag.tagName)) {

                nodesYmReset.push(tag.tagName);

            }

        });

    }

    if (args.reset === 'all') {

        var tags = xpath.select('//*', doc);

        tags.forEach(function (tag) {

            if (htmlTags.includes(tag.tagName)) {

                if (!nodesYmReset.includes(tag.tagName)) {

                    nodesYmReset.push(tag.tagName);

                }

            }

        });

    }

    var nodesYm = xpath.select('//@*[starts-with(name(), "' +  prefixDataAttributes.slice(0, -1) + '")]', doc);

    nodesYm.forEach(function (nodeYm) { 

        nodesYmNames.push(nodeYm.localName);

        nodesYmValues.push(nodeYm.nodeValue);

    });

});

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

            if (uncompress) {

                cssOutput += '\n';

            }

        } else {

            /* Last element */

            if (uncompress) {

                cssOutput += ' ';

            }
        }

    });

    cssOutput += '{';

    if (uncompress) {

        cssOutput += '\n';

        cssOutput += '\t';

        cssOutput += 'all: unset';

        cssOutput += '\n';

    } else {

        cssOutput += 'all:unset';
    }
    
    cssOutput += '}';
    
    if (uncompress) {

        cssOutput += '\n';

    }

}

var tabs = 0;

styles.forEach(function (style) {

    if (style.support !== null) {

        cssOutput += '@';

        cssOutput += 'supports';
        
        if (uncompress) {

            cssOutput += ' ';

        }

        cssOutput += '(';

        cssOutput += style.support;

        cssOutput += ')';

        if (uncompress) {

            cssOutput += ' ';
    
        }

        cssOutput += '{';

        if (uncompress) {

            cssOutput += '\n';

            cssOutput += '\t'.repeat(++tabs);

        }

    }

    if (style.media !== null) {

        cssOutput += '@';

        cssOutput += style.media;

        if (uncompress) {

            cssOutput += ' ';
    
        }

        cssOutput += '{';

        if (uncompress) {

            cssOutput += '\n';

            cssOutput += '\t'.repeat(++tabs);
    
        }

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

    if (uncompress) {

        cssOutput += ' ';

    }

    cssOutput += '{';

    if (uncompress) {

        cssOutput += '\n';

        cssOutput += '\t'.repeat(++tabs);

    }

    cssOutput += style.property.replace(prefixDataAttributes, '');

    cssOutput += ':';

    if (uncompress) {

        cssOutput += ' ';

    }

    cssOutput += style.value;

    if (uncompress) {

        cssOutput += '\n';

        cssOutput += '\t'.repeat(--tabs);

    }

    cssOutput += '}';

    if (uncompress) {

        cssOutput += '\n';

    }

    if (style.media !== null) {

        if (uncompress) {

            cssOutput += '\t'.repeat(--tabs);

        }

        cssOutput += '}';

        if (uncompress) {
    
            cssOutput += '\n';
    
        }

    }

    if (style.support !== null) {

        cssOutput += '}';

        if (uncompress) {
    
            cssOutput += '\n';
    
        }

    }

});

console.clear();

console.log('\x1b[31m%s\x1b[0m %s', '\u003D', 'Lymnee');

fs.writeFile(
    
    cssFile,

    cssOutput,

    function (err) {
    
    if (err) {
        
        return console.log(err);
    
    } else {

        console.log('%s \x1b[31m%s\x1b[0m%s\x1b[31m%s\x1b[0m %s', 'The file', '\u005B', cssFile, '\u005D', 'was saved!');

    }

    if ('# ' + cssFile + '\n' === reporter(validateFile(cssFile))) {

        console.log('Congratulations! No Error Found.');

    } else {

        console.log(reporter(validateFile(cssFile)));

    }

    console.log('\x1b[31m%s\x1b[0m', '\u003D\u003D\u003D\u003D\u003D');

    console.log(cssOutput);

});
