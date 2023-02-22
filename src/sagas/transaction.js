import { call, put, fork, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import {
  transactionPending,
  transactionConfirmed,
  transactionFailed,
  transactionSucceeded
} from '@/actions/transactions'

export function * transactionFlow ({
  transactionPromise,
  action,
  confirmationsLimit,
  tokenAddress
}) {
  if (confirmationsLimit) {
    yield fork(transactionConfirmations, {
      transactionPromise,
      action,
      confirmationsLimit
    })
  }

  const receipt = yield new Promise((resolve, reject) => {
    transactionPromise
      .then((res) => {
        res.wait().then((tx) => {
          resolve(tx)
        })
      })
      .catch((error) => {
        const rejected = 'User rejected the request.'
        if (
          (typeof error === 'string' && error.includes(rejected)) ||
          (typeof error.message === 'string' &&
            error.message.includes(rejected))
        ) {
          if (error.error) {
            error.error = rejected
            reject(error)
          } else {
            const err = 'User rejected the request.'
            reject(err)
          }
        }
        reject(error)
      })
  })

  yield put(transactionPending(action, receipt.transactionHash))

  if (!Number(receipt.status)) {
    yield put(transactionFailed(action, receipt))
    return receipt
  }

  yield put(transactionSucceeded(action, receipt, { tokenAddress }))

  return receipt
}

function createConfirmationChannel (transactionPromise) {
  return eventChannel((emit) => {
    const func = (confirmationNumber, receipt) => {
      emit({ receipt, confirmationNumber })
    }

    const emitter = transactionPromise.on('confirmation', func)

    const unsubscribe = () => {
      emitter.off('confirmation')
    }
    return unsubscribe
  })
}

export function * transactionConfirmations ({
  confirmationsLimit,
  transactionPromise,
  action
}) {
  const confirmationChannel = yield call(
    createConfirmationChannel,
    transactionPromise
  )

  let isWaiting = true
  while (isWaiting) {
    const { receipt, confirmationNumber } = yield take(confirmationChannel)
    yield put(transactionConfirmed(action, receipt, confirmationNumber))
    if (confirmationNumber > confirmationsLimit) {
      confirmationChannel.close()
      isWaiting = false
    }
  }
}
