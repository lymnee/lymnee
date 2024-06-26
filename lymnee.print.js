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

	let buttonHTML = '<button onclick="closeDialog()" title="' + glossary.get('closeError')[language] + '">' + glossary.get('closeError')[language] + '</button>';

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

	['characters', {en: 'characters', fr: 'caractères'}],

	['color', {en: 'color', fr: 'couleur'}],

	['breakPageKeyword', {en: 'break', fr: 'saut'}],

	['date', {en: 'date', fr: 'date'}],

	['dispatch', {en: 'dispatch', fr: 'expédition'}],

	['envelope', {en: 'envelope', fr: 'enveloppe'}],

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

	['man', {en: 'man', fr: 'homme'}],

	['margins', {en: 'margins', fr: 'marges'}],

	['numbering', {en: 'numbering', fr: 'numérotation'}],

	['none', {en: 'none', fr: 'aucune'}],

	['objectId', {en: 'object', fr: 'objet'}],

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

	['timestampId', {en: 'timestamp', fr: 'horodatage'}],

	['treeId', {en: 'tree', fr: 'arbre'}],

	['toId', {en: 'to', fr: 'à'}],

	['top', {en: 'top', fr: 'supérieure'}],

	['woman', {en: 'woman', fr: 'femme'}],

	['window', {en: 'window', fr: 'fenêtre'}],	

	['yes', {en: 'yes', fr: 'oui'}],

	/*
		* 
			Libellés des messages d'erreurs
		*
	*/

	['closeError', {en: 'Close', fr: 'Fermer'}],

	['timestampError', {en: 'Where is the date?', fr: 'Où sont le lieu et la date ?'}],

	['letterError', {en: 'Where is the letter?', fr: 'Où est la lettre ?'}],

	['objectError', {en: 'Where are the object and/or references?', fr: 'Où est l’objet ou les références ?'}],

	['recipientError', {en: 'Where is the recipient?', fr: 'Où est le destinataire ?'}],

	['senderError', {en: 'Where is the sender?', fr: 'Où est l’expéditeur ?'}],

	['treeError', {en: 'Where is the data tree?', fr: 'Où est l’arbre de données ?'}],

	['textError', {en: 'Where is the text?', fr: 'Où est le texte ?'}],

]);

/*
	*
		Arbre
	*
*/

if (!document.querySelector('#' + glossary.get('treeId')[language])) {

		createDialog(glossary.get('treeError')[language]);

		throw new Error(glossary.get('treeError')[language]);

}

const dataTemplate = document.querySelector('#' + glossary.get('treeId')[language]);

const dataTemplateContent = dataTemplate.content;

let dataMap = new Map();

/*
	*
		'recursiveMapBuilder(node, map)' constitue une fonction récursive pour construire la carte à partir de 'dataTemplateContent'.
	*
*/

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

let envelopeLeftMargin = '110mm',

envelopeTopMargin= '58mm',

envelopeWindowHeight = '45mm',

fold,

fontFamily = 'serif',

fontLink,

fontSize = '11pt',

textJustify = 'start',

pageMarginBottom = '20mm',

pageMarginLeft = '20mm',

pageMarginRight = '20mm',

pageMarginTop = '20mm',

pagination,

signature;

const envelope = dataMap.get(glossary.get('envelope')[language]);

if (envelope) {

	const margins = envelope.get(glossary.get('margins')[language]);

	if (margins) {

		if (margins.get(glossary.get('left')[language])) {

			envelopeLeftMargin = margins.get(glossary.get('left')[language]);

		}

		if (margins.get(glossary.get('top')[language])) {

			envelopeTopMargin = margins.get(glossary.get('top')[language]);

		}

	}

	if (envelope.get(glossary.get('window')[language])) {

		envelopeWindowHeight = envelope.get(glossary.get('window')[language]);

	}

}

const characters = dataMap.get(glossary.get('characters')[language]);

if (characters) {

	textColor = characters.get(glossary.get('color')[language]);

	if (characters.get(glossary.get('font')[language])) {

		const police = characters.get(glossary.get('font')[language]);

		fontFamily = escapeFontName(police.get(glossary.get('family')[language]));

		fontFamily += ', ';

		fontFamily += 'serif';

		fontLink = police.get('lien');

	}

	fontSize = characters.get(glossary.get('size')[language]);

	if (characters.get(glossary.get('justify')[language]) === glossary.get('yes')[language]) {

		textJustify = 'justify';

	}

}

const page = dataMap.get(glossary.get('page')[language]);

if (page) {

	const margins = page.get(glossary.get('margins')[language]);

	if (margins) {

		if (margins.get(glossary.get('bottom')[language])) {

			pageMarginBottom = margins.get(glossary.get('bottom')[language]);

		}

		if (margins.get(glossary.get('left')[language])) {

			pageMarginLeft = margins.get(glossary.get('left')[language]);

		}

		if (margins.get(glossary.get('right')[language])) {

			pageMarginRight = margins.get(glossary.get('right')[language]);

		}

		if (margins.get(glossary.get('top')[language])) {

			pageMarginRight = margins.get(glossary.get('top')[language]);

		}

	}

	if (page.get(glossary.get('fold')[language]) === glossary.get('yes')[language]) {

		fold = true;

	}

	if (page.get(glossary.get('numbering')[language])) {

		const numbering = page.get(glossary.get('numbering')[language]);

		switch (numbering) {

			case (glossary.get('page x of y')[language]) :

				pagination = true;

			break;

			case (glossary.get('page x')[language]) :

				pagination = false;

			break;

		}

	}

}

const signatory = dataMap.get(glossary.get('signatory')[language]);

if (signatory) {

	signature = signatory.get(glossary.get('signature')[language]);

}

const cssProperties = new Map();

cssProperties.set('envelopeLeftMargin', envelopeLeftMargin);

cssProperties.set('envelopeTopMargin', envelopeTopMargin);

cssProperties.set('envelopeWindowHeight', envelopeWindowHeight);

cssProperties.set('fontFamily', fontFamily);

cssProperties.set('fontSize', fontSize);

cssProperties.set('pageMarginBottom', pageMarginBottom);

cssProperties.set('pageMarginLeft', pageMarginLeft);

cssProperties.set('pageMarginRight', pageMarginRight);

cssProperties.set('pageMarginTop', pageMarginTop);

cssProperties.set('textColor', textColor);

cssProperties.set('textJustify', textJustify);

/*
	*
		Lettre
	*
*/

if (!document.querySelector('#' + glossary.get('letterId')[language])) {

	createDialog(glossary.get('letterError')[language]);

	throw new Error(glossary.get('letterError')[language]);

}

let modelTemplate = document.querySelector('#' + glossary.get('letterId')[language]);

const gender = glossary.get('gender')[language];

const signataire = glossary.get('signatory')[language];

const fromId = glossary.get('fromId')[language];

const fromContent = modelTemplate.content.querySelector('#' + fromId);

const objectId = glossary.get('objectId')[language];

const objectContent = modelTemplate.content.querySelector('#' + objectId);

const textId = glossary.get('textId')[language];

const textContent = modelTemplate.content.querySelector('#' + textId);

const timestampId = glossary.get('timestampId')[language];

const timestampContent = modelTemplate.content.querySelector('#' + timestampId);

const toId = glossary.get('toId')[language];

const toContent = modelTemplate.content.querySelector('#' + toId);

if (!fromContent) {

	const errorReport = glossary.get('senderError')[language];

	createDialog(errorReport);

	throw new Error(errorReport);

}

if (!objectContent) {

	const errorReport = glossary.get('objectError')[language];

	createDialog(errorReport);

	throw new Error(errorReport);

}

if (!textContent) {

	const errorReport = glossary.get('textError')[language];

	createDialog(errorReport);

	throw new Error(errorReport);

}

if (!timestampContent) {

	const errorReport = glossary.get('timestampError')[language];

	createDialog(errorReport);

	throw new Error(errorReport);

}


if (!toContent) {

	const errorReport = glossary.get('recipientError')[language];

	createDialog(errorReport);

	throw new Error(errorReport);

}

const signatoryContent = modelTemplate.content.querySelector('#' + glossary.get('signatureId')[language]);

function _escapeSpecialChars(key) {
	
	return key.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

}

function _treeWalk(search, callback) {
	
	const treeWalking = new Map();
		
	let count = 1;

	switch (search) {

		case 'recipient' :

			if (dataMap.get(glossary.get('recipient')[language]).size) {
				
				/*
					*
						Une seule carte est présente, il n'y a qu'un destinataire.
					*
				*/
				
				let walkCopy = callback.cloneNode(true);

				for (let [key, value] of dataMap.get(glossary.get('recipient')[language])) {
					
					let safeKey = _escapeSpecialChars(key);
			
					let regex = new RegExp(`\\$\\{${safeKey}\\}`, 'g');

					walkCopy.innerHTML = walkCopy.innerHTML.replace(regex, value);

				}

				/*
					*
						Nous ajoutons manuellement une clef pour que le contenu s'inscrive dans la valeur.
					*
				*/
				
				treeWalking.set(count, walkCopy.innerHTML);
				
			} else {
			
				for (let recipient of dataMap.get(glossary.get('recipient')[language])) {
					
					let walkCopy = callback.cloneNode(true);

					for (let [key, value] of recipient) {
						
						let safeKey = _escapeSpecialChars(key);
				
						let regex = new RegExp(`\\$\\{${safeKey}\\}`, 'g');

						walkCopy.innerHTML = walkCopy.innerHTML.replace(regex, value);

					}

					treeWalking.set(count++, walkCopy.innerHTML);
					
				}
				
			}

		break;

		default :
			
			let walkCopy = callback.cloneNode(true);

			for (let [key, value] of dataMap.get(glossary.get(search)[language])) {
				
				let safeKey = _escapeSpecialChars(key);
		
				let regex = new RegExp(`\\$\\{${safeKey}\\}`, 'g');

				walkCopy.innerHTML = walkCopy.innerHTML.replace(regex, value);

			}
			
			treeWalking.set(count, walkCopy.innerHTML);
		
		}
	
	return treeWalking;
	
}

function _letterWalk() {

	const letterWalking = new Map();

	let count = 1;

	const recipients = dataMap.get(glossary.get('recipient')[language]);

	const processRecipient = (recipient) => {

		let walkCopy = textContent.cloneNode(true);

		for (let [key, value] of recipient) {

			let safeKey = _escapeSpecialChars(key);

			let regex = new RegExp(`\\$\\{${safeKey}\\}`, 'g');

			walkCopy.innerHTML = walkCopy.innerHTML.replace(regex, value);

		}

		let recipientGender = recipient.get(gender);

		if (recipientGender) {

			walkCopy.innerHTML = walkCopy.innerHTML.replace(/<span>([^<]+)<\/span><span>([^<]+)<\/span>/g, (match, p1, p2) => {

				return recipientGender === glossary.get('woman')[language] ? p2 : p1;
			});

		}

		if (signatoryContent) {

			let letterSigning = _treeWalk('signatory', signatoryContent);

			if (signature) {

				walkCopy.innerHTML += `<div class="signatory">${letterSigning.get(1)}<img src="${signature}" /></div>`;

			} else {

				walkCopy.innerHTML += `<div class="signatory">${letterSigning.get(1)}</div>`;
			}

		}

		return walkCopy.innerHTML;

	};

	if (recipients.size) {

		const singleRecipient = recipients;

		letterWalking.set(count, processRecipient(singleRecipient));

	} else {
	
		for (let recipient of recipients) {

			letterWalking.set(count++, processRecipient(recipient));
		
		}

	}

	return letterWalking;

}


let letterReceipting = _treeWalk('recipient', toContent);

let letterSending = _treeWalk('sender', fromContent);

let letterStamping = _treeWalk('dispatch', timestampContent);

let letterObjecting = _treeWalk('dispatch', objectContent);

let letterEditing = _letterWalk();

/*
	*
		Nous déterminons ainsi le nombre de pages, sans avoir recours à une deuxième boucle.
	*
*/

const breakPageKeyword = glossary.get('breakPageKeyword')[language];

let breaksCount = modelTemplate.content.querySelectorAll(breakPageKeyword).length;

const letters = new Map();

let lettersCount = 0;

for (let [key] of letterEditing) {

	/*
		*
			Nous pourrions utiliser 'for (let [key, value] of recipientLetters)', mais nous préférons que l'appel des variables soit identique afin que la compréhension ultérieure du code soit simplifiée.
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
		${letterSending.get(1)}
	</div>
	<div>
		${letterReceipting.get(key)}
	</div>
	<div>
		${letterObjecting.get(1)}
	</div>
	<div>
		${letterStamping.get(1)}
	</div>
	`;

	main = document.createElement('main');

	footer = document.createElement('footer');

	if (breaksCount >= 1) {

		footer.insertAdjacentHTML('beforeend', `<p>…/…</p>`);

	}

	page.appendChild(header);

	page.appendChild(main);

	page.appendChild(footer);

	let article = document.createElement('article');

	article.innerHTML = letterEditing.get(key);

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

			if (pagination !== undefined) {

				if (pagination) {

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
