import {
    ThirdwebNftMedia,
    useAddress,
    useMetamask,
    useTokenBalance,
    useContract,
    useSDK
  } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import {BsFillPersonLinesFill} from 'react-icons/bs'
import Chargement from "./components/Chargement";
import DAOABI from '../artifacts/contracts/YSFDAO.sol/YSFDAO.json'
import Link from "next/link";

const pointsToRankOne = 0;
const pointsToRankTwo = 100;
const pointsToRankThree = 500;
const pointsToRankFour = 1000;

const Profile = () => {

    const DAOADDRESS = "0xAaEb6F488C81d08317f1bC4B96786C990E6cd9c9"
    const YSFTOKENADDRESS = "0x2191b0C37c168c205c238ed29776Da50c5f68f02"
    const nftDropContractAddress = "0xF322C17D7aC1fc752425E14a94578C39bdBE7570";
    const stakingContractAddress = "0xF9Ca98143d8A38858F1eb8acd827b836D2FB5B67";
    
/**
 * Hooks: récupération des contrats
 */
    const { contract: nftDropContract } = useContract(nftDropContractAddress,"nft-drop");

    // const { contract: tokenContract } = useContract(tokenContractAddress,"token");
    const { contract: tokenContract } = useContract(YSFTOKENADDRESS);

    const { contract, isLoading } = useContract(stakingContractAddress);
    const { contract : DAOCONTRACT } = useContract(DAOADDRESS);

    const sdk = useSDK(); 
    const address = useAddress();
    const connectWithMetamask = useMetamask();

    const { data: tokenBalance } = useTokenBalance(tokenContract, address);

    const [minAddress, setFormatAddress] = useState<string>("Ox...")
    const [rank, setRank] = useState<number>()
    const [points, setPoints] = useState<number>(0)
    const [isInYsfDao, setYsf1] = useState<boolean>()
    const [isInYsfProd, setYsf2] = useState<boolean>()
    const [isInYsfSpace, setYsf3] = useState<boolean>()
    const [isInYsfPark, setYsf4] = useState<boolean>()
    const [stakedNfts, setStakedNfts] = useState<any[]>([]);
    const [stakedNftsLoaded, setStakedNftsLoad] = useState<boolean>(false);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const [claimableRewardsN, setClaimableRewardsN] = useState<number>(0);
    const [accessLoaded, setAccessStatus] = useState<boolean>(false);
    const [eventsArray, setEventArray] = useState<any>(); 


    const formatETHAddress = function(s: string, size = 4) {;
        let first = s.slice(0, size + 1);
        let last = s.slice(-size);
        return first + "..." + last;
    }

    if (address && minAddress !== formatETHAddress(address)) {
        setFormatAddress(formatETHAddress(address))
    } 

    useEffect(() => {
        if (!contract || !address) return;
        const result = async () => {
            const contractInstance = sdk?.getContractFromAbi(DAOADDRESS, DAOABI.abi)
            const promiseResult = await contractInstance;
    
            const eventName = "voteSubmitted";
            const options = {
            fromBlock: 0,
            toBlock: "latest",
            };

            const events:any = await promiseResult?.events.getEvents(eventName, options);
            let eventsArrayCopy:any = [];  
            
            for (let i = 0; i < events?.length; i++ ) {

                if(events[i].data.sender == address) {
                    const proposal = await DAOCONTRACT?.call("ProposalArray", parseInt((events[i].data.id).toString())); 
                    if (events[i].data.yesOrNo == true ) {
                        eventsArrayCopy.push({
                            titre: proposal[0], 
                            yesOrNo: "Oui", 
                            isOpen: proposal[7], 
                            topic: parseInt(proposal[6].toString()),
                            id: parseInt((events[i].data.id).toString())
                        })

                    } else if (events[i].data.yesOrNo == false) {
                        eventsArrayCopy.push({
                            titre: proposal[0], 
                            yesOrNo: "Non", 
                            isOpen: proposal[7], 
                            topic: parseInt(proposal[6].toString()),
                            id: parseInt((events[i].data.id).toString())
                        })
                    }
                }
               
            }
            setEventArray(eventsArrayCopy)
        }
        result()
      
    }, [DAOCONTRACT, address, contract, sdk])


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
                return nft;
              }
            )
          );
    
          setStakedNfts(stakedNfts);
          setStakedNftsLoad(true)
        }
        // Si il y'a une addresse détéctée, on charge les NFT stackées 
        if (address) {
          loadStakedNfts();
        }

    }, [address, contract, nftDropContract]);

    
    useEffect(() => {
        // Si il n'y a pas de contrat ou address détecté, le useEffect se stoppe ici
        if (!contract || !address || !DAOCONTRACT)  return;

        async function loadClaimableRewards() {
            const cr = await contract?.call("availableRewards", address);
            setClaimableRewards(cr);
            setClaimableRewardsN(parseInt(cr.toString()))
        }

        async function getRank() {
            const rank = await DAOCONTRACT?.call("getMemberRank", address);
            if (rank) {
                setRank(rank)
            } 
        }

        async function isInDao() {  
            const isInYsfDao = await DAOCONTRACT?.call("isInYsfDao", address);
            const isInYsfProd = await DAOCONTRACT?.call("isInYsfProd", address);
            const isInYsfSpace = await DAOCONTRACT?.call("isInYsfSpace", address);
            const isInYsfPark = await DAOCONTRACT?.call("isInYsfPark", address);
                setYsf1(isInYsfDao)
                setYsf2(isInYsfProd)
                setYsf3(isInYsfSpace)
                setYsf4(isInYsfPark)
                setAccessStatus(true)
        }

        loadClaimableRewards();
        getRank()
        isInDao(); 
    }, [address, contract, DAOCONTRACT, rank, points]);

    useEffect(() => {
        if (!address || !DAOCONTRACT)  return;
        async function getPoints() {
            const pointsCount = await DAOCONTRACT?.call("getMemberPoints", address);  
            if (pointsCount !== undefined) {
                setPoints(parseInt(pointsCount.toString()))
            }
        }

        getPoints(); 

    }, [DAOCONTRACT])

    async function claimRewards() {
        const claim = await DAOCONTRACT?.call("claimRewards");
    }


    async function enterYsfProd() {
        const enter = await DAOCONTRACT?.call("enterYsfProd");
    }

    async function enterYsfSpace() {
        const enter = await DAOCONTRACT?.call("enterYsfSpace");
    }

    async function enterYsfPark() {
        const enter = await DAOCONTRACT?.call("enterYsfPark");
    }

    async function enterYsfDao() {
        const enter = await DAOCONTRACT?.call("enterYsfDao");
    }


    return (
    <div className={`${styles.container}`}>
        {
                !address ? (
                    <button className={styles.mainButton} onClick={connectWithMetamask}>
                      Connecter sa wallet
                    </button>
                  ) : (

                    <div className={styles.profileContainer}>
                <div className={`${styles.dashboard} ${styles.fullheight}`}>
                    <div>
                        <div className={styles.profilePicture}>

                        </div>

                        <h2 className={styles.name}>{"ens"}.eth</h2>

                        <div className={styles.walletAddress}>
                            <div className={styles.colorCircle}></div>
                            <p>{minAddress}</p>   
                        </div>
                    </div>

                    <div className={styles.bottomBloc}>
                        {
                            rank == 0 ? (
                                <div>
                                    <h2>#DAO Rank 00</h2>
                                    <p><span>No rank </span></p>
                                </div>
                            ) : rank == 1 ? (
                                <div>
                                    <h2>#DAO Rank 01</h2>
                                    <p><span>Discoverer</span></p>
                                </div>
                            ) : rank == 2 ? (
                                <div>
                                    <h2>#DAO Rank 02</h2>
                                    <p><span>Explorer</span></p>
                                </div>
                            ) : rank == 3 ? (
                                <div>
                                    <h2>#DAO Rank 03</h2>
                                    <p><span>Conquistador</span></p>
                                </div>
                            ) : rank == 4 ? (
                                <div>
                                    <h2>#DAO Rank 04</h2>
                                    <p><span>Governor</span></p>
                                </div>
                            ) : (
                                <Chargement noText={true}/>
                            )
                        }

                        {
                            rank == 0 ? (
                                <div className={styles.rankBarContainer}>
                                    <div className={styles.rankBar}> 
                                        <div className={styles.rankProgress}>


                                        </div>
                                    </div>

                                    <p>Choisissez une première SubDao !</p>

                                </div>
                            ) : rank == 1 ? (
                                <div className={styles.rankBarContainer}>
                                    <div className={styles.rankBar}> 
                                        <div className={styles.rankProgress}
                                        
                                        style={{
                                            width: `${points / pointsToRankTwo * 100}%`   
                                        }}    
                                        >


                                        </div>
                                    </div>
                                    {
                                        points >= pointsToRankTwo ? 
                                        <p className={styles.rankMessage}>Réclamez votre nouveau rank, Explorer!</p>
                                        : <p className={styles.rankMessage}>Plus que {pointsToRankTwo - points} points pour réclamer son prochain rank !</p>
                                    }

                                </div>
                            ) : rank == 2 ? (
                                <div className={styles.rankBarContainer}>
                                    <div className={styles.rankBar}> 
                                        <div className={styles.rankProgress}
                                            style={{
                                                width: `${points / pointsToRankThree * 100}%`   
                                            }}    
                                        >
                                        </div>
                                    </div>

                                    {
                                        points >= pointsToRankThree ? 
                                        <p className={styles.rankMessage}>Réclamez votre nouveau rank, Conquistador !</p>
                                        : <p className={styles.rankMessage}>Plus que {pointsToRankThree - points} points pour réclamer son prochain rank !</p>
                                    }

                                </div>
                            ) : rank == 3 ? (
                                <div className={styles.rankBarContainer}>
                                    <div className={styles.rankBar}> 
                                        <div className={styles.rankProgress}
                                            style={{
                                                width: `${points / pointsToRankFour * 100}%`   
                                            }}    
                                        >


                                        </div>
                                    </div>

                                    {
                                        points >= pointsToRankFour ? 
                                        <p className={styles.rankMessage} >Réclamez votre nouveau rank, Gouvernor !</p>
                                        : <p className={styles.rankMessage}>Plus que {pointsToRankFour - points} points pour réclamer son prochain rank !</p>
                                    }

                                    
                                </div>
                            ) : rank == 4 ? (
                                <div className={styles.rankBarContainer}>
                                    <div className={styles.rankBar}> 
                                        <div className={styles.rankProgress}
                                            style={{
                                                width: `100%`   
                                            }}  
                                        >


                                        </div>
                                    </div>
                                    <p className={styles.rankMessage}>Points : {points}</p>
                                </div>
                            ) : (
                                <></>
                            )
                        }

                        

                        <div className={styles.rankCirclesContainer}>
                            <p className={styles.access}>Accès: </p>
                            
                                {
                                    // Si le membre est dans les 4 dao/subdao => 
                                    isInYsfDao && isInYsfPark && isInYsfProd && isInYsfSpace && accessLoaded ? (
                                        <div className={styles.rankCircles}>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                        </div>
                                    )
                                    // Si le membre est dans les 3 subdao => 
                                    : isInYsfPark && isInYsfSpace && isInYsfProd && !isInYsfDao && accessLoaded ? (
                                        <div className={styles.rankCircles}>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={styles.rankCircle}></div>
                                        </div>
                                    ) 
                                    // Si le membre est dans 2 subdao => 
                                    : ((isInYsfProd && isInYsfSpace) && !(isInYsfPark) ||
                                        (isInYsfProd && isInYsfPark) && !(isInYsfProd)  || 
                                        (isInYsfSpace && isInYsfProd) && !(isInYsfPark)) && accessLoaded ? (
                                        <div className={styles.rankCircles}>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={styles.rankCircle}></div>
                                            <div className={styles.rankCircle}></div>
                                        </div>
                                    ) 
                                    // Si le membre est dans 1 subdao => 
                                    : (isInYsfPark && !isInYsfSpace && !isInYsfProd ||
                                        isInYsfProd && !isInYsfPark && !isInYsfSpace ||
                                        isInYsfSpace && !isInYsfPark && !isInYsfProd) && accessLoaded ?(
                                        <div className={styles.rankCircles}>
                                            <div className={`${styles.rankCircle} ${styles.ysfDaoColor}`}></div>
                                            <div className={styles.rankCircle}></div>
                                            <div className={styles.rankCircle}></div>
                                            <div className={styles.rankCircle}></div>
                                        </div>   
                                    ) 
                                    // Si le membre est dans 0 subdao
                                    : !isInYsfPark && !isInYsfProd && !isInYsfSpace && accessLoaded ? (
                                        <div className={styles.rankCircles}>
                                            <div className={styles.rankCircle}></div>
                                            <div className={styles.rankCircle}></div>
                                            <div className={styles.rankCircle}></div>
                                            <div className={styles.rankCircle}></div>
                                        </div>   
                                    ) 
                                    
                                    : !accessLoaded ? (  
                                        <Chargement noText={true}/>
                                    ) 
                                    : (
                                        <div className={styles.rankCircles}>
                                            
                                        </div>
                                    )

                                }

                            
                        </div>

                        {
                            rank == 0  && accessLoaded ? (

                                <div className={styles.chooseDaoContainer}>
                                    <div className={styles.chooseDaoButtons}>
                                        <div className={styles.chooseDaoButton}
                                            onClick={() => enterYsfProd()}
                                        >YSF PROD</div>
                                        <div className={styles.chooseDaoButton}
                                            onClick={() => enterYsfSpace()}
                                        >YSF SPACE</div>
                                        <div className={styles.chooseDaoButton}
                                             onClick={() => enterYsfPark()}
                                        >YSF PARK</div>
                                    </div>
                                </div>

                            ) : 1 == 1 && (points >= pointsToRankTwo) && accessLoaded ? (
                                        <div className={styles.chooseDaoContainer}>
                                            {
                                                isInYsfSpace ? (
                                                <div className={styles.chooseDaoButtons} >
                                                    <div className={styles.chooseDaoButton}
                                                        onClick={() => enterYsfProd()}
                                                    >YSF PROD</div>
                                                    <div className={styles.chooseDaoButton}
                                                        onClick={() => enterYsfPark()}
                                                    >YSF PARK</div>
                                                </div>

                                                ) : isInYsfPark ? (
                                                    <div className={styles.chooseDaoButtons}>
                                                            <div className={styles.chooseDaoButton}
                                                                onClick={() => enterYsfProd()}
                                                            >YSF PROD</div>
                                                            <div className={styles.chooseDaoButton}
                                                                onClick={() => enterYsfSpace()}
                                                            >YSF SPACE</div>
                                                    </div>
                                                    ) : isInYsfProd ? (
                                                    <div className={styles.chooseDaoButtons}>
                                                        <div className={styles.chooseDaoButton}
                                                                onClick={() => enterYsfSpace()}
                                                        >YSF SPACE</div>
                                                        <div className={styles.chooseDaoButton}
                                                            onClick={() => enterYsfPark()}
                                                         >YSF PARK</div>
                                                    </div>
                                                ) : (<></>)
                                            }
                                        </div>
                            ) : rank == 2 &&  (points >= pointsToRankThree) && accessLoaded ? (
                                    <div className={styles.chooseDaoContainer}>
                                        <div className={styles.chooseDaoButtons}>
                                            {
                                                isInYsfSpace && isInYsfProd ? (
                                                <div className={styles.chooseDaoButtons}>
                                                   <div className={styles.chooseDaoButton}
                                                            onClick={() => enterYsfPark()}
                                                         >YSF PARK</div>
                                                </div>

                                                ) : isInYsfPark && isInYsfProd ? (
                                                    <div className={styles.chooseDaoButton}>
                                                            <div className={styles.chooseDaoButton}
                                                                onClick={() => enterYsfSpace()}
                                                            >YSF SPACE</div>
                                                    </div >
                                                    ) : isInYsfProd && isInYsfPark ? (
                                                        <div className={styles.chooseDaoButton}
                                                            onClick={() => enterYsfProd()}
                                                        >YSF PROD</div>
                                                ) : (<></>)
                                            }
                                        </div>
                                    </div>
                                ) : rank == 3 && points >= pointsToRankFour && accessLoaded ? (
                                    <div className={styles.chooseDaoContainer}>
                                                <div className={styles.chooseDaoButtons}>
                                                    <div className={styles.chooseDaoButton}
                                                        onClick={() => enterYsfDao()}
                                                    >YSF DAO</div>
                                                </div>
                                        </div>
                                ) : !accessLoaded ?(
                                    <></>
                                ) : (
                                    <></>
                                )
                        }

                    </div>
                </div>

                <div className={styles.profileContent}>
                    <div className={styles.pageTitle}>
                        <BsFillPersonLinesFill/>
                        <h1>Profil</h1>
                    </div>

                    <div className={styles.profileBloc}>
                        <div className={styles.profileBlocLeft}>
                            <h3>NFT - FUNGITOS</h3>
                            <div className={styles.staked}>
                            { 
                                stakedNfts && stakedNftsLoaded ? (stakedNfts?.map((nft) => (
                                <div className={styles.nftImg} key={nft.metadata.id.toString()}>
                                    <ThirdwebNftMedia
                                    metadata={nft.metadata}
                                    className={styles.nftMedia}
                                    /> 
                                </div>
                                ))) : !stakedNftsLoaded ? (
                                    <Chargement noText={true}/>
                                ) : stakedNfts.length == 0 ? (
                                    <p>Pas de NFT stackées</p>
                                ) : <p>Pas de NFT stackées</p>
                            }

                            {
                                stakedNfts.length == 0 && stakedNftsLoaded ? (
                                    <p>Pas de NFT stackées</p> 
                                ) : <></>

                            }

                            </div>
                        </div>
                        <div className={styles.profileBlocRight}>
                            <div className={styles.recompenses}>
                                <div>
                                    <h3>YSF Balance</h3>
                                    <div className={styles.tokenValueContainer}>
                                        {
                                            tokenBalance ? (
                                                <Image  src="/token-ysf.png" alt="Token YSF Icon" width={45} height={45}></Image>
                                            ) : <></>
                                        }

                                        <p className={styles.tokenValue}>
                                            <b>
                                                {!tokenBalance 
                                                ? <Chargement noText={true}/>
                                               
                                                : tokenBalance ? 
                                                    <b>{ethers.utils.formatUnits(tokenBalance?.value, 18)}</b>
                                                    : <></>
                                                }
                                            </b>{" "}
                                            {tokenBalance?.symbol}
                                        </p>
                                            
                                    </div>
                                </div>
                                <div>
                                    <h3>Récompenses de staking</h3>
                                    <div className={styles.tokenValueContainer}>
                                        {
                                            tokenBalance ? (
                                                <Image  src="/token-ysf.png" alt="Token YSF Icon" width={45} height={45}></Image>
                                            ) : <></>
                                        }
                                    
                                        <p className={styles.tokenValue}>
                                            <b>
                                                {!claimableRewards
                                                ? <Chargement noText={true}/>
                                                : ethers.utils.formatUnits(claimableRewards, 18)}
                                            </b>{" "}
                                            {tokenBalance?.symbol}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rewards}>
                                {
                                   (claimableRewardsN > 0) ? (
                                       <button className={styles.mainButton} onClick={() => claimRewards()}>Récupérer</button>
                                   ) : (
                                    <></>
                                   )
                                }
                            </div>
                        </div>
                    </div>

                    <div className={styles.profileBloc2}>
                        <h3>Historique des transactions</h3>
                        <div className={styles.transactionsArray}>
                            <div className={styles.transactionsArrayHeader}>
                                <p>Propositions</p>
                                <p>Vote</p>
                                <p>Statut</p>
                                <p style={{
                                    maxWidth:"135px"
                                }}>Topic</p>
                            </div>
                            <hr className={`${styles.divider} ${styles.spacerTop} ${styles.marginzero}`} />

                            {
                                eventsArray?.slice(eventsArray.length - 3 , eventsArray.length).reverse().map((transaction:any, index:any) => (
                                    
                                    <div className={styles.transaction} key={index}>
                                            <p className={styles.txLink}>
                                                <Link href={`proposition?_id=${transaction.id}`} >
                                                {transaction.titre}
                                                </Link>
                                            </p>
                                        <p>{transaction.yesOrNo}</p>
                                        {
                                            transaction.isOpen ? (
                                                <div>
                                                    <div className={styles.status}>Actif</div>
                                                </div>
                                            ) : (
                                                <div className={`${styles.status} ${styles.statusClosed}`}>
                                                    Clos
                                                </div>
                                            )
                                        }
                                        {
                                            transaction.topic == 1 ? (
                                                <div className={`${styles.topic} ${styles.ysfDaoColor}`}>
                                                    YSF DAO 
                                                </div>  
                                            ) : transaction.topic == 2 ? (
                                                <div className={`${styles.topic} ${styles.ysfProdColor}`}>
                                                    YSF PROD
                                                </div> 

                                            ) : transaction.topic == 3 ? (
                                                <div className={`${styles.topic} ${styles.ysfSpaceColor}`}>
                                                    YSF SPACE
                                                </div> 

                                            ) : transaction.topic == 4 ? (
                                                <div className={`${styles.topic} ${styles.ysfParkColor}`}>
                                                    YSF PARK
                                                </div> 
                                            ) : <></>
                                        }
                                        
                                     </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>)
        }
    </div>
    )
} 

export default Profile;
