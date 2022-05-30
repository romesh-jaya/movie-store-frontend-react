import MaterialTable, { Action, Column, Options } from '@material-table/core';
import Delete from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

import TableIcons from '../../../constants/TableIcons';
import { cartItems, ICartItem, removeItem } from '../../../state/cart';
import StyledMTableToolbar from '../../Controls/StyledMTableToolbar/StyledMTableToolbar';
import styles from '../cart.module.scss';

interface IProps {
  pricePerTitle: number;
  priceCurrency: string;
  setSelectedMovieIMDBId: (imdbID: string) => void;
}

export default function CartItemsTable(props: IProps) {
  const { pricePerTitle, priceCurrency, setSelectedMovieIMDBId } = props;
  const theme = useTheme();
  const cartItemsArray = cartItems.use();

  const onDeleteClicked = (data: ICartItem | ICartItem[]) => {
    if (Array.isArray(data)) {
      data.forEach((dataOne) => removeItem(dataOne.imdbID));
      return;
    }

    removeItem(data.imdbID);
  };

  const handleClickTitle = (imdbID: string): void => {
    setSelectedMovieIMDBId(imdbID);
  };

  const getColumns = (): Column<ICartItem>[] => {
    return [
      {
        title: 'Title',
        field: 'title',
        width: '85%',
        render: (rowData: ICartItem) => {
          return (
            <button
              type="button"
              className={styles['link-button']}
              onClick={() => handleClickTitle(rowData.imdbID)}
            >
              {rowData.title}
            </button>
          );
        },
      },
      {
        title: `Amount (${priceCurrency.toUpperCase()})`,
        field: 'amount',
        width: '15%',
        render: () => <p>{pricePerTitle.toFixed(2)}</p>,
      },
    ];
  };

  const getOptions = (): Options<ICartItem> => {
    return {
      showTitle: false,
      search: false,
      paging: false,
      sorting: true,
      headerStyle: { fontSize: '1rem' },
      rowStyle: (rowData: any) => ({
        backgroundColor: rowData.tableData.checked
          ? 'rgba(232, 210, 192, 0.5)'
          : theme.palette.background.paper,
      }),
      selection: true,
    };
  };

  const getActions = ():
    | (Action<ICartItem> | ((rowData: ICartItem) => Action<ICartItem>))[]
    | undefined => {
    return [
      {
        tooltip: 'Delete title',
        icon: () => <Delete />,
        onClick: (_: any, data: ICartItem | ICartItem[]) =>
          onDeleteClicked(data),
      },
    ];
  };

  const getSummaryValue = (
    column: Column<ICartItem>,
    data: ICartItem[]
  ): string | undefined => {
    switch (column.field) {
      case 'title':
        return 'Total: ';
      case 'amount':
        return data.reduce((agg) => agg + 1 * pricePerTitle, 0).toFixed(2);
      default:
        return undefined;
    }
  };

  return (
    <MaterialTable
      columns={getColumns()}
      data={cartItemsArray}
      options={getOptions()}
      actions={getActions()}
      icons={TableIcons}
      components={{
        Toolbar: (props) => <StyledMTableToolbar {...props} />,
      }}
      renderSummaryRow={({ column, data }) => {
        return {
          value: getSummaryValue(column, data),
          style: {
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '3',
          },
        };
      }}
    />
  );
}
