<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="primary">
            <b-navbar-brand href="#">TODO LIST</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>


                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">



                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template slot="button-content"><em>User</em></template>
                        <b-dropdown-item >Logout</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <b-container>

<!--            <b-row>-->
<!--                <b-col>-->
<!--                    <table class="table table-sm">-->
<!--                        <thead>-->
<!--                        <tr>-->
<!--                            <th scope="col" colspan="1">#</th>-->
<!--                            <th scope="col" colspan="1">Titulo</th>-->
<!--                            <th scope="col" colspan="1">Prioridade</th>-->
<!--                            <th scope="col" colspan="2">Descrição</th>-->
<!--                            <th scope="col" colspan="1" class="text-right">-->
<!--                                <b-button v-b-modal.modal-add-item variant="primary">+</b-button>-->
<!--                            </th>-->
<!--                        </tr>-->
<!--                        </thead>-->
<!--                        <tbody>-->
<!--                        <tr v-for="item in items">-->
<!--                            <th scope="row">{{item.pos}}</th>-->
<!--                            <td> {{item.titulo}}</td>-->
<!--                            <td> {{item.prioridade}}</td>-->
<!--                            <td colspan="2"> {{item.descricao}}</td>-->
<!--                            <td class="text-right">-->
<!--                                <b-button v-b-modal.modal-2 variant="warning">=</b-button>-->

<!--                                <b-button v-b-modal.modal-2 variant="danger">X</b-button>-->
<!--                            </td>-->
<!--                        </tr>-->
<!--                        </tbody>-->
<!--                    </table>-->
<!--                </b-col>-->
<!--            </b-row>-->
<!--            <b-modal-->
<!--                    id="modal-add-item"-->
<!--                    ref="modal_add_item"-->
<!--                    title="Novo item"-->
<!--                    @show="resetModal"-->
<!--                    @hidden="resetModal"-->
<!--                    @ok="handleOk"-->
<!--            >-->
<!--                <form ref="form_add_item" @submit.stop.prevent="handleSubmit">-->
<!--                    <b-form-group-->
<!--                            :state="nameState"-->
<!--                            label="Name"-->
<!--                            label-for="name-input"-->
<!--                            invalid-feedback="Name is required"-->
<!--                    >-->
<!--                        <b-form-input-->
<!--                                id="name-input"-->
<!--                                v-model="name"-->
<!--                                :state="nameState"-->
<!--                                required-->
<!--                        ></b-form-input>-->
<!--                    </b-form-group>-->
<!--                </form>-->
<!--            </b-modal>-->

            <div>
                <button class="button logout" v-on:click="logout">Logout</button>
                <article class="covers" v-for="(comic, idx) in comics" :key="idx">
                    <div>
                        <img style="margin: 10px" :src="comic.image" height="291px" width="192px">
                        <p >{{ comic.name }}</p>
                        <hr>
                        <button class="button" @click="deleteComic(comic.id)">
                            Delete
                        </button>
                    </div>
                </article>

                <form @submit="addComic(name, image)">
                    <h2>Add a New Comic Cover</h2>
                    <input v-model="name" placeholder="Comic Name" class="input" required>
                    <input v-model="image" placeholder="Comic Image URL" class="input" required>
                    <button type="submit" class="button">Add New Comic</button>
                </form>
            </div>


        </b-container>
    </div>

</template>

<script>
    import firebase from 'firebase'
    import { db } from '../main'
    export default {
        name: "Home",
        data() {
            return {
                // items: [
                //     { titulo: 'titulo teste', descricao: 'Dickerson', prioridade: 'Macdonald',pos:'1'},
                //     { titulo: 'titulo teste', descricao: 'Larsen', prioridade: 'Shaw',pos:2},
                //     { titulo: 'titulo teste', descricao:'Geneva', prioridade: 'Wilson',pos:3},
                //     { titulo: 'titulo teste', descricao: 'Jami', prioridade: 'Carney',pos:4}
                // ],
                comics: [],
                name: '',
                image: ''
            }
        },
        firestore () {
            return {
                comics: db.collection('comics')
            }
        },
        methods: {
            linkClass(idx) {
                if (this.tabIndex === idx) {
                    return ['bg-primary', 'text-light']
                } else {
                    return ['bg-light', 'text-info']
                }
            },
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('login')
                })
            },
            addComic (name, image) {
                const createdAt = new Date()
                db.collection('comics').add({ name, image, createdAt })
                // Clear values
                this.name = ''
                this.image = ''
            },
            deleteComic (id) {
                db.collection('comics').doc(id).delete()
            },
        }
    }
</script>

<style scoped>

</style>
