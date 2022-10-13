import express from 'express';
const router = express.Router();
import { registerUser, loginUser, logoutUser } from '../controllers/auth';

//? <----- register route ----->
router.post('/register', registerUser);

//? <----- login route ----->
router.post('/login', loginUser);

//? <----- log out route ----->
router.post('/logout', logoutUser);

// module.exports = router;
export default router;
