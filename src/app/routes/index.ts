import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { shoesRoute } from '../modules/shoes/route.shoes';

const router = Router();

const moduleRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/shoes',
    route: shoesRoute,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
