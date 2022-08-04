import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './customLink.module.scss';

interface IProps {
  children: ReactNode;
  to: string;
  ignoreDarkMode?: boolean;
}

export default function CustomLink(props: IProps) {
  const { children, to, ignoreDarkMode } = props;

  return (
    <Link to={to} className={ignoreDarkMode && styles['link-white']}>
      {children}
    </Link>
  );
}
