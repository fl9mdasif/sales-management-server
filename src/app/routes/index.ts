import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';

const router = Router();

const moduleRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/sales',
    route: authRoute,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
