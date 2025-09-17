# Contributing to Forms & AI

First off, thank you for considering contributing to Forms & AI! It's people like you that make Forms & AI such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Describe why this enhancement would be useful**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** if applicable
5. **Ensure tests pass**: `npm test` (if available)
6. **Run linting**: `npm run lint`
7. **Update documentation** if needed
8. **Create a Pull Request**

## Development Setup

1. Fork and clone the repository

```bash
git clone https://github.com/your-username/forms-and-ai.git
cd forms-and-ai
```

2. Install dependencies

```bash
npm install
```

3. Copy environment variables

```bash
cp .env.example .env.local
```

4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type - be specific with types
- Export types/interfaces that are used across files

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Implement proper error boundaries

### Styling

- Use Tailwind CSS classes
- Follow the existing styling patterns
- Ensure responsive design
- Support both light and dark modes

### Code Style

- Use 2 spaces for indentation
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:

```
feat: Add form duplication feature
fix: Resolve form submission validation issue
docs: Update README with new API endpoints
style: Format code according to style guide
refactor: Simplify form state management
test: Add tests for form validation
chore: Update dependencies
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── forms/       # Form-related components
│   ├── dashboard/   # Dashboard components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions and services
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

## Testing

- Write tests for new features when applicable
- Ensure existing tests pass before submitting PR
- Test your changes in both development and production builds

## Documentation

- Update the README.md if you change functionality
- Add JSDoc comments to new functions/components
- Update API documentation for new endpoints
- Include examples for new features

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
