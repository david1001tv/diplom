import {flow, decorate, observable, action} from 'mobx';
import TableStore from './TableStore';
import Api from '../Api';

class UsersStore extends TableStore {
  constructor(appStore) {
    super('admin/users', appStore);
  }

  policyQuery = [];

  countries = [];

  changePolicyQuery = e => {
    this.policyQuery = e.target.value;

    const policyString = this.policyQuery.reduce((acc, curPolicy, i) => {
      return acc += `&policy[]=${curPolicy}`
    }, '')

    this.additionalQuery = policyString;
    this.loadData();
  }

  clearFilters = e => {
    this.policyQuery = [];
    this.additionalQuery = '';
    this.query = '';
    this.loadData();
  }

  resetPassword = flow(function* (userId) {
    return yield Api.patch(
      `${this.url}/${userId}`,
      JSON.stringify({password: true}))
  })

  getCountries = flow(function* () {
    const {data} = yield Api.get(`countries`);
    this.countries = data;
  })

  makeReport = flow(function *() {
    window.print();
  })
}

export default decorate(UsersStore, {
  policyQuery: observable,
  countries: observable,
  changePolicyQuery: action,
  clearFilters: action
});
