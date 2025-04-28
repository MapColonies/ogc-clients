import { isArray, isObject, unset } from "lodash-es";

export const insertAtIndex = (original: string, index: number, insertText: string) => {
  const lastString = original.substring(index);
  return original.substring(0, index) + insertText + lastString
}

export const removeFieldRecursively = (obj: any, fieldToRemove: string) => {
  if (isArray(obj)) {
    obj.forEach(item => removeFieldRecursively(item, fieldToRemove));
  } else if (isObject(obj)) {
    unset(obj, fieldToRemove);
    for (const property in obj) {
      if (isObject(obj[property])) {
        removeFieldRecursively(obj[property], fieldToRemove);
      }
    }
  }
  return obj;
}