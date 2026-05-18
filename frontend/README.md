# Benjrm's Frontend

## Used Dependencies:

1. React + TypeScript
2. React Router
3. Tanstack Query
4. Tailwind CSS
5. shadcn/ui

## NPM Scripts:

Starting the development server with HMR (Hot Module Replacement):

```shell
npm run dev
```

Linting the codebase to find and fix issues:

```shell
npm run lint
```

Building the application for production:

```shell
npm run build
```

Previewing the production build locally:

```shell
npm run preview
```

## Docker (Development):

Build Docker dev-image from root folder:

```shell
docker build -t benjrm-frontend-dev -f frontend/Dockerfile.dev frontend
```

On Linux hosts, the development image can be built with the local user UID/GID so bind-mounted files stay writable inside the container:

```shell
UID=$(id -u) GID=$(id -g) docker compose -f compose.dev.yaml up --build
```

Run Dev-Container:

```shell
docker run --rm -p 5173:5173 benjrm-frontend-dev
```
