import {
    useAddress,
    useContract,
    useSDK, 
    useMetamask
  } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import Chargement from './components/Chargement';
import styles from "../styles/Home.module.css";
import {FaDiscord} from "react-icons/fa"
import Link from 'next/link';
import DAOABI from '../artifacts/contracts/YSFDAO.sol/YSFDAO.json'

const YSFTOKENADDRESS = "0x2191b0C37c168c205c238ed29776Da50c5f68f02"
const DAOADDRESS = "0xAaEb6F488C81d08317f1bC4B96786C990E6cd9c9"

const Proposition = () => {

    const address = useAddress();
    const connectWithMetamask = useMetamask();  

    const {contract, isLoading } = useContract(DAOADDRESS);
    const { contract : YSFTOKEN } = useContract(YSFTOKENADDRESS);

    const formatETHAddress = function(s: string, size = 4) {;
        let first = s.slice(0, size + 1);
        let last = s.slice(-size);
        return first + "..." + last;
    }
    
    const router = useRouter();
    const [query, setQuery] = useState<any>(); 
    
    const [title, setProposalTitle] = useState<string>(""); 
    const [status, setStatus] = useState<boolean>(true)
    const [hasVoted, setHasVoted] = useState<boolean>(false)
    const [topic, setTopic] = useState<number>(0)
    const [sender, setSender] = useState<string>("")
    const [desc, setDesc]  = useState<string>("")
    const [disc, setDisc]  = useState<string>("")
    const [votesCount, setVoteCount] = useState<number>(0); 
    const [yesVote, setYesVote] = useState<number>(0)
    const [noVote, setNoVote] = useState<number>(0)
    const [voteResult, setVoteResult] = useState<boolean>()
    const [voteChoice, setVoteChoice] = useState<boolean>()
    const [proposalDate, setProposalDate] = useState<string>("");
    const [proposalEndDate, setProposalEndDate] = useState<string>("");
    const [remainingDays, setRemainingDays] = useState<number>();
    const [allowanceLoading, setAllowanceLoading] = useState(false);
    const [proposalLoading, setProposalLoading] = useState(false);
    const [callAreLoaded, setStateOfCall] = useState(false); 
    const [eventsArray, setEventArray] = useState<any>(); 
    

    const sdk = useSDK(); 
    
    useEffect(() => {
        if (!sdk || !address) return; 

        const result = async () => {
            const contractInstance = sdk?.getContractFromAbi(DAOADDRESS, DAOABI.abi)
            const promiseResult = await contractInstance;
    
            const eventName = "voteSubmitted";
            const options = {
            fromBlock: 0,
            toBlock: "latest",
            };

            const events:any = await promiseResult?.events.getEvents(eventName, options);
            let eventsArrayCopy = [];  

            if (events) {
                for (let i = 0; i < events.length; i++ ) {
                    if(parseInt(events[i].data.id).toString() == query) {
    
                        if(events[i].data.yesOrNo == true) {
                            eventsArrayCopy.push({
                                sender: formatETHAddress(events[i].data.sender), 
                                yesOrNo: "Oui"
                            })
                        } else if (events[i].data.yesOrNo == false) {
                            eventsArrayCopy.push({
                                sender: formatETHAddress(events[i].data.sender), 
                                yesOrNo: "Non"
                            })
                        }
                    }
                }
                setEventArray(eventsArrayCopy)
            }
        }
        result()
    }, [contract, votesCount, query, sdk])

    useEffect(() => {
        if (router.isReady) {
            const id = router.query._id;  
            setQuery(id);
        }
    }, [router.isReady, router.query._id]);
    
    useEffect(() => {
        if (!contract || !address) return;

        const getProposal = async () => {
            if (query) {
                const proposal = await contract?.call("ProposalArray", query); 

                setProposalTitle(proposal[0]); 
                setDesc(proposal[1]); 
                setDisc(proposal[2]);

                const dateOfSubmission = parseInt(proposal[5].toString())
                
                const oneMonthInSecond = 2592000;

                let beginDateFormatted = dateOfSubmission * 1000; 
                let endDate = dateOfSubmission + oneMonthInSecond; 
                let endDateFormatted = endDate * 1000; 

                
                const proposalBeginDate = new Date(beginDateFormatted).toLocaleString('default');
                const proposalLastDay = new Date(endDateFormatted).toLocaleString('default');
                setProposalDate(proposalBeginDate)
                setProposalEndDate(proposalLastDay)
                
                let date = Math.floor(new Date().getTime() / 1000)
                let remainingDaysInSeconds = endDate - date; 
                let remainingDays = Math.round(((remainingDaysInSeconds / 60) / 60 ) / 24 ) 

                setRemainingDays(remainingDays)

                if (remainingDaysInSeconds <= 0 ) {
                    setStatus(false)
                }

                setYesVote(parseInt(proposal[3].toString())) 
                setNoVote(parseInt(proposal[4].toString())) 
                setVoteCount(parseInt(proposal[3].toString()) + parseInt(proposal[4].toString()))
                setSender(formatETHAddress((proposal[9].toString())))
                setTopic(parseInt(proposal[6].toString()))  
                
                setStateOfCall(true); 
            }
        }

        getProposal(); 
    }, [address, contract, query, yesVote, noVote, votesCount, proposalLoading]);

    useEffect(() => {
        const getHasVoted = async () => {
            if (query) {
                const hasVoted = await contract?.call("hasVotedForThisProposal", address, query); 
                setHasVoted(hasVoted);

                if (hasVoted == true) {
                    const voteResult = await contract?.call("voteChoiceForThisProposal", address, query); 
                    setVoteResult(voteResult)
                }
            }
        }

        getHasVoted();
        
    }, [contract, query, address, voteChoice, voteResult])

    const vote = async (choice:boolean) => {

        const allowedBalance = parseInt((await YSFTOKEN?.call("allowance", address, DAOADDRESS)).toString()); 

        if (allowedBalance < 1) {
            setAllowanceLoading(true)
            const approve = await YSFTOKEN?.call("_approve", DAOADDRESS, BigNumber.from(1))
            .catch(() => 
                setAllowanceLoading(false)
            )
            setAllowanceLoading(false)

            if (approve !== undefined) {
                setProposalLoading(true)
                alert("Allowance accordée")
            }
            const voteFor = await contract?.call("voteForProposal", query, choice)
            .catch(() => setProposalLoading(false))
            if (voteFor !== undefined) {
                setProposalLoading(false)
            }
        } else if (allowedBalance >= 1) {
            setProposalLoading(true)
            const voteFor = await contract?.call("voteForProposal", query, choice)
            .catch(() => alert("Transaction échouée, veuillez réitérer"))
            setProposalLoading(false)
        }
    }

    if (router.isReady && !isLoading) {
        return (
            <div className={styles.container}>
                
                <div className={styles.propositionContainer}>
                    <div className={styles.propositionBlocLeft}>
                        <div className={styles.backButton}>
                            <svg width="10" height="10" viewBox="0 0 19 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 11.5L18.75 0.674683L18.75 22.3253L0 11.5Z" fill="#D9D9D9"/>
                            </svg>
                            <span className={styles.lowOpacity}>
                            <Link href={`/`}>
                                    Retour
                            </Link>
                            </span>
                        </div>

                        <div>
                            <div className={styles.flex}>
                                <h2>{title}</h2>
                            </div>
                            <div className={styles.balisesContainer}>

                                {
                                    status ? (
                                        <div className={styles.status}>
                                            Actif
                                        </div>
                                    ) : (
                                        <div className={`${styles.status} ${styles.statusClosed}`}>
                                            Clos
                                        </div>
                                    )
                                }
                                

                                {
                                        topic == 1 ? (
                                          <div className={`${styles.topic} ${styles.ysfDaoColor}`}>
                                            YSF DAO 
                                          </div>   
                                        ) : topic == 2 ? (
                                          <div className={`${styles.topic} ${styles.ysfProdColor}`}>
                                            YSF PROD
                                          </div>   
                                        ) :  topic == 3 ? (
                                          <div className={`${styles.topic} ${styles.ysfSpaceColor}`}>
                                            YSF SPACE
                                          </div> 
                                        ) : topic == 4 ?  (
                                          <div className={`${styles.topic} ${styles.ysfParkColor}`}>
                                            YSF PARK
                                          </div> 
                                        ) : <></>
                                }

                                <div className="">
                                    <h4>{sender}</h4>
                                </div>
                            </div>
                            <p>{desc}</p>

                            {
                                disc !== "" ? (
                                    <div className={styles.flex}>
                                        <FaDiscord/>
                                        <span className={styles.lowOpacity}>
                                            <Link href={disc}>
                                                Discussion
                                            </Link>
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            

                            <div className={styles.votesBloc}>
                                <div className={styles.flex}>
                                    <h2>Votes</h2>
                                    <div className={styles.voteCount}>
                                        {votesCount}
                                    </div>
                                </div>

                                {
                                    eventsArray?.slice(eventsArray.length - 6, eventsArray.length).map((voter:any, index:any) => (

                                        <div 
                                            className={styles.voterLine}
                                            key={index}
                                        >
                                            <h4 className={styles.voter}>{voter.sender}</h4>
                                            <p>{voter.yesOrNo}</p>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                    </div>   
                    
                    <div className={styles.propositionBlocRight}>
                            {
                                status && !hasVoted && !proposalLoading && !allowanceLoading ?  (
                                    <div className={styles.voteBloc}>

                                        <h2>Votez</h2> 
                                        <span className={styles.cout}>Coût du vote:<span className={styles.green}> 1 YSF</span></span>

                                        <div className={styles.voteButtons}>

                                            {
                                                voteChoice == true ? (
                                                    <div className={`${styles.voteContext} ${styles.voteContextActive} `}
                                                    >
                                                    Oui, approuver
                                                    </div>

                                                ) : (
                                                    <div className={`${styles.voteContext}`}
                                                    onClick={() => setVoteChoice(true)}
                                                    >
                                                    Oui, approuver
                                                    </div>
                                                )
                                            }

                                            {
                                                voteChoice == false ? (
                                                    <div className={`${styles.voteContext} ${styles.voteContextActive} `}
                                                        onClick={() => setVoteChoice(false)}
                                                    >
                                                        Non approuvé
                                                    </div>
                                                ) : (
                                                    <div className={styles.voteContext}
                                                        onClick={() => setVoteChoice(false)}
                                                    >
                                                        Non approuvé
                                                    </div>
                                                )

                                            }

                                            

                                            {
                                                voteChoice != undefined ? (
                                                    <div className={`${styles.voteButton} ${styles.voteButtonActive}`}
                                                        onClick={() => vote(voteChoice)}
                                                    >
                                                        Voter
                                                    </div> 
                                                ) : (
                                                    <div className={styles.voteButton} 
                                                        onClick={() => {
                                                            alert("Veuillez faire votre choix")
                                                    }}>
                                                        
                                                         Voter
                                                    </div>
                                                )
                                            }

                                        </div>
                                    </div>
                                )  : hasVoted ? (
                                    <div className={styles.voteBloc}>
                                        <div>
                                            {
                                                voteResult ? (
                                                    <p>Vous avez déjà voté (oui) pour cette proposition</p>
                                                ) : (
                                                    <p>Vous avez déjà voté (non) pour cette proposition</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                )  : proposalLoading ? (

                                    <div className={styles.voteBloc}>
                                        <Chargement noText={true} />
                                    </div>
                                ) : !status ? (
                                    <div className={styles.voteBloc}>
                                        <div>
                                            <p>La session de vote pour cette proposition est close</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.voteBloc}>
                                        <Chargement noText={true} />
                                    </div>
                                )
                            }
                        
                        <div className={styles.dateBloc}>
                            <p>Système de vote : <span className={styles.lowOpacity}>Vote à choix simple</span></p>
                            <p>Date de début : <span className={styles.lowOpacity}>{proposalDate} </span></p>
                            <p>Date de fin : <span className={styles.lowOpacity}>{proposalEndDate}</span></p>
                            <p>Jours restants: <span className={styles.lowOpacity}>{remainingDays} </span></p>

                        </div>

                        

                        <div className={styles.resultBloc}>
                            <h4>
                                Résultats actuels
                            </h4>

                            <div className={styles.resultBarBox}>
                                <div className={styles.resultBarTitle}>
                                    <div>Oui, approuvé</div>
                                    <div>{yesVote} YSF</div>

                                    {
                                        callAreLoaded && votesCount != 0 ? (
                                            <div className={styles.pourcentageBloc}>{(yesVote / votesCount) * 100} %</div>
                                        ) : (
                                            <div className={styles.pourcentageBloc}>... %</div>
                                        )
                                    }
                                </div>

                                <div className={styles.resultBar}>
                                    <div 
                                        className={styles.resultOui}
                                        style={{
                                            width: `${(yesVote / votesCount) * 100}%`   
                                        }}     
                                    >
                                    

                                    </div>
                                </div>
                            </div>

                            <div className={styles.resultBarBox}>
                                <div className={styles.resultBarTitle}>
                                    <div>Non approuvé</div>
                                    <div>{noVote} YSF</div>
                                    {
                                        callAreLoaded && votesCount != 0 ? (
                                            <div className={styles.pourcentageBloc}>{(noVote / votesCount) * 100} %</div>
                                        ) : (
                                            <div className={styles.pourcentageBloc}>... %</div>
                                        )
                                    }
                                </div>

                                <div className={styles.resultBar}>
                                    <div 
                                        className={styles.resultNon}
                                        style={{
                                            width: `${((votesCount - yesVote) / votesCount) * 100}%`   
                                        }}     
                                    >
                                               
                                    </div>
                                </div>
                            </div>

                            <div className={styles.resultBarBox}>
                                <div className={styles.resultBarTitle}>
                                    <div>Abstention</div>
                                    <div className={styles.pourcentageBloc}>..%</div>
                                </div>

                                <div className={styles.resultBar}>
                                    <div className={styles.resultAbstention}></div>
                                </div>
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
        )
    } else {
        return (
            <Chargement />
        )
    }

};

export default Proposition;
