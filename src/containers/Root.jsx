import ReactGA from 'react-ga4'
import React, { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Header from '@/components/common/Header.jsx'
import Footer from '@/components/common/Footer.jsx'
import HomePage from '@/pages/Home'
import { getWeb3 } from '@/services/web3'
import {
  useProvider,
  useAccount,
  useSigner
} from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'
import { connectToWallet, disconnectWallet } from '@/actions/network'

export default () => {
  const providerInfo = useProvider()
  const dispatch = useDispatch()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  useEffect(() => {
    if (!address) {
      dispatch(disconnectWallet())
    }
  }, [address])

  const { open } = useWeb3Modal()

  const handleLogout = useCallback(async () => {
    try {
      open({
        route: 'Account'
      })
    } catch (e) {
      console.error(e)
    }
  }, [providerInfo])

  const handleConnect = useCallback(async () => {
    open({
      route: 'ConnectWallet'
    })
    ReactGA.event({
      category: 'action',
      action: 'Connect wallet',
      label: 'Connect wallet'
    })
  }, [providerInfo])

  useEffect(() => {
    if (!signer) return
    getWeb3({ provider: signer })
    dispatch(connectToWallet({ account: address }))
  }, [signer, address])

  return (
    <>
      <Header handleConnect={handleConnect} handleLogout={handleLogout} />
      <HomePage handleConnect={handleConnect} />
      <Footer />
    </>
  )
}
