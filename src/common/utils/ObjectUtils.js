export function isValueOfObject(value, object) {
    for (const v of Object.values(object)) {
        if (v === value) {
            return true;
        }
    }
    return false;

}

export function toValueIfKeyOfObject(keyOrValue, object) {
    if (object.hasOwnProperty(keyOrValue)) {
        return object[keyOrValue];
    }
    return keyOrValue;
}