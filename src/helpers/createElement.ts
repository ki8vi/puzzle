export function createElement(
    tagName: string,
    className: string,
    attrKey?: Array<string> | null,
    attrValue?: Array<string> | null,
    text?: string | null,
    id?: string
): HTMLElement {
    const element = document.createElement(tagName);
    element.className = className;
    if (id) {
        element.id = id;
    }
    if (attrKey && attrValue && attrKey.length === attrValue.length) {
        for (let i = 0; i < attrKey.length; i += 1) {
            element.setAttribute(attrKey[i], attrValue[i]);
        }
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}
