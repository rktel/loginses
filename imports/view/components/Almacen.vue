<template>
    <section>
        <h1>Almacen</h1>
        <v-btn block color="green" @click="showFormEquipment" v-if="toggleBtnEquipment">+ Equipo</v-btn>
        <v-btn block disabled>Total Equipos: {{equipments.length}}</v-btn>
        <template>
            <form ref="formEquipments" v-if="!toggleBtnEquipment" class="pa-4 my-2 elevation-1">
                <v-select :items="equipmentItems" v-model="equipmentSelect" label="Equipo" required></v-select>
                <v-text-field label="Serial" v-model="serial" required></v-text-field>
                <v-text-field label="Marca" v-model="brand" required></v-text-field>
                <v-text-field label="Modelo" v-model="model" required></v-text-field>
                <v-btn  small @click="clear">Limpiar</v-btn>
                <v-btn @click="toggleBtnEquipment=!toggleBtnEquipment" small>Cerrar</v-btn>
                <v-btn color="green" small @click="createEquipment">Crear</v-btn>
            </form>
        </template>
        <template>
            <v-data-table :headers="dataTableHeaders" :items="equipments" hide-actions  class="elevation-1" >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.type }}</td>
                    <td class="text-xs-right">{{ props.item.serial }}</td>
                    <td class="text-xs-right">{{ props.item.brand }}</td>
                    <td class="text-xs-right">{{ props.item.model }}</td>
                    <td class="text-xs-right">
                        <v-btn flat icon color="green" @click="editEquipment(props.item)">
                            <v-icon>border_color</v-icon>
                        </v-btn>
                        <v-btn flat icon color="pink" @click="preventAction(props.item)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </td>
                </template>
            </v-data-table>
        </template>
        <template>
            <v-layout row justify-center>
                <v-dialog v-model="dialogEdit" persistent max-width="300">
                <v-card>
                    <v-card-title class="headline">Editar Equipo</v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12 sm6>
                                <v-select :items="equipmentItems" v-model="equipmentSelect" label="Equipo" required></v-select>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Serial" v-model="serial" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Marca" v-model="brand" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Modelo" v-model="model" required></v-text-field>
                            </v-flex>

                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="closeDialogEdit" small>Cerrar</v-btn>
                    <v-btn color="green" flat @click.native="saveEditEquipment" small>Guardar</v-btn>
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
                  <v-btn color="green" flat  @click="removeEquipment">
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
import { Equipments } from "../../api/collections.js";
import { mapState } from "vuex";
export default {
  name: "Almacen",
  computed: {
    ...mapState(["userProfile"])
  },
  data: () => ({
    idEquipment: null,
    equipmentItems: Meteor.settings.public.equipments,
    equipmentSelect: null,
    toggleBtnEquipment: true,
    serial: "",
    brand: "",
    model: "",
    snackbar: false,
    snackbarMessage: "",
    dataTableHeaders: [
      { text: "Equipo", sortable: false },
      { text: "Serial", sortable: false },
      { text: "Marca", sortable: false },
      { text: "Modelo", sortable: false },
      { text: "Editar/Remover", sortable: false }
    ],
    dialogEdit: false,
    dialogPrevent: false,
    preventMessage: "",
    equipmentToRemove: {}
  }),
  methods: {
    preventAction(equipment) {
      this.dialogPrevent = true;
      this.preventMessage = `[Eliminar Equipo]: ${equipment.serial} ${
        equipment.type
      }`;
      this.equipmentToRemove = equipment;
    },
    removeEquipment() {
      const { serial, type } = this.equipmentToRemove;
      Meteor.call("removeEquipment", this.equipmentToRemove, (error, id) => {
        if (!error) {
          this.dialogPrevent = false;
          this.snackbar = true;
          this.snackbarMessage = `[Equipo Removido]:  ${serial} ${type}`;
          this.equipmentToRemove = {};
          this.preventMessage = "";
        }
      });
    },
    closeDialogEdit() {
      this.dialogEdit = false;
      this.clear();
    },
    editEquipment(equipment) {
      this.dialogEdit = true;
      this.equipmentSelect = equipment.type;
      this.serial = equipment.serial;
      this.brand = equipment.brand;
      this.model = equipment.model;
      this.idEquipment = equipment._id;
    },
    saveEditEquipment() {
      const equipment = {
        type: this.equipmentSelect,
        serial: this.serial,
        brand: this.brand,
        model: this.model,
        _id: this.idEquipment,
        updatedBy: this.userProfile.firstname + " " + this.userProfile.lastname
      };
      Meteor.call("updateEquipment", equipment, (error, result) => {
        if (!error) {
          this.dialogEdit = false;
          this.snackbar = true;
          this.snackbarMessage = `[Equipo Actualizado]:  ${equipment.type} ${
            equipment.serial
          }`;
          this.clear();
        }
      });
    },
    createEquipment() {
      if (this.equipmentSelect && this.serial && this.brand && this.model) {
        const equipment = {
          type: this.equipmentSelect,
          serial: this.serial,
          brand: this.brand,
          model: this.model,
          registeredBy:
            this.userProfile.firstname + " " + this.userProfile.lastname
        };
        Meteor.call("createEquipment", equipment, (error, result) => {
          if (!error) {
            this.snackbar = true;
            this.snackbarMessage = `[Equipo creado]:  ${equipment.type} ${
              equipment.serial
            }`;
            this.clear();
          }
        });
      } else {
        this.snackbar = true;
        this.snackbarMessage = `Completar todos los campos`;
      }
    },
    showFormEquipment() {
      this.toggleBtnEquipment = !this.toggleBtnEquipment;
    },
    clear() {
      this.serial = "";
      this.brand = "";
      this.model = "";
      this.equipmentSelect = null;
      this.idEquipment = null;
    }
  },
  meteor: {
    $subscribe: {
      equipments: []
    },
    equipments() {
      return Equipments.find({});
    }
  }
};
</script>

<style>
</style>
