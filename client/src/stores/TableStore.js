import {observable, action, flow, decorate} from 'mobx';
import Api from '../Api';

class TableStore {

  constructor(url, appStore) {
    this.url = url;
    this.appStore = appStore
  }

  isLoading = false;

  query = '';

  additionalQuery = '';

  tableData = [];

  limit = 10;

  total = 10;

  page = 1;

  initialLoad = () => {
    if (this.tableData.length === 0) this.loadData();
  }

  loadData = flow(function* () {
    this.isLoading = true;
    const res = yield Api.get(`${this.url}?limit=${this.limit}&page=${this.page}&query=${this.query}${this.additionalQuery}`)
    this.tableData = res.data || [];
    this.total = res.total;
    this.isLoading = false;
  }).bind(this)

  fetchAllItems = flow(function* () {
    return yield Api.get(this.url);
  })

  saveItem = (itemData, itemId = null) => {
    this.isLoading = true;
    if (itemId) {
      return this.editItem(itemData, itemId);
    } else {
      return this.createItem(itemData)
    }
  }

  editItem = flow(function* (itemData, itemId = null) {
    try {
      const res = yield Api.put(`${this.url}/${itemId}`, JSON.stringify(itemData))
      this.tableData = this.tableData.map(row => row._id === itemId ? res.data : row)
    } catch (err) {
      // this.appStore.handleOpenSnack('Some error');
      throw err;
    } finally {
      this.isLoading = false;
    }
  })

  createItem = flow(function* (itemData) {
    try {
      const res = yield Api.post(`${this.url}`, JSON.stringify(itemData));
      this.addNewItem(res.data);
    } catch (err) {
      throw err;
    } finally {
      this.isLoading = false;
    }
  })

  deleteItems = flow(function* (id) {
    yield Api.delete(`${this.url}/` + id);
    this.loadData();
  })

  restoreItems = flow(function* (ids = []) {
    yield Api.patch(`${this.url}/restore`, JSON.stringify({ids}));
    this.tableData = this.tableData.map(row => ids.indexOf(row._id) !== -1 ? {...row, deleted: false} : row)
  })

  changeQuery = query => this.query = query;

  clearQuery = () => {
    this.query = '';
    this.loadData();
  }

  handleChangeRowsPerPage = limit => {
    this.limit = limit;
    this.loadData();
  }

  handleChangePage = page => {
    this.page = page + 1;
    this.loadData();
  }

  addNewItem = item => {
    this.total++;
    if (this.tableData.length >= this.limit)
      return this.tableData = [item, ...this.tableData].slice(0, -1)

    this.tableData = [item, ...this.tableData]
  }
}

export default decorate(TableStore, {
  isLoading: observable,
  tableData: observable,
  limit: observable,
  total: observable,
  page: observable,
  query: observable,
  initialLoad: action,
  handleChangeRowsPerPage: action,
  handleChangePage: action,
  changeQuery: action,
  clearQuery: action
});
