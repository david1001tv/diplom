import React, { Component } from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class TableHeader extends Component {
  render() {
    const { columns=[] } = this.props
    return <TableHead>
      <TableRow>
        {columns.map((item, i) => <TableCell key={i}>
            {item}
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  }
}

export default TableHeader;
