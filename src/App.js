import React from 'react'
import { ModalProvider } from 'react-modal-hook'
import { TransitionGroup } from 'react-transition-group'
import { Provider } from 'react-redux'
import Root from '@/containers/Root.jsx'
import rootSaga from '@/sagas/index'
import configureStore from '@/store/configureStore'
import { WagmiConfig } from 'wagmi'
import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'

import { chains, client, walletConnectProjectId } from './hooks/useWagmi'

const { store } = configureStore(window.__INITIAL_STATE__)

store.runSaga(rootSaga)

const ethereumClient = new EthereumClient(client, chains)

const App = () => {
  return (
    <WagmiConfig client={client}>
      <ModalProvider rootComponent={TransitionGroup}>
        <Provider store={store}>
          <Root />
        </Provider>
      </ModalProvider>
      <Web3Modal
        projectId={walletConnectProjectId}
        ethereumClient={ethereumClient}
      />
    </WagmiConfig>
  )
}

export default App
