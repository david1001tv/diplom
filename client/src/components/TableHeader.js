import React, {Component} from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

class TableHeader extends Component {
  render() {
    const {columns = [], orderBy, order, createSortHandler} = this.props;
    return <TableHead>
      <TableRow>
        {columns.map((item, i) => <TableCell
            key={i}
            align={'left'}
            padding={'default'}
            sortDirection={item.sort && orderBy === item.name ? order : false}
          >
            {
              item.sort ? <TableSortLabel
                active={orderBy === item.name}
                direction={order}
                onClick={() => createSortHandler(item.name, order)}
              >
                {item.name}
              </TableSortLabel> : item.name
            }
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  }
}

export default TableHeader;
