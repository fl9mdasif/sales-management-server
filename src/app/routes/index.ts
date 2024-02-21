import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { shoesRoute } from '../modules/shoes/route.shoes';
import { sellsRoute } from '../modules/sellsManagement/router.sells';
import { polishRoute } from '../modules/polishRequest/route.polish';

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
    path: '/sales',
    route: sellsRoute,
  },
  {
    path: '/shoePolish',
    route: polishRoute,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
