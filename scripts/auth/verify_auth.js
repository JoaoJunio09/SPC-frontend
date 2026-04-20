export function verifyAuth() {
	if (sessionStorage.getItem('communityOrParish') === null) {
		window.location.replace('../../../login.html');
	}
}