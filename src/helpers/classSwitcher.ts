export default function classSwitcher(target: HTMLInputElement | HTMLElement, className: string, flag: boolean): void {
    if (flag) {
        target.classList.add(className);
    } else {
        target.classList.remove(className);
    }
}
