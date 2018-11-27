<template>
    <section>
        <h1>Gestion-Personal</h1>
        <v-btn block color="green" @click="showFormPersonal" v-if="toggleBtnPersonal">+ Crear Personal</v-btn>
        <v-btn block disabled>Total Personal: {{personal.length}}</v-btn>
        <template>
            <form ref="formPersonal" v-if="!toggleBtnPersonal" class="pa-4 my-2 elevation-1">
                <v-text-field v-model="firstname" label="Nombres" required></v-text-field>
                <v-text-field v-model="lastname" label="Apellidos" required></v-text-field>
                <v-select :items="roleItems" v-model="roleSelect" label="Rol" required></v-select>
                <v-btn @click="clear" small>Limpiar</v-btn>
                <v-btn @click="toggleBtnPersonal=!toggleBtnPersonal" small>Cerrar</v-btn>
                <v-btn @click="savePersonal" color="green" small>Crear</v-btn>
            </form>
        </template>

        <template>
            <v-data-table :headers="dataTableHeaders" :items="personal" hide-actions  class="elevation-1" >
                <template slot="items" slot-scope="props">
                <td>{{ props.item.firstname }}</td>
                <td class="text-xs-right">{{ props.item.lastname }}</td>
                <td class="text-xs-right">{{ props.item.role }}</td>
                <td class="text-xs-right">
                    <v-btn flat icon color="green" @click="editPersonal(props.item)">
                        <v-icon>border_color</v-icon>
                    </v-btn>
                    <v-btn flat icon color="pink" @click="preventAction(props.item)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </td>
                <td class="text-xs-right">
                    <v-btn flat icon color="indigo" v-if="props.item.userId" @click="showCredentials(props.item)">
                        <v-icon>verified_user</v-icon>
                    </v-btn>
                    <template v-else>
                      <v-btn flat icon color="gray" v-if="props.item.role!='Tecnico'" @click="createPersonalUser(props.item)">
                          <v-icon>check_box_outline_blank</v-icon>
                      </v-btn> 
                    </template>                    
                </td>
                </template>
            </v-data-table>
        </template>
        <template>
            <v-layout row justify-center>
                <v-dialog v-model="dialogEdit" persistent max-width="300">
                <v-card>
                    <v-card-title class="headline">Editar Personal</v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field label="Nombres" v-model="firstname" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Apellidos" v-model="lastname" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select :items="roleItems" v-model="roleSelect" label="Rol" required></v-select>
                            </v-flex>

                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="closeDialogEdit" small>Cerrar</v-btn>
                    <v-btn color="green" flat @click.native="saveEditPersonal" small>Guardar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-layout>
        </template>
        <template>
          <div class="text-xs-center">
            <v-dialog v-model="dialogPrevent" width="500">
              <v-card>
                <v-card-title class="subheading font-weight-light" >
                  ¿Estas seguro?
                </v-card-title>
                <v-card-text>
                  {{preventMessage}}
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat  @click="dialogPrevent = false">
                    Cerrar
                  </v-btn>
                  <v-btn color="green" flat  @click="removePersonal">
                    Seguro
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
        <v-snackbar v-model="snackbar">
        {{ snackbarMessage }}
        <v-btn color="pink" flat @click="snackbar = false">
            Cerrar
        </v-btn>
        </v-snackbar>
    </section>
</template>

<script>
import { Personal } from "../../api/collections.js";
import { mapState } from "vuex";
export default {
  name: "GestionPersonal",
  computed: {
    ...mapState(["userProfile"])
  },
  meteor: {
    $subscribe: {
      personal: []
    },
    personal() {
      return Personal.find({});
    }
  },
  data: () => ({
    idPersonal: null,
    firstname: "",
    lastname: "",
    roleItems: Meteor.settings.public.roles,
    roleSelect: null,
    snackbar: false,
    snackbarMessage: "",
    toggleBtnPersonal: true,
    dataTableHeaders: [
      { text: "Nombres", sortable: false },
      { text: "Apellidos", sortable: false },
      { text: "Rol", sortable: false },
      { text: "Editar/Remover", sortable: false },
      { text: "Usuario", sortable: false }
    ],
    dialogEdit: false,
    dialogPrevent: false,
    preventMessage: "",
    personalToRemove: {}
  }),
  methods: {
    preventAction(personal) {
      this.dialogPrevent = true;
      this.preventMessage = `[Eliminar Personal]: ${personal.firstname} ${personal.lastname}`;
      this.personalToRemove = personal;
      // this.removePersonal(personal);
    },
    showCredentials(personal) {
      this.snackbar = true;
      this.snackbarMessage = `[usuario]:  ${personal.username} [password]:  ${
        personal.password
      } `;
    },
    createPersonalUser(personal) {
      Meteor.call("createPersonalUser", personal, (error, result) => {
        if (!error) {
          this.snackbar = true;
          this.snackbarMessage = `[Usuario creado]:  ${personal.firstname} ${
            personal.lastname
          }`;
        }
      });
    },

    saveEditPersonal() {
      const personal = {
        firstname: this.firstname,
        lastname: this.lastname,
        role: this.roleSelect,
        _id: this.idPersonal
      };
      Meteor.call("updatePersonal", personal, (error, result) => {
        if (!error) {
          this.dialogEdit = false;
          this.snackbar = true;
          this.snackbarMessage = `[Personal Actualizado]:  ${
            personal.firstname
          } ${personal.lastname}`;
          this.clear();
        }
      });
    },
    closeDialogEdit() {
      this.dialogEdit = false;
      this.clear();
    },
    editPersonal(personal) {
      this.dialogEdit = true;
      this.firstname = personal.firstname;
      this.lastname = personal.lastname;
      this.roleSelect = personal.role;
      this.idPersonal = personal._id;
    },
    removePersonal() {
      const { firstname, lastname } = this.personalToRemove;
      Meteor.call("removePersonal", this.personalToRemove, (error, id) => {
        if (!error) {
          this.dialogPrevent = false
          this.snackbar = true;
          this.snackbarMessage = `[Personal Removido]:  ${firstname} ${lastname}`;
          this.personalToRemove = {};
          this.preventMessage= ""
        }
      });
    },
    showFormPersonal() {
      this.toggleBtnPersonal = !this.toggleBtnPersonal;
    },
    savePersonal() {
      if (this.firstname && this.lastname && this.roleSelect) {
        const personal = {
          firstname: this.firstname,
          lastname: this.lastname,
          role: this.roleSelect
        };
        Meteor.call("createPersonal", personal, (error, id) => {
          if (!error) {
            this.clear();
            this.snackbar = true;
            this.snackbarMessage = `[Personal Creado]:  ${personal.firstname} ${
              personal.lastname
            }`;
          }
        });
      } else {
        this.snackbar = true;
        this.snackbarMessage = `Completar todos los campos`;
      }
    },
    clear() {
      this.firstname = "";
      this.lastname = "";
      this.roleSelect = null;
      this.idPersonal = null;
    }
  }
};
</script>

<style>
</style>
