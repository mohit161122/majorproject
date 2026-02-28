const express = require('express')
const router = express.Router()


// Index  - users
router.get('/', (req, res) => {
  res.send('GET for users')
});


// Show route 
router.get('/:id', (req, res) => {
  res.send('GET for users id')
});

// Post route 
router.post('/', (req, res) => {
  res.send('Post for   users')
});

// Delete route 
router.delete('/:id', (req, res) => {
  res.send('Delete for  users Id')
});



module.exports = router;