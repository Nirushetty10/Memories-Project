const router = require("express").Router();
const User = require("../models/User");
// const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
// const upload = multer({ dest: 'memories/'});

//  create memory
router.put("/addMemories/:id", async (req, res) => {
  const memories = {
    _id: uuidv4(),
    ...req.body,
    isLiked: false,
  };
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { memories: memories },
    });
    await user.save();
    res.status(200).send("successfull");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get memory
router.get("/memory/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user.memories);
    } else {
      res.status(500).send("user not found");
    }
  } catch (err) {
    console.log(err.message);
  }
});

// get directory
router.get("/directory", async (req, res) => {
  res.send(__dirname);
});

// remove memory
router.put("/memory/:id/:memID", async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.updateOne(
      { _id: id },
      { $pull: { memories: { _id: req.params.memID } } }
    );
    if (user) {
      res.status(200).send("success");
    } else {
      res.status(500).send("user not found");
    }
  } catch (err) {
    console.log(err.message);
  }
});

// like memory
router.put("/memory/like/:id/:memId", async (req, res) => {
  const id = req.params.id;
  try {
    User.findOne({ "_id": id, "memories._id": req.params.memId })
  .then(user => {
    const memory = user.memories.find(m => m._id.toString() === req.params.memId );
    if (memory) {
      memory.isLiked = !memory.isLiked;
      return user.save();
    } else {
      throw new Error("Memory not found");
    }
  })
  } catch (err) {
    console.log(err.message);
  }
});

// like status

router.get("/memory/like/:id/:in", async (req, res) => {
  const id = req.params.id;
  try {
    let data = await User.findOne({ _id: id });
    if (data) {
      res.status(200).json(data.memories[req.params.in].isLiked);
    } else {
      res.status(500).send("memory not found");
    }
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
