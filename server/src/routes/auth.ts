import express from 'express';
const router = express.Router();
import { registerUser, loginUser } from '../controllers/auth';

//? <----- register route ----->
router.post('/register', registerUser);

//? <----- login route ----->
router.post('/login', loginUser);

// module.exports = router;
export default router;
