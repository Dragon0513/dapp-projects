// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;

contract C1 {
  function foo() virtual public pure returns(string memory) {
    return "C1 ==> foo()";
  }
}

contract C2 is C1 {}

contract C3 is C1 {
  function foo() override public pure returns(string memory) {
    return "C3 ==> foo()";
  }
}

contract C4 {
  function boo() virtual public pure returns(string memory) {
    return "C4 ==> boo()";
  }
}

contract C5 is C3, C4 {}

contract Base1 {
  function foo() virtual public {}
}

contract Base2 {
  function foo() virtual public {}
}

contract Inherited is Base1, Base2 {
  // Derives from multiple bases defining foo(), so we must explicitly
  // override it
  function foo() public override(Base1, Base2) {}
}

contract A1 { function f() virtual public pure{} }
contract B1 is A1 {}
contract D1 is A1 {}
// No explicit override required
contract E1 is B1, D1 {
  function f() override public pure{}
}

contract A2 {}
contract B2 is A2 { function f() virtual public pure{} }
contract D2 is A2 {}
// No explicit override required
contract E2 is B2, D2 {
  function f() override public pure{}
}

contract A3 {}
contract B3 is A3 { function f() virtual public pure{} }
contract D3 is A3 { function f() virtual public pure{} }
// No explicit override required
contract E3 is B3, D3 {
  function f() override(B3, D3) public pure{}
}

contract A4 {
  function f() external view virtual returns(uint) { return 5; }
}

contract B4 is A4 {
  uint public override f;
}

// asd

contract A5 {
  modifier foo() virtual { _; }
}

contract B5 is A5 {
  modifier foo() override { _; }
}

// asda

contract A6 {
  modifier foo() virtual { _; }
}

contract B6 {
  modifier foo() virtual { _; }
}

contract C6 is A6, B6 {
  modifier foo() override(A6, B6) { _; }
}

// asd

contract A7 {
  uint x;
  constructor(uint _x) { x = _x; }
}

// Either directly specify in the inheritance list...
contract B7 is A7(7) {
  constructor() {}
}

// or through a "modifier" of the derived constructor.
contract C7 is A7 {
  constructor(uint _y) A7(_y * _y) {}
}

// asd

// contract X {}
// contract A is X {}
// // This will not compile
// contract C8 is A, X {}

// asd

// abstract contract A9 {}

// contract B9 {
//   A9 a = new A9();
// }

// asd

interface Token {
  enum TokenType { Fungible, NonFungible }
  struct Coin { string obverse; string reverse; }
  function transfer(address recipient, uint amount) external;
}

// asd

interface ParentA {
  function test() external returns (uint256);
}

interface ParentB {
  function test() external returns (uint256);
}

interface SubInterface is ParentA, ParentB {
  // Must redefine test in order to assert that the parent
  // meanings are compatible.
  function test() external override(ParentA, ParentB) returns (uint256);
}

interface SubSubInterface is SubInterface {
  function test() external override returns (uint256);
}
