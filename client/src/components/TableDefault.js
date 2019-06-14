import React, {Component} from 'react';
import TableHeader from './TableHeader';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';

class DefaultTable extends Component {

  static defaultProps = {
    page: 1,
    limit: 10,
    handleChangePage: () => {
    },
    handleChangeRowsPerPage: () => {
    }
  };

  onRowClick = index => e => {
    if (e.target.tagName !== 'TD') return

    //check if user select the text
    const selection = window.getSelection();
    if (selection.type === 'Range') return;

    this.props.onRowClick(e, index);
  };

  render() {
    const {rows = [], columns, onRowClick = null, limit, page, total, order, orderBy, createSortHandler } = this.props;

    return <Table>
      <TableHeader
        columns={columns}
        orderBy={orderBy}
        order={order}
        createSortHandler={createSortHandler}
      />
      <TableBody>
        {rows.map((row, i) => <TableRow key={i} hover {...onRowClick ? {onClick: this.onRowClick(i)} : {}}>
            {
              Object.keys(row).map((cell, cellIndex) => {
                return <TableCell key={cellIndex}>
                  {row[cell]}
                </TableCell>
              })
            }
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            count={total}
            rowsPerPage={limit}
            page={page - 1}
            onChangePage={this.props.handleChangePage}
            onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  }
}

export default DefaultTable;
