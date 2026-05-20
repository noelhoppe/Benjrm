FROM node:26-alpine as frontend
WORKDIR /app

COPY frontend /app/frontend

RUN --mount=type=cache,target=/app/frontend/node_modules \
    cd frontend; \
    npm install; \
    npm run build

FROM rust:1.95.0 AS build
WORKDIR /app

RUN apt update && apt install -y libssl-dev

COPY --from=frontend /app/frontend/dist /app/frontend/dist

RUN --mount=type=bind,source=backend/src,target=backend/src \
    --mount=type=bind,source=backend/build.rs,target=backend/build.rs \
    --mount=type=bind,source=backend/Cargo.toml,target=backend/Cargo.toml \
    --mount=type=bind,source=backend/Cargo.lock,target=backend/Cargo.lock \
    --mount=type=bind,source=backend/.cargo,target=backend/.cargo \
    --mount=type=bind,source=database-migrator,target=database-migrator \
    --mount=type=cache,target=/app/backend/target/ \
    --mount=type=cache,target=/usr/local/cargo/git/db \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    dpkgArch="$(dpkg --print-architecture)"; \
    case "${dpkgArch##*-}" in \
        i386) target="i686-unknown-linux-gnu";; \
        amd64) target="x86_64-unknown-linux-gnu";; \
        armhf) target="armv7-unknown-linux-gnueabihf";; \
        arm64) target="aarch64-unknown-linux-gnu";; \
        *) echo >&2 "unsupported architecture: ${dpkgArch}"; exit 1 ;; \
    esac; \
    rustup target add $target; \
    cd backend; \
    cargo build --release --target $target; \
    cp "./target/$target/release/benjrm" /bin/benjrm

# we have to use debian instead of alpine because we rely on openssl and openssl can cause segfaults on alpine.
# the requirement for openssl might be removed in the future.
FROM debian:12.13 as final
WORKDIR /config

RUN apt update && apt install -y openssl

COPY --from=build /bin/benjrm /bin/benjrm
    
EXPOSE 80
ENTRYPOINT ["/bin/benjrm"]
