# Aromi Backend

Aromi Backend is the foundation of the Aromi platform. It is a Yarn-based monorepo that powers the GraphQL API, background processing, shared domain logic, and infrastructure configuration.

## Repository Structure

The monorepo contains four primary packages:

- **infra**  
  Infrastructure-as-code definitions for cloud resources, networking, and deployment primitives.

- **server**  
  The core GraphQL API and application server responsible for request handling, authentication, and business logic orchestration.

- **shared**  
  Shared domain models, utilities, validation schemas, and types consumed by all backend packages.

- **workers**  
  Background workers for asynchronous jobs, queue processing, scheduled tasks, and long-running operations.

## Tech Stack

- Package Manager: Yarn (workspaces)
- Runtime: Node.js v20 or higher
- API: GraphQL
- Infrastructure: AWS
- CI/CD: GitHub Actions

## Getting Started

### Prerequisites

- Node.js v20 or higher
- Yarn v1.22.22 or higher

### Installation

Clone the repository

```bash
git clone https://github.com/LarsSeverson/aromi-backend.git
cd aromi-backend
```

Install dependencies

```bash
yarn install
```

### Environment Configuration

Each package may require its own environment variables. Refer to the `.env.example` files within each package and create the appropriate `.env` files before running services locally.

## Monorepo Conventions

- Shared code must live in the `shared` package
- Cross-package imports must use workspace boundaries
- Business logic must not be duplicated across packages
- Infrastructure changes must be isolated to the `infra` package

## Contributing

Contributions are welcome.

All contributions must follow the existing ESLint configuration and linting rules without exception. Pull requests that introduce linting violations, inconsistent formatting, or architectural drift will be rejected.

Fork the repository and create a feature branch from the default branch. Commits must be small, atomic, and clearly described. Squash or rewrite commits before submission if necessary.

Every pull request must include a clear description of the change, justification for the approach, and references to related issues when applicable. Changes to shared code or infrastructure require additional review and approval.

By contributing, you agree that your work will be licensed under the project’s MIT License.

## License

This project is open source and available under the MIT License.
