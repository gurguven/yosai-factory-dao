// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title NFT STAKINKG CONTRACT 
/// @author Güven Gür
/// @notice Collection d'NFT : Fungitos Collection
/// @notice Token de rewards : YSF Token

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ERC721Staking is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Interfaces pour l'ERC20  & 721 
    IERC20 public immutable rewardsToken;
    IERC721 public immutable nftCollection;

    // Setup du contrat de NFT et de Tokens de rewards/gouvernance
    constructor(IERC721 _nftCollection, IERC20 _rewardsToken) {
        nftCollection = _nftCollection;
        rewardsToken = _rewardsToken;
    }

    //::::::::::::/ VARIABLES /:::::::::::://

    // Struct d'un token staké 
    struct StakedToken {
        // Adresse du staker
        address staker;
        // Id du token
        uint256 tokenId;
    }
    
    // Staker info
    struct Staker {
        // permet d'enregistrer les NFT stackés dans le SC
        uint256 amountStaked;

         // Le nombre de NFT stake dans le SC 
        StakedToken[] stakedTokens;

        // Le dernier moment ou les rewards ont été calculé pour l'user
        // Permet de reset le temps d'update, à chaque withdraw, ou nft staké en plus
        uint256 timeOfLastUpdate;

        // Combien le SC doit au stacker
        // Calculé à chaque fois que l'utilisateur écrit dans le SC
        uint256 unclaimedRewards;
    }

    // Rewards par heure, par token déposé en wei 
    uint256 private rewardsPerHour = 1388888888888900;

    //::::::::::::/ MAPPING /:::::::::::://

    // Mapping d'une address utilisateur à une info de stacker
    mapping(address => Staker) public stakers;

    // Mapping d'un token Id à un staker. 
    // Fait pour que le SC sache à qui renvoyer son NFT 
    mapping(uint256 => address) public stakerAddress;

    //::::::::::::/ FONCTIONS /:::::::::::://
    //////////
    // WRITE //
    //////////


    // -------- STAKE -------- // 

    /// @notice Permet de staker des NFT 
    /// @dev Si le compte possède déjà des NFT stakés, calculer les rewards
    /// @dev Incrémente le nombre de token stakés
    /// @dev Map du msg.sender au tokenId du NFT staké afin de pouvoir le rendre au withdraw 
    /// @dev Mise à jour du timeOfLastUpdate à la date du block.timestamp
    /// @param _tokenId tokenId du NFT à staker 
    function stake(uint256 _tokenId) external nonReentrant {
         // Si la wallet a des tokens staked, calculer les rewards avant d'ajouter un nouveau NFT
        if (stakers[msg.sender].amountStaked > 0) {
            uint256 rewards = calculateRewards(msg.sender);
            stakers[msg.sender].unclaimedRewards += rewards;
        }

        // Check que l'owner du token est bien l'appeleur de la fonction
        require(
            nftCollection.ownerOf(_tokenId) == msg.sender,
            "You don't own this token!"
        );

        // Transfert le NFT de la wallet du user à ce SC 
        nftCollection.transferFrom(msg.sender, address(this), _tokenId);

        // Créé une variable de type StakedToken, avec l'address du staker
        // et l'ID du token stacké 
        StakedToken memory stakedToken = StakedToken(msg.sender, _tokenId);

        // Ajoute le token dans l'array de token stakés 
        stakers[msg.sender].stakedTokens.push(stakedToken);

        // Incrémente le montant stacké pour cette wallet 
        stakers[msg.sender].amountStaked++;

        // Update le mapping d'un token ID à l'address du staker 
        stakerAddress[_tokenId] = msg.sender;

        // Update le timeOfLastUpdate pour le staker  
        stakers[msg.sender].timeOfLastUpdate = block.timestamp;
    }

    // -------- WITHDRAW -------- // 
    
    /// @notice Permet de récupérer son NFT staké
    /// @dev Check si le user possède des NFT stakés 
    /// @dev Décrementer la variable amountStaked 
    /// @dev Retourner le NFT staké à son staker
    /// @param _tokenId tokenId du NFT à récupérer 
    function withdraw(uint256 _tokenId) external nonReentrant {
        // Vérification que le user possède au moins un NFT stack 
        require(
            stakers[msg.sender].amountStaked > 0,
            "You have no tokens staked"
        );
        
        // Le msg sender a besoin de posséder le token qu'il essaie de withdraw 
        require(stakerAddress[_tokenId] == msg.sender, "You don't own this token!");

        // Mise à jour des rewards pour ce user, le montant de rewards doit baisser vu qu'il y a moins de tokens
        uint256 rewards = calculateRewards(msg.sender);
        stakers[msg.sender].unclaimedRewards += rewards;

        // Trouver l'ID du NFT dans le stakedTokens array 
        uint256 index;
        for (uint256 i = 0; i < stakers[msg.sender].stakedTokens.length; i++) {
            if (
                stakers[msg.sender].stakedTokens[i].tokenId == _tokenId 
                && 
                stakers[msg.sender].stakedTokens[i].staker != address(0)
            ) {
                index = i;
                break;
            }
        }

        // Retirer le token du stakedTokens array 
        stakers[msg.sender].stakedTokens[index].staker = address(0);

        // Décrémenter le montant de NFT stake de cette address
        stakers[msg.sender].amountStaked--;

        // Update le mapping du tokenId à l'address(0) pour indiquer que le NFT n'est plus stacké 
        stakerAddress[_tokenId] = address(0);

        // Transférer le NFT à son détenteur 
        nftCollection.transferFrom(address(this), msg.sender, _tokenId);

        // Update le timeOfLastUpdate pour le user
        stakers[msg.sender].timeOfLastUpdate = block.timestamp;
    }

    /// @notice Permet de récupérer les tokens que le contrat doit au user
    /// @dev Calculer les rewards pour le msg.sender, et check si il y'a des rewards
    /// @dev Transfert des tokens au user
    function claimRewards() external {
        uint256 rewards = calculateRewards(msg.sender) +
            stakers[msg.sender].unclaimedRewards;
        require(rewards > 0, "You have no rewards to claim");
        stakers[msg.sender].timeOfLastUpdate = block.timestamp;
        stakers[msg.sender].unclaimedRewards = 0;
        rewardsToken.safeTransfer(msg.sender, rewards);
    }

    //////////
    // View //
    //////////

    // -------- AVAILABLE REWARDS -------- // 


    /// @notice Permet de savoir les tokens disponibles à la récupération
    /// @return rewards le nombre de rewards qui peuvent être récupérées 
    function availableRewards(address _staker) public view returns (uint256) {
        uint256 rewards = calculateRewards(_staker) +
            stakers[_staker].unclaimedRewards;
        return rewards;
    }

    // -------- TOKENS STAKES -------- // 

    /// @notice Permet de récupérer tous les NFT qu'un user stake sur le contrat 
    /// @param _user le user pour lequel on souhaite récupérer les NFT stakés
    /// @return StakedToken les NFT stakés par le user
    function getStakedTokens(address _user) public view returns (StakedToken[] memory) {
        // Vérifier si on connait cet user 
        if (stakers[_user].amountStaked > 0) {
            // Retour toutes les tokens qui sont dans le array stakedToken 
            StakedToken[] memory _stakedTokens = new StakedToken[](stakers[_user].amountStaked);
            uint256 _index;

            // Loop pour avoir les vrais tokens stackés
            for (uint256 j = 0; j < stakers[_user].stakedTokens.length; j++) {
                // Si le stakedToken n'est pas égal à l'adresse 0
                if (stakers[_user].stakedTokens[j].staker != (address(0))) {
                    _stakedTokens[_index] = stakers[_user].stakedTokens[j];
                    _index++;
                }
            }

            return _stakedTokens;
        }
        
        // Otherwise, return empty array
        else {
            return new StakedToken[](0);
        }
    }

    /////////////
    // Internal//
    /////////////

    // -------- CALCULATE REWARDS  -------- // 

    /// @notice Calcul des rewards 
    /// @dev Calcule les rewards pour un staker, 
    /// @dev En fonction du temps passé depuis la dernière update en heures 
    /// @dev Et le multipliant par le nombre de NFT stakés et les rewards par heure  
    function calculateRewards(address _staker)
        internal
        view
        returns (uint256 _rewards)
    {
        return (((
            // On détermine le temps entre maintenant et le dernier update
            ((block.timestamp - stakers[_staker].timeOfLastUpdate) *
                stakers[_staker].amountStaked)
            // On multiplie par l'amount stake // Puis par les rewards par heure // Divisé par le rapport sec/h
        ) * rewardsPerHour) / 3600);
    }
}
