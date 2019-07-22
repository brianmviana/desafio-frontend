<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="primary">
            <b-navbar-brand>TODO LIST</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template slot="button-content"><em>{{usuario.email}}</em></template>
                        <b-dropdown-item v-on:click="logout">Logout</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <b-container>
            <b-navbar variant="faded" type="light">
                <b-navbar-nav>
<!--                    <b-nav-form>-->
<!--                        <b-form-input size="sm" class="mr-sm-2" placeholder="Titulo"></b-form-input>-->
<!--                        <b-button size="sm" class="my-2 my-sm-0" >Buscar</b-button>-->
<!--                    </b-nav-form>-->
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown text="Prioridade" right>
                        <b-dropdown-item v-on:click="filtroStatus('prioridade','todos')">Todas</b-dropdown-item>
                        <b-dropdown-item v-on:click="filtroStatus('prioridade','Baixa')">Baixa</b-dropdown-item>
                        <b-dropdown-item v-on:click="filtroStatus('prioridade','Media')">Média</b-dropdown-item>
                        <b-dropdown-item v-on:click="filtroStatus('prioridade','Alta')">Alta</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown text="Status" right>
                        <b-dropdown-item v-on:click="filtroStatus('status','todos')">Todos</b-dropdown-item>
                        <b-dropdown-item v-on:click="filtroStatus('status','aberto')">Aberto</b-dropdown-item>
                        <b-dropdown-item v-on:click="filtroStatus('status','concluido')">Concluído</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-navbar>
            <b-row>
                <b-col>
                    <table class="table table-hover table-sm">
                        <thead>
                        <tr>
                            <th scope="col" colspan="1">#</th>
                            <th scope="col" colspan="1">Titulo</th>
                            <th scope="col" colspan="1">Prioridade</th>
                            <th scope="col" colspan="2">Descrição</th>
                            <th scope="col" colspan="1">Status</th>
                            <th scope="col" colspan="1" class="text-right">
                                <b-button v-b-modal.modal-add-item variant="primary">+</b-button>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in items">
                            <th scope="row"></th>
                            <td> {{item.titulo}}</td>
                            <td> {{item.prioridade}}</td>
                            <td colspan="2"> {{item.descricao}}</td>
                            <td> {{item.status}}</td>
                            <td class="text-right">
                                <b-button :variant="item.status != 'concluido' ? 'success' : 'warning'" @click.stop="
                                    if(item.status == 'aberto'){
                                        item.status = 'concluido'
                                    }else{
                                        item.status = 'aberto'
                                    }
                                    updateItemStatus(item);
                                ">{{item.status == 'concluido' ? 'Deixar em aberto' : 'Concluir'}}</b-button>

                                <b-button v-b-modal.modal-editar variant="info" @click.stop="editarItem(item.key)">Editar</b-button>

                                <b-button variant="danger" @click.stop="deleteItem(item.key)">Remover</b-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </b-col>
            </b-row>

<!-- Modal de Cadastro do item -->
            <b-modal
                    id="modal-add-item"
                    ref="modal_add_item"
                    title="Novo item"
                    @show="resetModalItem"
                    @hidden="resetModalItem"
                    @ok="handleOk"
            >
                <form ref="form_add_item" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                            :state="itemtitulostate"
                            label="Titulo"
                            label-for="title-input"
                            invalid-feedback="Titulo não preenchido"
                    >
                        <b-form-input
                                id="title-input"
                                v-model="itemtitulo"
                                :state="itemtitulostate"
                                required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                            :state="itemdescricaostate"
                            label="Descrição"
                            label-for="descricao-input"
                            invalid-feedback="Descrição não preenchido"
                    >
                        <b-form-input
                                id="descricao-input"
                                v-model="itemdescricao"
                                :state="itemdescricaostate"
                                required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                            :state="prioridadestate"
                            label="Prioridade"
                            label-for="prioridade-input"
                            invalid-feedback="Prioridade não preenchido"
                    >
                        <b-form-select v-model="selected" :options="options" :state="prioridadestate" size="sm" class="mt-3"></b-form-select>
                    </b-form-group>
                </form>
            </b-modal>

            <!-- Modal de Update do item -->
            <b-modal
                    id="modal-editar"
                    ref="modal_editar"
                    title="Editar item"
                    @show="resetModalItem"
                    @hidden="resetModalItem"
                    @ok="handleUpdate"
            >
                <form ref="form_add_item" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                            :state="itemtitulostateEdit"
                            label="Titulo"
                            label-for="title-input"
                            invalid-feedback="Titulo não preenchido"
                    >
                        <b-form-input
                                id="title-input"
                                v-model="itemtituloEdit"
                                :state="itemtitulostateEdit"
                                required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                            :state="itemdescricaostate"
                            label="Descrição"
                            label-for="descricao-input"
                            invalid-feedback="Descrição não preenchido"
                    >
                        <b-form-input
                                id="descricao-input"
                                v-model="itemdescricaoEdit"
                                :state="itemdescricaostateEdit"
                                required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                            :state="prioridadestateEdit"
                            label="Prioridade"
                            label-for="prioridade-input"
                            invalid-feedback="Prioridade não preenchido"
                    >
                        <b-form-select v-model="selectedEdit" :options="options" :state="prioridadestateEdit" size="sm" class="mt-3"></b-form-select>
                    </b-form-group>
                </form>
            </b-modal>

        </b-container>
    </div>

</template>

<script>
    import { fb } from '../main';
    export default {
        name: "Home",
        data() {
            return {
                items:[],
                itemLista:{},
                itemtitulo:'',
                itemdescricao:'',
                selected:null,
                itemtitulostate:null,
                itemdescricaostate:null,
                prioridadestate:null,

                itemtituloEdit:'',
                itemdescricaoEdit:'',
                selectedEdit:null,
                itemtitulostateEdit:null,
                itemdescricaostateEdit:null,
                prioridadestateEdit:null,
                itemEdit:{},

                options: [
                    { value: null, text: 'Por favor selecione uma opção' },
                    { value: 'Baixa', text: 'Baixa' },
                    { value: 'Media', text: 'Media' },
                    { value: 'Alta', text: 'Alta' },
                ],
                ref: fb.firestore().collection('items'),
                usuario: fb.auth().currentUser
            }
        },
        created () {
            this.ref.onSnapshot((querySnapshot) => {
                this.items = [];
                querySnapshot.forEach((doc) => {
                    if(this.usuario.email == doc.data().usuario){
                        this.items.push({
                            key: doc.id,
                            'titulo': doc.data().titulo,
                            'descricao': doc.data().descricao,
                            'prioridade': doc.data().prioridade,
                            'posicao': doc.data().posicao,
                            'status': doc.data().status,
                            'usuario': doc.data().usuario
                        });
                    }
                });
            });
        },
        methods: {

            checkFormValidity() {
                const valid = this.$refs.form_add_item.checkValidity();
                this.itemtitulostate = valid ? 'valid' : 'invalid';
                this.itemdescricaostate = valid ? 'valid' : 'invalid';
                this.prioridadestate = valid ? 'valid' : 'invalid';
                return valid
            },

            resetModalItem() {
                this.itemtitulo = '';
                this.itemdescricao = '';
                this.selected = null;
                this.itemtitulostate=null;
                this.itemdescricaostate=null;
                this.prioridadestate=null;
            },
            resetModalEdit(){
                this.itemtituloEdit='';
                this.itemdescricaoEdit='';
                this.selectedEdit=null;
                this.itemtitulostateEdit=null;
                this.itemdescricaostateEdit=null;
                this.prioridadestateEdit=null;
                this.itemEdit={};
            },

            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault();
                // Trigger submit handler
                this.handleSubmit();
            },


            handleSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }
                this.itemLista={
                    'titulo': this.itemtitulo,
                    'descricao':this.itemdescricao,
                    'prioridade' : this.selected,
                    'posicao': (this.items.length + 1),
                    'status': 'aberto',
                    'usuario': this.usuario.email
                };
                this.ref.add(this.itemLista).then((docRef) => {
                    this.resetModalItem();
                })
                .catch((error) => {
                    alert("Error adding document: ", error);
                });

                // Hide the modal manually
                this.$nextTick(() => {
                    this.$refs.modal_add_item.hide();
                })
            },

            logout: function() {
                fb.auth().signOut().then(() => {
                    this.$router.replace('login')
                })
            },

            deleteItem (id) {
                fb.firestore().collection('items').doc(id).delete().then(() => {
                    //ação ao deletar item
                }).catch((error) => {
                    alert("Error removing document: ", error);
                });
            },

            editarItem(id){
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if(item.key == id){
                        this.itemEdit = item;
                        this.itemtituloEdit = item.titulo;
                        this.itemdescricaoEdit = item.descricao;
                        this.selectedEdit = item.prioridade;
                        this.itemtitulostateEdit = item.titulo;
                        this.itemdescricaostateEdit = item.descricao;
                        this.prioridadestateEdit = item.prioridade;
                    }
                }
            },

            handleUpdate(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault();
                // Trigger submit handler
                this.updateItem();
            },
            updateItem(){
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }
                this.itemEdit.titulo= this.itemtituloEdit;
                this.itemEdit.descricao = this.itemdescricaoEdit;
                this.itemEdit.prioridade = this.selectedEdit;

                const updateRef = fb.firestore().collection('items').doc(this.itemEdit.key);
                updateRef.set(this.itemEdit).then((docRef) => {
                    this.resetModalEdit();
                })
                .catch((error) => {
                    alert("Error adding document: ", error);
                });

                // Hide the modal manually
                this.$nextTick(() => {
                    this.$refs.modal_editar.hide();
                })
            },

            updateItemStatus(item){
                const updateRef = fb.firestore().collection('items').doc(item.key);
                updateRef.set(item).then((docRef) => {
                   //ação update
                })
                .catch((error) => {
                    alert("Error adding document: ", error);
                });
            },

            filtroStatus(filtro, valor){
                let listaFiltrada = [];
                this.ref.onSnapshot((querySnapshot) => {
                    this.items = [];
                    querySnapshot.forEach((doc) => {
                        if(this.usuario.email == doc.data().usuario){
                            this.items.push({
                                key: doc.id,
                                'titulo': doc.data().titulo,
                                'descricao': doc.data().descricao,
                                'prioridade': doc.data().prioridade,
                                'posicao': doc.data().posicao,
                                'status': doc.data().status,
                                'usuario': doc.data().usuario
                            });
                        }
                    });
                    if(valor != 'todos'){
                        for (let i = 0; i < this.items.length; i++) {
                            let item = this.items[i];
                            if(filtro == 'status'){
                                if(item.status == valor){
                                    listaFiltrada.push(item);
                                }
                            }
                            if(filtro == 'prioridade'){
                                if(item.prioridade == valor){
                                    listaFiltrada.push(item);
                                }
                            }
                        }
                        this.items = listaFiltrada;
                    }
                });
            }

        }
    }
</script>

<style scoped>

</style>
