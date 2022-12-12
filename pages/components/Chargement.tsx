import styles from "../../styles/Home.module.css";

const Chargement = ({noText}:any) => {

    if (noText == true) {
        return (
            <div className={styles.chargement}>
                <div className={styles.ldsEllipsis}>
                    <div></div><div></div><div></div><div></div>
                </div>
            </div>
        )
    }  
    return(
        <div className={styles.chargement}>
            <h4>Chargement</h4>
            <div className={styles.ldsEllipsis}>
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    )

}

export default Chargement