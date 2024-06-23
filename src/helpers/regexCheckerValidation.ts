export function regexChecker(target: string, regex: RegExp): boolean {
    return regex.test(target);
}
