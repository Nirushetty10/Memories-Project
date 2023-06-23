const router = require("express").Router();
const User = require("../models/User");

//  create memory
router.put("/addMemories/:id", async (req, res) => {
    const memories = req.body;
    console.log(memories);
    try {
        const user = await User.findByIdAndUpdate(req.params.id , { $addToSet: { memories: memories } });
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
    } catch(err) {
        console.log(err.message);
    }
  });

module.exports = router;