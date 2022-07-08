if (typeof cssAfterLymnee === `undefined`) {

    var cssAfterLymnee;
    
}

if (typeof cssBeforeLymnee === `undefined`) {

    var cssBeforeLymnee;
    
}

var prefixDataAttributes = prefixDataAttributes ?? `data-ym-`,

    printLymnee = printLymnee ?? false,

    unsetLymnee = unsetLymnee ?? false,

    styles = ``,

    cssRules = new Map(),

    cssSelectors,

    nodesYmAttributes = new Set();
    
try {

    if (unsetLymnee.size) {

        cssSelectors = new Set(unsetLymnee);

    } else {

        cssSelectors = new Set();

    }

    var nodesYm = document.evaluate(`//@*[starts-with(name(), "` +  prefixDataAttributes.slice(0, -1) + `")]`, document, null, XPathResult.ANY_TYPE, null);

    var tagsYm = document.evaluate(`//*[starts-with(name(@*), "` +  prefixDataAttributes.slice(0, -1) + `")]`, document, null, XPathResult.ANY_TYPE, null);

    var thisNode = nodesYm.iterateNext();

    while (thisNode) {

        /*
            *
                'thisNode' is an object. That's why we prefer to use 'thisNode.nodeName' and 'thisNode.nodeValue'.

                nodesYmAttributes.add(thisNode);
            *
        */

        nodesYmAttributes.add(thisNode.nodeName.trim() + `=` + thisNode.nodeValue.trim());

        thisNode = nodesYm.iterateNext(); 

    }

    var thisNode = tagsYm.iterateNext();

    while (thisNode) {

        cssSelectors.add(thisNode.nodeName.toLowerCase());

        thisNode = tagsYm.iterateNext(); 

    }

    nodesYmAttributes.forEach((YmAttribute) => {

        let YmName = YmAttribute.split(`=`)[0];

        let YmValue = YmAttribute.split(`=`)[1];

        /*
            *
                https://bobbyhadz.com/blog/javascript-split-trim-surrounding-spaces
            *
        */

        let alternatives = YmValue.split(`||`).map(element => element.trim());

        alternatives.forEach((alternative) => {

            let rule = new Map();

            let split;

            let contextualSelector;

            split = alternative.split(` && `);

            if (split[1]) {

                contextualSelector = split[1] + ` `;

            }

            rule.set(`contextualSelector`, contextualSelector);

            split = split[0].split(`@`);

            let atRules = new Set();

            split.slice(1).forEach((entry) => {

                atRules.add(`@` + entry); 

            });

            rule.set(`at`, atRules);

            let pseudoElement;

            /*
                *
                    https://bobbyhadz.com/blog/javascript-split-remove-empty-elements

                *
            */

            split = split[0].split(/(\s){0,1}(::)/).filter(Boolean);

            switch (split.length) {

                case 3:

                    pseudoElement = split[1] + `` + split[2];

                break;

                case 4:

                    pseudoElement = split[1] + `` + split[2] + `` + split[3];

                break;           

            }

            rule.set(`pseudoElement`, pseudoElement);

            let pseudoClass;

            split = split[0].split(/(\s){0,1}(:)/).filter(Boolean);

            switch (split.length) {

                case 3:

                    pseudoClass = split[1] + `` + split[2];

                break;

                case 4:

                    pseudoClass = split[1] + `` + split[2] + `` + split[3];

                break;           

            }

            rule.set(`pseudoClass`, pseudoClass);

            rule.set(`default`, YmName.substr(prefixDataAttributes.length) + `:` + split[0].replace(/Ox/, `\\`));

            cssRules.set(rule, `[` + YmName + `=` + `"` + YmValue + `"]`);

        });  

});
    
} catch (error) {

    console.log(error.name);

    console.log(error.message); 

}
    
if (!!unsetLymnee) {
    
    try {

        var selectors = 0;

        cssSelectors.forEach((value) => {

            styles += value;

            if (++selectors < cssSelectors.size) {

                styles += `,`;

            }

        });

        styles = styles.replace(/,$/, ``);
        
        styles += `{all:unset}`;

    } catch (error) {

        console.log(error.name);

        console.log(error.message); 
    
    }
    
}
    
try {
    
    cssRules.forEach((key, value) => {

        let nestings = 0;

        if (value.get(`at`)) {

            let atRules = value.get(`at`);

            atRules.forEach((atRule) => {

            styles += atRule + `{`;

            nestings++;

            });

        }

        if (value.get(`contextualSelector`)) {

            styles += value.get(`contextualSelector`);

        }

        styles += key;

        if (value.get(`pseudoElement`)) {

            styles += value.get(`pseudoElement`);

        }

        if (value.get(`pseudoClass`)) {

            styles += value.get(`pseudoClass`);

        }

        styles += `{`;

            if (value.get(`default`)) {

            styles += value.get(`default`);

            nestings++;
        
        }

        styles += `}`.repeat(nestings);

    });

} catch (error) {

    console.log(error.name);

    console.log(error.message); 

}

if (!!printLymnee) {
    
    try {

        console.log(`%c\u003D` + ` ` + `%cLYMNEE`, `color: #ff0000;`, `color: #000000`);

        console.log(`Output`);

        console.log(`%c\u003D\u003D\u003D\u003D\u003D`, `color: #ff0000`);

        console.log(styles);

        console.log(`%c\u003D\u003D\u003D\u003D\u003D`, `color: #ff0000`);

        const shuffle = v=>[...v].sort(_=>Math.random()-.5).join(``);

        console.log(`%c\u003D` + ` ` + `%c` + shuffle(`LYMNEE`), `color: #ff0000;`, `color: #000000`);

    } catch (error) {

        console.log(error.name);

        console.log(error.message); 

    }

}

try {

    let style = document.createElement(`style`);

    if (!!cssBeforeLymnee) {

        style.innerHTML += cssBeforeLymnee;

    }

    style.innerHTML += styles;

    if (!!cssAfterLymnee) {

        style.innerHTML += cssAfterLymnee;

    }

    let head = document.getElementsByTagName(`head`)[0];

    head.appendChild(style);

    if (document.querySelector(`html`).hasAttribute(`data-eenmyl`)) {

        document.querySelector(`html`).removeAttribute(`data-eenmyl`);

    }

    document.querySelector(`html`).setAttribute(`data-lymnee`, ``);

} catch (error) {

    console.log(error.name);

    console.log(error.message); 

}
