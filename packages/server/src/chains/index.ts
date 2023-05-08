import { Chain } from '@pulse-tracker/utils';
import { chainFid } from './FID/chain-fid';
import { chainFcp } from './FCP/chain-fcp';

export const chains = {
  [Chain.Fid]: chainFid,
  [Chain.Fcp]: chainFcp,
};
