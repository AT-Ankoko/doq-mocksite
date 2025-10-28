import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { defineAsyncComponent } from "vue";

/* INFO rule
 * path
    1. camelCase 로 작성
    2. 파일 path와 동일하게 작성 예) folder1/folder2/my-file
 * name
    1. 파일명 작성 -> PascalCase 사용.
 * component
    1. 파일 path 작성
 */

const routes = [
  {
    path: '/',
    redirect: '/home' // Redirect root path to dashboard
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ "@/pages/Home.vue")
  },
  {
    path: '/text2img',
    name: 'TextToImgPage',
    component: () => import(/* webpackChunkName: "input" */ "@/pages/ExtendPage/TextToImgPage.vue")
  },
  {
    path: '/survey1',
    name: 'SurveyPage1',
    component: () => import(/* webpackChunkName: "survey1" */ "@/pages/SurveyPage/SurveyPage1")
  },
  {
    path: '/survey2',
    name: 'SurveyPage2',
    component: () => import(/* webpackChunkName: "survey2" */ "@/pages/SurveyPage/SurveyPage2")
  },
  {
    path: '/survey3',
    name: 'SurveyPage3',
    component: () => import(/* webpackChunkName: "survey3" */ "@/pages/SurveyPage/SurveyPage3")
  },
  {
    path: '/survey4',
    name: 'SurveyPage4',
    component: () => import(/* webpackChunkName: "survey4" */ "@/pages/SurveyPage/SurveyPage4")
  },
  {
    path: '/survey5',
    name: 'SurveyPage5',
    component: () => import(/* webpackChunkName: "survey5" */ "@/pages/SurveyPage/SurveyPage5")
  },
  {
    path: '/survey6',
    name: 'SurveyPage6',
    component: () => import(/* webpackChunkName: "survey6" */ "@/pages/SurveyPage/SurveyPage6")
  },
  {
    path: '/survey7',
    name: 'SurveyPage7',
    component: () => import(/* webpackChunkName: "survey7" */ "@/pages/SurveyPage/SurveyPage7")
  },
  {
    path: '/end',
    name: 'End',
    component: () => import(/* webpackChunkName: "end" */ "@/pages/End")
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
export { routes }