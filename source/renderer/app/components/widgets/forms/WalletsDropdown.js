// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import { Select } from 'react-polymorph/lib/components/Select';
import { SelectSkin } from 'react-polymorph/lib/skins/simple/SelectSkin';
import { omit } from 'lodash';
import WalletsDropdownOption from './WalletsDropdownOption';
import styles from './WalletsDropdown.scss';

import { formattedWalletAmount } from '../../../utils/formatters';
import Wallet from '../../../domains/Wallet';
import StakePool from '../../../domains/StakePool';

type SelectProps = {
  allowBlank?: boolean,
  autoFocus?: boolean,
  className?: string,
  context?: any,
  disabled?: boolean,
  error?: string | Element<any>,
  errorPosition?: 'top' | 'bottom',
  label?: string | Element<any>,
  isOpeningUpward?: boolean,
  onBlur?: Function,
  onChange?: Function,
  onFocus?: Function,
  optionRenderer?: Function,
  options?: Array<any>,
  placeholder?: string,
  selectionRenderer?: Function,
  skin?: Element<any>,
  theme?: ?Object, // will take precedence over theme in context if passed
  themeId?: string,
  themeOverrides?: Object,
  value: ?string,
};

type Props = {
  ...$Shape<SelectProps>,
  numberOfStakePools: number,
  wallets: Array<$Shape<Wallet>>,
  getStakePoolById: Function,
};

type WalletOption = {
  delegatedStakePool?: ?StakePool,
  label: string,
  numberOfStakePools: number,
  detail: string,
  value: string,
};

export default class WalletsDropdown extends Component<Props> {
  static defaultProps = {
    optionRenderer: ({
      label,
      detail,
      numberOfStakePools,
      delegatedStakePool,
    }: WalletOption) => (
      <WalletsDropdownOption
        label={label}
        numberOfStakePools={numberOfStakePools}
        detail={detail}
        delegatedStakePool={delegatedStakePool}
      />
    ),
    selectionRenderer: ({
      label,
      detail,
      numberOfStakePools,
      delegatedStakePool,
    }: WalletOption) => (
      <WalletsDropdownOption
        selected
        label={label}
        numberOfStakePools={numberOfStakePools}
        detail={detail}
        delegatedStakePool={delegatedStakePool}
      />
    ),
    skin: SelectSkin,
    errorPosition: 'top',
  };

  render() {
    const {
      wallets,
      numberOfStakePools,
      getStakePoolById,
      error,
      errorPosition,
      ...props
    } = this.props;
    const walletsData = wallets.map(
      ({
        name: label,
        id: value,
        amount,
        delegatedStakePoolId,
        lastDelegationStakePoolId,
        pendingDelegations,
        isRestoring,
      }: Wallet) => {
        const hasPendingDelegations =
          pendingDelegations && pendingDelegations.length > 0;
        let currentStakePoolId = delegatedStakePoolId;
        if (hasPendingDelegations) {
          currentStakePoolId = lastDelegationStakePoolId;
        }
        const delegatedStakePool = getStakePoolById(currentStakePoolId);
        const detail = !isRestoring ? formattedWalletAmount(amount) : '-';
        return {
          detail,
          label,
          value,
          numberOfStakePools,
          delegatedStakePool,
        };
      }
    );
    let topError;
    let bottomError;
    if (errorPosition === 'bottom') bottomError = error;
    else topError = error;
    const selectOptions = omit({ ...props, topError }, 'options');
    return (
      <>
        <Select options={walletsData} {...selectOptions} optionHeight={62} />
        {bottomError && <div className={styles.error}>{bottomError}</div>}
      </>
    );
  }
}
