import './gamePage.css';
import { createElement } from '../../helpers/createElement';
import { Level, fetchJson, Words } from '../../store/data';
import {
    addClassTimeout,
    checkSentence,
    createEmptyRow,
    drawPassedRound,
    elementConverter,
    elementIntegrator,
    imageRevealer,
    imageSlicer,
    isAllElements,
    renderSentence,
    setOptions,
    setPassedRounds,
} from './gamePageHelpers';
import { widthResizer } from './widthResizer';
import { logoutBtn } from '../loginPage/loginPage';
import { getLocalStorage, saveToLocalStorage } from '../../store/store';
import classSwitcher from '../../helpers/classSwitcher';
import elementAppender from '../../helpers/elementAppender';
// global variables
let isPageStart: boolean = false;
let isAutocompleteClicked: boolean = false;
let isSentenceCorrect: boolean = false;
let authorData: Level;
let isNextRound: boolean = false;
let copyData: HTMLElement[][] = [];
let wordsExample: Words[];
const resultArea = createElement('div', 'result-area');
const sourceArea = createElement('div', 'source-area');
const btnsContainer = createElement('div', 'btn-container');
const continueBtn = createElement('button', 'btn btn-disabled continue-btn', null, null, 'check');
const autoCompleteBtn = createElement('button', 'btn', null, null, 'auto-help');
const questionHintBtn = createElement(
    'img',
    'hint-btn question',
    ['src', 'alt'],
    ['./assets/question-hint.png', 'translate-hint']
);
const resultsBtn = createElement('button', 'result-btn', null, null, 'RESULTS');
const audioBtn = createElement('img', 'hint-btn audio-hint', ['src', 'alt'], ['./assets/audio.png', 'audio-hint']);
const voiceBtn = createElement('img', 'voice-btn', ['src', 'alt'], ['./assets/voice-icon.png', 'voice-hint']);
const imageBtn = createElement('img', 'hint-btn', ['src', 'alt'], ['./assets/image.png', 'background-hint']);
const hintsContainer = createElement('div', 'hints-container');
const selectContainer = createElement('div', 'select-container');
hintsContainer.append(questionHintBtn, audioBtn, imageBtn);
const statMiniature = createElement('div', 'stat-miniature');
const statTitle = createElement('p', 'stat-title');
const loader = createElement('div', 'loader');
const loaderTitle = createElement('p', 'loader-title', null, null, 'LOADING...');
loader.append(loaderTitle);
const textTranslate = createElement('p', 'text-translate text-translate-active');
// selects
const labelLevel = createElement('label', 'label', ['for'], ['level'], 'LEVEL');
const labelRound = createElement('label', 'label', ['for'], ['round'], 'ROUND');
const selectLevel = createElement('select', 'select', ['id'], ['level']) as HTMLSelectElement;
const selectRound = createElement('select', 'select', ['id'], ['round']) as HTMLSelectElement;
selectContainer.append(labelLevel, selectLevel, labelRound, selectRound);
const firstChildGamePage = createElement('div', 'first-container');
firstChildGamePage.append(selectContainer, voiceBtn);
const statisticModal = createElement('div', 'stat-modal');
const statisticBody = createElement('div', 'stat-body');
statisticModal.append(statisticBody);
const nextBtn = createElement('button', 'btn next-btn', null, null, 'next');
export const gamePage = createElement('section', 'game-page');
const knownContainer = createElement('div', 'known-wrapper');
const unknownContainer = createElement('div', 'known-wrapper');
const itemsWrapper = createElement('div', 'items-wrapper');
const knownTitle = createElement('span', 'known-title', null, null, 'KNOWN');
const unknownTitle = createElement('span', 'unknown-title', null, null, 'UNKNOWN');
itemsWrapper.append(knownTitle, knownContainer, unknownTitle, unknownContainer);
statisticBody.append(statMiniature, statTitle, itemsWrapper, nextBtn);
let known: [string, string][] = [];
let unknown: [string, string][] = [];
let currImage: string;
let currRow: number = 0;
let currentLevel: number = 1;
let currentRound: number = 0;
let roundLength: number;
let draggedElem: HTMLElement;
let isTranslateBtnCliked: boolean = false;
let isAudioBtnCliked: boolean = false;
let isImgBtnCliked: boolean = false;
let isImageShow: boolean = false;
const globalUrl = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';
let miniatureUrl: string;
function dragOver(e: Event) {
    e.preventDefault();
    // const target = e.target as HTMLElement;
    // target.style.zIndex = 'auto';
}
function dragEnter(e: Event) {
    const target = e.target as HTMLElement;
    target.style.backgroundColor = '#FFA07A';
}
function dragLeave(e: Event) {
    const target = e.target as HTMLElement;
    target.style.backgroundColor = '';
    target.style.zIndex = 'auto';
}
function dropEvent(e: Event) {
    // e.preventDefault();
    const target = e.target as HTMLElement;
    target.style.backgroundColor = '';
    target.style.zIndex = 'auto';
    const parent = target.parentElement as HTMLElement;
    const indexOfCurr = Array.from(parent.children).indexOf(target);
    const parentArr = Array.from(parent.children);
    const sourceArr = Array.from(sourceArea.children);
    if (
        draggedElem.parentElement?.className === `row${currRow} row` &&
        draggedElem.parentElement !== sourceArea &&
        target.parentElement?.className === `row${currRow} row`
    ) {
        const temp = document.createElement('div');
        temp.className = 'empty';
        parent.insertBefore(temp, target);
        if (draggedElem) {
            draggedElem.parentElement.insertBefore(target, draggedElem);
            if (temp.parentNode) {
                temp.parentNode.insertBefore(draggedElem, temp);
                temp.parentNode.removeChild(temp);
            }
        }
    }
    if (
        target.className === 'empty' &&
        draggedElem.parentElement === sourceArea &&
        (draggedElem.className === 'part' || draggedElem.className.includes('part')) &&
        target.parentElement?.className === `row${currRow} row`
    ) {
        const draggedElemIndex = sourceArr.indexOf(draggedElem);
        parent.replaceChild(draggedElem, parentArr[indexOfCurr]);
        sourceArea.insertBefore(target, sourceArea.children[draggedElemIndex]);
    }
    if (parent.className === `row${currRow} row` && draggedElem.parentElement === sourceArea) {
        const nextElement = parentArr[indexOfCurr + 1];
        const reversedArr = [...parentArr].reverse();
        const firstEmpty = reversedArr.find((el) => el.className === 'empty');
        if (nextElement) {
            parent.insertBefore(draggedElem, parentArr[indexOfCurr]);
            parent.insertBefore(target, nextElement);
        } else {
            parent.replaceChild(draggedElem, parentArr[indexOfCurr]);
            parent.insertBefore(target, draggedElem);
        }
        if (firstEmpty) {
            sourceArea.insertBefore(firstEmpty, sourceArea.children[sourceArr.indexOf(draggedElem)]);
        }
    }
    const currRowDom = Array.from(resultArea.children)[currRow];
    const currRowDomChildren = Array.from(currRowDom.children);
    if (isAllElements(currRowDomChildren, 'part', copyData[currRow], !isSentenceCorrect)) {
        continueBtn.classList.remove('btn-disabled');
    } else {
        continueBtn.classList.add('btn-disabled');
    }
    Array.from(sourceArea.children).forEach((el) => {
        const element = el as HTMLElement;
        if (!element.className.includes('part')) {
            element.removeAttribute('draggable');
            element.style.pointerEvents = 'none';
            element.removeEventListener('drop', dropEvent, false);
            element.removeEventListener('dragover', dragOver, false);
            element.removeEventListener('dragenter', dragEnter, false);
            element.removeEventListener('dragleave', dragLeave, false);
        }
    });
    if (copyData[currRow].map((el) => el.id).toString() === currRowDomChildren.map((el) => el.id).toString()) {
        const texted = copyData[currRow].map((el) => el.textContent).join(' ');
        const currentSentence: [string, string] = [texted, `${globalUrl}${wordsExample[currRow].audioExample}`];
        known.push(currentSentence);
        isSentenceCorrect = true;
        currRow += 1;
        if (currRow === 10) {
            isNextRound = true;
            currentRound += 1;
            currRow = 0;
        }
        continueBtn.textContent = 'continue';
        addClassTimeout(continueBtn, 'btn-transform', 500);
        continueBtn.classList.remove('btn-disabled');
        autoCompleteBtn.classList.add('btn-disabled');
        if (!isTranslateBtnCliked) {
            textTranslate.classList.add('text-translate-active');
        }
        if (!isAudioBtnCliked) {
            voiceBtn.classList.add('text-translate-active');
        }
        imageRevealer(currRowDom, isSentenceCorrect);
    }
}

function dragStart(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    Array.from(resultArea.children).forEach((el, i) => {
        const children = Array.from(el.children) as HTMLElement[];
        if (i === currRow) {
            children.forEach((child) => {
                child.addEventListener('drop', dropEvent, false);
                child.addEventListener('dragover', dragOver, false);
                child.addEventListener('dragenter', dragEnter, false);
                child.addEventListener('dragleave', dragLeave, false);
            });
        } else {
            children.forEach((child) => {
                child.removeEventListener('drop', dropEvent, false);
                child.removeEventListener('dragover', dragOver, false);
                child.removeEventListener('dragenter', dragEnter, false);
                child.removeEventListener('dragleave', dragLeave, false);
            });
        }
    });
    if (target.className.includes('part') || target.className === 'part') {
        draggedElem = target;
        target.style.zIndex = '1';
        // if (!target.className.includes('image-hint-active')) {
        //     // target.style.opacity = '0';
        // }
    } else {
        e.preventDefault();
    }
}
function dragEnd(e: Event) {
    const target = e.target as HTMLElement;
    if (target.className.includes('part')) {
        target.style.zIndex = 'auto';
    }
}

function dragDrop() {
    Array.from(sourceArea.children).forEach((element) => {
        element.addEventListener('dragstart', dragStart, true);
        element.addEventListener('dragend', dragEnd, false);
        element.addEventListener('dragover', dragOver, false);
        element.addEventListener('dragenter', dragEnter, false);
        element.addEventListener('dragleave', dragLeave, false);
        element.addEventListener('drop', dropEvent, false);
    });
}
// INIT
export function initGamePage(
    level: number,
    round: number,
    audioHint: boolean = true,
    translateHint: boolean = true,
    imgHint: boolean = true
) {
    currRow = 0;
    isNextRound = false;
    isPageStart = false;
    isTranslateBtnCliked = translateHint;
    isAudioBtnCliked = audioHint;
    isImgBtnCliked = imgHint;
    currentLevel = level;
    currentRound = round;
    sourceArea.innerHTML = '';
    sourceArea.classList.remove('author-active');
    hintsContainer.classList.remove('loader-disabled');
    addClassTimeout(hintsContainer, 'loader-disabled', 500);
    // $$$
    btnsContainer.append(autoCompleteBtn, continueBtn);
    resultsBtn.remove();
    continueBtn.textContent = 'check';
    continueBtn.classList.add('btn-disabled');
    autoCompleteBtn.classList.remove('btn-disabled');
    loader.classList.remove('loader-disabled');
    isImageShow = false;
    isSentenceCorrect = false;
    statisticModal.classList.remove('stat-modal-active');
    // $$$
    classSwitcher(questionHintBtn, 'btn-active', isTranslateBtnCliked);
    classSwitcher(audioBtn, 'btn-active', isAudioBtnCliked);
    classSwitcher(imageBtn, 'btn-active', isImgBtnCliked);
    classSwitcher(voiceBtn, 'text-translate-active', isAudioBtnCliked);
    classSwitcher(textTranslate, 'text-translate-active', isTranslateBtnCliked);
    gamePage.innerHTML = '';
    resultArea.innerHTML = '';
    resultArea.style.backgroundImage = '';
    known = [];
    unknown = [];
    gamePage.append(
        firstChildGamePage,
        textTranslate,
        hintsContainer,
        resultArea,
        sourceArea,
        btnsContainer,
        loader,
        statisticModal
    );
    const jsonUrl = `${globalUrl}data/wordCollectionLevel${level}.json`;
    fetchJson(jsonUrl)
        .then((data) => {
            roundLength = data.rounds.length;
            setOptions(data.rounds.length, selectRound);
            setOptions(7, selectLevel);
            selectLevel.value = currentLevel.toString();
            selectRound.value = currentRound.toString();
            drawPassedRound(getLocalStorage().stat[currentLevel], selectRound);
            drawPassedRound(getLocalStorage().level, selectLevel);
            authorData = data.rounds[round].levelData;
            wordsExample = data.rounds[round].words;
            const arrTexts: string[] = [];
            data.rounds[round].words.forEach((el) => arrTexts.push(el.textExample));
            const currImg = `${globalUrl}images/${data.rounds[round].levelData.imageSrc}`;
            miniatureUrl = `${globalUrl}images/${data.rounds[round].levelData.cutSrc}`;
            imageSlicer(currImg, arrTexts, resultArea).then((dataSent) => {
                loader.classList.add('loader-disabled');
                copyData = [...dataSent];
                renderSentence(dataSent, currRow, sourceArea);
                imageRevealer(sourceArea, isImgBtnCliked);
                if (!isPageStart) {
                    isPageStart = true;
                    createEmptyRow(copyData[currRow], currRow, resultArea);
                    dragDrop();
                    textTranslate.textContent = data.rounds[round].words[currRow].textExampleTranslate;
                }
                widthResizer(resultArea, dataSent);
            });
            currImage = currImg;
        })
        .catch((error) => console.error('Error is:', error));
    return gamePage;
}

let idNumber: number = 0;
sourceArea.addEventListener('click', (e) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target && target.classList.contains('part')) {
        addClassTimeout(target, 'part-replaced', 200);
        let rowDiv = resultArea.children[currRow];
        if (!rowDiv) {
            rowDiv = createElement('div', `row${currRow} row`);
            idNumber += 1;
            rowDiv.setAttribute('id', `${idNumber}`);
            rowDiv.setAttribute('draggable', 'true');
            resultArea.append(rowDiv);
        }
        const emptyElement = createElement('div', 'empty');
        emptyElement.style.width = `${target.offsetWidth}px`;
        emptyElement.style.height = `${target.offsetHeight}px`;
        sourceArea.replaceChild(emptyElement, target);
        if (sourceArea.contains(target)) {
            sourceArea.removeChild(target);
        }
        const emptyDiv = rowDiv.querySelector('.empty');
        if (emptyDiv) {
            rowDiv.replaceChild(target, emptyDiv);
        } else {
            rowDiv.append(target);
        }
        const currRowDom = Array.from(resultArea.children)[currRow];
        const currRowDomChildren = Array.from(currRowDom.children);
        if (copyData[currRow].map((el) => el.id).toString() === currRowDomChildren.map((el) => el.id).toString()) {
            const texted = copyData[currRow].map((el) => el.textContent).join(' ');
            const currentSentence: [string, string] = [texted, `${globalUrl}${wordsExample[currRow].audioExample}`];
            known.push(currentSentence);
            isSentenceCorrect = true;
            currRow += 1;
            if (currRow === 10) {
                setPassedRounds(currentRound, currentLevel);
                isNextRound = true;
                currentRound += 1;
                currRow = 0;
            }
            continueBtn.textContent = 'continue';
            addClassTimeout(continueBtn, 'btn-transform', 500);
            continueBtn.classList.remove('btn-disabled');
            autoCompleteBtn.classList.add('btn-disabled');
            if (!isTranslateBtnCliked) {
                textTranslate.classList.add('text-translate-active');
            }
            if (!isAudioBtnCliked) {
                voiceBtn.classList.add('text-translate-active');
            }
            imageRevealer(currRowDom, isSentenceCorrect);
        }
        if (isAllElements(currRowDomChildren, 'part', copyData[currRow], !isSentenceCorrect)) {
            continueBtn.classList.remove('btn-disabled');
            addClassTimeout(continueBtn, 'btn-transform', 500);
        }
    }
});

resultArea.addEventListener(
    'click',
    (e) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (target && target.classList.contains('part') && target.parentElement?.classList.contains(`row${currRow}`)) {
            addClassTimeout(target, 'part-replaced', 1000);
            const childrenSource = Array.from(sourceArea.children);
            const emptyPuzzle = childrenSource.find((child) => child.classList.contains('empty'));
            if (emptyPuzzle) {
                const tempEmpty = emptyPuzzle;
                const currParent = Array.from(resultArea.children);
                const childrenArray = Array.from(currParent[currRow].children);
                const indexCurrEl = childrenArray.indexOf(target);
                const newEmptyDiv = createElement('div', 'empty');
                sourceArea.replaceChild(target, tempEmpty);
                newEmptyDiv.style.width = `${target.offsetWidth}px`;
                newEmptyDiv.style.height = `${target.offsetHeight}px`;
                if (indexCurrEl >= 0 && indexCurrEl < childrenArray.length) {
                    currParent[currRow].insertBefore(newEmptyDiv, childrenArray[indexCurrEl + 1]);
                }
            }
            const currRowDom = Array.from(resultArea.children)[currRow];
            const currRowDomChildren = Array.from(currRowDom.children);
            if (isAllElements(currRowDomChildren, 'part', copyData[currRow], !isSentenceCorrect)) {
                continueBtn.classList.remove('btn-disabled');
            } else {
                continueBtn.classList.add('btn-disabled');
            }
        }
    },
    true
);

function startNextRound(round: number, level: number) {
    const main = document.body.querySelector('main') as HTMLElement;
    main.innerHTML = '';
    main.append(initGamePage(level, round, isAudioBtnCliked, isTranslateBtnCliked, isImgBtnCliked), logoutBtn);
}

const saveStatAndGo = () => {
    voiceBtn.classList.add('text-translate-active');
    textTranslate.classList.add('text-translate-active');
    startNextRound(currentRound, currentLevel);
    const user = getLocalStorage();
    user.passedLevel = currentLevel;
    user.passedRound = currentRound;
    saveToLocalStorage(user);
    isImageShow = false;
};

continueBtn.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.textContent === 'continue' && isSentenceCorrect) {
        isAutocompleteClicked = false;
        isSentenceCorrect = false;
        if (currentRound === roundLength) {
            if (getLocalStorage().stat[currentLevel].length === roundLength) {
                const user = getLocalStorage();
                if (!user.level.includes(currentLevel - 1)) {
                    user.level.push(currentLevel - 1);
                    saveToLocalStorage(user);
                }
            }
            currentRound = 0;
            currentLevel += 1;
            if (currentLevel > 6) {
                currentLevel = 1;
            }
        }
        if (isNextRound) {
            if (!isImageShow) {
                voiceBtn.classList.remove('text-translate-active');
                sourceArea.classList.add('author-active');
                hintsContainer.classList.add('loader-disabled');
                textTranslate.classList.remove('text-translate-active');
                isSentenceCorrect = true;
                addClassTimeout(resultArea, 'd-none', 10);
                addClassTimeout(resultArea, 'loader-disabled', 100);
                addClassTimeout(sourceArea, 'd-none', 10);
                addClassTimeout(sourceArea, 'loader-disabled', 100);
                resultArea.innerHTML = '';
                resultArea.style.backgroundImage = `url(${currImage})`;
                elementAppender(sourceArea, [
                    createElement('span', 'author', null, null, authorData.name),
                    createElement('span', 'author', null, null, authorData.author),
                    createElement('span', 'author', null, null, authorData.year),
                ]);
                isImageShow = true;
                btnsContainer.replaceChild(resultsBtn, autoCompleteBtn);
                addClassTimeout(resultsBtn, 'loader-disabled', 100);
                elementIntegrator(known, 'span', 'stat-item', knownContainer);
                elementIntegrator(unknown, 'span', 'stat-item', unknownContainer);
                statMiniature.style.backgroundImage = `url(${miniatureUrl})`;
                statTitle.textContent = `${authorData.name} - ${authorData.author} - ${authorData.year}`;
            } else {
                saveStatAndGo();
            }
        } else {
            renderSentence(copyData, currRow, sourceArea);
            continueBtn.classList.remove('btn-disabled');
        }
        imageRevealer(sourceArea, isImgBtnCliked);
        if (!isImageShow) {
            continueBtn.classList.add('btn-disabled');
            target.textContent = 'check';
            autoCompleteBtn.classList.remove('btn-disabled');
        }
        if (isPageStart) {
            createEmptyRow(copyData[currRow], currRow, resultArea);
        }
        dragDrop();
        if (!isTranslateBtnCliked) {
            textTranslate.classList.remove('text-translate-active');
        }
        if (!isAudioBtnCliked) {
            voiceBtn.classList.remove('text-translate-active');
        }
        setTimeout(() => {
            textTranslate.textContent = wordsExample[currRow].textExampleTranslate;
        }, 100);
        return;
    }
    if (target.textContent === 'check' && !isSentenceCorrect) {
        checkSentence(elementConverter(resultArea, currRow), copyData[currRow]);
    }
});

autoCompleteBtn.addEventListener('click', () => {
    isAutocompleteClicked = true;
    const sorted = copyData[currRow];
    const texted = copyData[currRow].map((el) => el.textContent).join(' ');
    const currentSentence: [string, string] = [texted, `${globalUrl}${wordsExample[currRow].audioExample}`];
    unknown.push(currentSentence);
    const row = createElement('div', `row${currRow} row`);
    row.append(...sorted);
    addClassTimeout(row, 'row-opacity', 100);
    resultArea.replaceChild(row, resultArea.children[currRow]);
    imageRevealer(resultArea.children[currRow], isAutocompleteClicked);
    currRow += 1;
    if (currRow === 10) {
        setPassedRounds(currentRound, currentLevel);
        currRow = 0;
        currentRound += 1;
        isNextRound = true;
    }
    isSentenceCorrect = true;
    continueBtn.textContent = 'continue';
    addClassTimeout(continueBtn, 'btn-transform', 500);
    continueBtn.classList.remove('btn-disabled');
    autoCompleteBtn.classList.add('btn-disabled');
    if (!isTranslateBtnCliked) {
        textTranslate.classList.add('text-translate-active');
    }
    if (!isAudioBtnCliked) {
        voiceBtn.classList.add('text-translate-active');
    }
});
const audio = new Audio();
hintsContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target === hintsContainer) return;
    if (e.target === questionHintBtn) {
        questionHintBtn.classList.toggle('btn-active');
        isTranslateBtnCliked = !isTranslateBtnCliked;
        if (isTranslateBtnCliked) {
            textTranslate.classList.add('text-translate-active');
        } else {
            textTranslate.classList.remove('text-translate-active');
        }
    }
    if (e.target === audioBtn) {
        isAudioBtnCliked = !isAudioBtnCliked;
        audioBtn.classList.toggle('btn-active');
        if (isAudioBtnCliked) {
            voiceBtn.classList.add('text-translate-active');
        } else {
            voiceBtn.classList.remove('text-translate-active');
        }
    }
    if (e.target === imageBtn) {
        isImgBtnCliked = !isImgBtnCliked;
        imageRevealer(sourceArea, isImgBtnCliked);
        imageBtn.classList.toggle('btn-active');
    }
    const userObj = getLocalStorage();
    userObj.isTranslateHint = isTranslateBtnCliked;
    userObj.isAudioHint = isAudioBtnCliked;
    userObj.isImageHint = isImgBtnCliked;
    saveToLocalStorage(userObj);
});

voiceBtn.addEventListener('click', () => {
    let tempIndex = 0;
    if (isSentenceCorrect || isAutocompleteClicked) {
        tempIndex = -1;
    }
    if (isNextRound) {
        tempIndex = 9;
    }
    const audioUrl = `${globalUrl}${wordsExample[currRow + tempIndex].audioExample}`;
    audio.src = audioUrl;
    audio.addEventListener('play', () => {
        voiceBtn.classList.add('voice-animation');
    });
    audio.addEventListener('ended', () => {
        voiceBtn.classList.remove('voice-animation');
    });
    if (audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }
});

selectContainer.addEventListener('change', (e) => {
    const select = e.target as HTMLSelectElement;
    if (select.id === 'level') {
        currentLevel = +select.value;
        currentRound = 0;
    }
    if (select.id === 'round') {
        currentRound = +select.value;
    }
    resultArea.style.backgroundImage = '';
    startNextRound(currentRound, currentLevel);
});

resultsBtn.addEventListener('click', () => {
    statisticModal.classList.add('stat-modal-active');
});

nextBtn.addEventListener('click', () => {
    saveStatAndGo();
    statisticModal.classList.remove('stat-modal-active');
});

let currentAudio: HTMLAudioElement | null = null;
const audioMap: Map<string, HTMLAudioElement> = new Map();

async function playStatAudio(e: Event, arr: [string, string][], container: HTMLElement) {
    const target = e.target as HTMLElement;
    if (target.className === 'statistic-audio') {
        if (target.parentElement?.className === 'stat-sentence') {
            const clickedIndex = Array.from(container.children).indexOf(target.parentElement);
            let audioStat = audioMap.get(arr[clickedIndex][1]);
            if (!audioStat) {
                audioStat = new Audio(arr[clickedIndex][1]);
                audioMap.set(arr[clickedIndex][1], audioStat);
            }
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            try {
                await audioStat.play();
                currentAudio = audioStat;
            } catch {
                console.log('Не нажимайте так часто плисссс!');
            }
        }
    }
}

knownContainer.addEventListener('click', (e) => playStatAudio(e, known, knownContainer));
unknownContainer.addEventListener('click', (e) => playStatAudio(e, unknown, unknownContainer));
