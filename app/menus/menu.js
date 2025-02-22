// Packages
import {app, dialog, Menu} from 'electron';

// Utilities
import {getConfig} from '../config';
import {icon} from '../config/paths';
import viewMenu from './menus/view';
import shellMenu from './menus/shell';
import editMenu from './menus/edit';
import pluginsMenu from './menus/plugins';
import windowMenu from './menus/window';
import helpMenu from './menus/help';
import darwinMenu from './menus/darwin';
import {getDecoratedKeymaps} from '../plugins';
import {execCommand} from '../commands';
import {getRendererTypes} from '../utils/renderer-utils';

const appName = app.getName();
const appVersion = app.getVersion();

let menu_ = [];

export const createMenu = (createWindow, getLoadedPluginVersions) => {
  const config = getConfig();
  // We take only first shortcut in array for each command
  const allCommandKeys = getDecoratedKeymaps();
  const commandKeys = Object.keys(allCommandKeys).reduce((result, command) => {
    result[command] = allCommandKeys[command][0];
    return result;
  }, {});

  let updateChannel = 'stable';

  if (config && config.updateChannel && config.updateChannel === 'canary') {
    updateChannel = 'canary';
  }

  const showAbout = () => {
    const loadedPlugins = getLoadedPluginVersions();
    const pluginList =
      loadedPlugins.length === 0 ? 'none' : loadedPlugins.map(plugin => `\n  ${plugin.name} (${plugin.version})`);

    const rendererCounts = Object.values(getRendererTypes()).reduce((acc, type) => {
      acc[type] = acc[type] ? acc[type] + 1 : 1;
      return acc;
    }, {});
    const renderers = Object.entries(rendererCounts)
      .map(([type, count]) => type + (count > 1 ? ` (${count})` : ''))
      .join(', ');

    dialog.showMessageBox({
      title: `About ${appName}`,
      message: `${appName} ${appVersion} (${updateChannel})`,
      detail: `Renderers: ${renderers}\nPlugins: ${pluginList}\n\nCreated by Guillermo Rauch\nCopyright © 2019 ZEIT, Inc.`,
      buttons: [],
      icon
    });
  };
  const menu = [
    ...(process.platform === 'darwin' ? [darwinMenu(commandKeys, execCommand, showAbout)] : []),
    shellMenu(commandKeys, execCommand),
    editMenu(commandKeys, execCommand),
    viewMenu(commandKeys, execCommand),
    pluginsMenu(commandKeys, execCommand),
    windowMenu(commandKeys, execCommand),
    helpMenu(commandKeys, showAbout)
  ];

  return menu;
};

export const buildMenu = template => {
  menu_ = Menu.buildFromTemplate(template);
  return menu_;
};
