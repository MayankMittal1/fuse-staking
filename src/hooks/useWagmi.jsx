import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import fuse from '../constants/fuseChain'
const walletConnectProjectId = CONFIG.projectId

const { chains, provider, webSocketProvider } = configureChains(
  [fuse],
  [walletConnectProvider({ projectId: walletConnectProjectId })]
)

const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: 'Fuse Staking',
    chains,
    version: '2',
    projectId: walletConnectProjectId
  }),
  provider,
  webSocketProvider
})

export { chains, client, provider, webSocketProvider, walletConnectProjectId }
