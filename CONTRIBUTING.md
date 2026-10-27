# Contributing

## Local setup

Use Node.js 22.x and npm.

    npm ci
    npm run dev

## Quality checks

Before submitting changes, run:

    npm run validate
    npm run typecheck
    npm run lint
    npm run build

## Guidelines

- Keep changes focused and document important behaviour.
- Confirm restaurant prices, hours, contact details, and location information with the owner before changing them.
- Include desktop and mobile screenshots for significant visual changes.
- Never commit credentials, environment files, local databases, private uploads, or customer/order data.
- Explain what changed and which checks you ran in each pull request.
