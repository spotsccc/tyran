# About "Tyran" Project

"Tyran" is a Minimum Viable Product (MVP) of an NFT marketplace.

**Main Features:**

1. Mint NFT
2. List NFTs on the marketplace
3. Purchase NFTs from the marketplace
4. View NFTs that you own

# Stack

**Repository:**

- [Turborepo](https://github.com/concordsd/turborepo)
- [pnpm workspaces](https://pnpm.io/workspaces)

**Backend:**

- [NestJS](https://nestjs.com/)
- [Fastify](https://www.fastify.io/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Postgres](https://www.postgresql.org/)

**Frontend:**

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [ethers](https://docs.ethers.io/v5/)
- [effector](https://effector.dev/)

**Blockchain:**

- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/)

# Quickstart

To run the project locally, make sure you have Docker installed and run the following command:

```bash
docker-compose -f docker-compose.dev.yml up
```

After that, deploy the smart contract in your local Hardhat environment using the following command:

```bash
pnpm run smartcontract:deploy
```

You can access the main page of the site at http://localhost:4000. To use the main features, you should install the Metamask extension and add the Hardhat network. You can do this by following these instructions:

1. Install [Metamask](https://metamask.io/download/).
2. Add the Hardhat network to [Metamask](https://docs.metamask.io/wallet/how-to/get-started-building/run-devnet/).

# Code Roadmap

In the "apps" directory, you will find three services:

1. `client`: Web client.
2. `server`: Main server that stores data about NFTs and provides main features to work with NFTs.
3. `artifacts-synchronizer`: A service that listens to the blockchain network and sends events to the server via RabbitMQ from the smart contract.

In the "packages" directory, there are two packages:

1. `contracts`: A package with all smart contracts, their types, and tests.
2. `api-contracts`: A package with API contracts used by the server and client.

# Deep Dive into Architecture:

## Web

The web client uses the Feature Slice Design architecture. For more information, refer to the [official documentation](https://feature-sliced.design/).

## Server

The server follows a Three-Layer Architecture. This architecture is chosen based on the project's size and includes three layers:

1. **Application Layer**: Contains only business logic and should not depend on any other layer.

2. **Infrastructure Layer**: Represents all integration with the external world, such as the database, other services, etc.

3. **Presentation Layer**: Serves as the entry point to the application.
