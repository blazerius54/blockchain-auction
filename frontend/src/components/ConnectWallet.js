import { NetworkErrorMessage } from "./NetworkErrorMessage"

const ConnectWallet = ({ connectWallet, networkError, dismiss }) => (
    <>
      {/*<div>*/}
      {/*  {networkError && (*/}
      {/*    <NetworkErrorMessage */}
      {/*      message={networkError} */}
      {/*      dismiss={dismiss} */}
      {/*    />*/}
      {/*  )}*/}
      {/*</div>*/}

      <p>Please connect your account...</p>
      <button type="button" onClick={connectWallet}>
        Connect Wallet
      </button>
    </>
)

export default ConnectWallet;
