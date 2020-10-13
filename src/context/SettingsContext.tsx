import React from 'react';
import  INameValue from '../interfaces/INameValue';
 
const SettingsContext = React.createContext<INameValue[]>([]);
 
export default SettingsContext;