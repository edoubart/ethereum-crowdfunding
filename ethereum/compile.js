const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

// 1. Delete entire 'build' folder.
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// 2. Read 'Campaign.sol' from the 'contracts' folder.
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
// 3. Compile both contracts ('Campaign' & 'CampaignFactory') with solidity compiler.
const output = solc.compile(source, 1).contracts;

// 4. Write output to the 'build' directory.
fs.ensureDirSync(buildPath);
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
