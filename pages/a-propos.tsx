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
  import {IoMdHelpCircle} from 'react-icons/io'
  import Image from "next/image";
  import roadmap from ".//../public/roadmap.png"

const APropos = () => {


    return (
        <div className={styles.container}>
            <div className={styles.pageTitle}>
                <IoMdHelpCircle/>
                <h1>A propos</h1>
            </div>
            <h2 className={styles.underTitle}>
                Aide
            </h2>
            <section className={styles.helpSection}>
                <div className={styles.aboutLeft}>
                    
                    <div>
                        <h2>Organisation de la DAO</h2>
                        <p>
                            La DAO YSF est constitué d’une DAO mère la YSF DAO et ses DAO filles les YSF Park, Space et Prod. 
                            Chaque DAO correspond à un écosystème en particulier. Il est possible de rentrer en intéraction avec chaque DAO suivant votre niveau d’implication. 
                            <br/>    
                        </p>
                        <p>
                            Les votes sont basés sur la possession du token YSF qui vient directement du stacking de votre Fungitos et du temps stacké.
                        </p>
                    </div>

                    <div>
                        <h2>Qui peut soumettre une proposition, qui peut voter ?</h2>
                        <p>
                            Uniquement les détenteurs de 120 YSF sont en mesure de soumettre des propositions (à hauteur de 4 par mois) à la DAO, du fait de leur implication dans le projet et du temps de stake de leur NFT.
                        <br/>    
                        </p>
                        <p>
                            Néanmoins, les propositions peuvent venir de toutes personnes au sein de la DAO en faisant remonter les idées via Discord
                        </p>
                    </div>

                    <div>
                        <h2>Comment débloquer un espace ?</h2>
                        <ul>
                            <li>Il faut montrer votre implication, votre envie de faire avancer le projet. </li>
                            <p>Pour se faire, il est nécessaire d{`'`}attendre le début de la deuxième phase : l{`'`}ouverture des SubDAO, et d{`'`}avoir un nombre de vote dépensé suffisant</p>
                            <li>Des points bonus</li>
                            <p>
                                1 vote utilisé = 1 point. <br /> 
                                Afin de débloquer l{`'`}accès à d{`'`}autres SubDAO plus rapidement, un système de points bonus est instauré. 
                                <br />
                                
                            </p>
                            <p>
                                Chaque proposition gagnante que vous proposerez vous récompensera de <span className={styles.green}>10 points bonus</span> ! Vous pourrez voir l{`'`}évolution de 
                                ces au sein de votre <a href="/profil">profil</a> ! 
                            </p>
                        </ul>
                    </div>
                </div>

                <div className={styles.aboutRight}>
                    <svg width="437" height="221" viewBox="0 0 437 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="213" cy="46" r="46" fill="#82C566"/>
                        <ellipse cx="45.5" cy="175" rx="45.5" ry="46" fill="#82C566"/>
                        <circle cx="213" cy="175" r="46" fill="#D9D9D9"/>
                        <ellipse cx="391.5" cy="175" rx="45.5" ry="46" fill="#D9D9D9"/>
                        <path d="M198.073 23.0909H200.656L203.144 27.7891H203.25L205.738 23.0909H208.321L204.342 30.1435V34H202.052V30.1435L198.073 23.0909ZM215.499 26.2283C215.456 25.7987 215.273 25.4648 214.95 25.2269C214.627 24.989 214.189 24.87 213.635 24.87C213.258 24.87 212.94 24.9233 212.681 25.0298C212.422 25.1328 212.223 25.2766 212.085 25.4613C211.95 25.646 211.882 25.8555 211.882 26.0898C211.875 26.2852 211.916 26.4556 212.005 26.6012C212.097 26.7468 212.223 26.8729 212.383 26.9794C212.543 27.0824 212.727 27.1729 212.937 27.2511C213.146 27.3256 213.37 27.3896 213.608 27.4428L214.588 27.6772C215.064 27.7837 215.501 27.9258 215.898 28.1033C216.296 28.2809 216.641 28.4993 216.932 28.7585C217.223 29.0178 217.449 29.3232 217.608 29.6747C217.772 30.0263 217.855 30.4293 217.859 30.8839C217.855 31.5515 217.685 32.1303 217.347 32.6204C217.013 33.1069 216.531 33.4851 215.898 33.755C215.27 34.0213 214.512 34.1545 213.624 34.1545C212.743 34.1545 211.976 34.0195 211.323 33.7496C210.673 33.4798 210.165 33.0803 209.799 32.5511C209.437 32.0185 209.247 31.3597 209.229 30.5749H211.461C211.486 30.9407 211.591 31.2461 211.776 31.4911C211.964 31.7326 212.214 31.9155 212.527 32.0398C212.843 32.1605 213.2 32.2209 213.597 32.2209C213.988 32.2209 214.327 32.1641 214.615 32.0504C214.906 31.9368 215.131 31.7788 215.291 31.5763C215.451 31.3739 215.531 31.1413 215.531 30.8786C215.531 30.6335 215.458 30.4276 215.312 30.2607C215.17 30.0937 214.961 29.9517 214.684 29.8345C214.411 29.7173 214.075 29.6108 213.677 29.5149L212.489 29.2166C211.57 28.9929 210.843 28.6431 210.311 28.1673C209.778 27.6914 209.513 27.0504 209.517 26.2443C209.513 25.5838 209.689 25.0067 210.044 24.5131C210.403 24.0195 210.895 23.6342 211.52 23.3572C212.145 23.0803 212.855 22.9418 213.651 22.9418C214.46 22.9418 215.167 23.0803 215.771 23.3572C216.378 23.6342 216.85 24.0195 217.188 24.5131C217.525 25.0067 217.699 25.5785 217.71 26.2283H215.499ZM219.41 34V23.0909H226.633V24.9925H221.717V27.592H226.154V29.4936H221.717V34H219.41ZM200.946 52H197.079V41.0909H200.978C202.075 41.0909 203.02 41.3093 203.811 41.7461C204.603 42.1793 205.212 42.8026 205.639 43.6158C206.068 44.429 206.283 45.402 206.283 46.5348C206.283 47.6712 206.068 48.6477 205.639 49.4645C205.212 50.2812 204.6 50.908 203.801 51.3448C203.005 51.7816 202.054 52 200.946 52ZM199.385 50.0238H200.85C201.532 50.0238 202.105 49.9031 202.57 49.6616C203.039 49.4165 203.391 49.0384 203.625 48.527C203.863 48.0121 203.982 47.348 203.982 46.5348C203.982 45.7287 203.863 45.07 203.625 44.5586C203.391 44.0472 203.041 43.6708 202.576 43.4293C202.11 43.1879 201.537 43.0671 200.855 43.0671H199.385V50.0238ZM209.257 52H206.785L210.551 41.0909H213.523L217.284 52H214.812L212.08 43.5838H211.995L209.257 52ZM209.102 47.712H214.94V49.5124H209.102V47.712ZM228.109 46.5455C228.109 47.7351 227.884 48.7472 227.433 49.5817C226.985 50.4162 226.375 51.0536 225.6 51.494C224.83 51.9308 223.963 52.1491 223.001 52.1491C222.031 52.1491 221.161 51.929 220.391 51.4886C219.62 51.0483 219.011 50.4109 218.564 49.5763C218.116 48.7418 217.893 47.7315 217.893 46.5455C217.893 45.3558 218.116 44.3438 218.564 43.5092C219.011 42.6747 219.62 42.0391 220.391 41.6023C221.161 41.1619 222.031 40.9418 223.001 40.9418C223.963 40.9418 224.83 41.1619 225.6 41.6023C226.375 42.0391 226.985 42.6747 227.433 43.5092C227.884 44.3438 228.109 45.3558 228.109 46.5455ZM225.771 46.5455C225.771 45.7749 225.655 45.125 225.425 44.5959C225.197 44.0668 224.876 43.6655 224.46 43.392C224.045 43.1186 223.558 42.9819 223.001 42.9819C222.443 42.9819 221.957 43.1186 221.541 43.392C221.126 43.6655 220.803 44.0668 220.572 44.5959C220.345 45.125 220.231 45.7749 220.231 46.5455C220.231 47.3161 220.345 47.9659 220.572 48.495C220.803 49.0241 221.126 49.4254 221.541 49.6989C221.957 49.9723 222.443 50.109 223.001 50.109C223.558 50.109 224.045 49.9723 224.46 49.6989C224.876 49.4254 225.197 49.0241 225.425 48.495C225.655 47.9659 225.771 47.3161 225.771 46.5455Z" fill="#FFE2B8"/>
                        <path d="M30.5726 158.091H33.1561L35.6436 162.789H35.7502L38.2377 158.091H40.8212L36.8422 165.143V169H34.5517V165.143L30.5726 158.091ZM47.9989 161.228C47.9563 160.799 47.7734 160.465 47.4503 160.227C47.1271 159.989 46.6886 159.87 46.1346 159.87C45.7582 159.87 45.4403 159.923 45.1811 160.03C44.9219 160.133 44.723 160.277 44.5845 160.461C44.4496 160.646 44.3821 160.855 44.3821 161.09C44.375 161.285 44.4158 161.456 44.5046 161.601C44.5969 161.747 44.723 161.873 44.8828 161.979C45.0426 162.082 45.2273 162.173 45.4368 162.251C45.6463 162.326 45.87 162.39 46.108 162.443L47.0881 162.677C47.5639 162.784 48.0007 162.926 48.3984 163.103C48.7962 163.281 49.1406 163.499 49.4318 163.759C49.723 164.018 49.9485 164.323 50.1083 164.675C50.2717 165.026 50.3551 165.429 50.3587 165.884C50.3551 166.551 50.1847 167.13 49.8473 167.62C49.5135 168.107 49.0305 168.485 48.3984 168.755C47.7699 169.021 47.0117 169.154 46.1239 169.154C45.2433 169.154 44.4762 169.02 43.8228 168.75C43.1729 168.48 42.6651 168.08 42.2994 167.551C41.9371 167.018 41.7472 166.36 41.7294 165.575H43.9613C43.9862 165.941 44.0909 166.246 44.2756 166.491C44.4638 166.733 44.7141 166.915 45.0266 167.04C45.3427 167.161 45.6996 167.221 46.0973 167.221C46.4879 167.221 46.8271 167.164 47.1147 167.05C47.4059 166.937 47.6314 166.779 47.7912 166.576C47.951 166.374 48.0309 166.141 48.0309 165.879C48.0309 165.634 47.9581 165.428 47.8125 165.261C47.6705 165.094 47.4609 164.952 47.1839 164.835C46.9105 164.717 46.5749 164.611 46.1772 164.515L44.9893 164.217C44.0696 163.993 43.3434 163.643 42.8107 163.167C42.2781 162.691 42.0135 162.05 42.017 161.244C42.0135 160.584 42.1893 160.007 42.5444 159.513C42.9031 159.02 43.3949 158.634 44.0199 158.357C44.6449 158.08 45.3551 157.942 46.1506 157.942C46.9602 157.942 47.6669 158.08 48.2706 158.357C48.8778 158.634 49.3501 159.02 49.6875 159.513C50.0249 160.007 50.1989 160.578 50.2095 161.228H47.9989ZM51.9101 169V158.091H59.1331V159.993H54.2165V162.592H58.6537V164.494H54.2165V169H51.9101ZM27.1396 179.228C27.0969 178.799 26.9141 178.465 26.5909 178.227C26.2678 177.989 25.8292 177.87 25.2752 177.87C24.8988 177.87 24.581 177.923 24.3217 178.03C24.0625 178.133 23.8636 178.277 23.7251 178.461C23.5902 178.646 23.5227 178.855 23.5227 179.09C23.5156 179.285 23.5565 179.456 23.6452 179.601C23.7376 179.747 23.8636 179.873 24.0234 179.979C24.1832 180.082 24.3679 180.173 24.5774 180.251C24.7869 180.326 25.0107 180.39 25.2486 180.443L26.2287 180.677C26.7045 180.784 27.1413 180.926 27.5391 181.103C27.9368 181.281 28.2813 181.499 28.5724 181.759C28.8636 182.018 29.0891 182.323 29.2489 182.675C29.4123 183.026 29.4957 183.429 29.4993 183.884C29.4957 184.551 29.3253 185.13 28.9879 185.62C28.6541 186.107 28.1712 186.485 27.5391 186.755C26.9105 187.021 26.1523 187.154 25.2646 187.154C24.3839 187.154 23.6168 187.02 22.9634 186.75C22.3136 186.48 21.8058 186.08 21.44 185.551C21.0778 185.018 20.8878 184.36 20.87 183.575H23.1019C23.1268 183.941 23.2315 184.246 23.4162 184.491C23.6044 184.733 23.8548 184.915 24.1673 185.04C24.4833 185.161 24.8402 185.221 25.2379 185.221C25.6286 185.221 25.9677 185.164 26.2553 185.05C26.5465 184.937 26.772 184.779 26.9318 184.576C27.0916 184.374 27.1715 184.141 27.1715 183.879C27.1715 183.634 27.0987 183.428 26.9531 183.261C26.8111 183.094 26.6016 182.952 26.3246 182.835C26.0511 182.717 25.7156 182.611 25.3178 182.515L24.13 182.217C23.2102 181.993 22.484 181.643 21.9513 181.167C21.4187 180.691 21.1541 180.05 21.1577 179.244C21.1541 178.584 21.3299 178.007 21.685 177.513C22.0437 177.02 22.5355 176.634 23.1605 176.357C23.7855 176.08 24.4957 175.942 25.2912 175.942C26.1009 175.942 26.8075 176.08 27.4112 176.357C28.0185 176.634 28.4908 177.02 28.8281 177.513C29.1655 178.007 29.3395 178.578 29.3501 179.228H27.1396ZM31.0507 187V176.091H35.3547C36.1821 176.091 36.887 176.249 37.4694 176.565C38.0518 176.877 38.4956 177.312 38.801 177.87C39.11 178.424 39.2645 179.063 39.2645 179.788C39.2645 180.512 39.1082 181.151 38.7957 181.705C38.4832 182.259 38.0305 182.691 37.4374 183C36.8479 183.309 36.1341 183.463 35.2961 183.463H32.5528V181.615H34.9232C35.3671 181.615 35.7329 181.538 36.0205 181.386C36.3117 181.229 36.5283 181.015 36.6704 180.741C36.816 180.464 36.8888 180.146 36.8888 179.788C36.8888 179.425 36.816 179.109 36.6704 178.839C36.5283 178.566 36.3117 178.355 36.0205 178.206C35.7293 178.053 35.36 177.977 34.9126 177.977H33.3572V187H31.0507ZM41.3832 187H38.9116L42.6776 176.091H45.6499L49.4105 187H46.9389L44.2063 178.584H44.1211L41.3832 187ZM41.2287 182.712H47.0668V184.512H41.2287V182.712ZM59.8362 179.91H57.5031C57.4605 179.608 57.3735 179.34 57.2421 179.106C57.1107 178.868 56.942 178.665 56.7361 178.499C56.5301 178.332 56.2922 178.204 56.0223 178.115C55.7559 178.026 55.4665 177.982 55.154 177.982C54.5894 177.982 54.0976 178.122 53.6785 178.403C53.2595 178.68 52.9346 179.085 52.7037 179.617C52.4729 180.146 52.3575 180.789 52.3575 181.545C52.3575 182.323 52.4729 182.977 52.7037 183.506C52.9381 184.035 53.2648 184.434 53.6839 184.704C54.1029 184.974 54.5876 185.109 55.1381 185.109C55.447 185.109 55.7329 185.068 55.9957 184.987C56.262 184.905 56.4981 184.786 56.7041 184.63C56.9101 184.47 57.0805 184.276 57.2155 184.049C57.354 183.822 57.4498 183.562 57.5031 183.271L59.8362 183.282C59.7758 183.783 59.6249 184.266 59.3834 184.731C59.1455 185.192 58.8241 185.606 58.4193 185.972C58.018 186.334 57.5386 186.622 56.9811 186.835C56.4271 187.044 55.8003 187.149 55.1008 187.149C54.1278 187.149 53.2577 186.929 52.4907 186.489C51.7272 186.048 51.1235 185.411 50.6796 184.576C50.2393 183.742 50.0191 182.732 50.0191 181.545C50.0191 180.356 50.2428 179.344 50.6903 178.509C51.1377 177.675 51.7449 177.039 52.512 176.602C53.279 176.162 54.142 175.942 55.1008 175.942C55.7329 175.942 56.3188 176.031 56.8586 176.208C57.4019 176.386 57.8831 176.645 58.3021 176.986C58.7211 177.323 59.0621 177.737 59.3248 178.227C59.5912 178.717 59.7616 179.278 59.8362 179.91ZM61.4901 187V176.091H68.841V177.993H63.7966V180.592H68.4628V182.494H63.7966V185.098H68.8623V187H61.4901Z" fill="white"/>
                        <path d="M198.073 154.091H200.656L203.144 158.789H203.25L205.738 154.091H208.321L204.342 161.143V165H202.052V161.143L198.073 154.091ZM215.499 157.228C215.456 156.799 215.273 156.465 214.95 156.227C214.627 155.989 214.189 155.87 213.635 155.87C213.258 155.87 212.94 155.923 212.681 156.03C212.422 156.133 212.223 156.277 212.085 156.461C211.95 156.646 211.882 156.855 211.882 157.09C211.875 157.285 211.916 157.456 212.005 157.601C212.097 157.747 212.223 157.873 212.383 157.979C212.543 158.082 212.727 158.173 212.937 158.251C213.146 158.326 213.37 158.39 213.608 158.443L214.588 158.677C215.064 158.784 215.501 158.926 215.898 159.103C216.296 159.281 216.641 159.499 216.932 159.759C217.223 160.018 217.449 160.323 217.608 160.675C217.772 161.026 217.855 161.429 217.859 161.884C217.855 162.551 217.685 163.13 217.347 163.62C217.013 164.107 216.531 164.485 215.898 164.755C215.27 165.021 214.512 165.154 213.624 165.154C212.743 165.154 211.976 165.02 211.323 164.75C210.673 164.48 210.165 164.08 209.799 163.551C209.437 163.018 209.247 162.36 209.229 161.575H211.461C211.486 161.941 211.591 162.246 211.776 162.491C211.964 162.733 212.214 162.915 212.527 163.04C212.843 163.161 213.2 163.221 213.597 163.221C213.988 163.221 214.327 163.164 214.615 163.05C214.906 162.937 215.131 162.779 215.291 162.576C215.451 162.374 215.531 162.141 215.531 161.879C215.531 161.634 215.458 161.428 215.312 161.261C215.17 161.094 214.961 160.952 214.684 160.835C214.411 160.717 214.075 160.611 213.677 160.515L212.489 160.217C211.57 159.993 210.843 159.643 210.311 159.167C209.778 158.691 209.513 158.05 209.517 157.244C209.513 156.584 209.689 156.007 210.044 155.513C210.403 155.02 210.895 154.634 211.52 154.357C212.145 154.08 212.855 153.942 213.651 153.942C214.46 153.942 215.167 154.08 215.771 154.357C216.378 154.634 216.85 155.02 217.188 155.513C217.525 156.007 217.699 156.578 217.71 157.228H215.499ZM219.41 165V154.091H226.633V155.993H221.717V158.592H226.154V160.494H221.717V165H219.41ZM193.519 183V172.091H197.823C198.65 172.091 199.355 172.249 199.938 172.565C200.52 172.877 200.964 173.312 201.269 173.87C201.578 174.424 201.733 175.063 201.733 175.788C201.733 176.512 201.576 177.151 201.264 177.705C200.951 178.259 200.499 178.691 199.906 179C199.316 179.309 198.602 179.463 197.764 179.463H195.021V177.615H197.391C197.835 177.615 198.201 177.538 198.489 177.386C198.78 177.229 198.997 177.015 199.139 176.741C199.284 176.464 199.357 176.146 199.357 175.788C199.357 175.425 199.284 175.109 199.139 174.839C198.997 174.566 198.78 174.355 198.489 174.206C198.198 174.053 197.828 173.977 197.381 173.977H195.825V183H193.519ZM203.851 183H201.38L205.146 172.091H208.118L211.879 183H209.407L206.675 174.584H206.589L203.851 183ZM203.697 178.712H209.535V180.512H203.697V178.712ZM213.192 183V172.091H217.496C218.32 172.091 219.023 172.238 219.605 172.533C220.191 172.824 220.637 173.238 220.942 173.774C221.251 174.307 221.406 174.934 221.406 175.654C221.406 176.379 221.249 177.002 220.937 177.524C220.624 178.043 220.172 178.44 219.579 178.717C218.989 178.994 218.275 179.133 217.437 179.133H214.555V177.279H217.064C217.505 177.279 217.87 177.219 218.162 177.098C218.453 176.977 218.669 176.796 218.811 176.555C218.957 176.313 219.03 176.013 219.03 175.654C219.03 175.292 218.957 174.987 218.811 174.738C218.669 174.49 218.451 174.301 218.156 174.174C217.865 174.042 217.498 173.977 217.054 173.977H215.498V183H213.192ZM219.083 178.036L221.794 183H219.248L216.596 178.036H219.083ZM223.036 183V172.091H225.342V176.901H225.486L229.412 172.091H232.176L228.128 176.975L232.224 183H229.465L226.477 178.515L225.342 179.9V183H223.036Z" fill="black"/>
                        <path d="M377.573 158.091H380.156L382.644 162.789H382.75L385.238 158.091H387.821L383.842 165.143V169H381.552V165.143L377.573 158.091ZM394.999 161.228C394.956 160.799 394.773 160.465 394.45 160.227C394.127 159.989 393.689 159.87 393.135 159.87C392.758 159.87 392.44 159.923 392.181 160.03C391.922 160.133 391.723 160.277 391.585 160.461C391.45 160.646 391.382 160.855 391.382 161.09C391.375 161.285 391.416 161.456 391.505 161.601C391.597 161.747 391.723 161.873 391.883 161.979C392.043 162.082 392.227 162.173 392.437 162.251C392.646 162.326 392.87 162.39 393.108 162.443L394.088 162.677C394.564 162.784 395.001 162.926 395.398 163.103C395.796 163.281 396.141 163.499 396.432 163.759C396.723 164.018 396.949 164.323 397.108 164.675C397.272 165.026 397.355 165.429 397.359 165.884C397.355 166.551 397.185 167.13 396.847 167.62C396.513 168.107 396.031 168.485 395.398 168.755C394.77 169.021 394.012 169.154 393.124 169.154C392.243 169.154 391.476 169.02 390.823 168.75C390.173 168.48 389.665 168.08 389.299 167.551C388.937 167.018 388.747 166.36 388.729 165.575H390.961C390.986 165.941 391.091 166.246 391.276 166.491C391.464 166.733 391.714 166.915 392.027 167.04C392.343 167.161 392.7 167.221 393.097 167.221C393.488 167.221 393.827 167.164 394.115 167.05C394.406 166.937 394.631 166.779 394.791 166.576C394.951 166.374 395.031 166.141 395.031 165.879C395.031 165.634 394.958 165.428 394.812 165.261C394.67 165.094 394.461 164.952 394.184 164.835C393.911 164.717 393.575 164.611 393.177 164.515L391.989 164.217C391.07 163.993 390.343 163.643 389.811 163.167C389.278 162.691 389.013 162.05 389.017 161.244C389.013 160.584 389.189 160.007 389.544 159.513C389.903 159.02 390.395 158.634 391.02 158.357C391.645 158.08 392.355 157.942 393.151 157.942C393.96 157.942 394.667 158.08 395.271 158.357C395.878 158.634 396.35 159.02 396.688 159.513C397.025 160.007 397.199 160.578 397.21 161.228H394.999ZM398.91 169V158.091H406.133V159.993H401.217V162.592H405.654V164.494H401.217V169H398.91ZM371.847 187V176.091H376.151C376.978 176.091 377.683 176.249 378.266 176.565C378.848 176.877 379.292 177.312 379.597 177.87C379.906 178.424 380.061 179.063 380.061 179.788C380.061 180.512 379.905 181.151 379.592 181.705C379.28 182.259 378.827 182.691 378.234 183C377.644 183.309 376.931 183.463 376.092 183.463H373.349V181.615H375.72C376.163 181.615 376.529 181.538 376.817 181.386C377.108 181.229 377.325 181.015 377.467 180.741C377.612 180.464 377.685 180.146 377.685 179.788C377.685 179.425 377.612 179.109 377.467 178.839C377.325 178.566 377.108 178.355 376.817 178.206C376.526 178.053 376.156 177.977 375.709 177.977H374.154V187H371.847ZM381.559 187V176.091H385.863C386.687 176.091 387.39 176.238 387.972 176.533C388.558 176.824 389.004 177.238 389.309 177.774C389.618 178.307 389.773 178.934 389.773 179.654C389.773 180.379 389.617 181.002 389.304 181.524C388.992 182.043 388.539 182.44 387.946 182.717C387.356 182.994 386.642 183.133 385.804 183.133H382.923V181.279H385.432C385.872 181.279 386.238 181.219 386.529 181.098C386.82 180.977 387.037 180.796 387.179 180.555C387.324 180.313 387.397 180.013 387.397 179.654C387.397 179.292 387.324 178.987 387.179 178.738C387.037 178.49 386.818 178.301 386.523 178.174C386.232 178.042 385.865 177.977 385.421 177.977H383.865V187H381.559ZM387.45 182.036L390.162 187H387.615L384.963 182.036H387.45ZM401.428 181.545C401.428 182.735 401.202 183.747 400.751 184.582C400.304 185.416 399.693 186.054 398.919 186.494C398.148 186.931 397.282 187.149 396.319 187.149C395.35 187.149 394.48 186.929 393.709 186.489C392.939 186.048 392.33 185.411 391.882 184.576C391.435 183.742 391.211 182.732 391.211 181.545C391.211 180.356 391.435 179.344 391.882 178.509C392.33 177.675 392.939 177.039 393.709 176.602C394.48 176.162 395.35 175.942 396.319 175.942C397.282 175.942 398.148 176.162 398.919 176.602C399.693 177.039 400.304 177.675 400.751 178.509C401.202 179.344 401.428 180.356 401.428 181.545ZM399.089 181.545C399.089 180.775 398.974 180.125 398.743 179.596C398.516 179.067 398.194 178.665 397.779 178.392C397.363 178.119 396.877 177.982 396.319 177.982C395.762 177.982 395.275 178.119 394.86 178.392C394.444 178.665 394.121 179.067 393.89 179.596C393.663 180.125 393.549 180.775 393.549 181.545C393.549 182.316 393.663 182.966 393.89 183.495C394.121 184.024 394.444 184.425 394.86 184.699C395.275 184.972 395.762 185.109 396.319 185.109C396.877 185.109 397.363 184.972 397.779 184.699C398.194 184.425 398.516 184.024 398.743 183.495C398.974 182.966 399.089 182.316 399.089 181.545ZM407.003 187H403.136V176.091H407.035C408.133 176.091 409.077 176.309 409.869 176.746C410.661 177.179 411.27 177.803 411.696 178.616C412.126 179.429 412.341 180.402 412.341 181.535C412.341 182.671 412.126 183.648 411.696 184.464C411.27 185.281 410.657 185.908 409.858 186.345C409.063 186.782 408.111 187 407.003 187ZM405.443 185.024H406.907C407.589 185.024 408.163 184.903 408.628 184.662C409.097 184.417 409.448 184.038 409.683 183.527C409.921 183.012 410.04 182.348 410.04 181.535C410.04 180.729 409.921 180.07 409.683 179.559C409.448 179.047 409.098 178.671 408.633 178.429C408.168 178.188 407.595 178.067 406.913 178.067H405.443V185.024Z" fill="black"/>
                        <line y1="-2.5" x2="109.464" y2="-2.5" transform="matrix(-0.803719 0.595009 -0.530593 -0.847627 170.175 73.667)" stroke="#59C626" stroke-width="5"/>
                        <line y1="-2.5" x2="104.477" y2="-2.5" transform="matrix(0.846037 0.533124 -0.470232 0.882543 265.587 73.667)" stroke="#878383" stroke-width="5" stroke-dasharray="10 10"/>
                        <line x1="215.5" y1="101" x2="215.5" y2="121" stroke="#878383" stroke-width="5" stroke-dasharray="10 10"/>
                    </svg>

                    <div className={styles.ranks}>
                        <div className={styles.rankLine}>
                            <div><h3>RANK #03</h3></div>
                            <div><p>Governor</p></div>
                            <div><p><span className={styles.green}>1000 Points</span></p></div>
                        </div>
                        <div className={styles.rankLine}>
                            <div><h3>RANK #02</h3></div>
                            <div><p>Conquistador</p></div>
                            <div><p><span className={styles.green}>500 Points</span></p></div>
                        </div>
                        <div className={styles.rankLine}>
                            <div><h3>RANK #01</h3></div>
                            <div><p>Explorer</p></div>
                            <div><p><span className={styles.green}>100 Points</span></p></div>
                        </div>
                        <div className={styles.rankLine}>
                            <div><h3>RANK #00</h3></div>
                            <div><p>Discoverer</p></div>
                            <div><p><span className={styles.green}>0 Point</span></p></div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <h2 className={styles.underTitle}>Phases de la DAO</h2>
                <div>
                    <div>
                        <a href="/phases-ysf.jpg" target="_blank">
                            <picture className={styles.phasesImg}>
                                <img src="/phases-ysf.jpg" alt="Phases DAO YSF"/>
                            </picture>
                        </a>
                    </div>
                </div>

            </section>

            <section>
                    <h2 className={styles.underTitle}>Roadmap</h2>
                <div>
                    <div>
                        <a href="/roadmap-large.png" target="_blank">
                            <picture className={styles.roadmapImg}>
                                <img src="/roadmap.png" alt="Roadmap YSF"/>
                            </picture>
                        </a>
                    </div>
                </div>
            </section>




            
            
           

            
        </div>
    )
} 

export default APropos;