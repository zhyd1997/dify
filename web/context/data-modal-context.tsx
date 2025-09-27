'use client'

import type { Dispatch, SetStateAction } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { noop } from 'lodash-es'
import dynamic from 'next/dynamic'
import type { ModalState } from './modal-context'
import type { ExternalDataTool } from '../models/common'
import type { CreateExternalAPIReq } from '../app/components/datasets/external-api/declarations'

const ExternalDataToolModal = dynamic(() => import('../app/components/app/configuration/tools/external-data-tool-modal'), {
  ssr: false,
})
const ExternalAPIModal = dynamic(() => import('../app/components/datasets/external-api/external-api-modal'), {
  ssr: false,
})

export type DataModalState = {
  showExternalDataToolModal: ModalState<ExternalDataTool> | null
  showExternalKnowledgeAPIModal: ModalState<CreateExternalAPIReq> | null
}

export type DataModalDispatch = {
  setShowExternalDataToolModal: Dispatch<SetStateAction<ModalState<ExternalDataTool> | null>>
  setShowExternalKnowledgeAPIModal: Dispatch<SetStateAction<ModalState<CreateExternalAPIReq> | null>>
}

const DataModalStateContext = createContext<DataModalState>({
  showExternalDataToolModal: null,
  showExternalKnowledgeAPIModal: null,
})

const DataModalDispatchContext = createContext<DataModalDispatch>({
  setShowExternalDataToolModal: noop,
  setShowExternalKnowledgeAPIModal: noop,
})

export const useDataModalState = <T,>(selector: (state: DataModalState) => T): T =>
  useContextSelector(DataModalStateContext, selector)

export const useDataModalDispatch = <T,>(selector: (dispatch: DataModalDispatch) => T): T =>
  useContextSelector(DataModalDispatchContext, selector)

type DataModalProviderProps = {
  children: React.ReactNode
}

export const DataModalProvider = ({ children }: DataModalProviderProps) => {
  const [showExternalDataToolModal, setShowExternalDataToolModal] = useState<ModalState<ExternalDataTool> | null>(null)
  const [showExternalKnowledgeAPIModal, setShowExternalKnowledgeAPIModal] = useState<ModalState<CreateExternalAPIReq> | null>(null)

  const handleCancelExternalDataToolModal = useCallback(() => {
    setShowExternalDataToolModal(null)
    if (showExternalDataToolModal?.onCancelCallback)
      showExternalDataToolModal.onCancelCallback()
  }, [showExternalDataToolModal])

  const handleSaveExternalDataTool = useCallback((newExternalDataTool: ExternalDataTool) => {
    if (showExternalDataToolModal?.onSaveCallback)
      showExternalDataToolModal.onSaveCallback(newExternalDataTool)
    setShowExternalDataToolModal(null)
  }, [showExternalDataToolModal])

  const handleValidateBeforeSaveExternalDataTool = useCallback((newExternalDataTool: ExternalDataTool) => {
    if (showExternalDataToolModal?.onValidateBeforeSaveCallback)
      return showExternalDataToolModal?.onValidateBeforeSaveCallback(newExternalDataTool)
    return true
  }, [showExternalDataToolModal])

  const handleCancelExternalApiModal = useCallback(() => {
    setShowExternalKnowledgeAPIModal(null)
    if (showExternalKnowledgeAPIModal?.onCancelCallback)
      showExternalKnowledgeAPIModal.onCancelCallback()
  }, [showExternalKnowledgeAPIModal])

  const handleSaveExternalApiModal = useCallback(async (updatedFormValue: CreateExternalAPIReq) => {
    if (showExternalKnowledgeAPIModal?.onSaveCallback)
      showExternalKnowledgeAPIModal.onSaveCallback(updatedFormValue)
    setShowExternalKnowledgeAPIModal(null)
  }, [showExternalKnowledgeAPIModal])

  const handleEditExternalApiModal = useCallback(async (updatedFormValue: CreateExternalAPIReq) => {
    if (showExternalKnowledgeAPIModal?.onEditCallback)
      showExternalKnowledgeAPIModal.onEditCallback(updatedFormValue)
    setShowExternalKnowledgeAPIModal(null)
  }, [showExternalKnowledgeAPIModal])

  const stateValue = useMemo(() => ({
    showExternalDataToolModal,
    showExternalKnowledgeAPIModal,
  }), [showExternalDataToolModal, showExternalKnowledgeAPIModal])

  const dispatchValue = useMemo(() => ({
    setShowExternalDataToolModal,
    setShowExternalKnowledgeAPIModal,
  }), [])

  return (
    <DataModalStateContext.Provider value={stateValue}>
      <DataModalDispatchContext.Provider value={dispatchValue}>
        <>
          {children}
          {
            !!showExternalDataToolModal && (
              <ExternalDataToolModal
                data={showExternalDataToolModal.payload}
                onCancel={handleCancelExternalDataToolModal}
                onSave={handleSaveExternalDataTool}
                onValidateBeforeSave={handleValidateBeforeSaveExternalDataTool}
              />
            )
          }
          {
            !!showExternalKnowledgeAPIModal && (
              <ExternalAPIModal
                data={showExternalKnowledgeAPIModal.payload}
                datasetBindings={showExternalKnowledgeAPIModal.datasetBindings ?? []}
                onSave={handleSaveExternalApiModal}
                onCancel={handleCancelExternalApiModal}
                onEdit={handleEditExternalApiModal}
                isEditMode={showExternalKnowledgeAPIModal.isEditMode ?? false}
              />
            )
          }
        </>
      </DataModalDispatchContext.Provider>
    </DataModalStateContext.Provider>
  )
}
