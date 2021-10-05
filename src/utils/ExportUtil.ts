import startCase from 'lodash/startCase';

import IMovieLibrary from '../interfaces/IMovieLibrary';
import INameValue from '../interfaces/INameValue';

export function formatExportData(exportDataVal: IMovieLibrary[]) {
  const keys = Object.keys(exportDataVal[0]);
  const keysMinusId = keys.filter((key) => key !== 'id');
  // convert keys to Title case
  const formattedKeys: INameValue[] = keysMinusId.map((key) => ({
    name: key,
    value: startCase(key),
  }));

  // create new data with capitalized keys
  const capitalizedKeyData = exportDataVal.map((row) => {
    const retVal: any = {};
    formattedKeys.forEach((key) => {
      retVal[key.value] = row[key.name as keyof IMovieLibrary];
    });
    return retVal;
  });

  const formattedData = capitalizedKeyData.map((row) => {
    // convert array types to semicolon seperated
    const newData = {
      ...row,
      Genre: row.Genre.join(';'),
      Languages: row.Languages.join(';'),
    };
    return newData;
  });
  return formattedData;
}
