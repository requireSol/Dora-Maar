export function getTextMetrics(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextMetrics.canvas || (getTextMetrics.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text);
}