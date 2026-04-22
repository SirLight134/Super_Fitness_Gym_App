# 🏋️ Super Fitness API

A robust NestJS REST API for managing fitness-related operations, built with modern technologies and best practices.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Features](#features)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🚀 Tech Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - ORM for database operations
- **Swagger/OpenAPI** - API documentation
- **TypeScript** - Typed JavaScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn** or **pnpm**
- **Docker** and **Docker Compose** (for containerized database)
- **PostgreSQL** (optional, if running locally without Docker)
- **Git**

## ✨ Features

- ✅ RESTful API design
- ✅ PostgreSQL database integration with TypeORM
- ✅ Swagger API documentation
- ✅ Environment configuration
- ✅ Error handling & validation
- ✅ Modular architecture
- ✅ Database migrations support

## 🛠 Installation

### 1. Clone the repository

```bash
git clone https://github.com/elevate-backend-c2/super-fitness-api-team-c.git
cd super-fitness-api-team-c
```
### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🔧 Environment Setup
### 1. Create environment file
Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure environment variables
Edit the .env file and update the following variables:

env
# App
APP_NAME=super-fitness-api
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration (for local development with Docker)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=fitness_db
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=604800 # 7 days in seconds

# API
API_PREFIX=api
API_VERSION=v1

# Cors
CORS_ORIGIN=*  # change this in production

## 🗄 Database Setup
 Setup Using Docker (Recommended)
 Start PostgreSQL container:

```bash
# Start the database container
npm run docker:up

# Verify the container is running
npm run docker:ps

# Close the database container
npm run docker:down
```

### Run Database Migrations
```bash
# Generate a new migration (after creating entities)
npm run migration:generate -- src/database/migrations/migration_name

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## 🏃 Running the Application
Development Mode (with hot reload)
```bash
npm run start:dev
```
Production Mode
```bash
# Build the application
npm run build

# Start in production
npm run start:prod
```

### The application will be available at: http://localhost:3000

## 📚 API Documentation
Once the application is running, you can access the Swagger documentation:

- Swagger UI: http://localhost:3000/api

- Swagger JSON: http://localhost:3000/api-docs

## Authentication Service

 * JWT Auth Guard with @Public() decorator support
 * This guard checks if a route is marked with @Public()
 * All routes are private by default 
 * Use this to mark routes that should bypass authentication

   
   ### Usage:-
 ```typescript
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }
  ```
- Current Decorator:-
 * @Current()
 * Extracts the authenticated user from the request
 * 
      ### Usage:-
 ```typescript
   @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
  ```


📁 Project Structure
text
super-fitness-api-team-c/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── users/        # User module
│   │   ├── workouts/     # Workout module
│   │   └── exercises/    # Exercise module
│   ├── common/           # Shared utilities
│   │   ├── decorators/   # Custom decorators
│   │   ├── filters/      # Exception filters
│   │   ├── guards/       # Authentication guards
│   │   ├── interceptors/ # Request interceptors
│   │   └── pipes/        # Validation pipes
│   ├── config/           # Configuration files
│   ├── database/         # Database entities and migrations
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore rules
├── docker-compose.yml   # Docker configuration
├── nest-cli.json        # NestJS CLI config
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md            # Documentation


🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

## 📄 License
This project is MIT licensed.

## 📞 Support
For issues, questions, or contributions:

Create an issue

Contact the development team

## 🚀 Quick Start (TL;DR)
```bash
# 1. Clone and install
git clone https://github.com/elevate-backend-c2/super-fitness-api-team-c.git
cd super-fitness-api-team-c
npm install

# 2. Setup database
docker-compose up -d

# 3. Create database
docker exec -it super-fitness-postgres psql -U postgres -c "CREATE DATABASE super_fitness_db;"

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Run the app
npm run start:dev

# 6. Visit http://localhost:3000/api for documentation
```
## Happy Coding! 💪
