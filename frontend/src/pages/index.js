import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers';
import ConnectWallet from '../components/ConnectWallet';
import auctionAddress from '../../contracts/DutchAuction-contract-address.json';
import auctionArticfact from '../../contracts/DutchAuction.json';
import { useEffect, useState } from 'react';

const HARDHAT_NETWORK_ID = '31337'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

const Home = () => {
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isTxBeingSent, setIsTxBeingSent] = useState(null)
  const [networkError, setNetworkError] = useState(null)
  const [transactionError, setTransactionError] = useState(null)
  const [balance, setBalance] = useState(null)
  const [provider, setProvider] = useState(null)
  const [auction, setAuction] = useState(null)
  const [startingPrice, setStartingPrice] = useState(null)
  const [startAt, setStartAt] = useState(null)
  const [discountRate, setDiscountRate] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(null)

  const connectWallet = async () => {
    if (window.ethereum === undefined) {
      setNetworkError('Please, install Metatmask!')

      return
    }

    const [selectedAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (!checkIsHardHatNetwork()) {
      return
    }

    initialize(selectedAddress)

    window.ethereum.on('chainChanged', ([networkId]) => {
      resetState()
    })
  }

  const initialize = async (selectedAddress) => {
    setProvider(
      new ethers.providers.Web3Provider(window.ethereum)
    )

    setSelectedAccount(selectedAddress)
  }

  const updateBalance = async () => {
    const newBalance = await provider.getBalance(selectedAccount)
    setBalance(newBalance.toString())
  }

  const setAuctionInfo = async () => {
    setStartingPrice(await auction.startingPrice())
    setStartAt(await auction.startAt())
    setDiscountRate(await auction.discountRate())
  }


  useEffect(() => {
    if(provider) {
      setAuction(
        new ethers.Contract(
          auctionAddress.DutchAuction,
          auctionArticfact.abi,
          provider.getSigner(0)
        )
      )
    }
  }, [provider])

  useEffect(() => {
    if(selectedAccount) {
      updateBalance()
    }
  }, [selectedAccount])

  useEffect(() => {
    if(auction) {
      setAuctionInfo()
    }
  }, [auction])

  useEffect(() => {
    if (startingPrice && startAt && discountRate) {
      setInterval(() => {
        const elapsed = ethers.BigNumber.from(Date.now()).sub(startAt);
        const discount = discountRate.mul(elapsed)
        const newPrice = startingPrice.sub(discount)

        setCurrentPrice(
          ethers.utils.formatEther(newPrice)
        )
      }, 2000)
    }
  }, [startingPrice, startAt, discountRate])

  const resetState = () => {
    setSelectedAccount(null)
    setIsTxBeingSent(null)
    setNetworkError(null)
    setTransactionError(null)
    setBalance(null)
    setProvider(null)
    setAuction(null)
  }

  const checkIsHardHatNetwork = () => {
    console.log(window.ethereum.networkVersion)
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }

    setNetworkError('Please connect to localhost:8545')

    return false
  }

  const dismissError = () => {
    setNetworkError(null)
  }

  return (
    <>
      {!selectedAccount && (
        <ConnectWallet 
          connectWallet={connectWallet}
          networkError={networkError}
          dismiss={dismissError}
        />
      )}

        {balance &&
          <p>Your balance: {ethers.utils.formatEther(balance)} ETH</p>
        }

        {currentPrice && (
          <p>{currentPrice}</p>
        )}
    </>
  )
}

export default Home