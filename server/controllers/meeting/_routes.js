const express = require('express');
const metting = require('./metting');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, metting.index)
router.post('/add', auth, metting.add)
router.post('/addMany', auth, metting.addMany)
router.get('/view/:id', auth, metting.view)
router.delete('/deleteData/:id', auth, metting.deleteData)
router.post('/deleteMany', auth, metting.deleteMany)

module.exports = router