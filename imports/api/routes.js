// Vue & Vue-Router
import Vue from 'vue'
import VueRouter from 'vue-router'
// Add Plugin
Vue.use(VueRouter)
// All Layouts
import Login from '../view/layouts/Login.vue'
import Home from '../view/layouts/Home.vue'

// Components for Home
import Dashboard from '../view/components/Dashboard.vue'
import Almacen from '../view/components/Almacen.vue'
import GestionPersonal from '../view/components/GestionPersonal.vue'
import OperacionesClientes from '../view/components/OperacionesClientes.vue'
import OperacionesSoporte from '../view/components/OperacionesSoporte.vue'

// const routes
const routes = [
    { name: 'Login', path: '/login', component: Login },
    {
        name: 'Home', path: '/', component: Home, redirect:'/dashboard',
        children: [
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'almacen',
                component: Almacen
            },
            {
                path: 'gestion-personal',
                component: GestionPersonal
            },
            {
                path: 'operaciones-clientes',
                component: OperacionesClientes
            },
            {
                path: 'operaciones-soporte',
                component: OperacionesSoporte
            },
        ]
    },
]

// const router, export

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router