export default function elementAppender(target: HTMLElement, children: Array<HTMLElement>): void {
    const parent = target;
    parent.innerHTML = '';
    for (let i = 0; i < children.length; i += 1) {
        parent.append(children[i]);
    }
}
