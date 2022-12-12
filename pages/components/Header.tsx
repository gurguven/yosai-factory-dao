import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link"
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import {BsFillPersonLinesFill} from 'react-icons/bs'
import {IoMdHelpCircle} from 'react-icons/io'
import {RiMoneyCnyCircleFill} from 'react-icons/ri'
import {MdWhereToVote} from 'react-icons/md'

const Header = () => {
  return (
      <div>
        <Head>
          <title>YSF DAO</title>
        </Head>
         <header className={styles.header}>
          <div className={styles.logo}>
              <Image src="/logo-ysf.png" alt="Logo YSF" width={135} height={135} /> 
          </div>
          <div className={styles.navcontainer}>
            <nav className={styles.nav} >
              <div className={styles.linkContainer}>
                <div className={styles.iconLink}>
                  <MdWhereToVote/>
                  <Link href="/">DAO</Link>
                </div>
                <div className={styles.iconLink}>
                  <RiMoneyCnyCircleFill/>
                  <Link href="/stake">Stake</Link>
                </div>
                <div className={styles.iconLink}>
                  <IoMdHelpCircle/>
                  <Link href="/a-propos">A propos</Link>
                </div>
                <div className={styles.iconLink}>
                  <BsFillPersonLinesFill/>
                  <Link href="/profile">Profil</Link>
                </div>
              </div>
              <ConnectWallet className={styles.connectWallet}/>
            </nav>
          </div>
        </header>
      </div>
    );
  };
  
export default Header;
