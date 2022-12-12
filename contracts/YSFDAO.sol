// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YSFDAO is Ownable  {

    address public TOKENCONTRACT;

    constructor(address _TOKENCONTRACT) {
        TOKENCONTRACT = _TOKENCONTRACT;
    }

    Proposal[] public ProposalArray; 

    uint YsfDaoMembers; 
    uint YsfProdMembers; 
    uint YsfSpaceMembers; 
    uint YsfParkMembers; 


    struct Proposal {
        string title; 
        string desc; 
        string discussion;
        uint yesVoteCount; 
        uint noVoteCount;
        uint dateOfSubmission; 
        uint daoIndex; 
        bool isOpen; 
        bool hasWinned;
        address sender;  
    }
    
    struct Voter {
        uint points;  
        uint proposalSent; 
        uint rank; 
        mapping(uint => bool) hasVotedFor; 
        mapping(uint => bool) resultForVote; 
        bool isInYsfDao; 
        bool isInYsfProd; 
        bool isInYsfSpace; 
        bool isInYsfPark;           
    }
    
    //::::::::::::/ MAPPING /:::::::::::://

    mapping (address => Voter) voters;

    mapping (address => bool) inCoreTeam; 

    
    //::::::::::::/ ENUM - STATE /:::::::::::://

    enum Phases {phase1, phase2, phase3, phase4, phase5}
    Phases public phases; 
    uint8 phasesValue; 

    //::::::::::::/ EVENTS /:::::::::::://

    event proposalSubmitted(uint id, address sender , string title , string desc , string discussion, uint date, uint subDao);
    event voteSubmitted(uint id , address sender, bool yesOrNo );

    //::::::::::::/ FONCTIONS /:::::::::::://
    

    // -------- DEVELOPPEMENT - DEMONSTRATION -------- // 
    // /!\ FONCTION A BUT DE DEVELOPPEMENT - A RETIRER EN PRODUCTION/MAINNET /!\ //
    
    function setupCoreTeam(address _member) external onlyOwner {
        require(inCoreTeam[_member] == false); 
        inCoreTeam[_member] = true; 
    }

    // /!\ FONCTION A BUT DE DEVELOPPEMENT - A MODIFIER EN PRODUCTION/MAINNET /!\ // 
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

    // /!\ FONCTION A BUT DE DEVELOPPEMENT - A MODIFIER EN PRODUCTION/MAINNET /!\ // 
    function changePhase() external onlyOwner {
        if (phasesValue < 4) {
            phasesValue++; 
            phases = Phases(phasesValue);
        } else {
            revert(); 
        }
    }


    // -------- PROPOSITION -------- // 
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

        voters[msg.sender].proposalSent++;

        voters[msg.sender].points++; 

        emit proposalSubmitted ((ProposalArray.length - 1 ), msg.sender, _title, _desc, _discussion, block.timestamp, _daoIndex);
    }

    // -------- VOTE -------- // 
    function voteForProposal(uint _id, bool _voteDecision ) external {
        if (block.timestamp - (ProposalArray[_id].dateOfSubmission) > 30 days) {
            ProposalArray[_id].isOpen = false; 
            if(ProposalArray[_id].yesVoteCount > ProposalArray[_id].noVoteCount) {
                ProposalArray[_id].hasWinned = true; 
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

    function enterYsfDao() external {
        require(phases >= Phases.phase4, "It's not possible for the moment to enter in the YSF DAO " );
        require(voters[msg.sender].rank == 3 && voters[msg.sender].isInYsfProd && voters[msg.sender].isInYsfSpace && voters[msg.sender].isInYsfPark, "You don't have the rank required to pass this level");
        require(voters[msg.sender].points >= 1000, "You don't have enough points to enter this DAO and upgrade rank");

        voters[msg.sender].rank = 4;
        voters[msg.sender].isInYsfDao = true; 
    }
    
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

    function getTokenBalance(address _account) public view returns (uint256) {
        return ERC20(TOKENCONTRACT).balanceOf(_account);
    }

    function getContractTokenBalance() public view returns  (uint256) {
        return ERC20(TOKENCONTRACT).balanceOf(address(this));
    }

    // -------- Proposal Info -------- //

    function getAllProposals() external view returns (Proposal[] memory) {
        return ProposalArray; 
    }

    function getProposalById(uint _id) external view returns (Proposal memory) {
        return ProposalArray[_id];
    }

    function getTimeSinceProposal(uint _id) public view returns (uint) {
        return block.timestamp - ProposalArray[_id].dateOfSubmission; 
    }

    // -------- Member Info -------- // 

    function getMemberRank (address _member) external view returns (uint) {
        return voters[_member].rank;  
    }

    function getMemberPoints (address _member) external view returns (uint) {
        return voters[_member].points;  
    }

    function hasVotedForThisProposal(address _member, uint _id) public view returns (bool) {
        return voters[_member].hasVotedFor[_id];
    }

    function voteChoiceForThisProposal(address _member, uint _id) public view returns (bool) {
        require(hasVotedForThisProposal(_member, _id) == true, "Member didn't vote for this proposal"); 
        return voters[_member].resultForVote[_id]; 
    }

    function isInYsfDao(address _member) external view returns (bool) {
        return voters[_member].isInYsfDao; 
    }

    function isInYsfProd(address _member) external view returns (bool) {
        return voters[_member].isInYsfProd; 
    }

    function isInYsfSpace(address _member) external view returns (bool) {
        return voters[_member].isInYsfSpace; 
    }

    function isInYsfPark(address _member) external view returns (bool) {
        return voters[_member].isInYsfPark; 
    }

    // -------- Dao Info -------- // 

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


