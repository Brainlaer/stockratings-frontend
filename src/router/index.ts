import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StockRatingList from '../views/stockRating/StockRatingList.vue'
import StockRatingDetail from '@/views/stockRating/StockRatingDetail.vue'
import StockRatingEdit from '@/views/stockRating/StockRatingEdit.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/stock_rating',
      name: 'stockRatingList',
      component: StockRatingList
    },{
      path: '/stock_rating/edit/:id',
      name: 'stockRatingEdit',
      component:StockRatingEdit
    },{
      path: '/stock_rating/create',
      name: 'stockRatingCreate',
      component:StockRatingEdit
    },{
      path: '/stock_rating/:id',
      name: 'stockRatingDetail',
      component:StockRatingDetail
    }
  ],
})

export default router
