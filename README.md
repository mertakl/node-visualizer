# Node Visualizer

Node Visualizer is a web application that allows users to view and interact with hierarchical graph data. This solution
includes an Express.js backend, which fetches data from a Neo4j database, and a Vue.js frontend for graph visualization
and user interaction.

## Cloning the Project

To clone the project, run the following command in your terminal:

```bash 
git clone https://github.com/mertakl/node-visualizer.git
```

Once cloned, navigate into the project directory:

```bash
cd node-visualizer
```

## Backend

### Setup

1. Environment Variables: Add the following values to backend/.env:
   ```bash 
    * NEO4J_URI="Url for neo4j connection"
    * NEO4J_USER="User for the neo4j account"
    * NEO4J_PASSWORD="Password for the neo4j account"
    ```

2. Install Dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Run Backend Server:
   ```bash
   npm run dev
   ```
4. API Endpoint: The backend server serves data at GET /api/graph.

## Frontend

The frontend is built with Vue.js, TypeScript, and Sass. It fetches data from the backend API and visualizes it using a
graph visualization library.

### Setup

1. Environment Variables: Add the following values to frontend/.env:

    * VITE_API_URL="Url for backend connection is 'http://localhost:3000 for local'"

2. Install Dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Run Frontend Server:

   ```bash 
   npm run dev
   ```

4. Build:

   ```bash 
   npm run build
   ```

## Usage

1. Start both the backend and frontend servers
2. Open the application in your web browser
3. The graph will be displayed
4. Click on a node to view its details in the sidebar
5. Use the 'Deselect Node' button to deselect a node

## Testing

- Backend tests:
  Navigate to the `backend` directory and run
   ```bash 
   npm test 
  ```
- Frontend tests: Navigate to the `frontend` directory and run

   ```bash 
   npm run test:unit
  ```
  Make sure frontend is running

## Technology Stack

* Backend: Node.js, Express, Neo4j Aura
* Frontend: Vue.js, TypeScript, Vite, Sass, Cypress (for testing)

## License

This project is licensed under the MIT License.
