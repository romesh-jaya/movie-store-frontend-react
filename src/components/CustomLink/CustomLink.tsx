import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

import { PREFERS_DARK_MODE_MEDIA_QUERY } from '../../constants/Constants';

import styles from './customLink.module.scss';

interface IProps {
  children: ReactNode;
  to: string;
  ignoreDarkMode?: boolean;
}

export default function CustomLink(props: IProps) {
  const { children, to, ignoreDarkMode } = props;
  const prefersDarkMode = useMediaQuery(PREFERS_DARK_MODE_MEDIA_QUERY);

  return (
    <Link
      to={to}
      className={
        ignoreDarkMode
          ? styles['link-white']
          : styles.link + ` ${prefersDarkMode && styles['link-dark-mode']}`
      }
    >
      {children}
    </Link>
  );
}
