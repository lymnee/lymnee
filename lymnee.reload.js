if (typeof cssAfter === `undefined`) {

    var cssAfter;
    
}

if (typeof cssBefore === `undefined`) {

    var cssBefore;
    
}

var prefixDataAttributes = prefixDataAttributes ?? `data-ym-`,
    
    output = output ?? true,
    
    reset = reset ?? false,
    
    styles = ``,

    
    nodesYmMap = new Map(),
    
    cssRules = new Map(),

    cssSelectors = new Set();
    
try {

    var nodesYm = document.evaluate(`//@*[starts-with(name(), "` +  prefixDataAttributes.slice(0, -1) + `")]`, document, null, XPathResult.ANY_TYPE, null);

    var tagsYm = document.evaluate(`//*[starts-with(name(@*), "` +  prefixDataAttributes.slice(0, -1) + `")]`, document, null, XPathResult.ANY_TYPE, null);

    var thisNode = nodesYm.iterateNext();

    while (thisNode) {

       nodesYmMap.set(thisNode.nodeValue, thisNode.nodeName);

       thisNode = nodesYm.iterateNext(); 

    }

    var thisNode = tagsYm.iterateNext();

    while (thisNode) {

        cssSelectors.add(thisNode.nodeName.toLowerCase());

        thisNode = tagsYm.iterateNext(); 

    }

    nodesYmMap.forEach((key, value) => {
        
         /*
            *
                https://bobbyhadz.com/blog/javascript-split-trim-surrounding-spaces
            *
        */
            
        let alternatives = value.split(`||`).map(element => element.trim());

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
            
            rule.set(`default`, key.substr(prefixDataAttributes.length) + `:` + split[0].replace(/Ox/, `\\`));

            cssRules.set(rule, `[` + key + `=` + `"` + value + `"]`);

        });        

    });
    
} catch (error) {

    console.log(error.name);

    console.log(error.message); 

}
    
if (!!reset) {
    
    try {
    
        var selectors = 0;

        cssSelectors.forEach((value) => {

            styles += value;

            if (++selectors < cssSelectors.size) {

                styles += `,`;

            }

        });
        
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

if (!!output) {
    
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
    
window.addEventListener(`DOMContentLoaded`, () => {

    try {

        let style = document.createElement(`style`);

        if (!!cssBefore) {

            style.innerHTML += cssBefore;

        }

        style.innerHTML = styles;

        if (!!cssAfter) {

            style.innerHTML += cssAfter;

        }

        let head = document.getElementsByTagName(`head`)[0];

        head.appendChild(style);
        
        if (document.querySelector('html').hasAttribute('data-eenmyl')) {
            
            document.querySelector('html').removeAttribute('data-eenmyl');
            
        }
        
        document.querySelector('html').setAttribute('data-lymnee', '');


    } catch (error) {

        console.log(error.name);

        console.log(error.message); 

    }
            
});
