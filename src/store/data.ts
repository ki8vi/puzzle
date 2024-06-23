export interface Words {
    audioExample: string;
    textExample: string;
    textExampleTranslate: string;
    id: number;
    word: string;
    wordTranslate: string;
}

export interface Level {
    id: string;
    name: string;
    imageSrc: string;
    cutSrc: string;
    author: string;
    year: string;
}

export interface Rounds {
    levelData: Level;
    words: Words[];
}

interface MyData {
    rounds: Rounds[];
    roundCount: number;
}

export async function fetchJson(url: string): Promise<MyData> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erros is: ${response.status}`);
    }

    return (await response.json()) as MyData;
}
