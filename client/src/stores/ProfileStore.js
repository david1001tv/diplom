import { observable, action, decorate } from 'mobx';

class ProfileStore {

  activeTab = 0;

  changeTab = tabIndex => this.activeTab = tabIndex;
}

export default decorate(ProfileStore, {
  activeTab: observable,
  changeTab: action,
});
