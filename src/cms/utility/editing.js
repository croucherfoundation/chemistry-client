import AssetInserterView from 'Views/assets/asset_inserter';
import BlockModifierView from 'Views/helpers/block_modifier';
import BlockHelperView from 'Views/helpers/block_helper';
import FormatHelperView from 'Views/helpers/format_helper';


function assetInserter(target, callback) {
  const inserter = new AssetInserterView({ target, callback });
  inserter.render();
  return inserter;
}

function blockModifier(target, callback) {
  const modifier = new BlockModifierView({ target, callback });
  modifier.render();
  return modifier;
}

function blockHelper(helped, callbacks) {
  const helper = new BlockHelperView({ helped, callbacks });
  helper.render();
  return helper;
}

function formatHelper(helped, callbacks) {
  const helper = new FormatHelperView({ helped, callbacks });
  helper.render();
  return helper;
}

export {
  assetInserter,
  blockModifier,
  blockHelper,
  formatHelper,
};
