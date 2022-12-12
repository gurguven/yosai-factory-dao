import {
    useAddress,
    useMetamask,
    useTokenBalance,
    useContract,
  } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import Link from "next/link"
import Chargement from "./components/Chargement";
import {useRouter} from "next/router";


const NewProposal = () => {
    const router = useRouter()  
    const address = useAddress();
    const connectWithMetamask = useMetamask();

    const YSFTOKENADDRESS = "0x2191b0C37c168c205c238ed29776Da50c5f68f02";
    const DAOADDRESS = "0xAaEb6F488C81d08317f1bC4B96786C990E6cd9c9"

    const { contract: DAOCONTRACT} = useContract(DAOADDRESS);
    const { contract, isLoading } = useContract(YSFTOKENADDRESS);

    const { data: tokenBalance } = useTokenBalance(contract, address);

    const [balanceLoaded, setBalanceLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [inputProposalTitle, setInputProposalTitle] = useState("");
    const [inputProposalDesc, setInputProposalDesc] = useState("");
    const [inputProposalDisc, setInputProposalDisc] = useState("");
    const [proposalLoading, setProposalLoading] = useState<boolean>(false);
    const [proposalSent, setProposalSending] = useState<boolean>(false);
    const [topic, setTopic] = useState<number>(); 
    const [isInYsfDao, setYsf1] = useState<boolean>()
    const [isInYsfProd, setYsf2] = useState<boolean>()
    const [isInYsfSpace, setYsf3] = useState<boolean>()
    const [isInYsfPark, setYsf4] = useState<boolean>()

    useEffect(() => {
        if (tokenBalance) {
            setBalanceLoading(true);
            setBalance(parseInt(tokenBalance?.displayValue);
        }
    }, [address, tokenBalance]);

    useEffect(() => {

        if (proposalSent) {
            router.push("/")
        }
       
    }, [address, proposalSent, router]);

    useEffect(() => {
        async function isInDao() {  
            const isInYsfDao = await DAOCONTRACT?.call("isInYsfDao", address);
            const isInYsfProd = await DAOCONTRACT?.call("isInYsfProd", address);
            const isInYsfSpace = await DAOCONTRACT?.call("isInYsfSpace", address);
            const isInYsfPark = await DAOCONTRACT?.call("isInYsfPark", address);
                setYsf1(isInYsfDao)
                setYsf2(isInYsfProd)
                setYsf3(isInYsfSpace)
                setYsf4(isInYsfPark)
        }
        isInDao(); 
    }, [address, DAOCONTRACT, isInYsfDao, isInYsfProd, isInYsfSpace, isInYsfPark]);


    const handleInputProposalTitle = (e:any) :void => {
        setInputProposalTitle(e.target.value);
    };

    const handleInputProposalDesc = (e :any)  :void => {
        setInputProposalDesc(e.target.value);
    };    

    const handleInputProposalDisc = (e :any)  :void => {
        setInputProposalDisc(e.target.value);
    };    


    const sendProposal = async (e:any, daoIndex:number)  => {

        if (e.target.tagName === "INPUT") {
            return;
        }
        if (inputProposalTitle === "") {
            alert("Entrez un titre à votre proposition");
            return;
        }
        if (inputProposalDesc === "") {
            alert("Décrivez votre proposition");
            return;
        }

        let title = inputProposalTitle;
        let desc = inputProposalDesc;
        let discussion = inputProposalDisc;

        if (discussion == "") {
            setInputProposalDesc("empty")
        }

        setProposalLoading(true)
        const send = await DAOCONTRACT?.call("submitProposal", title, desc, discussion, BigNumber.from(daoIndex)).catch(() => setProposalLoading(false));
        setProposalLoading(false)


        setInputProposalTitle(""); 
        setInputProposalDesc(""); 
        setInputProposalDisc("");

        if (send !== undefined) {
            setProposalSending(true);  
        }
    }
    
    const handleTopic = (e:any) => {
        setTopic(e.target.value)
    }
    const propositionTabIsOpen = false; 

  if (address) {
    return (
        <div className={styles.container}>
          <main className={styles.main}>
            <Dashboard propositionIsOpen={propositionTabIsOpen} />

            {
                !balanceLoaded ? ( 
                        <div className={styles.daoContainer}>
                            <Chargement />
                        </div>
                        ) : (
                    <div className={styles.daoContainer}>
                    {
                        balance < 120 ? (

                            <div className={styles.newProposalContainer}> 
                                <div className={styles.proposalHeader}>
                                    <h2>Nouvelle Proposition</h2>
                                </div>
                            
                                <div className={styles.infoMessageContainer}>
                                    Un minimum de 120 Tokens YSF est requis pour soumettre une proposition (4 propositions maximum par mois)
                                    <br />
                                    <Link href="/a-propos">En savoir plus</Link>
                                </div>

                            </div>
                            

                            
                        ) : proposalLoading ? (

                            <div className={styles.newProposalContainer}> 
                                <div className={styles.proposalHeader}>
                                    <h2>Nouvelle Proposition</h2>
                                </div>
                            
                                <div className={styles.infoMessageContainer}>
                                    <br />
                                    <Chargement noText={true}/> 
                                </div>

                            </div>


                        ) : (
                            <div className={styles.newProposalContainer}>

                                <div className={styles.proposalHeader}>
                                    <h2>Nouvelle Proposition</h2>
                                    <p> <span className={styles.lowOpacity}>({`...`} propositions restantes)</span></p>
                                </div>

                                <div>
                                    <div className={styles.newProposalTitleContainer}>
                                        <div className={styles.newProposalTitleBloc}>
                                        <h3>Titre</h3>
                                        <p>{inputProposalTitle.length}/500</p>
                                        </div>
                                        <textarea className={styles.newProposalInput}
                                            maxLength={500}
                                            onChange={(e) => handleInputProposalTitle(e)}
                                            value={inputProposalTitle}
                                        />
                                    </div>
                    
                                    <div className={styles.newProposalDescContainer}>
                                        <div className={styles.newProposalDescBloc}>
                                        <h3>Description</h3>
                                        <p>{inputProposalDesc.length}/1500</p>
                                        </div>
                                        <textarea  className={styles.newProposalDescInput}
                                            maxLength={1500}
                                            onChange={(e) => handleInputProposalDesc(e)}
                                            value={inputProposalDesc}
                                            rows={10} cols={50}
                                        />
                                    </div>
                    
                                    <div className={styles.newProposalDescContainer}>
                                        <div className={styles.newProposalDescBloc}>
                                        <h3>Discussion <span className={styles.lowOpacity}>(facultatif)</span></h3>
                                        </div>
                                        <input type="text" placeholder="https://discord.gg/..." className={styles.newProposalInput}
                                            maxLength={100}
                                            onChange={(e) => handleInputProposalDisc(e)}
                                            value={inputProposalDisc}
                                        />
                                    </div>
                                </div>
                                    {
                                        isInYsfDao ? (
                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="1"
                                                    >YSF DAO</option>
                                                    <option value="2"
                                                        onClick={(e) => setTopic(2)}
                                                    >YSF PROD</option>
                                                    <option value="3"
                                                        onClick={(e) => setTopic(3)}
                                                    >YSF SPACE</option>
                                                    <option value="4"
                                                        onClick={(e) => setTopic(4)}
                                                    >YSF PARK</option>
                                                </select>   
                                            </div>
                                        ) : isInYsfSpace && !isInYsfProd && !isInYsfPark && !isInYsfDao ? (
                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="3"
                                                        onClick={(e) => setTopic(3)}
                                                    >YSF SPACE</option>
                                                </select>   
                                            </div>
                                        ) : isInYsfProd && !isInYsfPark && isInYsfSpace && !isInYsfDao ? (
                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="2"
                                                        onClick={(e) => setTopic(2)}
                                                    >YSF PROD</option>
                                                </select>   
                                            </div>
                                        ) : isInYsfPark && !isInYsfSpace && isInYsfProd && !isInYsfDao? (
                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="4"
                                                        onClick={(e) => setTopic(4)}
                                                    >YSF PARK</option>
                                                </select>   
                                            </div>
                                        ) : isInYsfProd && isInYsfSpace && !isInYsfPark && !isInYsfDao ? (
                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="2"
                                                        onClick={(e) => setTopic(2)}
                                                    >YSF PROD</option>
                                                    <option value="3"
                                                        onClick={(e) => setTopic(3)}
                                                    >YSF SPACE</option>
                                                </select>   
                                            </div>
                                        ) : !isInYsfProd && isInYsfSpace && isInYsfPark && !isInYsfDao ? (

                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="3"
                                                        onClick={(e) => setTopic(3)}
                                                    >YSF SPACE</option>
                                                    <option value="4"
                                                        onClick={(e) => setTopic(4)}
                                                    >YSF PARK</option>
                                                </select>   
                                            </div>
                                        ) : isInYsfProd && !isInYsfSpace && isInYsfPark && !isInYsfDao ? (

                                            <div className={styles.selectContainer}>
                                                <select name="topic" id="topic" onChange={(e) => handleTopic(e)}>
                                                    <option value="">DAO/SUBDAO</option>
                                                    <option value="2"
                                                        onClick={(e) => setTopic(2)}
                                                    >YSF PROD</option>
                                                    <option value="4"
                                                        onClick={(e) => setTopic(4)}
                                                    >YSF PARK</option>
                                                </select>   
                                            </div>
                                        ) : <></>
                                    }
                                {
                                    topic && (inputProposalTitle != "") && (inputProposalDesc != "")  ? (
                                        <div className={styles.buttonContainer}>
                                        <button className={styles.mainButton}
                                            onClick={(e) => sendProposal(e, topic)}
                                            >
                                            Soumettre
                                        </button>
                                        </div>

                                    ) : (
                                        <></>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                )
            }
          </main>
        </div>
      );
    } else if (!address) {
        return (
            <div className={styles.center}>
                <button className={styles.mainButton} onClick={connectWithMetamask}>
                  Connecter sa wallet
                </button>
            </div>
        )
    }
}

export default NewProposal


