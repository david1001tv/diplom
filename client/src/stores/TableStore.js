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

  cityQuery = [];

  countryQuery = [];

  conferenceQuery = [];

  speakerQuery = [];

  limit = 10;

  total = 10;

  page = 1;

  initialLoad = () => {
    if (this.tableData.length === 0) this.loadData();
  };

  formatDate = (date) => {
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  };

  getCities = flow(function* () {
    const {data} = yield Api.get(`cities`);
    this.cities = data;
  });

  getCountries = flow(function* () {
    const {data} = yield Api.get(`countries`);
    this.countries = data;
  });

  getConferences= flow(function* () {
    const {data} = yield Api.get(`conferences`);
    this.conferences = data;
  });

  getSpeakers= flow(function* () {
    const {data} = yield Api.get(`speakers`);
    this.speakers = data;
  });

  loadData = flow(function* () {
    this.isLoading = true;
    console.log(this.url);
    const res = yield Api.get(`${this.url}?limit=${this.limit}&page=${this.page}&query=${this.query}${this.additionalQuery}`);
    this.tableData = res.data || [];
    this.total = res.total;
    this.isLoading = false;
  }).bind(this);

  fetchAllItems = flow(function* (url) {
    return yield Api.get(url);
  });

  saveItem = (itemData, itemId = null) => {
    this.isLoading = true;
    if (itemId) {
      return this.editItem(itemData, itemId);
    } else {
      return this.createItem(itemData)
    }
  };

  editItem = flow(function* (itemData, itemId = null) {
    try {
      const res = yield Api.put(`${this.url}/${itemId}`, JSON.stringify(itemData));
      this.tableData = this.tableData.map(row => row._id === itemId ? res.data : row)
    } catch (err) {
      // this.appStore.handleOpenSnack('Some error');
      throw err;
    } finally {
      this.isLoading = false;
    }
  });

  createItem = flow(function* (itemData) {
    try {
      const res = yield Api.post(`${this.url}`, JSON.stringify(itemData));
      this.addNewItem(res.data);
    } catch (err) {
      throw err;
    } finally {
      this.isLoading = false;
    }
  });

  deleteItems = flow(function* (id) {
    yield Api.delete(`${this.url}/` + id);
    this.loadData();
  });

  restoreItems = flow(function* (ids = []) {
    yield Api.patch(`${this.url}/restore`, JSON.stringify({ids}));
    this.tableData = this.tableData.map(row => ids.indexOf(row._id) !== -1 ? {...row, deleted: false} : row)
  });

  changeQuery = query => this.query = query;

  clearQuery = () => {
    this.query = '';
    this.loadData();
  };

  handleChangeRowsPerPage = limit => {
    this.limit = limit;
    this.loadData();
  };

  handleChangePage = page => {
    this.page = page + 1;
    this.loadData();
  };

  addNewItem = item => {
    this.total++;
    if (this.tableData.length >= this.limit)
      return this.tableData = [item, ...this.tableData].slice(0, -1)

    this.tableData = [item, ...this.tableData]
  };

  parseDate = date => {
    date = new Date(date);
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
  };

  makeReport = flow(function *() {
    window.print();
  });

  changeCityQuery = e => {
    this.cityQuery = e.target.value;

    const cityString = this.cityQuery.reduce((acc, curCity, i) => {
      return acc += `&filter[city][]=${curCity}`
    }, '');

    this.additionalQuery = cityString;
    this.loadData();
  };

  changeCountryQuery = e => {
    this.countryQuery = e.target.value;

    const countryString = this.countryQuery.reduce((acc, curCountry, i) => {
      return acc += `&filter[country][]=${curCountry}`
    }, '');

    this.additionalQuery = countryString;
    this.loadData();
  };

  changeConferenceQuery = e => {
    this.conferenceQuery = e.target.value;

    const conferenceString = this.conferenceQuery.reduce((acc, curConference, i) => {
      return acc += `&filter[conference][]=${curConference}`
    }, '');

    this.additionalQuery = conferenceString;
    this.loadData();
  };

  changeSpeakerQuery = e => {
    this.speakerQuery = e.target.value;

    const countryString = this.speakerQuery.reduce((acc, curSpeaker, i) => {
      return acc += `&filter[speaker][]=${curSpeaker}`
    }, '');

    this.additionalQuery = countryString;
    this.loadData();
  };

  clearFilters = e => {
    this.cityQuery = [];
    this.countryQuery = [];
    this.conferenceQuery = [];
    this.speakerQuery = [];
    this.additionalQuery = '';
    this.query = '';
    this.loadData();
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
  clearQuery: action,
  formatDate: action,
  parseDate: action,
  clearFilters: action,
  changeCountryQuery: action,
  changeSpeakerQuery: action,
  changeConferenceQuery: action
});
