/*
	*
		Quand sont insérés des contenus dans le Dom, nous privilégions 'insertAdjacentHTML' au lieu de 'innerHTML' dans la mesure du possible et de l'intelligible.
	*
*/

/*
	*
		Erreurs.
		
		Avec 'throw new Error', le script s'interrompt et nous n'avons pas à vérifier ultérieurement l'existence des principales variables. Les autres variables en erreur ne provoqueront pas l'arrêt du script.
	
	*
*/

let dialog = null; /* Nécessaire pour que la fenêtre se ferme d'un simple clic. */

function createDialog(message) {

	let body = document.querySelector('body');

	dialog = document.createElement('dialog');

	let buttonHTML = '<button onclick="closeDialog()" title="' + glossary.get('errorClose')[language] + '">' + glossary.get('errorClose')[language] + '</button>';

	dialog.insertAdjacentHTML('beforeend', message + buttonHTML);

	body.appendChild(dialog);

	dialog.showModal();

}

function closeDialog() {

	if (dialog) {

		dialog.close();

		dialog.remove();

		dialog = null;

	}

}

if (!document.documentElement.lang) {

	let body = document.querySelector('body');

	dialog = document.createElement('dialog');

	let message = '&#60;html lang="?"&#62;'

	let buttonHTML = '<button onclick="closeDialog()" title="&#128473;">&#128473;</button>';

	dialog.insertAdjacentHTML('beforeend', message + buttonHTML);

	body.appendChild(dialog);

	dialog.showModal();

	throw new Error('&#60;html lang="?"&#62;');

}

const language = document.documentElement.lang;

/*
	*
		Dictionnaire
	*
*/

const glossary = new Map([

	['bottom', {en: 'bottom', fr: 'inférieure'}],

	['color', {en: 'color', fr: 'couleur'}],

	['breakPageKeyword', {en: 'break', fr: 'saut'}],

	['date', {en: 'date', fr: 'date'}],

	['dispatch', {en: 'dispatch', fr: 'expédition'}],

	['elementId', {en: 'element', fr: 'élément'}],

	['envelope', {en: 'envelope', fr: 'enveloppe'}],

	['eventId', {en: 'event', fr: 'événement'}],

	['faces', {en: 'faces', fr: 'caractères'}],

	['family', {en: 'family', fr: 'famille'}],

	['fold', {en: 'fold', fr: 'pliage'}],

	['font', {en: 'font', fr: 'police'}],

	['fromId', {en: 'from', fr: 'de'}],

	['gender', {en: 'gender', fr: 'sexe'}],

	['justify', {en: 'justify', fr: 'justification'}],

	['left', {en: 'left', fr: 'gauche'}],

	['leftmargin', {en: 'leftmargin', fr: 'margegauche'}],

	['letterId', {en: 'letter', fr: 'lettre'}], 

	['link', {en: 'link', fr: 'lien'}],

	['margins', {en: 'margins', fr: 'marges'}],

	['numbering', {en: 'numbering', fr: 'numérotation'}],

	['none', {en: 'none', fr: 'aucune'}],

	['of', {en: 'of', fr: 'sur'}],

	['page', {en: 'page', fr: 'page'}],

	['page x', {en: 'page x', fr: 'page x'}],

	['page x of y', {en: 'page x of y', fr: 'page x sur y'}],

	['place', {en: 'place', fr: 'lieu'}],

	['recipient', {en: 'recipient', fr: 'destinataire'}],

	['right', {en: 'right', fr: 'droite'}],

	['sender', {en: 'sender', fr: 'expéditeur'}],

	['signature', {en: 'signature', fr: 'signature'}],

	['signatureId', {en: 'signature', fr: 'signature'}],

	['signatory', {en: 'signatory', fr: 'signataire'}],

	['size', {en: 'size', fr: 'taille'}],

	['textId', {en: 'text', fr: 'texte'}],

	['treeId', {en: 'tree', fr: 'arbre'}],

	['toId', {en: 'to', fr: 'à'}],

	['top', {en: 'top', fr: 'supérieure'}],

	['window', {en: 'window', fr: 'fenêtre'}],	

	['yes', {en: 'yes', fr: 'oui'}],

	/*
		* 
			Libellés des messages d'erreurs
		*
	*/

	['errorClose', {en: 'Close', fr: 'Fermer'}],

	['errorElement', {en: 'Where are the subject and/or references?', fr: 'Où sont l’objet ou les références ?'}],

	['errorEvent', {en: 'Where are the place and the date?', fr: 'Où sont le lieu et la date ?'}],

	['errorLetter', {en: 'Where is the letter?', fr: 'Où est la lettre ?'}],

	['errorRecipient', {en: 'Where is the recipient?', fr: 'Où est le destinataire ?'}],

	['errorSender', {en: 'Where is the sender?', fr: 'Où est l’expéditeur ?'}],

	['errorTree', {en: 'Where is the data tree?', fr: 'Où est l’arbre de données ?'}],

	['errorText', {en: 'Where is the text?', fr: 'Où est le texte ?'}],

]);

/*
	*
		Arbre
	*
*/

if (!document.querySelector('#' + glossary.get('treeId')[language])) {

		createDialog(glossary.get('errorTree')[language]);

		throw new Error(glossary.get('errorTree')[language]);

}

const dataTemplate = document.querySelector('#' + glossary.get('treeId')[language]);

const dataTemplateContent = dataTemplate.content;

let dataMap = new Map();

/*
	*
		'recursiveMapBuilder(node, map)' constitue une fonction récursive pour construire la carte à partir de 'dataTemplateContent'.
	*
*/

const recursiveMapBuilderWithComments = (node, map) => {

		/*
			*
				Nous parcourons tous les enfants.
			*
		*/

	for (const child of node.children) {

		/*
			*
				Nous stockons le nom de la balise.
			*
		*/

		const tagName = child.tagName.toLowerCase();

		if (child.children.length === 0) {

			/*
				*
					Si l'enfant n'a pas d'enfants, nous ajoutons son contenu textuel à la carte avec le nom de la balise comme clef.
				*
			*/

			map.set(tagName, child.textContent);

		} else {

			/*
				*
					Si l'enfant a des enfants, nous créons une nouvelle carte pour eux.
				*
			*/

			const childMap = new Map();

			/*
				*
					Nous appelons récursivement la fonction sur l'enfant et sa nouvelle carte.
				*
			*/

			recursiveMapBuilder(child, childMap);

			/*
				*
					Nous récupérerons la valeur actuelle de la carte avec le nom de la balise comme clef.
				*
			*/

			let currentValue = map.get(tagName);

			/*
				*
					Si une valeur existe déjà, nous ajoutons la nouvelle carte à la valeur existante.
				*
			*/

			if (currentValue) {

				/*
					*
						Si la valeur actuelle n'est pas un tableau, nous la convertissons en tableau.
					*
				*/

				if (!Array.isArray(currentValue)) {

					currentValue = [currentValue];

				}

				/*
					*
						Nous ajoutons la nouvelle carte au tableau.
					*
				*/

				currentValue.push(childMap);

			} else {

				/*
					*
						Si aucune valeur n'existe encore, nous définissons la nouvelle carte comme valeur.
					*
				*/

				currentValue = childMap;

			}

			/*
				*
					Nous mettons à jour la valeur dans la carte avec le nom de la balise comme clef.
				*
			*/

			map.set(tagName, currentValue);

		}

	}

};

const recursiveMapBuilder = (node, map) => {

	for (const child of node.children) {

		const tagName = child.tagName.toLowerCase();

		if (child.children.length === 0) {

			map.set(tagName, child.textContent);

		} else {

				const childMap = new Map();

			recursiveMapBuilder(child, childMap);

			let currentValue = map.get(tagName);

			if (currentValue) {

				if (!Array.isArray(currentValue)) {

					currentValue = [currentValue];

				}

				currentValue.push(childMap);

			} else {

				currentValue = childMap;

			}

			map.set(tagName, currentValue);

		}

	}

};

recursiveMapBuilder(dataTemplateContent, dataMap);

/*
	*
		*
			Styles et options
		*
	*
*/

const escapeFontName = (fontName) => fontName.includes(' ') ? `"${fontName}"` : fontName;

const getDataOrDefault = (element, defaultValue) => element ?? defaultValue;

const fontLink = getDataOrDefault(dataMap.get(glossary.get('faces')[language]).get(glossary.get('font')[language]).get(glossary.get('link')[language]), undefined);

const cssProperties = new Map();

let fold,

fullPagination,

imageSignature;

/*
	*
		*
	*
*/

const envelopeLeftMargin = getDataOrDefault(dataMap.get(glossary.get('envelope')[language]).get(glossary.get('margins')[language]).get(glossary.get('left')[language]), '110mm');

cssProperties.set('envelopeLeftMargin', envelopeLeftMargin);

const envelopeTopMargin = getDataOrDefault(dataMap.get(glossary.get('envelope')[language]).get(glossary.get('margins')[language]).get(glossary.get('top')[language]), '58mm');

cssProperties.set('envelopeTopMargin', envelopeTopMargin);

const envelopeWindowHeight = getDataOrDefault(dataMap.get(glossary.get('envelope')[language]).get(glossary.get('window')[language]), '45mm');

cssProperties.set('envelopeWindowHeight', envelopeWindowHeight);

const fontFamily = getDataOrDefault(escapeFontName(dataMap.get(glossary.get('faces')[language]).get(glossary.get('font')[language]).get(glossary.get('family')[language])) + ',' + 'serif', 'serif');

cssProperties.set('fontFamily', fontFamily);

const fontSize = getDataOrDefault(dataMap.get(glossary.get('faces')[language]).get(glossary.get('size')[language]), '11pt');

cssProperties.set('fontSize', fontSize);

const textColor = getDataOrDefault(dataMap.get(glossary.get('faces')[language]).get(glossary.get('color')[language]), '#000');

cssProperties.set('textColor', textColor);

if (dataMap.get(glossary.get('faces')[language]).get(glossary.get('justify')[language]) === glossary.get('yes')[language])  {

	cssProperties.set('textJustify', 'justify');

} else {

	cssProperties.set('textJustify', 'start');

}

const pageMarginBottom = getDataOrDefault(dataMap.get(glossary.get('page')[language]).get(glossary.get('margins')[language]).get(glossary.get('bottom')[language]), '20mm');

cssProperties.set('pageMarginBottom', pageMarginBottom);

const pageMarginLeft = getDataOrDefault(dataMap.get(glossary.get('page')[language]).get(glossary.get('margins')[language]).get(glossary.get('left')[language]), '20mm');

cssProperties.set('pageMarginLeft', pageMarginLeft);

const pageMarginRight = getDataOrDefault(dataMap.get(glossary.get('page')[language]).get(glossary.get('margins')[language]).get(glossary.get('right')[language]), '20mm');

cssProperties.set('pageMarginRight', pageMarginRight);

const pageMarginTop = getDataOrDefault(dataMap.get(glossary.get('page')[language]).get(glossary.get('margins')[language]).get(glossary.get('top')[language]), '20mm');

cssProperties.set('pageMarginTop', pageMarginTop);

if (dataMap.get(glossary.get('page')[language]).get(glossary.get('fold')[language]) === glossary.get('yes')[language])  {

	fold = true;

} else {

	fold = false;

}

switch(dataMap.get(glossary.get('page')[language]).get(glossary.get('numbering')[language])) {

	case (glossary.get('page x of y')[language]) :

		fullPagination = true;

	break;

	case (glossary.get('page x')[language]) :

		fullPagination = false;

	break;

}

imageSignature = dataMap.get(glossary.get('signatory')[language]).get(glossary.get('signature')[language]);

/*
	*
		Lettre
	*
*/

if (!document.querySelector('#' + glossary.get('letterId')[language])) {

		createDialog(glossary.get('errorLetter')[language]);

		throw new Error(glossary.get('errorLetter')[language]);

}

const modelTemplate = document.querySelector('#' + glossary.get('letterId')[language]);

const gender = glossary.get('gender')[language];

const signataire = glossary.get('signatory')[language];

let contentElement,

contentEvent,

contentFrom,

contentTo,

contentText;

if (modelTemplate.content.querySelector('#' + glossary.get('elementId')[language])) {

	contentElement = modelTemplate.content.querySelector('#' + glossary.get('elementId')[language]);

} else {

	createDialog(glossary.get('errorElement')[language]);

	throw new Error(glossary.get('errorElement')[language]);

}

if (modelTemplate.content.querySelector('#' + glossary.get('eventId')[language])) {

	contentEvent = modelTemplate.content.querySelector('#' + glossary.get('eventId')[language]);

} else {

	createDialog(glossary.get('errorEvent')[language]);

	throw new Error(glossary.get('errorEvent')[language]);

}

if (modelTemplate.content.querySelector('#' + glossary.get('fromId')[language])) {

	contentFrom = modelTemplate.content.querySelector('#' + glossary.get('fromId')[language]);

} else {

		createDialog(glossary.get('errorSender')[language]);

		throw new Error(glossary.get('errorSender')[language]);

}

if (modelTemplate.content.querySelector('#' + glossary.get('toId')[language])) {

	contentTo = modelTemplate.content.querySelector('#' + glossary.get('toId')[language]);

} else {

		createDialog(glossary.get('errorRecipient')[language]);

		throw new Error(glossary.get('errorRecipient')[language]);

}

if (modelTemplate.content.querySelector('#' + glossary.get('textId')[language])) {

	contentText = modelTemplate.content.querySelector('#' + glossary.get('textId')[language]);

} else {

	createDialog(glossary.get('errorText')[language]);

	throw new Error(glossary.get('errorText')[language]);

}

let contentSignatory = modelTemplate.content.querySelector('#' + glossary.get('signatureId')[language]);

const elementsLetter = new Map();

const eventsLetter = new Map();

const recipientsLetter = new Map();

const sendersLetter = new Map();

const textsLetter = new Map();

const signatoriesLetter = new Map();

var recipientCount = 0;

for (let recipient of dataMap.get(glossary.get('recipient')[language])) {

	let contentToCopy = contentTo.cloneNode(true);

	for (let [key, value] of recipient) {

		let regex = new RegExp(`\\$\\{${key}\\}`, 'g');

		contentToCopy.innerHTML = contentToCopy.innerHTML.replace(regex, value);

	}

	recipientsLetter.set(recipientCount, contentToCopy.innerHTML);

	let textToCopy = contentText.cloneNode(true);

	for (let [key, value] of recipient) {

		let regex = new RegExp(`\\$\\{${key}\\}`, 'g');

		textToCopy.innerHTML = textToCopy.innerHTML.replace(regex, value);

		if (recipient.get(gender)) {

			let recipientGender = recipient.get(gender);

			textToCopy.innerHTML = textToCopy.innerHTML.replace(/<span>([^<]+)<\/span><span>([^<]+)<\/span>/g, (match, p1, p2) => {

				return recipientGender === 'H' ? p1 : p2;

    	});

		}

	}

	textsLetter.set(recipientCount, textToCopy.innerHTML);

	/*
		*
			Cloner 'contentElement', 'contentEvent', 'contentFrom' et 'contentSignatory' est évidemment inutile (il n'y a objet ou références, lieu et date, expéditeur et signataire sont uniques !), mais la compréhension ultérieure du code sera simplifiée.
		*
	*/

	let contentElementCopy = contentElement.cloneNode(true);

	for (let [key, value] of dataMap.get(glossary.get('dispatch')[language])) {

		let regex = new RegExp(`\\$\\{${key}\\}`, 'g');

		contentElement.innerHTML = contentElement.innerHTML.replace(regex, value);

	}

	elementsLetter.set(recipientCount, contentElement.innerHTML);

	let contentEventCopy = contentEvent.cloneNode(true);

	for (let [key, value] of dataMap.get(glossary.get('dispatch')[language])) {

		let regex = new RegExp(`\\$\\{${key}\\}`, 'g');

		contentEvent.innerHTML = contentEvent.innerHTML.replace(regex, value);

	}

	eventsLetter.set(recipientCount, contentEvent.innerHTML);

	let contentFromCopy = contentFrom.cloneNode(true);

	for (let [key, value] of dataMap.get(glossary.get('sender')[language])) {

		let regex = new RegExp(`\\$\\{${key}\\}`, 'g');

		contentFromCopy.innerHTML = contentFromCopy.innerHTML.replace(regex, value);

	}

	sendersLetter.set(recipientCount, contentFromCopy.innerHTML);

	if (contentSignatory) {

		let signatoryToCopy = contentSignatory.cloneNode(true);

		for (let [key, value] of dataMap.get(glossary.get('signatory')[language])) {

			let regex = new RegExp(`\\$\\{${key}\\}`, 'g');

			signatoryToCopy.innerHTML = signatoryToCopy.innerHTML.replace(regex, value);

		}

		if (imageSignature) {

			signatoryToCopy.innerHTML += `<img src=${imageSignature} />`;

		}

		signatoriesLetter.set(recipientCount, signatoryToCopy.innerHTML);

	}

	recipientCount++;

}

/*
	*
		Nous déterminons ainsi le nombre de pages, sans avoir recours à une deuxième boucle.
	*
*/

const breakPageKeyword = glossary.get('breakPageKeyword')[language];

let breaksCount = modelTemplate.content.querySelectorAll(breakPageKeyword).length;

const letters = new Map();

let lettersCount = 0;

for (let [key] of recipientsLetter) {

	/*
		*
			Nous pourrions utiliser 'for (let [key, value] of recipientsLetter)', mais nous préférons que l'appel des variables soit identique afin que la compréhension ultérieure du code soit simplifiée.
		*
	*/

	let pages = new Map();

	let pagesCount = 1;

	/*
		* 
			Début de la lettre
		*
	*/

	let page = document.createElement('div');

	page.classList.add('page');

	page.classList.add('front');

	if (fold) {

		page.classList.add('fold');

	}

	header = document.createElement('header');

	header.innerHTML = `
	<div>
		${sendersLetter.get(key)}
	</div>
	<div class="recipient">
		${recipientsLetter.get(key)}
	</div>
	<div>
		${elementsLetter.get(key)}
	</div>
	<div>
		${eventsLetter.get(key)}
	</div>
	`;

	main = document.createElement('main');

	footer = document.createElement('footer');

	footer.insertAdjacentHTML('beforeend', `<p>…/…</p>`);

	page.appendChild(header);

	page.appendChild(main);

	page.appendChild(footer);

	let article = document.createElement('article');

	if (signatoriesLetter.size !== 0) {

		article.innerHTML = textsLetter.get(key) + '<div class="signatory">' + signatoriesLetter.get(key) + '</div>';

	} else {

		article.innerHTML = textsLetter.get(key);

	}

	let elements = Array.from(article.children);

	for (const child of elements) {

		if (child.tagName.toLowerCase() === breakPageKeyword) {

			/*
				*
					Une page est créée.
				*
			*/

			pages.set(pagesCount, page);

			pagesCount++;

			page = document.createElement('div');

			page.classList.add('page');

			header = document.createElement('header');

			if (fullPagination !== undefined) {

				if (fullPagination) {

					/*
						*
							Nous mettons une majuscule à "page".
						*
					*/

					header.insertAdjacentHTML('afterbegin', `<p>${glossary.get('page')[language].charAt(0).toUpperCase()}${glossary.get('page')[language].slice(1)} ${pagesCount} ${glossary.get('of')[language]} ${breaksCount + 1}</p>`);

				} else {

					header.insertAdjacentHTML('afterbegin', `<p>${glossary.get('page')[language].charAt(0).toUpperCase()}${glossary.get('page')[language].slice(1)} ${pagesCount}</p>`);

				}

			}

			main = document.createElement('main');

			footer = document.createElement('footer');

			page.appendChild(header);

			if (breaksCount + 1 !== pagesCount) {

				footer.insertAdjacentHTML('beforeend', `<p>…/…</p>`);

			}

			page.appendChild(main);

			page.appendChild(footer);

		} else {

				let clonedChild = child.cloneNode(true);
            
				main.appendChild(clonedChild);

		}

	}

	pages.set(pagesCount, page);

	pagesCount++;

	/*
		* 
			Fin de la lettre
		*
	*/

	letters.set(lettersCount, pages);

	lettersCount++;

}

try {

	let content = document.createElement('div');

	content.id = 'content';

	document.body.insertBefore(content, document.body.firstChild);

	for (let [key, value] of cssProperties) {

		document.documentElement.style.setProperty('--' + key, value);

	}

	if (fontLink) {

		const link = document.createElement('link');

		link.href = fontLink;

		link.rel = 'stylesheet';

		document.head.appendChild(link);

	}

	for (const [keyLetters, letter] of letters.entries()) {

		for (const [key, value] of letter.entries()) {

			document.querySelector('#content').appendChild(value);

		}

	}

} catch (error) {

    console.log(error.name);

    console.log(error.message); 

}
