import { createRouter, createWebHistory } from "vue-router";

export function AppCreateRouter(paths: string[], component: any) {


  console.log (paths)
  console.log(paths.map(
    path => { return { 
                  name: component.name, 
                  path : path,
                  component : component } }
  ))
  return createRouter({
    history: createWebHistory(),
    routes: paths.map(
      path => { return { 
                    name: component.name, 
                    path : path,
                    component : component } }
    )
  });
};

export function AppCreateRouterMultiple(routes: { paths: string[], component: any }[]) {

console.log(routes.map(route => {
  const paths = Array.isArray(route.paths) ? route.paths : [route.paths];
  const routeRecords = paths.map(path => ({ path, name: route.component.name, component: route.component }));
  return routeRecords;
}).flat())


  return createRouter({
    history: createWebHistory(),
    routes: routes.map(route => {
      const paths = Array.isArray(route.paths) ? route.paths : [route.paths];
      const routeRecords = paths.map(path => ({ path, name: route.component.name, component: route.component }));
      return routeRecords;
    }).flat()
  });
};