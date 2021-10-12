import startCase from 'lodash/startCase';

import IMovieLibrary from '../interfaces/IMovieLibrary';
import INameValue from '../interfaces/INameValue';

export function formatExportData(exportDataVal: IMovieLibrary[]) {
  // Use the keys of the first data row as the column headings
  const columnHeadings = Object.keys(exportDataVal[0]);
  //Remove id column as its not useful to us
  const columnHeadingsMinusId = columnHeadings.filter(
    (heading) => heading !== 'id'
  );

  // convert keys to Title case
  const formattedHeadings: INameValue[] = columnHeadingsMinusId.map(
    (heading) => ({
      name: heading,
      value: startCase(heading),
    })
  );

  const capitalizedKeyData = exportDataVal.map((row) => {
    const retVal: any = {};
    formattedHeadings.forEach((key) => {
      const val = row[key.name as keyof IMovieLibrary];
      // convert array types to semicolon seperated
      if (Array.isArray(val)) {
        // create same data rows, but with capitalized keys
        retVal[key.value] = val.join(';');
      } else {
        // create same data rows, but with capitalized keys
        retVal[key.value] = val;
      }
    });
    return retVal;
  });

  return capitalizedKeyData;
}
