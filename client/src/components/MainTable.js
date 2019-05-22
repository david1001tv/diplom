import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Conference from "./Conference";
import ReactPaginate from 'react-paginate';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  pagination: {
    margin: '30px 150px'
  }
});

class MainTable extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    data: [],
    offset: 0,
    perPage: 5,
    pageCount: 1
  };

  componentDidMount() {
    this.load([
      {limit: 2},
      {page: 1}
    ]);
  }

  load(params = []) {
    let promise = this.props.loadData(params);
    promise.then(res => {
      this.setState({
        data: res.data,
        pageCount: Math.ceil(res.total / this.state.perPage)
      })
    });
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({offset: offset}, () => {
      this.load([
        {limit: 2},
        {page: selected+1}
      ]);
    });
  };

  render() {
    const {classes, loadData} = this.props;

    return <React.Fragment>
      {
        this.state.data.map((conference, index) => {
          if (index > 1) {

          } else {
            return <Conference
              conference={conference}
            />
          }
        })
      }
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={this.state.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </React.Fragment>
  }
}

export default withStyles(styles)(MainTable);
