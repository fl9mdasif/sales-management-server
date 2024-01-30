import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { shoesRoute } from '../modules/shoes/route.shoes';
import { sellsRoute } from '../modules/sellsManagement/router.sells';

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
  {
    path: '/sells',
    route: sellsRoute,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
