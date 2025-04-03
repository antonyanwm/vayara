export const createMarkerElement = ({
	documentMarker,
	documentMarkerEnd,
	targetElement,
	markerParent,
}: {
	documentMarker: number;
	documentMarkerEnd: number;
	targetElement: HTMLElement | null;
	markerParent: HTMLElement | undefined;
}) => {
	if (!targetElement) return;
	markerParent = markerParent || document.body;

	let documentLineStart: HTMLDivElement | null = null;
	let documentLineEnd: HTMLDivElement | null = null;
	let elementLineStart: HTMLDivElement | null = null;
	let elementLineEnd: HTMLDivElement | null = null;

	let textEnd = document.createElement('span');
	let textStart = document.createElement('span');
	textStart.innerHTML = 'Start';
	textEnd.innerHTML = 'End';

	documentLineStart = document.createElement('div');
	Object.assign(documentLineStart.style, {
		display: 'block',
		position: 'fixed',
		zIndex: '1000',
		left: '0',
		transform: 'none',
		width: '100%',
		height: '2px',
		backgroundColor: 'green',
		top: `${documentMarker}px`,
	});

	document.body.prepend(documentLineStart);

	documentLineEnd = document.createElement('div');
	Object.assign(documentLineEnd.style, {
		display: 'block',
		position: 'fixed',
		zIndex: '1000',
		left: '0',
		transform: 'none',
		width: '100%',
		height: '2px',
		backgroundColor: 'red',
		top: `${documentMarkerEnd}px`,
	});
	document.body.prepend(documentLineEnd);

	elementLineStart = document.createElement('div');
	elementLineStart.appendChild(textStart);
	Object.assign(elementLineStart.style, {
		display: 'block',
		position: 'absolute',
		zIndex: '1000',
		left: '0',
		transform: 'none',
		width: '10%',
		height: '2px',
		backgroundColor: 'green',
		top: `${targetElement.getBoundingClientRect().top + window.scrollY}px`,
	});
	markerParent.prepend(elementLineStart);

	elementLineEnd = document.createElement('div');
	elementLineEnd.appendChild(textEnd);
	Object.assign(elementLineEnd.style, {
		display: 'block',
		position: 'absolute',
		zIndex: '1000',
		left: '0',
		transform: 'none',
		width: '10%',
		height: '2px',
		backgroundColor: 'red',
		top: `${targetElement.getBoundingClientRect().top + window.scrollY + targetElement.clientHeight}px`,
	});
	markerParent.prepend(elementLineEnd);
	console.log(document.body.children);

	const kill = () => {
		documentLineStart?.remove();
		documentLineEnd?.remove();
		elementLineStart?.remove();
		elementLineEnd?.remove();
	};

	return { kill };
};
