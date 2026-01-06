# SPF Checker

A React-based SPF checker that allows users to validate domains, fetch SPF records, expand include, and persist results across page reloads.

## Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

## Install dependencies

```bash
npm install

```

## Start the development

```bash
npm run dev


```

## Assumptions & Limitations

### Assumptions

-The application relies on Google Public DNS over HTTPS
-Only SPF starts with v=spf1 are considered .

### Limitations

-DNS results depend on Google DNS availability.

-No backend all logic runs on the client side.
