// @flow
import React from 'react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

// Helpers
import WalletsWrapper from '../_utils/WalletsWrapper';
import {
  WALLET_KINDS,
  WALLET_DAEDALUS_KINDS,
  WALLET_YOROI_KINDS,
  WALLET_HARDWARE_KINDS,
} from '../../../../source/renderer/app/config/walletRestoreConfig';

// Screens
import StepWalletTypeDialog from '../../../../source/renderer/app/components/wallet/wallet-restore/StepWalletTypeDialog';
import StepMnemonicsDialog from '../../../../source/renderer/app/components/wallet/wallet-restore/StepMnemonicsDialog';

storiesOf('Wallets|Add Wallet', module)
  .addDecorator(WalletsWrapper)
  .add('Restore - Step 1', () => {
    const walletKindSelect = select(
      'Wallet Kind',
      { '-': null, ...WALLET_KINDS },
      null
    );
    let selectItems;
    if (walletKindSelect === WALLET_KINDS.YOROI)
      selectItems = WALLET_YOROI_KINDS;
    else if (walletKindSelect === WALLET_KINDS.HARDWARE)
      selectItems = WALLET_HARDWARE_KINDS;
    else selectItems = WALLET_DAEDALUS_KINDS;

    let walletKindSpecificSelect;
    if (walletKindSelect)
      walletKindSpecificSelect = select(
        `Wallet Kind - ${walletKindSelect || 'Daedalus'}`,
        {
          '-': null,
          ...selectItems,
        },
        null
      );

    return (
      <StepWalletTypeDialog
        onContinue={action('onContinue')}
        onClose={action('onClose')}
        onSetWalletKind={action('onSetWalletKind')}
        walletKind={walletKindSelect}
        walletKindDaedalus={walletKindSpecificSelect}
        walletKindYoroi={walletKindSpecificSelect}
        walletKindHardware={walletKindSpecificSelect}
      />
    );
  })
  .add('Restore - Step 2', () => {
    const walletKindSelect = select(
      'Wallet Kind',
      WALLET_KINDS,
      WALLET_KINDS.DAEDALUS
    );
    let selectItems;
    if (walletKindSelect === WALLET_KINDS.YOROI)
      selectItems = WALLET_YOROI_KINDS;
    else if (walletKindSelect === WALLET_KINDS.HARDWARE)
      selectItems = WALLET_HARDWARE_KINDS;
    else selectItems = WALLET_DAEDALUS_KINDS;

    let walletKindSpecificSelect;
    if (walletKindSelect)
      walletKindSpecificSelect = select(
        `Wallet Kind - ${walletKindSelect || 'Daedalus'}`,
        selectItems,
        Object.values(WALLET_DAEDALUS_KINDS)[0]
      );

    return (
      <StepMnemonicsDialog
        onContinue={action('onContinue')}
        onClose={action('onClose')}
        onSetWalletKind={action('onSetWalletKind')}
        onBack={action('onSetWalletKind')}
        walletKind={walletKindSelect}
        walletKindDaedalus={walletKindSpecificSelect}
        walletKindYoroi={walletKindSpecificSelect}
        walletKindHardware={walletKindSpecificSelect}
      />
    );
  });
