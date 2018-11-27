<template>
    <v-app dark>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-24">
              <v-toolbar dark color="indigo" dense>
                  <v-toolbar-title>
                    SES
                  </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="Usuario" type="text" v-model="username"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Contraseña" id="password" type="password" v-model="password" @keyup.enter="login"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="grey darken-1" @click="login">Entrar</v-btn>
              </v-card-actions>
            </v-card>
                <v-snackbar v-model="snackbar">
                {{ snackbarMessage }}
                <v-btn color="pink" flat @click="snackbar = false">
                    Cerrar
                </v-btn>
                </v-snackbar>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    </v-app>
</template>

<script>
import { p } from "../../api/tools.js";

export default {
  name:'Login',
  data() {
    return {
      username: "",
      password: "",
      snackbar: false,
      snackbarMessage: ""
    };
  },
  methods: {
    login: function() {
      const { username, password } = this;
      if (username.length > 0 && password.length > 0) {
        Meteor.loginWithPassword(username, password, error => {
          if (error) {
            this.snackbar = true;
            this.snackbarMessage = error.reason;
          } else {
            this.$router.push({ name: "Home" });
          }
        });
      }
    }
  }
};
</script>

<style>
</style>
