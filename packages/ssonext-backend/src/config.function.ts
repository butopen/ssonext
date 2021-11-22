import {readFileSync} from "fs";
import {join, resolve} from "path";

export function loadConfig() {
    const json = readFileSync(join(__dirname, "config.json"), 'utf8')
    return JSON.parse(json)
};

export function loadMessages() {
    let p = resolve("messages_en.ts")
    const contentBuffer = readFileSync(p)
    let content = contentBuffer.toString()
    let i18n = new Function(content.replace("export default ", "return "))()
    return i18n;
}
