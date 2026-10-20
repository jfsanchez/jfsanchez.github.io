(function () {
	'use strict';

	var year = document.getElementById && document.getElementById('year');

	if (year && typeof Date === 'function') {
		year.textContent = Math.max(new Date().getFullYear(), 2026);
	}

	window.onload = function () {
		document.body.classList.remove('is-preload');
	};

	window.ontouchmove = function () {
		return false;
	};

	window.onorientationchange = function () {
		document.body.scrollTop = 0;
	};
})();
