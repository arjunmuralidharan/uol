const express = require("express");
const router = express.Router();

let spells = [
   {
      id: 1001,
      name: "Rabbit foot positivity",
      ingredients: [{ name: "Foot of rabbit" }, { name: "Juice of beetle" }],
      result: "Good luck",
   },
   {
      id: 1002,
      name: "Fox exeunta",
      ingredients: [{ name: "Foul of lion" }, { name: "Spirit of hobo" }],
      result: "Fox removed",
   },
   {
      id: 1003,
      name: "Hackus maximum",
      ingredients: [
         { name: "Oxygenated hydrogen juice" },
         { name: "Effluent of bean" },
         { name: "Heat of joy" },
      ],
      result: "Fast coding",
   },
];

// get all spells
router.get("/", function(req, res) {
   res.json(spells);
});
// get a specific spell
router.get("/:id", function(req, res) {
   const spellId = parseInt(req.params["id"]);
   let spellResult = spells.find((obj) => {
      return obj.id === spellId;
   });
   res.json(spellResult);
});
// update a specific spell
router.put("/:id", function(req, res) {
   // Store all the fields received in the request
   const spellId = parseInt(req.params["id"]);
   const newName = req.body.name;
   const newIngredients = req.body.ingredients;
   const newResult = req.body.result;

   // Find the correct spell to update
   let spellResult = spells.find((obj) => {
      return obj.id === spellId;
   });

   // Update the spell
   spellResult.id = spellId;
   spellResult.name = newName;
   spellResult.ingredients = newIngredients;
   spellResult.result = newResult;
   res.json(spellResult);
});

// Add a new spell
router.post("/", function(req, res) {
   let spell = {
      id: req.body.id,
      name: req.body.name,
      ingredients: req.body.ingredients,
      result: req.body.result,
   };
   // Only add the spell if the ID of the new spell can't be found in the spells array
   if (!(spells.find((s) => s.id === spell.id))) {
      spells.push(spell);
   }
   res.json(spells[spells.length - 1]);
});

module.exports = router;
