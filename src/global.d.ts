declare module 'enzyme-adapter-react-16';
declare module 'enzyme';
declare module 'lodash/orderBy';
declare module '*.png';
declare module 'react-export-excel';

declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
};


declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
};
