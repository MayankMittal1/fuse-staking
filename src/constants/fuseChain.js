const fuse = {
  id: 122,
  name: 'Fuse',
  network: 'Fuse Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Fuse',
    symbol: 'FUSE'
  },
  rpcUrls: {
    public: { http: ['https://rpc.fuse.io'] },
    default: { http: ['https://rpc.fuse.io'] }
  },
  blockExplorers: {
    default: { name: 'Fuse Explorer', url: 'https://explorer.fuse.io' }
  }
}

export default fuse
