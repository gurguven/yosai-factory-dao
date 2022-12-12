
# YSF DAO DApp - Alyra | Projet Final

## Sommaire
- Lien de la vidéo de démonstration
- Lien de la DApp déployée sur Mumbai
- Dépendances & outils utilisés 
- Utilisation
- Utilité des smarts contracts
- Fonctionnement de la dApp

---

## Lien de la vidéo de démonstration
- [Vidéo de démo](https://www.loom.com/share/95f142cc536c40f1910b5c8483f033a0)

---

## Lien de la DApp déployée sur Mumbai
(veillez à vous connecter sur le bon network) 

- [DApp en Ligne](https://yosai-factory-dao.vercel.app)

---

## Dépendances & outils utilisés
**Afin de réaliser notre DApp, différentes ressources ont été utilisées :**
- Next.js
- Thirdweb
- Ethers.js
- Hardhat
--- 

## Utilisation 

1. `npm install`
2. `npm install @openzeppelin/contracts`
3. `npm run dev`

---

## Utilité des smarts contracts 

**Le contrat [NftStaking.sol](https://github.com/gurguven/yosai-factory-dao/blob/main/contracts/NftStaking.sol) permet principalement:**

- De staker ses NFT Fungitos (ERC721) [La collection Fungitos](https://mumbai.polygonscan.com/address/0xF322C17D7aC1fc752425E14a94578C39bdBE7570)
- D'obtenir de rewards en YSF TOKEN (ERC20) [Le token YSF](https://mumbai.polygonscan.com/address/0x2191b0C37c168c205c238ed29776Da50c5f68f02)
- De récupérer ses NFT stakés sur le smart contract 

**Le contrat [YSFDAO.sol](https://github.com/gurguven/yosai-factory-dao/blob/main/contracts/YSFDAO.sol) permet principalement:**

- De faire des propositions dans sa ou ses SubDAO (120 Tokens YSF minimums dans la wallet) 
- De voter pour une proposition (1 vote = 1 token YSF)
- D'entrer dans une nouvelle SubDao si on a assez de points

*Pour en savoir plus, se reférrer aux Natspecs*

## Fonctionnement  de la DApp

- On stake un ou plusieurs Fungitos sur la dApp
- On récupère les rewards en YSF Token 
- On vote pour les propositions de notre SubDAO 
- On propose dans notre SubDAO (120 tokens requis) 
- On rentre dans de nouvelles SubDao en claimant son nouveau Rank 
