'use client'

import type { Dispatch, SetStateAction } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  EDUCATION_VERIFYING_LOCALSTORAGE_ITEM,
} from '../app/education-apply/constants'
import { removeSpecificQueryParam } from '../utils'
import { noop } from 'lodash-es'
import dynamic from 'next/dynamic'
import type { ModalState } from './modal-context'

const AccountSetting = dynamic(() => import('../app/components/header/account-setting'), {
  ssr: false,
})
const Pricing = dynamic(() => import('../app/components/billing/pricing'), {
  ssr: false,
})

export type AccountModalState = {
  showAccountSettingModal: ModalState<string> | null
  showPricingModal: boolean
}

export type AccountModalDispatch = {
  setShowAccountSettingModal: Dispatch<SetStateAction<ModalState<string> | null>>
  setShowPricingModal: () => void
}

const AccountModalStateContext = createContext<AccountModalState>({
  showAccountSettingModal: null,
  showPricingModal: false,
})

const AccountModalDispatchContext = createContext<AccountModalDispatch>({
  setShowAccountSettingModal: noop,
  setShowPricingModal: noop,
})

export const useAccountModalState = <T,>(selector: (state: AccountModalState) => T): T =>
  useContextSelector(AccountModalStateContext, selector)

export const useAccountModalDispatch = <T,>(selector: (dispatch: AccountModalDispatch) => T): T =>
  useContextSelector(AccountModalDispatchContext, selector)

type AccountModalProviderProps = {
  children: React.ReactNode
}

export const AccountModalProvider = ({ children }: AccountModalProviderProps) => {
  const [showAccountSettingModal, setShowAccountSettingModal] = useState<ModalState<string> | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showPricingModal, setShowPricingModal] = useState(searchParams.get('show-pricing') === '1')

  const handleCancelAccountSettingModal = useCallback(() => {
    const educationVerifying = localStorage.getItem(EDUCATION_VERIFYING_LOCALSTORAGE_ITEM)

    if (educationVerifying === 'yes')
      localStorage.removeItem(EDUCATION_VERIFYING_LOCALSTORAGE_ITEM)

    removeSpecificQueryParam('action')
    setShowAccountSettingModal(null)
    if (showAccountSettingModal?.onCancelCallback)
      showAccountSettingModal?.onCancelCallback()
  }, [showAccountSettingModal])

  const stateValue = useMemo(() => ({
    showAccountSettingModal,
    showPricingModal,
  }), [showAccountSettingModal, showPricingModal])

  const dispatchValue = useMemo(() => ({
    setShowAccountSettingModal,
    setShowPricingModal: () => setShowPricingModal(true),
  }), [])

  return (
    <AccountModalStateContext.Provider value={stateValue}>
      <AccountModalDispatchContext.Provider value={dispatchValue}>
        <>
          {children}
          {
            !!showAccountSettingModal && (
              <AccountSetting
                activeTab={showAccountSettingModal.payload}
                onCancel={handleCancelAccountSettingModal}
              />
            )
          }
          {
            !!showPricingModal && (
              <Pricing onCancel={() => {
                if (searchParams.get('show-pricing') === '1')
                  router.push(location.pathname, { forceOptimisticNavigation: true } as any)
                removeSpecificQueryParam('action')
                setShowPricingModal(false)
              }} />
            )
          }
        </>
      </AccountModalDispatchContext.Provider>
    </AccountModalStateContext.Provider>
  )
}
