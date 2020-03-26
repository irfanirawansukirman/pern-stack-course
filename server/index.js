const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());

// routes

// create a todo
app.post("/todos", async (req, res) => {
    try {
        const {
            description
        } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json({
            code: 201,
            status: "Success",
            message: "Success creating a new todo",
            data: newTodo.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
});

// get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");

        if (allTodos.rowCount > 0) {
            res.json({
                code: 200,
                status: "Success",
                message: "Success get all todos",
                data: allTodos.rows
            });
        } else {
            res.json({
                code: 204,
                status: "Failed",
                message: "Failed get all todos. Data is empty",
                data: null
            });
        }
    } catch (err) {
        console.error(err.message);
    }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        if (todo.rowCount == 1) {
            res.json({
                code: 200,
                status: "Success",
                message: "Success get todo",
                data: todo.rows[0]
            });
        } else {
            res.json({
                code: 204,
                status: "Failed",
                message: "Failed get todo. Data is not found",
                data: null
            });
        }
    } catch (err) {
        console.error(err.message);
    }
});

// update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const {
            description
        } = req.body
        const oldTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        if (oldTodo.rowCount == 1) {
            const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
            const newTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

            res.json({
                code: 200,
                status: "Success",
                message: "Success update todo",
                data: newTodo.rows[0]
            });
        } else {
            res.json({
                code: 204,
                status: "Failed",
                message: "Failed update todo. Data is not found",
                data: null
            });
        }
    } catch (err) {
        console.error(err.message);
    }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const oldTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        if (oldTodo.rowCount == 1) {
            const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

            res.json({
                code: 200,
                status: "Success",
                message: "Success delete todo",
                data: null
            });
        } else {
            res.json({
                code: 204,
                status: "Failed",
                message: "Failed delete todo. Data is not found",
                data: null
            });
        }
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("server has been starter pada port 5000")
});