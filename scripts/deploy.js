const {ethers} = require('hardhat')
const fs = require('fs')
const path = require('path')

const main = async () => {
    if (network.name === "hardhat") {
        console.warn(
          "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    const [deployer] = await ethers.getSigners()
    const deployerAddress = await deployer.getAddress()

    console.log(`Deploying with ${deployerAddress}`)

    const dutchAuction = await ethers.getContractFactory('DutchAuction', deployer)
    const auction = await dutchAuction.deploy(
        ethers.utils.parseEther('2.0'),
        1,
        'Car'
    )
    await auction.deployed()

    save({
        DutchAuction: auction
    })
}

const save = (contracts) => {
    const contractsDir = path.join(__dirname, './..', 'frontend/contracts')

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true })
    }

    Object.entries(contracts).forEach(([name, contract]) => {
        if (contract) {
            fs.writeFileSync(
                path.join(contractsDir, '/', `${name}-contract-address.json`),
                JSON.stringify({[name]: contract.address}, undefined, 2)
            )
        }

        const ContractArtifact = hre.artifacts.readArtifactSync(name)

        fs.writeFileSync(
            path.join(contractsDir, '/', name + ".json"),
            JSON.stringify(ContractArtifact, null, 2)
        )
    })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


