
import Router from 'express';
import { Controller } from '../../modules/Controller';
const router = Router();
const controller = new Controller;
const postAction = ['login', 'register', 'logout', 'deleteItem'];
interface Action {
  [key: string]: any;
}
const actions: Action = {
  login: controller.post.bind(controller),
  logout: controller.post.bind(controller),
  register: controller.post.bind(controller),
  getItems: controller.get.bind(controller),
  deleteItem: controller.delete.bind(controller),
  createItem: controller.post.bind(controller),
  editItem: controller.put.bind(controller),
};



router.all('/v2/router', (req, res) => {

  const action = req.query.action as string;

  if (action !== undefined && action in actions) {
    if (postAction.includes(action)) {
      actions[action](action, req, res);
    } else {
      actions[action](req, res);
    }
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

export default router;