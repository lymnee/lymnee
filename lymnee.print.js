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

const escapeFontName = (fontName) => fontName ? (fontName.includes(' ') ? `"${fontName}"` : fontName) : undefined;


const cssProperties = new Map();


/*
	*
		Enveloppe
	*
*/

let envelopeLeftMargin = '110mm';

let envelopeTopMargin = '58mm';

let envelopeWindowHeight = '45mm';

const envelopeMargins = dataMap

  .get(glossary.get('envelope')[language])

  ?.get(glossary.get('margins')[language]);

if (envelopeMargins) {

	envelopeLeftMargin = envelopeMargins.get(glossary.get('left')[language]) ?? envelopeLeftMargin;

	envelopeTopMargin = envelopeMargins.get(glossary.get('top')[language]) ?? envelopeTopMargin;

	envelopeWindowHeight = envelopeMargins.get(glossary.get('window')[language]) ?? envelopeWindowHeight;

}

cssProperties.set('envelopeLeftMargin', envelopeLeftMargin);

cssProperties.set('envelopeTopMargin', envelopeTopMargin)

cssProperties.set('envelopeWindowHeight', envelopeWindowHeight);

/*
	*
		Marges
	*
*/

let pageMarginBottom = '20mm';

let pageMarginLeft = '20mm';

let pageMarginRight = '20mm';

let pageMarginTop = '20mm';

const pageMargins = dataMap

  .get(glossary.get('page')[language])

  ?.get(glossary.get('margins')[language]);

if (pageMargins) {

	pageMarginBottom = pageMargins.get(glossary.get('left')[language]) ?? pageMarginBottom;

	pageMarginLeft = pageMargins.get(glossary.get('top')[language]) ?? pageMarginLeft;

	pageMarginRight = pageMargins.get(glossary.get('window')[language]) ?? pageMarginRight;

	pageMarginTop = pageMargins.get(glossary.get('window')[language]) ?? pageMarginTop;

}

cssProperties.set('pageMarginBottom', pageMarginBottom);

cssProperties.set('pageMarginLeft', pageMarginLeft);

cssProperties.set('pageMarginRight', pageMarginRight);

cssProperties.set('pageMarginTop', pageMarginTop);

/*
	*
		Caractères
	*
*/


const characters = dataMap.get(glossary.get('characters')[language]);

const fontFamily = escapeFontName(characters?.get(glossary.get('font')[language])?.get(glossary.get('family')[language])) ?? 'serif';

cssProperties.set('fontFamily', fontFamily);

const fontLink = characters?.get(glossary.get('font')[language])?.get(glossary.get('link')[language]) ?? '';

const fontSize = characters?.get(glossary.get('size')[language]) ?? '11pt';

cssProperties.set('fontSize', fontSize);

const textColor = characters?.get(glossary.get('color')[language]) ?? '#000';

cssProperties.set('textColor', textColor);

const justification = dataMap

	.get(glossary.get('characters')[language])

	?.get(glossary.get('justify')[language]);

cssProperties.set('textJustify', justification === glossary.get('yes')[language] ? 'justify' : 'start');

/*
	*
		Compléments
	*
*/

const fold = dataMap.get(glossary.get('page')[language])?.get(glossary.get('fold')[language]) === glossary.get('yes')[language] ?? false;

const pagination = dataMap

	.get(glossary.get('page')[language])

	?.get(glossary.get('numbering')[language]) === glossary.get('page x of y')[language] ?? false;


const signature = dataMap.get(glossary.get('signatory')[language]).get(glossary.get('signature')[language]);

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

const elements = {

  fromContent: modelTemplate.content.querySelector('#' + glossary.get('fromId')[language]),

  objectContent: modelTemplate.content.querySelector('#' + glossary.get('objectId')[language]),

  textContent: modelTemplate.content.querySelector('#' + glossary.get('textId')[language]),

  timestampContent: modelTemplate.content.querySelector('#' + glossary.get('timestampId')[language]),

  toContent: modelTemplate.content.querySelector('#' + glossary.get('toId')[language]),

};

const { fromContent, objectContent, textContent, timestampContent, toContent } = elements;

const requiredFields = [

	{ content: fromContent, errorKey: 'senderError' },

	{ content: textContent, errorKey: 'textError' },

	{ content: timestampContent, errorKey: 'timestampError' },

	{ content: toContent, errorKey: 'recipientError' }

];

requiredFields.forEach(field => {

	if (!field.content) {

		const errorReport = glossary.get(field.errorKey)[language];

		createDialog(errorReport);

		throw new Error(errorReport);

	}

});

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

	if (dataMap.get(glossary.get('recipient')[language]).size) {

			let walkCopy = textContent.cloneNode(true);

			for (let [key, value] of dataMap.get(glossary.get('recipient')[language])) {

				let safeKey = _escapeSpecialChars(key);
			
				let regex = new RegExp(`\\$\\{${safeKey}\\}`, 'g');

				walkCopy.innerHTML = walkCopy.innerHTML.replace(regex, value);

				if (dataMap.get(glossary.get('recipient')[language]).get(gender)) {

					let recipientGender = dataMap.get(glossary.get('recipient')[language]).get(gender);

					walkCopy.innerHTML = walkCopy.innerHTML.replace(/<span>([^<]+)<\/span><span>([^<]+)<\/span>/g, (match, p1, p2) => {

						return recipientGender === glossary.get('woman')[language] ? p2 : p1;

					});

				}

			}

			letterWalking.set(count, walkCopy.innerHTML);

	} else {

		for (let recipient of dataMap.get(glossary.get('recipient')[language])) {

			let walkCopy = textContent.cloneNode(true);

			for (let [key, value] of recipient) {

				let safeKey = _escapeSpecialChars(key);
			
				let regex = new RegExp(`\\$\\{${safeKey}\\}`, 'g');

				walkCopy.innerHTML = walkCopy.innerHTML.replace(regex, value);

				if (recipient.get(gender)) {

					let recipientGender = recipient.get(gender);

					walkCopy.innerHTML = walkCopy.innerHTML.replace(/<span>([^<]+)<\/span><span>([^<]+)<\/span>/g, (match, p1, p2) => {

						return recipientGender === glossary.get('woman')[language] ? p2 : p1;

					});

				}
			
			}

			letterWalking.set(count++, walkCopy.innerHTML);

		}

	}

	return letterWalking;

}

let letterReceipting = _treeWalk('recipient', toContent);

let letterSending = _treeWalk('sender', fromContent);

let letterStamping = _treeWalk('dispatch', timestampContent);

let letterObjecting = _treeWalk('dispatch', objectContent);

let letterSigning = _treeWalk('signatory', signatoryContent);

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
	<div class="recipient">
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

	footer.insertAdjacentHTML('beforeend', `<p>…/…</p>`);

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
