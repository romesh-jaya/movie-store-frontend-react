import { MTableToolbar } from '@material-table/core';
import { styled } from '@mui/material';

export interface StyledMTableToolbarProps {
  hidden?: boolean;
}

const StyledMTableToolbar = styled((props: StyledMTableToolbarProps) => (
  <MTableToolbar {...props} />
))(({ hidden }) => ({
  display: hidden ? 'none !important' : '',
}));

export default StyledMTableToolbar;
