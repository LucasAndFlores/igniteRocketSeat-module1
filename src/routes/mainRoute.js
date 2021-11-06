const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController')

router.post('/', mainController.createAccount)
router.put('/update', mainController.verifyifExistsAccountCPF, mainController.updateAccount)
router.delete('/delete', mainController.verifyifExistsAccountCPF, mainController.deleteAccount)
router.get('/balance', mainController.verifyifExistsAccountCPF, mainController.findStatement)
router.get('/statement', mainController.verifyifExistsAccountCPF, mainController.findStatement)
router.get('/statement/date', mainController.verifyifExistsAccountCPF, mainController.getBydate)
router.post('/deposit', mainController.verifyifExistsAccountCPF, mainController.createDeposit )
router.post('/withdraw', mainController.verifyifExistsAccountCPF, mainController.createWithDraw )


module.exports = router
