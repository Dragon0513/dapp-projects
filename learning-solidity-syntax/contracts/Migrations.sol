// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

pragma abicoder v2;

contract Migrations {
  // address public owner = msg.sender;
  // uint public last_completed_migration;
  // enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
  // ActionChoices choice;
  // ActionChoices constant defaultChoice = ActionChoices.GoStraight;

  // function setGoStraight() public {
  //     choice = ActionChoices.GoStraight;
  // }

  // // Since enum types are not part of the ABI, the signature of "getChoice"
  // }
  // // will automatically be changed to "getChoice() returns (uint8)"
  // // for all matters external to Solidity.
  // function getChoice() public view returns (ActionChoices) {
  //     return choice;

  // function getDefaultChoice() public pure returns (uint) {
  //     return uint(defaultChoice);
  // }

  // modifier restricted() {
  //   require(
  //     msg.sender == owner,
  //     "This function is restricted to the contract's owner"
  //   );
  //   _;
  // }

  // function setCompleted(uint completed) public restricted {
  //   last_completed_migration = completed;
  // }

  // function calc() external returns(uint) {
  //   this.uintMinMax{ value: 10 }([1, 2, 3]);
  //   return (2 + 3);
  // }

  // function uintMinMax(uint8[3] calldata arg) public payable returns(uint16[2] memory) {
  //   uint8 a = 154;
  //   uint16 b = 1;
  //   uint8[3] calldata f = arg;
  //   // f[0] = 1;
  //   fixed8x4 c;
  //   c = fixed8x4(2.4000);
  //   address payable x = payable(this);
  //   address y = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;
  //   string memory z = "Sharjeel" "Safdar";
  //   // a = c;
  //   // uint24 c;
  //   // uint d; // uint is an alias of uint256
  //   a >> b;
  //   return [type(uint16).min, type(uint16).max];
  // }

  // function j(function() external returns(uint16[2] memory) k) public view {

  // }

  // receive() external payable {}

  // function p(uint l) public pure {
  //   uint[] memory a = new uint[](l);
  //   bytes memory b = new bytes(l);

  //   assert(a.length == b.length);
  //   a[6] = 8;
  // }

  // uint[2**20] m_aLotOfIntegers;
  // bool[2][] m_pairsOfFlags;

  // function setAllFlagPairs(bool[2][] memory newPairs) public {
  //   // assignment to a storage array performs a copy of ``newPairs`` and
  //   // replaces the complete array ``m_pairsOfFlags``.
  //   m_pairsOfFlags = newPairs;
  // }

  // function clear() public {
  //   // these clear the arrays completely
  //   delete m_pairsOfFlags;
  //   delete m_aLotOfIntegers;
  //   // identical effect here
  //   m_pairsOfFlags = new bool[2][](0);
  // }

  // bytes m_byteData;

  // function byteArrays(bytes memory data) public {
  //   // byte arrays ("bytes") are different as they are stored without padding,
  //   // but can be treated identical to "uint8[]"
  //   m_byteData = data;
  //   for (uint i = 0; i < 7; i++)
  //       m_byteData.push();
  //   m_byteData[3] = 0x08;
  //   delete m_byteData[2];
  // }

  function direct() public view returns(address sender) {
    sender = msg.sender;
  }

  function indirect()
    public
    view
    returns(address sender, address ca)
    {
    sender = this.direct{ gas: 10000 }();
    ca = this.contractAddress();
  }

  function contractAddress() public view returns(address ca) {
    ca = address(this);
  }

  function min() public pure returns(int8 minLimit) {
    minLimit = type(int8).min;
  }

  function contractName() public pure returns(string memory name) {
    name = type(Migrations).name;
  }

  function swap(uint x, uint y) public pure returns(uint, uint) {
    (uint _x, uint _y) = (y, x);
    // uint8 z = 2**8 - 1;
    // z += 1;
    return (_x, _y);
  }

  function scope() public pure {
    int x;
    x;
    unchecked {
      int _x;
      _x;
    }
  }

  function r(int[10][3] memory arg) external pure returns(int[10] memory) {
    return arg[1];
  }
}

// contract A {
//   function f(B _in) internal pure returns (B out) {
//     out = _in;
//   }

//   function f(address _in) private pure returns (address out) {
//     out = _in;
//   }
// }

contract A {
  function f(uint8 _in) public pure returns (uint8 out) {
    out = _in;
  }

  function f(uint256 _in) public pure returns (uint256 out) {
    out = _in;
  }
}

contract B {
}