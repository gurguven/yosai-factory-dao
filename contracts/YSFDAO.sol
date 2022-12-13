// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/// @title YSF DAO Contract 
/// @author Güven Gür
/// @notice La DAO possède 1 DAO mère et 3 SubDAO 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YSFDAO is Ownable  {

    address public TOKENCONTRACT;

    constructor(address _TOKENCONTRACT) {
        TOKENCONTRACT = _TOKENCONTRACT;
    }

    /* ----- VARIABLES ----- */

    Proposal[] public ProposalArray; 

    uint YsfDaoMembers; 
    uint YsfProdMembers; 
    uint YsfSpaceMembers; 
    uint YsfParkMembers; 

    // Struct de proposition
    struct Proposal {
        // Titre de la proposition
        string title; 
        // Description de la proposition
        string desc; 
        // Discussion (lien) de la proposition
        string discussion;
        // Votes approuvés
        uint yesVoteCount;
        // Votes non approuvés
        uint noVoteCount;
        // Date d'enregistrement de la proposition
        uint dateOfSubmission; 
        // Index de la proposition 
        // 1 = YSF DAO | 2 = YSF PROD | 3 = YSF SPACE | 4 = YSF PARK
        uint daoIndex; 
        // Statut de la proposition
        bool isOpen; 
        // Proposition a gagné ou pas 
        bool hasWinned;
        // Addresse qui a envoyé la proposition
        address sender;  
    }
    
    // Struct sur le voter 
    struct Voter {
        // Nombre de points cumulés par le membre
        uint points;  
        // Nombre de proposals envoyés
        uint proposalSent; 
        // Rang au sein de la DAO
        uint rank; 
        // Mapping qui enregistre si le membre a voté ou non pour une proposition
        mapping(uint => bool) hasVotedFor; 
        // Mapping qui enregistre si le résultat du vote d'une proposition 
        mapping(uint => bool) resultForVote; 
        // Booléens permettant de savoir les DAO - SUBDAO dans laquelle se trouve le membre
        bool isInYsfDao; 
        bool isInYsfProd; 
        bool isInYsfSpace; 
        bool isInYsfPark;           
    }
    
    //::::::::::::/ MAPPING /:::::::::::://

    /// @custom:voters Mapping qui enregistre une structure voter pour une address 
    mapping (address => Voter) voters;

    /// @custom:incoreteam Mapping qui enregistre si une addresse est dans la coreteam 
    mapping (address => bool) inCoreTeam; 

    
    //::::::::::::/ ENUM - STATE /:::::::::::://

    enum Phases {phase1, phase2, phase3, phase4, phase5}
    Phases public phases; 
    uint8 phasesValue; 

    //::::::::::::/ EVENTS /:::::::::::://

    /// @notice Enregistre les infos d'une proposition enregistrée 
    /// @param id Index de la proposition
    /// @param sender Adresse ethereum de l'envoyeur de la proposition
    /// @param title Titre de la proposition
    /// @param desc Description de la proposition 
    /// @param discussion Discussion (lien) de la proposition
    /// @param date Date d'enregistrement de la proposition
    /// @param subDao Index représentant la DAO-SUBDAO ou se trouve la proposition
    event proposalSubmitted(uint id, address sender , string title , string desc , string discussion, uint date, uint subDao);

    /// @notice Enregistre les infos sur un vote enregistré 
    /// @param id Index de la proposition
    /// @param sender Adresse ethereum de l'envoyeur de la proposition
    /// @param yesOrNo Résultat de la proposition 
    event voteSubmitted(uint id , address sender, bool yesOrNo );

    //::::::::::::/ FONCTIONS /:::::::::::://
    
    // -------- DEVELOPPEMENT - DEMONSTRATION -------- // 
    
    /// @notice  Permet de rentrer une adresse ethereum en temps en membre de la core team
    /// @dev /!\ FONCTION A BUT DE DEVELOPPEMENT - A MODIFIER AVANT PRODUCTION/MAINNET /!\ 
    /// @param _member Ethereum wallet address à rentrer dans la core team
    function setupCoreTeam(address _member) external onlyOwner {
        require(inCoreTeam[_member] == false); 
        inCoreTeam[_member] = true; 
    }

    /// @notice  Permet de faire passer gouvernor (rank 4) un membre de la core team
    /// @dev /!\ FONCTION A BUT DE DEVELOPPEMENT - A MODIFIER AVANT PRODUCTION/MAINNET /!\ //
    /// @param _member Ethereum wallet address à faire passer gouvernor(rank 4)
    function claimPower(address _member) external {
        require(inCoreTeam[_member] == true); 
        voters[_member].isInYsfDao = true;
        voters[_member].isInYsfProd = true;
        voters[_member].isInYsfSpace = true;
        voters[_member].isInYsfPark = true;
        voters[_member].rank = 4; 
        YsfDaoMembers++; 
        YsfProdMembers++; 
        YsfSpaceMembers++; 
        YsfParkMembers++; 
    } 

    /// @notice  Permet de changer de phases au sein de la DAO 
    /// @dev /!\ FONCTION A BUT DE DEVELOPPEMENT - A MODIFIER AVANT PRODUCTION/MAINNET /!\ //
    function changePhase() external onlyOwner {
        if (phasesValue < 4) {
            phasesValue++; 
            phases = Phases(phasesValue);
        } else {
            revert(); 
        }
    }


    // -------- PROPOSITION -------- // 
    /// @notice  Permet d'enregistrer une proposition
    /// @dev parameter _daoIndex : (1 = YSF DAO - 2 = YSF PROD - 3 = YSF SPACE 4 = YSF PARK)
    /// @param _title Titre de la proposition
    /// @param _desc Description de la proposition
    /// @param _discussion Discussion de la  proposition
    /// @param _daoIndex Index de DAO 
    function submitProposal(string memory _title, string memory _desc, string memory _discussion, uint _daoIndex ) external {
        // require une balance de 120 tokens
        require(getTokenBalance(msg.sender) >= 120 ether, "You don't have the required amount of tokens to make a proposal ");

        // Require une bonne sélection des DAO
        require(_daoIndex == 1 || _daoIndex == 2 || _daoIndex == 3 || _daoIndex == 4, "Propose in a DAO/SubDao that exists");

        if (_daoIndex == 1) {
            require(voters[msg.sender].isInYsfDao == true, "You are not allowed to propose in this part of the DAO");
        } else if (_daoIndex == 2) {
            require(voters[msg.sender].isInYsfProd == true, "You are not allowed to propose in this part of the DAO"); 
        } else if (_daoIndex == 3) {
            require(voters[msg.sender].isInYsfSpace == true, "You are not allowed to propose in this part of the DAO"); 
        } else if (_daoIndex == 4) {
            require(voters[msg.sender].isInYsfPark == true, "You are not allowed to propose in this part of the DAO"); 
        }

        // Nouvelle instance de proposition
        Proposal memory proposal; 

        proposal.title = _title; 
        proposal.desc = _desc; 
        proposal.discussion = _discussion; 
        proposal.isOpen = true; 
        proposal.dateOfSubmission = block.timestamp; 
        proposal.daoIndex = _daoIndex; 
        proposal.sender = msg.sender; 

        ProposalArray.push(proposal);

        // Incrémentation du nombre de proposition envoyé
        voters[msg.sender].proposalSent++;

        // Incrémentation du nombre de points
        voters[msg.sender].points++; 

        emit proposalSubmitted ((ProposalArray.length - 1 ), msg.sender, _title, _desc, _discussion, block.timestamp, _daoIndex);
    }

    // -------- VOTE -------- // 
    /// @notice  Permet d'enregistrer un vote pour une proposition
    /// @param _id Index de la proposition
    /// @param _voteDecision Description de la proposition
    function voteForProposal(uint _id, bool _voteDecision ) external {
        // Si la proposition dépasse 30 jours
        if (block.timestamp - (ProposalArray[_id].dateOfSubmission) > 30 days) {
            // On change le statut de la proposition
            ProposalArray[_id].isOpen = false; 
            // Si la proposition a plus de vote positifs que négatifs
            if(ProposalArray[_id].yesVoteCount > ProposalArray[_id].noVoteCount) {
                // On enregistre qu'elle a gagné
                ProposalArray[_id].hasWinned = true;
                // On rajoute 10 points au sender de la proposition gagnante 
                voters[ProposalArray[_id].sender].points+= 10; 
            }
        }
        // Require que le voteur n'a pas déjà voté pour cette proposition
        require(hasVotedForThisProposal(msg.sender,_id) == false); 

        // require que l'id existe bien
        require(_id < ProposalArray.length, "This proposal does not exist");

        // Require que la session de vote pour cette proposition soit ouverte 
        require(ProposalArray[_id].isOpen, "The voting session for this proposal is closed ");

        // Require une balance de tokens supérieure ou égale  à 1
        require(getTokenBalance(msg.sender) >= 1 ether, "You don't have enough tokens to make a vote ");

        // ENVOI D'UN TOKEN AU CONTRAT 
        require(ERC20(TOKENCONTRACT).transferFrom(msg.sender, address(this), 1 ether));

        // Ajout du vote
        if (_voteDecision == true) {
            ProposalArray[_id].yesVoteCount++;
        } else { 
            ProposalArray[_id].noVoteCount++; 
        }
        
        // On enregistre que le voteur a voté pour cette proposition
        voters[msg.sender].hasVotedFor[_id] = true; 

        // On enregistre le choix du vote
        voters[msg.sender].resultForVote[_id] = _voteDecision; 

        // Incrémentation du nombre de points
        voters[msg.sender].points++; 

        emit voteSubmitted(_id, msg.sender, _voteDecision); 
    }

    // -------- RANK | DAO & SUBDAO -------- // 

    /// @notice Permet de rentrer dans la YSF DAO 
    /// @dev On doit être dans la phase 4 pour utiliser cette fonction et être dans les 3 SUBDAO
    function enterYsfDao() external {
        require(phases >= Phases.phase4, "It's not possible for the moment to enter in the YSF DAO " );
        require(voters[msg.sender].rank == 3 && voters[msg.sender].isInYsfProd && voters[msg.sender].isInYsfSpace && voters[msg.sender].isInYsfPark, "You don't have the rank required to pass this level");
        require(voters[msg.sender].points >= 1000, "You don't have enough points to enter this DAO and upgrade rank");

        voters[msg.sender].rank = 4;
        voters[msg.sender].isInYsfDao = true; 
    }

    /// @notice Permet de rentrer dans la YSF PROD SubDAO 
    function enterYsfProd() external {
        require(voters[msg.sender].isInYsfProd == false, "You are already in this SubDAO"); 
        // Rank 0, dans aucune SubDao
        if (!(voters[msg.sender].isInYsfSpace) && !(voters[msg.sender].isInYsfPark)) {
            voters[msg.sender].rank = 1;
            voters[msg.sender].isInYsfProd = true; 
            YsfProdMembers++; 
        } 
        // Rank 1, déjà dans une SubDao
        else if (voters[msg.sender].isInYsfSpace && !(voters[msg.sender].isInYsfPark) || !(voters[msg.sender].isInYsfSpace) && voters[msg.sender].isInYsfPark) {
            require(voters[msg.sender].points >= 100, "You don't have enough points to enter this SUBDAO and upgrade rank");
            voters[msg.sender].rank = 2;
            voters[msg.sender].isInYsfProd = true; 
            YsfProdMembers++; 
        } 
        // Rank 2, déjà dans deux SubDAO 
        else if (voters[msg.sender].isInYsfSpace && voters[msg.sender].isInYsfPark) {
            require(voters[msg.sender].points >= 500, "You don't have enough points to enter this SUBDAO and upgrade rank");
            voters[msg.sender].rank = 3;
            voters[msg.sender].isInYsfProd = true; 
            YsfProdMembers++; 
        }
    }
    
    /// @notice Permet de rentrer dans la YSF SPACE SubDAO 
    function enterYsfSpace() external {
        require(voters[msg.sender].isInYsfSpace == false, "You are already in this SubDAO"); 
        // Rank 0, dans aucune SubDao
        if (!(voters[msg.sender].isInYsfProd) && !(voters[msg.sender].isInYsfPark)) {
            voters[msg.sender].rank = 1;
            voters[msg.sender].isInYsfSpace = true; 
            YsfSpaceMembers++; 
        } 
        // Rank 1, déjà dans une SubDao
        else if (voters[msg.sender].isInYsfProd && !(voters[msg.sender].isInYsfPark) || !(voters[msg.sender].isInYsfProd) && voters[msg.sender].isInYsfPark) {
            require(voters[msg.sender].points >= 100, "You don't have enough points to enter this SUBDAO and upgrade rank");
            voters[msg.sender].rank = 2;
            voters[msg.sender].isInYsfSpace = true; 
            YsfSpaceMembers++; 
        } 
        // Rank 2, déjà dans deux SubDAO 
        else if (voters[msg.sender].isInYsfProd && voters[msg.sender].isInYsfPark) {
            require(voters[msg.sender].points >= 500, "You don't have enough points to enter this SUBDAO and upgrade rank");
            voters[msg.sender].rank = 3;
            voters[msg.sender].isInYsfSpace = true; 
            YsfSpaceMembers++; 
        }
    }
    
    /// @notice Permet de rentrer dans la YSF PARK SubDAO 
    function enterYsfPark() external {
        require(voters[msg.sender].isInYsfPark == false, "You are already in this SubDAO"); 
        // Rank 0, dans aucune SubDao
        if (!(voters[msg.sender].isInYsfProd) && !(voters[msg.sender].isInYsfProd)) {
            voters[msg.sender].rank = 1;
            voters[msg.sender].isInYsfPark = true; 
            YsfParkMembers++; 
        } 
        // Rank 1, déjà dans une SubDao
        else if (voters[msg.sender].isInYsfSpace && !(voters[msg.sender].isInYsfProd) || !(voters[msg.sender].isInYsfSpace) && voters[msg.sender].isInYsfProd) {
            require(voters[msg.sender].points >= 100, "You don't have enough points to enter this SUBDAO and upgrade rank");
            voters[msg.sender].rank = 2;
            voters[msg.sender].isInYsfPark = true; 
            YsfParkMembers++; 
        } 
        // Rank 2, déjà dans deux SubDAO 
        else if (voters[msg.sender].isInYsfSpace && voters[msg.sender].isInYsfProd) {
            require(voters[msg.sender].points >= 500, "You don't have enough points to enter this SUBDAO and upgrade rank");
            voters[msg.sender].rank = 3;
            voters[msg.sender].isInYsfPark = true; 
            YsfParkMembers++; 
        }
    }

    //::::::::::::/ GETTERS /:::::::::::://

    // -------- Token Info -------- // 

    /// @notice Permet d'obtenir la balance de YSF Token d'un compte ethereum
    /// @param _account Compte ethereum à tester
    /// @return uint la balance du compte ethereum en paramètre
    function getTokenBalance(address _account) public view returns (uint256) {
        return ERC20(TOKENCONTRACT).balanceOf(_account);
    }

    /// @notice Permet d'obtenir la balance de YSF Token du smart contract
    /// @dev La balance est censé correspondre au minimum au nombre de votes reçus sur le contrat
    /// @return uint la balance en YSF Token du contrat
    function getContractTokenBalance() public view returns  (uint256) {
        return ERC20(TOKENCONTRACT).balanceOf(address(this));
    }

    // -------- Proposal Info -------- //

    /// @notice Permet d'obtenir toutes les proposals enregistrées
    /// @return Proposal Tableau de l'ensembles de proposals enregistrées
    function getAllProposals() external view returns (Proposal[] memory) {
        return ProposalArray; 
    }

    /// @notice Permet d'obtenir une proposition
    /// @param _id Index de la proposition à recevoir 
    /// @return Proposal proposition précisée en index
    function getProposalById(uint _id) external view returns (Proposal memory) {
        return ProposalArray[_id];
    }

    
    /// @notice Permet d'obtenir le temps écoulé depuis la soumission d'une proposition
    /// @param _id Index de la proposition à tester
    /// @return uint temps en unix écoulé depuis la soumission de la proposition précisée en paramètre
    function getTimeSinceProposal(uint _id) public view returns (uint) {
        return block.timestamp - ProposalArray[_id].dateOfSubmission; 
    }

    // -------- Member Info -------- // 

    /// @notice Permet d'obtenir le rank d'un membre de la DAO
    /// @dev Les ranks vont de 0 à 4
    /// @param _member Compte ethereum à tester
    /// @return uint Rank au sein de la DAO du membre précisé en paramètre
    function getMemberRank (address _member) external view returns (uint) {
        return voters[_member].rank;  
    }

    /// @notice Permet le nombre de points d'un membre
    /// @param _member Compte ethereum à tester
    /// @return uint Nombre de points au sein de la DAO du membre précisé en paramètre
    function getMemberPoints (address _member) external view returns (uint) {
        return voters[_member].points;  
    }

    /// @notice Permet le nombre de savoir si un membre a voté pour une proposition
    /// @param _member Compte ethereum à tester
    /// @param _id Index de la proposition à tester
    /// @return bool Retourne un booléen correspond à si tel membre à précisé pour tel proposition
    function hasVotedForThisProposal(address _member, uint _id) public view returns (bool) {
        return voters[_member].hasVotedFor[_id];
    }

    /// @notice Permet le choix d'un membre pour une proposition
    /// @dev False de base, mais on être sur du résultat via le require
    /// @param _member Compte ethereum à tester
    /// @param _id Index de la proposition à tester
    /// @return bool Retourne un booléen correspond au choix que tel membre a fait pour telle proposition
    function voteChoiceForThisProposal(address _member, uint _id) public view returns (bool) {
        require(hasVotedForThisProposal(_member, _id) == true, "Member didn't vote for this proposal"); 
        return voters[_member].resultForVote[_id]; 
    }

    /// @notice Permet de savoir si un membre se trouve dans la YSF DAO 
    /// @param _member Compte ethereum à tester
    /// @return bool Retourne un booléen correspond, true si il est dans la YSF DAO, false si il ne l'est pas
    function isInYsfDao(address _member) external view returns (bool) {
        return voters[_member].isInYsfDao; 
    }

    /// @notice Permet de savoir si un membre se trouve dans la YSF PROD SubDAO 
    /// @param _member Compte ethereum à tester
    /// @return bool Retourne un booléen correspond, true si il est dans la YSF PROD SUBDAO, false si il ne l'est pas
    function isInYsfProd(address _member) external view returns (bool) {
        return voters[_member].isInYsfProd; 
    }

    /// @notice Permet de savoir si un membre se trouve dans la YSF PROD SubDAO 
    /// @param _member Compte ethereum à tester
    /// @return bool Retourne un booléen correspond, true si il est dans la YSF SPACE SUBDAO, false si il ne l'est pas
    function isInYsfSpace(address _member) external view returns (bool) {
        return voters[_member].isInYsfSpace; 
    }

    /// @notice Permet de savoir si un membre se trouve dans la YSF PROD SubDAO 
    /// @param _member Compte ethereum à tester
    /// @return bool Retourne un booléen correspond, true si il est dans la YSF PARK SUBDAO, false si il ne l'est pas
    function isInYsfPark(address _member) external view returns (bool) {
        return voters[_member].isInYsfPark; 
    }

    // -------- Dao Info -------- // 

    /// @notice Permet de savoir le nombre de membres dans une DAO | SUBDAO 
    /// @param _daoIndex Compte ethereum à tester
    /// @return member Retourne le total des membres de la DAO indiquée en paramètre 
    function getDaoMembersAmount(uint _daoIndex) public view returns (uint member) {
        require( _daoIndex == 0 || _daoIndex == 1 || _daoIndex == 2 || _daoIndex == 3 || _daoIndex == 4, "Propose in a DAO/SubDao that exists");
        if (_daoIndex == 1 ) {
            return YsfDaoMembers;
        } else if (_daoIndex == 2) {
            return YsfProdMembers;
        } else if (_daoIndex == 3) {
            return YsfSpaceMembers;
        } else if (_daoIndex == 4) {
            return YsfParkMembers;
        } else if (_daoIndex == 0) {
            return YsfDaoMembers + YsfProdMembers + YsfParkMembers + YsfSpaceMembers;
        } 
    }
}
