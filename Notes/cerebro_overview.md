# Cerebro: Comprehensive Development Blueprint

## Table of Contents

1. **Overview and Architecture**
2. **Subtask Categories and Agents**
3. **Datasource Configuration**
   - Objective of Configuration
   - SQL Server Configuration
   - Google Drive Configuration
   - General Process for Other Datasources
4. **Enterprise Configuration**
   - Objective and Process
   - Form Components and Validation
5. **Roles and Permissions Configuration**
   - Objective and User Flow
   - Backend Handling
6. **Individual Employee Configuration**
   - Objective and Scope
   - Integration with Knowledge Core
7. **Knowledge Core**
   - Definition and Role
   - Components: Knowledge Graph, Embeddings, and More
   - Use Cases in Task Automation
8. **Agents and DSPy Modules**
   - Purpose and Interaction with DSPy
   - Role of Tools in Agent Execution
   - Example Tools for Agents
9. **Workspace Dynamics**
   - Workflow Generation and Visualization
   - User Interactions and Recommendations
   - Recording Interactions in Knowledge Core
10. **KnowledgeSets**
    - Definition and Purpose
    - Creation and Reuse
    - Examples of KnowledgeSets

---

## 1. Overview and Architecture

Cerebro is an enterprise-grade AI platform that automates tasks, integrates with various datasources, and enables knowledge-driven decision-making. It is designed with:

- **Frontend**: React and Next.js for a dynamic, responsive UI
- **Backend**:
  - Modular Python services for configuration, task execution, and AI integration
  - PostgreSQL with pgvector for system database and vector operations
  - Redis for caching and connection pooling (future implementation)
- **System DB**:
- PostgreSQL with pgvector for system database and vector operations
- Central storage for user data, configurations, and metadata
- Vector capabilities for semantic search and embeddings
- Secure credential management for datasource connections
- **Knowledge Core**:
  - Not a technical component, but a conceptual one. user facing concept, similar to a "memory" or hard drive.
  - Presents complex data processing as an intuitive "memory" to users

The architecture follows a services-based approach, with clear separation of concerns:

1. **Core Services**:
   - Datasource integration and management
   - Authentication and authorization
   - Configuration management
   - Multi-agent orchestration
   - Logging and monitoring:
     - Centralized logging configuration with rotating file handlers
     - Separate log files for different severity levels (error, info)
     - Structured log format with timestamps and context
     - Console output for development environment
   - Error handling:
     - Global error handling middleware
     - Structured error responses with timestamps
     - Detailed error logging with stack traces
     - Custom error type support
   - Cache management
   - Background task processing

2. **Support Services**:
   - Logging and monitoring
   - Error tracking and reporting
   - Cache management
   - Background task processing

3. **Agent Services**:
   - Task decomposition and planning
   - SQL generation and optimization
   - Data analysis and visualization
   - Knowledge extraction and enrichment

---

## 2. Subtask Categories and Agents

Cerebro handles complex tasks by breaking them into subtasks through a multi-agent architecture. Each agent specializes in specific operations and collaborates through DSPy-powered interfaces. The system includes:

**Agent Types and Roles**:

1. **Query Generation Agents**:
   - Generate optimized SQL queries for supported databases
   - Handle complex joins and subqueries
   - Consider database-specific optimizations and constraints
   - Example: "Find all employees who exceeded their Q2 sales targets"

2. **Data Processing Agents**:
   - Extract and transform data from various sources
   - Handle data type conversions and normalization
   - Manage problematic data types (e.g., SQL Server's geography type)
   - Example: "Combine sales data from multiple regions into a unified format"

3. **Analysis and Visualization Agents**:
   - Create data visualizations and reports
   - Perform statistical analysis
   - Generate insights from processed data
   - Example: "Create a trend analysis of monthly sales with forecasting"

4. **Orchestration Agents**:
   - Coordinate task decomposition and agent collaboration
   - Manage task dependencies and execution flow
   - Handle error recovery and task retries
   - Example: "Coordinate a multi-step data analysis workflow"

**Agent Collaboration**:

- Agents communicate through standardized interfaces
- Task context is shared via the Knowledge Core concept
- Results are captured as KnowledgeSets for future reference
- DSPy optimizes prompt generation and agent interactions

---

## 3. Datasource Configuration

### Objective of Configuration

The primary goal of datasource configuration is to enable Cerebro to deeply understand the structure and nature of each datasource. This understanding informs task execution by:

- Providing context for the backend LLM.
- Indexing datasource contents for fast retrieval.
- Populating the Knowledge Core with detailed metadata and summaries.

**Core Components**:

1. **DatasourceManager**:
   - Singleton service managing active datasource connections
   - Maintains connection pool for each configured datasource
   - Handles connection lifecycle and error recovery

2. **Connector Framework**:
   - Base classes for different datasource types
   - Standardized interfaces for metadata extraction
   - Error handling and logging capabilities

3. **Configuration Storage**:
   - Encrypted credential storage in PostgreSQL
   - Metadata and schema information in system database
   - Connection pooling configuration (future Redis implementation)

### SQL Server Configuration

**Process**:

1. **User Flow**:
   - Admin enters SQL Server connection details (e.g., host, username, password, database name).
   - Clicks "Connect and Configure."

2. **Backend Workflow**:
   - Validate and establish connection using SQLAlchemy
   - Analyze database structure:
     - Schema information and naming conventions
     - Table relationships and constraints
     - Problematic data type detection
   - Generate database summary using DSPy
   - Register with DatasourceManager for active connection management

3. **Data Processing**:
   - Store metadata in PostgreSQL system database
   - Generate and store database summary
   - Index metadata for future querying
   - Cache frequently accessed schema information

**Stored Metadata**:

- **Schema Information**:
  - Complete table structures and relationships
  - Column metadata including data types and constraints
  - Foreign key relationships and dependencies
  - Schema-level organization

- **Operational Data**:
  - Connection configuration and status
  - Usage statistics and access patterns
  - Error logs and recovery information

---

### Google Drive Configuration

**Process**:

1. **User Flow**:
   - User authenticates via OAuth and grants access to specific folders.
   - Clicks "Scan and Configure."

2. **Backend Workflow**:
   - Authentication and Access:
     - Handle OAuth2 flow for Google Drive API
     - Store encrypted access tokens in system database
     - Implement token refresh mechanism with error handling
     - Validate and maintain folder-level permissions
   - Content Processing:
     - Initial scan of permitted folders/files
     - Selective indexing based on file types and sizes
     - Rate-limit aware batch processing
     - Support for incremental updates
   - Metadata Management:
     - Track file versions and changes
     - Monitor sharing permissions
     - Build and maintain folder hierarchies
     - Generate content summaries using DSPy
     - Register with DatasourceManager for active session management

- **Knowledge Graph Construction**:
-
- - **Graph Processing Pipeline**:
  - Chunk document content for efficient processing
  - Extract entities and relationships using DSPy modules
  - Build graph structure using NetworkX for initial processing
  - Detect and summarize communities within the graph
  - Persist final graph in Neo4j database
-
- - **Entity and Relationship Extraction**:
  - Context-aware extraction using surrounding chunks
  - Entity identification and classification
  - Relationship detection between entities
  - Metadata enrichment from document properties
-
- - **Graph Structure**:
  - Nodes represent entities from documents
  - Edges capture relationships and references
  - Communities identify related content clusters
  - Metadata preserved at node and edge levels
-
- > **Note**: The knowledge graph implementation is preliminary and subject to change.
- > Further research areas include:
- > - Integration with modern graph-based RAG techniques
- > - Optimization of community detection algorithms
- > - Enhanced entity and relationship extraction methods
- > - Scalability considerations for large document sets
- > - Real-time graph updates and maintenance strategies

**Stored Metadata**:

- **Document Information**:
  - File metadata (name, type, size, created/modified dates)
  - Access permissions and sharing settings
  - Version history and change tracking
  - Folder hierarchy and navigation paths
  - Content type classification
  - Last sync timestamp

- **Content Analysis**:
  - Text extraction results
  - Document structure information
  - File type specific metadata
  - DSPy-generated content summaries
  - Indexing status and history
  - Processing errors and retries

- **Access Control**:
  - OAuth tokens and refresh information
  - User-specific permissions
  - Folder-level access controls
  - Permission inheritance rules
  - Access history and audit logs

- **Integration Points**:
  - Active session management via DatasourceManager
  - System database storage for configurations and metadata
  - Scheduled jobs for content synchronization
  - Comprehensive error logging and recovery
  - Rate limit monitoring and backoff strategies

---

### General Process for Other Datasources

Every datasource configuration follows similar steps:

1. **Connection and Authentication**:
   - Establish a connection using the relevant API or SDK.
2. **Metadata Extraction**:
   - Gather schema, structure, and content details.
3. **Knowledge Core Updates**:
   - Populate the Knowledge Graph with relationships and entities.
   - Index contents for semantic search.

- **Document Processing with ColPali**:
-
- For datasources containing documents (Google Drive, SharePoint, etc.), Cerebro uses ColPali for efficient document retrieval:
-
- - **Document Ingestion**:
  - Convert document pages to images ("screenshots")
  - Process using PaliGemma-3B vision-language model
  - Generate patch embeddings for document sections
  - Store embeddings in PostgreSQL using pgvector
-
- - **Advantages**:
  - Eliminates complex OCR and layout detection pipeline
  - Captures both textual and visual information
  - Handles tables, figures, and formatting naturally
  - Enables efficient semantic search across documents
-
- - **Integration with Knowledge Graph**:
  - ColPali embeddings complement graph-based representation
  - Visual elements enrich entity and relationship extraction
  - Patch-level granularity improves information retrieval
  - Supports multi-modal understanding of documents
-
- > **Note**: ColPali integration represents a modern approach to document processing,
- > particularly valuable for datasources where visual layout and formatting
- > carry semantic meaning (e.g., financial reports, technical documentation).
- > The combination of ColPali's visual understanding with our knowledge graph
- > construction provides a comprehensive document understanding system.

---

## 4. Enterprise Configuration

### Objective and Process

**Objective**: Gather initial information about the enterprise to tailor Cerebro's capabilities to the organization.

1. **Step 1**:
   - Admin fills out a guided form with fields such as:
     - Multiple-choice questions (e.g., business model).
     - Descriptive questions (e.g., company goals).
     - Rating-based questions (e.g., satisfaction with current tools).

2. **Step 2**:
   - Validates the form data for completeness and relevance.
   - Stores responses in the System DB under `enterprise_config`.

3. **Step 3**:
   - Redirects admin to the Datasource Configuration step.

---

## 5. Roles and Permissions Configuration

### Objective and User Flow

**Objective**: Define user roles and their access permissions to ensure security and compliance.

1. **Admin Actions**:
   - Create new roles and assign specific permissions (e.g., access to datasources).
   - Invite employees by entering their email addresses and assigning roles.

2. **System DB Updates**:
   - Store roles in the `roles` table.
   - Map user emails to assigned roles in the `users` table.

---

## 6. Individual Employee Configuration

### Objective and Scope

**Objective**: Personalize the Cerebro experience for each employee by capturing their preferences and workflows.

1. **Setup Process**:
   - Employees log in and answer a brief questionnaire about their job roles, preferences, and frequently used datasources.
   - Responses are stored in the Knowledge Core under `employee_preferences`.

2. **Integration with Knowledge Core**:
   - Tailors workspace layouts and recommendations based on captured preferences.

---

## 7. Knowledge Core

### Definition and Role

The Knowledge Core is Cerebro's central repository for all enterprise knowledge. It continuously improves by ingesting data during configuration and task execution. Its purpose is to:

- Enhance context for the backend LLM.
- Provide fast, accurate retrieval for user queries.
- Serve as a foundation for advanced reasoning and task orchestration.

---

### Components

1. **Knowledge Graph**:
   - Represents entities (users, tasks, documents) and their relationships.
   - Built and updated using DSPy modules during task execution.

2. **Semantic Embeddings**:
   - Vector representations of documents, tasks, and queries.
   - Enables fast similarity search and context retrieval.

---

### Use Cases

1. **Contextual Task Execution**:
   - Determines relevant datasources for answering user queries.
2. **Intelligent Recommendations**:
   - Suggests workflows or task optimizations based on historical data.

---

## 8. Agents and DSPy Modules

### Purpose and Interaction with DSPy

Agents use DSPy modules as their LLM communication layer. DSPy modules:

- Generate dynamic prompts based on task context.
- Simplify and standardize interactions with multiple LLMs.

### Role of Tools in Agent Execution

Agents use external tools (e.g., SQLAlchemy, Google Drive API) to perform subtasks. For example:

- **Querying RDBMS**: SQLAlchemy or pyodbc.
- **File Analysis**: NLP libraries for entity extraction.

### Example Tools for Agents

1. **Database Querying**:
   - PyODBC
   - SQLAlchemy
2. **Knowledge Graph Construction**:
   - Neo4j Python Driver
3. **Embeddings**:
   - ColPali for document indexing

---

## 9. Workspace Dynamics

### Workflow Generation and Visualization

1. **Creation**:
   - Users describe workflows in chat.
   - Cerebro generates a visual flowchart with nodes for each step.

2. **Editing and Sharing**:
   - Users modify workflows to adapt to new data or processes.
   - Workflows can be shared across teams.

3. **Visualization**:
   - Interactive flowcharts with zoomable nodes for detailed views.

---

### User Interactions and Recommendations

1. **Task Recommendations**:
   - Cerebro suggests task shortcuts based on user activity.
   - Users accept or reject these recommendations.

2. **Chat and Button Clicks**:
   - Chat serves as the primary interaction mode.
   - Button clicks trigger specific task flows.

---

## 10. KnowledgeSets

### Definition and Purpose

KnowledgeSets are labeled datasets derived from completed tasks. They are used to:

- Train new AI models.
- Provide reusable examples for similar tasks.

### Creation and Reuse

1. **Task Conversion**:
   - Convert completed tasks into structured datasets.
   - Label inputs and outputs (e.g., SQL query for a given question).

2. **New Dataset Creation**:
   - Users create datasets manually or through chat interactions.

### Examples

1. **SQL Examples**:
   - Inputs: Questions
   - Outputs: SQL queries
2. **Workflow Examples**:
   - Inputs: Workflow descriptions
