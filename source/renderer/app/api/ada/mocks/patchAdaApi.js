import BigNumber from 'bignumber.js';
import { Logger, stringifyData, stringifyError } from '../../../../../common/logging';
import { RedeemAdaError } from '../errors';
import AdaApi from '../index';
import type {
  RedeemAdaParams,
  RedeemPaperVendedAdaParams
} from '../types';

// ========== LOGGING =========

let LOCAL_TIME_DIFFERENCE = 0;
let NEXT_ADA_UPDATE = null;

export default (api: AdaApi) => {
  // Since we cannot test ada redemption in dev mode, just resolve the requests
  api.redeemAda = (request: RedeemAdaParams) => new Promise((resolve) => {
    try {
      Logger.debug('AdaApi::redeemAda (PATCHED) called: ' + stringifyData(request));
      const { redemptionCode } = request;
      const isValidRedemptionCode = api.isValidRedemptionKey(redemptionCode);
      if (!isValidRedemptionCode) {
        Logger.debug('AdaApi::redeemAda (PATCHED) failed: not a valid redemption key!');
        throw new RedeemAdaError();
      }
      Logger.debug('AdaApi::redeemAda (PATCHED) success');
      resolve({ amount: new BigNumber(1000) });
    } catch (error) {
      Logger.debug('AdaApi::redeemAda (PATCHED) error: ' + stringifyError(error));
      throw new RedeemAdaError();
    }
  });

  api.redeemPaperVendedAda = (request: RedeemPaperVendedAdaParams) => new Promise((resolve) => {
    try {
      Logger.debug('AdaApi::redeemPaperVendedAda (PATCHED) called: ' + stringifyData(request));
      const { redemptionCode, mnemonics } = request;
      const isValidKey = api.isValidPaperVendRedemptionKey(redemptionCode);
      const isValidMnemonic = api.isValidRedemptionMnemonic(mnemonics.join(' '));
      if (!isValidKey) Logger.debug('AdaApi::redeemPaperVendedAda (PATCHED) failed: not a valid redemption key!');
      if (!isValidMnemonic) Logger.debug('AdaApi::redeemPaperVendedAda (PATCHED) failed: not a valid mnemonic!');
      if (!isValidKey || !isValidMnemonic) {
        throw new RedeemAdaError();
      }
      Logger.debug('AdaApi::redeemPaperVendedAda (PATCHED) success');
      resolve({ amount: new BigNumber(1000) });
    } catch (error) {
      Logger.debug('AdaApi::redeemPaperVendedAda (PATCHED) error: ' + stringifyError(error));
      throw new RedeemAdaError();
    }
  });

  api.getLocalTimeDifference = async () => (
    Promise.resolve(LOCAL_TIME_DIFFERENCE)
  );

  api.setLocalTimeDifference = async (timeDifference) => {
    LOCAL_TIME_DIFFERENCE = timeDifference;
  };

  api.nextUpdate = async () => (
    Promise.resolve(NEXT_ADA_UPDATE)
  );

  api.setNextUpdate = async (nextUpdate) => {
    NEXT_ADA_UPDATE = nextUpdate;
  };
};
