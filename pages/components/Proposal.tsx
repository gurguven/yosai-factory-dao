import styles from "../../styles/Home.module.css";
import Link from "next/link";
import { useRouter } from 'next/router'

type Proposition = {
    _id: number, 
    address: string; 
    title: string; 
    desc: string; 
    topic: number; 
    isOpen: boolean;
    daysRemaining: number;  
} 

const Proposal = ({_id, address, title, desc, topic, isOpen, daysRemaining} :Proposition) => {
    const router = useRouter()  
    return (
        <div id={`${_id}`} className={styles.proposal} onClick={() => router.push(
            {
                pathname: '/proposition',
                query: {_id},
            }
        )}>

            
                  <div className={styles.proposalBlocLeft}>
                    <div>
                      <h4>{address}</h4>
                      <div className={styles.proposalDesc}>
                        <h3 className={styles.proposalTitle}>{title}</h3>
                        <p>{desc}</p> 
                      </div>
                    </div>

                    <p>{daysRemaining} jours restants</p>
                  </div>
                  <div className={styles.proposalBlocRight}>

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
                        ) : (
                          <div className={`${styles.topic} ${styles.ysfParkColor}`}>
                            YSF PARK
                          </div> 
                        )
                      }
                      
                      {
                        isOpen ? (
                        <div className={styles.status}>
                          Actif
                        </div>     
                        ) : (
                        <div className={`${styles.status} ${styles.statusClosed}`}>
                          Clos
                        </div>     
                        )
                      }
                                  
                  </div>
        </div>
    )
}

export default Proposal 
