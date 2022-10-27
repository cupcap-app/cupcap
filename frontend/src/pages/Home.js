import ConnectWalletButton from "../components/ConnectWalletButton";
import DisconnectWalletButton from "../components/DisconnectWalletButton";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const Home = () => {
  const { provider, walletAddress } = useWeb3Auth();
  return (
    <>
      {provider ? (
        <>
          {walletAddress}
          <DisconnectWalletButton />
        </>
      ) : (
        <>
          <ConnectWalletButton />
        </>
      )}
    </>
  );
};

export default Home;
