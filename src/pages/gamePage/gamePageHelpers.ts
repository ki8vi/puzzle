import { createElement } from '../../helpers/createElement';
import elementAppender from '../../helpers/elementAppender';
import { getLocalStorage, saveToLocalStorage } from '../../store/store';

export function imageSlicer(imageUrl: string, sentence: string[], container: HTMLElement): Promise<HTMLElement[][]> {
    return new Promise((resolve) => {
        const img = new Image();
        const allSentence: HTMLElement[][] = [];
        img.onload = () => {
            // console.log(sentence);
            const puzzleHeight = container.offsetHeight / 10;
            for (let vertical = 0; vertical < 10; vertical += 1) {
                const words = sentence[vertical].split(' ');
                const lengthOfSentence = words.length;
                const sliceWidth = container.offsetWidth / lengthOfSentence;
                // const sliceWidth = 100 / lengthOfSentence;
                const currSentence: HTMLElement[] = [];
                for (let horizontal = 0; horizontal < lengthOfSentence; horizontal += 1) {
                    const part = createElement('div', 'part');
                    const partLeft = createElement('div', 'part-left');
                    const partRight = createElement('div', 'part-right');
                    const textPart = createElement('span', 'part-text');
                    part.style.width = `${sliceWidth}px`;
                    // part.style.width = `${sliceWidth}%`;
                    part.style.height = `${puzzleHeight}px`;
                    part.style.backgroundImage = `url(${imageUrl})`;
                    part.style.backgroundSize = `${container.offsetWidth}px ${container.offsetHeight}px`;
                    part.style.backgroundPosition = `left -${horizontal * sliceWidth}px top -${vertical * puzzleHeight}px`;
                    // puzzle
                    partRight.style.backgroundImage = `url(${imageUrl})`;
                    partRight.style.backgroundSize = `${container.offsetWidth}px ${container.offsetHeight}px`;
                    // partRight.style.backgroundPosition = `-${horizontal * sliceWidth + sliceWidth + 10}px -${(vertical * puzzleHeight) / 2}px`;
                    partRight.style.backgroundPosition = `left -${(horizontal + 1) * sliceWidth}px top -${vertical * puzzleHeight + 10}px`;
                    textPart.textContent = words[horizontal];
                    part.append(partLeft, textPart, partRight);
                    currSentence.push(part);
                }
                allSentence.push(currSentence);
            }
            resolve(allSentence);
        };
        img.src = imageUrl;
    });
}

export function shuffle(arr: HTMLElement[]): HTMLElement[] {
    const output: HTMLElement[] = [...arr];
    arr.forEach((el, i) => {
        el.setAttribute('id', `${i}`);
        el.setAttribute('draggable', 'true');
        if (i === 0) {
            const leftSide = el as HTMLElement;
            (leftSide.children[i] as HTMLElement).style.display = 'none';
        }
        if (i === arr.length - 1) {
            const rightSide = el as HTMLElement;
            if (rightSide.children[2]) {
                (rightSide.children[2] as HTMLElement).style.display = 'none';
            }
        }
    });
    for (let i = output.length - 1; i > 0; i -= 1) {
        const random = Math.floor(Math.random() * (i + 1));
        const temp = output[i];
        output[i] = output[random];
        output[random] = temp;
    }
    return output;
}

export function renderSentence(data: HTMLElement[][], row: number, target: HTMLElement): void {
    elementAppender(target, shuffle(data[row]));
}

export function addClassTimeout(targetEl: HTMLElement, className: string, time: number): void {
    targetEl.classList.add(className);
    setTimeout(() => {
        targetEl.classList.remove(className);
    }, time);
}

export function elementConverter(currEl: HTMLElement, index: number) {
    const tempRowDom = Array.from(currEl.children)[index];
    return Array.from(tempRowDom.children) as HTMLElement[];
}

export function checkSentence(currRow: Element[], sourceRow: HTMLElement[]): void {
    const temp = currRow as HTMLElement[];
    if (temp.length === sourceRow.length) {
        for (let i = 0; i < temp.length; i += 1) {
            if (sourceRow[i].id !== currRow[i].id) {
                addClassTimeout(temp[i], 'incorrect-word', 2000);
            }
        }
    }
}

export function isAllElements(
    elements: Element[],
    checkClass: string,
    sourceRow: HTMLElement[],
    isSentCorrect: boolean
): boolean {
    const temp = elements as HTMLElement[];
    const isSameLength = temp.length === sourceRow.length;
    return temp.every((el) => el.className.includes(checkClass)) && isSameLength && isSentCorrect;
}

export function createEmptyRow(data: HTMLElement[], index: number, target: HTMLElement): void {
    // const elem = data.children;
    // console.log(elem);
    const newRow = createElement('div', `row${index} row`);
    for (let i = 0; i < data.length; i += 1) {
        const emptyDiv = createElement('div', 'empty', ['draggable'], ['true']);
        const style = getComputedStyle(data[i] as HTMLElement);
        const { width, height } = style;
        emptyDiv.style.width = `${width}`;
        emptyDiv.style.height = `${height}`;
        newRow.append(emptyDiv);
    }
    target.append(newRow);
}

export function imageRevealer(container: HTMLElement | Element, flag: boolean): void {
    if (container) {
        Array.from(container.children).forEach((el) => {
            const element = el as HTMLElement;
            if (el.className.includes('part')) {
                if (!flag) {
                    element.classList.add('image-hint-active');
                    (element.children[2] as HTMLElement).classList.add('image-hint-active');
                } else {
                    element.classList.remove('image-hint-active');
                    (element.children[2] as HTMLElement).classList.remove('image-hint-active');
                }
            }
        });
    }
}

export function setOptions(dataLength: number, appendContainer: HTMLSelectElement) {
    const isLevel = appendContainer.id === 'level';
    const tempContainer = appendContainer;
    tempContainer.innerHTML = '';
    for (let i = isLevel ? 1 : 0; i < dataLength; i += 1) {
        const options = createElement('option', 'options', null, null, `${isLevel ? i : i + 1}`) as HTMLOptionElement;
        options.value = i.toString();
        tempContainer.appendChild(options);
    }
}

export function drawPassedRound(passRounds: number[] | undefined, select: HTMLSelectElement): void {
    if (passRounds) {
        passRounds.forEach((el) => {
            if (select.options[el]) {
                select.options[el].classList.add('passed-round');
            }
        });
    }
}

export function setPassedRounds(round: number, level: number) {
    const user = getLocalStorage();
    if (!user.stat[level].includes(round)) {
        user.stat[level].push(round);
    }
    saveToLocalStorage(user);
}

export function elementIntegrator(
    arr: [string, string][],
    elType: string,
    className: string,
    appendTarget: HTMLElement
): void {
    const temp = appendTarget;
    temp.innerHTML = '';
    for (let i = 0; i < arr.length; i += 1) {
        const [textContent] = arr[i];
        const statSentanceWrapper = createElement('div', 'stat-sentence');
        const element = createElement(elType, className);
        const audionIcon = createElement('img', 'statistic-audio', ['src'], ['./assets/voice-icon.png']);
        statSentanceWrapper.append(audionIcon, element);
        element.textContent = textContent;
        temp.append(statSentanceWrapper);
    }
}
