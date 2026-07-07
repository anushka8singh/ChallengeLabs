<div align="center">

# 🚀 ChallengeLabs

### Learn by Doing. Validate by Building.

**A container-based hands-on learning platform with isolated lab environments, automated multi-strategy task validation, instant feedback, progress tracking, and learning analytics.**

<br />

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Full_Stack-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Lab_Environments-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis&logoColor=white)

</div>

---

## 📌 Overview

**ChallengeLabs** is an interactive technical learning platform designed around one principle:

> **The best way to learn technical skills is by actually performing them.**

Instead of relying only on tutorials, videos, or quizzes, ChallengeLabs gives learners access to isolated Docker-based lab environments where they can execute commands, create files and directories, configure permissions, complete practical tasks, and receive immediate automated feedback.

Each challenge runs inside its own containerized environment. Learners complete structured tasks through an interactive terminal, while the platform automatically validates the actual state of the running container.

The platform combines:

- 🐳 Isolated Docker-based lab environments
- 💻 Interactive browser-based technical workspaces
- 🧩 Structured challenge and task management
- ⚙️ Automated multi-strategy validation
- 💬 Specific success and failure feedback
- 📈 Task and challenge progress tracking
- 📊 Event-based learning analytics
- 👨‍💼 Admin challenge management
- 🔐 Authentication and role-based authorization

---

## ✨ Key Features

### 🐳 Container-Based Lab Environments

Every challenge runs inside an isolated Docker container.

The platform manages:

- Challenge-specific Docker images
- Container creation
- Environment initialization
- Challenge setup scripts
- Session lifecycle
- Session expiration
- Container association
- Environment isolation

This gives every learner a consistent hands-on environment without affecting the host system.

---

### 💻 Interactive Lab Workspace

Learners work directly inside a live technical environment.

The lab workspace allows users to:

- Execute Linux commands
- Create and modify files
- Work with directories
- Configure file permissions
- Complete challenge tasks
- Access task hints
- Validate solutions instantly

The goal is to create a practical learning experience where progress is based on the actual state of the learner's environment.

---

### 🧩 Structured Challenge Management

Administrators can create complete hands-on learning experiences.

Each challenge can include:

- Title
- Description
- Difficulty level
- Estimated completion time
- Docker image
- Environment setup script
- Publishing status
- Multiple ordered tasks

Each task can contain:

- Title
- Description
- Sequence order
- Optional hint
- Validation type
- Structured validation configuration

---

### ⚙️ Automated Validation Framework

The core engineering component of ChallengeLabs is its independent structured validation framework.

When a learner clicks **Check Answer**, the platform does not simply compare text or mark a checkbox.

It inspects the actual state of the learner's running Docker container.

```text
User clicks "Check Answer"
            │
            ▼
     Validation Service
            │
            ▼
     Validation Executor
            │
            ▼
      Validation Factory
            │
            ▼
  Selected Validation Strategy
            │
            ▼
    Live Docker Container
            │
            ▼
       Feedback Builder
            │
            ▼
 Result + Analytics + Progress
```

This architecture keeps validation logic modular, reusable, maintainable, and extensible.

---

## 🧠 Why a Separate Validation Framework?

### Previous Approach

The original validation system stored validation logic directly inside every challenge task.

```text
ChallengeTask
├── validationRule
└── expectedOutcome
```

This approach worked initially, but created several limitations:

- Validation logic was tightly coupled to task data
- Tasks depended directly on raw shell commands
- Different validation behaviors were difficult to organize
- Feedback was difficult to standardize
- Adding new validation types required repetitive logic
- The validation flow became harder to maintain as the platform grew

---

### Current Approach

The validation system was redesigned as an independent framework.

```text
ChallengeTask
      │
      ▼
TaskValidation
      │
      ▼
ValidationExecutor
      │
      ▼
ValidationFactory
      │
      ▼
ValidationStrategy
      │
      ▼
Live Container
      │
      ▼
FeedbackBuilder
```

The new architecture separates:

> **What should be validated** from **how it should be validated**.

This provides:

- Separation of concerns
- Reusable validation logic
- Consistent feedback
- Cleaner task configuration
- Easier maintenance
- Better testability
- Safer future expansion

New validation strategies can be introduced without redesigning the complete execution pipeline.

---

## 🛠️ Supported Validation Strategies

ChallengeLabs currently supports five structured validation strategies.

---

### 1️⃣ Command Validation

Executes a command inside the learner's container and validates the result.

**Example use cases:**

- Verify a service is running
- Validate command output
- Check system configuration
- Confirm a command succeeds

```json
{
  "type": "COMMAND",
  "config": {
    "command": "systemctl is-active apache2",
    "expectedOutput": "active"
  }
}
```

---

### 2️⃣ Directory Exists Validation

Checks whether a required directory exists inside the lab environment.

**Example use cases:**

- Verify project structure
- Check directory creation tasks
- Validate workspace organization

```json
{
  "type": "DIRECTORY_EXISTS",
  "config": {
    "path": "/workspace/docs"
  }
}
```

---

### 3️⃣ File Exists Validation

Checks whether a required file has been created.

**Example use cases:**

- Configuration file creation
- Script creation
- Project setup verification

```json
{
  "type": "FILE_EXISTS",
  "config": {
    "path": "/workspace/config.json"
  }
}
```

---

### 4️⃣ File Contains Validation

Checks whether a file contains the required content.

**Example use cases:**

- Validate configuration values
- Check documentation content
- Verify generated files
- Confirm exact text requirements

```json
{
  "type": "FILE_CONTAINS",
  "config": {
    "file": "/workspace/docs/readme.txt",
    "contains": "Welcome to ChallengeLabs"
  }
}
```

---

### 5️⃣ Permission Validation

Checks whether a file has the required Linux permissions.

**Example use cases:**

- Validate executable permissions
- Check secure file permissions
- Teach Linux access control

```json
{
  "type": "PERMISSION",
  "config": {
    "path": "/workspace/script.sh",
    "permission": "755"
  }
}
```

---

## 🏗️ Validation Engine Architecture

The validation framework follows a strategy-based architecture.

```text
src/validation
│
├── builders
│   ├── FeedbackBuilder.ts
│   └── LinuxCommandBuilder.ts
│
├── executor
│   └── ValidationExecutor.ts
│
├── factory
│   └── ValidationFactory.ts
│
├── interfaces
│   └── IValidationStrategy.ts
│
├── strategies
│   ├── BaseValidationStrategy.ts
│   ├── CommandValidationStrategy.ts
│   ├── DirectoryExistsStrategy.ts
│   ├── FileExistsStrategy.ts
│   ├── FileContainsStrategy.ts
│   └── PermissionValidationStrategy.ts
│
└── types
    ├── ValidationConfig.ts
    ├── ValidationResult.ts
    ├── ValidationTask.ts
    └── ValidationType.ts
```

### Core Components

#### Validation Service

Coordinates the complete validation workflow.

It handles:

- Task lookup
- Duplicate completion prevention
- Session verification
- User authorization
- Container availability checks
- Validation execution
- Result persistence
- Analytics creation
- Challenge completion tracking

---

#### Validation Executor

Executes configured validations and aggregates their results.

Its responsibilities include:

- Processing task validations
- Running validations in order
- Collecting individual results
- Aggregating final pass/fail status
- Tracking execution duration

---

#### Validation Factory

Selects the correct validation strategy based on the configured validation type.

```text
COMMAND
        → CommandValidationStrategy

DIRECTORY_EXISTS
        → DirectoryExistsStrategy

FILE_EXISTS
        → FileExistsStrategy

FILE_CONTAINS
        → FileContainsStrategy

PERMISSION
        → PermissionValidationStrategy
```

This prevents large conditional blocks from spreading throughout the application.

---

#### Validation Strategies

Each validation type has its own dedicated strategy.

Every strategy is responsible for:

1. Receiving the validation configuration
2. Building the required Linux command
3. Executing it inside the learner's container
4. Interpreting the result
5. Returning structured validation feedback

---

#### Linux Command Builder

Builds validation commands in a consistent way.

This centralizes command construction instead of scattering shell command logic throughout the application.

---

#### Feedback Builder

Generates meaningful success and failure feedback.

Instead of returning only:

```text
Task Failed
```

ChallengeLabs can return more useful feedback such as:

```text
Required directory does not exist.
```

```text
Expected file was not found.
```

```text
Expected content was not found in the file.
```

```text
File permissions do not match the required permission.
```

This helps learners understand what went wrong instead of repeatedly guessing.

---

## 🔄 Complete Validation Flow

When a learner validates a task:

```text
1. User clicks "Check Answer"
            │
            ▼
2. Task existence is verified
            │
            ▼
3. Previous successful completion is checked
            │
            ▼
4. Session ownership is verified
            │
            ▼
5. Session status is checked
            │
            ▼
6. Running container is verified
            │
            ▼
7. Structured validations are loaded
            │
            ▼
8. Validation Executor processes the task
            │
            ▼
9. Validation Factory selects a strategy
            │
            ▼
10. Strategy checks the live container
            │
            ▼
11. Specific feedback is generated
            │
            ▼
12. Validation result is stored
            │
            ▼
13. Analytics events are recorded
            │
            ▼
14. Challenge progress is recalculated
```

This keeps validation, persistence, analytics, and progress tracking coordinated while maintaining separation between components.

---

## 🧑‍💼 Dynamic Admin Validation Configuration

The admin interface dynamically changes based on the selected validation strategy.

```text
COMMAND
├── Command
└── Expected Output

DIRECTORY_EXISTS
└── Directory Path

FILE_EXISTS
└── File Path

FILE_CONTAINS
├── File Path
└── Expected Text

PERMISSION
├── File Path
└── Required Permission
```

Administrators can configure technical tasks without modifying the validation engine itself.

---

## 🔄 Task Creation Flow

```text
Admin Creates Task
        │
        ▼
Selects Validation Type
        │
        ▼
Enters Strategy-Specific Configuration
        │
        ▼
API Validates Request
        │
        ▼
ChallengeTask Created
        │
        ▼
Structured TaskValidation Created
        │
        ▼
Task Ready for Learners
```

---

## ✏️ Task Editing Flow

Existing validation configurations can also be edited.

```text
Admin Opens Task
        │
        ▼
Existing TaskValidation Loaded
        │
        ▼
Form Populated Dynamically
        │
        ▼
Admin Updates Configuration
        │
        ▼
Existing TaskValidation Updated
        │
        ▼
New Validation Behavior Applied
```

The system keeps one structured validation record synchronized with the task configuration.

---

## 🐳 Session Management

Every challenge attempt is represented by a session connected to a Docker container.

Supported session states include:

```text
CREATING
RUNNING
STOPPED
EXPIRED
FAILED
```

The session system manages:

- User ownership
- Challenge association
- Docker container association
- Session start time
- Expiration time
- Last activity
- Session status

This ensures lab environments remain isolated and controlled.

---

## 📈 Progress Tracking

ChallengeLabs tracks progress at both task and challenge level.

The system records:

- Validation attempts
- Successful validations
- Failed validations
- Completed tasks
- Completed challenges

Duplicate successful validations are prevented.

If a learner has already completed a task, the platform returns the stored successful result instead of unnecessarily executing the validation again.

After each successful task validation, ChallengeLabs checks whether all tasks in the challenge are complete.

```text
Task Passed
     │
     ▼
Store Validation Result
     │
     ▼
Record TASK_COMPLETED Event
     │
     ▼
Count Unique Completed Tasks
     │
     ▼
Compare with Total Challenge Tasks
     │
     ▼
Record CHALLENGE_COMPLETED Event
```

---

## 📊 Analytics System

Important platform activity is captured through structured analytics events.

Supported events include:

```text
CHALLENGE_STARTED
CHALLENGE_COMPLETED
SESSION_CREATED
SESSION_EXPIRED
VALIDATION_PASSED
VALIDATION_FAILED
TASK_COMPLETED
```

Analytics metadata can include:

- User ID
- Challenge ID
- Session ID
- Task ID
- Task title
- Validation result
- Exit code
- Sanitized command output
- Completion timestamp

The analytics system provides a foundation for future learning insights and performance dashboards.

---

## 🛡️ Validation Safety and Reliability

The validation flow includes several safeguards.

### Session Ownership Verification

A learner can validate tasks only inside their own session.

### Active Session Verification

Validation is allowed only when the session is running.

### Container Verification

A valid container must be associated with the session.

### Duplicate Completion Prevention

Already completed tasks are not unnecessarily re-executed.

### Output Sanitization

Validation output stored in analytics is sanitized and limited before persistence.

### Missing Configuration Protection

Tasks without structured validation configurations are rejected instead of silently falling back to legacy behavior.

---

## 🗃️ Database Design

The platform is built around the following core entities:

```text
User
 │
 ├── Sessions
 │      │
 │      ├── Challenge
 │      │      │
 │      │      └── ChallengeTask
 │      │              │
 │      │              └── TaskValidation
 │      │
 │      └── ValidationResult
 │
 └── AnalyticsEvents
```

---

### TaskValidation Model

Validation configuration is stored separately from challenge tasks.

```text
TaskValidation
├── id
├── taskId
├── type
├── description
├── config
├── order
├── isRequired
└── createdAt
```

The JSON-based configuration allows different validation strategies to use different parameters while maintaining one consistent database model.

Example:

```json
{
  "type": "FILE_CONTAINS",
  "config": {
    "file": "/workspace/docs/readme.txt",
    "contains": "Welcome to ChallengeLabs"
  },
  "order": 1,
  "isRequired": true
}
```

---

## 🏛️ High-Level Architecture

```text
┌─────────────────────────────────────────┐
│                 Frontend                │
│                                         │
│  Dashboard │ Admin Panel │ Lab Workspace│
└───────────────────┬─────────────────────┘
                    │
                    │ REST API / WebSocket
                    ▼
┌─────────────────────────────────────────┐
│                  Backend                │
│                                         │
│              Controllers                │
│                   ↓                     │
│                Services                 │
│                   ↓                     │
│              Repositories               │
└──────────────┬─────────────────┬────────┘
               │                 │
               ▼                 ▼
┌─────────────────────┐  ┌─────────────────────┐
│  Validation Engine  │  │   Session Manager   │
│                     │  │                     │
│  Factory            │  │  Container          │
│  Executor           │  │  Lifecycle          │
│  Strategies         │  │  Expiration         │
│  Feedback Builder   │  │  Cleanup            │
└──────────┬──────────┘  └──────────┬──────────┘
           │                        │
           └────────────┬───────────┘
                        ▼
              ┌───────────────────┐
              │ Docker Containers │
              │                   │
              │   Isolated Labs   │
              └───────────────────┘
                        │
                        ▼
              ┌───────────────────┐
              │    PostgreSQL     │
              │                   │
              │ Users             │
              │ Challenges        │
              │ Tasks             │
              │ Validations       │
              │ Sessions          │
              │ Analytics         │
              └───────────────────┘
```

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe frontend development |
| Vite | Development and build tooling |
| React Router | Client-side navigation |
| Axios | API communication |
| React Hot Toast | User notifications |
| Lucide React | UI icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend development |
| Prisma ORM | Database access |
| PostgreSQL | Relational database |
| Redis | Caching and supporting infrastructure |
| Socket.IO | Real-time communication |
| Zod | Request and environment validation |

### Infrastructure & Security

| Technology | Purpose |
|---|---|
| Docker | Isolated lab environments |
| JWT | Authentication |
| Role-Based Access Control | Admin and user authorization |
| Helmet | HTTP security headers |
| CORS | Cross-origin access control |
| Structured Logging | Backend monitoring and debugging |

---

## 📁 Project Structure

```text
ChallengeLabs
│
├── backend
│   │
│   ├── prisma
│   │   ├── migrations
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── src
│       ├── config
│       ├── controllers
│       ├── middleware
│       ├── repositories
│       ├── routes
│       ├── services
│       ├── utils
│       ├── validation
│       │   ├── builders
│       │   ├── executor
│       │   ├── factory
│       │   ├── interfaces
│       │   ├── strategies
│       │   └── types
│       └── validators
│
└── frontend
    │
    └── src
        ├── assets
        ├── components
        ├── pages
        └── services
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Docker
- Redis

---

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd ChallengeLabs
```

---

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/challenge_lab

JWT_SECRET=your_secure_jwt_secret

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=4000
```

Update the values according to your local environment.

---

### 4️⃣ Apply Database Migrations

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

> ⚠️ **Important:** The development seed file clears existing users, challenges, tasks, sessions, validation results, and analytics before inserting sample data. Run database seeding only when you intentionally want to reset the development database.

---

### 5️⃣ Start Required Services

Make sure the following are running:

```text
PostgreSQL
Redis
Docker
```

---

### 6️⃣ Start the Backend

```bash
npm run dev
```

The backend development server runs on:

```text
http://localhost:4000
```

---

### 7️⃣ Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

### 8️⃣ Start the Frontend

```bash
npm run dev
```

The frontend development server runs on:

```text
http://localhost:5173
```

---

## 🧪 Example Challenge Flow

### Step 1: Administrator Creates a Challenge

```text
Challenge:
Linux File Management

Docker Image:
ubuntu:22.04
```

### Step 2: Administrator Creates a Task

```text
Task:
Create a documentation directory

Validation Type:
DIRECTORY_EXISTS

Directory Path:
/workspace/docs
```

### Step 3: Learner Starts the Challenge

ChallengeLabs creates an isolated Docker container for the session.

### Step 4: Learner Attempts Validation

The validation fails:

```text
Required directory does not exist.
```

### Step 5: Learner Solves the Task

```bash
mkdir -p /workspace/docs
```

### Step 6: Learner Validates Again

```text
Task completed successfully.
```

The platform then automatically:

- Stores the successful validation result
- Records analytics events
- Updates task progress
- Checks whether the complete challenge is finished

---

## 🔁 Validation Framework Evolution

### Before

```text
ChallengeTask
├── validationRule
└── expectedOutcome
```

The task model directly stored raw validation commands.

### After

```text
ChallengeTask
       │
       ▼
TaskValidation
       │
       ▼
ValidationExecutor
       │
       ▼
ValidationFactory
       │
       ▼
ValidationStrategy
       │
       ▼
FeedbackBuilder
```

The legacy validation system was completely removed from:

- Runtime execution
- Task creation
- Task editing
- Repository logic
- API request validation
- Frontend service contracts
- Frontend task forms
- Database schema
- Seed logic

The migration transformed validation from a task-specific feature into an independent and extensible framework.

---

## 🧪 Framework Verification

The completed validation framework was tested through the complete application flow:

```text
Create Structured Task
        │
        ▼
Verify TaskValidation Record
        │
        ▼
Attempt Before Solving
        │
        ▼
Receive Specific Failure Feedback
        │
        ▼
Solve Task in Live Container
        │
        ▼
Validation Passes
        │
        ▼
Edit Validation Configuration
        │
        ▼
Existing Solution Fails
        │
        ▼
Update Container State
        │
        ▼
Validation Passes Again
```

The final regression flow verified:

- Structured task creation
- Validation persistence
- Failure detection
- Specific feedback
- Successful validation
- Task editing
- Validation configuration updates
- Database synchronization
- Re-validation after editing
- Challenge progress integration

---

## 🔮 Extensibility

The validation engine is designed to support additional strategies in the future.

Potential future strategies include:

- Process Running Validation
- User Exists Validation
- Regex Validation
- Command Output Validation
- Custom Script Validation
- Network Port Validation
- Package Installation Validation
- Service Status Validation

A new validation type can be introduced by:

```text
1. Create a new validation strategy
             │
             ▼
2. Register it with the factory
             │
             ▼
3. Define its configuration
             │
             ▼
4. Add corresponding admin form fields
```

The rest of the execution pipeline remains unchanged.

---

## 🗺️ Future Improvements

Planned improvements include:

- Additional validation strategies
- Multiple validations per task
- Weighted task scoring
- Validation retry analytics
- Advanced learner dashboards
- Challenge recommendations
- Detailed learning insights
- Improved container resource limits
- Additional challenge categories
- Admin validation previews
- Challenge versioning
- Automated test coverage

---

## 💡 Engineering Highlights

ChallengeLabs demonstrates the implementation of:

- Strategy Pattern for modular validation logic
- Factory Pattern for dynamic strategy selection
- Builder Pattern for command and feedback generation
- Repository Pattern for data-access separation
- Structured JSON-based validation configuration
- Isolated Docker execution environments
- Session lifecycle management
- Role-based admin workflows
- Automated task progress tracking
- Event-based learning analytics
- Full-stack TypeScript development
- Legacy system migration without breaking active challenge data

---

## 📍 Development Status

ChallengeLabs currently supports the complete core learning workflow:

```text
Create Challenge
        │
        ▼
Configure Lab Environment
        │
        ▼
Create Structured Tasks
        │
        ▼
Launch Docker Session
        │
        ▼
Solve Tasks in Terminal
        │
        ▼
Run Automated Validation
        │
        ▼
Receive Specific Feedback
        │
        ▼
Track Task Progress
        │
        ▼
Complete Challenge
```

The platform is actively evolving, with the validation framework designed to support additional strategies and more advanced technical labs in future versions.

---

## 👩‍💻 Author

### Anushka Singh

B.Tech Computer Science Engineering student focused on full-stack development, backend systems, and building practical software products.

---

## 📄 License

This project was developed as part of an internship project.

Please contact the repository owner before using the project for commercial purposes.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving the repository a star!

**Built with a focus on practical learning, modular architecture, and real-world engineering.**

</div>

