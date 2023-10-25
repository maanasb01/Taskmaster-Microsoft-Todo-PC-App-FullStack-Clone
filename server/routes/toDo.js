const express = require("express");
const { body, header, param, validationResult } = require("express-validator");
const tokenAuth = require("../middlewares/tokenAuth");
const { ToDoList } = require("../models/ToDoList");
const { ToDo } = require("../models/ToDo");
const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;

const router = express.Router();

// /todo
// Provide title, user (id), the list it belongs to, and in the toDoLists Model-add this list
router.post(
  "/",
  [
    body("title").exists().withMessage("Please enter something"),
    header("todolist")
      .exists()
      .withMessage("This Todo does not belong to a List"),
  ],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const todo = await ToDo.create({
        ...req.body,
        user: req.user.id,
        toDoList: req.headers.todolist,
      });
      const updatedList = await ToDoList.findByIdAndUpdate(
        req.headers.todolist,
        { $push: { toDos: todo._id } },
        { new: true }
      );
      res.json(todo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error.", error: error });
    }
  }
);

//Get all info of a todo
router.get(
  "/info/:id",
  [param("id").exists().withMessage("Id parameter is missing")],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Bad Request" });
    }
    try {
      const todo = await ToDo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: "List not Found" });
      }
      if (todo.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.json(todo);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

//GET all the todos of a given list id
//id is of list

router.get(
  "/:id",
  [param("id").exists().withMessage("Missing id parameter")],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Missing Parameter.", errors: errors.array() });
    }

    const todolistId = req.params.id;

    //This just checks whether the id is a MongoDB id or not. It checks a pattern. A wrong id which matches the pattern would also be accepted here.
    if (!isValidObjectId(todolistId)) {
      return res.status(400).json({ error: "Not a MongoDB Id: toDo list" });
    }
    try {
      const todoList = await ToDoList.findById(todolistId);

      if (!todoList) {
        return res.status(404).json({ error: "Todo List not found" });
      }

      if (todoList.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const todos = await ToDo.find({ _id: { $in: todoList.toDos } });

      if (!todos) {
        res.status(404).send("NOT FOUND");
      }

      res.status(200).json(todos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

//GET all the todos of a given user
router.get("/", tokenAuth, async (req, res) => {
  try {
    const todos = await ToDo.find({ user: req.user.id });

    if (!todos) {
      res.status(404).send("NO Todos Found");
    }

    res.status(200).json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//Route for deleting a toDo ROUTE: DELETE /todo/:id

router.delete(
  "/:id",
  [
    param("id").exists().withMessage("Missing id parameter"),
    header("todolist").exists().withMessage("The todolist header is missing"),
  ],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Missing Parameter(s).", errors: errors.array() });
    }

    const todoId = req.params.id;
    const listId = req.headers.todolist;

    //This just checks whether the id is a MongoDB id or not. It checks a pattern. A wrong id which matches the pattern would also be accepted here.
    if (!isValidObjectId(todoId)) {
      return res.status(400).json({ error: "Not a MongoDB Id: toDo" });
    }
    if (!isValidObjectId(listId)) {
      return res.status(400).json({ error: "Not a MongoDB Id: toDo List" });
    }

    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      const todo = await ToDo.findById(todoId);
      const todoList = await ToDoList.findById(listId);

      if (!todo || !todoList) {
        return res.status(404).json({ error: "Todo or Todo List not found" });
      }

      if (
        todoList.user.toString() !== req.user.id &&
        todo.user.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (!todoList.toDos.includes(todoId)) {
        /**The HyperText Transfer Protocol (HTTP) 422 Unprocessable Content response status code
         * indicates that the server understands the content type of the request entity,
         * and the syntax of the request entity is correct, but it was unable to process
         * the contained instructions.-MDN */
        return res.status(422).json({
          message: "Unprocessable Content",
          error:
            "The todo does not belong to the todo list sent in the header.",
        });
      }

      await ToDo.findByIdAndDelete(todoId);
      await ToDoList.findByIdAndUpdate(listId, { $pull: { toDos: todoId } });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Deleted the ToDo Successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

//Route for updating a toDo ROUTE: PUT /todo/:id
router.put(
  "/:id",
  [param("id").exists().withMessage("Missing id parameter")],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Missing Parameter.", errors: errors.array() });
    }

    const todoId = req.params.id;
    const { title, note, dueAt, isCompleted, markedImp, inMyDay } = req.body;

    if (!title && !note && !dueAt && !isCompleted && !markedImp && !inMyDay) {
      return res.status(400).json({ message: "No Things to Update" });
    }

    //Create a new Todo object
    const newTodo = {};

    if (title) {
      newTodo.title = title;
    }
    if (note) {
      newTodo.note = note;
    }
    if (dueAt) {
      newTodo.dueAt = dueAt;
    }
    if (isCompleted) {
      newTodo.isCompleted = isCompleted;
    }
    if (markedImp) {
      newTodo.markedImp = markedImp;
    }
    if (inMyDay) {
      newTodo.inMyDay = inMyDay;
    }

    //This just checks whether the id is a MongoDB id or not. It checks a pattern. A wrong id which matches the pattern would also be accepted here.
    if (!isValidObjectId(todoId)) {
      return res.status(400).json({ error: "Not a MongoDB Id: toDo" });
    }

    try {
      const todo = await ToDo.findById(todoId);

      if (!todo) {
        return res.status(404).json({ error: "Todo is not found" });
      }

      if (todo.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (dueAt === "REMOVEDATE") {
        const updatedTodo = await ToDo.findByIdAndUpdate(
          todoId,
          { $unset: { dueAt: true } },
          { new: true }
        );
        if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found" });
        }

        return res
          .status(200)
          .json({ message: "Removed Date Successfully.", updatedTodo });
      }
      if (note === "REMOVENOTE") {
        const updatedTodo = await ToDo.findByIdAndUpdate(
          todoId,
          { $unset: { note: true } },
          { new: true }
        );
        if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found" });
        }

        return res
          .status(200)
          .json({ message: "Note Cleared Successfully.", updatedTodo });
      }

      const updatedTodo = await ToDo.findByIdAndUpdate(
        todoId,
        { $set: newTodo },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Updated the ToDo Successfully.", updatedTodo });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

//Route to add a Step to a Todo provided id of the Todo as a parameter
//POST /todo/:id/step
router.post(
  "/:id/step",
  [
    body("stepTitle").exists().withMessage("Add a Step Title"),
    param("id").exists().withMessage("Missing Id Parameter"),
  ],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const todoId = req.params.id;
      const todo = await ToDo.findById(todoId);

      if (!todo) {
        return res.status(404).json({ message: "Todo not Found" });
      }

      if (todo.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const step = { stepTitle: req.body.stepTitle };
      todo.steps.push(step);
      await todo.save();
      res.status(200).json(step);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error.", error: error });
    }
  }
);

// READ all steps of a ToDo
router.get("/:id/step", tokenAuth, async (req, res) => {
  try {
    const todoId = req.params.id;

    // Find the ToDo by ID and select only the steps
    const todo = await ToDo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "ToDo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(todo.steps);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//PUT request. To update a Step
router.put(
  "/:todoId/step/:stepId",
  [
    param("todoId").exists().withMessage("Missing todoId parameter"),
    param("stepId").exists().withMessage("Missing stepId parameter"),
  ],
  tokenAuth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Missing Parameter.", errors: errors.array() });
    }

    const { todoId, stepId } = req.params;
    const { stepTitle, isCompleted } = req.body;

    if (!stepTitle && !isCompleted) {
      return res.status(404).json({ message: "No Things to Update" });
    }

    if (!isValidObjectId(todoId)) {
      return res.status(400).json({ error: "Not a MongoDB Id: toDo" });
    }

    try {
      const newTodoStep = {};

      if (stepTitle) {
        newTodoStep.stepTitle = stepTitle;
      }
      if (isCompleted) {
        newTodoStep.isCompleted = isCompleted;
      }
      const todo = await ToDo.findById(todoId);
      const step = todo.steps.id(stepId);

      if (!todo) {
        return res.status(404).json({ error: "Todo is not found" });
      }

      if (todo.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      step.set(newTodoStep);

      await todo.save();

      res
        .status(200)
        .json({
          message: "Updated the Step Successfully.",
          updatedTodoStep: newTodoStep,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// DELETE a step from a ToDo
router.delete("/:todoId/step/:stepId", tokenAuth, async (req, res) => {
  try {
    const { todoId, stepId } = req.params;

    // Find the ToDo by ID
    const todo = await ToDo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "ToDo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const step = todo.steps.id(stepId);
    if (!step) {
      return res.status(404).json({ message: "Step not found" });
    }

    todo.steps.pull(step);

    await todo.save();

    res.status(204).send("Step Deleted");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
