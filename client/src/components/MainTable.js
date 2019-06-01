import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Conference from "./Conference";
import ReactPaginate from 'react-paginate';
import Typography from '@material-ui/core/Typography'
import Talk from './Talk';
import Speaker from './Speaker';

const styles = theme => ({
  pagination: {
    margin: '30px 150px'
  },
  noResults: {
    fontSize: 30,
    padding: '100px 50px 0 50px'
  },
});

class MainTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data
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

  render() {
    const {classes, content, data, handlePageClick, pageCount} = this.props;

    return <React.Fragment>
      {
        data.length !== 0 ?
          <React.Fragment>
            {
              content === 'conferences' ? data.map((item, index) => {
                return <Conference key={index}
                                   conference={item}
                />
              }) : content === 'talks' ? (data.map((item, index) => {
                  return <Talk key={index}
                               talk={item}
                               index={index}
                  />
                }))
                : (content === 'speakers' ? (data.map((item, index) => {
                    return <Speaker key={index}
                                    speaker={item}
                                    index={index}
                    />
                  }))
                  : null)
            }
            <ReactPaginate
              previousLabel={'<<'}
              nextLabel={'>>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </React.Fragment> :
          <Typography className={classes.noResults} align={"center"}>
            Sorry, we have no results :(
          </Typography>
      }
    </React.Fragment>
  }
}

export default withStyles(styles)(MainTable);
