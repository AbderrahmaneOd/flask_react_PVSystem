# Project Title

This project is a full-stack application with a frontend built using React and a backend built using Flask. The frontend and backend are organized into separate folders within this repository.

## Frontend

The frontend of this project is built using React, a popular JavaScript library for building user interfaces. It's located in the `frontend` folder.

### Running the Frontend

To run the frontend, make sure you have Node.js and npm installed on your machine. Then navigate to the `Frontend` folder and run the following command:

```bash
cd Frontend
npm install
npm run dev
```

This will install the necessary dependencies and start the development server. The frontend will be accessible at `http://localhost:5173`.

## Backend

The backend of this project is built using Flask, a lightweight web framework for Python. It's located in the `Backend` folder.

### Running the Backend

To run the backend, make sure you have Python installed on your machine. Then navigate to the `backend` folder and run the following command:

```bash
cd Backend
pip install -r requirements.txt
python -m flask run
```

This will start the Flask server, and the backend will be accessible at `http://localhost:5000`.

### Debugging the Backend

If you need to debug the backend, you can run the following command instead:

```bash
python -m flask run --debug
```

This will start the Flask server in debug mode, providing more detailed error messages and automatic code reloading.
