declare module 'enzyme-adapter-react-16';
declare module 'enzyme';
declare module '*.png';

declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.scss';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
