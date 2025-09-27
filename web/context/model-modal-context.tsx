'use client'

import type { Dispatch, SetStateAction } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { noop } from 'lodash-es'
import dynamic from 'next/dynamic'
import type { ModalState, ModelModalType } from './modal-context'
import type { ModelLoadBalancingModalProps } from '../app/components/header/account-setting/model-provider-page/provider-added-card/model-load-balancing-modal'

const ModelModal = dynamic(() => import('../app/components/header/account-setting/model-provider-page/model-modal'), {
  ssr: false,
})
const ModelLoadBalancingModal = dynamic(() => import('../app/components/header/account-setting/model-provider-page/provider-added-card/model-load-balancing-modal'), {
  ssr: false,
})

export type ModelModalState = {
  showModelModal: ModalState<ModelModalType> | null
  showModelLoadBalancingModal: ModelLoadBalancingModalProps | null
}

export type ModelModalDispatch = {
  setShowModelModal: Dispatch<SetStateAction<ModalState<ModelModalType> | null>>
  setShowModelLoadBalancingModal: Dispatch<SetStateAction<ModelLoadBalancingModalProps | null>>
}

const ModelModalStateContext = createContext<ModelModalState>({
  showModelModal: null,
  showModelLoadBalancingModal: null,
})

const ModelModalDispatchContext = createContext<ModelModalDispatch>({
  setShowModelModal: noop,
  setShowModelLoadBalancingModal: noop,
})

export const useModelModalState = <T,>(selector: (state: ModelModalState) => T): T =>
  useContextSelector(ModelModalStateContext, selector)

export const useModelModalDispatch = <T,>(selector: (dispatch: ModelModalDispatch) => T): T =>
  useContextSelector(ModelModalDispatchContext, selector)

type ModelModalProviderProps = {
  children: React.ReactNode
}

export const ModelModalProvider = ({ children }: ModelModalProviderProps) => {
  const [showModelModal, setShowModelModal] = useState<ModalState<ModelModalType> | null>(null)
  const [showModelLoadBalancingModal, setShowModelLoadBalancingModal] = useState<ModelLoadBalancingModalProps | null>(null)

  const handleCancelModelModal = useCallback(() => {
    setShowModelModal(null)
    if (showModelModal?.onCancelCallback)
      showModelModal.onCancelCallback()
  }, [showModelModal])

  const handleSaveModelModal = useCallback((formValues?: Record<string, any>) => {
    if (showModelModal?.onSaveCallback)
      showModelModal.onSaveCallback(showModelModal.payload, formValues)
    setShowModelModal(null)
  }, [showModelModal])

  const handleRemoveModelModal = useCallback((formValues?: Record<string, any>) => {
    if (showModelModal?.onRemoveCallback)
      showModelModal.onRemoveCallback(showModelModal.payload, formValues)
    setShowModelModal(null)
  }, [showModelModal])

  const stateValue = useMemo(() => ({
    showModelModal,
    showModelLoadBalancingModal,
  }), [showModelModal, showModelLoadBalancingModal])

  const dispatchValue = useMemo(() => ({
    setShowModelModal,
    setShowModelLoadBalancingModal,
  }), [])

  return (
    <ModelModalStateContext.Provider value={stateValue}>
      <ModelModalDispatchContext.Provider value={dispatchValue}>
        <>
          {children}
          {
            !!showModelModal && (
              <ModelModal
                provider={showModelModal.payload.currentProvider}
                configurateMethod={showModelModal.payload.currentConfigurationMethod}
                currentCustomConfigurationModelFixedFields={showModelModal.payload.currentCustomConfigurationModelFixedFields}
                isModelCredential={showModelModal.payload.isModelCredential}
                credential={showModelModal.payload.credential}
                model={showModelModal.payload.model}
                mode={showModelModal.payload.mode}
                onCancel={handleCancelModelModal}
                onSave={handleSaveModelModal}
                onRemove={handleRemoveModelModal}
              />
            )
          }
          {
            Boolean(showModelLoadBalancingModal) && (
              <ModelLoadBalancingModal {...showModelLoadBalancingModal!} />
            )
          }
        </>
      </ModelModalDispatchContext.Provider>
    </ModelModalStateContext.Provider>
  )
}
