import { Flex, Image, Stack, Text } from '@chakra-ui/react'
import { formatUnits } from 'ethers/lib/utils'
import { useState } from 'react'
import { useAccountBalances, useSupplyBalances } from '@inverse/hooks/useBalances'
import { BalanceInput, Input } from '../Input'
import { Modal, ModalTabs } from '../Modal'
import { AnchorStats } from './AnchorStats'
import { useAccountLiquidity, useExchangeRates } from '@inverse/hooks/useAccountLiquidity'
import { usePrices } from '@inverse/hooks/usePrices'
import { AnchorButton } from './AnchorButton'
import { useWeb3React } from '@web3-react/core'

export enum AnchorOperations {
  supply = 'Supply',
  withdraw = 'Withdraw',
  borrow = 'Borrow',
  repay = 'Repay',
}

export const AnchorModal = ({ isOpen, onClose, asset, operations }: any) => {
  const [operation, setOperation] = useState(operations[0])
  const [amount, setAmount] = useState<any>('')
  const { active } = useWeb3React()
  const { balances } = useAccountBalances()
  const { balances: supplyBalances } = useSupplyBalances()
  const { prices } = usePrices()
  const { usdBorrowable } = useAccountLiquidity()
  const { exchangeRates } = useExchangeRates()

  const max = () => {
    switch (operation) {
      case AnchorOperations.supply:
        return balances
          ? parseFloat(formatUnits(balances[asset.underlying.address || 'ETH'], asset.underlying.decimals))
          : 0
      case AnchorOperations.withdraw:
        const supply =
          supplyBalances && exchangeRates
            ? parseFloat(formatUnits(supplyBalances[asset.token])) * parseFloat(formatUnits(exchangeRates[asset.token]))
            : 0
        const withdrawable = prices
          ? usdBorrowable / (asset.collateralFactor * prices[asset.underlying.coingeckoId].usd)
          : 0
        return withdrawable > supply ? supply : withdrawable
      case AnchorOperations.borrow:
        return prices && usdBorrowable ? usdBorrowable / prices[asset.underlying.coingeckoId].usd : 0
      case AnchorOperations.repay:
        return balances
          ? parseFloat(formatUnits(balances[asset.underlying.address || 'ETH'], asset.underlying.decimals))
          : 0
    }

    return 0
  }

  const maxLabel = () => {
    switch (operation) {
      case AnchorOperations.supply:
        return 'Wallet'
      case AnchorOperations.withdraw:
        return 'Withdrawable'
      case AnchorOperations.borrow:
        return 'Borrowable'
      case AnchorOperations.repay:
        return 'Wallet'
    }

    return ''
  }

  const handleClose = () => {
    setAmount('')
    onClose()
  }

  return (
    <Modal
      onClose={handleClose}
      isOpen={isOpen}
      header={
        <Stack minWidth={24} direction="row" align="center">
          <Image src={asset.underlying.image} w={8} h={8} />
          <Text>{asset.underlying.name}</Text>
        </Stack>
      }
      footer={
        <AnchorButton
          operation={operation}
          asset={asset}
          amount={amount}
          isDisabled={!amount || !active || isNaN(amount) || parseFloat(amount) > max()}
        />
      }
    >
      <Stack>
        <Stack align="center" p={6} spacing={1}>
          <Flex w="full" justify="flex-end" align="flex-end">
            <Stack direction="row" align="flex-end" spacing={1}>
              <Text fontSize="13px" fontWeight="semibold" color="purple.100">
                {`${maxLabel()}:`}
              </Text>
              <Text fontSize="13px" fontWeight="semibold">
                {`${max().toFixed(2)} ${asset.underlying.symbol}`}
              </Text>
            </Stack>
          </Flex>
          <BalanceInput
            value={amount}
            onChange={(e: any) => setAmount(e.currentTarget.value)}
            onMaxClick={() => setAmount((Math.floor(max() * 1e8) / 1e8).toString())}
            label={asset.underlying.symbol}
          />
        </Stack>
        <ModalTabs tabs={operations} active={operation} onChange={setOperation} />
        <AnchorStats operation={operation} asset={asset} amount={amount} />
      </Stack>
    </Modal>
  )
}

export const AnchorSupplyModal = ({ isOpen, onClose, asset }: any) => {
  if (!asset) {
    return <></>
  }

  return (
    <AnchorModal
      isOpen={isOpen}
      onClose={onClose}
      asset={asset}
      operations={[AnchorOperations.supply, AnchorOperations.withdraw]}
    />
  )
}

export const AnchorBorrowModal = ({ isOpen, onClose, asset }: any) => {
  if (!asset) {
    return <></>
  }

  return (
    <AnchorModal
      isOpen={isOpen}
      onClose={onClose}
      asset={asset}
      operations={[AnchorOperations.borrow, AnchorOperations.repay]}
    />
  )
}
