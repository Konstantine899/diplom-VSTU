// applicationCache.js
document.querySelectorAll('.price').forEach((node) => {
	node.textContent = new Intl.NumberFormat('ru-RU', {
		currency: 'BYN',
		style: 'currency',
	}).format(node.textContent)
})