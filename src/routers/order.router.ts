import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

const router = Router();
const service = new OrderService();

// POST /order
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.createOrder(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /order/:orderId
router.get(
  '/:orderId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getOrder(req.params.orderId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /order/list
router.get(
  '/list/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.listOrders(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /order/:orderId
router.put(
  '/:orderId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.updateOrder(req.params.orderId, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /order/:orderId
router.delete(
  '/:orderId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.deleteOrder(req.params.orderId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
