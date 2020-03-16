declare module 'enzyme-adapter-react-16';
declare module 'enzyme';
declare module 'uuid';
declare module 'lodash/orderBy';
declare module '*.png';

declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
};
