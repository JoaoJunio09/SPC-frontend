export function verifyAuth() {
	if (sessionStorage.getItem('nameCommunityOrParish') === null) {
		window.location.replace('../../../manutencao.html');
	}
}