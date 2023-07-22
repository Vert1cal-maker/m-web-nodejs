import Router from 'express';
import { Controller }  from "./Controller";
const router = Router();
const controller = new Controller();

router.get('/', (req,res) => controller.main(req,res));
router.get("/v1/items",(req, res) => controller.get(req, res));
router.post('/v1/register',(req, res) => controller.post('register',req, res));
router.post('/v1/login',(req, res) => controller.post('login',req, res));
router.post('/v1/logout', (req, res) => controller.post('logout',req, res));
router.post("/v1/items",(req, res) => controller.post('add',req, res));
router.put("/v1/items", (req, res) => controller.put(req, res));
router.delete("/v1/items", (req, res) => controller.delete(req, res));

export default router;



