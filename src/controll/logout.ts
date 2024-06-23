import elementAppender from '../helpers/elementAppender';
import { initGamePage, gamePage } from '../pages/gamePage/gamePage';
import { addClassTimeout } from '../pages/gamePage/gamePageHelpers';
import { form, logoutBtn, main } from '../pages/loginPage/loginPage';
import { startPage, startBtn } from '../pages/startPage/startPage';
import { getLocalStorage } from '../store/store';

logoutBtn.classList.add('logout-btn-active');
if (localStorage.getItem('ki8vi')) {
    main.append(logoutBtn, startPage);
} else {
    main.append(form);
}

export default main;

startBtn.addEventListener('click', () => {
    main.innerHTML = '';
    addClassTimeout(gamePage, 'loader-disabled', 1);
    elementAppender(main, [
        logoutBtn,
        initGamePage(
            getLocalStorage().passedLevel,
            getLocalStorage().passedRound,
            getLocalStorage().isAudioHint,
            getLocalStorage().isTranslateHint,
            getLocalStorage().isImageHint
        ),
    ]);
});
