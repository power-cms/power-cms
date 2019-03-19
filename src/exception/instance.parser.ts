const getClassName = (obj: any): string | null => {
  const extendingRegex = /extends[\s]+[[\w]+\.]*([\w]+)/;

  const extendingResults = extendingRegex.exec(obj.constructor.toString());

  if (extendingResults && extendingResults.length > 0) {
    return extendingResults[1];
  }

  const simpleRegex = /class[\s]+([\w]+)/;

  const simpleResults = simpleRegex.exec(obj.constructor.toString());

  if (simpleResults && simpleResults.length > 0) {
    return simpleResults[1];
  }

  return null;
};

const getClassNames = (e: object): string[] => {
  const classNames = [e.constructor.name];
  let obj = Object.getPrototypeOf(e);
  let className = getClassName(obj);

  while (className) {
    classNames.push(className);
    obj = Object.getPrototypeOf(obj);
    className = getClassName(obj);
  }

  return classNames;
};

export const isInstanceOf = (error: any, classSignature: any): boolean => {
  return getClassNames(error).indexOf(classSignature.name) !== -1;
};
