# Authelia Authentication Proof of Concept

This project demonstrates how to implement Authelia as an authentication provider for web applications. It includes a Next.js frontend and a fully configured Authelia authentication server running in Docker containers with Traefik as a reverse proxy.

## System Overview

This POC consists of the following components:

- **Authelia**: Authentication server that provides Single Sign-On (SSO) and 2FA
- **Traefik**: Reverse proxy that handles routing and integrates with Authelia
- **Next.js App**: Demo application that consumes authentication information
- **Demo Services**: Simple "whoami" containers (public and secure) to test authentication

## Setup Instructions

### 1. Configure Host Files

For this demo to work properly, you need to add domain entries to your hosts file. This maps the domains to your local IP (127.0.0.1).

**Edit your `/etc/hosts` file:**

```bash
sudo nano /etc/hosts
```

**Add the following lines:**

```
127.0.0.1       localhost.test
127.0.0.1       authelia.localhost.test
127.0.0.1       secure.localhost.test
127.0.0.1       public.localhost.test
127.0.0.1       traefik.localhost.test
```

**After saving, flush your DNS cache:**

```bash
# On macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# On Linux
sudo systemd-resolve --flush-caches

# On Windows (run in administrator PowerShell)
ipconfig /flushdns
```

### 2. Start the Services

```bash
docker-compose up -d
```

### 3. Access the Services

- **Authelia Dashboard**: https://authelia.localhost.test
- **Protected Service**: https://secure.localhost.test
- **Public Service**: https://public.localhost.test
- **Traefik Dashboard**: https://traefik.localhost.test

**Login Credentials:**
- Username: `user1`
- Password: `password`

**Note:** You will receive SSL certificate warnings because this demo uses self-signed certificates. This is expected and can be safely bypassed for testing.

## How Authelia Works

### Authentication Flow

1. **Request Interception**: 
   - When a user tries to access a protected resource (like `secure.localhost.test`), Traefik forwards the request to Authelia first using the Forward Authentication middleware.

2. **Authentication Check**:
   - Authelia checks if the user is already authenticated by looking for a valid session cookie.
   - If no valid session exists, the user is redirected to the login page.

3. **Login Process**:
   - User provides credentials on the Authelia login page.
   - Authelia validates credentials against its user database.
   - On successful login, Authelia sets a session cookie and redirects back to the original URL.

4. **Access Control**:
   - Traefik checks with Authelia again, this time with the session cookie.
   - Authelia verifies the session and returns authentication headers to Traefik.
   - Traefik forwards these headers to the backend service, allowing the service to identify the user.

### Key Components in this Setup

#### 1. Traefik Configuration

- **Middleware**: Traefik is configured with the Authelia Forward Authentication middleware.
- **Labels**: Docker services are labeled to specify which routes should be protected.
- **TLS**: SSL certificates are provided for secure connections.

#### 2. Authelia Configuration

- **User Database**: Stored in `./authelia/users_database.yml` with hashed passwords.
- **Session Management**: Controls cookie settings, expiration times.
- **Access Control**: Defines security policies for different domains/paths.

#### 3. Next.js Application

- Accesses user information from authentication headers passed by Traefik.
- Displays login/logout links and user details.

## Troubleshooting

### Common Issues

1. **Domain Resolution Problems**:
   - Verify your hosts file has the correct entries
   - Flush your DNS cache after making changes

2. **Certificate Warnings**:
   - These are expected with self-signed certificates
   - Click "Advanced" and "Proceed" in your browser

3. **Login Issues**:
   - Check the credentials in `./authelia/users_database.yml`
   - Ensure Authelia container is running properly

4. **Cookie Problems**:
   - Clear browser cookies and cache if experiencing login loops
   - Ensure the session domain in Authelia configuration matches your domain setup

### Viewing Logs

```bash
# View Authelia logs
docker-compose logs authelia

# View Traefik logs
docker-compose logs traefik
```

## Further Customization

- Edit `./authelia/configuration.yml` to modify authentication settings
- Edit `docker-compose.yml` to change service configurations
- Modify `app/page.tsx` to customize the frontend application

## Security Considerations

This is a demonstration setup and includes several configurations that would need to be modified for production use:

- Replace self-signed certificates with proper SSL certificates
- Use more secure password hashing settings
- Implement proper secret management
- Configure more granular access control rules
