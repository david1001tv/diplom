import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Conference from "./Conference";
import ReactPaginate from 'react-paginate';
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  pagination: {
    margin: '30px 150px'
  },
  noResults: {
    fontSize: 30,
    padding: '100px 50px 0 50px'
  }
});

class MainTable extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    data: [],
    perPage: 5,
    page: 1,
    pageCount: 1
  };

  componentDidMount() {
    this.load([...this.props.params,
      {limit: this.state.perPage},
      {page: this.state.page}
    ]);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.params !== this.props.params) {
      this.load([...this.props.params,
        {limit: this.state.perPage},
        {page: this.state.page}
      ]);
    }
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

    this.setState({page: selected + 1}, () => {
      this.load([
        {limit: this.state.perPage},
        {page: this.state.page}
      ]);
    });
  };

  render() {
    const {classes} = this.props;

    return <React.Fragment>
      {
        this.state.data.length !== 0 ?
          <React.Fragment>
            {
              this.state.data.map((conference, index) => {
                return <Conference key={index}
                                   conference={conference}
                />
              })
            }
            <ReactPaginate
              previousLabel={'<<'}
              nextLabel={'>>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            /> </React.Fragment> :
          <Typography className={classes.noResults} align={"center"}>
            Sorry, we have no results :(
          </Typography>
      }
    </React.Fragment>
  }
}

export default withStyles(styles)(MainTable);
