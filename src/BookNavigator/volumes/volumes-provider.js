import { html } from 'lit-element';

import sortAscendingIcon from '../assets/icon_sort_ascending.js';
import sortDescendingIcon from '../assets/icon_sort_descending.js';
import volumesIcon from '../assets/icon_volumes.js';

import './volumes.js';

export default class VolumesProvider {

  constructor(baseHost, bookreader, optionChange) {
    this.optionChange = optionChange;
    this.component = document.createElement('viewable-files');

    const files = bookreader.options.multipleBooksList?.by_subprefix;
    this.viewableFiles = Object.keys(files).map(item => files[item]);
    this.volumeCount = Object.keys(files).length;
    this.isSortAscending = false;

    this.component.subPrefix = bookreader.options.subPrefix || '';
    this.component.hostUrl = baseHost;
    this.component.viewableFiles = this.viewableFiles;

    this.id = 'volumes';
    this.label = `Viewable files (${this.volumeCount})`;
    this.icon = html`${volumesIcon}`;
    this.actionButton = this.headerIcon;
    this.sortVolumes(true);
  }

  get sortAscendingIcon() {
    return html`<button class="sort-asc icon" aria-label="Sort volumes in ascending order" @click=${() => this.sortVolumes()}>${sortAscendingIcon}</button>`;
  }

  get sortDescendingIcon() {
    return html`<button class="sort-desc icon" aria-label="Sort volumes in descending order" @click=${() => this.sortVolumes()}>${sortDescendingIcon}</button>`;
  }

  get headerIcon() {
    return this.isSortAscending ? this.sortAscendingIcon : this.sortDescendingIcon;
  }

  sortVolumes(initialSort = false) {
    this.isSortAscending = !this.isSortAscending;
    const volumesOrderBy = this.isSortAscending ? 'asc' : 'desc';

    const sortedFiles = this.viewableFiles.sort((a, b) => {
      if (this.isSortAscending) return a.title.localeCompare(b.title);
      else return b.title.localeCompare(a.title);
    });

    this.component.viewableFiles  = [...sortedFiles];
    this.actionButton = this.headerIcon;
    this.optionChange(this.bookreader);

    if (!initialSort) {
      this.multipleFilesClicked(volumesOrderBy);
    }
  }

  multipleFilesClicked(orderBy) {
    if (!window.archive_analytics) {
      return;
    }
    window.archive_analytics?.send_event_no_sampling(
      'BookReader',
      `VolumesSort|${orderBy}`,
      window.location.path,
    );
  }

}