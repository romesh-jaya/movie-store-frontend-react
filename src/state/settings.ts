import { entity } from 'simpler-state';
import INameValue from '../interfaces/INameValue';

export const settings = entity<INameValue[]>([]);

export const initSettings = (initSettings: INameValue[]) => {
  settings.set(initSettings);
};

export const getSettingValue = (settingName: string) => {
  if (!settingName) {
    return '';
  }
  const settingsArray = settings.get();
  return (
    settingsArray.find((setting) => setting.name === settingName)?.value || ''
  );
};
