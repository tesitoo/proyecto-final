export function checkItemsEnCarro() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []
    return carrito.length > 0
}

export function getCookie(name, doc) {
	let cookieValue = null;
	if (doc.cookie && doc.cookie !== '') {
		const cookies = doc.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith(name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}