export function widthResizer(container: HTMLElement, allSentence: HTMLElement[][]): void {
    window.addEventListener('resize', () => {
        const puzzleHeight = container.offsetHeight / 10;
        allSentence.forEach((sentence, vertical) => {
            const words = sentence.length;
            const sliceWidth = container.offsetWidth / words;
            sentence.forEach((part, horizontal) => {
                const temp = part as HTMLElement;
                temp.style.width = `${sliceWidth}px`;
                temp.style.height = `${puzzleHeight}px`;
                temp.style.backgroundSize = `${container.offsetWidth}px ${container.offsetHeight}px`;
                temp.style.backgroundPosition = `-${horizontal * sliceWidth}px -${vertical * puzzleHeight}px`;
                // puzzle right side
                (temp.children[2] as HTMLElement).style.backgroundSize =
                    `${container.offsetWidth}px ${container.offsetHeight}px`;
                (temp.children[2] as HTMLElement).style.backgroundPosition =
                    `left -${(horizontal + 1) * sliceWidth}px top -${vertical * puzzleHeight + 10}px`;
            });
        });
    });
}
