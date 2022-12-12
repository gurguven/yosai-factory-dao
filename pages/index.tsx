import {
  useAddress,
  useMetamask,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Dashboard from "./components/Dashboard";
import Proposal from "./components/Proposal";
import { useState, useEffect } from "react";
import Chargement from "./components/Chargement";

  // const nftDropContractAddress = "0xdf7f92768113B5136A59f82B0C273810BcBDA8f5";


  

  // address sender;  
  // string title; 
  // string desc; 
  // string discussion;
  // uint yesVoteCount; 
  // uint noVoteCount;
  // uint dateOfSubmission; 
  // uint daoIndex; 
  // bool isOpen; 
  // bool hasWinned;

const Home = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  /**
   * Hooks: récupération des contrats
   */
  const DAOADDRESS = "0xAaEb6F488C81d08317f1bC4B96786C990E6cd9c9"
  const { contract, isLoading } = useContract(DAOADDRESS);
  const [proposalArrayCopy, setProposalArray] = useState<[]>([]); 

  const [topicOpen, setOpenTopic] = useState(false); 
  const [tabNumber, setTabNumber] = useState(0); 
  const [currentTab, setCurrentTab] = useState(0); 
  const [currentTabName, setCurrentTabName] = useState("Tous")
  const [memberAmount, setMemberAmounts] = useState<any>()

  
  const formatETHAddress = function(s: string, size = 4) {;
    let first = s.slice(0, size + 1);
    let last = s.slice(-size);
    return first + "..." + last;
  }

  useEffect(() => {
    // Si il n'y a pas de contrat ou address détecté, le useEffect se stoppe ici
    if (!contract || !address) return;
    const getProposalArray = async () => {
      const array = await contract?.call("getAllProposals"); 
      const arrayCopy:any = []; 
      class proposal {
        _id :number
        address :string
        title :string
        desc :string
        topic:number 
        isOpen :boolean
        daysRemaining: number 
    
        constructor(_id :number, address :string, title :string, desc :string, topic:number , isOpen:boolean, daysRemaining:number  )  {
          this._id= _id; 
          this.address= address; 
          this.title= title; 
          this.desc= desc; 
          this.topic= topic; 
          this.isOpen= isOpen; 
          this.daysRemaining = daysRemaining; 
        }
      } 

      array?.map((proposition:any, index:number) => {
        let sender = 0; 
        let title = proposition[0]; 
        let desc = proposition[1]; 
        let discussion = proposition[2]; 
        let yesVoteCount = parseInt(proposition[3].toString()); 
        let noVoteCount = parseInt(proposition[4].toString()); 
        let dateOfSubmission = parseInt(proposition[5].toString());
        let daoIndex = parseInt(proposition[6].toString());
        let isOpen = proposition[7];
        let hasWinned = proposition[8]; 

        const oneMonthInSecond = 2592000;
        let endDate = dateOfSubmission + oneMonthInSecond; 
        let date = Math.floor(new Date().getTime() / 1000)
        let remainingDaysInSeconds = endDate - date; 
        let remainingDays = Math.round(((remainingDaysInSeconds / 60) / 60 ) / 24 )  
        // let remainingDays = ((remainingDaysInSeconds / 60) / 60 ) / 24 

        let newProposal; 
        if (remainingDays <= 0) {
          newProposal = new proposal(index, formatETHAddress(proposition[9].toString()), proposition[0], proposition[1], parseInt(proposition[6].toString()), false, remainingDays)
        } else if (remainingDays > 0) {
          newProposal = new proposal(index, formatETHAddress(proposition[9].toString()), proposition[0], proposition[1], parseInt(proposition[6].toString()), true, remainingDays)
        }

        arrayCopy.push(newProposal)
        setProposalArray(arrayCopy)

      })
    }
    getProposalArray(); 

  }, [address, contract]);


useEffect(() => {
  if (currentTab == 0) {
    setCurrentTabName("Tous")
  } else if (currentTab == 1) {
    setCurrentTabName("YSF DAO")
  } else if (currentTab == 2) {
    setCurrentTabName("YSF PROD")
  } else if (currentTab == 3) {
    setCurrentTabName("YSF SPACE")
  } else if (currentTab == 4) {
    setCurrentTabName("YSF PARK")
  }
}, [currentTab])

useEffect(() => {
  if (!contract || !address) return;

  const getMembers = async () => {
    const members = await contract?.call("getDaoMembersAmount", 1) 
    if(members) {
      setMemberAmounts(parseInt(members.toString()))
    }
  } 
  getMembers()
}, [contract, memberAmount, address])

  // tabnumber 
  // 0 = tous
  // 1 = only YSF DAO
  // 2 = only YSF PROD
  // 3 = only YSF SPACE
  // 4 = only YSF PARK
  const propositionTabIsOpen = true; 

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Dashboard propositionTabIsOpen={propositionTabIsOpen} memberAmount={memberAmount} />

        <div className={styles.daoContainer}>
              <div>
                <div className={styles.proposalHeader}>
                  <h2>Propositions</h2>


                  {
                    !topicOpen && address ? (
                      <div className={styles.filterButton} onClick={() => setOpenTopic(true)}>
                        {currentTabName}
                        <div>
                          <svg width="10" height="10" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5 19L0.674683 0.25L22.3253 0.25L11.5 19Z" fill="#D9D9D9"/>
                          </svg>
                        </div>
                      </div>

                    ) : address ?  (
                      <div className={styles.filterOpen} onClick={() => setOpenTopic(false)}>
                        <div className={styles.filterLine}>
                          Trier
                          <div>
                            <svg width="10" height="10" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.5 0L22.3253 18.75H0.674683L11.5 0Z" fill="#D9D9D9"/>
                            </svg>
                          </div>
                        </div>

                        <div className={styles.filterLine} onClick={() => setCurrentTab(0) }>
                            Tous
                        </div>
                        <div className={styles.filterLine} onClick={() => setCurrentTab(1) }>
                            YSF DAO
                        </div>
                        <div className={styles.filterLine} onClick={() => setCurrentTab(2) }>
                            YSF PROD
                        </div>
                        <div className={styles.filterLine} onClick={() => setCurrentTab(3) }>
                            YSF SPACE
                        </div>
                        <div className={styles.filterLine} onClick={() => setCurrentTab(4) }>
                            YSF PARK
                        </div>

                      </div>


                    ) : (<></>)
                  }
                </div>
                
                <div className={styles.proposalBox}>

                {

                  !address ? (
                    <button className={styles.mainButton} onClick={connectWithMetamask}>
                      Connecter sa wallet
                    </button>
                  ) :

                  proposalArrayCopy?.length == 0 ? (

                    <div>
                      <Chargement noText={true}/>
                    </div>


                  ) : 

                  proposalArrayCopy?.map((proposition:any, index:number) => (

                    proposition.topic == currentTab ? (

                      <Proposal 
                      _id={index} 
                      address={proposition.address} 
                      title={proposition.title} 
                      desc={proposition.desc} 
                      topic={proposition.topic} 
                      isOpen={proposition.isOpen} 
                      daysRemaining={proposition.daysRemaining}
                      
                      key={index}
                      />

                    ) : currentTab == 0 ? (
                      
                      <Proposal 
                      _id={index} 
                      address={proposition.address} 
                      title={proposition.title} 
                      desc={proposition.desc} 
                      topic={proposition.topic} 
                      isOpen={proposition.isOpen} 
                      daysRemaining={proposition.daysRemaining}
                      
                      key={index}
                      />

                    ) : (
                      <>
                      </>
                    )
                  ))
                } 
                </div> 
              </div>       
        </div>

      </main>
    </div>
  );
};

export default Home;