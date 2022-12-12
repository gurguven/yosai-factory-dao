
import { useContract } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link"
import Image from "next/image";
import {FaDiscord} from "react-icons/fa"
import {BsGlobe} from "react-icons/bs"
import { IconContext } from "react-icons";

const Dashboard = ({propositionTabIsOpen}: any) => {
    const DAOADDRESS = "0xAaEb6F488C81d08317f1bC4B96786C990E6cd9c9"
    const { contract, isLoading } = useContract(DAOADDRESS);
    const [memberAmount, setMemberAmounts] = useState<any>()
    useEffect(() => {
        const getMembers = async () => {
          const members = await contract?.call("getDaoMembersAmount", 1) 
          if(members) {
            setMemberAmounts(parseInt(members.toString()))
          }
        } 
        getMembers()
      }, [contract, memberAmount])

return (
    <div className={styles.dashboard}>
            <div className={styles.dashboardBox}>

            <div className={styles.daoInfo}>
                <div className={styles.profilePicture}>
                <Image src="/logo-ysf.png" alt="Logo YSF" width={100} height={100} />

                </div>

                <h2 className={styles.name}>YSF DAO</h2>

                <div className={styles.walletAddress}>
                    {
                        memberAmount !== undefined ? (
                            <p>{memberAmount} membres</p>  
                            ) : (
                            <p>... membres</p>   
                        )
                    }
                </div>
            </div>

            <div className={styles.daoMenu}>
                {
                propositionTabIsOpen ? (
                    <nav>
                        <h3 className={styles.activeTitle} >Propositions</h3>
                        <Link href="/nouvelle-proposition"><h3>Nouvelle proposition</h3></Link>
                        <Link href="/a-propos"><h3>A propos</h3></Link>
                    </nav>           
                ) : (
                    <nav>
                        <Link href="/"><h3>Propositions</h3></Link>
                        <h3 className={styles.activeTitle}>Nouvelle proposition</h3>
                        <Link href="/a-propos"><h3>A propos</h3></Link>
                    </nav>    
                )
                }
                    

            </div>

            <div className={styles.dashboardLinks}>
                <a href="https://discord.gg/fdbYXDsfVc">
                <IconContext.Provider value={{ color: "#5865F2", size : "2em"}}>
                    <FaDiscord/>
                </IconContext.Provider>
                </a>

                <a href="https://yosaifactory.com">
                <IconContext.Provider value={{ color: "#3B88C3", size : "2em"}}>
                <BsGlobe/>
                </IconContext.Provider>
                </a>
            </div>
            
            </div>
        </div>

)


}

  export default Dashboard;
