# Odyssey - Project Memory

## Documentation Structure
Comprehensive project documentation is organized in the `/docs` directory:

- **[overview.md](docs/overview.md)** - Project description, implementation status, and architecture
- **[testing.md](docs/testing.md)** - Complete testing strategy including Playwright configurations
- **[structure.md](docs/structure.md)** - Codebase organization and directory layout
- **[development.md](docs/development.md)** - Development commands and workflows
- **[deployment.md](docs/deployment.md)** - Cloud deployment configuration

## Quick Reference

### Current Status
- ✅ **Iteration 1 Complete**: Angular-to-C# API communication with GCP deployment
- ✅ **Testing Suite**: Comprehensive integration and E2E tests with explicit configuration naming
- ✅ **Docker Fixed**: Multi-stage build with proper package references

### Key Commands
- **Development**: `dotnet run` (API), `npm start` (Web)
- **Testing**: `npm run test:api:local`, `npm run test:web:branch`, etc.
- **Docker**: `docker build -t api -f apps/api/Dockerfile .`

### Testing Architecture
New explicit Playwright configuration system:
- **API-only configs**: `playwright.config.api.{local|production.branch|production.main}.ts`
- **Full web+API configs**: `playwright.config.web.{local|production.branch|production.main}.ts`
- Solves branch deployment failures by separating test concerns

# important-instruction-reminders
- Do what has been asked; nothing more, nothing less. 
- NEVER create files unless they're absolutely necessary for achieving your goal. Aim to keep files <120 lines for clarity - if above, it probably is necessary to split the file into siblings by default (it will be stated explicitly if children subdir)
- ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.