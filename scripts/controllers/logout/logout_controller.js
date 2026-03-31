document.querySelector('.btn-logout').addEventListener('click', () => {
	sessionStorage.setItem('nameCommunityOrParish', '');
	location.href = 'login.html';
});