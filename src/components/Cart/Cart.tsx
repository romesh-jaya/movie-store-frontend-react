import MaterialTable, { Action, Column, Options } from '@material-table/core';
import React from 'react';
import Delete from '@mui/icons-material/Delete';

import TableIcons from '../../constants/TableIcons';
import { cartItems } from '../../state/cart';
import styles from './cart.module.css';

interface ICartTitles {
  title: string;
}

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();

  const onDeleteClicked = (data: ICartTitles | ICartTitles[]) => {
    console.log(data);
  };

  const handleClickTitle = (imdbID: string): void => {
    console.log(imdbID);
  };

  const getColumns = (): Column<ICartTitles>[] => {
    return [
      {
        title: 'Title',
        field: 'title',
        render: (rowData: ICartTitles) => {
          return (
            <button
              type="button"
              className={styles['link-button']}
              onClick={() => handleClickTitle(rowData.title)}
            >
              {rowData.title}
            </button>
          );
        },
      },
    ];
  };

  const getOptions = (): Options<ICartTitles> => {
    return {
      showTitle: false,
      search: false,
      paging: false,
      sorting: true,
      headerStyle: { fontSize: '1rem' },
      rowStyle: (rowData: any) => ({
        backgroundColor: rowData.tableData.checked
          ? 'rgba(232, 210, 192, 0.5)'
          : '#fff',
      }),
      selection: true,
    };
  };

  const getActions = ():
    | (Action<ICartTitles> | ((rowData: ICartTitles) => Action<ICartTitles>))[]
    | undefined => {
    return [
      {
        tooltip: 'Delete selected titles',
        icon: () => <Delete />,
        onClick: (_: any, data: ICartTitles | ICartTitles[]) =>
          onDeleteClicked(data),
      },
    ];
  };

  return (
    <>
      <h2>My Cart</h2>
      {cartItemsArray.length > 0 ? (
        <MaterialTable
          columns={getColumns()}
          data={cartItemsArray.map((item) => ({ title: item }))}
          options={getOptions()}
          actions={getActions()}
          icons={TableIcons}
        />
      ) : (
        <p>No titles have been added to the cart.</p>
      )}
    </>
  );
};

export default Cart;
