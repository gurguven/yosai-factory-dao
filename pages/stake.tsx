import {
    ThirdwebNftMedia,
    useAddress,
    useMetamask,
    useTokenBalance,
    useOwnedNFTs,
    useContract,
  } from "@thirdweb-dev/react";
  import { BigNumber, ethers } from "ethers";
  import type { NextPage } from "next";
  import { useEffect, useState } from "react";
  import styles from "../styles/Home.module.css";
  import Chargement from "./components/Chargement";
  
  const nftDropContractAddress = "0xF322C17D7aC1fc752425E14a94578C39bdBE7570";
  const tokenContractAddress = "0x2191b0C37c168c205c238ed29776Da50c5f68f02";
  const stakingContractAddress = "0xF9Ca98143d8A38858F1eb8acd827b836D2FB5B67";
  
  const Stake: NextPage = () => {
    /**
     * Hooks : connection de wallet 
     */  
    const address = useAddress();
    const connectWithMetamask = useMetamask();
  
    /**
     * Hooks: récupération des contrats
     */
    const { contract: nftDropContract } = useContract(nftDropContractAddress,"nft-drop");
  
    const { contract: tokenContract } = useContract(tokenContractAddress);
  
    const { contract, isLoading } = useContract(stakingContractAddress);
  
    /**
     * Chargement des NFT non-stakées
     */
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  
    /**
     * Chargement de la Token Balance 
     */
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  
    ///////////////////////////////////////////////////////////////////////////
    // Fonctions du contrat 
    ///////////////////////////////////////////////////////////////////////////
    const [stakedNfts, setStakedNfts] = useState<any[]>([]);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const [claimableRewardsN, setClaimableRewardsN] = useState<number>(0);
    const [openStakeTab, setOpenTab] = useState(true); 
    const [isClaimed, setClaim] = useState<any[]>([])
  
    // UseEffect permettant d'afficher les NFT stackées 
    useEffect(() => {
      // Si il n'y a pas de contrat détecté, le useEffect se stoppe ici
      if (!contract || !nftDropContract) return;
  
      async function loadStakedNfts() {
        const stakedTokens = await contract?.call("getStakedTokens", address);
        // Pour chaque NFT staké, on en crée un élément 
        const stakedNfts = await Promise.all(
          stakedTokens?.map(
            async (stakedToken: { staker: string; tokenId: BigNumber }) => {
              const nft = await nftDropContract?.get(stakedToken.tokenId);
              // const isClaimed = await contract?.call("isClaimed", stakedToken.tokenId);
              // console.log(stakedToken.tokenId, isClaimed);
              return nft;

              

            }
          )
        );
  
        setStakedNfts(stakedNfts);
        // console.log("setStakedNfts", stakedNfts);
      }

      // Si il y'a une addresse détéctée, on charge les NFT stackées 
      if (address) {
        loadStakedNfts();
      }
    }, [address, contract, nftDropContract, openStakeTab, stakedNfts, tokenBalance]);
  
    useEffect(() => {
      // Si il n'y a pas de contrat ou address détecté, le useEffect se stoppe ici
      if (!contract || !address) return;
  
      async function loadClaimableRewards() {
        const cr = await contract?.call("availableRewards", address);
        console.log("Loaded claimable rewards", cr);
        setClaimableRewards(cr);
        setClaimableRewardsN(parseInt(cr.toString()))
      }
  
      loadClaimableRewards();
    }, [address, contract, nftDropContract, ownedNfts]);
  
    ///////////////////////////////////////////////////////////////////////////
    // Write Functions
    ///////////////////////////////////////////////////////////////////////////

    // Fonction permettant de stake son NFT 
    async function stakeNft(id: string) {
      if (!address) return;
  
      // Vérification que l'addresse connectée possède le droit de stake ou récupérer les NFT
      const isApproved = await nftDropContract?.isApproved(
        address,
        stakingContractAddress
      );

      // Si elle n'est pas approuvée, request de l'approve
      if (!isApproved) {
        await nftDropContract?.setApprovalForAll(stakingContractAddress, true)
        .then(() => (alert("Allowance accordée")))
        .catch(() => (alert("Erreur, veuillez réitérer"))); 
      }
      const stake = await contract?.call("stake", id)
      .then(() => (alert("NFT Staké")))
      .catch(() => (alert("Erreur, veuillez réitérer")));
    }
  
    // Fonction permettant de récupérer son NFT 
    async function withdraw(id: BigNumber) {
      const withdraw = await contract?.call("withdraw", id)
      // .catch(() => (alert("Erreur, veuillez réitérer")));
      .catch((err) => alert(err))
    }
  
    // Fonction permettant de récupérer ses rewards
    async function claimRewards() {
      const claim = await contract?.call("claimRewards")
      .then(() => (alert("Votre tokens ont été claim")))
      .catch(() => (alert("Erreur, veuillez réitérer"))); 
    }

  
    if (isLoading) {
      return <div><Chargement/></div>;
    }
  
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>Stakez vos NFTs pour obtenir des rewards en YSF Token !</h1>
  
        <hr className={`${styles.divider} ${styles.spacerTop}`} />
  
        {!address ? (
          <button className={styles.mainButton} onClick={connectWithMetamask}>
            Connecter sa wallet
          </button>
        ) : (
          <>
            <h2>Vos Tokens</h2>

            <div className={styles.stakingInfo}>
              <div className={styles.left}>
                <h2>Total FUNGITOS Staké(s)</h2>
                <p>Ajouté le: </p>
              </div>
              <div className={styles.right}>
                <h2> {stakedNfts.length} NFT</h2>
              </div>  

            </div>
  
            <div className={styles.tokenGrid}>
              <div className={styles.tokenItem}>

                

                <h3 className={styles.tokenLabel}>Récompenses à récupérer</h3>
                <p className={styles.tokenValue}>
                  <b>
                    {!claimableRewards
                      ? "Chargement..."
                      : ethers.utils.formatUnits(claimableRewards, 18)}
                  </b>{" "}
                  {tokenBalance?.symbol}
                </p>
              </div>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Balance actuelle</h3>
                <p className={styles.tokenValue}>
                  <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
                </p>
              </div>
            </div>
  
            {
              claimableRewardsN == 0 ? (
                <></>
              ) : (
              <button
                  className={`${styles.mainButton} ${styles.spacerTop}`}
                  onClick={() => claimRewards()}
                >
                  Récupérer
            </button>
              )
            }
  
                  {
                    openStakeTab ? (
                    <div className={styles.stakeContainer}>
                      <div>
                        <div className={styles.stakeNav}>
                        <div className={`${styles.stakeHeader} ${styles.active}`} onClick={() => setOpenTab(true)}>
                          <h2>STAKE</h2>
                        </div>
                        <div className={styles.unstakeHeader} onClick={() => setOpenTab(false)}>
                          <h2>UNSTAKE</h2>
                        </div>
                      </div>

                      <hr className={`${styles.divider} ${styles.spacerTop} ${styles.marginzero}`} />
                      
                      <div className={styles.stakeTab}>

                        {
                          (ownedNfts?.length == 0) ? (
                            <h2>Vous n{`'`}avez aucun Fungitos à staker</h2>
                          ) : !ownedNfts ? (
                              <Chargement />
                            ) : (
                              <h2>Vos NFTs à staker</h2>
                          )
                        }
    
                        <div className={styles.nftBoxGrid}>
                          {ownedNfts?.map((nft) => (
                            <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                              <ThirdwebNftMedia
                                metadata={nft.metadata}
                                className={styles.nftMedia}
                              />
                              <h3>{nft.metadata.name}</h3>
                              <button
                                className={`${styles.mainButton} ${styles.spacerBottom}`}
                                onClick={() => stakeNft(nft.metadata.id)}
                              >
                                Stake
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                        
                      </div>
                    </div>    
                    ) : (
                      <div className={styles.stakeContainer}>
                      <div>
                        <div className={styles.stakeNav}>
                        <div className={`${styles.stakeHeader}`} onClick={() => setOpenTab(true)}>
                          <h2>STAKE</h2>
                        </div>
                        <div className={`${styles.unstakeHeader} ${styles.active}`} onClick={() => setOpenTab(false)}>
                          <h2>UNSTAKE</h2>
                        </div>
                      </div>

                      <hr className={`${styles.divider} ${styles.spacerTop} ${styles.marginzero}`} />
                      
                      <div className={styles.stakeTab}>

                         {
                          (stakedNfts?.length == 0) ? (
                            <h2>Vous n{`'`}avez aucun Fungitos staké</h2>
                          ) : !ownedNfts ? (
                              <Chargement />
                            ) : (
                              <h2>Vos NFTs stakés</h2>
                          )
                        }
                          <div className={styles.nftBoxGrid}>
                            {stakedNfts?.map((nft) => (
                              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                                <ThirdwebNftMedia
                                  metadata={nft.metadata}
                                  className={styles.nftMedia}
                                />
                                <h3>{nft.metadata.name}</h3>
                                <button
                                  className={`${styles.mainButton} ${styles.spacerBottom}`}
                                  onClick={() => withdraw(nft.metadata.id)}
                                >
                                  Withdraw
                                </button>
                              </div>
                            ))}
                          </div>
                      </div>
                        
                      </div>
                    </div>    
                    )
                  }
          </>
        )}
      </div>
    );
  };
  
  export default Stake;