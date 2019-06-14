import { observable, action, decorate } from 'mobx';

class AdminContainersStore {

  activeTab = 0;

  changeTab = tabIndex => this.activeTab = tabIndex;
}

export default decorate(AdminContainersStore, {
  activeTab: observable,
  changeTab: action,
});
