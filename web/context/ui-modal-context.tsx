'use client'

import type { Dispatch, SetStateAction } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { noop } from 'lodash-es'
import dynamic from 'next/dynamic'
import type { ModalState } from './modal-context'
import type { ModerationConfig, PromptVariable } from '../models/debug'
import type { ApiBasedExtension } from '../models/common'
import type { OpeningStatement } from '../app/components/base/features/types'
import type { InputVar } from '../app/components/workflow/types'
import type { UpdatePluginPayload } from '../app/components/plugins/types'
import type { ExpireNoticeModalPayloadProps } from '../app/education-apply/expire-notice-modal'

const ApiBasedExtensionModal = dynamic(() => import('../app/components/header/account-setting/api-based-extension-page/modal'), {
  ssr: false,
})
const ModerationSettingModal = dynamic(() => import('../app/components/base/features/new-feature-panel/moderation/moderation-setting-modal'), {
  ssr: false,
})
const AnnotationFullModal = dynamic(() => import('../app/components/billing/annotation-full/modal'), {
  ssr: false,
})
const OpeningSettingModal = dynamic(() => import('../app/components/base/features/new-feature-panel/conversation-opener/modal'), {
  ssr: false,
})
const UpdatePlugin = dynamic(() => import('../app/components/plugins/update-plugin'), {
  ssr: false,
})
const ExpireNoticeModal = dynamic(() => import('../app/education-apply/expire-notice-modal'), {
  ssr: false,
})

export type UIModalState = {
  showApiBasedExtensionModal: ModalState<ApiBasedExtension> | null
  showModerationSettingModal: ModalState<ModerationConfig> | null
  showAnnotationFullModal: boolean
  showOpeningModal: ModalState<OpeningStatement & {
    promptVariables?: PromptVariable[]
    workflowVariables?: InputVar[]
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void
  }> | null
  showUpdatePluginModal: ModalState<UpdatePluginPayload> | null
  showEducationExpireNoticeModal: ModalState<ExpireNoticeModalPayloadProps> | null
}

export type UIModalDispatch = {
  setShowApiBasedExtensionModal: Dispatch<SetStateAction<ModalState<ApiBasedExtension> | null>>
  setShowModerationSettingModal: Dispatch<SetStateAction<ModalState<ModerationConfig> | null>>
  setShowAnnotationFullModal: () => void
  setShowOpeningModal: Dispatch<SetStateAction<ModalState<OpeningStatement & {
    promptVariables?: PromptVariable[]
    workflowVariables?: InputVar[]
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void
  }> | null>>
  setShowUpdatePluginModal: Dispatch<SetStateAction<ModalState<UpdatePluginPayload> | null>>
  setShowEducationExpireNoticeModal: Dispatch<SetStateAction<ModalState<ExpireNoticeModalPayloadProps> | null>>
}

const UIModalStateContext = createContext<UIModalState>({
  showApiBasedExtensionModal: null,
  showModerationSettingModal: null,
  showAnnotationFullModal: false,
  showOpeningModal: null,
  showUpdatePluginModal: null,
  showEducationExpireNoticeModal: null,
})

const UIModalDispatchContext = createContext<UIModalDispatch>({
  setShowApiBasedExtensionModal: noop,
  setShowModerationSettingModal: noop,
  setShowAnnotationFullModal: noop,
  setShowOpeningModal: noop,
  setShowUpdatePluginModal: noop,
  setShowEducationExpireNoticeModal: noop,
})

export const useUIModalState = <T,>(selector: (state: UIModalState) => T): T =>
  useContextSelector(UIModalStateContext, selector)

export const useUIModalDispatch = <T,>(selector: (dispatch: UIModalDispatch) => T): T =>
  useContextSelector(UIModalDispatchContext, selector)

type UIModalProviderProps = {
  children: React.ReactNode
}

export const UIModalProvider = ({ children }: UIModalProviderProps) => {
  const [showApiBasedExtensionModal, setShowApiBasedExtensionModal] = useState<ModalState<ApiBasedExtension> | null>(null)
  const [showModerationSettingModal, setShowModerationSettingModal] = useState<ModalState<ModerationConfig> | null>(null)
  const [showAnnotationFullModal, setShowAnnotationFullModal] = useState(false)
  const [showOpeningModal, setShowOpeningModal] = useState<ModalState<OpeningStatement & {
    promptVariables?: PromptVariable[]
    workflowVariables?: InputVar[]
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void
  }> | null>(null)
  const [showUpdatePluginModal, setShowUpdatePluginModal] = useState<ModalState<UpdatePluginPayload> | null>(null)
  const [showEducationExpireNoticeModal, setShowEducationExpireNoticeModal] = useState<ModalState<ExpireNoticeModalPayloadProps> | null>(null)

  const handleCancelModerationSettingModal = useCallback(() => {
    setShowModerationSettingModal(null)
    if (showModerationSettingModal?.onCancelCallback)
      showModerationSettingModal.onCancelCallback()
  }, [showModerationSettingModal])

  const handleSaveApiBasedExtension = useCallback((newApiBasedExtension: ApiBasedExtension) => {
    if (showApiBasedExtensionModal?.onSaveCallback)
      showApiBasedExtensionModal.onSaveCallback(newApiBasedExtension)
    setShowApiBasedExtensionModal(null)
  }, [showApiBasedExtensionModal])

  const handleSaveModeration = useCallback((newModerationConfig: ModerationConfig) => {
    if (showModerationSettingModal?.onSaveCallback)
      showModerationSettingModal.onSaveCallback(newModerationConfig)
    setShowModerationSettingModal(null)
  }, [showModerationSettingModal])

  const handleCancelOpeningModal = useCallback(() => {
    setShowOpeningModal(null)
    if (showOpeningModal?.onCancelCallback)
      showOpeningModal.onCancelCallback()
  }, [showOpeningModal])

  const handleSaveOpeningModal = useCallback((newOpening: OpeningStatement) => {
    if (showOpeningModal?.onSaveCallback)
      showOpeningModal.onSaveCallback(newOpening)
    setShowOpeningModal(null)
  }, [showOpeningModal])

  const stateValue = useMemo(() => ({
    showApiBasedExtensionModal,
    showModerationSettingModal,
    showAnnotationFullModal,
    showOpeningModal,
    showUpdatePluginModal,
    showEducationExpireNoticeModal,
  }), [showApiBasedExtensionModal, showModerationSettingModal, showAnnotationFullModal, showOpeningModal, showUpdatePluginModal, showEducationExpireNoticeModal])

  const dispatchValue = useMemo(() => ({
    setShowApiBasedExtensionModal,
    setShowModerationSettingModal,
    setShowAnnotationFullModal: () => setShowAnnotationFullModal(true),
    setShowOpeningModal,
    setShowUpdatePluginModal,
    setShowEducationExpireNoticeModal,
  }), [])

  return (
    <UIModalStateContext.Provider value={stateValue}>
      <UIModalDispatchContext.Provider value={dispatchValue}>
        <>
          {children}
          {
            !!showApiBasedExtensionModal && (
              <ApiBasedExtensionModal
                data={showApiBasedExtensionModal.payload}
                onCancel={() => setShowApiBasedExtensionModal(null)}
                onSave={handleSaveApiBasedExtension}
              />
            )
          }
          {
            !!showModerationSettingModal && (
              <ModerationSettingModal
                data={showModerationSettingModal.payload}
                onCancel={handleCancelModerationSettingModal}
                onSave={handleSaveModeration}
              />
            )
          }
          {
            showAnnotationFullModal && (
              <AnnotationFullModal
                show={showAnnotationFullModal}
                onHide={() => setShowAnnotationFullModal(false)} />
            )
          }
          {showOpeningModal && (
            <OpeningSettingModal
              data={showOpeningModal.payload}
              onSave={handleSaveOpeningModal}
              onCancel={handleCancelOpeningModal}
              promptVariables={showOpeningModal.payload.promptVariables}
              workflowVariables={showOpeningModal.payload.workflowVariables}
              onAutoAddPromptVariable={showOpeningModal.payload.onAutoAddPromptVariable}
            />
          )}
          {
            !!showUpdatePluginModal && (
              <UpdatePlugin
                {...showUpdatePluginModal.payload}
                onCancel={() => {
                  setShowUpdatePluginModal(null)
                  showUpdatePluginModal.onCancelCallback?.()
                }}
                onSave={() => {
                  setShowUpdatePluginModal(null)
                  showUpdatePluginModal.onSaveCallback?.({} as any)
                }}
              />
            )
          }
          {
            !!showEducationExpireNoticeModal && (
              <ExpireNoticeModal
                {...showEducationExpireNoticeModal.payload}
                onClose={() => setShowEducationExpireNoticeModal(null)}
              />
            )}
        </>
      </UIModalDispatchContext.Provider>
    </UIModalStateContext.Provider>
  )
}
