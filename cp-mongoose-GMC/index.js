//import
const connectDB = require("./config/connectDB");
const express = require("express");
const mongoose = require("mongoose");
const person = require("./models/person");
require("dotenv").config();
//****************************************************************************
//database connection call function
connectDB();
//****************************************************************************
//get all express methods
const app = express();
app.use(express.json());
//****************************************************************************
//crud api

app.post("/api/person", async (req, res) => {
  console.log(req.body);
  try {
    let newPerson = new person({ ...req.body });
    console.log("before saving");
    let result = await newPerson.save();
    console.log("after saving");
    console.log(result);
    res.status(200).send({ msg: "person is saved succ" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "person not added", error });
  }
});
//----------------------------------------------------------------------------
app.post("/api/people", async (req, res) => {
  let arrayOfPeople = req.body;
  try {
    await person.insertMany(arrayOfPeople);
    res.status(200).send({ msg: "people is saved succ" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "people not added", error });
  }
});
//----------------------------------------------------------------------------
app.get("/api/search/:name", async (req, res) => {
  try {
    const p = await person.find({ name: req.params.name });
    console.log(p);
    personFinded = p.length;
    res.status(200).send({ msg: `we find ${personFinded} person` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not find", error });
  }
});
//----------------------------------------------------------------------------
app.get("/api/searchone/:name", async (req, res) => {
  try {
    const p = await person.findOne({ name: req.params.name });
    console.log(p);
    res.status(200).send({ msg: `we find this person ${p} ` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not find", error });
  }
});
//----------------------------------------------------------------------------
app.get("/api/searchbyid/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const p = await person.findById({ _id });
    console.log(p);
    res.status(200).send({ msg: `we find this person ${p} with given id ` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not find", error });
  }
});
//----------------------------------------------------------------------------
app.put("/api/edit/:_id", (req, res) => {
  let { _id } = req.params;
  person.findById(_id, async (err, per) => {
    if (err) return;
    console.log(err);
    try {
      per.favoriteFoods.push("hamburger");
      await per.save();
      console.log(per);
      res.status(200).send({ msg: "person edited" });
    } catch (error) {
      res.status(400).send({ msg: "cannot edit person", error });
      console.log(error);
    }
  });
});
//----------------------------------------------------------------------------
app.put("/api/editbyname/:name", async (req, res) => {
  let name = req.params.name;
  console.log(name);
  try {
    let p = await person.findOneAndUpdate(
      { name: name },
      { age: 20 },
      { new: true }
    );
    res.status(200).send({ msg: `person updated succ ${p}` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not find", error });
  }
});
//----------------------------------------------------------------------------
app.delete("/api/deletebyid/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let deleted = await person.findByIdAndRemove({ _id: id });
    console.log(deleted);
    res.status(200).send({ msg: "removed person" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not remove person", error });
  }
});
//----------------------------------------------------------------------------
app.delete("/api/deletemany/:name", async (req, res) => {
  try {
    let deleted = await person.remove({ name: req.params.name });
    console.log(deleted);
    res.status(200).send({ msg: `${deleted.deletedCount} person removed` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not remove", error });
  }
});
//----------------------------------------------------------------------------
app.get("/api/chainsearch/burritos", async (req, res) => {
  try {
    let result = await person
      .find({ favoriteFoods: { $in: "burritos" } })
      .sort({ name: 1 })
      .limit(2)
      .select("-age");
    res.status(200).send({ msg: `person founded ${result}` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "we can not find", error });
  }
});
//****************************************************************************
// create server
const PORT = process.env.PORT;
app.listen(PORT, (err) => (err ? console.log(err) : console.log(PORT)));
