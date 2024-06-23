interface ProgressData {
    [level: number]: number[];
}

interface User {
    name: string;
    surname: string;
    stat: ProgressData;
    level: number[];
    passedRound: number;
    passedLevel: number;
    isStartClick?: boolean;
    isTranslateHint?: boolean;
    isAudioHint?: boolean;
    isImageHint?: boolean;
}

export function saveToLocalStorage(obj: User): void {
    const stringifyedObj: string = JSON.stringify(obj);
    localStorage.setItem('ki8vi', stringifyedObj);
}

export function getLocalStorage(): User {
    const store = localStorage.getItem('ki8vi');
    let parsed;
    if (store) {
        parsed = JSON.parse(store);
    }
    return parsed;
}
