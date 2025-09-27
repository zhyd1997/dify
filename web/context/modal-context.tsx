'use client'

import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useContextSelector } from 'use-context-selector'
import type {
  ConfigurationMethodEnum,
  Credential,
  CustomConfigurationModelFixedFields,
  CustomModel,
  ModelProvider,
} from '@/app/components/header/account-setting/model-provider-page/declarations'
import type { ModerationConfig, PromptVariable } from '@/models/debug'
import type {
  ApiBasedExtension,
  ExternalDataTool,
} from '@/models/common'
import type { CreateExternalAPIReq } from '@/app/components/datasets/external-api/declarations'
import type { ModelLoadBalancingModalProps } from '@/app/components/header/account-setting/model-provider-page/provider-added-card/model-load-balancing-modal'
import type { OpeningStatement } from '@/app/components/base/features/types'
import type { InputVar } from '@/app/components/workflow/types'
import type { UpdatePluginPayload } from '@/app/components/plugins/types'
import { noop } from 'lodash-es'
import type { ExpireNoticeModalPayloadProps } from '@/app/education-apply/expire-notice-modal'
import type { ModelModalModeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations'
import { AccountModalProvider } from './account-modal-context'
import { ModelModalProvider } from './model-modal-context'
import { DataModalProvider } from './data-modal-context'
import { UIModalProvider } from './ui-modal-context'

export type ModalState<T> = {
  payload: T
  onCancelCallback?: () => void
  onSaveCallback?: (newPayload?: T, formValues?: Record<string, any>) => void
  onRemoveCallback?: (newPayload?: T, formValues?: Record<string, any>) => void
  onEditCallback?: (newPayload: T) => void
  onValidateBeforeSaveCallback?: (newPayload: T) => boolean
  isEditMode?: boolean
  datasetBindings?: { id: string; name: string }[]
}

export type ModelModalType = {
  currentProvider: ModelProvider
  currentConfigurationMethod: ConfigurationMethodEnum
  currentCustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields
  isModelCredential?: boolean
  credential?: Credential
  model?: CustomModel
  mode?: ModelModalModeEnum
}

export type ModalContextState = {
  setShowAccountSettingModal: Dispatch<SetStateAction<ModalState<string> | null>>
  setShowApiBasedExtensionModal: Dispatch<SetStateAction<ModalState<ApiBasedExtension> | null>>
  setShowModerationSettingModal: Dispatch<SetStateAction<ModalState<ModerationConfig> | null>>
  setShowExternalDataToolModal: Dispatch<SetStateAction<ModalState<ExternalDataTool> | null>>
  setShowPricingModal: () => void
  setShowAnnotationFullModal: () => void
  setShowModelModal: Dispatch<SetStateAction<ModalState<ModelModalType> | null>>
  setShowExternalKnowledgeAPIModal: Dispatch<SetStateAction<ModalState<CreateExternalAPIReq> | null>>
  setShowModelLoadBalancingModal: Dispatch<SetStateAction<ModelLoadBalancingModalProps | null>>
  setShowOpeningModal: Dispatch<SetStateAction<ModalState<OpeningStatement & {
    promptVariables?: PromptVariable[]
    workflowVariables?: InputVar[]
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void
  }> | null>>
  setShowUpdatePluginModal: Dispatch<SetStateAction<ModalState<UpdatePluginPayload> | null>>
  setShowEducationExpireNoticeModal: Dispatch<SetStateAction<ModalState<ExpireNoticeModalPayloadProps> | null>>
}
const ModalContext = createContext<ModalContextState>({
  setShowAccountSettingModal: noop,
  setShowApiBasedExtensionModal: noop,
  setShowModerationSettingModal: noop,
  setShowExternalDataToolModal: noop,
  setShowPricingModal: noop,
  setShowAnnotationFullModal: noop,
  setShowModelModal: noop,
  setShowExternalKnowledgeAPIModal: noop,
  setShowModelLoadBalancingModal: noop,
  setShowOpeningModal: noop,
  setShowUpdatePluginModal: noop,
  setShowEducationExpireNoticeModal: noop,
})

export const useModalContext = () => useContext(ModalContext)

// Adding a dangling comma to avoid the generic parsing issue in tsx, see:
// https://github.com/microsoft/TypeScript/issues/15713
export const useModalContextSelector = <T,>(selector: (state: ModalContextState) => T): T =>
  useContextSelector(ModalContext, selector)

export {
  useAccountModalState,
  useAccountModalDispatch,
} from './account-modal-context'
export {
  useModelModalState,
  useModelModalDispatch,
} from './model-modal-context'
export {
  useDataModalState,
  useDataModalDispatch,
} from './data-modal-context'
export {
  useUIModalState,
  useUIModalDispatch,
} from './ui-modal-context'

type ModalContextProviderProps = {
  children: React.ReactNode
}
export const ModalContextProvider = ({
  children,
}: ModalContextProviderProps) => {
  return (
    <AccountModalProvider>
      <ModelModalProvider>
        <DataModalProvider>
          <UIModalProvider>
            {children}
          </UIModalProvider>
        </DataModalProvider>
      </ModelModalProvider>
    </AccountModalProvider>
  )
}

export default ModalContext
