<template>
    <v-app dark>
      <v-navigation-drawer clipped fixed v-model="drawer" app>
        <v-list>
            <v-list-tile v-for="item in simpleItems" :key="item.title" @click="item.action()" v-if="item.viewers.includes(userProfile.role)">
              <v-list-tile-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-group
              v-for="item in complexItems"
              :key="item.title"
              :prepend-icon="item.icon"
              no-action
              v-if="item.viewers.includes(userProfile.role)"
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                v-for="subItem in item.items"
                :key="subItem.title"
                @click="subItem.action"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
            </v-list-group>

 
        </v-list>
  </v-navigation-drawer>

        <v-toolbar app fixed clipped-left dense color="indigo">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title>SES</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title class="subheading font-weight-light ">{{userProfile.firstname }} </v-toolbar-title>
          <v-btn icon @click="logout" >
              <v-icon color="red">power_settings_new</v-icon>
          </v-btn>
        </v-toolbar>

        <v-content>
          <v-container fluid fill-height>
            <v-layout justify-center>
              <v-flex shrink>
                <router-view></router-view>
              </v-flex>
            </v-layout>
          </v-container>
        </v-content>

        <v-snackbar v-model="snackbar" :top="true">
        {{ snackbarMessage }}
        <v-btn color="pink" flat @click="snackbar = false">
            Cerrar
        </v-btn>
        </v-snackbar>

    </v-app>
</template>

<script>
import { p } from "../../api/tools.js";
import { Personal } from "../../api/collections.js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Home",
  mounted() {
    Meteor.call("getPersonal", (error, persona) => {
      if (!error) {
        this.setUserProfile(persona);
        this.snackbar = true;
        this.snackbarMessage = `Bienvenido ${persona.firstname}`;
      }
    });
  },
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      drawer: true
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    complexItems() {
      return [
        {
          icon: "donut_large",
          title: "Operaciones",
          viewers: ["Hyperadmin", "Superadmin", "Operaciones"],
          items: [
            {
              title: "Clientes",
              action: () => this.linkAction("operaciones-clientes")
            },
            {
              title: "Soporte",
              action: () => this.linkAction("operaciones-soporte")
            }
          ]
        },
        {
          icon: "settings",
          title: "Gestion",
          viewers: ["Hyperadmin"],
          items: [
            {
              title: "Personal",
              action: () => this.linkAction("gestion-personal")
            }
          ]
        }
      ];
    },
    simpleItems() {
      return [
        {
          icon: "dashboard",
          title: "Dashboard",
          viewers: ["Hyperadmin", "Superadmin", "Operaciones", "Almacen"],
          action: () => this.linkAction("dashboard")
        },
        {
          icon: "store_mall_directory",
          title: "Almacen",
          viewers: ["Hyperadmin", "Superadmin", "Almacen"],
          action: () => this.linkAction("almacen")
        }
      ];
    }
  },
  methods: {
    linkAction: function(linkName) {
      this.$router.push({ path: "/" + linkName });
    },
    logout: function() {
      Meteor.logout(error => {
        if (!error) {
          this.$router.push({ name: "Login" });
        }
      });
    },
    ...mapMutations(["setUserProfile"])
  }
};
</script>

<style>
</style>
