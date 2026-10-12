/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

const vscode = acquireVsCodeApi();
const body = document.body;
const version = Number(body.dataset.version);
const input = document.getElementById('documentation-search');
const results = document.getElementById('search-results');
let searchTimer;
let scrollTimer;
let restored = false;
const send = message => vscode.postMessage({ version, ...message });
const navigate = message => send({ scrollY: window.scrollY, ...message });

function closeSearch() {
	clearTimeout(searchTimer);
	input.value = '';
	results.hidden = true;
	results.querySelector('ul').replaceChildren();
}

input.addEventListener('input', () => {
	clearTimeout(searchTimer);
	const query = input.value.trim();
	results.hidden = !query;
	results.querySelector('ul').replaceChildren();
	results.querySelector('[role="status"]').textContent = results.dataset.loading;
	if (query) { searchTimer = setTimeout(() => send({ type: 'search', query }), 150); }
});

window.addEventListener('message', event => {
	const message = event.data;
	if (message.type === 'focusSearch') {
		input.scrollIntoView({ block: 'center' });
		input.focus();
		input.select();
	}
	if (message.type !== 'searchResults' || message.query !== input.value.trim()) { return; }
	const list = results.querySelector('ul');
	list.replaceChildren();
	results.hidden = false;
	results.querySelector('[role="status"]').textContent = message.error || (message.results.length ? results.dataset.results : results.dataset.empty);
	for (const result of message.results ?? []) {
		const item = document.createElement('li');
		const link = document.createElement('a');
		link.href = '#';
		link.dataset.docId = result.documentId;
		link.dataset.docAnchor = result.anchor ?? '';
		link.textContent = result.title;
		const heading = document.createElement('span');
		heading.textContent = result.section;
		const excerpt = document.createElement('p');
		excerpt.textContent = result.text;
		item.append(link, heading, excerpt);
		list.append(item);
	}
});

document.addEventListener('click', event => {
	const target = event.target.closest('button, a');
	if (!target) { return; }
	if (target.dataset.action === 'closeSearch') {
		closeSearch();
		input.focus();
		return;
	}
	if (target.dataset.action) {
		navigate({ type: target.dataset.action });
		return;
	}
	if (target.tagName !== 'A') { return; }
	event.preventDefault();
	if (target.dataset.docAction) {
		send({ type: 'appAction', action: target.dataset.docAction });
		return;
	}
	if (target.dataset.docId) {
		navigate({ type: 'navigate', documentId: target.dataset.docId, anchor: target.dataset.docAnchor });
		return;
	}
	const href = target.getAttribute('href') ?? '';
	if (href.startsWith('#')) {
		navigate({ type: 'navigate', documentId: body.dataset.documentId, anchor: href.slice(1) });
		return;
	}
	send({ type: /^https:\/\//i.test(href) ? 'openExternal' : 'unsupportedUri', uri: href });
});

document.addEventListener('keydown', event => {
	if (event.altKey && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
		event.preventDefault();
		navigate({ type: event.key === 'ArrowLeft' ? 'back' : 'forward' });
	}
	if (event.key === 'Escape' && !results.hidden) {
		closeSearch();
		input.focus();
	}
});

const contents = document.querySelector('.documentation-contents');
const wide = window.matchMedia('(min-width: 960px)');
contents.open = wide.matches;
wide.addEventListener('change', event => { contents.open = event.matches; });

const toc = document.querySelector('.documentation-toc');
for (const heading of document.querySelectorAll('.quarto-article h2[id], .quarto-article h3[id]')) {
	const item = document.createElement('li');
	const link = document.createElement('a');
	link.href = `#${heading.id}`;
	link.textContent = heading.textContent;
	item.append(link);
	toc.querySelector('ul').append(item);
	toc.hidden = false;
}
for (const table of document.querySelectorAll('.quarto-article table')) {
	const wrapper = document.createElement('div');
	wrapper.className = 'documentation-table';
	wrapper.tabIndex = 0;
	table.before(wrapper);
	wrapper.append(table);
}

window.addEventListener('scroll', () => {
	if (!restored) { return; }
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(() => send({ type: 'scroll', scrollY: window.scrollY }), 150);
}, { passive: true });
window.addEventListener('load', () => {
	if (body.dataset.scrollY !== '') {
		window.scrollTo(0, Number(body.dataset.scrollY));
	} else if (body.dataset.initialAnchor) {
		const heading = document.getElementById(body.dataset.initialAnchor);
		if (heading) {
			heading.scrollIntoView();
			heading.tabIndex = -1;
			heading.focus({ preventScroll: true });
		}
	}
	restored = true;
	send({ type: 'ready' });
});
