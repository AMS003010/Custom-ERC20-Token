const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [];
    const genBlockData = this.merkleRoot(['This is the genesis block']);
    this.chain.push({
      index: 1,
      'merkle root': genBlockData,
      timestamp: new Date().toString(),
      data: 'This is the genesis block',
      proof: 1,
      'previous hash': 0,
    });
  }

  createBlock(blockData) {
    const proof = this.proofOfWork(blockData);
    const prevBlock = this.previousBlock();
    const merkleRoot = this.merkleRoot(blockData);
    const previousHash = this.blockHash(prevBlock);
    const block = {
      index: this.chain.length + 1,
      'merkle root': merkleRoot,
      timestamp: new Date().toString(),
      data: blockData,
      proof,
      'previous hash': previousHash,
    };
    this.chain.push(block);
    return block;
  }

  mineBlock(data) {
    const proof = this.proofOfWork(data);
    const newBlock = this.createBlock(data);
    return newBlock;
  }

  blockHash(block) {
    const encodedBlock = JSON.stringify(block, Object.keys(block).sort());
    return crypto.createHash('sha256').update(encodedBlock).digest('hex');
  }

  proofOfWork(data) {
    let newProof = 1;
    let chainValid = false;
    const index = this.chain.length + 1;

    while (!chainValid) {
      const prevBlockProof = this.previousBlock().proof;
      const encodedData = crypto
        .createHash('sha256')
        .update(this.hashOperation(index, data, prevBlockProof, newProof))
        .digest('hex');
      if (encodedData.slice(0, 4) === '0000') {
        chainValid = true;
      } else {
        newProof += 1;
      }
    }

    return newProof;
  }

  previousBlock() {
    return this.chain[this.chain.length - 1];
  }

  hashOperation(index, data, previousProof, newProof) {
    const hashOp = `${Math.pow(newProof, 2) - Math.pow(previousProof, 2) + index}${data}`;
    return hashOp;
  }

  isChainValid() {
    let blockIndex = 1;
    while (blockIndex < this.chain.length) {
      const currentBlock = this.chain[blockIndex];
      const previousBlock = this.chain[blockIndex - 1];
      const previousProof = previousBlock.proof;
      const { data: currentData, proof: currentProof, index: currentIndex } = currentBlock;
      const encodedData = crypto
        .createHash('sha256')
        .update(this.hashOperation(currentIndex, currentData, previousProof, currentProof))
        .digest('hex');
      if (currentBlock['previous hash'] !== this.blockHash(previousBlock)) {
        return false;
      }
      if (encodedData.slice(0, 4) !== '0000') {
        return false;
      }
      blockIndex += 1;
    }
    return true;
  }

  merkleRoot(l) {
    let l1 = l.map((i) => crypto.createHash('sha256').update(i.toString()).digest('hex'));
    if (l1.length % 2 !== 0) {
      l1.push(l1[l1.length - 1]);
    }
    let state = true;
}}