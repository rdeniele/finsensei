# Security Configuration Guide

## Environment Variables

Add these security-related environment variables to your `.env.local` file:

```bash
# Security Configuration
CSRF_SECRET=your-super-secure-csrf-secret-key-here
JWT_SECRET=your-jwt-secret-key-here
ADMIN_EMAILS=work.rparagoso@gmail.com,admin@finsensei.com

# Rate Limiting Configuration
RATE_LIMIT_AUTH_MAX_REQUESTS=5
RATE_LIMIT_AUTH_WINDOW_MS=900000
RATE_LIMIT_API_MAX_REQUESTS=100
RATE_LIMIT_API_WINDOW_MS=60000
RATE_LIMIT_SIGNUP_MAX_REQUESTS=3
RATE_LIMIT_SIGNUP_WINDOW_MS=3600000

# Security Headers
NEXT_PUBLIC_APP_URL=https://finsensei.com
```

## Security Features Implemented

### 1. Enhanced Security Headers
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **Content-Security-Policy**: Prevents XSS attacks
- **X-XSS-Protection**: Additional XSS protection
- **Strict-Transport-Security**: Enforces HTTPS

### 2. Input Validation and Sanitization
- **Zod Schema Validation**: Type-safe input validation
- **HTML Sanitization**: Removes potentially malicious HTML
- **SQL Injection Protection**: Basic SQL injection prevention
- **Email Validation**: Proper email format validation
- **Password Strength Requirements**: Enforces strong passwords

### 3. Rate Limiting
- **Authentication Endpoints**: 5 requests per 15 minutes
- **API Endpoints**: 100 requests per minute
- **Signup Endpoints**: 3 requests per hour
- **Chat Endpoints**: 10 requests per minute

### 4. CSRF Protection
- **Token Generation**: Secure random tokens with timestamps
- **Token Validation**: HMAC-based signature verification
- **Token Expiration**: 24-hour token lifetime

### 5. Enhanced Authentication
- **Session Management**: Secure session handling
- **Admin Access Control**: Environment-based admin configuration
- **Route Protection**: Middleware-based route security

## Security Best Practices

### 1. Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### 2. Input Validation
- All user inputs are validated using Zod schemas
- HTML and SQL injection prevention
- Length limits on all text inputs
- Character restrictions on names and identifiers

### 3. API Security
- Rate limiting on all API endpoints
- Content-Type validation for POST/PUT requests
- User-Agent header validation
- Request body sanitization

### 4. Database Security
- Row Level Security (RLS) enabled
- Parameterized queries only
- User-specific data access controls
- Admin-only access to sensitive operations

## Monitoring and Logging

### 1. Error Logging
- All errors are logged with appropriate detail
- No sensitive information in error messages
- Structured error logging for analysis

### 2. Security Events
- Failed login attempts
- Rate limit violations
- Admin access attempts
- Unusual API usage patterns

## Deployment Security

### 1. Environment Configuration
- All secrets stored in environment variables
- No hardcoded credentials
- Separate configurations for development/production

### 2. HTTPS Enforcement
- HSTS headers configured
- Redirect all HTTP to HTTPS
- Secure cookie configuration

### 3. CORS Configuration
- Restrictive CORS policy
- Environment-specific origins
- Credential handling configured

## Regular Security Maintenance

### 1. Dependency Updates
- Regular npm audit checks
- Automated security updates
- Vulnerability monitoring

### 2. Security Audits
- Regular code security reviews
- Penetration testing
- Security best practices compliance

### 3. Monitoring
- Real-time security monitoring
- Alert system for suspicious activities
- Performance and security metrics

## Incident Response

### 1. Security Breach Response
- Immediate incident assessment
- User notification procedures
- Data breach reporting
- Recovery and remediation steps

### 2. Contact Information
- Security team contact details
- Bug bounty program information
- Responsible disclosure policy

## Additional Recommendations

### 1. Two-Factor Authentication
- Implement TOTP-based 2FA
- Backup codes for account recovery
- SMS-based 2FA as alternative

### 2. Advanced Security Features
- Web Application Firewall (WAF)
- DDoS protection
- Advanced threat detection
- Security information and event management (SIEM)

### 3. Compliance
- GDPR compliance measures
- Data privacy controls
- User consent management
- Data retention policies

## Security Checklist

- [ ] Environment variables configured
- [ ] Security headers enabled
- [ ] Rate limiting active
- [ ] Input validation implemented
- [ ] CSRF protection enabled
- [ ] HTTPS enforced
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented 